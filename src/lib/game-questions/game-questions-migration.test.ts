/**
 * Every rule in supabase/migrations/20261010120000_game_questions.sql, run for real on an empty in-memory Postgres
 * (PGlite) with Supabase's sign-in, roles and default grants stubbed: who can read and call what, who is an HOD,
 * sending, numbering, duplicates, sending back, notifications, approving, paging, and running the migration twice.
 * Nothing here touches a real database. The tests run in order and build on each other.
 *
 * The stubs are the parts of this project's database the migration leans on: auth.users, auth.jwt() and auth.uid(),
 * profiles (id, full_name), admins (id), paper_hods (user_id, active), is_admin(), and is_hod() with the same body as
 * 20261007100000_checker_assignments_and_hod.sql. Supabase's default privileges are stubbed too (every new table and
 * function granted to anon, authenticated and service_role by name), because without them the grant tests prove
 * nothing.
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;
type Result = { rows?: Json[]; error?: string };

const MIGRATION = readFileSync('supabase/migrations/20261010120000_game_questions.sql', 'utf8');
const BUILDER = 'dhairyaplayz97@gmail.com'; // seeded into game_hods at the end of the migration

const db = new PGlite();
const ids: Record<string, string> = {};

const uid = (email: string) =>
  (ids[email.toLowerCase()] ??= `00000000-0000-0000-0000-${String(Object.keys(ids).length + 1).padStart(12, '0')}`);

/** A signed-in person's pass, as Supabase gives it: their sign-in name unless `name` is null; `anonymous` for an anonymous sign-in. */
type Opts = { name?: string | null; anonymous?: boolean };
const claims = (email: string, { name, anonymous = false }: Opts = {}) => ({
  sub: uid(email), email, role: 'authenticated', is_anonymous: anonymous,
  user_metadata: name === null ? {} : { full_name: name ?? email.split('@')[0] },
});

/** Each person has an account (the tables' foreign keys point at auth.users). */
const account = (email: string, confirmed = true) =>
  db.query('insert into auth.users (id, email, email_confirmed_at) values ($1, $2, $3) on conflict (id) do nothing', [uid(email), email, confirmed ? new Date() : null]);

async function run(role: 'anon' | 'authenticated', pass: ReturnType<typeof claims> | null, sql: string, params?: unknown[]): Promise<Result> {
  if (pass) await account(pass.email);
  await db.exec(`set role ${role}; select set_config('request.jwt.claims', '${pass ? JSON.stringify(pass).replace(/'/g, "''") : ''}', false);`);
  try {
    return { rows: (await db.query<Json>(sql, params)).rows };
  } catch (e) {
    return { error: (e as Error).message };
  } finally {
    await db.exec('reset role');
  }
}
const anon = (sql: string) => run('anon', null, sql);
const as = (email: string, sql: string, params?: unknown[], opts?: Opts) => run('authenticated', claims(email, opts), sql, params);
/** The value a call returns; fails the test if the call fails. */
async function value(email: string, sql: string, params?: unknown[], opts?: Opts) {
  const r = await as(email, sql, params, opts);
  expect(r.error, sql).toBeUndefined();
  return Object.values(r.rows![0])[0] as Json;
}
const owner = async (sql: string, params?: unknown[]) => (await db.query<Json>(sql, params)).rows;
const refused = (r: Result, why: RegExp) => expect(r.error ?? 'it was allowed').toMatch(why);

const Q = (question: string, answer: string, x: object = {}) => ({
  chapter_id: 'CBSE10SCI01', topic_id: 'CBSE10SCI01T01', board: 'CBSE', class: 10, subject: 'Science', chapter_no: 1,
  chapter: 'Chemical Reactions', topic_no: 1, topic: 'Equations', question, answer, difficulty: null, ...x,
});
const send = (email: string, qs: unknown, opts?: Opts) => as(email, 'select public.game_submit_batch($1::jsonb) r', [JSON.stringify(qs)], opts);
const sent = (email: string, qs: unknown, opts?: Opts) => value(email, 'select public.game_submit_batch($1::jsonb)', [JSON.stringify(qs)], opts);
const decide = (email: string, list: string[], status: string, reason = '') =>
  as(email, 'select public.game_hod_set_status($1::text[], $2, $3) r', [list, status, reason]);
