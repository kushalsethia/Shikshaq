import { supabase } from '@/integrations/supabase/client';
import type { ContextRow } from '@/lib/checker-context';
import { mergeQueueRows } from '@/lib/paper-review-filter';

/**
 * Client wrapper for the paper-checker (Kid Mode) and paper-admin RPCs added
 * in supabase/migrations/20260928000000_paper_checker_and_admin.sql.
 *
 * These functions are not yet in src/integrations/supabase/types.ts because
 * that file is generated from the LIVE schema, and this migration has not
 * been applied there yet (the orchestrator applies it -- see W1's log note
 * and CLAUDE.md's Supabase rules). Every call below therefore casts the
 * function name `as never`, the same escape hatch already used in this
 * codebase for `site_counts`, `teacher_own_contact` and
 * `admin_teacher_contacts` (see useSiteCounts.ts / teacher-contact.ts) for
 * exactly this reason: a real RPC that predates the generated types. Once
 * `npm run generate-types` is re-run after the migration ships, these casts
 * can be narrowed or removed -- they are not a sign the calls are wrong.
 */

export interface CheckerQuestion {
  id: string;
  paper_id: string;
  ord: number;
  display_number: string | null;
  number_path: string | null;
  body: string;
  options: { label?: string; text?: string }[] | null;
  marks: number | null;
  instructions: string | null;
  flag_reasons: string[];
  flag_detail: string | null;
  /* W14: English rows also carry `pipeline`, `role`, `stimulus`, `set_text`
     (read through englishContext() in checker-english.ts). */
  /* snippet_object / align_score / whole_snippet_*: the crop of the printed
     paper and how far to trust it (read through checker-pictures.ts). */
  source: ({
    page?: number;
    bbox?: number[];
    dpi?: number;
    snippet_path?: string;
    snippet_object?: string;
    align_score?: number;
  } & Record<string, unknown>) | null;
  subject: string | null;
  school: string | null;
  cls: string | null;
  exam: string | null;
  year: string | null;
}

function rpcRow<T>(data: unknown): T | null {
  const rows = (data ?? []) as unknown;
  const row = Array.isArray(rows) ? rows[0] : rows;
  return (row ?? null) as T | null;
}

function rpcRows<T>(data: unknown): T[] {
  return ((data ?? []) as unknown) as T[];
}

export async function isPaperChecker(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_paper_checker' as never);
  if (error) return false;
  return Boolean(data);
}

export async function checkerNextQuestion(): Promise<CheckerQuestion | null> {
  const { data, error } = await supabase.rpc('checker_next_question' as never);
  if (error) throw error;
  return rpcRow<CheckerQuestion>(data);
}

export async function checkerPassQuestion(questionId: string): Promise<void> {
  const { error } = await supabase.rpc('checker_pass_question' as never, { p_question_id: questionId } as never);
  if (error) throw error;
}

export async function checkerFixQuestion(
  questionId: string,
  patch: { body?: string | null; display_number?: string | null; marks?: number | null },
): Promise<void> {
  const { error } = await supabase.rpc('checker_fix_question' as never, {
    p_question_id: questionId,
    p_body: patch.body ?? null,
    p_display_number: patch.display_number ?? null,
    p_marks: patch.marks ?? null,
  } as never);
  if (error) throw error;
}

export async function checkerSplitQuestion(
  questionId: string,
  bodyBefore: string,
  splitAt: number,
): Promise<{ first_id: string; second_id: string } | null> {
  const { data, error } = await supabase.rpc('checker_split_question' as never, {
    p_question_id: questionId,
    p_body_before: bodyBefore,
    p_split_at: splitAt,
  } as never);
  if (error) throw error;
  return rpcRow<{ first_id: string; second_id: string }>(data);
}

export async function checkerAskForHelp(questionId: string, reason: string): Promise<void> {
  const { error } = await supabase.rpc('checker_ask_for_help' as never, {
    p_question_id: questionId,
    p_reason: reason,
  } as never);
  if (error) throw error;
}

export async function checkerCheckedTodayCount(): Promise<number> {
  const { data, error } = await supabase.rpc('checker_checked_today_count' as never);
  if (error) return 0;
  return Number(data) || 0;
}

