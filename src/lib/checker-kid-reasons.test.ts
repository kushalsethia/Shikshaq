import { describe, expect, it } from 'vitest';

import { kidSentence, needsSplit, KID_SENTENCE } from './checker-kid-reasons';

/**
 * These sentences are the only thing standing between a raw flag code
 * (`ocr_disagreement`) and a class 9-12 student who is not going to know
 * what that means. A regression that returns the raw code instead of a
 * sentence is invisible in a quick manual click-through (it still "looks
 * like a chip"), so it is worth pinning directly.
 */

describe('kidSentence', () => {
  it('translates a known flag reason into plain words', () => {
    expect(kidSentence('marks_mismatch')).toBe('The marks might be wrong. Check the number in the box.');
  });

  it('falls back to the raw code for an unknown reason, never throwing', () => {
    expect(kidSentence('some_future_reason_code')).toBe('some_future_reason_code');
  });

  it('never contains an em or en dash (CLAUDE.md: no em/en dashes in site copy)', () => {
    for (const sentence of Object.values(KID_SENTENCE)) {
      expect(sentence).not.toMatch(/[–—]/);
    }
  });

  it('does not expose the two admin-only reasons a kid should never see', () => {
    // ocr_dropout and script_unsupported are vetoed to review_bucket='admin'
    // by classify_review_buckets.sql before a kid-eligible question can ever
    // carry them (GUARDRAILS #34) -- this module intentionally omits both so
    // a future kid-facing surface can't accidentally add a friendly label to
    // a code that is never supposed to reach it.
    expect(KID_SENTENCE.ocr_dropout).toBeUndefined();
    expect(KID_SENTENCE.script_unsupported).toBeUndefined();
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
