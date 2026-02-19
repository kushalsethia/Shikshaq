import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { invalidateUserProfileCache } from '@/utils/cache';

export default function TeacherTermsAgreement() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const hasRedirectedRef = useRef(false); // Track if we've already redirected
  const hasCheckedRef = useRef(false); // Track if we've already checked

  // Check if user is a teacher and if they've already agreed
  useEffect(() => {
    // Only check once
    if (hasCheckedRef.current) return;
    
    let isMounted = true;

    const checkTeacherStatus = async () => {
      // Prevent multiple redirects
      if (hasRedirectedRef.current) return;
      
      // Wait for auth to finish loading
      if (authLoading) return;
      
      // If no user, redirect to auth
      if (!user) {
        if (isMounted && !hasRedirectedRef.current && location.pathname === '/teacher-terms-agreement') {
          hasRedirectedRef.current = true;
          hasCheckedRef.current = true;
          window.location.href = '/auth';
        }
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, terms_agreement')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted && !hasRedirectedRef.current && location.pathname === '/teacher-terms-agreement') {
          hasCheckedRef.current = true;
          
          if (!profile) {
            // No profile - redirect to select role
            hasRedirectedRef.current = true;
            window.location.href = '/select-role';
            return;
          }

          if (profile.role !== 'teacher') {
            // Not a teacher - redirect to home
            hasRedirectedRef.current = true;
            window.location.href = '/';
            return;
          }

          // User is a teacher
          setIsTeacher(true);

          if (profile.terms_agreement === true) {
            // Already agreed - use hard redirect to break any loops
            hasRedirectedRef.current = true;
            setHasAgreed(true);
            window.location.href = '/';
            return;
          } else {
            // Needs to agree - show form
            setChecking(false);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error checking teacher status:', error);
        }
        if (isMounted) {
          setChecking(false);
          hasCheckedRef.current = true;
        }
      }
    };

    checkTeacherStatus();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAgreed) {
      toast.error('Please agree to the Terms and Privacy Policy to continue');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to continue');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Update profile with terms agreement
      const { error } = await supabase
        .from('profiles')
        .update({
          terms_agreement: true,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
        setLoading(false);
        return;
      }

      // Invalidate cache to ensure fresh data on next page load
      if (user) {
        invalidateUserProfileCache(user.id);
      }

      toast.success('Thank you for verifying your consent!');
      
      // Use hard redirect to break any potential loops
      // Small delay to ensure cache is cleared
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Show loading state while checking
  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If already agreed or not a teacher, don't render (they should be redirected)
  if (hasAgreed || !isTeacher) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-4" />
            <div className="flex justify-center mb-4">
              <UserCheck className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-sans text-foreground mb-2">
              Verify Your Consent
            </h1>
            <p className="text-muted-foreground">
              We've detected that you're a teacher on our platform. Please verify your consent to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border">
              <p className="text-sm text-foreground mb-3">
                As a teacher on Shikshaq, you agree to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Provide accurate information about your qualifications and teaching experience</li>
                <li>Maintain professional conduct when interacting with students and parents</li>
                <li>Respect student privacy and confidentiality</li>
                <li>Follow all applicable laws and regulations</li>
              </ul>
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline underline">
                  Privacy Policy
                </a>
                {' '}and consent to be listed as a teacher on Shikshaq.
              </Label>
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading || !termsAgreed}>
              {loading ? 'Verifying...' : 'Verify Consent & Continue'}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

