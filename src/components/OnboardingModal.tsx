import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GraduationCap, MessageCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";
import { Logo } from "@/components/Logo";

// First-time-visitor onboarding. Shows once per browser (localStorage flag),
// never again after dismissal — see src/lib/onboarding.ts.
//
// Full-bleed dark carousel, rebuilt against an actual Instagram-Stories
// reference (a real 3-frame ad-story mockup): segmented progress bars across
// the very top (not bottom dots — Stories' signature wayfinding device), a
// slim header row mimicking a story's author bar (mark + wordmark + close),
// and small rotated pill tags scattered around the hero shape rather than
// sitting in a single flat row. Adapted to ShikshAQ's own colors throughout;
// the reference's own palette was not carried over. Built on Radix Dialog
// primitives directly (not the shadcn DialogContent wrapper) so this fully
// custom full-screen look still gets Radix's focus trap, Escape-to-close,
// and portal for free.
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
  /** Small rotated pill tags scattered around the hero shape — the reference's
   *  scattered-tag-cluster device ("Support", "Positive Attitude", etc). */
  tags: { label: string; tilt: number; className: string }[];
}

const SCREENS: Screen[] = [
  {
    mode: "neutral",
    icon: Search,
    eyebrow: "Welcome to ShikshAQ",
    title: "Verified tutors and real past papers, in Kolkata.",
    body: "Search verified tuition teachers by subject, class and locality, then message them yourself on WhatsApp. Students can also read past papers from Kolkata schools, free.",
    tags: [
      { label: "Verified", tilt: -8, className: "-left-2 top-2 bg-brand text-white" },
      { label: "Free to use", tilt: 6, className: "-right-4 bottom-6 bg-white text-foreground" },
    ],
  },
  {
    mode: "teachers",
    icon: GraduationCap,
    eyebrow: "Finding a teacher",
    title: "Browse verified tutors, message on WhatsApp.",
    body: "Every teacher is verified with real photos, reviews and subjects. Pick one and message them directly — no forms, no waiting for a callback.",
    tags: [
      { label: "Real reviews", tilt: -7, className: "-left-4 top-4 bg-white text-foreground" },
      { label: "WhatsApp direct", tilt: 5, className: "-right-2 bottom-2 bg-brand text-white" },
    ],
  },
  {
    mode: "papers",
    icon: MessageCircle,
    eyebrow: "Finding past papers",
    title: "Search, open, done.",
    body: "Real past papers from Kolkata schools, organised by subject and class. Find the one you need and start reading in seconds.",
    tags: [
      { label: "No signup", tilt: -6, className: "-left-2 top-0 bg-white text-foreground" },
      { label: "Nothing to download", tilt: 7, className: "-right-6 bottom-4 bg-brand-blue text-white" },
    ],
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
          <DialogPrimitive.Title className="sr-only">Welcome to ShikshAQ</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            A short introduction to finding tutors and past papers on ShikshAQ.
          </DialogPrimitive.Description>

          {/* Segmented progress bars — Instagram Stories' own top-of-screen
              wayfinding device, replacing the previous bottom pagination dots.
              One thin rounded bar per screen, filled up to (and including) the
              current step; unlike dots this reads instantly as "how much is
              left" the way a real Stories UI does. */}
          <div className="absolute inset-x-4 top-4 z-20 flex gap-1.5 sm:inset-x-6 sm:top-6" role="tablist" aria-label="Onboarding progress">
            {SCREENS.map((screen, i) => (
              <button
                key={screen.title}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`Go to screen ${i + 1} of ${SCREENS.length}`}
                onClick={() => setStep(i)}
                className="h-3 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span aria-hidden="true" className="block h-1 w-full overflow-hidden rounded-full bg-white/25">
                  <span
                    className="block h-full rounded-full bg-white transition-transform duration-300 ease-out"
                    style={{ transform: `scaleX(${i <= step ? 1 : 0})`, transformOrigin: "left" }}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* Header row — mimics a Stories author bar (mark + name + close),
              sitting just under the progress bars instead of a lone corner X. */}
          <div className="absolute inset-x-4 top-9 z-20 flex items-center justify-between sm:inset-x-6 sm:top-12">
            <div className="flex items-center gap-2">
              <Logo size="sm" onDark className="opacity-90" />
              <span className="text-sm font-semibold text-white/90">ShikshAQ</span>
            </div>
            <DialogPrimitive.Close
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-tap hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Skip onboarding"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          {/* Track: CSS transform transition only, no framer-motion (§6) */}
          <div className="flex-1 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-lift ease-settle"
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
                        a background texture. Loud surface (VISUAL_DIRECTION
                        §4: onboarding is a pure moment) — the icon tile is a
                        die-cut sticker that pops in, not a fade. */}
                    <div className="relative mb-8 flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
                      <div
                        className={cn(
                          "absolute inset-0 rounded-[62%_38%_35%_65%/60%_35%_65%_40%]",
                          styles.shape
                        )}
                        aria-hidden="true"
                      />
                      <div
                        className={cn(
                          "sticker sticker-rotate-sm outline-offset-shadow relative flex h-20 w-20 animate-pop items-center justify-center rounded-2xl sm:h-24 sm:w-24",
                          styles.icon
                        )}
                      >
                        <Icon className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true" />
                      </div>

                      {/* Scattered rotated pill tags around the hero shape — the reference's
                          defining chaotic-tag-cluster device, dropped onto our own dominant
                          blob shape instead of stacked into a flat trust-copy row. */}
                      {screen.tags.map((tag) => (
                        <span
                          key={tag.label}
                          aria-hidden="true"
                          className={cn(
                            "absolute animate-pop whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]",
                            tag.className
                          )}
                          style={{ transform: `rotate(${tag.tilt}deg)` }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    <span
                      className={cn(
                        "mb-4 inline-block rounded-full px-3 py-1 text-label font-medium uppercase tracking-wide",
                        styles.chip
                      )}
                    >
                      {screen.eyebrow}
                    </span>
                    <h2 className="max-w-sm text-page-title font-display font-semibold leading-tight tracking-tight sm:max-w-md">
                      {screen.title}
                    </h2>
                    <p className="mt-4 max-w-sm text-body-secondary text-white/60 sm:max-w-md">{screen.body}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 px-6 pb-10 sm:pb-12">
            {isLast ? (
              <button
                type="button"
                onClick={dismiss}
                className={cn(
                  "flex h-12 w-full max-w-xs items-center justify-center rounded-full px-8 text-sm font-semibold transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
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
                  "flex h-12 w-full max-w-xs items-center justify-center rounded-full px-8 text-sm font-semibold transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
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
