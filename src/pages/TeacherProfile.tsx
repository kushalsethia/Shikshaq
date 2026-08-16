import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, ArrowUp, Clock, Wallet, Users, ShieldCheck, Lock } from 'lucide-react';
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
import { saveAuthRedirect } from '@/utils/authRedirect';
import { recordVisit } from '@/lib/recently-visited';
import { TeacherComments } from '@/components/TeacherComments';
import { CutPaperShape, SpeechTag, TicketShape } from '@/components/devices';
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
  subjects_text?: string | null; // The subjects text field from teachers_list
  subjects_from_shikshaq?: string | null; // The "Subjects" field from Shikshaqmine table
  classes?: string | null; // The classes text field from teachers_list
  classes_taught?: string | null; // The "Classes Taught" field from Shikshaqmine table
  classes_taught_for_backend?: string | null; // The "Classes Taught for Backend" field from Shikshaqmine table
  sir_maam?: string | null; // The "Sir/Ma'am?" field from Shikshaqmine table
  area?: string | null; // The "Area" field from Shikshaqmine table
  boards_taught?: string | null; // The "School Boards Catered" field from Shikshaqmine table
  class_size?: string | null; // The "Class Size (Group/ Solo)" field from Shikshaqmine table
  mode_of_teaching?: string | null; // The "Mode of Teaching" field from Shikshaqmine table
  place_of_teaching?: string | null; // The "Place of Teaching" field from Shikshaqmine table (auto-computed from Location V2)
  location_v2?: string | null; // The "Location V2" field from Shikshaqmine table
  students_home_areas?: string | null; // The "student's home in these areas" field from Shikshaqmine table
  tutors_home_areas?: string | null; // The "Tutor's home in these areas" field from Shikshaqmine table
  expanded?: string | null; // The "EXPANDED" field from Shikshaqmine table
  description?: string | null; // The "Description" field from Shikshaqmine table
  qualifications_etc?: string | null; // The "Qualifications etc" field from Shikshaqmine table
  teaching_since?: string | null; // The "Years they started teaching" field from Shikshaqmine table
  review_1?: string | null; // The "Review 1" field from Shikshaqmine table
  review_2?: string | null; // The "Review 2" field from Shikshaqmine table
  review_3?: string | null; // The "Review 3" field from Shikshaqmine table
  whatsapp_link?: string | null; // The "Link" field from Shikshaqmine table
  min_fees?: number | null; // The "Min Fees" field from Shikshaqmine table
  max_fees?: number | null; // The "Max Fees" field from Shikshaqmine table
}

// "{name}, {honorific}" per pages/TeacherProfile.md's h1 spec (same honorific rule as TeacherCard).
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

// "Where they teach" pills: merges student's-home and tutor's-home areas depending on which
// modes location_v2 flags, deduped. No sub-labels — the page spec has one flat pill list.
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

