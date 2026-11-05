/**
 * A request that never comes back must fail like a network error does, so the
 * existing paths run (the outbox retries and says "Not saved yet", Undo, Split
 * and the OR tool put their buttons back). Before this a hung request left
 * `sending` or `submitting` true for good and froze every button.
 *
 * Pure: the timer is injectable for tests.
 */

/** How long one checker request may take before it counts as failed. */
export const CHECKER_REQUEST_TIMEOUT_MS = 30_000;

/** What a request that took too long rejects with. The text matches none of the
 *  server refusals, so it is retried like a lost connection. */
export class RequestTimeoutError extends Error {
  constructor(ms: number = CHECKER_REQUEST_TIMEOUT_MS) {
    super(`The request took longer than ${Math.round(ms / 1000)} seconds.`);
    this.name = 'RequestTimeoutError';
  }
}

/**
 * Settles with `work` or, after `ms`, rejects with RequestTimeoutError (and
 * calls `onTimeout`, for example to abort the fetch). A late answer from `work`
 * is ignored, and a late failure never becomes an unhandled rejection.
 */
export function withTimeout<T>(
  work: PromiseLike<T>,
  ms: number = CHECKER_REQUEST_TIMEOUT_MS,
  onTimeout?: () => void,
  timers: { set: (cb: () => void, ms: number) => unknown; clear: (id: unknown) => void } = {
    set: (cb, wait) => setTimeout(cb, wait),
    clear: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
  },
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let done = false;
    const timer = timers.set(() => {
      if (done) return;
      done = true;
      try {
        onTimeout?.();
      } catch {
        /* aborting is best effort */
      }
      reject(new RequestTimeoutError(ms));
    }, ms);
    Promise.resolve(work).then(
      (value) => {
        if (done) return;
        done = true;
        timers.clear(timer);
        resolve(value);
      },
      (error) => {
        if (done) return;
        done = true;
        timers.clear(timer);
        reject(error);
      },
    );
  });
}