export async function checkerSkipQuestion(questionId: string): Promise<void> {
  const { error } = await supabase.rpc('checker_skip_question' as never, { p_question_id: questionId } as never);
  if (error) throw error;
}

export interface CheckerStats {
  today_count: number;
  total_count: number;
}

export async function checkerMyStats(): Promise<CheckerStats> {
  const { data, error } = await supabase.rpc('checker_my_stats' as never);
  if (error) throw error;
  return rpcRow<CheckerStats>(data) ?? { today_count: 0, total_count: 0 };
}

export interface LeaderboardRow {
  rank: number;
  first_name: string;
  weekly_count: number;
}

export async function checkerLeaderboard(): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase.rpc('checker_leaderboard' as never);
  if (error) throw error;
  return rpcRows<LeaderboardRow>(data);
}

export interface CheckerPreferences {
  subjects: string[] | null;
  classes: string[] | null;
}

export async function checkerGetPreferences(): Promise<CheckerPreferences> {
  const { data, error } = await supabase.rpc('checker_get_preferences' as never);
  if (error) throw error;
  return rpcRow<CheckerPreferences>(data) ?? { subjects: null, classes: null };
}

export async function checkerSetPreferences(subjects: string[], classes: string[]): Promise<void> {
  const { error } = await supabase.rpc('checker_set_preferences' as never, {
    p_subjects: subjects,
    p_classes: classes,
  } as never);
  if (error) throw error;
}

/**
 * The whole question a sub-part belongs to (parent + every part, in paper
 * order), from checker_question_context in
 * 20260928160000_checker_question_context.sql. Same gate as the other
 * checker RPCs: only the lease holder or an admin. Returns [] when the
 * question is not part of a larger one, AND when the call fails (for
 * example before that migration is applied): the extra context is a help,
 * never a reason to block checking.
 */
export async function checkerQuestionContext(questionId: string): Promise<ContextRow[]> {
  const { data, error } = await supabase.rpc('checker_question_context' as never, {
    p_question_id: questionId,
  } as never);
  if (error) return [];
  return rpcRows<ContextRow>(data);
}

/** A 10-minute signed URL for one object in the private audit-figures
 *  bucket (a path planned by planCheckerPicture in checker-pictures.ts).
 *  Null on any failure: the page then shows the "no picture" note. */
export function checkerPictureUrl(path: string): Promise<string | null> {
  return supabase.storage
    .from('audit-figures')
    .createSignedUrl(path, 600)
    .then(({ data, error }) => (error ? null : data?.signedUrl ?? null))
    .catch(() => null);
}

// ---------------------------------------------------------------------------
// Admin

export interface PaperQueueRow {
  paper_id: string;
  title: string;
  school: string;
  subject: string;
  cls: string;
  board: string;
  year: string;
  needs_review: boolean;
  is_published: boolean;
  incomplete_note: string | null;
  audit_paper_id: string | null;
  escalated_count: number;
  total_questions: number;
  passed_questions: number;
}