// Subject tag — subject-tinted per VISUAL_LANGUAGE §3, via getSubjectPalette (the sanctioned
// inline-style exception for dynamic, data-driven subject color).
function SubjectTag({ label }: { label: string }) {
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

// Board / area tags — fixed mode colors (brand-blue for boards, brand for area), token classes only.
function ModeTag({ label, variant }: { label: string; variant: 'blue' | 'brand' }) {
  const classes =
    variant === 'blue'
      ? 'bg-brand-blue-subtle text-brand-blue-deep'
      : 'bg-brand-subtle text-brand-deep';
  return (
    <span className={`animate-pop inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}

// Cluster D — editorial data-viz: big honest tabular numbers, no chartjunk.
function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
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
  // mt-6 (was mt-8) — teacher profiles stack many blocks (subjects, review, areas,
  // testimonials) and the extra 8px per gap compounded into visibly loose rhythm
  // by the time you scroll past 4-5 sections. Tightened per owner's spacing note.
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
  // Tracks whether the primary WhatsApp CTA panel is on-screen, so a floating
  // mobile CTA can take over once it scrolls out of view — the single success
  // action for the whole product must stay reachable the entire scroll (task #1).
  const [primaryCtaVisible, setPrimaryCtaVisible] = useState(true);
  const primaryCtaRef = useRef<HTMLDivElement>(null);

  // Redirects to role selection / teacher terms agreement when needed.
  useRequireRole();

  useEffect(() => {
    async function fetchTeacher() {
      if (!slug) return;

      // Check cache for teacher profile
      const teacherCacheKey = getTeacherProfileCacheKey(slug);
      let teacherData = getCache<any>(teacherCacheKey);

      if (!teacherData) {
        // Fetch teacher from teachers_list
        const { data } = await supabase
          .from('teachers_list')
          .select('*, subjects(name, slug)')
          .eq('slug', slug)
          .maybeSingle();

        if (data) {
          teacherData = data;
          // Cache teacher profile
          setCache(teacherCacheKey, teacherData, CACHE_TTL.TEACHER_PROFILE);
        }
      }

      // Fetch all data from Shikshaqmine table
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
          // Check cache for Shikshaqmine data
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
              // Cache Shikshaqmine data
              setCache(shikshaqCacheKey, shikshaqData, CACHE_TTL.SHIKSHAQMINE);
            }
          }

          if (shikshaqData) {
            // Access the columns with special characters
            sirMaam = (shikshaqData as any)["Sir/Ma'am?"];
            subjectsFromShikshaq = (shikshaqData as any)["Subjects"];
            classesTaught = (shikshaqData as any)["Classes Taught"];
            classesTaughtForBackend = (shikshaqData as any)["Classes Taught for Backend"];
            area = (shikshaqData as any)["Area"];
            boardsTaught = (shikshaqData as any)["School Boards Catered"];
            classSize = (shikshaqData as any)["Class Size (Group/ Solo)"];
            modeOfTeaching = (shikshaqData as any)["Mode of Teaching"];
            placeOfTeaching = (shikshaqData as any)["Place of Teaching"];
            locationV2 = (shikshaqData as any)["LOCATION V2"] || (shikshaqData as any)["Location V2"] || (shikshaqData as any)["location_v2"];
            studentsHomeAreas = (shikshaqData as any)["STUDENT'S HOME IN THESE AREAS"] || (shikshaqData as any)["student's home in these areas"] || (shikshaqData as any)["Student's home in these areas"];
            tutorsHomeAreas = (shikshaqData as any)["TUTOR'S HOME IN THESE AREAS"] || (shikshaqData as any)["Tutor's home in these areas"];
            expanded = (shikshaqData as any)["EXPANDED"] || (shikshaqData as any)["Expanded"] || (shikshaqData as any)["expanded"];
            description = (shikshaqData as any)["Description"];
            qualificationsEtc = (shikshaqData as any)["Qualifications etc"];
            teachingSinceRaw = (shikshaqData as any)["Years they started teaching"] ?? null;
            review1 = (shikshaqData as any)["Review 1"];
            review2 = (shikshaqData as any)["Review 2"];
            review3 = (shikshaqData as any)["Review 3"];
            whatsappLink = (shikshaqData as any)["Link"] || (shikshaqData as any)["link"];
            // Fees - INTEGER columns from Supabase
            const minFeesRaw = (shikshaqData as any)["Min Fees"];
            const maxFeesRaw = (shikshaqData as any)["Max Fees"];
            // Convert to number if not null/undefined, preserve 0 values
            minFees = (minFeesRaw != null && minFeesRaw !== undefined) ? Number(minFeesRaw) : null;
            maxFees = (maxFeesRaw != null && maxFeesRaw !== undefined) ? Number(maxFeesRaw) : null;
          }
        } catch (err) {
          if (import.meta.env.DEV) {
            console.warn('Error accessing Shikshaqmine table:', err);
          }
        }
      }

      if (teacherData) {
        // Add all the data to the teacher object
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

  // Observe the primary CTA panel so the floating mobile CTA only appears
  // once the "real" one has scrolled out of view (not on top of it).
  useEffect(() => {
    const node = primaryCtaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPrimaryCtaVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [teacher?.id]);

  // Record this visit for the home page's "Recently visited" section
  // (device-local only, see src/lib/recently-visited.ts).
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

  // Add teacher profile JSON-LD structured data
  useEffect(() => {
    if (!teacher || !teacher.slug) return;
    let cancelled = false;

    // Helper function to convert comma-separated string to array
    const toArray = (value: string | null | undefined): string[] => {
      if (!value || typeof value !== 'string') return [];
      return value.split(',').map(s => s.trim()).filter(Boolean);
    };

    // Get subject slug for breadcrumb
    const subjectSlug = teacher.subjects?.slug ||
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

    // Person schema (basic info)
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

    // BreadcrumbList schema
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
    // moderated reviews (same table TeacherComments renders on-page) — rather
    // than the legacy `Shikshaqmine.review_1/2/3` columns, which are static
    // imported text with no moderation trail. Only approved comments are
    // eligible (RLS also enforces this for the anon client), and no rating is
    // ever attached — see generatePersonReviewSchema for why.
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

    // Cleanup: remove scripts when component unmounts or teacher changes
    return () => {
      cancelled = true;
      const existingPerson = document.getElementById('teacher-profile-person-schema');
      const existingBreadcrumb = document.getElementById('teacher-profile-breadcrumb-schema');
      const existingReviews = document.getElementById('teacher-profile-reviews-schema');
      if (existingPerson) existingPerson.remove();
      if (existingBreadcrumb) existingBreadcrumb.remove();
      if (existingReviews) existingReviews.remove();
    };
  }, [teacher]);

  // Title/description — canonical is handled globally by <CanonicalTag> in App.tsx.
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

  const backHref = (location.state as { fromBrowse?: string })?.fromBrowse ?? '/all-tuition-teachers-in-kolkata';

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-5 h-4 w-32 animate-shimmer rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <div className="aspect-[4/5] animate-shimmer rounded-2xl bg-muted" />
              <div className="mt-3.5 flex gap-2">
                <div className="h-11 flex-1 animate-shimmer rounded-lg bg-muted" />
                <div className="h-11 flex-1 animate-shimmer rounded-lg bg-muted" />
              </div>
            </div>
            <div>
              <div className="h-10 w-2/3 animate-shimmer rounded-lg bg-muted" />
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-24 animate-shimmer rounded-full bg-muted" />
                <div className="h-6 w-24 animate-shimmer rounded-full bg-muted" />
                <div className="h-6 w-24 animate-shimmer rounded-full bg-muted" />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="h-[72px] animate-shimmer rounded-2xl bg-muted" />
                <div className="h-[72px] animate-shimmer rounded-2xl bg-muted" />
                <div className="h-[72px] animate-shimmer rounded-2xl bg-muted" />
              </div>
            </div>
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
          <p className="mb-6 text-sm text-muted-foreground">
            The teacher you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/all-tuition-teachers-in-kolkata"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Browse all teachers
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const requireAuth = () => {
    saveAuthRedirect(location.pathname);
    navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      requireAuth();
      return;
    }
    await toggleLike(teacher.id);
  };

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      requireAuth();
      return;
    }
    await toggleUpvote(teacher.id);
  };

  const handleWhatsAppClick = () => {
    if (!user) {
      requireAuth();
      return;
    }
    const url = resolveTeacherWhatsAppUrl(teacher.whatsapp_link);
    navigate(`/tuition-teachers/${teacher.slug}/whatsapp-click`, { state: { url, name: teacher.name } });
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

  // Destination-fold accent — the whole first fold (marker highlight on the
  // headline, the missing-photo illustration, the WhatsApp ticket) is driven
  // by the teacher's primary subject color instead of a flat brand default.
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

  // Sanitize the description: allow rich formatting when the field already has HTML,
  // otherwise treat it as plain text with line breaks.
  const descriptionHtml = teacher.description
    ? /<[a-z][\s\S]*>/i.test(teacher.description)
      ? DOMPurify.sanitize(teacher.description, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          ALLOWED_ATTR: ['href', 'target', 'rel'],
        })
      : DOMPurify.sanitize(teacher.description.replace(/\n/g, '<br />'), { ALLOWED_TAGS: ['br'] })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 sm:px-6 sm:py-8 lg:px-8">
        <Link
          to={backHref}
          className="mb-5 inline-flex items-center text-sm font-semibold text-warm-meta transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ← Back to results
        </Link>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Left column. Tried `sticky` here to keep the photo in view against the
              taller text column — reverted: this site sets a global `overflow-x: hidden`
              on <html> (needed to contain the decorative blob shapes), which breaks
              viewport-relative `position: sticky` in this browser engine. Not worth
              touching a global, site-wide overflow rule for one column on one page.
              The review cap below (3, was unbounded) is the real fix for the height gap. */}
          <div className="relative">
            {/* Organic blob decoration behind the photo — mobile-vibes-event-app reference
                (soft blob shapes as background decoration). Purely ornamental, tokens only,
                sits behind everything (-z-10) so it can never interfere with the photo or
                the floating action buttons on top of it. Sized up from the first pass — at
                h-40/h-32 these read as a faint smudge behind the photo edge rather than the
                bold background shape the reference shows; scaled ~35% bigger and pushed
                further off-frame so more of the blob is actually visible past the card. */}
            <div
              className="absolute -left-8 -top-10 -z-10 h-52 w-52 rounded-[55%_45%_65%_35%/50%_40%_60%_50%] bg-brand-subtle sm:-left-14 sm:-top-14 sm:h-72 sm:w-72"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 -right-8 -z-10 hidden h-40 w-40 rounded-[40%_60%_35%_65%/55%_35%_65%_45%] bg-brand-blue-subtle sm:block sm:h-52 sm:w-52"
              aria-hidden="true"
            />

            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-border">
              {teacher.image_url ? (
                <img
                  src={validateImageSrc(teacher.image_url)}
                  alt={teacher.name}
                  width={800}
                  height={1000}
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              ) : (
                /* VISUAL_DIRECTION §9a — "illustration-first imagery": a teacher with no
                   photo gets a subject-colored cut-paper mark instead of the old diagonal-
                   stripe placeholder, so a missing photo reads as intentional, not broken. */
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ backgroundColor: accentPalette.tint }}
                >
                  <CutPaperShape variant="blob" color={accentPalette.solid} size={200} className="absolute" />
                  <span className="relative font-display text-6xl font-black" style={{ color: accentPalette.text }} aria-hidden="true">
                    {teacher.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Verified badge — floating circular icon-button over the hero photo,
                  opposite corner from the heart/upvote pair. Real data (teacher.is_verified),
                  not decoration for its own sake: it's the one piece of trust signal
                  DESIGN_SYSTEM §12 calls out ("reassurance: verification...") that wasn't
                  visually surfaced anywhere on this page before. Informational, not
                  actionable — brand-blue tint reads as a badge, never a second CTA next to
                  the WhatsApp button below. */}
              {teacher.is_verified && (
                // Was `aria-hidden="true"` on the whole badge, which hid a real trust
                // signal (DESIGN_SYSTEM §12) from screen readers entirely. Only the
                // decorative icon is hidden now; the badge itself announces via its text.
                <div
                  role="status"
                  className="animate-pop absolute left-2.5 top-2.5 flex h-11 items-center gap-1.5 rounded-full bg-brand-blue px-3.5 shadow-border"
                >
                  <ShieldCheck size={15} className="text-white" strokeWidth={2.3} aria-hidden="true" />
                  <span className="text-xs font-bold text-white">Verified</span>
                </div>
              )}

              {/* Favourite / upvote — floating circular icon-buttons over the hero photo
                  (mobile-vibes-event-app reference) instead of a flat button row below it.
                  Same handlers/aria as before; presentation only. Secondary to the WhatsApp
                  CTA per DESIGN_SYSTEM §12 — quiet bone-on-blur chips, not accent-colored. */}
              <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
                {/* Task #2 — heart/upvote/WhatsApp all silently gated on sign-in, only
                    discovered on click. A small lock badge signals the requirement up
                    front for signed-out visitors, without blocking or nagging anyone
                    already signed in (badge simply doesn't render for them). */}
                <button
                  type="button"
                  onClick={handleHeartClick}
                  aria-label={liked ? 'Remove from favourites' : user ? 'Add to favourites' : 'Add to favourites (sign in required)'}
                  aria-pressed={liked}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card/90 shadow-border backdrop-blur-sm transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <Heart size={17} className={liked ? 'fill-destructive text-destructive' : 'text-foreground/70'} />
                  {!user && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background"
                      aria-hidden="true"
                    >
                      <Lock size={9} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleUpvoteClick}
                  aria-label={upvoted ? 'Remove upvote' : user ? 'Upvote teacher' : 'Upvote teacher (sign in required)'}
                  aria-pressed={upvoted}
                  className="relative flex h-11 min-w-11 items-center justify-center gap-1 rounded-full bg-card/90 px-2.5 shadow-border backdrop-blur-sm transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <ArrowUp size={15} className="text-brand-blue" strokeWidth={2.2} />
                  <span className="tabular-nums text-xs font-semibold text-foreground">{upvoteCount}</span>
                  {!user && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background"
                      aria-hidden="true"
                    >
                      <Lock size={9} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="relative">
            {/* Third blob behind the name/headline — the right column was left completely flat
                by the first pass while the left column got two shapes; this closes that gap so
                the blob decoration reads as one composition rather than a one-sided accent.
                Well clear of the WhatsApp CTA further down, -z-10, never intercepts clicks. */}
            <div
              className="absolute -right-6 -top-8 -z-10 hidden h-44 w-44 rounded-[45%_55%_60%_40%/40%_55%_45%_60%] bg-brand-subtle lg:block"
              aria-hidden="true"
            />
            {/* Destination fold — floated SpeechTag annotations (board / area /
                experience) instead of a boring subtitle line, ahead of the heavy
                display headline. This is the end of the wayfinding journey, so it
                gets the same loud treatment as the WhatsApp CTA below it. */}
            {(boardsList.length > 0 || teacher.area || teacher.experience_years) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {boardsList.length > 0 && (
                  <SpeechTag tail="bottom-left" dotColor="hsl(var(--brand-blue))">{boardsList.join(' + ')}</SpeechTag>
                )}
                {teacher.area && (
                  <SpeechTag tail="bottom-right" tilt={-2} dotColor={accentPalette.solid}>{teacher.area}</SpeechTag>
                )}
                {teacher.experience_years && (
                  <SpeechTag tail="top-left" tilt={2}>{teacher.experience_years}+ years teaching</SpeechTag>
                )}
              </div>
            )}

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
                  <SubjectTag key={subject} label={subject} />
                ))}
                {boardsList.map((board) => (
                  <ModeTag key={board} label={board} variant="blue" />
                ))}
                {teacher.area && <ModeTag label={teacher.area} variant="brand" />}
              </div>
            )}

            {hasStats ? (
              <div className="stagger-children mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {teacher.experience_years && (
                  <StatCard icon={Clock} label="Experience" value={`${teacher.experience_years}+ years`} />
                )}
                {feesValue && <StatCard icon={Wallet} label="Fees / month" value={feesValue} />}
                {classSizeValue && <StatCard icon={Users} label="Class size" value={classSizeValue} />}
              </div>
            ) : (
              // Task #3 — a teacher with none of the three stats used to silently
              // render no stat block at all. That reads as broken, not honest, so it
              // gets an explicit line instead of empty space.
              <div className="mt-6 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                Experience, fees, and class size aren't listed yet — ask {firstName} directly on WhatsApp.
              </div>
            )}

            {/* Primary CTA — the single accented action on this page (§7, §12): WhatsApp
                contact. Moved up to sit right after subjects/stats instead of after the
                description AND every review — a critique found it buried as the literal
                last element on the page, under ~12 unedited testimonials, competing with
                (and losing to) that wall of text. Nothing should out-scroll this button. */}
            {/* The single success action for the whole product (VISUAL_DIRECTION §12) —
                the destination of the wayfinding journey. LOUD is permitted here: thick
                outline + offset shadow reads as "arrival", not decoration. */}
            <div
              ref={primaryCtaRef}
              className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-muted p-6"
            >
              <p className="max-w-[44ch] text-sm leading-6 text-warm-prose">
                Fees and arrangements are settled directly between you and the teacher. Shikshaq takes no commission.
                {!user && (
                  <span className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
                    <Lock size={11} strokeWidth={2.5} aria-hidden="true" />
                    Sign in to message — quick, one tap.
                  </span>
                )}
              </p>
              {/* Device Q — Ticket shape. Messaging a teacher is the product's only
                  success action, so it gets the "arrival" treatment: a notched ticket
                  instead of a plain button. */}
              <TicketShape background="hsl(var(--brand))" textColor="#FFFFFF">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="whatsapp-pulse-once flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-brand-foreground transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand motion-reduce:transition-none"
                >
                  <WhatsAppIcon className="h-[17px] w-[17px] text-brand-foreground" />
                  Contact via WhatsApp
                </button>
              </TicketShape>
            </div>

            {descriptionHtml && (
              <>
                <SectionHeading>Little more about {firstName}</SectionHeading>
                <div
                  className="max-w-prose text-base leading-7 text-warm-prose [&_p+p]:mt-3"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
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
                  {taughtAreas.map((area) => (
                    <span key={area} className="animate-card-reveal rounded-full bg-muted px-3.5 py-2 text-sm font-medium text-foreground">
                      {area}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <TeacherComments teacherId={teacher.id} />
      </main>

      {/* Floating mobile CTA — task #1: the WhatsApp button must stay reachable as
          the parent reads the whole profile, not just while the panel above is on
          screen. Desktop's two-column layout keeps the real CTA within easy reach,
          so this is mobile-only. Sits above the fixed bottom nav bar (h-16 + safe
          area), never fights it for the thumb zone. */}
      {!primaryCtaVisible && (
        <div className="animate-pop fixed inset-x-4 bottom-20 z-40 lg:hidden">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="sticker outline-offset-shadow flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 text-base font-bold text-brand-foreground transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <WhatsAppIcon className="h-5 w-5 text-brand-foreground" />
            Contact via WhatsApp
          </button>
        </div>
      )}

      <Footer expandedContent={teacher.expanded || null} />
    </div>
  );
}
