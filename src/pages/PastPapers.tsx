import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, Languages, Calculator, Brain, Landmark as LandmarkIcon, Dna, Monitor, Wallet, FileText, Search, ShieldCheck, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SearchControl } from '@/components/SearchControl';
import { Footer } from '@/components/Footer';
import { PaperCard } from '@/components/PaperCard';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, CLASSES, BOARDS } from '@/utils/searchFacets';
import { getSubjectPalette, paletteFromSeed, SUBJECT_SEEDS } from '@/lib/subject-palette';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { PageHeader, PillRow } from '@/components/devices';

// Cycled (not hashed) for pure visual variety across the class/board pill
// walls — these are not subject-coded lists, so there's no "correct" mapping
// per item, just the mandate for each pill to carry a different token color.
const PILL_SEEDS = Object.values(SUBJECT_SEEDS);

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
  otherBoardCount: number;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
// Tighter than the marketing-page SECTION rhythm (py-16..24) — this is a
// dense utility page stacking several full-bleed colored slabs; that much
// air between them read as wasted space rather than breathing room.
const SECTION = 'py-8 sm:py-12';
const SKELETON = 'bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const FOCUS_BLUE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const PAPER_CLASSES = CLASSES.filter((c) => c !== 'UG');

type GroupMode = 'subject' | 'board';

const SUBJECT_ICON: Record<string, typeof BookOpen> = {
  Chemistry: FlaskConical, Hindi: Languages, English: BookOpen, Maths: Calculator,
  Mathematics: Calculator, Psychology: Brain, Economics: Wallet, Biology: Dna,
  Computers: Monitor, Computer: Monitor, Accounts: LandmarkIcon,
};

// NOTE ON COPY (kept truthful — see PaperReader.tsx's print-CSS comment):
// `file_url` points at a PUBLIC Supabase bucket, so downloading and printing
// are NOT blocked and this page must never say they are. Earlier copy here
// read "No download, no app, no print" and "Nothing to download", which
// asserted a restriction the product does not enforce. Rewritten to say what
// is actually true: papers open in the browser and cost nothing.
const PAPER_STEPS = [
  { n: '01', icon: Search, title: 'Find the paper', body: 'Search by school, subject, class or board, or browse the sections below.' },
  { n: '02', icon: FileText, title: 'Read it here', body: 'Papers open right in the browser. No app to install, nothing to buy.' },
  { n: '03', icon: ShieldCheck, title: "It's free, always", body: "Shared by students, for students. We don't charge for a single page." },
];

const PAPER_PROMISES = [
  { icon: FileText, title: 'Opens in the browser', body: 'Every paper reads in the page. No app, no account needed to browse.' },
  { icon: Users, title: 'Shared by students', body: "The collection grows as students who've sat these exams share their papers." },
  { icon: ShieldCheck, title: 'Removed on request', body: 'Any school that wants a paper taken down can have it removed, no argument.' },
];

// A paper counts as "new" for the Recently added stickers when it was added
// within the last week — factual, derived from created_at, never marketing copy.
function isNewThisWeek(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs >= 0 && ageMs <= 7 * 24 * 60 * 60 * 1000;
}

/**
 * Unified loading treatment. Previously each section rendered the moment its
 * own slice of state arrived, so on a slow connection the page assembled
 * itself in four visible jumps and looked half-broken in between. All four
 * queries already resolve together in one Promise.all — this just holds the
 * whole shelf behind one skeleton until they do, in the shape of the real
 * content (DESIGN_SYSTEM §9).
 */
