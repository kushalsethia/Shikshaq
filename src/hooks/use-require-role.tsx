import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to ensure user has selected a role and agreed to terms
 * Redirects to /select-role if user is authenticated but has no role
 * Redirects to /teacher-terms-agreement if user is a teacher but hasn't agreed to terms
 */
export function useRequireRole() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;
      
      // Only check if user is authenticated
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, terms_agreement')
          .eq('id', user.id)
          .maybeSingle();

        // If no profile or no role, redirect to select-role
        if (!profile || !profile.role) {
          navigate('/select-role', { replace: true });
          return;
        }

        // If user is a teacher but hasn't agreed to terms, redirect to teacher terms agreement
        if (profile.role === 'teacher' && profile.terms_agreement !== true) {
          navigate('/teacher-terms-agreement', { replace: true });
          return;
        }
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);
}

