import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Logo } from '@/components/Logo';
import { saveAuthRedirect, getAuthRedirect, clearAuthRedirect } from '@/utils/authRedirect';
import { CutPaperShape } from '@/components/devices';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { Chip } from '@/components/ui/chip';

/* C-032 — proof mosaic above the fold. Counts are real (Supabase), never hardcoded; the pill
   is simply not rendered until its count arrives. */
function useAuthProofCounts() {
  const [teacherCount, setTeacherCount] = useState<number | null>(null);
  const [paperCount, setPaperCount] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ count: teachers }, { count: papers }] = await Promise.all([
          supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
          supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        ]);
        if (!cancelled) {
          if (typeof teachers === 'number') setTeacherCount(teachers);
          if (typeof papers === 'number') setPaperCount(papers);
        }
      } catch {
        // Counts stay null; the pills that need them simply don't render (design.md §0.10).
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { teacherCount, paperCount };
}

const FIELD_BASE =
  'w-full box-border min-h-12 px-4 py-3 rounded-lg bg-card text-base text-foreground outline-none ring-1 ring-inset ring-warm-hairline shikshaq-auth-field';
const FIELD_ERROR = 'ring-destructive';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one digit');

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one digit'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const signinSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [processingOAuth, setProcessingOAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    resetPasswordForEmail,
    updatePassword,
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const { teacherCount, paperCount } = useAuthProofCounts();

  // Save redirect on mount (backup — primary save happens at the click source)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      saveAuthRedirect(redirect);
    }
  }, []);

  // Handle OAuth callback and redirect if authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetType = urlParams.get('type');
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAccessToken = hashParams.get('access_token');

    if (resetType === 'reset-password' && hasAccessToken) {
      setShowResetPassword(true);
      setIsLogin(true);
      return;
    }

    const hasError = hashParams.get('error');

    if (hasAccessToken && !showResetPassword) {
      setProcessingOAuth(true);
    }

    if (hasError) {
      const errorDescription = hashParams.get('error_description') || 'Authentication failed';
      toast.error(`Authentication Error: ${errorDescription}`);
      setProcessingOAuth(false);
      window.history.replaceState(null, '', '/auth');
      return;
    }

    if (!authLoading && user && !showResetPassword) {
      setProcessingOAuth(false);

      const checkProfile = async () => {
        // Read redirect at the latest possible moment, right before navigating
        const redirectTo = getAuthRedirect();

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, role, terms_agreement')
            .eq('id', user.id)
            .maybeSingle();

          if (window.location.hash && !showResetPassword) {
            window.history.replaceState(null, '', '/auth');
          }

          if (error) {
            if (import.meta.env.DEV) {
              console.error('Error checking profile:', error);
            }
          }

          if (!profile || !profile.role) {
            const to = redirectTo ? `/select-role?redirect=${encodeURIComponent(redirectTo)}` : '/select-role';
            navigate(to, { replace: true });
          } else if (profile.role === 'teacher' && profile.terms_agreement !== true) {
            const to = redirectTo ? `/teacher-terms-agreement?redirect=${encodeURIComponent(redirectTo)}` : '/teacher-terms-agreement';
            navigate(to, { replace: true });
          } else {
            clearAuthRedirect();
            navigate(redirectTo || '/', { replace: true });
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error checking profile:', error);
          }
          const to = redirectTo ? `/select-role?redirect=${encodeURIComponent(redirectTo)}` : '/select-role';
          navigate(to, { replace: true });
        }
      };

      setTimeout(checkProfile, hasAccessToken ? 500 : 200);
    }

    if (hasAccessToken && authLoading && !showResetPassword) {
      const waitTimer = setTimeout(() => {
        if (!user) {
          setProcessingOAuth(false);
          toast.error('Authentication timed out. Please try again.');
          window.history.replaceState(null, '', '/auth');
        }
      }, 3000);
      return () => clearTimeout(waitTimer);
    }
  }, [user, authLoading, navigate, showResetPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) {
        // Use generic error messages to prevent information disclosure
        if (error.message.includes('already exists') || error.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists. Please sign in or use a different email.' });
        } else {
          toast.error('Failed to create account. Please try again.');
        }
        setLoading(false);
      } else {
        toast.success('Account created successfully! Please check your email to verify your account. If you don\'t see it, check your Spam or Junk folder.');
        // Reset form
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
        setErrors({});
        setLoading(false);
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = signinSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await signInWithEmail(formData.email, formData.password);

      if (error) {
        // Use generic error messages to prevent information disclosure
        if (error.message.includes('Google')) {
          setErrors({ email: 'You previously signed in with Google. Please use the "Continue with Google" button.' });
        } else {
          // Always show generic error for sign-in failures
          setErrors({ password: 'Invalid email or password' });
        }
        setLoading(false);
      } else {
        toast.success('Welcome back!');
        // User will be redirected by useEffect
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = emailSchema.safeParse(formData.email);
    if (!result.success) {
      setErrors({ email: result.error.errors[0].message });
      setLoading(false);
      return;
    }

    try {
      const { error } = await resetPasswordForEmail(formData.email);
      if (error) {
        setErrors({ email: error.message || 'Failed to send reset email' });
        setLoading(false);
      } else {
        toast.success('Password reset email sent! Please check your inbox.');
        setShowForgotPassword(false);
        setFormData({ ...formData, email: '' });
        setErrors({});
        setLoading(false);
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const passwordResult = passwordSchema.safeParse(formData.newPassword);
    if (!passwordResult.success) {
      setErrors({ newPassword: passwordResult.error.errors[0].message });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrors({ confirmNewPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(formData.newPassword);
      if (error) {
        setErrors({ newPassword: error.message || 'Failed to update password' });
        setLoading(false);
      } else {
        toast.success('Password updated successfully! You can now sign in with your new password.');
        setShowResetPassword(false);
        setFormData({ ...formData, newPassword: '', confirmNewPassword: '' });
        setErrors({});
        setIsLogin(true);
        // Clean up URL
        window.history.replaceState(null, '', '/auth');
        setLoading(false);
      }
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Segmented tab pill — switches sign-in / create-account mode.
  // Same state reset the old bottom-of-form toggle used to perform.
  const switchAuthMode = (loginMode: boolean) => {
    if (isLogin === loginMode) return;
    setIsLogin(loginMode);
    setErrors({});
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  // Show loading state while processing OAuth callback
  if (processingOAuth || (authLoading && window.location.hash.includes('access_token'))) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-warm-hairline border-b-brand mx-auto mb-4" />
          <p className="text-muted-foreground text-base">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 p-4 sm:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 min-h-11 py-1 -my-1 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
        {/* C-032 — Skip link, top-right */}
        <Link
          to="/"
          className="inline-flex min-h-11 items-center px-2 py-1 -my-1 text-sm font-semibold text-muted-foreground"
        >
          Skip
        </Link>
      </header>

      {/* C-032 — scattered proof mosaic: tilted subject/count pills, built from real data */}
      {!showResetPassword && (
        <div className="mx-auto flex w-full max-w-[470px] flex-wrap items-center justify-center gap-2 px-4 pb-2 sm:px-6" aria-hidden="true">
          <span className="-rotate-2 rounded-full bg-card px-3 py-1.5 text-meta font-semibold text-foreground shadow-border">
            Maths, Ballygunge
          </span>
          <span className="rotate-1 rounded-full bg-card px-3 py-1.5 text-meta font-semibold text-foreground shadow-border">
            English, Class 12
          </span>
          {teacherCount !== null && (
            <Chip asChild tone="solid" size={34} className="rotate-2 bg-brand text-brand-foreground">
              {teacherCount} verified tutors
            </Chip>
          )}
          {paperCount !== null && (
            <Chip asChild tone="solid" size={34} className="-rotate-1 bg-brand-blue text-brand-blue-foreground">
              {paperCount} free papers
            </Chip>
          )}
          <span className="rotate-3 rounded-full bg-whatsapp px-3 py-1.5 text-meta font-semibold text-whatsapp-text shadow-border">
            WhatsApp direct
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="max-w-[470px] mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-12">
          {/* First-fold opening — graph-paper ground + a cut-paper mark instead of
              logo-on-blank-white. Confined to the header block only; the form
              below stays a crisp, unadorned surface (§4). */}
          <div className="ground-graph relative -mx-4 mb-5 overflow-hidden rounded-2xl px-4 pb-6 pt-6 sm:-mx-6 sm:px-6">
            <CutPaperShape
              variant="squiggle"
              color="hsl(var(--brand-blue))"
              size={120}
              outlined={false}
              className="pointer-events-none absolute -right-2 top-2 hidden opacity-70 sm:block"
            />
            <div className="relative text-center">
              <span className="relative inline-flex">
                <Logo size="lg" className="justify-center" />
                <Sparkles
                  className="animate-sparkle absolute -right-3 -top-2 h-[14px] w-[14px] text-brand-blue opacity-0 [animation-delay:.3s]"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>

          {/* Segmented tab pill — Sign in / Create account */}
          {!showResetPassword && (
            <div className="flex gap-1 p-1 rounded-2xl bg-muted mb-5">
              <button
                type="button"
                onClick={() => switchAuthMode(true)}
                className={`shikshaq-tap flex-1 min-h-11 p-3 rounded-lg text-center text-sm font-semibold text-foreground transition-all duration-150 ${isLogin ? 'bg-card shadow-border' : 'bg-transparent'}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchAuthMode(false)}
                className={`shikshaq-tap flex-1 min-h-11 p-3 rounded-lg text-center text-sm font-semibold text-foreground transition-all duration-150 ${!isLogin ? 'bg-card shadow-border' : 'bg-transparent'}`}
              >
                Create account
              </button>
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight leading-[.95] text-foreground">
            {showResetPassword ? (
              'Reset your password'
            ) : (
              /* C-032 — reworded per copy.md §7. */
              <>
                One tap, then{' '}
                <span
                  className="marker-highlight marker-highlight--tilt font-extrabold"
                  style={{ '--marker-color': 'hsl(var(--brand))' } as React.CSSProperties}
                >
                  talk to the teacher.
                </span>
              </>
            )}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {showResetPassword
              ? 'Enter your new password below'
              : isLogin
              ? 'Sign in to continue to Shikshaq'
              : 'Join Shikshaq to find the best tutors'
            }
          </p>

          {/* Google button + divider — every screen except password reset */}
          {!showResetPassword && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="shikshaq-tap flex items-center justify-center gap-2 w-full min-h-11 mt-5 p-4 rounded-lg bg-card shadow-border text-base font-semibold text-foreground transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <GoogleIcon size={20} />
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-4">
                <span className="flex-1 h-px bg-warm-hairline" />
                <span className="text-xs text-warm-meta">or</span>
                <span className="flex-1 h-px bg-warm-hairline" />
              </div>
            </>
          )}

          {/* Reset Password Form */}
          {showResetPassword ? (
            <form onSubmit={handleResetPassword} className="mt-6">
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground mb-2">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`${FIELD_BASE} ${errors.newPassword ? FIELD_ERROR : ''}`}
                />
                {errors.newPassword && (
                  <p className="text-sm text-destructive mt-2">{errors.newPassword}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-foreground mb-2">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  className={`${FIELD_BASE} ${errors.confirmNewPassword ? FIELD_ERROR : ''}`}
                />
                {errors.confirmNewPassword && (
                  <p className="text-sm text-destructive mt-2">{errors.confirmNewPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="shikshaq-tap flex w-full min-h-[52px] items-center justify-center gap-2 p-4 rounded-lg bg-foreground text-background text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Updating password...' : 'Update Password'}
              </button>
            </form>
          ) : (
            /* Regular Sign In / Sign Up form */
            <form onSubmit={isLogin ? handleSignIn : handleSignUp}>
              {/* Full Name — signup only, entering with rise */}
              {!isLogin && (
                <div className="mb-4 animate-fade-slide-up">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-foreground mb-2">Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`${FIELD_BASE} ${errors.fullName ? FIELD_ERROR : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive mt-2">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email — hidden while the dedicated forgot-password field is showing */}
              {!showForgotPassword && (
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${FIELD_BASE} ${errors.email ? FIELD_ERROR : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-2">{errors.email}</p>
                  )}
                </div>
              )}

              {/* Password */}
              {!showForgotPassword && (
                <div className={isLogin ? 'mb-6' : 'mb-4'}>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="text-sm font-semibold text-foreground">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setErrors({});
                          setFormData({ ...formData, password: '' });
                        }}
                        className="shikshaq-tap -my-3 inline-flex min-h-11 items-center px-1 text-sm font-semibold text-brand-blue"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${FIELD_BASE} ${errors.password ? FIELD_ERROR : ''}`}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-2">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Forgot Password mini-form */}
              {showForgotPassword && (
                <div>
                  <div className="mb-6">
                    <label htmlFor="forgotEmail" className="block text-sm font-semibold text-foreground mb-2">Email</label>
                    <input
                      id="forgotEmail"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${FIELD_BASE} ${errors.email ? FIELD_ERROR : ''}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-2">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setErrors({});
                        setFormData({ ...formData, email: '' });
                      }}
                      className="shikshaq-tap flex-1 min-h-12 rounded-lg bg-card shadow-border text-sm font-semibold text-foreground"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="shikshaq-tap flex flex-1 min-h-12 items-center justify-center gap-2 rounded-lg bg-foreground text-background text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    We'll send you a link to reset your password
                  </p>
                </div>
              )}

              {/* Confirm Password — signup only */}
              {!isLogin && !showForgotPassword && (
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${FIELD_BASE} ${errors.confirmPassword ? FIELD_ERROR : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!showForgotPassword && (
                <button
                  type="submit"
                  disabled={loading}
                  className="shikshaq-tap flex w-full min-h-[52px] items-center justify-center gap-2 p-4 rounded-lg bg-foreground text-background text-base font-semibold transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
                </button>
              )}
            </form>
          )}

          {/* Legal note — verbatim copy from the design spec */}
          {!showResetPassword && !showForgotPassword && (
            <p className="mt-4 text-xs leading-relaxed text-warm-meta">
              By continuing you agree to our{' '}
              <Link
                to="/terms-of-service"
                className="-my-3.5 inline-flex min-h-11 items-center px-0.5 align-middle text-brand-blue font-semibold"
              >
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link
                to="/privacy-policy"
                className="-my-3.5 inline-flex min-h-11 items-center px-0.5 align-middle text-brand-blue font-semibold"
              >
                Privacy Policy
              </Link>
              . Your number is never shared with a teacher until you message them.
            </p>
          )}
        </div>
      </main>

      <PreFooter variant={preFooterFor('/auth')} />

      <style>{`
        .shikshaq-auth-field { transition: box-shadow .15s ease; }
        .shikshaq-auth-field:focus { box-shadow: 0 0 0 2px hsl(var(--foreground)) !important; outline: none; }
      `}</style>
    </div>
  );
}

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
