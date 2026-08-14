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

const TOKENS = {
  bg: '#F9F5F1',
  card: '#FCFAF7',
  text: '#1F1F1F',
  textSecondary: '#7B736B',
  hairline: '#E7DFD5',
  mutedFill: '#F0EAE2',
  blue: '#4351FF',
};

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
      <div style={{ minHeight: '100vh', background: TOKENS.bg, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              className="animate-spin"
              style={{ borderRadius: 999, height: 32, width: 32, borderWidth: 2, borderStyle: 'solid', borderColor: TOKENS.hairline, borderBottomColor: '#FF8000', margin: '0 auto 16px' }}
            />
            <p style={{ color: TOKENS.textSecondary, fontSize: 15 }}>Loading...</p>
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
    <div style={{ minHeight: '100vh', background: TOKENS.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,6vw,64px) clamp(16px,3vw,28px)' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size="lg" className="mx-auto mb-4" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <UserCheck style={{ width: 44, height: 44, color: TOKENS.blue }} />
            </div>
            <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700, color: TOKENS.text }}>
              Verify your consent
            </h1>
            <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>
              We've detected that you're a teacher on our platform. Please verify your consent to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ padding: 18, borderRadius: 16, background: TOKENS.mutedFill }}>
              <p style={{ marginBottom: 10, fontSize: 14.5, fontWeight: 600, color: TOKENS.text }}>
                As a teacher on Shikshaq, you agree to:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: 1.6, color: TOKENS.textSecondary, paddingLeft: 18, listStyleType: 'disc' }}>
                <li>Provide accurate information about your qualifications and teaching experience</li>
                <li>Maintain professional conduct when interacting with students and parents</li>
                <li>Respect student privacy and confidentiality</li>
                <li>Follow all applicable laws and regulations</li>
              </ul>
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Checkbox
                id="terms"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                className="mt-1"
              />
              <label htmlFor="terms" style={{ fontSize: 13.5, lineHeight: 1.55, color: '#4A443E', cursor: 'pointer' }}>
                I agree to the{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: TOKENS.blue, textDecoration: 'underline' }}>
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: TOKENS.blue, textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
                {' '}and consent to be listed as a teacher on Shikshaq.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAgreed}
              className="active:scale-[0.98] transition-transform duration-150"
              style={{
                width: '100%',
                minHeight: 50,
                borderRadius: 12,
                background: TOKENS.text,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                opacity: (loading || !termsAgreed) ? 0.5 : 1,
              }}
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
