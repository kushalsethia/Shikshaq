import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, User as UserIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { SURFACE_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  AdminStatTiles,
  AdminTile,
  AdminPill,
  adminRowStyle,
  adminRowListStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
  adminToast,
} from '@/components/AdminConsole';

interface Feedback {
  id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_guest: boolean;
  guest_email: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

const ratingLabels: { [key: number]: string } = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

const ratingEmojis: { [key: number]: string } = {
  1: '🥵',
  2: '😩',
  3: '😐',
  4: '😊',
  5: '🥰',
};

const TINT = { bg: SURFACE_TOKENS.mutedFill, text: SURFACE_TOKENS.textBody }; // #F0EAE2 / #4A443E per spec

export default function AdminFeedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [filter, setFilter] = useState<'all' | 'guest' | 'logged-in'>('all');

  async function fetchFeedback() {
    try {
      setLoading(true);

      let query = supabase
        .from('feedback')
        .select(`
          id,
          user_id,
          rating,
          comment,
          is_guest,
          guest_email,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      // Apply filter
      if (filter === 'guest') {
        query = query.eq('is_guest', true);
      } else if (filter === 'logged-in') {
        query = query.eq('is_guest', false);
      }

      const { data, error } = await query;

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching feedback:', error);
        }
        adminToast('Failed to load feedback');
        return;
      }

      // Batch fetch: one query for all unique logged-in-user profiles instead of one query per
      // feedback row (was N+1 — every row awaited its own round-trip sequentially inside the
      // Promise.all callback's `await`, since each callback still ran one query per item).
      const rows = data || [];
      const userIds = [...new Set(
        rows.filter((item) => item.user_id && !item.is_guest).map((item) => item.user_id as string)
      )];

      const { data: profilesData } = userIds.length > 0
        ? await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .in('id', userIds)
        : { data: [] };

      const profilesMap = new Map((profilesData || []).map((p) => [p.id, p]));

      const feedbackWithData = rows.map((item) => ({
        ...item,
        profiles: item.user_id && !item.is_guest ? profilesMap.get(item.user_id) || null : null,
      }));

      setFeedback(feedbackWithData);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }

  // Check if current user is an admin
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
          .maybeSingle();

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error checking admin status:', error);
          }
          setIsAdmin(false);
        } else if (data && data.id === user.id) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error checking admin status:', error);
        }
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }

    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Refetch feedback when filter changes
  useEffect(() => {
    if (isAdmin) {
      fetchFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, isAdmin]);

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error deleting feedback:', error);
        }
        adminToast('Failed to delete feedback');
        return;
      }

      adminToast('Feedback resolved');
      fetchFeedback();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to delete feedback');
    }
  };

  const getFeedbackAuthorName = (item: Feedback): string => {
    if (item.is_guest) {
      return item.guest_email ? `Guest (${item.guest_email})` : 'Guest';
    }
    if (item.profiles?.full_name) {
      return item.profiles.full_name;
    }
    return 'Unknown User';
  };

  const getFeedbackAuthorEmail = (item: Feedback): string | null => {
    if (item.is_guest) {
      return item.guest_email;
    }
    return item.profiles?.email || null;
  };

  const getFeedbackAvatar = (item: Feedback): string | null => {
    if (item.is_guest) {
      return null;
    }
    return item.profiles?.avatar_url || null;
  };

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <div className="container pt-6 sm:pt-8 pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: SURFACE_TOKENS.mutedFill }} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl" style={{ background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <div className="container pt-6 sm:pt-8 pb-8 md:pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4" style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>Access Denied</h1>
            <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
              You need to be an admin to access this page.
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

  const filterTabs: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: feedback.length },
    { key: 'guest', label: 'Guest', count: feedback.filter((f) => f.is_guest).length },
    { key: 'logged-in', label: 'Logged In', count: feedback.filter((f) => !f.is_guest).length },
  ];

  return (
    <AdminConsole
      activeTab="feedback"
      title="Site feedback"
      subtitle="What students and parents write in from the help page."
      tint={TINT}
      tabCount={feedback.length}
    >
      {feedback.length > 0 && (
        <AdminStatTiles
          stats={[
            { label: 'Total responses', value: feedback.length },
            {
              label: 'Average rating',
              value: (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1),
            },
            { label: 'Guest', value: feedback.filter((f) => f.is_guest).length },
            { label: 'Logged in', value: feedback.filter((f) => !f.is_guest).length },
          ]}
        />
      )}

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={filter === tab.key ? { ...adminSecondaryBtnStyle, background: SURFACE_TOKENS.ink, color: '#fff', boxShadow: 'none' } : adminSecondaryBtnStyle}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Feedback List */}
      {feedback.length === 0 ? (
        <div className="text-center py-16" style={{ background: SURFACE_TOKENS.field, borderRadius: 16, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
          <p style={{ color: SURFACE_TOKENS.textSecondary }}>No feedback found.</p>
        </div>
      ) : (
        <div style={adminRowListStyle}>
          {feedback.map((item) => {
            const avatarUrl = getFeedbackAvatar(item);
            const email = getFeedbackAuthorEmail(item);
            const name = getFeedbackAuthorName(item);
            return (
              <div key={item.id} style={{ ...adminRowStyle, alignItems: 'flex-start' }}>
                {avatarUrl ? (
                  <Avatar className="w-[42px] h-[42px] flex-shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                      {item.is_guest ? <UserIcon className="w-5 h-5" /> : name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <AdminTile tint={TINT}>
                    {item.is_guest ? <UserIcon className="w-5 h-5" /> : name.charAt(0).toUpperCase()}
                  </AdminTile>
                )}

                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>{name}</span>
                    {item.is_guest && <AdminPill tone="pending">Guest</AdminPill>}
                    <span style={{ fontSize: 13 }}>{ratingEmojis[item.rating]}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: SURFACE_TOKENS.textTertiary }}>{ratingLabels[item.rating]}</span>
                  </div>
                  <p style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5, color: SURFACE_TOKENS.textTertiary }}>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>

                  {item.comment && (
                    <p style={{ marginTop: 10, padding: 12, borderRadius: 12, background: SURFACE_TOKENS.mutedFill, color: SURFACE_TOKENS.textPrimary, fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                      {item.comment}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 12 }}>
                    {email && (
                      <a href={`mailto:${email}`} style={adminSecondaryBtnStyle}>
                        <Mail className="w-3.5 h-3.5" />
                        Reply
                      </a>
                    )}
                    <button onClick={() => handleDelete(item.id)} style={adminDestructiveBtnStyle} aria-label="Resolve feedback">
                      <Trash2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminConsole>
  );
}
