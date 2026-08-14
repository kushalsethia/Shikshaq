import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Button } from '@/components/ui/button';
import { adminToast } from '@/components/AdminConsole';
import { SURFACE_TOKENS } from '@/utils/searchFacets';

interface LikedTeacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
  sirMaam?: string | null;
}

export default function LikedTeachers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { likedTeacherIds, loading: likesLoading, toggleLike } = useLikes();
  // Every teacher we've ever fetched details for this session, keyed by id. Never pruned on
  // unlike, so an unlike is an instant local filter (optimistic) and Undo is instant too, since
  // the restored teacher's data is already sitting in this cache — no re-fetch needed either way.
  const [teacherCache, setTeacherCache] = useState<Map<string, LikedTeacher>>(new Map());
  const [loading, setLoading] = useState(true);

  // Ensure user has selected a role
  useRequireRole();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchMissingTeachers() {
      const missingIds = Array.from(likedTeacherIds).filter((id) => !teacherCache.has(id));

      if (missingIds.length === 0) {
        if (!likesLoading) setLoading(false);
        return;
      }

      try {
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers_list')
          .select('id, name, slug, image_url, subjects(name, slug)')
          .in('id', missingIds);

        if (teachersError) throw teachersError;

        if (!teachersData || teachersData.length === 0) {
          setLoading(false);
          return;
        }

        // Extract all slugs and fetch Sir/Ma'am and Subjects data in a single query
        const slugs = teachersData.map((t) => t.slug);
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
        const teachersWithSirMaam: LikedTeacher[] = teachersData.map((teacher) => {
          // If no subject from relationship, try to get from Shikshaqmine
          if (!teacher.subjects) {
            const firstSubjectName = subjectsMap.get(teacher.slug);
            if (firstSubjectName && subjectsData) {
              // Try to find matching subject in subjects table
              const matchingSubject = subjectsData.find(
                (s: any) => s.name.toLowerCase() === firstSubjectName.toLowerCase()
              );
              if (matchingSubject) {
                teacher.subjects = { name: matchingSubject.name, slug: matchingSubject.slug };
              } else {
                // If no match found, use the name from Shikshaqmine directly
                teacher.subjects = {
                  name: firstSubjectName,
                  slug: firstSubjectName.toLowerCase().replace(/\s+/g, '-'),
                };
              }
            }
          }

          return {
            ...teacher,
            sirMaam: sirMaamMap.get(teacher.slug) || null,
          };
        });

        setTeacherCache((prev) => {
          const next = new Map(prev);
          teachersWithSirMaam.forEach((t) => next.set(t.id, t));
          return next;
        });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching liked teachers:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMissingTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, likedTeacherIds, likesLoading, navigate]);

  // Tapping the heart on a card unlikes through useLikes() directly (the same hook this page
  // reads from), so the grid below already drops the card the instant likedTeacherIds shrinks —
  // that's the "optimistic" removal. This effect only adds the Undo affordance on top: it diffs
  // likedTeacherIds against the previous render to notice a removal, then shows a toast whose
  // Undo button re-likes the same teacher (already cached above, so it reappears instantly too).
  const prevIdsRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    const prev = prevIdsRef.current;
    if (prev) {
      prev.forEach((id) => {
        if (!likedTeacherIds.has(id)) {
          const teacher = teacherCache.get(id);
          adminToast(teacher ? `Removed ${teacher.name} from favourites` : 'Removed from favourites', {
            undo: () => {
              toggleLike(id);
            },
          });
        }
      });
    }
    prevIdsRef.current = new Set(likedTeacherIds);
  }, [likedTeacherIds, teacherCache, toggleLike]);

  const likedTeachers = Array.from(likedTeacherIds)
    .map((id) => teacherCache.get(id))
    .filter((t): t is LikedTeacher => Boolean(t));

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: '#1F1F1F', marginBottom: 12 }}>Sign in required</h1>
          <p style={{ color: '#7B736B', marginBottom: 24 }}>Please sign in to view your favourite teachers.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </main>
        <Footer />
      </div>
    ); // Will also redirect to auth
  }

  // Show loading only if we don't have any teachers yet — real emptiness (likedCount === 0 once
  // both this page's own fetch and the shared likes context have settled) skips straight to the
  // empty state below instead of skeletons that would never resolve into cards.
  if ((loading || likesLoading) && likedTeachers.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}>
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
    <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }}>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 56px' }}>
        <h1 style={{ fontSize: 'clamp(25px,3.4vw,38px)', lineHeight: 1, fontWeight: 700 }}>Favourite teachers</h1>
        <p style={{ marginTop: 10, fontSize: 15, color: '#7B736B' }}>
          Saved teachers stay here until you remove them.
        </p>

        {likedTeachers.length === 0 ? (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7B736B', maxWidth: 420, marginBottom: 18 }}>
              Start exploring teachers and favourite the ones you're interested in.
            </p>
            <Link to="/all-tuition-teachers-in-kolkata">
              <Button>Browse teachers</Button>
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {likedTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                id={teacher.id}
                name={teacher.name}
                slug={teacher.slug}
                subject={teacher.subjects?.name || 'Tuition Teacher'}
                imageUrl={teacher.image_url || undefined}
                subjectSlug={teacher.subjects?.slug}
                sirMaam={teacher.sirMaam}
                size="md"
                showUpvotes={false}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
