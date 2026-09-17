-- Phase 5: quota machinery, shipped SWITCHED OFF.
--
-- This is the one part of the plan that cannot be finished before launch, and
-- the reason is worth stating rather than hiding in a default value.
--
-- There are 3 rows of read telemetry in this database today and ~50 accounts
-- active in the last 90 days. Every threshold below is a guess about what a
-- real student does. Ship a guess as an enforced limit and the first person it
-- stops is a Class 10 student working through past papers the week before
-- boards -- the exact person this product exists for, doing the exact thing it
-- is for. That is a worse outcome than the scraping it prevents.
--
-- So: the checks are installed and the thresholds are configurable, but
-- `enforcing` defaults to FALSE. Reads are counted (20260917120000) and
-- over-limit reads are recorded, and nothing is refused. After two to four
-- weeks of real traffic, read the p99 out of read_events, set the numbers
-- above it, and flip one boolean. No migration required to turn it on.
--
--   update public.read_quota_config set enforcing = true;
--
-- Calibrate, do not trust, these starting values.

begin;

-- ---------------------------------------------------------------------------
-- Configuration: one row, edited in place
-- ---------------------------------------------------------------------------
create table if not exists public.read_quota_config (
  id                 boolean primary key default true check (id),
  enforcing          boolean not null default false,
  papers_per_hour    integer not null default 20,
  papers_per_day     integer not null default 40,
  papers_first_24h   integer not null default 15,
  contacts_per_day   integer not null default 5,
  contacts_per_week  integer not null default 15,
  contacts_lifetime  integer not null default 30,
  updated_at         timestamptz not null default now()
);

insert into public.read_quota_config (id) values (true) on conflict (id) do nothing;

alter table public.read_quota_config enable row level security;
revoke all on public.read_quota_config from public, anon, authenticated;

comment on table public.read_quota_config is
  'Single-row quota settings. enforcing=false means count but never refuse. Flip it on only after read_events shows what a real reader looks like.';

-- ---------------------------------------------------------------------------
-- Exemptions
-- ---------------------------------------------------------------------------
-- A separate table rather than a column on profiles, so granting an exemption
-- never touches the row that carries someone's role.
--
-- This exists because the cost of a false positive is not symmetrical. A
-- scraper who gets through is a bad day; a real student locked out with no way
-- back in is someone who does not return. Support needs to be able to fix it
-- in one statement.
create table if not exists public.read_quota_exempt (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  reason     text,
  created_at timestamptz not null default now()
);

alter table public.read_quota_exempt enable row level security;
revoke all on public.read_quota_exempt from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- The check
-- ---------------------------------------------------------------------------
-- Returns the name of the limit that was exceeded, or null when within limits.
-- Callers decide what to do with that, which is what keeps soft-fail and
-- enforcement the same code path.
create or replace function public.read_quota_exceeded(p_uid uuid, p_kind text)
returns text
language plpgsql
stable
security definer
set search_path to 'public'
as $function$
declare
  c public.read_quota_config%rowtype;
  v_account_age interval;
  n integer;
begin
  if p_uid is null then return null; end if;
  if exists (select 1 from public.read_quota_exempt e where e.user_id = p_uid) then
    return null;
  end if;

  select * into c from public.read_quota_config where id;
  if not found then return null; end if;

  if p_kind = 'paper' then
    select now() - u.created_at into v_account_age from auth.users u where u.id = p_uid;

    -- A day-old account working through the library is the clearest scraper
    -- signature available, and the cheapest to act on.
    if v_account_age < interval '24 hours' then
      select count(*) into n from public.read_events
        where user_id = p_uid and kind = 'paper';
      if n >= c.papers_first_24h then return 'papers_first_24h'; end if;
    end if;

    select count(*) into n from public.read_events
      where user_id = p_uid and kind = 'paper' and created_at > now() - interval '1 hour';
    if n >= c.papers_per_hour then return 'papers_per_hour'; end if;

    select count(*) into n from public.read_events
      where user_id = p_uid and kind = 'paper' and created_at > now() - interval '24 hours';
    if n >= c.papers_per_day then return 'papers_per_day'; end if;

  elsif p_kind = 'contact' then
    -- Contacts are scarcer than papers by design. A parent shortlists three or
    -- four tutors; nobody legitimately reveals thirty numbers.
    select count(*) into n from public.read_events
      where user_id = p_uid and kind = 'contact' and created_at > now() - interval '24 hours';
    if n >= c.contacts_per_day then return 'contacts_per_day'; end if;

    select count(*) into n from public.read_events
      where user_id = p_uid and kind = 'contact' and created_at > now() - interval '7 days';
    if n >= c.contacts_per_week then return 'contacts_per_week'; end if;

    select count(*) into n from public.read_events
      where user_id = p_uid and kind = 'contact';
    if n >= c.contacts_lifetime then return 'contacts_lifetime'; end if;
  end if;

  return null;
end;
$function$;

revoke all on function public.read_quota_exceeded(uuid, text) from public;

