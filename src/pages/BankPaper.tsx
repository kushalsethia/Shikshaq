import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Flag, Search } from 'lucide-react';

import { Footer } from '@/components/Footer';
import { DisclaimerStrip } from '@/components/papers/disclaimer-strip';
import { PaperDisclaimerDialog } from '@/components/papers/paper-disclaimer-dialog';
import { PaperShareLock, paperLockClass } from '@/components/papers/paper-share-lock';
import { MathText } from '@/components/papers/math-text';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAuth } from '@/lib/auth-context';
import { GateSheet } from '@/components/auth/gate-sheet';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

/* The bank and the site name the same subject differently: bank_papers
   says "Mathematics", every facet, route and filter on the site says
   "Maths". Without this alias the maths papers — the entire original bank —
   would link to ?filter_subjects=Mathematics, a filter no teacher matches. */
const BANK_SUBJECT_ALIASES: Record<string, string> = {
  mathematics: 'Maths',
};

/** The teachers route for a bank paper's subject, or the filtered browse
 *  when that subject has no page of its own. Never an invented slug. */
function subjectTeacherPath(subject: string): string {
  const key = subject.trim().toLowerCase();
  const siteName = BANK_SUBJECT_ALIASES[key] ?? subject.trim();
  const hit = Object.entries(SUBJECT_PATH_TO_FILTER).find(
    ([, name]) => name.toLowerCase() === siteName.toLowerCase(),
  );
  return hit
    ? hit[0]
    : `/all-tuition-teachers-in-kolkata?filter_subjects=${encodeURIComponent(siteName)}`;
}
import {
  loadPaper, loadPaperQuestions, hasYear, paperTitle,
  type BankPaper as BankPaperMeta, type BankQuestion,
} from '@/lib/question-bank';

const CONTAINER = 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8';

/* One paper from the question bank, at its own /past-papers/:id.

   Same address space and the same dark chrome as the PDF reader (S5/RD-002):
   App's paper route dispatches here on the bank's 6-hex ids and there on the
   database's UUIDs. What differs is the sheet: this paper has structured
   questions, so it renders them with their marks, chapters and figures.

   Reading a 40-question paper is a long scroll, so the things you steer with
   stay put: the back bar, the paper's identity, the search and the chapter
   chips are one sticky block at the top, and only the questions move.

   Question text is rendered verbatim, byte-exact from the source, never
   cleaned or retyped. */

/**
 * The inline report form, opened from a question's own Flag chip.
 *
 * Submitting writes a row to `question_reports` rather than opening a
 * WhatsApp draft: the report stays in the product, where it can be queued
 * and moderated, and a reader without WhatsApp can still file one. Works
 * signed out — reporter_id is recorded only when there is a session, which
 * is exactly what the table's insert policy permits.
 */
