import { afterEach, describe, expect, it, vi } from 'vitest';

/* A hung request must fail like a lost connection (finding D, Nov 2026). */

const abortSignals: AbortSignal[] = [];
let hang = true;

vi.mock('@/integrations/supabase/client', () => {
  const rpc = vi.fn(() => {
    const builder = {
      abortSignal(signal: AbortSignal) {
        abortSignals.push(signal);
        return builder;
      },
      then(resolve: (v: unknown) => void) {
        if (!hang) resolve({ data: [{ question_id: 'q1', undone: 'pass', undone_action: 'checker_pass', question: { id: 'q1' } }], error: null });
        // hanging: never settles
      },
    };
    return builder;
  });
  return { supabase: { rpc } };
});

import { CHECKER_REQUEST_TIMEOUT_MS, RequestTimeoutError, withTimeout } from '@/lib/checker-timeout';
import { checkerMarkOrSeparator, checkerSplitQuestion, verdictAndNext, verifierNextInPaper, verifierUndoLast } from '@/lib/checker-api';
import { checkerErrorAdvice } from '@/lib/checker-errors';
import { isDefiniteRefusal } from '@/lib/checker-outbox';

// en and em dashes are not allowed in student copy (built without typing them here)
const DASH = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

afterEach(() => {
  vi.useRealTimers();
  abortSignals.length = 0;
  hang = true;
});

describe('withTimeout', () => {
  it('is 30 seconds', () => {
    expect(CHECKER_REQUEST_TIMEOUT_MS).toBe(30_000);
  });

  it('passes an answer through and stops its timer', async () => {
    vi.useFakeTimers();
    await expect(withTimeout(Promise.resolve(7), 1000)).resolves.toBe(7);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('passes a failure through unchanged', async () => {
    const err = new Error('refused');
    await expect(withTimeout(Promise.reject(err), 1000)).rejects.toBe(err);
  });

  it('rejects after the limit, calls onTimeout once, and ignores a late answer', async () => {
    vi.useFakeTimers();
    let late!: (v: number) => void;
    const onTimeout = vi.fn();
    const p = withTimeout(new Promise<number>((r) => (late = r)), 1000, onTimeout);
    const caught = p.catch((e) => e);
    await vi.advanceTimersByTimeAsync(999);
    expect(onTimeout).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(await caught).toBeInstanceOf(RequestTimeoutError);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    late(5); // nothing happens, nothing throws
  });

  it('is treated like a network error: retried, not a refusal, no move-on advice', () => {
    const err = new RequestTimeoutError();
    expect(isDefiniteRefusal(err)).toBe(false);
    expect(checkerErrorAdvice(err).moveOn).toBe(false);
    expect(err.message).not.toMatch(DASH);
  });
});

describe('the checker calls that could freeze a button now time out and abort', () => {
  const cases: [string, () => Promise<unknown>][] = [
    ['verdict', () => verdictAndNext({ action: 'pass', questionId: 'q1', paperId: 'p1', version: 1 })],
    ['undo', () => verifierUndoLast('p1')],
    ['split', () => checkerSplitQuestion('q1', 'a b', 1)],
    ['or separator', () => checkerMarkOrSeparator('q1')],
    ['next question', () => verifierNextInPaper('p1')],
  ];

  it.each(cases)('%s: a request that hangs rejects after 30 seconds and its fetch is aborted', async (_name, call) => {
    vi.useFakeTimers();
    const caught = call().catch((e) => e);
    await vi.advanceTimersByTimeAsync(CHECKER_REQUEST_TIMEOUT_MS - 1);
    expect(abortSignals[0]?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await caught).toBeInstanceOf(RequestTimeoutError);
    expect(abortSignals[0]?.aborted).toBe(true);
  });

  it('a request that answers is unchanged', async () => {
    hang = false;
    const res = await verifierUndoLast('p1');
    expect(res.question_id).toBe('q1');
    expect(abortSignals[0]?.aborted).toBe(false);
  });
});
