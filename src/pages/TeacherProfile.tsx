import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Share2, ArrowLeft, Clock, Wallet, Users, ShieldCheck } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { usePageMeta } from '@/hooks/usePageMeta';
import { resolveTeacherWhatsAppUrl } from '@/utils/whatsapp';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { getSubjectPalette } from '@/lib/subject-palette';
import { getCache, setCache, CACHE_TTL, getTeacherProfileCacheKey, getShikshaqmineBySlugCacheKey } from '@/utils/cache';
import DOMPurify from 'dompurify';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { recordVisit } from '@/lib/recently-visited';
import { TeacherComments } from '@/components/TeacherComments';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { Button } from '@/components/ui/button';
import { PreFooter } from '@/components/layout/PreFooter';
import { BottomNavSpacer } from '@/components/layout/PageContainer';
import { SignInSheet } from '@/components/SignInSheet';
import { toast } from 'sonner';
import { BROWSE_PATH } from '@/lib/nav-config';
import {
  generateTeacherPersonSchema,
  generateBreadcrumbSchema,
  generatePersonReviewSchema,
} from '@/utils/structuredDataGenerators';

interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  bio: string | null;
  experience_years: number | null;
  location: string | null;
  whatsapp_number: string | null;
  is_verified: boolean;
  subjects: { name: string; slug: string } | null;
  subjects_text?: string | null;
  subjects_from_shikshaq?: string | null;
  classes?: string | null;
  classes_taught?: string | null;
  classes_taught_for_backend?: string | null;
  sir_maam?: string | null;
  area?: string | null;
  boards_taught?: string | null;
  class_size?: string | null;
  mode_of_teaching?: string | null;
  place_of_teaching?: string | null;
  location_v2?: string | null;
  students_home_areas?: string | null;
  tutors_home_areas?: string | null;
  expanded?: string | null;
  description?: string | null;
  qualifications_etc?: string | null;
  teaching_since?: string | null;
  review_1?: string | null;
  review_2?: string | null;
  review_3?: string | null;
  whatsapp_link?: string | null;
  min_fees?: number | null;
  max_fees?: number | null;
}

function formatDisplayName(name: string, sirMaam?: string | null): string {
  if (!sirMaam) return name;
  const lower = String(sirMaam).toLowerCase().trim();
  let honorific: string | null = null;
  if (lower === 'sir' || lower.includes('sir')) honorific = 'Sir';
  else if (lower === "ma'am" || lower === 'maam' || lower.includes("ma'am")) honorific = "Ma'am";
  return honorific ? `${name}, ${honorific}` : name;
}

function parseCommaList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function getTaughtAreas(teacher: Teacher): string[] {
  const locationV2 = teacher.location_v2;
  if (!locationV2) return [];
  const lower = String(locationV2).toLowerCase().trim();
  const isStudentsHomeOnly = lower.includes('students home tutoring only') || lower.includes("student's home tutoring only");
  const isTeachersHomeOnly = lower.includes("teacher's home tutoring") || lower.includes("tutor's home tutoring");
  const isBothOptions = lower.includes('both options listed') || lower.includes('both options');

  const studentsAreas = isStudentsHomeOnly || isBothOptions ? parseCommaList(teacher.students_home_areas) : [];
  const tutorsAreas = isTeachersHomeOnly || isBothOptions ? parseCommaList(teacher.tutors_home_areas) : [];
  return Array.from(new Set([...studentsAreas, ...tutorsAreas]));
}

function SubjectPill({ label }: { label: string }) {
  const palette = getSubjectPalette(label);
  return (
    <span
      className="animate-pop inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold"
      style={{ backgroundColor: palette.tint, color: palette.text }}
    >
      {label}
    </span>
  );
}

