-- Phase 0d: the signed-out free preview drops from five questions to two.
--
-- WHY THIS IS THE ONLY LEVER THAT MATTERS HERE:
-- `anon` holds EXECUTE on bank_paper_questions and always has. Verified by
-- curl with no account at all:
--   POST /rest/v1/rpc/bank_paper_questions {"p_paper_id":"0c9771"}
--     -> 5 real question bodies
-- Across 1,282 published papers that is 6,410 question bodies retrievable in
-- 1,282 requests, with no account, no browser and no rate limit. The gate
-- limits depth, not access, and nothing else in this plan reduces that number.
-- Two brings it to 2,564.
--
-- It also resolves what looked like a conflict between the SEO work and the
-- anti-scraping work. Prerendering these same questions into static HTML would
-- have added no new exposure -- the exposure already existed, at the same
-- request count. scripts/prerender.ts still emits none of them, because
-- question text earns no ranking (people search "<school> class 10 maths 2023
-- question paper", which is entirely metadata), so there was never anything to
-- trade.
--
-- Separated from 20260917120000 on purpose: that migration is a security fix
-- with no product consequence, this one is a product decision with a
-- measurable cost, and they should be revertable independently.
--
-- WHAT TO WATCH after applying, from read_events plus Search Console:
--   - signup conversion from paper pages, which is what the preview buys
--   - impressions and average position on /past-papers/* over 4 weeks
-- If conversion does not move, five was buying nothing and two is free. If it
-- drops, the number is one integer in one function.

begin;

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
    -- The gate. Was 5. auth.uid() is null for an anonymous caller and for
    -- Googlebot alike, and is read inside the function body rather than from
    -- anything the client sends, so there is no flag or parameter that can
    -- ask for more.
    limit case when v_uid is null then 2 else null end;
end;
$function$;

revoke all on function public.bank_paper_questions(text) from public;
grant execute on function public.bank_paper_questions(text) to anon, authenticated;

commit;

-- ===========================================================================
-- ROLLBACK: re-apply 20260917120000's definition of this function, which is
-- identical except for `limit case when v_uid is null then 5 else null end`.
-- ===========================================================================
