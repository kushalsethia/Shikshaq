/**
 * "My work": the checker's current paper and how far through it they are.
 * Pure shaping and arithmetic over checker_my_assignment() rows
 * (20261007100000), so the page and the tests share one set of rules.
 */

export interface MyAssignment {
  assignment_id: number;
  paper_id: string;
  subject: string | null;
  school: string | null;
  cls: string | null;
  exam: string | null;
  year: string | null;
  /** True when the HOD gave this paper, false when it was handed out automatically. */
  given_by_hod: boolean;
  started_at: string | null;
  /** Questions of this paper the checker has already dealt with. */
  done_count: number;
  /** Questions of this paper still open. */
  remaining_count: number;
  /** Other papers lined up behind this one. */
  queued_count: number;
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null);
const count = (v: unknown): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

/** One row of checker_my_assignment(), or null for nothing assigned. */
export function normaliseAssignment(raw: unknown): MyAssignment | null {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  const paper = str(r.paper_id);
  if (!paper) return null;
  return {
    assignment_id: count(r.assignment_id),
    paper_id: paper,
    subject: str(r.subject),
    school: str(r.school),
    cls: str(r.cls),
    exam: str(r.exam),
    year: str(r.year),
    given_by_hod: r.given_by_hod === true || r.given_by_hod === 'true',
    started_at: str(r.started_at),
    done_count: count(r.done_count),
    remaining_count: count(r.remaining_count),
    queued_count: count(r.queued_count),
  };
}

export interface PaperProgress {
  /** The question being looked at: done + 1, never past the total. */
  position: number;
  total: number;
  /** 0 to 100, how much of the paper is behind the checker. */
  percent: number;
  label: string;
}

/** "Question 4 of 12": the total is done + remaining, the position is done + 1. */
export function paperProgress(a: Pick<MyAssignment, 'done_count' | 'remaining_count'>): PaperProgress {
  const done = Math.max(0, Math.floor(a.done_count));
  const remaining = Math.max(0, Math.floor(a.remaining_count));
  const total = Math.max(done + remaining, 1);
  const position = Math.min(done + 1, total);
  const percent = Math.round((Math.min(done, total) / total) * 100);
  return { position, total, percent, label: `Question ${position} of ${total}` };
}

/** "Mathematics, Class X, Sample School, 2025", leaving out what is not known. */
export function paperLabel(p: {
  subject?: string | null;
  cls?: string | null;
  school?: string | null;
  year?: string | null;
}): string {
  const parts = [p.subject, p.cls ? `Class ${p.cls}` : null, p.school, p.year && p.year !== 'year-unknown' ? p.year : null]
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean);
  return parts.length ? parts.join(', ') : 'Paper';
}

export const GIVEN_BY_HOD = 'Given by your HOD';
