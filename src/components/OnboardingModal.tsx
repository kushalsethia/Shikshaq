import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GraduationCap, MessageCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";

// First-time-visitor onboarding. Shows once per browser (localStorage flag),
// never again after dismissal — see src/lib/onboarding.ts. Built on Radix
// Dialog primitives directly (not the shadcn DialogContent wrapper) so the
// dark-panel look in VISUAL_LANGUAGE §2.1 can be fully custom while still
// getting Radix's built-in focus trap, Escape-to-close, and portal for free.
//
// DESIGN_SYSTEM §11: modals become sheets on mobile (bottom-anchored,
// rounded-t-2xl), centered dialogs are sm: and up.
//
// Screen-to-screen motion is a plain CSS transform transition (translate-x),
// not framer-motion — DESIGN_SYSTEM §6 reserves framer-motion for the nav
// component (expandable-tabs); this stays on the contract's whitelist by
// using only a transition, not a keyframe animation.

type ScreenMode = "neutral" | "teachers" | "papers";

interface Screen {
  mode: ScreenMode;
  icon: typeof Search;
  eyebrow: string;
  title: string;
  body: string;
}

const SCREENS: Screen[] = [
  {
    mode: "neutral",
    icon: Search,
    eyebrow: "Welcome to ShikshAQ",
    title: "Verified tutors and real past papers, in Kolkata.",
    body: "Search verified tuition teachers by subject, class and locality, then message them yourself on WhatsApp. Students can also read past papers from Kolkata schools, free.",
  },
  {
    mode: "teachers",
    icon: GraduationCap,
    eyebrow: "Finding a teacher",
    title: "Browse verified tutors, message on WhatsApp.",
    body: "Every teacher is verified with real photos, reviews and subjects. Pick one and message them directly — no forms, no waiting for a callback.",
  },
  {
    mode: "papers",
    icon: MessageCircle,
    eyebrow: "Finding past papers",
    title: "Search, open, done.",
    body: "Real past papers from Kolkata schools, organised by subject and class. Find the one you need and start reading in seconds.",
  },
];

const MODE_STYLES: Record<ScreenMode, { chip: string; icon: string }> = {
  neutral: { chip: "bg-white/10 text-white/70", icon: "bg-white/10 text-white" },
  teachers: { chip: "bg-brand/20 text-brand", icon: "bg-brand text-white" },
  papers: { chip: "bg-brand-blue/20 text-brand-blue", icon: "bg-brand-blue text-white" },
};

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hasSeenOnboarding()) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    markOnboardingSeen();
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) dismiss();
  };

  const isLast = step === SCREENS.length - 1;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-[100] flex flex-col overflow-hidden bg-panel text-white shadow-lg outline-none",
            // Mobile: bottom sheet. Desktop (sm:+): centered dialog.
            "inset-x-0 bottom-0 rounded-t-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
            "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Drag-handle affordance, mobile sheet only (§11) */}
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />

          <DialogPrimitive.Close
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Skip onboarding"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DialogPrimitive.Close>

          <DialogPrimitive.Title className="sr-only">Welcome to ShikshAQ</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            A short introduction to finding tutors and past papers on ShikshAQ.
          </DialogPrimitive.Description>

          {/* Track: CSS transform transition only, no framer-motion (§6) */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${step * 100}%)` }}
            >
              {SCREENS.map((screen, i) => {
                const styles = MODE_STYLES[screen.mode];
                const Icon = screen.icon;
                return (
                  <div key={screen.title} className="w-full shrink-0 px-6 pb-8 pt-12 sm:px-8">
                    <div className={cn("mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl", styles.icon)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span
                      className={cn(
                        "mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
                        styles.chip
                      )}
                    >
                      {screen.eyebrow}
                    </span>
                    <h2 className="text-2xl font-semibold tracking-tight">{screen.title}</h2>
                    <p className="mt-3 max-w-prose text-sm text-white/70">{screen.body}</p>
                    {/* aria-hidden siblings keep screen readers from announcing
                        off-screen panels; focus stays managed by Radix's trap. */}
                    {i !== step && <span className="sr-only" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 sm:px-8">
            <div className="flex items-center gap-2" role="tablist" aria-label="Onboarding progress">
              {SCREENS.map((screen, i) => (
                <button
                  key={screen.title}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  aria-label={`Go to screen ${i + 1} of ${SCREENS.length}`}
                  onClick={() => setStep(i)}
                  className={cn(
                    "h-2 rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    i === step ? "w-6 bg-white" : "w-2 bg-white/30"
                  )}
                />
              ))}
            </div>

            {isLast ? (
              <button
                type="button"
                onClick={dismiss}
                className="flex h-11 min-w-[44px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-panel transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Get started
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(s + 1, SCREENS.length - 1))}
                className="flex h-11 min-w-[44px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-panel transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Next
              </button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
