import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, Languages, Calculator, Brain, Landmark as LandmarkIcon, Dna, Monitor, Wallet, FileText, Search, ShieldCheck } from 'lucide-react';
import { SearchControl } from '@/components/SearchControl';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, CLASSES, BOARDS } from '@/utils/searchFacets';
import { getSubjectPalette } from '@/lib/subject-palette';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { useAuth } from '@/lib/auth-context';
import { GoalRing } from '@/components/papers/goal-ring';
import { PaperCover, ShelfLedge } from '@/components/papers/paper-cover';
import { IconDisc } from '@/components/ui/icon-disc';
import { PullToRefresh } from '@/components/devices/PullToRefresh';
import { schoolSlug } from '@/lib/school-slug';
import { generateCollectionPageSchema, injectSchemas } from '@/utils/structuredDataGenerators';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';
import { BROWSE_PATH } from '@/lib/nav-config';

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
// One vertical rhythm for the whole stack below the hero: every section
// contributes its own bottom gap only (no per-section top padding fighting
// the previous section's bottom padding), so the page reads as one
// consistent beat instead of ad-hoc pb-8/pb-12/pb-[24px] values that used
// to drift section to section. Sub-element gap (heading -> its content) is
// exactly half of this, mb-3 (12px) against pb-10/14 (40/56px).
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
    // 58 chars. Was 74, so ~14 characters were truncated out of the SERP.
    'Free Past Year Question Papers - CBSE, ICSE, ISC | Shikshaq',
    'Download free past year question papers and previous year solved papers for CBSE, ICSE, ISC and West Bengal State Board exams. Practice PYQs by subject and class.'
  );

  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [groupMode, setGroupMode] = useState<GroupMode>('subject');

  // Handoff PP-014: this route renders its own eyes panel (papers mode),
  // replacing AppShell's B3 pre-footer.
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();
  useEffect(() => { setBuilderMode('papers'); }, [setBuilderMode]);


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
      const [schoolsRes, recentRes, subjectsRes, countRes, readRes] = await Promise.all([
        supabase.from('papers').select('school,board').eq('is_published', true),
        supabase.from('papers').select('id,title,school,subject,class,board,exam_type,year,file_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('papers').select('subject').eq('is_published', true),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        /* Most-read joins the batch. It shares no input with the four above
           and nothing derives from it, so awaiting it afterwards was a free
           serial round trip before the shelf could render. */
        supabase.from('paper_read_stats').select('paper_id, title, school, read_count')
          .order('read_count', { ascending: false }).limit(3),
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
      const readRows = readRes.data;

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

  // No structured data existed on this page at all — it's the index of every
  // past paper on the site, the same kind of listing page Browse/Subject/Board
  // pages already emit a CollectionPage schema for. Only fires once a real
  // count has resolved, matching the loading/empty guards above.
  useEffect(() => {
    if (loading || totalPapers == null || totalPapers === 0) return;
    injectSchemas([
      generateCollectionPageSchema({
        url: 'https://www.shikshaq.in/past-papers',
        name: 'Free past year question papers',
        description: `${totalPapers.toLocaleString('en-IN')} free past year question papers for CBSE, ICSE, ISC and West Bengal State Board exams.`,
        about: 'Past year question papers',
        numberOfItems: totalPapers,
      }),
    ]);
    return () => {
      const existing = document.getElementById('page-schemas');
      if (existing) existing.remove();
    };
  }, [loading, totalPapers]);

  const requestPaperUrl = `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(
    "Hi! I'm looking for a past paper on Shikshaq, could you add it?"
  )}`;

  if (hasFilters) {
    return <Navigate to={`/past-papers/results?${searchParams.toString()}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
      <PullToRefresh onRefresh={() => landing.refetch()} disabled={hasFilters}>
      <BentoStack>
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
            everyone else.
            Handoff PP-002: BentoPanel fill="papers" edge="top" — square-topped,
            30px bottom corners. No separate in-panel logo/menu row added: per
            Home (H-002) and Browse (B-003b), the floating Navbar pill already
            carries that, and this route doesn't duplicate it either. */}
        <BentoPanel fill="papers" edge="top" className="relative overflow-hidden px-4 pt-[14px] pb-0 sm:px-6 lg:px-8">
          <span aria-hidden className="pointer-events-none absolute -left-10 top-5 h-[180px] w-[180px] rounded-full bg-white/[.06] sm:h-[240px] sm:w-[240px]" />
          <span aria-hidden className="pointer-events-none absolute -right-10 top-16 h-[210px] w-[210px] rounded-full bg-white/[.06] sm:h-[280px] sm:w-[280px]" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Streak pill — GoalRing size 24 beside "N of 5 this week". Only
                for a signed-in reader who has opened something: a ring reading
                0 of 5 is not encouragement, it is a scold on a first visit. */}
            {user && readThisWeek > 0 && (
              <span className="mb-4 inline-flex h-[30px] items-center gap-2 whitespace-nowrap rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] font-bold text-white">
                <GoalRing value={readThisWeek} goal={WEEKLY_GOAL} size={24} showValue={false} />
                {readThisWeek} of {WEEKLY_GOAL} this week
              </span>
            )}
            <h1 className="font-display text-[34px] font-normal leading-[.98] tracking-[-0.03em] text-white sm:text-[52px] lg:text-[74px] lg:leading-[.94]">
              {/* "You have N new papers waiting on your shelf" (pages.md §4.1)
                  when there genuinely are new ones for THIS reader — published
                  since the last paper they opened. Falls back to the library
                  total, then to the generic line, so the headline always states
                  something true rather than reaching for the personal version
                  and finding nothing. */}
              {newPaperCount != null && newPaperCount > 0 ? (
                <>
                  You have {newPaperCount.toLocaleString('en-IN')} new paper
                  {newPaperCount === 1 ? '' : 's'},<br /><span className="font-black">waiting on your shelf</span>
                </>
              ) : !loading && !loadError && totalPapers != null && totalPapers > 0 ? (
                <>{totalPapers.toLocaleString('en-IN')} past papers,<br /><span className="font-black">free to read</span></>
              ) : (
                <>Past papers from{' '}<br /><span className="font-black">Kolkata schools</span></>
              )}
            </h1>
            {/* Was a school-count + "classes 9 to 12" range ("From 6 schools
                across ICSE, CBSE and ISC, classes 9 to 12...") — owner mobile
                QA: a number range under the H1 read as a stray stat, not a
                sentence. Rewritten as plain descriptive copy with no invented
                or fragile-looking numbers, matching the tone of the B3
                pre-footer's "Real school papers, shared by students, free to
                read." headline just below on this same page. */}
            <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.55] text-white/[.82] sm:mt-4 sm:text-[17.5px]">
              Past papers from Kolkata schools, shared by students. Free to read, with marking schemes where the boards publish them.
            </p>
            {/* Owner mobile QA: "Sign in free to read" here was a second,
                premature sign-in CTA above the fold — the gate a reader
                actually hits is the lock disc on a locked cover (below) or
                the PaperGate sheet it opens, both of which already name the
                paper and ask to sign in. A signed-out visitor gets no
                competing button here; a signed-in one still gets a real
                shortcut into the full list. */}
            {user && (
              <button
                onClick={() => navigate('/past-papers/results')}
                className={`mt-5 flex h-[54px] min-h-11 w-fit items-center gap-2.5 rounded-full bg-warm-card pl-[26px] pr-6 text-[16px] font-extrabold text-brand-blue-deep transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:hover:translate-y-0 ${FOCUS_BLUE}`}
              >
                Browse every paper
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Shelf tray: covers peeking out of the indigo band. Dashed
              border, radius 28px on top only, no bottom border — literal
              per D4. Falls back to nothing (not an empty dashed box) while
              papers are still loading or the catalogue is empty.
              Handoff PP-005: full-bleed inside the panel on mobile (-mx-4
              px-4), mx-auto max-w-[1000px] kept from sm: up. */}
          {!loading && !loadError && recentPapers.length > 0 && (
            <div className="relative -mx-4 mt-[26px] rounded-t-[28px] border-[1.5px] border-b-0 border-dashed border-white/45 px-4 pt-[18px] sm:mx-auto sm:max-w-[1000px] sm:px-[26px] sm:pt-[26px]">
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
        </BentoPanel>

        {/* ------------------------------------------------------ Board tabs */}
        {/* D4: board tabs with live counts, mirrored on mobile. Real counts
            from boardCounts (already fetched for the By subject/board
            toggle below) — never a placeholder.
            Handoff PP-006: BentoPanel, single horizontal scroller, no border-b. */}
        {!loading && !loadError && featuredBoards.length > 0 && (
          <BentoPanel fill="card" className="!px-0 py-4 pl-4">
            <div className="flex gap-[18px] overflow-x-auto pr-4 scrollbar-hide">
              {featuredBoards.map((b) => (
                <button
                  key={b}
                  onClick={() => navigate(`/past-papers/results?filter_boards=${encodeURIComponent(b)}`)}
                  className={`flex min-h-11 flex-none items-center gap-2 whitespace-nowrap font-display text-[17px] font-extrabold tracking-[-0.02em] text-foreground transition-colors duration-tap ease-tap hover:text-brand-blue ${FOCUS_BLUE}`}
                >
                  {b}
                  <span className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-brand-blue-subtle px-[9px] font-sans text-[12.5px] font-bold text-brand-blue-deep tabular-nums">
                    {boardCounts[b]}
                  </span>
                </button>
              ))}
            </div>
          </BentoPanel>
        )}

        {/* D4's hero drops the search bar entirely (it's a hand-off frame,
            not a functional prototype). "Design wins, keep functionality" —
            the filtered-search entry point is a real feature this page
            currently exposes, so it stays, just relocated below the hero
            instead of living inside it.
            Handoff PP-007: BentoPanel wrap, H-009 field metrics via heroDesk
            (submit disc is bg-brand-blue automatically — SearchControl's
            accent already switches on mode, and this control's mode is papers). */}
        <BentoPanel fill="card">
          <SearchControl align="flex-start" stackedToggle heroDesk initialMode="papers" onModeChange={handleSearchModeChange} />
        </BentoPanel>

        {loading && <ShelfSkeleton />}

        {/* ----------------------------------------------------- Recently added */}
        {/* C-055: papers as objects standing on a shelf ledge, not a row of
            cards — PaperCover (C2) + ShelfLedge (C4). Locked covers (26px
            lock disc) when signed out, per design.md §6.5: browsing is
            open, opening is not.
            Handoff PP-008: BentoPanel, heading+rail get px-[22px]. */}
        {!loading && !loadError && recentPapers.length > 0 && (
          <BentoPanel fill="card" className="!px-0 !py-[22px]">
            {/* The "Sign in to read" pill that used to sit beside this
                heading was a second extraneous sign-in CTA (owner mobile
                QA) — the actual gate lives on each locked cover's 28px
                lock disc below, which already opens PaperGate naming the
                paper. Nothing else needs to ask twice. */}
            <h2 className="mb-3 px-[22px] text-section-head font-display font-bold">Recently added</h2>
            <div className="px-[22px]">
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
            </div>
          </BentoPanel>
        )}

        {/* ------------------------------------------------------- Error state */}
        {loadError && (
          <BentoPanel fill="card">
            <EmptyResults
              tone="papers"
              heading="Unable to load the paper collection right now"
              message="This is on us, not on your connection necessarily. Refresh and it usually comes straight back."
              action={{ label: 'Refresh', onClick: () => window.location.reload() }}
            />
          </BentoPanel>
        )}

        {/* --------------------------------------------- Global-zero empty state */}
        {/* LOUD moment (VISUAL_DIRECTION §4): nothing is being compared here,
            so the collage grammar is fully permitted — thick outline, offset
            shadow, halftone grain, a rotated sticker. This is the single
            highest-leverage screen on the papers surface: it is where a
            first visitor to a sparse catalogue currently dead-ends. */}
        {isEmptyCatalogue && (
          <BentoPanel fill="papersTint" className="halftone-overlay relative">
            {/* Indigo, not the orange brand token — papers mode carries no
                orange (devices.md §5 sticker, tone=papers). */}
            {/* D-007: flatten at lg. `.sticker-rotate-md` (index.css) is a plain
                CSS class outside Tailwind's cascade order, so a `lg:rotate-0`
                utility can't reliably out-specificity/out-order it — swapped
                for the equivalent Tailwind rotate utilities (same 5deg tilt)
                so the `lg:` variant actually wins at the breakpoint. */}
            <span className="sticker rotate-[5deg] lg:rotate-0 animate-card-reveal absolute -top-3 right-6 rounded-full bg-brand-blue px-4 py-1 text-label font-bold uppercase text-white motion-reduce:animate-none">
              Day one
            </span>
            <EmptyResults
              tone="papers"
              className="bg-transparent shadow-none"
              icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
              heading="The collection is just getting started"
              message="We're still gathering papers from Kolkata schools, nothing's uploaded yet. Tell us which paper you need and we'll chase it down, or find a teacher who can help in the meantime."
              options={[{ label: 'Browse teachers instead', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }]}
              action={{
                label: 'Request a paper',
                onClick: () => window.open(requestPaperUrl, '_blank', 'noopener,noreferrer'),
              }}
            />
          </BentoPanel>
        )}

        {/* -------------------------------------------------------- Most read */}
        {/* pages.md §4 section 6: bg-muted rounded-3xl p-4, hairline rows, rank
            numeral in display type. Rendered only when something has actually
            been read — a "Most read" list of unread papers is not a ranking,
            it is three arbitrary rows.
            Handoff PP-009: BentoPanel fill="muted", radius 24 -> 30, hairline
            expressed as an inset shadow instead of divide-y. */}
        {mostRead.length > 0 && (
          <BentoPanel fill="muted" className="!p-[18px]">
            <h2 className="mb-3 font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground lg:text-[26px]">
              Most read
            </h2>
            {/* D-005: one-column stack becomes a 2-up grid at lg (spec: "Papers
                by-school / most-read -> grid-cols-2"), mirroring the By-school
                grid below. Row divider (inset shadow on all but the last item)
                is unchanged — with at most 3 rows in mostRead this reads as a
                clean 2+1 grid, not a broken divider. */}
            <ol className="stagger-children grid grid-cols-1 lg:grid-cols-2 lg:gap-x-6">
              {mostRead.map((paper, i) => (
                <li
                  key={paper.paper_id}
                  className={`animate-card-reveal motion-reduce:animate-none ${i < mostRead.length - 1 ? 'shadow-[inset_0_-1px_0_rgba(231,223,213,.9)]' : ''}`}
                >
                  <a
                    href={`/past-papers/${paper.paper_id}`}
                    className={`flex min-h-11 items-center gap-3 py-3 transition-opacity duration-tap hover:opacity-80 ${FOCUS_BLUE}`}
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
          </BentoPanel>
        )}

        {/* --------------------------------------------------------- By school */}
        {/* S4/D4: a flat list of school rows — each row is an initial disc +
            name + count + chevron.
            Handoff PP-010: wrapped in a BentoPanel; rows bg-card -> bg-muted,
            shadow-border removed (bone on bone). */}
        {!loading && !loadError && schoolStats.length > 0 && (
          <BentoPanel fill="card">
            <h2 className="mb-3 font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground lg:text-[26px]">By school</h2>
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
                  className={`flex min-h-11 animate-card-reveal items-center gap-3 rounded-2xl bg-muted px-[14px] py-3 text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 lg:px-[15px] lg:py-[13px] ${FOCUS_BLUE}`}
                >
                  {/* pages.md §4 row 7: "school initial tile 40px solid" — this
                      was tone="papers-subtle", the same pale indigo-on-pale
                      background the By-subject tiles use for their whole card
                      ground, not their icon tile. On a small 38px square that
                      washed-out pairing read as flat and low-contrast (owner
                      mobile QA: "really horribly designed"). Solid matches
                      the spec literally and the same tone already used for
                      the By-board tiles a few sections down. */}
                  <IconDisc
                    tone="papers"
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
          </BentoPanel>
        )}

        {/* -------------------------------------------------------- By subject / board */}
        {/* Handoff PP-011: BentoPanel wrap; toggle track drops shadow-border
            on the active segment; subject rows become horizontal signposts
            at base (a tile grid returns from sm:). */}
        {!loading && !loadError && (featuredSubjects.length > 0 || featuredBoards.length > 0) && (
          <BentoPanel fill="card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-section-head font-display font-bold">
                By {groupMode === 'subject' ? 'subject' : 'board'}
              </h2>
              {/* Segmented toggle mapped to the two real groupings this page
                  already fetches — subjectCounts and boardCounts. */}
              <div role="tablist" aria-label="Group papers by" className="inline-flex h-11 items-center rounded-full bg-muted p-1">
                {(['subject', 'board'] as GroupMode[]).map((mode) => (
                  <button
                    key={mode}
                    role="tab"
                    aria-selected={groupMode === mode}
                    onClick={() => setGroupMode(mode)}
                    className={`flex h-9 items-center rounded-full px-[14px] text-[13.5px] font-bold capitalize transition-colors duration-tap ease-tap ${FOCUS} ${
                      groupMode === mode ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'
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
            {/* Handoff PP-011: base rows are horizontal signposts —
                rounded-[18px] p-[14px], a 30x30 r10 solid icon tile, name
                19px/800/-0.03em, count right-aligned 12.5px/600. The existing
                stacked tile (sm:block, 40x40 icon, badge-pill count) returns
                unchanged from sm:. */}
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
                      className={`flex min-h-11 animate-card-reveal items-center gap-4 rounded-[18px] p-[14px] text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:block sm:rounded-2xl sm:p-6 ${FOCUS_BLUE}`}
                      style={{ backgroundColor: palette.tint }}
                    >
                      <span
                        className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[10px] sm:h-10 sm:w-10 sm:rounded-lg sm:mb-6"
                        style={{ backgroundColor: palette.solid }}
                      >
                        <Icon size={21} strokeWidth={1.9} aria-hidden="true" style={{ color: palette.badgeText }} />
                      </span>
                      <span className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:block">
                        <span
                          className="block break-words text-[19px] font-extrabold tracking-[-0.03em] sm:text-card-title-lg sm:font-bold sm:tracking-normal"
                          style={{ color: palette.text }}
                        >
                          {s}
                        </span>
                        {/* Live count from the existing subjectCounts state —
                            never a literal zero, since featuredSubjects already
                            filters those out (DESIGN_SYSTEM §13). Base:
                            plain right-aligned text; sm+: the badge pill. */}
                        <span className="flex-none text-[12.5px] font-semibold tabular-nums sm:hidden" style={{ color: palette.meta }}>
                          {count} paper{count === 1 ? '' : 's'}
                        </span>
                        <span
                          className="mt-2 hidden items-center rounded-full px-3 py-1 text-label font-bold uppercase tabular-nums sm:inline-flex"
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
                      className={`flex min-h-11 animate-card-reveal items-center gap-4 rounded-[18px] bg-brand-blue-subtle p-[14px] text-left transition-transform duration-hover ease-settle hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:animate-none motion-reduce:hover:translate-y-0 sm:block sm:rounded-2xl sm:p-6 ${FOCUS_BLUE}`}
                    >
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[10px] bg-brand-blue sm:h-10 sm:w-10 sm:rounded-lg sm:mb-6">
                        <LandmarkIcon size={21} className="text-white" strokeWidth={1.9} aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:block">
                        <span className="block break-words text-[19px] font-extrabold tracking-[-0.03em] text-brand-blue-deep sm:text-card-title-lg sm:font-bold sm:tracking-normal">{b}</span>
                        <span className="flex-none text-[12.5px] font-semibold tabular-nums text-brand-blue-deep sm:hidden">
                          {count} paper{count === 1 ? '' : 's'}
                        </span>
                        <span className="mt-2 hidden items-center rounded-full bg-brand-blue px-3 py-1 text-label font-bold uppercase tabular-nums text-white sm:inline-flex">
                          {count} paper{count === 1 ? '' : 's'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </BentoPanel>
        )}

        {/* --------------------------------------------------------- By class */}
        {/* S4/D4: plain wrapped pills directly on the page ground, no colored
            slab. Previously wrapped in a `bg-brand` (orange) rounded-4xl slab
            — a hard violation on this page: papers mode is indigo-only,
            orange must never appear here (tokens.md §2). Removed the slab
            entirely to match the mockup rather than merely recolor it. */}
        {/* Handoff PP-012: BentoPanel wrap; chips h-12 rounded-2xl
            bg-brand-blue-subtle, grid-cols-4 at base (was a flex-wrap flat
            pill wall). */}
        {!loadError && (
          <BentoPanel fill="card">
            {/* Was "By class & board" with a Board pill row underneath Class —
                Board tabs already run WBBSE/CBSE/ICSE/ISC counts near the top
                of this page (pages.md §4 row 3), so this second Board facet
                a few sections down duplicated the same filter with a second,
                inconsistent style (owner mobile QA: "keep class there, remove
                board from there"). Board stays as its own tabs section; this
                row now carries Class only. */}
            <h2 className="mb-3 font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground lg:text-[26px]">By class</h2>

            {/* Classes are 9-12 only: those are the classes the handoff draws,
                and the ones papers actually exist for. */}
            <div className="grid grid-cols-4 gap-2">
              {PAPER_CLASSES.filter((c) => ['9', '10', '11', '12'].includes(c)).map((c) => (
                <button
                  key={`class-${c}`}
                  type="button"
                  onClick={() => navigate(`/past-papers/results?filter_classes=${encodeURIComponent(c)}`)}
                  className="flex h-12 items-center justify-center rounded-2xl bg-brand-blue-subtle text-[16px] font-extrabold tabular-nums text-brand-blue-deep transition-colors duration-tap hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Class {c}
                </button>
              ))}
            </div>
          </BentoPanel>
        )}

        {/* ------------------------------------------------------------ 3 steps */}
        <BentoPanel fill="card">
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
                <p className="max-w-prose text-body-secondary text-muted-foreground lg:text-[16px] lg:leading-[1.65]">{step.body}</p>
              </div>
            ))}
          </div>
        </BentoPanel>

        {/* NOTE: no inline "How the paper library works" slab here — this route
            (anything starting with /past-papers) already gets that exact
            explainer from AppShell's global PreFooter, variant B3
            (see preFooterFor() in PreFooter.tsx). A near-duplicate hand-built
            copy of it used to live here too, so the block rendered twice in a
            row on every load of this page, with two different sets of CTAs.
            Removed rather than kept in sync — B3 is the single source per
            pages.md's "pre-footer block, decided in AppShell, never in the
            page" rule. */}

        {/* ----------------------------------------------------------- Ownership */}
        {/* Handoff PP-013: BentoPanel fill="dark", radius 24/28 -> 30. This
            is also the page's teacher cross-sell — the CTA below is new,
            the page's one orange element (label matches Home's H-011 fork
            tile, "Find a teacher" — the entry names the treatment but not
            exact copy, so this reuses the site's existing wording for the
            identical action rather than inventing new copy). */}
        <BentoPanel fill="dark" className="lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-10 lg:px-8 lg:py-7">
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
            <Link
              to={BROWSE_PATH}
              className="inline-flex h-12 items-center rounded-full bg-brand px-5 text-[14.5px] font-bold text-brand-foreground transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
            >
              Find a teacher
            </Link>
          </div>
        </BentoPanel>

        {/* Handoff PP-014: shared tail, identical to Home — the sentence-
            builder mode is pinned to 'papers' above (useEffect), so the
            dome renders indigo on load here. */}
        <EyesPanel
          mode={builderMode}
          onModeChange={setBuilderMode}
          heading={(
            <>
              Need a paper? <span className="font-extrabold">We keep an eye out.</span>
            </>
          )}
          subline="Fill in the blanks and we'll take you straight there."
          slots={builderSlots}
          onSlotChange={handleSlotChange}
          onSubmit={handleBuilderSubmit}
        />
      </BentoStack>
      </PullToRefresh>
      </main>
    </div>
  );
}
