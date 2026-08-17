import { useEffect, useState } from 'react';
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
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeGreeting } from '@/components/HomeGreeting';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { SearchDesk } from '@/components/home/SearchDesk';
import { PageContainer, ControlBlock } from '@/components/layout/PageContainer';
import { BottomNavSpacer } from '@/components/layout/PageContainer';
import { PreFooter } from '@/components/layout/PreFooter';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Sticker } from '@/components/ui/sticker';
import { IconDisc } from '@/components/ui/icon-disc';
import { Chip } from '@/components/ui/chip';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { useRequireRole } from '@/hooks/use-require-role';
import { getCache, setCache, CACHE_TTL, clearExpiredCache } from '@/utils/cache';
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
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [boardCounts, setBoardCounts] = useState<Record<string, number>>({});
  const [classCounts, setClassCounts] = useState<Record<number, number>>({});
  const [recentPapers, setRecentPapers] = useState<RecentPaper[]>([]);
  const [studentQuotes, setStudentQuotes] = useState<StudentQuote[]>([]);
  const [stats, setStats] = useState({ teachers: null as number | null, papers: null as number | null, reviews: null as number | null });

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

  useEffect(() => {
    async function fetchData() {
      try {
        const featuredCacheKey = 'featured_teachers_index_v4';
        const cachedFeatured = getCache<Teacher[]>(featuredCacheKey);
        const subjectsCacheKey = 'subjects_index_v4';
        const cachedSubjects = getCache<Subject[]>(subjectsCacheKey);

        if (cachedFeatured?.length && cachedSubjects?.length) {
          setFeaturedTeachers(cachedFeatured);
          setSubjects(cachedSubjects);
          setLoading(false);
        }

        const desiredSubjects = ['Chemistry', 'Hindi', 'English', 'Maths', 'Mathematics', 'Psychology', 'Computers', 'Computer', 'Accounts', 'Biology', 'Economics'];
        const [subjectsRes, upvotesRes, allTeachersRes, papersRes] = await Promise.all([
          supabase.from('subjects').select('*').in('name', desiredSubjects).limit(10),
          supabase.from('teacher_upvotes').select('teacher_id'),
          supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, is_verified, subject_id, classes, subjects(name, slug), subjects_text:subjects')
            .limit(200),
          supabase.from('papers').select('board, class').eq('is_published', true),
        ]);

        if (subjectsRes.error || upvotesRes.error) {
          setLoadError(true);
          setLoading(false);
          return;
        }

        const allTeachers = allTeachersRes.data || [];

        // Top upvoted teachers from teachers_list, limit 6. Fill any remainder
        // randomly so the grid never renders fewer than 6 tiles when upvotes
        // are sparse.
        let teachersData: typeof allTeachers = [];
        if (upvotesRes.data && upvotesRes.data.length > 0) {
          const upvoteCounts = new Map<string, number>();
          upvotesRes.data.forEach((u) => upvoteCounts.set(u.teacher_id, (upvoteCounts.get(u.teacher_id) || 0) + 1));
          const topIds = Array.from(upvoteCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id]) => id);
          const teacherMap = new Map(allTeachers.map((t) => [t.id, t]));
          teachersData = topIds.map((id) => teacherMap.get(id)).filter(Boolean) as typeof allTeachers;
        }
        if (teachersData.length < 6) {
          const existingIds = new Set(teachersData.map((t) => t.id));
          const shuffled = allTeachers.filter((t) => !existingIds.has(t.id)).sort(() => Math.random() - 0.5);
          teachersData = [...teachersData, ...shuffled.slice(0, 6 - teachersData.length)];
        }

        if (teachersData.length > 0) {
          const processed: Teacher[] = teachersData.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            slug: teacher.slug,
            image_url: teacher.image_url,
            is_verified: (teacher as { is_verified?: boolean | null }).is_verified,
            subjects: teacher.subjects as { name: string; slug: string } | null,
            featuredSubjectLabel: teacher.subjects?.name ?? null,
          }));
          setFeaturedTeachers(processed);
          setCache(featuredCacheKey, processed, CACHE_TTL.FEATURED_TEACHERS);
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

          setSubjects(withCounts);
          setCache(subjectsCacheKey, withCounts, CACHE_TTL.SUBJECTS);
        }

        // Board pill stack — real counts of published papers per board (papers
        // table has a `board` column; there is no reliable per-board teacher
        // count today, so this section counts papers, not tutors — O-01).
        const boardTally: Record<string, number> = {};
        (papersRes.data || []).forEach((p) => {
          const key = BOARD_ORDER.find((b) => b.toLowerCase() === (p.board || '').toLowerCase()) || null;
          if (key) boardTally[key] = (boardTally[key] || 0) + 1;
        });
        setBoardCounts(boardTally);

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
        setClassCounts(classTally);
      } catch (error) {
        setLoadError(true);
        if (import.meta.env.DEV) console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    clearExpiredCache();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [teachersRes, papersRes, reviewsRes] = await Promise.all([
          supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
          supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
          supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('approved', true),
        ]);
        setStats({ teachers: teachersRes.count ?? null, papers: papersRes.count ?? null, reviews: reviewsRes.count ?? null });
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error fetching homepage stats:', error);
      }
    }
    fetchStats();
  }, []);

  // New papers — the three most recently published papers, real order by
  // created_at desc (C-007 / O-01: the query just needed a `board`/`class`
  // select added, the ordering itself already exists on the table).
  useEffect(() => {
    async function fetchRecentPapers() {
      const { data } = await supabase
        .from('papers')
        .select('id, title, school, board, class, year, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      setRecentPapers((data || []) as RecentPaper[]);
    }
    fetchRecentPapers();
  }, []);

  // Student quote rail (C-009) — real, approved teacher_comments only. Never
  // ships placeholder quotes (design.md §0.10 / changelog notes).
  useEffect(() => {
    async function fetchQuotes() {
      const { data: comments } = await supabase
        .from('teacher_comments')
        .select('id, comment, is_anonymous, user_id, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (!comments || comments.length === 0) return;

      const userIds = [...new Set(comments.filter((c) => !c.is_anonymous).map((c) => c.user_id))];
      const profilesMap = new Map<string, { full_name: string | null; role: string | null; school_college: string | null; grade: string | null }>();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('public_profiles')
          .select('id, full_name, role, school_college, grade')
          .in('id', userIds);
        (profiles || []).forEach((p) => {
          if (p.id) profilesMap.set(p.id, p);
        });
      }

      const quotes: StudentQuote[] = comments.map((c) => {
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
      setStudentQuotes(quotes);
    }
    fetchQuotes();
  }, []);

  const [heroMode, setHeroMode] = useState<SearchMode>('teachers');
  const isPapersMode = heroMode === 'papers';

  const leadTeacher = featuredTeachers[0];
  const railTeachers = featuredTeachers.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content" className="pb-20 lg:pb-0">
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
              <Eyebrow onDark>Tutors &amp; past papers, Kolkata</Eyebrow>
              <h1 className="font-display text-display-hero font-black leading-[0.98] text-background">
                Who do you need to{' '}
                <span
                  className="marker-highlight marker-highlight--tilt"
                  style={{ '--marker-color': 'hsl(var(--brand))' } as React.CSSProperties}
                >
                  learn from?
                </span>
              </h1>

              {/* Stat pills — mockup shows two tilted badges here; real counts
                  only (design.md §0.10), so they render once both queries have
                  resolved rather than ever showing a fabricated number. Chips
                  never tilt per components.md P2, so this is a plain pill row
                  rather than the mockup's hand-placed tilt — deliberate
                  token-system deviation. */}
              {/* Guarded on > 0, not on != null. design.md §3.2 is explicit that we
                  never advertise emptiness — "0 free papers" is worse than saying
                  nothing, and a real zero is a plausible state here while the paper
                  library is still filling up. A count of zero drops its pill entirely. */}
              {((stats.teachers ?? 0) > 0 || (stats.papers ?? 0) > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {(stats.teachers ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-meta font-bold text-foreground">
                      <span className="h-[7px] w-[7px] rounded-full bg-brand" aria-hidden="true" />
                      {stats.teachers} verified tutors
                    </span>
                  )}
                  {(stats.papers ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-meta font-bold text-foreground">
                      <span className="h-[7px] w-[7px] rounded-full bg-brand-blue" aria-hidden="true" />
                      {stats.papers} free papers
                    </span>
                  )}
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

        <HomeGreeting />
        <HomeActivitySection />

        {/* --------------------------------------------------- 01 Featured teachers */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="space-y-6">
            <NumberedHeading
              line1="Start with the teachers"
              ordinal="01"
              line2="parents pick"
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
              All teachers
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
                    {boardCounts[b]} {boardCounts[b] === 1 ? 'paper' : 'papers'}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        )}

        {/* --------------------------------------------------------- Ticker rail */}
        {subjects.length > 0 && (
          <PageContainer as="section" className="pb-8 sm:pb-12">
            <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
              <ul className="flex w-max items-center gap-2">
                {[...subjects.map((s) => s.name), ...BOARD_ORDER.filter((b) => boardCounts[b])].map((label) => (
                  <li key={label}>
                    <Chip
                      tone="facet"
                      size={40}
                      onClick={() => navigate(`/all-tuition-teachers-in-kolkata?q=${encodeURIComponent(label)}`)}
                    >
                      {label}
                    </Chip>
                  </li>
                ))}
              </ul>
            </div>
          </PageContainer>
        )}

        {/* ------------------------------------------------------ How it works */}
        <PageContainer as="section" className="py-8 sm:py-12">
          <div className="relative overflow-hidden rounded-4xl bg-brand p-6 text-brand-foreground shadow-glow-brand sm:p-8">
            <Sticker tone="dark" tilt={-6} size={30} className="right-6 sm:right-10">
              Takes 3 minutes
            </Sticker>

            <Eyebrow onDark className="text-brand-foreground/70">
              02 · Two minutes, start to finish
            </Eyebrow>
            <h2 className="mt-2 font-display text-section-head font-extrabold lg:text-page-title">
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
          </div>
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
            <NumberedHeading line1="Or read what" ordinal="04" line2="the boards set" />

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

            <Link
              to="/past-papers"
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg text-body-secondary font-medium text-brand-blue transition-colors duration-150 hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              All past papers
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
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

        <PreFooter variant="B1" />
        <BottomNavSpacer />
      </main>

      <Footer />
    </div>
  );
}
