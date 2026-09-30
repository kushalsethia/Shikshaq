import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { MathText } from '@/components/papers/math-text';
import { BodyEditor } from '@/components/checker/BodyEditor';
import { OptionList } from '@/components/checker/OptionList';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import { realCheckerApi, type CheckerApi } from '@/lib/checker-api';
import { whatToCheck, needsSplit, NO_PICTURE_TITLE, NO_PICTURE_NOTE } from '@/lib/checker-kid-reasons';
import { englishContext, passageHeading } from '@/lib/checker-english';
import {
  assembleQuestionContext,
  contextHeading,
  partLabel,
  type QuestionContext,
} from '@/lib/checker-context';
import {
  planCheckerPicture,
  pictureHeading,
  PICTURE_MAY_MISS_PARTS,
  type PicturePlan,
} from '@/lib/checker-pictures';
import { planWholePage, PAGE_HEADING, type PagePlan } from '@/lib/checker-page';
import { PageImageViewer } from '@/components/checker/PageImageViewer';
import { matchCheckerKeyboardEvent, shortcutHint } from '@/lib/checker-shortcuts';
import {
  isBlankBody,
  looksGarbled,
  codePointOffset,
  splitHalves,
  canSplitAt,
  bigEdit,
  stripLeadingNumberPrefix,
  FIX_RULE_TITLE,
  FIX_RULE_NOTE,
  BIG_EDIT_WARNING,
} from '@/lib/checker-body';
import { checkerErrorAdvice, LOAD_FAILED_TITLE, LOAD_FAILED_NOTE } from '@/lib/checker-errors';
import { facetChoices, keepOffered, waitingFor, classLabel, shouldAskForPreferences, type FacetChoice } from '@/lib/checker-facets';
import { usePaperReviewChannel, useLiveRefresh } from '@/hooks/usePaperReviewChannel';
import { isForeignChangeToOpenQuestion } from '@/lib/paper-review-realtime';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';
import { DebugId } from '@/components/DebugId';

/* The paper checker (Kid Mode) -- D8/D9/D11/D15/D16/D21: built INTO the
   Shikshaq site, in Shikshaq's own bento design language, reachable only by
   an account an admin has granted the "Paper checker" permission. One
   question at a time, across every live paper waiting to be cleared, next to
   a snippet of the printed page. Ported from the standalone auditor's
   KidCheck.tsx (UnlimitedOCR/auditor/web/src/pages/kid/KidCheck.tsx) --
   reusing its flow and shortcut logic, not its visual design (D11: "not a
   separate designed thing").

   D16/D21: escalating never turns a paper red -- it hands the question to
   Sonnet first, then an admin, while the checker moves on to the next one.
   The pipeline-plan Step 2 rename ("Can't fix") and owner Round 6 rename
   back to "Ask for help" (00 Owner Brief and Answers.md: "the owner calls
   the third one Ask for help") both supersede D16/D21's button LABEL only:
   same askForHelp/escalate RPC underneath, the owner's own word on top.

   D75: in a test build (VITE_PREVIEW_TOOLS) with dummy mode on, the same
   page runs against an in-memory fake of the checker API, with no sign-in
   and no Supabase. `DummyChecker` is null in every other build, so the fake
   and its fixtures are compiled out of the live bundle. */

const DummyChecker = PREVIEW_TOOLS ? lazy(() => import('@/dummy/CheckerDummy')) : null;

export default function Checker() {
  if (DummyChecker && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyChecker />
      </Suspense>
    );
  }
  return <CheckerPage api={realCheckerApi} />;
}

type Mode = 'check' | 'fix' | 'split';

const HELP_REASONS = [
  'I cannot read the words',
  'The words are scrambled',
  'There is no question here',
  'The picture is of a different question',
];

