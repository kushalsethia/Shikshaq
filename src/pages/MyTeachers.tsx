import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
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
  const { studiesWithTeacherIds, loading: studiesWithLoading, isStudyingWith, toggleStudiesWith } = useStudiesWith();
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
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 12 }}>Sign in required</h1>
          <p style={{ color: '#7B736B', marginBottom: 24 }}>Please sign in to view the teachers you study with.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
        <Footer />
      </div>
    ); // Will also redirect to auth
  }

  // Show loading only if we don't have any teachers yet
  if (loading && myTeachers.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
        <Navbar />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px' }}>
          <div className="animate-pulse" style={{ height: 32, width: 220, background: '#F0EAE2', borderRadius: 8, marginBottom: 28 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ borderRadius: 20, aspectRatio: '4/5', background: '#F0EAE2' }} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,28px) 60px' }}>
        {/* Back Button */}
        <Link
          to="/dashboard/student"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#8B837A', marginBottom: 16 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <h1 style={{ fontSize: 'clamp(25px,3.4vw,38px)', lineHeight: 1, fontWeight: 700 }}>My Teachers</h1>
        <p style={{ marginTop: 8, fontSize: 15, color: '#7B736B' }}>
          {myTeachers.length === 0
            ? 'Teachers you study with will show up here'
            : `${myTeachers.length} ${myTeachers.length === 1 ? 'teacher' : 'teachers'} you study with`}
        </p>

        {/* Teachers Grid */}
        {myTeachers.length === 0 ? (
          <div style={{ marginTop: 24, padding: 36, borderRadius: 22, background: '#FCFAF7', boxShadow: '0 0 0 1px #E7DFD5', textAlign: 'center' }}>
            <GraduationCap className="w-10 h-10 mx-auto mb-4" style={{ color: '#8B837A' }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No teachers yet</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7B736B', maxWidth: 420, margin: '0 auto 18px' }}>
              Start exploring teachers and indicate which ones you study with!
            </p>
            <Link to="/all-tuition-teachers-in-kolkata">
              <Button>Browse Teachers</Button>
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {myTeachers.map((teacher) => (
              <div key={teacher.id} style={{ position: 'relative' }}>
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
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(252,250,247,.94)',
                    borderRadius: 999,
                    boxShadow: '0 0 0 1px rgba(0,0,0,.06)',
                  }}
                >
                  <X className="w-4 h-4" style={{ color: '#1F1F1F' }} />
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