export async function adminPaperQueue(): Promise<PaperQueueRow[]> {
  // PostgREST caps every response at 1000 rows, RPCs included, so one call
  // silently returned 1000 of the 1,960 papers ("Needs review: 1000" instead
  // of 1,341). Page until a short page comes back.
  //
  // Paging needs a total order, or a page boundary can drop or repeat a row:
  // the function's own order tied on two audit copies of one paper. So the
  // pages are cut over an explicit (paper_id, audit_paper_id) order, and the
  // rows are merged to one per paper before anyone counts them
  // (paper-review-filter.ts has the whole story).
  const PAGE = 1000;
  const all: PaperQueueRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .rpc('admin_paper_queue' as never)
      .order('paper_id' as never, { ascending: true })
      .order('audit_paper_id' as never, { ascending: true, nullsFirst: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const rows = rpcRows<PaperQueueRow>(data);
    all.push(...rows);
    if (rows.length < PAGE) return mergeQueueRows(all);
  }
}

export interface EscalationRow {
  question_id: string;
  paper_id: string;
  live_bank_paper_id: string | null;
  display_number: string | null;
  body: string;
  flag_reasons: string[];
  school: string | null;
  subject: string | null;
  cls: string | null;
  updated_at: string;
}

export async function adminEscalationQueue(): Promise<EscalationRow[]> {
  const { data, error } = await supabase.rpc('admin_escalation_queue' as never);
  if (error) throw error;
  return rpcRows<EscalationRow>(data);
}

export async function adminResolveEscalation(
  questionId: string,
  patch: { body?: string | null; display_number?: string | null; marks?: number | null } = {},
): Promise<void> {
  const { error } = await supabase.rpc('admin_resolve_escalation' as never, {
    p_question_id: questionId,
    p_body: patch.body ?? null,
    p_display_number: patch.display_number ?? null,
    p_marks: patch.marks ?? null,
  } as never);
  if (error) throw error;
}

export interface CheckerRow {
  user_id: string;
  email: string | null;
  active: boolean;
  granted_at: string;
  passed_count: number;
  fixed_count: number;
  split_count: number;
  escalated_count: number;
}

export interface CheckerLogRow {
  at: string;
  actor_user_id: string;
  actor_name: string;
  action: string;
  school: string | null;
  subject: string | null;
  cls: string | null;
  year: string | null;
  live_bank_paper_id: string | null;
  question_number: string | null;
  note: string | null;
}

/** Who did what, newest first (admin_checker_log, admin-only). */
export async function adminCheckerLog(limit = 300): Promise<CheckerLogRow[]> {
  const { data, error } = await supabase.rpc('admin_checker_log' as never, { p_limit: limit } as never);
  if (error) throw error;
  return rpcRows<CheckerLogRow>(data);
}

export async function adminListCheckers(): Promise<CheckerRow[]> {
  const { data, error } = await supabase.rpc('admin_list_checkers' as never);
  if (error) throw error;
  return rpcRows<CheckerRow>(data);
}

export async function adminGrantPaperChecker(userId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_grant_paper_checker' as never, { p_user_id: userId } as never);
  if (error) throw error;
}

export async function adminRevokePaperChecker(userId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_revoke_paper_checker' as never, { p_user_id: userId } as never);
  if (error) throw error;
}

export async function adminEditBankPaper(paperId: string, field: string, value: string): Promise<void> {
  const { error } = await supabase.rpc('admin_edit_bank_paper' as never, {
    p_paper_id: paperId,
    p_field: field,
    p_value: value,
  } as never);
  if (error) throw error;
}

export async function adminEditBankQuestion(questionId: string, field: string, value: string): Promise<void> {
  const { error } = await supabase.rpc('admin_edit_bank_question' as never, {
    p_question_id: questionId,
    p_field: field,
    p_value: value,
  } as never);
  if (error) throw error;
}

export async function adminHideBankPaper(paperId: string, reason: string): Promise<void> {
  const { error } = await supabase.rpc('admin_hide_bank_paper' as never, {
    p_paper_id: paperId,
    p_reason: reason,
  } as never);
  if (error) throw error;
}

export async function adminRestoreBankPaper(paperId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_restore_bank_paper' as never, { p_paper_id: paperId } as never);
  if (error) throw error;
}

export interface RevisionRow {
  id: number;
  table_name: 'bank_papers' | 'bank_questions';
  row_id: string;
  action: string;
  field: string | null;
  before: unknown;
  after: unknown;
  actor: string;
  source: string;
  reason: string | null;
  created_at: string;
}

export async function adminPaperHistory(paperId: string): Promise<RevisionRow[]> {
  const { data, error } = await supabase.rpc('admin_paper_history' as never, { p_paper_id: paperId } as never);
  if (error) throw error;
  return rpcRows<RevisionRow>(data);
}

export async function adminUndoRevision(revisionId: number, force = false): Promise<void> {
  const { error } = await supabase.rpc('admin_undo_revision' as never, {
    p_revision_id: revisionId,
    p_force: force,
  } as never);
  if (error) throw error;
}

export async function adminReapplyPaperToLive(auditPaperId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_reapply_paper_to_live' as never, {
    p_audit_paper_id: auditPaperId,
  } as never);
  if (error) throw error;
}

export interface UserSearchRow {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  is_checker: boolean;
  checker_active: boolean;
}

export async function adminSearchUsers(query: string): Promise<UserSearchRow[]> {
  const { data, error } = await supabase.rpc('admin_search_users' as never, { p_query: query } as never);
  if (error) throw error;
  return rpcRows<UserSearchRow>(data);
}

