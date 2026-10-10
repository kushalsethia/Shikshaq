-- Game questions: the question bank behind /questions (write and send questions), the HOD page's Questions tab
-- (approve or send back) and /revise (puzzles made from the approved questions).
--
-- Brought over from the standalone question bank site (github.com/dhairyakhetan/AppleSauce, supabase/schema.sql).
-- Same rules, with these changes: every name starts with game_; there is no roles table (a sender is any real
-- signed-in account, an HOD is public.is_hod(), which is true for admins too); people are stored by user ID, never by
-- email; and the Google-only check is gone, because this site also signs people in with email and password.
--
-- What this adds:
--   * game_batches   one row per "Send for approval": who sent it (their name, and their user ID) and when
--   * game_questions every question ever sent: pending (waiting), approved, or rejected (sent back), with the
--                    HOD's reason
--   * game_bank      the clean final table: approved questions only, kept in step with game_questions by a trigger.
--                    Anyone can read it, signed in or not. Nothing but the trigger writes it.
--   * game_hods      people who may use the Questions tab without being a paper HOD or an admin. Paper HODs and
--                    admins never need a row here. Seeded with the person who built the question bank (end of file),
--                    so they can check it works. Add someone by hand in the SQL editor:
--                      insert into public.game_hods (user_id) select id from auth.users where lower(email) = '<email>';
--                    Remove them with: delete from public.game_hods where user_id = '<user id>';
--
-- IDs say what they are:
--   question_id  CBSE10SCI01T02Q003 = CBSE, class 10, Science (SCI), chapter 01, topic 02, question 003 of that topic
--                (T00 when the question has no topic). Numbers are given in order and never reused.
--   batch_id     B20261009-03 = the 3rd batch sent on 9 October 2026 (India time)
--
-- Who can do what (each function checks inside):
--   anyone     reads game_bank (approved questions only); nothing else
--   signed in  game_submit_batch(questions) sends a batch as themselves; game_my_sent_back() and
--              game_mark_sent_back_seen() are their notifications (their questions that were sent back, and why).
--              An anonymous sign-in does not count.
--   HOD        (is_hod(), or a row in game_hods) also game_hod_questions() (waiting and sent back),
--              game_hod_approved() (approved, newest first, a page at a time), game_waiting_count() and
--              game_hod_set_status(ids, new_status, reason)
--   game_is_hod() tells the site whether to draw the Questions tab.
--
-- The site calls eight functions (the seven above and game_is_hod). Five helpers nobody can call: game_norm,
-- game_codes_match, game_signed_in, game_name_of and the trigger function game_sync_bank.
-- Every game_ function is SECURITY DEFINER with set search_path = '', revoked from public, anon AND authenticated
-- (the do block near the end: Supabase grants EXECUTE on every new function to anon and authenticated by name), then
-- the eight are granted to authenticated only.
--
-- Safe to run twice: tables and indexes are "if not exists", functions "or replace", and the trigger and policy are
-- dropped before they are made again.

-- ---------------------------------------------------------------- helpers

-- How two questions are compared: case, extra spaces and punctuation at the end don't matter.
create or replace function public.game_norm(t text) returns text
language sql immutable security definer set search_path = ''
as $$ select lower(regexp_replace(regexp_replace(btrim(t), '[[:space:]?.!:;,।]+$', ''), '\s+', ' ', 'g')) $$;

-- A real signed-in account: not signed out, and not an anonymous sign-in.
create or replace function public.game_signed_in() returns boolean
language sql stable security definer set search_path = ''
as $$ select auth.uid() is not null and coalesce(auth.jwt() ->> 'is_anonymous', 'false') <> 'true' $$;

-- A person's name: their profile's full name, else (only for the person asking) the name on their sign-in, else null.
-- Never their email: the batch's name is shown with every approved question.
create or replace function public.game_name_of(person uuid) returns text
language sql stable security definer set search_path = ''
as $$
  select coalesce(
    (select nullif(btrim(p.full_name), '') from public.profiles p where p.id = person),
    case when person = auth.uid() then coalesce(
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'full_name'), ''),
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'name'), '')
    ) end
  )
