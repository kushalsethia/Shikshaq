-- Phase 0a: close the bulk-read hole that a free account currently opens, and
-- start recording who reads what.
--
-- THE PROBLEM, verified by curl as a real caller before writing this:
--   GET /rest/v1/Shikshaqmine?select=Title,Link,"Phone Number"
--     -> all 148 teachers, both numbers, ONE request
--   GET /rest/v1/bank_questions?select=paper_id,number,body,marks
--     -> all 46,873 questions in ~47 paginated requests
-- No browser, no screenshots, no rate limit. Cost to an attacker: one email
-- address and about ninety seconds. September's work closed these for `anon`
-- and left `authenticated` wide open, on the reasonable-at-the-time assumption
-- that an account implied a real student.
--
-- WHAT THIS DOES NOT DO: stop a determined person collecting the same data one
-- request at a time. Revoking turns "1 request for 148 numbers" into "148
-- requests for 148 numbers". That is worth doing because it removes the bulk
-- primitive and forces every read through a function that can see auth.uid(),
-- but a chokepoint with no counter is a wasted chokepoint -- which is why
-- read_events ships here rather than in a later phase.
--
-- ROLLBACK is at the bottom of this file.

begin;

-- ---------------------------------------------------------------------------
-- 1. bank_questions: the RPC becomes the only read path
-- ---------------------------------------------------------------------------
-- Safe because it already is the only read path. src/lib/question-bank.ts:207
-- calls bank_paper_questions() and nothing in src/ selects the table directly
-- (verified by grep across the whole tree). bank_paper_questions is SECURITY
-- DEFINER, so it runs as the owner and is unaffected by this revoke.

revoke select on public.bank_questions from authenticated;

-- ---------------------------------------------------------------------------
-- 2. Shikshaqmine: contact columns leave the table grant
-- ---------------------------------------------------------------------------
-- Mirrors what 20260909000002 did for anon. "Email ID" is revoked here too,
-- which anon never had -- 148 teachers' email addresses should not be readable
-- by every account either.
--
-- ⚠ THIS BREAKS TWO CLIENT CALL SITES AND THEY MUST SHIP IN THE SAME DEPLOY.
-- Not with an error, which would be easy to spot, but SILENTLY: both use
-- .select('*'), and PostgREST expands `*` to the columns the role may read
-- rather than failing. So TeacherDashboard's phone field arrives undefined,
-- its own validation then refuses to save anything, and the teacher sees a
-- required-field error on a field they cannot see.
--   src/pages/TeacherDashboard.tsx:219  -> teacher_own_contact()
--   src/pages/admin/teachers.tsx:156    -> admin_teacher_contacts()
-- Both also filter updates with .eq('Email ID', ...), and Postgres needs
-- SELECT on a column used in a WHERE clause -- so those filters must move to
-- id before this is applied. See docs/SUPABASE_RUNBOOK.md.

revoke select on public."Shikshaqmine" from authenticated;
grant select (
  "Area", "Class Size (Group/ Solo)", "Classes Taught", "Classes Taught for Backend",
  "Description", "EXPANDED", "Featured", "Featured Subject", "Hero Image",
  "LOCATION V2", "MOU", "Max Fees", "Min Fees", "Mode of Teaching",
  "Place of Teaching", "Qualifications etc", "Review 1", "Review 2", "Review 3",
  "STUDENT'S HOME IN THESE AREAS", "School Boards Catered", "Sir/Ma'am?", "Slug",
  "Subjects", "TUTOR'S HOME IN THESE AREAS", "Title", "Video", "Video Link",
  "Years they started teaching", id, is_paused
) on public."Shikshaqmine" to authenticated;

-- UPDATE is a separate privilege and is deliberately untouched: teachers still
-- edit their own row under the existing "Teachers can update own data" policy,
-- and that policy's own reference to "Email ID" keeps working, because RLS
-- expressions are evaluated internally and do not require the caller to hold
-- column privileges on what they reference.

-- ---------------------------------------------------------------------------
-- 3. read_events: the telemetry that does not exist yet
-- ---------------------------------------------------------------------------
-- There are 3 rows of read telemetry across the entire product today, which is
-- why no quota in this plan has a defensible number attached to it. This is
-- recording only. Enforcement is 20260917120003, deliberately separate and
-- deliberately later, so the limits are set from observed behaviour instead of
-- from a guess that throttles a student revising before boards.

