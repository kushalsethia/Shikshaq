-- My papers: show how many PAPERS a checker has finished, next to the question counts (20 Nov 2026).
--
-- Owner (20 Nov 2026), about the "Today 151 . Total 1496" pill on My papers: "it would be great if it also showed the number of
-- papers we have verified as our tasks are also given on number of papers so it will be easier to track otherwise its lowkey
-- confusing w just number of questions".
--
-- WHAT IT DOES: adds ONE new read-only function, checker_my_paper_stats(), that returns two numbers for the signed-in checker:
-- papers_today (India time) and papers_total. A paper counts once the checker's assignment on it is closed as "done"
-- (every question on it checked: the same moment it drops off My papers). The same paper handed to the same person twice is
-- counted once. Nothing is changed or deleted. checker_my_stats() (the question counts) is NOT touched, so the old screen keeps
-- working if this file is applied before or after the website change. If this file is not applied yet, the screen simply does not
-- show the papers pill.
-- WHO MAY RUN IT: only a signed-in paper checker (same check as checker_my_stats). Not the public, not logged-out visitors.
-- ROLLBACK: drop function public.checker_my_paper_stats();

create or replace function public.checker_my_paper_stats()
returns table (papers_today bigint, papers_total bigint)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_today timestamptz := date_trunc('day', now() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata';
begin
  if not public.is_paper_checker() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return query
    select
      (count(distinct a.audit_paper_id) filter (where a.closed_at >= v_today))::bigint as papers_today,
      count(distinct a.audit_paper_id)::bigint as papers_total
    from public.checker_assignments a
    where a.user_id = auth.uid()
      and a.status = 'done';
end;
$$;

revoke all on function public.checker_my_paper_stats() from public, anon, authenticated;
grant execute on function public.checker_my_paper_stats() to authenticated;
