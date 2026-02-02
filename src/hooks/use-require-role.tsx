import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to ensure user has selected a role
 * Redirects to /select-role if user is authenticated but has no role
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
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        // If no profile or no role, redirect to select-role
        if (!profile || !profile.role) {
          navigate('/select-role', { replace: true });
        }
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);
}

