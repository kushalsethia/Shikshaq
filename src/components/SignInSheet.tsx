import * as React from "react";
import { Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconDisc } from "@/components/ui/icon-disc";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { useAuth } from "@/lib/auth-context";
import { saveAuthRedirect } from "@/utils/authRedirect";

/* design.md §3 — "WhatsApp tap (signed out): soft sheet slides up — never a
   route change; after auth, continue straight to the redirect that was
   tapped." Same behaviour covers the save/heart tap. This is the one shared
   sheet used everywhere a signed-out visitor triggers a gated action, so the
   redirect-continuation logic lives in one place. */

interface SignInSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the visitor was trying to do — shapes the copy only. */
  intent?: "message" | "save";
  /**
   * Who they were trying to reach. account-02-whatsapp-gate.png titles this
   * sheet "Message Anirban Ghosh", and micro-02's copy rule says the same in
   * different words: "One tap, then you are talking to Anjali — names the
   * teacher". The sheet said only "Sign in to message teachers", so someone who
   * tapped Message on Kavita's profile got a generic prompt that never
   * mentioned Kavita — dropping the one piece of context that makes the
   * interruption feel like part of the thing they asked for.
   *
   * Optional: callers that genuinely have no single teacher in view (none
   * today) fall back to the generic wording rather than inventing a name.
   */
  teacherName?: string | null;
}

/* Google's four brand colours, monochrome "G" from account-02's mockup swapped
   for the real mark — same treatment Auth.tsx uses for its own Google button. */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function SignInSheet({
  open,
  onOpenChange,
  intent = "message",
  teacherName,
}: SignInSheetProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle } = useAuth();
  const [googleBusy, setGoogleBusy] = React.useState(false);

  const isMessage = intent === "message";

  const handleSignIn = () => {
    saveAuthRedirect(location.pathname);
    navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
  };

  const handleGoogle = async () => {
    saveAuthRedirect(location.pathname);
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
      // signInWithGoogle redirects the browser via Supabase OAuth; on return,
      // Auth.tsx reads getAuthRedirect() and lands the user back where they tapped.
    } catch {
      setGoogleBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-0 pb-8 pt-6">
        <SheetHeader className="items-center text-center">
          {/* account-02-whatsapp-gate.png: a green WhatsApp disc names the
              channel for a message gate; the save/heart gate keeps the
              original lock-in-blue treatment, which the mockup doesn't cover. */}
          {isMessage ? (
            <IconDisc tone="whatsapp" size={44} shape="circle">
              <WhatsAppIcon className="h-5 w-5" />
            </IconDisc>
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue-subtle text-brand-blue-deep">
              <Lock size={20} strokeWidth={2.2} aria-hidden="true" />
            </span>
          )}
          <SheetTitle className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
            {teacherName
              ? intent === "message"
                ? `Message ${teacherName}`
                : `Save ${teacherName}`
              : `Sign in to ${intent === "message" ? "message teachers" : "save this teacher"}`}
          </SheetTitle>
          <p className="mt-1 max-w-[36ch] text-sm text-warm-prose">
            {teacherName && intent === "message"
              ? "Sign in once and we'll open WhatsApp straight away. It takes a tap, and teachers see a real name instead of an unknown number."
              : "Browsing is open to everyone. Messaging and saving need an account, so teachers know every enquiry is real."}
          </p>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-3">
          {isMessage ? (
            <>
              {/* Bone Google button, per account-02-whatsapp-gate.png: white
                  fill with a hairline ring, not the indigo (papers-mode)
                  colour — this sheet is a contact/WhatsApp gate, and
                  design.md §0.6 reserves indigo for papers. */}
              <Button
                variant="muted"
                size={54}
                busy={googleBusy}
                onClick={handleGoogle}
                className="w-full bg-card text-foreground shadow-border hover:bg-card"
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              <Button variant="whatsapp" size={54} onClick={handleSignIn} className="w-full">
                <WhatsAppIcon className="h-4 w-4" />
                Continue to WhatsApp
              </Button>
              <Button variant="ghost" size={44} onClick={() => onOpenChange(false)}>
                Maybe later
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size={52} onClick={handleSignIn}>
                Continue to sign in
              </Button>
              <Button variant="ghost" size={44} onClick={() => onOpenChange(false)}>
                Not now
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
