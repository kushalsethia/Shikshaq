-- Shikshaq: the HOD desk shows the WHOLE question, not one lone part (21 Nov 2026).
-- Paste this whole file into the Supabase SQL editor and press Run. Then send me a picture of the 5 lines at the
-- bottom (all five should say "ok").
--
-- Owner, 20 Nov 2026: "when a question has been sent to the HOD, they should be able to see the full parts and everything
-- ... if I just see 34 part 1 part 2, it doesn't make sense."
--
-- WHAT IT DOES: adds ONE read-only function, hod_question_context(question id). Given any question, it returns the
-- whole question that part belongs to: the stem (the shared lead-in) and every part, in paper order, saying which one
-- is the part the HOD was sent. The Needs you cards and the Send to AI cards on the HOD desk use it to show "the whole
-- question" with that part highlighted.
-- It works the same way for both kinds of paper: new papers (parts are linked to their parent) and live Maths copies
-- (parts are grouped by their id ending _CTX, _Q1, _Q2).
-- WHAT STAYS THE SAME: nothing is written, changed or deleted anywhere. No question text is touched. Only an HOD or an
-- admin can call it (checked inside, as for every other HOD function). Students cannot.
--
-- ALSO IN THIS FILE (found while rehearsing, 20 Nov night, read-only on the live data): 137 of the 259 groups of open
-- parts have their shared lead-in ("Fill in each blank...", "With reference to this, answer...") stored as a row of kind
-- section_instruction, and the student checker's own whole-question function (checker_question_context) skips every row
-- that is not a plain question. So a checker or an HOD saw "34 part 1, part 2" with the lead-in missing. Both functions now
-- ALWAYS return the top row of the group, whatever its kind; every other row is still limited to real questions. Nothing
-- else about the checker function changes (same checks, same grants, same columns). Still read-only; no text is touched.
--
-- ROLLBACK: drop function public.hod_question_context(uuid);  (nothing else depends on it except the new card block,
-- which then quietly shows nothing.) The checker function's old text is the one in migrations 20260928160000 and
-- 20261011180000 (the only difference is the one condition "or aq.id = v_root" in its first query).

begin;

create or replace function public.hod_question_context(p_question_id uuid)
returns table (
  id uuid,
  ord integer,
  display_number text,
  number_path text,
  body text,
  options jsonb,
  is_current boolean,
  is_parent boolean,
  depth integer,
  passed boolean,
  set_aside boolean
)
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
#variable_conflict use_column
declare
  v_q public.audit_questions;
  v_root uuid;
  v_has_children boolean;
  v_group text;
begin
  if not public.is_hod() then
    raise exception 'Only HODs and admins can use this.' using errcode = '42501';
  end if;

  select * into v_q from public.audit_questions a where a.id = p_question_id;
  if not found then
    raise exception 'That question was not found.' using errcode = 'P0002';
  end if;

  select exists (
    select 1 from public.audit_questions c
    where c.parent_id = v_q.id and c.kind = 'question'
  ) into v_has_children;

  -- New papers: a real hierarchy. Walk up to the top question (bounded, same paper only), then return it and all
  -- of its parts.
  if v_q.parent_id is not null or v_has_children then
    with recursive up as (
      select a.id, a.parent_id, 0 as lvl
      from public.audit_questions a
      where a.id = v_q.id
      union all
      select p.id, p.parent_id, up.lvl + 1
      from public.audit_questions p
      join up on p.id = up.parent_id
      where p.paper_id = v_q.paper_id and up.lvl < 10
    )
    select up.id into v_root from up order by up.lvl desc limit 1;

    return query
      with recursive down as (
        select a.id, 0 as lvl
        from public.audit_questions a
        where a.id = v_root
        union all
        select c.id, down.lvl + 1
        from public.audit_questions c
        join down on c.parent_id = down.id
        where c.paper_id = v_q.paper_id and down.lvl < 10
      )
      select aq.id, aq.ord, aq.display_number, aq.number_path, aq.body, aq.options,
             (aq.id = v_q.id) as is_current,
             (aq.id = v_root) as is_parent,
             down.lvl as depth,
             coalesce(aq.question_passed, false) as passed,
             (aq.set_aside_at is not null) as set_aside
      from down
      join public.audit_questions aq on aq.id = down.id
      where aq.paper_id = v_q.paper_id and (aq.kind = 'question' or aq.id = v_root)
      order by aq.ord;
    return;
  end if;

  -- Live Maths copies: flat rows grouped by '<group>_CTX' (the stem) and '<group>_Q1', '<group>_Q2', ...
  if v_q.live_bank_question_id ~ '_(CTX|Q[0-9]+)$' then
    v_group := regexp_replace(v_q.live_bank_question_id, '_(CTX|Q[0-9]+)$', '');

    return query
      select aq.id, aq.ord, aq.display_number, aq.number_path, aq.body, aq.options,
             (aq.id = v_q.id) as is_current,
             (aq.live_bank_question_id = v_group || '_CTX') as is_parent,
             case when aq.live_bank_question_id = v_group || '_CTX' then 0 else 1 end as depth,
             coalesce(aq.question_passed, false) as passed,
             (aq.set_aside_at is not null) as set_aside
      from public.audit_questions aq
      where aq.paper_id = v_q.paper_id
        and aq.kind = 'question'
        and left(aq.live_bank_question_id, length(v_group) + 1) = v_group || '_'
        and substr(aq.live_bank_question_id, length(v_group) + 2) ~ '^(CTX|Q[0-9]+)$'
      order by aq.ord;
    return;
  end if;

  -- A question that stands alone: an empty answer.
  return;
