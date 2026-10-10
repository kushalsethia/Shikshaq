/**
 * In-memory fake of the game question bank for dummy mode (D75). Test builds only (see src/lib/dummy-mode.ts),
 * reached solely through the PREVIEW_TOOLS-gated lazy imports in src/pages/Questions.tsx, src/pages/Revise.tsx and
 * src/pages/Hod.tsx (via HodDummy). Every question and person here is MADE UP; nothing touches Supabase.
 *
 * One fake is shared by the three dummy pages (`sharedFakeGameApi`), so a question sent on /questions waits on
 * /hod?tab=questions, and once approved it is playable on /revise, all in one visit. It copies the rules the screens
 * lean on (20261010120000_game_questions.sql): only rows with a chapter ID are sent; a question already waiting or
 * approved in its chapter is skipped; one sent back to the same person and unchanged is not sent again; numbers go
 * up within each topic and are never reused; sending back needs a reason; a sent-back question stays sent back while
 * the same question is waiting or approved.
 */

import {
  APPROVED_PAGE,
  sendable,
  toBank,
  toSendResult,
  toSentBack,
  fromDb,
  type DbQuestion,
  type GameQuestionsApi,
} from '@/lib/game-questions/api';
import type { Status } from '@/lib/game-questions/rows';

/** Who "you" are in dummy mode. */
export const DUMMY_TEACHER = { name: 'Dummy Teacher', email: 'you@example.com' };

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const norm = (t: string) => t.trim().replace(/[\s?.!:;,।]+$/u, '').replace(/\s+/g, ' ').toLowerCase();
const pad = (n: number, w: number) => String(n).padStart(w, '0');
const pause = () => new Promise((r) => setTimeout(r, 250));

interface FakeRow extends DbQuestion {
  status: Status;
  note: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  seen_at: string | null;
  batch_id: string;
}
interface FakeBatch {
  batch_id: string;
  teacher: string;
  teacher_email: string;
  sent_at: string;
}

export interface FakeGameQuestionsApi extends GameQuestionsApi {
  reset(): void;
}

type Q = [question: string, answer: string, difficulty?: 'easy' | 'medium' | 'hard'];
interface Fixture {
  chapter_id: string;
  board: string;
  class: number;
  subject: string;
  chapter_no: number;
  chapter: string;
  topics: { no: number; name: string; questions: Q[] }[];
}

