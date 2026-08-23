import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { IconDisc } from '@/components/ui/icon-disc';
import { UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
import { invalidateUserProfileCache } from '@/utils/cache';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';

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
        if (import.meta.env.DEV) console.error('Error updating profile:', error);
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-hairline border-b-brand mx-auto mb-4" />
            <p className="text-muted-foreground text-base">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If already agreed or not a teacher, don't render (they should be redirected)
  if (hasAgreed || !isTeacher) {
    return null;
  }

  /* TT-001 — read then accept, as a three-panel BentoStack. The changelog's
     assumed "before" here is a long-form legal document with h2 sections and
     a last-updated line; the actual content this page has always shown is a
     short, four-item consent list (there is no CMS-backed terms document, no
     last-updated field anywhere in the schema). Rather than fabricate prose
     or a date that doesn't exist, the panel geometry and typography are
     applied to the real content as-is: no last-updated line, no invented h2s. */
  return (
    <BentoStack>
      <main className="contents">
        <BentoPanel fill="card" edge="top" className="px-5 pt-8 pb-6 text-center sm:px-6">
          <Logo size="lg" className="mx-auto mb-4" />
          <div className="mb-4 flex justify-center">
            <IconDisc size={44} tone="brand-subtle" label="Teacher consent">
              <UserCheck className="h-5 w-5" strokeWidth={2.1} />
            </IconDisc>
          </div>
          <h1 className="font-display text-[27px] font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground">
            Verify your consent
          </h1>
          <p className="mx-auto mt-2 max-w-prose text-[15px] leading-relaxed text-warm-prose">
            We've detected that you're a teacher on our platform. Please verify your consent to continue.
          </p>
        </BentoPanel>

        {/* `contents` — the form still owns onSubmit/its fields, but does not
            become a box in the BentoStack flex layout (same reasoning as
            <main className="contents"> above): otherwise it would swallow
            the seam between the two panels it wraps. */}
        <form onSubmit={handleSubmit} id="teacher-terms-form" className="contents">
          <BentoPanel fill="card" className="px-5 py-5 sm:px-6">
            <div className="mx-auto max-w-[62ch]">
              <p className="mb-2 text-[16px] font-semibold leading-[1.7] text-foreground">
                As a teacher on Shikshaq, you agree to:
              </p>
              <ul className="flex flex-col gap-2 pl-4 text-[16px] leading-[1.7] text-warm-prose list-disc">
                <li>Provide accurate information about your qualifications and teaching experience</li>
                <li>Maintain professional conduct when interacting with students and parents</li>
                <li>Respect student privacy and confidentiality</li>
                <li>Follow all applicable laws and regulations</li>
              </ul>
            </div>
          </BentoPanel>

          <BentoPanel fill="card" edge="bottom" className="px-5 py-5 sm:px-6">
            <div className="mx-auto flex max-w-[62ch] flex-col gap-5">
              <div className="flex min-h-11 items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAgreed}
                  onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                  className="mt-0.5 h-5 w-5 rounded-[6px]"
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

              <Button type="submit" variant="primary" size={54} disabled={loading || !termsAgreed} className="w-full">
                {loading ? 'Verifying...' : 'Verify consent & continue'}
              </Button>
            </div>
          </BentoPanel>
        </form>
      </main>
    </BentoStack>
  );
}
