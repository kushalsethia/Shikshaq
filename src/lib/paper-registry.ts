/* The paper registry, as /admin/pipeline reads it.

   public.paper_registry (supabase/migrations/20261005140000_paper_registry.sql)
   holds one row per source PDF the pipeline knows about, processed or not.
   The desk writes it; the site only reads it, through two admin-only RPCs:
   admin_paper_registry_summary() and admin_paper_registry(...). Names, ids and
   counts only: no question text and no answer keys ever reach this page.

   This file is the shapes plus the small pure helpers (labels, counters,
   merging pages), kept out of the component so the arithmetic has tests. The
   panel reads through one PaperRegistryApi object (real one in
   paper-registry-api.ts) so dummy mode (D75) can hand it a fake. */

export const PROCESSED_STATES = [
  'not_started',
  'ocr_queued',
  'ocr_done',
  'loaded',
  'ai_checked',
  'fully_checked',
  'awaiting_approval',
  'live',
] as const;

export type ProcessedState = (typeof PROCESSED_STATES)[number];

export function isProcessedState(s: unknown): s is ProcessedState {
  return typeof s === 'string' && (PROCESSED_STATES as readonly string[]).includes(s);
}

interface StateLook {
  /** Plain-words name shown to the admin. */
  label: string;
  /** One line on what it means, for tooltips and the key. */
  hint: string;
  /** Solid colour of this state's slice of the stacked bar. */
  bar: string;
  /** Badge fill and text. */
  pill: string;
  /** Dot inside the badge. */
  dot: string;
}

export const STATE_LOOK: Record<ProcessedState, StateLook> = {
  not_started: {
    label: 'Not started',
    hint: 'The PDF is known but nothing has been done with it yet.',
    bar: 'bg-rose-500',
    pill: 'bg-rose-100 text-rose-900',
    dot: 'bg-rose-600',
  },
  ocr_queued: {
    label: 'Reading pages',
    hint: 'Queued for, or in the middle of, reading the pages.',
    bar: 'bg-amber-300',
    pill: 'bg-amber-100 text-amber-900',
    dot: 'bg-amber-600',
  },
  ocr_done: {
    label: 'Pages read',
    hint: 'The pages are read but the paper is not on the desk yet.',
    bar: 'bg-amber-500',
    pill: 'bg-amber-100 text-amber-900',
    dot: 'bg-amber-700',
  },
  loaded: {
    label: 'On the desk',
    hint: 'Loaded to the desk, waiting for its checks.',
    bar: 'bg-sky-400',
    pill: 'bg-sky-100 text-sky-900',
    dot: 'bg-sky-600',
  },
  ai_checked: {
    label: 'AI checked',
    hint: 'The AI pass is done. Students and admin still have questions to clear.',
    bar: 'bg-blue-500',
    pill: 'bg-blue-100 text-blue-900',
    dot: 'bg-blue-600',
  },
  fully_checked: {
    label: 'Checked',
    hint: 'Every question is cleared.',
    bar: 'bg-indigo-500',
    pill: 'bg-indigo-100 text-indigo-900',
    dot: 'bg-indigo-600',
  },
  awaiting_approval: {
    label: 'Waiting for approval',
    hint: 'Checked, and waiting for an admin to approve it.',
    bar: 'bg-violet-500',
    pill: 'bg-violet-100 text-violet-900',
    dot: 'bg-violet-600',
  },
  live: {
    label: 'On the site',
    hint: 'Published in the library.',
    bar: 'bg-emerald-500',
    pill: 'bg-mint text-[#24603D]',
    dot: 'bg-[#24603D]',
  },
};

export function stateLabel(s: string | null | undefined): string {
  return isProcessedState(s) ? STATE_LOOK[s].label : 'Not started';
}

/** One row of admin_paper_registry(): explicit columns, no question text. */
export interface RegistryRow {
  registry_key: string;
  pdf_name: string | null;
  board: string | null;
  class: string | null;
  subject: string | null;
  year: string | null;
  school: string | null;
  ocr_state: string | null;
  processed_state: ProcessedState;
  audit_paper_id: string | null;
  bank_paper_id: string | null;
  source: string | null;
  questions_total: number | null;
  questions_passed: number | null;
  open_student: number | null;
  open_admin: number | null;
  approval_state: string | null;
  frozen: boolean;
  excluded: boolean;
  updated_at: string | null;
}

export interface RegistryPage {
  total: number;
  rows: RegistryRow[];
}

export interface RegistrySubjectCounts {
  subject: string;
  total: number;
  by_state: Partial<Record<ProcessedState, number>>;
}

