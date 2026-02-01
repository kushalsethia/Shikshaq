import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Auth() {
  const [processingOAuth, setProcessingOAuth] = useState(false);
  const { signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth callback and redirect if authenticated
  useEffect(() => {
    // Check for OAuth callback in hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAccessToken = hashParams.get('access_token');
    const hasError = hashParams.get('error');
    
    // Set processing state if we have an OAuth callback
    if (hasAccessToken) {
      setProcessingOAuth(true);
    }
    
    // If there's an error in the hash, show it
    if (hasError) {
      const errorDescription = hashParams.get('error_description') || 'Authentication failed';
      toast.error(`Authentication Error: ${errorDescription}`);
      setProcessingOAuth(false);
      // Clean up the hash
      window.history.replaceState(null, '', '/auth');
      return;
    }
    
    // If user becomes authenticated (from OAuth)
    if (!authLoading && user) {
      setProcessingOAuth(false);
      
      // Check if user has a profile
      const checkProfile = async () => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .maybeSingle();

          // Clean up hash if present
          if (window.location.hash) {
            window.history.replaceState(null, '', '/auth');
          }

          if (error) {
            console.error('Error checking profile:', error);
          }

          if (!profile || !profile.role) {
            // No profile found or no role set - redirect to role selection
            navigate('/select-role', { replace: true });
          } else {
            // Profile exists with role - redirect to home
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          // On error, redirect to role selection to be safe
          navigate('/select-role', { replace: true });
        }
      };

      // Small delay to ensure session is fully processed
      setTimeout(checkProfile, hasAccessToken ? 500 : 200);
    }
    
    // If we have an access token but user isn't set yet, wait a bit more
    if (hasAccessToken && authLoading) {
      // Give Supabase more time to process the session (max 3 seconds)
      const waitTimer = setTimeout(() => {
        if (!user) {
          setProcessingOAuth(false);
          toast.error('Authentication timed out. Please try again.');
          window.history.replaceState(null, '', '/auth');
        }
      }, 3000);
      return () => clearTimeout(waitTimer);
    }
  }, [user, authLoading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  // Show loading state while processing OAuth callback
  if (processingOAuth || (authLoading && window.location.hash.includes('access_token'))) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center" />
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
            <h1 className="text-2xl font-serif text-foreground text-center mb-2">
              Welcome to ShikshAq
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Sign in with Google to continue
            </p>

            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full mb-6 h-12 gap-3"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
