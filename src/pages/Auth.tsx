import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { Logo } from '@/components/Logo';
import { saveAuthRedirect, getAuthRedirect, clearAuthRedirect } from '@/utils/authRedirect';

// Literal values from design_handoff_shikshaq/pages/Auth.md + _tokens.md.
const TOKENS = {
  shell: '#F9F5F1',
  field: '#FCFAF7',
  text: '#1F1F1F',
  textSecondary: '#7B736B',
  textTertiary: '#8B837A',
  hairline: '#E7DFD5',
  mutedFill: '#F0EAE2',
  link: '#4351FF',
  error: '#E5484D',
};

function fieldStyle(hasError?: boolean): React.CSSProperties {
  return {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 48,
    padding: '13px 15px',
    border: 0,
    borderRadius: 12,
    background: TOKENS.field,
    boxShadow: `0 0 0 1px ${hasError ? TOKENS.error : TOKENS.hairline}`,
    fontFamily: 'inherit',
    fontSize: 15,
    color: TOKENS.text,
    outline: 'none',
  };
}

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
      <div style={{ minHeight: '100vh', background: TOKENS.shell, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            className="animate-spin"
            style={{ borderRadius: 999, height: 48, width: 48, borderWidth: 2, borderStyle: 'solid', borderColor: TOKENS.hairline, borderBottomColor: '#FF8000', margin: '0 auto 16px' }}
          />
          <p style={{ color: TOKENS.textSecondary, fontSize: 15 }}>Completing sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: TOKENS.shell, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '16px clamp(16px,3vw,28px)' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '4px 0', margin: '-4px 0', fontSize: 14, fontWeight: 500, color: TOKENS.textSecondary }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </header>

      {/* Main Content — 470px column, literal padding from pages/Auth.md */}
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 470, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Logo size="lg" className="justify-center" />
          </div>

          {/* Segmented tab pill — Sign in / Create account */}
          {!showResetPassword && (
            <div style={{ display: 'flex', gap: 5, padding: 5, borderRadius: 14, background: TOKENS.mutedFill, marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => switchAuthMode(true)}
                className="shikshaq-tap"
                style={{
                  flex: 1, padding: 12, borderRadius: 10, textAlign: 'center', fontSize: 14, fontWeight: 600,
                  background: isLogin ? TOKENS.field : 'transparent',
                  boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,.10)' : 'none',
                  color: TOKENS.text,
                  transition: 'all .18s ease',
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchAuthMode(false)}
                className="shikshaq-tap"
                style={{
                  flex: 1, padding: 12, borderRadius: 10, textAlign: 'center', fontSize: 14, fontWeight: 600,
                  background: !isLogin ? TOKENS.field : 'transparent',
                  boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,.10)' : 'none',
                  color: TOKENS.text,
                  transition: 'all .18s ease',
                }}
              >
                Create account
              </button>
            </div>
          )}

          <h1 style={{ fontSize: 'clamp(26px,3.4vw,34px)', lineHeight: 1.05, fontWeight: 700, color: TOKENS.text, margin: 0 }}>
            {showResetPassword ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: TOKENS.textSecondary }}>
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
                className="shikshaq-tap"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', minHeight: 44, marginTop: 24, padding: 15, borderRadius: 12,
                  background: TOKENS.field, boxShadow: `0 0 0 1px ${TOKENS.hairline}`,
                  fontSize: 15, fontWeight: 600, color: TOKENS.text,
                }}
              >
                <GoogleIcon size={20} />
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0' }}>
                <span style={{ flex: 1, height: 1, background: TOKENS.hairline }} />
                <span style={{ fontSize: 12, color: TOKENS.textTertiary }}>or</span>
                <span style={{ flex: 1, height: 1, background: TOKENS.hairline }} />
              </div>
            </>
          )}

          {/* Reset Password Form */}
          {showResetPassword ? (
            <form onSubmit={handleResetPassword} style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="newPassword" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 7 }}>New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={errors.newPassword ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                  style={fieldStyle(!!errors.newPassword)}
                />
                {errors.newPassword && (
                  <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.newPassword}</p>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="confirmNewPassword" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 7 }}>Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  className={errors.confirmNewPassword ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                  style={fieldStyle(!!errors.confirmNewPassword)}
                />
                {errors.confirmNewPassword && (
                  <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.confirmNewPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="shikshaq-tap"
                style={{
                  width: '100%', minHeight: 52, padding: 15, borderRadius: 12, background: TOKENS.text, color: '#fff',
                  fontSize: 15, fontWeight: 600, opacity: loading ? .6 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Updating password...' : 'Update Password'}
              </button>
            </form>
          ) : (
            /* Regular Sign In / Sign Up form */
            <form onSubmit={isLogin ? handleSignIn : handleSignUp}>
              {/* Full Name — signup only, entering with rise */}
              {!isLogin && (
                <div style={{ marginBottom: 14, animation: 'shikshaqAuthRise .25s ease-out both' }}>
                  <label htmlFor="fullName" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 7 }}>Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                    style={fieldStyle(!!errors.fullName)}
                  />
                  {errors.fullName && (
                    <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email — hidden while the dedicated forgot-password field is showing */}
              {!showForgotPassword && (
                <div style={{ marginBottom: 14 }}>
                  <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 7 }}>Email</label>
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
                    className={errors.email ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                    style={fieldStyle(!!errors.email)}
                  />
                  {errors.email && (
                    <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.email}</p>
                  )}
                </div>
              )}

              {/* Password */}
              {!showForgotPassword && (
                <div style={{ marginBottom: !isLogin ? 14 : 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                    <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: TOKENS.text }}>Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setErrors({});
                          setFormData({ ...formData, password: '' });
                        }}
                        className="shikshaq-tap"
                        style={{ fontSize: 13, fontWeight: 600, color: TOKENS.link }}
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
                    className={errors.password ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                    style={fieldStyle(!!errors.password)}
                  />
                  {errors.password && (
                    <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.password}</p>
                  )}
                </div>
              )}

              {/* Forgot Password mini-form */}
              {showForgotPassword && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <label htmlFor="forgotEmail" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 7 }}>Email</label>
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
                      className={errors.email ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                      style={fieldStyle(!!errors.email)}
                    />
                    {errors.email && (
                      <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.email}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setErrors({});
                        setFormData({ ...formData, email: '' });
                      }}
                      className="shikshaq-tap"
                      style={{ flex: 1, minHeight: 48, borderRadius: 12, background: TOKENS.field, boxShadow: `0 0 0 1px ${TOKENS.hairline}`, fontSize: 14, fontWeight: 600, color: TOKENS.text }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="shikshaq-tap"
                      style={{ flex: 1, minHeight: 48, borderRadius: 12, background: TOKENS.text, color: '#fff', fontSize: 14, fontWeight: 600, opacity: loading ? .6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                  <p style={{ marginTop: 14, fontSize: 13, color: TOKENS.textSecondary }}>
                    We'll send you a link to reset your password
                  </p>
                </div>
              )}

              {/* Confirm Password — signup only */}
              {!isLogin && !showForgotPassword && (
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TOKENS.text, marginBottom: 7 }}>Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'shikshaq-auth-field shikshaq-auth-field-error' : 'shikshaq-auth-field'}
                    style={fieldStyle(!!errors.confirmPassword)}
                  />
                  {errors.confirmPassword && (
                    <p style={{ fontSize: 12.5, color: TOKENS.error, marginTop: 6 }}>{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!showForgotPassword && (
                <button
                  type="submit"
                  disabled={loading}
                  className="shikshaq-tap"
                  style={{
                    width: '100%', minHeight: 52, padding: 15, borderRadius: 12, background: TOKENS.text, color: '#fff',
                    fontSize: 15, fontWeight: 600, opacity: loading ? .6 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
                </button>
              )}
            </form>
          )}

          {/* Legal note — verbatim copy from the design spec */}
          {!showResetPassword && !showForgotPassword && (
            <p style={{ marginTop: 18, fontSize: 12.5, lineHeight: 1.55, color: TOKENS.textTertiary }}>
              By continuing you agree to our{' '}
              <Link to="/terms-of-service" style={{ color: TOKENS.link, fontWeight: 600 }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy-policy" style={{ color: TOKENS.link, fontWeight: 600 }}>Privacy Policy</Link>.
              {' '}Your number is never shared with a teacher until you message them.
            </p>
          )}
        </div>
      </main>

      <style>{`
        @keyframes shikshaqAuthRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .shikshaq-auth-field { transition: box-shadow .15s ease; }
        .shikshaq-auth-field:focus { box-shadow: 0 0 0 2px ${TOKENS.text} !important; }
        .shikshaq-auth-field-error:focus { box-shadow: 0 0 0 2px ${TOKENS.error} !important; }
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
