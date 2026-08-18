import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, Languages, Calculator, Brain, Landmark as LandmarkIcon, Dna, Monitor, Wallet, FileText, Search, ShieldCheck, Users, Lock } from 'lucide-react';
import { SearchControl } from '@/components/SearchControl';
import { Footer } from '@/components/Footer';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, CLASSES, BOARDS } from '@/utils/searchFacets';
import { getSubjectPalette, paletteFromSeed, SUBJECT_SEEDS } from '@/lib/subject-palette';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { PillRow } from '@/components/devices';
import { useAuth } from '@/lib/auth-context';
import { GoalRing } from '@/components/papers/goal-ring';
import { PaperCover, ShelfLedge } from '@/components/papers/paper-cover';
import { IconDisc } from '@/components/ui/icon-disc';
import { schoolSlug } from '@/lib/school-slug';

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

interface MostReadPaper {
  paper_id: string;
  title: string;
  school: string;
  read_count: number;
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
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [groupMode, setGroupMode] = useState<GroupMode>('subject');


  // The old /past-papers route used to render results inline; that's now the
  // dedicated /past-papers/results route (see PaperResults.tsx). SearchControl,
  // Browse's mode-handoff, and a couple of older internal links still commit to
  // /past-papers with filter/q params attached (they're outside this task's
  // edit scope), so this redirect keeps them working instead of silently
  // stranding those params on the landing page.
  const hasFilters = searchParams.toString().length > 0;

  /* Landing-page data. Migrated from useEffect+useState onto react-query:
     QueryClient was configured app-wide in App.tsx but useQuery appeared in no
     file, so every page hand-rolled its own loading/error/cancellation and
     leaned on a separate localStorage TTL cache. The four queries and their
     derivations are unchanged — only who owns the async state changed.

     staleTime is generous: a paper catalogue changes rarely, and remounting
     this route should not refetch four times. */
  const landing = useQuery({
    queryKey: ['past-papers', 'landing'],
    enabled: !hasFilters,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [schoolsRes, recentRes, subjectsRes, countRes] = await Promise.all([
        supabase.from('papers').select('school,board').eq('is_published', true),
        supabase.from('papers').select('id,title,school,subject,class,board,exam_type,year,file_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('papers').select('subject').eq('is_published', true),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
      ]);

      const firstError = schoolsRes.error || recentRes.error || subjectsRes.error || countRes.error;
      if (firstError) throw firstError;

      const bySchool = new Map<string, Map<string, number>>();
      (schoolsRes.data || []).forEach((p) => {
        const boards = bySchool.get(p.school) ?? new Map<string, number>();
        boards.set(p.board, (boards.get(p.board) || 0) + 1);
        bySchool.set(p.school, boards);
      });
      /* Card shows only the dominant board's own count (not the school's total
         across all boards) so "{board} · {count} papers" is never wrong: a
         school with 4 ICSE + 3 CBSE reads "ICSE · 4 papers + 3 more", not a
         misleading "ICSE · 7 papers". */
      const schoolStats: SchoolStat[] = Array.from(bySchool.entries()).map(([school, boards]) => {
        let dominantBoard = '';
        let dominantCount = 0;
        let total = 0;
        boards.forEach((count, board) => {
          total += count;
          if (count > dominantCount) { dominantCount = count; dominantBoard = board; }
        });
        return { school, board: dominantBoard, count: dominantCount, otherBoardCount: total - dominantCount };
      }).sort((a, b) => a.school.localeCompare(b.school));

      const boardCounts: Record<string, number> = {};
      (schoolsRes.data || []).forEach((p) => { boardCounts[p.board] = (boardCounts[p.board] || 0) + 1; });

      const subjectCounts: Record<string, number> = {};
      (subjectsRes.data || []).forEach((p) => { subjectCounts[p.subject] = (subjectCounts[p.subject] || 0) + 1; });

      /* Most read (pages.md §4 section 6). Reads come from paper_read_stats,
         a public aggregate view — individual reads stay behind RLS in
         paper_reads and never leave it. Papers nobody has opened are excluded
         rather than listed at zero, so the panel disappears entirely on a
         library nobody has read yet instead of ranking a column of noughts. */
      const { data: readRows } = await supabase
        .from('paper_read_stats')
        .select('paper_id, title, school, read_count')
        .order('read_count', { ascending: false })
        .limit(3);

      return {
        schoolStats,
        boardCounts,
        subjectCounts,
        recentPapers: (recentRes.data || []) as Paper[],
        totalPapers: countRes.count ?? 0,
        mostRead: ((readRows || []) as MostReadPaper[]).filter((r) => r.read_count > 0),
      };
    },
  });

