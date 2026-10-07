import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ActionButton } from '@/components/checker/CheckerButtons';
import { CHIP, actionToneClass } from '@/lib/checker-button-styles';
import { cn } from '@/lib/utils';
import { canSplitAt, codePointOffset, FIX_RULE_NOTE, FIX_RULE_TITLE } from '@/lib/checker-body';
import { matchCheckerKeyboardEvent, shortcutHint } from '@/lib/checker-shortcuts';
import { CHECKER_HELP_PATH, CHECKER_PATH } from '@/lib/checker-onboarding';
import {
  ACTION_NAMES,
  createPracticeApi,
  practicePictureDataUrl,
  type PracticeAction,
  type PracticeAnswer,
  type PracticeApi,
  type PracticeResult,
} from '@/lib/checker-practice';

/* The optional practice round (/checker/practice). Seven made-up questions,
   one planted mistake each, instant feedback after every answer and a summary
   at the end. Open to anyone: nothing here is secret and nothing is saved.

   It talks ONLY to the in-memory fake in src/lib/checker-practice.ts. This
   file must never import Supabase or src/lib/checker-api.ts, directly or
   through anything it imports; checker-practice.test.ts walks the import
   graph and fails if it does. Practice never gates the real questions. */

type Mode = 'check' | 'fix' | 'split';

interface Done {
  id: string;
  action: PracticeAction;
  result: PracticeResult;
}

export default function CheckerPractice() {
  usePageMeta('Practice round | Shikshaq', 'Try the paper checker on made-up questions. Nothing is saved.');
  const [run, setRun] = useState(0);
  // A fresh fake API for every attempt.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const api = useMemo(() => createPracticeApi(), [run]);
  return <PracticeRound key={run} api={api} onRestart={() => setRun((n) => n + 1)} />;
}

