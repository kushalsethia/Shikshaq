import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface UpvotesContextType {
  isUpvoted: (teacherId: string) => boolean;
  toggleUpvote: (teacherId: string) => Promise<boolean>;
  getUpvoteCount: (teacherId: string) => number;
  loading: boolean;
  upvotedCount: number;
  upvotedTeacherIds: Set<string>;
  upvoteCounts: Map<string, number>; // teacherId -> count
}

const UpvotesContext = createContext<UpvotesContextType | undefined>(undefined);

// Cache keys
const getCacheKey = (userId: string) => `upvotes_${userId}`;
const getTimestampKey = (userId: string) => `upvotes_${userId}_timestamp`;
const getCountsCacheKey = () => `upvote_counts`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper functions for localStorage
const getCachedUpvotes = (userId: string): Set<string> | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(userId));
    const timestamp = localStorage.getItem(getTimestampKey(userId));
    
    if (!cached || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(userId));
      localStorage.removeItem(getTimestampKey(userId));
      return null;
    }
    
    const upvotedIds = JSON.parse(cached) as string[];
    return new Set(upvotedIds);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error reading upvotes from cache:', error);
    }
    return null;
  }
};

const setCachedUpvotes = (userId: string, upvotedIds: Set<string>) => {
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(Array.from(upvotedIds)));
    localStorage.setItem(getTimestampKey(userId), Date.now().toString());
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error writing upvotes to cache:', error);
    }
  }
};

const getCachedCounts = (): Map<string, number> | null => {
  try {
    const cached = localStorage.getItem(getCountsCacheKey());
    const timestamp = localStorage.getItem(`${getCountsCacheKey()}_timestamp`);
    
    if (!cached || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_DURATION) {
      localStorage.removeItem(getCountsCacheKey());
      localStorage.removeItem(`${getCountsCacheKey()}_timestamp`);
      return null;
    }
    
    const counts = JSON.parse(cached) as Record<string, number>;
    return new Map(Object.entries(counts));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error reading upvote counts from cache:', error);
    }
    return null;
  }
};

const setCachedCounts = (counts: Map<string, number>) => {
  try {
    const countsObj = Object.fromEntries(counts);
    localStorage.setItem(getCountsCacheKey(), JSON.stringify(countsObj));
    localStorage.setItem(`${getCountsCacheKey()}_timestamp`, Date.now().toString());
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error writing upvote counts to cache:', error);
    }
  }
};

