import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Presentation, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
    label: "I teach",
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
        <div className="relative">
          <Sticker tone="brand" tilt={-3} size={30}>
            Takes one tap
          </Sticker>
          <h2 className="font-display text-page-title font-bold text-foreground">
            What brings you here?
          </h2>
        </div>

        <div className="mt-6 grid gap-3">
          {ROUTES.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => choose(r.to)}
                className={cn(
                  "flex min-h-[44px] items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  r.tone === "brand" && "bg-brand-subtle",
                )}
              >
                <IconDisc tone={r.tone === "dark" ? "dark" : r.tone === "papers" ? "papers" : "brand"} size={44} shape="square">
                  <Icon aria-hidden="true" />
                </IconDisc>
                <span className="flex-1">
                  <span className="block text-body-secondary font-semibold text-foreground">{r.label}</span>
                  <span className="mt-0.5 block text-meta text-warm-meta">{r.body}</span>
                </span>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-warm-label" />
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
