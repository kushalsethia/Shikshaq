import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
import { getTeacherBySlug } from '@/lib/teachers';
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
      className="animate-pop inline-flex h-[32px] items-center whitespace-nowrap rounded-full px-[14px] text-[13.5px] font-bold"
      style={{ backgroundColor: palette.tint, color: palette.text }}
    >
      {label}
    </span>
  );
}

function TagPill({ label, variant }: { label: string; variant: 'blue' | 'brand' }) {
  const classes = variant === 'blue' ? 'bg-brand-blue-subtle text-brand-blue-deep' : 'bg-brand-subtle text-brand-deep';
  return (
    <span className={`animate-pop inline-flex h-[32px] items-center whitespace-nowrap rounded-full px-[14px] text-[13.5px] font-bold ${classes}`}>
      {label}
    </span>
  );
}

// S3 header chips: height:26px padding:0 10px font-size:11.5px font-weight:700.
function SpeechChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="animate-pop inline-flex h-[26px] items-center whitespace-nowrap rounded-full bg-card/90 px-[10px] text-[11.5px] font-bold text-foreground shadow-border backdrop-blur-sm">
      {children}
    </span>
  );
}

// S3 stat tile: radius:16px padding:12px, icon mb:6px, label font:11px, value mt:2px font:15px.
function StatTile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="animate-card-reveal rounded-[16px] bg-card p-[12px] shadow-border">
      <div className="mb-[6px] flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-warm-meta">
        <Icon size={13} className="text-warm-meta" strokeWidth={2} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-[2px] font-display tabular-nums text-[15px] font-extrabold tracking-[-0.02em] text-foreground">{value}</div>
    </div>
  );
}

// S3/D3 section heading: mobile margin-bottom:10px font:18px; desktop margin-bottom:12px font:26px.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-[18px] mb-[10px] font-display text-[18px] font-extrabold tracking-[-0.03em] text-foreground lg:mt-[24px] lg:mb-[12px] lg:text-[26px] lg:tracking-[-0.02em]">
      {children}
    </h2>
  );
}

