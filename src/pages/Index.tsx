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
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeGreeting } from '@/components/HomeGreeting';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { SearchDesk } from '@/components/home/SearchDesk';
import { PageContainer, ControlBlock, Slab } from '@/components/layout/PageContainer';
import { BottomNavSpacer } from '@/components/layout/PageContainer';
import { PreFooter } from '@/components/layout/PreFooter';
import { ProductTour, useProductTour } from '@/components/ProductTour';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Sticker } from '@/components/ui/sticker';
import { IconDisc } from '@/components/ui/icon-disc';
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
  State: 'bg-panel text-background',
};
const BOARD_TILTS = ['-1', '0.8', '-0.6', '1', '-0.5'];

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
            return {
              id: teacher.id,
              name: teacher.name,
              slug: teacher.slug,
              image_url: teacher.image_url,
              is_verified: (teacher as { is_verified?: boolean | null }).is_verified,
              subjects: teacher.subjects as { name: string; slug: string } | null,
              featuredSubjectLabel: teacher.subjects?.name ?? null,
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
            .sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name))
            .slice(0, 8);

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
  // desc (C-007 / O-01).
  const recentPapersQuery = useQuery({
    queryKey: ['home', 'recent-papers'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase
        .from('papers')
        .select('id, title, school, board, class, year, created_at')
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
          <ControlBlock mode="dark" className="relative overflow-hidden pb-16 sm:pb-20 lg:pb-24">
            {/* Soft radial tints — decorative only (design.md §2.8). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-brand-blue/20 blur-3xl"
            />

            <div className="relative max-w-2xl space-y-4">
              {/* No eyebrow. "Home concepts.dc.html" concept 2a — the chosen
                  direction — opens the dark block with the logo row and then the
                  headline. The "TUTORS & PAST PAPERS, KOLKATA" eyebrow was added
                  here and appears nowhere in the spec. */}
              {/* Line breaks are the spec's: "Who do you / need to / learn from?"
                  (<br> after "you" and "to"), and "learn from?" carries a 9px
                  underline bar at 85% brand rather than the filled tilted marker
                  used elsewhere — dc.html sets
                  `bottom:3px; height:9px; background:rgba(255,128,0,.85)`.

                  KNOWN HANDOFF CONTRADICTION, do not "fix" this to two lines.
                  pages.md §1's reviewer numbers require "Hero h1 <= 2 lines at
                  375px", but the same handoff sets display-hero to 40px at that
                  width. Measured at 375: "Who do you need to" renders 376px
                  wide against 343px of available h1 width, so two lines do not
                  fit — they would need roughly 36px type. The two requirements
                  are arithmetically incompatible; three lines at the specified
                  size is the only reading that honours the drawing, and it is
                  what 2a draws. Reported rather than silently resolved. */}
              <h1 className="font-display text-display-hero font-black leading-[0.96] tracking-[-0.04em] text-background">
                Who do you
                <br />
                need to
                <br />
                <span className="relative inline-block">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[3px] h-[9px] rounded-full bg-brand/85"
                  />
                  <span className="relative">learn from?</span>
                </span>
              </h1>

              {/* Stat pills, per Home concepts 2a. They are speech bubbles, not
                  plain chips: rotate(∓1.5deg), a 7px dot in the colour of the
                  thing counted, and an 8px square rotated 45° tucked under the
                  bottom edge as the tail — orange pill's tail on the left, blue
                  pill's on the right. An earlier pass flattened them to plain
                  pills citing "chips never tilt"; these are not chips, and the
                  tilt is what makes the pair read as two voices rather than a
                  toolbar. Reduced motion is irrelevant — it is a static
                  transform, not an animation.

                  Still guarded on > 0: design.md §3.2, a zero drops its pill. */}
              {((stats.teachers ?? 0) > 0 || (stats.papers ?? 0) > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {(stats.teachers ?? 0) > 0 && (
                    <span className="relative inline-flex -rotate-[1.5deg] items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-meta font-bold text-foreground">
                      <span className="h-[7px] w-[7px] rounded-full bg-brand" aria-hidden="true" />
                      {stats.teachers} verified tutors
                      <span
                        aria-hidden="true"
                        className="absolute bottom-[-4px] left-4 h-2 w-2 rotate-45 bg-card"
                      />
                    </span>
                  )}
                  {(stats.papers ?? 0) > 0 && (
                    <span className="relative inline-flex rotate-[1.5deg] items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-meta font-bold text-foreground">
                      <span className="h-[7px] w-[7px] rounded-full bg-brand-blue" aria-hidden="true" />
                      {stats.papers} free papers
                      <span
                        aria-hidden="true"
                        className="absolute bottom-[-4px] right-[18px] h-2 w-2 rotate-45 bg-card"
                      />
                    </span>
                  )}
                </div>
              )}

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

              <p className="max-w-prose text-lede text-background/75">
                Message the teacher yourself on WhatsApp. No agents, no commission, nothing in between.
              </p>
            </div>
          </ControlBlock>

          {/* Overhanging search card — design.md §2.8 / C-053: -26px mobile, -56px desktop. */}
          <PageContainer className="relative z-10 -mt-[26px] lg:-mt-[56px]">
            <SearchDesk onModeChange={setHeroMode} />
          </PageContainer>
        </section>

        {/* --------------------------------------------------- 01 Featured teachers */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="space-y-6">
            <NumberedHeading
              /* 2a (the chosen direction) breaks this as "Start with the" /
                 01 / "teachers parents pick". The split here was
                 "Start with the teachers" / "parents pick", which is neither
                 the mobile nor the desktop variant — the ordinal landed
                 mid-phrase instead of between the two lines. */
              line1="Start with the"
              ordinal="01"
              line2="teachers parents pick"
              support="Ordered by how often guardians message them. Verified ID and degree, every one."
            />

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : leadTeacher ? (
              /* Mockup shows a uniform grid (2-col mobile / 4-col desktop) of
                 teacher cards, not a lead-card-plus-scrolling-rail — matched here. */
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {featuredTeachers.map((t, i) => (
                  <TeacherCard
                    key={t.id}
                    id={t.id}
                    name={t.name}
                    slug={t.slug}
                    subject={t.featuredSubjectLabel || t.subjects?.name || 'Tuition Teacher'}
                    subjectSlug={t.subjects?.slug}
                    imageUrl={t.image_url ?? undefined}
                    verified={t.is_verified ?? undefined}
                    isFeatured={i === 0}
                    variant="grid"
                    whatsappLink={t.whatsappLink}
                    experienceYears={t.experienceYears}
                    minFees={t.minFees}
                    maxFees={t.maxFees}
                    area={t.area}
                  />
                ))}
              </div>
            ) : (
              <EmptyResults
                icon={<Users className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading={loadError ? 'We could not load teachers just now' : 'Refreshing our featured teachers'}
                message={
                  loadError
                    ? 'Check your connection and try again — the full list is still there.'
                    : 'The full list of verified tutors is still searchable in the meantime.'
                }
                action={{ label: 'Browse all teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
              />
            )}

            <Link
              to="/all-tuition-teachers-in-kolkata"
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg text-body-secondary font-medium text-brand-blue transition-colors duration-150 hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
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
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="space-y-6">
            <NumberedHeading
              line1="Or go straight"
              ordinal="02"
              line2="to the subject"
              support="Eight subjects, every board, classes 9 to 12."
            />

            {loading && subjects.length === 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {subjects.map((s) => (
                  <SubjectCard key={s.id} name={s.name} slug={s.slug} context="teachers" teacherCount={s.teacherCount} paperCount={s.paperCount} />
                ))}
              </div>
            ) : (
              <EmptyResults
                icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading="Subjects are being updated"
                message="Please check back shortly — you can still search for any subject directly."
                action={{ label: 'Browse all teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
              />
            )}
          </div>
        </PageContainer>

        {/* ----------------------------------------------------- Board pill stack */}
        {Object.keys(boardCounts).length > 0 && (
          <PageContainer as="section" className="py-8 sm:py-12">
            <div className="space-y-4">
              {BOARD_ORDER.filter((b) => boardCounts[b]).map((b, i) => (
                <Link
                  key={b}
                  to={`/all-tuition-teachers-in-kolkata?filter_boards=${encodeURIComponent(b)}`}
                  className={`flex min-h-[44px] items-center justify-between rounded-2xl px-6 py-4 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${BOARD_FILLS[b] ?? 'bg-muted text-foreground'}`}
                  style={{ transform: `rotate(${BOARD_TILTS[i % BOARD_TILTS.length]}deg)` }}
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
        <PageContainer as="section" className="py-8 sm:py-12">
          {/* overflow-visible, not hidden: the Sticker overhangs the top edge by
              -10px and its own contract says the parent must not clip, or the
              overhang is cut off (design.md §8). This block previously carried
              overflow-hidden and sliced the top off "Takes 3 minutes". */}
          <Slab fill="brand" className="relative overflow-visible p-6 sm:p-8">
            <Sticker tone="dark" tilt={-6} size={30} className="right-6 sm:right-10">
              Takes 3 minutes
            </Sticker>

            <Eyebrow onDark className="text-brand-foreground/70">
              02 · Two minutes, start to finish
            </Eyebrow>
            {/* No lg:text-page-title: section-head now clamps to 46px at 1440,
                and page-title caps at 40 — the override made this heading
                SMALLER than its siblings on desktop. */}
            <h2 className="mt-2 font-display text-section-head font-extrabold">
              Then talk to them yourself
            </h2>

            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { icon: <Search />, title: 'Tell us the subject', body: 'Subject, class and your area. Three taps, no account needed.' },
                { icon: <Users />, title: 'Compare real profiles', body: 'Rates, boards, reviews and travel radius, all on one card.' },
                { icon: <MessageCircle />, title: 'Message on WhatsApp', body: 'Talk to the teacher directly. ShikshAQ never sits in the middle.' },
              ].map((step, i) => (
                <li key={step.title} className={`flex flex-col gap-3 ${i > 0 ? 'sm:border-l sm:border-white/25 sm:pl-6' : ''}`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 [&_svg]:size-5">
                    {step.icon}
                  </span>
                  <h3 className="font-display text-subsection font-bold">{step.title}</h3>
                  <p className="text-body-secondary text-brand-foreground/85">{step.body}</p>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-body-secondary text-brand-foreground/80">
              No fees, no middleman, no commission — ever.
            </p>
          </Slab>
        </PageContainer>

        {/* --------------------------------------------------------- 03 By class */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="space-y-6">
            <NumberedHeading
              line1="Or by the class"
              ordinal="03"
              line2="they are sitting"
              support="Class 9 through 12, with counts as they stand today."
            />

            <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
              <ul className="flex w-max items-center gap-3 sm:w-full sm:flex-wrap">
                {[9, 10, 11, 12].map((n) => (
                  <li key={n}>
                    <Link
                      to={`/all-tuition-teachers-in-kolkata?filter_classes=${n}`}
                      className="flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-2xl bg-card shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span className="font-display text-card-title-lg font-extrabold tabular-nums">{n}</span>
                      {classCounts[n] ? (
                        <span className="text-meta tabular-nums text-muted-foreground">{classCounts[n]}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageContainer>

        {/* ------------------------------------------------------- 04 New papers */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="space-y-6">
            {/* "All" sits inline to the right of the heading, per 2a's 04
                strip. It used to trail the list as a lone link, which left 88px
                of stacked padding (32 section + 32 section + 24 card) between a
                short line of text and the next heading — the gap the owner
                flagged. Moving it up removes the trailing block entirely. */}
            <div className="flex items-end justify-between gap-4">
              <NumberedHeading line1="Or read what" ordinal="04" line2="the boards set" />
              <Link
                to="/past-papers"
                className="inline-flex h-11 flex-none items-center gap-1.5 whitespace-nowrap rounded-lg text-[13.5px] font-semibold text-brand-blue transition-colors duration-150 hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                All
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {recentPapers.length > 0 ? (
              <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-border">
                {recentPapers.map((p) => (
                  <Link
                    key={p.id}
                    to={`/past-papers/${p.id}`}
                    className="flex items-center gap-4 p-4 transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <IconDisc tone="papers-subtle" size={40} shape="square">
                      <span className="text-meta font-bold tabular-nums">{p.year}</span>
                    </IconDisc>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-card-title font-semibold text-foreground">{p.title}</p>
                      <p className="truncate text-meta text-muted-foreground">
                        {p.school} · {p.board} Class {p.class}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-none text-warm-label" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyResults
                icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                heading="Papers are being added"
                message="Free, from Kolkata schools — check back shortly."
                action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
              />
            )}

          </div>
        </PageContainer>

        {/* --------------------------------------------------- Guardian trust panel */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="rounded-3xl bg-brand-subtle p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <IconDisc tone="brand" size={26} shape="square"><ShieldCheck /></IconDisc>
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
          <PageContainer as="section" className="py-8 sm:py-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <IconDisc tone="muted" size={26} shape="square"><MessageCircle /></IconDisc>
                <h2 className="font-display text-section-head font-extrabold">From students</h2>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:px-0">
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
        <PageContainer as="section" className="py-8 sm:py-12">
          <Link
            to="/recommend-teacher"
            className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
          >
            <IconDisc tone="muted" size={44}>
              <GraduationCap />
            </IconDisc>
            <div className="min-w-0 flex-1">
              <p className="font-display text-card-title font-semibold text-foreground">Know a good teacher?</p>
              <p className="text-body-secondary text-muted-foreground">Recommend them — we'll reach out and get them listed, free.</p>
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

        <PreFooter variant="B1" />
        <BottomNavSpacer />
      </main>

      <Footer />

      {/* Opened by tapping the wordmark in the nav (components.md C10). The
          trigger dispatches an event rather than reaching in through props,
          since the logo lives in Navbar and the tour is mounted here. */}
      <ProductTour open={tourOpen} onOpenChange={setTourOpen} />
    </div>
  );
}
