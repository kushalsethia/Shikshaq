import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { invalidateUserProfileCache } from '@/utils/cache';

export default function SelectRole() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'guardian' | ''>('');
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
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted) {
          if (profile && profile.role) {
            // User already has a role - redirect and mark as having role
            setHasRole(true);
            navigate('/', { replace: true });
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
  }, [user, authLoading, navigate]); // Only run when user or authLoading changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error('Please select whether you are a student or guardian');
      return;
    }

    if (!termsAgreed) {
      toast.error('Please agree to the Terms and Privacy Policy to continue');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to continue');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Update profile with role and terms agreement (use upsert in case profile already exists from Google Auth)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          role: role,
          terms_agreement: termsAgreed,
        }, {
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
      
      // Small delay to ensure cache is cleared, then redirect
      setTimeout(() => {
        navigate('/', { replace: true });
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
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-16 text-center md:pt-16">
          <p className="text-muted-foreground mb-4">You must be signed in to continue.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-4" />
            <h1 className="text-3xl font-serif text-foreground mb-2">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Please select whether you are a student or guardian
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">I am a...</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all ${
                    role === 'student'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <GraduationCap className="w-8 h-8 mb-3" />
                  <span className="font-medium text-lg">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('guardian')}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all ${
                    role === 'guardian'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Users className="w-8 h-8 mb-3" />
                  <span className="font-medium text-lg">Guardian</span>
                </button>
              </div>
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline underline">
                  Privacy Policy
                </a>
                {' '}to connect with teachers.
              </Label>
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading || !role || !termsAgreed}>
              {loading ? 'Creating Profile...' : 'Continue'}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

