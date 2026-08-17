import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
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

  // Redesign S19 "Sign-up success" (design.md §1, §6.5; changelog C-044) —
  // rebuilt from zero: giant ghosted ✓ glyph (not an outline icon), a -4°
  // "You're in" sticker, then the real verify-email card the app needs to
  // show (mockup omits it — Supabase requires email verification — kept per
  // "design wins, keep functionality" and styled in the mockup's language).
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
        <div className="relative w-full max-w-[440px]">
          <div className="relative overflow-hidden rounded-[26px] bg-brand p-[18px] text-brand-foreground shadow-glow-brand sm:p-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-[6px] -top-[14px] font-display text-[96px] font-black leading-none tracking-[-0.06em] text-brand-foreground/[0.16]"
            >
              &#10003;
            </span>
            <Sticker tone="dark" tilt={-4} size={26} className="!top-0 !right-0 relative mb-3 inline-flex">
              You're in
            </Sticker>
            <div className="relative mt-3 font-display text-2xl font-black leading-[1.1] tracking-[-0.04em]">
              {hasIntent ? 'Account ready. Back to where you were.' : "You're in."}
            </div>
            <p className="relative mt-2 text-[13.5px] leading-[1.55] text-brand-foreground/85">
              {hasIntent
                ? 'We saved the teacher you were about to message.'
                : "Welcome to ShikshAQ — glad you're here."}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-card p-6 text-left shadow-border sm:p-8">
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
