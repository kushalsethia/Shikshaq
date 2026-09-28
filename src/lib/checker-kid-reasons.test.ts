import { describe, expect, it } from 'vitest';

import {
  kidSentence,
  needsSplit,
  KID_SENTENCE,
  readableCode,
  parseFlagDetail,
  describeFlags,
  NO_PICTURE_TITLE,
  NO_PICTURE_NOTE,
} from './checker-kid-reasons';

/**
 * These sentences are the only thing standing between a raw flag code
 * (`ocr_disagreement`) and a class 9-12 student who is not going to know
 * what that means. A regression that returns the raw code instead of a
 * sentence is invisible in a quick manual click-through (it still "looks
 * like a chip"), so it is worth pinning directly.
 */

// Every reason code the pipeline can put on a kid-bucket question
// (UnlimitedOCR/auditor/contracts/check.schema.json, minus the two
// admin-only vetoes). If the pipeline adds one, add it here and a sentence.
const PIPELINE_KID_CODES = [
  'ocr_disagreement', 'marks_mismatch', 'incomplete_text', 'chapter_unresolved',
  'board_class_mismatch', 'possible_duplicate', 'personal_data_suspected',
  'low_ocr_confidence', 'figure_ambiguous', 'mcq_malformed', 'type_mismatch',
  'numbering_gap', 'empty_body', 'figure_missing', 'short_body', 'missing_marks',
  'display_number_missing', 'unbalanced_math_delim', 'ocr_junk', 'merged_subparts',
  'answer_in_question', 'page_furniture', 'snippet_unaligned', 'ocr_fused',
  'figure_text_mixed', 'other',
];

describe('kidSentence', () => {
  it('translates a known flag reason into plain words', () => {
    expect(kidSentence('marks_mismatch')).toBe('The marks may not match the paper. Check the marks number.');
  });

  it('has a sentence for every code the pipeline produces', () => {
    for (const code of PIPELINE_KID_CODES) {
      expect(KID_SENTENCE[code], code).toBeTruthy();
    }
  });

  it('falls back to a readable version of an unknown code, never the raw code', () => {
    expect(kidSentence('some_future_reason_code')).toBe('Some future reason code');
  });

  it('never contains an em or en dash (CLAUDE.md: no em/en dashes in site copy)', () => {
    for (const sentence of [...Object.values(KID_SENTENCE), NO_PICTURE_TITLE, NO_PICTURE_NOTE]) {
      expect(sentence).not.toMatch(/[–—]/);
    }
  });

  it('uses no pipeline jargon a student would not know', () => {
    for (const sentence of Object.values(KID_SENTENCE)) {
      expect(sentence).not.toMatch(/\b(OCR|ocr|snippet|bbox|delim|enum|flag)\b/);
      expect(sentence).not.toMatch(/_/);
    }
  });

  it('does not expose the two admin-only reasons a kid should never see', () => {
    // ocr_dropout and script_unsupported are vetoed to review_bucket='admin'
    // by classify_review_buckets before a kid-eligible question can ever
    // carry them (GUARDRAILS #34).
    expect(KID_SENTENCE.ocr_dropout).toBeUndefined();
    expect(KID_SENTENCE.script_unsupported).toBeUndefined();
  });
});

describe('readableCode', () => {
  it('turns separators into spaces and capitalises', () => {
    expect(readableCode('ocr_dropout')).toBe('Ocr dropout');
    expect(readableCode('  weird--code..x ')).toBe('Weird code x');
  });

  it('never returns an empty string', () => {
    expect(readableCode('___')).toBe('Something looked wrong.');
  });
});

describe('needsSplit', () => {
  it('is true only when ocr_fused is one of the flags', () => {
    expect(needsSplit(['ocr_fused'])).toBe(true);
    expect(needsSplit(['marks_mismatch', 'ocr_fused'])).toBe(true);
  });

  it('is false for an empty list or unrelated flags', () => {
    expect(needsSplit([])).toBe(false);
    expect(needsSplit(['marks_mismatch'])).toBe(false);
  });
});

describe('parseFlagDetail', () => {
  it('reads the pipeline JSON object shape {code: evidence}', () => {
    const d = parseFlagDetail('{"ocr_junk": "Body shows (jin) (a)", "other": " AI recommends pass "}');
    expect(d.byCode).toEqual({ ocr_junk: 'Body shows (jin) (a)', other: 'AI recommends pass' });
    expect(d.general).toBeNull();
  });

  it('keeps plain text as a general note', () => {
    expect(parseFlagDetail('Question 4 looks cut off')).toEqual({ byCode: {}, general: 'Question 4 looks cut off' });
  });

  it('keeps a JSON string as a general note', () => {
    expect(parseFlagDetail('"just a note"')).toEqual({ byCode: {}, general: 'just a note' });
  });

  it('handles null, empty and malformed input without throwing', () => {
    expect(parseFlagDetail(null)).toEqual({ byCode: {}, general: null });
    expect(parseFlagDetail('   ')).toEqual({ byCode: {}, general: null });
    expect(parseFlagDetail('{"broken":')).toEqual({ byCode: {}, general: '{"broken":' });
    expect(parseFlagDetail('[1,2]')).toEqual({ byCode: {}, general: '[1,2]' });
  });

  it('drops empty and nested values in the object', () => {
    expect(parseFlagDetail('{"a": "", "b": {"x": 1}, "c": 3}').byCode).toEqual({ c: '3' });
  });
});

describe('describeFlags', () => {
  it('lists every reason in order, deduplicated, with its evidence', () => {
    const s = describeFlags(
      ['missing_marks', 'ocr_junk', 'missing_marks'],
      '{"ocr_junk": "Body shows (jin) (a)"}',
    );
    expect(s.lines).toEqual([
      { code: 'missing_marks', sentence: KID_SENTENCE.missing_marks, detail: null },
      { code: 'ocr_junk', sentence: KID_SENTENCE.ocr_junk, detail: 'Body shows (jin) (a)' },
    ]);
    expect(s.note).toBeNull();
  });

  it('keeps evidence for a code that is not in flag_reasons', () => {
    const s = describeFlags(['other'], '{"marks_mismatch": "sums to 22, header says 20"}');
    expect(s.lines.map((l) => l.code)).toEqual(['other', 'marks_mismatch']);
    expect(s.lines[1].detail).toBe('sums to 22, header says 20');
  });

  it('passes a plain-text detail through as the note', () => {
    expect(describeFlags(['other'], 'Check the last line').note).toBe('Check the last line');
  });

  it('is empty for no flags and no detail', () => {
    expect(describeFlags([], null)).toEqual({ lines: [], note: null });
    expect(describeFlags(null, undefined)).toEqual({ lines: [], note: null });
  });
});
