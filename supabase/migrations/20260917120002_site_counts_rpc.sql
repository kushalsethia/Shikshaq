-- Phase 4a: one RPC instead of a full table scan on every page load.
--
-- THE PROBLEM: Footer.tsx renders on every route. It calls useSiteCounts,
-- which calls fetchBankSchoolValues() in src/lib/question-bank.ts, which pages
-- through ALL 1,282 rows of bank_papers -- two round trips and ~100KB -- to
-- compute one number: how many distinct schools there are. On the home page,
-- on every subject page, on /about, everywhere.
--
-- There is no head-count equivalent for a distinct count over REST, which is
-- why the client was doing it by hand. In SQL it is one cheap aggregate.
-- Two round trips and ~100KB become one round trip and about sixty bytes.
--
-- This is the single largest per-page-load saving available in the data layer,
-- and unlike the bundle work it costs a visitor nothing to adopt.
--
-- Deliberately STABLE and readable by anon: these three numbers are already
-- public (they are printed in the footer of every page) and the function
-- exposes no row data, only counts.

begin;

create or replace function public.site_counts()
returns table (teachers bigint, papers bigint, schools bigint)
language sql
stable
security definer
set search_path to 'public'
as $function$
  select
    (select count(*) from public.teachers_list),
    (select count(*) from public.bank_papers where is_published),
    (select count(distinct school) from public.bank_papers
      where is_published and school is not null and btrim(school) <> '');
$function$;

revoke all on function public.site_counts() from public;
grant execute on function public.site_counts() to anon, authenticated;

comment on function public.site_counts() is
  'Footer/about counts: teachers, published bank papers, distinct schools. Replaces a client-side scan of all bank_papers rows that ran on every page load.';

commit;

-- ===========================================================================
-- CLIENT CHANGE THAT PAIRS WITH THIS (see docs/SUPABASE_RUNBOOK.md)
--
-- src/hooks/useSiteCounts.ts: replace the three-part Promise.all with
--   const { data } = await supabase.rpc('site_counts').single();
-- and delete the fetchBankSchoolValues() call.
--
-- Safe to ship BEFORE this migration if written to fall back: if the rpc
-- errors with PGRST202 (function not found), use the existing path. Safe to
-- ship AFTER without a fallback. It is NOT safe to ship the no-fallback
-- version first -- the footer's counts would silently render as blanks.
--
-- fetchBankSchoolValues has two other callers (About.tsx, the live-papers
-- banner) which can move to this RPC in the same pass.
-- ===========================================================================

-- ===========================================================================
-- ROLLBACK
--   drop function if exists public.site_counts();
-- ===========================================================================
