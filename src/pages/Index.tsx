import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
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
import { validateImageSrc } from '@/utils/imageSanitizer';
import { logger } from '@/utils/logger';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeGreeting } from '@/components/HomeGreeting';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { SearchDesk } from '@/components/home/SearchDesk';
import { RegionNotice } from '@/components/RegionNotice';
import { EyesPanel } from '@/components/home/EyesPanel';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { useChromeConfig } from '@/components/layout/AppShell';
import { ProductTour, useProductTour } from '@/components/ProductTour';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { IconDisc } from '@/components/ui/icon-disc';
import { PaperCover } from '@/components/papers/paper-cover';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { resolveHeroCopy, papersHeroCopy } from '@/lib/hero-copy';
import { getSubjectPalette } from '@/lib/subject-palette';
import { useRequireRole } from '@/hooks/use-require-role';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
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
  sirMaam?: string | null;
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
  /** Who the review is about. A quote like "Ashok sir explains clearly" is
   *  unreadable on the home page without it — the reader has no idea who
   *  "Ashok sir" is or how to reach them. */
  teacherName: string | null;
  teacherSlug: string | null;
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
  'rotate-[-1deg] motion-reduce:rotate-0 lg:rotate-0',
  'rotate-[0.8deg] motion-reduce:rotate-0 lg:rotate-0',
  'rotate-[-0.6deg] motion-reduce:rotate-0 lg:rotate-0',
  'rotate-[1deg] motion-reduce:rotate-0 lg:rotate-0',
  'rotate-[-0.5deg] motion-reduce:rotate-0 lg:rotate-0',
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
  const { profile } = useAuth();
  const { likedTeacherIds, likedCount } = useLikes();

  useRequireRole();

  // Handoff H-023/S-015: Home renders its own eyes panel inline (with the
  // real sentence-builder data this page already fetches), replacing
  // AppShell's default pre-footer for this route only.
  useChromeConfig({ preFooter: 'none' });

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
          // Was limit(6) — the featured rail showed at most 6 teachers no
          // matter how many the site actually has, so "start with the
          // teachers parents pick" read as a small, fixed set rather than a
          // rail with real depth to scroll through. 24 is a real cap for
          // page weight, not an arbitrary "still small" number — allTeachers
          // below already pulls up to 200 for other purposes, so the fill
          // logic has plenty to draw from without a second round trip.
          supabase.from('teacher_upvote_stats').select('teacher_id, upvote_count').order('upvote_count', { ascending: false }).limit(24),
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
        const FEATURED_TARGET = 24;
        if (teachersData.length < FEATURED_TARGET) {
          const existingIds = new Set(teachersData.map((t) => t.id));
          const shuffled = allTeachers.filter((t) => !existingIds.has(t.id)).sort(() => Math.random() - 0.5);
          teachersData = [...teachersData, ...shuffled.slice(0, FEATURED_TARGET - teachersData.length)];
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
              /* Owner: the featured rail showed bare names while Browse and
                 the profile both render the honorific. basicMap is already
                 fetched above for the fee/area fields, so this costs nothing. */
              sirMaam: basic?.sirMaam ?? null,
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


        // Per-board published-paper counts. `papersRes` was already being
        // fetched (and only its error inspected), so this is free.
        const paperBoardTally: Record<string, number> = {};
        (papersRes.data || []).forEach((row) => {
          const raw = ((row as { board?: string | null }).board || '').trim();
          if (!raw) return;
          const key = BOARD_ORDER.find((b) => raw.toLowerCase().includes(b.toLowerCase()));
          if (key) paperBoardTally[key] = (paperBoardTally[key] || 0) + 1;
        });

      return { featured, subjectList, boardTally, classTally, paperBoardTally };
    },
  });

  /* `?? []` inline is a new array identity on every render, which invalidated
     the useMemo downstream every time and re-derived its work for nothing.
     Same fix as bankPapers and recentPapers on the papers page. */
  const featuredTeachers = useMemo(() => home.data?.featured ?? [], [home.data]);
  const subjects = home.data?.subjectList ?? [];
  const boardCounts = home.data?.boardTally ?? {};
  const classCounts = home.data?.classTally ?? {};
  const paperBoardCounts = home.data?.paperBoardTally ?? {};
  const loading = home.isPending;
  const loadError = home.isError;
  void classCounts;

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
        /* 10, not 3. The shelf is a carousel now, so three covers left it
           half empty at desktop with nothing to scroll to. */
        .limit(10);
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
        .select('id, comment, is_anonymous, user_id, created_at, teacher_id')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        /* Pull a wider slice than the six we show: the rail is deduplicated to
           one quote per teacher below, and with one popular teacher holding a
           dozen reviews a limit of 6 returned six cards about the same person. */
        .limit(60);
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

      /* The teachers these quotes are about, in one batched read — same shape
         as the profiles lookup above, no per-row query. */
      const teacherIds = [...new Set(comments.map((c) => (c as { teacher_id?: string }).teacher_id).filter(Boolean))] as string[];
      const teacherMap = new Map<string, { name: string | null; slug: string | null }>();
      if (teacherIds.length > 0) {
        const { data: tRows } = await supabase
          .from('teachers_list')
          .select('id, name, slug')
          .in('id', teacherIds);
        (tRows || []).forEach((t) => {
          if (t.id) teacherMap.set(t.id, { name: t.name, slug: t.slug });
        });
      }

      /* One quote per teacher, teachers with the most reviews first — six
         cards all praising the same tutor says nothing about the site. */
      const perTeacher = new Map<string, number>();
      comments.forEach((c) => {
        const id = (c as { teacher_id?: string }).teacher_id;
        if (id) perTeacher.set(id, (perTeacher.get(id) ?? 0) + 1);
      });
      const seenTeacher = new Set<string>();
      const picked = comments
        .filter((c) => {
          const id = (c as { teacher_id?: string }).teacher_id;
          if (!id) return false;
          if (seenTeacher.has(id)) return false;
          seenTeacher.add(id);
          return true;
        })
        .sort((a, b) => {
          const ca = perTeacher.get((a as { teacher_id?: string }).teacher_id ?? '') ?? 0;
          const cb = perTeacher.get((b as { teacher_id?: string }).teacher_id ?? '') ?? 0;
          return cb - ca;
        })
        .slice(0, 6);

      return picked.map((c) => {
        const profile = c.is_anonymous ? null : profilesMap.get(c.user_id);
        const teacher = teacherMap.get((c as { teacher_id?: string }).teacher_id ?? '');
        const name = c.is_anonymous ? 'Anonymous' : profile?.full_name || 'A Shikshaq user';
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
          teacherName: teacher?.name ?? null,
          teacherSlug: teacher?.slug ?? null,
        };
      });
    },
  });
  const studentQuotes = quotesQuery.data ?? [];

  // Handoff H-023: the sentence builder moved out of Footer.tsx, "move not
  // copy" — same component, same slot logic and submit routes. Its state now
  // lives in the shared useSentenceBuilder hook (P-014 needs the identical
  // builder on TeacherProfile too), not duplicated per page.
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();

  const [heroMode, setHeroMode] = useState<SearchMode>('teachers');

  /* Only teachers who actually have a photo. The stack is a row of faces; an
     initial placeholder in it would read as a missing image rather than a
     person. */
  const featuredWithPhotos = featuredTeachers.filter((t) => Boolean(t.image_url));

  // H-005 branch 1b needs the single liked teacher's name. H-005 adds no new
  // query, so this only resolves when that teacher is already in the
  // featured list this page already fetched — otherwise 1b falls through to 2.
  const likedSingleTeacher = useMemo(() => {
    if (likedCount !== 1) return null;
    const [onlyId] = Array.from(likedTeacherIds);
    return featuredTeachers.find((t) => t.id === onlyId) ?? null;
  }, [likedCount, likedTeacherIds, featuredTeachers]);
  const likedSingleTeacherName = likedSingleTeacher?.name ?? null;

  const baseHeroCopy = useMemo(
    () => resolveHeroCopy({
      profile,
      likedCount,
      likedSingleTeacherName,
      likedSingleTeacherImageUrl: likedSingleTeacher?.image_url ?? null,
    }),
    [profile, likedCount, likedSingleTeacherName, likedSingleTeacher],
  );
  const heroCopy = useMemo(
    () => (heroMode === 'papers' ? papersHeroCopy(baseHeroCopy, profile) : baseHeroCopy),
    [heroMode, baseHeroCopy, profile],
  );
  /* Teachers are orange, papers are blue — the same two accents the search
     desk, the fork panels and the results rows already use. Carrying it up
     into the greeting is what makes the switch read as the whole page
     changing subject rather than one control changing state. */
  const heroAccent = heroMode === 'papers' ? 'text-brand-blue' : 'text-brand';
  /* H-005a rule 3: three lines maximum at 375px, measured against the LONGEST
     REAL value — not a short sample. Six lines failed it: two pool lines, the
     handoff's own "No agent in between." line at four, and branches 3-5 once
     they carry a real 25-character name or "WBCHSE Environmental Science".
     The branch copy is specified verbatim, so the size steps down instead of
     the words being cut — every branch stays inside three lines at any real
     value, and short lines keep the full 34px. */
  const heroLength = (heroCopy.before + heroCopy.bold + heroCopy.after).length;
  const heroSize =
    heroLength > 74
      ? 'text-[26px] leading-[1.16] lg:text-[44px] lg:leading-[1.06]'
      : heroLength > 54
        ? 'text-[29px] leading-[1.15] lg:text-[50px] lg:leading-[1.04]'
        : 'text-[34px] leading-[1.14] lg:text-[58px] lg:leading-[1.02]';
  // The hero's own mode (from the copy resolver) drives the search desk's
  // initial mode too, the same way the old two-line headline used to swap
  // with SearchDesk's onModeChange — except now the direction of truth runs
  // the other way for the papers branch: H-005's branch 5 both names the
  // hero copy AND wants the desk in papers mode from first paint.
  useEffect(() => {
    if (baseHeroCopy.mode === 'papers') setHeroMode('papers');
  }, [baseHeroCopy.mode]);

  /* chip 'stripe' means the line names ONE specific teacher (heroCopy.bold) —
     that chip must be that teacher's own photo or nothing, never a
     different, unrelated teacher's face next to their name. Only the
     generic 'avatar' branches (no specific person named) borrow
     featuredTeachers[0] as decoration. */
  const namesSpecificTeacher = heroCopy.chip === 'stripe';
  const chipImageUrl = namesSpecificTeacher ? heroCopy.imageUrl : featuredTeachers[0]?.image_url;
  const chipPlaceholderName = namesSpecificTeacher ? heroCopy.bold : featuredTeachers[0]?.name;
  const heroAvatarChip = heroCopy.chip === null ? null : (
    <span
      aria-hidden
      className={`relative inline-block h-[28px] w-[28px] shrink-0 overflow-hidden rounded-full align-[-6px] ${
        chipImageUrl ? '' : 'ring-1 ring-warm-hairline'
      }`}
    >
      {chipImageUrl ? (
        <img src={validateImageSrc(chipImageUrl)} alt="" className="h-full w-full object-cover" />
      ) : (
        <StripePlaceholder name={chipPlaceholderName} initialSize={14} className="h-full w-full" />
      )}
    </span>
  );

  const leadTeacher = featuredTeachers[0];

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <BentoStack>
          {/* --------------------------------------------- 1-4 · Hero grid (D-005)
              Mobile: greeting, then search, then the two fork panels — a plain
              flex-col stack (gap-seam) reproduces the exact prior order/spacing.
              `lg`: grid-cols-[1.15fr_1fr] — greeting+search left, forks stacked
              right — per the 34-desktop.md D-005 "Home hero" row. */}
          {/* No lg:items-start. Pinned to the top, the right column ended
              wherever its two fork panels ended and left a tall band of page
              ground beside the search desk — the hero read as half-finished at
              desktop. The columns are equal height now and the forks divide it
              between them. */}
          <div className="flex flex-col gap-seam lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-2">
            <div className="flex flex-col gap-seam lg:gap-2">
          {/* -------------------------------------------------------- 1 · Greeting */}
          <BentoPanel fill="card" edge="top" className="relative overflow-hidden pt-[14px] px-[22px]">
            {/* Both lines are keyed on the mode so a toggle flip remounts them
                and re-runs the entrance. animate-blur-swap defocuses the old
                wording out and the new wording in, which reads as one line
                changing its mind rather than two lines crossfading. */}
            <p
              key={`eyebrow-${heroMode}`}
              className={`animate-blur-swap text-[12.5px] font-semibold ${heroAccent} motion-reduce:animate-none`}
            >
              {heroCopy.eyebrow}
            </p>
            <h1
              key={`${heroMode}-${heroCopy.before}${heroCopy.bold}`}
              className={`animate-blur-swap mt-[6px] font-display font-normal tracking-[-0.045em] text-foreground motion-reduce:animate-none lg:tracking-[-0.05em] ${heroSize}`}
            >
              {heroAvatarChip}
              {heroAvatarChip ? ' ' : null}
              {heroCopy.before}
              {/* When the line names something reachable, the name IS the way
                  there. It used to be inert text: the hero told you it knew
                  which teacher you were considering and then made you go and
                  find them again. */}
              {heroCopy.href ? (
                <Link
                  to={heroCopy.href}
                  className={`animate-hero-blink font-extrabold motion-reduce:animate-none ${heroAccent} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                >
                  {heroCopy.bold}
                </Link>
              ) : (
                <span className={`font-extrabold ${heroAccent}`}>{heroCopy.bold}</span>
              )}
              {heroCopy.after}
            </h1>

            {/* H-007: live facet-count pills replace the old stat-pill pair. */}
            {heroMode === 'teachers' && subjects.length > 0 && (
              <div key="pills-teachers" className="-mx-[22px] mt-4 animate-blur-swap overflow-x-auto px-[22px] scrollbar-hide motion-reduce:animate-none">
                <div className="flex w-max items-center gap-2">
                  {subjects.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className="flex h-[38px] shrink-0 items-center gap-[7px] whitespace-nowrap rounded-full bg-muted px-3.5 text-[13px] font-semibold text-foreground"
                    >
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-[2px]"
                        style={{ backgroundColor: getSubjectPalette(s.name).solid }}
                      />
                      {s.name} · {s.teacherCount}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {heroMode === 'papers' && Object.keys(paperBoardCounts).length > 0 && (
              <div key="pills-papers" className="-mx-[22px] mt-4 animate-blur-swap overflow-x-auto px-[22px] scrollbar-hide motion-reduce:animate-none">
                <div className="flex w-max items-center gap-2">
                  {BOARD_ORDER.filter((b) => paperBoardCounts[b]).slice(0, 3).map((b) => (
                    <Link
                      key={b}
                      to={`/past-papers/results?filter_boards=${encodeURIComponent(b)}`}
                      className="flex h-[38px] shrink-0 items-center gap-[7px] whitespace-nowrap rounded-full bg-brand-blue-subtle px-3.5 text-[13px] font-semibold text-brand-blue transition-transform duration-tap ease-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0"
                    >
                      <span aria-hidden className="h-2 w-2 rounded-[2px] bg-brand-blue" />
                      {b} · {paperBoardCounts[b]}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* D1's overlapping face stack. Desktop only — the mobile drawing
                has no equivalent and the facet pills already carry the count
                there. The faces are the real featured teachers rendered
                further down this same page, not stock or invented portraits,
                and it draws nothing at all until at least three of them have
                a photo. */}
            {featuredWithPhotos.length >= 3 && (stats.teachers ?? 0) > 0 && (
              <div className="mt-4 hidden items-center gap-3 lg:flex">
                <div className="flex -space-x-3">
                  {featuredWithPhotos.slice(0, 5).map((t) => (
                    <img
                      key={t.id}
                      src={validateImageSrc(t.image_url)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                </div>
                {/* A pill, like every other small fact on this page. It was
                    bare grey text sitting beside a row of avatars, which read
                    as a caption someone forgot to style rather than as part of
                    the same family as the facet pills directly above it. */}
                <span className="flex h-[34px] items-center gap-[7px] whitespace-nowrap rounded-full bg-muted px-3.5 text-[13px] font-semibold text-foreground">
                  <ShieldCheck className="h-[15px] w-[15px] flex-none text-brand-deep" strokeWidth={2.25} aria-hidden="true" />
                  {stats.teachers} verified tutors in Kolkata
                </span>
              </div>
            )}
          </BentoPanel>

          {/* ---------------------------------------------------------- 2 · Search */}
          <SearchDesk onModeChange={setHeroMode} />

          {/* Compact form of the same notice Browse carries. Sits under the
              search rather than above it: the point is to catch someone as
              they go to search, not to greet them with a caveat. It renders
              nothing at all unless location is already known AND outside West
              Bengal — it never prompts from here. */}
          <RegionNotice variant="inline" />
            </div>

            {/* lg:pt-[72px] matches the nav reserve the greeting panel gets from
                `edge="top"`. At lg this column is the RIGHT half of D-005's
                `grid-cols-[1.15fr_1fr]` hero, so it starts at y=0 like the
                left one — but it holds no `edge="top"` panel, so nothing was
                clearing the floating top bar and the first fork's heading sat
                underneath it. The left column's reserve only offsets its own
                cell. */}
            <div className="flex flex-col gap-seam lg:gap-2 lg:pt-[72px] [&>*]:lg:flex-1 [&>*]:lg:flex [&>*]:lg:flex-col [&>*]:lg:justify-between">
          {/* --------------------------------------------------- 3 · Teachers fork */}
          <BentoPanel fill="brandTint" className="!px-[22px] !pt-[18px] !pb-5 lg:!px-8 lg:!pt-8 lg:!pb-8">
            <div className="flex items-center justify-between">
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-brand text-[#1F1F1F]">
                <Users className="h-[19px] w-[19px]" strokeWidth={2.25} aria-hidden />
              </span>
              {featuredWithPhotos.length > 0 && (
                <div className="flex items-center">
                  <div className="flex -space-x-2.5">
                    {featuredWithPhotos.slice(0, 3).map((t) => (
                      <img
                        key={t.id}
                        src={validateImageSrc(t.image_url)}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        width={30}
                        height={30}
                        className="h-[30px] w-[30px] rounded-full object-cover ring-2 ring-brand-subtle"
                      />
                    ))}
                  </div>
                  <Link
                    to="/all-tuition-teachers-in-kolkata"
                    aria-label="Find a teacher"
                    className="tap-44 ml-2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-panel text-background transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/all-tuition-teachers-in-kolkata"
              className="group mt-[14px] block rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            >
              <p className="text-[12.5px] font-medium text-warm-secondary">Find a teacher</p>
              <p className="mt-[2px] font-display text-[25px] font-extrabold leading-[1.05] tracking-[-0.045em]">
                <span className="text-brand-deep decoration-2 underline-offset-4 group-hover:underline">Message them</span>{' '}
                <span className="font-normal text-foreground">yourself, free</span>
              </p>
            </Link>
          </BentoPanel>

          {/* ----------------------------------------------------- 4 · Papers fork */}
          <BentoPanel fill="papersTint" className="!px-[22px] !pt-[18px] !pb-5 lg:!px-8 lg:!pt-8 lg:!pb-8">
            {/* Same top-left icon-badge treatment as the teachers fork above
                (Users, bg-brand) — this panel had no equivalent icon at all. */}
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-brand-blue text-white">
              <BookOpen className="h-[19px] w-[19px]" strokeWidth={2.25} aria-hidden />
            </span>
            <Link
              to="/past-papers"
              className="group mt-[14px] flex items-center justify-between gap-3 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            >
              <div>
                <p className="text-[12.5px] font-medium text-warm-secondary">Past papers</p>
                <p className="mt-[2px] font-display text-[22px] font-extrabold tracking-[-0.04em]">
                  <span className="text-brand-blue-deep">Revise</span>{' '}
                  <span className="font-normal text-foreground">for free</span>
                </p>
              </div>
              <span
                aria-hidden
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-blue text-white transition-transform duration-hover ease-settle group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:transform-none"
              >
                <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </span>
            </Link>
          </BentoPanel>
            </div>
          </div>

          {/* --------------------------------------------- 5 · 01 Featured teachers */}
          <BentoPanel fill="card" className="!px-0 !py-[22px] lg:!py-8">
            <div className="px-[22px]">
              <NumberedHeading
                size="compact"
                line1="Start with the"
                ordinal="01"
                line2="teachers parents pick"
              />
            </div>

            {loading ? (
              <div className="mt-4 grid grid-cols-2 gap-4 px-[22px] sm:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : leadTeacher ? (
              /* A carousel at every width. D-005 called for a grid-cols-4 at
                 lg on the reasoning that a wide column should not hide cards
                 behind a drag gesture — but at 1900px that grid gave each card
                 a ~450px portrait, so the row read as a photo gallery and
                 pushed the rest of the page off the fold. Fixed-width cards
                 keep the photo small AND let the row show that more teachers
                 exist than fit, which is what a featured rail is for. */
              <div className="mt-4 overflow-x-auto overflow-y-visible px-[22px] pt-3 scrollbar-hide">
                <ul className="flex w-max snap-x snap-mandatory gap-3">
                  {featuredTeachers.map((t) => (
                    <li key={t.id} className="w-[168px] flex-none snap-start lg:w-[196px]">
                      <TeacherCard
                        id={t.id}
                        name={t.name}
                        slug={t.slug}
                        subject={t.featuredSubjectLabel || t.subjects?.name || 'Tuition Teacher'}
                        subjectSlug={t.subjects?.slug}
                        imageUrl={t.image_url ?? undefined}
                        verified={t.is_verified ?? undefined}
                        variant="grid-compact"
                        sirMaam={t.sirMaam ?? null}
                        minFees={t.minFees}
                        maxFees={t.maxFees}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="px-[22px] pt-3">
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
              </div>
            )}

            <Link
              to="/all-tuition-teachers-in-kolkata"
              className="flex h-11 items-center gap-2 whitespace-nowrap px-[22px] pt-[18px] text-body-secondary font-medium text-brand-blue transition-colors duration-tap hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {(stats.teachers ?? 0) > 0 ? `All ${stats.teachers} teachers` : 'All teachers'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </BentoPanel>

          {/* Subjects (6) / Board (7) / Class (9) as one row at lg — was three
              full-width panels stacked vertically. An equal grid-cols-3 (each
              exactly 1/3) squeezed content built for full page width — the
              5-across board row and 12-across class row both truncated/
              wrapped badly inside a plain third. Weighted instead: subjects
              needs the most room (an internal 2-up card grid), board and
              class need less (short pills / a compact number grid), and
              their own internal breakpoints below are re-tuned for these
              narrower columns rather than the page-width ones they had. */}
          <div className="lg:grid lg:grid-cols-[1.3fr_0.85fr_0.85fr] lg:items-stretch lg:gap-2">
          {/* --------------------------------------------------------- 6 · Subjects */}
          <BentoPanel fill="card" className="p-[22px]">
            <NumberedHeading
              size="compact"
              line1="Or go straight"
              ordinal="02"
              line2="to the subject"
              support="Every board, classes 9 to 12."
            />

            {loading && subjects.length === 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : subjects.length > 0 ? (
              /* Was lg:grid-cols-4 — that assumed the full page width this
                 panel no longer has now that it shares a row with Board and
                 Class. 2-up still gives each subject card real room in its
                 narrower column. */
              <div className="mt-4 grid grid-cols-2 gap-2">
                {subjects.slice(0, 8).map((s) => (
                  <SubjectCard key={s.id} name={s.name} slug={s.slug} context="teachers" teacherCount={s.teacherCount} paperCount={s.paperCount} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyResults
                  icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                  heading="Subjects are being updated"
                  message="Please check back shortly. You can still search for any subject directly."
                  action={{ label: 'Browse all teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
                />
              </div>
            )}
          </BentoPanel>

          {/* ---------------------------------------------------- 7 · Your board */}
          {Object.keys(boardCounts).length > 0 && (
            <BentoPanel fill="card" className="p-[22px]">
              <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground lg:text-[26px]">
                Your board
              </h2>
              {/* Was a 5-across row at lg, sized for the full page width this
                  panel no longer has (it now shares a row with Subjects and
                  Class) — squeezed into ~300px, 5 columns truncated "141
                  tutors" past recognition. Back to the plain stacked list at
                  every width, which is what this panel's own narrower column
                  actually has room for. */}
              <div className="stagger-children mt-[14px] space-y-2">
                {BOARD_ORDER.filter((b) => boardCounts[b]).map((b, i) => (
                  <Link
                    key={b}
                    to={`/all-tuition-teachers-in-kolkata?filter_boards=${encodeURIComponent(b)}`}
                    className={`flex h-[52px] min-h-[44px] items-center justify-between gap-2 rounded-full px-[18px] transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-card-reveal ${BOARD_FILLS[b] ?? 'bg-muted text-foreground'} ${BOARD_TILT_CLASSES[i % BOARD_TILT_CLASSES.length]}`}
                  >
                    <span className="font-display text-[17px] font-bold">{b}</span>
                    <span className="text-[14px] tabular-nums opacity-80">
                      {boardCounts[b]} {boardCounts[b] === 1 ? 'tutor' : 'tutors'}
                    </span>
                  </Link>
                ))}
              </div>
            </BentoPanel>
          )}

          {/* --------------------------------------------------------- 9 · By class */}
          <BentoPanel fill="card" className="p-[22px]">
            <NumberedHeading
              size="compact"
              line1="Or by the class"
              ordinal="03"
              line2="they are sitting"
              support="Classes 1 through 12."
            />

            {/* 02a §9 specifies `grid-cols-6 gap-2 sm:grid-cols-8
                lg:grid-cols-12`, and that is exactly what runs from 360px up.
                Below 360 the six columns work out to 39px each, under the
                C-013 44px floor — a width the handoff never draws, so the
                sub-360 sliver falls back to four columns of the same chip at
                the same gap.
                lg:grid-cols-12 assumed this panel had the full page width;
                sharing a row with Subjects/Board now, 12 across a ~300px
                column worked out to ~20px chips. Capped at 4 (3 rows of 4)
                instead, which is what this column actually has room for. */}
            <ul className="mt-4 grid grid-cols-4 gap-2 min-[360px]:grid-cols-6 sm:grid-cols-8 lg:grid-cols-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <Link
                    to={`/all-tuition-teachers-in-kolkata?filter_classes=${n}`}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-muted transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <span className="font-display text-[16px] font-extrabold tabular-nums">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </BentoPanel>
          </div>

          {/* ------------------------------------------------------- 10 · New papers */}
          <BentoPanel fill="papers" className="relative overflow-hidden px-[22px] pb-[26px] pt-[22px]">
            <span aria-hidden className="pointer-events-none absolute -left-10 top-0 h-[160px] w-[160px] rounded-full bg-white/[.06]" />
            <span aria-hidden className="pointer-events-none absolute -right-10 top-10 h-[190px] w-[190px] rounded-full bg-white/[.06]" />

            {/* Two columns from lg. As one centred stack the tray was capped
                at 420px, so on a 1900px screen this panel was mostly empty
                blue with a small huddle of covers in the middle. Copy and CTA
                on one side, the shelf on the other, and the shelf shows five
                covers instead of three because there is now room for them. */}
            <div className="relative lg:flex lg:items-center lg:gap-12">
              <div className="lg:flex-1">
                <p className="text-[11.5px] font-bold uppercase tracking-[.04em] text-white/70">04</p>
                <h2 className="font-display text-[23px] font-extrabold text-white lg:text-[30px]">the boards set</h2>
                <p className="mt-3 max-w-prose text-[14px] leading-[1.5] text-white/80 lg:text-[15px]">
                  {/* Not "from Kolkata schools": the question bank added 193 ICSE
                      and CBSE papers from schools across India, and a handful of
                      the covers beside this line are from Mumbai and Bengaluru. */}
                  Free past papers: ICSE, CBSE and ISC, classes 9 to 12, read as questions with
                  marks, chapters and figures.
                </p>
                <Link
                  to="/past-papers"
                  className="mt-4 inline-flex h-[46px] items-center gap-2 whitespace-nowrap rounded-full bg-warm-card px-6 text-[14px] font-extrabold text-brand-blue-deep transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
                >
                  Browse past papers
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {recentPapers.length > 0 ? (
                <div className="mx-auto mt-6 w-full max-w-[420px] rounded-t-[24px] border-[1.5px] border-b-0 border-dashed border-white/45 px-4 pb-3 pt-4 lg:mx-0 lg:mt-0 lg:max-w-none lg:flex-[1.2]">
                  {/* justify-start, not center: a centred flex row whose content
                      overflows is clipped at BOTH ends, and the part past the
                      start edge cannot be scrolled back to. With ten covers in
                      here that would strand the first few. */}
                  <div className="scrollbar-hide flex items-end justify-start gap-3 overflow-x-auto overflow-y-visible">
                    {recentPapers.slice(0, 10).map((p, i) => (
                      <PaperCover
                        key={p.id}
                        paper={p}
                        href={`/past-papers/${p.id}`}
                        size="mobile"
                        /* Three fit a phone; the rest are there to scroll to. */
                        className="flex-none" 
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-5 lg:flex-1">
                  <EmptyResults
                    icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                    heading="Papers are being added"
                    message="Free ICSE, CBSE and ISC papers. Check back shortly."
                    action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
                  />
                </div>
              )}
            </div>
          </BentoPanel>

          {/* "Then talk to them yourself" (how-it-works, moved here from
              between Board/Class above) paired in line with "Why guardians
              use Shikshaq" — both are "why trust this" content, and neither
              needed the full page width it was taking stacked alone. */}
          {/* items-stretch, not items-start: with unequal content, items-start
             let the shorter panel (guardian trust) stop where its content
             ended, leaving flat blank canvas below it while the taller panel
             kept going — a visible gap on the right. Stretched, both panels'
             own fill colour runs the full shared height instead. */}
          <div className="lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-2">
          {/* --------------------------------------------------- 8 · How it works */}
          {/* No mt-seam. BentoStack already owns the 6px seam between every pair
              of panels (T-004/D-002); adding one here stacked on top of it and
              made this the only 12px gap on the page — the "extra padding
              between the rounded sections" report. */}
          <BentoPanel fill="brand" className="relative overflow-visible px-[22px] pb-6 pt-[26px]">
            {/* D-007: tilt flattens at `lg` — a 6deg tilt on a 340px badge
                reads as charm, the same tilt on a 1100px-wide row reads as
                broken. Implemented as lg:rotate-0, mobile tilt untouched. */}
            <span
              aria-hidden
              className="absolute right-[22px] top-[-12px] -rotate-[6deg] rounded-full bg-panel px-3 py-1.5 text-[11px] font-bold text-background motion-reduce:rotate-0 lg:rotate-0"
            >
              Takes 3 minutes
            </span>

            <p className="text-[11.5px] font-bold uppercase tracking-[.04em] text-white/75">
              02 · Two minutes, start to finish
            </p>
            <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-[-0.045em] text-white">
              Then talk to them yourself
            </h2>

            {/* D-005 "Home how-it-works": 3 steps stacked below `lg`. Was 3
                columns from `lg` too, but this panel is now half the row's
                width there (paired with Guardian trust beside it), so 3
                columns squeezed each step's text under its own icon —
                kept a single column at every width instead. */}
            <ol className="mt-[22px] flex flex-col gap-[18px]">
              {[
                { icon: <Search />, title: 'Tell us the subject', body: 'Subject, class and your area. Three taps, no account needed.' },
                { icon: <Users />, title: 'Compare real profiles', body: 'Rates, boards, reviews and travel radius, all on one card.' },
                { icon: <MessageCircle />, title: 'Message on WhatsApp', body: 'Talk to the teacher directly. Shikshaq never sits in the middle.' },
              ].map((step) => (
                <li key={step.title} className="flex flex-col">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/15 text-white [&_svg]:size-5">
                    {step.icon}
                  </span>
                  <h3 className="mt-[10px] font-display text-[17px] font-bold text-white">{step.title}</h3>
                  <p className="mt-1 text-[14px] leading-[1.5] text-white/85">{step.body}</p>
                </li>
              ))}
            </ol>

            <p className="mt-[22px] text-[14px] text-white/80">
              No fees, no middleman, no commission, ever.
            </p>
          </BentoPanel>

          {/* --------------------------------------------------- 11 · Guardian trust */}
          <BentoPanel fill="brandTint" className="p-[22px]">
            <div className="flex items-center gap-3">
              <IconDisc tone="brand" size={38} shape="square"><ShieldCheck className="h-[19px] w-[19px]" /></IconDisc>
              <h2 className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-brand-deep lg:text-[28px]">Why guardians use Shikshaq</h2>
            </div>
            <ul className="mt-[18px] flex flex-col gap-4">
              {[
                { icon: <ShieldCheck />, title: 'Verified, every one', body: 'ID and degree checked by a human before a profile goes live.' },
                { icon: <IndianRupee />, title: 'No commission, ever', body: 'Teachers keep every rupee of their fee. We never invoice anyone.' },
                { icon: <Users />, title: 'Reviews you can trust', body: 'Every review comes from a student who actually messaged the teacher.' },
              ].map((row) => (
                <li key={row.title} className="flex items-start gap-3">
                  <IconDisc tone="muted" size={36} className="text-brand-deep"><span className="[&_svg]:h-[17px] [&_svg]:w-[17px]">{row.icon}</span></IconDisc>
                  <div>
                    <p className="text-[16px] font-semibold text-brand-deep">{row.title}</p>
                    <p className="mt-0.5 text-[14px] leading-[1.5] text-warm-prose">{row.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </BentoPanel>
          </div>

          {/* ------------------------------------------------------ 12 · From students */}
          {studentQuotes.length > 0 && (
            <BentoPanel fill="card" className="!px-0 !py-[22px] lg:!py-8">
              <div className="px-[22px]">
                <div className="flex items-center gap-3">
                  <IconDisc tone="muted" size={32} shape="square" className="!rounded-xl"><MessageCircle /></IconDisc>
                  <h2 className="font-display text-[22px] font-extrabold lg:text-[28px]">From students</h2>
                </div>
                {/* Without this line the rail is a wall of praise for people
                    the reader has never heard of — "Ashok sir explains
                    clearly" means nothing until you know Ashok sir is on this
                    site and one tap away. */}
                <p className="mt-1.5 text-[14px] leading-[1.5] text-warm-secondary">
                  Every one of them found their teacher here. Tap a name to see that teacher.
                </p>
              </div>

              {/* D-005 doesn't itemize this rail by name, but its own
                  "rails become grids, they do not become wider rails"
                  warning applies here exactly as it does to the featured
                  rail it does name — at 1280px this stayed a flex-nowrap
                  scroller (scrollWidth > clientWidth), hiding quotes past
                  the third behind an edge nobody drags. */}
              <div className="mt-4 overflow-x-auto overflow-y-visible px-[22px] scrollbar-hide lg:overflow-x-visible">
                <ul className="flex w-max gap-3 lg:grid lg:w-auto lg:grid-cols-3">
                  {studentQuotes.map((q) => (
                    <li
                      key={q.id}
                      className="relative flex w-[268px] flex-none flex-col rounded-[20px] bg-muted p-[18px] pt-[22px] lg:w-auto"
                    >
                      {/* A real quote mark, set large and low-contrast behind
                          the opening line. The card was three stacked blocks of
                          near-identical grey; this gives it a top and tells you
                          at a glance that the thing you are reading is somebody
                          speaking. aria-hidden because the quotation is already
                          punctuated in the text. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1 select-none font-display text-[54px] leading-none text-foreground/[0.07]"
                      >
                        &rdquo;
                      </span>

                      <p className="relative line-clamp-5 text-[15px] leading-[1.55] text-warm-prose">
                        {q.comment}
                      </p>

                      <div className="mt-auto pt-4">
                        <div className="flex items-center gap-2.5">
                          <StripePlaceholder
                            name={q.authorName}
                            initialSize={14}
                            className="h-[30px] w-[30px] flex-none rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-foreground">{q.authorName}</p>
                            {q.authorMeta && (
                              <p className="truncate text-[12px] text-warm-meta">{q.authorMeta}</p>
                            )}
                          </div>
                        </div>

                        {/* The teacher, on its own line under the attribution
                            and reading as a sentence rather than a bare pill:
                            it is the answer to "who is this about", which the
                            name above does not give you. */}
                        {q.teacherName && q.teacherSlug && (
                          <Link
                            to={`/tuition-teachers/${q.teacherSlug}`}
                            className="mt-2.5 flex min-h-11 items-center gap-1.5 text-[12.5px] text-warm-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                            <span className="min-w-0 truncate">
                              on <span className="font-bold text-foreground">{q.teacherName}</span>
                            </span>
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoPanel>
          )}

          {/* ------------------------------------------------------- 13 · Recommend */}
          <BentoPanel fill="card" className="!px-[22px] !py-[18px] lg:!px-8 lg:!py-8">
            <Link
              to="/recommend-teacher"
              className="flex items-center gap-[14px] transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <IconDisc tone="muted" size={44}>
                <GraduationCap />
              </IconDisc>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-foreground">Know a good teacher?</p>
                <p className="mt-0.5 text-[14px] leading-[1.45] text-warm-secondary">Recommend them and we'll reach out and get them listed, free.</p>
              </div>
              <ArrowRight className="h-5 w-5 flex-none text-warm-label" aria-hidden="true" />
            </Link>
          </BentoPanel>

          {/* HomeGreeting / HomeActivitySection (Favourites, Recently visited) are
              real, existing localStorage/likes-backed features with no home in
              the mockup's own section order. Kept, moved below the mockup's own
              sections, just above the eyes panel, rather than deleted.
              p-[22px] like every other card panel on this page — the mockup
              never draws this one, and BentoPanel's 20px default left it the
              single odd inset in the stack. */}
          <BentoPanel fill="card" className="p-[22px]">
            <HomeGreeting />
            <HomeActivitySection />
          </BentoPanel>

          {/* ---------------------------------------- 14 · Eyes + sentence builder */}
          <EyesPanel
            mode={builderMode}
            onModeChange={setBuilderMode}
            heading={(
              <>
                Still deciding? <span className="font-extrabold">We&rsquo;re watching out for you.</span>
              </>
            )}
            subline="Fill in the blanks and we'll take you straight there."
            slots={builderSlots}
            onSlotChange={handleSlotChange}
            onSubmit={handleBuilderSubmit}
            count={builderMode === 'teachers' ? (stats.teachers || undefined) : (stats.papers || undefined)}
          />
        </BentoStack>
      </main>

      {/* Opened by tapping the wordmark in the nav (components.md C10). The
          trigger dispatches an event rather than reaching in through props,
          since the logo lives in Navbar and the tour is mounted here. */}
      <ProductTour open={tourOpen} onOpenChange={setTourOpen} />
    </div>
  );
}
