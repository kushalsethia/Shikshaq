import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BentoPanel } from '@/components/layout/PageContainer';
import { getAuthRedirect, clearAuthRedirect } from '@/utils/authRedirect';

/* SS-001 — one full-height mint confirmation panel. The saved-intent handoff
   (gate-sheet.tsx) is what actually resumes the right destination: the
   primary CTA reads getAuthRedirect() and, if the user tapped WhatsApp before
   signing in, that redirect target IS /tuition-teachers/:slug/whatsapp-click
   — the interstitial that reopens WhatsApp with the message already
   composed. Never drops back to a generic home page when an intent exists.

   ⚠ "Resend the email" replaces the old "Back to sign in" link — SS-001
   requires exactly two actions (a way forward, a way to resend), and there
   was no resend handler anywhere in the codebase to reuse, so this adds one:
   `supabase.auth.resend({ type: 'signup', email })` is the standard Supabase
   Auth call for exactly this, not a guess about unknown business logic. */
export default function SignUpSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

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

  const handleResend = async () => {
    if (!user.email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: user.email });
      if (error) {
        toast.error(error.message || 'Failed to resend the email. Please try again.');
      } else {
        toast.success('Verification email resent. Check your inbox.');
      }
    } catch {
      toast.error('Failed to resend the email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <BentoPanel fill="mint" edge="top" className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
      <div className="w-full max-w-[400px]">
        <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#34B268]">
          <Check className="h-[34px] w-[34px] text-white" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <h1 className="mt-[22px] font-display text-[34px] font-black leading-[1.02] tracking-[-0.045em] text-[#24603D]">
          {hasIntent ? 'Account ready. Back to where you were.' : "You're in."}
        </h1>

        <h2 className="mt-3.5 text-[16px] font-bold text-foreground">Verify your email</h2>
        <p className="mt-1.5 text-[14.5px] leading-[1.55] text-[#3E6F53]">
          We've sent a verification email to <strong className="font-bold">{user.email}</strong>. Check your inbox and click the link to activate your account.
        </p>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#3E6F53]/80">
          Didn't receive it? Check spam, or resend it below.
        </p>

        <div className="mt-6 flex flex-col items-center gap-1">
          <Button variant="dark" size={54} onClick={handleContinue} className="w-full">
            {hasIntent ? 'Continue to WhatsApp' : 'Continue to home'}
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex min-h-11 items-center justify-center px-4 text-[14px] font-semibold text-[#3E6F53] disabled:opacity-60"
          >
            {resending ? 'Resending…' : 'Resend the email'}
          </button>
        </div>
      </div>
    </BentoPanel>
  );
}
