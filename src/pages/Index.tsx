import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  IndianRupee,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { EmptyResults } from '@/components/EmptyResults';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeGreeting } from '@/components/HomeGreeting';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { SearchDesk } from '@/components/home/SearchDesk';
import { PageContainer, ControlBlock, Slab } from '@/components/layout/PageContainer';
import { ProductTour, useProductTour } from '@/components/ProductTour';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Sticker } from '@/components/ui/sticker';
import { IconDisc } from '@/components/ui/icon-disc';
import { PaperCover } from '@/components/papers/paper-cover';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { useRequireRole } from '@/hooks/use-require-role';
import { clearExpiredCache } from '@/utils/cache';
import { getShikshaqmineBasicBySlugs } from '@/lib/teachers';
import { generateLocalBusinessSchema, generateServiceSchema } from '@/utils/structuredDataGenerators';
import type { SearchMode } from '@/utils/searchFacets';

interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_verified?: boolean | null;
  subjects: { name: string; slug: string } | null;
  featuredSubjectLabel?: string | null;
  whatsappLink?: string | null;
  experienceYears?: number | null;
  minFees?: number | null;
  maxFees?: number | null;
  area?: string | null;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  teacherCount: number;
  paperCount: number;
}

interface RecentPaper {
  id: string;
  title: string;
  school: string;
  subject: string;
  board: string;
  class: string;
  year: number;
}

interface StudentQuote {
  id: string;
  comment: string;
  authorName: string;
  authorMeta: string;
}

const BOARD_ORDER = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'] as const;
const BOARD_FILLS: Record<string, string> = {
  ICSE: 'bg-brand text-brand-foreground',
  CBSE: 'bg-brand-blue-subtle text-brand-blue-deep',
  IGCSE: 'bg-panel text-background',
  IB: 'bg-muted text-foreground',
  State: 'bg-warm-band text-foreground',
};
/* Tilt is a mobile-only flourish — the project owner flagged it as "too
   crooked" on desktop, so each entry carries its own tilt below `lg` and
   snaps flat at `lg` and up. Literal classes (not built from a template
   string) so Tailwind's content scanner can see them. */
const BOARD_TILT_CLASSES = [
  'rotate-[-1deg] lg:rotate-0',
  'rotate-[0.8deg] lg:rotate-0',
  'rotate-[-0.6deg] lg:rotate-0',
  'rotate-[1deg] lg:rotate-0',
  'rotate-[-0.5deg] lg:rotate-0',
];

// "9-12" / "9,10,11,12" / "Class 9 to 12" -> [9,10,11,12]. Real teacher data,
// tokenized the same way the subjects tile counts already are (Index.tsx's
// prior `subjects_text` pattern) rather than invented — design.md §0.10.
function parseClassNumbers(raw: string | null | undefined): number[] {
  if (!raw) return [];
  const out = new Set<number>();
  const rangeRe = /(\d{1,2})\s*(?:-|to|–)\s*(\d{1,2})/gi;
  let stripped = raw;
  let m: RegExpExecArray | null;
  while ((m = rangeRe.exec(raw)) !== null) {
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    if (a && b && a <= b && b - a < 12) {
      for (let n = a; n <= b; n++) out.add(n);
    }
    stripped = stripped.replace(m[0], ' ');
  }
  (stripped.match(/\d{1,2}/g) || []).forEach((n) => out.add(parseInt(n, 10)));
  return Array.from(out);
}

