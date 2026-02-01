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
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
  const [processingOAuth, setProcessingOAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    updatePassword,
    checkUserHasPassword,
    user, 
    loading: authLoading 
  } = useAuth();
  const navigate = useNavigate();
  
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [userHasPassword, setUserHasPassword] = useState<boolean | null>(null);

  // Check if authenticated user has password
  useEffect(() => {
    const checkPassword = async () => {
      if (user?.email) {
        const { hasPassword } = await checkUserHasPassword(user.email);
        setUserHasPassword(hasPassword);
        // Show set password form if user doesn't have password and is on auth page
        if (!hasPassword && window.location.pathname === '/auth') {
          setShowSetPassword(true);
        }
      }
    };
    
    if (user && !authLoading) {
      checkPassword();
    } else if (!user) {
      // Reset when user signs out
      setShowSetPassword(false);
      setUserHasPassword(null);
    }
  }, [user, authLoading, checkUserHasPassword]);

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
    
    // If user becomes authenticated (from OAuth or email/password)
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

          // Check if user has password - if not, show set password form instead of redirecting
          const { hasPassword } = await checkUserHasPassword(user.email || '');
          setUserHasPassword(hasPassword);
          
          if (!hasPassword) {
            // User doesn't have password - show set password form
            setShowSetPassword(true);
            setProcessingOAuth(false);
            return; // Don't redirect, let them set password
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
        if (error.message.includes('already exists')) {
          setErrors({ email: error.message });
        } else {
          toast.error(error.message);
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
        if (error.message.includes('Google')) {
          setErrors({ email: error.message });
        } else if (error.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Invalid email or password' });
        } else {
          setErrors({ email: error.message });
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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.newPassword || !formData.confirmNewPassword) {
      setErrors({ 
        newPassword: !formData.newPassword ? 'Please enter a new password' : '',
        confirmNewPassword: !formData.confirmNewPassword ? 'Please confirm your password' : '',
      });
      setLoading(false);
      return;
    }

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
        setErrors({ newPassword: error.message || 'Failed to set password' });
        setLoading(false);
      } else {
        toast.success('Password set successfully! You can now sign in with email and password.');
        setShowSetPassword(false);
        setUserHasPassword(true);
        setFormData({ ...formData, newPassword: '', confirmNewPassword: '' });
        setErrors({});
        setLoading(false);
      }
    } catch (error: any) {
      setErrors({ newPassword: error.message || 'Failed to set password' });
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
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {isLogin 
                ? 'Sign in to continue to ShikshAq' 
                : 'Join ShikshAq to find the best tutors'
              }
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

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Form */}
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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

              {/* Confirm Password - Only for Sign Up */}
              {!isLogin && (
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

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            {/* Toggle between Sign In and Sign Up */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({ ...formData, fullName: '', email: '', password: '', confirmPassword: '' });
                }}
                className="text-foreground font-medium hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Set Password Section - Show for authenticated users without password */}
          {user && !userHasPassword && showSetPassword && (
            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border mt-6">
              <h2 className="text-xl font-serif text-foreground text-center mb-2">
                Set a Password
              </h2>
              <p className="text-muted-foreground text-center mb-6 text-sm">
                Set a password to sign in with email and password in the future
              </p>

              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm Password</Label>
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
                  {loading ? 'Setting password...' : 'Set Password'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowSetPassword(false)}
                >
                  Skip for now
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
