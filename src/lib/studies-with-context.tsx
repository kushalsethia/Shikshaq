import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface StudiesWithContextType {
  isStudyingWith: (teacherId: string) => boolean;
  toggleStudiesWith: (teacherId: string) => Promise<boolean>;
  loading: boolean;
  studiesWithCount: number;
  studiesWithTeacherIds: Set<string>;
}

const StudiesWithContext = createContext<StudiesWithContextType | undefined>(undefined);

// Cache keys
const getCacheKey = (userId: string) => `studies_with_${userId}`;
const getTimestampKey = (userId: string) => `studies_with_${userId}_timestamp`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper functions for localStorage
const getCachedStudiesWith = (userId: string): Set<string> | null => {
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
    
    const teacherIds = JSON.parse(cached) as string[];
    return new Set(teacherIds);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error reading studies-with from cache:', error);
    }
    return null;
  }
};

const setCachedStudiesWith = (userId: string, teacherIds: Set<string>) => {
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(Array.from(teacherIds)));
    localStorage.setItem(getTimestampKey(userId), Date.now().toString());
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error writing studies-with to cache:', error);
    }
  }
};

export function StudiesWithProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [studiesWithTeacherIds, setStudiesWithTeacherIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [studiesWithCount, setStudiesWithCount] = useState(0);

  // Load studies-with relationships
  const loadStudiesWith = useCallback(async () => {
    if (!user) {
      setStudiesWithTeacherIds(new Set());
      setLoading(false);
      return;
    }

    // Try cache first
    const cached = getCachedStudiesWith(user.id);
    if (cached) {
      setStudiesWithTeacherIds(cached);
      setStudiesWithCount(cached.size);
      setLoading(false);
    }

    try {
      const { data, error } = await supabase
        .from('student_teachers')
        .select('teacher_id')
        .eq('student_id', user.id);

      if (error) throw error;

      const teacherIds = new Set(data.map((item) => item.teacher_id));
      setStudiesWithTeacherIds(teacherIds);
      setStudiesWithCount(teacherIds.size);
      setCachedStudiesWith(user.id, teacherIds);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading studies-with:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStudiesWith();
  }, [loadStudiesWith]);

  const isStudyingWith = useCallback(
    (teacherId: string) => {
      return studiesWithTeacherIds.has(teacherId);
    },
    [studiesWithTeacherIds]
  );

  const toggleStudiesWith = useCallback(
    async (teacherId: string): Promise<boolean> => {
      if (!user) {
        toast.error('Please sign in to indicate you study with this teacher');
        return false;
      }

      // Check if user is a student
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'student') {
        toast.error('Only students can indicate they study with a teacher');
        return false;
      }

      const currentlyStudying = isStudyingWith(teacherId);

      try {
        if (currentlyStudying) {
          // Remove relationship
          const { error } = await supabase
            .from('student_teachers')
            .delete()
            .eq('student_id', user.id)
            .eq('teacher_id', teacherId);

          if (error) throw error;

          const newSet = new Set(studiesWithTeacherIds);
          newSet.delete(teacherId);
          setStudiesWithTeacherIds(newSet);
          setStudiesWithCount(newSet.size);
          setCachedStudiesWith(user.id, newSet);
          toast.success('Removed from your teachers');
        } else {
          // Add relationship
          const { error } = await supabase
            .from('student_teachers')
            .insert({
              student_id: user.id,
              teacher_id: teacherId,
            });

          if (error) throw error;

          const newSet = new Set(studiesWithTeacherIds);
          newSet.add(teacherId);
          setStudiesWithTeacherIds(newSet);
          setStudiesWithCount(newSet.size);
          setCachedStudiesWith(user.id, newSet);
          toast.success('Added to your teachers');
        }

        return !currentlyStudying;
      } catch (error: any) {
        if (import.meta.env.DEV) {
          console.error('Error toggling studies-with:', error);
        }
        toast.error(error.message || 'Failed to update. Please try again.');
        return currentlyStudying;
      }
    },
    [user, isStudyingWith, studiesWithTeacherIds]
  );

  return (
    <StudiesWithContext.Provider
      value={{
        isStudyingWith,
        toggleStudiesWith,
        loading,
        studiesWithCount,
        studiesWithTeacherIds,
      }}
    >
      {children}
    </StudiesWithContext.Provider>
  );
}

export function useStudiesWith() {
  const context = useContext(StudiesWithContext);
  if (context === undefined) {
    throw new Error('useStudiesWith must be used within a StudiesWithProvider');
  }
  return context;
}

