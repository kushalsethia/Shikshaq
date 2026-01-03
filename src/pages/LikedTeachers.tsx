import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TeacherCard } from '@/components/TeacherCard';
import { useAuth } from '@/lib/auth-context';
import { useLikes } from '@/hooks/useLikes';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const { likedTeacherIds, loading: likesLoading, isLiked } = useLikes();
  const [likedTeachers, setLikedTeachers] = useState<LikedTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchLikedTeachers() {
      // Don't wait for likesLoading - fetch teachers immediately
      // We know these are liked teachers since we're on the liked teachers page
      if (likedTeacherIds.size === 0 && !likesLoading) {
        setLikedTeachers([]);
        setLoading(false);
        return;
      }

      // If likes are still loading but we have some IDs, proceed anyway
      const teacherIds = Array.from(likedTeacherIds);
      if (teacherIds.length === 0 && likesLoading) {
        return; // Wait for likes to load
      }

      try {
        // First fetch all teachers
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers_list')
          .select('id, name, slug, image_url, subjects(name, slug)')
          .in('id', teacherIds);

        if (teachersError) throw teachersError;

        if (!teachersData || teachersData.length === 0) {
          setLikedTeachers([]);
          setLoading(false);
          return;
        }

        // Extract all slugs and fetch Sir/Ma'am data in a single query
        const slugs = teachersData.map(t => t.slug);
        const { data: sirMaamData } = await supabase
          .from('Shikshaqmine')
          .select('Slug, "Sir/Ma\'am?"')
          .in('Slug', slugs);

        // Create a map of slug -> sirMaam for fast lookup
        const sirMaamMap = new Map<string, string | null>();
        if (sirMaamData) {
          sirMaamData.forEach((record: any) => {
            sirMaamMap.set(record.Slug, record["Sir/Ma'am?"] || null);
          });
        }

        // Combine teachers with Sir/Ma'am data
        const teachersWithSirMaam = teachersData.map((teacher) => ({
          ...teacher,
          sirMaam: sirMaamMap.get(teacher.slug) || null,
        }));

        setLikedTeachers(teachersWithSirMaam);
      } catch (error) {
        console.error('Error fetching liked teachers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLikedTeachers();
  }, [user, likedTeacherIds, navigate]); // Removed likesLoading from dependencies

  if (!user) {
    return null; // Will redirect to auth
  }

  // Show loading only if we don't have any teachers yet
  if (loading && likedTeachers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
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
      <main className="container py-8">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to browse
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-serif text-foreground">Liked Teachers</h1>
            <p className="text-muted-foreground">
              {likedTeachers.length === 0
                ? 'No liked teachers yet'
                : `${likedTeachers.length} ${likedTeachers.length === 1 ? 'teacher' : 'teachers'} liked`}
            </p>
          </div>
        </div>

        {/* Teachers Grid */}
        {likedTeachers.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-foreground mb-2">No liked teachers yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring teachers and like the ones you're interested in!
            </p>
            <Link to="/browse">
              <Button>Browse Teachers</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                id={teacher.id}
                name={teacher.name}
                slug={teacher.slug}
                subject={teacher.subjects?.name || 'Unknown'}
                imageUrl={teacher.image_url || undefined}
                subjectSlug={teacher.subjects?.slug}
                sirMaam={teacher.sirMaam}
                isLiked={true} // All teachers on this page are liked
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

