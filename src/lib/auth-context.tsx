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
      // User exists but no password - likely a Google Auth user
      // We'll let Supabase handle the duplicate email check and catch it in the error handling below
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

    // Check if user was actually created
    if (!signUpData.user) {
      // User was not created - likely email already exists
      // Double-check by trying to see if user exists
      const { hasPassword: hasPwd } = await checkUserHasPassword(email);
      if (!hasPwd) {
        return { error: new Error('An account with this email already exists. Please use Google sign-in or use a different email.') };
      }
      return { error: new Error('An account with this email already exists. Please sign in instead.') };
    }

    // Check if user is authenticated (has session)
    // If email confirmation is required, user won't be authenticated yet
    const { data: { session } } = await supabase.auth.getSession();
    
    // Only create/update profile if user is authenticated
    // The trigger handle_new_user() should create the profile automatically when user is created
    // But if user is authenticated, we can safely update it
    if (session && session.user && session.user.id === signUpData.user.id) {
      // User is authenticated - we can upsert the profile
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
        // If profile creation fails, log it but don't fail sign-up
        // The trigger might have already created it, or it will be created after email confirmation
      }
    } else {
      // User is not authenticated yet (email confirmation required)
      // The trigger handle_new_user() will create the profile automatically when user confirms email
      // We don't need to do anything here - attempting to upsert would fail with 401
      console.log('User created but not authenticated yet. Profile will be created by trigger after email confirmation.');
    }

    return { error: null };
  };

  const signInWithEmail = async (email: string, password: string) => {
    // First check if user has a password
    const { hasPassword, error: checkError } = await checkUserHasPassword(email);
    
    if (checkError) {
      return { error: checkError };
    }
    
    // If user exists but doesn't have a password, it's a Google Auth user
    if (!hasPassword) {
      return { error: new Error('You previously signed in with Google. Please use the "Continue with Google" button to sign in.') };
    }

    // User has password - proceed with sign-in
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
        // If function returns error, assume user doesn't exist (return false)
        // This prevents email enumeration
        return { hasPassword: false, error: null };
      }

      return { hasPassword: data === true, error: null };
    } catch (error) {
      return { hasPassword: false, error: error as Error };
    }
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
