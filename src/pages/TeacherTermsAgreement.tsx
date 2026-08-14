import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { invalidateUserProfileCache } from '@/utils/cache';

function isValidRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}

export default function TeacherTermsAgreement() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
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

      // If no user, redirect to auth (preserve return URL)
      if (!user) {
        if (isMounted && !hasRedirectedRef.current && location.pathname === '/teacher-terms-agreement') {
          hasRedirectedRef.current = true;
          hasCheckedRef.current = true;
          const to = isValidRedirect(redirectTo) ? `/auth?redirect=${encodeURIComponent(redirectTo)}` : '/auth';
          navigate(to, { replace: true });
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
            // No profile - redirect to select role (preserve return URL)
            hasRedirectedRef.current = true;
            const to = isValidRedirect(redirectTo) ? `/select-role?redirect=${encodeURIComponent(redirectTo)}` : '/select-role';
            navigate(to, { replace: true });
            return;
          }

          if (profile.role !== 'teacher') {
            // Not a teacher - redirect back or home
            hasRedirectedRef.current = true;
            navigate(isValidRedirect(redirectTo) ? redirectTo : '/', { replace: true });
            return;
          }

          // User is a teacher
          setIsTeacher(true);

          if (profile.terms_agreement === true) {
            // Already agreed - redirect back or home
            hasRedirectedRef.current = true;
            setHasAgreed(true);
            navigate(isValidRedirect(redirectTo) ? redirectTo : '/', { replace: true });
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
  }, [user, authLoading, location.pathname, redirectTo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAgreed) {
      toast.error('Please agree to the Terms and Privacy Policy to continue');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to continue');
      const to = isValidRedirect(redirectTo) ? `/auth?redirect=${encodeURIComponent(redirectTo)}` : '/auth';
      navigate(to);
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

      // Small delay to ensure cache is cleared, then redirect back or home
      const returnPath = isValidRedirect(redirectTo) ? redirectTo : '/';
      setTimeout(() => {
        navigate(returnPath, { replace: true });
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
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-hairline border-b-brand mx-auto mb-4" />
            <p className="text-muted-foreground text-base">Loading...</p>
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

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-[480px]">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-4" />
            <div className="flex justify-center mb-4">
              <UserCheck className="w-11 h-11 text-brand-blue" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-foreground">
              Verify your consent
            </h1>
            <p className="mt-2 text-base leading-relaxed text-warm-prose">
              We've detected that you're a teacher on our platform. Please verify your consent to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-muted">
              <p className="mb-2 text-sm font-semibold text-foreground">
                As a teacher on Shikshaq, you agree to:
              </p>
              <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground pl-4 list-disc">
                <li>Provide accurate information about your qualifications and teaching experience</li>
                <li>Maintain professional conduct when interacting with students and parents</li>
                <li>Respect student privacy and confidentiality</li>
                <li>Follow all applicable laws and regulations</li>
              </ul>
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed text-warm-prose cursor-pointer">
                I agree to the{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">
                  Privacy Policy
                </a>
                {' '}and consent to be listed as a teacher on Shikshaq.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAgreed}
              className="active:scale-[0.98] transition-transform duration-150 w-full min-h-[50px] rounded-lg bg-foreground text-background text-base font-bold disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify consent & continue'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
