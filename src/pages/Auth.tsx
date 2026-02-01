import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { Logo } from '@/components/Logo';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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

  // Handle OAuth callback and redirect if authenticated
  useEffect(() => {
    // Check for password reset in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const resetType = urlParams.get('type');
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAccessToken = hashParams.get('access_token');
    
    // If we have a reset-password type and access token, show reset password form
    if (resetType === 'reset-password' && hasAccessToken) {
      setShowResetPassword(true);
      setIsLogin(true);
      // Don't redirect - let user set new password
      return;
    }

    // Check for OAuth callback in hash
    const hasError = hashParams.get('error');
    
    // Set processing state if we have an OAuth callback
    if (hasAccessToken && !showResetPassword) {
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
    
    // If user becomes authenticated (from OAuth or email/password) and not resetting password
    if (!authLoading && user && !showResetPassword) {
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
          if (window.location.hash && !showResetPassword) {
            window.history.replaceState(null, '', '/auth');
          }

          if (error) {
            if (import.meta.env.DEV) {
              console.error('Error checking profile:', error);
            }
          }

          if (!profile || !profile.role) {
            // No profile found or no role set - redirect to role selection
            navigate('/select-role', { replace: true });
          } else {
            // Profile exists with role - redirect to home
            navigate('/', { replace: true });
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error checking profile:', error);
          }
          // On error, redirect to role selection to be safe
          navigate('/select-role', { replace: true });
        }
      };

      // Small delay to ensure session is fully processed
      setTimeout(checkProfile, hasAccessToken ? 500 : 200);
    }
    
    // If we have an access token but user isn't set yet, wait a bit more
    if (hasAccessToken && authLoading && !showResetPassword) {
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
        toast.success('Account created successfully! Please check your email to verify your account.');
        // Reset form
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
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
              {showResetPassword ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {showResetPassword 
                ? 'Enter your new password below'
                : isLogin 
                ? 'Sign in to continue to ShikshAq' 
                : 'Join ShikshAq to find the best tutors'
              }
            </p>

            {/* Google Button - Hide when resetting password */}
            {!showResetPassword && (
              <>
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

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
              </>
            )}

            {/* Reset Password Form */}
            {showResetPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.confirmNewPassword ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmNewPassword && (
                    <p className="text-sm text-destructive">{errors.confirmNewPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            ) : (
              /* Regular Sign In/Sign Up Form */
              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              {/* Full Name - Only for Sign Up */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              {!showForgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setErrors({});
                          setFormData({ ...formData, password: '' });
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Forgot Password Form */}
              {showForgotPassword && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgotEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgotEmail"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setErrors({});
                        setFormData({ ...formData, email: '' });
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={handleForgotPassword}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    We'll send you a link to reset your password
                  </p>
                </div>
              )}

              {/* Confirm Password - Only for Sign Up */}
              {!isLogin && !showForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!showForgotPassword && (
                <Button type="submit" className="w-full h-12" disabled={loading}>
                  {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
                </Button>
              )}
            </form>
            )}

            {/* Toggle between Sign In and Sign Up */}
            {!showResetPassword && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setFormData({ fullName: '', email: '', password: '', confirmPassword: '', newPassword: '', confirmNewPassword: '' });
                  }}
                  className="text-foreground font-medium hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