  /* Weekly goal + new-paper count (pages.md §4 section 1). Both were dropped as
     "per-user data this schema does not have" — paper_reads now provides it.
     Keyed on the user id so one reader's numbers can never be served from
     another's cache entry, and skipped entirely when signed out. */
  const WEEKLY_GOAL = 5;
  const personal = useQuery({
    enabled: Boolean(user),
    queryKey: ['papers', 'personal', user?.id],
    staleTime: 60 * 1000,
    queryFn: async () => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [thisWeek, lastRead] = await Promise.all([
        supabase
          .from('paper_reads')
          .select('id', { count: 'exact', head: true })
          .gte('read_at', weekAgo),
        supabase
          .from('paper_reads')
          .select('read_at')
          .order('read_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      /* "New" means published since you last opened anything. A reader who has
         never opened a paper has no "since", so the clause is dropped rather
         than defaulting to the whole library and calling all of it new. */
      let newCount: number | null = null;
      if (lastRead.data?.read_at) {
        const { count } = await supabase
          .from('papers')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true)
          .gt('created_at', lastRead.data.read_at);
        newCount = count ?? 0;
      }

      return { readThisWeek: thisWeek.count ?? 0, newCount };
    },
  });

  const readThisWeek = personal.data?.readThisWeek ?? 0;
  const newPaperCount = personal.data?.newCount ?? null;

  const schoolStats = landing.data?.schoolStats ?? [];
  const mostRead = landing.data?.mostRead ?? [];
  const recentPapers = landing.data?.recentPapers ?? [];
  const subjectCounts = landing.data?.subjectCounts ?? {};
  const boardCounts = landing.data?.boardCounts ?? {};
  const totalPapers = landing.data?.totalPapers ?? null;
  const loading = !hasFilters && landing.isPending;
  const loadError = landing.isError;

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

  if (hasFilters) {
    return <Navigate to={`/past-papers/results?${searchParams.toString()}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* ------------------------------------------------------------- Hero */}
        {/* D4 "Papers library" hero: saturated indigo band with two soft
            radial blobs, a centered Archivo-900 headline, lede, sign-in CTA,
            and a dashed shelf tray peeking covers out of the band's bottom
            edge. The mockup's headline ("You have 12 new papers waiting on
            your shelf") and the streak/goal-ring pill both depend on
            per-user data this schema does not have (no streak table, no
            per-user new-paper count) — both are now REAL, from paper_reads,
            and render only for a signed-in reader who has opened something.
            The headline still falls back to the total published count for
            everyone else. */}
        <div className="relative overflow-hidden bg-brand-blue px-4 pb-0 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <span aria-hidden className="pointer-events-none absolute -left-10 top-5 h-[180px] w-[180px] rounded-full bg-white/[.06] sm:h-[240px] sm:w-[240px]" />
          <span aria-hidden className="pointer-events-none absolute -right-10 top-16 h-[210px] w-[210px] rounded-full bg-white/[.06] sm:h-[280px] sm:w-[280px]" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Streak pill — GoalRing size 24 beside "N of 5 this week". Only
                for a signed-in reader who has opened something: a ring reading
                0 of 5 is not encouragement, it is a scold on a first visit. */}
            {user && readThisWeek > 0 && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] font-bold text-white">
                <GoalRing value={readThisWeek} goal={WEEKLY_GOAL} size={24} showValue={false} />
                {readThisWeek} of {WEEKLY_GOAL} this week
              </span>
            )}
            <h1 className="font-display text-[34px] font-black leading-[.98] tracking-[-0.03em] text-white sm:text-[52px] lg:text-[74px] lg:leading-[.94]">
              {/* "You have N new papers waiting on your shelf" (pages.md §4.1)
                  when there genuinely are new ones for THIS reader — published
                  since the last paper they opened. Falls back to the library
                  total, then to the generic line, so the headline always states
                  something true rather than reaching for the personal version
                  and finding nothing. */}
              {newPaperCount != null && newPaperCount > 0 ? (
                <>
                  You have {newPaperCount.toLocaleString('en-IN')} new paper
                  {newPaperCount === 1 ? '' : 's'},<br />waiting on your shelf
                </>
              ) : !loading && !loadError && totalPapers != null && totalPapers > 0 ? (
                <>{totalPapers.toLocaleString('en-IN')} past papers,<br />free to read</>
              ) : (
                <>Past papers from{' '}<br />Kolkata schools</>
              )}
            </h1>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.55] text-white/[.82] sm:mt-4 sm:text-[17.5px]">
              {schoolStats.length > 0
                ? `From ${schoolStats.length} school${schoolStats.length === 1 ? '' : 's'} across ICSE, CBSE and ISC, classes 9 to 12. Free to read, with marking schemes where the boards publish them.`
                : 'ICSE, CBSE and ISC, classes 9 to 12. Free to read, with marking schemes where the boards publish them.'}
            </p>
            {!user ? (
              <Link
                to="/auth"
                className={`mt-5 flex h-[54px] min-h-11 w-fit items-center gap-2.5 rounded-full bg-warm-card px-[26px] text-[16px] font-extrabold text-brand-blue-deep transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:hover:translate-y-0 ${FOCUS_BLUE}`}
              >
                <Lock className="h-[18px] w-[18px]" strokeWidth={2.4} aria-hidden="true" />
                Sign in free to read
              </Link>
            ) : (
              <button
                onClick={() => navigate('/past-papers/results')}
                className={`mt-5 flex h-[54px] min-h-11 w-fit items-center gap-2.5 rounded-full bg-warm-card px-[26px] text-[16px] font-extrabold text-brand-blue-deep transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:hover:translate-y-0 ${FOCUS_BLUE}`}
              >
                Browse every paper
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Shelf tray: covers peeking out of the indigo band. Dashed
              border, radius 28px on top only, no bottom border — literal
              per D4. Falls back to nothing (not an empty dashed box) while
              papers are still loading or the catalogue is empty. */}
          {!loading && !loadError && recentPapers.length > 0 && (
            <div className="relative mx-auto mt-10 max-w-[1000px] rounded-t-[28px] border-[1.5px] border-b-0 border-dashed border-white/45 px-4 pt-5 sm:px-[26px] sm:pt-[26px]">
              {/* items-end + overflow-y-visible: the covers stand OUT of the
                  tray's top edge, so a clipping scroller would slice their
                  tops off. ScrollRail hides the native bar and fades the edge
                  instead. */}
              <div className="scrollbar-hide flex items-end justify-center gap-3 overflow-x-auto overflow-y-visible pb-0 sm:gap-[18px] sm:overflow-visible">
                {recentPapers.slice(0, 5).map((p) => (
                  <PaperCover
                    key={p.id}
                    paper={p}
                    href={`/past-papers/${p.id}`}
                    locked={!user}
                    size="desktop"
                    className="!h-[176px] !w-[128px] flex-none sm:!h-[210px] sm:!w-[150px]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------ Board tabs */}
        {/* D4: board tabs with live counts, mirrored on mobile. Real counts
            from boardCounts (already fetched for the By subject/board
            toggle below) — never a placeholder. */}
        {!loading && !loadError && featuredBoards.length > 0 && (
          <section className={`${CONTAINER} flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-3 pt-6`}>
            {featuredBoards.map((b) => (
              <button
                key={b}
                onClick={() => navigate(`/past-papers/results?filter_boards=${encodeURIComponent(b)}`)}
                className={`flex min-h-11 items-center gap-2 whitespace-nowrap font-display text-[17px] font-extrabold tracking-[-0.02em] text-foreground transition-colors duration-tap ease-tap hover:text-brand-blue ${FOCUS_BLUE}`}
              >
                {b}
                <span className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-brand-blue-subtle px-[9px] font-sans text-[12.5px] font-bold text-brand-blue-deep tabular-nums">
                  {boardCounts[b]}
                </span>
              </button>
            ))}
          </section>
        )}

        {/* D4's hero drops the search bar entirely (it's a hand-off frame,
            not a functional prototype). "Design wins, keep functionality" —
            the filtered-search entry point is a real feature this page
            currently exposes, so it stays, just relocated below the hero
            instead of living inside it. */}
        <section className={`${CONTAINER} pt-6`}>
          <SearchControl align="flex-start" stackedToggle initialMode="papers" onModeChange={handleSearchModeChange} />
        </section>

        <div className="bg-gradient-to-b from-brand-blue-subtle to-background pt-8">
          {loading && <ShelfSkeleton />}

          {/* ----------------------------------------------------- Recently added */}
          {/* C-055: papers as objects standing on a shelf ledge, not a row of
              cards — PaperCover (C2) + ShelfLedge (C4). Locked covers (26px
              lock disc) when signed out, per design.md §6.5: browsing is
              open, opening is not. */}
          {!loading && !loadError && recentPapers.length > 0 && (
            <section className={`${CONTAINER} pb-12`}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-section-head font-display font-bold">Recently added</h2>
                {!user && (
                  <Link
                    to="/auth"
                    className={`flex min-h-11 items-center rounded-full bg-brand-blue-subtle px-4 text-body-secondary font-semibold text-brand-blue-deep transition-colors duration-tap ease-tap hover:bg-brand-blue/20 ${FOCUS_BLUE}`}
                  >
                    Sign in to read
                  </Link>
                )}
              </div>
              <ShelfLedge>
                {recentPapers.map((p) => (
                  <PaperCover
                    key={p.id}
                    paper={p}
                    href={`/past-papers/${p.id}`}
                    locked={!user}
                    className="animate-card-reveal motion-reduce:animate-none"
                  />
                ))}
              </ShelfLedge>
            </section>
          )}

          {/* ------------------------------------------------------- Error state */}
          {loadError && (
            <section className={`${CONTAINER} pb-12`}>
              <EmptyResults
                tone="papers"
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
                {/* Indigo, not the orange brand token — papers mode carries no
                    orange (devices.md §5 sticker, tone=papers). */}
                <span className="sticker sticker-rotate-md animate-pop absolute -top-3 right-6 rounded-full bg-brand-blue px-4 py-1 text-label font-bold uppercase text-white motion-reduce:animate-none">
                  Day one
                </span>
                <EmptyResults
                  tone="papers"
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

        {/* -------------------------------------------------------- Most read */}
        {/* pages.md §4 section 6: bg-muted rounded-3xl p-4, hairline rows, rank
            numeral in display type. Rendered only when something has actually
            been read — a "Most read" list of unread papers is not a ranking,
            it is three arbitrary rows. */}
        {mostRead.length > 0 && (
          <section className={`${CONTAINER} pb-[24px]`}>
            <h2 className="mb-3 font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
              Most read
            </h2>
            <div className="rounded-3xl bg-muted p-4">
              <ol className="divide-y divide-border/70">
                {mostRead.map((paper, i) => (
                  <li key={paper.paper_id}>
                    <a
                      href={`/past-papers/${paper.paper_id}`}
                      className={`flex min-h-11 items-center gap-3 py-3 transition-opacity duration-150 hover:opacity-80 ${FOCUS_BLUE}`}
                    >
                      <span className="w-6 flex-none font-display text-[22px] font-black leading-none text-warm-label">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-bold text-foreground">{paper.title}</span>
                        <span className="block truncate text-meta text-warm-meta">{paper.school}</span>
                      </span>
                      <span className="flex-none text-meta tabular-nums text-warm-meta">
                        {/* "opened", not "read" — what is recorded is that
                            someone opened the paper. Nothing observes whether
                            they finished it, and the heading can say Most read
                            without the row claiming more than happened. */}
                        {paper.read_count} opened
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* --------------------------------------------------------- By school */}
        {/* S4/D4: a flat list of school rows on the page ground — each row is
            an initial disc + name + count + chevron, `shadow-border` only
            (no border+shadow stack, tokens.md §6). The previous build wrapped
            this in a full bg-brand-blue rounded-4xl slab, which the mockup
            does not do — that big a saturated surface here read as a second
            "By class & board" slab competing with the one below it. */}
        {!loading && !loadError && schoolStats.length > 0 && (
          <section className={`${CONTAINER} pb-8`}>
            {/* S4 literals: h2 21px/800 ls -0.03em, mb 12px. Rows gap 8px
                (D4: 2-col, gap 10px), padding 12px 14px, radius 16px, disc
                38×38 radius 12px, gap 12px, name 14.5px/700, count 12px. */}
            <h2 className="mb-3 font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground">By school</h2>
            <div className="stagger-children grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-[10px]">
              {schoolStats.map(({ school, board, count, otherBoardCount }) => (
                /* A real link to the school's own page (S16), not a button that
                   pre-filters the results list. These rows were the "by-school
                   rows that go nowhere" a-to-z.md describes: a <button> has no
                   href, so a school could not be opened in a new tab, shared,
                   or reached by a crawler. */
                <Link
                  key={school}
                  to={`/school/${schoolSlug(school)}`}
                  className={`flex min-h-11 animate-card-reveal items-center gap-3 rounded-2xl bg-card px-[14px] py-3 text-left shadow-border transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 lg:px-[15px] lg:py-[13px] ${FOCUS_BLUE}`}
                >
                  <IconDisc
                    tone="papers-subtle"
                    size={40}
                    shape="square"
                    className="h-[38px] w-[38px] rounded-xl font-display text-[15px] font-extrabold"
                  >
                    {school.charAt(0).toUpperCase()}
                  </IconDisc>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-bold text-foreground">{school}</span>
                    <span className="mt-px block text-[12px] tabular-nums text-muted-foreground">
                      {board} · {count} paper{count === 1 ? '' : 's'}
                      {otherBoardCount > 0 ? ` + ${otherBoardCount} more` : ''}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 flex-none text-warm-quaternary" aria-hidden="true" />
                </Link>
              ))}
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
        {/* S4/D4: plain wrapped pills directly on the page ground, no colored
            slab. Previously wrapped in a `bg-brand` (orange) rounded-4xl slab
            — a hard violation on this page: papers mode is indigo-only,
            orange must never appear here (tokens.md §2). Removed the slab
            entirely to match the mockup rather than merely recolor it. */}
        {!loadError && (
          <section className={`${CONTAINER} pb-8`}>
            <h2 className="mb-3 font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground">By class &amp; board</h2>

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
                <p className="mb-3 text-label font-bold uppercase text-muted-foreground">Class</p>
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
                <p className="mb-3 text-label font-bold uppercase text-muted-foreground">Board</p>
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
          </section>
        )}

        {/* ------------------------------------------------------------ 3 steps */}
        <section className={`${CONTAINER} ${SECTION} pt-0`}>
          <h2 className="mb-8 text-center text-section-head font-display font-bold">
            Three steps, no cost,{' '}<br />no catch.
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

        {/* ------------------------------------------- B3 explainer slab */}
        {/* S4 "How the paper library works": indigo-subtle slab, radius 26px,
            padding 20px 18px; eyebrow 11px/700 uppercase ls .08em; heading
            22px/900 lh 1.15 ls -0.035em; points gap 10px with 26×26 radius-9px
            indigo icon tiles; two 44px radius-12px buttons, gap 8px, mt 16px.
            This REPLACES the old three-card "Promises" grid rather than being
            added alongside it — same three promise items, same copy, rehoused
            in the mockup's device so the content isn't duplicated. */}
        <section className={`${CONTAINER} pb-8`}>
          <div className="rounded-[26px] bg-brand-blue-subtle px-[18px] py-5">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[.08em] text-brand-blue">
              How the paper library works
            </p>
            <p className="mb-[14px] font-display text-[22px] font-black leading-[1.15] tracking-[-0.035em] text-brand-blue-deep">
              Real school papers, shared by students, free to read.
            </p>
            <div className="flex flex-col gap-[10px]">
              {PAPER_PROMISES.map((pp) => (
                <div key={pp.title} className="flex items-start gap-[10px]">
                  <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[9px] bg-brand-blue">
                    <pp.icon size={14} className="text-white" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <p className="text-[13.5px] leading-[1.55] text-brand-blue-deep">
                    <span className="font-bold">{pp.title}.</span> {pp.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate('/past-papers/results')}
                className={`flex h-11 flex-1 items-center justify-center rounded-xl bg-brand-blue text-[14px] font-bold text-white transition-transform duration-hover ease-settle active:scale-[0.97] ${FOCUS_BLUE}`}
              >
                Browse papers
              </button>
              <a
                href={requestPaperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-11 flex-1 items-center justify-center rounded-xl bg-card text-[14px] font-bold text-brand-blue-deep transition-transform duration-hover ease-settle active:scale-[0.97] ${FOCUS_BLUE}`}
              >
                Share a paper
              </a>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- Ownership */}
        <section className={`${CONTAINER} pb-16`}>
          {/* S4 literals: radius 24px, padding 18px, h2 19px/800 mb 6px,
              on the near-black panel token,
              body 13.5px lh 1.6 at white/72. D4 turns it into a 1fr/1.4fr
              two-column band with 28px radius and 28px/32px padding. */}
          <div className="rounded-3xl bg-panel p-[18px] lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-10 lg:rounded-[28px] lg:px-8 lg:py-7">
            <h2 className="mb-1.5 font-display text-[19px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white lg:mb-0 lg:text-[26px]">
              Who owns these papers
            </h2>
            <div className="space-y-3">
              <p className="text-[13.5px] leading-[1.6] text-white/[.72] lg:text-[15px] lg:leading-[1.65]">
                Every paper here is the property of the school that set it. Shikshaq claims no ownership over any paper, derives no revenue from any paper, and hosts these materials solely as a free community resource for students.
              </p>
              <p className="text-[13.5px] leading-[1.6] text-white/[.72] lg:text-[15px] lg:leading-[1.65]">
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
