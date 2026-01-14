import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { TeacherCard } from '@/components/TeacherCard';
import { SubjectCard } from '@/components/SubjectCard';
import { HowItWorks } from '@/components/HowItWorks';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { useLikes } from '@/lib/likes-context';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';


interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
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
  // Pre-initialize likes hook for fast initial render (shared state)
  const { isLiked } = useLikes();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch teachers and subjects in parallel for better performance
        const [teachersRes, subjectsRes, shikshaqRes] = await Promise.all([
          supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
            .eq('is_featured', true)
            .limit(16),
          supabase
            .from('subjects')
            .select('*')
            .limit(8),
          supabase
            .from('Shikshaqmine')
            .select('Slug, Featured')
            .eq('Featured', true)
            .limit(16)
        ]);

        // Get featured teachers from Shikshaqmine table if available
        let teachersData = teachersRes.data || [];
        if (shikshaqRes.data && shikshaqRes.data.length > 0) {
          // Get teachers that are featured in Shikshaqmine
          const featuredSlugs = shikshaqRes.data.map((r: any) => r.Slug);
          const { data: featuredTeachersData } = await supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
            .in('slug', featuredSlugs)
            .limit(16);
          
          if (featuredTeachersData && featuredTeachersData.length > 0) {
            teachersData = featuredTeachersData;
          }
        }

        // If still no featured teachers, get random teachers
        if (teachersData.length === 0) {
          const { data: allTeachers } = await supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
            .limit(100); // Get more to randomize from
          
          if (allTeachers && allTeachers.length > 0) {
            // Shuffle and take 16
            const shuffled = [...allTeachers].sort(() => Math.random() - 0.5);
            teachersData = shuffled.slice(0, 16);
          }
        } else if (teachersData.length < 16) {
          // If we have some but less than 16, fill with random teachers
          const existingSlugs = new Set(teachersData.map((t: any) => t.slug));
          const { data: additionalTeachers } = await supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
            .not('slug', 'in', `(${Array.from(existingSlugs).map(s => `"${s}"`).join(',')})`)
            .limit(100);
          
          if (additionalTeachers && additionalTeachers.length > 0) {
            const shuffled = [...additionalTeachers].sort(() => Math.random() - 0.5);
            const needed = 16 - teachersData.length;
            teachersData = [...teachersData, ...shuffled.slice(0, needed)];
          }
        }

        // Fetch Sir/Ma'am data from Shikshaqmine table
        let sirMaamMap = new Map();
        if (teachersData.length > 0) {
          const teacherSlugs = teachersData.map((t: any) => t.slug);
          const { data: shikshaqData } = await supabase
            .from('Shikshaqmine')
            .select('Slug, "Sir/Ma\'am?"')
            .in('Slug', teacherSlugs);
          
          if (shikshaqData) {
            shikshaqData.forEach((record: any) => {
              sirMaamMap.set(record.Slug, record["Sir/Ma'am?"]);
            });
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
                teacherWithSubject = { ...teacher, subjects: null };
              }
            }
            
            // Add Sir/Ma'am data
            return {
              ...teacherWithSubject,
              sir_maam: sirMaamMap.get(teacher.slug) || null
            };
          });

          setFeaturedTeachers(processedTeachers);
        }

        if (subjectsRes.data) {
          setSubjects(subjectsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Search Section */}
      <section className="pt-8 pb-4">
        <div className="container">
          <SearchBar />
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Featured tuition teachers on ShikshAq</h2>
            {/* Desktop: View more button */}
            <Link to="/browse" className="view-more-link hidden md:flex">
              View more teachers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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
            <>
              {/* Mobile: Carousel */}
              <div className="md:hidden relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                    dragFree: true, // Enable free dragging for smoother swipe
                    containScroll: "trimSnaps",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {featuredTeachers.map((teacher) => (
                      <CarouselItem key={teacher.id} className="pl-2 md:pl-4 basis-1/2">
                        <TeacherCard
                          id={teacher.id}
                          name={teacher.name}
                          slug={teacher.slug}
                          subject={teacher.subjects?.name || 'General'}
                          subjectSlug={teacher.subjects?.slug}
                          imageUrl={teacher.image_url}
                          isFeatured={true}
                          sirMaam={(teacher as any).sir_maam}
                          isLiked={isLiked(teacher.id)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
                {/* Mobile: View more button below carousel */}
                <div className="flex justify-end mt-6">
                  <Link to="/browse" className="view-more-link font-bold">
                    View more teachers
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Desktop: Grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    id={teacher.id}
                    name={teacher.name}
                    slug={teacher.slug}
                    subject={teacher.subjects?.name || 'General'}
                    subjectSlug={teacher.subjects?.slug}
                    imageUrl={teacher.image_url}
                    isFeatured={true}
                    sirMaam={(teacher as any).sir_maam}
                    isLiked={isLiked(teacher.id)} // Pass for fast initial render, hook handles real-time updates
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No teachers found. Please add teachers to your Supabase database.</p>
            </div>
          )}
        </div>
      </section>

      {/* Hero CTA */}
      <HeroSection />

      {/* Subjects */}
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Explore tuition teachers via subjects</h2>
            <Link to="/browse" className="view-more-link">
              View more subjects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-2xl" />
                </div>
              ))}
            </div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  name={subject.name}
                  slug={subject.slug}
                  imageUrl={subject.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No subjects found. Please add subjects to your Supabase database.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* FAQ */}
      <FAQ />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
}
