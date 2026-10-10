import { supabase } from '@/integrations/supabase/client';
import type { Bank, BankQuestion, Batch, Row, Status } from './rows';
import { COLUMNS, toRecord } from './rows';

/**
 * Client wrapper for the game question bank: /questions sends questions, the HOD page's Questions tab approves them or
 * sends them back, and /revise reads the approved ones. Every call is one of the functions in
 * 20261010120000_game_questions.sql, each of which checks inside who is asking, or the game_bank table, which anyone
 * can read. They are not in the generated types yet, hence the `as never` casts, the same as hod-api.ts.
 *
 * Errors come back as plain sentences, because the pages show them as they are.
 * Shaping lives here as pure functions so the real API and the fake used in dummy mode share it.
 */

// ---------------------------------------------------------------- shapes

/** What "Send" did: the new batch (null when nothing new was sent), and what was skipped and why. */
export interface SendResult {
  batchId: string | null;
  sent: number;
  /** Already waiting or approved in the same chapter. */
  already: number;
  /** Sent back to this person before and not changed since: not sent again. */
  sentBack: number;
  sentBackIds: string[];
}

/** One of the person's questions that was sent back, with why (`note`) and by whom. */
export interface SentBack extends BankQuestion {
  reviewer: string;
  seen: boolean;
  /** The same question sent again since: waiting, approved, or not sent again (null). */
  now: 'pending' | 'approved' | null;
}

/** The HOD's change, and the sent-back questions that stayed sent back because the same question is already waiting or approved. */
export interface StatusResult {
  changed: string[];
  skipped: string[];
}

export interface GameQuestionsApi {
  /** game_is_hod(): a paper HOD, an admin, or someone given the Questions tab only. False when signed out. */
  isHod(): Promise<boolean>;
  /** /revise: every approved question, in order. Anyone can read it. */
  bank(): Promise<BankQuestion[]>;
  /** How many questions the question bank holds. */
  approvedCount(): Promise<number>;
  /** HODs only: questions waiting for a decision. */
  waitingCount(): Promise<number>;
  /** Sends the signed-in person's questions as one batch. Rows with no chapter ID are left out here. */
  send(rows: Row[]): Promise<SendResult>;
  /** HODs only: every question waiting or sent back, with its batch. */
  forHod(): Promise<Bank>;
  /** HODs only: approved questions, newest first, APPROVED_PAGE at a time, older than `after`. */
  approved(after?: BankQuestion): Promise<Bank>;
  /** HODs only: approve, send back (with the reason the teacher sees) or move back to waiting. */
  setStatus(ids: string[], status: Status, reason?: string): Promise<StatusResult>;
  /** The signed-in person's questions that were sent back, newest first. */
  sentBack(): Promise<SentBack[]>;
  /** The person has seen their sent-back questions. */
  markSeen(): Promise<void>;
}

export const APPROVED_PAGE = 200;

/** React Query keys. `scope` keeps the real database and dummy mode's fake apart in the cache. */
export const GAME_KEYS = {
  all: (scope: string) => ['game-questions', scope] as const,
  sentBack: (scope: string) => ['game-questions', scope, 'sent-back'] as const,
  waiting: (scope: string) => ['game-questions', scope, 'waiting'] as const,
  bank: (scope: string) => ['game-questions', scope, 'bank'] as const,
};

// ---------------------------------------------------------------- shaping

/** A row from game_questions, game_bank or a function, with the batch's teacher and time where there is one. */
export interface DbQuestion extends Omit<Row, 'line'> {
  question_id: string;
  batch_id?: string;
  status?: Status;
  note?: string;
  reviewed_at?: string | null;
  approved_at?: string;
  teacher?: string;
  teacher_email?: string | null;
  sent_at?: string;
}

/** The words are passed through untouched: never trimmed, cleaned or re-cased. */
export const fromDb = (r: DbQuestion): BankQuestion => ({
  chapter_id: r.chapter_id ?? null,
  topic_id: r.topic_id ?? null,
  board: r.board ?? '',
  class: r.class ?? null,
  subject: r.subject ?? '',
  chapter_no: r.chapter_no ?? null,
  chapter: r.chapter ?? '',
  topic_no: r.topic_no ?? null,
  topic: r.topic ?? '',
  question_no: r.question_no,
  question: r.question,
  answer: r.answer,
  difficulty: r.difficulty ?? null,
  line: 0,
  id: r.question_id,
  batch: r.batch_id ?? '',
  status: r.status ?? 'approved',
  note: r.note ?? '',
  reviewedAt: r.reviewed_at ?? r.approved_at ?? null,
});

