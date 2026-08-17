import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconDisc } from "@/components/ui/icon-disc";
import { useAuth } from "@/lib/auth-context";
import { saveAuthRedirect } from "@/utils/authRedirect";

/* Redesign F3 (components.md §4, design.md §6.5).

   Two flavours, one component:
     - papers  · indigo, lock tile, three reasons, rights disclaimer
     - whatsapp· green, names the teacher

   Both remember the intent (via saveAuthRedirect — the same mechanism
   PaperReader / TeacherProfile already use) and replay it after sign-in:
   the caller passes `redirectTo`, this sheet stashes it in localStorage
   before handing off to /auth, and Auth.tsx's existing
   getAuthRedirect()/clearAuthRedirect() flow lands the user back on the
   exact paper or profile they asked for. Never fetches anything gated
   before auth completes — this sheet only ever offers sign-in actions.

   Copy is verbatim from copy.md §6 "Gate" and §7 "WhatsApp gate". */
export interface GateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where to land the user after a successful sign-in. */
  redirectTo: string;
  flavor: "papers" | "whatsapp";
  /** whatsapp flavor only — names the teacher per copy.md §7. */
  teacherFirstName?: string;
}

const PAPER_REASONS = [
  "Pick up where you left off, on any device",
  "Keep a shelf of the papers you are working through",
  "No payment, ever — papers stay free",
];

function GateSheet({ open, onOpenChange, redirectTo, flavor, teacherFirstName }: GateSheetProps) {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = React.useState(false);

  const goAuth = () => {
    saveAuthRedirect(redirectTo);
    navigate("/auth");
  };

  const handleGoogle = async () => {
    saveAuthRedirect(redirectTo);
    setBusy(true);
    try {
      await signInWithGoogle();
      // signInWithGoogle redirects the browser via Supabase OAuth; on return,
      // Auth.tsx reads getAuthRedirect() and lands the user on `redirectTo`.
    } catch {
      setBusy(false);
    }
  };

  const isPapers = flavor === "papers";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "max-h-[88dvh] overflow-y-auto rounded-t-[28px] border-0 p-6 sm:p-8",
          isPapers ? "bg-background" : "bg-background",
        )}
      >
        {/* Grab handle. */}
        <div aria-hidden className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

        {isPapers ? (
          <>
            <IconDisc tone="papers" size={44} shape="square" className="mb-4">
              <Lock size={20} strokeWidth={2.25} aria-hidden="true" />
            </IconDisc>

            <h2 className="text-page-title font-display font-bold text-foreground">
              Sign in to read this paper
            </h2>
            <p className="mt-2 max-w-prose text-body-secondary text-warm-prose">
              Free, and it takes one tap. Schools let us host their papers on the condition that
              readers are accounted for.
            </p>

            <ul className="mt-6 grid gap-2">
              {PAPER_REASONS.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-3 rounded-lg bg-muted px-4 py-3 text-body-secondary text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-blue" aria-hidden="true" />
                  <span className="break-words">{reason}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="indigo" size={54} busy={busy} onClick={handleGoogle} className="w-full">
                Continue with Google
              </Button>
              {/* copy.md's second option is "Use a phone number" — the app has
                  no phone-auth flow implemented (Auth.tsx offers Google and
                  email/password only), so this routes to the real /auth entry
                  point rather than promising a flow that does not exist. The
                  redirect intent is preserved the same way. */}
              <Button variant="muted" size={54} onClick={goAuth} className="w-full">
                More ways to sign in
              </Button>
            </div>

            <p className="mt-6 text-meta text-warm-meta">
              Papers belong to the schools that set them. ShikshAQ hosts them for reading only —
              no downloads, no reposting. We remove anything a school asks us to.
            </p>
          </>
        ) : (
          <>
            <IconDisc tone="whatsapp" size={44} shape="square" className="mb-4">
              <MessageCircle size={20} strokeWidth={2.25} aria-hidden="true" />
            </IconDisc>

            <h2 className="text-page-title font-display font-bold text-foreground">
              One tap, then you are talking to {teacherFirstName || "them"}
            </h2>
            <p className="mt-2 max-w-prose text-body-secondary text-warm-prose">
              We ask who you are so teachers know a real person is messaging. Nothing is posted
              anywhere.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button variant="indigo" size={54} busy={busy} onClick={handleGoogle} className="w-full">
                Continue with Google
              </Button>
              <Button variant="whatsapp" size={54} onClick={goAuth} className="w-full">
                Continue to WhatsApp
              </Button>
              <Button variant="ghost" size={44} onClick={() => onOpenChange(false)} className="w-full">
                Maybe later
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { GateSheet };
