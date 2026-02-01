import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { useAuth } from '@/lib/auth-context';
import { useStudiesWith } from '@/lib/studies-with-context';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft } from 'lucide-react';
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
  const { studiesWithTeacherIds, loading: studiesWithLoading, isStudyingWith } = useStudiesWith();
  const [myTeachers, setMyTeachers] = useState<MyTeacher[]>([]);
  const [loading, setLoading] = useState(true);

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
          .select('Slug, "Sir/Ma\'am?", Subjects')
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
        console.error('Error fetching my teachers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyTeachers();
  }, [user, studiesWithTeacherIds, navigate, studiesWithLoading]);

  if (!user) {
    return null; // Will redirect to auth
  }

  // Show loading only if we don't have any teachers yet
  if (loading && myTeachers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-32 sm:pt-30 pb-8 md:pt-8">
        {/* Back Button */}
        <Link
          to="/dashboard/student"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="w-8 h-8 text-primary fill-primary" />
          <div>
            <h1 className="text-3xl font-serif text-foreground">My Teachers</h1>
            <p className="text-muted-foreground">
              {myTeachers.length === 0
                ? 'No teachers yet'
                : `${myTeachers.length} ${myTeachers.length === 1 ? 'teacher' : 'teachers'} you study with`}
            </p>
          </div>
        </div>

        {/* Teachers Grid */}
        {myTeachers.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-foreground mb-2">No teachers yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring teachers and indicate which ones you study with!
            </p>
            <Link to="/all-tuition-teachers-in-kolkata">
              <Button>Browse Teachers</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                id={teacher.id}
                name={teacher.name}
                slug={teacher.slug}
                subject={teacher.subjects?.name || 'Tuition Teacher'}
                imageUrl={teacher.image_url || undefined}
                subjectSlug={teacher.subjects?.slug}
                sirMaam={teacher.sirMaam}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

