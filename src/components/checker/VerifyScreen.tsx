import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { MathText } from '@/components/papers/math-text';
import { BodyEditor } from '@/components/checker/BodyEditor';
import { OptionList } from '@/components/checker/OptionList';
import { PaperPageFlip } from '@/components/checker/PaperPageFlip';
import { CheckerSkeleton, Callout, CheckGuidance, Modal, SplitPreview, WholeQuestion, useSignedUrl } from '@/components/checker/CheckerBits';
import { cn } from '@/lib/utils';
import type { CheckerApi } from '@/lib/checker-api';
import { whatToCheck, needsSplit } from '@/lib/checker-kid-reasons';
import { englishContext, passageHeading } from '@/lib/checker-english';
import { assembleQuestionContext, type QuestionContext } from '@/lib/checker-context';
import { planCheckerPicture, pictureHeading, PICTURE_MAY_MISS_PARTS, type PicturePlan } from '@/lib/checker-pictures';
import { planVerifiedPage, PAGE_HEADING, type PagePlan } from '@/lib/checker-page';
import { describeLanes, unmappedCodes } from '@/lib/checker-lanes';
import { lostTextSuggestion, LOST_TEXT_CONFIRM, LOST_TEXT_HEADING, LOST_TEXT_NOTE, LOST_TEXT_TITLE } from '@/lib/checker-lost-text';
import {
  typoSaveProblem,
  TYPO_CHECKBOX_LABEL,
  TYPO_RULE_TITLE,
  TYPO_RULE_NOTE,
  TYPO_NOTE_LABEL,
  TYPO_NOTE_MAX,
} from '@/lib/checker-save';
import { DebugFacts } from '@/components/admin/DebugFacts';
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
import { usePaperReviewChannel, useLiveRefresh } from '@/hooks/usePaperReviewChannel';
import { isForeignChangeToOpenQuestion } from '@/lib/paper-review-realtime';
import { DebugId } from '@/components/DebugId';
import { ActionButton } from '@/components/checker/CheckerButtons';
import { CheckerWalkthrough } from '@/components/checker/CheckerWalkthrough';
import { CHECKER_PRACTICE_PATH, CHECKER_TOUR_PARAM, hasSeenWalkthrough, markWalkthroughSeen } from '@/lib/checker-onboarding';
import { paperLabel, paperProgress } from '@/lib/checker-progress';

/* The verify screen ("Start verifying"): one question of one paper at a time.
   The question and its details are on the left; the picture of the printed
   page is on the right and switches with the question. Pass, Fix it, Ask the
   HOD and Skip load the next question of the same paper. When nothing is left
   it says the paper is finished and goes back to the list.

   Moved out of pages/Checker.tsx: the logic, the picture rules (a doubtful crop
   is never shown, an unverified page is never shown, no picture at all falls
   back to the whole paper) and the keyboard shortcuts are unchanged. */

type Mode = 'check' | 'fix' | 'split';

const HELP_REASONS = [
  'I cannot read the words',
  'The words are scrambled',
  'There is no question here',
  'The picture is of a different question',
];