export function CheckerPage({
  api,
  dummy = false,
  banner,
}: {
  api: CheckerApi;
  /** Dummy mode: no sign-in, no realtime, fake API. */
  dummy?: boolean;
  banner?: React.ReactNode;
}) {
  usePageMeta('Paper checker | Shikshaq', 'Check one question at a time against the printed paper.');
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const scope = dummy ? 'dummy' : 'live';

  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    if (!dummy) {
      if (authLoading) return;
      if (!user) {
        navigate('/auth?redirect=' + encodeURIComponent('/checker'));
        return;
      }
    }
    let cancelled = false;
    api.isPaperChecker().then((ok) => {
      if (!cancelled) setAllowed(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate, api, dummy]);

  // D41: first-use subject/class picker. `undefined` = not checked yet,
  // otherwise the saved picks (empty lists = everything).
  const [prefs, setPrefs] = useState<{ subjects: string[]; classes: string[] } | undefined>(undefined);
  const [prefsPromptOpen, setPrefsPromptOpen] = useState(false);
  const [prefsDraftSubjects, setPrefsDraftSubjects] = useState<string[]>([]);
  const [prefsDraftClasses, setPrefsDraftClasses] = useState<string[]>([]);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);

  const facetsQuery = useQuery({
    queryKey: ['checker-queue-facets', scope],
    queryFn: api.queueFacets,
    enabled: allowed === true,
    staleTime: 60 * 1000,
  });
  const choices = facetChoices(facetsQuery.data);
  const facetsKnown = Boolean(facetsQuery.data);

  useEffect(() => {
    if (allowed !== true) return;
    let cancelled = false;
    api
      .getPreferences()
      .then((p) => {
        if (cancelled) return;
        const saved = { subjects: p.subjects ?? [], classes: p.classes ?? [] };
        setPrefs(saved);
        if (shouldAskForPreferences(p)) {
          setPrefsDraftSubjects([]);
          setPrefsDraftClasses([]);
          setPrefsPromptOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) setPrefs({ subjects: [], classes: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [allowed, api]);

  function openPrefs() {
    setPrefsError(null);
    setPrefsDraftSubjects(keepOffered(prefs?.subjects ?? [], facetsKnown ? choices.subjects : null));
    setPrefsDraftClasses(keepOffered(prefs?.classes ?? [], facetsKnown ? choices.classes : null));
    setPrefsPromptOpen(true);
  }

  async function savePrefs(subjects = prefsDraftSubjects, classes = prefsDraftClasses) {
    setPrefsSaving(true);
    setPrefsError(null);
    try {
      await api.setPreferences(subjects, classes);
      setPrefs({ subjects, classes });
      setPrefsPromptOpen(false);
      refresh();
    } catch {
      setPrefsError('Could not save your choice. Check your internet and try again.');
    } finally {
      setPrefsSaving(false);
    }
  }

  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  /* Speed (pipeline-plan Step 2, #5): checker_next_question LEASES the row
     it returns to whoever fetches it. That rules out fetching a real "next"
     question ahead of time while the current one is still on screen -- it
     would start a second 10-minute clock on a question nobody is reading
     yet, and could hand it to another checker's queue in the meantime for
     nothing if this one gets Skipped instead of finished. So this stays
     "fetch after pass": one lease per question actually shown, requested
     the moment an action resolves (`refresh()` below), never earlier.

     What IS safe, and is what makes the transition feel instant rather than
     "fetch after pass" reading as a visible reload: React Query does not
     clear `data` on a background refetch of the SAME query key (only on the
     very first load, before any question has ever arrived, is there no
     previous question to show). So the questions after the first swap in
     directly once the new row lands, with no full-panel skeleton between
     them -- the old question's text and picture just stay put, buttons
     disabled by `submitting`, until the next one replaces them. The picture
     panel's own brief pulse (its signed URL is a second, sequential fetch,
     started only once the new question's row is known) is the one part of
     the transition that still visibly loads, and staying sequential there
     is deliberate too: fetching a picture URL speculatively for a row nobody
     has been leased yet would be a picture for a question this checker may
     never see. */
  const questionQuery = useQuery({
    queryKey: ['checker-next-question', scope],
    queryFn: api.nextQuestion,
    enabled: allowed === true,
    retry: 1,
    // The app-wide defaults (staleTime 5 min, refetchOnMount false, gcTime
    // 10 min) would show a question from cache on coming back to this page,
    // after its 10-minute lease may have run out. Always ask the server, and
    // keep nothing once the page is left.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
  const question = questionQuery.data ?? null;

  const statsQuery = useQuery({
    queryKey: ['checker-my-stats', scope],
    queryFn: api.myStats,
    enabled: allowed === true,
  });

  const leaderboardQuery = useQuery({
    queryKey: ['checker-leaderboard', scope],
    queryFn: api.leaderboard,
    enabled: allowed === true && leaderboardOpen,
  });

  // W11: the whole question a sub-part belongs to (empty for a standalone
  // question, and also empty if the RPC is not deployed yet).
  const contextQuery = useQuery({
    queryKey: ['checker-question-context', scope, question?.id],
    queryFn: () => api.questionContext(question!.id),
    enabled: allowed === true && Boolean(question?.id),
    staleTime: 5 * 60 * 1000,
  });
  const context: QuestionContext | null = question ? assembleQuestionContext(contextQuery.data, question.id) : null;

  // The one picture of the printed paper (checker-pictures.ts). Null plan =
  // no trustworthy crop, so no signed URL is asked for. Owner, 2026-09-28:
  // never a tap-to-show button, never a doubtful crop.
  const picturePlan: PicturePlan | null =
    question && !contextQuery.isLoading ? planCheckerPicture(question, context) : null;
  // No trusted crop: a Maths question falls back to the whole printed page as
  // scanned (checker-page.ts). Null when the pipeline has not said which page.
  const pagePlan: PagePlan | null =
    question && !contextQuery.isLoading ? planWholePage(question, picturePlan !== null) : null;
  const viewPath = picturePlan?.path ?? pagePlan?.path ?? '';
  const picturePlanKey = question && !contextQuery.isLoading ? `${question.id}|${viewPath}` : '';
  // undefined = still looking, null = none (or it failed to load).
  const [pictureUrl, setPictureUrl] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    setPictureUrl(undefined);
    if (!picturePlanKey) return;
    if (!viewPath) {
      setPictureUrl(null);
      return;
    }
    let cancelled = false;
    api.pictureUrl(viewPath).then((url) => {
      if (!cancelled) setPictureUrl(url);
    });
    return () => {
      cancelled = true;
    };
    // `picturePlan` is derived from picturePlanKey (a new object every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picturePlanKey]);
  // While the picture is still loading, sentences assume it will arrive
  // when one is planned.
  const hasPicture = pictureUrl === undefined ? viewPath !== '' : Boolean(pictureUrl);
  const whatToCheckLine = question
    ? whatToCheck(question.flag_reasons, question.flag_detail, { hasPicture })
    : { line: null, detail: null };
  // W14: English questions carry their passage and set text in `source`.
  const english = question ? englishContext(question.source) : null;

  const [mode, setMode] = useState<Mode>('check');
  const [bodyDraft, setBodyDraft] = useState('');
  const [numberDraft, setNumberDraft] = useState('');
  const [marksDraft, setMarksDraft] = useState('');
  const [splitAt, setSplitAt] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpReason, setHelpReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A message that survives moving to the next question (an error that made
  // the page move on, or "Saved").
  const [notice, setNotice] = useState<{ text: string; tone: 'ok' | 'warn' } | null>(null);

  useEffect(() => {
    if (question) {
      setMode('check');
      setBodyDraft(question.body ?? '');
      setNumberDraft(question.display_number ?? '');
      setMarksDraft(question.marks != null ? String(question.marks) : '');
      setSplitAt(null);
      setHelpOpen(false);
      setHelpReason('');
      setError(null);
    }
    // Keyed on the fetch, not only the id: after a split the first half
    // comes back with the SAME id and a shorter body, and keying on the id
    // alone left the old, whole text in the split box (a second split then
    // failed as "stale").
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id, question?.body, questionQuery.dataUpdatedAt]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), notice.tone === 'ok' ? 2500 : 8000);
    return () => clearTimeout(t);
  }, [notice]);

  // W13 realtime: show as online, keep my counters and the leaderboard
  // current, and move on if someone else changes the question I have open.
  const refreshCounters = useLiveRefresh(() => {
    qc.invalidateQueries({ queryKey: ['checker-my-stats', scope] });
    qc.invalidateQueries({ queryKey: ['checker-leaderboard', scope] });
    qc.invalidateQueries({ queryKey: ['checker-queue-facets', scope] });
  });
  usePaperReviewChannel({
    enabled: allowed === true && !dummy,
    userId: user?.id,
    fullName: profile?.full_name,
    onActivity: (event) => {
      refreshCounters();
      if (!submitting && isForeignChangeToOpenQuestion(event, question?.id, user?.id)) {
        setNotice({ text: 'Someone else just changed that question, so here is the next one.', tone: 'warn' });
        qc.invalidateQueries({ queryKey: ['checker-next-question', scope] });
      }
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['checker-next-question', scope] });
    qc.invalidateQueries({ queryKey: ['checker-my-stats', scope] });
    qc.invalidateQueries({ queryKey: ['checker-leaderboard', scope] });
    qc.invalidateQueries({ queryKey: ['checker-queue-facets', scope] });
  };

  const blank = question ? isBlankBody(question.body) : false;
  const garbled = question ? looksGarbled(question.body, question.subject).garbled : false;
  const splitOffered = question ? needsSplit(question.flag_reasons) && !blank : false;
  const edited = question
    ? bodyDraft !== (question.body ?? '') ||
      numberDraft !== (question.display_number ?? '') ||
      marksDraft !== (question.marks != null ? String(question.marks) : '')
    : false;
  // An empty question can never be "right" as it is; only after the checker
  // typed its words in from the picture.
  const canPass = question ? !isBlankBody(bodyDraft) : false;
  const marksInvalid = marksDraft.trim() !== '' && !(Number.isFinite(Number(marksDraft)) && Number(marksDraft) >= 0);
  const showBigEditWarning = mode === 'fix' && question ? bigEdit(question.body ?? '', bodyDraft) : false;

  async function run(action: () => Promise<unknown>, okText: string) {
    setSubmitting(true);
    setError(null);
    try {
      await action();
      setNotice({ text: okText, tone: 'ok' });
      refresh();
    } catch (err) {
      const advice = checkerErrorAdvice(err);
      if (advice.moveOn) {
        setNotice({ text: advice.message, tone: 'warn' });
        refresh();
      } else {
        setError(advice.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function doPass() {
    if (!question || submitting) return;
    if (!canPass) {
      setError('This question has no words, so it cannot be marked as right. Press Ask for help.');
      return;
    }
    if (marksInvalid) {
      setError('Marks must be a number, like 2 or 0.5.');
      return;
    }
    if (mode === 'fix' || edited) {
      const savedNumber = numberDraft.trim() || null;
      // Owner: "the number lives in the number box only". A leading-prefix
      // removal ONLY -- never a rewrite of the rest of the text -- so a
      // body that still repeats its own number ("15. Solve for x...") is
      // not saved with the number twice. Logged because it silently changes
      // what gets stored, even though it is always the same removal a
      // checker could have made by hand.
      const { stripped, removed } = stripLeadingNumberPrefix(bodyDraft, savedNumber);
      if (removed) {
        console.info('[checker] stripped repeated leading number on save', {
          questionId: question.id,
          displayNumber: savedNumber,
          removed,
        });
      }
      const finalBody = stripped;
      const bodyChanged = finalBody !== (question.body ?? '');
      await run(
        () =>
          api.fixQuestion(question.id, {
            // Unchanged text is not sent at all (null keeps the stored body),
            // so fixing only the marks can never rewrite the words.
            body: bodyChanged ? finalBody : null,
            display_number: savedNumber,
            marks: marksDraft.trim() === '' ? null : Number(marksDraft),
          }),
        'Saved. Here is the next one.',
      );
    } else {
      await run(() => api.passQuestion(question.id), 'Marked as right. Here is the next one.');
    }
  }

  async function doSplit() {
    if (!question || submitting || !canSplitAt(bodyDraft, splitAt)) return;
    await run(() => api.splitQuestion(question.id, bodyDraft, splitAt!), 'Split into two. Both will be checked again.');
  }

  async function doAskForHelp(reason: string) {
    if (!question || submitting) return;
    await run(async () => {
      await api.askForHelp(question.id, reason.trim() || 'Not sure how to fix this');
      setHelpOpen(false);
    }, 'Sent for help. Here is the next one.');
  }

  async function doSkip() {
    if (!question || submitting) return;
    await run(() => api.skipQuestion(question.id), 'Skipped. It will not come back to you for a day.');
  }

  function cancelEdit() {
    if (!question) return;
    setBodyDraft(question.body ?? '');
    setNumberDraft(question.display_number ?? '');
    setMarksDraft(question.marks != null ? String(question.marks) : '');
    setSplitAt(null);
    setMode('check');
  }

  function onSplitCaret(el: HTMLTextAreaElement) {
    setSplitAt(codePointOffset(el.value, el.selectionStart));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (prefsPromptOpen || submitting) return;
      if (helpOpen) {
        if (e.key === 'Escape') setHelpOpen(false);
        return;
      }
      if (e.key === 'Escape' && mode !== 'check') {
        e.preventDefault();
        cancelEdit();
        return;
      }
      const action = matchCheckerKeyboardEvent(e);
      if (!action || !question || mode !== 'check') return;
      if (action === 'pass' && canPass) {
        e.preventDefault();
        void doPass();
      } else if (action === 'fix') {
        e.preventDefault();
        setMode('fix');
      } else if (action === 'split' && splitOffered) {
        e.preventDefault();
        setMode('split');
      } else if (action === 'help') {
        e.preventDefault();
        setHelpOpen(true);
      } else if (action === 'skip') {
        e.preventDefault();
        void doSkip();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, helpOpen, submitting, prefsPromptOpen, question?.id, canPass, splitOffered]);

  if ((!dummy && authLoading) || allowed === null) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-4xl">
          {banner}
          <CheckerSkeleton />
        </BentoPanel>
      </BentoStack>
    );
  }

  if (allowed === false) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto max-w-lg py-24 text-center">
          <h1 className="text-balance text-xl font-bold text-foreground">You are not a paper checker yet</h1>
          <p className="mt-2 text-[14px] text-warm-secondary">
            Ask an admin to turn on the paper checker permission for your account.
          </p>
        </BentoPanel>
      </BentoStack>
    );
  }

  const filtered = Boolean(prefs && (prefs.subjects.length > 0 || prefs.classes.length > 0));
  const filterSummary = prefs
    ? [...prefs.subjects, ...prefs.classes.map((c) => `Class ${c}`)].join(', ')
    : '';
  const draftWaiting = waitingFor(facetsQuery.data, prefsDraftSubjects, prefsDraftClasses);

  return (
    <BentoStack className="min-h-screen bg-muted">
      <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-4xl">
        {banner}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-foreground">
            Paper checker
            {question ? (
              <span className="ml-2 inline-flex gap-1 align-middle">
                <DebugId label="question" value={question.id} />
                <DebugId label="paper" value={question.paper_id} />
              </span>
            ) : null}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full bg-muted px-3 py-1 text-[13px] font-semibold tabular-nums text-warm-secondary"
              aria-label={`Checked today ${statsQuery.data?.today_count ?? 0}, in total ${statsQuery.data?.total_count ?? 0}`}
            >
              Today {statsQuery.data?.today_count ?? 0} · Total {statsQuery.data?.total_count ?? 0}
            </span>
            <Chip onClick={() => setLeaderboardOpen((v) => !v)} pressed={leaderboardOpen} tone="brand">
              Leaderboard
            </Chip>
            <Chip onClick={openPrefs} tone="muted">
              My subjects
            </Chip>
          </div>
        </div>

        {filtered ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] text-warm-secondary">
            <span>
              Showing only: <span className="font-semibold text-foreground">{filterSummary}</span>
            </span>
            <button
              type="button"
              onClick={() => void savePrefs([], [])}
              className="tap-44 rounded-full px-2 font-semibold text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Show every subject
            </button>
          </div>
        ) : null}

        {leaderboardOpen && (
          <div className="mb-3 rounded-2xl bg-muted p-3">
            <p className="mb-2 text-[13px] font-semibold text-foreground">This week's top checkers</p>
            {leaderboardQuery.isLoading ? (
              <p className="text-[13px] text-warm-secondary">Loading...</p>
            ) : leaderboardQuery.isError ? (
              <p className="text-[13px] text-warm-secondary">Could not load the leaderboard. Try again in a moment.</p>
            ) : !leaderboardQuery.data || leaderboardQuery.data.length === 0 ? (
              <p className="text-[13px] text-warm-secondary">No one has checked a question this week yet.</p>
            ) : (
              <ol className="space-y-1 text-[13px] text-warm-secondary">
                {leaderboardQuery.data.map((row) => (
                  <li key={`${row.rank}-${row.first_name}`} className="flex justify-between">
                    <span>
                      {row.rank}. {row.first_name}
                    </span>
                    <span className="font-semibold tabular-nums text-foreground">{row.weekly_count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        <div aria-live="polite">
          {notice ? (
            <div
              role="status"
              // Floats over the page instead of pushing the question down
              // (no layout shift on every save).
              className={cn(
                'fixed left-1/2 top-24 z-40 w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl px-4 py-3 text-center text-[14px] font-semibold text-foreground shadow-lg animate-in fade-in-0 duration-200',
                notice.tone === 'ok' ? 'bg-mint' : 'bg-brand-subtle',
              )}
            >
              {notice.text}
            </div>
          ) : null}
          {error ? (
            <div role="alert" className="mb-3 rounded-2xl bg-destructive/10 px-4 py-3 text-[14px] text-destructive">
              {error}
            </div>
          ) : null}
        </div>

        {questionQuery.isLoading ? (
          <CheckerSkeleton />
        ) : questionQuery.isError ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">{LOAD_FAILED_TITLE}</p>
            <p className="text-[14px] text-warm-secondary">{LOAD_FAILED_NOTE}</p>
            <ActionButton tone="mint" onClick={() => void questionQuery.refetch()}>
              Try again
            </ActionButton>
          </div>
        ) : !question ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-balance text-lg font-semibold text-foreground">
              {filtered ? 'Nothing left in your subjects' : 'All done for now'}
            </p>
            <p className="max-w-md text-pretty text-[14px] text-warm-secondary">
              {filtered
                ? 'No questions are waiting for the subjects and classes you picked. Show every subject to keep going.'
                : 'No questions are waiting to be checked right now. Anything you skipped comes back to you after a day.'}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {filtered ? (
                <ActionButton tone="mint" onClick={() => void savePrefs([], [])}>
                  Show every subject
                </ActionButton>
              ) : null}
              <ActionButton tone={filtered ? 'muted' : 'mint'} onClick={refresh}>
                Check again
              </ActionButton>
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: the printed page snippet */}
            <div className="flex min-w-0 flex-col">
              <p className="mb-1 text-[12px] text-warm-meta">
                {pagePlan && !picturePlan ? PAGE_HEADING : pictureHeading(pictureUrl ? picturePlan : null)}
              </p>
              {picturePlan?.mayMissParts && pictureUrl ? (
                <p className="mb-2 text-[13px] leading-snug text-warm-secondary">{PICTURE_MAY_MISS_PARTS}</p>
              ) : null}
              {pagePlan && !picturePlan && pictureUrl ? (
                <PageImageViewer
                  src={pictureUrl}
                  alt={`the whole printed page ${pagePlan.page}, as scanned`}
                  note={pagePlan.note}
                  onError={() => setPictureUrl(null)}
                />
              ) : (
              <div className="flex max-h-[42vh] w-full flex-col gap-2 overflow-y-auto rounded-2xl bg-white p-2 lg:max-h-[60vh]">
                {pictureUrl === undefined ? (
                  <div className="h-40 animate-pulse rounded-[14px] bg-muted" aria-label="Loading the picture" />
                ) : pictureUrl ? (
                  // Natural size, never stretched past it: a small crop blown
                  // up to the panel width turned into a few giant blurry words.
                  <img
                    key={pictureUrl}
                    src={pictureUrl}
                    alt={picturePlan && picturePlan.kind !== 'own' ? 'the printed whole question' : 'the printed question'}
                    onError={() => setPictureUrl(null)}
                    className="mx-auto block h-auto max-w-full shrink-0"
                  />
                ) : (
                  // D65 + W11: no trustworthy crop exists, or it failed to load.
                  // The question is still checkable and every button works.
                  <div className="p-6 text-center">
                    <p className="text-[14px] font-semibold text-foreground">{NO_PICTURE_TITLE}</p>
                    <p className="mt-1 text-[13px] text-warm-secondary">{NO_PICTURE_NOTE}</p>
                  </div>
                )}
              </div>
              )}
              {(question.school || question.subject) && (
                <p className="mt-1 text-[12px] text-warm-meta">
                  {[question.school ?? 'School not known', question.subject, question.cls ? `Class ${question.cls}` : null, question.year]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
            </div>

            {/* Right: the question + actions */}
            <div className="flex min-w-0 flex-col">
              {blank ? (
                <Callout tone="warn" title="There are no words to check here">
                  The computer read this question together with another one, so its words are not on this row. Press Ask
                  for help and an admin will sort it out.
                </Callout>
              ) : garbled ? (
                <Callout tone="warn" title="These words look scrambled">
                  Do not try to retype them. Press Ask for help and an admin will fix it from the paper.
                </Callout>
              ) : null}

              {whatToCheckLine.line ? (
                <div className="mb-3 rounded-2xl bg-brand-subtle p-3">
                  <p className="mb-1 text-[13px] font-semibold text-foreground">What to check</p>
                  <p className="text-[14px] leading-snug text-foreground">{whatToCheckLine.line}</p>
                  {whatToCheckLine.detail ? (
                    <p className="mt-1 text-[12px] text-warm-secondary">
                      What the computer noticed: {whatToCheckLine.detail}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {context ? <WholeQuestion context={context} /> : null}

              {/* W14: the passage an English question is about. */}
              {english?.passage ? (
                <div className="mb-2 rounded-2xl bg-muted px-4 py-3">
                  <p className="mb-1 text-[12px] font-semibold text-warm-meta">{passageHeading(english.passage.kind)}</p>
                  <div className="max-h-[40vh] overflow-y-auto">
                    <MathText text={english.passage.text} className="text-[14px] leading-relaxed text-foreground" />
                  </div>
                </div>
              ) : null}
              {english?.setText ? <p className="mb-2 text-[12px] text-warm-secondary">From: {english.setText}</p> : null}

              {question.instructions ? (
                <div className="mb-2 rounded-2xl bg-muted px-4 py-2">
                  <MathText text={question.instructions} className="text-[14px] italic leading-relaxed text-warm-secondary" />
                </div>
              ) : null}

              {context ? <p className="mb-1 text-[13px] font-semibold text-foreground">The part you are checking</p> : null}

              {mode === 'fix' ? (
                <div>
                  <div className="mb-2 rounded-2xl bg-brand-subtle px-3 py-2">
                    <p className="text-[13px] font-semibold text-foreground">{FIX_RULE_TITLE}</p>
                    <p className="text-[13px] leading-snug text-warm-secondary">{FIX_RULE_NOTE}</p>
                  </div>
                  <BodyEditor value={bodyDraft} onChange={setBodyDraft} disabled={submitting} />
                  <OptionList options={question.options} />
                  {showBigEditWarning ? (
                    <p role="status" className="mt-1 text-[13px] leading-snug text-destructive">
                      {BIG_EDIT_WARNING}
                    </p>
                  ) : null}
                </div>
              ) : mode === 'split' ? (
                <div>
                  <p className="mb-2 text-[13px] text-warm-secondary">
                    Tap right before where the second question starts, then press Split here.
                  </p>
                  <textarea
                    readOnly
                    value={bodyDraft}
                    onClick={(e) => onSplitCaret(e.currentTarget)}
                    onKeyUp={(e) => onSplitCaret(e.currentTarget)}
                    onSelect={(e) => onSplitCaret(e.currentTarget)}
                    rows={8}
                    aria-label="Tap where the second question starts"
                    className="w-full rounded-2xl bg-muted p-3 text-[16px] leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                  <SplitPreview body={bodyDraft} at={splitAt} />
                </div>
              ) : blank ? null : (
                <div className="rounded-2xl bg-muted p-4">
                  <MathText text={bodyDraft} className="break-words text-[16px] leading-relaxed text-foreground" />
                  <OptionList options={question.options} />
                </div>
              )}

              {mode === 'check' && splitOffered && (
                <button
                  type="button"
                  onClick={() => setMode('split')}
                  className="tap-44 mt-2 self-start rounded-full bg-brand-subtle px-4 py-2 text-[13px] font-semibold text-foreground transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Split here, these look like two questions
                </button>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[13px] font-medium text-warm-secondary">
                  Question number
                  <input
                    value={numberDraft}
                    onChange={(e) => setNumberDraft(e.target.value)}
                    disabled={mode !== 'fix'}
                    placeholder={mode === 'fix' ? 'e.g. 5' : 'none'}
                    className="min-h-[40px] w-24 rounded-xl bg-muted px-3 py-1 text-center text-[14px] font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-70"
                  />
                </label>
                <label className="flex items-center gap-2 text-[13px] font-medium text-warm-secondary">
                  Marks
                  <input
                    inputMode="decimal"
                    value={marksDraft}
                    onChange={(e) => setMarksDraft(e.target.value)}
                    disabled={mode !== 'fix'}
                    placeholder={mode === 'fix' ? 'e.g. 2' : 'none'}
                    aria-invalid={marksInvalid || undefined}
                    className={cn(
                      'min-h-[40px] w-20 rounded-xl bg-muted px-3 py-1 text-center text-[14px] tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-70',
                      marksInvalid && 'ring-2 ring-destructive',
                    )}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action footer: sticky on a phone so the buttons stay under the
            thumb while a long passage scrolls. */}
        {question && !questionQuery.isError ? (
          <div className="sticky bottom-0 z-10 -mx-1 mt-5 flex flex-wrap items-center gap-2.5 border-t border-warm-hairline bg-card px-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4">
            {mode === 'split' ? (
              <>
                <ActionButton tone="mint" onClick={doSplit} disabled={!canSplitAt(bodyDraft, splitAt) || submitting}>
                  {submitting ? 'Saving...' : 'Split here'}
                </ActionButton>
                <ActionButton tone="muted" onClick={cancelEdit} disabled={submitting}>
                  Cancel
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton
                  tone={blank && mode === 'check' ? 'muted' : 'mint'}
                  onClick={doPass}
                  disabled={submitting || !canPass || marksInvalid}
                >
                  {submitting ? 'Saving...' : mode === 'fix' ? (edited ? 'Save, now it matches' : 'Looks right') : 'Looks right'}
                </ActionButton>
                {mode === 'check' ? (
                  <ActionButton tone="dark" onClick={() => setMode('fix')} disabled={submitting}>
                    Fix it
                  </ActionButton>
                ) : (
                  <ActionButton tone="muted" onClick={cancelEdit} disabled={submitting}>
                    Cancel
                  </ActionButton>
                )}
                <ActionButton tone="brand" onClick={() => setHelpOpen(true)} disabled={submitting}>
                  Ask for help
                </ActionButton>
                <ActionButton tone="muted" onClick={doSkip} disabled={submitting}>
                  Show me another paper
                </ActionButton>
              </>
            )}
            <p className="ml-auto hidden text-[12px] text-warm-meta lg:block">
              {mode === 'check' ? shortcutHint({ canSplit: splitOffered, canPass }) : 'Esc cancels'}
            </p>
          </div>
        ) : null}
      </BentoPanel>

      {prefsPromptOpen ? (
        <Modal onClose={() => setPrefsPromptOpen(false)} labelledBy="checker-prefs-title">
          <h2 id="checker-prefs-title" className="mb-2 text-[16px] font-bold text-foreground">
            Which papers do you want to check?
          </h2>
          <p className="mb-3 text-[13px] text-warm-secondary">
            Pick as many subjects and classes as you like, or All to see every paper. You can change this any time from
            My subjects.
          </p>
          <p className="mb-1 text-[13px] font-semibold text-foreground">Subjects</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <AllChip active={prefsDraftSubjects.length === 0} onClick={() => setPrefsDraftSubjects([])} />
            {choices.subjects.map((s) => (
              <FacetChip
                key={s.value}
                choice={s}
                label={s.value}
                active={prefsDraftSubjects.includes(s.value)}
                onClick={() =>
                  setPrefsDraftSubjects((prev) =>
                    prev.includes(s.value) ? prev.filter((x) => x !== s.value) : [...prev, s.value],
                  )
                }
              />
            ))}
          </div>
          <p className="mb-1 text-[13px] font-semibold text-foreground">Classes</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <AllChip active={prefsDraftClasses.length === 0} onClick={() => setPrefsDraftClasses([])} />
            {choices.classes.map((c) => (
              <FacetChip
                key={c.value}
                choice={c}
                label={classLabel(c.value)}
                active={prefsDraftClasses.includes(c.value)}
                onClick={() =>
                  setPrefsDraftClasses((prev) =>
                    prev.includes(c.value) ? prev.filter((x) => x !== c.value) : [...prev, c.value],
                  )
                }
              />
            ))}
          </div>
          {draftWaiting !== null ? (
            <p className="mb-3 text-[13px] tabular-nums text-warm-secondary">
              {draftWaiting === 0
                ? 'Nothing is waiting for that choice right now.'
                : `${draftWaiting} ${draftWaiting === 1 ? 'question is' : 'questions are'} waiting for that choice.`}
            </p>
          ) : null}
          {prefsError ? <p className="mb-2 text-[13px] text-destructive">{prefsError}</p> : null}
          <div className="flex gap-2">
            <ActionButton tone="mint" onClick={() => void savePrefs()} disabled={prefsSaving}>
              {prefsSaving ? 'Saving...' : 'Save'}
            </ActionButton>
            <ActionButton tone="muted" onClick={() => setPrefsPromptOpen(false)} disabled={prefsSaving}>
              Not now
            </ActionButton>
          </div>
        </Modal>
      ) : null}

      {helpOpen && question ? (
        <Modal onClose={() => setHelpOpen(false)} labelledBy="checker-help-title">
          <h2 id="checker-help-title" className="mb-2 text-[16px] font-bold text-foreground">
            What do you need help with?
          </h2>
          <p className="mb-3 text-[13px] text-warm-secondary">
            Someone who knows more will take a look. This does not hold up the rest of the paper.
          </p>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {HELP_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={helpReason === r}
                onClick={() => setHelpReason(r)}
                className={cn(
                  'tap-44 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  helpReason === r ? 'bg-brand text-foreground' : 'bg-muted text-warm-secondary',
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            autoFocus
            value={helpReason}
            onChange={(e) => setHelpReason(e.target.value)}
            placeholder="Or say it in your own words"
            rows={3}
            aria-label="What can't you fix"
            className="w-full rounded-xl bg-muted p-3 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          {error ? <p className="mt-2 text-[13px] text-destructive">{error}</p> : null}
          <div className="mt-3 flex gap-2">
            <ActionButton tone="brand" onClick={() => void doAskForHelp(helpReason)} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send'}
            </ActionButton>
            <ActionButton tone="muted" onClick={() => setHelpOpen(false)} disabled={submitting}>
              Cancel
            </ActionButton>
          </div>
        </Modal>
      ) : null}
    </BentoStack>
  );
}

/* Shaped like what it replaces: a picture box and a question box. */
function CheckerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Loading the next question" role="status">
      <div className="h-48 animate-pulse rounded-2xl bg-muted lg:h-72" />
      <div className="flex flex-col gap-3">
        <div className="h-16 animate-pulse rounded-2xl bg-muted" />
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function Callout({ tone, title, children }: { tone: 'warn'; title: string; children: React.ReactNode }) {
  return (
    <div role="note" className={cn('mb-3 rounded-2xl p-3', tone === 'warn' && 'bg-destructive/10')}>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-[13px] leading-snug text-warm-secondary">{children}</p>
    </div>
  );
}

/* What the two halves will be, before the checker commits to a split. */
function SplitPreview({ body, at }: { body: string; at: number | null }) {
  if (at === null) {
    return <p className="mt-2 text-[13px] text-warm-meta">Nothing chosen yet.</p>;
  }
  if (!canSplitAt(body, at)) {
    return (
      <p className="mt-2 text-[13px] text-destructive">
        Tap inside the words, between the two questions. Both parts need some words.
      </p>
    );
  }
  const { first, second } = splitHalves(body, at);
  const tail = Array.from(first.trimEnd()).slice(-60).join('');
  const head = Array.from(second.trimStart()).slice(0, 60).join('');
  return (
    <div className="mt-2 grid gap-2 text-[13px] sm:grid-cols-2">
      <div className="rounded-xl bg-muted p-2">
        <p className="font-semibold text-foreground">First question ends with</p>
        <p className="break-words text-warm-secondary">...{tail}</p>
      </div>
      <div className="rounded-xl bg-muted p-2">
        <p className="font-semibold text-foreground">Second question starts with</p>
        <p className="break-words text-warm-secondary">{head}...</p>
      </div>
    </div>
  );
}

/* A dialog: Escape and the backdrop close it, focus goes inside. */
function Modal({
  onClose,
  labelledBy,
  children,
}: {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) el.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* W11: the whole question a sub-part belongs to, read-only, with the part
   being checked highlighted. Bodies go through MathText verbatim. */
function WholeQuestion({ context }: { context: QuestionContext }) {
  return (
    <div className="mb-3 rounded-2xl border border-warm-hairline p-3">
      <p className="mb-2 text-[13px] font-semibold text-foreground">{contextHeading(context)}</p>
      {context.parent ? (
        <div
          aria-current={context.currentIsParent ? 'true' : undefined}
          className={cn('rounded-xl p-2.5', context.currentIsParent ? 'bg-brand-subtle ring-2 ring-brand' : 'bg-muted')}
        >
          {context.currentIsParent ? <CheckingTag /> : null}
          <MathText text={context.parent.body ?? ''} className="text-[14px] leading-relaxed text-foreground" />
          <OptionList options={context.parent.options} />
        </div>
      ) : null}
      <ol className="mt-2 space-y-2">
        {context.parts.map((part, i) => {
          const current = part.id === context.currentId;
          return (
            <li
              key={part.id}
              aria-current={current ? 'true' : undefined}
              className={cn('rounded-xl p-2.5', current ? 'bg-brand-subtle ring-2 ring-brand' : 'bg-muted')}
              style={{ marginLeft: Math.min(Math.max(part.depth - 1, 0), 3) * 12 }}
            >
              {current ? <CheckingTag /> : null}
              {/* The printed label, unless the body already starts with it
                  ("(a)" over "(a) Name the..." read twice). */}
              {(part.body ?? '').trimStart().startsWith(partLabel(part, i)) ? null : (
                <p className="mb-0.5 text-[12px] font-semibold text-warm-secondary">{partLabel(part, i)}</p>
              )}
              <MathText text={part.body ?? ''} className="text-[14px] leading-relaxed text-foreground" />
              <OptionList options={part.options} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CheckingTag() {
  return (
    <span className="mb-1 inline-block rounded-full bg-brand px-2 py-0.5 text-[12px] font-bold text-foreground">
      You are checking this part
    </span>
  );
}

const CHIP =
  'tap-44 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand';

function Chip({
  onClick,
  pressed,
  tone,
  children,
}: {
  onClick: () => void;
  pressed?: boolean;
  tone: 'brand' | 'muted';
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn(CHIP, tone === 'brand' ? 'bg-brand-subtle text-foreground' : 'bg-muted text-warm-secondary')}
    >
      {children}
    </button>
  );
}

/* "All" is the empty selection: the server treats an empty or null list as
   no filter, so tapping All just clears the picks. */
function AllChip({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(CHIP, active ? 'bg-brand text-foreground' : 'bg-muted text-warm-secondary')}
    >
      All
    </button>
  );
}

function FacetChip({
  choice,
  label,
  active,
  onClick,
}: {
  choice: FacetChoice;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(CHIP, active ? 'bg-brand text-foreground' : 'bg-muted text-warm-secondary')}
    >
      {label}
      {choice.waiting !== null ? <span className="ml-1 tabular-nums opacity-70">{choice.waiting}</span> : null}
    </button>
  );
}

function ActionButton({
  tone,
  onClick,
  disabled,
  children,
}: {
  tone: 'mint' | 'dark' | 'brand' | 'muted';
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const toneClass = {
    mint: 'bg-mint text-foreground',
    dark: 'bg-panel text-background',
    brand: 'bg-brand text-foreground',
    muted: 'bg-muted text-warm-secondary',
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'tap-44 rounded-full px-4 py-2.5 text-[15px] sm:px-5 sm:py-3 font-bold transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:active:scale-100',
        toneClass,
      )}
    >
      {children}
    </button>
  );
}