$$;

-- ---------------------------------------------------------------- tables

create table if not exists public.game_batches (
  batch_id   text primary key constraint game_batches_batch_id_check check (batch_id ~ '^B[0-9]{8}-[0-9]{2,}$'),
  teacher    text not null constraint game_batches_teacher_check check (char_length(teacher) between 1 and 80),
  teacher_id uuid references auth.users(id) on delete set null,
  sent_at    timestamptz not null default now()
);
create index if not exists game_batches_teacher on public.game_batches (teacher_id);

create table if not exists public.game_questions (
  question_id text primary key,
  batch_id    text not null references public.game_batches on delete cascade,
  chapter_id  text not null constraint game_questions_chapter_id_check check (chapter_id ~ '^[A-Z]{2,5}(0[1-9]|1[0-2])[A-Z]{3}[0-9]{2}$'),
  topic_id    text,
  board       text not null constraint game_questions_board_check check (char_length(board) between 1 and 60),
  class       smallint not null constraint game_questions_class_check check (class between 1 and 12),
  subject     text not null constraint game_questions_subject_check check (char_length(subject) between 1 and 80),
  chapter_no  smallint not null constraint game_questions_chapter_no_check check (chapter_no between 1 and 99),
  chapter     text not null constraint game_questions_chapter_check check (char_length(chapter) between 1 and 200),
  topic_no    smallint constraint game_questions_topic_no_check check (topic_no between 1 and 99),
  topic       text not null default '' constraint game_questions_topic_check check (char_length(topic) <= 200),
  question_no smallint not null constraint game_questions_question_no_check check (question_no between 1 and 999),
  question    text not null constraint game_questions_question_check check (char_length(question) between 1 and 300),
  answer      text not null constraint game_questions_answer_check check (char_length(answer) between 1 and 100),
  difficulty  text constraint game_questions_difficulty_check check (difficulty in ('easy', 'medium', 'hard')),
  status      text not null default 'pending' constraint game_questions_status_check check (status in ('pending', 'approved', 'rejected')),
  note        text not null default '' constraint game_questions_note_check check (char_length(note) <= 500),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  seen_at     timestamptz,  -- when the teacher saw that it was sent back (their notifications); empty until then
  -- the IDs always agree with the columns
  constraint game_ids_match check (
    chapter_id ~ ('^[A-Z]{2,5}' || lpad(class::text, 2, '0') || '[A-Z]{3}' || lpad(chapter_no::text, 2, '0') || '$')
    and topic_id is not distinct from (case when topic_no is null then null else chapter_id || 'T' || lpad(topic_no::text, 2, '0') end)
    and question_id = chapter_id || 'T' || lpad(coalesce(topic_no, 0)::text, 2, '0') || 'Q' || lpad(question_no::text, 3, '0')
  ),
  constraint game_sent_back_says_why check (status <> 'rejected' or note <> '')
);
-- a question can't wait or be approved twice in one chapter; one that was sent back can be sent again
create unique index if not exists game_questions_once_per_chapter on public.game_questions (chapter_id, public.game_norm(question)) where status <> 'rejected';
create index if not exists game_questions_batch on public.game_questions (batch_id);
create index if not exists game_questions_status on public.game_questions (status, class, subject, chapter_id);

create table if not exists public.game_bank (
  question_id text primary key references public.game_questions on delete cascade,
  board       text not null,
  class       smallint not null,
  subject     text not null,
  chapter_no  smallint not null,
  chapter     text not null,
  topic_no    smallint,
  topic       text not null,
  question_no smallint not null,
  question    text not null,
  answer      text not null,
  difficulty  text,
  chapter_id  text not null,
  topic_id    text,
  teacher     text not null,
  approved_at timestamptz not null
);
create index if not exists game_bank_order on public.game_bank (class, subject, chapter_no, topic_no, question_no);

