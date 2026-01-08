import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_anonymous: boolean;
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
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, school_college, grade, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCurrentUserProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }

  async function fetchComments() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch comments with is_anonymous (handle case where column might not exist)
      const { data: commentsData, error: commentsError } = await supabase
        .from('teacher_comments')
        .select('id, comment, created_at, updated_at, user_id, is_anonymous')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Comments fetch error:', commentsError);
        // If is_anonymous column doesn't exist, try without it
        if (commentsError.message?.includes('is_anonymous') || commentsError.code === '42703') {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('teacher_comments')
            .select('id, comment, created_at, updated_at, user_id')
            .eq('teacher_id', teacherId)
            .order('created_at', { ascending: false });
          
          if (fallbackError) throw fallbackError;
          
          // Add default is_anonymous = false for old comments
          const commentsWithDefault = (fallbackData || []).map(comment => ({
            ...comment,
            is_anonymous: false,
          }));
          
          if (!commentsWithDefault || commentsWithDefault.length === 0) {
            setComments([]);
            return;
          }

          // Fetch profiles
          const userIds = [...new Set(commentsWithDefault.map(c => c.user_id))];
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, role, school_college, grade, avatar_url')
            .in('id', userIds);

          if (profilesError) throw profilesError;

          const profilesMap = new Map(
            (profilesData || []).map(profile => [profile.id, profile])
          );

          const commentsWithProfiles = commentsWithDefault.map(comment => ({
            ...comment,
            profiles: profilesMap.get(comment.user_id) || null,
          }));

          setComments(commentsWithProfiles);
          return;
        }
        throw commentsError;
      }

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      // Fetch all user profiles in one query
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role, school_college, grade, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map for quick lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Combine comments with profiles
      const commentsWithProfiles = commentsData.map(comment => ({
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
        });

      if (error) throw error;

      setNewComment('');
      setIsAnonymous(false);
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
                        <AvatarImage src={currentUserProfile.avatar_url || undefined} />
                        <AvatarFallback>
                          {currentUserProfile.full_name
                            ? currentUserProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {currentUserProfile.full_name || 'User'}
                        </h4>
                        {currentUserProfile.role === 'student' && (
                          <p className="text-sm text-muted-foreground">
                            {[
                              currentUserProfile.school_college,
                              currentUserProfile.grade && `Grade ${currentUserProfile.grade}`
                            ].filter(Boolean).join(' • ')}
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
                    <div>
                      <h4 className="font-medium text-foreground">
                        {getCommentAuthorName(comment)}
                      </h4>
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
