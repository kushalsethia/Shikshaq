import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Sticker } from '@/components/ui/sticker';
import { Button } from '@/components/ui/button';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { getAuthRedirect, clearAuthRedirect } from '@/utils/authRedirect';

/* C-044 — "Success is an orange slab with a ghosted check, a 'You're in' sticker, and a green
   button that resumes the exact message the user was about to send." The saved-intent handoff
   (design.md §6.5 / gate-sheet.tsx) is what actually resumes the right destination: the primary
   CTA reads getAuthRedirect() and, if the user tapped WhatsApp before signing in, that redirect
   target IS /tuition-teachers/:slug/whatsapp-click — the interstitial that reopens WhatsApp with
   the message already composed. Never drops back to a generic home page when an intent exists. */
export default function SignUpSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const redirectTo = getAuthRedirect();
  const hasIntent = Boolean(redirectTo && redirectTo !== '/');

  const handleContinue = () => {
    clearAuthRedirect();
    navigate(redirectTo || '/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
        <div className="relative w-full max-w-[440px]">
          {/* Orange slab, ghosted check, "You're in" sticker */}
          <div className="relative overflow-visible rounded-3xl bg-brand p-6 text-center text-brand-foreground shadow-glow-brand sm:p-8">
            <Sticker tone="dark" tilt={-3} size={30}>
              You're in
            </Sticker>
            <CheckCircle
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-6 h-28 w-28 text-brand-foreground/15"
              strokeWidth={1.25}
            />
            <Logo size="lg" className="mx-auto mb-4 brightness-0 invert" />
            <h1 className="font-display text-display-hero leading-tight tracking-tight">You're in.</h1>
            <p className="mt-2 text-body-secondary opacity-90">
              {hasIntent
                ? 'Resume the exact message you were about to send.'
                : "Welcome to ShikshAQ — glad you're here."}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-card p-6 shadow-border text-left sm:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0 rounded-full bg-brand-blue-subtle p-3">
                <Mail className="h-5 w-5 text-brand-blue" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Verify your email</h2>
                <p className="mt-2 text-body-secondary text-warm-prose">
                  We've sent a verification email to{' '}
                  <strong className="text-foreground">{user.email}</strong>. Check your inbox and
                  click the link to activate your account.
                </p>
                <p className="mt-3 text-meta text-warm-meta">
                  Didn't receive it? Check spam, or try signing in again to resend.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant={hasIntent ? 'whatsapp' : 'primary'} size={54} onClick={handleContinue} className="w-full">
              {hasIntent ? 'Continue to WhatsApp' : 'Continue to home'}
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              to="/auth"
              className="flex min-h-[50px] w-full items-center justify-center rounded-lg bg-card text-base font-semibold text-foreground shadow-border transition-transform duration-150 active:scale-[0.98]"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </main>

      <PreFooter variant={preFooterFor('/signup-success')} />
      <Footer />
    </div>
  );
}
