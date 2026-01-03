import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface LikesContextType {
  isLiked: (teacherId: string) => boolean;
  toggleLike: (teacherId: string) => Promise<boolean>;
  loading: boolean;
  likedCount: number;
  likedTeacherIds: Set<string>;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

// Cache keys
const getCacheKey = (userId: string) => `likes_${userId}`;
const getTimestampKey = (userId: string) => `likes_${userId}_timestamp`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper functions for localStorage
const getCachedLikes = (userId: string): Set<string> | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(userId));
    const timestamp = localStorage.getItem(getTimestampKey(userId));
    
    if (!cached || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_DURATION) {
      // Cache expired, clear it
      localStorage.removeItem(getCacheKey(userId));
      localStorage.removeItem(getTimestampKey(userId));
      return null;
    }
    
    const likedIds = JSON.parse(cached) as string[];
    return new Set(likedIds);
  } catch (error) {
    console.warn('Error reading likes from cache:', error);
    return null;
  }
};

const setCachedLikes = (userId: string, likedIds: Set<string>) => {
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(Array.from(likedIds)));
    localStorage.setItem(getTimestampKey(userId), Date.now().toString());
  } catch (error) {
    console.warn('Error writing likes to cache:', error);
    // localStorage might be full or disabled, continue without caching
  }
};

const clearCachedLikes = (userId: string) => {
  try {
    localStorage.removeItem(getCacheKey(userId));
    localStorage.removeItem(getTimestampKey(userId));
  } catch (error) {
    console.warn('Error clearing likes cache:', error);
  }
};

export function LikesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [likedTeacherIds, setLikedTeacherIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load likes from cache and/or database
  useEffect(() => {
    if (!user) {
      setLikedTeacherIds(new Set());
      setLoading(false);
      setIsInitialized(false);
      return;
    }

    async function loadLikes(forceRefresh = false) {
      // Try to load from cache first for instant render (unless forcing refresh)
      const cachedLikes = forceRefresh ? null : getCachedLikes(user.id);
      if (cachedLikes) {
        setLikedTeacherIds(cachedLikes);
        setLoading(false);
        setIsInitialized(true);
      }

      // Fetch fresh data from database (stale-while-revalidate)
      try {
        const { data, error } = await supabase
          .from('liked_teachers')
          .select('teacher_id')
          .eq('user_id', user.id);

        if (error) {
          // Log the full error for debugging
          console.error('Error fetching likes:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
          
          // If table doesn't exist (404), just return empty set
          if (error.code === 'PGRST116' || error.message?.includes('does not exist') || error.message?.includes('404')) {
            console.warn('liked_teachers table does not exist or RLS policy issue. Please check your Supabase setup.');
            setLikedTeacherIds(new Set());
            setLoading(false);
            setIsInitialized(true);
            return;
          }
          
          // If it's a permission error, it might be RLS
          if (error.code === '42501' || error.message?.includes('permission denied')) {
            console.error('RLS Policy Error: User may not have permission to read liked_teachers. Check RLS policies in Supabase.');
            setLikedTeacherIds(new Set());
            setLoading(false);
            setIsInitialized(true);
            return;
          }
          
          // If we have cached data, keep using it even on error
          if (cachedLikes) {
            return;
          }
          
          throw error;
        }

        const likedIds = new Set(data?.map((like) => like.teacher_id) || []);
        setLikedTeacherIds(likedIds);
        setCachedLikes(user.id, likedIds); // Update cache with fresh data
      } catch (error) {
        console.error('Error fetching likes:', error);
        // If we don't have cached data, set empty set
        if (!cachedLikes) {
          setLikedTeacherIds(new Set());
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    }

    loadLikes();

    // Refresh on window focus (user returns to tab) - only if cache is stale
    const handleFocus = () => {
      if (user) {
        const cachedLikes = getCachedLikes(user.id);
        if (!cachedLikes) {
          // Cache expired or missing, refresh silently
          loadLikes(true);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Clear cache when user signs out
  useEffect(() => {
    if (!user) {
      setLikedTeacherIds(new Set());
      setLoading(false);
      setIsInitialized(false);
      // Note: We don't clear localStorage here because we want to keep it
      // for when the user signs back in (faster re-login experience)
      // The cache will be validated on next login
    }
  }, [user]);

  const isLiked = useCallback((teacherId: string) => {
    return likedTeacherIds.has(teacherId);
  }, [likedTeacherIds]);

  const toggleLike = useCallback(async (teacherId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to like teachers');
      return false;
    }

    const currentlyLiked = isLiked(teacherId);
    const newLikedState = !currentlyLiked;

    // Optimistic update: Update UI immediately before server call
    setLikedTeacherIds((prev) => {
      const next = new Set(prev);
      if (newLikedState) {
        next.add(teacherId);
      } else {
        next.delete(teacherId);
      }
      // Update cache immediately
      setCachedLikes(user.id, next);
      return next;
    });

    try {
      if (currentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('liked_teachers')
          .delete()
          .eq('user_id', user.id)
          .eq('teacher_id', teacherId);

        if (error) {
          // Revert optimistic update on error
          setLikedTeacherIds((prev) => {
            const next = new Set(prev);
            next.add(teacherId); // Revert to liked state
            setCachedLikes(user.id, next);
            return next;
          });

          // Log the full error for debugging
          console.error('Error toggling like (delete):', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
          
          // If table doesn't exist, show helpful message
          if (error.code === 'PGRST116' || error.message?.includes('does not exist') || error.message?.includes('404')) {
            toast.error('Table not found. Check if liked_teachers table exists in Supabase.');
            return currentlyLiked;
          }
          
          // If it's a permission error, it might be RLS
          if (error.code === '42501' || error.message?.includes('permission denied')) {
            toast.error('Permission denied. Check RLS policies in Supabase.');
            return currentlyLiked;
          }
          
          throw error;
        }

        toast.success('Removed from liked teachers');
        return false;
      } else {
        // Like
        const { error } = await supabase
          .from('liked_teachers')
          .insert({ user_id: user.id, teacher_id: teacherId });

        if (error) {
          // Revert optimistic update on error
          setLikedTeacherIds((prev) => {
            const next = new Set(prev);
            next.delete(teacherId); // Revert to unliked state
            setCachedLikes(user.id, next);
            return next;
          });

          // Log the full error for debugging
          console.error('Error toggling like (insert):', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
          
          // If table doesn't exist, show helpful message
          if (error.code === 'PGRST116' || error.message?.includes('does not exist') || error.message?.includes('404')) {
            toast.error('Table not found. Check if liked_teachers table exists in Supabase.');
            return currentlyLiked;
          }
          
          // If it's a permission error, it might be RLS
          if (error.code === '42501' || error.message?.includes('permission denied')) {
            toast.error('Permission denied. Check RLS policies in Supabase.');
            return currentlyLiked;
          }
          
          throw error;
        }

        toast.success('Added to liked teachers');
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      // Check for 404 or table not found errors
      if (error.code === 'PGRST116' || error.message?.includes('does not exist') || error.message?.includes('404')) {
        toast.error('Database table not found. Please run the migration in Supabase.');
      } else {
        toast.error(error.message || 'Failed to update like');
      }
      return currentlyLiked;
    }
  }, [user, isLiked]);

  return (
    <LikesContext.Provider
      value={{
        isLiked,
        toggleLike,
        loading,
        likedCount: likedTeacherIds.size,
        likedTeacherIds,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
}

