import { describe, expect, it } from 'vitest';

import { checkerErrorAdvice, LOAD_FAILED_NOTE, LOAD_FAILED_TITLE } from './checker-errors';

describe('checkerErrorAdvice', () => {
  it('moves on when the lease ran out, instead of blaming the internet', () => {
    const a = checkerErrorAdvice({ code: '42501', message: 'This question is not currently assigned to you' });
    expect(a.moveOn).toBe(true);
    expect(a.message).not.toMatch(/internet/);
  });

  it('says plainly when the paper itself is no longer assigned (12 Oct 2026: admin self-assign was swept away)', () => {
    const a = checkerErrorAdvice({ code: '42501', message: 'This paper is not assigned to you' });
    expect(a.moveOn).toBe(true);
    expect(a.message).toMatch(/no longer assigned to you/);
    expect(a.message).not.toMatch(/internet|42501/);
  });

  it('moves on for a question sent to the HOD, gone, or on a paper not open for checking', () => {
    for (const message of [
      'This question was sent to the HOD',
      'Question not found',
      'This paper is not eligible for checking',
    ]) {
      expect(checkerErrorAdvice({ code: '42501', message }).moveOn, message).toBe(true);
    }
  });

  it('moves on when someone else changed the question (40001)', () => {
    expect(checkerErrorAdvice({ code: '40001', message: 'stale question text, reload and retry' }).moveOn).toBe(true);
    expect(
      checkerErrorAdvice({ code: '40001', message: 'This question already has an unapplied split pending' }).moveOn,
    ).toBe(true);
  });

  it('explains a split point the server refused', () => {
    const a = checkerErrorAdvice({ code: 'P0001', message: 'Split point out of range' });
    expect(a.moveOn).toBe(false);
    expect(a.message).toMatch(/Tap inside the words/);
  });

  it('explains a refused blank pass', () => {
    const a = checkerErrorAdvice({ code: '22023', message: 'This question has no words; it cannot be passed' });
    expect(a.message).toMatch(/Ask the HOD/);
  });

  it('falls back to the internet message for a network failure', () => {
    const a = checkerErrorAdvice(new TypeError('Failed to fetch'));
    expect(a.moveOn).toBe(false);
    expect(a.message).toMatch(/internet/);
  });

  it('never shows a raw error, code or SQL text', () => {
    for (const e of [
      { code: '42501', message: 'Not authorized' },
      { code: 'XX000', message: 'relation "audit_questions" does not exist' },
      null,
      'boom',
    ]) {
      const m = checkerErrorAdvice(e).message;
      expect(m).not.toMatch(/42501|XX000|relation|audit_|null|boom/);
      expect(m).not.toMatch(/[–—]/);
    }
  });

  it('has load-failure copy with no dashes', () => {
    expect(`${LOAD_FAILED_TITLE} ${LOAD_FAILED_NOTE}`).not.toMatch(/[–—]/);
  });
});
