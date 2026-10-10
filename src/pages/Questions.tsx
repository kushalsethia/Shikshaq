import { lazy, Suspense, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, Copy, Download, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Editor } from '@/components/game-questions/Editor';
import { Guide } from '@/components/game-questions/Guide';
import { SentBackPanel } from '@/components/game-questions/SentBackPanel';
import { ActionIcon, RowsTable } from '@/components/game-questions/shared';
import { copyText, downloadText, offerUndo, plural } from '@/components/game-questions/actions';
import { usePageMeta } from '@/hooks/usePageMeta';
import { GAME_PAGES_META } from '@/content/game-pages-meta';
import { GAME_KEYS, realGameQuestionsApi, type GameQuestionsApi, type SendResult } from '@/lib/game-questions/api';
import { checkDetail, DETAIL_KEYS, detailLine, detailsId, LABEL, readDetails, standardDetail, writeDetail, type DetailKey } from '@/lib/game-questions/details';
import { baseName, EXAMPLE, format, missing, visibleIssues } from '@/lib/game-questions/format';
import { COLUMNS, toCSV, toJSON, toTSV, type Row } from '@/lib/game-questions/rows';
import { CHIP } from '@/lib/checker-button-styles';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';
import { cn } from '@/lib/utils';

/* /questions: teachers write questions in one format (Question | Answer, under detail and Topic lines; other common
   layouts are read too, quietly), check them, and send them to their HOD or download them. Anyone can write and check;
   Send needs a sign-in. The example's questions are never sent. Questions and answers are never changed by code.

   Chatbots that fetch this address get instructions for writing questions in this format: scripts/prerender.ts writes
   src/content/game-question-instructions.html into the page's #prerender block, which src/main.tsx removes before
   React starts, so people never see it.

   In a test build with dummy mode on, the same page runs against an in-memory fake (src/dummy/QuestionsDummy.tsx). */

const DummyQuestions = PREVIEW_TOOLS ? lazy(() => import('@/dummy/QuestionsDummy')) : null;

export default function Questions() {
  if (DummyQuestions && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyQuestions />
      </Suspense>
    );
  }
  return <QuestionsPage api={realGameQuestionsApi} />;
}

const HINT: Record<DetailKey, string> = { board: 'CBSE', class: '10', subject: 'Science', chapter: '1: Chemical Reactions' };
/** The example's questions: they are only for trying the page, so they are never sent. */
const EXAMPLE_QUESTIONS = new Set(format(EXAMPLE).rows.map((r) => r.question.toLowerCase()));
const fromExample = (r: Row) => EXAMPLE_QUESTIONS.has(r.question.toLowerCase());
const motion = (): ScrollBehavior => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
/** The text survives a trip to another page (the HOD desk, the sign-in page) and back, in this tab only. */
const DRAFT_KEY = 'shikshaq:questions-draft';

