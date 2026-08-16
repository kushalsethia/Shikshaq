import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GraduationCap, MessageCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";

// First-time-visitor onboarding. Shows once per browser (localStorage flag),
// never again after dismissal — see src/lib/onboarding.ts.
//
// Full-bleed dark carousel, rebuilt per the "first-time-popup-design"
// reference (docs/wave2-inspo — described in WAVE2_INSPO.md/
// VISUAL_UPGRADE_PLAN.md since no file was given for it): each screen is
// dominated by one large flat-color abstract shape as the hero graphic,
// a bold headline below it, pagination dots, and a bright pill CTA — not a
// small dialog card. Built on Radix Dialog primitives directly (not the
// shadcn DialogContent wrapper) so this fully custom full-screen look can
// still get Radix's focus trap, Escape-to-close, and portal for free.
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

// Each screen gets a dominant flat-color shape (the reference's hero
// graphic) plus a matching accent for the eyebrow chip, icon tile, and CTA.
// bg-panel stays the page ground throughout — only the shape and accents
// shift between screens, so the carousel reads as one product, not three
// disconnected colors.
const MODE_STYLES: Record<ScreenMode, { chip: string; icon: string; shape: string; cta: string }> = {
  neutral: {
    chip: "bg-brand/20 text-brand",
    icon: "bg-brand text-white",
    shape: "bg-brand/25",
    cta: "bg-brand text-white",
  },
  teachers: {
    chip: "bg-brand/20 text-brand",
    icon: "bg-brand text-white",
    shape: "bg-brand/25",
    cta: "bg-brand text-white",
  },
  papers: {
    chip: "bg-brand-blue/20 text-brand-blue",
    icon: "bg-brand-blue text-white",
    shape: "bg-brand-blue/25",
    cta: "bg-brand-blue text-white",
  },
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
        {/* Full-bleed: fills the viewport on every breakpoint (not a sheet
            growing into a centered card at sm:+) — the reference is a
            full-screen carousel at every size. */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-[100] flex flex-col overflow-hidden bg-panel text-white shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Close
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
            aria-label="Skip onboarding"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DialogPrimitive.Close>

          <DialogPrimitive.Title className="sr-only">Welcome to ShikshAQ</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            A short introduction to finding tutors and past papers on ShikshAQ.
          </DialogPrimitive.Description>

          {/* Track: CSS transform transition only, no framer-motion (§6) */}
          <div className="flex-1 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${step * 100}%)` }}
            >
              {SCREENS.map((screen, i) => {
                const styles = MODE_STYLES[screen.mode];
                const Icon = screen.icon;
                return (
                  <div
                    key={screen.title}
                    className="flex h-full w-full shrink-0 flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-16 text-center sm:px-10"
                    aria-hidden={i !== step}
                  >
                    {/* Dominant hero shape — the reference's defining device.
                        Sized to be the clear focal point of the screen, not
                        a background texture. */}
                    <div className="relative mb-8 flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
                      <div
                        className={cn(
                          "absolute inset-0 rounded-[62%_38%_35%_65%/60%_35%_65%_40%]",
                          styles.shape
                        )}
                        aria-hidden="true"
                      />
                      <div className={cn("relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg sm:h-24 sm:w-24", styles.icon)}>
                        <Icon className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true" />
                      </div>
                    </div>

                    <span
                      className={cn(
                        "mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
                        styles.chip
                      )}
                    >
                      {screen.eyebrow}
                    </span>
                    <h2 className="max-w-sm text-[28px] font-semibold leading-tight tracking-tight sm:max-w-md sm:text-[34px]">
                      {screen.title}
                    </h2>
                    <p className="mt-4 max-w-sm text-sm text-white/60 sm:max-w-md sm:text-base">{screen.body}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 px-6 pb-10 sm:pb-12">
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
                className={cn(
                  "flex h-12 w-full max-w-xs items-center justify-center rounded-full px-8 text-sm font-semibold transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  MODE_STYLES[SCREENS[step].mode].cta
                )}
              >
                Get started
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(s + 1, SCREENS.length - 1))}
                className={cn(
                  "flex h-12 w-full max-w-xs items-center justify-center rounded-full px-8 text-sm font-semibold transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  MODE_STYLES[SCREENS[step].mode].cta
                )}
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
