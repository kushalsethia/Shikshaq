-- 20261003130000_admin_queue_library.sql
--
-- Backs the admin rework (PLAN_ROUND27 stage 2): the Admin queue page, the
-- Library's extra views and "why hidden", and one cheap call for the nav
-- badges. NOT applied by the frontend branch; it needs the owner's yes, like
-- every migration. Nothing here writes: all four functions are read-only.
--
--   admin_queue_papers()            one light row per paper that has questions
--                                   waiting for an admin (counts only)
--   admin_queue_questions(uuid)     that paper's waiting questions, in the
--                                   shape admin_paper_review rows use, plus the
--                                   page number and the stored picture paths
--   admin_library_extras()          per bank paper: why it is hidden, how many
--                                   questions wait with students and with an
--                                   admin, whether it waits in Ready to go live
--   admin_nav_counts()              the five nav badge numbers in one call
--
-- "Waiting for an admin" means: a question row whose review_bucket is 'admin',
-- that is neither passed nor set aside (approval_question_state = 'open').
-- Set-aside questions are decided, so they are not in the queue; if the
-- owner's 657 was counted including set-aside rows the page will show a few
-- fewer, and says so by showing the number it actually lists.
--
-- Security, like every admin_* function here: SECURITY DEFINER, search_path
-- public + pg_temp, is_admin() checked first (42501 otherwise), revoked from
-- PUBLIC, anon AND authenticated by name, then granted back to authenticated.
-- No question text reaches anyone but an admin; the picture paths are paths,
-- the pictures themselves still need the audit-figures storage policy.
--
-- Read cost: admin_queue_papers and admin_nav_counts are single aggregates;
-- admin_queue_questions is one paper at a time (a few dozen rows), which is
-- why the page opens a paper on demand instead of fetching all 657 bodies.
-- If audit_questions has no index covering (review_bucket) where it is open,
-- the aggregate scans the table; the suggested index is at the bottom,
-- commented out, for the owner to decide.

set local lock_timeout = '5s';

-- ---------------------------------------------------------------------------
-- 1. admin_queue_papers

create or replace function public.admin_queue_papers()
returns table(audit_paper_id uuid, title text, school text, waiting integer, is_live boolean)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
#variable_conflict use_column
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return query
    select ap.id,
           coalesce(nullif(btrim(ap.title), ''),
                    concat_ws(' ', coalesce(ap.publish_meta ->> 'board', ap.board),
                              'Class ' || coalesce(ap.publish_meta ->> 'cls', ap.class),
                              coalesce(ap.publish_meta ->> 'subject', ap.subject),
                              nullif(coalesce(ap.publish_meta ->> 'year', ap.year), 'year-unknown'))),
           coalesce(ap.publish_meta ->> 'school', ap.school),
           w.n::integer,
           coalesce(bp.is_published, false)
      from (
        select q.paper_id as pid, count(*) as n
          from public.audit_questions q
         where q.review_bucket = 'admin'
           and q.kind = 'question'
           and public.approval_question_state(q.kind, q.question_passed, q.set_aside_at) = 'open'
         group by q.paper_id
      ) w
      join public.audit_papers ap on ap.id = w.pid
      left join public.bank_papers bp on bp.id = ap.live_bank_paper_id
     order by w.n desc, ap.id;
end;
$function$;

-- ---------------------------------------------------------------------------
-- 2. admin_queue_questions

create or replace function public.admin_queue_questions(p_audit_paper_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
declare
  v jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'id', q.id,
           'ord', q.ord,
           'kind', q.kind,
           'parent_id', q.parent_id,
           'number_path', q.number_path,
           'display_number', q.display_number,
           'instructions', q.instructions,
           'body', q.body,
           'options', q.options,
           'marks', q.marks,
           'figure_path', q.figure ->> 'path',
           'state', 'open',
           'version', q.version,
           'flag_reasons', to_jsonb(q.flag_reasons),
           'review_bucket', q.review_bucket,
           'live_bank_question_id', q.live_bank_question_id,
           'page', case when (q.source ->> 'page') ~ '^[0-9]{1,6}$' then (q.source ->> 'page')::integer end,
           'page_path', pg.object_path,
           'snippet_path', nullif(q.source ->> 'snippet_object', '')
         ) order by q.ord, q.id), '[]'::jsonb)
    into v
  from public.audit_questions q
  left join public.audit_paper_pages pg
         on pg.audit_paper_id = q.paper_id
        and (q.source ->> 'page') ~ '^[0-9]{1,6}$'
        and pg.page = (q.source ->> 'page')::integer
  where q.paper_id = p_audit_paper_id
    and q.review_bucket = 'admin'
    and q.kind = 'question'
    and public.approval_question_state(q.kind, q.question_passed, q.set_aside_at) = 'open';

  return v;
