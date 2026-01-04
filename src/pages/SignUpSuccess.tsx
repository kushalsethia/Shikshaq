import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function SignUpSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to auth
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
              Account Created Successfully!
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome to ShikshAq
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border space-y-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3 mt-1">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h2 className="font-semibold text-foreground mb-2">
                  Verify Your Email
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  We've sent a verification email to <strong>{user.email}</strong>. Please check your inbox and click the verification link to activate your account.
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try signing in again to resend.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full gap-2"
              size="lg"
            >
              Continue to Home
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/auth">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

