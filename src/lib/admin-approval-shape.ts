/**
 * The admin paper-approval flow (QUEUE_20261002, section B): types and the
 * normalisers that turn whatever the RPCs return into them.
 *
 * Pure, no Supabase client, so it is tested without a login. The RPC calls
 * themselves live in admin-approval.ts, the one module to edit if the backend
 * names a function or a field differently from the contract.
 *
 * The normalisers are deliberately forgiving: the backend migration is being
 * written in parallel, so a field that arrives under a near-synonym
 * ('total_questions' for 'questions_total', a before/after object instead of
 * a changes list) still lands in the right place, and a missing one becomes
 * a safe default rather than a crash.
 */

import type { ActorKind, FieldChange } from '@/lib/history-labels';
import { normaliseActorKind } from '@/lib/history-labels';

type Json = Record<string, unknown>;

const str = (v: unknown): string | null => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : null);
const num = (v: unknown): number | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
};
const int0 = (v: unknown): number => num(v) ?? 0;
const pick = (o: Json, ...keys: string[]): unknown => {
  for (const k of keys) if (o[k] !== undefined && o[k] !== null) return o[k];
  return undefined;
};
const asObj = (v: unknown): Json => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : {});
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

// ---------------------------------------------------------------------------
// Queue

export type QueueKind = 'new' | 'retro';

export interface ApprovalQueueRow {
  audit_paper_id: string;
  title: string;
  board: string | null;
  cls: string | null;
  subject: string | null;
  school: string | null;
  year: string | null;
  questions_total: number;
  passed: number;
  open: number;
  set_aside: number;
  ai_summary: { pass: number; fix: number; student: number };
  queued_at: string | null;
  kind: QueueKind;
  live_bank_paper_id: string | null;
}

export function paperTitleFrom(p: { board?: string | null; cls?: string | null; subject?: string | null; year?: string | null }): string {
  const head = [p.board, p.cls ? `Class ${p.cls}` : null, p.subject].filter(Boolean).join(' ');
  return [head || 'Untitled paper', p.year].filter(Boolean).join(', ');
}

export function normaliseQueueRow(raw: unknown): ApprovalQueueRow {
  const r = asObj(raw);
  const ai = asObj(pick(r, 'ai_summary', 'ai'));
  const kindRaw = str(pick(r, 'kind', 'queue_kind'));
  const live = str(pick(r, 'live_bank_paper_id', 'bank_paper_id'));
  const base = {
    board: str(r.board),
    cls: str(pick(r, 'cls', 'class')),
    subject: str(r.subject),
    year: str(r.year),
  };
  return {
    audit_paper_id: str(pick(r, 'audit_paper_id', 'id')) ?? '',
    title: str(r.title) || paperTitleFrom(base),
    ...base,
    school: str(r.school),
    questions_total: int0(pick(r, 'questions_total', 'total_questions', 'questions', 'total')),
    passed: int0(pick(r, 'passed', 'passed_questions')),
    open: int0(pick(r, 'open', 'open_questions', 'open_count')),
    set_aside: int0(pick(r, 'set_aside', 'set_aside_questions', 'set_aside_count')),
    ai_summary: {
      pass: int0(pick(ai, 'pass', 'passed', 'ai_pass')),
      fix: int0(pick(ai, 'fix', 'fixed', 'ai_fix')),
      student: int0(pick(ai, 'student', 'kid', 'to_student')),
    },
    queued_at: str(pick(r, 'queued_at', 'created_at')),
    kind: kindRaw === 'retro' ? 'retro' : 'new',
    live_bank_paper_id: live,
  };
}

/** Ready means nothing is open: every question ended passed or set aside. */
export function isReady(row: Pick<ApprovalQueueRow, 'open'>): boolean {
  return row.open === 0;
}

// ---------------------------------------------------------------------------
// One paper under review

/** passed and set_aside are the two ends; open blocks approval. */
export type QuestionState = 'passed' | 'open' | 'set_aside';

export function questionState(status: string | null | undefined, passed?: boolean | null): QuestionState {
  const s = (status ?? '').toLowerCase();
  if (s === 'set_aside' || s === 'rejected' || s === 'skipped' || s === 'held') return 'set_aside';
  if (s === 'passed' || s === 'approved' || passed === true) return 'passed';
  return 'open';
}

export type RowKind = 'question' | 'section_break' | 'master_instruction' | 'section_instruction';

export interface ReviewOption {
  label: string | null;
  text: string;
}

