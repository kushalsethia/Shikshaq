import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock, Lock, User as UserIcon, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

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
  teachers_list: {
    name: string;
    slug: string;
  } | null;
}

export default function AdminComments() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  async function fetchComments() {
    try {
      setLoading(true);
      
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
        .order('created_at', { ascending: false });

      // Apply filter
      if (filter === 'pending') {
        query = query.eq('approved', false);
      } else if (filter === 'approved') {
        query = query.eq('approved', true);
      } else if (filter === 'rejected') {
        // For now, we'll use approved=false as rejected
        // You can add a separate 'rejected' status column later if needed
        query = query.eq('approved', false);
      }

      const { data, error } = await query;

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching comments:', error);
        }
        toast.error('Failed to load comments');
        return;
      }

      // Fetch profiles and teachers separately
      const commentsWithData = await Promise.all(
        (data || []).map(async (comment) => {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, role, school_college, grade, avatar_url')
            .eq('id', comment.user_id)
            .maybeSingle();

          // Fetch teacher
          const { data: teacherData } = await supabase
            .from('teachers_list')
            .select('name, slug')
            .eq('id', comment.teacher_id)
            .maybeSingle();

          return {
            ...comment,
            profiles: profileData || null,
            teachers_list: teacherData || null,
          };
        })
      );

      setComments(commentsWithData);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Failed to load comments');
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
          fetchComments();
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
        toast.error('Failed to approve comment');
        return;
      }

      toast.success('Comment approved successfully');
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Failed to approve comment');
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      // For now, we'll delete rejected comments
      // You can change this to set a 'rejected' status if you add that column
      const { error } = await supabase
        .from('teacher_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error rejecting comment:', error);
        }
        toast.error('Failed to reject comment');
        return;
      }

      toast.success('Comment rejected and deleted');
      fetchComments();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Failed to reject comment');
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg" />
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-serif text-foreground mb-2">
                Sign In Required
              </h1>
              <p className="text-muted-foreground mb-6">
                You need to sign in to access the admin panel.
              </p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-serif text-foreground mb-2">
                Access Denied
              </h1>
              <p className="text-muted-foreground mb-6">
                You don't have admin privileges to access this page.
              </p>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingCount = comments.filter(c => !c.approved).length;
  const approvedCount = comments.filter(c => c.approved).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Comment Moderation
          </h1>
          <p className="text-muted-foreground">
            Review and approve comments submitted by users.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === 'approved'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              filter === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({comments.length})
          </button>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filter === 'pending' 
                ? 'No pending comments to review.' 
                : filter === 'approved'
                ? 'No approved comments yet.'
                : 'No comments found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const avatarUrl = getCommentAvatar(comment);
              const initials = getCommentInitials(comment);
              const authorName = getCommentAuthorName(comment);
              const authorInfo = getCommentAuthorInfo(comment);
              
              return (
                <div
                  key={comment.id}
                  className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {avatarUrl ? (
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">
                              {authorName}
                            </h4>
                            {!comment.approved && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                            {comment.approved && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                                <CheckCircle className="w-3 h-3" />
                                Approved
                              </span>
                            )}
                          </div>
                          {authorInfo && (
                            <p className="text-sm text-muted-foreground mb-1">
                              {authorInfo}
                            </p>
                          )}
                          <Link
                            to={`/tuition-teachers/${comment.teachers_list?.slug || comment.teacher_id}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {comment.teachers_list?.name || `Teacher ${comment.teacher_id}`}
                          </Link>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-foreground whitespace-pre-wrap break-words mb-4">
                        {comment.comment}
                      </p>

                      {/* Action Buttons */}
                      {!comment.approved ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(comment.id)}
                            className="gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(comment.id)}
                            className="gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Approved {comment.approved_at 
                            ? formatDistanceToNow(new Date(comment.approved_at), { addSuffix: true })
                            : 'recently'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