function QuestionReport({
  questionId,
  paperId,
  onDone,
}: {
  questionId: string;
  paperId: string;
  onDone: () => void;
}) {
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit() {
    if (state === 'sending') return;
    setState('sending');
    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase.from('question_reports').insert({
      question_id: questionId,
      paper_id: paperId,
      note: note.trim() ? note.trim().slice(0, 1000) : null,
      reporter_id: sessionData.session?.user.id ?? null,
    });
    if (error) {
      logger.error('question report failed', error);
      setState('error');
      return;
    }
    setState('sent');
    // Left on screen briefly so the confirmation is actually read.
    setTimeout(onDone, 1400);
  }

  if (state === 'sent') {
    return (
      /* role="status" — the form this replaces is gone from the page, so
         without a live region a screen-reader user gets silence and no way to
         know the report was filed. */
      <p
        role="status"
        className="mt-2 rounded-[12px] bg-mint px-3 py-2 text-[12.5px] font-semibold text-foreground"
      >
        Thanks. We will take a look at this one.
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-[12px] bg-card p-2.5 shadow-border">
      <label htmlFor={`report-note-${questionId}`} className="sr-only">
        What is wrong with this question?
      </label>
      <textarea
        id={`report-note-${questionId}`}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="What is wrong? (optional)"
        className="w-full resize-none rounded-[8px] bg-muted px-2.5 py-2 text-base text-foreground placeholder:text-warm-prose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={state === 'sending'}
          className="inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-[12.5px] font-bold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {state === 'sending' ? 'Sending…' : 'Send report'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex min-h-11 items-center px-2 text-[12.5px] font-semibold text-warm-secondary transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cancel
        </button>
        {state === 'error' && (
          /* role="alert" — a failure that only appears visually leaves a
             screen-reader user believing the report was sent. */
          <span role="alert" className="text-[12px] font-semibold text-destructive">
            That did not send. Try again?
          </span>
        )}
      </div>
    </div>
  );
}

export default function BankPaper() {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<BankPaperMeta | null>(null);
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState('');
  const [q, setQ] = useState('');
  const [reportFor, setReportFor] = useState('');
  const [gateOpen, setGateOpen] = useState(false);
  const { user } = useAuth();

  /* This paper's own row and this paper's own questions, and nothing else.
     It used to fetch the entire bank — 6,912 questions — to read one of them. */
  useEffect(() => {
    let cancelled = false;
    setPaper(null);
    setQuestions([]);
    setFailed(false);
    setLoading(true);
    if (!id) { setLoading(false); return; }
    /* Re-runs when the user signs in, which is the whole point: the gate now
       withholds the rows themselves, so unlocking is a re-fetch, not a CSS
       change. `user?.id` rather than `user` so a new object identity for the
       same person does not re-request the paper. */
    Promise.all([loadPaper(id), loadPaperQuestions(id, Boolean(user))])
      .then(([meta, rows]) => {
        if (cancelled) return;
        setPaper(meta);
        setQuestions(rows);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [id, user?.id]);

  useEffect(() => { setChapter(''); setQ(''); setReportFor(''); }, [id]);

  const chapters = useMemo(() => {
    const seen: string[] = [];
    questions.forEach((row) => { if (row.c && !seen.includes(row.c)) seen.push(row.c); });
    return seen;
  }, [questions]);

  const needle = q.trim().toLowerCase();
  const visible = useMemo(
    () => questions.filter((row) =>
      (!chapter || row.c === chapter) && (!needle || row.t.toLowerCase().includes(needle))),
    [questions, chapter, needle],
  );

  /* The source splits a multi-part printed question ("1. a) ... b) ... c) ...")
     into one row per part, but every part carries the SAME printed number —
     the badge showed "1","1","1","2","2","2"... which reads as duplicated/
     wrong numbering, not as three parts of one question. This derives a
     display-only a/b/c suffix for runs that share a number; it never touches
     `row.n` itself or the question text, both of which stay exactly as
     stored. Built from the full, unfiltered `questions` (paper order), not
     `visible`, so the lettering stays stable regardless of chapter/search
     filtering. */
  const displayNumbers = useMemo(() => {
    const map = new Map<string, string>();
    let runNumber: string | null = null;
    let runIds: string[] = [];
    const flushRun = () => {
      if (runIds.length === 0) return;
      /* A run of rows that all carry NO printed number is not a multi-part
         question, it is a paper that never numbered its questions — every
         History and Economics paper in the bank is like this. Suffixing it
         produced "nulla", "nullb", "nullc" from the template literal below.
         The badge never showed it (it is gated on row.n), so this surfaced
         only once the report chip started naming the question. */
      if (runNumber === null || runNumber === '') return;
      if (runIds.length === 1) {
        map.set(runIds[0], runNumber);
      } else {
        runIds.forEach((id, idx) => map.set(id, `${runNumber}${String.fromCharCode(97 + idx)}`));
      }
    };
    for (const row of questions) {
      if (row.n !== runNumber) {
        flushRun();
        runNumber = row.n;
        runIds = [];
      }
      runIds.push(row.i);
    }
    flushRun();
    return map;
  }, [questions]);

  /* How a question is NAMED to assistive tech, which is a different job from
     the badge. The badge may legitimately show nothing when the paper printed
     no number; a control that acts on one question still has to say which one,
     or a 186-question paper puts 186 identically-named buttons in the
     accessibility tree. Falls back to paper position, counted over the full
     ordered list so it does not shift when a chapter filter is applied. */
  const questionNames = useMemo(() => {
    const map = new Map<string, string>();
    questions.forEach((row, i) => {
      map.set(row.i, displayNumbers.get(row.i) ?? `${i + 1}`);
    });
    return map;
  }, [questions, displayNumbers]);

  /* The sign-in gate — now a real one.

     It used to be a soft gate: every question was rendered and the tail merely
     blurred, so the rows were sitting in the DOM and in any unauthenticated API
     response. This now reads through the bank_paper_questions RPC with anon
     SELECT revoked, so a signed-out reader is SENT five questions and the rest
     do not exist on the client. There is no blur to defeat and nothing to
     un-hide with devtools.

     `withheld` is therefore a difference between what the paper says it has and
     what the server was willing to send, not a slice index into rows we hold.
     It is only ever non-zero while signed out.

     The old "not applied while filtering" exemption is gone with the rows it
     protected: filtering cannot reveal a question the client never received. */
  const withheld =
    paper && !user ? Math.max(0, paper.questionCount - questions.length) : 0;
  const filtering = Boolean(chapter || needle);

  usePageMeta(
    paper
      ? `${paper.school} Class ${paper.cls} ${paper.subject} ${hasYear(paper.year) ? paper.year : ''} Question Paper | Shikshaq`
      : 'Past paper | Shikshaq',
    paper
      ? `${paper.questionCount} questions from the ${paper.school} Class ${paper.cls} ${paper.subject} ${paper.exam}, with marks, chapters and figures. First five free, the rest with a free account.`
      : 'Read a free past year question paper on Shikshaq.',
  );

  /* The description no longer claims "All N questions ... Free to read". Under
     the real gate that sentence was false twice over: a signed-out reader is
     sent five, and this description's own audience is a crawler, which is
     signed out. It still says free, because that remains true -- an account is
     the only cost -- but it now says what you get before you have one. */

  /* Many papers print their own marks inline, "Find: [3]". Our pill would then
     say the same number twice on one card, so ours stands down; the paper's
     own marker is the source and is never touched. */
  const marksShownInText = (row: BankQuestion): boolean => {
    if (row.m === null) return false;
    // Escaped brackets: an unescaped [...] here is a character class, which
    // matches the whitespace in every question and would hide every pill.
    return new RegExp(`\\[\\s*${row.m}\\s*\\]`).test(row.t);
  };

  /* One dot-separated line, not a wall of pills. As chips these five facts ran
     to two rows on a phone and pushed the first question below the fold. */
  const facts = paper
    ? [
        `${paper.questionCount} questions`,
        paper.marks > 0 ? `${paper.marks} marks` : null,
        chapters.length > 0 ? `${chapters.length} chapters` : null,
        paper.exam,
        hasYear(paper.year) ? paper.year : null,
      ].filter(Boolean) as string[]
    : [];


  /* One question card.
     The `blurPx` parameter is gone with the soft gate that needed it. It
     ramped a CSS blur across the gated tail; under the real gate those rows
     are never sent, so every card this renders is one the reader is entitled
     to and there is nothing left to soften. */
  const questionCard = (row: BankQuestion) => (
    <li
      key={row.i}
      id={`q-${row.i}`}
      className="min-w-0 rounded-[18px] bg-muted p-[16px]"
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {row.n && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-blue px-1.5 text-[12px] font-extrabold tabular-nums text-white">
            {displayNumbers.get(row.i) ?? row.n}
          </span>
        )}
        {row.m !== null && !marksShownInText(row) && (
          <span className="rounded-full bg-card px-2 py-0.5 text-[11.5px] font-bold tabular-nums text-foreground shadow-border">
            {row.m} {row.m === 1 ? 'mark' : 'marks'}
          </span>
        )}
        {row.ty && (
          <span className="rounded-full bg-card px-2 py-0.5 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-warm-secondary shadow-border">
            {row.ty}
          </span>
        )}
        {row.c && (
          <span className="rounded-full bg-brand-blue-subtle px-2 py-0.5 text-[11.5px] font-semibold text-brand-blue-deep">
            {row.c}
          </span>
        )}

        {/* Report, as one more chip on this line rather than a full-width
            "Something wrong here?" button under every question. Icon only
            until it is needed; the label and the field appear on tap.

            The name carries the question's own number. A 186-question paper
            put 186 buttons in the accessibility tree reading the identical
            string, so a screen reader's element list was 186 indistinguishable
            rows and there was no way to tell which one you were on. `title`
            tracks aria-label rather than staying fixed, which had given the
            expanded chip two different names at once. */}
        {(() => {
          const qLabel = questionNames.get(row.i) ?? '';
          const name = reportFor === row.i
            ? `Close report for question ${qLabel}`.trim()
            : `Report a problem with question ${qLabel}`.trim();
          return (
          <button
            type="button"
            id={`report-chip-${row.i}`}
            onClick={() => setReportFor((cur) => (cur === row.i ? '' : row.i))}
            aria-expanded={reportFor === row.i}
            aria-label={name}
            title={name}
            /* min-h-11/min-w-11 keeps the real tap target at the 44px
               floor while the painted chip stays chip-sized, the same
               trick ui/chip.tsx uses. */
            className={`relative ml-auto inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-2 text-[11.5px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              reportFor === row.i
                ? 'bg-brand-subtle text-brand-deep'
                : 'text-warm-label hover:bg-card hover:text-foreground'
            }`}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            {reportFor === row.i && <span>Report</span>}
          </button>
          );
        })()}
      </div>

      <MathText text={row.t} className="text-[15px] leading-[1.6] text-foreground" />

      {/* An MCQ without its choices is unanswerable, and 4,176 of them
          arrived with the History & Civics and Economics banks. The column
          has always been read into BankQuestion.o — nothing ever rendered
          it, which went unnoticed while the bank was maths-only.

          Deliberately NOT re-lettered. 81% of these options already carry
          their own label from the paper ("a. Dominion status", "(c) 1947"),
          so adding a/b/c/d here would print "a. a. Dominion status"; the
          remaining 19% have no label in the source, and inventing one would
          be writing paper data the paper does not have. The marker below is
          a dot — presentation, not a claim about how the paper numbered
          its choices. Text renders verbatim through MathText, same as the
          question stem. */}
      {row.o && row.o.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {row.o.map((opt, i) => (
            <li key={`${row.i}-opt-${i}`} className="flex gap-2">
              <span aria-hidden="true" className="mt-[9px] h-1 w-1 flex-none rounded-full bg-warm-label" />
              <MathText text={opt} className="text-[14px] leading-[1.55] text-warm-prose" />
            </li>
          ))}
        </ul>
      )}

      {/* After the stem and its options, not before them. It used to render
          directly under the meta line, so the DOM order was: chips, report
          form, "Send report", then the question you were being asked to
          describe a problem with. */}
      {reportFor === row.i && (
        <QuestionReport
          questionId={row.i}
          paperId={paper?.id ?? ''}
          onDone={() => {
            setReportFor('');
            /* Focus goes back to the chip that opened this. Without it the
               whole form unmounts under the focused button and focus falls to
               <body>, dropping a keyboard reader at the top of a 186-question
               document. */
            window.requestAnimationFrame(() => {
              document.getElementById(`report-chip-${row.i}`)?.focus();
            });
          }}
        />
      )}

      {row.f && (
        <figure className="mt-2.5">
          <img
            src={`/paper-figures/${row.f}`}
            alt={`Figure for question ${displayNumbers.get(row.i) ?? row.n ?? ''}`}
            loading="lazy"
            decoding="async"
            className="max-h-[300px] w-auto max-w-full rounded-[12px] bg-card p-2 shadow-border"
          />
        </figure>
      )}

    </li>
  );

  if (failed) {
    return (
      <div className="flex min-h-screen flex-col bg-panel">
        <main id="main-content" className={`flex-1 ${CONTAINER} py-10`}>
          <p className="text-[15px] text-white/80">This paper did not load. Refresh to try again.</p>
          <Link to="/past-papers" className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-blue">
            Back to past papers
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-panel">
      {/* ONLY the title bar is sticky.
          All three controls used to be stuck together, which measured 166px at
          every width tested — 20% of a phone viewport, and 37% at 200% zoom,
          leaving 284px for the paper. DESIGN_SYSTEM.md §11: "Sticky headers
          must be short. Max h-14 on mobile; the content is the point."
          Identity and the way back stay put at ~68px; the search field and the
          chapter rail scroll away, which is fine because both are things you
          reach for deliberately rather than mid-read. */}
      <div className="sticky top-0 z-40 bg-panel shadow-[inset_0_-1px_0_rgba(255,255,255,.10)]">
        <div className={`${CONTAINER} flex items-center gap-3 py-[12px]`}>
          <Link
            to="/past-papers"
            aria-label="Back to papers"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-white transition-colors duration-tap hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <ArrowLeft size={17} strokeWidth={2.4} aria-hidden="true" />
            </span>
          </Link>

          {/* Both lines truncate, and at 320px the facts line loses most of
              itself ("17 chapters · Board Examination · 2018" cut to about a
              third). `title` gives the full value a way back. Most of it also
              reappears in the exam-header block below, which is why this is a
              tooltip rather than a layout change. */}
          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-[14px] font-bold text-white"
              title={paper ? `${paper.school} · Class ${paper.cls} ${paper.subject}` : undefined}
            >
              {paper ? `${paper.school} · Class ${paper.cls} ${paper.subject}` : 'Past paper'}
            </h1>
            {facts.length > 0 && (
              <p className="truncate text-[11.5px] tabular-nums text-white/60" title={facts.join(' · ')}>
                {facts.join(' · ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Outside the sticky block, so these scroll away with the page. */}
      {(chapters.length > 1 || questions.length > 0) && (
        <div className="bg-panel">
          <div className={`${CONTAINER} pb-3`}>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search in this paper"
                aria-label="Search in this paper"
                className="h-10 w-full rounded-full bg-white/10 pl-10 pr-4 text-base text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
              />
            </div>
            {chapters.length > 1 && (
              /* overscroll-x-contain: this row starts flush with the physical
                 left edge on mobile (-mx-4 cancels the page's own padding), so
                 a scroll gesture starting right at "All" collides with the
                 browser's own edge-swipe-back gesture without this. */
              <div className="-mx-4 mt-2.5 overflow-x-auto overscroll-x-contain px-4 scrollbar-hide sm:mx-0 sm:px-0">
                <div className="flex w-max items-center gap-2">
                  {['All', ...chapters].map((t) => {
                    const on = (t === 'All' && !chapter) || chapter === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setChapter(t === 'All' ? '' : t)}
                        className={`tap-44 flex h-9 flex-none items-center whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel ${
                          on ? 'bg-brand-blue text-white' : 'bg-white/10 text-white/85 hover:bg-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main id="main-content" className={`flex-1 ${CONTAINER} pb-14 pt-4`}>
        {paper && (
          <>
            <PaperDisclaimerDialog />
            <PaperShareLock paperTitle={paperTitle(paper)} />
            <DisclaimerStrip tone="dark" school={paper.school} reportHref="/contact" />
          </>
        )}

        {/* RD-004 document surface: the questions are the sheet, lifted off the
            dark ground. It runs the full length of the paper rather than
            scrolling inside itself, so the page keeps one scrollbar. */}
        <div className="mt-4 rounded-xl bg-card p-4 shadow-[0_18px_40px_rgba(0,0,0,.45)] sm:p-6">
          {loading && (
            <div className="grid gap-3" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[104px] animate-shimmer rounded-[18px] bg-muted bg-[length:200%_100%]" />
              ))}
            </div>
          )}

          {!loading && !paper && (
            <p className="text-[15px] text-warm-prose">We could not find that paper.</p>
          )}

          {/* Formal exam-header block, per your reference photo — centred
              school/course line, bold title, total marks and an "answer all
              questions" instruction, like the top of an actual printed
              paper, instead of the questions just starting cold. */}
          {paper && (
            <div className="mb-5 border-b border-border pb-4 text-center">
              <p className="text-[13px] italic text-muted-foreground">{paper.school}</p>
              <h2 className="mt-1 font-display text-[20px] font-extrabold tracking-[-0.02em] text-foreground sm:text-[23px]">
                {/* Middle dot, not an em dash -- CLAUDE.md bans em/en dashes in
                   site copy; · is this codebase's own standing separator
                   convention (used throughout the badge line right below). */}
                Class {paper.cls} {paper.subject} {paper.exam ? `· ${paper.exam}` : ''}
              </h2>
              {hasYear(paper.year) && (
                <p className="mt-0.5 text-[13px] tabular-nums text-muted-foreground">{paper.year}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] font-semibold tabular-nums text-foreground">
                <span>{paper.questionCount} question{paper.questionCount === 1 ? '' : 's'}</span>
                {paper.marks > 0 && <span>Total: {paper.marks} marks</span>}
              </div>
              <p className="mt-2 text-[12.5px] uppercase tracking-[0.04em] text-muted-foreground">
                Answer all questions
              </p>
            </div>
          )}

          {paper && visible.length > 0 && (
            /* data-paper-locked drives the print rule in index.css: Ctrl+P and
               "Save as PDF" render the page without the questions, so printing
               is not a way around the gate. Selection is off here and nowhere
               else on the page -- see paperLockClass. */
            <ol data-paper-locked className={`grid grid-cols-1 gap-3 ${paperLockClass}`}>
              {visible.map((row) => questionCard(row))}
            </ol>
          )}

          {/* The lock.

              There is no blurred tail any more because there is no tail: the
              server sent five questions and kept the rest. So this states the
              count from the paper's own question_count rather than pretending
              to show rows it does not have -- honest about what is behind it,
              and impossible to defeat by deleting a CSS filter.

              Hidden while filtering: "182 more questions" under a chapter
              search reads as a claim about the search, not about the paper. */}
          {withheld > 0 && !filtering && (
            <div className="mt-3 rounded-[18px] bg-brand-blue-subtle px-4 py-5 text-center">
              <p className="text-[17px] font-extrabold tracking-[-0.03em] text-foreground">
                {withheld} more {withheld === 1 ? 'question' : 'questions'} in this paper
              </p>
              <p className="mx-auto mt-1 max-w-[34ch] text-[13.5px] leading-[1.5] text-warm-prose">
                Reading the rest is free. It just needs an account, so we can
                keep your place across papers.
              </p>
              <button
                type="button"
                onClick={() => setGateOpen(true)}
                className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue px-5 text-[14px] font-bold text-white transition-transform duration-tap hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Sign in to read all {paper?.questionCount ?? questions.length}
              </button>
            </div>
          )}


          {paper && visible.length === 0 && !loading && (
            /* A signed-out reader is searching five questions, not the paper,
               so "nothing matches" would be a false negative on a paper that
               does contain the word. Say which haystack was actually searched. */
            <p className="text-[15px] text-warm-prose">
              {withheld > 0
                ? `No match in the ${questions.length} free questions. The other ${withheld} are behind a free account.`
                : 'Nothing in this paper matches that.'}
            </p>
          )}
        </div>

        {paper && (
          <div className="mt-4 rounded-[24px] bg-brand p-[18px]">
            <p className="text-[17px] font-extrabold tracking-[-0.03em] text-foreground">
              Stuck on one of these?
            </p>
            {/* Was hardcoded to Maths in both the label and the href, which
                sent a reader of a History & Civics paper to maths teachers.
                The route is resolved from SUBJECT_PATH_TO_FILTER (the same
                table the subject pages themselves are built from) so the
                link can only ever point at a route that exists; anything
                without its own page falls back to the filtered browse. */}
            <Link
              to={subjectTeacherPath(paper.subject)}
              className="mt-3 inline-flex h-[46px] items-center rounded-full bg-panel px-5 text-[14px] font-bold text-card transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Find a {paper.subject} teacher
            </Link>
          </div>
        )}
      </main>

      {/* The canonical papers sign-in sheet, already built for exactly this
          and unused until now. Named the specific paper rather than prompting
          generically, per its own rule 4. */}
      <GateSheet
        open={gateOpen}
        onOpenChange={setGateOpen}
        flavor="papers"
        redirectTo={`/past-papers/${id ?? ''}`}
        paperTitle={paper ? `${paper.school} Class ${paper.cls} ${paper.subject}` : null}
        paperSubject={paper?.subject ?? "Mathematics"}
      />

      <Footer />
    </div>
  );
}
