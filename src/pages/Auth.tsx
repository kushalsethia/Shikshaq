import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, GraduationCap, Users } from 'lucide-react';
import { z } from 'zod';
import { Logo } from '@/components/Logo';

const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'guardian'], {
    required_error: 'Please select whether you are a student or guardian',
  }),
});

type SignInStep = 'email' | 'password' | 'otp' | 'setPassword' | 'role' | 'magicLinkSent';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [processingOAuth, setProcessingOAuth] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // New sign-in flow states
  const [signInStep, setSignInStep] = useState<SignInStep>('email');
  const [emailExists, setEmailExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    role: '' as 'student' | 'guardian' | '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { 
    signInWithGoogle, 
    signInWithEmail,
    signUpWithEmail, 
    resetPasswordForEmail, 
    updatePassword,
    checkEmailExists,
    checkPasswordExists,
    sendOTP,
    verifyOTP,
    user, 
    loading: authLoading 
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for password reset token in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    if (type === 'reset-password') {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const typeParam = hashParams.get('type');
      
      if (accessToken && typeParam === 'recovery') {
        setIsResetPassword(true);
        setIsLogin(false);
        setIsForgotPassword(false);
      }
    }
  }, [location]);

  // Handle OAuth callback and redirect if authenticated
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAccessToken = hashParams.get('access_token');
    const hasError = hashParams.get('error');
    const typeParam = hashParams.get('type');
    
    if (isResetPassword || typeParam === 'recovery') {
      return;
    }
    
    if (hasAccessToken) {
      setProcessingOAuth(true);
    }
    
    if (hasError) {
      const errorDescription = hashParams.get('error_description') || 'Authentication failed';
      toast.error(`OAuth Error: ${errorDescription}`);
      setProcessingOAuth(false);
      window.history.replaceState(null, '', '/auth');
      return;
    }
    
    if (!authLoading && user) {
      setProcessingOAuth(false);
      
      const checkProfile = async () => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', user.id)
            .maybeSingle();

          if (window.location.hash) {
            window.history.replaceState(null, '', '/auth');
          }

          if (error) {
            console.error('Error checking profile:', error);
          }

          if (!profile || !profile.role) {
            navigate('/select-role', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          navigate('/select-role', { replace: true });
        }
      };

      setTimeout(checkProfile, hasAccessToken ? 500 : 200);
    }
    
    if (hasAccessToken && authLoading) {
      const waitTimer = setTimeout(() => {
        if (!user) {
          setProcessingOAuth(false);
          toast.error('Authentication timed out. Please try again.');
          window.history.replaceState(null, '', '/auth');
        }
      }, 3000);
      return () => clearTimeout(waitTimer);
    }
  }, [user, authLoading, navigate, isResetPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Step 1: Check email for sign-in
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      setLoading(false);
      return;
    }

    try {
      const { exists, error } = await checkEmailExists(formData.email);
      if (error) {
        setErrors({ email: 'Error checking email. Please try again.' });
        setLoading(false);
        return;
      }

      if (exists) {
        setEmailExists(true);
        
        // Check if user has a password set by trying to sign in with a dummy password
        // If we get "Invalid login credentials", password exists
        // If we get other errors, password might not exist
        let hasPassword = false;
        try {
          const { error: passwordCheckError } = await signInWithEmail(
            formData.email, 
            'dummy_check_password_12345!@#$%'
          );
          
          if (passwordCheckError) {
            if (passwordCheckError.message.includes('Invalid login credentials')) {
              // Password exists (just wrong password)
              hasPassword = true;
              setShowPasswordReset(false);
            } else if (passwordCheckError.message.includes('Email not confirmed')) {
              // User exists but email not confirmed - assume password exists
              hasPassword = true;
              setShowPasswordReset(false);
            } else {
              // Might not have password set - will send magic link to set password
              hasPassword = false;
            }
          } else {
            // Unlikely but if it works, password exists
            hasPassword = true;
            setShowPasswordReset(false);
          }
        } catch {
          // On error, assume no password - will send magic link to set password
          hasPassword = false;
        }
        
        if (hasPassword) {
          // Password exists - show normal login
          setSignInStep('password');
        } else {
          // No password - For OAuth users, we need to verify identity first with OTP
          // Then they can set their password
          setLoading(true);
          try {
            // Try resetPasswordForEmail first (works for users who had passwords)
            const { error: resetError } = await resetPasswordForEmail(formData.email);
            
            if (resetError) {
              // resetPasswordForEmail likely failed because user is OAuth-only (no password)
              // Fall back to OTP verification, then password setup
              console.log('resetPasswordForEmail failed (likely OAuth user):', resetError.message);
              
              const { error: otpError } = await sendOTP(formData.email);
              if (otpError) {
                console.error('sendOTP error:', otpError);
                setErrors({ 
                  email: `Unable to send password setup link. Error: ${otpError.message}. Please try using "Forgot password" or contact support.` 
                });
                setLoading(false);
              } else {
                // OTP sent successfully - show OTP verification step
                setOtpSent(true);
                setSignInStep('otp');
                setShowPasswordReset(true); // Flag that this is for password setup
                toast.success('Verification code sent to your email! Please verify to set your password.');
                setLoading(false);
              }
            } else {
              // resetPasswordForEmail succeeded - magic link sent
              setResetEmailSent(true);
              setSignInStep('magicLinkSent');
              toast.success('Password setup link sent to your email!');
              setLoading(false);
            }
          } catch (error: any) {
            console.error('Error in password setup flow:', error);
            setErrors({ 
              email: error.message || 'Failed to send password setup link. Please try "Forgot password" or contact support.' 
            });
            setLoading(false);
          }
        }
      } else {
        setErrors({ email: 'No account found with this email. Please sign up instead.' });
      }
    } catch (error: any) {
      setErrors({ email: error.message || 'Error checking email' });
    } finally {
      setLoading(false);
    }
  };

  // Normal email/password login (when user has password set)
  const handleNormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.password) {
      setErrors({ password: 'Please enter your password' });
      setLoading(false);
      return;
    }

    const passwordResult = passwordSchema.safeParse(formData.password);
    if (!passwordResult.success) {
      setErrors({ password: passwordResult.error.errors[0].message });
      setLoading(false);
      return;
    }

    try {
      // Try normal login first
      const { error } = await signInWithEmail(formData.email, formData.password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Invalid email or password' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ email: 'Please verify your email before signing in' });
        } else {
          setErrors({ password: error.message });
        }
        setLoading(false);
      } else {
        // Login successful, check role
        toast.success('Welcome back!');
        
        // Small delay to ensure user is set
        setTimeout(async () => {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', currentUser.id)
              .maybeSingle();

            if (!profile || !profile.role) {
              setSignInStep('role');
            } else {
              navigate('/', { replace: true });
            }
          } else {
            navigate('/', { replace: true });
          }
        }, 200);
      }
    } catch (error: any) {
      setErrors({ password: error.message || 'Failed to sign in' });
      setLoading(false);
    }
  };

  // Step 4: Set new password (after OTP verification)
  const handleSetPasswordAndCompleteLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.newPassword || !formData.confirmPassword) {
      setErrors({ 
        newPassword: !formData.newPassword ? 'Please enter a new password' : '',
        confirmPassword: !formData.confirmPassword ? 'Please confirm your password' : '',
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

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      // User is already authenticated after OTP verification, so we can update password directly
      const { error: updateError } = await updatePassword(formData.newPassword);
      if (updateError) {
        setErrors({ newPassword: updateError.message || 'Failed to set password' });
        setLoading(false);
        return;
      }

      toast.success('Password set successfully!');
      
      // Wait a moment for password to be updated, then check role
      setTimeout(async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentUser.id)
            .maybeSingle();

          if (!profile || !profile.role) {
            setSignInStep('role');
          } else {
            navigate('/', { replace: true });
          }
        } else {
          navigate('/', { replace: true });
        }
      }, 500);
    } catch (error: any) {
      setErrors({ newPassword: error.message || 'Something went wrong' });
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!otpValue || otpValue.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await verifyOTP(formData.email, otpValue);
      if (error) {
        setErrors({ otp: error.message || 'Invalid OTP. Please try again.' });
        setLoading(false);
        return;
      }

      // OTP verified successfully
      toast.success('OTP verified!');
      setOtpVerified(true);
      
      // If this is for password reset flow (no password exists), move to set password step
      if (showPasswordReset) {
        setSignInStep('setPassword');
      } else {
        // Normal login flow - check if role is set
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user?.id || '')
          .maybeSingle();

        if (!profile || !profile.role) {
          setSignInStep('role');
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error: any) {
      setErrors({ otp: error.message || 'Failed to verify OTP' });
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Select role if not set
  const handleRoleSelection = async (role: 'student' | 'guardian') => {
    if (!user) {
      toast.error('Session expired. Please sign in again.');
      resetSignInFlow();
      return;
    }

    if (!termsAgreed) {
      toast.error('Please agree to the Terms and Privacy Policy to continue');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          terms_agreement: true 
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to set role. Please try again.');
        setLoading(false);
        return;
      }

      toast.success('Welcome to ShikshAq!');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSignInFlow = () => {
    setSignInStep('email');
    setEmailExists(false);
    setOtpSent(false);
    setShowPasswordReset(false);
    setOtpVerified(false);
    setTermsAgreed(false);
    setOtpValue('');
    setResetEmailSent(false);
    setFormData({ ...formData, newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.email) {
      setErrors({ email: 'Please enter your email address' });
      setLoading(false);
      return;
    }

    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      setLoading(false);
      return;
    }

    try {
      const { error } = await resetPasswordForEmail(formData.email);
      if (error) {
        setErrors({ email: error.message || 'Failed to send reset email' });
      } else {
        setResetEmailSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error: any) {
      setErrors({ email: error.message || 'Failed to send reset email' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.newPassword || !formData.confirmPassword) {
      setErrors({ 
        newPassword: !formData.newPassword ? 'Please enter a new password' : '',
        confirmPassword: !formData.confirmPassword ? 'Please confirm your password' : '',
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(formData.newPassword);
      if (error) {
        setErrors({ newPassword: error.message || 'Failed to update password' });
        setLoading(false);
      } else {
        toast.success('Password set successfully!');
        
        // Check if user is authenticated (they should be after clicking magic link)
        setTimeout(async () => {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            // User is authenticated, check role and redirect
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', currentUser.id)
              .maybeSingle();

            if (!profile || !profile.role) {
              navigate('/select-role', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          } else {
            // Not authenticated, ask them to sign in
            toast.success('Password set successfully! Please sign in.');
            setIsResetPassword(false);
            setIsLogin(true);
            resetSignInFlow();
            setFormData({ fullName: '', email: '', password: '', newPassword: '', confirmPassword: '', role: '' });
            setErrors({});
          }
        }, 500);
      }
    } catch (error: any) {
      setErrors({ newPassword: error.message || 'Failed to update password' });
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!termsAgreed) {
      setErrors({ terms: 'Please agree to the Terms and Privacy Policy to continue' });
      setLoading(false);
      return;
    }

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

    // Note: We don't pre-check email existence because:
    // 1. Supabase Auth uses soft deletes - deleted users still reserve their email
    // 2. We let Supabase handle the validation and show appropriate errors
    // 3. This allows proper handling of soft-deleted vs active users
    
    try {
      const { error } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role as 'student' | 'guardian',
        true // terms_agreement
      );
      if (error) {
        // Supabase will return specific errors for duplicate emails
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') ||
            error.message.includes('User already registered') ||
            error.message.includes('email address has already been registered')) {
          setErrors({ 
            email: 'An account already exists with this email. Please use a different email or use forgot password.' 
          });
        } else {
          toast.error(error.message);
        }
        setLoading(false);
      } else {
        toast.success('Account created successfully!');
        setTimeout(() => {
          navigate('/signup-success', { replace: true });
        }, 500);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
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
              {isLogin 
                ? signInStep === 'email' 
                  ? 'Welcome back' 
                  : signInStep === 'password'
                  ? 'Sign in'
                  : signInStep === 'otp'
                  ? 'Verify your email'
                  : signInStep === 'setPassword'
                  ? 'Set your password'
                  : signInStep === 'magicLinkSent'
                  ? 'Check your email'
                  : 'Complete your profile'
                : 'Create your account'
              }
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {isLogin 
                ? signInStep === 'email'
                  ? 'Sign in to continue to ShikshAq'
                  : signInStep === 'password'
                  ? 'Enter your password to sign in'
                  : signInStep === 'otp'
                  ? 'Enter the OTP sent to your email to verify your identity'
                  : signInStep === 'setPassword'
                  ? 'Set a new password for your account'
                  : signInStep === 'magicLinkSent'
                  ? 'We already have a login with your account. Please use the link sent to your email to create your password.'
                  : 'Select your role to continue'
                : 'Join ShikshAq to find the best tutors'
              }
            </p>

            {/* Google Button - Hide for forgot/reset password and OTP/role steps */}
            {!isForgotPassword && !isResetPassword && signInStep === 'email' && (
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

            {/* Forgot Password Success Message */}
            {resetEmailSent && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground text-center">
                  <strong>Check your email!</strong> We've sent a password reset link to {formData.email}
                </p>
              </div>
            )}

            {/* Form */}
            <form 
              onSubmit={
                isResetPassword 
                  ? handleResetPassword 
                  : isForgotPassword 
                  ? handleForgotPassword
                  : isLogin
                  ? signInStep === 'email'
                    ? handleEmailCheck
                    : signInStep === 'otp'
                    ? handleVerifyOTP
                    : signInStep === 'setPassword'
                    ? handleSetPasswordAndCompleteLogin
                    : undefined
                  : handleSignUp
              } 
              className="space-y-4"
            >
              {/* Reset Password Form */}
              {isResetPassword ? (
                <>
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
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </>
              ) : isForgotPassword ? (
                <>
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

                  <Button type="submit" className="w-full h-12" disabled={loading || resetEmailSent}>
                    {loading ? 'Sending...' : resetEmailSent ? 'Email Sent!' : 'Send Reset Link'}
                  </Button>
                </>
              ) : isLogin ? (
                <>
                  {/* Step 1: Email */}
                  {signInStep === 'email' && (
                    <>
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

                      <Button type="submit" className="w-full h-12" disabled={loading}>
                        {loading ? 'Checking...' : 'Continue'}
                      </Button>
                    </>
                  )}

                  {/* Step 2a: Normal Password Login (if password exists) */}
                  {signInStep === 'password' && emailExists && !showPasswordReset && !otpSent && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !loading) {
                                handleNormalLogin(e as any);
                              }
                            }}
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

                      <Button 
                        type="button" 
                        onClick={handleNormalLogin}
                        className="w-full h-12" 
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Sign in'}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={resetSignInFlow}
                      >
                        Back
                      </Button>

                      <p className="text-center text-sm mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Switch to forgot password flow
                            setIsForgotPassword(true);
                            setIsLogin(true);
                            resetSignInFlow();
                            setErrors({});
                          }}
                          className="text-foreground font-medium hover:underline"
                        >
                          Forgot password?
                        </button>
                      </p>
                    </>
                  )}


                  {/* Step 3: OTP Verification (for password setup flow) */}
                  {signInStep === 'otp' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <InputOTP
                          maxLength={6}
                          value={otpValue}
                          onChange={(value) => {
                            setOtpValue(value);
                            setErrors({ ...errors, otp: '' });
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        {errors.otp && (
                          <p className="text-sm text-destructive">{errors.otp}</p>
                        )}
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Verification code sent to {formData.email}
                          {showPasswordReset && (
                            <span className="block mt-1">After verification, you'll set your password.</span>
                          )}
                        </p>
                      </div>

                      <Button type="submit" className="w-full h-12" disabled={loading || otpValue.length !== 6}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          resetSignInFlow();
                        }}
                      >
                        Back
                      </Button>

                      <Button
                        type="button"
                        variant="link"
                        className="w-full text-sm"
                        onClick={async () => {
                          const { error } = await sendOTP(formData.email);
                          if (error) {
                            toast.error('Failed to resend OTP');
                          } else {
                            toast.success('OTP resent!');
                          }
                        }}
                      >
                        Resend OTP
                      </Button>
                    </>
                  )}

                  {/* Magic Link Sent Message (for Google Auth users) */}
                  {signInStep === 'magicLinkSent' && (
                    <>
                      <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm text-foreground text-center">
                          <strong>Check your email!</strong> We've sent a password setup link to <strong>{formData.email}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Click the link in the email to set your password and complete your login.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const { error: resendError } = await resetPasswordForEmail(formData.email);
                            if (resendError) {
                              toast.error('Failed to resend link');
                            } else {
                              toast.success('Password setup link resent!');
                            }
                          } catch (error) {
                            toast.error('Failed to resend link');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? 'Sending...' : 'Resend Link'}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={resetSignInFlow}
                      >
                        Back
                      </Button>
                    </>
                  )}

                  {/* Step 4: Set New Password (after OTP verification or magic link) */}
                  {signInStep === 'setPassword' && (otpVerified || isResetPassword) && (
                    <>
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
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <Button 
                        type="button" 
                        onClick={handleSetPasswordAndCompleteLogin}
                        className="w-full h-12" 
                        disabled={loading}
                      >
                        {loading ? 'Setting password...' : 'Set Password & Continue'}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setSignInStep('otp');
                          setOtpValue('');
                          setOtpVerified(false);
                        }}
                      >
                        Back
                      </Button>
                    </>
                  )}

                  {/* Step 4: Role Selection */}
                  {signInStep === 'role' && (
                    <>
                      <div className="space-y-3">
                        <Label>I am a...</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, role: 'student' });
                              setErrors({ ...errors, role: '' });
                            }}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                              formData.role === 'student'
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <GraduationCap className="w-6 h-6 mb-2" />
                            <span className="font-medium">Student</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, role: 'guardian' });
                              setErrors({ ...errors, role: '' });
                            }}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                              formData.role === 'guardian'
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <Users className="w-6 h-6 mb-2" />
                            <span className="font-medium">Guardian</span>
                          </button>
                        </div>
                        {errors.role && (
                          <p className="text-sm text-destructive">{errors.role}</p>
                        )}
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms-agreement-auth"
                          checked={termsAgreed}
                          onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                          className="mt-1"
                        />
                        <Label
                          htmlFor="terms-agreement-auth"
                          className="text-sm font-normal leading-relaxed cursor-pointer"
                        >
                          I agree to the{' '}
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            className="text-primary hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Terms
                          </Link>
                          {' '}and{' '}
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            className="text-primary hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Privacy Policy
                          </Link>
                          {' '}to connect with teachers.
                        </Label>
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          if (!formData.role) {
                            toast.error('Please select a role');
                            return;
                          }
                          handleRoleSelection(formData.role as 'student' | 'guardian');
                        }}
                        disabled={loading || !formData.role || !termsAgreed}
                        className="w-full h-12"
                      >
                        {loading ? 'Saving...' : 'Continue'}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Sign Up Form */}
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

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
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

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, role: 'student' });
                          setErrors({ ...errors, role: '' });
                        }}
                        className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                          formData.role === 'student'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        } ${errors.role ? 'border-destructive' : ''}`}
                      >
                        <GraduationCap className="w-6 h-6 mb-2" />
                        <span className="font-medium">Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, role: 'guardian' });
                          setErrors({ ...errors, role: '' });
                        }}
                        className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                          formData.role === 'guardian'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        } ${errors.role ? 'border-destructive' : ''}`}
                      >
                        <Users className="w-6 h-6 mb-2" />
                        <span className="font-medium">Guardian</span>
                      </button>
                    </div>
                    {errors.role && (
                      <p className="text-sm text-destructive">{errors.role}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms-agreement-signup"
                      checked={termsAgreed}
                      onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="terms-agreement-signup"
                      className="text-sm font-normal leading-relaxed cursor-pointer"
                    >
                      I agree to the{' '}
                      <Link
                        to="/privacy-policy"
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms
                      </Link>
                      {' '}and{' '}
                      <Link
                        to="/privacy-policy"
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                      {' '}to connect with teachers.
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-destructive">{errors.terms}</p>
                  )}

                  <Button type="submit" className="w-full h-12" disabled={loading || !termsAgreed}>
                    {loading ? 'Please wait...' : 'Create account'}
                  </Button>
                </>
              )}
            </form>

            {/* Toggle / Forgot Password Link */}
            {isResetPassword ? (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPassword(false);
                    setIsLogin(true);
                    resetSignInFlow();
                    setFormData({ fullName: '', email: '', password: '', newPassword: '', confirmPassword: '', role: '' });
                    window.history.replaceState(null, '', '/auth');
                  }}
                  className="text-foreground font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : isForgotPassword ? (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsLogin(true);
                    setResetEmailSent(false);
                    resetSignInFlow();
                    setFormData({ fullName: '', email: '', password: '', newPassword: '', confirmPassword: '', role: '' });
                  }}
                  className="text-foreground font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <>
                {isLogin && signInStep === 'email' && (
                  <p className="text-center text-sm mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        resetSignInFlow();
                        setErrors({});
                      }}
                      className="text-foreground font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  </p>
                )}
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {isLogin && signInStep === 'email' 
                    ? "Don't have an account? " 
                    : !isLogin 
                    ? 'Already have an account? ' 
                    : ''
                  }
                  {isLogin && signInStep === 'email' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false);
                        resetSignInFlow();
                        setErrors({});
                        setFormData({ fullName: '', email: '', password: '', newPassword: '', confirmPassword: '', role: '' });
                      }}
                      className="text-foreground font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  )}
                  {!isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        resetSignInFlow();
                        setErrors({});
                        setFormData({ fullName: '', email: '', password: '', newPassword: '', confirmPassword: '', role: '' });
                      }}
                      className="text-foreground font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
