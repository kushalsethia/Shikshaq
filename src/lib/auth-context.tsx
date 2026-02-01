import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  checkUserHasPassword: (email: string) => Promise<{ hasPassword: boolean; error: Error | null }>;
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
        scopes: 'openid email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    // First check if email already exists and has password
    const { hasPassword, error: checkError } = await checkUserHasPassword(email);
    
    if (checkError) {
      // If check fails, proceed with sign-up (Supabase will handle duplicate email error)
    } else if (hasPassword) {
      // User exists and has password - they already signed up with email/password
      return { error: new Error('An account with this email already exists. Please sign in instead.') };
    } else {
      // User exists but no password - it's a Google Auth user
      // Suggest they sign in with Google first, then set password
      return { error: new Error('An account with this email already exists from Google sign-in. Please use the "Continue with Google" button above to sign in, then you can set a password.') };
    }

    // Proceed with sign-up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      // Check if error is due to existing email
      if (signUpError.message.includes('already registered') || 
          signUpError.message.includes('already exists') ||
          signUpError.message.includes('User already registered')) {
        // Email exists - check if it's Google Auth user
        const { hasPassword: hasPwd } = await checkUserHasPassword(email);
        if (!hasPwd) {
          return { error: new Error('An account with this email already exists. Please use Google sign-in or use a different email.') };
        }
        return { error: new Error('An account with this email already exists. Please sign in instead.') };
      }
      return { error: signUpError as Error };
    }

    // Create profile record after successful sign-up
    if (signUpData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          email: signUpData.user.email || email,
          full_name: fullName,
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't fail sign-up if profile creation fails, but log it
      }
    }

    return { error: null };
  };

  const signInWithEmail = async (email: string, password: string) => {
    // First check if user has a password
    const { hasPassword, error: checkError } = await checkUserHasPassword(email);
    
    if (checkError) {
      return { error: checkError };
    }
    
    // If user exists but doesn't have a password, it's a Google Auth user who hasn't set password yet
    if (!hasPassword) {
      return { error: new Error('You previously signed in with Google. Please use the "Continue with Google" button to sign in, then you can set a password in your account settings.') };
    }

    // User has password - proceed with sign-in (works for both email/password users and Google Auth users who set password)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const checkUserHasPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('check_user_has_password', {
        user_email: email
      });

      if (error) {
        console.error('RPC error:', error);
        // If function doesn't exist (404) or other error, use fallback
        if (error.message?.includes('function') || 
            error.message?.includes('404') || 
            error.message?.includes('does not exist') ||
            error.code === 'P0001' ||
            error.code === '42883') {
          console.warn('check_user_has_password function not accessible. Using fallback method.');
          // Fallback: For now, assume user doesn't have password if we can't check
          // This allows the flow to continue - user can still set password
          return { hasPassword: false, error: null };
        }
        // Other RPC errors - log and assume no password
        console.error('Unexpected RPC error:', error);
        return { hasPassword: false, error: null };
      }

      return { hasPassword: data === true, error: null };
    } catch (error) {
      console.error('Error checking password:', error);
      // On any error, assume no password to allow flow to continue
      return { hasPassword: false, error: null };
    }
  };

  const updatePassword = async (newPassword: string) => {
    // User must be authenticated to update password
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
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signInWithGoogle, 
      signUpWithEmail, 
      signInWithEmail, 
      checkUserHasPassword,
      updatePassword,
      signOut 
    }}>
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