create table if not exists public.read_events (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete set null,
  kind        text not null check (kind in ('paper', 'contact')),
  target_id   text not null,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists read_events_user_time on public.read_events (user_id, created_at desc);
create index if not exists read_events_time      on public.read_events (created_at desc);
create index if not exists read_events_kind_time on public.read_events (kind, created_at desc);

alter table public.read_events enable row level security;

-- No policies and no grants, on purpose. Only the SECURITY DEFINER functions
-- below write here, and nothing reads it over REST at all -- it is queried from
-- the SQL editor and by the scoring job. A table with RLS enabled and zero
-- policies returns zero rows to every role, which is the correct default for
-- something that records reading behaviour, much of it by minors.
revoke all on public.read_events from public, anon, authenticated;
revoke all on sequence public.read_events_id_seq from public, anon, authenticated;

comment on table public.read_events is
  'One row per gated read (paper questions, teacher contact). Written only by SECURITY DEFINER functions; unreadable over REST. Retention: 90 days, see 20260917120003.';

-- ---------------------------------------------------------------------------
-- 4. The two paths that legitimately need the contact columns
-- ---------------------------------------------------------------------------

-- A teacher's own row. NO ARGUMENT, deliberately: keyed entirely on auth.uid(),
-- so it cannot be pointed at another teacher. The join mirrors the existing
-- "Teachers can view own data" policy exactly (profiles.email, case- and
-- whitespace-insensitive) rather than inventing a second definition of
-- "is this my row".
create or replace function public.teacher_own_contact()
returns table (id bigint, slug text, email_id text, phone_number text, link text)
language sql
stable
security definer
set search_path to 'public', 'extensions'
as $function$
  select s.id, s."Slug", s."Email ID", s."Phone Number", s."Link"
  from public."Shikshaqmine" s
  join public.profiles p
    on lower(trim(p.email)) = lower(trim(s."Email ID"))
  where p.id = (select auth.uid())
    and p.role = 'teacher'
    and s."Email ID" is not null
    and s."Email ID" <> ''
  limit 1;
$function$;

revoke all on function public.teacher_own_contact() from public;
grant execute on function public.teacher_own_contact() to authenticated;

comment on function public.teacher_own_contact() is
  'The signed-in teacher''s own contact columns. Takes no argument so it cannot be aimed at anyone else.';

-- Admin's view of every teacher's contact details. The in-body is_admin()
-- guard is the house pattern (20260818120000): revoking from PUBLIC stops REST
-- reaching it, and the guard means a future GRANT cannot silently reopen it.
create or replace function public.admin_teacher_contacts()
returns table (id bigint, slug text, email_id text, phone_number text, link text)
language plpgsql
stable
security definer
set search_path to 'public', 'extensions'
as $function$
begin
  if not public.is_admin() then
    raise exception 'admin_teacher_contacts: not authorised'
      using errcode = '42501';
  end if;

  return query
    select s.id, s."Slug", s."Email ID", s."Phone Number", s."Link"
    from public."Shikshaqmine" s;
end;
$function$;

revoke all on function public.admin_teacher_contacts() from public;
grant execute on function public.admin_teacher_contacts() to authenticated;

comment on function public.admin_teacher_contacts() is
  'Every teacher''s contact columns, for the admin console. Guarded in-body by is_admin() as well as by the grant.';

-- ---------------------------------------------------------------------------
-- 5. Recording, inside the two existing gates
-- ---------------------------------------------------------------------------
-- Both functions become volatile and plpgsql so they can insert. Their RETURN
-- shape and their gating behaviour are unchanged -- this migration adds a write
-- and nothing else. The free-preview size stays at 5 here and is changed on its
-- own in 20260917120001, so the two decisions stay separable.
--
-- ip_hash: request.headers is set by PostgREST per request. It is read
-- defensively (the `true` argument to current_setting means "missing is null,
-- not an error") because if it is ever absent the read should still be served
-- and still be attributed to the account, which is the threat that matters.
-- Hashed rather than stored raw: this is enough to spot one connection farming
-- accounts, without keeping a log of where students read from.

create or replace function public.bank_paper_questions(p_paper_id text)
returns table (
  id text, paper_id text, number text, body text, marks numeric,
  chapter text, qtype text, page integer, figure text, options text[]
)
language plpgsql
volatile
security definer
set search_path to 'public', 'extensions'
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is not null then
    insert into public.read_events (user_id, kind, target_id, ip_hash)
    values (
      v_uid,
      'paper',
      p_paper_id,
      encode(extensions.digest(coalesce(
        current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''
      ), 'sha256'), 'hex')
    );
  end if;

  return query
    select q.id, q.paper_id, q.number, q.body, q.marks, q.chapter,
           q.qtype, q.page, q.figure, q.options
    from public.bank_questions q
    join public.bank_papers p on p.id = q.paper_id
    where q.paper_id = p_paper_id
      and p.is_published
    order by q.ord
    limit case when v_uid is null then 5 else null end;
end;
$function$;

revoke all on function public.bank_paper_questions(text) from public;
grant execute on function public.bank_paper_questions(text) to anon, authenticated;

create or replace function public.teacher_whatsapp_link(p_slug text)
returns text
language plpgsql
volatile
security definer
set search_path to 'public', 'extensions'
as $function$
declare
  v_uid  uuid := auth.uid();
  v_link text;
begin
  if v_uid is null then
    return null;
  end if;

  select s."Link" into v_link
  from public."Shikshaqmine" s
  where s."Slug" = p_slug
  limit 1;

  insert into public.read_events (user_id, kind, target_id, ip_hash)
  values (
    v_uid,
    'contact',
    p_slug,
    encode(extensions.digest(coalesce(
      current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''
    ), 'sha256'), 'hex')
  );

  return v_link;
end;
$function$;

revoke all on function public.teacher_whatsapp_link(text) from public;
grant execute on function public.teacher_whatsapp_link(text) to anon, authenticated;

commit;

-- ===========================================================================
-- ROLLBACK
-- ===========================================================================
-- begin;
--   grant select on public.bank_questions   to authenticated;
--   grant select on public."Shikshaqmine"   to authenticated;
--   drop function if exists public.teacher_own_contact();
--   drop function if exists public.admin_teacher_contacts();
--   -- Restore the pre-logging definitions from
--   -- 20260909000001_bank_paper_questions_rpc.sql and
--   -- 20260909000002_gate_teacher_contact_columns.sql (both `language sql
--   -- stable`), then:
--   -- drop table public.read_events;   -- only if the recorded data is not wanted
-- commit;