function ShelfSkeleton() {
  return (
    <div className={`${CONTAINER} pb-12`} aria-hidden="true">
      <div className={`h-12 w-full max-w-3xl rounded-2xl ${SKELETON}`} />
      <div className={`mt-6 h-16 w-48 rounded-2xl ${SKELETON}`} />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => <div key={i} className={`h-48 rounded-2xl ${SKELETON}`} />)}
      </div>
      <div className={`mt-12 h-56 rounded-4xl ${SKELETON}`} />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className={`h-32 rounded-2xl ${SKELETON}`} />)}
      </div>
    </div>
  );
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
  const [boardCounts, setBoardCounts] = useState<Record<string, number>>({});
  const [totalPapers, setTotalPapers] = useState<number | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>('subject');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
    let cancelled = false;
    async function fetchLanding() {
      setLoading(true);
      setLoadError(false);
      const [schoolsRes, recentRes, subjectsRes, countRes] = await Promise.all([
        supabase.from('papers').select('school,board').eq('is_published', true),
        supabase.from('papers').select('id,title,school,subject,class,board,exam_type,year,file_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('papers').select('subject').eq('is_published', true),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
      ]);
      if (cancelled) return;

      // Error state (DESIGN_SYSTEM §9). Purely a read of the errors the
      // queries already return — the queries themselves are untouched.
      if (schoolsRes.error || recentRes.error || subjectsRes.error || countRes.error) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      if (schoolsRes.data) {
        const bySchool = new Map<string, Map<string, number>>();
        schoolsRes.data.forEach((p) => {
          const boards = bySchool.get(p.school) ?? new Map<string, number>();
          boards.set(p.board, (boards.get(p.board) || 0) + 1);
          bySchool.set(p.school, boards);
        });
        // Card shows only the dominant board's own count (not the school's
        // total across all boards) so "{board} · {count} papers" is never
        // wrong: a school with 4 ICSE + 3 CBSE now reads "ICSE · 4 papers +
        // 3 more", not a misleading "ICSE · 7 papers" that implies every one
        // of those 7 results is ICSE when clicked through.
        const stats: SchoolStat[] = Array.from(bySchool.entries()).map(([school, boards]) => {
          let dominantBoard = '';
          let dominantCount = 0;
          let total = 0;
          boards.forEach((count, board) => {
            total += count;
            if (count > dominantCount) { dominantCount = count; dominantBoard = board; }
          });
          return { school, board: dominantBoard, count: dominantCount, otherBoardCount: total - dominantCount };
        }).sort((a, b) => a.school.localeCompare(b.school));
        setSchoolStats(stats);

        const boards: Record<string, number> = {};
        schoolsRes.data.forEach((p) => { boards[p.board] = (boards[p.board] || 0) + 1; });
        setBoardCounts(boards);
      }
      if (recentRes.data) setRecentPapers(recentRes.data);
      if (subjectsRes.data) {
        const counts: Record<string, number> = {};
        subjectsRes.data.forEach((p) => { counts[p.subject] = (counts[p.subject] || 0) + 1; });
        setSubjectCounts(counts);
      }
      setTotalPapers(countRes.count ?? 0);
      setLoading(false);
    }
    fetchLanding();
    return () => { cancelled = true; };
  }, [hasFilters]);

  // The search bar's Teachers/Papers toggle doubles as the page-mode switch.
  const handleSearchModeChange = (mode: 'teachers' | 'papers') => {
    if (mode !== 'teachers') return;
    navigate('/all-tuition-teachers-in-kolkata');
  };

  const featuredSubjects = SUBJECTS.filter((s) => subjectCounts[s]).slice(0, 8);
  const featuredBoards = BOARDS.filter((b) => boardCounts[b]);
  const subjectsCovered = Object.keys(subjectCounts).length;
  const isEmptyCatalogue = !loading && !loadError && totalPapers === 0;

  const requestPaperUrl = `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(
    "Hi! I'm looking for a past paper on Shikshaq — could you add it?"
  )}`;

  const hasNewThisWeek = recentPapers.some((p) => isNewThisWeek(p.created_at));

  if (hasFilters) {
    return <Navigate to={`/past-papers/results?${searchParams.toString()}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* ------------------------------------------------------------- Hero */}
        {/* THE first fold. Graph-paper ground (device I) is the most on-theme
            surface on the whole site — it reads as a school exercise book
            before a single word loads. Marker-highlight (A) on the emphasised
            phrase, SpeechTag counts (D, via PageHeader's `tags`) carrying live
            papers/schools numbers instead of a boring subtitle line, and a
            "New this week" starburst (C) when the data actually supports it —
            never a fabricated claim. SearchControl stays the functional slot
            inside the fold per the "eyecandy yet functional" ruling. */}
        <PageHeader
          eyebrow="Free community resource"
          title={
            <>
              Past papers from{' '}
              <span className="marker-highlight marker-highlight--pill">Kolkata schools</span>, shared by
              students, for students.
            </>
          }
          lede="Real question papers set by real schools. Free to read, free to search, nothing hidden."
          tags={
            !loading && !loadError && totalPapers != null && totalPapers > 0
              ? [
                  { label: `${totalPapers.toLocaleString('en-IN')} paper${totalPapers === 1 ? '' : 's'}` },
                  ...(schoolStats.length > 0 ? [{ label: `${schoolStats.length} school${schoolStats.length === 1 ? '' : 's'}`, dotColor: 'hsl(var(--brand-blue))' }] : []),
                ]
              : undefined
          }
          badge={hasNewThisWeek ? { label: 'New this week', color: 'hsl(var(--brand-blue))' } : undefined}
          accent="hsl(var(--brand))"
          ground="graph"
        >
          <SearchControl align="flex-start" stackedToggle initialMode="papers" onModeChange={handleSearchModeChange} />

          {/* Single consolidated stat line, kept as the functional "browse
              everything" handoff — held back until the fetch resolves so it
              doesn't pop in after the rest of the fold has already settled. */}
          {!loading && !loadError && totalPapers != null && totalPapers > 0 && (
            <button
              onClick={() => navigate('/past-papers/results')}
              className={`mt-6 flex min-h-11 w-fit items-center gap-2 rounded-full bg-brand-blue px-5 text-body-secondary font-semibold text-white transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:hover:translate-y-0 ${FOCUS_BLUE}`}
            >
              Browse every paper
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </PageHeader>

        <div className="bg-gradient-to-b from-brand-blue-subtle to-background pt-8">
          {loading && <ShelfSkeleton />}

          {/* ----------------------------------------------------- Recently added */}
          {!loading && !loadError && recentPapers.length > 0 && (
            <section className={`${CONTAINER} pb-12`}>
              <h2 className="mb-6 text-section-head font-display font-bold">Recently added</h2>
              <div className="stagger-children -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 scrollbar-hide sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
                {recentPapers.map((p) => (
                  <div key={p.id} className="w-64 flex-none animate-card-reveal snap-start motion-reduce:animate-none sm:w-auto">
                    <PaperCard paper={p} variant="recent" sticker={isNewThisWeek(p.created_at) ? 'New this week' : undefined} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------- Error state */}
          {loadError && (
            <section className={`${CONTAINER} pb-12`}>
              <EmptyResults
                heading="Unable to load the paper collection right now"
                message="This is on us, not on your connection necessarily. Refresh and it usually comes straight back."
                action={{ label: 'Refresh', onClick: () => window.location.reload() }}
              />
            </section>
          )}

          {/* --------------------------------------------- Global-zero empty state */}
          {/* LOUD moment (VISUAL_DIRECTION §4): nothing is being compared here,
              so the collage grammar is fully permitted — thick outline, offset
              shadow, halftone grain, a rotated sticker. This is the single
              highest-leverage screen on the papers surface: it is where a
              first visitor to a sparse catalogue currently dead-ends. */}
          {isEmptyCatalogue && (
            <section className={`${CONTAINER} pb-12`}>
              <div className="halftone-overlay outline-thick outline-offset-shadow relative rounded-4xl bg-brand-blue-subtle p-6 sm:p-12">
                <span className="sticker sticker-rotate-md animate-pop absolute -top-3 right-6 rounded-full bg-brand px-4 py-1 text-label font-bold uppercase text-foreground motion-reduce:animate-none">
                  Day one
                </span>
                <EmptyResults
                  className="bg-transparent shadow-none"
                  icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                  heading="The collection is just getting started"
                  message="We're still gathering papers from Kolkata schools — nothing's uploaded yet. Tell us which paper you need and we'll chase it down, or find a teacher who can help in the meantime."
                  options={[{ label: 'Browse teachers instead', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }]}
                  action={{
                    label: 'Request a paper',
                    onClick: () => window.open(requestPaperUrl, '_blank', 'noopener,noreferrer'),
                  }}
                />
              </div>
            </section>
          )}
        </div>

        {/* --------------------------------------------------------- By school */}
        {!loading && !loadError && schoolStats.length > 0 && (
          <section className={`${CONTAINER} pb-8`}>
            <div className="rounded-4xl bg-brand-blue p-6 sm:p-8">
              <h2 className="mb-6 text-section-head font-display font-bold text-white">By school</h2>
              <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {schoolStats.map(({ school, board, count, otherBoardCount }) => (
                  <button
                    key={school}
                    onClick={() => navigate(`/past-papers/results?filter_schools=${encodeURIComponent(school)}`)}
                    className={`flex min-h-11 animate-card-reveal flex-col rounded-2xl bg-card p-4 text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:p-6 ${FOCUS}`}
                  >
                    <span className="block break-words text-subsection font-semibold text-foreground">{school}</span>
                    <span className="mt-2 block text-meta tabular-nums text-muted-foreground">
                      {board} · {count} paper{count === 1 ? '' : 's'}
                      {otherBoardCount > 0 ? ` + ${otherBoardCount} more` : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------- By subject / board */}
        {!loading && !loadError && (featuredSubjects.length > 0 || featuredBoards.length > 0) && (
          <section className={`${CONTAINER} ${SECTION} pt-0`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-section-head font-display font-bold">
                By {groupMode === 'subject' ? 'subject' : 'board'}
              </h2>
              {/* Segmented toggle mapped to the two real groupings this page
                  already fetches — subjectCounts and boardCounts. */}
              <div role="tablist" aria-label="Group papers by" className="inline-flex rounded-full bg-muted p-1">
                {(['subject', 'board'] as GroupMode[]).map((mode) => (
                  <button
                    key={mode}
                    role="tab"
                    aria-selected={groupMode === mode}
                    onClick={() => setGroupMode(mode)}
                    className={`min-h-11 rounded-full px-4 text-body-secondary font-semibold capitalize transition-colors duration-tap ease-tap ${FOCUS} ${
                      groupMode === mode ? 'bg-card text-foreground shadow-border' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* RESPONSIVE FIX: this was `grid-cols-2` from 375px up, which put a
                42px icon tile, a 23px name and a count badge inside a ~160px
                column with 22px of padding — the audit's "cramped" finding. The
                base layout is now a single roomy column with the icon set BESIDE
                the label (a signpost read horizontally), flipping to the stacked
                tile from `sm:` where there is width for it. Same destinations,
                same counts, no truncation at 375. */}
            {groupMode === 'subject' ? (
              <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {featuredSubjects.map((s) => {
                  const palette = getSubjectPalette(s);
                  const Icon = SUBJECT_ICON[s] || BookOpen;
                  const count = subjectCounts[s];
                  return (
                    <button
                      key={s}
                      onClick={() => navigate(`/past-papers/results?filter_subjects=${encodeURIComponent(s)}`)}
                      className={`flex min-h-11 animate-card-reveal items-center gap-4 rounded-2xl p-4 text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:block sm:p-6 ${FOCUS_BLUE}`}
                      style={{ backgroundColor: palette.tint }}
                    >
                      <span
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg sm:mb-6"
                        style={{ backgroundColor: palette.solid }}
                      >
                        <Icon size={21} strokeWidth={1.9} aria-hidden="true" style={{ color: palette.badgeText }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-card-title-lg font-bold" style={{ color: palette.text }}>
                          {s}
                        </span>
                        {/* Live count from the existing subjectCounts state —
                            never a literal zero, since featuredSubjects already
                            filters those out (DESIGN_SYSTEM §13). */}
                        <span
                          className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-label font-bold uppercase tabular-nums"
                          style={{ backgroundColor: palette.solid, color: palette.badgeText }}
                        >
                          {count} paper{count === 1 ? '' : 's'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {featuredBoards.map((b) => {
                  const count = boardCounts[b];
                  return (
                    <button
                      key={b}
                      onClick={() => navigate(`/past-papers/results?filter_boards=${encodeURIComponent(b)}`)}
                      className={`flex min-h-11 animate-card-reveal items-center gap-4 rounded-2xl bg-brand-blue-subtle p-4 text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:block sm:p-6 ${FOCUS_BLUE}`}
                    >
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-blue sm:mb-6">
                        <LandmarkIcon size={21} className="text-white" strokeWidth={1.9} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-card-title-lg font-bold text-brand-blue-deep">{b}</span>
                        <span className="mt-2 inline-flex items-center rounded-full bg-brand-blue px-3 py-1 text-label font-bold uppercase tabular-nums text-white">
                          {count} paper{count === 1 ? '' : 's'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* --------------------------------------------------- By class & board */}
        {!loadError && (
          <section className={`${CONTAINER} pb-8`}>
            <div className="rounded-4xl bg-brand p-6 sm:p-8">
              {/* §2 accent rule: orange never carries white text, so this heading
                  is dark even though the prototype's spec called it white. */}
              <h2 className="mb-6 text-section-head font-display font-bold text-foreground">By class &amp; board</h2>

              {/* PILL-WALL FIX: this used to be one flat 17-item `flex-wrap`
                  block (12 class pills + 5 board pills) — a long, low-density
                  scroll segment right at the first decision point. Device M
                  (`PillRow`) replaces it: full-width rows, each a different
                  token color, each led by a small contrasting badge holding
                  the class numeral or board's short code. Colors are cycled
                  through the sanctioned subject-palette generator (not a new
                  hex) purely for visual variety — these aren't subject-coded
                  lists. */}
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-label font-bold uppercase text-foreground/70">Class</p>
                  <PillRow
                    layout="grid"
                    items={PAPER_CLASSES.map((c, i) => {
                      const p = paletteFromSeed(PILL_SEEDS[i % PILL_SEEDS.length]);
                      return {
                        key: `class-${c}`,
                        badge: c,
                        label: `Class ${c}`,
                        color: p.tint,
                        textColor: p.text,
                        onClick: () => navigate(`/past-papers/results?filter_classes=${encodeURIComponent(c)}`),
                      };
                    })}
                  />
                </div>
                <div>
                  <p className="mb-3 text-label font-bold uppercase text-foreground/70">Board</p>
                  <PillRow
                    layout="grid"
                    items={BOARDS.map((b, i) => {
                      const p = paletteFromSeed(PILL_SEEDS[(i + 3) % PILL_SEEDS.length]);
                      return {
                        key: `board-${b}`,
                        badge: b.slice(0, 2).toUpperCase(),
                        label: b,
                        color: p.tint,
                        textColor: p.text,
                        onClick: () => navigate(`/past-papers/results?filter_boards=${encodeURIComponent(b)}`),
                      };
                    })}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ 3 steps */}
        <section className={`${CONTAINER} ${SECTION} pt-0`}>
          <h2 className="mb-8 text-center text-section-head font-display font-bold">
            Three steps, no cost,<br />no catch.
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PAPER_STEPS.map((step) => (
              <div key={step.n}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-blue text-body font-display font-bold tabular-nums text-white">{step.n}</span>
                  <h3 className="flex items-center gap-2 text-subsection font-semibold">
                    <step.icon size={18} className="text-brand-blue" strokeWidth={2} aria-hidden="true" />
                    {step.title}
                  </h3>
                </div>
                <p className="max-w-prose text-body-secondary text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ Promises */}
        <section className={`${CONTAINER} pb-16 sm:pb-20`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {PAPER_PROMISES.map((pp) => (
              <div key={pp.title} className="rounded-2xl bg-card p-4 shadow-border sm:p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                  <pp.icon size={19} className="text-foreground" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-subsection font-bold">{pp.title}</h3>
                <p className="text-body-secondary text-muted-foreground">{pp.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- Ownership */}
        <section className={`${CONTAINER} pb-16`}>
          <div className="rounded-4xl bg-muted p-6 sm:p-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-section-head font-display font-bold">Who owns these papers</h2>
              <p className="text-body text-warm-prose">
                Every paper here is the property of the school that set it. Shikshaq claims no ownership over any paper, derives no revenue from any paper, and hosts these materials solely as a free community resource for students.
              </p>
              <p className="text-body text-warm-prose">
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