-- ---------------------------------------------------------------------------
-- Breaches, recorded whether or not they are enforced
-- ---------------------------------------------------------------------------
-- This is what makes the soft-fail period useful rather than merely safe: it
-- answers "how many real users would these limits have stopped?" before anyone
-- is actually stopped by them.
create table if not exists public.read_quota_breaches (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete set null,
  kind       text not null,
  limit_hit  text not null,
  enforced   boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists read_quota_breaches_time on public.read_quota_breaches (created_at desc);
alter table public.read_quota_breaches enable row level security;
revoke all on public.read_quota_breaches from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Bot signals
-- ---------------------------------------------------------------------------
-- Volume-independent, so they catch a patient scraper that deliberately stays
-- under every cap. These describe the difference between a person and a
-- program rather than a quantity, which is also why they are harder to reason
-- around from the outside.
--
-- Scoring only. Nothing here blocks anyone; it produces a list to look at.
create or replace view public.read_suspicion as
with recent as (
  select user_id, kind, ip_hash, created_at
  from public.read_events
  where created_at > now() - interval '30 days'
),
-- People pause, get distracted, speed up. Scripts are metronomes, so a
-- near-zero spread in the gaps between reads is a strong signal. The window
-- has to run over the whole per-user series, which is why this is its own CTE
-- rather than a lateral: a lateral would compute lag against an arbitrary
-- single row and produce a number that looks fine and means nothing.
gaps as (
  select user_id,
         extract(epoch from (created_at - lag(created_at)
           over (partition by user_id order by created_at))) as gap_s
  from recent
),
gap_stats as (
  select user_id, stddev_samp(gap_s) as gap_stddev_s, count(*) as gap_n
  from gaps where gap_s is not null group by user_id
),
-- Ten papers inside two minutes is twelve seconds each: fetching, not reading.
bursts as (
  select e.user_id, max(w.n) as max_burst_2min
  from recent e
  join lateral (
    select count(*) as n from recent b
    where b.user_id = e.user_id and b.kind = 'paper'
      and b.created_at >= e.created_at
      and b.created_at <  e.created_at + interval '2 minutes'
  ) w on true
  where e.kind = 'paper'
  group by e.user_id
),
per_user as (
  select
    r.user_id,
    count(*) filter (where r.kind = 'paper')   as papers,
    count(*) filter (where r.kind = 'contact') as contacts,
    count(distinct r.ip_hash)                  as networks,
    min(r.created_at)                          as first_seen,
    max(r.created_at)                          as last_seen,
    coalesce(b.max_burst_2min, 0)              as max_burst_2min,
    g.gap_stddev_s
  from recent r
  left join bursts    b on b.user_id = r.user_id
  left join gap_stats g on g.user_id = r.user_id
  group by r.user_id, b.max_burst_2min, g.gap_stddev_s
)
select
  user_id, papers, contacts, networks, first_seen, last_seen,
  max_burst_2min, gap_stddev_s,
  (case when max_burst_2min >= 10 then 3 else 0 end)
  + (case when gap_stddev_s is not null and gap_stddev_s < 2 and papers >= 10 then 3 else 0 end)
  + (case when networks >= 3 then 2 else 0 end)
  + (case when papers >= 100 then 2 else 0 end)
  + (case when contacts >= 20 then 3 else 0 end)
    as score
from per_user
where papers > 0 or contacts > 0;

revoke all on public.read_suspicion from public, anon, authenticated;

comment on view public.read_suspicion is
  'Per-account bot signals over the last 30 days. Scoring only, never blocking. Review the top of this list before enabling enforcement.';

-- ---------------------------------------------------------------------------
-- Retention
-- ---------------------------------------------------------------------------
-- 90 days. Long enough to characterise a scraper, short enough that this is
-- not a permanent record of what individual students read -- many of whom are
-- minors. This has to be scheduled; see the runbook. pg_cron is NOT installed
-- on this project (checked), so either enable it or call this from any
-- scheduler, including by hand. It is idempotent.
create or replace function public.purge_read_events()
returns integer
language plpgsql
volatile
security definer
set search_path to 'public'
as $function$
declare
  n integer;
begin
  delete from public.read_events where created_at < now() - interval '90 days';
  get diagnostics n = row_count;
  delete from public.read_quota_breaches where created_at < now() - interval '90 days';
  return n;
end;
$function$;

revoke all on function public.purge_read_events() from public;

commit;

-- ===========================================================================
-- TURNING IT ON, once read_events has two to four weeks of real traffic
--
--   -- what does a real reader actually look like?
--   select
--     percentile_cont(0.50) within group (order by n) as p50,
--     percentile_cont(0.99) within group (order by n) as p99,
--     max(n) as max
--   from (
--     select user_id, date_trunc('day', created_at) d, count(*) n
--     from public.read_events where kind = 'paper' group by 1, 2
--   ) daily;
--
--   -- who would the current thresholds have stopped?
--   select limit_hit, count(distinct user_id) from public.read_quota_breaches
--   group by 1 order by 2 desc;
--
--   -- anyone obviously automated?
--   select * from public.read_suspicion order by score desc limit 20;
--
-- Then set the limits above the observed p99 and:
--   update public.read_quota_config set papers_per_day = <n>, enforcing = true;
-- ===========================================================================

-- ===========================================================================
-- ROLLBACK
--   update public.read_quota_config set enforcing = false;  -- first, always
--   drop view if exists public.read_suspicion;
--   drop function if exists public.read_quota_exceeded(uuid, text);
--   drop function if exists public.purge_read_events();
--   drop table if exists public.read_quota_breaches;
--   drop table if exists public.read_quota_exempt;
--   drop table if exists public.read_quota_config;
-- ===========================================================================