export default function Index() {
  const { open: tourOpen, setOpen: setTourOpen } = useProductTour();

  const navigate = useNavigate();

  useRequireRole();

  // Homepage-specific JSON-LD structured data
  useEffect(() => {
    const localBusinessScript = document.createElement('script');
    localBusinessScript.type = 'application/ld+json';
    localBusinessScript.id = 'homepage-localbusiness-schema';
    localBusinessScript.textContent = JSON.stringify(generateLocalBusinessSchema());

    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.id = 'homepage-service-schema';
    serviceScript.textContent = JSON.stringify(
      generateServiceSchema({
        id: 'https://www.shikshaq.in/#service',
        name: 'Free Tutor-Student Connection Service',
        description:
          'Connect with verified tutors for personalized tuition in your locality. Free platform for both students and educators.',
        serviceType: 'Educational Tutoring Service',
        areaServed: 'Kolkata',
        availableChannel: {
          serviceUrl: 'https://www.shikshaq.in/all-tuition-teachers-in-kolkata',
          servicePhone: '+91-8240980312',
        },
        offers: [
          { '@type': 'Offer', name: 'Subject-Based Tutor Search', description: 'Find tutors for Mathematics, Physics, Chemistry, Biology, English, and more', price: '0', priceCurrency: 'INR' },
          { '@type': 'Offer', name: 'Online Tuition', description: 'Connect with tutors offering online classes', price: '0', priceCurrency: 'INR' },
          { '@type': 'Offer', name: 'Offline/Home Tuition', description: 'Find tutors offering offline/home tuition in your area', price: '0', priceCurrency: 'INR' },
        ],
      })
    );

    document.head.appendChild(localBusinessScript);
    document.head.appendChild(serviceScript);
    return () => {
      document.getElementById('homepage-localbusiness-schema')?.remove();
      document.getElementById('homepage-service-schema')?.remove();
    };
  }, []);

  /* Home data on react-query. Was a ~180-line useEffect owning its own loading
     and error flags on top of a separate localStorage cache. The queries and
     every derivation are unchanged.

     One real improvement falls out of the move: the featured grid fills any
     remainder with Math.random(), so under the old effect it reshuffled on
     every mount. Inside a queryFn it is computed once per cache entry and
     stays put while the entry is fresh. */
  const home = useQuery({
    queryKey: ['home', 'landing'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      let featured: Teacher[] = [];
      let subjectList: Subject[] = [];
      /* The localStorage warm-start that used to live here is gone: react-query
         now owns caching for this data, and keeping a second cache in front of
         it meant two sources of truth that could disagree. src/utils/cache.ts
         stays for the call sites still using it. */

        const desiredSubjects = ['Chemistry', 'Hindi', 'English', 'Maths', 'Mathematics', 'Psychology', 'Computers', 'Computer', 'Accounts', 'Biology', 'Economics'];
        const [subjectsRes, upvoteStatsRes, allTeachersRes, papersRes, boardRowsRes] = await Promise.all([
          supabase.from('subjects').select('*').in('name', desiredSubjects).limit(10),
          // teacher_upvote_stats is a pre-aggregated view (teacher_id, upvote_count) —
          // avoids pulling every teacher_upvotes row down and counting client-side.
          supabase.from('teacher_upvote_stats').select('teacher_id, upvote_count').order('upvote_count', { ascending: false }).limit(6),
          supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, is_verified, subject_id, classes, subjects(name, slug), subjects_text:subjects')
            .limit(200),
          supabase.from('papers').select('board, class').eq('is_published', true),
          /* Board counts joined this batch instead of running after it. It
             shares no input with the four above and nothing waits on it, so
             awaiting it separately was a free extra round trip on the
             homepage's critical path. */
          supabase.from('Shikshaqmine').select('"School Boards Catered"'),
        ]);

        if (subjectsRes.error || upvoteStatsRes.error || allTeachersRes.error || papersRes.error) {
          if (import.meta.env.DEV) {
            console.error('Index.fetchData error:', {
              subjects: subjectsRes.error,
              upvoteStats: upvoteStatsRes.error,
              teachers: allTeachersRes.error,
              papers: papersRes.error,
            });
          }
          throw subjectsRes.error || upvoteStatsRes.error || allTeachersRes.error || papersRes.error;
        }

        const allTeachers = allTeachersRes.data || [];

        // Top upvoted teachers from teachers_list, limit 6. Fill any remainder
        // randomly so the grid never renders fewer than 6 tiles when upvotes
        // are sparse.
        let teachersData: typeof allTeachers = [];
        if (upvoteStatsRes.data && upvoteStatsRes.data.length > 0) {
          const topIds = upvoteStatsRes.data.map((u) => u.teacher_id).filter(Boolean) as string[];
          const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
          teachersData = topIds.map((id) => teacherMap.get(id)).filter(Boolean) as typeof allTeachers;
        }
        if (teachersData.length < 6) {
          const existingIds = new Set(teachersData.map((t) => t.id));
          const shuffled = allTeachers.filter((t) => !existingIds.has(t.id)).sort(() => Math.random() - 0.5);
          teachersData = [...teachersData, ...shuffled.slice(0, 6 - teachersData.length)];
        }

        if (teachersData.length > 0) {
          // Card-level fields (WhatsApp link, experience, fees, area) come from the
          // same Shikshaqmine-by-slug helper Liked/My Teachers already use — a lean,
          // column-scoped fetch rather than a second select('*') round trip.
          const basicMap = await getShikshaqmineBasicBySlugs(teachersData.map((t) => t.slug));
          const processed: Teacher[] = teachersData.map((teacher) => {
            const basic = basicMap.get(teacher.slug);
            // Bug 5 fix: the query above already selects `subjects_text` — the
            // raw comma-separated subject list from teachers_list (the same
            // column Browse.tsx already tokenizes for its own subject counts,
            // aliased `subjects_text:subjects` at the select above) — but this
            // mapping used to read only `teacher.subjects?.name`, the FK-joined
            // `subjects` relation. That relation is null for plenty of teacher
            // rows that DO have real subject text, so the card fell through
            // straight to TeacherCard's "Tuition Teacher" fallback even though
            // the actual subject was sitting right there in `subjects_text`,
            // unused. Same first-token extraction Browse.tsx already uses.
            const rawSubjectsText = (teacher as { subjects_text?: string | null }).subjects_text;
            const firstSubjectToken = rawSubjectsText
              ? rawSubjectsText.split(',').map((s) => s.trim()).filter(Boolean)[0] ?? null
              : null;
            return {
              id: teacher.id,
              name: teacher.name,
              slug: teacher.slug,
              image_url: teacher.image_url,
              is_verified: (teacher as { is_verified?: boolean | null }).is_verified,
              subjects: teacher.subjects as { name: string; slug: string } | null,
              featuredSubjectLabel: firstSubjectToken || teacher.subjects?.name || null,
              whatsappLink: basic?.whatsappLink ?? null,
              experienceYears: basic?.experienceYears ?? null,
              minFees: basic?.minFees ?? null,
              maxFees: basic?.maxFees ?? null,
              area: basic?.area ?? null,
            };
          });
          featured = processed;
        }

        if (subjectsRes.data) {
          const desiredOrder = desiredSubjects;
          const seen = new Set<string>();
          const filtered = subjectsRes.data
            .filter((s) => desiredOrder.includes(s.name))
            .filter((s) => {
              const normalized = s.name.toLowerCase().replace('computers', 'computer');
              if (seen.has(normalized)) return false;
              seen.add(normalized);
              return true;
            })
            .sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));
          // Spec: 8 tiles mobile, 12 on desktop. The fetch above already
          // limits to 10 desired subjects, so this slice is a no-op past 10
          // until more subjects are added — kept at 12 to match the spec'd
          // ceiling rather than the current data size.

          const subjectAliases: Record<string, string[]> = {
            computer: ['computer', 'computers'],
            computers: ['computer', 'computers'],
            maths: ['maths', 'mathematics'],
            mathematics: ['maths', 'mathematics'],
          };
          const matchesSubject = (teacherSubjectsText: string | null | undefined, tileName: string) => {
            const tokens = (teacherSubjectsText || '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
            const tileKey = tileName.toLowerCase();
            const aliases = subjectAliases[tileKey] || [tileKey];
            return tokens.some((t) => aliases.includes(t));
          };

          const withCounts: Subject[] = filtered.map((s) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            teacherCount: allTeachers.filter((t) => matchesSubject((t as { subjects_text?: string | null }).subjects_text, s.name)).length,
            paperCount: 0,
          }));

          subjectList = withCounts;
        }

        // Board pill stack — real per-board TUTOR counts, which is what mockup
        // 2a actually shows ("ICSE · 128 tutors"). An earlier pass counted
        // published papers instead, on the assumption that no per-board teacher
        // count existed; it does — Shikshaqmine."School Boards Catered" is the
        // same column Browse already tokenizes for its board filter. Counting
        // papers also meant the whole section vanished on a database with no
        // papers in it, which is the state this one is in.
        const boardRows = boardRowsRes.data;
        if (boardRowsRes.error) {
          logger.error('Board counts failed', boardRowsRes.error);
        }
        const boardTally: Record<string, number> = {};
        (boardRows || []).forEach((row) => {
          const raw = (row as Record<string, string | null>)['School Boards Catered'] || '';
          // One teacher can list several boards; count them once per board.
          const seen = new Set<string>();
          raw.split(/[,/|]/).forEach((tok) => {
            const t = tok.trim().toLowerCase();
            if (!t) return;
            const key = BOARD_ORDER.find((b) => t === b.toLowerCase() || t.includes(b.toLowerCase()));
            if (key && !seen.has(key)) {
              seen.add(key);
              boardTally[key] = (boardTally[key] || 0) + 1;
            }
          });
        });
        

        // By-class rail — real per-class teacher counts, tokenized from the
        // teachers_list `classes` column (same pattern as the subject counts
        // above), resolving O-01's "needs a query that doesn't exist" for the
        // teacher side: the column already exists, it just wasn't parsed.
        const classTally: Record<number, number> = {};
        allTeachers.forEach((t) => {
          const nums = parseClassNumbers((t as { classes?: string | null }).classes);
          nums.forEach((n) => {
            if (n >= 9 && n <= 12) classTally[n] = (classTally[n] || 0) + 1;
          });
        });
        

      return { featured, subjectList, boardTally, classTally };
    },
  });

  const featuredTeachers = home.data?.featured ?? [];
  const subjects = home.data?.subjectList ?? [];
  const boardCounts = home.data?.boardTally ?? {};
  const classCounts = home.data?.classTally ?? {};
  const loading = home.isPending;
  const loadError = home.isError;

  useEffect(() => { clearExpiredCache(); }, []);

  /* The three remaining home fetches, moved off bare useEffect onto react-query
     alongside the landing query above. They were the last of the ~180-line
     effect era on this route: six requests fired on every single mount, with no
     cache, no dedup and no shared staleness — so returning home from a teacher
     profile re-ran all six.

     The queries themselves are unchanged, character for character. What changes
     is that they now answer from cache for five minutes like the landing data
     does, and that three pieces of state and their setters disappear: the value
     IS the query result rather than something an effect copies into a hook.

     Kept as three keys rather than one, because they fail independently — an
     empty papers table should not cost the page its stats or its quotes. */
  const statsQuery = useQuery({
    queryKey: ['home', 'stats'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [teachersRes, papersRes, reviewsRes] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('approved', true),
      ]);
      return {
        teachers: teachersRes.count ?? null,
        papers: papersRes.count ?? null,
        reviews: reviewsRes.count ?? null,
      };
    },
  });
  const stats = statsQuery.data ?? { teachers: null, papers: null, reviews: null };

  // New papers — the three most recently published, real order by created_at
  // desc (C-007 / O-01). Limit matches what the tray actually renders (owner
  // QA: show 3, not 5 — see the 04 Papers section below).
  const recentPapersQuery = useQuery({
    queryKey: ['home', 'recent-papers'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase
        .from('papers')
        .select('id, title, school, subject, board, class, year, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      return (data || []) as RecentPaper[];
    },
  });
  const recentPapers = recentPapersQuery.data ?? [];

  // Student quote rail (C-009) — real, approved teacher_comments only. Never
  // ships placeholder quotes (design.md §0.10).
  const quotesQuery = useQuery({
    queryKey: ['home', 'quotes'],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<StudentQuote[]> => {
      const { data: comments } = await supabase
        /* teacher_comments_public, not the base table: `anon` no longer holds
           SELECT on teacher_comments.user_id, because that column plus an
           unfiltered public_profiles made every anonymous review
           de-anonymisable by a single join. The view nulls user_id on
           anonymous rows and is the only read path a logged-out visitor has. */
        .from('teacher_comments_public')
        .select('id, comment, is_anonymous, user_id, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (!comments || comments.length === 0) return [];

      const userIds = [...new Set(comments.filter((c) => !c.is_anonymous).map((c) => c.user_id))];
      const profilesMap = new Map<string, { full_name: string | null; role: string | null; school_college: string | null; grade: string | null }>();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('public_profiles')
          .select('id, full_name, role, school_college, grade')
          .in('id', userIds);
        (profiles || []).forEach((pr) => {
          if (pr.id) profilesMap.set(pr.id, pr);
        });
      }

      return comments.map((c) => {
        const profile = c.is_anonymous ? null : profilesMap.get(c.user_id);
        const name = c.is_anonymous ? 'Anonymous' : profile?.full_name || 'A ShikshAQ user';
        const metaParts = c.is_anonymous
          ? []
          : profile?.role === 'guardian'
            ? ['Guardian']
            : [profile?.school_college, profile?.grade ? `Class ${profile.grade}` : null].filter(Boolean);
        return {
          id: c.id,
          comment: c.comment,
          authorName: name,
          authorMeta: (metaParts as string[]).join(' · '),
        };
      });
    },
  });
  const studentQuotes = quotesQuery.data ?? [];

  const [heroMode, setHeroMode] = useState<SearchMode>('teachers');
  const isPapersMode = heroMode === 'papers';

  /* Only teachers who actually have a photo. The stack is a row of faces; an
     initial placeholder in it would read as a missing image rather than a
     person. */
  const featuredWithPhotos = featuredTeachers.filter((t) => Boolean(t.image_url));

  const leadTeacher = featuredTeachers[0];
  const railTeachers = featuredTeachers.slice(1);

  return (
    <div className="min-h-screen bg-background">

      <main id="main-content">
        {/* ---------------------------------------------------- Control block */}
        <section className="relative">
          {/* pb trimmed from 16/20/24 to 8/10/12: with the hero fixed to two
              lines (see h1 above), the old bottom padding plus the stat
              pills/face-stack/paragraph pushed this block to ~2x pages.md
              §1's spec'd height (385px vs 196px at 375px). The overhanging
              search card already supplies the visual breathing room below. */}
          <ControlBlock mode="dark" className="relative overflow-hidden pb-8 sm:pb-10 lg:pb-12">
            <div className="relative max-w-2xl space-y-4">
              {/* No eyebrow. "Home concepts.dc.html" concept 2a — the chosen
                  direction — opens the dark block with the logo row and then the
                  headline. The "TUTORS & PAST PAPERS, KOLKATA" eyebrow was added
                  here and appears nowhere in the spec. */}
              {/* Line breaks: "Who do you need to" / "learn from?" — two lines,
                  per pages.md §1's reviewer numbers ("Hero h1 <= 2 lines at
                  375px"). "learn from?" carries a 9px underline bar at 85%
                  brand rather than the filled tilted marker used elsewhere —
                  dc.html sets `bottom:3px; height:9px;
                  background:rgba(255,128,0,.85)`.

                  RESOLVED HANDOFF CONTRADICTION: the same handoff also sets
                  display-hero to 40px at 375px width, and at that size "Who do
                  you need to" measures ~376px against ~343px of available h1
                  width — three lines, not two. text-display-hero and the
                  ≤2-line rule cannot both hold for this copy. Copy is
                  spec-locked ("Who do you need to learn from?"), so the type
                  size was the free variable: dropped one step to
                  text-page-title (clamps 28px→40px, vs. display-hero's
                  40px→86px), which fits "Who do you need to" on one line at
                  375px and lets "learn from?" wrap to a genuine second line. */}
              {/* Mode-aware headline: swaps copy between Teachers/Papers search
                  modes (owner request — the H1 should reflect papers mode, not
                  just the search desk below it). `key={heroMode}` forces a
                  remount on every mode change so `animate-hero-swap` (§7's
                  blur+fade+rise keyframe, already in the motion whitelist,
                  previously defined but unused anywhere) replays each time
                  instead of only on first paint. */}
              <h1
                key={heroMode}
                className="animate-hero-swap font-display text-page-title leading-[0.96] tracking-[-0.04em] text-background"
              >
                <span className="font-normal">{isPapersMode ? 'Which paper do you' : 'Who do you need to'}</span>
                <br />
                <span className="relative inline-block font-black">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-[3px] h-[9px] rounded-full ${isPapersMode ? 'bg-brand-blue/85' : 'bg-brand/85'}`}
                  />
                  <span className="relative">{isPapersMode ? 'need today?' : 'learn from?'}</span>
                </span>
              </h1>

              {/* Stat pills ("145 verified tutors" / "18 free papers") removed
                  at the owner's direction — pages.md §1's search-desk stack
                  lists a mode toggle, one field and 4 popular chips only; no
                  stat chips belong in this section. The underlying stats query
                  stays (it still feeds the desktop face-stack label below and
                  the "All N teachers" link further down the page). */}

              {/* D1's overlapping face stack. Desktop only — the mobile
                  drawing (2a) has no equivalent and the stat pills already
                  carry the count there.

                  The faces are the real featured teachers already rendered
                  further down this same page, not stock or invented portraits,
                  and it draws nothing at all until at least three of them have
                  a photo. A stack of two, or of placeholder initials, would be
                  a worse claim than no stack. */}
              {featuredWithPhotos.length >= 3 && (stats.teachers ?? 0) > 0 && (
                <div className="hidden items-center gap-3 lg:flex">
                  <div className="flex -space-x-3">
                    {featuredWithPhotos.slice(0, 5).map((t) => (
                      <img
                        key={t.id}
                        src={t.image_url as string}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full border-2 border-panel object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-meta font-semibold text-background/75">
                    {stats.teachers} verified tutors in Kolkata
                  </span>
                </div>
              )}
            </div>
          </ControlBlock>

          {/* Overhanging search card — design.md §2.8 / C-053: -26px mobile, -56px desktop. */}
          <PageContainer className="relative z-10 -mt-[26px] lg:-mt-[56px]">
            <SearchDesk onModeChange={setHeroMode} />
          </PageContainer>
        </section>

        {/* --------------------------------------------------- 01 Featured teachers */}
        <PageContainer as="section" className="py-5 sm:py-8">
          <div className="space-y-6">
            <NumberedHeading
              /* 2a (the chosen direction) breaks this as "Start with the" /
                 01 / "teachers parents pick" — matches the mockup's own
                 "01 Start with the teachers parents pick" heading. */
              line1="Start with the"
              ordinal="01"
              line2="teachers parents pick"
            />

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : leadTeacher ? (
              /* Owner asked for an actual horizontal carousel/rail on both
                 mobile AND desktop — not a grid that wraps — so this scrolls
                 left-to-right with snap points at every breakpoint. */
              <div className="-mx-4 overflow-x-auto overflow-y-visible px-4 py-1 scrollbar-hide sm:mx-0 sm:px-0">
                <ul className="flex w-max snap-x snap-mandatory gap-4">
                  {featuredTeachers.map((t, i) => (
                    <li key={t.id} className="w-[168px] flex-none snap-start sm:w-[200px] lg:w-[220px]">
                      <TeacherCard
                        id={t.id}
                        name={t.name}
                        slug={t.slug}
                        subject={t.featuredSubjectLabel || t.subjects?.name || 'Tuition Teacher'}
                        subjectSlug={t.subjects?.slug}
                        imageUrl={t.image_url ?? undefined}
                        verified={t.is_verified ?? undefined}
                        isFeatured={i === 0}
                        variant="grid-compact"
                        minFees={t.minFees}
                        maxFees={t.maxFees}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyResults
                icon={<Users className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading={loadError ? 'We could not load teachers just now' : 'Refreshing our featured teachers'}
                message={
                  loadError
                    ? 'Check your connection and try again. The full list is still there.'
                    : 'The full list of verified tutors is still searchable in the meantime.'
                }
                action={{ label: 'Browse all teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
              />
            )}

            <Link
              to="/all-tuition-teachers-in-kolkata"
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg text-body-secondary font-medium text-brand-blue transition-colors duration-tap hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {/* desktop-01-home.png labels this "All 312 teachers", not a bare
                  "All teachers" — the number is the reason to click, and it is
                  the same real count already shown in the hero, so nothing new
                  is claimed. Falls back to the bare label until stats load
                  rather than flashing a placeholder number. */}
              {(stats.teachers ?? 0) > 0 ? `All ${stats.teachers} teachers` : 'All teachers'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </PageContainer>

        {/* --------------------------------------------------------- 02 Subjects */}
        <PageContainer as="section" className="py-5 sm:py-8">
          <div className="space-y-6">
            <NumberedHeading
              line1="Or go straight"
              ordinal="02"
              line2="to the subject"
              support="Every board, classes 9 to 12."
            />

            {loading && subjects.length === 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {/* Fixed at 8 tiles on every breakpoint — 2x4 mobile, 2x4
                    desktop — so the grid never leaves a lonely single tile
                    orphaned on its own row (a 9th tile at lg:grid-cols-4
                    used to do exactly that). */}
                {subjects.slice(0, 8).map((s) => (
                  <SubjectCard key={s.id} name={s.name} slug={s.slug} context="teachers" teacherCount={s.teacherCount} paperCount={s.paperCount} />
                ))}
              </div>
            ) : (
              <EmptyResults
                icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading="Subjects are being updated"
                message="Please check back shortly. You can still search for any subject directly."
                action={{ label: 'Browse all teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
              />
            )}
          </div>
        </PageContainer>

        {/* ----------------------------------------------------- Board pill stack */}
        {Object.keys(boardCounts).length > 0 && (
          <PageContainer as="section" className="py-5 sm:py-8">
            <div className="stagger-children space-y-2">
              {/* Home concepts.dc.html line 158, the literal pixel spec: a real
                  <h2>"Your board"</h2> (Archivo 800, 21px, -0.03em, #1F1F1F)
                  sits above these bars. It had been omitted entirely — the
                  colored rows rendered with real live counts, just with no
                  label explaining what they were. */}
              <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
                Your board
              </h2>
              {/* Home concepts.dc.html: height:52px; padding:0 18px;
                  border-radius:9999px (a true capsule, not a rounded
                  rectangle); gap:8px between rows. This was rounded-2xl
                  (16px corners) at auto height with 16px gaps — visually a
                  different shape and a looser rhythm than the pill stack the
                  handoff draws. `{{ boards }}` in the spec is a live-data
                  loop, so real teacher board counts (5 here, not a fixed 4)
                  is correct, not a mismatch. */}
              {BOARD_ORDER.filter((b) => boardCounts[b]).map((b, i) => (
                <Link
                  key={b}
                  to={`/all-tuition-teachers-in-kolkata?filter_boards=${encodeURIComponent(b)}`}
                  className={`flex h-[52px] min-h-[44px] items-center justify-between rounded-full px-[18px] transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-card-reveal ${BOARD_FILLS[b] ?? 'bg-muted text-foreground'} ${BOARD_TILT_CLASSES[i % BOARD_TILT_CLASSES.length]}`}
                >
                  <span className="font-display text-card-title-lg font-bold">{b}</span>
                  <span className="text-body-secondary tabular-nums opacity-80">
                    {boardCounts[b]} {boardCounts[b] === 1 ? 'tutor' : 'tutors'}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        )}

        {/* The dark subject/board ticker rail that used to sit here has been
            removed at the owner's direction. Every label it carried is still
            reachable: subjects from section 02, boards from the board strip,
            and all of them from the footer's full subject and board lists — so
            nothing became unreachable, only less shouty. */}

        {/* ------------------------------------------------------ How it works */}
        <PageContainer as="section" className="py-5 sm:py-8">
          {/* overflow-visible, not hidden: the Sticker overhangs the top edge by
              -10px and its own contract says the parent must not clip, or the
              overhang is cut off (design.md §8). This block previously carried
              overflow-hidden and sliced the top off "Takes 3 minutes". */}
          <Slab fill="brand" className="relative overflow-visible p-6 sm:p-8">
            <Sticker tone="dark" tilt={-6} size={30} className="right-6 sm:right-10">
              Takes 3 minutes
            </Sticker>

            <Eyebrow onDark className="text-white/75">
              02 · Two minutes, start to finish
            </Eyebrow>
            {/* No lg:text-page-title: section-head now clamps to 46px at 1440,
                and page-title caps at 40 — the override made this heading
                SMALLER than its siblings on desktop.
                White, not brand-foreground: brand-foreground is a near-black
                token meant for small-control contrast (buttons, chips) — on a
                large orange panel the house rule is white text on orange,
                always. */}
            <h2 className="mt-2 font-display text-section-head font-extrabold text-white">
              Then talk to them yourself
            </h2>

            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { icon: <Search />, title: 'Tell us the subject', body: 'Subject, class and your area. Three taps, no account needed.' },
                { icon: <Users />, title: 'Compare real profiles', body: 'Rates, boards, reviews and travel radius, all on one card.' },
                { icon: <MessageCircle />, title: 'Message on WhatsApp', body: 'Talk to the teacher directly. ShikshAQ never sits in the middle.' },
              ].map((step, i) => (
                <li key={step.title} className={`flex flex-col gap-3 ${i > 0 ? 'sm:border-l sm:border-background/25 sm:pl-6' : ''}`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/15 text-white [&_svg]:size-5">
                    {step.icon}
                  </span>
                  <h3 className="font-display text-subsection font-bold text-white">{step.title}</h3>
                  <p className="text-body-secondary text-white/85">{step.body}</p>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-body-secondary text-white/80">
              No fees, no middleman, no commission, ever.
            </p>
          </Slab>
        </PageContainer>

        {/* --------------------------------------------------------- 03 By class */}
        <PageContainer as="section" className="py-5 sm:py-8">
          <div className="space-y-6">
            <NumberedHeading
              line1="Or by the class"
              ordinal="03"
              line2="they are sitting"
              support="Classes 1 through 12."
            />

            {/* Spec: "Classes 1-12 as 44px chips, 4 per row mobile." Was
                hardcoded to [9,10,11,12]; now the full range.

                No counts shown — O-01 in pages.md is an explicitly blocked/
                unresolved open question ("Do not guess; ship without the
                clause"), so classCounts is intentionally not read here even
                though it's still computed above for other call sites. */}
            {/* grid, not flex-wrap, at every breakpoint — a wrapped flex row
                of 44px chips left a large dead strip on the right of a 1200px+
                container. The grid stretches each chip's tap target to fill
                its column instead, so 12 columns of chips actually use the
                section's full measure on desktop. */}
            <ul className="grid grid-cols-6 gap-3 sm:grid-cols-8 lg:grid-cols-12">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <Link
                    to={`/all-tuition-teachers-in-kolkata?filter_classes=${n}`}
                    className="flex h-11 w-full items-center justify-center rounded-2xl bg-card shadow-border transition-transform duration-tap hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="font-display text-card-title font-extrabold tabular-nums">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>

        {/* ------------------------------------------------------- 04 New papers */}
        {/* Rebuilt per pages.md §1 / audit: "indigo mode. Dashed tray, 5
            covers peeking, indigo CTA 'Browse past papers'." Was a plain
            white row list with no indigo, no tray, no cover art — now reuses
            the exact indigo-band + dashed-tray + PaperCover pattern the Past
            Papers page header already ships (src/pages/PastPapers.tsx, the
            D4 hero), rather than inventing a second version of the same
            idea. */}
        <PageContainer as="section" className="py-5 sm:py-8">
          <div className="space-y-6">
            <NumberedHeading line1="Or read what" ordinal="04" line2="the boards set" />

            {recentPapers.length > 0 ? (
              <div className="relative overflow-hidden rounded-4xl bg-brand-blue px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
                <span aria-hidden className="pointer-events-none absolute -left-10 top-0 h-[160px] w-[160px] rounded-full bg-white/[.06]" />
                <span aria-hidden className="pointer-events-none absolute -right-10 top-10 h-[190px] w-[190px] rounded-full bg-white/[.06]" />

                {/* Dashed shelf tray, covers peeking out the top — the same
                    treatment as the Past Papers page hero. Bottom padding on
                    the tray (not just the outer panel) so a cover's own
                    height/shadow never lands flush on the panel's rounded
                    edge — that flush collision was what read as "clipped". */}
                {/* Owner QA: this tray was showing 5 covers squeezed down to
                    100x132 (below PaperCover's own 118x156 "mobile" size) so
                    the board eyebrow, 3-line subject clamp and truncated
                    title line all fought for space on an undersized card —
                    "too much text crammed in". Trimmed to the 3 newest papers
                    at PaperCover's real mobile size (matches the 118x156 the
                    component and pages.md §1 both already spec) instead of
                    shrinking the card to force a 5th one in. max-w sized for
                    3 covers (118px + 12px gap x 3) plus the box's own px-6
                    padding, so justify-center centers the row with no
                    scroll. */}
                <div className="relative mx-auto max-w-[420px] rounded-t-[24px] border-[1.5px] border-b-0 border-dashed border-white/45 px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
                  <div className="scrollbar-hide flex items-end justify-center gap-3 overflow-x-auto overflow-y-visible">
                    {recentPapers.slice(0, 3).map((p) => (
                      <PaperCover
                        key={p.id}
                        paper={p}
                        href={`/past-papers/${p.id}`}
                        size="mobile"
                        className="flex-none"
                      />
                    ))}
                  </div>
                </div>

                <div className="relative mt-6 flex flex-col items-center gap-1 text-center">
                  <p className="max-w-prose text-body-secondary text-white/80">
                    Free past papers from Kolkata schools: ICSE, CBSE and ISC, classes 9 to 12.
                  </p>
                  <Link
                    to="/past-papers"
                    className="mt-3 inline-flex h-11 min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-warm-card px-6 text-[14px] font-extrabold text-brand-blue-deep transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
                  >
                    Browse past papers
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyResults
                icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading="Papers are being added"
                message="Free, from Kolkata schools. Check back shortly."
                action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
              />
            )}
          </div>
        </PageContainer>

        {/* --------------------------------------------------- Guardian trust panel */}
        <PageContainer as="section" className="py-5 sm:py-8">
          <div className="rounded-3xl bg-brand-subtle p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <IconDisc tone="brand" size={32} shape="square"><ShieldCheck /></IconDisc>
              <h2 className="font-display text-section-head font-extrabold text-brand-deep">Why guardians use ShikshAQ</h2>
            </div>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                { icon: <ShieldCheck />, title: 'Verified, every one', body: 'ID and degree checked by a human before a profile goes live.' },
                { icon: <IndianRupee />, title: 'No commission, ever', body: 'Teachers keep every rupee of their fee. We never invoice anyone.' },
                { icon: <Users />, title: 'Reviews you can trust', body: 'Every review comes from a student who actually messaged the teacher.' },
              ].map((row) => (
                <li key={row.title} className="flex items-start gap-3">
                  <IconDisc tone="brand-subtle" size={36}>{row.icon}</IconDisc>
                  <div>
                    <p className="font-display text-card-title font-semibold text-brand-deep">{row.title}</p>
                    <p className="text-body-secondary text-warm-prose">{row.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>

        {/* ------------------------------------------------------ Student quotes */}
        {studentQuotes.length > 0 && (
          <PageContainer as="section" className="py-5 sm:py-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <IconDisc tone="muted" size={32} shape="square"><MessageCircle /></IconDisc>
                <h2 className="font-display text-section-head font-extrabold">From students</h2>
              </div>

              <div className="-mx-4 overflow-x-auto overflow-y-visible px-4 py-2 scrollbar-hide sm:mx-0 sm:px-0">
                <ul className="flex w-max gap-4">
                  {studentQuotes.map((q) => (
                    <li key={q.id} className="flex w-[250px] flex-none flex-col gap-4 rounded-2xl bg-card p-4 shadow-border">
                      <p className="line-clamp-5 text-body-secondary text-warm-prose">&ldquo;{q.comment}&rdquo;</p>
                      <div className="mt-auto flex items-center gap-2">
                        <StripePlaceholder name={q.authorName} initialSize={14} className="h-[26px] w-[26px] flex-none rounded-full" />
                        <div className="min-w-0">
                          <p className="truncate text-meta font-semibold text-foreground">{q.authorName}</p>
                          {q.authorMeta && <p className="truncate text-meta text-muted-foreground">{q.authorMeta}</p>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PageContainer>
        )}

        {/* ------------------------------------------------------- Recommend CTA */}
        <PageContainer as="section" className="py-5 sm:py-8">
          <Link
            to="/recommend-teacher"
            className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-border transition-transform duration-tap hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
          >
            <IconDisc tone="muted" size={44}>
              <GraduationCap />
            </IconDisc>
            <div className="min-w-0 flex-1">
              <p className="font-display text-card-title font-semibold text-foreground">Know a good teacher?</p>
              <p className="text-body-secondary text-muted-foreground">Recommend them and we'll reach out and get them listed, free.</p>
            </div>
            <ArrowRight className="h-5 w-5 flex-none text-warm-label" aria-hidden="true" />
          </Link>
        </PageContainer>

        {/* HomeGreeting / HomeActivitySection (Favourites, Recently visited) are
            real, existing localStorage/likes-backed features with no home in
            the mockup's own section order — mockup goes search-card straight
            into "01 Start with the teachers parents pick". Per BUILD FROM ZERO
            + KEEP FUNCTIONALITY, they are kept but moved below the mockup's own
            sections, just above the prefooter, rather than deleted. */}
        <HomeGreeting />
        <HomeActivitySection />
      </main>

      {/* Opened by tapping the wordmark in the nav (components.md C10). The
          trigger dispatches an event rather than reaching in through props,
          since the logo lives in Navbar and the tour is mounted here. */}
      <ProductTour open={tourOpen} onOpenChange={setTourOpen} />
    </div>
  );
}
