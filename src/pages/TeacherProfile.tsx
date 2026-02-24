import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Clock, BadgeCheck, Heart, GraduationCap, Users } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useStudiesWith } from '@/lib/studies-with-context';
import { useAuth } from '@/lib/auth-context';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { TeacherComments } from '@/components/TeacherComments';
import { ShareButton } from '@/components/ShareButton';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { getCache, setCache, CACHE_TTL, getTeacherProfileCacheKey, getShikshaqmineBySlugCacheKey } from '@/utils/cache';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import { validateImageSrc } from '@/utils/imageSanitizer';


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

export default function TeacherProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { isUpvoted, toggleUpvote, getUpvoteCount } = useUpvotes();
  const { isStudyingWith, toggleStudiesWith } = useStudiesWith();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<Array<{ id: string; full_name: string | null; school_college: string | null; grade: string | null }>>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [whatsappDisclaimerOpen, setWhatsappDisclaimerOpen] = useState(false);
  const [pendingWhatsappUrl, setPendingWhatsappUrl] = useState<string | null>(null);
  const reviewsSectionRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  // Check if user has a role - redirect to role selection if not
  // Also check if teacher has agreed to terms
  useEffect(() => {
    const checkUserRole = async () => {
      if (authLoading) return;
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, terms_agreement')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile || !profile.role) {
          navigate('/select-role', { replace: true });
          return;
        }

        // If user is a teacher but hasn't agreed to terms, redirect to teacher terms agreement
        if (profile.role === 'teacher' && profile.terms_agreement !== true) {
          navigate('/teacher-terms-agreement', { replace: true });
          return;
        }

        setUserRole(profile.role);
      } else {
        setUserRole(null);
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);

  // Scroll to reviews when URL has #reviews (e.g. shared link or in-page link)
  useEffect(() => {
    if (location.hash !== '#reviews' || !teacher) return;
    const el = reviewsSectionRef.current || document.getElementById('reviews');
    if (el) {
      const id = requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [location.hash, teacher]);

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
            
            // Debug in development
            if (import.meta.env.DEV) {
              console.log('[TeacherProfile] Fees data:', {
                raw: { minFeesRaw, maxFeesRaw, rawType: { min: typeof minFeesRaw, max: typeof maxFeesRaw } },
                processed: { minFees, maxFees },
                willDisplay: { min: minFees != null, max: maxFees != null },
                allShikshaqKeys: Object.keys(shikshaqData || {}),
                feeKeys: Object.keys(shikshaqData || {}).filter(k => k.toLowerCase().includes('fee'))
              });
            }
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

  // Add teacher profile JSON-LD structured data
  useEffect(() => {
    if (!teacher || !teacher.slug) return;

    // Helper function to safely get value or null
    const safeValue = (value: any) => value || null;
    
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
    const subjectUrl = subjectSlug ? `https://www.shikshaq.in/${subjectSlug}-tuition-teachers-in-kolkata` : 'https://www.shikshaq.in/search';

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
        "item": "https://www.shikshaq.in/search"
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
    const reviews = [review1, review2, review3].filter(Boolean);
    let reviewScript = null;
    if (reviews.length > 0) {
      reviewScript = document.createElement('script');
      reviewScript.type = 'application/ld+json';
      reviewScript.id = 'teacher-profile-reviews-schema';
      
      const reviewItems = reviews.map(review => ({
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": reviews.length.toString(),
          "bestRating": "5",
          "worstRating": "1"
        },
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

  // Update document title and meta tags for SEO
  useEffect(() => {
    if (!teacher) return;

    // Helper function to get display value or fallback
    const getValue = (value: string | null | undefined, fallback: string = '') => value || fallback;
    
    const teacherName = getValue(teacher.name);
    const subjects = getValue(teacher.subjects_from_shikshaq || teacher.subjects?.name, 'subjects');
    const classesTaught = getValue(teacher.classes_taught || teacher.classes_taught_for_backend, 'classes');
    const area = getValue(teacher.area, 'Kolkata');
    const modeOfTeaching = getValue(teacher.mode_of_teaching, 'online/offline');
    const expanded = getValue(teacher.expanded, '');

    // Build title: {{Title}} teaches {{Subjects}} for Classes {{Classes Taught}} in {{Area}} via {{Mode of Teaching}} on Shikshaq by AquaTerra
    const title = `${teacherName} teaches ${subjects} for Classes ${classesTaught} in ${area} via ${modeOfTeaching} on Shikshaq by AquaTerra`;
    
    // Build description: {{Subjects}} tuition classes for {{Classes Taught}} in {{Area}} via {{Mode of Teaching}} {{EXPANDED}}
    let description = `${subjects} tuition classes for ${classesTaught} in ${area} via ${modeOfTeaching}`;
    if (expanded) {
      // Strip HTML tags using DOMPurify for complete sanitization and limit to ~150 characters for meta description
      const expandedText = DOMPurify.sanitize(expanded, { ALLOWED_TAGS: [] }).trim();
      const expandedPreview = expandedText.length > 150 
        ? expandedText.substring(0, 147) + '...' 
        : expandedText;
      description = `${description}. ${expandedPreview}`;
    }

    // Update document title
    document.title = title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update or create Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    // Update or create Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);

    // Cleanup: restore default title and meta tags when component unmounts
    return () => {
      document.title = 'Shikshaq - by AquaTerra';
      const defaultDescription = 'Shikshaq connects students with real local tuition teachers for free. Discover trusted, verified educators near you for school subjects and exams- simple, genuine, and community-driven learning with no hidden costs.';
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDescription);
      
      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      if (ogTitleEl) ogTitleEl.setAttribute('content', 'Shikshaq - by AquaTerra');
      
      const ogDescEl = document.querySelector('meta[property="og:description"]');
      if (ogDescEl) ogDescEl.setAttribute('content', defaultDescription);
      
      const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitleEl) twitterTitleEl.setAttribute('content', 'Shikshaq - by AquaTerra');
      
      const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescEl) twitterDescEl.setAttribute('content', defaultDescription);
    };
  }, [teacher]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-[4/5] bg-muted rounded-3xl" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/4 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to fetch students who have studied with this teacher
  async function fetchStudentsList() {
    if (!teacher) return;
    
    try {
      setLoadingStudents(true);
      
      // Fetch students from student_teachers table
      const { data: studentTeachers, error } = await supabase
        .from('student_teachers')
        .select('student_id')
        .eq('teacher_id', teacher.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching students list:', error);
        }
        return;
      }

      if (!studentTeachers || studentTeachers.length === 0) {
        setStudentsList([]);
        return;
      }

      // Fetch profiles for all students (use public_profiles view to avoid PII exposure)
      const studentIds = studentTeachers.map((st: any) => st.student_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('public_profiles')
        .select('id, full_name, school_college, grade')
        .in('id', studentIds);

      if (profilesError) {
        if (import.meta.env.DEV) {
          console.error('Error fetching student profiles:', profilesError);
        }
        return;
      }

      // Create a map for quick lookup
      const profilesMap = new Map((profiles || []).map((p: any) => [p.id, p]));

      // Transform the data to match our state structure
      const students = studentIds.map((studentId: string) => {
        const profile = profilesMap.get(studentId);
        return {
          id: studentId,
          full_name: profile?.full_name || null,
          school_college: profile?.school_college || null,
          grade: profile?.grade || null,
        };
      });

      setStudentsList(students);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching students list:', error);
      }
    } finally {
      setLoadingStudents(false);
    }
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-16 text-center md:pt-16">
          <h1 className="text-2xl font-sans font-normal text-foreground mb-4">Teacher not found</h1>
          <p className="text-foreground/80 mb-6">
            The teacher you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/all-tuition-teachers-in-kolkata">
            <Button>Browse all teachers</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-20 sm:pt-[120px] pb-24 md:pb-12 md:pt-12">
        <Link
          to="/all-tuition-teachers-in-kolkata"
          className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all teachers
        </Link>

        {/* Content in normal flow so window scrolls and reviews + footer are reachable on mobile */}
        <div className="min-w-0">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 min-w-0">
          {/* Hero image - sticky within scroll area on mobile, sticky in viewport on desktop */}
          <div className="relative min-h-[220px] md:min-h-0 md:h-auto md:flex md:items-start min-w-0">
            <div className="sticky top-0 md:top-24 w-full md:w-fit md:max-w-full">
              {teacher.image_url ? (
                <img
                  src={teacher.image_url ? validateImageSrc(teacher.image_url) : ''}
                  alt={teacher.name}
                  className="block w-full max-w-full max-h-[55vh] md:max-h-[min(75vh,520px)] w-auto h-auto object-contain rounded-t-2xl md:rounded-3xl shadow-xl"
                />
              ) : (
                <div className="w-full min-h-[220px] max-h-[55vh] md:min-h-[200px] md:max-h-[min(75vh,520px)] aspect-[4/5] bg-gradient-to-br from-muted to-accent flex items-center justify-center rounded-t-2xl md:rounded-3xl shadow-xl">
                  <span className="text-6xl font-sans text-muted-foreground">
                    {teacher.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {teacher.is_verified && (
                  <div className="bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-badge-science" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
              {/* Combined Heart and Share Buttons - Bottom Right of Image */}
              <div className="absolute bottom-4 right-4 md:top-4 md:left-4 md:bottom-auto md:right-auto">
                <div className="inline-flex items-center rounded-full border-2 border-border bg-card/90 backdrop-blur-sm overflow-hidden">
                  <div className="p-2 hover:bg-muted/80 transition-colors flex items-center">
                    <ShareButton
                      url={`/tuition-teachers/${teacher.slug}`}
                      title={`${teacher.name}${teacher.sir_maam ? ` ${teacher.sir_maam}` : ''}`}
                      description={teacher.subjects_from_shikshaq || teacher.subjects?.name || 'Tuition Teacher'}
                      className="[&>button]:!p-0 [&>button]:!bg-transparent [&>button]:hover:!bg-transparent [&>button]:!backdrop-blur-none"
                      iconSize="md"
                      menuWidth="md"
                    />
                  </div>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!user) {
                        navigate('/auth');
                        return;
                      }
                      await toggleLike(teacher.id);
                    }}
                    className="p-2 hover:bg-muted/80 transition-colors flex items-center border-l border-border"
                    aria-label={isLiked(teacher.id) ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked(teacher.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-foreground/70'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info - on mobile: slight overlap so card starts natural, then scrolls up over image */}
          <div className="relative -mt-6 md:mt-0 rounded-t-3xl md:rounded-none bg-background md:shadow-none pt-2 pb-4 md:pt-0 md:pb-0 px-4 md:px-0 space-y-4 min-w-0 z-10 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.08)]">
            {/* Sheet handle - mobile only */}
            <div className="flex justify-center md:hidden pt-1 pb-2" aria-hidden>
              <div className="w-12 h-1 rounded-full bg-muted-foreground/40" />
            </div>

            {/* Teacher Name and Upvote Button - Inline */}
            <div className="flex items-start justify-between gap-4 min-w-0">
              <h1 className="flex-1 min-w-0 text-3xl md:text-4xl lg:text-5xl font-sans font-semibold text-foreground break-words">
                {(() => {
                  const sirMaam = teacher.sir_maam;
                  if (!sirMaam) return teacher.name;

                  const sirMaamLower = String(sirMaam).toLowerCase().trim();
                  if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
                    return `${teacher.name} Sir`;
                  } else if (sirMaamLower === "ma'am" || sirMaamLower === "maam" || sirMaamLower.includes("ma'am")) {
                    return `${teacher.name} Ma'am`;
                  }
                  return teacher.name;
                })()}
              </h1>

              {/* Upvote Button */}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (!user) {
                    navigate('/auth');
                    return;
                  }
                  await toggleUpvote(teacher.id);
                }}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors"
                aria-label={isUpvoted(teacher.id) ? 'Remove upvote' : 'Upvote teacher'}
              >
                <span className="text-lg leading-none" aria-hidden>👍</span>
                <span className="text-sm font-semibold text-foreground">
                  {isUpvoted(teacher.id) ? 'Upvoted' : 'Upvote'}
                </span>
                {getUpvoteCount(teacher.id) > 0 && (
                  <span className="text-sm font-semibold text-foreground">
                    {getUpvoteCount(teacher.id)}
                  </span>
                )}
              </button>
            </div>

            {/* Studies With Button - Show for students, guardians, and guests (hide for teachers) */}
            {userRole !== 'teacher' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    // If user is not authenticated, redirect to auth
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    // If user is authenticated but not a student (e.g., guardian), show message
                    if (userRole !== 'student') {
                      toast.error('You need to be a student to use this feature. Please sign in with a student account.');
                      return;
                    }
                    // If user is authenticated student, toggle studies with
                    await toggleStudiesWith(teacher.id);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    user && userRole === 'student' && isStudyingWith(teacher.id)
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  aria-label={user && userRole === 'student' && isStudyingWith(teacher.id) ? 'Remove from my teachers' : "I've studied with this teacher"}
                >
                  <GraduationCap className={`w-4 h-4 ${user && userRole === 'student' && isStudyingWith(teacher.id) ? 'fill-current' : ''}`} />
                  <span>{user && userRole === 'student' && isStudyingWith(teacher.id) ? 'Studying here ✓' : "I've studied here"}</span>
                </button>
                
                {/* View Students Button - Compact badge style (hide for teachers) */}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    setStudentsDialogOpen(true);
                    // Fetch students list when dialog opens
                    if (studentsList.length === 0 && !loadingStudents) {
                      await fetchStudentsList();
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 bg-background text-muted-foreground hover:text-foreground hover:bg-accent border border-border shadow-sm hover:shadow"
                  aria-label="View students who have studied here"
                  title="View students who have studied here"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View</span>
                </button>
              </div>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {teacher.location && (
                <div className="flex items-start gap-2 text-foreground/80">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{teacher.location}</span>
                </div>
              )}
              {teacher.experience_years && (
                <div className="flex items-center gap-2 text-foreground/80">
                  <Clock className="w-4 h-4" />
                  <span>{teacher.experience_years}+ years experience</span>
                </div>
              )}
            </div>

            {/* He/She teaches section - more space between sections, tight under headings */}
            <div className="space-y-4 pt-2">
              {(() => {
                // Get gender from Shikshaqmine table (sir_maam field)
                const sirMaam = teacher.sir_maam;
                const nameLower = teacher.name.toLowerCase();
                
                let pronoun = 'She'; // Default to "She"
                let possessive = 'Her'; // Default to "Her"
                
                if (sirMaam) {
                  // Use the Shikshaqmine table field
                  const sirMaamLower = String(sirMaam).toLowerCase().trim();
                  if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
                    pronoun = 'He';
                    possessive = 'His';
                  } else if (sirMaamLower === "ma'am" || sirMaamLower === "maam" || sirMaamLower.includes("ma'am")) {
                    pronoun = 'She';
                    possessive = 'Her';
                  }
                } else {
                  // Fallback to name-based detection if Shikshaqmine data not found
                  const hasSir = nameLower.includes('sir');
                  const hasMr = nameLower.includes('mr') || nameLower.includes('mr.');
                  if (hasSir || hasMr) {
                    pronoun = 'He';
                    possessive = 'His';
                  }
                }
                
                // Get subjects from Shikshaqmine table first, then fallback to other sources
                const subjectsList = teacher.subjects_from_shikshaq
                  ? teacher.subjects_from_shikshaq.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                  : (teacher as any).subjects_text 
                  ? (teacher as any).subjects_text.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                  : teacher.subjects 
                  ? [teacher.subjects.name]
                  : [];
                
                return (
                  <>
                    {subjectsList.length > 0 && (
                      <div>
                        <p className="font-sans text-base font-bold leading-tight mb-0.5" style={{ color: '#FF7A00' }}>SUBJECTS</p>
                        <p className="font-sans text-base font-normal text-foreground leading-relaxed">
                          {subjectsList.map((subject: string, index: number) => (
                            <span key={index}>
                              {index > 0 && <span style={{ color: '#FF7A00', margin: '0 0.5em' }}>•</span>}
                              <span>{subject}</span>
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Classes section */}
              {(() => {
                // Get classes from Shikshaqmine table first, then fallback to teachers_list
                const classesData = teacher.classes_taught || (teacher as any).classes;
                
                if (classesData) {
                  const classesList = classesData.split(',').map((cls: string) => cls.trim()).filter((cls: string) => cls);
                  
                  if (classesList.length > 0) {
                    return (
                      <div>
                        <p className="font-sans text-base font-bold leading-tight mb-0.5" style={{ color: '#FF7A00' }}>CLASSES</p>
                        <p className="font-sans text-base font-normal text-foreground leading-relaxed">
                          {classesList.map((cls: string, index: number) => (
                            <span key={index}>
                              {index > 0 && <span style={{ color: '#FF7A00', margin: '0 0.5em' }}>•</span>}
                              <span>{cls}</span>
                            </span>
                          ))}
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>

            {/* Location V2 section - Home tutoring locations */}
            <div className="mt-4">
            {(() => {
              const locationV2 = teacher.location_v2;
              if (!locationV2) return null;

              const sirMaam = teacher.sir_maam;
              const nameLower = teacher.name.toLowerCase();
              
              let pronoun = 'She'; // Default to "She"
              let possessive = 'Her'; // Default to "Her"
              
              if (sirMaam) {
                const sirMaamLower = String(sirMaam).toLowerCase().trim();
                if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
                  pronoun = 'He';
                  possessive = 'His';
                }
              } else {
                const hasSir = nameLower.includes('sir');
                const hasMr = nameLower.includes('mr') || nameLower.includes('mr.');
                if (hasSir || hasMr) {
                  pronoun = 'He';
                  possessive = 'His';
                }
              }

              const locationV2Lower = String(locationV2).toLowerCase().trim();
              const studentsHomeAreas = teacher.students_home_areas;
              const tutorsHomeAreas = teacher.tutors_home_areas;

              // Helper function to parse areas and create bubbles
              const parseAreas = (areasString: string | null | undefined): string[] => {
                if (!areasString) return [];
                return areasString
                  .split(',')
                  .map(area => area.trim())
                  .filter(area => area.length > 0);
              };

              const studentsAreas = parseAreas(studentsHomeAreas);
              const tutorsAreas = parseAreas(tutorsHomeAreas);

              // Check what to display based on location_v2
              const isStudentsHomeOnly = locationV2Lower.includes('students home tutoring only') || 
                                         locationV2Lower.includes("student's home tutoring only");
              const isTeachersHomeOnly = locationV2Lower.includes("teacher's home tutoring") || 
                                         locationV2Lower.includes("tutor's home tutoring");
              const isBothOptions = locationV2Lower.includes('both options listed') || 
                                    locationV2Lower.includes('both options');

              if (!isStudentsHomeOnly && !isTeachersHomeOnly && !isBothOptions) {
                return null; // Unknown location_v2 value
              }

              return (
                <div className="space-y-4">
                  {/* Students home tutoring section */}
                  {(isStudentsHomeOnly || isBothOptions) && studentsAreas.length > 0 && (
                    <div>
                      <p className="font-sans text-base font-bold leading-tight mb-0.5" style={{ color: '#FF7A00' }}>
                        Home to Home tutoring in
                      </p>
                      <p className="font-sans text-base font-normal text-foreground leading-relaxed">
                        {studentsAreas.map((area, index) => (
                          <span key={index}>
                            {index > 0 && <span style={{ color: '#FF7A00', margin: '0 0.5em' }}>•</span>}
                            <span>{area}</span>
                          </span>
                        ))}
                      </p>
                    </div>
                  )}

                  {/* Teacher's home tutoring section */}
                  {(isTeachersHomeOnly || isBothOptions) && tutorsAreas.length > 0 && (
                    <div>
                      <p className="font-sans text-base font-bold leading-tight mb-0.5" style={{ color: '#FF7A00' }}>
                        Tuition Centres in
                      </p>
                      <p className="font-sans text-base font-normal text-foreground leading-relaxed">
                        {tutorsAreas.map((area, index) => (
                          <span key={index}>
                            {index > 0 && <span style={{ color: '#FF7A00', margin: '0 0.5em' }}>•</span>}
                            <span>{area}</span>
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
            </div>

          </div>
        </div>

        {/* Little more about teacher section */}
        {teacher.description && (
          <div className="mt-8 md:mt-12">
            <div className="h-0.5 w-full rounded-full mb-6" style={{ backgroundColor: '#FF7A00' }} aria-hidden />
            <h3 className="text-xl md:text-2xl font-sans font-normal text-foreground mb-4">
              Little more about {teacher.name}
            </h3>
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const content = teacher.description || '';
                  // Sanitize content to prevent XSS attacks
                  let sanitizedContent: string;
                  // If content contains HTML tags, sanitize it
                  // Otherwise, convert line breaks to <br /> tags and sanitize
                  if (/<[a-z][\s\S]*>/i.test(content)) {
                    sanitizedContent = DOMPurify.sanitize(content, {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                      ALLOWED_ATTR: ['href', 'target', 'rel'],
                    });
                  } else {
                    sanitizedContent = DOMPurify.sanitize(content.replace(/\n/g, '<br />'), {
                      ALLOWED_TAGS: ['br'],
                    });
                  }
                  return sanitizedContent;
                })()
              }}
            />
          </div>
        )}

            {/* Additional Details Section - card layout like reference image */}
        {(teacher.boards_taught || teacher.class_size || teacher.mode_of_teaching || teacher.place_of_teaching || teacher.qualifications_etc || teacher.teaching_since || teacher.min_fees || teacher.max_fees) && (
          <div className="mt-8 md:mt-12">
            <h3 className="text-xl md:text-2xl font-sans font-normal text-foreground mb-4">Here are some more details:</h3>
            <div className="rounded-2xl bg-orange-50/80 dark:bg-orange-950/20 border border-border/60 p-5 md:p-6">
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {teacher.boards_taught && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>📚</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Boards taught</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7">{teacher.boards_taught}</p>
                  </div>
                )}
                {teacher.class_size && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>👥</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Structure of classes</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7">{teacher.class_size.replace(/\bSolo\b/g, 'One-on-one')}</p>
                  </div>
                )}
                {teacher.mode_of_teaching && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>🏫</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Mode of teaching</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7">{teacher.mode_of_teaching}</p>
                  </div>
                )}
                {teacher.place_of_teaching && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>📍</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Place of teaching</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7">{teacher.place_of_teaching}</p>
                  </div>
                )}
                {teacher.qualifications_etc && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>🎓</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Qualifications</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7 break-words">{teacher.qualifications_etc}</p>
                  </div>
                )}
                {teacher.teaching_since && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>📅</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Teaching since</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7">{teacher.teaching_since}</p>
                  </div>
                )}
                {(teacher.min_fees != null || teacher.max_fees != null) && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl leading-none" aria-hidden>💰</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Approximate Fees per month</h4>
                    </div>
                    <p className="text-base font-normal text-foreground pl-7">
                      {teacher.min_fees != null && teacher.max_fees != null
                        ? `₹${teacher.min_fees.toLocaleString()} - ₹${teacher.max_fees.toLocaleString()}`
                        : teacher.min_fees != null
                        ? `₹${teacher.min_fees.toLocaleString()}+`
                        : teacher.max_fees != null
                        ? `Up to ₹${teacher.max_fees.toLocaleString()}`
                        : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <section id="reviews" ref={reviewsSectionRef} className="md:col-span-2 scroll-mt-24 md:scroll-mt-28" aria-label="Reviews">
          {teacher && <TeacherComments teacherId={teacher.id} />}
        </section>

        {/* Footer - in flow so reachable when scrolling */}
        <div className="md:col-span-2">
          <Footer expandedContent={teacher?.expanded || null} />
        </div>
        </div>
        </div>
      </main>

      {/* Sticky Contact via WhatsApp bar - fixed at bottom while scrolling */}
      {teacher && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] p-4 safe-area-pb">
          <div className="container max-w-lg mx-auto">
            {user ? (
              <Button
                className="w-full gap-3 py-6 text-lg font-medium bg-black hover:bg-black/85 text-white shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  const url = teacher.whatsapp_link
                    ? (teacher.whatsapp_link.startsWith('http')
                        ? teacher.whatsapp_link
                        : getWhatsAppLink(teacher.whatsapp_link))
                    : getWhatsAppLink(null, '8240980312');
                  setPendingWhatsappUrl(url);
                  setWhatsappDisclaimerOpen(true);
                }}
              >
                <WhatsAppIcon className="w-7 h-7 text-[#25D366]" />
                Contact via WhatsApp
              </Button>
            ) : (
              <Button
                className="w-full gap-3 py-6 text-lg font-medium bg-black hover:bg-black/85 text-white shadow-md hover:shadow-lg transition-all"
                onClick={() => navigate('/auth')}
              >
                <WhatsAppIcon className="w-7 h-7 text-[#25D366]" />
                Sign in to contact
              </Button>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp disclaimer dialog */}
      <Dialog open={whatsappDisclaimerOpen} onOpenChange={(open) => {
        setWhatsappDisclaimerOpen(open);
        if (!open) setPendingWhatsappUrl(null);
      }}>
        <DialogContent className="max-w-md rounded-2xl w-[90%] sm:w-full">
          <DialogHeader>
            <DialogTitle>Before you continue</DialogTitle>
            <DialogDescription className="text-foreground/80 pt-1">
              We're glad to help you connect! You'll be taken to WhatsApp. Any fees or arrangements are between you and the teacher—Shikshaq isn't responsible for transactions outside our platform.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setWhatsappDisclaimerOpen(false);
                setPendingWhatsappUrl(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (pendingWhatsappUrl) {
                  window.open(pendingWhatsappUrl, '_blank', 'noopener,noreferrer');
                }
                setWhatsappDisclaimerOpen(false);
                setPendingWhatsappUrl(null);
              }}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            >
              Yes, continue to WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Students Dialog */}
      <Dialog open={studentsDialogOpen} onOpenChange={setStudentsDialogOpen}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto rounded-2xl w-[90%] sm:w-full">
          <DialogHeader>
            <DialogTitle>Students Who Have Studied Here</DialogTitle>
            <DialogDescription>
              These are the students who have indicated they study or have studied with {teacher.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {loadingStudents ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading students...
              </div>
            ) : studentsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students have indicated they study here yet.
              </div>
            ) : (
              <div className="space-y-3">
                {studentsList.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {student.full_name || 'Anonymous Student'}
                      </p>
                      {(student.school_college || student.grade) && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {[student.grade, student.school_college].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