function TagPill({ label, variant }: { label: string; variant: 'blue' | 'brand' }) {
  const classes = variant === 'blue' ? 'bg-brand-blue-subtle text-brand-blue-deep' : 'bg-brand-subtle text-brand-deep';
  return (
    <span className={`animate-pop inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}

function SpeechChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="animate-pop inline-flex items-center rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-border backdrop-blur-sm">
      {children}
    </span>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="animate-card-reveal rounded-2xl bg-card p-4 shadow-border">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-warm-meta">
        <Icon size={13} className="text-warm-meta" strokeWidth={2} aria-hidden="true" />
        {label}
      </div>
      <div className="font-display tabular-nums text-2xl font-bold tracking-tight text-foreground">{value}</div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-6 mb-3 text-lg font-semibold text-foreground">{children}</h2>;
}

export default function TeacherProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { isUpvoted, toggleUpvote, getUpvoteCount } = useUpvotes();
  const navigate = useNavigate();
  const location = useLocation();
  const [primaryCtaVisible, setPrimaryCtaVisible] = useState(true);
  const primaryCtaRef = useRef<HTMLDivElement>(null);
  // design.md §3 — WhatsApp / save taps while signed out open a soft sheet,
  // never a route change; after auth the visitor continues to what they tapped.
  const [signInSheetOpen, setSignInSheetOpen] = useState(false);
  const [signInIntent, setSignInIntent] = useState<'message' | 'save'>('message');

  useRequireRole();

  useEffect(() => {
    async function fetchTeacher() {
      if (!slug) return;

      const teacherCacheKey = getTeacherProfileCacheKey(slug);
      let teacherData = getCache<any>(teacherCacheKey);

      if (!teacherData) {
        const { data } = await supabase
          .from('teachers_list')
          .select('*, subjects(name, slug)')
          .eq('slug', slug)
          .maybeSingle();

        if (data) {
          teacherData = data;
          setCache(teacherCacheKey, teacherData, CACHE_TTL.TEACHER_PROFILE);
        }
      }

      let sirMaam = null;
      let subjectsFromShikshaq = null;
      let classesTaught = null;
      let classesTaughtForBackend = null;
      let area = null;
      let boardsTaught = null;
      let classSize = null;
      let modeOfTeaching = null;
      let placeOfTeaching = null;
      let locationV2 = null;
      let studentsHomeAreas = null;
      let tutorsHomeAreas = null;
      let expanded = null;
      let description = null;
      let qualificationsEtc = null;
      let teachingSinceRaw: string | number | null = null;
      let review1 = null;
      let review2 = null;
      let review3 = null;
      let whatsappLink = null;
      let minFees = null;
      let maxFees = null;
      let shikshaqData: any = null;
      if (teacherData) {
        try {
          const shikshaqCacheKey = getShikshaqmineBySlugCacheKey(slug);
          shikshaqData = getCache<any>(shikshaqCacheKey);

          if (!shikshaqData) {
            const { data, error } = await supabase
              .from('Shikshaqmine')
              .select('*')
              .eq('Slug', slug)
              .maybeSingle();

            if (error) {
              if (import.meta.env.DEV) {
                console.warn('Error fetching from Shikshaqmine:', error);
              }
            } else if (data) {
              shikshaqData = data;
              setCache(shikshaqCacheKey, shikshaqData, CACHE_TTL.SHIKSHAQMINE);
            }
          }

          if (shikshaqData) {
            sirMaam = (shikshaqData as any)["Sir/Ma'am?"];
            subjectsFromShikshaq = (shikshaqData as any)['Subjects'];
            classesTaught = (shikshaqData as any)['Classes Taught'];
            classesTaughtForBackend = (shikshaqData as any)['Classes Taught for Backend'];
            area = (shikshaqData as any)['Area'];
            boardsTaught = (shikshaqData as any)['School Boards Catered'];
            classSize = (shikshaqData as any)['Class Size (Group/ Solo)'];
            modeOfTeaching = (shikshaqData as any)['Mode of Teaching'];
            placeOfTeaching = (shikshaqData as any)['Place of Teaching'];
            locationV2 = (shikshaqData as any)['LOCATION V2'] || (shikshaqData as any)['Location V2'] || (shikshaqData as any)['location_v2'];
            studentsHomeAreas =
              (shikshaqData as any)["STUDENT'S HOME IN THESE AREAS"] ||
              (shikshaqData as any)["student's home in these areas"] ||
              (shikshaqData as any)["Student's home in these areas"];
            tutorsHomeAreas = (shikshaqData as any)["TUTOR'S HOME IN THESE AREAS"] || (shikshaqData as any)["Tutor's home in these areas"];
            expanded = (shikshaqData as any)['EXPANDED'] || (shikshaqData as any)['Expanded'] || (shikshaqData as any)['expanded'];
            description = (shikshaqData as any)['Description'];
            qualificationsEtc = (shikshaqData as any)['Qualifications etc'];
            teachingSinceRaw = (shikshaqData as any)['Years they started teaching'] ?? null;
            review1 = (shikshaqData as any)['Review 1'];
            review2 = (shikshaqData as any)['Review 2'];
            review3 = (shikshaqData as any)['Review 3'];
            whatsappLink = (shikshaqData as any)['Link'] || (shikshaqData as any)['link'];
            const minFeesRaw = (shikshaqData as any)['Min Fees'];
            const maxFeesRaw = (shikshaqData as any)['Max Fees'];
            minFees = minFeesRaw != null && minFeesRaw !== undefined ? Number(minFeesRaw) : null;
            maxFees = maxFeesRaw != null && maxFeesRaw !== undefined ? Number(maxFeesRaw) : null;
          }
        } catch (err) {
          if (import.meta.env.DEV) {
            console.warn('Error accessing Shikshaqmine table:', err);
          }
        }
      }

      if (teacherData) {
        setTeacher({
          ...teacherData,
          sir_maam: sirMaam,
          subjects_from_shikshaq: subjectsFromShikshaq,
          classes_taught: classesTaught,
          classes_taught_for_backend: classesTaughtForBackend,
          area: area,
          boards_taught: boardsTaught,
          class_size: classSize,
          mode_of_teaching: modeOfTeaching,
          place_of_teaching: placeOfTeaching,
          location_v2: locationV2,
          students_home_areas: studentsHomeAreas,
          tutors_home_areas: tutorsHomeAreas,
          expanded: expanded,
          description: description,
          qualifications_etc: qualificationsEtc,
          teaching_since: teachingSinceRaw != null && String(teachingSinceRaw).trim() !== '' ? String(teachingSinceRaw).trim() : null,
          review_1: review1,
          review_2: review2,
          review_3: review3,
          whatsapp_link: whatsappLink,
          min_fees: minFees ?? null,
          max_fees: maxFees ?? null,
        } as Teacher);
      }
      setLoading(false);
    }

    fetchTeacher();
  }, [slug]);

  // Auto-continue after sign-in — see handleWhatsAppClick's sessionStorage flag.
  useEffect(() => {
    if (!user || !teacher) return;
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem('shikshaq_pending_whatsapp');
    } catch {
      return;
    }
    if (pending && pending === teacher.slug) {
      try {
        sessionStorage.removeItem('shikshaq_pending_whatsapp');
      } catch {
        /* ok */
      }
      const url = resolveTeacherWhatsAppUrl(teacher.whatsapp_link);
      navigate(`/tuition-teachers/${teacher.slug}/whatsapp-click`, { state: { url, name: teacher.name } });
    }
  }, [user, teacher]);

  useEffect(() => {
    const node = primaryCtaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setPrimaryCtaVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [teacher?.id]);

  useEffect(() => {
    if (!teacher || !teacher.slug) return;
    recordVisit({
      type: 'teacher',
      id: teacher.id,
      title: teacher.name,
      subtitle: teacher.subjects?.name || teacher.subjects_from_shikshaq?.split(',')[0].trim(),
      path: `/tuition-teachers/${teacher.slug}`,
    });
  }, [teacher?.id]);

  useEffect(() => {
    if (!teacher || !teacher.slug) return;
    let cancelled = false;

    const toArray = (value: string | null | undefined): string[] => {
      if (!value || typeof value !== 'string') return [];
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    };

    const subjectSlug =
      teacher.subjects?.slug ||
      (teacher.subjects_from_shikshaq
        ? teacher.subjects_from_shikshaq.toLowerCase().replace(/\s+/g, '-').split(',')[0].trim()
        : null);
    const subjectName = teacher.subjects?.name || teacher.subjects_from_shikshaq?.split(',')[0].trim() || 'Tuition Teachers';
    const subjectUrl = subjectSlug ? `https://www.shikshaq.in/${subjectSlug}-tuition-teachers-in-kolkata` : 'https://www.shikshaq.in/all-tuition-teachers-in-kolkata';

    const teacherUrl = `https://www.shikshaq.in/tuition-teachers/${teacher.slug}`;
    const teacherName = teacher.name || '';
    const teacherDescription = teacher.description || teacher.bio || '';
    const phoneNumber = teacher.whatsapp_number || null;
    const area = teacher.area || null;
    const subjects = teacher.subjects_from_shikshaq ? toArray(teacher.subjects_from_shikshaq) : [];
    const classesTaught = teacher.classes_taught_for_backend ? toArray(teacher.classes_taught_for_backend) : [];
    const qualifications = teacher.qualifications_etc || null;

    const personSchema = generateTeacherPersonSchema({
      url: teacherUrl,
      name: teacherName,
      description: teacherDescription || undefined,
      phoneNumber,
      area,
      qualifications,
      subjects,
      classesTaught,
    });

    const breadcrumbItems = [
      { name: 'Home', url: 'https://www.shikshaq.in' },
      { name: 'Tuition Teachers', url: 'https://www.shikshaq.in/all-tuition-teachers-in-kolkata' },
      ...(subjectSlug && subjectName ? [{ name: subjectName, url: subjectUrl }] : []),
      { name: teacherName, url: teacherUrl },
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, `${teacherUrl}#breadcrumb`);

    const personScript = document.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.id = 'teacher-profile-person-schema';
    personScript.textContent = JSON.stringify(personSchema);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'teacher-profile-breadcrumb-schema';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    document.head.appendChild(personScript);
    document.head.appendChild(breadcrumbScript);

    // Reviews: sourced from `teacher_comments` — the real, user-submitted,
    // moderated reviews — never a fabricated rating (O-02 is unresolved).
    (async () => {
      const { data: comments } = await supabase
        .from('teacher_comments')
        .select('comment, approved')
        .eq('teacher_id', teacher.id)
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (cancelled) return;

      const reviewSchema = generatePersonReviewSchema({
        url: teacherUrl,
        name: teacherName,
        reviews: (comments || [])
          .filter((c) => c.comment && c.comment.trim())
          .map((c) => ({ author: 'Student', reviewBody: c.comment as string })),
      });

      if (reviewSchema) {
        const reviewScript = document.createElement('script');
        reviewScript.type = 'application/ld+json';
        reviewScript.id = 'teacher-profile-reviews-schema';
        reviewScript.textContent = JSON.stringify(reviewSchema);
        document.head.appendChild(reviewScript);
      }
    })();

    return () => {
      cancelled = true;
      document.getElementById('teacher-profile-person-schema')?.remove();
      document.getElementById('teacher-profile-breadcrumb-schema')?.remove();
      document.getElementById('teacher-profile-reviews-schema')?.remove();
    };
  }, [teacher]);

  const getMetaValue = (value: string | null | undefined, fallback = '') => value || fallback;
  const metaSubjects = getMetaValue(teacher?.subjects_from_shikshaq || teacher?.subjects?.name, 'subjects');
  const metaClasses = getMetaValue(teacher?.classes_taught || teacher?.classes_taught_for_backend, 'classes');
  const metaArea = getMetaValue(teacher?.area, 'Kolkata');
  const metaMode = getMetaValue(teacher?.mode_of_teaching, 'online/offline');
  const metaExpanded = getMetaValue(teacher?.expanded, '');

  const pageTitle = teacher
    ? `${teacher.name} teaches ${metaSubjects} for Classes ${metaClasses} in ${metaArea} via ${metaMode} on Shikshaq by AquaTerra`
    : 'Shikshaq - by AquaTerra';

  let pageDescription = teacher
    ? `${metaSubjects} tuition classes for ${metaClasses} in ${metaArea} via ${metaMode}`
    : 'Shikshaq connects students with real local tuition teachers for free. Discover trusted, verified educators near you for school subjects and exams- simple, genuine, and community-driven learning with no hidden costs.';
  if (teacher && metaExpanded) {
    const expandedText = DOMPurify.sanitize(metaExpanded, { ALLOWED_TAGS: [] }).trim();
    const expandedPreview = expandedText.length > 150 ? expandedText.substring(0, 147) + '...' : expandedText;
    pageDescription = `${pageDescription}. ${expandedPreview}`;
  }

  usePageMeta(pageTitle, pageDescription);

  const backHref = (location.state as { fromBrowse?: string })?.fromBrowse ?? BROWSE_PATH;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="h-[280px] w-full animate-shimmer bg-muted" />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 sm:px-6 sm:py-8 lg:px-8">
          <div className="h-8 w-2/3 animate-shimmer rounded-lg bg-muted" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-24 animate-shimmer rounded-full bg-muted" />
            <div className="h-6 w-24 animate-shimmer rounded-full bg-muted" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-[72px] animate-shimmer rounded-2xl bg-muted" />
            <div className="h-[72px] animate-shimmer rounded-2xl bg-muted" />
            <div className="h-[72px] animate-shimmer rounded-2xl bg-muted" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 text-center sm:px-6 sm:py-8 lg:px-8">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">Teacher not found</h1>
          <p className="mb-6 text-sm text-muted-foreground">The teacher you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="primary" size={44}>
            <Link to={BROWSE_PATH}>Browse all teachers</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const openSignInSheet = (intent: 'message' | 'save') => {
    setSignInIntent(intent);
    setSignInSheetOpen(true);
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openSignInSheet('save');
      return;
    }
    await toggleLike(teacher.id);
  };

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openSignInSheet('save');
      return;
    }
    await toggleUpvote(teacher.id);
  };

  const handleWhatsAppClick = () => {
    const url = resolveTeacherWhatsAppUrl(teacher.whatsapp_link);
    if (!user) {
      // design.md §3 — "after auth, continue straight to the redirect that was
      // tapped": flag the intent so the effect above fires the moment `user`
      // becomes truthy on this same page (post sign-in redirect lands back here).
      try {
        sessionStorage.setItem('shikshaq_pending_whatsapp', teacher.slug);
      } catch {
        /* storage unavailable — sign-in still works, just without auto-continue */
      }
      openSignInSheet('message');
      return;
    }
    navigate(`/tuition-teachers/${teacher.slug}/whatsapp-click`, { state: { url, name: teacher.name } });
  };

  const handleShareClick = async () => {
    const shareUrl = `https://www.shikshaq.in/tuition-teachers/${teacher.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: teacher.name, url: shareUrl });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied');
    } catch {
      // clipboard unavailable — no-op, share button stays non-fatal
    }
  };

  const liked = isLiked(teacher.id);
  const upvoted = isUpvoted(teacher.id);
  const upvoteCount = getUpvoteCount(teacher.id);

  const subjectsList = teacher.subjects_from_shikshaq
    ? parseCommaList(teacher.subjects_from_shikshaq)
    : teacher.subjects_text
    ? parseCommaList(teacher.subjects_text)
    : teacher.subjects
    ? [teacher.subjects.name]
    : [];
  const boardsList = parseCommaList(teacher.boards_taught);
  const taughtAreas = getTaughtAreas(teacher);
  const classesList = parseCommaList(teacher.classes_taught || teacher.classes_taught_for_backend);
  const modeList = parseCommaList(teacher.mode_of_teaching);
  const qualificationsText = teacher.qualifications_etc?.trim() || null;

  const primarySubject = subjectsList[0] || null;
  const accentPalette = getSubjectPalette(primarySubject);

  const feesValue =
    teacher.min_fees != null && teacher.max_fees != null
      ? `₹${teacher.min_fees.toLocaleString()} - ₹${teacher.max_fees.toLocaleString()}`
      : teacher.min_fees != null
      ? `₹${teacher.min_fees.toLocaleString()}+`
      : teacher.max_fees != null
      ? `Up to ₹${teacher.max_fees.toLocaleString()}`
      : null;
  const classSizeValue = teacher.class_size ? teacher.class_size.replace(/\bSolo\b/g, 'One-on-one') : null;
  const hasStats = Boolean(teacher.experience_years || feesValue || classSizeValue);

  const firstName = teacher.name.trim().split(/\s+/)[0] || teacher.name;

  const descriptionHtml = teacher.description
    ? /<[a-z][\s\S]*>/i.test(teacher.description)
      ? DOMPurify.sanitize(teacher.description, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          ALLOWED_ATTR: ['href', 'target', 'rel'],
        })
      : DOMPurify.sanitize(teacher.description.replace(/\n/g, '<br />'), { ALLOWED_TAGS: ['br'] })
    : null;

  const areaLabel = teacher.area || 'Kolkata';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Photo header — design.md §4 "Teacher profile (S3)": 280px photo header
          with back/save/share circles and board/area/experience speech chips. */}
      <div className="relative h-[280px] w-full overflow-hidden">
        {teacher.image_url ? (
          <img
            src={validateImageSrc(teacher.image_url)}
            alt={teacher.name}
            width={1200}
            height={280}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: accentPalette.tint }}>
            <StripePlaceholder name={teacher.name} initialSize={110} className="h-full w-full" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" aria-hidden="true" />

        <button
          type="button"
          onClick={() => navigate(backHref)}
          aria-label="Back to results"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-border backdrop-blur-sm transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft size={18} className="text-foreground" aria-hidden="true" />
        </button>

        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={liked ? 'Remove from favourites' : 'Save teacher'}
            aria-pressed={liked}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-border backdrop-blur-sm transition-transform duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Heart size={17} className={liked ? 'fill-destructive text-destructive' : 'text-foreground/70'} />
          </button>
          <button
            type="button"
            onClick={handleShareClick}
            aria-label="Share teacher"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-border backdrop-blur-sm transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Share2 size={16} className="text-foreground/70" aria-hidden="true" />
          </button>
        </div>

        {teacher.is_verified && (
          <div role="status" className="animate-pop absolute left-4 bottom-4 flex h-9 items-center gap-1.5 rounded-full bg-brand-blue px-3 shadow-border">
            <ShieldCheck size={14} className="text-white" strokeWidth={2.3} aria-hidden="true" />
            <span className="text-xs font-bold text-white">Verified</span>
          </div>
        )}

        {(boardsList.length > 0 || teacher.area || teacher.experience_years) && (
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap justify-end gap-2">
            {boardsList.length > 0 && <SpeechChip>{boardsList.join(' + ')}</SpeechChip>}
            {teacher.area && <SpeechChip>{teacher.area}</SpeechChip>}
            {teacher.experience_years && <SpeechChip>{teacher.experience_years}+ years</SpeechChip>}
          </div>
        )}
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 sm:px-6 sm:py-8 lg:px-8">
        {/* Desktop: 1fr / 384px grid. Left = name card + prose sections. Right = sticky contact card. */}
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-8">
          <div className="min-w-0">
            <h1 className="font-display text-4xl font-black leading-[0.98] tracking-tight text-foreground sm:text-5xl">
              {formatDisplayName(teacher.name, teacher.sir_maam)}
            </h1>

            {primarySubject && (
              <p className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">
                Teaches{' '}
                <span
                  className="marker-highlight marker-highlight--pill"
                  style={{ '--marker-color': accentPalette.solid } as React.CSSProperties}
                >
                  {primarySubject}
                </span>
              </p>
            )}

            {(subjectsList.length > 0 || boardsList.length > 0 || teacher.area) && (
              <div className="stagger-children mt-4 flex flex-wrap gap-2">
                {subjectsList.map((subject) => (
                  <SubjectPill key={subject} label={subject} />
                ))}
                {boardsList.map((board) => (
                  <TagPill key={board} label={board} variant="blue" />
                ))}
                {teacher.area && <TagPill label={teacher.area} variant="brand" />}
              </div>
            )}

            {hasStats ? (
              <div className="stagger-children mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {teacher.experience_years && <StatTile icon={Clock} label="Experience" value={`${teacher.experience_years}+ years`} />}
                {feesValue && <StatTile icon={Wallet} label="Fees / month" value={feesValue} />}
                {classSizeValue && <StatTile icon={Users} label="Class size" value={classSizeValue} />}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                Experience, fees, and class size aren't listed yet — ask {firstName} directly on WhatsApp.
              </div>
            )}

            {/* Contact panel — mobile/tablet only; desktop's contact card lives in
                the sticky right column below. Green WhatsApp CTA (design.md §4). */}
            <div ref={primaryCtaRef} className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-muted p-6 lg:hidden">
              <p className="max-w-[44ch] text-sm leading-6 text-warm-prose">
                Fees and arrangements are settled directly between you and the teacher. Shikshaq takes no commission.
                {!user && (
                  <span className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
                    Sign in to message — quick, one tap.
                  </span>
                )}
              </p>
              <Button variant="whatsapp" size={52} onClick={handleWhatsAppClick} className="whatsapp-pulse-once">
                <WhatsAppIcon className="h-[17px] w-[17px]" />
                Message on WhatsApp
              </Button>
            </div>

            {descriptionHtml && (
              <>
                <SectionHeading>About {firstName}</SectionHeading>
                <div className="max-w-prose text-base leading-7 text-warm-prose [&_p+p]:mt-3" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
              </>
            )}

            {classesList.length > 0 && (
              <>
                <SectionHeading>Classes taught</SectionHeading>
                <div className="stagger-children flex flex-wrap gap-2">
                  {classesList.map((cls) => (
                    <span key={cls} className="animate-card-reveal rounded-full bg-muted px-3.5 py-2 text-sm font-medium text-foreground">
                      {cls}
                    </span>
                  ))}
                </div>
              </>
            )}

            {taughtAreas.length > 0 && (
              <>
                <SectionHeading>Where they teach</SectionHeading>
                <div className="stagger-children flex flex-wrap gap-2">
                  {taughtAreas.map((a) => (
                    <span key={a} className="animate-card-reveal rounded-full bg-muted px-3.5 py-2 text-sm font-medium text-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}

            {modeList.length > 0 && (
              <>
                <SectionHeading>Mode of teaching</SectionHeading>
                <div className="stagger-children flex flex-wrap gap-2">
                  {modeList.map((mode) => (
                    <span key={mode} className="animate-card-reveal rounded-full bg-muted px-3.5 py-2 text-sm font-medium text-foreground">
                      {mode}
                    </span>
                  ))}
                </div>
              </>
            )}

            {qualificationsText && (
              <>
                <SectionHeading>Qualifications</SectionHeading>
                <p className="max-w-prose text-base leading-7 text-warm-prose">{qualificationsText}</p>
              </>
            )}

            <TeacherComments teacherId={teacher.id} subject={primarySubject} />

            {/* Sentence footer — scoped to this teacher's subject and area. */}
            <p className="mt-8 text-base text-warm-prose">
              Looking for more{' '}
              <Link to={BROWSE_PATH} className="font-semibold text-foreground underline underline-offset-2">
                {primarySubject || 'tuition'} teachers near {areaLabel}
              </Link>
              ?
            </p>
          </div>

          {/* Right column — desktop only: sticky near-black contact card + "not the right fit" panel. */}
          <aside className="mt-8 hidden lg:mt-0 lg:block">
            <div className="lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-4">
              <div className="rounded-3xl bg-panel p-6 text-background shadow-border">
                {feesValue && <p className="text-sm text-background/70">{feesValue}</p>}
                <Button variant="whatsapp" size={54} onClick={handleWhatsAppClick} className="whatsapp-pulse-once mt-4 w-full">
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  Message on WhatsApp
                </Button>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" size={44} onClick={handleHeartClick} className="flex-1 text-background hover:bg-background/10">
                    <Heart size={16} className={liked ? 'fill-destructive text-destructive' : ''} aria-hidden="true" />
                    Save
                  </Button>
                  <Button variant="ghost" size={44} onClick={handleShareClick} className="flex-1 text-background hover:bg-background/10">
                    <Share2 size={15} aria-hidden="true" />
                    Share
                  </Button>
                </div>
                {!user && <p className="mt-3 text-xs text-background/70">Sign in to message — quick, one tap.</p>}
                <ul className="mt-4 space-y-2 text-xs text-background/70">
                  {teacher.is_verified && <li>ID and degree verified by ShikshAQ</li>}
                  <li>Fees are settled directly with the teacher. Shikshaq takes no commission.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-brand-subtle p-6">
                <p className="font-display text-base font-bold text-brand-deep">Not the right fit?</p>
                <p className="mt-1 text-sm text-warm-prose">
                  See other {primarySubject || 'tuition'} teachers near {areaLabel}.
                </p>
                <Link to={BROWSE_PATH} className="mt-3 inline-block text-sm font-semibold text-brand-deep underline underline-offset-2">
                  See them all →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <PreFooter variant="B2" className="mt-12" />
      </main>

      {/* Floating mobile CTA — the WhatsApp button must stay reachable as the
          parent reads the whole profile, not just while the panel above is on
          screen. Desktop's sticky contact card keeps the CTA in reach, so this
          is mobile-only. Sits above the fixed bottom nav bar. */}
      {!primaryCtaVisible && (
        <div className="animate-pop fixed inset-x-4 bottom-20 z-40 lg:hidden">
          <Button variant="whatsapp" size={54} onClick={handleWhatsAppClick} className="sticker outline-offset-shadow w-full">
            <WhatsAppIcon className="h-5 w-5" />
            {feesValue ? `${feesValue} · Message` : 'Message on WhatsApp'}
          </Button>
        </div>
      )}

      <BottomNavSpacer />

      <SignInSheet open={signInSheetOpen} onOpenChange={setSignInSheetOpen} intent={signInIntent} />

      <Footer expandedContent={teacher.expanded || null} />
    </div>
  );
}
