import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { EmptyResults } from '@/components/EmptyResults';
import { useAuth } from '@/lib/auth-context';
import { useStudiesWith } from '@/lib/studies-with-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MyTeacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
  sirMaam?: string | null;
}

export default function MyTeachers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { studiesWithTeacherIds, loading: studiesWithLoading, toggleStudiesWith } = useStudiesWith();
  const [myTeachers, setMyTeachers] = useState<MyTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Ensure user has selected a role
  useRequireRole();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchMyTeachers() {
      // Don't wait for studiesWithLoading - fetch teachers immediately
      // We know these are teachers the student studies with since we're on the my teachers page
      if (studiesWithTeacherIds.size === 0 && !studiesWithLoading) {
        setMyTeachers([]);
        setLoading(false);
        return;
      }

      // If studies-with are still loading but we have some IDs, proceed anyway
      const teacherIds = Array.from(studiesWithTeacherIds);
      if (teacherIds.length === 0 && studiesWithLoading) {
        return; // Wait for studies-with to load
      }

      try {
        // First fetch all teachers
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers_list')
          .select('id, name, slug, image_url, subjects(name, slug)')
          .in('id', teacherIds);

        if (teachersError) throw teachersError;

        if (!teachersData || teachersData.length === 0) {
          setMyTeachers([]);
          setLoading(false);
          return;
        }

        // Extract all slugs and fetch Sir/Ma'am and Subjects data in a single query
        const slugs = teachersData.map(t => t.slug);
          const { data: shikshaqData } = await supabase
            .from('Shikshaqmine')
            .select('*')
            .in('Slug', slugs);

        // Create maps for fast lookup
        const sirMaamMap = new Map<string, string | null>();
        const subjectsMap = new Map<string, string>(); // slug -> first subject name
        if (shikshaqData) {
          shikshaqData.forEach((record: any) => {
            sirMaamMap.set(record.Slug, record["Sir/Ma'am?"] || null);
            // Extract first subject from comma-separated Subjects field
            if (record.Subjects) {
              const firstSubject = record.Subjects.split(',')[0].trim();
              if (firstSubject) {
                subjectsMap.set(record.Slug, firstSubject);
              }
            }
          });
        }

        // Fetch subjects table for matching
        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('name, slug');

        // Combine teachers with Sir/Ma'am data and add subjects if missing
        const teachersWithSirMaam = teachersData.map((teacher) => {
          // If no subject from relationship, try to get from Shikshaqmine
          if (!teacher.subjects) {
            const firstSubjectName = subjectsMap.get(teacher.slug);
            if (firstSubjectName && subjectsData) {
              // Try to find matching subject in subjects table
              const matchingSubject = subjectsData.find((s: any) =>
                s.name.toLowerCase() === firstSubjectName.toLowerCase()
              );
              if (matchingSubject) {
                teacher.subjects = { name: matchingSubject.name, slug: matchingSubject.slug };
              } else {
                // If no match found, use the name from Shikshaqmine directly
                teacher.subjects = {
                  name: firstSubjectName,
                  slug: firstSubjectName.toLowerCase().replace(/\s+/g, '-')
                };
              }
            }
          }

          return {
            ...teacher,
            sirMaam: sirMaamMap.get(teacher.slug) || null,
          };
        });

        setMyTeachers(teachersWithSirMaam);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching my teachers:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMyTeachers();
  }, [user, studiesWithTeacherIds, navigate, studiesWithLoading]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sign in required</h1>
          <p className="mt-3 text-sm text-muted-foreground">Please sign in to view the teachers you study with.</p>
          <Button className="mt-6" onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
        <Footer />
      </div>
    ); // Will also redirect to auth
  }

  // Show loading only if we don't have any teachers yet
  if (loading && myTeachers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-8 pb-16">
          <div className="mb-7 h-8 w-56 animate-shimmer rounded-lg bg-muted" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-shimmer rounded-2xl bg-muted" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-8 pb-16">
        {/* Back Button */}
        <Link
          to="/dashboard/student"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-warm-meta transition-colors duration-150 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">My Teachers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {myTeachers.length === 0
            ? 'Teachers you study with will show up here'
            : `${myTeachers.length} ${myTeachers.length === 1 ? 'teacher' : 'teachers'} you study with`}
        </p>

        {/* Teachers Grid */}
        {myTeachers.length === 0 ? (
          <EmptyResults
            className="mt-6"
            icon={<GraduationCap className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
            heading="No teachers yet"
            message="Start exploring teachers and indicate which ones you study with."
            action={{ label: 'Browse teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
          />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {myTeachers.map((teacher) => (
              <div key={teacher.id} className="relative">
                <TeacherCard
                  id={teacher.id}
                  name={teacher.name}
                  slug={teacher.slug}
                  subject={teacher.subjects?.name || 'Tuition Teacher'}
                  imageUrl={teacher.image_url || undefined}
                  subjectSlug={teacher.subjects?.slug}
                  sirMaam={teacher.sirMaam}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStudiesWith(teacher.id);
                  }}
                  aria-label="Remove from my teachers"
                  className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card/95 shadow-border transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
