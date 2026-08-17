import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getTeachersByIds } from '@/lib/teachers';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { useAuth } from '@/lib/auth-context';
import { useStudiesWith } from '@/lib/studies-with-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ControlBlock, PageContainer, BottomNavSpacer } from '@/components/layout/PageContainer';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { ListLoading, ListEmpty, ListError, ListEnd } from '@/components/ui/list-states';

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
  const location = useLocation();
  const { studiesWithTeacherIds, loading: studiesWithLoading, toggleStudiesWith } = useStudiesWith();
  const [myTeachers, setMyTeachers] = useState<MyTeacher[]>([]);
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

    async function fetchMyTeachers() {
      setError(false);

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
        const teachersWithSirMaam = await getTeachersByIds(teacherIds);

        if (teachersWithSirMaam.length === 0) {
          setMyTeachers([]);
          setLoading(false);
          return;
        }

        setMyTeachers(teachersWithSirMaam);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching my teachers:', err);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMyTeachers();
  }, [user, studiesWithTeacherIds, navigate, studiesWithLoading, retryToken]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container py-16 pb-16 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sign in required</h1>
          <p className="mt-3 text-sm text-muted-foreground">Please sign in to view the teachers you study with.</p>
          <Button variant="primary" size={44} className="mt-6" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </main>
        <PreFooter variant={preFooterFor(location.pathname)} />
        <Footer />
      </div>
    ); // Will also redirect to auth
  }

  const showSkeleton = loading && !error && myTeachers.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <ControlBlock mode="dark">
        <Link
          to="/dashboard/student"
          className="-mt-1 mb-[14px] inline-flex min-h-11 items-center py-1 text-[13px] font-semibold text-white/70 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          {'←'} Back to dashboard
        </Link>
        <h1 className="font-display text-[27px] font-black leading-[1.05] tracking-[-0.035em] text-background">
          {myTeachers.length > 0
            ? `${myTeachers.length} teacher${myTeachers.length === 1 ? '' : 's'} you study with`
            : 'Your teachers'}
        </h1>
        <p className="mt-1 text-[14.5px] text-white/70">
          Mark a teacher as "studies with" from their profile and they turn up here.
        </p>
      </ControlBlock>

      <PageContainer as="main" className="pt-[24px] pb-[40px]">
        {showSkeleton ? (
          <ListLoading count={5} media={0} lines={3} />
        ) : error && myTeachers.length === 0 ? (
          <ListError onRetry={() => setRetryToken((t) => t + 1)} />
        ) : myTeachers.length === 0 ? (
          <>
            <ListEmpty line="No saved teachers yet. Tap the mark on any card and they wait for you here." />
            <Button asChild variant="primary" size={44} className="mt-[16px]">
              <Link to="/all-tuition-teachers-in-kolkata">Browse teachers</Link>
            </Button>
          </>
        ) : (
          <>
            <ul className="flex flex-col gap-[10px]">
              {myTeachers.map((teacher) => (
                <li key={teacher.id} className="flex items-center gap-[10px]">
                  <div className="min-w-0 flex-1">
                    <TeacherCard
                      id={teacher.id}
                      name={teacher.name}
                      slug={teacher.slug}
                      subject={teacher.subjects?.name || 'Tuition Teacher'}
                      imageUrl={teacher.image_url || undefined}
                      subjectSlug={teacher.subjects?.slug}
                      sirMaam={teacher.sirMaam}
                      variant="row"
                      hideFavourite
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleStudiesWith(teacher.id);
                    }}
                    aria-label={`Remove ${teacher.name} from my teachers`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card shadow-border transition-transform duration-150 active:scale-[0.97] hover:-translate-y-0.5 hover:shadow-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                </li>
              ))}
            </ul>
            <ListEnd count={myTeachers.length} />
          </>
        )}
      </PageContainer>

      <PreFooter variant={preFooterFor(location.pathname)} />
      <BottomNavSpacer />
      <Footer />
    </div>
  );
}
