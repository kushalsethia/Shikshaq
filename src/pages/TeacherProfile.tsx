import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, BadgeCheck, Heart, ThumbsUp } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { TeacherComments } from '@/components/TeacherComments';
import { ShareButton } from '@/components/ShareButton';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { getCache, setCache, CACHE_TTL, getTeacherProfileCacheKey, getShikshaqmineBySlugCacheKey } from '@/utils/cache';


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
  location_v2?: string | null; // The "Location V2" field from Shikshaqmine table
  students_home_areas?: string | null; // The "student's home in these areas" field from Shikshaqmine table
  tutors_home_areas?: string | null; // The "Tutor's home in these areas" field from Shikshaqmine table
  expanded?: string | null; // The "EXPANDED" field from Shikshaqmine table
  description?: string | null; // The "Description" field from Shikshaqmine table
  qualifications_etc?: string | null; // The "Qualifications etc" field from Shikshaqmine table
  review_1?: string | null; // The "Review 1" field from Shikshaqmine table
  review_2?: string | null; // The "Review 2" field from Shikshaqmine table
  review_3?: string | null; // The "Review 3" field from Shikshaqmine table
  whatsapp_link?: string | null; // The "Link" field from Shikshaqmine table
}

export default function TeacherProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { isUpvoted, toggleUpvote, getUpvoteCount } = useUpvotes();
  const navigate = useNavigate();

  // Check if user has a role - redirect to role selection if not
  useEffect(() => {
    const checkUserRole = async () => {
      if (authLoading) return;
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile || !profile.role) {
          navigate('/select-role', { replace: true });
        }
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);

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
      let locationV2 = null;
      let studentsHomeAreas = null;
      let tutorsHomeAreas = null;
      let expanded = null;
      let description = null;
      let qualificationsEtc = null;
      let review1 = null;
      let review2 = null;
      let review3 = null;
      let whatsappLink = null;
      if (teacherData) {
        try {
          // Check cache for Shikshaqmine data
          const shikshaqCacheKey = getShikshaqmineBySlugCacheKey(slug);
          let shikshaqData = getCache<any>(shikshaqCacheKey);
          
          if (!shikshaqData) {
            const { data, error } = await supabase
              .from('Shikshaqmine')
              .select('*')
              .eq('Slug', slug)
              .maybeSingle();
            
            if (error) {
              console.warn('Error fetching from Shikshaqmine:', error);
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
            locationV2 = (shikshaqData as any)["LOCATION V2"] || (shikshaqData as any)["Location V2"] || (shikshaqData as any)["location_v2"];
            studentsHomeAreas = (shikshaqData as any)["STUDENT'S HOME IN THESE AREAS"] || (shikshaqData as any)["student's home in these areas"] || (shikshaqData as any)["Student's home in these areas"];
            tutorsHomeAreas = (shikshaqData as any)["TUTOR'S HOME IN THESE AREAS"] || (shikshaqData as any)["Tutor's home in these areas"];
            expanded = (shikshaqData as any)["EXPANDED"] || (shikshaqData as any)["Expanded"] || (shikshaqData as any)["expanded"];
            description = (shikshaqData as any)["Description"];
            qualificationsEtc = (shikshaqData as any)["Qualifications etc"];
            review1 = (shikshaqData as any)["Review 1"];
            review2 = (shikshaqData as any)["Review 2"];
            review3 = (shikshaqData as any)["Review 3"];
            whatsappLink = (shikshaqData as any)["Link"] || (shikshaqData as any)["link"];
          }
        } catch (err) {
          console.warn('Error accessing Shikshaqmine table:', err);
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
          location_v2: locationV2,
          students_home_areas: studentsHomeAreas,
          tutors_home_areas: tutorsHomeAreas,
          expanded: expanded,
          description: description,
          qualifications_etc: qualificationsEtc,
          review_1: review1,
          review_2: review2,
          review_3: review3,
          whatsapp_link: whatsappLink,
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
        "name": "ShikshAQ",
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

    // Build title: {{Title}} teaches {{Subjects}} for Classes {{Classes Taught}} in {{Area}} via {{Mode of Teaching}} on ShikshAq by AquaTerra
    const title = `${teacherName} teaches ${subjects} for Classes ${classesTaught} in ${area} via ${modeOfTeaching} on ShikshAq by AquaTerra`;
    
    // Build description: {{Subjects}} tuition classes for {{Classes Taught}} in {{Area}} via {{Mode of Teaching}} {{EXPANDED}}
    let description = `${subjects} tuition classes for ${classesTaught} in ${area} via ${modeOfTeaching}`;
    if (expanded) {
      // Strip HTML tags and limit to ~150 characters for meta description
      const expandedText = expanded.replace(/<[^>]*>/g, '').trim();
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
      document.title = 'ShikshAq - by AquaTerra';
      const defaultDescription = 'ShikshAq connects students with real local tuition teachers for free. Discover trusted, verified educators near you for school subjects and exams- simple, genuine, and community-driven learning with no hidden costs.';
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDescription);
      
      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      if (ogTitleEl) ogTitleEl.setAttribute('content', 'ShikshAq - by AquaTerra');
      
      const ogDescEl = document.querySelector('meta[property="og:description"]');
      if (ogDescEl) ogDescEl.setAttribute('content', defaultDescription);
      
      const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitleEl) twitterTitleEl.setAttribute('content', 'ShikshAq - by AquaTerra');
      
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

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-16 text-center md:pt-16">
          <h1 className="text-2xl font-serif font-normal text-foreground mb-4">Teacher not found</h1>
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

      <main className="container pt-20 sm:pt-[120px] pb-8 md:pt-12 md:pb-12">
        <Link
          to="/all-tuition-teachers-in-kolkata"
          className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all teachers
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="sticky top-24">
              {teacher.image_url ? (
                <img
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-full aspect-[4/5] object-cover rounded-3xl shadow-xl"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-gradient-to-br from-muted to-accent flex items-center justify-center rounded-3xl shadow-xl">
                  <span className="text-6xl font-serif text-muted-foreground">
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
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    await toggleLike(teacher.id);
                  }}
                  className="p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors"
                  aria-label={isLiked(teacher.id) ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isLiked(teacher.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-foreground/70 hover:text-red-500'
                    }`}
                  />
                </button>
                <ShareButton
                  url={`/tuition-teachers/${teacher.slug}`}
                  title={`${teacher.name}${teacher.sir_maam ? ` ${teacher.sir_maam}` : ''}`}
                  description={teacher.subjects_from_shikshaq || teacher.subjects?.name || 'Tuition Teacher'}
                  className=""
                  iconSize="lg"
                />
              </div>
              {/* Mobile Upvote Button - Bottom Right of Image */}
              <div className="absolute bottom-4 right-4 md:hidden">
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    await toggleUpvote(teacher.id);
                  }}
                  className="p-3 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors flex items-center gap-2"
                  aria-label={isUpvoted(teacher.id) ? 'Remove upvote' : 'Upvote teacher'}
                >
                  <ThumbsUp
                    className={`w-6 h-6 transition-colors ${
                      isUpvoted(teacher.id)
                        ? 'fill-primary text-primary-foreground'
                        : 'text-foreground/70 hover:text-primary'
                    }`}
                  />
                  {getUpvoteCount(teacher.id) > 0 && (
                    <span className="text-sm font-medium text-foreground">
                      {getUpvoteCount(teacher.id)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6 md:space-y-8">
            {/* Subject Badge */}
            {teacher.subjects && (
              <Link
                to={`/all-tuition-teachers-in-kolkata?subject=${teacher.subjects.slug}`}
                className="inline-block"
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {teacher.subjects.name}
                </span>
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-foreground">
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

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
              {teacher.location && (
                <div className="flex items-center gap-2 text-foreground/80">
                  <MapPin className="w-4 h-4" />
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

            {/* He/She teaches section */}
            <div className="space-y-6">
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
                        <p className="text-sm font-medium text-foreground mb-0.5 pb-0.5 leading-tight">{pronoun} teaches</p>
                        <div className="flex flex-wrap gap-2">
                          {subjectsList.map((subject: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* To students of section */}
              {(() => {
                // Get classes from Shikshaqmine table first, then fallback to teachers_list
                const classesData = teacher.classes_taught || (teacher as any).classes;
                
                if (classesData) {
                  const classesList = classesData.split(',').map((cls: string) => cls.trim()).filter((cls: string) => cls);
                  
                  if (classesList.length > 0) {
                    return (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-0.5 pb-0.5 leading-tight">to students of</p>
                        <div className="flex flex-wrap gap-2">
                          {classesList.map((cls: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>

            {/* Location V2 section - Home tutoring locations */}
            <div className="mt-6">
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
                <div className="space-y-6">
                  {/* Students home tutoring section */}
                  {(isStudentsHomeOnly || isBothOptions) && studentsAreas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-0.5 pb-0.5 leading-tight">
                        <span>{pronoun}</span> provides home to home tutoring to students in
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {studentsAreas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teacher's home tutoring section */}
                  {(isTeachersHomeOnly || isBothOptions) && tutorsAreas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-0.5 pb-0.5 leading-tight">
                        <span>{possessive}</span> tuition centre's are located in
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tutorsAreas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            </div>

            {/* CTA - Contact via WhatsApp */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-card rounded-2xl p-6 md:p-8 border-2 border-primary/20 shadow-lg">
              <h3 className="font-medium text-foreground mb-2 text-lg">Interested in classes?</h3>
              <p className="text-foreground/80 text-sm mb-6">
                Reach out directly to discuss class timings, fees, and more.
              </p>
              {user ? (
                <a
                  href={
                    teacher.whatsapp_link 
                      ? (teacher.whatsapp_link.startsWith('http') 
                          ? teacher.whatsapp_link 
                          : getWhatsAppLink(teacher.whatsapp_link))
                      : getWhatsAppLink(null, '8240980312')
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full gap-2 py-6 text-base font-medium bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md hover:shadow-lg transition-all">
                    <WhatsAppIcon className="w-5 h-5" />
                    Contact via WhatsApp
                  </Button>
                </a>
              ) : (
                <Button 
                  className="w-full gap-2 py-6 text-base font-medium bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md hover:shadow-lg transition-all" 
                  onClick={() => navigate('/auth')}
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Sign in to contact
                </Button>
              )}
            </div>

          </div>
        </div>

        {/* Little more about teacher section */}
        {teacher.description && (
          <div className="mt-8 md:mt-12">
            <h3 className="text-xl md:text-2xl font-serif font-normal text-foreground mb-4">
              Little more about {teacher.name}
            </h3>
            <div 
              className="px-4 py-3 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 prose prose-sm max-w-none inline-block"
              dangerouslySetInnerHTML={{ 
                __html: (() => {
                  const content = teacher.description || '';
                  // If content contains HTML tags, render as-is
                  // Otherwise, convert line breaks to <br /> tags
                  if (/<[a-z][\s\S]*>/i.test(content)) {
                    return content;
                  }
                  return content.replace(/\n/g, '<br />');
                })()
              }}
            />
          </div>
        )}

            {/* Additional Details Section */}
        {(teacher.boards_taught || teacher.class_size || teacher.mode_of_teaching || teacher.qualifications_etc) && (
          <div className="mt-8 md:mt-12">
            <h3 className="text-xl md:text-2xl font-serif font-normal text-foreground mb-4 md:mb-6">Here are some more details:</h3>
            <div className="flex flex-wrap gap-4 md:gap-6">
                  {/* Boards taught */}
                  {teacher.boards_taught && (
                <div className="flex-shrink-0">
                  <h4 className="text-sm font-medium text-foreground/90 mb-2">Boards taught</h4>
                  <div className="px-4 py-3 rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800 inline-block">
                        {teacher.boards_taught}
                      </div>
                    </div>
                  )}

                  {/* Class Size */}
                  {teacher.class_size && (
                <div className="flex-shrink-0">
                  <h4 className="text-sm font-medium text-foreground/90 mb-2">Class Size</h4>
                  <div className="px-4 py-3 rounded-lg bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200 border border-pink-200 dark:border-pink-800 inline-block">
                        {teacher.class_size}
                      </div>
                    </div>
                  )}

                  {/* Mode of teaching */}
                  {teacher.mode_of_teaching && (
                <div className="flex-shrink-0 w-full md:w-auto">
                  <h4 className="text-sm font-medium text-foreground/90 mb-2">Mode of teaching</h4>
                  <div className="px-4 py-3 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200 border border-teal-200 dark:border-teal-800 inline-block">
                        {teacher.mode_of_teaching}
                      </div>
                    </div>
                  )}

              {/* Experience/Qualifications */}
              {teacher.qualifications_etc && (
                <div className="flex-shrink-0 w-full md:w-auto">
                  <h4 className="text-sm font-medium text-foreground/90 mb-2">Experience/Qualifications</h4>
                  <div className="px-4 py-3 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800 inline-block">
                    {teacher.qualifications_etc}
                  </div>
                </div>
              )}
                </div>
              </div>
            )}

        {/* Comments Section */}
        {teacher && <TeacherComments teacherId={teacher.id} />}
      </main>

      <Footer expandedContent={teacher?.expanded || null} />
    </div>
  );
}
