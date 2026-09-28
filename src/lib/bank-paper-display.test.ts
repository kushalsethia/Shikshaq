import { describe, expect, it } from 'vitest';
import {
  resolveDisplayNumber,
  showPaperExtras,
  showIncompleteNote,
  showQuestionInstructions,
} from './bank-paper-display';

describe('resolveDisplayNumber (D66)', () => {
  it('prefers the recorded display_number over everything else', () => {
    expect(resolveDisplayNumber('2a', '1', '1')).toBe('2a');
  });

  it('falls back to the computed a/b/c run lettering when no display_number', () => {
    expect(resolveDisplayNumber(null, '1a', '1')).toBe('1a');
    expect(resolveDisplayNumber(undefined, '1a', '1')).toBe('1a');
  });

  it('falls back to the raw printed number when neither of the above exist', () => {
    expect(resolveDisplayNumber(null, undefined, '3')).toBe('3');
  });

  it('returns null (no badge) when nothing is known', () => {
    expect(resolveDisplayNumber(null, undefined, null)).toBeNull();
    expect(resolveDisplayNumber('', undefined, null)).toBeNull();
  });
});

describe('showPaperExtras (D66)', () => {
  it('is true when allowed time is set', () => {
    expect(showPaperExtras(45, null)).toBe(true);
  });

  it('is true when general instructions are set', () => {
    expect(showPaperExtras(null, 'Answer all questions in Section A.')).toBe(true);
  });

  it('is false when neither is set', () => {
    expect(showPaperExtras(null, null)).toBe(false);
  });
});

describe('showIncompleteNote (D66)', () => {
  it('is true only when a note is recorded', () => {
    expect(showIncompleteNote('Pages 4-5 are missing from the source scan.')).toBe(true);
    expect(showIncompleteNote(null)).toBe(false);
    expect(showIncompleteNote('')).toBe(false);
  });
});

describe('showQuestionInstructions (D66)', () => {
  it('is true only when the question carries its own instructions', () => {
    expect(showQuestionInstructions('Answer any three of the following.')).toBe(true);
    expect(showQuestionInstructions(null)).toBe(false);
    expect(showQuestionInstructions(undefined)).toBe(false);
  });
});
