/**
 * Plain words for the admin Activity page and the version history panel.
 * Pure, so it is tested without a login. No em or en dashes in any copy.
 */

/** What an action means, in a few words. Unknown actions fall back to their code, de-underscored. */
const ACTION_WORDS: Record<string, string> = {
  checker_pass: 'Marked a question as right',
  checker_fix: 'Fixed a reading mistake',
  checker_printed_typo: 'Corrected a typo printed on the paper',
  checker_skip: 'Skipped a question',
  checker_split: 'Split a question in two',
  checker_ask_help: 'Asked for help',
  check_pass: 'Check: looks right',
  check_fix: 'Check: needs a fix',
  check_printed_typo: 'Check: printed typo',
  check_escalate: 'Check: sent up',
  check_flag: 'Check: flagged',
  version_insert: 'New question or paper',
  version_update: 'Text changed',
  version_revert: 'Reverted to an earlier version',
  version_delete: 'Deleted',
  ai_fix: 'The computer fixed the text',
  ai_pass: 'The computer passed it',
  ai_escalate: 'The computer sent it to an admin',
  ai_verdict: 'The computer gave a verdict',
  ai_flagged: 'The computer flagged it',
  reclassify: 'Moved between review piles',
  route_back_unverified_page: 'Sent back: page not verified',
};

export function actionWords(action: string): string {
  if (ACTION_WORDS[action]) return ACTION_WORDS[action];
  const words = action.replace(/_/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Something happened';
}

/** A short form of an id for a list: the first 8 characters. Ids only, never a name or an email. */
export function shortId(id: string | null | undefined): string {
  if (!id) return '';
  return id.length > 8 ? id.slice(0, 8) : id;
}

/** Who did it, for a list row: a kind word plus an id or a label. */
export function actorText(row: {
  actor_user_id: string | null;
  actor_label: string | null;
  actor_kind: string;
}): { kind: string; who: string; full: string } {
  const kind = KIND_WORDS[row.actor_kind] ?? row.actor_kind;
  if (row.actor_user_id) return { kind, who: shortId(row.actor_user_id), full: row.actor_user_id };
  const label = row.actor_label ?? row.actor_kind ?? 'system';
  return { kind, who: label, full: label };
}

const KIND_WORDS: Record<string, string> = {
  checker: 'Checker',
  admin: 'Admin',
  ai: 'Computer',
  pipeline: 'Pipeline',
  system: 'System',
  person: 'Person',
};

/** The table a row lives in, said plainly. */
export function tableWords(table: string | null | undefined): string {
  switch (table) {
    case 'audit_questions':
      return 'Draft question';
    case 'bank_questions':
      return 'Live question';
    case 'audit_papers':
      return 'Draft paper';
    case 'bank_papers':
      return 'Live paper';
    default:
      return 'Question';
  }
}

/** True when a version history can be opened for this row (questions only). */
export function canOpenHistory(row: { table_name: string | null; question_id: string | null }): boolean {
  return Boolean(row.question_id) && (row.table_name === 'audit_questions' || row.table_name === 'bank_questions');
}

export function opWords(op: string): string {
  switch (op) {
    case 'backfill':
      return 'As it was before the first recorded change';
    case 'insert':
      return 'Created';
    case 'update':
      return 'Changed';
    case 'revert':
      return 'Reverted';
    case 'delete':
      return 'Deleted';
    default:
      return op;
  }
}

/** Fields whose values differ between two snapshots, in a stable order. */
export function changedFields(
  older: Record<string, unknown> | null | undefined,
  newer: Record<string, unknown> | null | undefined,
): string[] {
  const a = older ?? {};
  const b = newer ?? {};
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).sort();
  return keys.filter((k) => JSON.stringify(a[k] ?? null) !== JSON.stringify(b[k] ?? null));
}

/** A snapshot value as text, verbatim for strings (question text is never altered for display). */
export function valueText(v: unknown): string {
  if (v === null || v === undefined) return '(empty)';
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/** Fields an admin is shown first in a version, when present. */
export const PRIMARY_FIELDS = ['body', 'display_number', 'marks', 'options'] as const;

/** Whether "revert to this version" is offered: not the current one, not a deletion. */
export function canRevert(row: { is_current: boolean; op: string }): boolean {
  return !row.is_current && row.op !== 'delete';
}

export function revertConfirmText(version: number, currentVersion: number | null): string {
  const next = currentVersion != null ? ` It becomes version ${currentVersion + 1}.` : '';
  return `Put back the text of version ${version}?${next} Nothing is deleted: every version stays in this history.`;
}
