import { Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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

export function SignInSheet({
  open,
  onOpenChange,
  intent = "message",
  teacherName,
}: SignInSheetProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    saveAuthRedirect(location.pathname);
    navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-0 pb-8 pt-6">
        <SheetHeader className="items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue-subtle text-brand-blue-deep">
            <Lock size={20} strokeWidth={2.2} aria-hidden="true" />
          </span>
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
          <Button variant="primary" size={52} onClick={handleSignIn}>
            Continue to sign in
          </Button>
          <Button variant="ghost" size={44} onClick={() => onOpenChange(false)}>
            Not now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
