import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { StarburstBadge, CutPaperShape } from '@/components/devices';

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

      <main className="halftone-overlay-strong relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
        <CutPaperShape
          variant="star"
          color="hsl(var(--brand))"
          size={72}
          className="pointer-events-none absolute -left-2 top-10 hidden opacity-90 sm:block"
        />
        <CutPaperShape
          variant="blob"
          color="hsl(var(--brand-blue))"
          size={88}
          className="pointer-events-none absolute -right-4 bottom-10 hidden opacity-90 sm:block"
        />

        <div className="relative w-full max-w-[440px] text-center">
          <div className="mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
            <div className="relative mb-4 flex justify-center">
              {/* No semantic "success" token exists in the design system (see final report) —
                  nearest existing token used: mint background + foreground icon. */}
              <span className="sticker sticker-rotate-sm outline-offset-shadow animate-pop rounded-full bg-mint p-4">
                <CheckCircle className="w-10 h-10 text-foreground" />
              </span>
              <StarburstBadge
                color="hsl(var(--brand-blue))"
                size={58}
                tilt={10}
                className="absolute -right-3 -top-2 hidden sm:inline-grid"
              >
                Yay!
              </StarburstBadge>
            </div>
            <h1 className="font-display text-display-hero leading-tight tracking-tight text-foreground">
              You're{' '}
              <span className="marker-highlight marker-highlight--pill" style={{ ['--marker-color' as string]: 'hsl(var(--brand))' }}>
                in
              </span>
              !
            </h1>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              Welcome to Shikshaq — glad you're here.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-card shadow-border mb-6 text-left">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-brand-blue-subtle p-3 mt-0.5 shrink-0">
                <Mail className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  Verify your email
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                  We've sent a verification email to <strong className="text-foreground">{user.email}</strong>. Please check your inbox and click the verification link to activate your account.
                </p>
                <p className="text-xs leading-relaxed text-warm-meta">
                  Didn't receive the email? Check your spam folder or try signing in again to resend.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="active:scale-[0.98] transition-transform duration-150 w-full min-h-[50px] rounded-lg bg-foreground text-background text-base font-bold flex items-center justify-center gap-2"
            >
              Continue to home
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/auth"
              className="active:scale-[0.98] transition-transform duration-150 w-full min-h-[50px] rounded-lg bg-card shadow-border text-foreground text-base font-semibold flex items-center justify-center"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
