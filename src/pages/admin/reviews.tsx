import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  adminFieldStyle,
  adminPanelStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminToast,
  useAdminGuard,
  useReviewerNames,
  AdminGuardErrorState,
} from '@/components/AdminConsole';
import { AdminRail, AdminToolbar, type AdminNavItem } from '@/pages/admin/shell';
import { AdminTable, type AdminTableColumn, type AdminTableRow, type AdminPillTone } from '@/pages/admin/AdminTable';
import { useConfirm } from '@/components/ui/use-confirm';
import { ThumbsUp } from 'lucide-react';

/* Redesign A4 "Reviews & recs" — the single-page merge of the three legacy
   review-adjacent admin routes (AdminComments, AdminRecommendations,
   AdminUpvotes) into one AdminTable, switched by a segmented source control.
   AdminFeedback.tsx (site NPS/star-rating feedback, unrelated to teacher
   reviews — no teacher column, no publish/convert action) is deliberately
   left out; see the report for the reasoning. */

type Source = 'reviews' | 'recommendations' | 'upvotes';

interface Comment {
  id: string;
  teacher_id: string;
  user_id: string;
  comment: string;
  is_anonymous: boolean;
  approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    role: string | null;
    school_college: string | null;
    grade: string | null;
  } | null;
  approver_name: string | null;
  teachers_list: { name: string; slug: string } | null;
}

interface Recommendation {
  id: string;
  user_id: string | null;
  recommender_name: string;
  recommender_contact: string;
  teacher_name: string;
  teacher_contact: string;
  status: 'pending' | 'contacted' | 'onboarded' | 'rejected';
  notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UpvoteStat {
  teacher_id: string;
  teacher_name: string;
  teacher_slug: string;
  upvote_count: number;
}

const REVIEWS_PAGE_SIZE = 50;

export default function AdminReviews() {
  const { confirm, confirmDialog } = useConfirm();
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
  const signedInName = profile?.full_name || user?.email || 'Admin';

  const { isAdmin, checkingAdmin, error: adminGuardError, retry: retryAdminGuard } = useAdminGuard(user, { redirectOnDenied: true });

  const [source, setSource] = useState<Source>('reviews');

  // --- Reviews & comments (from AdminComments.tsx) ---------------------
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsLoadingMore, setCommentsLoadingMore] = useState(false);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const [commentsPage, setCommentsPage] = useState(0);
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  async function fetchComments(append = false) {
    try {
      if (!append) {
        setCommentsLoading(true);
        setCommentsPage(0);
      } else {
        setCommentsLoadingMore(true);
      }

      const from = append ? commentsPage * REVIEWS_PAGE_SIZE : 0;
      const to = from + REVIEWS_PAGE_SIZE - 1;

      let query = supabase
        .from('teacher_comments')
        .select(
          `
          id,
          teacher_id,
          user_id,
          comment,
          is_anonymous,
          approved,
          approved_by,
          approved_at,
          created_at,
          updated_at
        `
        )
        .order('created_at', { ascending: sortOrder === 'oldest' })
        .range(from, to);

      if (commentFilter === 'pending') {
        query = query.eq('approved', false);
      } else if (commentFilter === 'approved') {
        query = query.eq('approved', true);
      }

      const { data, error } = await query;
      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching comments:', error);
        adminToast('Failed to load reviews');
        return;
      }

      const rawComments = data || [];
      setCommentsHasMore(rawComments.length === REVIEWS_PAGE_SIZE);

      if (rawComments.length === 0 && !append) {
        setComments([]);
        return;
      }

      const userIds = [
        ...new Set(
          rawComments.flatMap((c: { user_id: string; approved_by: string | null }) =>
            c.approved_by ? [c.user_id, c.approved_by] : [c.user_id]
          )
        ),
      ];
      const teacherIds = [...new Set(rawComments.map((c: { teacher_id: string }) => c.teacher_id))];

      const [profilesRes, teachersRes] = await Promise.all([
        userIds.length > 0
          ? supabase.from('profiles').select('id, full_name, role, school_college, grade').in('id', userIds)
          : Promise.resolve({ data: [] }),
        teacherIds.length > 0
          ? supabase.from('teachers_list').select('id, name, slug').in('id', teacherIds)
          : Promise.resolve({ data: [] }),
      ]);

      const profilesMap = new Map((profilesRes.data || []).map((p: { id: string }) => [p.id, p]));
      const teachersMap = new Map((teachersRes.data || []).map((t: { id: string }) => [t.id, t]));

      const commentsWithData = rawComments.map((comment: Record<string, unknown>) => {
        const approver = comment.approved_by
          ? (profilesMap.get(comment.approved_by as string) as { full_name?: string | null } | undefined)
          : null;
        return {
          ...comment,
          profiles: profilesMap.get(comment.user_id as string) || null,
          approver_name: approver?.full_name || (comment.approved_by ? 'an admin' : null),
          teachers_list: teachersMap.get(comment.teacher_id as string) || null,
        };
      }) as unknown as Comment[];

      if (append) {
        setComments((prev) => [...prev, ...commentsWithData]);
        setCommentsPage((p) => p + 1);
      } else {
        setComments(commentsWithData);
        setCommentsPage(1);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to load reviews');
    } finally {
      setCommentsLoading(false);
      setCommentsLoadingMore(false);
    }
  }

