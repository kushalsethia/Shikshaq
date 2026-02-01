import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, User as UserIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

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
        toast.error('Failed to load feedback');
        return;
      }

      // Fetch profiles for logged-in users
      const feedbackWithData = await Promise.all(
        (data || []).map(async (item) => {
          let profileData = null;
          if (item.user_id && !item.is_guest) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, full_name, email, avatar_url')
              .eq('id', item.user_id)
              .maybeSingle();
            profileData = profile;
          }

          return {
            ...item,
            profiles: profileData,
          };
        })
      );

      setFeedback(feedbackWithData);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Failed to load feedback');
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
          fetchFeedback();
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
        toast.error('Failed to delete feedback');
        return;
      }

      toast.success('Feedback deleted successfully');
      fetchFeedback();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Failed to delete feedback');
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-serif text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">
              Feedback Management
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage user feedback submissions
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 border-b border-border">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({feedback.length})
            </button>
            <button
              onClick={() => setFilter('guest')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'guest'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Guest ({feedback.filter(f => f.is_guest).length})
            </button>
            <button
              onClick={() => setFilter('logged-in')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'logged-in'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Logged In ({feedback.filter(f => !f.is_guest).length})
            </button>
          </div>

          {/* Feedback List */}
          {feedback.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No feedback found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        {getFeedbackAvatar(item) ? (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={getFeedbackAvatar(item) || ''} />
                            <AvatarFallback>
                              {item.is_guest ? (
                                <UserIcon className="w-5 h-5" />
                              ) : (
                                getFeedbackAuthorName(item)
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {item.is_guest ? (
                              <UserIcon className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <span className="text-sm font-medium">
                                {getFeedbackAuthorName(item).charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {getFeedbackAuthorName(item)}
                            </p>
                            {item.is_guest && (
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                Guest
                              </span>
                            )}
                          </div>
                          {getFeedbackAuthorEmail(item) && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Mail className="w-3 h-3" />
                              <span>{getFeedbackAuthorEmail(item)}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{ratingEmojis[item.rating]}</span>
                            <span className="font-medium text-foreground">
                              {ratingLabels[item.rating]}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      {/* Comment */}
                      {item.comment && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {item.comment}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