export interface ReviewRow {
  id: string;
  kind: RowKind;
  ord: number;
  parent_id: string | null;
  display_number: string | null;
  number_path: string | null;
  body: string;
  options: ReviewOption[];
  marks: number | null;
  instructions: string | null;
  figure: string | null;
  state: QuestionState;
  version: number;
  flag_reasons: string[];
  flag_detail: string | null;
  review_bucket: string | null;
  live_bank_question_id: string | null;
}

export interface ReviewPaper {
  audit_paper_id: string;
  title: string;
  board: string | null;
  cls: string | null;
  subject: string | null;
  school: string | null;
  year: string | null;
  exam: string | null;
  kind: QueueKind;
  live_bank_paper_id: string | null;
  is_published: boolean;
  /** 'approved' | 'rejected' | 'pending' */
  approval: 'approved' | 'rejected' | 'pending';
  general_instructions: string | null;
  allowed_time_minutes: number | null;
}

export interface PaperReview {
  paper: ReviewPaper;
  rows: ReviewRow[];
  open_count: number;
}

export function normaliseOptions(raw: unknown): ReviewOption[] {
  return asArr(raw)
    .map((o): ReviewOption | null => {
      if (typeof o === 'string') return o.trim() ? { label: null, text: o } : null;
      const r = asObj(o);
      const text = str(r.text) ?? '';
      const label = str(r.label);
      return text.trim() || label ? { label: label && label.trim() ? label : null, text } : null;
    })
    .filter((o): o is ReviewOption => o !== null);
}

const ROW_KINDS: RowKind[] = ['question', 'section_break', 'master_instruction', 'section_instruction'];

export function normaliseReviewRow(raw: unknown, i: number): ReviewRow {
  const r = asObj(raw);
  const kind = str(r.kind) as RowKind | null;
  const flags = asArr(r.flag_reasons).map((f) => str(f)).filter((f): f is string => !!f);
  return {
    id: str(pick(r, 'id', 'question_id')) ?? `row-${i}`,
    kind: kind && ROW_KINDS.includes(kind) ? kind : 'question',
    ord: num(r.ord) ?? i,
    parent_id: str(pick(r, 'parent_id', 'parent_question_id')),
    display_number: str(r.display_number),
    number_path: str(pick(r, 'number_path', 'number')),
    body: str(r.body) ?? '',
    options: normaliseOptions(r.options),
    marks: num(r.marks),
    instructions: str(r.instructions),
    figure: str(pick(r, 'figure', 'figure_path')),
    state: questionState(str(pick(r, 'state', 'status')), r.question_passed === true),
    version: num(pick(r, 'version', 'current_version')) ?? 1,
    flag_reasons: flags,
    flag_detail: str(r.flag_detail),
    review_bucket: str(r.review_bucket),
    live_bank_question_id: str(r.live_bank_question_id),
  };
}

export function normaliseReview(raw: unknown): PaperReview {
  const r = asObj(raw);
  const p = asObj(pick(r, 'paper', 'meta'));
  const rows = asArr(pick(r, 'rows', 'questions'))
    .map(normaliseReviewRow)
    .sort((a, b) => a.ord - b.ord);
  const base = { board: str(p.board), cls: str(pick(p, 'cls', 'class')), subject: str(p.subject), year: str(p.year) };
  const approvalRaw = str(pick(p, 'approval', 'final_verdict', 'approval_state'));
  const live = str(pick(p, 'live_bank_paper_id', 'bank_paper_id'));
  const openFromRows = rows.filter((x) => x.kind === 'question' && x.state === 'open').length;
  return {
    paper: {
      audit_paper_id: str(pick(p, 'audit_paper_id', 'id')) ?? '',
      title: str(p.title) || paperTitleFrom(base),
      ...base,
      school: str(p.school),
      exam: str(p.exam),
      kind: str(p.kind) === 'retro' ? 'retro' : 'new',
      live_bank_paper_id: live,
      is_published: p.is_published === true,
      approval: approvalRaw === 'approved' || approvalRaw === 'rejected' ? approvalRaw : 'pending',
      general_instructions: str(p.general_instructions),
      allowed_time_minutes: num(p.allowed_time_minutes),
    },
    rows,
    open_count: num(pick(r, 'open_count', 'open')) ?? openFromRows,
  };
}

/** Passed / open / set aside counts over the question rows. */
export function reviewCounts(rows: ReviewRow[]): { total: number; passed: number; open: number; set_aside: number } {
  const qs = rows.filter((r) => r.kind === 'question');
  return {
    total: qs.length,
    passed: qs.filter((r) => r.state === 'passed').length,
    open: qs.filter((r) => r.state === 'open').length,
    set_aside: qs.filter((r) => r.state === 'set_aside').length,
  };
}

