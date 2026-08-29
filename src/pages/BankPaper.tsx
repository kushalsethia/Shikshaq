import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Flag, Search } from 'lucide-react';

import { Footer } from '@/components/Footer';
import { DisclaimerStrip } from '@/components/papers/disclaimer-strip';
import { MathText } from '@/components/papers/math-text';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getWhatsAppLink } from '@/utils/whatsapp';
import {
  loadBank, papersOf, questionsOf, hasYear, schoolLabel,
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

export default function BankPaper() {
  const { id } = useParams<{ id: string }>();
  const [bank, setBank] = useState<BankQuestion[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState('');
  const [q, setQ] = useState('');
  const [reportFor, setReportFor] = useState('');
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadBank()
      .then((d) => { if (!cancelled) setBank(d); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { setChapter(''); setQ(''); setReportFor(''); setReportText(''); }, [id]);

  const paper: BankPaperMeta | null = useMemo(
    () => (bank && id ? papersOf(bank).find((p) => p.id === id) ?? null : null),
    [bank, id],
  );
  const questions = useMemo(() => (bank && id ? questionsOf(bank, id) : []), [bank, id]);

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

  usePageMeta(
    paper
      ? `${schoolLabel(paper.school)} Class ${paper.cls} Maths ${hasYear(paper.year) ? paper.year : ''} Question Paper | Shikshaq`
      : 'Past paper | Shikshaq',
    paper
      ? `All ${paper.questionCount} questions from the ${schoolLabel(paper.school)} Class ${paper.cls} Mathematics ${paper.exam}, with marks, chapters and figures. Free to read.`
      : 'Read a free past year question paper on Shikshaq.',
  );

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

  const reportHref = useMemo(() => {
    const row = questions.find((r) => r.i === reportFor);
    const lines = [
      'Hi Shikshaq, there is a problem with a question.',
      '',
      paper ? `Paper: ${schoolLabel(paper.school)} Class ${paper.cls} ${paper.exam}` : null,
      row ? `Question: ${row.n ?? row.i}` : null,
      row ? `Id: ${row.i}` : null,
      '',
      reportText.trim() || 'What is wrong:',
    ].filter(Boolean);
    return `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [questions, reportFor, reportText, paper]);

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
      {/* Everything you steer with, in one sticky block. Separately stuck they
          would need a hard-coded offset each and drift apart the moment the
          title wrapped. */}
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

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[14px] font-bold text-white">
              {paper ? `${schoolLabel(paper.school)} · Class ${paper.cls} Mathematics` : 'Past paper'}
            </h1>
            {facts.length > 0 && (
              <p className="truncate text-[11.5px] tabular-nums text-white/60">
                {facts.join(' · ')}
              </p>
            )}
          </div>
        </div>

        {(chapters.length > 1 || questions.length > 0) && (
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
                className="h-10 w-full rounded-full bg-white/10 pl-10 pr-4 text-[14.5px] text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
              />
            </div>
            {chapters.length > 1 && (
              <div className="-mx-4 mt-2.5 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
                <div className="flex w-max items-center gap-2">
                  {['All', ...chapters].map((t) => {
                    const on = (t === 'All' && !chapter) || chapter === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setChapter(t === 'All' ? '' : t)}
                        className={`flex h-9 flex-none items-center whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel ${
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
        )}
      </div>

      <main id="main-content" className={`flex-1 ${CONTAINER} pb-14 pt-4`}>
        {paper && (
          <DisclaimerStrip tone="dark" school={schoolLabel(paper.school)} reportHref="/contact" />
        )}

        {/* RD-004 document surface: the questions are the sheet, lifted off the
            dark ground. It runs the full length of the paper rather than
            scrolling inside itself, so the page keeps one scrollbar. */}
        <div className="mt-4 rounded-xl bg-card p-4 shadow-[0_18px_40px_rgba(0,0,0,.45)] sm:p-6">
          {!bank && (
            <div className="grid gap-3" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[104px] animate-shimmer rounded-[18px] bg-muted bg-[length:200%_100%]" />
              ))}
            </div>
          )}

          {bank && !paper && (
            <p className="text-[15px] text-warm-prose">We could not find that paper.</p>
          )}

          {paper && visible.length > 0 && (
            <ol className="grid grid-cols-1 gap-3">
              {visible.map((row) => (
                <li key={row.i} id={`q-${row.i}`} className="min-w-0 rounded-[18px] bg-muted p-[16px]">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    {row.n && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-blue px-1.5 text-[12px] font-extrabold tabular-nums text-white">
                        {row.n}
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
                  </div>

                  <MathText text={row.t} className="text-[15px] leading-[1.6] text-foreground" />

                  {row.f && (
                    <figure className="mt-2.5">
                      <img
                        src={`/paper-figures/${row.f}`}
                        alt={`Figure for question ${row.n ?? ''}`}
                        loading="lazy"
                        decoding="async"
                        className="max-h-[300px] w-auto max-w-full rounded-[12px] bg-card p-2 shadow-border"
                      />
                    </figure>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setReportFor(row.i);
                      document.getElementById('report-a-question')?.scrollIntoView({ block: 'center' });
                    }}
                    className="mt-2.5 inline-flex min-h-11 items-center gap-1.5 text-[12px] font-semibold text-warm-label transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                    Something wrong here?
                  </button>
                </li>
              ))}
            </ol>
          )}

          {paper && visible.length === 0 && bank && (
            <p className="text-[15px] text-warm-prose">Nothing in this paper matches that.</p>
          )}
        </div>

        {paper && (
          <div className="mt-4 rounded-[24px] bg-brand p-[18px]">
            <p className="text-[17px] font-extrabold tracking-[-0.03em] text-[#1F1F1F]">
              Stuck on one of these?
            </p>
            <Link
              to="/maths-tuition-teachers-in-kolkata"
              className="mt-3 inline-flex h-[46px] items-center rounded-full bg-panel px-5 text-[14px] font-bold text-[#FCFAF7] transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Find a Maths teacher
            </Link>
          </div>
        )}

        {/* OCR gets things wrong, and the bank says so itself: 57 records are
            several questions in one, some marks were never recovered, and the
            chapter tags are unmeasured. The reader is the one who will notice,
            so give them somewhere to say it, with the question already
            selected when they arrive from a card. */}
        {paper && questions.length > 0 && (
          <div id="report-a-question" className="mt-4 rounded-[20px] bg-white/[0.06] p-[18px]">
            <p className="text-[15px] font-extrabold text-white">Something wrong with a question?</p>
            <p className="mt-1 text-[13.5px] leading-[1.55] text-white/70">
              These come from scanned papers, so a stray character or a wrong chapter tag happens.
              Tell us which one and what looks off.
            </p>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-[minmax(0,220px)_1fr]">
              <label className="block">
                <span className="mb-1 block text-[11.5px] font-bold uppercase tracking-[0.04em] text-white/50">
                  Question
                </span>
                <select
                  value={reportFor}
                  onChange={(e) => setReportFor(e.target.value)}
                  className="h-11 w-full appearance-none rounded-[14px] bg-white/10 px-3.5 text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
                >
                  <option value="">Choose one</option>
                  {questions.map((row) => (
                    <option key={row.i} value={row.i}>
                      {row.n ? `Question ${row.n}` : row.i}
                      {row.c ? ` · ${row.c}` : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[11.5px] font-bold uppercase tracking-[0.04em] text-white/50">
                  What is wrong
                </span>
                <input
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. the figure belongs to another question"
                  className="h-11 w-full rounded-[14px] bg-white/10 px-3.5 text-[14px] text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
                />
              </label>
            </div>

            {reportFor ? (
              <a
                href={reportHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13.5px] font-bold text-panel transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
              >
                <Flag className="h-4 w-4" aria-hidden="true" />
                Send the report
              </a>
            ) : (
              <p className="mt-3 text-[12.5px] text-white/50">Pick a question to send a report.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
