import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_anonymous: boolean;
  approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  profiles: {
    full_name: string | null;
    role: string | null;
    school_college: string | null;
    grade: string | null;
    avatar_url: string | null;
  } | null;
}

interface TeacherCommentsProps {
  teacherId: string;
}

export function TeacherComments({ teacherId }: TeacherCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<{
    full_name: string | null;
    role: string | null;
    school_college: string | null;
    grade: string | null;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    fetchComments();
    if (user) {
      fetchCurrentUserProfile();
    }
  }, [teacherId, user]);

  async function fetchCurrentUserProfile() {
    if (!user) return;
    
    try {
      // Get name and avatar directly from Google auth metadata (same as Navbar)
      // This ensures we always have the latest data from Google OAuth
      const googleName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      const googleAvatar = user.user_metadata?.avatar_url || null;
      
      // Fetch profile data (school/college, grade, role) from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('role, school_college, grade')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      
      setCurrentUserProfile({
        full_name: googleName,
        role: data?.role || null,
        school_college: data?.school_college || null,
        grade: data?.grade || null,
        avatar_url: googleAvatar, // Always use Google auth metadata for current user
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }

  async function fetchComments() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch approved comments, or pending comments if they're the current user's
      // The RLS policies will handle filtering:
      // - Public can see approved comments
      // - Users can see their own pending comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('teacher_comments')
        .select('id, comment, created_at, updated_at, user_id, is_anonymous, approved, approved_by, approved_at')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Comments fetch error:', commentsError);
        throw commentsError;
      }

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      // Add default values for comments without approval columns (backwards compatibility)
      const commentsWithDefaults = commentsData.map(comment => ({
        ...comment,
        approved: (comment as any).approved ?? true, // Default to true for old comments
        approved_by: (comment as any).approved_by ?? null,
        approved_at: (comment as any).approved_at ?? null,
      }));

      // Filter: Only show approved comments, or pending comments if they belong to current user
      const filteredComments = commentsWithDefaults.filter(comment => 
        comment.approved || (user && comment.user_id === user.id)
      );

      // Fetch all user profiles in one query
      const userIds = [...new Set(filteredComments.map(c => c.user_id))];
      if (userIds.length === 0) {
        setComments([]);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role, school_college, grade, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Profiles fetch error:', profilesError);
        // Continue without profiles if there's an error
      }

      // Create a map for quick lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Combine comments with profiles
      const commentsWithProfiles = filteredComments.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null,
      }));

      setComments(commentsWithProfiles);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from('teacher_comments')
        .insert({
          teacher_id: teacherId,
          user_id: user.id,
          comment: newComment.trim(),
          is_anonymous: isAnonymous,
          approved: false, // New comments are always pending approval
        });

      if (error) throw error;

      setNewComment('');
      setIsAnonymous(false);
      toast.success('Your comment has been submitted and is pending approval');
      await fetchComments(); // Refresh comments
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      setError(err.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  }

  function getCommentAuthorName(comment: Comment): string {
    // If comment is anonymous, show Anonymous
    if (comment.is_anonymous) {
      return 'Anonymous';
    }

    if (comment.profiles?.role === 'guardian') {
      return 'Guardian';
    }
    
    if (comment.profiles?.full_name) {
      return comment.profiles.full_name;
    }
    
    return 'Anonymous';
  }

  function getCommentAuthorInfo(comment: Comment): string {
    // If anonymous, don't show info
    if (comment.is_anonymous) {
      return '';
    }

    if (comment.profiles?.role === 'guardian') {
      return '';
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
  }

  function getCommentAvatar(comment: Comment): string | null {
    // If anonymous, don't show avatar
    if (comment.is_anonymous) {
      return null;
    }
    return comment.profiles?.avatar_url || null;
  }

  function getCommentInitials(comment: Comment): string {
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
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-foreground" />
        <h2 className="text-2xl font-serif text-foreground">Comments</h2>
        <span className="text-muted-foreground">({comments.length})</span>
      </div>

      {/* Comment Form - Only for authenticated users */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-4">
            {/* Preview of how comment will appear */}
            {currentUserProfile && (
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  {isAnonymous ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Anonymous</h4>
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentUserProfile.avatar_url || undefined} alt={currentUserProfile.full_name || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {currentUserProfile.full_name
                            ? currentUserProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            : user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {currentUserProfile.full_name || user?.email?.split('@')[0] || 'User'}
                        </h4>
                        {currentUserProfile.role === 'student' && (
                          <p className="text-sm text-muted-foreground">
                            {[
                              currentUserProfile.school_college,
                              currentUserProfile.grade && `Grade ${currentUserProfile.grade}`
                            ].filter(Boolean).join(' • ') || 'Student'}
                          </p>
                        )}
                        {currentUserProfile.role === 'guardian' && (
                          <p className="text-sm text-muted-foreground">Guardian</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this teacher..."
              className="min-h-[100px] resize-none"
              disabled={submitting}
            />
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                disabled={submitting}
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Post as anonymous
              </label>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground">
            <Button
              variant="link"
              className="p-0 h-auto text-foreground underline"
              onClick={() => window.location.href = '/auth'}
            >
              Sign in
            </Button>
            {' '}to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const avatarUrl = getCommentAvatar(comment);
            const initials = getCommentInitials(comment);
            
            return (
              <div key={comment.id} className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {avatarUrl ? (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">
                          {getCommentAuthorName(comment)}
                        </h4>
                        {!comment.approved && user && comment.user_id === user.id && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                            <Clock className="w-3 h-3" />
                            Pending Approval
                          </span>
                        )}
                      </div>
                      {getCommentAuthorInfo(comment) && (
                        <p className="text-sm text-muted-foreground">
                          {getCommentAuthorInfo(comment)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap break-words">
                    {comment.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
