/**
 * How many questions of a paper a signed-out reader gets.
 *
 * ⚠ THIS MUST MATCH THE DATABASE. The real gate is the `limit` inside
 * public.bank_paper_questions(), which decides from auth.uid() server-side --
 * this constant only exists so the copy that promises a number says the same
 * number. Changing one without the other makes the product lie to the reader.
 *
 * It was six hardcoded "five"s across six files: the papers announcement, the
 * browse nudge, the footer sentence, the product tour, About, and BankPaper's
 * own meta description. Migration 20260917120001 drops the gate from 5 to 2,
 * and without this every one of those would have kept advertising five
 * questions that no longer arrive -- which is worse than a stale number,
 * because a reader who counts is being told something untrue by the page that
 * just withheld the rest.
 *
 * WHEN 20260917120001 IS APPLIED, change both values here in the same deploy.
 * See docs/SUPABASE_RUNBOOK.md, step 2.
 */
export const FREE_PREVIEW_QUESTIONS = 5;

/** The same number as a word, for running prose. */
export const FREE_PREVIEW_WORD = 'five';
