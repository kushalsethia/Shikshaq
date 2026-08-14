import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, ArrowUp, Clock, Wallet, Users } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { usePageMeta } from '@/hooks/usePageMeta';
import { resolveTeacherWhatsAppUrl } from '@/utils/whatsapp';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { getSubjectColors } from '@/utils/subjectColors';
import { getCache, setCache, CACHE_TTL, getTeacherProfileCacheKey, getShikshaqmineBySlugCacheKey } from '@/utils/cache';
import DOMPurify from 'dompurify';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { saveAuthRedirect } from '@/utils/authRedirect';
import { recordVisit } from '@/lib/recently-visited';

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

interface TeacherReview {
  id: string;
  comment: string;
  authorName: string;
  authorInfo: string;
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

function Tag({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ padding: '6px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: bg, color }}>
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div style={{ padding: 18, borderRadius: 16, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8B837A', marginBottom: 6 }}>
        <Icon size={13} color="#8B837A" strokeWidth={2} aria-hidden="true" />
        {label}
      </div>
      <div className="tabular-nums" style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const sectionH2Style: React.CSSProperties = {
  fontSize: 'clamp(21px,2.4vw,26px)',
  fontWeight: 700,
  lineHeight: 1,
  margin: '32px 0 12px',
};

export default function TeacherProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<TeacherReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { isUpvoted, toggleUpvote, getUpvoteCount } = useUpvotes();
  const navigate = useNavigate();
  const location = useLocation();

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

  // "What students say" — approved teacher_comments only, per pages/TeacherProfile.md.
  // Rows without an `approved` column yet (pre-moderation data) default to approved, matching
  // the same backwards-compatibility rule TeacherComments.tsx uses.
  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      if (!teacher) return;
      setReviewsLoading(true);

      const { data: commentsData, error } = await supabase
        .from('teacher_comments')
        .select('id, comment, created_at, user_id, is_anonymous, approved')
        .eq('teacher_id', teacher.id)
        .order('created_at', { ascending: false });

      if (error || !commentsData || commentsData.length === 0) {
        if (!cancelled) {
          setReviews([]);
          setReviewsLoading(false);
        }
        return;
      }

      const approvedComments = commentsData.filter((c: any) => (c.approved ?? true) === true);
      const userIds = [...new Set(approvedComments.filter((c: any) => !c.is_anonymous).map((c: any) => c.user_id))];

      let profilesMap = new Map<string, any>();
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('public_profiles')
          .select('id, full_name, role, school_college, grade')
          .in('id', userIds);
        profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
      }

      const mapped: TeacherReview[] = approvedComments.map((c: any) => {
        const profile = c.is_anonymous ? null : profilesMap.get(c.user_id);
        const authorName = !c.is_anonymous && profile?.full_name ? profile.full_name : 'Anonymous';
        let authorInfo = '';
        if (!c.is_anonymous && profile) {
          if (profile.role === 'guardian') authorInfo = 'Guardian';
          else if (profile.role === 'student') {
            authorInfo = [profile.school_college, profile.grade ? `Grade ${profile.grade}` : null].filter(Boolean).join(' • ');
          }
        }
        return { id: c.id, comment: c.comment, authorName, authorInfo };
      });

      if (!cancelled) {
        setReviews(mapped);
        setReviewsLoading(false);
      }
    }

    fetchReviews();
    return () => {
      cancelled = true;
    };
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
    const review1 = teacher.review_1 || null;
    const review2 = teacher.review_2 || null;
    const review3 = teacher.review_3 || null;

    // Person schema (basic info)
    const personScript = document.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.id = 'teacher-profile-person-schema';
    personScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${teacherUrl}#person`,
      "name": teacherName,
      "description": teacherDescription || undefined,
      "url": teacherUrl,
      "jobTitle": "Tutor",
      ...(phoneNumber && { "telephone": phoneNumber }),
      ...(area && {
        "address": {
          "@type": "PostalAddress",
          "addressLocality": area,
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        }
      }),
      ...(qualifications && {
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "name": qualifications
          }
        ]
      }),
      ...(subjects.length > 0 && { "knowsAbout": subjects }),
      ...(classesTaught.length > 0 && { "teaches": classesTaught }),
      ...(area && {
        "workLocation": {
          "@type": "Place",
          "name": area
        }
      }),
      "memberOf": {
        "@type": "EducationalOrganization",
        "name": "Shikshaq",
        "url": "https://www.shikshaq.in"
      },
      ...(phoneNumber && {
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Direct Contact",
          "telephone": phoneNumber,
          "contactOption": "TollFree"
        }
      })
    });

    // BreadcrumbList schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'teacher-profile-breadcrumb-schema';
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.shikshaq.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tuition Teachers",
        "item": "https://www.shikshaq.in/all-tuition-teachers-in-kolkata"
      }
    ];

    if (subjectSlug && subjectName) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": subjectName,
        "item": subjectUrl
      });
    }

    breadcrumbItems.push({
      "@type": "ListItem",
      "position": breadcrumbItems.length + 1,
      "name": teacherName,
      "item": teacherUrl
    });

    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${teacherUrl}#breadcrumb`,
      "itemListElement": breadcrumbItems
    });

    // Person schema with reviews (if reviews exist)
    const reviewsForSchema = [review1, review2, review3].filter(Boolean);
    let reviewScript = null;
    if (reviewsForSchema.length > 0) {
      reviewScript = document.createElement('script');
      reviewScript.type = 'application/ld+json';
      reviewScript.id = 'teacher-profile-reviews-schema';

      const reviewItems = reviewsForSchema.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Student"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": review
      }));

      reviewScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${teacherUrl}#reviews`,
        "name": teacherName,
        "review": reviewItems
      });
    }

    // Add scripts to head
    document.head.appendChild(personScript);
    document.head.appendChild(breadcrumbScript);
    if (reviewScript) {
      document.head.appendChild(reviewScript);
    }

    // Cleanup: remove scripts when component unmounts or teacher changes
    return () => {
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
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px' }}>
          <div className="animate-pulse" style={{ height: 16, width: 130, borderRadius: 8, background: '#F0EAE2', marginBottom: 20 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 36 }}>
            <div>
              <div className="animate-pulse" style={{ aspectRatio: '4/5', borderRadius: 22, background: '#F0EAE2' }} />
              <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
                <div className="animate-pulse" style={{ flex: 1, height: 44, borderRadius: 12, background: '#F0EAE2' }} />
                <div className="animate-pulse" style={{ flex: 1, height: 44, borderRadius: 12, background: '#F0EAE2' }} />
              </div>
            </div>
            <div>
              <div className="animate-pulse" style={{ height: 40, width: '70%', borderRadius: 8, background: '#F0EAE2' }} />
              <div style={{ display: 'flex', gap: 7, marginTop: 16 }}>
                <div className="animate-pulse" style={{ height: 26, width: 90, borderRadius: 999, background: '#F0EAE2' }} />
                <div className="animate-pulse" style={{ height: 26, width: 90, borderRadius: 999, background: '#F0EAE2' }} />
                <div className="animate-pulse" style={{ height: 26, width: 90, borderRadius: 999, background: '#F0EAE2' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginTop: 24 }}>
                <div className="animate-pulse" style={{ height: 72, borderRadius: 16, background: '#F0EAE2' }} />
                <div className="animate-pulse" style={{ height: 72, borderRadius: 16, background: '#F0EAE2' }} />
                <div className="animate-pulse" style={{ height: 72, borderRadius: 16, background: '#F0EAE2' }} />
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
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(25px,3.4vw,38px)', fontWeight: 700, marginBottom: 16 }}>Teacher not found</h1>
          <p style={{ fontSize: 15, color: '#7B736B', marginBottom: 24 }}>
            The teacher you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/all-tuition-teachers-in-kolkata"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '12px 22px', borderRadius: 12, background: '#FF8000', color: '#1F1F1F', fontSize: 14.5, fontWeight: 600 }}
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
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px' }}>
        <Link
          to={backHref}
          style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 600, color: '#8B837A', marginBottom: 20 }}
        >
          ← Back to results
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 36 }}>
          {/* Left column */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 22, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              {teacher.image_url ? (
                <img
                  src={validateImageSrc(teacher.image_url)}
                  alt={teacher.name}
                  width={800}
                  height={1000}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: 'repeating-linear-gradient(45deg,#F2ECE4 0 8px,#F9F5F1 8px 16px)',
                  }}
                >
                  <span style={{ fontSize: 64, fontWeight: 700, color: 'rgba(31,31,31,.2)' }}>{teacher.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
              <button
                type="button"
                onClick={handleHeartClick}
                aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
                className="active:scale-[0.97] transition-transform duration-150 [transition-timing-function:ease] motion-reduce:transition-none"
                style={{ flex: 1, minHeight: 44, padding: 12, borderRadius: 12, fontSize: 13.5, fontWeight: 600, boxShadow: '0 0 0 1px #E7DFD5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Heart size={15} className={liked ? 'fill-[#E5484D] text-[#E5484D]' : 'text-foreground/70'} />
                Favourite
              </button>
              <button
                type="button"
                onClick={handleUpvoteClick}
                aria-label={upvoted ? 'Remove upvote' : 'Upvote teacher'}
                className="active:scale-[0.97] transition-transform duration-150 [transition-timing-function:ease] motion-reduce:transition-none"
                style={{ flex: 1, minHeight: 44, padding: 12, borderRadius: 12, fontSize: 13.5, fontWeight: 600, boxShadow: '0 0 0 1px #E7DFD5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <ArrowUp size={15} color="#4351FF" strokeWidth={2.2} />
                <span className="tabular-nums">{upvoteCount}</span>
              </button>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h1 style={{ fontSize: 'clamp(27px,3.8vw,44px)', lineHeight: 1, fontWeight: 700 }}>
              {formatDisplayName(teacher.name, teacher.sir_maam)}
            </h1>

            {(subjectsList.length > 0 || boardsList.length > 0 || teacher.area) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 16 }}>
                {subjectsList.map((subject) => {
                  const colors = getSubjectColors(subject);
                  return <Tag key={subject} label={subject} bg={colors.tint} color={colors.titleText} />;
                })}
                {boardsList.map((board) => (
                  <Tag key={board} label={board} bg="#EDEEFF" color="#2E3AD6" />
                ))}
                {teacher.area && <Tag label={teacher.area} bg="#FFF4E8" color="#B35900" />}
              </div>
            )}

            {hasStats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginTop: 24 }}>
                {teacher.experience_years && (
                  <StatCard icon={Clock} label="Experience" value={`${teacher.experience_years}+ years`} />
                )}
                {feesValue && <StatCard icon={Wallet} label="Fees / month" value={feesValue} />}
                {classSizeValue && <StatCard icon={Users} label="Class size" value={classSizeValue} />}
              </div>
            )}

            {descriptionHtml && (
              <>
                <h2 style={sectionH2Style}>Little more about {firstName}</h2>
                <div
                  style={{ maxWidth: '62ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}
                  className="[&_p+p]:mt-3"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </>
            )}

            {taughtAreas.length > 0 && (
              <>
                <h2 style={sectionH2Style}>Where they teach</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {taughtAreas.map((area) => (
                    <span key={area} style={{ padding: '8px 14px', borderRadius: 999, background: '#F0EAE2', fontSize: 13.5, fontWeight: 500 }}>
                      {area}
                    </span>
                  ))}
                </div>
              </>
            )}

            {!reviewsLoading && reviews.length > 0 && (
              <>
                <h2 style={sectionH2Style}>What students say</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  {reviews.map((review) => (
                    <div key={review.id} style={{ padding: 20, borderRadius: 18, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
                      <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: '#4A443E' }}>{review.comment}</p>
                      <p style={{ margin: 0, marginTop: 10, fontSize: 12.5, fontWeight: 600, color: '#8B837A' }}>
                        {review.authorName}
                        {review.authorInfo ? ` • ${review.authorInfo}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: 28, padding: 22, borderRadius: 20, background: '#F0EAE2', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#4A443E', maxWidth: '44ch' }}>
                Fees and arrangements are settled directly between you and the teacher. Shikshaq takes no commission.
              </p>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="active:scale-[0.97] transition-transform duration-150 [transition-timing-function:ease] motion-reduce:transition-none"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, minHeight: 44, padding: '15px 24px', borderRadius: 12, background: '#25D366', color: '#0B3D1F', fontSize: 15, fontWeight: 700 }}
              >
                <WhatsAppIcon className="w-[17px] h-[17px] text-[#0B3D1F]" />
                Contact via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer expandedContent={teacher.expanded || null} />
    </div>
  );
}