// ---------------------------------------------------------------------------
// History

export interface HistoryEvent {
  at: string;
  actor_name: string | null;
  actor_kind: ActorKind;
  action: string;
  model: string | null;
  question_id: string | null;
  question_label: string | null;
  changes: FieldChange[];
  note: string | null;
  verdict: string | null;
  confidence: number | null;
  version: number | null;
  to_version: number | null;
}

export interface QuestionVersion {
  version: number;
  body: string;
  options: ReviewOption[];
  marks: number | null;
  display_number: string | null;
  instructions: string | null;
  created_at: string;
  actor_name: string | null;
  actor_kind: ActorKind;
  action: string | null;
  note: string | null;
}

export interface QuestionCheck {
  checker_kind: string;
  model: string | null;
  verdict: string;
  confidence: number | null;
  at: string | null;
  actor_name: string | null;
}

export interface QuestionHistory {
  versions: QuestionVersion[];
  events: HistoryEvent[];
  checks: QuestionCheck[];
}

/** before/after objects (audit_review_log's shape) into a change list. */
export function changesFrom(r: Json): FieldChange[] {
  const list = asArr(r.changes);
  if (list.length) {
    return list
      .map((c) => asObj(c))
      .filter((c) => typeof c.field === 'string')
      .map((c) => ({ field: c.field as string, before: c.before ?? null, after: c.after ?? null }));
  }
  // {changes: {body: {before, after}}}
  const asMap = asObj(r.changes);
  if (Object.keys(asMap).length) {
    return Object.entries(asMap).map(([field, v]) => {
      const o = asObj(v);
      return { field, before: o.before ?? null, after: o.after ?? null };
    });
  }
  const field = str(r.field);
  const before = r.before;
  const after = r.after;
  const bObj = before && typeof before === 'object' && !Array.isArray(before) ? (before as Json) : null;
  const aObj = after && typeof after === 'object' && !Array.isArray(after) ? (after as Json) : null;
  if (bObj || aObj) {
    const keys = Array.from(new Set([...Object.keys(bObj ?? {}), ...Object.keys(aObj ?? {})]));
    return keys
      .filter((k) => JSON.stringify(bObj?.[k] ?? null) !== JSON.stringify(aObj?.[k] ?? null))
      .map((k) => ({ field: k, before: bObj?.[k] ?? null, after: aObj?.[k] ?? null }));
  }
  if (field && (before !== undefined || after !== undefined)) {
    return [{ field, before: before ?? null, after: after ?? null }];
  }
  return [];
}

export function normaliseEvent(raw: unknown): HistoryEvent {
  const r = asObj(raw);
  return {
    at: str(pick(r, 'at', 'created_at')) ?? new Date(0).toISOString(),
    actor_name: str(pick(r, 'actor_name', 'actor_label')),
    actor_kind: normaliseActorKind(str(r.actor_kind)),
    action: str(r.action) ?? '',
    model: str(pick(r, 'model', 'checker_kind')),
    question_id: str(r.question_id),
    question_label: str(pick(r, 'question_label', 'display_number', 'question_number')),
    changes: changesFrom(r),
    note: str(r.note),
    verdict: str(r.verdict),
    confidence: num(r.confidence),
    version: num(r.version),
    to_version: num(pick(r, 'to_version', 'restored_version')),
  };
}

export function normaliseVersion(raw: unknown): QuestionVersion {
  const r = asObj(raw);
  const snap = { ...r, ...asObj(r.snapshot) };
  return {
    version: num(r.version) ?? 0,
    body: str(snap.body) ?? '',
    options: normaliseOptions(snap.options),
    marks: num(snap.marks),
    display_number: str(snap.display_number),
    instructions: str(snap.instructions),
    created_at: str(pick(r, 'created_at', 'at')) ?? new Date(0).toISOString(),
    actor_name: str(pick(r, 'actor_name', 'actor_label')),
    actor_kind: normaliseActorKind(str(r.actor_kind)),
    action: str(pick(r, 'action', 'op')),
    note: str(pick(r, 'note', 'reason')),
  };
}

export function normaliseQuestionHistory(raw: unknown): QuestionHistory {
  const r = asObj(raw);
  return {
    versions: asArr(r.versions).map(normaliseVersion).sort((a, b) => a.version - b.version),
    events: asArr(r.events)
      .map(normaliseEvent)
      .sort((a, b) => b.at.localeCompare(a.at)),
    checks: asArr(r.checks).map((c) => {
      const o = asObj(c);
      return {
        checker_kind: str(o.checker_kind) ?? 'admin',
        model: str(o.model),
        verdict: str(o.verdict) ?? '',
        confidence: num(o.confidence),
        at: str(pick(o, 'at', 'created_at')),
        actor_name: str(o.actor_name),
      };
    }),
  };
}

