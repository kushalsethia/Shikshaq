import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, MessageCircle, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { saveAuthRedirect, getAuthRedirect, clearAuthRedirect } from '@/utils/authRedirect';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { Logo } from '@/components/Logo';

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
    sendMagicLink,
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

  /* "Send me a link" — the primary action account-01-sign-in.png draws.
     Errors surface inline rather than as a toast, because the most likely
     failure here is a project-level mail configuration problem and the person
     reading it needs the actual reason, not "something went wrong". */
  const [magicSent, setMagicSent] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const handleMagicLink = async () => {
    setErrors({});
    const parsed = emailSchema.safeParse(formData.email);
    if (!parsed.success) {
      setErrors({ email: 'Enter the email you want the link sent to' });
      return;
    }
    setMagicLoading(true);
    const { error } = await sendMagicLink(formData.email);
    setMagicLoading(false);
    if (error) {
      setErrors({ email: error.message });
      return;
    }
    setMagicSent(true);
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-panel">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-b-brand" />
          <p className="text-base text-background/70">Completing sign in...</p>
        </div>
      </div>
    );
  }

  // Redesign S6 (design.md §1, §6.5; changelog C-032) — rebuilt from zero.
  // The whole opener is one near-black ControlBlock-style ground (mockup S6):
  // logo + Skip, a scattered proof mosaic of tilted pills, then a "Free,
  // always" eyebrow, the display headline, Google, and the credentials form.
  // The mockup draws a magic-link ("Send me a link") flow; that machinery does
  // not exist in this app (Supabase email/password + Google only), so the
  // dark field row is reused for the real password form instead — reported.
  const DARK_FIELD =
    'w-full box-border min-h-[54px] h-[54px] px-4 rounded-[14px] bg-white/[0.08] text-[15px] text-background placeholder:text-background/40 outline-none shikshaq-auth-field';
  const DARK_FIELD_ERROR = 'ring-2 ring-destructive';

  return (
    <div className="flex min-h-screen flex-col bg-panel">
      {/* Header — logo (doubles as "back to home") + Skip, per mockup S6 */}
      <header className="flex items-center justify-between gap-3 px-5 pt-5">
        <Logo size="md" onDark ariaLabel="Back to home" />
        <Link
          to="/"
          className="inline-flex min-h-11 items-center px-2 py-1 text-[13px] font-semibold text-background/55"
        >
          Skip
        </Link>
      </header>

      {/* C-032 — scattered proof mosaic, positions/rotations per mockup S6 */}
      {/* overflow-hidden below: the pills are rotated, and rotation grows the
          bounding box, so the outermost ones pushed 2px past the viewport and
          created horizontal scroll at 390px. Mockup S6 shows them bleeding off
          the edge anyway, so clipping is the correct look as well as the fix. */}
      {!showResetPassword && (
        <div
          className="relative mx-auto mt-2 h-[400px] w-full max-w-[470px] overflow-hidden px-5"
          aria-hidden="true"
        >
          {/* The mosaic's four pale pills are four DIFFERENT hues in
              "Redesign Account screens.dc.html" — blue hsl(210 62% 93%), mint
              hsl(168 45% 93%), purple hsl(262 52% 93%), each with its own 26%
              ink. The build reused brand-blue-subtle for two of them and
              brand-subtle for the third, so the scatter read as two colours
              repeating instead of a spread of real subjects. These are literal
              spec values, not tokens, because the mosaic is deliberately
              outside the palette — it is standing in for many subjects. */}
          <span
            className="absolute left-[2%] top-[6%] -rotate-6 whitespace-nowrap rounded-full px-[14px] py-[9px] font-display text-[15px] font-extrabold"
            style={{ background: 'hsl(210 62% 93%)', color: 'hsl(210 45% 26%)' }}
          >
            Maths, Ballygunge
          </span>
          {(teacherCount ?? 0) > 0 && (
            <span className="absolute right-0 top-[22%] rotate-[4deg] whitespace-nowrap rounded-full bg-brand px-[14px] py-[9px] font-display text-[15px] font-extrabold text-brand-foreground">
              {teacherCount} verified tutors
            </span>
          )}
          <span
            className="absolute left-[6%] top-[40%] rotate-3 whitespace-nowrap rounded-full px-[14px] py-[9px] font-display text-[15px] font-extrabold"
            style={{ background: 'hsl(168 45% 93%)', color: 'hsl(168 45% 26%)' }}
          >
            Chemistry prelims
          </span>
          {/* > 0, not !== null. design.md §3.2 forbids advertising emptiness,
              and the paper library is genuinely empty right now, so this
              rendered a literal "0 free papers" badge on the sign-in screen.
              A count of zero drops the sticker instead. */}
          {(paperCount ?? 0) > 0 && (
            <span className="absolute right-[6%] top-[57%] -rotate-[4deg] whitespace-nowrap rounded-full bg-brand-blue px-[14px] py-[9px] font-display text-[15px] font-extrabold text-brand-blue-foreground">
              {paperCount} free papers
            </span>
          )}
          <span
            className="absolute bottom-[6%] left-0 rotate-[5deg] whitespace-nowrap rounded-full px-[14px] py-[9px] font-display text-[15px] font-extrabold"
            style={{ background: 'hsl(262 52% 93%)', color: 'hsl(262 45% 26%)' }}
          >
            English, Class 12
          </span>
          <span className="absolute bottom-[14%] right-[2%] flex h-14 w-14 -rotate-[8deg] items-center justify-center rounded-full bg-whatsapp text-whatsapp-text">
            <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
          </span>
        </div>
      )}

      <main className="flex-1 pb-8">
        <div className="mx-auto w-full max-w-[470px] px-5 pt-2">
          <div className="flex flex-col gap-[18px]">
            <div>
              {!showResetPassword && (
                <p className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.08em] text-background/55">
                  Free, always
                </p>
              )}
              <h1 className="font-display text-[34px] font-black leading-[1.02] tracking-[-0.04em] text-background">
                {showResetPassword ? 'Reset your password' : 'One tap, then talk to the teacher.'}
              </h1>
              <p className="mt-3 text-[14.5px] leading-relaxed text-background/70">
                {showResetPassword
                  ? 'Enter your new password below'
                  : isLogin
                  ? 'Sign in to continue to Shikshaq'
                  : 'Join Shikshaq to find the best tutors'}
              </p>
            </div>

            {/* Segmented tab pill — Sign in / Create account */}
            {!showResetPassword && (
              <div className="flex gap-1 rounded-2xl bg-white/[0.08] p-1">
                <button
                  type="button"
                  onClick={() => switchAuthMode(true)}
                  className={`shikshaq-tap min-h-11 flex-1 rounded-[10px] p-3 text-center text-sm font-semibold transition-all duration-150 ${isLogin ? 'bg-background text-foreground shadow-border' : 'bg-transparent text-background/70'}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthMode(false)}
                  className={`shikshaq-tap min-h-11 flex-1 rounded-[10px] p-3 text-center text-sm font-semibold transition-all duration-150 ${!isLogin ? 'bg-background text-foreground shadow-border' : 'bg-transparent text-background/70'}`}
                >
                  Create account
                </button>
              </div>
            )}

            {/* Google button + divider — every screen except password reset */}
            {!showResetPassword && (
              <div className="flex flex-col gap-[10px]">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="shikshaq-tap flex min-h-[54px] w-full items-center justify-center gap-[10px] rounded-[14px] bg-background text-[15px] font-bold text-foreground transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <GoogleIcon size={20} />
                  Continue with Google
                </button>
                <div className="my-[2px] flex items-center gap-[10px]">
                  <span className="h-px flex-1 bg-white/[0.14]" />
                  <span className="text-[11.5px] text-background/45">or</span>
                  <span className="h-px flex-1 bg-white/[0.14]" />
                </div>

              </div>
            )}

            {/* Reset Password Form */}
            {showResetPassword ? (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-background">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`${DARK_FIELD} ${errors.newPassword ? DARK_FIELD_ERROR : ''}`}
                  />
                  {errors.newPassword && <p className="mt-2 text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="mb-2 block text-sm font-semibold text-background">Confirm New Password</label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    className={`${DARK_FIELD} ${errors.confirmNewPassword ? DARK_FIELD_ERROR : ''}`}
                  />
                  {errors.confirmNewPassword && <p className="mt-2 text-sm text-destructive">{errors.confirmNewPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="shikshaq-tap flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-[15px] font-bold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {loading ? 'Updating password...' : 'Update Password'}
                </button>
              </form>
            ) : (
              /* Regular Sign In / Sign Up form */
              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="flex flex-col gap-4">
                {!isLogin && (
                  <div className="animate-fade-slide-up">
                    <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-background">Full name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`${DARK_FIELD} ${errors.fullName ? DARK_FIELD_ERROR : ''}`}
                    />
                    {errors.fullName && <p className="mt-2 text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                )}

                {!showForgotPassword && (
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-background">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${DARK_FIELD} ${errors.email ? DARK_FIELD_ERROR : ''}`}
                    />
                    {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}

                    {/* "Send me a link" sits immediately under the email field,
                        which is the order account-01-sign-in.png draws: Google,
                        "or", the address, then the link. Putting it above the
                        field — as this first did — asks you to press a button
                        before there is anywhere to type. Password sign-in
                        continues below; this is the default path, not the only
                        one, because eight existing accounts have passwords. */}
                    {magicSent ? (
                      <p className="mt-3 rounded-[14px] bg-white/[0.08] px-4 py-3 text-[14px] leading-[1.5] text-background/80">
                        Link sent to <span className="font-semibold text-background">{formData.email}</span>. Open it on
                        this device and you are in — no password needed.
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMagicLink}
                        disabled={magicLoading}
                        className="shikshaq-tap mt-3 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-[15px] font-bold text-brand-foreground transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {magicLoading ? 'Sending…' : 'Send me a link'}
                        {!magicLoading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                )}

                {!showForgotPassword && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-semibold text-background">Password</label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true);
                            setErrors({});
                            setFormData({ ...formData, password: '' });
                          }}
                          className="shikshaq-tap -my-3 inline-flex min-h-11 items-center px-1 text-sm font-semibold text-brand-blue-subtle"
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
                      className={`${DARK_FIELD} ${errors.password ? DARK_FIELD_ERROR : ''}`}
                    />
                    {errors.password && <p className="mt-2 text-sm text-destructive">{errors.password}</p>}
                  </div>
                )}

                {showForgotPassword && (
                  <div>
                    <div className="mb-2">
                      <label htmlFor="forgotEmail" className="mb-2 block text-sm font-semibold text-background">Email</label>
                      <input
                        id="forgotEmail"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${DARK_FIELD} ${errors.email ? DARK_FIELD_ERROR : ''}`}
                      />
                      {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setErrors({});
                          setFormData({ ...formData, email: '' });
                        }}
                        className="shikshaq-tap min-h-12 flex-1 rounded-[14px] bg-white/[0.08] text-sm font-semibold text-background"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="shikshaq-tap flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-brand text-sm font-semibold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </div>
                    <p className="mt-4 text-sm text-background/60">We'll send you a link to reset your password</p>
                  </div>
                )}

                {!isLogin && !showForgotPassword && (
                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-background">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${DARK_FIELD} ${errors.confirmPassword ? DARK_FIELD_ERROR : ''}`}
                    />
                    {errors.confirmPassword && <p className="mt-2 text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>
                )}

                {!showForgotPassword && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="shikshaq-tap flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-[15px] font-bold text-brand-foreground transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:active:scale-100"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
                  </button>
                )}
              </form>
            )}

            {!showResetPassword && !showForgotPassword && (
              <p className="text-[12px] leading-relaxed text-background/45">
                By continuing you agree to our{' '}
                <Link to="/terms-of-service" className="-my-3.5 inline-flex min-h-11 items-center px-0.5 align-middle font-semibold text-background/70 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="-my-3.5 inline-flex min-h-11 items-center px-0.5 align-middle font-semibold text-background/70 underline">
                  Privacy Policy
                </Link>
                . Your number is never shared with a teacher until you message them.
              </p>
            )}
          </div>
        </div>
      </main>

      <PreFooter variant={preFooterFor('/auth')} />

      <style>{`
        .shikshaq-auth-field { transition: box-shadow .15s ease; }
        .shikshaq-auth-field:focus { box-shadow: 0 0 0 2px hsl(var(--background)) !important; outline: none; }
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