create table if not exists public.game_hods (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

comment on table public.game_batches is 'One row per "Send for approval" from /questions.';
comment on table public.game_questions is 'Every question ever sent, waiting (pending), approved or sent back (rejected). Written only through the game_ functions.';
comment on table public.game_bank is 'The final question bank: approved questions only, one row per question. Kept in step with game_questions by a trigger; read-only.';
comment on table public.game_hods is 'People who may approve game questions without being a paper HOD or an admin. Paper HODs and admins need no row.';
comment on column public.game_bank.question_id is 'Chapter ID + topic + question number, e.g. CBSE10SCI01T02Q003 (T00 = no topic)';
comment on column public.game_bank.board is 'Board, e.g. CBSE';
comment on column public.game_bank.class is 'Class, 1 to 12';
comment on column public.game_bank.subject is 'Subject, e.g. Science';
comment on column public.game_bank.chapter_no is 'Chapter number';
comment on column public.game_bank.chapter is 'Chapter name';
comment on column public.game_bank.topic_no is 'Topic number within the chapter (empty when there is no topic)';
comment on column public.game_bank.topic is 'Topic name';
comment on column public.game_bank.question_no is 'Question number within its topic';
comment on column public.game_bank.question is 'The question, exactly as the teacher wrote it';
comment on column public.game_bank.answer is 'The answer, exactly as the teacher wrote it';
comment on column public.game_bank.difficulty is 'easy, medium or hard (empty when not given)';
comment on column public.game_bank.chapter_id is 'Board + class + subject code + chapter, e.g. CBSE10SCI01';
comment on column public.game_bank.topic_id is 'Chapter ID + topic, e.g. CBSE10SCI01T02';
comment on column public.game_bank.teacher is 'Name of the teacher who sent the question';
comment on column public.game_bank.approved_at is 'When the HOD approved it';

-- ---------------------------------------------------------------- who is an HOD here

-- Paper HODs and admins (is_hod()), and anyone in game_hods.
create or replace function public.game_is_hod() returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.game_signed_in()
     and (public.is_hod() or exists (select 1 from public.game_hods g where g.user_id = auth.uid()))
$$;

-- ---------------------------------------------------------------- game_bank follows game_questions

create or replace function public.game_sync_bank() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.status = 'approved' then
    insert into public.game_bank (question_id, board, class, subject, chapter_no, chapter, topic_no, topic, question_no,
                                  question, answer, difficulty, chapter_id, topic_id, teacher, approved_at)
    select new.question_id, new.board, new.class, new.subject, new.chapter_no, new.chapter, new.topic_no, new.topic, new.question_no,
           new.question, new.answer, new.difficulty, new.chapter_id, new.topic_id, b.teacher, coalesce(new.reviewed_at, now())
    from public.game_batches b where b.batch_id = new.batch_id
    on conflict (question_id) do update set
      board = excluded.board, class = excluded.class, subject = excluded.subject, chapter_no = excluded.chapter_no,
      chapter = excluded.chapter, topic_no = excluded.topic_no, topic = excluded.topic, question_no = excluded.question_no,
      question = excluded.question, answer = excluded.answer, difficulty = excluded.difficulty, chapter_id = excluded.chapter_id,
      topic_id = excluded.topic_id, teacher = excluded.teacher, approved_at = excluded.approved_at;
  else
    delete from public.game_bank where question_id = new.question_id;
  end if;
  return new;
end $$;

drop trigger if exists game_questions_to_bank on public.game_questions;
create trigger game_questions_to_bank after insert or update of status on public.game_questions
  for each row execute function public.game_sync_bank();

-- ---------------------------------------------------------------- who can see what

alter table public.game_batches enable row level security;
alter table public.game_questions enable row level security;
alter table public.game_bank enable row level security;
alter table public.game_hods enable row level security;
revoke all on public.game_batches, public.game_questions, public.game_bank, public.game_hods from public, anon, authenticated;
grant select on public.game_bank to anon, authenticated;
drop policy if exists "Anyone can read the game bank" on public.game_bank;
create policy "Anyone can read the game bank" on public.game_bank for select to anon, authenticated using (true);

-- ---------------------------------------------------------------- what the site calls

-- The board and subject codes the site uses (src/lib/game-questions/details.ts; codes-match.test.ts checks that this
-- list agrees). A chapter ID must use the code of a known board or subject, and a made-up subject code can't be a
-- known one, so a question can't be filed under another subject's chapters.
create or replace function public.game_codes_match(board text, subject text, chapter_id text) returns boolean
language sql immutable security definer set search_path = ''
as $$
  with boards(name, code) as (values
    ('CBSE', 'CBSE'), ('ICSE', 'ICSE'), ('ISC', 'ISC'), ('IB', 'IB'), ('IGCSE', 'IGCSE'), ('Cambridge', 'CAIE'),
    ('NIOS', 'NIOS'), ('Andhra Pradesh State Board', 'AP'), ('Arunachal Pradesh State Board', 'AR'),
    ('Assam State Board', 'AS'), ('Bihar State Board', 'BR'), ('Chhattisgarh State Board', 'CG'),
    ('Delhi State Board', 'DL'), ('Goa State Board', 'GA'), ('Gujarat State Board', 'GJ'),
    ('Haryana State Board', 'HR'), ('Himachal Pradesh State Board', 'HP'), ('Jammu and Kashmir State Board', 'JK'),
    ('Jharkhand State Board', 'JH'), ('Karnataka State Board', 'KA'), ('Kerala State Board', 'KL'),
    ('Madhya Pradesh State Board', 'MP'), ('Maharashtra State Board', 'MH'), ('Manipur State Board', 'MN'),
    ('Meghalaya State Board', 'ML'), ('Mizoram State Board', 'MZ'), ('Nagaland State Board', 'NL'),
    ('Odisha State Board', 'OD'), ('Punjab State Board', 'PB'), ('Rajasthan State Board', 'RJ'),
    ('Sikkim State Board', 'SK'), ('Tamil Nadu State Board', 'TN'), ('Telangana State Board', 'TS'),
    ('Tripura State Board', 'TR'), ('Uttar Pradesh State Board', 'UP'), ('Uttarakhand State Board', 'UK'),
    ('West Bengal State Board', 'WB')
  ), subjects(name, code) as (values
    ('Physics', 'PHY'), ('Chemistry', 'CHE'), ('Biology', 'BIO'), ('Mathematics', 'MAT'), ('Science', 'SCI'),
    ('Social Science', 'SST'), ('English', 'ENG'), ('English Language', 'ENL'), ('English Literature', 'ELT'),
    ('Hindi', 'HIN'), ('Sanskrit', 'SAN'), ('History', 'HIS'), ('Geography', 'GEO'), ('Civics', 'CIV'),
    ('History and Civics', 'HCV'), ('Political Science', 'POL'), ('Economics', 'ECO'), ('Computer Science', 'CSC'),
    ('Computer Applications', 'CAP'), ('Informatics Practices', 'INP'), ('Accountancy', 'ACC'),
    ('Business Studies', 'BST'), ('Commercial Studies', 'COM'), ('Environmental Studies', 'EVS'),
    ('Environmental Science', 'ENV'), ('Statistics', 'STA'), ('Psychology', 'PSY'), ('Sociology', 'SOC'),
    ('Physical Education', 'PED'), ('Biotechnology', 'BTE'), ('Home Science', 'HSC'), ('Legal Studies', 'LGS'),
    ('General Knowledge', 'GKN'), ('French', 'FRE'), ('German', 'GER'), ('Marathi', 'MAR'), ('Bengali', 'BEN'),
    ('Tamil', 'TAM'), ('Telugu', 'TEL'), ('Kannada', 'KAN'), ('Malayalam', 'MAL'), ('Gujarati', 'GUJ'),
    ('Punjabi', 'PUN'), ('Urdu', 'URD')
  ), id as (select regexp_match(chapter_id, '^([A-Z]{2,5})[0-9]{2}([A-Z]{3})[0-9]{2}$') m)
  select id.m is not null
     and coalesce((select b.code = id.m[1] from boards b where lower(b.name) = lower(board)), true)
     and coalesce((select s.code = id.m[2] from subjects s where lower(s.name) = lower(subject)),
                   not exists (select 1 from subjects s where s.code = id.m[2]))
  from id
$$;

-- /questions sends the signed-in person's questions as one batch. Each needs a chapter ID (the page leaves out the
-- ones without). Questions already waiting or approved in the same chapter are skipped. So is a question that was
-- sent back to this same person and hasn't changed (same question and answer): it would only be sent back again, so
-- the page points them to the reason instead. Sent back to someone else, it goes in as new. Returns the batch ID, how
-- many were sent and skipped, the IDs of the sent-back ones, and the new rows.
create or replace function public.game_submit_batch(questions jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := auth.uid();
  -- the person's name; never their email, which would show in the public question bank
  who text := left(coalesce(public.game_name_of(auth.uid()), 'A teacher'), 80);
  day text := to_char(now() at time zone 'Asia/Kolkata', 'YYYYMMDD');
  seq int;
  bid text;
  q jsonb;
  r public.game_questions;
  cid text;
  tno int;
  qtext text;
  nq text;
  n int;
  back text[];
  seen text[] := '{}';
  sent int := 0;
  already int := 0;
  sent_back int := 0;
  back_ids text[] := '{}';
  added jsonb := '[]';
begin
  if not public.game_signed_in() then raise exception 'Please sign in first.'; end if;
  if jsonb_typeof(questions) is distinct from 'array' or jsonb_array_length(questions) not between 1 and 500 then
    raise exception 'Send between 1 and 500 questions at a time.';
  end if;
  perform pg_advisory_xact_lock(hashtext('public.game_submit_batch'));

  select coalesce(max(substring(b.batch_id from 11)::int), 0) + 1 into seq from public.game_batches b where b.batch_id like 'B' || day || '-%';
  bid := 'B' || day || '-' || lpad(seq::text, greatest(2, char_length(seq::text)), '0');
  insert into public.game_batches (batch_id, teacher, teacher_id) values (bid, who, me);

  for q in select * from jsonb_array_elements(questions) loop
    cid := q->>'chapter_id';
    qtext := btrim(q->>'question');
    tno := (q->>'topic_no')::int;
    nq := public.game_norm(qtext);
    if cid is null then raise exception 'A question has no chapter ID.'; end if;
    if not public.game_codes_match(q->>'board', q->>'subject', cid) then
      raise exception 'The chapter ID % doesn''t match the board "%" and subject "%". Check their spelling.', cid, q->>'board', q->>'subject';
    end if;
    if cid || '|' || nq = any(seen)
       or exists (select 1 from public.game_questions x where x.chapter_id = cid and public.game_norm(x.question) = nq and x.status <> 'rejected') then
      already := already + 1;
      continue;
    end if;
    seen := seen || (cid || '|' || nq);
    select array_agg(x.question_id) into back from public.game_questions x join public.game_batches b on b.batch_id = x.batch_id
    where x.chapter_id = cid and x.status = 'rejected' and public.game_norm(x.question) = nq
      and public.game_norm(x.answer) = public.game_norm(q->>'answer') and b.teacher_id = me;
    if back is not null then
      sent_back := sent_back + 1;
      back_ids := back_ids || back;
      continue;
    end if;
    select coalesce(max(x.question_no), 0) + 1 into n from public.game_questions x where x.chapter_id = cid and x.topic_no is not distinct from tno;
    insert into public.game_questions (question_id, batch_id, chapter_id, topic_id, board, class, subject, chapter_no, chapter,
                                       topic_no, topic, question_no, question, answer, difficulty)
    values (cid || 'T' || lpad(coalesce(tno, 0)::text, 2, '0') || 'Q' || lpad(n::text, 3, '0'), bid, cid,
            case when tno is null then null else cid || 'T' || lpad(tno::text, 2, '0') end,
            q->>'board', (q->>'class')::int, q->>'subject', (q->>'chapter_no')::int, q->>'chapter', tno, coalesce(q->>'topic', ''),
            n, qtext, btrim(q->>'answer'), q->>'difficulty')
    returning * into r;
    added := added || jsonb_build_array(to_jsonb(r) - 'reviewed_by' || jsonb_build_object('teacher', who, 'sent_at', now()));
    sent := sent + 1;
  end loop;

  if sent = 0 then
    delete from public.game_batches b where b.batch_id = bid;
    bid := null;
  end if;
  return jsonb_build_object('batch_id', bid, 'sent', sent, 'already', already, 'sent_back', sent_back, 'sent_back_ids', to_jsonb(back_ids), 'questions', added);
end $$;

-- The number waiting, on the Questions tab. HODs only.
create or replace function public.game_waiting_count() returns int
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.game_is_hod() then raise exception 'Only HODs can see this.'; end if;
  return (select count(*)::int from public.game_questions where status = 'pending');
end $$;

-- The Questions tab: every question waiting or sent back, with who sent it, their email and when. HODs only.
create or replace function public.game_hod_questions() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.game_is_hod() then raise exception 'Only HODs can see this.'; end if;
  return (
    select coalesce(jsonb_agg(to_jsonb(q) - 'reviewed_by' || jsonb_build_object('teacher', b.teacher, 'teacher_email', u.email, 'sent_at', b.sent_at)
                              order by b.sent_at, q.question_id), '[]')
    from public.game_questions q
    join public.game_batches b on b.batch_id = q.batch_id
    left join auth.users u on u.id = b.teacher_id
    where q.status <> 'approved'
  );
end $$;

-- The Questions tab's approved questions, newest first, a page at a time: the page after (before_at, before_id), the
-- approval time and ID of the last one already shown. HODs only.
create or replace function public.game_hod_approved(before_at timestamptz default null, before_id text default null, take int default 200) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.game_is_hod() then raise exception 'Only HODs can see this.'; end if;
  return (
    select coalesce(jsonb_agg(to_jsonb(q) - 'reviewed_by' || jsonb_build_object('teacher', b.teacher, 'teacher_email', u.email, 'sent_at', b.sent_at)
                              order by q.reviewed_at desc, q.question_id desc), '[]')
    from (
      select * from public.game_questions x
      where x.status = 'approved' and (before_at is null or (x.reviewed_at, x.question_id) < (before_at, before_id))
      order by x.reviewed_at desc, x.question_id desc
      limit least(greatest(take, 1), 1000)
    ) q
    join public.game_batches b on b.batch_id = q.batch_id
    left join auth.users u on u.id = b.teacher_id
  );
end $$;

-- The HOD approves (approved), sends back with a reason (rejected) or moves back to waiting (pending). Returns what
-- changed and what was skipped.
create or replace function public.game_hod_set_status(ids text[], new_status text, reason text default '') returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  why text := btrim(coalesce(reason, ''));
  skipped text[] := '{}';
  done jsonb;
begin
  if not public.game_is_hod() then raise exception 'Only HODs can approve or send back questions.'; end if;
  if new_status is null or new_status not in ('pending', 'approved', 'rejected') then raise exception 'Unknown status.'; end if;
  if new_status = 'rejected' and why = '' then raise exception 'Say why the question is going back.'; end if;
  -- a sent-back question stays sent back while the same question (sent again) is waiting or approved
  if new_status <> 'rejected' then
    select coalesce(array_agg(t.question_id), '{}') into skipped
    from public.game_questions t
    where t.question_id = any(ids) and t.status = 'rejected' and (
      exists (select 1 from public.game_questions x
              where x.chapter_id = t.chapter_id and public.game_norm(x.question) = public.game_norm(t.question) and x.status <> 'rejected')
      or exists (select 1 from public.game_questions u
                 where u.question_id = any(ids) and u.status = 'rejected' and u.question_id < t.question_id
                   and u.chapter_id = t.chapter_id and public.game_norm(u.question) = public.game_norm(t.question)));
  end if;
  with changed as (
    update public.game_questions q
    set status = new_status,
        note = case when new_status = 'rejected' then why else '' end,
        reviewed_at = case when new_status = 'pending' then null else now() end,
        reviewed_by = case when new_status = 'pending' then null else auth.uid() end,
        seen_at = null
    where q.question_id = any(ids) and q.question_id <> all(skipped)
      -- nothing to do when it already has this status (and this reason): its time and "seen" stay as they are
      and (q.status is distinct from new_status or (new_status = 'rejected' and q.note is distinct from why))
    returning q.question_id
  )
  select coalesce(jsonb_agg(changed.question_id), '[]') into done from changed;
  return jsonb_build_object('changed', done, 'skipped', to_jsonb(skipped));
end $$;

-- Notifications: the signed-in person's questions that were sent back, newest first, with the reason, who sent them
-- back, whether they have seen it, and whether the same question has since been sent again (waiting or approved).
create or replace function public.game_my_sent_back() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.game_signed_in() then raise exception 'Please sign in first.'; end if;
  return (
    select coalesce(jsonb_agg(to_jsonb(q) - 'reviewed_by' - 'seen_at' || jsonb_build_object(
        'sent_at', b.sent_at,
        'teacher', b.teacher,
        'reviewer', coalesce(public.game_name_of(q.reviewed_by), 'Your HOD'),
        'seen', q.seen_at is not null,
        'now', (select x.status from public.game_questions x
                where x.chapter_id = q.chapter_id and public.game_norm(x.question) = public.game_norm(q.question) and x.status <> 'rejected'
                order by x.status = 'approved' desc limit 1))
      order by q.reviewed_at desc, q.question_id), '[]')
    from public.game_questions q
    join public.game_batches b on b.batch_id = q.batch_id
    where q.status = 'rejected' and b.teacher_id = auth.uid()
  );
end $$;

-- The person has seen their notifications.
create or replace function public.game_mark_sent_back_seen() returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.game_signed_in() then raise exception 'Please sign in first.'; end if;
  update public.game_questions q set seen_at = now()
  from public.game_batches b
  where b.batch_id = q.batch_id and b.teacher_id = auth.uid() and q.status = 'rejected' and q.seen_at is null;
end $$;

-- ---------------------------------------------------------------- grants

-- Supabase grants EXECUTE on every new function to anon and authenticated BY NAME, so revoking from public alone
-- leaves them callable. Revoke every game_ function from all three, then grant the eight the site calls to
-- authenticated only. The five helpers stay closed to everyone.
do $grants$
declare
  f regprocedure;
begin
  for f in
    select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'game\_%'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
  end loop;
end
$grants$;

grant execute on function
  public.game_is_hod(),
  public.game_submit_batch(jsonb),
  public.game_my_sent_back(),
  public.game_mark_sent_back_seen(),
  public.game_waiting_count(),
  public.game_hod_questions(),
  public.game_hod_approved(timestamptz, text, int),
  public.game_hod_set_status(text[], text, text)
to authenticated;

-- ---------------------------------------------------------------- the first question HOD

-- The person who built the question bank, so they can check it works on the real site: the Questions tab only, not
-- paper HOD or admin. Only a confirmed email counts (an unconfirmed one could belong to someone else). If they have
-- no account yet, this adds nobody: they sign up, then this statement is run again.
insert into public.game_hods (user_id)
select u.id from auth.users u
where lower(u.email) = 'dhairyaplayz97@gmail.com' and u.email_confirmed_at is not null
on conflict (user_id) do nothing;
