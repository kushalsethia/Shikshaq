import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role: 'student' | 'guardian') => Promise<{ error: Error | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle OAuth callback - check for hash fragment first
    const handleOAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('access_token') || hashParams.get('error')) {
        try {
          // Supabase will automatically process the hash and set the session
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session from OAuth callback:', error);
            setLoading(false);
            return;
          }
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (error) {
          console.error('Error processing OAuth callback:', error);
          setLoading(false);
        }
      }
    };

    // Process OAuth callback if hash is present
    handleOAuthCallback();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clean up URL hash after successful auth
        if (event === 'SIGNED_IN' && window.location.hash) {
          setTimeout(() => {
            if (window.location.hash) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }, 100);
        }
      }
    );

    // Get initial session (fallback if no hash)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
        scopes: 'openid email profile', // Explicitly request only required scopes for Google OAuth compliance
        queryParams: {
          access_type: 'offline', // Used by Supabase server-side to obtain refresh tokens (handled securely on backend)
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, role: 'student' | 'guardian') => {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      return { error: signUpError as Error };
    }

    // Create profile record after successful sign-up
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          role: role,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't fail sign-up if profile creation fails, but log it
      }
    }

    return { error: null };
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?type=reset-password`,
    });
    return { error: error as Error | null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPasswordForEmail, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
