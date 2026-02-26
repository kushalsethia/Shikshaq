import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HowItWorks } from '@/components/HowItWorks';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { WaveDivider } from '@/components/WaveDivider';
import { useLikes } from '@/lib/likes-context';
import { useAuth } from '@/lib/auth-context';
import { useRequireRole } from '@/hooks/use-require-role';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { getCache, setCache, CACHE_TTL, clearExpiredCache, getUserProfileCacheKey } from '@/utils/cache';

// Larger Unicode emoji for subject cards (free to use, rendered by user’s device)
const EMOJI_WRAPPER = 'flex items-center justify-center min-w-[4rem] min-h-[4rem] text-5xl leading-none select-none';
const subjectIconMap: Record<string, React.ReactNode> = {
  Chemistry: <span className={EMOJI_WRAPPER} aria-hidden>🧪</span>,
  Hindi: <span className={EMOJI_WRAPPER} aria-hidden>📖</span>,
  English: <span className={EMOJI_WRAPPER} aria-hidden>📚</span>,
  Maths: <span className={EMOJI_WRAPPER} aria-hidden>🔢</span>,
  Mathematics: <span className={EMOJI_WRAPPER} aria-hidden>🔢</span>,
  Psychology: <span className={EMOJI_WRAPPER} aria-hidden>🧠</span>,
  Economics: <span className={EMOJI_WRAPPER} aria-hidden>💰</span>,
  Biology: <span className={EMOJI_WRAPPER} aria-hidden>🧬</span>,
  Computers: <span className={EMOJI_WRAPPER} aria-hidden>💻</span>,
  Computer: <span className={EMOJI_WRAPPER} aria-hidden>💻</span>,
  Accounts: <span className={EMOJI_WRAPPER} aria-hidden>📒</span>,
};


interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
  // Optional label for the green featured-subject tag on the homepage carousel
  featuredSubjectLabel?: string | null;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export default function Index() {
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSearchBarScrolled, setIsSearchBarScrolled] = useState(false);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchBarElementRef = useRef<HTMLDivElement>(null);
  const { isLiked } = useLikes();
  const { user, loading: authLoading } = useAuth();

  // Redirect signed-in users to select-role or teacher-terms if they haven't completed onboarding
  useRequireRole();

  // Load user's first name for greeting
  useEffect(() => {
    const isMounted = true;

    const loadUserDisplayName = async () => {
      if (authLoading) return;
      if (!user) {
        if (isMounted) setUserFirstName(null);
        return;
      }

      const cacheKey = getUserProfileCacheKey(user.id);
      const cachedProfile = getCache<{ role: string; full_name: string | null; terms_agreement?: boolean }>(cacheKey);

      if (cachedProfile?.full_name != null) {
        const firstName = (cachedProfile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '').split(' ')[0];
        if (isMounted && firstName) setUserFirstName(firstName);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (!isMounted || !profile) return;
      const fullName = profile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || null;
      if (fullName) setUserFirstName(fullName.split(' ')[0]);
    };

    loadUserDisplayName();
  }, [user, authLoading]);

  // Add homepage-specific JSON-LD structured data
  useEffect(() => {
    // LocalBusiness schema
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
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressRegion": "West Bengal",
        "addressCountry": "IN"
      },
      "priceRange": "Free",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "22:00",
        "timezone": "Asia/Kolkata"
      },
      "areaServed": [
        "Kolkata",
        "Howrah",
        "Salt Lake",
        "Jadavpur",
        "Bhowanipore",
        "Ballygunge",
        "New Town",
        "Garia",
        "Tollygunge",
        "Behala"
      ],
      "sameAs": [
        "https://www.instagram.com/ngo.aquaterra/",
        "https://www.facebook.com/shikshaqkolkata/"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      }
    });

    // Service schema
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
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Shikshaq",
        "url": "https://www.shikshaq.in"
      },
      "areaServed": "Kolkata",
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://www.shikshaq.in/search",
        "servicePhone": "+91-8240980312"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Subject-Based Tutor Search",
          "description": "Find tutors for Mathematics, Physics, Chemistry, Biology, English, and more",
          "price": "0",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "Online Tuition",
          "description": "Connect with tutors offering online classes",
          "price": "0",
          "priceCurrency": "INR"
        },
        {
          "@type": "Offer",
          "name": "Offline/Home Tuition",
          "description": "Find tutors offering offline/home tuition in your area",
          "price": "0",
          "priceCurrency": "INR"
        }
      ]
    });

    // Add scripts to head
    document.head.appendChild(localBusinessScript);
    document.head.appendChild(serviceScript);

    // Cleanup: remove scripts when component unmounts
    return () => {
      const existingLocalBusiness = document.getElementById('homepage-localbusiness-schema');
      const existingService = document.getElementById('homepage-service-schema');
      if (existingLocalBusiness) existingLocalBusiness.remove();
      if (existingService) existingService.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        // Check cache for featured teachers
        const featuredCacheKey = 'featured_teachers_index';
        const cachedFeatured = getCache<any[]>(featuredCacheKey);
        
        // Check cache for subjects (key bumped when home subject list changes, e.g. Chemistry/Hindi)
        const subjectsCacheKey = 'subjects_index_v2';
        const cachedSubjects = getCache<any[]>(subjectsCacheKey);
        
        // Only use cache when we have non-empty data (avoid showing stale "empty" from a past failed load)
        if (cachedFeatured?.length && cachedSubjects?.length) {
          setFeaturedTeachers(cachedFeatured);
          setSubjects(cachedSubjects);
          setLoading(false);
          return;
        }
        
        // Fetch teachers by upvotes (top 16) and subjects in parallel
        // Fetch specific subjects: Chemistry, Hindi, English, Maths, Psychology, Computers, Accounts, Biology, Economics
        const desiredSubjects = ['Chemistry', 'Hindi', 'English', 'Maths', 'Mathematics', 'Psychology', 'Computers', 'Computer', 'Accounts', 'Biology', 'Economics'];
        const [subjectsRes, upvotesRes] = await Promise.all([
          cachedSubjects?.length ? Promise.resolve({ data: cachedSubjects, error: null }) :
          supabase
            .from('subjects')
            .select('*')
            .in('name', desiredSubjects)
            .limit(10), // Fetch a few extra in case we need to filter
          (supabase as any)
            .from('teacher_upvotes')
            .select('teacher_id')
        ]);

        // Treat API errors as load failure (e.g. network, RLS, wrong project)
        if (subjectsRes.error || upvotesRes.error) {
          setLoadError(true);
          setLoading(false);
          return;
        }

        // Get top 16 teachers by upvote count
        let teachersData: any[] = [];
        
        if (upvotesRes.data && upvotesRes.data.length > 0) {
          // Count upvotes per teacher
          const upvoteCounts = new Map<string, number>();
          upvotesRes.data.forEach((upvote: any) => {
            const current = upvoteCounts.get(upvote.teacher_id) || 0;
            upvoteCounts.set(upvote.teacher_id, current + 1);
          });

          // Sort by upvote count and get top 16 teacher IDs
          const topTeacherIds = Array.from(upvoteCounts.entries())
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 16)
            .map(([teacherId]) => teacherId);

          if (topTeacherIds.length > 0) {
            const { data: topTeachers } = await (supabase as any)
              .from('teachers_list')
              .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
              .in('id', topTeacherIds);

            if (topTeachers) {
              // Sort teachers to match upvote order
              const teacherMap = new Map(topTeachers.map((t: any) => [t.id, t]));
              teachersData = topTeacherIds
                .map(id => teacherMap.get(id))
                .filter(Boolean) as any[];
            }
          }
        }

        // If we have less than 16 teachers, fill with random teachers
        if (teachersData.length < 16) {
          const existingIds = new Set(teachersData.map((t: any) => t.id));
          const { data: allTeachers } = await (supabase as any)
            .from('teachers_list')
            .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
            .limit(100);
          
          if (allTeachers && allTeachers.length > 0) {
            const availableTeachers = allTeachers.filter((t: any) => !existingIds.has(t.id));
            const shuffled = [...availableTeachers].sort(() => Math.random() - 0.5);
            const needed = 16 - teachersData.length;
            teachersData = [...teachersData, ...shuffled.slice(0, needed)];
          }
        }

        // Fetch Sir/Ma'am, Featured Subject, and Subjects data from Shikshaqmine table
        const sirMaamMap = new Map();
        const subjectsMap = new Map<string, string>(); // slug -> first subject name
        const featuredSubjectMap = new Map<string, string>(); // slug -> featured subject label
        if (teachersData.length > 0) {
          const teacherSlugs = teachersData.map((t: any) => t.slug).filter(Boolean);
          if (teacherSlugs.length > 0) {
            const { data: shikshaqData } = await (supabase as any)
              .from('Shikshaqmine')
              .select('*')
              .in('Slug', teacherSlugs);
          
            if (shikshaqData) {
              shikshaqData.forEach((record: any) => {
                const slug = record.Slug;
                sirMaamMap.set(slug, record["Sir/Ma'am?"]);

                // Featured Subject: explicit featured subject for homepage badge
                const featured = record["Featured Subject"];
                if (featured != null && String(featured).trim() !== '') {
                  featuredSubjectMap.set(slug, String(featured).trim());
                }

                // Extract first subject from comma-separated Subjects field
                if (record.Subjects) {
                  const firstSubject = record.Subjects.split(',')[0].trim();
                  if (firstSubject) {
                    subjectsMap.set(slug, firstSubject);
                  }
                }
              });
            }
          }
        }

        // Process teachers data - if we have subject_id, look up the subject
        if (teachersData.length > 0) {
          const processedTeachers = teachersData.map((teacher: any) => {
            // If relationship worked, use it
            let teacherWithSubject = teacher;
            if (!teacher.subjects) {
              // Otherwise, look up subject manually
              if (teacher.subject_id && subjectsRes.data) {
                const subject = subjectsRes.data.find((s: any) => s.id === teacher.subject_id);
                teacherWithSubject = {
                  ...teacher,
                  subjects: subject ? { name: subject.name, slug: subject.slug } : null
                };
              } else {
                // If no subject_id, try to get first subject from Shikshaqmine
                const firstSubjectName = subjectsMap.get(teacher.slug);
                if (firstSubjectName && subjectsRes.data) {
                  // Try to find matching subject in subjects table
                  const matchingSubject = subjectsRes.data.find((s: any) => 
                    s.name.toLowerCase() === firstSubjectName.toLowerCase()
                  );
                  if (matchingSubject) {
                    teacherWithSubject = {
                      ...teacher,
                      subjects: { name: matchingSubject.name, slug: matchingSubject.slug }
                    };
                  } else {
                    // If no match found, use the name from Shikshaqmine directly
                    teacherWithSubject = {
                      ...teacher,
                      subjects: { name: firstSubjectName, slug: firstSubjectName.toLowerCase().replace(/\s+/g, '-') }
                    };
                  }
                } else {
                  teacherWithSubject = { ...teacher, subjects: null };
                }
              }
            }

            // Decide which subject label to show in the green featured badge:
            // 1) Featured Subject from Shikshaqmine (if set)
            // 2) First subject from Shikshaqmine.Subjects
            // 3) Subject from subjects relationship / fallback
            const slug = teacher.slug;
            const featuredFromShikshaq = featuredSubjectMap.get(slug);
            let featuredSubjectLabel: string | null = null;
            if (featuredFromShikshaq && featuredFromShikshaq.trim() !== '') {
              featuredSubjectLabel = featuredFromShikshaq;
            } else {
              const firstSubjectName = subjectsMap.get(slug);
              if (firstSubjectName && firstSubjectName.trim() !== '') {
                featuredSubjectLabel = firstSubjectName;
              } else if (teacherWithSubject.subjects?.name) {
                featuredSubjectLabel = teacherWithSubject.subjects.name;
              } else {
                featuredSubjectLabel = null;
              }
            }

            // Add Sir/Ma'am data and the featured subject label for the homepage badge
            return {
              ...teacherWithSubject,
              sir_maam: sirMaamMap.get(teacher.slug) || null,
              featuredSubjectLabel,
            };
          });

          setFeaturedTeachers(processedTeachers);
          // Cache featured teachers
          setCache(featuredCacheKey, processedTeachers, CACHE_TTL.FEATURED_TEACHERS);
        }

        if (subjectsRes.data) {
          // Order by desired sequence (include both naming variants for backward compatibility)
          const desiredOrder = ['Chemistry', 'Hindi', 'English', 'Maths', 'Mathematics', 'Psychology', 'Computers', 'Computer', 'Accounts', 'Biology', 'Economics'];
          const seen = new Set<string>();
          const filteredSubjects = subjectsRes.data
            .filter((subject: any) => desiredOrder.includes(subject.name))
            .filter((subject: any) => {
              const normalized = subject.name.toLowerCase().replace('computers', 'computer');
              if (seen.has(normalized)) return false;
              seen.add(normalized);
              return true;
            })
            .sort((a: any, b: any) => {
              const indexA = desiredOrder.indexOf(a.name);
              const indexB = desiredOrder.indexOf(b.name);
              // If both are in desired order, sort by index
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              // If only one is in desired order, prioritize it
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              // Otherwise maintain original order
              return 0;
            })
            .slice(0, 9);
          
          setSubjects(filteredSubjects);
          // Cache subjects
          setCache(subjectsCacheKey, filteredSubjects, CACHE_TTL.SUBJECTS);
        }
      } catch (error) {
        setLoadError(true);
        if (import.meta.env.DEV) {
          console.error('Error fetching data:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Clean up expired cache on mount
    clearExpiredCache();
  }, []);

  // Handle scroll detection for making search bar sticky
  useEffect(() => {
    const handleScroll = () => {
      if (!searchBarRef.current) return;
      
      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      // When search bar section is scrolled past (its top is above the mobile nav bar area)
      // Use a higher threshold on mobile to account for heading height
      const threshold = window.innerWidth < 768 ? 300 : 150;
      setIsSearchBarScrolled(searchBarRect.top < threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position - ensure heading is visible initially
    // Only set to scrolled if we're actually scrolled past
    const initialCheck = () => {
      if (!searchBarRef.current) return;
      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      const threshold = window.innerWidth < 768 ? 300 : 150;
      // Only set to true if significantly scrolled past (not just slightly)
      setIsSearchBarScrolled(searchBarRect.top < threshold && window.scrollY > 50);
    };
    initialCheck();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F5F1]">
      <Navbar />
      
      {/* Hero Section — Beige */}
      <section ref={searchBarRef} className="pt-[100px] pb-[80px] bg-[#F9F5F1]">
        <div className="container">
          <div className="flex flex-col items-center px-4 sm:px-0">
            <div className="text-center w-full max-w-3xl mb-4 sm:mb-6">
              <p className="text-sm sm:text-base md:text-lg font-medium mb-2 sm:mb-3 opacity-0 animate-fade-slide-up text-[#FF8000]" style={{ animationDelay: '100ms' }}>
                Welcome to Shikshaq{user && userFirstName ? `, ${userFirstName}` : ''}! 👋
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-[#1F1F1F] leading-none tracking-tight text-center opacity-0 animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
                Your ideal teacher,
                <br />
                one search away.
              </h1>
            </div>
            <div ref={searchBarElementRef} className="w-full max-w-2xl sm:max-w-3xl mx-auto mt-3 sm:mt-10 md:mt-6 opacity-0 animate-scale-pop" style={{ animationDelay: '300ms' }}>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Search Bar - Only visible when scrolled past original */}
      {isSearchBarScrolled && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 py-2 transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4">
            <div className="w-full max-w-3xl mx-auto">
              <SearchBar sticky={true} />
            </div>
          </div>
        </div>
      )}

      {/* Featured Teachers — Beige */}
      <section className="pt-2 sm:pt-4 md:pt-6 pb-12 sm:pb-16 md:pb-20 bg-[#F9F5F1]">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#1F1F1F] mb-2 sm:mb-4 md:mb-6">
            Featured <span className="text-[#FF8000]">tuition teachers</span> on Shikshaq
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted rounded-2xl" />
                  <div className="mt-3 h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : featuredTeachers.length > 0 ? (
            <div className="relative">
              {/* Carousel for both mobile and desktop */}
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                  dragFree: true,
                  containScroll: "trimSnaps",
                  slidesToScroll: "auto",
                  watchDrag: true,
                }}
                className="w-full overflow-visible"
              >
                <CarouselContent className="-ml-2 md:-ml-4 pr-2 md:pr-0">
                  {featuredTeachers.map((teacher, index) => (
                    <CarouselItem
                      key={teacher.id}
                      className="pl-2 md:pl-4 basis-[45vw] md:basis-1/3 lg:basis-1/4 xl:basis-1/6 flex-shrink-0 opacity-0 animate-fade-slide-up"
                      style={{ animationDelay: `${350 + index * 50}ms` }}
                    >
                      <TeacherCard
                        id={teacher.id}
                        name={teacher.name}
                        slug={teacher.slug}
                        // For featured carousel: use Featured Subject from Shikshaqmine, or fall back to first subject / relationship
                        subject={(teacher as any).featuredSubjectLabel || teacher.subjects?.name || 'Tuition Teacher'}
                        subjectSlug={teacher.subjects?.slug}
                        imageUrl={teacher.image_url}
                        isFeatured={true}
                        showShareOnMobile={false}
                        sirMaam={(teacher as any).sir_maam}
                        isLiked={isLiked(teacher.id)}
                        hideFavourite={true}
                        hideShare={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              {/* View more button below carousel */}
              <div className="flex justify-end mt-4 sm:mt-5 md:mt-6">
                <Link to="/all-tuition-teachers-in-kolkata" className="text-sm md:text-base font-semibold text-black hover:opacity-80 transition-opacity flex items-center gap-2">
                  View more teachers
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : loadError ? (
            <div className="text-center py-8 text-[#999999]">
              <p>Unable to load teachers. Please check your connection and refresh the page.</p>
            </div>
          ) : (
            <div className="text-center py-8 text-[#999999]">
              <p>No teachers found. Please add teachers to your Supabase database.</p>
            </div>
          )}
        </div>
      </section>

      {/* Wave: Beige → Orange */}
      <WaveDivider fillColor="#FF8000" bgColor="#F9F5F1" inverted={false} />

      {/* Subjects — Orange */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FF8000]">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white mb-2 sm:mb-4 md:mb-6">
            Explore tuition teachers via <span className="text-white">subjects</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-2xl" />
                </div>
              ))}
            </div>
          ) : subjects.length > 0 ? (
            <>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={subject.id}
                  name={subject.name}
                  slug={subject.slug}
                  iconComponent={subjectIconMap[subject.name] ?? <span className={EMOJI_WRAPPER} aria-hidden>📚</span>}
                  index={index}
                  isVisible={true}
                />
              ))}
            </div>
              {/* View more button below grid */}
              <div className="flex justify-end mt-4 sm:mt-5 md:mt-6">
                <Link to="/all-tuition-teachers-in-kolkata" className="text-sm md:text-base font-semibold text-white hover:opacity-80 transition-opacity flex items-center gap-2">
                  View more subjects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : loadError ? (
            <div className="text-center py-8 text-[#999999]">
              <p>Unable to load subjects. Please check your connection and refresh the page.</p>
            </div>
          ) : (
            <div className="text-center py-8 text-[#999999]">
              <p>No subjects found. Please add subjects to your Supabase database.</p>
            </div>
          )}
        </div>
      </section>

      {/* Wave: Orange → Beige */}
      <WaveDivider fillColor="#FF8000" bgColor="#F9F5F1" inverted={true} />

      {/* How It Works — Beige */}
      <div className="bg-[#F9F5F1]">
        <HowItWorks />
      </div>

      {/* Wave: Beige → Orange */}
      <WaveDivider fillColor="#FF8000" bgColor="#F9F5F1" inverted={false} />

      {/* FAQ — Orange */}
      <div className="bg-[#FF8000]">
        <FAQ />
      </div>

      {/* Wave: FAQ (Orange) → Footer */}
      <WaveDivider fillColor="#fcfbf8" bgColor="#FF8000" inverted={false} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
