import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/lib/likes-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Button } from '@/components/ui/button';
import { adminToast } from '@/components/AdminConsole';
import { ControlBlock, PageContainer, BottomNavSpacer } from '@/components/layout/PageContainer';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { ListLoading, ListEmpty, ListError, ListEnd } from '@/components/ui/list-states';

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
  const location = useLocation();
  const { likedTeacherIds, loading: likesLoading, toggleLike } = useLikes();
  // Every teacher we've ever fetched details for this session, keyed by id. Never pruned on
  // unlike, so an unlike is an instant local filter (optimistic) and Undo is instant too, since
  // the restored teacher's data is already sitting in this cache — no re-fetch needed either way.
  const [teacherCache, setTeacherCache] = useState<Map<string, LikedTeacher>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  // Ensure user has selected a role
  useRequireRole();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchMissingTeachers() {
      setError(false);
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
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching liked teachers:', err);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMissingTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, likedTeacherIds, likesLoading, navigate, retryToken]);

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
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sign in required</h1>
          <p className="mt-3 text-sm text-muted-foreground">Please sign in to view your favourite teachers.</p>
          <Button variant="primary" size={44} className="mt-6" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </main>
        <PreFooter variant={preFooterFor(location.pathname)} />
        <Footer />
      </div>
    ); // Will also redirect to auth
  }

  // Show loading only if we don't have any teachers yet — real emptiness (likedCount === 0 once
  // both this page's own fetch and the shared likes context have settled) skips straight to the
  // empty state below instead of skeletons that would never resolve into cards.
  const showSkeleton = (loading || likesLoading) && !error && likedTeachers.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <ControlBlock mode="dark">
        <h1 className="font-display text-[27px] font-black leading-[1.05] tracking-[-0.035em] text-background">
          {likedTeachers.length > 0
            ? `${likedTeachers.length} liked teacher${likedTeachers.length === 1 ? '' : 's'}`
            : 'Liked teachers'}
        </h1>
        <p className="mt-1 text-[14.5px] text-white/70">
          Saved teachers stay here until you remove them — tap the heart on any profile to add one.
        </p>
      </ControlBlock>

      <PageContainer as="main" className="pt-[24px] pb-[40px]">
        {showSkeleton ? (
          <ListLoading count={5} media={0} lines={3} />
        ) : error && likedTeachers.length === 0 ? (
          <ListError onRetry={() => setRetryToken((t) => t + 1)} />
        ) : likedTeachers.length === 0 ? (
          <>
            <ListEmpty line="No saved teachers yet. Tap the mark on any card and they wait for you here." />
            <Button asChild variant="primary" size={44} className="mt-[16px]">
              <Link to="/all-tuition-teachers-in-kolkata">Browse teachers</Link>
            </Button>
          </>
        ) : (
          <>
            <ul className="flex flex-col gap-[10px]">
              {likedTeachers.map((teacher) => (
                <li key={teacher.id}>
                  <TeacherCard
                    id={teacher.id}
                    name={teacher.name}
                    slug={teacher.slug}
                    subject={teacher.subjects?.name || 'Tuition Teacher'}
                    imageUrl={teacher.image_url || undefined}
                    subjectSlug={teacher.subjects?.slug}
                    sirMaam={teacher.sirMaam}
                    variant="row"
                    showUpvotes={false}
                  />
                </li>
              ))}
            </ul>
            <ListEnd count={likedTeachers.length} />
          </>
        )}
      </PageContainer>

      <PreFooter variant={preFooterFor(location.pathname)} />
      <BottomNavSpacer />
      <Footer />
    </div>
  );
}