export function VerifyScreen({
  api,
  scope,
  dummy,
  paperId,
  userId,
  userName,
  onExit,
  onList,
}: {
  api: CheckerApi;
  scope: string;
  dummy: boolean;
  paperId: string;
  userId?: string;
  userName?: string | null;
  /** Back to the paper's list of questions. */
  onExit: () => void;
  /** Back to the list of all my papers (the finished screen's button says so). */
  onList?: () => void;
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const labelRef = useRef('this paper');

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
    queryKey: ['verifier-next', scope, paperId],
    queryFn: () => api.nextInPaper(paperId),
    retry: 1,
    // Always ask the server: the question is leased for 10 minutes, so a cached
    // one may have been taken by the time it is shown.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
  const question = questionQuery.data ?? null;

  // Where the verifier is in this paper: "3 of 12 done". The paper's row
  // is shared with the list, and the old answer stays on screen while the new
  // one loads so the bar does not flicker between questions.
  const papersQuery = useQuery({
    queryKey: ['verifier-papers', scope],
    queryFn: api.myPapers,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
  const paperRow = papersQuery.data?.find((p) => p.paper_id === paperId) ?? null;
  const progress = paperRow ? paperProgress({ done_count: paperRow.done, remaining_count: paperRow.remaining, total_count: paperRow.total }) : null;
  // Skip sends a question to the end of the paper (20261007140000). On the
  // last one left it would come straight back, so Skip is off and the screen
  // says to ask the HOD instead.
  const lastOne = paperRow != null && paperRow.remaining <= 1;
  if (question) labelRef.current = paperLabel(paperRow ?? question);
  const currentPaperLabel = question ? paperLabel(paperRow ?? question) : labelRef.current;

  // Lost text: no words, but the AI transcribed the page (checker-lost-text.ts).
  const lost = question ? lostTextSuggestion(question.body, question.flag_detail) : null;

  // W11: the whole question a sub-part belongs to (empty for a standalone
  // question, and also empty if the RPC is not deployed yet).
  const contextQuery = useQuery({
    queryKey: ['checker-question-context', scope, question?.id],
    queryFn: () => api.questionContext(question!.id),
    enabled: Boolean(question?.id),
    staleTime: 5 * 60 * 1000,
  });
  const context: QuestionContext | null = question ? assembleQuestionContext(contextQuery.data, question.id) : null;

  // The one picture of the printed paper (checker-pictures.ts). Null plan =
  // no trustworthy crop, so no signed URL is asked for. Owner, 2026-09-28:
  // never a tap-to-show button, never a doubtful crop.
  const picturePlan: PicturePlan | null =
    question && !contextQuery.isLoading ? planCheckerPicture(question, context) : null;
  // The verified whole page, beside every question that has one, crop or not
  // (owner round 24, checker-page.ts). Null when the page is not verified.
  const pagePlan: PagePlan | null = question && !contextQuery.isLoading ? planVerifiedPage(question) : null;
  const viewPath = picturePlan?.path ?? '';
  const pagePath = pagePlan?.path ?? '';
  // Crop first; the whole page only after a tap (owner 2026-10-03). With no
  // crop the page is the only picture, so it is shown straight away. The page
  // image is not even requested until it is wanted.
  const [showPage, setShowPage] = useState(false);
  const picturePlanKey = question && !contextQuery.isLoading ? `${question.id}|${viewPath}` : '';
  // undefined = still looking, null = none (or it failed to load).
  const pictureUrl = useSignedUrl(api, picturePlanKey, viewPath);
  const [pictureFailed, setPictureFailed] = useState<string>('');
  const cropShown = pictureUrl && pictureFailed !== picturePlanKey ? pictureUrl : pictureUrl === undefined ? undefined : null;
  // While a picture is still loading, sentences assume it will arrive when
  // one is planned.
  const hasCrop = cropShown === undefined ? viewPath !== '' : Boolean(cropShown);
  // A crop that failed to load leaves the page as the picture: show it.
  const pageOpen = pagePath !== '' && (showPage || !hasCrop);
  const pagePlanKey = question && !contextQuery.isLoading && pageOpen ? `${question.id}|${pagePath}` : '';
  const pageUrl = useSignedUrl(api, pagePlanKey, pagePath);
  const [pageFailed, setPageFailed] = useState<string>('');
  const pageShown = pageUrl && pageFailed !== pagePlanKey ? pageUrl : pageUrl === undefined ? undefined : null;
  const hasPage = pageShown === undefined ? pagePath !== '' : Boolean(pageShown);
  const hasPicture = hasCrop || hasPage;
  const whatToCheckLine = question
    ? whatToCheck(question.flag_reasons, question.flag_detail, { hasPicture })
    : { line: null, detail: null };
  // Every flag has a lane in plain English (checker-lanes.ts). Without a
  // picture the older picture-aware sentences are used instead.
  const laneSummary = question ? describeLanes(question.flag_reasons, question.flag_detail) : null;
  useEffect(() => {
    const missing = unmappedCodes(question?.flag_reasons);
    if (missing.length) console.warn('[checker] flag codes with no lane:', missing.join(', '));
  }, [question?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // W14: English questions carry their passage and set text in `source`.
  const english = question ? englishContext(question.source) : null;

  const [mode, setMode] = useState<Mode>('check');
  const [bodyDraft, setBodyDraft] = useState('');
  const [numberDraft, setNumberDraft] = useState('');
  const [marksDraft, setMarksDraft] = useState('');
  const [splitAt, setSplitAt] = useState<number | null>(null);
  const [printedTypo, setPrintedTypo] = useState(false);
  const [typoNote, setTypoNote] = useState('');
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
      setBodyDraft(lost ?? question.body ?? '');
      setNumberDraft(question.display_number ?? '');
      setMarksDraft(question.marks != null ? String(question.marks) : '');
      setShowPage(false);
      setSplitAt(null);
      setPrintedTypo(false);
      setTypoNote('');
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
    qc.invalidateQueries({ queryKey: ['verifier-papers', scope] });
  });
  usePaperReviewChannel({
    enabled: !dummy,
    userId,
    fullName: userName,
    onActivity: (event) => {
      refreshCounters();
      if (!submitting && isForeignChangeToOpenQuestion(event, question?.id, userId)) {
        setNotice({
          text:
            event.action === 'reclassify'
              ? 'A check moved that question to an admin, so here is the next one.'
              : 'Someone else just changed that question, so here is the next one.',
          tone: 'warn',
        });
        qc.invalidateQueries({ queryKey: ['verifier-next', scope, paperId] });
      } else if (!question && !submitting) {
        // Nothing open: any activity may mean new questions are waiting.
        qc.invalidateQueries({ queryKey: ['verifier-next', scope, paperId] });
      }
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['verifier-next', scope, paperId] });
    qc.invalidateQueries({ queryKey: ['checker-my-stats', scope] });
    qc.invalidateQueries({ queryKey: ['verifier-papers', scope] });
    qc.invalidateQueries({ queryKey: ['verifier-paper-questions', scope, paperId] });
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
      setError('This question has no words, so it cannot be marked as right. Press Ask the HOD.');
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
      const typo = mode === 'fix' && printedTypo;
      const typoProblem = typoSaveProblem(typo, bodyChanged);
      if (typoProblem) {
        setError(typoProblem);
        return;
      }
      await run(
        () =>
          api.fixQuestion(
            question.id,
            {
              // Unchanged text is not sent at all (null keeps the stored body),
              // so fixing only the marks can never rewrite the words.
              body: bodyChanged ? finalBody : null,
              display_number: savedNumber,
              marks: marksDraft.trim() === '' ? null : Number(marksDraft),
            },
            // The version this checker saw: a save over a newer version is
            // refused (40001) instead of silently overwriting it.
            { version: question.version, printedTypo: typo, typoNote: typo ? typoNote : null },
          ),
        typo ? 'Saved with the typo corrected.' : 'Saved.',
      );
    } else {
      await run(() => api.passQuestion(question.id, question.version), 'Marked as right.');
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
    }, 'Sent to your HOD.');
  }

  async function doSkip() {
    if (!question || submitting || lastOne) return;
    await run(() => api.skipQuestion(question.id),'Skipped. It comes back at the end of this paper.');
  }

  function cancelEdit() {
    if (!question) return;
    setBodyDraft(lost ?? question.body ?? '');
    setNumberDraft(question.display_number ?? '');
    setMarksDraft(question.marks != null ? String(question.marks) : '');
    setSplitAt(null);
    setPrintedTypo(false);
    setTypoNote('');
    setMode('check');
  }

  function onSplitCaret(el: HTMLTextAreaElement) {
    setSplitAt(codePointOffset(el.value, el.selectionStart));
  }

  /* First-visit walkthrough. It only starts once the real question is on
     screen and the subject picker is out of the way, so it never delays or
     covers the load. Shown once per account per browser; `?tour=1` (from
     Help) replays it. */
  const [tourOpen, setTourOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tourUserId = dummy ? 'dummy' : (userId ?? '');
  useEffect(() => {
    if (tourOpen || !question || !tourUserId) return;
    if (searchParams.get(CHECKER_TOUR_PARAM) === '1') {
      setTourOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete(CHECKER_TOUR_PARAM);
      setSearchParams(next, { replace: true });
      return;
    }
    if (!hasSeenWalkthrough(tourUserId)) setTourOpen(true);
  }, [tourOpen, question, tourUserId, searchParams, setSearchParams]);

  function closeTour() {
    setTourOpen(false);
    if (tourUserId) markWalkthroughSeen(tourUserId);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (submitting || tourOpen) return;
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
  }, [mode, helpOpen, submitting, tourOpen, question?.id, canPass, splitOffered]);

  const metaChips = question
    ? [
        question.display_number ? `Question ${question.display_number}` : null,
        question.marks != null ? `${question.marks} ${question.marks === 1 ? 'mark' : 'marks'}` : null,
        question.subject,
        question.cls ? `Class ${question.cls}` : null,
        question.school,
        question.year,
      ].filter((x): x is string => Boolean(x))
    : [];

  return (
    <div data-testid="verify-screen">
      <div data-tour="paper" data-testid="verify-header" className="mb-4 rounded-2xl bg-muted p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[.04em] text-warm-meta">
              Verifying
              {question ? (
                <span className="ml-2 inline-flex gap-1 align-middle normal-case tracking-normal">
                  <DebugId label="question" value={question.id} />
                  <DebugId label="paper" value={question.paper_id} />
                  <DebugFacts
                    facts={{
                      version: question.version,
                      flags: question.flag_reasons,
                      page: typeof question.source?.page === 'number' ? question.source.page : null,
                      'page verified': typeof question.source?.page_verified === 'boolean' ? question.source.page_verified : null,
                      align: typeof question.source?.align_score === 'number' ? question.source.align_score : null,
                    }}
                  />
                </span>
              ) : null}
            </p>
            <h2 className="text-balance text-[17px] font-bold leading-snug text-foreground">{currentPaperLabel}</h2>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="tap-44 rounded-full bg-card px-4 py-2 text-[13px] font-semibold text-warm-secondary transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Back to this paper's questions
          </button>
        </div>
        {progress && question ? (
          <div className="mt-3">
            <p className="mb-1 text-[14px] font-semibold tabular-nums text-foreground" aria-live="polite">
              {progress.label}
            </p>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-card"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
              aria-label={progress.label}
            >
              <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${Math.max(progress.percent, 4)}%` }} />
            </div>
          </div>
        ) : null}
      </div>

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
          <div className="flex flex-col items-center gap-3 py-16 text-center" data-testid="paper-finished">
            <p className="text-balance text-xl font-bold text-foreground">Paper finished</p>
            <p className="max-w-md text-pretty text-[14px] text-warm-secondary">
              You have been through every question you can settle on {currentPaperLabel}. Anything you sent to the HOD stays with them.
            </p>
            <ActionButton tone="mint" onClick={onList ?? onExit}>
              Back to my papers
            </ActionButton>
          </div>
        ) : (
          // Desktop: the question on the left, the picture of the printed page on the right.
          // Phone (one column): the question first, then the picture, so the words to check
          // are not pushed below a whole A4 page. The picture follows the question.
          <div className="min-h-0">
            <ul className="mb-3 flex flex-wrap gap-1.5" aria-label="About this question" data-testid="question-meta">
              {metaChips.map((c) => (
                <li key={c} className="rounded-full bg-muted px-3 py-1 text-[12px] font-semibold text-warm-secondary">
                  {c}
                </li>
              ))}
            </ul>
            {/* How to check: quiet guidance above the pair, never a card. The
                comparison below (what we have, the printed paper) is the job. */}
            {hasPicture && laneSummary && (laneSummary.blocks.length > 0 || laneSummary.unmapped.length > 0) ? (
              <CheckGuidance summary={laneSummary} />
            ) : whatToCheckLine.line ? (
              <CheckGuidance line={whatToCheckLine.line} detail={whatToCheckLine.detail} />
            ) : null}
          <div className="grid min-h-0 grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Left: the question, with its details in plain sight. */}
            <div className="flex min-w-0 flex-col">
              {lost ? (
                <Callout tone="warn" title={LOST_TEXT_TITLE}>
                  {LOST_TEXT_NOTE}
                </Callout>
              ) : blank ? (
                <Callout tone="warn" title="There are no words to check here">
                  The computer read this question together with another one, so its words are not on this row. Press Ask
                  the HOD and your HOD will sort it out.
                </Callout>
              ) : garbled ? (
                <Callout tone="warn" title="These words look scrambled">
                  Do not try to retype them. Press Ask the HOD and your HOD will fix it from the paper.
                </Callout>
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

              {context ? (
                <p className="mb-1 text-[13px] font-semibold text-foreground">The part you are checking</p>
              ) : blank && !lost && mode === 'check' ? null : (
                // Same label style as "The printed paper" on the right, so the
                // eye reads the two as a pair.
                <p className="mb-1 text-[12px] text-warm-meta">What we have</p>
              )}

              {mode === 'fix' ? (
                <div>
                  <div className="mb-2 rounded-2xl bg-brand-subtle px-3 py-2">
                    <p className="text-[13px] font-semibold text-foreground">
                      {printedTypo ? TYPO_RULE_TITLE : FIX_RULE_TITLE}
                    </p>
                    <p className="text-[13px] leading-snug text-warm-secondary">
                      {printedTypo ? TYPO_RULE_NOTE : FIX_RULE_NOTE}
                    </p>
                  </div>
                  <BodyEditor value={bodyDraft} onChange={setBodyDraft} disabled={submitting} />
                  {/* Owner round 24: a student may correct a typo printed on
                      the paper. Off by default; the printed version is kept
                      in version history and an admin can put it back. */}
                  <label className="tap-44 mt-2 flex cursor-pointer items-start gap-2.5 rounded-2xl bg-muted px-3 py-2.5 text-[14px] text-foreground">
                    <input
                      type="checkbox"
                      checked={printedTypo}
                      onChange={(e) => setPrintedTypo(e.target.checked)}
                      disabled={submitting}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-brand-blue"
                    />
                    <span className="leading-snug">{TYPO_CHECKBOX_LABEL}</span>
                  </label>
                  {printedTypo ? (
                    <label className="mt-2 flex flex-col gap-1 text-[13px] font-medium text-warm-secondary">
                      {TYPO_NOTE_LABEL}
                      <input
                        value={typoNote}
                        maxLength={TYPO_NOTE_MAX}
                        onChange={(e) => setTypoNote(e.target.value)}
                        disabled={submitting}
                        placeholder="e.g. the paper printed 'teh' for 'the'"
                        className="min-h-[44px] rounded-xl bg-muted px-3 py-2 text-[16px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      />
                    </label>
                  ) : null}
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
              ) : blank && !lost ? null : (
                <div data-tour="question" className="rounded-2xl border border-warm-hairline bg-card p-4">
                  {lost ? <p className="mb-2 text-[12px] font-semibold text-warm-meta">{LOST_TEXT_HEADING}</p> : null}
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
            {/* Right: the printed page and the picture of this question. */}
            <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
              {viewPath && cropShown !== null ? (
                <div className="flex min-w-0 flex-col">
                  <p className="mb-1 text-[12px] text-warm-meta">{pictureHeading(cropShown ? picturePlan : null)}</p>
                  {picturePlan?.mayMissParts && cropShown ? (
                    <p className="mb-2 text-[13px] leading-snug text-warm-secondary">{PICTURE_MAY_MISS_PARTS}</p>
                  ) : null}
                  <div data-tour="picture" className="flex max-h-[42vh] w-full flex-col gap-2 overflow-y-auto rounded-2xl border border-warm-hairline bg-white p-2 lg:max-h-[60vh]">
                    {cropShown === undefined ? (
                      <div className="h-40 animate-pulse rounded-[14px] bg-muted" aria-label="Loading the picture" />
                    ) : (
                      // Natural size, never stretched past it: a small crop blown
                      // up to the panel width turned into a few giant blurry words.
                      <img
                        key={cropShown}
                        src={cropShown}
                        alt={picturePlan && picturePlan.kind !== 'own' ? 'the printed whole question' : 'the printed question'}
                        onError={() => setPictureFailed(picturePlanKey)}
                        className="mx-auto block h-auto max-w-full shrink-0"
                      />
                    )}
                  </div>
                </div>
              ) : null}

              {!picturePlanKey ? (
                <div className="h-40 animate-pulse rounded-2xl bg-muted" aria-label="Loading the picture" />
              ) : null}

              {/* The whole verified page: behind a tap when there is a crop,
                  straight away when the page is the only picture. */}
              {pagePlan && viewPath !== '' && hasCrop ? (
                <button
                  type="button"
                  aria-expanded={showPage}
                  onClick={() => setShowPage((v) => !v)}
                  className="tap-44 self-start rounded-full bg-brand-subtle px-4 py-2 text-[13px] font-semibold text-foreground transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {showPage ? 'Hide the whole page' : 'See the whole page'}
                </button>
              ) : null}
              {pagePlan && pageOpen && pageShown !== null ? (
                <div data-tour={hasCrop ? undefined : 'picture'} className="flex min-w-0 flex-col">
                  <p className="mb-1 text-[12px] text-warm-meta">{PAGE_HEADING}</p>
                  {pageShown === undefined ? (
                    <div className="h-72 animate-pulse rounded-2xl bg-muted" aria-label="Loading the printed page" />
                  ) : (
                    <PageImageViewer
                      src={pageShown}
                      alt={`the whole printed page ${pagePlan.page}, as scanned`}
                      note={pagePlan.note}
                      onError={() => setPageFailed(pagePlanKey)}
                    />
                  )}
                </div>
              ) : null}

              {picturePlanKey && !hasPicture && pictureUrl !== undefined && (pagePath === '' || pageUrl !== undefined) ? (
                // No crop and no page matched this question, or both failed
                // to load: show the whole paper as a page-flip, never a dead end.
                <div className="flex min-w-0 flex-col" data-tour="picture">
                  <p className="mb-1 text-[12px] text-warm-meta">{pictureHeading(null)}</p>
                  <PaperPageFlip
                    paperId={question.paper_id}
                    loadPages={api.paperPages}
                    pictureUrl={api.pictureUrl}
                    questionPage={typeof question.source?.page === 'number' ? question.source.page : null}
                  />
                </div>
              ) : null}
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
                  tourId="pass"
                  tone={blank && !lost && mode === 'check' ? 'muted' : 'mint'}
                  onClick={doPass}
                  disabled={submitting || !canPass || marksInvalid}
                >
                  {submitting
                    ? 'Saving...'
                    : mode === 'fix'
                      ? edited
                        ? 'Save, now it matches'
                        : 'Looks right'
                      : lost
                        ? LOST_TEXT_CONFIRM
                        : 'Looks right'}
                </ActionButton>
                {mode === 'check' ? (
                  <ActionButton tourId="fix" tone="dark" onClick={() => setMode('fix')} disabled={submitting}>
                    Fix it
                  </ActionButton>
                ) : (
                  <ActionButton tone="muted" onClick={cancelEdit} disabled={submitting}>
                    Cancel
                  </ActionButton>
                )}
                <ActionButton tourId="help" tone="brand" onClick={() => setHelpOpen(true)} disabled={submitting}>
                  Ask the HOD
                </ActionButton>
                <ActionButton tourId="skip" tone="muted" onClick={doSkip} disabled={submitting || lastOne}>
                  Skip this question
                </ActionButton>
                {lastOne && mode === 'check' ? (
                  <p className="basis-full text-[12px] text-warm-meta" data-testid="last-one-note">
                    This is the last question left on this paper. If you cannot judge it, ask the HOD.
                  </p>
                ) : null}
              </>
            )}
            <p className="ml-auto hidden text-[12px] text-warm-meta lg:block">
              {mode === 'check' ? shortcutHint({ canSplit: splitOffered, canPass }) : 'Esc cancels'}
            </p>
          </div>
        ) : null}

      {tourOpen && question ? (
        <CheckerWalkthrough
          onClose={closeTour}
          onPractice={() => {
            closeTour();
            navigate(CHECKER_PRACTICE_PATH);
          }}
        />
      ) : null}

      {helpOpen && question ? (
        <Modal onClose={() => setHelpOpen(false)} labelledBy="checker-help-title">
          <h2 id="checker-help-title" className="mb-2 text-[16px] font-bold text-foreground">
            What should the HOD look at?
          </h2>
          <p className="mb-3 text-[13px] text-warm-secondary">
            Your HOD will look at this question. The rest of your paper carries on, so you can go straight to the next one.
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
              {submitting ? 'Sending...' : 'Send to the HOD'}
            </ActionButton>
            <ActionButton tone="muted" onClick={() => setHelpOpen(false)} disabled={submitting}>
              Cancel
            </ActionButton>
          </div>
        </Modal>
      ) : null}

    </div>
  );
}