/* Made-up questions in the shape teachers send. Kept to plain, well-known facts so every game can be made. */
const APPROVED: Fixture[] = [
  {
    chapter_id: 'CBSE07SCI01', board: 'CBSE', class: 7, subject: 'Science', chapter_no: 1, chapter: 'Nutrition in Plants',
    topics: [
      { no: 1, name: 'Photosynthesis', questions: [
        ['Green pigment in leaves that traps sunlight', 'Chlorophyll', 'easy'],
        ['Tiny pores on the surface of a leaf', 'Stomata', 'easy'],
        ['Gas that leaves take in to make food', 'Carbon dioxide', 'medium'],
        ['Gas that leaves give out while making food', 'Oxygen', 'easy'],
        ['Simple sugar made in leaves using sunlight', 'Glucose', 'medium'],
        ['Living things that make their own food', 'Autotrophs', 'medium'],
      ] },
      { no: 2, name: 'Other Modes of Nutrition', questions: [
        ['Plant that traps insects in a jug-shaped leaf', 'Pitcher plant', 'easy'],
        ['Yellow climbing plant that takes its food from a host', 'Cuscuta', 'hard'],
        ['Living things that feed on dead and rotting matter', 'Saprotrophs', 'medium'],
        ['Two living things that live together and both gain', 'Symbiosis', 'hard'],
        ['Living things that depend on others for their food', 'Heterotrophs', 'medium'],
      ] },
    ],
  },
  {
    chapter_id: 'CBSE07SCI02', board: 'CBSE', class: 7, subject: 'Science', chapter_no: 2, chapter: 'Nutrition in Animals',
    topics: [
      { no: 1, name: 'Digestion in Humans', questions: [
        ['Longest part of the food pipe system in the body', 'Small intestine', 'medium'],
        ['Watery liquid in the mouth that starts digesting starch', 'Saliva', 'easy'],
        ['Finger-like outgrowths on the inner wall of the small intestine', 'Villi', 'hard'],
        ['Largest gland in the body, which makes bile', 'Liver', 'easy'],
        ['Tube that carries food from the mouth to the stomach', 'Oesophagus', 'medium'],
      ] },
    ],
  },
  {
    chapter_id: 'CBSE08SCI03', board: 'CBSE', class: 8, subject: 'Science', chapter_no: 3, chapter: 'Synthetic Fibres and Plastics',
    topics: [
      { no: 1, name: 'Synthetic Fibres', questions: [
        ['Fibre made from wood pulp, also called artificial silk', 'Rayon', 'easy'],
        ['The first fully synthetic fibre', 'Nylon', 'easy'],
        ['Fibre used in sweaters in place of wool', 'Acrylic', 'medium'],
        ['Fibre used in clothes that do not wrinkle easily', 'Polyester', 'medium'],
      ] },
      { no: 2, name: 'Plastics', questions: [
        ['Plastic that softens on heating and can be reshaped', 'Thermoplastic', 'medium'],
        ['Plastic coating on non-stick pans', 'Teflon', 'easy'],
        ['Hard plastic used for electric switches', 'Bakelite', 'hard'],
      ] },
    ],
  },
];

/* A batch waiting for the HOD, and one of "your" questions that was sent back. */
const WAITING: Fixture = {
  chapter_id: 'CBSE07SCI02', board: 'CBSE', class: 7, subject: 'Science', chapter_no: 2, chapter: 'Nutrition in Animals',
  topics: [
    { no: 2, name: 'Digestion in Grass-eating Animals', questions: [
      ['Animals that chew the cud', 'Ruminants', 'medium'],
      ['Pouch between the small and large intestine in grass-eaters', 'Caecum', 'hard'],
      ['Partly digested food that a cow brings back to its mouth', 'Cud', 'easy'],
    ] },
  ],
};

