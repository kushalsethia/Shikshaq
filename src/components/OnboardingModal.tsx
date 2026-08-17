import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Presentation, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sticker } from "@/components/ui/sticker";
import { IconDisc } from "@/components/ui/icon-disc";

/* Redesign S18 (design.md §4, changelog C-043) — first-time-visitor onboarding.
   Shows once per browser (localStorage flag), never again after dismissal — see
   src/lib/onboarding.ts.

   Rebuilt to match the binding spec exactly: ONE bottom sheet, ONE question
   ("What brings you here?" — copy.md §7, shared verbatim with Role select), a
   tilted "Takes one tap" sticker, and three routes plus a skip. This replaces the
   previous three-screen Instagram-Stories-style carousel, which answered a
   question nobody asked (mode explainer) instead of routing the visitor.

   Distinct from ProductTour (C-057): this is a first-run question, the tour is an
   on-demand product explainer opened from the logo. */

const ROUTES = [
  {
    key: "teacher",
    label: "Find a teacher",
    body: "Browse verified tutors and message them yourself.",
    icon: GraduationCap,
    tone: "brand" as const,
    to: "/all-tuition-teachers-in-kolkata",
  },
  {
    key: "papers",
    label: "Read past papers",
    body: "Free papers from Kolkata schools, by subject and class.",
    icon: BookOpen,
    tone: "papers" as const,
    to: "/past-papers",
  },
  {
    key: "teach",
    label: "I teach — list me",
    body: "List yourself — free to list, free to stay.",
    icon: Presentation,
    tone: "dark" as const,
    to: "/join",
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSeenOnboarding()) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    markOnboardingSeen();
    setOpen(false);
  };

  const choose = (to: string) => {
    dismiss();
    navigate(to);
  };

  return (
    <Sheet open={open} onOpenChange={(next) => !next && dismiss()}>
      <SheetContent side="bottom" className="rounded-t-[28px] border-0 pb-8 pt-6">
        <div className="relative pt-2">
          {/* Sticker defaults to overhanging a card's top-right corner (see
              sticker.tsx); here it sits above the headline instead, per mockup
              S18, so it is repositioned to the top-left and the heading is
              pushed down to clear it rather than being overlapped. */}
          <Sticker tone="brand" tilt={-3} size={30} className="left-0 right-auto top-0">
            Takes one tap
          </Sticker>
          {/* SheetTitle, not a bare h2. Radix requires a DialogTitle inside
              DialogContent to label the dialog for assistive tech, and warned
              about it in the console on every page — this sheet is mounted
              site-wide. SheetTitle renders an h2 anyway, so nothing changes
              visually. */}
          <SheetTitle className="mt-9 font-display text-page-title font-bold text-foreground">
            What brings you here?
          </SheetTitle>
          {/* The mockup's answer to "why am I being asked this" was missing
              entirely. Without it the sheet interrupts a first-time visitor with
              a question and no reason, and no hint that the choice is not
              permanent. */}
          <p className="mt-2 text-body-secondary text-warm-prose">
            We&rsquo;ll put the right things on your home screen. Change it any time.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {ROUTES.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => choose(r.to)}
                /* S18 ranks the three answers by colour: solid orange for the
                   thing most people came for, indigo-subtle for papers (the
                   indigo half of the brand pair, as everywhere else), plain card
                   for "I teach". All three rendered as near-identical pale
                   cards, so the sheet asked a question and then declined to
                   suggest an answer. */
                className={cn(
                  "flex min-h-[44px] items-center gap-4 rounded-2xl p-4 text-left shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  r.tone === "brand" && "bg-brand text-brand-foreground",
                  r.tone === "papers" && "bg-brand-blue-subtle",
                  r.tone === "dark" && "bg-card",
                )}
              >
                <IconDisc
                  tone={r.tone === "brand" ? "on-dark" : r.tone === "papers" ? "papers" : "muted"}
                  size={44}
                  shape="square"
                >
                  <Icon aria-hidden="true" />
                </IconDisc>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-body-secondary font-semibold",
                      r.tone === "brand" ? "text-brand-foreground" : r.tone === "papers" ? "text-brand-blue-deep" : "text-foreground",
                    )}
                  >
                    {r.label}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-meta",
                      r.tone === "brand" ? "text-brand-foreground/80" : r.tone === "papers" ? "text-brand-blue-deep/75" : "text-warm-meta",
                    )}
                  >
                    {r.body}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0",
                    r.tone === "brand" ? "text-brand-foreground/80" : r.tone === "papers" ? "text-brand-blue-deep/70" : "text-warm-label",
                  )}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg text-body-secondary font-semibold text-warm-prose transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Just looking around
        </button>
      </SheetContent>
    </Sheet>
  );
}
