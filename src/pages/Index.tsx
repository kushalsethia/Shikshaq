import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, GraduationCap, Users } from 'lucide-react';
import { EmptyResults } from '@/components/EmptyResults';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { SearchControl } from '@/components/SearchControl';
import { HowItWorks } from '@/components/HowItWorks';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HomeActivitySection } from '@/components/HomeActivitySection';
import { useRequireRole } from '@/hooks/use-require-role';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { getCache, setCache, CACHE_TTL, clearExpiredCache } from '@/utils/cache';

// Real production shortcut destinations — the same routes the search results navigate to.
// Surfaced as quick chips under the hero because most users tap rather than type.
const SHORTCUTS: { label: string; to: string }[] = [
  { label: 'Maths tutors', to: '/maths-tuition-teachers-in-kolkata' },
  { label: 'ICSE teachers', to: '/icse-tuition-teachers-in-kolkata' },
  { label: 'Class 10', to: '/all-tuition-teachers-in-kolkata?filter_classes=10' },
  { label: 'English tuition', to: '/english-tuition-teachers-in-kolkata' },
  { label: 'Class 12 papers', to: '/past-papers/results?filter_classes=12' },
  { label: 'Tutors near Salt Lake', to: '/all-tuition-teachers-in-kolkata?filter_areas=Salt%20Lake' },
];

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const SECTION = 'py-16 sm:py-20 lg:py-24';
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
    localBusinessScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.shikshaq.in/#localbusiness",
      "name": "Shikshaq",
      "description": "Free online tutor-student matchmaking platform serving Kolkata and surrounding areas",
      "url": "https://www.shikshaq.in",
      "telephone": "+91-8240980312",
      "email": "support@shikshaq.in",
      "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" },
      "priceRange": "Free",
      "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "opens": "08:00", "closes": "22:00", "timezone": "Asia/Kolkata" },
      "areaServed": ["Kolkata", "Howrah", "Salt Lake", "Jadavpur", "Bhowanipore", "Ballygunge", "New Town", "Garia", "Tollygunge", "Behala"],
      "sameAs": ["https://www.instagram.com/ngo.aquaterra/", "https://www.facebook.com/shikshaqkolkata/"]
    });

    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.id = 'homepage-service-schema';
    serviceScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://www.shikshaq.in/#service",
      "name": "Free Tutor-Student Connection Service",
      "description": "Connect with verified tutors for personalized tuition in your locality. Free platform for both students and educators.",
      "serviceType": "Educational Tutoring Service",
      "provider": { "@type": "EducationalOrganization", "name": "Shikshaq", "url": "https://www.shikshaq.in" },
      "areaServed": "Kolkata",
      "availableChannel": { "@type": "ServiceChannel", "serviceUrl": "https://www.shikshaq.in/all-tuition-teachers-in-kolkata", "servicePhone": "+91-8240980312" },
      "offers": [
        { "@type": "Offer", "name": "Subject-Based Tutor Search", "description": "Find tutors for Mathematics, Physics, Chemistry, Biology, English, and more", "price": "0", "priceCurrency": "INR" },
        { "@type": "Offer", "name": "Online Tuition", "description": "Connect with tutors offering online classes", "price": "0", "priceCurrency": "INR" },
        { "@type": "Offer", "name": "Offline/Home Tuition", "description": "Find tutors offering offline/home tuition in your area", "price": "0", "priceCurrency": "INR" }
      ]
    });

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
      const [teachersRes, papersRes, schoolsRes] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('papers').select('school').eq('is_published', true),
      ]);
      const distinctSchools = schoolsRes.data ? new Set(schoolsRes.data.map((p) => p.school)).size : 0;
      setStats({ teachers: teachersRes.count ?? null, papers: papersRes.count ?? null, schools: distinctSchools });
    }
    fetchStats();
  }, []);

  // Concrete proof, above the fold: real faces of teachers actually on the platform.
  const proofFaces = featuredTeachers.filter((t) => t.image_url).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main-content" className="pb-20 lg:pb-0">
        {/* ------------------------------------------------------------- Hero */}
        <section className={`${CONTAINER} pt-6 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20`}>
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="space-y-6">
              <div className="relative space-y-3">
                {/* Sparkles — desktop-only per VISUAL_LANGUAGE §7; index.css hard-disables
                    the animation below 1024px, hidden entirely on mobile so nothing static
                    is left behind. */}
                <span
                  aria-hidden="true"
                  className="animate-sparkle absolute -left-2 -top-3 hidden h-[9px] w-[9px] rounded-[3px] bg-brand opacity-0 [animation-delay:.1s] lg:block"
                />
                <span
                  aria-hidden="true"
                  className="animate-sparkle absolute left-24 -top-1 hidden h-[6px] w-[6px] rounded-[2px] bg-brand-blue opacity-0 [animation-delay:.55s] lg:block"
                />
                <span
                  aria-hidden="true"
                  className="animate-sparkle absolute left-12 top-6 hidden h-[7px] w-[7px] rounded-[2px] bg-brand opacity-0 [animation-delay:1s] lg:block"
                />

                {/* Blur-in entrance, staggered — VISUAL_LANGUAGE §7 heroSwap. */}
                <h1
                  className="animate-hero-swap [animation-delay:40ms] text-[clamp(34px,5.6vw,66px)] font-normal leading-[.95] tracking-[-.055em]"
                >
                  Find a tuition teacher{' '}
                  <span className="font-extrabold">in Kolkata.</span>
                </h1>
                <p className="animate-hero-swap max-w-prose text-base text-muted-foreground [animation-delay:80ms]">
                  Search verified tutors by subject, class and locality, then message them yourself on
                  WhatsApp. Students can also read past papers from Kolkata schools, free.
                </p>
              </div>

              {/* The search field is the largest interactive element on the page. */}
              <div className="animate-hero-swap w-full [animation-delay:120ms]">
                <SearchControl align="flex-start" stackedToggle alwaysShowModeToggle />
              </div>

              {/* The two paths, forked explicitly — never blurred into one funnel.
                  Each tile is a fixed three-row stack (icon / title / meta) so the
                  two tiles stay aligned even when one title wraps and the other
                  doesn't — `justify-center` made them ragged against each other.
                  Teachers = saturated orange slab, papers = neutral card, mirroring
                  the mode colors and keeping the pair from reading as two identical
                  blocks. */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/all-tuition-teachers-in-kolkata"
                  className="flex flex-col rounded-2xl bg-brand p-4 text-brand-foreground shadow-glow-brand transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <GraduationCap className="mb-2 h-5 w-5 flex-none" aria-hidden="true" />
                  <span className="text-base font-semibold leading-snug">Find a teacher</span>
                  <span className="mt-auto pt-1 text-xs text-brand-foreground/80">
                    {stats.teachers != null ? (
                      <span className="tabular-nums">{stats.teachers.toLocaleString('en-IN')} verified tutors</span>
                    ) : (
                      'Verified tutors near you'
                    )}
                  </span>
                </Link>

                <Link
                  to="/past-papers"
                  className="flex flex-col rounded-2xl bg-card p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <FileText className="mb-2 h-5 w-5 flex-none text-brand-blue" aria-hidden="true" />
                  <span className="text-base font-semibold leading-snug">Past papers</span>
                  <span className="mt-auto pt-1 text-xs text-muted-foreground">
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
                <p className="text-xs text-muted-foreground">
                  Real teachers across ICSE, CBSE and State Board — with photos, subjects and localities.
                </p>
              </div>

              {/* Quick chips — horizontal scroll row on mobile, wrapped rows on desktop. */}
              <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
                <ul className="flex w-max items-center gap-2 sm:w-full sm:flex-wrap">
                  {SHORTCUTS.map((s) => (
                    <li key={s.label}>
                      <Link
                        to={s.to}
                        className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-card px-4 text-sm font-medium text-foreground shadow-border transition-colors duration-150 hover:bg-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hero stat cluster — desktop-only, VISUAL_LANGUAGE §8. DOM structure
                documented at the bottom of src/index.css: outer wrapper holds the
                static tilt, middle element runs `fan-in`, inner element runs `bob`.
                Counts come from the live stats query fetched above; §13's "never
                render a zero" rule applies, so a null/zero count falls back to an
                em dash rather than a fabricated number. */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
              {/* Papers count — indigo, -5deg, entry 50ms, float 5.5s. */}
              <div className="rotate-[-5deg]">
                <div className="animate-fan-in [animation-delay:50ms]">
                  <div className="animate-bob [animation-delay:550ms] [animation-duration:5.5s]">
                    <div className="flex flex-col gap-1 rounded-3xl bg-brand-blue p-6 text-white shadow-glow-brand-blue">
                      <span className="text-[11.5px] font-bold uppercase tracking-[.04em] text-white/75">Past papers</span>
                      <span className="text-3xl font-extrabold tabular-nums tracking-[-.02em]">
                        {stats.papers ? stats.papers.toLocaleString('en-IN') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teachers count — orange, 3.5deg, entry 140ms, float 6.5s. */}
              <div className="rotate-[3.5deg]">
                <div className="animate-fan-in [animation-delay:140ms]">
                  <div className="animate-bob [animation-delay:640ms] [animation-duration:6.5s]">
                    <div className="flex flex-col gap-1 rounded-3xl bg-brand p-6 text-brand-foreground shadow-glow-brand">
                      <span className="text-[11.5px] font-bold uppercase tracking-[.04em] text-white/75">Verified tutors</span>
                      <span className="text-3xl font-extrabold tabular-nums tracking-[-.02em]">
                        {stats.teachers ? stats.teachers.toLocaleString('en-IN') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zero commission — bone, -2.5deg, entry 230ms, float 7.5s. */}
              <div className="rotate-[-2.5deg]">
                <div className="animate-fan-in [animation-delay:230ms]">
                  <div className="animate-bob [animation-delay:730ms] [animation-duration:7.5s]">
                    <div className="flex flex-col gap-1 rounded-3xl bg-warm-card p-6 shadow-card-bone ring-1 ring-warm-hairline">
                      <span className="text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-label">Commission</span>
                      <span className="text-3xl font-extrabold tabular-nums tracking-[-.02em]">₹0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects count — mint, 4.5deg, entry 320ms, float 6s. */}
              <div className="rotate-[4.5deg]">
                <div className="animate-fan-in [animation-delay:320ms]">
                  <div className="animate-bob [animation-delay:820ms] [animation-duration:6s]">
                    <div className="flex flex-col gap-1 rounded-3xl bg-mint p-6 shadow-card-mint">
                      <span className="text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-label">Subjects</span>
                      <span className="text-3xl font-extrabold tabular-nums tracking-[-.02em]">
                        {subjects.length ? subjects.length.toLocaleString('en-IN') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeActivitySection />

        {/* ----------------------------------------------------- Featured teachers */}
        <section className={`${CONTAINER} ${SECTION}`}>
          <div className="space-y-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Featured teachers</h2>
              <Link
                to="/all-tuition-teachers-in-kolkata"
                className="inline-flex h-11 flex-none items-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium text-brand-blue transition-colors duration-150 hover:text-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                {featuredTeachers.map((t, i) => (
                  <div key={t.id} className="animate-card-reveal" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
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
        <section className={`${CONTAINER} ${SECTION}`}>
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Explore by subject</h2>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {/* Papers tile — the bento's large cell, restating the students' path.
                  Rounded saturated slab (VISUAL_LANGUAGE §1.1): indigo, `rounded-4xl`,
                  inset by the section gutter via the grid it sits in — never full-bleed. */}
              <Link
                to="/past-papers"
                className="col-span-2 flex flex-col justify-between rounded-4xl bg-brand-blue p-6 text-white shadow-glow-brand-blue transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 sm:p-8 lg:col-span-2 lg:row-span-2"
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
                subjects.map((s, i) => (
                  <div key={s.id} className="animate-card-reveal" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
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
