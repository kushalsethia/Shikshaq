import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, GraduationCap, Sparkles, Users } from 'lucide-react';
import { EmptyResults } from '@/components/EmptyResults';
import { supabase } from '@/integrations/supabase/client';
import { SpeechTag, StarburstBadge } from '@/components/devices';
import { Navbar } from '@/components/Navbar';
import { SearchControl } from '@/components/SearchControl';
import { HowItWorks } from '@/components/HowItWorks';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { HomeGreeting } from '@/components/HomeGreeting';
import { useRequireRole } from '@/hooks/use-require-role';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { getCache, setCache, CACHE_TTL, clearExpiredCache } from '@/utils/cache';
import { generateLocalBusinessSchema, generateServiceSchema } from '@/utils/structuredDataGenerators';

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
// Dense, card-grid sections (Featured teachers, Explore by subject) sit back-to-back
// on the home page — the hero-scale rhythm reads as wasted air between them. One
// spacing step down, still on the §4 scale (12/16/20), keeps the page moving.
const SECTION_TIGHT = 'py-12 sm:py-16 lg:py-20';
const SKELETON = 'bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer';

interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
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

export default function Index() {
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [stats, setStats] = useState({ teachers: null as number | null, papers: null as number | null, schools: null as number | null });

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
        const featuredCacheKey = 'featured_teachers_index_v3';
        const cachedFeatured = getCache<Teacher[]>(featuredCacheKey);
        const subjectsCacheKey = 'subjects_index_v3';
        const cachedSubjects = getCache<Subject[]>(subjectsCacheKey);

        if (cachedFeatured?.length && cachedSubjects?.length) {
          setFeaturedTeachers(cachedFeatured);
          setSubjects(cachedSubjects);
          setLoading(false);
          return;
        }

        const desiredSubjects = ['Chemistry', 'Hindi', 'English', 'Maths', 'Mathematics', 'Psychology', 'Computers', 'Computer', 'Accounts', 'Biology', 'Economics'];
        const [subjectsRes, upvotesRes, allTeachersRes, papersRes] = await Promise.all([
          supabase.from('subjects').select('*').in('name', desiredSubjects).limit(10),
          supabase.from('teacher_upvotes').select('teacher_id'),
          supabase.from('teachers_list').select('id, name, slug, image_url, subject_id, subjects(name, slug), subjects_text:subjects').limit(200),
          supabase.from('papers').select('subject').eq('is_published', true),
        ]);

        if (subjectsRes.error || upvotesRes.error) {
          setLoadError(true);
          setLoading(false);
          return;
        }

        const allTeachers = allTeachersRes.data || [];

        // Top upvoted teachers from teachers_list, limit 6 per pages/Index.md. Fill any
        // remainder randomly so the grid never renders fewer than 6 tiles when upvotes are sparse.
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

          // Teachers list many subjects per person (e.g. "English, Hindi, Physics, ...") —
          // counting only each teacher's single primary `subjects` FK relation undercounted
          // tiles for any subject that wasn't someone's first-listed one. Tokenize the full
          // comma-separated `subjects_text` column instead, with the same Computer/Computers
          // and Maths/Mathematics aliasing `desiredSubjects` already accounts for.
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
            paperCount: (papersRes.data || []).filter((p) => p.subject.toLowerCase() === s.name.toLowerCase()).length,
          }));

          setSubjects(withCounts);
          setCache(subjectsCacheKey, withCounts, CACHE_TTL.SUBJECTS);
        }
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
        const [teachersRes, papersRes, schoolsRes] = await Promise.all([
          supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
          supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
          supabase.from('papers').select('school').eq('is_published', true),
        ]);
        const distinctSchools = schoolsRes.data ? new Set(schoolsRes.data.map((p) => p.school)).size : 0;
        setStats({ teachers: teachersRes.count ?? null, papers: papersRes.count ?? null, schools: distinctSchools });
      } catch (error) {
        // Stats are decorative proof-of-scale numbers with a copy fallback
        // already built into every call site (§13 "never advertise emptiness") —
        // leaving `stats` at its null-initialized state is enough to fail soft.
        if (import.meta.env.DEV) console.error('Error fetching homepage stats:', error);
      }
    }
    fetchStats();
  }, []);

  // Concrete proof, above the fold: real faces of teachers actually on the platform.
  const proofFaces = featuredTeachers.filter((t) => t.image_url).slice(0, 5);

  // Hero mode mirrors SearchControl's own teachers/papers toggle (wired via
  // its `onModeChange` prop) so switching the toggle actually re-colors and
  // re-words the hero instead of just filtering the search field — VISUAL_LANGUAGE
  // §2.2's two-mode color system (orange teacher-mode / blue papers-mode) applied
  // to the one hero that was silently exempt from it.
  const [heroMode, setHeroMode] = useState<'teachers' | 'papers'>('teachers');
  const isPapersMode = heroMode === 'papers';
  const heroAccent = isPapersMode ? 'hsl(var(--brand-blue))' : 'hsl(var(--brand))';
  const heroAccentClass = isPapersMode ? 'bg-brand-blue' : 'bg-brand';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content" className="pb-20 lg:pb-0">
        {/* ------------------------------------------------------------- Hero */}
        <section className={`relative ${CONTAINER} pt-6 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 lg:ground-graph`}>
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Mobile-first fold: everything from headline through the proof strip
                sits on one full-bleed saturated color slab (adapted from a fitness-app
                reference — bold color field behind the whole first screen, not just
                accent devices on a light page). `-mx-4 -mt-6 ... px-4 pt-6` is the
                standard bleed-then-repad trick (see Browse.tsx's PageHeader) so the
                color reaches the viewport edge and flush under the sticky nav while
                the content keeps its normal inset. Desktop keeps the original light
                ground-graph treatment untouched — `lg:` fully reverts every bleed/color
                class. Color follows heroMode via `heroAccentClass` (orange teacher-mode
                / blue papers-mode, VISUAL_LANGUAGE §2.2), same as the headline/toggle. */}
            <div
              className={`-mx-4 -mt-6 space-y-6 overflow-hidden rounded-b-4xl px-4 pb-8 pt-6 sm:-mx-6 sm:-mt-12 sm:px-6 sm:pb-10 sm:pt-12 lg:m-0 lg:space-y-6 lg:overflow-visible lg:rounded-none lg:bg-transparent lg:p-0 ${heroAccentClass} lg:!bg-transparent`}
            >
              <div className="relative space-y-4">
                {/* Sparkles — desktop-only per VISUAL_LANGUAGE §7; index.css hard-disables
                    the animation below 1024px, hidden entirely on mobile so nothing static
                    is left behind. */}
                <span
                  aria-hidden="true"
                  className={`animate-sparkle absolute -left-2 -top-3 hidden h-[9px] w-[9px] rounded-[3px] opacity-0 [animation-delay:.1s] lg:block ${heroAccentClass}`}
                />
                <span
                  aria-hidden="true"
                  className="animate-sparkle absolute left-24 -top-1 hidden h-[6px] w-[6px] rounded-[2px] bg-brand-blue opacity-0 [animation-delay:.55s] lg:block"
                />
                <span
                  aria-hidden="true"
                  className={`animate-sparkle absolute left-12 top-6 hidden h-[7px] w-[7px] rounded-[2px] opacity-0 [animation-delay:1s] lg:block ${heroAccentClass}`}
                />

                {/* Blur-in entrance, staggered — VISUAL_LANGUAGE §7 heroSwap. Mixed-weight
                    headline built on Archivo's weight AND width axes (DESIGN_SYSTEM/VISUAL_DIRECTION
                    §5): the lead-in is a narrow, normal-weight cut; the payoff word is the full-width,
                    black cut. `marker-highlight` on the key word (device A, REFERENCE_DEVICES.md's
                    single highest-value device) so the headline reads as art-directed, not typed. */}
                {/* Desktop headline — unchanged, exact original device (marker-highlight
                    box needs a light page bg to read, which desktop keeps). */}
                <h1
                  className="animate-hero-swap [animation-delay:40ms] hidden font-display text-display-hero font-normal [font-stretch:85%] lg:block"
                >
                  Find {isPapersMode ? '' : 'a '}
                  <span
                    className="marker-highlight marker-highlight--tilt"
                    style={{ '--marker-color': heroAccent } as React.CSSProperties}
                  >
                    {isPapersMode ? 'past papers' : 'tuition teacher'}
                  </span>{' '}
                  <span
                    aria-hidden="true"
                    className={`relative mx-[0.06em] inline-flex h-[0.62em] w-[0.62em] -translate-y-[0.08em] items-center justify-center rounded-full align-middle ${heroAccentClass}`}
                  >
                    <Sparkles className="h-[0.62em] w-[0.62em] text-white" strokeWidth={2.5} aria-hidden="true" />
                  </span>{' '}
                  <span className="font-black [font-stretch:125%]">in Kolkata.</span>
                </h1>

                {/* Desktop-only annotations (REFERENCE_DEVICES.md device D) — untouched by
                    the mobile-hero rebuild below, which only targets the fitness-app
                    reference's mobile-first fold. */}
                <div className="animate-hero-swap hidden flex-wrap items-center gap-2 [animation-delay:70ms] lg:flex">
                  <SpeechTag tail="bottom-left" dotColor="hsl(var(--brand))" tilt={-1.5}>
                    Verified tutors, message on WhatsApp
                  </SpeechTag>
                  <SpeechTag tail="bottom-right" dotColor="hsl(var(--brand-blue))" tilt={1.5}>
                    Past papers, free to read
                  </SpeechTag>
                  {(isPapersMode ? stats.papers : stats.teachers) != null && (
                    <StarburstBadge
                      variant="burst"
                      color={isPapersMode ? 'hsl(var(--brand))' : 'hsl(var(--brand-blue))'}
                      tilt={-6}
                      size={68}
                      className="ml-1"
                    >
                      <span className="tabular-nums">
                        {(isPapersMode ? stats.papers! : stats.teachers!).toLocaleString('en-IN')}+
                      </span>
                    </StarburstBadge>
                  )}
                </div>

                {/* Mobile headline — rebuilt closer to the fitness-app reference rather
                    than adapting the desktop device: a small eyebrow label, then a
                    plain bold white headline with no marker-box/sparkle-bubble (both
                    need a light page behind them to read, which the saturated slab no
                    longer is). Trust copy that used to live in the speech-tag/starburst
                    row moved into this eyebrow instead of stacking more devices. */}
                <p className="animate-hero-swap [animation-delay:20ms] text-label font-bold uppercase tracking-[.08em] text-white/70 lg:hidden">
                  Verified tutors · Kolkata
                </p>
                <h1 className="animate-hero-swap [animation-delay:40ms] font-display text-display-hero font-black leading-[1.05] text-white lg:hidden">
                  {isPapersMode ? 'Find past papers, free to read.' : 'Find a tuition teacher you can trust.'}
                </h1>
              </div>

              {/* The search field is the largest interactive element on the page. */}
              <div className="animate-hero-swap w-full [animation-delay:120ms]">
                <SearchControl align="flex-start" stackedToggle alwaysShowModeToggle onModeChange={setHeroMode} />
              </div>

              {/* Subject pill row — the fitness-app reference's filter-pill strip
                  (All / Preparation / Basic / Advanced) sitting directly on the
                  colored screen, adapted with real data: top subjects as translucent
                  white chips on the slab. Mobile only; desktop keeps its own bento
                  subject grid further down the page, so this isn't a duplicate — it's
                  the same "browse by subject" affordance surfaced at the fold. */}
              {subjects.length > 0 && (
                <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide lg:hidden">
                  <ul className="flex w-max items-center gap-2">
                    {subjects.slice(0, 6).map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/all-tuition-teachers-in-kolkata?filter_subjects=${encodeURIComponent(s.name)}`}
                          className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-white/16 px-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* The two paths, forked explicitly — never blurred into one funnel.
                  Each tile is a fixed three-row stack (icon / title / meta) so the
                  two tiles stay aligned even when one title wraps and the other
                  doesn't — `justify-center` made them ragged against each other.
                  Teachers = saturated orange slab, papers = neutral card, mirroring
                  the mode colors and keeping the pair from reading as two identical
                  blocks. Mobile drops the outline-thick/sticker-rotate treatment for
                  a flatter, cleaner card closer to the reference; desktop (`lg:`)
                  keeps the original die-cut sticker device untouched. */}
              <div className="grid grid-cols-2 gap-3 pt-1 sm:gap-5">
                <Link
                  to="/all-tuition-teachers-in-kolkata"
                  className="relative flex flex-col overflow-hidden rounded-2xl bg-brand p-4 text-brand-foreground shadow-border transition-transform duration-lift ease-settle hover:-translate-y-1 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:outline-thick lg:outline-offset-shadow lg:sticker-rotate-sm lg:shadow-none"
                >
                  {/* Photo-forward card treatment (fitness-app reference: cards carry a
                      real photo, not just an icon) — a real featured-teacher photo, dimmed
                      under a brand-color gradient so the title/meta text stays legible.
                      Mobile only; desktop keeps the flat icon tile it already had. */}
                  {proofFaces[0]?.image_url && (
                    <img
                      src={validateImageSrc(proofFaces[0].image_url)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover opacity-40 lg:hidden"
                    />
                  )}
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand via-brand/70 to-brand/40 lg:hidden" />
                  <GraduationCap className="relative mb-2 h-5 w-5 flex-none" aria-hidden="true" />
                  <span className="relative text-card-title-lg font-display font-bold leading-snug">Find a teacher</span>
                  <span className="relative mt-auto pt-1 text-meta text-brand-foreground/80">
                    {stats.teachers != null ? (
                      <span className="tabular-nums">{stats.teachers.toLocaleString('en-IN')} verified tutors</span>
                    ) : (
                      'Verified tutors near you'
                    )}
                  </span>
                </Link>

                <Link
                  to="/past-papers"
                  className="flex flex-col rounded-2xl bg-card p-4 shadow-border transition-transform duration-lift ease-settle hover:-translate-y-1 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 lg:outline-thick lg:outline-offset-shadow lg:sticker-rotate-md-rev lg:shadow-none"
                >
                  <FileText className="mb-2 h-5 w-5 flex-none text-brand-blue" aria-hidden="true" />
                  <span className="text-card-title-lg font-display font-bold leading-snug">Past papers</span>
                  <span className="mt-auto pt-1 text-meta text-muted-foreground">
                    {/* Zero is treated like "unknown": advertising an empty library
                        undersells the product, so fall back to the generic line. */}
                    {stats.papers ? (
                      <span className="tabular-nums">
                        {stats.papers.toLocaleString('en-IN')} papers, {(stats.schools ?? 0).toLocaleString('en-IN')} schools
                      </span>
                    ) : (
                      'Free, from Kolkata schools'
                    )}
                  </span>
                </Link>
              </div>

              {/* Proof strip — real faces, real counts, above the fold. */}
              <div className="flex items-center gap-3">
                <div className="flex flex-none items-center">
                  {proofFaces.length > 0
                    ? proofFaces.map((t, i) => (
                        <img
                          key={t.id}
                          src={validateImageSrc(t.image_url)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={36}
                          height={36}
                          className={`h-9 w-9 rounded-full object-cover ring-2 ring-background ${i > 0 ? '-ml-2' : ''}`}
                        />
                      ))
                    : [...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          className={`h-9 w-9 rounded-full ring-2 ring-background ${SKELETON} ${i > 0 ? '-ml-2' : ''}`}
                        />
                      ))}
                </div>
                <p className="text-meta text-white/85 pr-16 sm:pr-0 lg:text-muted-foreground">
                  Real teachers across ICSE, CBSE and State Board — with photos, subjects and localities.
                </p>
              </div>

            </div>
          </div>
        </section>

        <HomeGreeting />
        <HomeActivitySection />

        {/* ----------------------------------------------------- Featured teachers */}
        <section className={`${CONTAINER} ${SECTION_TIGHT}`}>
          <div className="space-y-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-section-head font-display font-bold">Featured teachers</h2>
              <Link
                to="/all-tuition-teachers-in-kolkata"
                className="inline-flex h-11 flex-none items-center gap-2 whitespace-nowrap rounded-lg text-body-secondary font-medium text-brand-blue transition-colors duration-hover hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                View all
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`aspect-[4/5] rounded-2xl ${SKELETON}`} />
                ))}
              </div>
            ) : featuredTeachers.length > 0 ? (
              <div className="stagger-children grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                {featuredTeachers.map((t, i) => (
                  <div key={t.id} className="animate-card-reveal">
                    <TeacherCard
                      id={t.id}
                      name={t.name}
                      slug={t.slug}
                      subject={t.featuredSubjectLabel || t.subjects?.name || 'Tuition Teacher'}
                      subjectSlug={t.subjects?.slug}
                      imageUrl={t.image_url ?? undefined}
                      isFeatured
                      hideFavourite
                      size="sm"
                    />
                  </div>
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
                action={{
                  label: 'Browse all teachers',
                  onClick: () => navigate('/all-tuition-teachers-in-kolkata'),
                }}
              />
            )}
          </div>
        </section>

        {/* ------------------------------------------- Bento: subjects and papers */}
        <section className={`${CONTAINER} ${SECTION_TIGHT}`}>
          <div className="space-y-8">
            <h2 className="text-section-head font-display font-bold">Explore by subject</h2>

            <div className="stagger-children grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {/* Papers tile — the bento's large cell, restating the students' path.
                  Rounded saturated slab (VISUAL_LANGUAGE §1.1): indigo, `rounded-4xl`,
                  inset by the section gutter via the grid it sits in — never full-bleed. */}
              <Link
                to="/past-papers"
                className="animate-card-reveal col-span-2 flex flex-col justify-between rounded-4xl bg-brand-blue p-6 text-white shadow-glow-brand-blue transition-transform duration-lift ease-settle hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 sm:p-8 lg:col-span-2 lg:row-span-2"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[.04em] text-white">
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    Free for students
                  </span>
                  <h3 className="text-lg font-semibold">Past papers from Kolkata schools</h3>
                  <p className="max-w-prose text-sm text-white/80">
                    {stats.papers ? (
                      <span className="tabular-nums">
                        {stats.papers.toLocaleString('en-IN')} papers from {(stats.schools ?? 0).toLocaleString('en-IN')} schools,
                        shared by students. Read them here — nothing to download.
                      </span>
                    ) : (
                      'Shared by students, for students. Read them here — nothing to download.'
                    )}
                  </p>
                </div>
                <span className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-white/15 px-4 text-sm font-medium text-white">
                  Browse past papers
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>

              {loading && subjects.length === 0 ? (
                [...Array(6)].map((_, i) => <div key={i} className={`h-28 rounded-2xl ${SKELETON}`} />)
              ) : subjects.length > 0 ? (
                subjects.map((s) => (
                  <div key={s.id} className="animate-card-reveal">
                    <SubjectCard
                      name={s.name}
                      slug={s.slug}
                      context="teachers"
                      teacherCount={s.teacherCount}
                      paperCount={s.paperCount}
                    />
                  </div>
                ))
              ) : (
                <EmptyResults
                  className="col-span-2"
                  icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
                  heading="Subjects are being updated"
                  message="Please check back shortly — you can still search for any subject directly."
                  action={{
                    label: 'Browse all teachers',
                    onClick: () => navigate('/all-tuition-teachers-in-kolkata'),
                  }}
                />
              )}
            </div>
          </div>
        </section>

        <HowItWorks />

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