export default function TeacherProfile() {
  const { slug } = useParams<{ slug: string }>();

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

  /* Profile fetch on react-query. Was a hand-rolled useEffect owning its own
     loading flag and swallowing errors in a catch; the join itself already
     lives in src/lib/teachers.ts, so only the async-state ownership moved.

     staleTime is generous — a teacher profile changes rarely, and navigating
     back to one should not refetch. */
  const profileQuery = useQuery({
    queryKey: ['teacher-profile', slug],
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Teacher | null> => {
      const { teacher: teacherData, shikshaqmine } = await getTeacherBySlug<any>(slug as string);
      if (!teacherData) return null;
      return {
        ...teacherData,
        sir_maam: shikshaqmine?.sirMaam ?? null,
        subjects_from_shikshaq: shikshaqmine?.subjectsFromShikshaq ?? null,
        classes_taught: shikshaqmine?.classesTaught ?? null,
        classes_taught_for_backend: shikshaqmine?.classesTaughtForBackend ?? null,
        area: shikshaqmine?.area ?? null,
        boards_taught: shikshaqmine?.boardsTaught ?? null,
        class_size: shikshaqmine?.classSize ?? null,
        mode_of_teaching: shikshaqmine?.modeOfTeaching ?? null,
        place_of_teaching: shikshaqmine?.placeOfTeaching ?? null,
        location_v2: shikshaqmine?.locationV2 ?? null,
        students_home_areas: shikshaqmine?.studentsHomeAreas ?? null,
        tutors_home_areas: shikshaqmine?.tutorsHomeAreas ?? null,
        expanded: shikshaqmine?.expanded ?? null,
        description: shikshaqmine?.description ?? null,
        qualifications_etc: shikshaqmine?.qualificationsEtc ?? null,
        teaching_since:
          shikshaqmine?.teachingSinceRaw != null && String(shikshaqmine.teachingSinceRaw).trim() !== ''
            ? String(shikshaqmine.teachingSinceRaw).trim()
            : null,
        review_1: shikshaqmine?.review1 ?? null,
        review_2: shikshaqmine?.review2 ?? null,
        review_3: shikshaqmine?.review3 ?? null,
        whatsapp_link: shikshaqmine?.whatsappLink ?? null,
        min_fees: shikshaqmine?.minFees ?? null,
        max_fees: shikshaqmine?.maxFees ?? null,
      } as Teacher;
    },
  });

  const teacher = profileQuery.data ?? null;
  const loading = profileQuery.isPending && Boolean(slug);

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

      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 sm:px-6 sm:py-8 lg:px-8">
        {/* Desktop: 1fr / 384px grid. Left = photo/name card + prose sections. Right = sticky contact card. */}
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-[40px]">
          <div className="min-w-0">
            {/* Profile card — design.md "Teacher profile (S3/D3)": photo sits
                inside the card beside the name, never underneath overlaid
                chips/badges — nothing may cover a teacher's face. Dark panel +
                white text on mobile (S3); light bordered card on desktop (D3). */}
            <div className="rounded-[28px] bg-panel p-[14px] pb-[20px] lg:rounded-[24px] lg:border lg:border-border lg:bg-card lg:px-[30px] lg:py-[28px] lg:shadow-none">
              {/* S3 top row: 40x40 icon buttons, 18px icons, 8px gap, 16px margin-bottom.
                  Kept at a 44px hit area (padding) around the 40px visual per the
                  44px-minimum rule — mockup draws the control smaller than the a11y floor. */}
              <div className="mb-[16px] flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  onClick={() => navigate(backHref)}
                  aria-label="Back to results"
                  className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-background/10 transition-transform duration-150 before:absolute before:-inset-[2px] before:content-[''] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <ArrowLeft size={18} className="text-background" aria-hidden="true" />
                </button>
                <div className="flex gap-[8px]">
                  <button
                    type="button"
                    onClick={handleHeartClick}
                    aria-label={liked ? 'Remove from favourites' : 'Save teacher'}
                    aria-pressed={liked}
                    className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-background/10 transition-transform duration-150 before:absolute before:-inset-[2px] before:content-[''] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Heart size={18} className={liked ? 'fill-destructive text-destructive' : 'text-background/70'} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareClick}
                    aria-label="Share teacher"
                    className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-background/10 transition-transform duration-150 before:absolute before:-inset-[2px] before:content-[''] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Share2 size={18} className="text-background/70" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex items-end gap-[14px] lg:items-start lg:gap-[28px]">
                <div className="relative h-[166px] w-[132px] shrink-0 overflow-hidden rounded-[20px] lg:h-[280px] lg:w-[224px]">
                  {teacher.image_url ? (
                    <img
                      src={validateImageSrc(teacher.image_url)}
                      alt={teacher.name}
                      width={224}
                      height={280}
                      decoding="async"
                      /* React 18 does not recognise `fetchPriority` as a prop —
                         it warns and drops it. (React 19 added it.) Spreading
                         the lowercase HTML attribute emits the real thing.
                         This is the profile's LCP image, so the hint is worth
                         keeping rather than removing. */
                      {...({ fetchpriority: 'high' } as Record<string, string>)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full" style={{ backgroundColor: accentPalette.tint }}>
                      <StripePlaceholder name={teacher.name} initialSize={72} className="h-full w-full" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {/* S3 header chips: gap:6px margin-bottom:10px — both exact tokens (gap-1.5 / mb-2.5), kept. */}
                  {(boardsList.length > 0 || teacher.area || teacher.experience_years) && (
                    <div className="stagger-children mb-2.5 flex flex-wrap gap-1.5 lg:hidden">
                      {boardsList.length > 0 && <SpeechChip>{boardsList.join(' + ')}</SpeechChip>}
                      {teacher.area && <SpeechChip>{teacher.area}</SpeechChip>}
                      {teacher.experience_years && <SpeechChip>{teacher.experience_years}+ years</SpeechChip>}
                    </div>
                  )}

                  <div className="flex items-center gap-[7px]">
                    <h1 className="font-display text-[27px] font-black leading-[1] tracking-[-0.04em] text-background lg:text-[44px] lg:tracking-[-0.03em] lg:text-foreground">
                      {formatDisplayName(teacher.name, teacher.sir_maam)}
                    </h1>
                    {teacher.is_verified && (
                      <span title="Verified by ShikshAQ" className="flex-none">
                        <ShieldCheck
                          className="h-[19px] w-[19px] fill-brand text-background lg:h-[26px] lg:w-[26px] lg:text-card"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </div>

                  {primarySubject && (
                    <p className="mt-[7px] font-display text-[14px] font-bold text-background/90 lg:hidden">
                      Teaches{' '}
                      <span className="rounded-[8px] bg-card px-[8px] py-[1px] text-foreground">{primarySubject}</span>
                    </p>
                  )}

                  {(teacher.area || teacher.experience_years || boardsList.length > 0) && (
                    <div className="mt-[8px] hidden flex-wrap gap-[18px] text-[14.5px] text-warm-prose lg:flex">
                      {teacher.area && <span className="inline-flex items-center gap-2">{teacher.area}</span>}
                      {teacher.experience_years && (
                        <span className="inline-flex items-center gap-2">{teacher.experience_years}+ years experience</span>
                      )}
                      {boardsList.length > 0 && <span className="inline-flex items-center gap-2">{boardsList.join(' + ')}</span>}
                    </div>
                  )}

                  {subjectsList.length > 0 && (
                    <div className="stagger-children mt-[20px] hidden flex-wrap gap-2 lg:flex">
                      {subjectsList.map((subject) => (
                        <SubjectPill key={subject} label={subject} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(subjectsList.length > 0 || boardsList.length > 0 || teacher.area) && (
              <div className="stagger-children mt-4 flex flex-wrap gap-2 lg:hidden">
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
              <div className="stagger-children mt-[18px] grid grid-cols-1 gap-[8px] sm:grid-cols-3">
                {teacher.experience_years && <StatTile icon={Clock} label="Experience" value={`${teacher.experience_years}+ years`} />}
                {feesValue && <StatTile icon={Wallet} label="Fees / month" value={feesValue} />}
                {classSizeValue && <StatTile icon={Users} label="Class size" value={classSizeValue} />}
              </div>
            ) : (
              <div className="mt-[18px] rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                Experience, fees, and class size aren't listed yet — ask {firstName} directly on WhatsApp.
              </div>
            )}

            {/* Contact panel — mobile/tablet only; desktop's contact card lives in
                the sticky right column below. Green WhatsApp CTA (design.md §4).
                S3: radius:20px padding:16px, text:13.5px/1.55 mb:12px before the button. */}
            <div ref={primaryCtaRef} className="mt-[18px] flex flex-col rounded-[20px] bg-muted p-[16px] lg:hidden">
              <p className="mb-[12px] text-[13.5px] leading-[1.55] text-warm-prose">
                Fees and arrangements are settled directly between you and the teacher. Shikshaq takes no commission.
              </p>
              <Button variant="whatsapp" size={52} onClick={handleWhatsAppClick} className="whatsapp-pulse-once">
                <WhatsAppIcon className="h-[19px] w-[19px]" />
                Message on WhatsApp
              </Button>
              {!user && (
                <span className="mt-[10px] flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-blue">
                  Sign in to message — quick, one tap.
                </span>
              )}
            </div>

            {descriptionHtml && (
              <>
                <SectionHeading>About {firstName}</SectionHeading>
                <div
                  className="max-w-prose text-[15px] leading-[1.65] text-warm-prose [&_p+p]:mt-3 lg:text-[16px] lg:leading-[1.6]"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </>
            )}

            {classesList.length > 0 && (
              <>
                <SectionHeading>Classes taught</SectionHeading>
                <div className="stagger-children flex flex-wrap gap-2">
                  {classesList.map((cls) => (
                    <span
                      key={cls}
                      className="animate-card-reveal flex h-[38px] items-center whitespace-nowrap rounded-full bg-muted px-[14px] text-[14px] font-semibold text-foreground"
                    >
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
                    <span
                      key={a}
                      className="animate-card-reveal flex h-[38px] items-center whitespace-nowrap rounded-full bg-muted px-[14px] text-[14px] font-semibold text-foreground"
                    >
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
                    <span
                      key={mode}
                      className="animate-card-reveal flex h-[38px] items-center whitespace-nowrap rounded-full bg-muted px-[14px] text-[14px] font-semibold text-foreground"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </>
            )}

            {qualificationsText && (
              <>
                <SectionHeading>Qualifications</SectionHeading>
                <p className="max-w-prose text-[15px] leading-[1.65] text-warm-prose lg:text-[16px] lg:leading-[1.6]">{qualificationsText}</p>
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

          {/* Right column — desktop only: sticky near-black contact card + "not the right fit" panel.
              D3 sticky card: radius:24px padding:26px gap:16px; fee font:36px; WhatsApp h:54 radius:15;
              save/share h:46 radius:13; "not the right fit" card radius:20 padding:20 mt:16. */}
          <aside className="mt-8 hidden lg:mt-0 lg:block">
            <div className="lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-[16px]">
              <div className="rounded-[24px] bg-panel p-[26px] text-background shadow-border">
                {feesValue && (
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-[36px] font-black tracking-[-0.03em] text-background">{feesValue}</span>
                    <span className="text-sm text-background/60">per month</span>
                  </p>
                )}
                <Button
                  variant="whatsapp"
                  size={54}
                  onClick={handleWhatsAppClick}
                  className="whatsapp-pulse-once mt-[16px] w-full rounded-[15px]"
                >
                  <WhatsAppIcon className="h-[20px] w-[20px]" />
                  Message on WhatsApp
                </Button>
                <div className="mt-[16px] flex gap-[10px]">
                  <Button
                    variant="ghost"
                    size={44}
                    onClick={handleHeartClick}
                    className="h-[46px] flex-1 rounded-[13px] text-background hover:bg-background/10"
                  >
                    <Heart size={16} className={liked ? 'fill-destructive text-destructive' : ''} aria-hidden="true" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size={44}
                    onClick={handleShareClick}
                    className="h-[46px] flex-1 rounded-[13px] text-background hover:bg-background/10"
                  >
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

              <div className="rounded-[20px] bg-brand-subtle p-[20px]">
                <p className="font-display text-[18px] font-extrabold tracking-[-0.02em] text-brand-deep">Not the right fit?</p>
                <p className="mt-1 text-[14.5px] leading-[1.55] text-warm-prose">
                  See other {primarySubject || 'tuition'} teachers near {areaLabel}.
                </p>
                <Link to={BROWSE_PATH} className="mt-[4px] inline-block text-[14px] font-semibold text-brand-deep underline underline-offset-2">
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
