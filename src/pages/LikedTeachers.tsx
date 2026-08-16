import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { EmptyResults } from '@/components/EmptyResults';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { adminToast } from '@/components/AdminConsole';
import { PageHeader, CutPaperShape } from '@/components/devices';

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sign in required</h1>
          <p className="mt-3 text-sm text-muted-foreground">Please sign in to view your favourite teachers.</p>
          <Button className="mt-6" onClick={() => navigate('/auth')}>Sign In</Button>
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

      <PageHeader
        eyebrow="Saved"
        title={
          <>
            Teachers you{' '}
            <span className="marker-highlight marker-highlight--pill" style={{ ['--marker-color' as string]: 'hsl(var(--brand-blue))' }}>
              liked
            </span>
          </>
        }
        lede="Saved teachers stay here until you remove them — tap the heart on any profile to add one."
        accent="hsl(var(--brand-blue))"
        ground="graph"
      />

      <main className="container pt-8 pb-16">
        {likedTeachers.length === 0 ? (
          <div className="relative mt-2 overflow-hidden">
            <CutPaperShape
              variant="squiggle"
              color="hsl(var(--brand-blue))"
              size={80}
              className="pointer-events-none absolute -left-4 -top-2 hidden opacity-90 sm:block"
            />
            <CutPaperShape
              variant="star"
              color="hsl(var(--brand))"
              size={56}
              className="pointer-events-none absolute -bottom-3 -right-2 hidden opacity-90 sm:block"
            />
            <EmptyResults
              icon={<Heart className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
              heading="No favourite teachers yet"
              message="Tap the heart on any teacher's card to save them here, so you can compare and come back later."
              action={{ label: 'Browse teachers', onClick: () => navigate('/all-tuition-teachers-in-kolkata') }}
            />
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
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
