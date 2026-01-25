import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UpvoteStat {
  teacher_id: string;
  teacher_name: string;
  teacher_slug: string;
  upvote_count: number;
}

export default function AdminUpvotes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upvoteStats, setUpvoteStats] = useState<UpvoteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setCheckingAdmin(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle "not found" gracefully

        if (error) {
          // Error querying (table might not exist or RLS issue)
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else if (data && data.id === user.id) {
          // User is an admin
          setIsAdmin(true);
          fetchUpvoteStats();
        } else {
          // User is not an admin
          console.log('User is not an admin');
          setIsAdmin(false);
          toast.error('Access denied. Admin only.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, navigate]);

  async function fetchUpvoteStats() {
    try {
      // Use the view we created in the migration
      const { data, error } = await supabase
        .from('teacher_upvote_stats')
        .select('*')
        .order('upvote_count', { ascending: false });

      if (error) {
        // Fallback: query directly if view doesn't exist
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          // Query upvotes directly and aggregate
          const { data: upvotesData, error: upvotesError } = await supabase
            .from('teacher_upvotes')
            .select('teacher_id');

          if (upvotesError) {
            throw upvotesError;
          }

          // Count upvotes per teacher
          const counts = new Map<string, number>();
          upvotesData?.forEach((upvote: any) => {
            const current = counts.get(upvote.teacher_id) || 0;
            counts.set(upvote.teacher_id, current + 1);
          });

          // Get teacher details
          const teacherIds = Array.from(counts.keys());
          if (teacherIds.length > 0) {
            const { data: teachersData, error: teachersError } = await supabase
              .from('teachers_list')
              .select('id, name, slug')
              .in('id', teacherIds);

            if (teachersError) {
              throw teachersError;
            }

            const stats: UpvoteStat[] = teachersData?.map((teacher: any) => ({
              teacher_id: teacher.id,
              teacher_name: teacher.name,
              teacher_slug: teacher.slug,
              upvote_count: counts.get(teacher.id) || 0,
            })) || [];

            stats.sort((a, b) => b.upvote_count - a.upvote_count);
            setUpvoteStats(stats);
          } else {
            setUpvoteStats([]);
          }
        } else {
          throw error;
        }
      } else {
        setUpvoteStats(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching upvote stats:', error);
      toast.error('Failed to load upvote statistics');
    } finally {
      setLoading(false);
    }
  }

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-16 text-center md:pt-16">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-muted rounded mx-auto mb-4" />
            <div className="h-4 w-48 bg-muted rounded mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-16 text-center md:pt-16">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            This page is only accessible to administrators.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-foreground">Teacher Upvotes</h1>
            <p className="text-muted-foreground mt-1">
              View upvote statistics for all teachers
            </p>
          </div>
        </div>

        {upvoteStats.length === 0 ? (
          <div className="text-center py-16">
            <ThumbsUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upvotes yet.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Teacher Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Upvotes</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {upvoteStats.map((stat, index) => (
                    <tr key={stat.teacher_id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {stat.teacher_name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{stat.upvote_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link to={`/tuition-teachers/${stat.teacher_slug}`}>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

