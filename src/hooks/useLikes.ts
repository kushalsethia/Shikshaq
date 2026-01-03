import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export function useLikes() {
  const { user } = useAuth();
  const [likedTeacherIds, setLikedTeacherIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load user's liked teachers
  useEffect(() => {
    if (!user) {
      setLikedTeacherIds(new Set());
      setLoading(false);
      return;
    }

    async function fetchLikes() {
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
            return;
          }
          
          // If it's a permission error, it might be RLS
          if (error.code === '42501' || error.message?.includes('permission denied')) {
            console.error('RLS Policy Error: User may not have permission to read liked_teachers. Check RLS policies in Supabase.');
            setLikedTeacherIds(new Set());
            setLoading(false);
            return;
          }
          
          throw error;
        }

        const likedIds = new Set(data?.map((like) => like.teacher_id) || []);
        setLikedTeacherIds(likedIds);
      } catch (error) {
        console.error('Error fetching likes:', error);
        // Set empty set on error to prevent crashes
        setLikedTeacherIds(new Set());
      } finally {
        setLoading(false);
      }
    }

    fetchLikes();
  }, [user]);

  const isLiked = (teacherId: string) => {
    return likedTeacherIds.has(teacherId);
  };

  const toggleLike = async (teacherId: string) => {
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
  };

  return {
    isLiked,
    toggleLike,
    loading,
    likedCount: likedTeacherIds.size,
    likedTeacherIds, // Export for pages that need the full set
  };
}