end;
$function$;

-- ---------------------------------------------------------------------------
-- 3. admin_library_extras

create or replace function public.admin_library_extras()
returns table(paper_id text, hidden_reason text, hidden_at timestamptz, hidden_by text,
              with_students integer, with_admin integer, ready boolean)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
#variable_conflict use_column
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return query
    with hidden as (
      select distinct on (r.row_id)
             r.row_id as pid, r.reason, r.created_at, r.actor, r.actor_user_id
        from public.bank_question_revisions r
       where r.table_name = 'bank_papers' and r.action = 'admin_hide'
       order by r.row_id, r.created_at desc, r.id desc
    ),
    waiting as (
      select ap.live_bank_paper_id as pid,
             count(*) filter (where q.review_bucket = 'kid') as students,
             count(*) filter (where q.review_bucket = 'admin') as admins
        from public.audit_papers ap
        join public.audit_questions q on q.paper_id = ap.id
       where ap.live_bank_paper_id is not null
         and q.kind = 'question'
         and public.approval_question_state(q.kind, q.question_passed, q.set_aside_at) = 'open'
       group by ap.live_bank_paper_id
    ),
    awaiting as (
      select ap.live_bank_paper_id as pid,
             bool_or(not exists (
               select 1 from public.audit_questions q2
                where q2.paper_id = ap.id and q2.kind = 'question'
                  and public.approval_question_state(q2.kind, q2.question_passed, q2.set_aside_at) = 'open')) as is_ready
        from public.audit_papers ap
       where ap.approval_state = 'awaiting' and ap.live_bank_paper_id is not null
       group by ap.live_bank_paper_id
    )
    select bp.id,
           case when bp.is_published then null else h.reason end,
           case when bp.is_published then null else h.created_at end,
           case when bp.is_published then null
                when h.actor_user_id is not null then public.history_person_name(h.actor_user_id)
                when h.actor like 'ai:%' or h.actor like 'system:%' then 'The pipeline'
                when h.pid is not null then 'An admin' end,
           coalesce(w.students, 0)::integer,
           coalesce(w.admins, 0)::integer,
           coalesce(a.is_ready, false)
      from public.bank_papers bp
      left join hidden h on h.pid = bp.id
      left join waiting w on w.pid = bp.id
      left join awaiting a on a.pid = bp.id
     where (not bp.is_published) or w.pid is not null or a.pid is not null;
end;
$function$;

-- ---------------------------------------------------------------------------
-- 4. admin_nav_counts

create or replace function public.admin_nav_counts()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $function$
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'applications', (select count(*) from public.teacher_applications where status = 'pending'),
    'reviews', (select count(*) from public.teacher_comments where approved = false)
             + (select count(*) from public.teacher_recommendations where status = 'pending'),
    'ready', (select count(*) from public.audit_papers where approval_state = 'awaiting'),
    'admin_queue', (select count(*) from public.audit_questions q
                     where q.review_bucket = 'admin' and q.kind = 'question'
                       and public.approval_question_state(q.kind, q.question_passed, q.set_aside_at) = 'open'));
end;
$function$;

-- ---------------------------------------------------------------------------
-- grants: closed to all three roles by name, then opened to authenticated.
-- A non-admin authenticated caller still gets 42501 from is_admin() first.

revoke all on function public.admin_queue_papers() from public, anon, authenticated;
revoke all on function public.admin_queue_questions(uuid) from public, anon, authenticated;
revoke all on function public.admin_library_extras() from public, anon, authenticated;
revoke all on function public.admin_nav_counts() from public, anon, authenticated;
grant execute on function public.admin_queue_papers() to authenticated;
grant execute on function public.admin_queue_questions(uuid) to authenticated;
grant execute on function public.admin_library_extras() to authenticated;
grant execute on function public.admin_nav_counts() to authenticated;

-- Suggested, NOT created here (the owner decides after reading a plan on live):
--   create index concurrently if not exists audit_questions_admin_open_idx
--     on public.audit_questions (paper_id)
--     where review_bucket = 'admin' and kind = 'question' and not coalesce(question_passed, false);
