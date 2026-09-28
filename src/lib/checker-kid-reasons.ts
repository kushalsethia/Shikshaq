/**
 * Kid-language mapping for flag reason codes, ported from the standalone
 * auditor's lib/kid-reasons.ts (UnlimitedOCR/auditor/web/src). Only the
 * kid-eligible reasons are kept here -- `ocr_dropout` and
 * `script_unsupported` are deliberately admin-only per the classifier veto
 * (Shikshaq CLAUDE.md references GUARDRAILS #34; a question flagged only
 * with one of those never reaches review_bucket='kid'), so a raw code
 * would only ever appear here as this module's own fallback, never as a
 * genuine Kid Mode state.
 */

export const KID_SENTENCE: Record<string, string> = {
  ocr_disagreement: 'Two computer readings disagreed. Check the words carefully.',
  marks_mismatch: 'The marks might be wrong. Check the number in the box.',
  incomplete_text: 'Some words might be missing at the end.',
  chapter_unresolved: 'Not sure which chapter this is from.',
  board_class_mismatch: 'This might be filed under the wrong class or board.',
  possible_duplicate: 'This question might already be in the system.',
  personal_data_suspected: 'This might have a real name or phone number in it. Check carefully.',
  low_ocr_confidence: 'The computer was not very sure about these words.',
  figure_ambiguous: 'Not sure which picture goes with this.',
  mcq_malformed: 'The multiple choice options look mixed up.',
  type_mismatch: 'This might be marked as the wrong kind of question.',
  numbering_gap: 'A question number seems to be missing.',
  empty_body: 'This question has no text yet.',
  figure_missing: 'This question needs a picture and there is not one.',
  short_body: 'This looks shorter than a full question. Check it was not cut off.',
  missing_marks: 'No marks number is set yet.',
  display_number_missing: 'No question number is set yet.',
  unbalanced_math_delim: 'A maths symbol might be missing its matching pair.',
  ocr_junk: 'Some letters look like computer noise, not real words.',
  merged_subparts: 'This might actually be two questions stuck together.',
  answer_in_question: 'The answer might have accidentally been typed into the question.',
  page_furniture: "Some page text like 'Page 2 of 9' got mixed in. Delete it.",
  snippet_unaligned: 'The photo for this question could not be lined up automatically.',
  ocr_fused: 'A few questions got stuck together. Split them.',
  figure_text_mixed: 'This might be a picture, or real words, or both. Check the photo.',
  other: 'Something else. See the note below.',
};

export function kidSentence(reason: string): string {
  return KID_SENTENCE[reason] ?? reason;
}

/** Shows the "Split here" affordance for the one reason that means the OCR
 * fused two printed questions into one row. */
export function needsSplit(flagReasons: string[]): boolean {
  return flagReasons.includes('ocr_fused');
}