export function UpvotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [upvotedTeacherIds, setUpvotedTeacherIds] = useState<Set<string>>(new Set());
  const [upvoteCounts, setUpvoteCounts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  // Load upvotes from cache and/or database
  useEffect(() => {
    if (!user) {
      setUpvotedTeacherIds(new Set());
      setLoading(false);
      return;
    }

    async function loadUpvotes(forceRefresh = false) {
      const cachedUpvotes = forceRefresh ? null : getCachedUpvotes(user.id);
      if (cachedUpvotes) {
        setUpvotedTeacherIds(cachedUpvotes);
        setLoading(false);
      }

      try {
        const { data, error } = await supabase
          .from('teacher_upvotes')
          .select('teacher_id')
          .eq('user_id', user.id);

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error fetching upvotes:', error);
          }
          if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
            setUpvotedTeacherIds(new Set());
            setLoading(false);
            return;
          }
          if (cachedUpvotes) return;
          throw error;
        }

        const upvotedIds = new Set(data?.map((upvote) => upvote.teacher_id) || []);
        setUpvotedTeacherIds(upvotedIds);
        setCachedUpvotes(user.id, upvotedIds);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching upvotes:', error);
        }
        if (!cachedUpvotes) {
          setUpvotedTeacherIds(new Set());
        }
      } finally {
        setLoading(false);
      }
    }

    loadUpvotes();

    const handleFocus = () => {
      if (user) {
        const cachedUpvotes = getCachedUpvotes(user.id);
        if (!cachedUpvotes) {
          loadUpvotes(true);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Load upvote counts for all teachers (public data)
  useEffect(() => {
    async function loadUpvoteCounts() {
      const cachedCounts = getCachedCounts();
      if (cachedCounts) {
        setUpvoteCounts(cachedCounts);
      }

      try {
        const { data, error } = await supabase
          .from('teacher_upvotes')
          .select('teacher_id');

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error fetching upvote counts:', error);
          }
          if (cachedCounts) return;
          return;
        }

        // Count upvotes per teacher
        const counts = new Map<string, number>();
        data?.forEach((upvote) => {
          const current = counts.get(upvote.teacher_id) || 0;
          counts.set(upvote.teacher_id, current + 1);
        });

        setUpvoteCounts(counts);
        setCachedCounts(counts);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching upvote counts:', error);
        }
      }
    }

    loadUpvoteCounts();
  }, []);

  const isUpvoted = useCallback((teacherId: string) => {
    return upvotedTeacherIds.has(teacherId);
  }, [upvotedTeacherIds]);

  const getUpvoteCount = useCallback((teacherId: string) => {
    return upvoteCounts.get(teacherId) || 0;
  }, [upvoteCounts]);

  const toggleUpvote = useCallback(async (teacherId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to upvote teachers');
      return false;
    }

    const currentlyUpvoted = isUpvoted(teacherId);
    const newUpvotedState = !currentlyUpvoted;

    // Optimistic update
    setUpvotedTeacherIds((prev) => {
      const next = new Set(prev);
      if (newUpvotedState) {
        next.add(teacherId);
      } else {
        next.delete(teacherId);
      }
      if (user) {
        setCachedUpvotes(user.id, next);
      }
      return next;
    });

    // Update count optimistically
    setUpvoteCounts((prev) => {
      const next = new Map(prev);
      const currentCount = next.get(teacherId) || 0;
      if (newUpvotedState) {
        next.set(teacherId, currentCount + 1);
      } else {
        next.set(teacherId, Math.max(0, currentCount - 1));
      }
      setCachedCounts(next);
      return next;
    });

    try {
      if (currentlyUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('teacher_upvotes')
          .delete()
          .eq('user_id', user.id)
          .eq('teacher_id', teacherId);

        if (error) {
          // Revert optimistic update
          setUpvotedTeacherIds((prev) => {
            const next = new Set(prev);
            next.add(teacherId);
            if (user) {
              setCachedUpvotes(user.id, next);
            }
            return next;
          });
          setUpvoteCounts((prev) => {
            const next = new Map(prev);
            const currentCount = next.get(teacherId) || 0;
            next.set(teacherId, currentCount + 1);
            setCachedCounts(next);
            return next;
          });
          throw error;
        }

        toast.success('Upvote removed');
        return false;
      } else {
        // Add upvote
        const { error } = await supabase
          .from('teacher_upvotes')
          .insert({ user_id: user.id, teacher_id: teacherId });

        if (error) {
          // Revert optimistic update
          setUpvotedTeacherIds((prev) => {
            const next = new Set(prev);
            next.delete(teacherId);
            if (user) {
              setCachedUpvotes(user.id, next);
            }
            return next;
          });
          setUpvoteCounts((prev) => {
            const next = new Map(prev);
            const currentCount = next.get(teacherId) || 0;
            next.set(teacherId, Math.max(0, currentCount - 1));
            setCachedCounts(next);
            return next;
          });

          if (error.code === '23505') { // Unique constraint violation
            toast.error('You have already upvoted this teacher');
          } else {
            throw error;
          }
          return currentlyUpvoted;
        }

        toast.success('Teacher upvoted!');
        return true;
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error toggling upvote:', error);
      }
      toast.error(error.message || 'Failed to update upvote');
      return currentlyUpvoted;
    }
  }, [user, isUpvoted]);

  return (
    <UpvotesContext.Provider
      value={{
        isUpvoted,
        toggleUpvote,
        getUpvoteCount,
        loading,
        upvotedCount: upvotedTeacherIds.size,
        upvotedTeacherIds,
        upvoteCounts,
      }}
    >
      {children}
    </UpvotesContext.Provider>
  );
}

export function useUpvotes() {
  const context = useContext(UpvotesContext);
  if (context === undefined) {
    throw new Error('useUpvotes must be used within an UpvotesProvider');
  }
  return context;
}

