import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, Users } from 'lucide-react';
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
  orange: '#FF8000',
  orangeText: '#B35900',
  orangeTint: '#FFF4E8',
  blue: '#4351FF',
  blueTint: '#EDEEFF',
};

function fieldStyle(): React.CSSProperties {
  return {
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
    background: TOKENS.bg,
    boxShadow: `0 0 0 1px ${TOKENS.hairline}`,
    fontSize: 15,
    color: TOKENS.text,
    outline: 'none',
    padding: '0 14px',
  };
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 8 };

function isValidRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}

export default function SelectRole() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [role, setRole] = useState<'student' | 'guardian' | ''>('');
  const [schoolCollege, setSchoolCollege] = useState('');
  const [grade, setGrade] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  // Check once on mount if user already has a role - only run once
  useEffect(() => {
    let isMounted = true;

    const checkExistingRole = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;

      // If no user, allow them to see the sign-in message
      if (!user) {
        if (isMounted) {
          setCheckingRole(false);
        }
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, terms_agreement')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted) {
          if (profile && profile.role) {
            // User already has a role
            const returnPath = isValidRedirect(redirectTo) ? redirectTo : '/';
            if (profile.role === 'teacher') {
              // If teacher hasn't agreed to terms, redirect to teacher terms agreement (preserve return URL)
              if (profile.terms_agreement !== true) {
                const to = isValidRedirect(redirectTo) ? `/teacher-terms-agreement?redirect=${encodeURIComponent(redirectTo)}` : '/teacher-terms-agreement';
                navigate(to, { replace: true });
                return;
              }
              // If teacher has agreed, redirect back or home
              navigate(returnPath, { replace: true });
            } else {
              // Student or guardian - redirect back or home
              navigate(returnPath, { replace: true });
            }
            setHasRole(true);
          } else {
            // User doesn't have a role - show the form (guarded)
            setCheckingRole(false);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error checking role:', error);
        }
        if (isMounted) {
          setCheckingRole(false);
        }
      }
    };

    checkExistingRole();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, navigate, redirectTo]); // Only run when user or authLoading changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error('Please select whether you are a student or guardian');
      return;
    }

    if (role === 'student') {
      if (!schoolCollege.trim()) {
        toast.error('Please enter your school or college name');
        return;
      }
      if (!grade) {
        toast.error('Please select your grade');
        return;
      }
    }

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
      const upsertData = {
        id: user.id,
        role: role,
        terms_agreement: termsAgreed,
        ...(role === 'student' ? { school_college: schoolCollege.trim(), grade } : {}),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(upsertData, {
          onConflict: 'id'
        });

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

      toast.success('Profile created successfully!');

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

  // Show loading state only while checking auth or initial role check
  if (authLoading || checkingRole) {
    return (
      <div style={{ minHeight: '100vh', background: TOKENS.bg, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              className="animate-spin"
              style={{ borderRadius: 999, height: 32, width: 32, borderWidth: 2, borderStyle: 'solid', borderColor: TOKENS.hairline, borderBottomColor: TOKENS.orange, margin: '0 auto 16px' }}
            />
            <p style={{ color: TOKENS.textSecondary, fontSize: 15 }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If user already has a role, don't render (they should be redirected)
  if (hasRole) {
    return null;
  }

  // If no user, show sign-in prompt
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: TOKENS.bg }}>
        <Navbar />
        <div style={{ padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px', textAlign: 'center' }}>
          <p style={{ marginBottom: 16, fontSize: 15, color: TOKENS.textSecondary }}>You must be signed in to continue.</p>
          <button
            onClick={() => navigate(isValidRedirect(redirectTo) ? `/auth?redirect=${encodeURIComponent(redirectTo)}` : '/auth')}
            className="active:scale-[0.98] transition-transform duration-150"
            style={{ minHeight: 48, padding: '0 24px', borderRadius: 12, background: TOKENS.text, color: '#fff', fontSize: 15, fontWeight: 700 }}
          >
            Sign In
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: TOKENS.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,6vw,64px) clamp(16px,3vw,28px)' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size="lg" className="mx-auto mb-4" />
            <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700, color: TOKENS.text }}>
              Complete your profile
            </h1>
            <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: TOKENS.textSecondary }}>
              Please select whether you are a student or guardian
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={labelStyle}>I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className="active:scale-[0.98] transition-transform duration-150"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '24px 16px',
                    borderRadius: 20,
                    background: role === 'student' ? TOKENS.orangeTint : TOKENS.card,
                    boxShadow: role === 'student' ? `0 0 0 2px ${TOKENS.orange}` : '0 0 0 1px rgba(0,0,0,.06)',
                  }}
                >
                  <GraduationCap style={{ width: 28, height: 28, color: role === 'student' ? TOKENS.orangeText : TOKENS.text }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: TOKENS.text }}>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('guardian')}
                  className="active:scale-[0.98] transition-transform duration-150"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '24px 16px',
                    borderRadius: 20,
                    background: role === 'guardian' ? TOKENS.blueTint : TOKENS.card,
                    boxShadow: role === 'guardian' ? `0 0 0 2px ${TOKENS.blue}` : '0 0 0 1px rgba(0,0,0,.06)',
                  }}
                >
                  <Users style={{ width: 28, height: 28, color: role === 'guardian' ? TOKENS.blue : TOKENS.text }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: TOKENS.text }}>Guardian</span>
                </button>
              </div>
            </div>

            {role === 'student' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label htmlFor="school_college" style={labelStyle}>
                    School / College <span style={{ color: '#B3261E' }}>*</span>
                  </label>
                  <input
                    id="school_college"
                    placeholder="e.g. Delhi Public School"
                    value={schoolCollege}
                    onChange={(e) => setSchoolCollege(e.target.value)}
                    style={fieldStyle()}
                  />
                </div>
                <div>
                  <label htmlFor="grade" style={labelStyle}>
                    Grade <span style={{ color: '#B3261E' }}>*</span>
                  </label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger id="grade" style={{ ...fieldStyle(), border: 'none' }}>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Class 1</SelectItem>
                      <SelectItem value="2">Class 2</SelectItem>
                      <SelectItem value="3">Class 3</SelectItem>
                      <SelectItem value="4">Class 4</SelectItem>
                      <SelectItem value="5">Class 5</SelectItem>
                      <SelectItem value="6">Class 6</SelectItem>
                      <SelectItem value="7">Class 7</SelectItem>
                      <SelectItem value="8">Class 8</SelectItem>
                      <SelectItem value="9">Class 9</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                      <SelectItem value="UG, First Year">UG, First Year</SelectItem>
                      <SelectItem value="UG, Second Year">UG, Second Year</SelectItem>
                      <SelectItem value="UG, Third Year">UG, Third Year</SelectItem>
                      <SelectItem value="UG, Fourth Year">UG, Fourth Year</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
                {' '}to connect with teachers.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !role || !termsAgreed || (role === 'student' && (!schoolCollege.trim() || !grade))}
              className="active:scale-[0.98] transition-transform duration-150"
              style={{
                width: '100%',
                minHeight: 50,
                borderRadius: 12,
                background: TOKENS.text,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                opacity: (loading || !role || !termsAgreed || (role === 'student' && (!schoolCollege.trim() || !grade))) ? 0.5 : 1,
              }}
            >
              {loading ? 'Creating profile...' : 'Continue'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
