import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { MathText } from '@/components/papers/math-text';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import {
  isPaperChecker,
  checkerNextQuestion,
  checkerPassQuestion,
  checkerFixQuestion,
  checkerSplitQuestion,
  checkerAskForHelp,
  checkerSkipQuestion,
  checkerCheckedTodayCount,
  checkerSnippetUrl,
  checkerMyStats,
  checkerLeaderboard,
  checkerGetPreferences,
  checkerSetPreferences,
} from '@/lib/checker-api';
import { kidSentence, needsSplit } from '@/lib/checker-kid-reasons';
import { matchCheckerKeyboardEvent } from '@/lib/checker-shortcuts';
import { SUBJECTS, CLASSES } from '@/utils/searchFacets';

/* The paper checker (Kid Mode) -- D8/D9/D11/D15/D16/D21: built INTO the
   Shikshaq site, in Shikshaq's own bento design language, reachable only by
   an account an admin has granted the "Paper checker" permission. One
   question at a time, across every live paper waiting to be cleared, next to
   a snippet of the printed page. Ported from the standalone auditor's
   KidCheck.tsx (UnlimitedOCR/auditor/web/src/pages/kid/KidCheck.tsx) --
   reusing its flow and shortcut logic, not its visual design (D11: "not a
   separate designed thing").

   D16/D21: the fourth button is "Ask for help", not "Can't fix" -- nothing
   here can turn a paper red. Escalating just hands the question to Sonnet
   first, then an admin, while the checker moves on to the next question. */

type Mode = 'check' | 'fix' | 'split';

