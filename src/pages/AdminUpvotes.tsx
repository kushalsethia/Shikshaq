import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SURFACE_TOKENS, MODE_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  AdminTile,
  adminRowStyle,
  adminRowListStyle,
  adminSecondaryBtnStyle,
  adminToast,
  useAdminGuard,
} from '@/components/AdminConsole';

interface UpvoteStat {
  teacher_id: string;
  teacher_name: string;
  teacher_slug: string;
  upvote_count: number;
}

const TINT = { bg: MODE_TOKENS.papers.tintBg, text: MODE_TOKENS.papers.tintText }; // #EDEEFF / #2E3AD6 per spec
const UPVOTE_ICON_COLOR = MODE_TOKENS.papers.color; // #4351FF solid, for the ThumbsUp icon accent

export default function AdminUpvotes() {
  const { user } = useAuth();
  const [upvoteStats, setUpvoteStats] = useState<UpvoteStat[]>([]);
  const [loading, setLoading] = useState(true);

  const { isAdmin, checkingAdmin } = useAdminGuard(user, {
    onGranted: fetchUpvoteStats,
    redirectOnDenied: true,
  });

  useEffect(() => {
    if (!checkingAdmin) setLoading(false);
  }, [checkingAdmin]);

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
      if (import.meta.env.DEV) {
        console.error('Error fetching upvote stats:', error);
      }
      adminToast('Failed to load upvote statistics');
    } finally {
      setLoading(false);
    }
  }

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <div className="container pt-6 sm:pt-8 pb-16 text-center md:pt-16">
          <div className="animate-pulse">
            <div className="h-8 w-64 rounded mx-auto mb-4" style={{ background: SURFACE_TOKENS.mutedFill }} />
            <div className="h-4 w-48 rounded mx-auto" style={{ background: SURFACE_TOKENS.mutedFill }} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <div className="container pt-6 sm:pt-8 pb-16 text-center md:pt-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="mb-4" style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>Access Denied</h1>
            <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
              This page is only accessible to administrators.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AdminConsole
      activeTab="upvotes"
      title="Upvote activity"
      subtitle="Flagged when a profile gains votes faster than usual."
      tint={TINT}
      tabCount={upvoteStats.length}
    >
      {upvoteStats.length === 0 ? (
        <div className="text-center py-16" style={{ background: SURFACE_TOKENS.field, borderRadius: 16, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
          <ThumbsUp className="w-16 h-16 mx-auto mb-4" style={{ color: SURFACE_TOKENS.textTertiary, opacity: 0.6 }} />
          <p style={{ color: SURFACE_TOKENS.textSecondary }}>No upvotes yet.</p>
        </div>
      ) : (
        <div style={adminRowListStyle}>
          {upvoteStats.map((stat, index) => (
            <div key={stat.teacher_id} style={adminRowStyle}>
              <AdminTile tint={TINT}>#{index + 1}</AdminTile>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>
                  {stat.teacher_name}
                </div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: SURFACE_TOKENS.textTertiary }}>
                  <ThumbsUp className="w-3.5 h-3.5" style={{ color: UPVOTE_ICON_COLOR }} />
                  {stat.upvote_count} upvote{stat.upvote_count === 1 ? '' : 's'}
                </div>
              </div>
              <Link to={`/tuition-teachers/${stat.teacher_slug}`}>
                <button style={adminSecondaryBtnStyle}>View Profile</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </AdminConsole>
  );
}