/** What admin_paper_registry_summary() returns. */
export interface RegistrySummary {
  total: number;
  by_state: Partial<Record<ProcessedState, number>>;
  by_subject: RegistrySubjectCounts[];
  by_board: Record<string, number>;
  frozen: number;
  excluded: number;
  last_updated_at: string | null;
}

export interface RegistryQuery {
  state: ProcessedState | null;
  search: string;
  subject: string | null;
  limit: number;
  offset: number;
}

export interface PaperRegistryApi {
  summary(): Promise<RegistrySummary>;
  list(q: RegistryQuery): Promise<RegistryPage>;
}

export const REGISTRY_PAGE_SIZE = 50;

/** Count for one state, never undefined, never negative. */
export function stateCount(summary: Pick<RegistrySummary, 'by_state'>, s: ProcessedState): number {
  return Math.max(0, Number(summary.by_state?.[s]) || 0);
}

/** The three headline numbers: not started, in progress, on the site. */
export function headlineCounts(summary: Pick<RegistrySummary, 'total' | 'by_state'>) {
  const notStarted = stateCount(summary, 'not_started');
  const live = stateCount(summary, 'live');
  const inProgress = PROCESSED_STATES.filter((s) => s !== 'not_started' && s !== 'live')
    .reduce((n, s) => n + stateCount(summary, s), 0);
  return { notStarted, inProgress, live, total: Math.max(0, Number(summary.total) || 0) };
}

/** Bar slices in pipeline order, empty states dropped, widths as percent of the total. */
export function barSegments(summary: Pick<RegistrySummary, 'total' | 'by_state'>) {
  const total = headlineCounts(summary).total;
  return PROCESSED_STATES.map((s) => ({ state: s, count: stateCount(summary, s) }))
    .filter((x) => x.count > 0)
    .map((x) => ({ ...x, widthPct: total > 0 ? (x.count / total) * 100 : 0 }));
}

/** Whole-number percent of part in whole; 0 when whole is 0, never NaN. */
export function percent(part: number, whole: number): number {
  if (!whole || whole <= 0) return 0;
  return Math.round((Math.max(0, part) / whole) * 100);
}

/** Subjects for the filter, each with how many papers it holds in the chosen state. */
export function subjectOptions(summary: Pick<RegistrySummary, 'by_subject'>, state: ProcessedState | null) {
  return (summary.by_subject ?? [])
    .map((s) => ({
      subject: s.subject,
      count: state ? Math.max(0, Number(s.by_state?.[state]) || 0) : Math.max(0, Number(s.total) || 0),
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

/** Adds the next page to what is already shown, skipping any repeated row. */
export function mergeRows(prev: RegistryRow[], next: RegistryRow[]): RegistryRow[] {
  const seen = new Set(prev.map((r) => r.registry_key));
  return [...prev, ...next.filter((r) => !seen.has(r.registry_key))];
}

export function hasMore(total: number, shown: number): boolean {
  return shown < total;
}

/** A row's display name: the PDF, or its key when the PDF name was not sent. */
export function rowTitle(r: Pick<RegistryRow, 'pdf_name' | 'registry_key'>): string {
  return r.pdf_name?.trim() || r.registry_key;
}

/** "ICSE, Class X, Physics, 2025" with whatever is known, no stray commas. */
export function rowFacts(r: Pick<RegistryRow, 'board' | 'class' | 'subject' | 'year' | 'school'>): string {
  return [r.board, r.class ? `Class ${r.class}` : null, r.subject, r.year, r.school]
    .map((x) => (x ?? '').trim())
    .filter(Boolean)
    .join(', ');
}

/** "12 of 40 questions cleared", or '' when the desk has not counted yet. */
export function questionsLine(r: Pick<RegistryRow, 'questions_total' | 'questions_passed'>): string {
  const total = r.questions_total;
  if (total == null || total <= 0) return '';
  const passed = Math.min(Math.max(0, r.questions_passed ?? 0), total);
  return `${passed} of ${total} questions cleared`;
}

/** The admin review page for a paper, only when the registry knows its audit id. */
export function adminPaperHref(r: Pick<RegistryRow, 'audit_paper_id'>): string | null {
  return r.audit_paper_id ? `/admin/paper-approvals/${r.audit_paper_id}` : null;
}

/** Open-question count as shown in a cell: a number, or an en-dash-free "n/a". */
export function openCount(n: number | null | undefined): string {
  return n == null ? 'n/a' : String(Math.max(0, n));
}
