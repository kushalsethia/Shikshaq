import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ActionButton } from '@/components/checker/CheckerButtons';
import { CHIP, actionToneClass } from '@/lib/checker-button-styles';
import { cn } from '@/lib/utils';
import { canSplitAt, codePointOffset, isOrOnlyBody, FIX_RULE_NOTE, FIX_RULE_TITLE, OR_ONLY_BUTTON, OR_ONLY_NOTE } from '@/lib/checker-body';
import { matchCheckerKeyboardEvent, shortcutHint } from '@/lib/checker-shortcuts';
import { CHECKER_HELP_PATH, CHECKER_PATH } from '@/lib/checker-onboarding';
import {
  ACTION_NAMES,
  createPracticeApi,
  practicePictureDataUrl,
  type PracticeAction,
  type PracticeAnswer,
  type PracticeApi,
  type PracticeQuestion,
  type PracticeResult,
} from '@/lib/checker-practice';

/* The optional practice round (/checker/practice). Nine made-up questions,
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
  /** Answered after coming back to a question that was skipped. */
  revisit: boolean;
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
  const [mode, setMode] = useState<Mode>('check');
  const [bodyDraft, setBodyDraft] = useState(questions[0].body);
  const [marksDraft, setMarksDraft] = useState(questions[0].marks === null ? '' : String(questions[0].marks));
  const [splitAt, setSplitAt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<PracticeResult | null>(null);
  const [done, setDone] = useState<Done[]>([]);
  // The student chose to go back through the questions they skipped.
  const [goingBack, setGoingBack] = useState(false);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  // Everything below is worked out from the list of answers, so Undo last is
  // just "drop the newest answer" and the screen follows.
  const firstPass = done.filter((d) => !d.revisit);
  const answeredFirst = new Set(firstPass.map((d) => d.id));
  const waiting = questions.filter(
    (qq) => firstPass.some((d) => d.id === qq.id && d.action === 'skip') && !done.some((d) => d.revisit && d.id === qq.id),
  );
  const nextFirst = questions.find((qq) => !answeredFirst.has(qq.id)) ?? null;
  const last = done.length ? done[done.length - 1] : null;
  // While feedback is showing, the question just answered stays on screen.
  const q: PracticeQuestion | null = feedback && last
    ? (questions.find((x) => x.id === last.id) ?? null)
    : nextFirst ?? (goingBack ? (waiting[0] ?? null) : null);
  const revisit = q ? (feedback && last ? last.revisit : nextFirst === null) : false;
  const onlySkippedLeft = !feedback && nextFirst === null && !goingBack && waiting.length > 0;
  const finished = !q && !onlySkippedLeft;
  const picture = useMemo(() => (q ? practicePictureDataUrl(q.printed, q.blurry) : ''), [q]);

  // A new question on screen starts from its own typed words and marks.
  useEffect(() => {
    if (!q) return;
    setBodyDraft(q.body);
    setMarksDraft(q.marks === null ? '' : String(q.marks));
    setSplitAt(null);
    setMode('check');
  }, [q?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function answer(a: PracticeAnswer) {
    if (!q || feedback) return;
    const result = api.answer(q.id, a, revisit);
    setFeedback(result);
    setDone((d) => [...d, { id: q.id, action: a.action, result, revisit }]);
    setMode('check');
  }

  function advance() {
    setFeedback(null);
    setMode('check');
    setSplitAt(null);
    window.scrollTo({ top: 0 });
  }

  // Undo last: take back the newest answer. The question comes back to be
  // answered again, exactly like the real checker.
  function undoLast() {
    if (!last) return;
    api.undo(last.id);
    setDone((d) => d.slice(0, -1));
    setFeedback(null);
    setMode('check');
    setSplitAt(null);
    if (!last.revisit) setGoingBack(false);
    const back = questions.find((x) => x.id === last.id);
    if (back) {
      setBodyDraft(back.body);
      setMarksDraft(back.marks === null ? '' : String(back.marks));
    }
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
      if (feedback) return;
      if (e.key === 'Escape' && mode !== 'check') {
        cancelEdit();
        return;
      }
      if (mode !== 'check') return;
      const action = matchCheckerKeyboardEvent(e);
      if (!action) return;
      if (action === 'undo') {
        if (!last) return;
        e.preventDefault();
        undoLast();
        return;
      }
      if (!q) return;
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
  }, [q, mode, feedback, last]);

  const undoButton = (
    <button
      type="button"
      onClick={undoLast}
      disabled={!last}
      data-testid="practice-undo"
      title={last ? 'Take back your last answer (U)' : 'Nothing to undo yet'}
      className={cn(actionToneClass('muted'), 'disabled:cursor-not-allowed disabled:opacity-50')}
    >
      Undo last
    </button>
  );

  return (
    <BentoStack className="min-h-screen bg-muted">
      <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-4xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-foreground">Practice round</h1>
          <div className="flex flex-wrap items-center gap-2">
            {!finished && !onlySkippedLeft && q ? (
              <span className="rounded-full bg-muted px-3 py-1 text-[13px] font-semibold tabular-nums text-warm-secondary">
                {revisit
                  ? `Skipped question, ${waiting.findIndex((w) => w.id === q.id) + 1} of ${waiting.length}`
                  : `Question ${Math.min(answeredFirst.size + (feedback && !revisit ? 0 : 1), questions.length)} of ${questions.length}`}
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
          <Summary done={done} questions={questions} onRestart={onRestart} undoButton={undoButton} />
        ) : onlySkippedLeft ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center" data-testid="practice-only-skipped-left">
            <h2 className="text-balance text-lg font-bold text-foreground">Only skipped questions are left</h2>
            <p className="max-w-md text-pretty text-[14px] text-warm-secondary">
              {waiting.length === 1 ? 'You skipped 1 question.' : `You skipped ${waiting.length} questions.`} It stays on this paper
              for you to come back to. In the real checker you could go to another paper first. Here, go back to it now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button type="button" onClick={() => setGoingBack(true)} className={actionToneClass('mint')}>
                Go through skipped ones now
              </button>
              {undoButton}
            </div>
          </div>
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

                {mode === 'check' && isOrOnlyBody(q.body) && !feedback ? (
                  <div className="mt-2 rounded-2xl bg-brand-subtle px-3 py-2" data-testid="practice-or-only">
                    <p className="text-[13px] leading-snug text-foreground">{OR_ONLY_NOTE}</p>
                    <button
                      type="button"
                      onClick={() => answer({ action: 'or_only' })}
                      className="tap-44 mt-2 rounded-full bg-card px-4 py-2 text-[13px] font-semibold text-foreground transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {OR_ONLY_BUTTON}
                    </button>
                  </div>
                ) : null}

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
                <>
                  <button ref={nextRef} type="button" onClick={advance} className={actionToneClass('mint')}>
                    {nextFirst && nextFirst.id !== q.id && answeredFirst.size < questions.length ? 'Next question' : 'Continue'}
                  </button>
                  {undoButton}
                </>
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
                  {undoButton}
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
  undoButton,
}: {
  done: Done[];
  questions: ReturnType<PracticeApi['questions']>;
  onRestart: () => void;
  undoButton: React.ReactNode;
}) {
  // A skipped question that was gone back to counts by its last answer.
  const finalFor = (id: string): Done | undefined => [...done].reverse().find((x) => x.id === id);
  const score = questions.filter((qq) => finalFor(qq.id)?.result.correct).length;
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
          const d = finalFor(qq.id);
          const ok = d?.result.correct ?? false;
          return (
            <li key={qq.id} className={cn('rounded-2xl p-3', ok ? 'bg-mint' : 'bg-destructive/10')}>
              <p className="text-[14px] font-semibold text-foreground">
                {n + 1}. {qq.planted}
              </p>
              <p className="text-[13px] leading-snug text-warm-secondary">
                {ok ? 'Right' : 'Not quite'}. The right move was{' '}
                {ACTION_NAMES[d?.revisit && qq.revisitCorrect ? qq.revisitCorrect : qq.correct]}
                {d?.revisit && qq.revisitCorrect ? ' (after skipping it first)' : ''}.
                {d && d.action !== (d.revisit && qq.revisitCorrect ? qq.revisitCorrect : qq.correct) ? ` You pressed ${ACTION_NAMES[d.action]}.` : ''}
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
        {undoButton}
      </div>
    </div>
  );
}
