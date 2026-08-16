import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, MessageCircle, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { SURFACE_TOKENS, ACCENT_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  AdminTile,
  AdminPill,
  adminRowStyle,
  adminRowListStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
  adminToast,
  useAdminGuard,
} from '@/components/AdminConsole';

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
    avatar_url: string | null;
  } | null;
  approver_name: string | null;
  teachers_list: {
    name: string;
    slug: string;
  } | null;
}

const COMMENTS_PAGE_SIZE = 50;
const TINT = { bg: ACCENT_TOKENS.settledBg, text: ACCENT_TOKENS.settledText }; // #E6F4E6 / #1B5E20 per spec

export default function AdminComments() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(0);

  async function fetchComments(append = false) {
    if (!isAdmin) return;
    try {
      if (!append) {
        setLoading(true);
        setPage(0);
      } else {
        setLoadingMore(true);
      }

      const from = append ? page * COMMENTS_PAGE_SIZE : 0;
      const to = from + COMMENTS_PAGE_SIZE - 1;

      let query = supabase
        .from('teacher_comments')
        .select(`
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
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      // Apply filter
      if (filter === 'pending') {
        query = query.eq('approved', false);
      } else if (filter === 'approved') {
        query = query.eq('approved', true);
      } else if (filter === 'rejected') {
        query = query.eq('approved', false);
      }

      const { data, error } = await query;

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching comments:', error);
        }
        adminToast('Failed to load comments');
        return;
      }

      const rawComments = data || [];
      setHasMore(rawComments.length === COMMENTS_PAGE_SIZE);

      if (rawComments.length === 0 && !append) {
        setComments([]);
        return;
      }

      // Batch fetch: one query for all unique profiles (commenters + approving admins), one for all teachers (avoids N+1)
      const userIds = [...new Set(
        rawComments.flatMap((c: { user_id: string; approved_by: string | null }) =>
          c.approved_by ? [c.user_id, c.approved_by] : [c.user_id]
        )
      )];
      const teacherIds = [...new Set(rawComments.map((c: { teacher_id: string }) => c.teacher_id))];

      const [profilesRes, teachersRes] = await Promise.all([
        userIds.length > 0
          ? supabase
              .from('profiles')
              .select('id, full_name, role, school_college, grade, avatar_url')
              .in('id', userIds)
          : Promise.resolve({ data: [] }),
        teacherIds.length > 0
          ? supabase
              .from('teachers_list')
              .select('id, name, slug')
              .in('id', teacherIds)
          : Promise.resolve({ data: [] }),
      ]);

      const profilesMap = new Map(
        (profilesRes.data || []).map((p: { id: string }) => [p.id, p])
      );
      const teachersMap = new Map(
        (teachersRes.data || []).map((t: { id: string }) => [t.id, t])
      );

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
        setPage((p) => p + 1);
      } else {
        setComments(commentsWithData);
        setPage(1);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to load comments');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const loadMore = () => fetchComments(true);

  const { isAdmin, checkingAdmin } = useAdminGuard(user);

  useEffect(() => {
    if (!isAdmin && !checkingAdmin) setLoading(false);
  }, [isAdmin, checkingAdmin]);

  // Refetch comments when filter changes
  useEffect(() => {
    if (isAdmin) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, isAdmin]);

  const handleApprove = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('teacher_comments')
        .update({ approved: true })
        .eq('id', commentId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error approving comment:', error);
        }
        adminToast('Failed to publish comment');
        return;
      }

      adminToast('Comment published');
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to publish comment');
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('teacher_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error rejecting comment:', error);
        }
        adminToast('Failed to hide comment');
        return;
      }

      adminToast('Comment hidden');
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to hide comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('teacher_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error deleting comment:', error);
        }
        adminToast('Failed to delete comment');
        return;
      }

      adminToast('Comment deleted');
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to delete comment');
    }
  };

  const getCommentAuthorName = (comment: Comment): string => {
    if (comment.is_anonymous) {
      return 'Anonymous';
    }
    if (comment.profiles?.full_name) {
      return comment.profiles.full_name;
    }
    return 'Anonymous';
  };

  const getCommentAuthorInfo = (comment: Comment): string => {
    if (comment.is_anonymous) {
      return '';
    }
    if (comment.profiles?.role === 'guardian') {
      return 'Guardian';
    }
    if (comment.profiles?.role === 'student') {
      const parts: string[] = [];
      if (comment.profiles.school_college) {
        parts.push(comment.profiles.school_college);
      }
      if (comment.profiles.grade) {
        parts.push(`Grade ${comment.profiles.grade}`);
      }
      return parts.join(' • ');
    }
    return '';
  };

  const getCommentAvatar = (comment: Comment): string | null => {
    if (comment.is_anonymous) {
      return null;
    }
    return comment.profiles?.avatar_url || null;
  };

  const getCommentInitials = (comment: Comment): string => {
    if (comment.is_anonymous) {
      return 'A';
    }
    if (comment.profiles?.full_name) {
      const names = comment.profiles.full_name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'U';
  };

  // Show loading state while checking admin status
  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <div className="container pt-6 sm:pt-8 pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: SURFACE_TOKENS.mutedFill }} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl" style={{ background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main className="container pt-6 sm:pt-8 pb-16 md:pt-16">
          <div className="max-w-md mx-auto">
            <div className="p-8 text-center" style={{ background: SURFACE_TOKENS.field, borderRadius: 24, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: SURFACE_TOKENS.textTertiary }} />
              <h1 className="mb-2" style={{ fontSize: 'clamp(20px,2.6vw,26px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>
                Sign In Required
              </h1>
              <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
                You need to sign in to access the admin panel.
              </p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-sm transition-colors"
                  style={{ color: SURFACE_TOKENS.textSecondary }}
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show access denied if user is not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main className="container pt-6 sm:pt-8 pb-8 md:pt-8">
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
        </main>
        <Footer />
      </div>
    );
  }

  const pendingCount = comments.filter(c => !c.approved).length;
  const approvedCount = comments.filter(c => c.approved).length;

  const filterTabs: { key: typeof filter; label: string; count: number }[] = [
    { key: 'pending', label: 'Pending', count: pendingCount },
    { key: 'approved', label: 'Approved', count: approvedCount },
    { key: 'all', label: 'All', count: comments.length },
  ];

  return (
    <AdminConsole
      activeTab="comments"
      title="Reviews and comments"
      subtitle="Published student reviews, newest first."
      tint={TINT}
      tabCount={pendingCount}
    >
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={filter === tab.key ? adminPrimaryBtnStyle : adminSecondaryBtnStyle}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-16" style={{ background: SURFACE_TOKENS.field, borderRadius: 16, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
          <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: SURFACE_TOKENS.textTertiary, opacity: 0.6 }} />
          <p style={{ color: SURFACE_TOKENS.textSecondary }}>
            {filter === 'pending'
              ? 'No pending comments to review.'
              : filter === 'approved'
              ? 'No approved comments yet.'
              : 'No comments found.'}
          </p>
        </div>
      ) : (
        <>
        <div style={adminRowListStyle}>
          {comments.map((comment) => {
            const avatarUrl = getCommentAvatar(comment);
            const initials = getCommentInitials(comment);
            const authorName = getCommentAuthorName(comment);
            const authorInfo = getCommentAuthorInfo(comment);

            return (
              <div key={comment.id} style={{ ...adminRowStyle, alignItems: 'flex-start' }}>
                {avatarUrl ? (
                  <Avatar className="w-[42px] h-[42px] flex-shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ) : (
                  <AdminTile tint={TINT}>{initials}</AdminTile>
                )}

                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>
                      {authorName}
                    </span>
                    <AdminPill tone={comment.approved ? 'settled' : 'pending'}>
                      {comment.approved ? 'Published' : 'Pending'}
                    </AdminPill>
                  </div>
                  <p style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5, color: SURFACE_TOKENS.textTertiary }}>
                    {[authorInfo, comment.teachers_list?.name || `Teacher ${comment.teacher_id}`, formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <p className="whitespace-pre-wrap break-words" style={{ marginTop: 10, color: SURFACE_TOKENS.textPrimary, fontSize: 14.5, lineHeight: 1.55 }}>
                    {comment.comment}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 12 }}>
                    {!comment.approved ? (
                      <>
                        <button onClick={() => handleApprove(comment.id)} style={adminPrimaryBtnStyle}>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Publish
                        </button>
                        <button onClick={() => handleReject(comment.id)} style={adminDestructiveBtnStyle}>
                          Hide
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs" style={{ color: SURFACE_TOKENS.textTertiary }}>
                          Published {comment.approved_at
                            ? formatDistanceToNow(new Date(comment.approved_at), { addSuffix: true })
                            : 'recently'}
                          {comment.approver_name && <> by {comment.approver_name}</>}
                        </span>
                        <button onClick={() => handleDelete(comment.id)} style={adminDestructiveBtnStyle}>
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="min-w-[140px] disabled:opacity-60"
              style={adminSecondaryBtnStyle}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </>
      )}
    </AdminConsole>
  );
}