export async function adminMergeBankQuestions(firstId: string, secondId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_merge_bank_questions' as never, {
    p_first_id: firstId,
    p_second_id: secondId,
  } as never);
  if (error) throw error;
}

export async function adminDeleteBankQuestion(questionId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_bank_question' as never, { p_question_id: questionId } as never);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Admin paper edit page (W12, supabase/migrations/20260928170000_admin_paper_edit.sql).
// Edits go to the draft (audit_questions), never to bank_questions: Verify
// carries them to readers through the chokepoint.

export interface DraftRow {
  paper_id: string;
  school: string | null;
  subject: string | null;
  cls: string | null;
  board: string | null;
  year: string | null;
  exam: string | null;
  needs_review: boolean;
  is_published: boolean;
  incomplete_note: string | null;
  general_instructions: string | null;
  allowed_time_minutes: number | null;
  audit_paper_id: string | null;
  paper_passed: boolean | null;
  is_red: boolean | null;
  red_reason: string | null;
  /** File name of the printed paper (20260928230000); undefined before that migration. */
  source_pdf?: string | null;
  question_id: string | null;
  ord: number | null;
  kind: string | null;
  parent_id: string | null;
  number_path: string | null;
  display_number: string | null;
  body: string | null;
  options: { label?: string; text?: string }[] | null;
  marks: number | null;
  instructions: string | null;
  question_passed: boolean | null;
  status: string | null;
  review_bucket: string | null;
  flag_reasons: string[] | null;
  flag_detail: string | null;
  source: { page?: number; bbox?: number[]; dpi?: number; snippet_path?: string } | null;
  live_bank_question_id: string | null;
  updated_at: string | null;
}

export async function adminPaperDraft(paperId: string): Promise<DraftRow[]> {
  const { data, error } = await supabase.rpc('admin_paper_draft' as never, { p_paper_id: paperId } as never);
  if (error) throw error;
  return rpcRows<DraftRow>(data);
}

export interface SavedDraftQuestion {
  id: string;
  body: string;
  display_number: string | null;
  marks: number | null;
  updated_at: string;
}

/** Postgres SQLSTATE the save RPC raises when the stored text no longer
 *  matches what the page last saw (someone else changed it). */
export const DRAFT_CONFLICT_CODE = '40001';

export async function adminSaveDraftQuestion(
  questionId: string,
  fields: { body: string; display_number: string | null; marks: number | null },
  bodyBefore: string,
): Promise<SavedDraftQuestion | null> {
  const { data, error } = await supabase.rpc('admin_save_draft_question' as never, {
    p_question_id: questionId,
    p_body: fields.body,
    p_display_number: fields.display_number,
    p_marks: fields.marks,
    p_body_before: bodyBefore,
  } as never);
  if (error) throw error;
  return rpcRow<SavedDraftQuestion>(data);
}

export interface VerifyPaperResult {
  audit_paper_id: string;
  questions_total: number;
  questions_newly_passed: number;
  is_live: boolean;
  needs_review: boolean;
  is_published: boolean;
  skipped_count: number;
  unplaced_count: number;
  not_on_live_count: number;
  reason: string | null;
}

export async function adminVerifyPaper(paperId: string): Promise<VerifyPaperResult | null> {
  const { data, error } = await supabase.rpc('admin_verify_paper' as never, { p_paper_id: paperId } as never);
  if (error) throw error;
  return rpcRow<VerifyPaperResult>(data);
}

/** Signed URLs for many question snippets in ONE request (the Kid Mode page
 *  signs one at a time; a paper can have fifty questions). A missing file
 *  simply has no entry. Path shape '<paper_id>/<question_id>.png', as in
 *  audit_questions.source.snippet_object. */
export async function snippetUrls(auditPaperId: string, questionIds: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (questionIds.length === 0) return out;
  const paths = questionIds.map((id) => `${auditPaperId}/${id}.png`);
  const { data, error } = await supabase.storage.from('audit-figures').createSignedUrls(paths, 600);
  if (error || !data) return out;
  data.forEach((d, i) => {
    if (!d.error && d.signedUrl) out.set(questionIds[i], d.signedUrl);
  });
  return out;
}
