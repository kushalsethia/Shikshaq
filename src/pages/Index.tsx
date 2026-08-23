import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { logger } from '@/utils/logger';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeGreeting } from '@/components/HomeGreeting';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { SearchDesk } from '@/components/home/SearchDesk';
import { EyesPanel } from '@/components/home/EyesPanel';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { useChromeConfig } from '@/components/layout/AppShell';
import { ProductTour, useProductTour } from '@/components/ProductTour';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { IconDisc } from '@/components/ui/icon-disc';
import { PaperCover } from '@/components/papers/paper-cover';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import type { SentenceSlot } from '@/components/home/SentenceBuilder';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { resolveHeroCopy } from '@/lib/hero-copy';
import { getSubjectPalette } from '@/lib/subject-palette';
import { useRequireRole } from '@/hooks/use-require-role';
import { clearExpiredCache } from '@/utils/cache';
import { getShikshaqmineBasicBySlugs } from '@/lib/teachers';
import { generateLocalBusinessSchema, generateServiceSchema } from '@/utils/structuredDataGenerators';
import { SUBJECTS, CLASSES, AREAS, BOARDS } from '@/utils/searchFacets';
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

  // Handoff H-023: the sentence builder moved out of Footer.tsx, "move not
  // copy" — same component, same slot logic and submit routes, just owned
  // here now since this is the one page that renders it. schoolOptions is
  // the one genuinely new query this move needs (Footer used to fetch it for
  // the same purpose); teacher/paper counts reuse the `stats` query above
  // instead of re-fetching them a second time.
  const [builderMode, setBuilderMode] = useState<SearchMode>('teachers');
  const [teacherSlotValues, setTeacherSlotValues] = useState<Record<string, string>>({});
  const [paperSlotValues, setPaperSlotValues] = useState<Record<string, string>>({});

  const schoolOptionsQuery = useQuery({
    queryKey: ['home', 'school-options'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase.from('papers').select('school').eq('is_published', true);
      return data ? Array.from(new Set(data.map((p) => p.school))).sort() : [];
    },
  });
  const schoolOptions = schoolOptionsQuery.data ?? [];

  const teacherSlots: SentenceSlot[] = useMemo(() => ([
    { key: 'subject', placeholder: 'subject', value: teacherSlotValues.subject, options: SUBJECTS },
    { key: 'cls', placeholder: 'class', value: teacherSlotValues.cls, options: CLASSES.map((c) => `Class ${c}`) },
    { key: 'area', placeholder: 'area', value: teacherSlotValues.area, options: AREAS },
  ]), [teacherSlotValues]);

  const paperSlots: SentenceSlot[] = useMemo(() => ([
    { key: 'board', placeholder: 'board', value: paperSlotValues.board, options: BOARDS },
    { key: 'cls', placeholder: 'class', value: paperSlotValues.cls, options: CLASSES.map((c) => `Class ${c}`) },
    { key: 'subject', placeholder: 'subject', value: paperSlotValues.subject, options: SUBJECTS },
    { key: 'school', placeholder: 'school', value: paperSlotValues.school, options: schoolOptions },
  ]), [paperSlotValues, schoolOptions]);

  const handleSlotChange = useCallback((key: string, value: string) => {
    if (builderMode === 'teachers') {
      setTeacherSlotValues((prev) => ({ ...prev, [key]: value }));
    } else {
      setPaperSlotValues((prev) => ({ ...prev, [key]: value }));
    }
  }, [builderMode]);

  const handleBuilderSubmit = useCallback(() => {
    if (builderMode === 'teachers') {
      const params = new URLSearchParams();
      if (teacherSlotValues.subject) params.set('filter_subjects', teacherSlotValues.subject);
      if (teacherSlotValues.cls) params.set('filter_classes', teacherSlotValues.cls.replace(/^Class /, ''));
      if (teacherSlotValues.area) params.set('filter_areas', teacherSlotValues.area);
      const qs = params.toString();
      navigate(`/all-tuition-teachers-in-kolkata${qs ? `?${qs}` : ''}`);
    } else {
      const params = new URLSearchParams();
      if (paperSlotValues.board) params.set('filter_boards', paperSlotValues.board);
      if (paperSlotValues.cls) params.set('filter_classes', paperSlotValues.cls.replace(/^Class /, ''));
      if (paperSlotValues.subject) params.set('filter_subjects', paperSlotValues.subject);
      if (paperSlotValues.school) params.set('filter_schools', paperSlotValues.school);
      const qs = params.toString();
      navigate(`/past-papers/results${qs ? `?${qs}` : ''}`);
    }
  }, [builderMode, teacherSlotValues, paperSlotValues, navigate]);

  const [heroMode, setHeroMode] = useState<SearchMode>('teachers');

  /* Only teachers who actually have a photo. The stack is a row of faces; an
     initial placeholder in it would read as a missing image rather than a
     person. */
  const featuredWithPhotos = featuredTeachers.filter((t) => Boolean(t.image_url));

  // H-005 branch 1b needs the single liked teacher's name. H-005 adds no new
  // query, so this only resolves when that teacher is already in the
  // featured list this page already fetched — otherwise 1b falls through to 2.
  const likedSingleTeacherName = useMemo(() => {
    if (likedCount !== 1) return null;
    const [onlyId] = Array.from(likedTeacherIds);
    return featuredTeachers.find((t) => t.id === onlyId)?.name ?? null;
  }, [likedCount, likedTeacherIds, featuredTeachers]);

  const heroCopy = useMemo(
    () => resolveHeroCopy({ profile, likedCount, likedSingleTeacherName }),
    [profile, likedCount, likedSingleTeacherName],
  );
  // The hero's own mode (from the copy resolver) drives the search desk's
  // initial mode too, the same way the old two-line headline used to swap
  // with SearchDesk's onModeChange — except now the direction of truth runs
  // the other way for the papers branch: H-005's branch 5 both names the
  // hero copy AND wants the desk in papers mode from first paint.
  useEffect(() => {
    if (heroCopy.mode === 'papers') setHeroMode('papers');
  }, [heroCopy.mode]);

  const heroAvatarChip = heroCopy.chip === null ? null : (
    <span
      aria-hidden
      className="relative inline-block h-[28px] w-[28px] shrink-0 overflow-hidden rounded-full align-[-6px] ring-1 ring-warm-hairline"
    >
      {featuredTeachers[0]?.image_url ? (
        <img src={featuredTeachers[0].image_url} alt="" className="h-full w-full object-cover" />
      ) : (
        <StripePlaceholder name={featuredTeachers[0]?.name} initialSize={14} className="h-full w-full" />
      )}
    </span>
  );

  const leadTeacher = featuredTeachers[0];

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <BentoStack>
          {/* -------------------------------------------------------- 1 · Greeting */}
          <BentoPanel fill="card" edge="top" className="relative overflow-hidden">
            <p className="mt-[14px] text-[12.5px] font-medium text-warm-tertiary">{heroCopy.eyebrow}</p>
            <h1
              key={heroCopy.before + heroCopy.bold}
              className="animate-hero-swap mt-[6px] font-display text-[34px] font-normal leading-[1.14] tracking-[-0.045em] text-foreground"
            >
              {heroAvatarChip}
              {heroAvatarChip ? ' ' : null}
              {heroCopy.before}
              <span className="font-extrabold">{heroCopy.bold}</span>
              {heroCopy.after}
            </h1>

            {/* H-007: live facet-count pills replace the old stat-pill pair. */}
            {subjects.length > 0 && (
              <div className="-mx-[22px] mt-4 overflow-x-auto px-[22px] scrollbar-hide">
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
                      src={t.image_url as string}
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
                <span className="text-meta font-semibold text-muted-foreground">
                  {stats.teachers} verified tutors in Kolkata
                </span>
              </div>
            )}
          </BentoPanel>

          {/* ---------------------------------------------------------- 2 · Search */}
          <SearchDesk onModeChange={setHeroMode} />

          {/* --------------------------------------------------- 3 · Teachers fork */}
          <BentoPanel fill="brandTint" className="!py-[18px]">
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
                        src={t.image_url as string}
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
                    className="tap-44 ml-2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-panel text-background transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97]"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              )}
            </div>
            <Link to="/all-tuition-teachers-in-kolkata" className="mt-[14px] block">
              <p className="text-[12.5px] font-medium text-warm-secondary">Find a teacher</p>
              <p className="mt-[2px] font-display text-[25px] font-extrabold leading-[1.05] tracking-[-0.045em]">
                <span className="text-brand-deep">Message them</span>{' '}
                <span className="font-normal text-foreground">yourself, free</span>
              </p>
            </Link>
          </BentoPanel>

          {/* ----------------------------------------------------- 4 · Papers fork */}
          <BentoPanel fill="papersTint" className="!py-[18px]">
            <Link to="/past-papers" className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12.5px] font-medium text-warm-secondary">Past papers</p>
                <p className="mt-[2px] font-display text-[22px] font-extrabold tracking-[-0.04em]">
                  <span className="text-brand-blue-deep">Revise</span>{' '}
                  <span className="font-normal text-foreground">for free</span>
                </p>
              </div>
              <span
                aria-hidden
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-blue text-white"
              >
                <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </span>
            </Link>
          </BentoPanel>

          {/* --------------------------------------------- 5 · 01 Featured teachers */}
          <BentoPanel fill="card" className="!px-0 !py-[22px]">
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
              <div className="mt-4 overflow-x-auto overflow-y-visible px-[22px] pt-3 scrollbar-hide">
                <ul className="flex w-max snap-x snap-mandatory gap-3">
                  {featuredTeachers.map((t) => (
                    <li key={t.id} className="w-[168px] flex-none snap-start">
                      <TeacherCard
                        id={t.id}
                        name={t.name}
                        slug={t.slug}
                        subject={t.featuredSubjectLabel || t.subjects?.name || 'Tuition Teacher'}
                        subjectSlug={t.subjects?.slug}
                        imageUrl={t.image_url ?? undefined}
                        verified={t.is_verified ?? undefined}
                        variant="grid-compact"
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

          {/* --------------------------------------------------------- 6 · Subjects */}
          <BentoPanel fill="card">
            <NumberedHeading
              size="compact"
              line1="Or go straight"
              ordinal="02"
              line2="to the subject"
              support="Every board, classes 9 to 12."
            />

            {loading && subjects.length === 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
                ))}
              </div>
            ) : subjects.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
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
            <BentoPanel fill="card">
              <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground">
                Your board
              </h2>
              <div className="stagger-children mt-[14px] space-y-2">
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
            </BentoPanel>
          )}

          {/* ------------------------------------------------------ How it works */}
          <BentoPanel fill="brand" className="relative mt-seam overflow-visible">
            <span
              aria-hidden
              className="absolute right-[22px] top-[-12px] -rotate-[6deg] rounded-full bg-panel px-3 py-1.5 text-[11px] font-bold text-background"
            >
              Takes 3 minutes
            </span>

            <p className="text-[11.5px] font-bold uppercase tracking-[.04em] text-white/75">
              02 · Two minutes, start to finish
            </p>
            <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-[-0.045em] text-white">
              Then talk to them yourself
            </h2>

            <ol className="mt-[22px] flex flex-col gap-[18px] sm:grid sm:grid-cols-3 sm:gap-6">
              {[
                { icon: <Search />, title: 'Tell us the subject', body: 'Subject, class and your area. Three taps, no account needed.' },
                { icon: <Users />, title: 'Compare real profiles', body: 'Rates, boards, reviews and travel radius, all on one card.' },
                { icon: <MessageCircle />, title: 'Message on WhatsApp', body: 'Talk to the teacher directly. ShikshAQ never sits in the middle.' },
              ].map((step, i) => (
                <li key={step.title} className={`flex flex-col ${i > 0 ? 'sm:border-l sm:border-background/25 sm:pl-6' : ''}`}>
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

          {/* --------------------------------------------------------- 9 · By class */}
          <BentoPanel fill="card">
            <NumberedHeading
              size="compact"
              line1="Or by the class"
              ordinal="03"
              line2="they are sitting"
              support="Classes 1 through 12."
            />

            <ul className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
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

          {/* ------------------------------------------------------- 10 · New papers */}
          <BentoPanel fill="papers" className="relative overflow-hidden">
            <span aria-hidden className="pointer-events-none absolute -left-10 top-0 h-[160px] w-[160px] rounded-full bg-white/[.06]" />
            <span aria-hidden className="pointer-events-none absolute -right-10 top-10 h-[190px] w-[190px] rounded-full bg-white/[.06]" />

            <p className="relative text-[11.5px] font-bold uppercase tracking-[.04em] text-white/70">04</p>
            <h2 className="relative font-display text-[23px] font-extrabold text-white">the boards set</h2>

            {recentPapers.length > 0 ? (
              <div className="relative mx-auto mt-5 max-w-[420px] rounded-t-[24px] border-[1.5px] border-b-0 border-dashed border-white/45 px-4 pb-3 pt-4">
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
            ) : (
              <div className="relative mt-5">
                <EmptyResults
                  icon={<FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                  heading="Papers are being added"
                  message="Free, from Kolkata schools. Check back shortly."
                  action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
                />
              </div>
            )}

            <div className="relative mt-5 flex flex-col items-center gap-1 text-center">
              <p className="max-w-prose text-[14px] leading-[1.5] text-white/80">
                Free past papers from Kolkata schools: ICSE, CBSE and ISC, classes 9 to 12.
              </p>
              <Link
                to="/past-papers"
                className="mt-[14px] inline-flex h-[46px] items-center gap-2 whitespace-nowrap rounded-full bg-warm-card px-6 text-[14px] font-extrabold text-brand-blue-deep transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
              >
                Browse past papers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </BentoPanel>

          {/* --------------------------------------------------- 11 · Guardian trust */}
          <BentoPanel fill="brandTint">
            <div className="flex items-center gap-3">
              <IconDisc tone="brand" size={38} shape="square"><ShieldCheck className="h-[19px] w-[19px]" /></IconDisc>
              <h2 className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-brand-deep">Why guardians use ShikshAQ</h2>
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

          {/* ------------------------------------------------------ 12 · From students */}
          {studentQuotes.length > 0 && (
            <BentoPanel fill="card" className="!px-0 !py-[22px]">
              <div className="flex items-center gap-3 px-[22px]">
                <IconDisc tone="muted" size={32} shape="square" className="!rounded-xl"><MessageCircle /></IconDisc>
                <h2 className="font-display text-[22px] font-extrabold">From students</h2>
              </div>

              <div className="mt-4 overflow-x-auto overflow-y-visible px-[22px] scrollbar-hide">
                <ul className="flex w-max gap-3">
                  {studentQuotes.map((q) => (
                    <li key={q.id} className="flex w-[250px] flex-none flex-col gap-[14px] rounded-[20px] bg-muted p-4">
                      <p className="line-clamp-5 text-[14px] leading-[1.55] text-[#4A443E]">&ldquo;{q.comment}&rdquo;</p>
                      <div className="mt-auto flex items-center gap-2">
                        <StripePlaceholder name={q.authorName} initialSize={14} className="h-[26px] w-[26px] flex-none rounded-full" />
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-semibold text-foreground">{q.authorName}</p>
                          {q.authorMeta && <p className="truncate text-[12.5px] text-warm-tertiary">{q.authorMeta}</p>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoPanel>
          )}

          {/* ------------------------------------------------------- 13 · Recommend */}
          <BentoPanel fill="card" className="!py-[18px]">
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
              sections, just above the eyes panel, rather than deleted. */}
          <BentoPanel fill="card">
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
            slots={builderMode === 'teachers' ? teacherSlots : paperSlots}
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
