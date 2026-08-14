import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, Languages, Calculator, Brain, Landmark as LandmarkIcon, Dna, Monitor, Wallet, FileText, Search, ShieldCheck, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SearchControl } from '@/components/SearchControl';
import { Footer } from '@/components/Footer';
import { PaperCard } from '@/components/PaperCard';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, CLASSES, BOARDS } from '@/utils/searchFacets';
import { getSubjectPalette } from '@/lib/subject-palette';

interface Paper {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  file_url: string | null;
  created_at: string;
}

interface SchoolStat {
  school: string;
  board: string;
  count: number;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const SECTION = 'py-16 sm:py-20 lg:py-24';

const PAPER_CLASSES = CLASSES.filter((c) => c !== 'UG');

const SUBJECT_ICON: Record<string, typeof BookOpen> = {
  Chemistry: FlaskConical, Hindi: Languages, English: BookOpen, Maths: Calculator,
  Mathematics: Calculator, Psychology: Brain, Economics: Wallet, Biology: Dna,
  Computers: Monitor, Computer: Monitor, Accounts: LandmarkIcon,
};

const PAPER_STEPS = [
  { n: '01', icon: Search, title: 'Find the paper', body: 'Search by school, subject, class or board, or browse the sections below.' },
  { n: '02', icon: FileText, title: 'Read it here', body: 'Papers open right in the browser. No download, no app, no print.' },
  { n: '03', icon: ShieldCheck, title: "It's free, always", body: "Shared by students, for students. We don't charge for a single page." },
];

const PAPER_PROMISES = [
  { icon: FileText, title: 'Nothing to download', body: 'Every paper reads in the browser. No PDFs cluttering your downloads folder.' },
  { icon: Users, title: 'Shared by students', body: "The collection grows as students who've sat these exams share their papers." },
  { icon: ShieldCheck, title: 'Removed on request', body: 'Any school that wants a paper taken down can have it removed, no argument.' },
];

// A paper counts as "new" for the Recently added stickers when it was added
// within the last week — factual, derived from created_at, never marketing copy.
function isNewThisWeek(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs >= 0 && ageMs <= 7 * 24 * 60 * 60 * 1000;
}

export default function PastPapers() {
  usePageMeta(
    'Past Year Question Papers (PYQs) for CBSE, ICSE and State Board | Shikshaq',
    'Download free past year question papers and previous year solved papers for CBSE, ICSE, ISC and West Bengal State Board exams. Practice PYQs by subject and class.'
  );

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [schoolStats, setSchoolStats] = useState<SchoolStat[]>([]);
  const [recentPapers, setRecentPapers] = useState<Paper[]>([]);
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({});
  const [totalPapers, setTotalPapers] = useState<number | null>(null);

  // The old /past-papers route used to render results inline; that's now the
  // dedicated /past-papers/results route (see PaperResults.tsx). SearchControl,
  // Browse's mode-handoff, and a couple of older internal links still commit to
  // /past-papers with filter/q params attached (they're outside this task's
  // edit scope), so this redirect keeps them working instead of silently
  // stranding those params on the landing page.
  const hasFilters = searchParams.toString().length > 0;

  // Landing-page data: schools, recent papers, subject counts, total
  useEffect(() => {
    if (hasFilters) return;
    async function fetchLanding() {
      const [schoolsRes, recentRes, subjectsRes, countRes] = await Promise.all([
        supabase.from('papers').select('school,board').eq('is_published', true),
        supabase.from('papers').select('id,title,school,subject,class,board,exam_type,year,file_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('papers').select('subject').eq('is_published', true),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
      ]);

      if (schoolsRes.data) {
        const bySchool = new Map<string, Map<string, number>>();
        schoolsRes.data.forEach((p) => {
          const boards = bySchool.get(p.school) ?? new Map<string, number>();
          boards.set(p.board, (boards.get(p.board) || 0) + 1);
          bySchool.set(p.school, boards);
        });
        const stats: SchoolStat[] = Array.from(bySchool.entries()).map(([school, boards]) => {
          let dominantBoard = '';
          let dominantCount = 0;
          let total = 0;
          boards.forEach((count, board) => {
            total += count;
            if (count > dominantCount) { dominantCount = count; dominantBoard = board; }
          });
          return { school, board: dominantBoard, count: total };
        }).sort((a, b) => a.school.localeCompare(b.school));
        setSchoolStats(stats);
      }
      if (recentRes.data) setRecentPapers(recentRes.data);
      if (subjectsRes.data) {
        const counts: Record<string, number> = {};
        subjectsRes.data.forEach((p) => { counts[p.subject] = (counts[p.subject] || 0) + 1; });
        setSubjectCounts(counts);
      }
      setTotalPapers(countRes.count ?? 0);
    }
    fetchLanding();
  }, [hasFilters]);

  // The search bar's Teachers/Papers toggle doubles as the page-mode switch.
  const handleSearchModeChange = (mode: 'teachers' | 'papers') => {
    if (mode !== 'teachers') return;
    navigate('/all-tuition-teachers-in-kolkata');
  };

  const featuredSubjects = SUBJECTS.filter((s) => subjectCounts[s]).slice(0, 8);

  if (hasFilters) {
    return <Navigate to={`/past-papers/results?${searchParams.toString()}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* ------------------------------------------------------------- Hero */}
        <section className={`${CONTAINER} pb-8 pt-12 sm:pt-16 lg:pt-20`}>
          <span className="inline-flex items-center rounded-full bg-brand-blue-subtle px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[.04em] text-brand-blue-deep">
            Free community resource
          </span>
          <h1 className="mt-5 max-w-3xl text-[clamp(31px,5.2vw,60px)] font-normal leading-[.95] tracking-[-.055em] text-foreground">
            Past papers from <span className="font-extrabold">Kolkata schools</span>, shared by students, <span className="font-extrabold">for students</span>.
          </h1>
          <p className="mt-6 max-w-prose text-base text-muted-foreground sm:text-lg">
            Real question papers set by real schools. Nothing to pay for, nothing to download, nothing hidden.
          </p>
          <div className="mt-7 max-w-3xl">
            <SearchControl align="flex-start" stackedToggle initialMode="papers" onModeChange={handleSearchModeChange} />
          </div>

          {/* Device (c): bold numeric stat callout, restyling the existing
              "Browse all X papers" line rather than adding a new element. */}
          {totalPapers != null && totalPapers > 0 && (
            <button
              onClick={() => navigate('/past-papers/results?view=all')}
              className="mt-6 flex min-h-11 w-fit items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-border transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-3xl font-extrabold tabular-nums tracking-[-.02em] text-foreground">
                {totalPapers.toLocaleString('en-IN')}
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-label">
                  paper{totalPapers === 1 ? '' : 's'}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand-blue-deep">
                  Browse all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </span>
            </button>
          )}
        </section>

        {/* --------------------------------------------------------- By school */}
        {schoolStats.length > 0 && (
          <section className={`${CONTAINER} pb-8`}>
            <div className="rounded-4xl bg-brand-blue p-6 sm:p-8">
              <h2 className="mb-6 text-[clamp(23px,3vw,34px)] font-bold leading-none text-white">By school</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {schoolStats.map(({ school, board, count }) => (
                  <button
                    key={school}
                    onClick={() => navigate(`/past-papers/results?filter_schools=${encodeURIComponent(school)}`)}
                    className="block rounded-[18px] bg-card p-[22px] text-left transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    <span className="block truncate text-lg font-semibold tracking-[-.03em] leading-tight text-foreground">{school}</span>
                    <span className="mt-2 block text-sm text-muted-foreground">
                      {board} · {count} paper{count === 1 ? '' : 's'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------- By subject */}
        {featuredSubjects.length > 0 && (
          <section className={`${CONTAINER} ${SECTION} pt-0`}>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">By subject</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {featuredSubjects.map((s) => {
                const palette = getSubjectPalette(s);
                const Icon = SUBJECT_ICON[s] || BookOpen;
                const count = subjectCounts[s];
                return (
                  <button
                    key={s}
                    onClick={() => navigate(`/past-papers/results?filter_subjects=${encodeURIComponent(s)}`)}
                    className="block rounded-2xl p-[22px] text-left transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                    style={{ backgroundColor: palette.tint }}
                  >
                    <span className="mb-[26px] flex h-[42px] w-[42px] items-center justify-center rounded-[13px]" style={{ backgroundColor: palette.solid }}>
                      <Icon size={21} className="text-white" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="block text-[23px] font-bold tracking-[-.04em]" style={{ color: palette.text }}>
                      {s}
                    </span>
                    {/* Device (b): filter-chip live count badge, sourced from the
                        existing subjectCounts state — never a literal zero, since
                        featuredSubjects already filters those out. */}
                    <span
                      className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums"
                      style={{ backgroundColor: palette.solid, color: palette.badgeText }}
                    >
                      {count} paper{count === 1 ? '' : 's'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* --------------------------------------------------- By class & board */}
        <section className={`${CONTAINER} pb-8`}>
          <div className="rounded-4xl bg-brand p-6 sm:p-8">
            {/* Rules #9: orange never carries white text, so this heading is dark
                even though the prototype's spec copy called it a white h2. */}
            <h2 className="mb-6 text-[clamp(23px,3vw,34px)] font-bold leading-none text-foreground">By class &amp; board</h2>
            <div className="flex flex-wrap gap-3">
              {PAPER_CLASSES.map((c) => (
                <button
                  key={`class-${c}`}
                  onClick={() => navigate(`/past-papers/results?filter_classes=${encodeURIComponent(c)}`)}
                  className="flex min-h-11 items-center rounded-full bg-card px-[22px] text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Class {c}
                </button>
              ))}
              {BOARDS.map((b) => (
                <button
                  key={`board-${b}`}
                  onClick={() => navigate(`/past-papers/results?filter_boards=${encodeURIComponent(b)}`)}
                  className="flex min-h-11 items-center rounded-full bg-brand-blue-subtle px-[22px] text-sm font-semibold text-brand-blue-deep transition-colors duration-150 hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- Recently added */}
        {/* Device (a): horizontal-scroll paper-cover shelf, reusing PaperCard —
            mobile-first snap-scroll row (DESIGN_SYSTEM §11), wraps into a grid
            once there's room at sm: and up. */}
        {recentPapers.length > 0 && (
          <section className={`${CONTAINER} ${SECTION} pt-0`}>
            <h2 className="mb-5 text-2xl font-semibold tracking-tight sm:text-3xl">Recently added</h2>
            <div className="flex snap-x snap-mandatory gap-[18px] overflow-x-auto scrollbar-hide sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
              {recentPapers.map((p) => (
                <div key={p.id} className="w-[260px] flex-none snap-start sm:w-auto">
                  <PaperCard paper={p} variant="recent" sticker={isNewThisWeek(p.created_at) ? 'New this week' : undefined} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ 3 steps */}
        <section className={`${CONTAINER} ${SECTION} pt-0`}>
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:mb-10 sm:text-3xl">
            Three steps, no cost,<br />no catch.
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PAPER_STEPS.map((step) => (
              <div key={step.n}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-blue text-base font-bold text-white">{step.n}</span>
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <step.icon size={18} className="text-brand-blue" strokeWidth={2} aria-hidden="true" />
                    {step.title}
                  </h3>
                </div>
                <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ Promises */}
        <section className={`${CONTAINER} pb-16 sm:pb-20`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {PAPER_PROMISES.map((pp) => (
              <div key={pp.title} className="rounded-[22px] bg-card p-6 shadow-border">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <pp.icon size={19} className="text-foreground" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-lg font-bold tracking-[-.03em]">{pp.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pp.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- Ownership */}
        <section className={`${CONTAINER} pb-16`}>
          <div className="rounded-4xl bg-muted p-6 sm:p-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Who owns these papers</h2>
              <p className="text-base leading-relaxed text-warm-prose">
                Every paper here is the property of the school that set it. Shikshaq claims no ownership over any paper, derives no revenue from any paper, and hosts these materials solely as a free community resource for students.
              </p>
              <p className="text-base leading-relaxed text-warm-prose">
                Any school that wishes a paper removed can have it removed on request, without argument.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