export function createFakeGameQuestionsApi(): FakeGameQuestionsApi {
  let rows: FakeRow[] = [];
  let batches: FakeBatch[] = [];
  let daySeq = 0;

  const batchId = () => {
    const d = new Date();
    daySeq += 1;
    return `B${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}-${pad(daySeq, 2)}`;
  };
  const nextNo = (chapter: string, topic: number | null) =>
    Math.max(0, ...rows.filter((r) => r.chapter_id === chapter && (r.topic_no ?? null) === topic).map((r) => r.question_no)) + 1;
  const add = (f: Fixture, topicNo: number, [question, answer, difficulty]: Q, batch: FakeBatch, status: Status, extra: Partial<FakeRow> = {}) => {
    const topic = f.topics.find((t) => t.no === topicNo)!;
    const n = nextNo(f.chapter_id, topicNo);
    const row: FakeRow = {
      question_id: `${f.chapter_id}T${pad(topicNo, 2)}Q${pad(n, 3)}`,
      batch_id: batch.batch_id,
      chapter_id: f.chapter_id,
      topic_id: `${f.chapter_id}T${pad(topicNo, 2)}`,
      board: f.board,
      class: f.class,
      subject: f.subject,
      chapter_no: f.chapter_no,
      chapter: f.chapter,
      topic_no: topicNo,
      topic: topic.name,
      question_no: n,
      question,
      answer,
      difficulty: difficulty ?? null,
      status,
      note: '',
      reviewed_at: status === 'pending' ? null : batch.sent_at,
      reviewed_by: status === 'pending' ? null : 'hod',
      seen_at: null,
      ...extra,
    };
    rows.push(row);
    return row;
  };

  function seed() {
    rows = [];
    batches = [];
    daySeq = 0;
    const old: FakeBatch = { batch_id: 'B20261001-01', teacher: 'Made Up Teacher', teacher_email: 'made.up.teacher@example.com', sent_at: ago(60 * 24 * 9) };
    batches.push(old);
    for (const f of APPROVED) for (const t of f.topics) for (const q of t.questions) add(f, t.no, q, old, 'approved');
    const waiting: FakeBatch = { batch_id: 'B20261009-01', teacher: 'Another Made Up Teacher', teacher_email: 'another.teacher@example.com', sent_at: ago(90) };
    batches.push(waiting);
    for (const q of WAITING.topics[0].questions) add(WAITING, 2, q, waiting, 'pending');
    const mine: FakeBatch = { batch_id: 'B20261008-01', teacher: DUMMY_TEACHER.name, teacher_email: DUMMY_TEACHER.email, sent_at: ago(60 * 26) };
    batches.push(mine);
    add(APPROVED[0], 1, ['Process by which green plants make food', 'Photosynthesis process'], mine, 'rejected', {
      note: 'The answer repeats a word from the question. Try "Food made in leaves using sunlight | Photosynthesis" instead.',
      reviewed_at: ago(60 * 20),
    });
  }
  seed();

  const withBatch = (r: FakeRow): DbQuestion => {
    const b = batches.find((x) => x.batch_id === r.batch_id)!;
    return { ...r, teacher: b.teacher, teacher_email: b.teacher_email, sent_at: b.sent_at };
  };
  const live = (r: FakeRow) => r.status !== 'rejected';
  const sameQuestion = (a: FakeRow, b: { chapter_id: string | null; question: string }) => a.chapter_id === b.chapter_id && norm(a.question) === norm(b.question);
  const mineBatch = (r: FakeRow) => batches.find((b) => b.batch_id === r.batch_id)?.teacher_email === DUMMY_TEACHER.email;

  return {
    reset: seed,
    async isHod() {
      return true;
    },
    async bank() {
      await pause();
      return rows
        .filter((r) => r.status === 'approved')
        .map((r) => fromDb(withBatch(r)))
        .sort((a, b) => (a.class ?? 0) - (b.class ?? 0) || a.subject.localeCompare(b.subject) || (a.chapter_no ?? 0) - (b.chapter_no ?? 0) || (a.topic_no ?? 0) - (b.topic_no ?? 0) || a.question_no - b.question_no);
    },
    async approvedCount() {
      return rows.filter((r) => r.status === 'approved').length;
    },
    async waitingCount() {
      return rows.filter((r) => r.status === 'pending').length;
    },
    async send(input) {
      await pause();
      const ready = sendable(input);
      if (!ready.length || ready.length > 500) throw new Error('Send between 1 and 500 questions at a time.');
      const batch: FakeBatch = { batch_id: batchId(), teacher: DUMMY_TEACHER.name, teacher_email: DUMMY_TEACHER.email, sent_at: new Date().toISOString() };
      batches.push(batch);
      let sent = 0;
      let already = 0;
      const back: string[] = [];
      let sentBack = 0;
      const seen = new Set<string>();
      for (const q of ready) {
        const key = `${q.chapter_id}|${norm(String(q.question))}`;
        const like = { chapter_id: q.chapter_id as string, question: String(q.question) };
        if (seen.has(key) || rows.some((r) => live(r) && sameQuestion(r, like))) {
          already++;
          continue;
        }
        seen.add(key);
        const returned = rows.filter((r) => r.status === 'rejected' && sameQuestion(r, like) && norm(r.answer) === norm(String(q.answer)) && mineBatch(r));
        if (returned.length) {
          sentBack++;
          back.push(...returned.map((r) => r.question_id));
          continue;
        }
        const topicNo = (q.topic_no as number | null) ?? null;
        const n = nextNo(q.chapter_id as string, topicNo);
        rows.push({
          question_id: `${q.chapter_id}T${pad(topicNo ?? 0, 2)}Q${pad(n, 3)}`,
          batch_id: batch.batch_id,
          chapter_id: q.chapter_id as string,
          topic_id: topicNo === null ? null : `${q.chapter_id}T${pad(topicNo, 2)}`,
          board: String(q.board),
          class: q.class as number,
          subject: String(q.subject),
          chapter_no: q.chapter_no as number,
          chapter: String(q.chapter),
          topic_no: topicNo,
          topic: String(q.topic ?? ''),
          question_no: n,
          question: String(q.question).trim(),
          answer: String(q.answer).trim(),
          difficulty: (q.difficulty as FakeRow['difficulty']) ?? null,
          status: 'pending',
          note: '',
          reviewed_at: null,
          reviewed_by: null,
          seen_at: null,
        });
        sent++;
      }
      if (!sent) batches = batches.filter((b) => b !== batch);
      return toSendResult({ batch_id: sent ? batch.batch_id : null, sent, already, sent_back: sentBack, sent_back_ids: back });
    },
    async forHod() {
      await pause();
      return toBank(rows.filter((r) => r.status !== 'approved').map(withBatch));
    },
    async approved(after) {
      await pause();
      const sorted = rows
        .filter((r) => r.status === 'approved')
        .sort((a, b) => (b.reviewed_at ?? '').localeCompare(a.reviewed_at ?? '') || b.question_id.localeCompare(a.question_id));
      const from = after ? sorted.findIndex((r) => r.question_id === after.id) + 1 : 0;
      return toBank(sorted.slice(from, from + APPROVED_PAGE).map(withBatch));
    },
    async setStatus(ids, status, reason = '') {
      await pause();
      const why = reason.trim();
      if (status === 'rejected' && !why) throw new Error('Say why the question is going back.');
      const skipped =
        status === 'rejected'
          ? []
          : rows
              .filter((t) => ids.includes(t.question_id) && t.status === 'rejected')
              .filter(
                (t) =>
                  rows.some((x) => live(x) && sameQuestion(x, t)) ||
                  rows.some((u) => ids.includes(u.question_id) && u.status === 'rejected' && u.question_id < t.question_id && sameQuestion(u, t)),
              )
              .map((t) => t.question_id);
      const changed: string[] = [];
      const now = new Date().toISOString();
      for (const r of rows) {
        if (!ids.includes(r.question_id) || skipped.includes(r.question_id)) continue;
        if (r.status === status && !(status === 'rejected' && r.note !== why)) continue;
        r.status = status;
        r.note = status === 'rejected' ? why : '';
        r.reviewed_at = status === 'pending' ? null : now;
        r.reviewed_by = status === 'pending' ? null : 'hod';
        r.seen_at = null;
        changed.push(r.question_id);
      }
      return { changed, skipped };
    },
    async sentBack() {
      await pause();
      return rows
        .filter((r) => r.status === 'rejected' && mineBatch(r))
        .sort((a, b) => (b.reviewed_at ?? '').localeCompare(a.reviewed_at ?? '') || a.question_id.localeCompare(b.question_id))
        .map((r) => {
          const again = rows.filter((x) => live(x) && sameQuestion(x, r));
          const now = again.some((x) => x.status === 'approved') ? 'approved' : again.length ? 'pending' : null;
          return toSentBack({ ...withBatch(r), reviewer: 'Made Up HOD', seen: r.seen_at !== null, now });
        });
    },
    async markSeen() {
      const now = new Date().toISOString();
      for (const r of rows) if (r.status === 'rejected' && mineBatch(r) && !r.seen_at) r.seen_at = now;
    },
  };
}

/** The one fake the dummy pages share, so a question can travel from /questions to the HOD and on to /revise. */
export const sharedFakeGameApi = createFakeGameQuestionsApi();
