/**
 * D66: pure rendering-decision helpers for BankPaper.tsx's new fields
 * (allowed time, general instructions, display_number, question-level
 * instructions, incomplete_note). Extracted so the fallback/gating logic is
 * testable without mounting the page (which needs a live Supabase session).
 */

/** The number shown on a question's badge: the recorded display_number wins
 *  over the client-derived a/b/c run lettering, which in turn wins over the
 *  raw printed number. Returns null when none of the three exist, meaning
 *  the badge should not render at all. */
export function resolveDisplayNumber(
  displayNumber: string | null | undefined,
  computedFallback: string | undefined,
  rawNumber: string | null,
): string | null {
  return displayNumber || computedFallback || rawNumber || null;
}

/** Whether the paper-level "allowed time / general instructions" block
 *  should render at all -- most papers have neither. */
export function showPaperExtras(
  allowedTimeMinutes: number | null,
  generalInstructions: string | null,
): boolean {
  return Boolean(allowedTimeMinutes) || Boolean(generalInstructions);
}

/** The small incomplete-paper note shows only when the source paper itself
 *  was recorded as incomplete -- never inferred from anything else. */
export function showIncompleteNote(incompleteNote: string | null): boolean {
  return Boolean(incompleteNote);
}

/** Whether a question's own instructions line should render -- distinct
 *  from the paper-level ones above, and from the question's body text. */
export function showQuestionInstructions(instr: string | null | undefined): boolean {
  return Boolean(instr);
}