const notes = (email: string) => value(email, 'select public.game_my_sent_back()');
const count = async (sql: string) => (await owner(`select count(*)::int n from ${sql}`))[0].n as number;

/** The eight functions the site calls, and the five helpers nobody can call. */
const SITE = [
  'game_is_hod()', 'game_submit_batch(jsonb)', 'game_my_sent_back()', 'game_mark_sent_back_seen()', 'game_waiting_count()',
  'game_hod_questions()', 'game_hod_approved(timestamptz, text, integer)', 'game_hod_set_status(text[], text, text)',
];
const HELPERS = ['game_norm(text)', 'game_codes_match(text, text, text)', 'game_signed_in()', 'game_name_of(uuid)', 'game_sync_bank()'];
const TABLES = ['game_batches', 'game_questions', 'game_bank', 'game_hods'];

beforeAll(async () => {
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin;
    create schema auth;
    create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
    create function auth.jwt() returns jsonb language sql stable as $$ select nullif(current_setting('request.jwt.claims', true), '')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt() ->> 'sub')::uuid $$;
    grant usage on schema auth to anon, authenticated; grant usage on schema public to anon, authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    create table public.profiles (id uuid primary key, full_name text);
    create table public.admins (id uuid primary key);
    create table public.paper_hods (user_id uuid primary key, active boolean not null default true);
    create function public.is_admin() returns boolean language sql stable security definer set search_path = public
    as $$ select exists (select 1 from public.admins where admins.id = (select auth.uid())) $$;
    create or replace function public.is_hod() returns boolean language sql stable security definer set search_path to 'public'
    as $$ select public.is_admin() or exists (select 1 from public.paper_hods h where h.user_id = auth.uid() and h.active) $$;`);
  // the builder signed up before the migration ran, and confirmed their email
  await account(BUILDER);
  await db.exec(MIGRATION);
  for (const e of ['admin@x.in', 'hod@x.in', 'quiet@x.in', 'gone@x.in']) await account(e);
  await owner('insert into public.admins (id) values ($1)', [uid('admin@x.in')]);
  await owner('insert into public.paper_hods (user_id, active) values ($1, true), ($2, true), ($3, false)', [uid('hod@x.in'), uid('quiet@x.in'), uid('gone@x.in')]);
  await owner(`insert into public.profiles (id, full_name) values ($1, 'Mrs Hod')`, [uid('hod@x.in')]);
}, 60_000);

describe('who can read and call what', () => {
  it('only the eight site functions are callable, and only when signed in; the helpers by nobody', async () => {
    for (const f of [...SITE, ...HELPERS]) {
      const can = async (role: string) => (await owner(`select has_function_privilege($1, $2, 'EXECUTE') ok`, [role, `public.${f}`]))[0].ok;
      expect(await can('public'), f).toBe(false);
      expect(await can('anon'), f).toBe(false);
      expect(await can('authenticated'), f).toBe(SITE.includes(f));
    }
  });

  it('only game_bank can be read, by anyone; no table can be written', async () => {
    for (const t of TABLES) {
      for (const role of ['anon', 'authenticated']) {
        for (const priv of ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE']) {
          const [{ ok }] = await owner('select has_table_privilege($1, $2, $3) ok', [role, `public.${t}`, priv]);
          expect(ok, `${role} ${priv} ${t}`).toBe(t === 'game_bank' && priv === 'SELECT');
        }
      }
      expect((await owner(`select relrowsecurity rls from pg_class where oid = $1::regclass`, [`public.${t}`]))[0].rls, t).toBe(true);
    }
  });

  it('signed out: reads the question bank and nothing else', async () => {
    expect((await anon('select count(*) from public.game_bank')).error).toBeUndefined();
    for (const t of ['game_questions', 'game_batches', 'game_hods']) refused(await anon(`select * from public.${t}`), /permission denied/);
    refused(await anon(`insert into public.game_bank (question_id) values ('x')`), /permission denied/);
    for (const f of ['game_is_hod()', 'game_waiting_count()', 'game_hod_questions()', 'game_hod_approved()', `game_submit_batch('[]')`,
      `game_hod_set_status('{}', 'approved', '')`, 'game_my_sent_back()', 'game_mark_sent_back_seen()', 'game_signed_in()', `game_name_of(null)`]) {
      refused(await anon(`select public.${f}`), /permission denied/);
    }
  });

  it('an anonymous sign-in counts for nothing', async () => {
    const ghost = { anonymous: true };
    refused(await send('ghost@x.in', [Q('Sneaky?', 'Yes')], ghost), /sign in/i);
    refused(await as('ghost@x.in', 'select public.game_my_sent_back()', [], ghost), /sign in/i);
    refused(await as('ghost@x.in', 'select public.game_mark_sent_back_seen()', [], ghost), /sign in/i);
    expect(await value('ghost@x.in', 'select public.game_is_hod()', [], ghost)).toBe(false);
    refused(await as('ghost@x.in', 'select public.game_hod_questions()', [], ghost), /Only HODs/);
    expect(await count('public.game_batches')).toBe(0);
  });

  it('signed in: can\'t read the tables, write the bank, or open the HOD desk', async () => {
    for (const t of ['game_questions', 'game_batches', 'game_hods']) refused(await as('ann@x.in', `select * from public.${t}`), /permission denied/);
    refused(await as('ann@x.in', `update public.game_bank set answer = 'x'`), /permission denied/);
    refused(await as('ann@x.in', `select public.game_norm('x')`), /permission denied/);
    expect(await value('ann@x.in', 'select public.game_is_hod()')).toBe(false);
    for (const f of ['game_waiting_count()', 'game_hod_questions()', 'game_hod_approved()', `game_hod_set_status('{}', 'approved', '')`]) {
      refused(await as('ann@x.in', `select public.${f}`), /Only HODs/);
    }
  });
});

describe('who is an HOD', () => {
  it('paper HODs and admins, and people in game_hods', async () => {
    expect(await value('hod@x.in', 'select public.game_is_hod()')).toBe(true);
    expect(await value('admin@x.in', 'select public.game_is_hod()')).toBe(true);
    expect(await value(BUILDER, 'select public.game_is_hod()')).toBe(true);
    expect(await value(BUILDER, 'select public.is_hod()')).toBe(false); // the Questions tab only, not paper HOD
    expect(await value(BUILDER, 'select public.game_waiting_count()')).toBe(0);
  });

  it('an HOD whose role was taken away is refused', async () => {
    expect(await value('gone@x.in', 'select public.game_is_hod()')).toBe(false);
    refused(await as('gone@x.in', 'select public.game_hod_questions()'), /Only HODs/);
    refused(await decide('gone@x.in', ['X'], 'approved'), /Only HODs/);
    await owner('update public.paper_hods set active = false where user_id = $1', [uid('quiet@x.in')]);
    refused(await as('quiet@x.in', 'select public.game_waiting_count()'), /Only HODs/);
    await owner('update public.paper_hods set active = true where user_id = $1', [uid('quiet@x.in')]);
    expect(await value('quiet@x.in', 'select public.game_waiting_count()')).toBe(0);
  });

  it('the seed adds the builder only once their email is confirmed', async () => {
    await owner('delete from public.game_hods');
    await owner('update auth.users set email_confirmed_at = null where id = $1', [uid(BUILDER)]);
    await db.exec(MIGRATION);
    expect(await count('public.game_hods')).toBe(0);
    await owner('update auth.users set email_confirmed_at = now() where id = $1', [uid(BUILDER)]);
    await db.exec(MIGRATION);
    expect((await owner('select user_id from public.game_hods')).map((r) => r.user_id)).toEqual([uid(BUILDER)]);
  });
});

describe('sending questions', () => {
  it('refuses a batch that is empty, too big, or has a question with no chapter ID', async () => {
    refused(await send('ann@x.in', { not: 'a list' }), /between 1 and 500/);
    refused(await send('ann@x.in', []), /between 1 and 500/);
    refused(await send('ann@x.in', Array.from({ length: 501 }, (_, i) => Q(`Q${i}?`, 'A'))), /between 1 and 500/);
    refused(await send('ann@x.in', [Q('No chapter?', 'A', { chapter_id: null })]), /no chapter ID/);
  });

  it('checks the chapter ID\'s codes against the board and subject', async () => {
    for (const x of [{ subject: 'Mathematics' }, { subject: 'Scince' }, { board: 'ICSE' }, { chapter_id: 'cbse10sci01', topic_id: null, topic_no: null }]) {
      refused(await send('ann@x.in', [Q('Code check?', 'A', x)]), /doesn't match/);
    }
    expect((await send('ann@x.in', [Q('Made-up subject?', 'Fine', { subject: 'Robotix', chapter_id: 'CBSE10ROB01' })])).error).toBeUndefined();
    expect((await send('ann@x.in', [Q('Made-up board?', 'Fine', { board: 'Dps Board', chapter_id: 'DPSB10SCI01' })])).error).toBeUndefined();
  });

  it('works out each topic ID itself, and keeps to the limits', async () => {
    const r = await sent('ann@x.in', [Q('Topic ID that disagrees?', 'A', { topic_id: 'CBSE10SCI01T09' })]);
    expect(r.questions[0].topic_id).toBe('CBSE10SCI01T01');
    expect(r.questions[0]).not.toHaveProperty('reviewed_by');
    for (const x of [{ class: 13, chapter_id: 'CBSE13SCI01' }, { answer: 'a'.repeat(101) }, { question: 'q'.repeat(301) }, { answer: '  ' }, { difficulty: 'tough' }]) {
      expect((await send('ann@x.in', [Q('Limits?', 'Answer', x)])).error).toBeDefined();
    }
    expect((await send('ann@x.in', [Q('q'.repeat(300), 'b'.repeat(100))])).error).toBeUndefined();
  });

  it('numbers questions within their topic, skips repeats, and gives batch IDs that say the day', async () => {
    const day = (await owner(`select to_char(now() at time zone 'Asia/Kolkata', 'YYYYMMDD') d`))[0].d;
    const b = await sent('ann@x.in', [Q('What is rust?', 'Iron oxide'), Q('What is rust?', 'Iron oxide'), Q('No topic?', 'Fine', { topic_id: null, topic_no: null, topic: '' })]);
    expect(b.batch_id).toMatch(new RegExp(`^B${day}-\\d{2}$`));
    expect([b.sent, b.already]).toEqual([2, 1]);
    expect(b.questions.map((q: Json) => q.question_id)).toContain('CBSE10SCI01T00Q001');
    const again = await sent('ann@x.in', [Q('WHAT IS  RUST', 'iron oxide'), Q('What is rust?!', 'Something else')]);
    expect(again).toMatchObject({ sent: 0, already: 2, batch_id: null }); // case, spaces and end punctuation don't count
    expect((await sent('ann@x.in', [Q('What is rust?', 'Iron oxide', { chapter_id: 'CBSE10SCI02', chapter_no: 2 })])).sent).toBe(1); // another chapter
    const days = (await owner(`select batch_id from public.game_batches where batch_id like 'B${day}-%' order by 1`)).map((x) => x.batch_id);
    expect(days).toEqual(days.map((_, i) => `B${day}-${String(i + 1).padStart(2, '0')}`)); // no gaps, empty batches leave nothing
    expect((await owner('select distinct teacher_id from public.game_batches')).map((x) => x.teacher_id)).toEqual([uid('ann@x.in')]);
  });

  it('names the batch after the profile name, else the sign-in name, else "A teacher"; never the email', async () => {
    const teacherOf = async (email: string) => (await owner('select teacher from public.game_batches where teacher_id = $1 order by sent_at desc, batch_id desc limit 1', [uid(email)]))[0].teacher;
    await sent('noname@x.in', [Q('Nameless?', 'Ok')], { name: null });
    expect(await teacherOf('noname@x.in')).toBe('A teacher');
    await sent('long@x.in', [Q('Long name?', 'Ok')], { name: 'N'.repeat(120) });
    expect(await teacherOf('long@x.in')).toHaveLength(80);
    await sent('pat@x.in', [Q('Sign-in name?', 'Ok')], { name: 'Pat From Google' });
    expect(await teacherOf('pat@x.in')).toBe('Pat From Google');
    await owner(`insert into public.profiles (id, full_name) values ($1, '  Patricia Sen ')`, [uid('pat@x.in')]);
    await sent('pat@x.in', [Q('Profile name?', 'Ok')], { name: 'Pat From Google' });
    expect(await teacherOf('pat@x.in')).toBe('Patricia Sen'); // the profile name beats the sign-in name
    expect(await count(`public.game_batches where teacher like '%@%'`)).toBe(0);
    expect(await count('public.game_bank')).toBe(0); // nothing is in the bank before approval
  });

  it('keeps the question and answer text exactly as sent', async () => {
    const question = 'Which gas, written as "CO₂", turns lime water milky?  (Hint: it\'s  not O₂ \\ N₂; नाइट्रोजन नहीं)';
    const answer = 'Carbon dioxide (CO₂)  ';
    const r = await sent('ann@x.in', [Q(question, answer, { chapter_id: 'CBSE10SCI03', chapter_no: 3 })]);
    expect(r.questions[0]).toMatchObject({ question, answer: answer.trim() });
    const desk = await value('hod@x.in', 'select public.game_hod_questions()');
    expect(desk.find((x: Json) => x.question_id === r.questions[0].question_id)).toMatchObject({ question, answer: answer.trim() });
    await decide('hod@x.in', [r.questions[0].question_id], 'approved');
    const [row] = (await anon(`select question, answer from public.game_bank where chapter_id = 'CBSE10SCI03'`)).rows!;
    expect(row).toEqual({ question, answer: answer.trim() });
  });
});

describe('the HOD desk, notifications and the question bank', () => {
  let rust = '';
  let copy = '';

  it('lists what is waiting, with the teacher, their email and the time, oldest first', async () => {
    const waiting = await value('hod@x.in', 'select public.game_waiting_count()');
    const desk = await value('hod@x.in', 'select public.game_hod_questions()');
    expect(desk).toHaveLength(waiting);
    expect(desk.every((x: Json) => x.teacher && x.teacher_email && x.sent_at)).toBe(true);
    expect(desk.every((x: Json) => !('reviewed_by' in x) && !('teacher_id' in x))).toBe(true);
    expect(desk.every((x: Json, i: number) => i === 0 || desk[i - 1].sent_at <= x.sent_at)).toBe(true);
    const r = desk.find((x: Json) => x.question === 'What is rust?' && x.chapter_id === 'CBSE10SCI01');
    expect(r.teacher_email).toBe('ann@x.in');
    rust = r.question_id;
  });

  it('sending back needs a reason, and saves who and when', async () => {
    refused(await decide('hod@x.in', [rust], 'rejected', '   '), /Say why/);
    refused(await decide('hod@x.in', [rust], 'done'), /Unknown status/);
    expect((await decide('hod@x.in', ['NOPE'], 'approved')).rows![0].r.changed).toEqual([]);
    await decide('hod@x.in', [rust], 'rejected', '  Write the formula too.  ');
    expect((await owner('select * from public.game_questions where question_id = $1', [rust]))[0])
      .toMatchObject({ status: 'rejected', note: 'Write the formula too.', reviewed_by: uid('hod@x.in'), seen_at: null });
  });

  it('the teacher, and only the teacher, gets a notification', async () => {
    const [n] = await notes('ann@x.in');
    expect(n).toMatchObject({ question_id: rust, note: 'Write the formula too.', reviewer: 'Mrs Hod', seen: false, now: null });
    expect(n).not.toHaveProperty('reviewed_by');
    expect(n).not.toHaveProperty('seen_at');
    expect(await notes('ben@x.in')).toEqual([]);
    await value('ben@x.in', 'select public.game_mark_sent_back_seen()');
    expect((await notes('ann@x.in'))[0].seen).toBe(false);
    await value('ann@x.in', 'select public.game_mark_sent_back_seen()');
    expect((await notes('ann@x.in'))[0].seen).toBe(true);
  });

  it('sent back to you, unchanged: not sent again; sent back to someone else: sent as new', async () => {
    const mine = await sent('ann@x.in', [Q('what is rust', 'Iron Oxide.')]);
    expect(mine).toMatchObject({ sent: 0, sent_back: 1, sent_back_ids: [rust] });
    const theirs = await sent('ben@x.in', [Q('What is rust?', 'Iron oxide')]);
    expect(theirs.sent).toBe(1);
    copy = theirs.questions[0].question_id;
    expect(Number(copy.slice(-3))).toBeGreaterThan(Number(rust.slice(-3))); // numbers are never reused
    expect((await notes('ann@x.in'))[0].now).toBe('pending');
  });

  it('a sent-back question stays sent back while its copy waits or is approved', async () => {
    for (const status of ['pending', 'approved']) expect((await decide('hod@x.in', [rust], status)).rows![0].r).toEqual({ changed: [], skipped: [rust] });
    await decide('hod@x.in', [copy], 'approved');
    expect((await notes('ann@x.in'))[0].now).toBe('approved');
    const d1 = (await sent('dan@x.in', [Q('What is an alloy?', 'Mixture of metals')])).questions[0].question_id;
    await decide('hod@x.in', [d1], 'rejected', 'Too easy.');
    const d2 = (await sent('eve@x.in', [Q('What is an alloy?', 'Mixture of metals')])).questions[0].question_id;
    await decide('hod@x.in', [d2], 'rejected', 'Too easy.');
    const both = (await decide('hod@x.in', [d1, d2], 'pending')).rows![0].r;
    expect([both.changed.length, both.skipped.length]).toEqual([1, 1]);
  });

  it('a new reason is a new notification; the same one again changes nothing', async () => {
    await decide('hod@x.in', [rust], 'rejected', 'Duplicate of an approved one.');
    expect((await notes('ann@x.in'))[0].seen).toBe(false);
    await value('ann@x.in', 'select public.game_mark_sent_back_seen()');
    expect((await decide('hod@x.in', [rust], 'rejected', 'Duplicate of an approved one.')).rows![0].r.changed).toEqual([]);
    expect((await notes('ann@x.in'))[0].seen).toBe(true);
  });

  it('an HOD with no profile name shows as "Your HOD", whatever their sign-in says', async () => {
    const z = (await sent('zed@x.in', [Q('What is an ore?', 'Mineral with metal')])).questions[0].question_id;
    await as('quiet@x.in', 'select public.game_hod_set_status($1::text[], $2, $3)', [[z], 'rejected', 'Name the metal.'], { name: 'Quiet Google Name' });
    expect((await notes('zed@x.in'))[0].reviewer).toBe('Your HOD');
  });

  it('a game_hods HOD can approve and send back too', async () => {
    const y = (await sent('yan@x.in', [Q('What is an acid?', 'Sour substance'), Q('What is a base?', 'Bitter substance')])).questions.map((q: Json) => q.question_id);
    expect((await decide(BUILDER, [y[0]], 'approved')).rows![0].r.changed).toEqual([y[0]]);
    expect((await decide(BUILDER, [y[1]], 'rejected', 'Say slippery too.')).rows![0].r.changed).toEqual([y[1]]);
    expect((await notes('yan@x.in'))[0]).toMatchObject({ note: 'Say slippery too.', reviewer: 'Your HOD' });
  });

  it('approving 500 at once fills the question bank with every column; approving again changes nothing', async () => {
    const qs = Array.from({ length: 500 }, (_, i) => Q(`Bulk question ${i}?`, `Answer ${i}`, { topic_no: (i % 5) + 1, topic: `Topic ${(i % 5) + 1}` }));
    const list = (await sent('bulk@x.in', qs)).questions.map((q: Json) => q.question_id);
    expect((await decide('hod@x.in', list, 'approved')).rows![0].r.changed).toHaveLength(500);
    const [bank] = await owner('select * from public.game_bank where question_id = $1', [list[0]]);
    const [row] = await owner('select * from public.game_questions where question_id = $1', [list[0]]);
    for (const k of ['board', 'class', 'subject', 'chapter_no', 'chapter', 'topic_no', 'topic', 'question_no', 'question', 'answer', 'difficulty', 'chapter_id', 'topic_id']) {
      expect(bank[k], k).toEqual(row[k]);
    }
    expect(bank.teacher).toBe('bulk');
    expect((await decide('hod@x.in', [list[0]], 'approved')).rows![0].r.changed).toEqual([]);
    expect((await owner('select approved_at from public.game_bank where question_id = $1', [list[0]]))[0].approved_at).toEqual(bank.approved_at);
    await decide('hod@x.in', [list[1]], 'pending');
    expect((await owner('select reviewed_by, reviewed_at from public.game_questions where question_id = $1', [list[1]]))[0]).toEqual({ reviewed_by: null, reviewed_at: null });
    await decide('hod@x.in', [list[2]], 'rejected', 'No.');
    expect(await count(`public.game_bank where question_id in ('${list[1]}', '${list[2]}')`)).toBe(0);
    expect((await as('ann@x.in', 'select count(*)::int n from public.game_bank')).rows![0].n).toBe(await count(`public.game_questions where status = 'approved'`));
  });

  it('pages through the approved questions newest first, each exactly once, even when approved at the same moment', async () => {
    const take = 37;
    let page = await value('hod@x.in', 'select public.game_hod_approved(null, null, $1)', [take]);
    const all = [...page];
    while (page.length === take) {
      const last = page[page.length - 1];
      page = await value('hod@x.in', 'select public.game_hod_approved($1::timestamptz, $2, $3)', [last.reviewed_at, last.question_id, take]);
      all.push(...page);
    }
    const approved = await count(`public.game_questions where status = 'approved'`);
    expect(new Set(all.map((x) => x.question_id)).size).toBe(approved);
    expect(all).toHaveLength(approved);
    expect(all.every((x, i) => i === 0 || all[i - 1].reviewed_at >= x.reviewed_at)).toBe(true);
    expect(all.every((x) => x.teacher_email && !('reviewed_by' in x))).toBe(true);
    expect(await value('hod@x.in', 'select public.game_hod_approved(null, null, 0)')).toHaveLength(1);
    expect((await value('hod@x.in', 'select public.game_hod_questions()')).every((x: Json) => x.status !== 'approved')).toBe(true);
  });
});

describe('running the migration again', () => {
  it('loses nothing and changes no grant', async () => {
    const snapshot = async () => ({
      rows: await Promise.all(TABLES.map((t) => owner(`select md5(coalesce(string_agg(x::text, '|' order by x::text), '')) h, count(*)::int n from public.${t} x`))),
      grants: await owner(`select p.proname, has_function_privilege('anon', p.oid, 'EXECUTE') a, has_function_privilege('authenticated', p.oid, 'EXECUTE') u
                           from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like 'game\\_%' order by 1`),
      policies: await owner(`select policyname, roles::text from pg_policies where tablename like 'game\\_%' order by 1`),
    });
    const before = await snapshot();
    expect(before.rows.map((r) => r[0].n).every((n) => n > 0)).toBe(true);
    await db.exec(MIGRATION);
    expect(await snapshot()).toEqual(before);
    expect(await value('hod@x.in', 'select public.game_waiting_count()')).toBeGreaterThan(0);
  });
});