end;
$function$;

revoke all on function public.hod_question_context(uuid) from public, anon, authenticated;
grant execute on function public.hod_question_context(uuid) to authenticated;

-- The student checker's whole-question function: the same text as the live one, with ONE condition changed in the
-- first return query ("or aq.id = v_root", so the lead-in row is included).
create or replace function public.checker_question_context(p_question_id uuid)
returns table (
  id uuid,
  ord integer,
  display_number text,
  number_path text,
  body text,
  options jsonb,
  source jsonb,
  is_current boolean,
  is_parent boolean,
  depth integer
)
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_q public.audit_questions;
  v_root uuid;
  v_has_children boolean;
  v_group text;
begin
  -- Raises 42501 unless the caller is a paper checker holding this
  -- question's lease (or an admin), and the question is kid-routed.
  v_q := public.checker_authorize_question(p_question_id);

  select exists (
    select 1 from public.audit_questions c
    where c.parent_id = v_q.id and c.kind = 'question'
  ) into v_has_children;

  -- Shape 1: real hierarchy. Walk up to the top-level question (bounded
  -- depth, same paper only), then return it and all its descendants.
  if v_q.parent_id is not null or v_has_children then
    with recursive up as (
      select a.id, a.parent_id, 0 as lvl
      from public.audit_questions a
      where a.id = v_q.id
      union all
      select p.id, p.parent_id, up.lvl + 1
      from public.audit_questions p
      join up on p.id = up.parent_id
      where p.paper_id = v_q.paper_id and up.lvl < 10
    )
    select up.id into v_root from up order by up.lvl desc limit 1;

    return query
      with recursive down as (
        select a.id, 0 as lvl
        from public.audit_questions a
        where a.id = v_root
        union all
        select c.id, down.lvl + 1
        from public.audit_questions c
        join down on c.parent_id = down.id
        where c.paper_id = v_q.paper_id and down.lvl < 10
      )
      select aq.id, aq.ord, aq.display_number, aq.number_path, aq.body,
             aq.options, (aq.source - 'snippet_path'),
             (aq.id = v_q.id) as is_current,
             (aq.id = v_root) as is_parent,
             down.lvl as depth
      from down
      join public.audit_questions aq on aq.id = down.id
      where aq.paper_id = v_q.paper_id and (aq.kind = 'question' or aq.id = v_root)
      order by aq.ord;
    return;
  end if;

  -- Shape 2: flat live_copy rows grouped by live_bank_question_id
  -- '<group>_CTX' / '<group>_Q<n>'.
  if v_q.live_bank_question_id ~ '_(CTX|Q[0-9]+)$' then
    v_group := regexp_replace(v_q.live_bank_question_id, '_(CTX|Q[0-9]+)$', '');

    return query
      select aq.id, aq.ord, aq.display_number, aq.number_path, aq.body,
             aq.options, (aq.source - 'snippet_path'),
             (aq.id = v_q.id) as is_current,
             (aq.live_bank_question_id = v_group || '_CTX') as is_parent,
             case when aq.live_bank_question_id = v_group || '_CTX' then 0 else 1 end as depth
      from public.audit_questions aq
      where aq.paper_id = v_q.paper_id
        and aq.kind = 'question'
        -- Prefix compare, not a regex built from v_group, so a group id
        -- containing regex metacharacters can never widen the match.
        and left(aq.live_bank_question_id, length(v_group) + 1) = v_group || '_'
        and substr(aq.live_bank_question_id, length(v_group) + 2) ~ '^(CTX|Q[0-9]+)$'
      order by aq.ord;
    return;
  end if;

  -- Not part of a larger question: empty result.
  return;
end;
$function$;

revoke all on function public.checker_question_context(uuid) from public, anon, authenticated;
grant execute on function public.checker_question_context(uuid) to authenticated;

commit;

-- Check it: five lines, each should say ok.
select 'the new function exists' as check_line,
       case when to_regprocedure('public.hod_question_context(uuid)') is not null then 'ok' else 'WRONG' end as result
union all
select 'logged-out visitors cannot run it',
       case when not has_function_privilege('anon', 'public.hod_question_context(uuid)', 'execute') then 'ok' else 'WRONG' end
union all
select 'signed-in people can run it (it checks HOD inside)',
       case when has_function_privilege('authenticated', 'public.hod_question_context(uuid)', 'execute') then 'ok' else 'WRONG' end
union all
select 'it runs with a fixed search path',
       case when exists (select 1 from pg_proc p where p.oid = 'public.hod_question_context(uuid)'::regprocedure and p.prosecdef and p.proconfig::text like '%search_path%') then 'ok' else 'WRONG' end
union all
select 'the checker whole-question function now includes the lead-in',
       case when pg_get_functiondef('public.checker_question_context(uuid)'::regprocedure) like '%or aq.id = v_root)%' then 'ok' else 'WRONG' end;