export default function Checker() {
  usePageMeta('Paper checker | Shikshaq', 'Check one question at a time against the printed paper.');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent('/checker'));
      return;
    }
    let cancelled = false;
    isPaperChecker().then((ok) => {
      if (!cancelled) setAllowed(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate]);

  // D41: first-use subject/class picker. `undefined` = not checked yet,
  // `null` = checked and the checker has never chosen (show the prompt),
  // an object = already chosen (skip the prompt).
  const [prefs, setPrefs] = useState<{ subjects: string[] | null; classes: string[] | null } | null | undefined>(undefined);
  const [prefsPromptOpen, setPrefsPromptOpen] = useState(false);
  const [prefsDraftSubjects, setPrefsDraftSubjects] = useState<string[]>([]);
  const [prefsDraftClasses, setPrefsDraftClasses] = useState<string[]>([]);
  useEffect(() => {
    if (allowed !== true) return;
    let cancelled = false;
    checkerGetPreferences()
      .then((p) => {
        if (cancelled) return;
        setPrefs(p);
        if ((p.subjects === null || p.subjects.length === 0) && (p.classes === null || p.classes.length === 0)) {
          setPrefsPromptOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) setPrefs(null);
      });
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  async function savePrefs() {
    await checkerSetPreferences(prefsDraftSubjects, prefsDraftClasses);
    setPrefs({ subjects: prefsDraftSubjects, classes: prefsDraftClasses });
    setPrefsPromptOpen(false);
    refresh();
  }

  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const questionQuery = useQuery({
    queryKey: ['checker-next-question'],
    queryFn: checkerNextQuestion,
    enabled: allowed === true,
    retry: 1,
  });
  const question = questionQuery.data ?? null;

  const countQuery = useQuery({
    queryKey: ['checker-checked-today'],
    queryFn: checkerCheckedTodayCount,
    enabled: allowed === true,
  });

  const statsQuery = useQuery({
    queryKey: ['checker-my-stats'],
    queryFn: checkerMyStats,
    enabled: allowed === true,
  });

  const leaderboardQuery = useQuery({
    queryKey: ['checker-leaderboard'],
    queryFn: checkerLeaderboard,
    enabled: allowed === true && leaderboardOpen,
  });

  const [snippetUrl, setSnippetUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!question) {
      setSnippetUrl(null);
      return;
    }
    let cancelled = false;
    checkerSnippetUrl(question.paper_id, question.id).then((url) => {
      if (!cancelled) setSnippetUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [question?.id]);

  const [mode, setMode] = useState<Mode>('check');
  const [bodyDraft, setBodyDraft] = useState('');
  const [numberDraft, setNumberDraft] = useState('');
  const [marksDraft, setMarksDraft] = useState('');
  const [splitAt, setSplitAt] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpReason, setHelpReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [question?.id]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['checker-next-question'] });
    qc.invalidateQueries({ queryKey: ['checker-checked-today'] });
    qc.invalidateQueries({ queryKey: ['checker-my-stats'] });
  };

  async function doPass() {
    if (!question || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const edited = bodyDraft !== question.body || numberDraft !== (question.display_number ?? '') || marksDraft !== String(question.marks ?? '');
      if (mode === 'fix' || edited) {
        await checkerFixQuestion(question.id, {
          body: bodyDraft,
          display_number: numberDraft || null,
          marks: marksDraft === '' ? null : Number(marksDraft),
        });
      } else {
        await checkerPassQuestion(question.id);
      }
      refresh();
    } catch {
      setError("Could not save that. Check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function doSplit() {
    if (!question || splitAt === null || splitAt <= 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await checkerSplitQuestion(question.id, bodyDraft, splitAt);
      refresh();
    } catch {
      setError("Could not save that. Check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function doAskForHelp(reason: string) {
    if (!question || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await checkerAskForHelp(question.id, reason || 'Not sure how to fix this');
      setHelpOpen(false);
      refresh();
    } catch {
      setError("Could not save that. Check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function doSkip() {
    if (!question || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await checkerSkipQuestion(question.id);
      refresh();
    } catch {
      setError("Could not save that. Check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const splitTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (helpOpen || submitting || prefsPromptOpen) return;
      const action = matchCheckerKeyboardEvent(e);
      if (!action) return;
      if (action === 'pass' && mode === 'check') {
        e.preventDefault();
        void doPass();
      } else if (action === 'fix' && mode === 'check') {
        e.preventDefault();
        setMode('fix');
      } else if (action === 'split' && mode === 'check' && question && needsSplit(question.flag_reasons)) {
        e.preventDefault();
        setMode('split');
      } else if (action === 'help' && mode === 'check') {
        e.preventDefault();
        setHelpOpen(true);
      } else if (action === 'skip' && mode === 'check') {
        e.preventDefault();
        void doSkip();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, helpOpen, submitting, prefsPromptOpen, question?.id]);

  if (authLoading || allowed === null) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto flex max-w-lg items-center justify-center py-24">
          <p className="text-[15px] text-warm-secondary">Loading...</p>
        </BentoPanel>
      </BentoStack>
    );
  }

  if (allowed === false) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <BentoPanel fill="card" edge="top" className="mx-auto max-w-lg py-24 text-center">
          <h1 className="text-xl font-bold text-foreground">You are not a paper checker yet</h1>
          <p className="mt-2 text-[14px] text-warm-secondary">
            Ask an admin to turn on the paper checker permission for your account.
          </p>
        </BentoPanel>
      </BentoStack>
    );
  }

  return (
    <BentoStack className="min-h-screen bg-muted">
      <BentoPanel fill="card" edge="top" className="mx-auto w-full max-w-4xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-foreground">Paper checker</h1>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-[13px] font-semibold text-warm-secondary">
              Today: {statsQuery.data?.today_count ?? countQuery.data ?? 0} - Total: {statsQuery.data?.total_count ?? 0}
            </span>
            <button
              type="button"
              onClick={() => setLeaderboardOpen((v) => !v)}
              className="rounded-full bg-brand-subtle px-3 py-1 text-[13px] font-semibold text-foreground"
            >
              Leaderboard
            </button>
            <button
              type="button"
              onClick={() => {
                setPrefsDraftSubjects(prefs?.subjects ?? []);
                setPrefsDraftClasses(prefs?.classes ?? []);
                setPrefsPromptOpen(true);
              }}
              className="rounded-full bg-muted px-3 py-1 text-[13px] font-semibold text-warm-secondary"
            >
              My subjects
            </button>
          </div>
        </div>

        {leaderboardOpen && (
          <div className="mb-3 rounded-2xl bg-muted p-3">
            <p className="mb-2 text-[13px] font-semibold text-foreground">This week's top checkers</p>
            {leaderboardQuery.isLoading ? (
              <p className="text-[13px] text-warm-secondary">Loading...</p>
            ) : !leaderboardQuery.data || leaderboardQuery.data.length === 0 ? (
              <p className="text-[13px] text-warm-secondary">No one has checked a question this week yet.</p>
            ) : (
              <ol className="space-y-1 text-[13px] text-warm-secondary">
                {leaderboardQuery.data.map((row) => (
                  <li key={row.rank} className="flex justify-between">
                    <span>{row.rank}. {row.first_name}</span>
                    <span className="font-semibold text-foreground">{row.weekly_count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {error ? (
          <div className="mb-3 rounded-2xl bg-destructive/10 px-4 py-3 text-[14px] text-destructive">{error}</div>
        ) : null}

        {questionQuery.isLoading ? (
          <p className="py-16 text-center text-[15px] text-warm-secondary">Loading the next question...</p>
        ) : !question ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="text-4xl" aria-hidden>
              🎉
            </span>
            <p className="text-lg font-semibold text-foreground">All done for now</p>
            <p className="text-[14px] text-warm-secondary">No questions are waiting to be checked right now.</p>
          </div>
        ) : (
          <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: the printed page snippet */}
            <div className="flex flex-col">
              <p className="mb-1 text-[12px] text-warm-meta">The printed paper</p>
              <div className="flex max-h-[42vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-muted lg:max-h-[60vh]">
                {snippetUrl ? (
                  <img src={snippetUrl} alt="the printed question" className="h-full w-full object-contain" />
                ) : (
                  // D65: this paper has no PDF anywhere, or the sense-check pack
                  // ran instead of the picture-matching one -- the question is
                  // still served and checkable, just without a photo to compare
                  // against. The label is deliberately plain, not an error state.
                  <div className="p-6 text-center">
                    <p className="text-[14px] font-semibold text-foreground">No picture</p>
                    <p className="mt-1 text-[13px] text-warm-meta">check that it makes sense</p>
                  </div>
                )}
              </div>
              {(question.school || question.subject) && (
                <p className="mt-1 text-[11px] text-warm-meta">
                  {question.school ?? 'School not known'} - {question.subject} - Class {question.cls}
                </p>
              )}
            </div>

            {/* Right: the question + actions */}
            <div className="flex flex-col">
              {question.flag_reasons.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {question.flag_reasons.map((r) => (
                    <span key={r} className="rounded-full bg-brand-subtle px-2.5 py-1 text-[12px] font-medium text-foreground">
                      {kidSentence(r)}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[13px] font-medium text-warm-secondary">
                  Question number:
                  <input
                    value={numberDraft}
                    onChange={(e) => setNumberDraft(e.target.value)}
                    disabled={mode !== 'fix'}
                    placeholder="e.g. 5"
                    className="min-h-[40px] w-20 rounded-xl bg-muted px-3 py-1 text-center text-[14px] font-semibold text-foreground outline-none disabled:opacity-70"
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[13px] text-warm-secondary">
                  Marks:
                  <input
                    type="number"
                    value={marksDraft}
                    onChange={(e) => setMarksDraft(e.target.value)}
                    disabled={mode !== 'fix'}
                    className="min-h-[40px] w-16 rounded-xl bg-muted px-2 py-1 text-[14px] text-foreground outline-none disabled:opacity-70"
                  />
                </label>
              </div>

              {mode === 'fix' ? (
                <textarea
                  value={bodyDraft}
                  onChange={(e) => setBodyDraft(e.target.value)}
                  rows={8}
                  className="w-full rounded-2xl bg-muted p-3 text-[15px] leading-relaxed text-foreground outline-none"
                />
              ) : mode === 'split' ? (
                <div>
                  <p className="mb-2 text-[13px] text-warm-secondary">
                    Tap right before where the second question starts, then press Split here.
                  </p>
                  <textarea
                    ref={splitTextareaRef}
                    readOnly
                    value={bodyDraft}
                    onClick={(e) => setSplitAt((e.target as HTMLTextAreaElement).selectionStart)}
                    onKeyUp={(e) => setSplitAt((e.target as HTMLTextAreaElement).selectionStart)}
                    rows={8}
                    className="w-full rounded-2xl bg-muted p-3 text-[15px] leading-relaxed text-foreground outline-none"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-muted p-4">
                  <MathText text={bodyDraft} className="text-[16px] leading-relaxed text-foreground" />
                </div>
              )}

              {mode === 'check' && needsSplit(question.flag_reasons) && (
                <button
                  onClick={() => setMode('split')}
                  className="mt-2 self-start rounded-full bg-brand-subtle px-4 py-2 text-[13px] font-semibold text-foreground"
                >
                  Split here, these look like two questions
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action footer */}
        {question ? (
          <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-warm-hairline pt-4">
            {mode === 'split' ? (
              <>
                <ActionButton tone="mint" onClick={doSplit} disabled={splitAt === null || splitAt <= 0 || submitting}>
                  Split here
                </ActionButton>
                <ActionButton tone="muted" onClick={() => setMode('check')} disabled={submitting}>
                  Cancel
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton tone="mint" onClick={doPass} disabled={submitting}>
                  {submitting ? 'Saving...' : mode === 'fix' ? 'Save and looks right' : 'Looks right'}
                </ActionButton>
                {mode === 'check' ? (
                  <ActionButton tone="dark" onClick={() => setMode('fix')} disabled={submitting}>
                    Fix it
                  </ActionButton>
                ) : (
                  <ActionButton tone="muted" onClick={() => setMode('check')} disabled={submitting}>
                    Cancel
                  </ActionButton>
                )}
                <ActionButton tone="brand" onClick={() => setHelpOpen(true)} disabled={submitting}>
                  Ask for help
                </ActionButton>
                <ActionButton tone="muted" onClick={doSkip} disabled={submitting}>
                  Skip
                </ActionButton>
              </>
            )}
            <p className="ml-auto hidden text-[12px] text-warm-meta lg:block">
              Enter / P looks right - F fix it - S split - H ask for help - K skip
            </p>
          </div>
        ) : null}
      </BentoPanel>

      {prefsPromptOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-5">
            <h3 className="mb-2 text-[16px] font-bold text-foreground">Which papers do you want to check?</h3>
            <p className="mb-3 text-[13px] text-warm-secondary">
              Pick as many subjects and classes as you like, or All to see every paper. You can change this any
              time from "My subjects".
            </p>
            <p className="mb-1 text-[13px] font-semibold text-foreground">Subjects</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <AllChip active={prefsDraftSubjects.length === 0} onClick={() => setPrefsDraftSubjects([])} />
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setPrefsDraftSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
                  }
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[13px] font-semibold',
                    prefsDraftSubjects.includes(s) ? 'bg-brand text-foreground' : 'bg-muted text-warm-secondary',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mb-1 text-[13px] font-semibold text-foreground">Classes</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              <AllChip active={prefsDraftClasses.length === 0} onClick={() => setPrefsDraftClasses([])} />
              {CLASSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setPrefsDraftClasses((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
                  }
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[13px] font-semibold',
                    prefsDraftClasses.includes(c) ? 'bg-brand text-foreground' : 'bg-muted text-warm-secondary',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <ActionButton tone="mint" onClick={savePrefs}>
                Save
              </ActionButton>
              <ActionButton tone="muted" onClick={() => setPrefsPromptOpen(false)}>
                Not now
              </ActionButton>
            </div>
          </div>
        </div>
      ) : null}

      {helpOpen && question ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={() => setHelpOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-[16px] font-bold text-foreground">What is stopping you?</h3>
            <p className="mb-3 text-[13px] text-warm-secondary">
              Someone who knows more will take a look. This does not hold up the rest of the paper.
            </p>
            <textarea
              value={helpReason}
              onChange={(e) => setHelpReason(e.target.value)}
              placeholder="e.g. I cannot tell what this word says"
              rows={3}
              className="w-full rounded-xl bg-muted p-3 text-[14px] outline-none"
            />
            <div className="mt-3 flex gap-2">
              <ActionButton tone="brand" onClick={() => doAskForHelp(helpReason)} disabled={submitting}>
                Send
              </ActionButton>
              <ActionButton tone="muted" onClick={() => setHelpOpen(false)}>
                Cancel
              </ActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </BentoStack>
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
      className={cn(
        'rounded-full px-3 py-1.5 text-[13px] font-semibold',
        active ? 'bg-brand text-foreground' : 'bg-muted text-warm-secondary',
      )}
    >
      All
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
      className={cn('tap-44 rounded-full px-5 py-3 text-[15px] font-bold disabled:opacity-50', toneClass)}
    >
      {children}
    </button>
  );
}