function readDraft(): string {
  try {
    return sessionStorage.getItem(DRAFT_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveDraft(text: string) {
  try {
    if (text) sessionStorage.setItem(DRAFT_KEY, text);
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // storage blocked or full: the text still lives on the page
  }
}

/** Scrolls smoothly to a part of the page and moves keyboard focus there, without adding "#..." to the address. */
function scrollToEl(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ behavior: motion(), block: 'start' });
  el.focus({ preventScroll: true });
}

const H2 = 'text-balance text-[18px] font-bold text-foreground';
const LABEL_CLASS = 'mb-1 block text-[13px] font-semibold text-warm-prose';

export function QuestionsPage({
  api,
  dummy = false,
  banner,
  dummyName,
}: {
  api: GameQuestionsApi;
  dummy?: boolean;
  banner?: ReactNode;
  /** Dummy mode has no sign-in: the name the page would read. */
  dummyName?: string;
}) {
  usePageMeta(GAME_PAGES_META.questions.title, GAME_PAGES_META.questions.description);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const scope = dummy ? 'dummy' : 'live';
  const signedIn = dummy || Boolean(user);
  const teacher = dummy
    ? dummyName ?? ''
    : profile?.full_name?.trim() || String(user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? '').trim() || 'A teacher';
  const hodQ = useQuery({
    queryKey: [...GAME_KEYS.all(scope), 'is-hod', dummy ? 'dummy' : user?.id ?? null],
    queryFn: () => api.isHod(),
    enabled: signedIn,
    staleTime: 30 * 60 * 1000,
  });

  const [raw, setRaw] = useState(readDraft);
  const [done, setDone] = useState('');
  const [caret, setCaret] = useState(0);
  /** Bumped when the whole text is replaced (paste, example, clear), so the table plays its entrance again. */
  const [batch, setBatch] = useState(0);
  const [sent, setSent] = useState<SendResult | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [resultsInView, setResultsInView] = useState(true);
  const [focus, setFocus] = useState<{ ids: string[]; n: number } | null>(null);
  /** The line being typed on in the Questions box, and the detail box being typed in: problems there wait until they move on. */
  const [typingLine, setTypingLine] = useState<number | null>(null);
  const [typingBox, setTypingBox] = useState<DetailKey | null>(null);
  const boxTimer = useRef(0);
  const box = useRef<HTMLTextAreaElement>(null);
  const results = useRef<HTMLElement>(null);
  const top = useRef<HTMLDivElement>(null);

  // on a phone the results are below the box: a small pill points to them while they are out of sight
  useEffect(() => {
    const el = results.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setResultsInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const text = useDeferredValue(raw);
  useEffect(() => saveDraft(text), [text]);
  const { rows, issues: all } = useMemo(() => format(text), [text]);
  const issues = visibleIssues(all, { caret: typingLine, line: typingBox && detailLine(raw, typingBox) });
  /** Moving the cursor to another line ends "still typing" there; arriving on a line shows its problems. */
  const moveCaret = (line: number) => {
    setCaret(line);
    setTypingLine((t) => (t === line ? t : null));
  };
  const typedOn = (line: number | null) => {
    if (line !== null) setCaret(line);
    setTypingLine(line);
  };
  const details = readDetails(raw);
  const id = detailsId(details);
  const gaps = missing(rows);
  const chapters = new Set(rows.map((r) => r.chapter_id ?? [r.board, r.class, r.subject, r.chapter_no, r.chapter].join('|'))).size;
  const topics = new Set(
    rows.filter((r) => r.topic || r.topic_no !== null).map((r) => [r.chapter_id, r.board, r.class, r.subject, r.chapter_no, r.chapter, r.topic_no, r.topic].join('|')),
  ).size;
  const errors = issues.filter((x) => x.level === 'error').length;
  const name = baseName(rows);

  // one note per count, so "no board, class or subject" is one line rather than three
  const have = (n: number) => plural(n, 'question has', 'questions have');
  const byCount = new Map<number, string[]>();
  for (const [k, what] of [['board', 'board'], ['class', 'class'], ['subject', 'subject'], ['chapter', 'chapter number']] as const) {
    if (gaps[k]) byCount.set(gaps[k], [...(byCount.get(gaps[k]) ?? []), what]);
  }
  const notes = [
    ...[...byCount].map(
      ([n, what]) => `${have(n)} no ${what.length > 1 ? `${what.slice(0, -1).join(', ')} or ${what[what.length - 1]}` : what[0]}, so no chapter ID. Fill in the boxes above.`,
    ),
    gaps.topic > 0 && `${have(gaps.topic)} no topic. Add a line such as "Topic 1: Name" above them.`,
  ].filter(Boolean) as string[];

  /** Shows a check mark on a button for a moment after its action worked. */
  const flash = (what: string) => {
    setDone(what);
    setTimeout(() => setDone((c) => (c === what ? '' : c)), 1800);
  };
  const copy = async (what: string, value: string) => {
    if (await copyText(value)) flash(what);
  };
  const save = (what: 'csv' | 'json') => {
    if (what === 'csv') downloadText(`${name}.csv`, toCSV(rows), 'text/csv');
    else downloadText(`${name}.json`, toJSON(rows), 'application/json');
    flash(what);
  };

  /** Replacing all the text can always be undone for a few seconds, so there is no "are you sure?". */
  const replaceAll = (next: string, what: string) => {
    const before = raw;
    if (before.trim() && before !== next) {
      offerUndo(what, () => {
        setRaw(before);
        setBatch((b) => b + 1);
        box.current?.focus({ preventScroll: true });
      });
    }
    setRaw(next);
    setBatch((b) => b + 1);
  };

  /** Sends the questions to the HOD as one batch (not the example's). */
  const examples = rows.filter(fromExample).length;
  const ready = rows.filter((r) => r.chapter_id && !fromExample(r)).length;
  const noId = rows.filter((r) => !r.chapter_id && !fromExample(r)).length;
  const send = async () => {
    if (!signedIn) {
      // the text comes back after signing in
      saveDraft(raw);
      navigate('/auth?redirect=' + encodeURIComponent('/questions'));
      return;
    }
    setSending(true);
    setSent(null);
    setSendError('');
    try {
      const result = await api.send(rows.filter((r) => !fromExample(r)));
      setSent(result);
      if (result.sent) {
        flash('send');
        void qc.invalidateQueries({ queryKey: GAME_KEYS.all(scope) });
      }
    } catch (e) {
      setSendError((e as Error).message);
    } finally {
      setSending(false);
    }
  };
  /** Opens "Sent back to you" at these questions. */
  const seeWhy = (ids: string[]) => {
    setFocus({ ids, n: Date.now() });
    void qc.invalidateQueries({ queryKey: GAME_KEYS.sentBack(scope) });
    top.current?.scrollIntoView({ behavior: motion(), block: 'start' });
  };

  const prompt = `Open ${window.location.origin}/questions and follow the instructions on that page to turn the material below into questions and answers.\n\nMaterial (my notes, my questions, or just the board, class, subject and chapter):\n`;

  /** Selects a line of the Questions box, so a reported problem can be fixed in place. */
  const goTo = (line: number) => {
    const ta = box.current;
    if (!ta) return;
    const lines = ta.value.split('\n');
    const start = lines.slice(0, line - 1).reduce((n, l) => n + l.length + 1, 0);
    ta.scrollIntoView({ behavior: motion(), block: 'center' });
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(start, start + (lines[line - 1]?.length ?? 0));
    ta.scrollTop = Math.max(0, (line - 3) * (parseFloat(getComputedStyle(ta).lineHeight) || 24));
    moveCaret(line);
  };

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <BentoStack className="mx-auto w-full max-w-6xl">
          <BentoPanel fill="card" edge="top" ref={top} className="scroll-mt-20">
            {banner}
            <span className="text-[12px] font-bold uppercase tracking-[0.04em] text-brand-blue">For teachers</span>
            <div className="mt-1.5 flex flex-wrap items-end justify-between gap-3">
              <h1 className="text-balance font-display text-[32px] font-normal leading-[1.06] tracking-[-0.045em] text-foreground lg:text-[40px]">
                Write <span className="font-extrabold text-brand">questions</span>
              </h1>
              <button type="button" className={cn(CHIP, 'bg-muted text-warm-secondary')} onClick={() => scrollToEl(document.getElementById('guide'))}>
                How to write questions
              </button>
            </div>
            <p className="mt-3 max-w-prose text-pretty text-[15px] leading-[1.6] text-warm-prose">
              Write one question per line: the question, a bar <code className="rounded-[6px] bg-muted px-1.5 font-mono">|</code>, then the answer.
              They come out as clean rows for the question bank, each linked to its chapter by an ID. Approved questions become puzzles on{' '}
              <Link to="/revise" className="font-semibold text-brand-blue underline-offset-2 hover:underline">
                Revise
              </Link>
              .
            </p>
            {signedIn ? <SentBackPanel api={api} scope={scope} focus={focus} /> : null}
          </BentoPanel>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <BentoPanel fill="card" className="min-w-0">
              <section aria-labelledby="gq-in-h" className="space-y-4">
                <h2 id="gq-in-h" className={H2}>
                  1. Write or paste
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {DETAIL_KEYS.map((k) => {
                    const problem = typingBox === k ? undefined : checkDetail(k, details[k]);
                    return (
                      <div key={k} className="min-w-0">
                        <label htmlFor={`gq-d-${k}`} className={LABEL_CLASS}>
                          {LABEL[k]}
                        </label>
                        <Input
                          id={`gq-d-${k}`}
                          type="text"
                          value={details[k]}
                          placeholder={`e.g. ${HINT[k]}`}
                          autoComplete="off"
                          aria-invalid={problem?.level === 'error'}
                          aria-describedby={problem ? `gq-d-${k}-msg` : undefined}
                          className={cn(
                            'h-11 rounded-[12px] border-0 bg-muted text-[15px] focus-visible:ring-brand',
                            problem?.level === 'error' && 'shadow-[inset_0_0_0_2px_hsl(var(--destructive))]',
                            problem?.level === 'warn' && 'shadow-[inset_0_0_0_2px_hsl(var(--brand))]',
                          )}
                          onChange={(e) => {
                            const v = e.target.value;
                            setRaw((r) => writeDetail(r, k, v));
                            // a box's warning waits until it is left, or until typing pauses
                            setTypingBox(k);
                            clearTimeout(boxTimer.current);
                            boxTimer.current = window.setTimeout(() => setTypingBox(null), 1500);
                          }}
                          onBlur={(e) => {
                            clearTimeout(boxTimer.current);
                            setTypingBox(null);
                            const std = standardDetail(k, e.target.value);
                            if (std !== e.target.value) setRaw((r) => writeDetail(r, k, std));
                          }}
                        />
                        {problem ? (
                          <span
                            id={`gq-d-${k}-msg`}
                            key={problem.text}
                            className={cn('mt-1 block animate-in fade-in-0 text-[12px] leading-[1.4]', problem.level === 'error' ? 'text-destructive' : 'text-brand-deep')}
                          >
                            {problem.text}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[13px] text-warm-secondary">
                  {id ? (
                    <>
                      Chapter ID{' '}
                      <code key={id} className="inline-block animate-pop rounded-[6px] bg-brand-blue-subtle px-1.5 font-mono font-semibold text-brand-blue-deep">
                        {id}
                      </code>
                      .{' '}
                    </>
                  ) : (
                    'Board, class, subject and chapter number make the chapter ID. '
                  )}
                  These boxes are the lines at the top of the Questions box; editing either changes both.
                </p>

                <div>
                  <label htmlFor="gq-questions" className={LABEL_CLASS}>
                    Questions
                  </label>
                  <Editor
                    value={raw}
                    onChange={setRaw}
                    onPaste={() => setBatch((b) => b + 1)}
                    onTyping={typedOn}
                    issues={issues}
                    boxRef={box}
                    caret={caret}
                    setCaret={moveCaret}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="muted" size={44} onClick={() => replaceAll(EXAMPLE, 'Example loaded')}>
                    Try an example
                  </Button>
                  <Button type="button" variant="muted" size={44} onClick={() => replaceAll('', 'Cleared')} disabled={!raw}>
                    Clear
                  </Button>
                </div>

                <div className="rounded-[16px] bg-brand-blue-subtle p-4">
                  <p className="text-pretty text-[14px] leading-[1.6] text-foreground">
                    <b>Starting from notes?</b> Copy this prompt into ChatGPT, Gemini or Claude, add your notes (or just the class, subject and chapter), then
                    paste its reply into Questions.
                  </p>
                  <Button type="button" variant="indigo" size={44} className="mt-3" onClick={() => copy('prompt', prompt)}>
                    <ActionIcon done={done === 'prompt'}>
                      <Copy className="h-4 w-4" />
                    </ActionIcon>
                    Copy chatbot prompt
                  </Button>
                </div>
              </section>
            </BentoPanel>

            <BentoPanel fill="card" className="min-w-0">
              <section ref={results} tabIndex={-1} aria-labelledby="gq-out-h" className="space-y-4 focus:outline-none">
                <h2 id="gq-out-h" className={H2}>
                  2. Check and download
                </h2>
                <p className="text-[15px] text-warm-prose" role="status" aria-live="polite">
                  {rows.length ? (
                    <>
                      <b key={rows.length} className="inline-block animate-pop tabular-nums text-foreground">
                        {plural(rows.length, 'question')}
                      </b>{' '}
                      in {plural(chapters, 'chapter')} and {plural(topics, 'topic')}
                    </>
                  ) : (
                    'Nothing to download yet.'
                  )}
                </p>

                {issues.length > 0 ? (
                  <div className={cn('rounded-[16px] px-4 py-3', errors ? 'bg-destructive/10' : 'bg-brand-subtle')}>
                    <b className="text-[14px] text-foreground">
                      {errors ? `${plural(errors, 'line')} left out` : ''}
                      {errors && issues.length > errors ? ', ' : ''}
                      {issues.length > errors ? `${plural(issues.length - errors, 'warning')}` : ''}
                    </b>
                    <ul className="mt-1 max-h-48 space-y-0.5 overflow-y-auto text-[13px] text-warm-prose">
                      {issues.slice(0, 50).map((x) => (
                        <li key={`${x.line}\u0000${x.text}`}>
                          <button
                            type="button"
                            className={cn('font-semibold underline underline-offset-2', x.level === 'error' ? 'text-destructive' : 'text-brand-deep')}
                            onClick={() => goTo(x.line)}
                          >
                            Line {x.line}
                          </button>
                          : {x.text}
                        </li>
                      ))}
                      {issues.length > 50 ? <li>and {issues.length - 50} more</li> : null}
                    </ul>
                  </div>
                ) : null}
                {notes.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-[13px] text-warm-prose">
                    {notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                ) : null}

                {rows.length ? (
                  <div className="max-h-[560px] overflow-y-auto pr-1">
                    <RowsTable key={batch} rows={rows} />
                  </div>
                ) : (
                  <p className="rounded-[16px] bg-muted px-4 py-8 text-center text-[14px] text-warm-secondary">
                    Your questions will appear here, grouped by chapter and topic.
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="primary" size={44} disabled={!rows.length} onClick={() => save('csv')}>
                    <ActionIcon done={done === 'csv'}>
                      <Download className="h-4 w-4" />
                    </ActionIcon>
                    Download CSV
                  </Button>
                  <Button type="button" variant="muted" size={44} disabled={!rows.length} onClick={() => save('json')}>
                    <ActionIcon done={done === 'json'}>
                      <Download className="h-4 w-4" />
                    </ActionIcon>
                    Download JSON
                  </Button>
                  <Button type="button" variant="muted" size={44} disabled={!rows.length} onClick={() => copy('sheets', toTSV(rows))}>
                    <ActionIcon done={done === 'sheets'}>
                      <Copy className="h-4 w-4" />
                    </ActionIcon>
                    Copy for Sheets
                  </Button>
                </div>
                <p className="sr-only" aria-live="polite">
                  {done === 'csv' || done === 'json' ? 'Downloaded.' : done ? 'Copied.' : ''}
                </p>
                <p className="text-[12px] leading-[1.5] text-warm-secondary">
                  One row per question, with the columns <code className="break-words font-mono">{COLUMNS.join(', ')}</code>. The CSV imports straight into a
                  database table.
                </p>

                <form
                  className="space-y-3 rounded-[20px] bg-muted p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send();
                  }}
                >
                  <h3 className="text-[16px] font-bold text-foreground">3. Send for approval</h3>
                  <p className="text-[13px] text-warm-secondary">Your HOD checks the questions. Only approved ones go into the question bank and the games.</p>
                  {examples > 0 ? (
                    <p className="rounded-[12px] bg-brand-subtle px-3 py-2 text-[13px] text-foreground" role="status">
                      {examples === rows.length ? (
                        <>
                          <b>This is the example.</b> Its questions can't be sent. Write or paste your own questions in their place.
                        </>
                      ) : (
                        <>
                          <b>{plural(examples, 'question is', 'questions are')} from the example</b>, so {examples === 1 ? "it won't" : "they won't"} be sent.
                          Only your own questions are sent.
                        </>
                      )}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" variant="dark" size={46} disabled={!ready || sending}>
                      <ActionIcon done={done === 'send'}>
                        <Send className="h-4 w-4" />
                      </ActionIcon>
                      {sending ? 'Sending...' : !signedIn ? 'Sign in to send' : ready ? `Send ${plural(ready, 'question')}` : 'Send'}
                    </Button>
                    <p className="text-[13px] text-warm-secondary">
                      {signedIn ? (
                        <>
                          Sending as <b className="text-foreground">{teacher}</b>.
                        </>
                      ) : (
                        'Your questions stay here while you sign in.'
                      )}
                    </p>
                  </div>
                  {noId > 0 ? (
                    <p className="text-[13px] text-warm-secondary">
                      {plural(noId, 'question has', 'questions have')} no chapter ID and can't be sent yet. Fill in the boxes above.
                    </p>
                  ) : null}
                  {sent ? (
                    <p
                      key={JSON.stringify(sent)}
                      className={cn('animate-in fade-in-0 rounded-[12px] px-3 py-2 text-[14px] text-foreground', sent.sent ? 'bg-mint' : 'bg-brand-subtle')}
                    >
                      {sent.sent ? (
                        <>
                          Sent {plural(sent.sent, 'question')} to the HOD as batch <b className="font-mono">{sent.batchId}</b>.{' '}
                        </>
                      ) : (
                        'Nothing new to send. '
                      )}
                      {sent.already > 0 ? (
                        <>
                          {plural(sent.already, 'question was', 'questions were')} already sent, so {sent.already === 1 ? 'it was' : 'they were'} skipped.{' '}
                        </>
                      ) : null}
                      {sent.sentBack > 0 ? (
                        <>
                          {plural(sent.sentBack, 'question was', 'questions were')} sent back to you before and {sent.sentBack === 1 ? "hasn't" : "haven't"}{' '}
                          changed, so {sent.sentBack === 1 ? "it wasn't" : "they weren't"} sent again.{' '}
                          <button type="button" className="font-semibold text-brand-blue underline underline-offset-2" onClick={() => seeWhy(sent.sentBackIds)}>
                            See why
                          </button>{' '}
                        </>
                      ) : null}
                      {hodQ.data && sent.sent > 0 ? (
                        <Link to="/hod?tab=questions" className="font-semibold text-brand-blue underline underline-offset-2">
                          Open the HOD desk
                        </Link>
                      ) : null}
                    </p>
                  ) : null}
                  {sendError ? (
                    <p className="rounded-[12px] bg-destructive/10 px-3 py-2 text-[14px] text-foreground" role="alert">
                      Couldn't send: {sendError}
                    </p>
                  ) : null}
                </form>
              </section>
            </BentoPanel>
          </div>

          <BentoPanel fill="muted">
            <Guide />
          </BentoPanel>
        </BentoStack>

        {rows.length > 0 && !resultsInView ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 lg:hidden">
            <button
              type="button"
              onClick={() => scrollToEl(results.current)}
              className={cn(
                'pointer-events-auto inline-flex min-h-11 animate-in fade-in-0 slide-in-from-bottom-2 items-center gap-2 rounded-full px-4 text-[14px] font-bold shadow-lg transition-transform duration-150 active:scale-[0.96]',
                errors ? 'bg-destructive text-destructive-foreground' : 'bg-panel text-background',
              )}
            >
              {errors ? `${plural(errors, 'line')} left out · ` : ''}
              {plural(rows.length, 'question')}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