/** Questions from the HOD functions, with their batches. */
export function toBank(rows: DbQuestion[]): Bank {
  const batches = new Map<string, Batch>();
  for (const r of rows) {
    if (r.batch_id && !batches.has(r.batch_id)) {
      batches.set(r.batch_id, { id: r.batch_id, by: r.teacher ?? '', email: r.teacher_email ?? '', at: r.sent_at ?? '' });
    }
  }
  return { batches: [...batches.values()], questions: rows.map(fromDb) };
}

export const toSendResult = (r: { batch_id: string | null; sent: number; already: number; sent_back: number; sent_back_ids: string[] }): SendResult => ({
  batchId: r.batch_id, sent: r.sent, already: r.already, sentBack: r.sent_back, sentBackIds: r.sent_back_ids ?? [],
});

export const toSentBack = (r: DbQuestion & { reviewer: string; seen: boolean; now: SentBack['now'] }): SentBack => ({
  ...fromDb(r), reviewer: r.reviewer, seen: r.seen, now: r.now ?? null,
});

/** The rows "Send" sends: only those with a chapter ID, as the database's columns. */
export const sendable = (rows: Row[]) => rows.filter((r) => r.chapter_id).map(toRecord);

// ---------------------------------------------------------------- the real thing

const OFFLINE = "Couldn't reach the question bank. Check the internet connection and try again.";

/** A plain sentence for anything that went wrong. */
function plain(e: { message?: string; code?: string } | null | undefined): Error {
  const message = e?.message ?? '';
  if (!message || /fetch|network|load failed/i.test(message)) return new Error(OFFLINE);
  if (e?.code === '42501' || /permission denied/i.test(message)) return new Error('Please sign in first.');
  return new Error(message);
}

async function call<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  let r: { data: unknown; error: { message?: string; code?: string } | null };
  try {
    r = await supabase.rpc(fn as never, (args ?? {}) as never);
  } catch {
    throw new Error(OFFLINE);
  }
  if (r.error) throw plain(r.error);
  return r.data as T;
}

/** The columns /revise and the download need, named (never `*`). */
const BANK_COLUMNS = ['question_id', ...COLUMNS, 'teacher', 'approved_at'].join(', ');

async function bank(): Promise<BankQuestion[]> {
  const rows: DbQuestion[] = [];
  for (let from = 0; ; from += 1000) {
    let r: { data: unknown; error: { message?: string; code?: string } | null };
    try {
      r = await supabase
        .from('game_bank' as never)
        .select(BANK_COLUMNS)
        .order('class')
        .order('subject')
        .order('chapter_no')
        .order('topic_no')
        .order('question_no')
        .range(from, from + 999);
    } catch {
      throw new Error(OFFLINE);
    }
    if (r.error) throw plain(r.error);
    const page = (r.data ?? []) as DbQuestion[];
    rows.push(...page);
    if (page.length < 1000) return rows.map(fromDb);
  }
}

export const realGameQuestionsApi: GameQuestionsApi = {
  async isHod() {
    try {
      return Boolean(await call<boolean>('game_is_hod'));
    } catch {
      return false;
    }
  },
  bank,
  async approvedCount() {
    let r: { count: number | null; error: { message?: string; code?: string } | null };
    try {
      r = await supabase.from('game_bank' as never).select('question_id', { count: 'exact', head: true });
    } catch {
      throw new Error(OFFLINE);
    }
    if (r.error) throw plain(r.error);
    return r.count ?? 0;
  },
  waitingCount: () => call<number>('game_waiting_count'),
  async send(rows) {
    return toSendResult(await call('game_submit_batch', { questions: sendable(rows) }));
  },
  async forHod() {
    return toBank(await call<DbQuestion[]>('game_hod_questions'));
  },
  async approved(after) {
    return toBank(await call<DbQuestion[]>('game_hod_approved', { before_at: after?.reviewedAt ?? null, before_id: after?.id ?? null, take: APPROVED_PAGE }));
  },
  setStatus: (ids, status, reason = '') => call<StatusResult>('game_hod_set_status', { ids, new_status: status, reason }),
  async sentBack() {
    return (await call<Parameters<typeof toSentBack>[0][]>('game_my_sent_back')).map(toSentBack);
  },
  async markSeen() {
    await call('game_mark_sent_back_seen');
  },
};