export function PracticeRound({ api, onRestart }: { api: PracticeApi; onRestart: () => void }) {
  const questions = useMemo(() => api.questions(), [api]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('check');
  const [bodyDraft, setBodyDraft] = useState(questions[0].body);
  const [marksDraft, setMarksDraft] = useState(questions[0].marks === null ? '' : String(questions[0].marks));
  const [splitAt, setSplitAt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<PracticeResult | null>(null);
  const [done, setDone] = useState<Done[]>([]);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const finished = index >= questions.length;
  const q = finished ? null : questions[index];
  const picture = useMemo(() => (q ? practicePictureDataUrl(q.printed, q.blurry) : ''), [q]);

  function answer(a: PracticeAnswer) {
    if (!q || feedback) return;
    const result = api.answer(q.id, a);
    setFeedback(result);
    setDone((d) => [...d, { id: q.id, action: a.action, result }]);
    setMode('check');
  }

  function advance() {
    const next = index + 1;
    setIndex(next);
    setFeedback(null);
    setMode('check');
    setSplitAt(null);
    const nq = questions[next];
    if (nq) {
      setBodyDraft(nq.body);
      setMarksDraft(nq.marks === null ? '' : String(nq.marks));
    }
    window.scrollTo({ top: 0 });
  }

  function cancelEdit() {
    if (!q) return;
    setMode('check');
    setSplitAt(null);
    setBodyDraft(q.body);
    setMarksDraft(q.marks === null ? '' : String(q.marks));
  }

  function saveFix() {
    const trimmed = marksDraft.trim();
    const parsed = trimmed === '' ? null : Number(trimmed);
    answer({ action: 'fix', body: bodyDraft, marks: parsed !== null && Number.isFinite(parsed) ? parsed : null });
  }

  useEffect(() => {
    if (feedback) nextRef.current?.focus({ preventScroll: true });
  }, [feedback]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!q || feedback) return;
      if (e.key === 'Escape' && mode !== 'check') {
        cancelEdit();
        return;
      }
      if (mode !== 'check') return;
      const action = matchCheckerKeyboardEvent(e);
      if (!action) return;
      if (action === 'split' && !q.offersSplit) return;
      e.preventDefault();
      if (action === 'pass') answer({ action: 'pass' });
      else if (action === 'fix') setMode('fix');
      else if (action === 'split') setMode('split');
      else if (action === 'help') answer({ action: 'help' });
      else if (action === 'skip') answer({ action: 'skip' });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, mode, feedback]);

  return (
    <BentoStack className="min-h-screen bg-muted">
      <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-4xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-foreground">Practice round</h1>
          <div className="flex flex-wrap items-center gap-2">
            {!finished ? (
              <span className="rounded-full bg-muted px-3 py-1 text-[13px] font-semibold tabular-nums text-warm-secondary">
                Question {index + 1} of {questions.length}
              </span>
            ) : null}
            <Link to={CHECKER_HELP_PATH} className={cn(CHIP, 'bg-muted text-warm-secondary')}>
              Rules and shortcuts
            </Link>
            <Link to={CHECKER_PATH} className={cn(CHIP, 'bg-brand-subtle text-foreground')}>
              Back to the checker
            </Link>
          </div>
        </div>

        <div role="note" className="mb-3 rounded-2xl bg-brand-subtle px-3 py-2 text-[13px] leading-snug text-foreground">
          These questions are made up for practice. Nothing you do here is saved or sent anywhere, and you can leave any
          time.
        </div>

        {finished ? (
          <Summary done={done} questions={questions} onRestart={onRestart} />
        ) : q ? (
          <>
            <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col">
                <p className="mb-1 text-[12px] text-warm-meta">The printed page</p>
                <div className="rounded-2xl bg-white p-2">
                  <img
                    src={picture}
                    alt={q.blurry ? 'the printed question, too blurry to read' : `the printed question: ${q.printed.join(' ')}`}
                    className="mx-auto block h-auto max-w-full"
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-col">
                {mode === 'fix' ? (
                  <div>
                    <div className="mb-2 rounded-2xl bg-brand-subtle px-3 py-2">
                      <p className="text-[13px] font-semibold text-foreground">{FIX_RULE_TITLE}</p>
                      <p className="text-[13px] leading-snug text-warm-secondary">{FIX_RULE_NOTE}</p>
                    </div>
                    <textarea
                      value={bodyDraft}
                      onChange={(e) => setBodyDraft(e.target.value)}
                      rows={4}
                      aria-label="The typed question"
                      className="w-full rounded-2xl bg-muted p-3 text-[16px] leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>
                ) : mode === 'split' ? (
                  <div>
                    <p className="mb-2 text-[13px] text-warm-secondary">
                      Tap right before where the second question starts, then press Split here.
                    </p>
                    <textarea
                      readOnly
                      value={bodyDraft}
                      onClick={(e) => setSplitAt(codePointOffset(e.currentTarget.value, e.currentTarget.selectionStart))}
                      onKeyUp={(e) => setSplitAt(codePointOffset(e.currentTarget.value, e.currentTarget.selectionStart))}
                      onSelect={(e) => setSplitAt(codePointOffset(e.currentTarget.value, e.currentTarget.selectionStart))}
                      rows={5}
                      aria-label="Tap where the second question starts"
                      className="w-full rounded-2xl bg-muted p-3 text-[16px] leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                    <p className="mt-2 text-[13px] text-warm-meta">
                      {splitAt === null
                        ? 'Nothing chosen yet.'
                        : canSplitAt(bodyDraft, splitAt)
                          ? 'Cut chosen. Press Split here.'
                          : 'Tap inside the words, between the two questions.'}
                    </p>
                  </div>
                ) : (
                  <div data-testid="practice-typed" className="rounded-2xl bg-muted p-4">
                    <p className="mb-1 text-[12px] font-semibold text-warm-meta">What the computer typed</p>
                    <p className="break-words text-[16px] leading-relaxed text-foreground">{q.body}</p>
                  </div>
                )}

                {mode === 'check' && q.offersSplit && !feedback ? (
                  <button
                    type="button"
                    onClick={() => setMode('split')}
                    className="tap-44 mt-2 self-start rounded-full bg-brand-subtle px-4 py-2 text-[13px] font-semibold text-foreground transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Split here, these look like two questions
                  </button>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-[13px] font-medium text-warm-secondary">
                    Marks
                    <input
                      inputMode="decimal"
                      value={marksDraft}
                      onChange={(e) => setMarksDraft(e.target.value)}
                      disabled={mode !== 'fix'}
                      placeholder={mode === 'fix' ? 'e.g. 2' : 'none'}
                      className="min-h-[44px] w-20 rounded-xl bg-muted px-3 py-1 text-center text-[16px] tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-70"
                    />
                  </label>
                </div>

                {feedback ? (
                  <div
                    role="status"
                    data-testid="practice-feedback"
                    className={cn('mt-3 rounded-2xl p-3', feedback.correct ? 'bg-mint' : 'bg-destructive/10')}
                  >
                    <p className="text-[15px] font-bold text-foreground">{feedback.headline}</p>
                    <p className="mt-0.5 text-pretty text-[14px] leading-snug text-foreground">{feedback.explanation}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="sticky bottom-0 z-10 -mx-1 mt-5 flex flex-wrap items-center gap-2.5 border-t border-warm-hairline bg-card px-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4">
              {feedback ? (
                <button ref={nextRef} type="button" onClick={advance} className={actionToneClass('mint')}>
                  {index + 1 >= questions.length ? 'See how you did' : 'Next question'}
                </button>
              ) : mode === 'split' ? (
                <>
                  <ActionButton
                    tone="mint"
                    onClick={() => answer({ action: 'split', at: splitAt })}
                    disabled={!canSplitAt(bodyDraft, splitAt)}
                  >
                    Split here
                  </ActionButton>
                  <ActionButton tone="muted" onClick={cancelEdit}>
                    Cancel
                  </ActionButton>
                </>
              ) : mode === 'fix' ? (
                <>
                  <ActionButton tone="mint" onClick={saveFix}>
                    Save, now it matches
                  </ActionButton>
                  <ActionButton tone="muted" onClick={cancelEdit}>
                    Cancel
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton tone="mint" onClick={() => answer({ action: 'pass' })}>
                    Looks right
                  </ActionButton>
                  <ActionButton tone="dark" onClick={() => setMode('fix')}>
                    Fix it
                  </ActionButton>
                  <ActionButton tone="brand" onClick={() => answer({ action: 'help' })}>
                    Ask the HOD
                  </ActionButton>
                  <ActionButton tone="muted" onClick={() => answer({ action: 'skip' })}>
                    Skip this question
                  </ActionButton>
                </>
              )}
              {!feedback ? (
                <p className="ml-auto hidden text-[12px] text-warm-meta lg:block">
                  {mode === 'check' ? shortcutHint({ canSplit: q.offersSplit, canPass: true }) : 'Esc cancels'}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </BentoPanel>
    </BentoStack>
  );
}

function Summary({
  done,
  questions,
  onRestart,
}: {
  done: Done[];
  questions: ReturnType<PracticeApi['questions']>;
  onRestart: () => void;
}) {
  const score = done.filter((d) => d.result.correct).length;
  return (
    <div data-testid="practice-summary">
      <h2 className="text-balance text-xl font-bold text-foreground">
        You got <span className="tabular-nums">{score}</span> of <span className="tabular-nums">{questions.length}</span> right
      </h2>
      <p className="mt-1 text-pretty text-[14px] text-warm-secondary">
        {score === questions.length
          ? 'That is every one. You are ready for the real questions.'
          : 'Have a look at the ones marked Not quite, then try again if you like. The real questions are waiting whenever you are ready.'}
      </p>
      <ol className="mt-4 flex flex-col gap-2">
        {questions.map((qq, n) => {
          const d = done.find((x) => x.id === qq.id);
          const ok = d?.result.correct ?? false;
          return (
            <li key={qq.id} className={cn('rounded-2xl p-3', ok ? 'bg-mint' : 'bg-destructive/10')}>
              <p className="text-[14px] font-semibold text-foreground">
                {n + 1}. {qq.planted}
              </p>
              <p className="text-[13px] leading-snug text-warm-secondary">
                {ok ? 'Right' : 'Not quite'}. The right move was {ACTION_NAMES[qq.correct]}.
                {d && d.action !== qq.correct ? ` You pressed ${ACTION_NAMES[d.action]}.` : ''}
              </p>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Link to={CHECKER_PATH} className={actionToneClass('mint')}>
          Go to the real checker
        </Link>
        <button type="button" onClick={onRestart} className={actionToneClass('brand')}>
          Practice again
        </button>
        <Link to={CHECKER_HELP_PATH} className={actionToneClass('muted')}>
          Rules and shortcuts
        </Link>
      </div>
    </div>
  );
}
