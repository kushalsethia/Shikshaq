import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role: 'student' | 'guardian', termsAgreed?: boolean) => Promise<{ error: Error | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean; error: Error | null }>;
  checkPasswordExists: (email: string, password: string) => Promise<{ hasPassword: boolean; error: Error | null }>;
  checkHasPassword: (email: string) => Promise<{ hasPassword: boolean; error: Error | null }>;
  sendOTP: (email: string) => Promise<{ error: Error | null }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: Error | null }>;
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

  const signUpWithEmail = async (email: string, password: string, fullName: string, role: 'student' | 'guardian', termsAgreed: boolean = false) => {
    // Standard Supabase sign-up - this will automatically send verification email for new users
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          role: role, // Store in metadata for later use
          terms_agreement: termsAgreed, // Store in metadata for later use
        },
      },
    });

    if (signUpError) {
      return { error: signUpError as Error };
    }

    // If user exists but no session, user is unverified - Supabase doesn't send email for repeated signups
    // We need to manually trigger a confirmation email
    // Note: Supabase doesn't have a client-side method to resend confirmation emails
    // So we use resetPasswordForEmail as a workaround - this sends an email that allows verification
    if (data.user && !data.session) {
      // User exists but is unverified - send password reset email which also verifies the email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=reset-password`,
      });

      if (resetError) {
        console.error('Error sending verification email:', resetError);
        // Continue anyway - the user was created, just email might not have been sent
      }
    }

    // Profile will be created by the handle_new_user trigger
    // Role and terms_agreement will be set after email verification
    // We store them in user metadata so they can be retrieved later
    if (data.user) {
      // Update profile with role and terms_agreement if it exists
      // (It should be created by the trigger, but we update it here to ensure role/terms are set)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: role,
          terms_agreement: termsAgreed,
          has_password: true, // User signed up with password
        })
        .eq('id', data.user.id);

      if (profileError) {
        // If profile doesn't exist yet (trigger hasn't run), try to insert
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            role: role,
            terms_agreement: termsAgreed,
            has_password: true,
          });

        if (insertError) {
          console.error('Error creating/updating profile:', insertError);
          // Don't fail sign-up if profile creation fails, but log it
        }
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
    
    // Update has_password in profiles after password is set
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ has_password: true })
          .eq('id', user.id);
      }
    }
    
    return { error: error as Error | null };
  };

  const checkEmailExists = async (email: string) => {
    try {
      // Use signInWithOtp with shouldCreateUser: false to check if email exists
      // If email doesn't exist, it will return an error
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      // If no error, email exists and OTP was sent
      if (!error) {
        return { exists: true, error: null };
      }

      // Check error message to determine if email exists
      if (error.message.includes('User not found') || 
          error.message.includes('does not exist')) {
        return { exists: false, error: null };
      }

      // For other errors (rate limiting, network issues, etc.), assume email exists
      // This is safer than assuming it doesn't exist
      return { exists: true, error: null };
    } catch (error) {
      // On any error, assume email exists to be safe
      // This prevents false negatives (saying email doesn't exist when it does)
      return { exists: true, error: error as Error };
    }
  };

  const checkPasswordExists = async (email: string, password: string) => {
    try {
      // Try to sign in with the provided password
      // If successful, password exists and is correct
      // If error is "Invalid login credentials", password might be wrong but user exists
      // If error is "Email not confirmed", user exists but needs confirmation
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Password is correct and user is signed in
        return { hasPassword: true, error: null };
      }

      // Check error message
      if (error.message.includes('Invalid login credentials')) {
        // User exists, password might be wrong, but they have a password set
        // We'll return true here - the password check will happen in the actual login
        return { hasPassword: true, error: null };
      }

      if (error.message.includes('Email not confirmed')) {
        // User exists but email not confirmed - they likely have a password
        return { hasPassword: true, error: null };
      }

      // For other errors, assume password doesn't exist or user doesn't exist
      return { hasPassword: false, error: null };
    } catch (error) {
      return { hasPassword: false, error: error as Error };
    }
  };

  const checkHasPassword = async (email: string) => {
    try {
      // Use database function to check has_password by email
      const { data, error } = await supabase.rpc('check_has_password_by_email', {
        user_email: email
      });

      if (error) {
        return { hasPassword: false, error: error as Error };
      }

      // Function returns boolean
      return { hasPassword: data || false, error: null };
    } catch (error) {
      return { hasPassword: false, error: error as Error };
    }
  };

  const sendOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Don't create user if they don't exist
      },
    });
    return { error: error as Error | null };
  };

  const verifyOTP = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
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
      signInWithEmail, 
      signUpWithEmail, 
      resetPasswordForEmail, 
      updatePassword,
      checkEmailExists,
      checkPasswordExists,
      checkHasPassword,
      sendOTP,
      verifyOTP,
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