export function normalisePaperHistory(raw: unknown): HistoryEvent[] {
  const r = raw && typeof raw === 'object' && !Array.isArray(raw) ? asObj(raw).events : raw;
  return asArr(r)
    .map(normaliseEvent)
    .sort((a, b) => b.at.localeCompare(a.at));
}

/** What changed between two versions of one question, as field changes. */
export function versionChanges(older: QuestionVersion | null, newer: QuestionVersion): FieldChange[] {
  if (!older) return [];
  const out: FieldChange[] = [];
  if (older.body !== newer.body) out.push({ field: 'body', before: older.body, after: newer.body });
  if (older.display_number !== newer.display_number)
    out.push({ field: 'display_number', before: older.display_number, after: newer.display_number });
  if (older.marks !== newer.marks) out.push({ field: 'marks', before: older.marks, after: newer.marks });
  if (older.instructions !== newer.instructions)
    out.push({ field: 'instructions', before: older.instructions, after: newer.instructions });
  if (JSON.stringify(older.options) !== JSON.stringify(newer.options))
    out.push({ field: 'options', before: older.options, after: newer.options });
  return out;
}

// ---------------------------------------------------------------------------
// Edits

/** The fields an admin edits on the review page; only changed ones are sent. */
export interface QuestionChanges {
  body?: string;
  display_number?: string | null;
  marks?: number | null;
  options?: ReviewOption[];
}

/** The inline editor's working copy of one question. */
export type Draft = { body: string; number: string; marks: string; options: ReviewOption[] };

export function draftOf(row: ReviewRow): Draft {
  return {
    body: row.body,
    number: row.display_number ?? '',
    marks: row.marks === null ? '' : String(row.marks),
    options: row.options.map((o) => ({ ...o })),
  };
}

/** Only the fields that actually changed, in the contract's p_changes shape. */
export function changesFromDraft(row: ReviewRow, d: Draft): QuestionChanges | 'bad-marks' {
  const out: QuestionChanges = {};
  if (d.body !== row.body) out.body = d.body;
  const num = d.number.trim() === '' ? null : d.number.trim();
  if (num !== (row.display_number ?? null)) out.display_number = num;
  const m = d.marks.trim();
  if (m !== '' && !/^\d+(\.\d+)?$/.test(m)) return 'bad-marks';
  const marks = m === '' ? null : Number(m);
  if (marks !== row.marks) out.marks = marks;
  if (JSON.stringify(d.options) !== JSON.stringify(row.options)) out.options = d.options;
  return out;
}

export interface ApprovalApi {
  queue(): Promise<ApprovalQueueRow[]>;
  review(auditPaperId: string): Promise<PaperReview>;
  /** Returns the live bank paper id. */
  approve(auditPaperId: string, note: string): Promise<string | null>;
  reject(auditPaperId: string, note: string): Promise<void>;
  unpublish(bankPaperId: string, note: string): Promise<void>;
  /** Returns the new version number. */
  editQuestion(questionId: string, version: number, changes: QuestionChanges, note: string): Promise<number | null>;
  revertQuestion(questionId: string, toVersion: number, note: string): Promise<number | null>;
  questionHistory(questionId: string): Promise<QuestionHistory>;
  paperHistory(auditPaperId: string): Promise<HistoryEvent[]>;
}

/** A version number out of whatever an RPC returned: 4, "4", {version: 4}. */
export function versionFrom(data: unknown): number | null {
  const direct = num(data);
  if (direct !== null) return direct;
  const o = asObj(Array.isArray(data) ? data[0] : data);
  return num(pick(o, 'version', 'new_version', 'admin_edit_question', 'admin_revert_question'));
}

/** Plain words for a failed write, never the server's code. */
export function writeErrorWords(e: unknown, fallback: string): string {
  const o = asObj(e);
  const msg = `${str(o.message) ?? ''} ${str(o.details) ?? ''} ${str(o.hint) ?? ''}`.toLowerCase();
  const code = str(o.code) ?? '';
  if (code === '42501' || msg.includes('not authorized')) return 'Your account is not allowed to do this. Sign in as an admin and try again.';
  if (/still open|open question/.test(msg)) return 'Some questions are still open. Each one must be passed or set aside first.';
  if (/version|stale|conflict|changed since/.test(msg))
    return 'Someone else changed this question while you were editing. Reload to see their version, then try again.';
  return fallback;
}
