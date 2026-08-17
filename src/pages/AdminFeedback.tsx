import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { Footer } from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';
import { SURFACE_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  AdminStatTiles,
  adminSecondaryBtnStyle,
  adminToast,
} from '@/components/AdminConsole';
import { AdminTable, type AdminTableColumn, type AdminTableRow, type AdminPillTone } from '@/pages/admin/AdminTable';

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

const ratingTone = (rating: number): AdminPillTone => {
  if (rating >= 4) return 'ok';
  if (rating === 3) return 'idle';
  return 'bad';
};

export default function AdminFeedback() {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
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
      const resolvedFeedback = feedback.find((f) => f.id === feedbackId);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'resolve',
          targetType: 'feedback',
          targetId: feedbackId,
          targetLabel: resolvedFeedback?.profiles?.full_name || resolvedFeedback?.guest_email || 'feedback',
        });
      }
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

  // AdminTable pattern (admin-01-teacher-approvals.png chrome): first column is
  // author identity, middle cells are plain text, the state pill carries the
  // rating, and the row action resolves the entry — the same shape as Applications.
  const feedbackColumns: AdminTableColumn[] = [
    { key: 'author', label: 'From', width: '2.2fr' },
    { key: 'type', label: 'Type', width: '1fr' },
    { key: 'comment', label: 'Comment', width: '2.4fr' },
    { key: 'received', label: 'Received', width: '1.1fr' },
    { key: 'actions', label: '', width: '140px' },
  ];

  const feedbackRows: AdminTableRow[] = feedback.map((item) => {
    const name = getFeedbackAuthorName(item);
    const email = getFeedbackAuthorEmail(item);
    return {
      id: item.id,
      initial: name.charAt(0).toUpperCase(),
      title: name,
      subtitle: email || undefined,
      cells: [
        item.is_guest ? 'Guest' : 'Logged in',
        item.comment || '—',
        formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
      ],
      tone: ratingTone(item.rating),
      tag: `${ratingEmojis[item.rating]} ${ratingLabels[item.rating]}`,
      actionLabel: 'Resolve',
      onAction: () => handleDelete(item.id),
      onOverflow: email ? () => { window.location.href = `mailto:${email}`; } : undefined,
    };
  });

  return (
    <AdminConsole
      activeTab="feedback"
      title="Site feedback"
      subtitle="What students and parents write in from the help page."
      tint={{ bg: SURFACE_TOKENS.mutedFill, text: SURFACE_TOKENS.textBody }}
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
        <AdminTable columns={feedbackColumns} rows={feedbackRows} />
      )}
    </AdminConsole>
  );
}
