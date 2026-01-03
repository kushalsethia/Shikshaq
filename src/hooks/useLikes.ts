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

        if (error) throw error;

        const likedIds = new Set(data?.map((like) => like.teacher_id) || []);
        setLikedTeacherIds(likedIds);
      } catch (error) {
        console.error('Error fetching likes:', error);
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

    try {
      if (currentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('liked_teachers')
          .delete()
          .eq('user_id', user.id)
          .eq('teacher_id', teacherId);

        if (error) throw error;

        setLikedTeacherIds((prev) => {
          const next = new Set(prev);
          next.delete(teacherId);
          return next;
        });
        toast.success('Removed from liked teachers');
        return false;
      } else {
        // Like
        const { error } = await supabase
          .from('liked_teachers')
          .insert({ user_id: user.id, teacher_id: teacherId });

        if (error) throw error;

        setLikedTeacherIds((prev) => new Set(prev).add(teacherId));
        toast.success('Added to liked teachers');
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error(error.message || 'Failed to update like');
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