  useEffect(() => {
    if (isAdmin) fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, commentFilter, sortOrder]);

  const handleApproveComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from('teacher_comments').update({ approved: true }).eq('id', commentId);
      if (error) {
        if (import.meta.env.DEV) console.error('Error approving comment:', error);
        adminToast('Failed to publish review');
        return;
      }
      adminToast('Review published');
      const approvedComment = comments.find((c) => c.id === commentId);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'approve',
          targetType: 'comment',
          targetId: commentId,
          targetLabel: approvedComment?.teachers_list?.name || 'review',
        });
      }
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to publish review');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const ok = await confirm({
      title: 'Delete this review?',
      description: 'It disappears from the teacher’s profile straight away. This cannot be undone.',
      confirmLabel: 'Delete review',
    });
    if (!ok) return;

    try {
      const { error } = await supabase.from('teacher_comments').delete().eq('id', commentId);
      if (error) {
        if (import.meta.env.DEV) console.error('Error deleting comment:', error);
        adminToast('Failed to remove review');
        return;
      }
      adminToast('Review removed');
      const deletedComment = comments.find((c) => c.id === commentId);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'delete',
          targetType: 'comment',
          targetId: commentId,
          targetLabel: deletedComment?.teachers_list?.name || 'review',
        });
      }
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to remove review');
    }
  };

  const getCommentAuthorName = (comment: Comment): string => {
    if (comment.is_anonymous) return 'Anonymous';
    return comment.profiles?.full_name || 'Anonymous';
  };

  const getCommentAuthorInfo = (comment: Comment): string => {
    if (comment.is_anonymous) return '';
    if (comment.profiles?.role === 'guardian') return 'Guardian';
    if (comment.profiles?.role === 'student') {
      const parts: string[] = [];
      if (comment.profiles.school_college) parts.push(comment.profiles.school_college);
      if (comment.profiles.grade) parts.push(`Grade ${comment.profiles.grade}`);
      return parts.join(' • ');
    }
    return '';
  };

  const getCommentInitials = (comment: Comment): string => {
    if (comment.is_anonymous) return 'A';
    if (comment.profiles?.full_name) {
      const names = comment.profiles.full_name.split(' ');
      if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      return names[0][0].toUpperCase();
    }
    return 'U';
  };

  // --- Recommendations (from AdminRecommendations.tsx) ------------------
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  async function fetchRecommendations() {
    try {
      setRecsLoading(true);
      const { data, error } = await supabase
        .from('teacher_recommendations')
        .select('*')
        .order('created_at', { ascending: sortOrder === 'oldest' });

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching recommendations:', error);
        adminToast('Failed to load recommendations');
        return;
      }

      const VALID_STATUSES: Recommendation['status'][] = ['pending', 'contacted', 'onboarded', 'rejected'];
      const normalized: Recommendation[] = (data || []).map((row) => ({
        ...row,
        status: (VALID_STATUSES as string[]).includes(row.status) ? (row.status as Recommendation['status']) : 'pending',
      }));
      setRecommendations(normalized);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to load recommendations');
    } finally {
      setRecsLoading(false);
    }
  }

  const reviewerNames = useReviewerNames(recommendations.map((r) => r.approved_by));

  useEffect(() => {
    if (isAdmin) fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, sortOrder]);

  const handleEditRecommendation = (rec: Recommendation) => {
    setEditingId(rec.id);
    setEditStatus(rec.status);
    setEditNotes(rec.notes || '');
  };

  const handleSaveRecommendation = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('teacher_recommendations')
        .update({ status: editStatus, notes: editNotes, approved_by: user.id, approved_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating recommendation:', error);
        adminToast('Failed to update. You may need to update via Supabase Dashboard.');
        return;
      }

      adminToast('Recommendation updated');
      const editedRec = recommendations.find((r) => r.id === id);
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: 'edit',
        targetType: 'recommendation',
        targetId: id,
        targetLabel: editedRec?.teacher_name || 'recommendation',
      });
      setEditingId(null);
      fetchRecommendations();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to update recommendation');
    }
  };

  const handleQuickStatus = async (id: string, status: Recommendation['status']) => {
    if (!user) return;
    const previous = recommendations.find((r) => r.id === id)?.status;
    try {
      setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

      const { error } = await supabase
        .from('teacher_recommendations')
        .update({ status, approved_by: user.id, approved_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating recommendation:', error);
        if (previous) setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status: previous } : r)));
        adminToast('Failed to update recommendation');
        return;
      }

      adminToast(status === 'contacted' ? 'Marked as contacted' : 'Recommendation dismissed');
      const targetRec = recommendations.find((r) => r.id === id);
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: status === 'contacted' ? 'edit' : 'reject',
        targetType: 'recommendation',
        targetId: id,
        targetLabel: targetRec?.teacher_name || 'recommendation',
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      if (previous) setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status: previous } : r)));
      adminToast('Failed to update recommendation');
    }
  };

  /** Ports AdminRecommendations' "Contact" quick action into A4's "Convert rec →
   *  application" verb: inserts a matching row into teacher_applications (the
   *  intake table Approvals reads from) so the recommendation becomes a real
   *  application to review, then marks the recommendation onboarded. */
  const handleConvertToApplication = async (rec: Recommendation) => {
    if (!user) return;
    try {
      const { error: insertError } = await supabase.from('teacher_applications').insert({
        name: rec.teacher_name,
        phone_number: rec.teacher_contact,
        email: '',
        sir_maam: '',
        subjects: '',
        classes_taught_for_backend: '',
        status: 'pending',
        reference_name: rec.recommender_name,
        reference_number: rec.recommender_contact,
        description: rec.notes || `Recommended by ${rec.recommender_name} (${rec.recommender_contact})`,
      });

      if (insertError) {
        if (import.meta.env.DEV) console.error('Error converting recommendation:', insertError);
        adminToast('Failed to convert recommendation to an application');
        return;
      }

      const { error: updateError } = await supabase
        .from('teacher_recommendations')
        .update({ status: 'onboarded', approved_by: user.id, approved_at: new Date().toISOString() })
        .eq('id', rec.id);

      if (updateError && import.meta.env.DEV) {
        console.error('Error marking recommendation onboarded after conversion:', updateError);
      }

      adminToast('Converted to an application');
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: 'edit',
        targetType: 'recommendation',
        targetId: rec.id,
        targetLabel: rec.teacher_name,
        reason: 'Converted recommendation to teacher application',
      });
      fetchRecommendations();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to convert recommendation to an application');
    }
  };

  const pillTone = (status: Recommendation['status']): AdminPillTone => {
    switch (status) {
      case 'onboarded':
        return 'ok';
      case 'rejected':
        return 'bad';
      case 'contacted':
        return 'info';
      default:
        return 'wait';
    }
  };

  // --- Upvotes (from AdminUpvotes.tsx) -----------------------------------
  const [upvoteStats, setUpvoteStats] = useState<UpvoteStat[]>([]);
  const [upvotesLoading, setUpvotesLoading] = useState(true);

  async function fetchUpvoteStats() {
    try {
      setUpvotesLoading(true);
      const { data, error } = await supabase.from('teacher_upvote_stats').select('*').order('upvote_count', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          const { data: upvotesData, error: upvotesError } = await supabase.from('teacher_upvotes').select('teacher_id');
          if (upvotesError) throw upvotesError;

          const counts = new Map<string, number>();
          upvotesData?.forEach((upvote: any) => {
            counts.set(upvote.teacher_id, (counts.get(upvote.teacher_id) || 0) + 1);
          });

          const teacherIds = Array.from(counts.keys());
          if (teacherIds.length > 0) {
            const { data: teachersData, error: teachersError } = await supabase
              .from('teachers_list')
              .select('id, name, slug')
              .in('id', teacherIds);
            if (teachersError) throw teachersError;

            const stats: UpvoteStat[] =
              teachersData?.map((teacher: any) => ({
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
      if (import.meta.env.DEV) console.error('Error fetching upvote stats:', error);
      adminToast('Failed to load upvote statistics');
    } finally {
      setUpvotesLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) fetchUpvoteStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  /** AdminUpvotes had no per-row mutation at all (its action just opened the
   *  public profile). A4 gives every source a row action, so upvotes get a
   *  real destructive one: clear all upvotes recorded for that teacher. */
  const handleClearUpvotes = async (stat: UpvoteStat) => {
    const ok = await confirm({
      title: `Clear upvotes for ${stat.teacher_name}?`,
      description: `Removes all ${stat.upvote_count} recorded upvote${stat.upvote_count === 1 ? '' : 's'} for this teacher. This cannot be undone.`,
      confirmLabel: 'Clear upvotes',
    });
    if (!ok) return;

    try {
      const { error } = await supabase.from('teacher_upvotes').delete().eq('teacher_id', stat.teacher_id);
      if (error) {
        if (import.meta.env.DEV) console.error('Error clearing upvotes:', error);
        adminToast('Failed to clear upvotes');
        return;
      }
      adminToast('Upvotes cleared');
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'delete',
          targetType: 'upvotes',
          targetId: stat.teacher_id,
          targetLabel: stat.teacher_name,
        });
      }
      fetchUpvoteStats();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      adminToast('Failed to clear upvotes');
    }
  };

  // --- Shared rail/toolbar chrome -----------------------------------------
  const pendingReviewsCount = useMemo(() => comments.filter((c) => !c.approved).length, [comments]);
  const pendingRecsCount = useMemo(() => recommendations.filter((r) => r.status === 'pending').length, [recommendations]);

  const nav: AdminNavItem[] = [
    { key: 'approvals', label: 'Approvals', path: '/admin/approvals', active: false },
    { key: 'teachers', label: 'Live teachers', path: '/admin/teachers', active: false },
    { key: 'papers', label: 'Papers', path: '/admin/papers', active: false },
    {
      key: 'reviews',
      label: 'Reviews',
      path: '/admin/reviews',
      active: true,
      count: pendingReviewsCount + pendingRecsCount || undefined,
    },
    { key: 'audit', label: 'Audit log', path: '/admin/audit', active: false },
  ];

  const sourceTabs: { key: Source; label: string; count: number }[] = [
    { key: 'reviews', label: 'Reviews', count: pendingReviewsCount },
    { key: 'recommendations', label: 'Recommendations', count: pendingRecsCount },
    { key: 'upvotes', label: 'Upvotes', count: upvoteStats.length },
  ];

  const sortSlot = (
    <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
      <SelectTrigger className="h-11 w-[150px] rounded-full border-0 bg-muted text-sm font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
      </SelectContent>
    </Select>
  );

  // --- Row shape (A4 spec): Body excerpt / teacher / author / flagged -----
  const columns: AdminTableColumn[] = [
    { key: 'body', label: 'Body excerpt', width: '2.2fr' },
    { key: 'teacher', label: 'Teacher', width: '1.4fr' },
    { key: 'author', label: 'Author', width: '1.4fr' },
    { key: 'flagged', label: 'Flagged', width: '0.9fr' },
    { key: 'actions', label: '', width: '1.2fr' },
  ];

  const reviewRows: AdminTableRow[] = comments.map((comment): AdminTableRow => {
    const authorName = getCommentAuthorName(comment);
    const authorInfo = getCommentAuthorInfo(comment);
    const teacherName = comment.teachers_list?.name || `Teacher ${comment.teacher_id}`;
    const publishedMeta = comment.approved
      ? `Published ${comment.approved_at ? formatDistanceToNow(new Date(comment.approved_at), { addSuffix: true }) : 'recently'}${comment.approver_name ? ` by ${comment.approver_name}` : ''}`
      : [authorInfo, formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })].filter(Boolean).join(' · ');

    return {
      id: comment.id,
      initial: getCommentInitials(comment),
      title: `"${comment.comment}"`,
      cells: [teacherName, authorName, comment.is_anonymous ? 'Anonymous' : '-'],
      subtitle: publishedMeta,
      tone: comment.approved ? 'ok' : 'wait',
      tag: comment.approved ? 'Published' : 'Pending',
      actionLabel: comment.approved ? 'Remove' : 'Publish',
      onAction: () => (comment.approved ? handleDeleteComment(comment.id) : handleApproveComment(comment.id)),
    };
  });

  const recommendationRows: AdminTableRow[] = recommendations.map((rec): AdminTableRow => {
    const reviewedMeta = rec.approved_at
      ? `Reviewed by ${rec.approved_by ? reviewerNames[rec.approved_by] || 'an admin' : 'an admin'}, ${formatDistanceToNow(new Date(rec.approved_at), { addSuffix: true })}`
      : undefined;

    return {
      id: rec.id,
      initial: rec.teacher_name?.trim().charAt(0).toUpperCase() || '?',
      title: rec.notes || `Recommended: ${rec.teacher_name}`,
      subtitle: reviewedMeta,
      cells: [rec.teacher_name, rec.recommender_name, rec.status === 'rejected' ? 'Flagged' : '-'],
      tone: pillTone(rec.status),
      tag: rec.status.charAt(0).toUpperCase() + rec.status.slice(1),
      actionLabel: 'Convert rec → application',
      onAction: () => handleConvertToApplication(rec),
      onOverflow: () => handleEditRecommendation(rec),
    };
  });

  const upvoteRows: AdminTableRow[] = upvoteStats.map((stat, index): AdminTableRow => ({
    id: stat.teacher_id,
    initial: stat.teacher_name?.trim().charAt(0).toUpperCase() || '?',
    title: stat.teacher_name,
    subtitle: `#${index + 1} by upvote count`,
    cells: [
      stat.teacher_name,
      '-',
      <span key="count" className="inline-flex items-center gap-1 tabular-nums">
        <ThumbsUp className="h-3 w-3" aria-hidden="true" />
        {stat.upvote_count}
      </span>,
    ],
    tone: index === 0 ? 'ok' : 'info',
    tag: `${stat.upvote_count} upvote${stat.upvote_count === 1 ? '' : 's'}`,
    actionLabel: 'Clear upvotes',
    onAction: () => handleClearUpvotes(stat),
    onOverflow: () => window.open(`/tuition-teachers/${stat.teacher_slug}`, '_blank', 'noopener'),
  }));

  const activeRows = source === 'reviews' ? reviewRows : source === 'recommendations' ? recommendationRows : upvoteRows;
  const activeLoading =
    source === 'reviews' ? commentsLoading : source === 'recommendations' ? recsLoading : upvotesLoading;

  const emptyCopy =
    source === 'reviews'
      ? commentFilter === 'pending'
        ? 'No pending reviews to moderate.'
        : commentFilter === 'approved'
        ? 'No published reviews yet.'
        : 'No reviews found.'
      : source === 'recommendations'
      ? 'No recommendations yet.'
      : 'No upvotes yet.';

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-warm-page">
        <div className="container pt-16 pb-16 text-center">
          <div className="animate-pulse text-sm text-warm-label">Checking admin access…</div>
        </div>
      </div>
    );
  }

  if (adminGuardError) return <AdminGuardErrorState onRetry={retryAdminGuard} />;

  if (!isAdmin) return null;

  const editingRec = editingId ? recommendations.find((r) => r.id === editingId) : null;

  return (
    <div className="min-h-screen bg-background">
      <AdminRail nav={nav} signedInName={signedInName} />
      <div className="lg:pl-[244px]">
        <AdminToolbar
          title="Reviews & recs"
          badge={pendingReviewsCount + pendingRecsCount > 0 ? `${pendingReviewsCount + pendingRecsCount} waiting` : undefined}
          sort={sortSlot}
        />

        <main className="px-5 py-6 lg:px-7 lg:py-8">
          {/* Segmented control: which underlying dataset populates the table */}
          <div className="mb-5 flex flex-wrap gap-2">
            {sourceTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSource(tab.key)}
                className={cn(
                  'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors',
                  source === tab.key ? 'bg-foreground text-background' : 'bg-muted text-warm-prose hover:bg-muted/70'
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-[6px] text-[11px] font-bold tabular-nums',
                    source === tab.key ? 'bg-background/20 text-background' : 'bg-background text-warm-label'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {source === 'reviews' && (
            <div className="mb-4 flex flex-wrap gap-2">
              {(['pending', 'approved', 'all'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCommentFilter(key)}
                  className={commentFilter === key ? adminPrimaryBtnStyle : adminSecondaryBtnStyle}
                >
                  {key === 'pending' ? 'Pending' : key === 'approved' ? 'Approved' : 'All'} (
                  {key === 'pending' ? pendingReviewsCount : key === 'approved' ? comments.filter((c) => c.approved).length : comments.length}
                  )
                </button>
              ))}
            </div>
          )}

          {activeLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-muted/60 animate-pulse" />
              ))}
            </div>
          ) : activeRows.length === 0 ? (
            <div className="rounded-[20px] bg-card py-16 text-center shadow-border">
              <p className="text-sm text-warm-label">{emptyCopy}</p>
            </div>
          ) : (
            <AdminTable columns={columns} rows={activeRows} />
          )}

          {source === 'reviews' && commentsHasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchComments(true)}
                disabled={commentsLoadingMore}
                className={`min-w-[140px] disabled:opacity-60 ${adminSecondaryBtnStyle}`}
              >
                {commentsLoadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}

          {source === 'recommendations' && editingRec && (
            <div className={cn(adminPanelStyle, 'mt-4 max-w-[560px] space-y-4 p-5')}>
              <div className="text-sm font-bold text-foreground">Editing recommendation: {editingRec.teacher_name}</div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-warm-label">Status</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className={`h-auto border-0 ${adminFieldStyle}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="onboarded">Onboarded</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-warm-label">Notes</label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes..."
                    rows={3}
                    className={`border-0 ${adminFieldStyle}`}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleSaveRecommendation(editingRec.id)} className={adminPrimaryBtnStyle}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className={adminSecondaryBtnStyle}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      {confirmDialog}
    </div>
  );
}
