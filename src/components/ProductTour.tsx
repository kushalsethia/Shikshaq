import * as React from "react";
import { Search, BadgeCheck, MessageCircle, FileText, ChevronRight } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IconDisc } from "@/components/ui/icon-disc";
import { StripePlaceholder } from "@/components/ui/stripe-placeholder";
import { BROWSE_PATH } from "@/lib/nav-config";
import { supabase } from "@/integrations/supabase/client";

/* Data-honesty rule (STILL BINDING, brief): the "846 past papers" figure in
   mockup S20 card 4 must be a real count or the clause drops — never a
   hardcoded numeral. */
function usePublishedPaperCount() {
  const [count, setCount] = React.useState<number | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { count: n } = await supabase
          .from("papers")
          .select("id", { count: "exact", head: true })
          .eq("is_published", true);
        if (!cancelled && typeof n === "number") setCount(n);
      } catch {
        // stays null — the card drops the numeral clause below
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return count;
}

/* Redesign S20 (design.md §4, changelog C-057) — the on-demand product tour.

   Distinct from OnboardingModal (C-043): onboarding asks a first-run routing
   question; this explains the product on demand, opened by tapping the logo.
   Four full-tint cards, each: progress bar + Skip, a display headline whose
   second clause is italic, one sentence of body copy, one real UI fragment as
   illustration (not a drawn icon), and one CTA. Last card ends in "Start looking".
   Copy is verbatim from copy.md §7 "Tour card 1-4" / "Tour CTAs".

   LOGO-TAP WIRING: this component owns its own open state via useProductTour()
   so any caller can mount <ProductTour /> once and wire a trigger anywhere. Per
   the task brief, src/pages/Index.tsx and src/components/layout/WordmarkBleed.tsx
   / TopBar.tsx (the actual home-page logo) are OUTSIDE this agent's file list and
   were not touched. See the final report for the exact one-line change needed in
   Index.tsx to finish the wiring: render <ProductTour open={tourOpen}
   onOpenChange={setTourOpen} /> once, and add onClick={() => setTourOpen(true)}
   to the logo element in the home control block. */

/** Fired by the logo. Keeps the trigger decoupled from the tour's mount point:
 *  the logo lives in Navbar, the tour is mounted by the page, and neither needs
 *  a prop path to the other. */
export const OPEN_TOUR_EVENT = "shikshaq:open-tour";

export function openProductTour() {
  window.dispatchEvent(new CustomEvent(OPEN_TOUR_EVENT));
}

export function useProductTour() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_TOUR_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TOUR_EVENT, onOpen);
  }, []);

  return { open, setOpen };
}

type CardMode = "dark" | "brand" | "whatsapp" | "papers";

/* secondary-06-product-tour.png fills two of the four cards with the SUBTLE
   tint and saves the saturated colour for that card's button: card 2 is cream
   with an orange Next, card 3 is pale mint with a green Next. Only cards 1 and
   4 are full-bleed (near-black and indigo). This had cards 2 and 3 flooded with
   solid #FF8000 and solid WhatsApp green edge to edge, which is a very
   different thing to look at — two full-screen saturated panels in a four-card
   sequence — and it left the card's own CTA with no colour of its own to be. */
/* The italic half of each headline takes that card's own accent ink — dc.html
   sets accentInk per card (#FF8000 on the dark card, #B35900 on cream, #0B3D1F
   on mint, white-72 on indigo). Without it all four soft halves rendered in the
   body colour, which loses the two-tone the headline is built around. */
const CARD_ACCENT: Record<CardMode, string> = {
  dark: "text-brand",
  brand: "text-[#B35900]",
  whatsapp: "text-[#0B3D1F]",
  papers: "text-background/70",
};

/* Card 4's CTA only. The spec pairs ctaBg #FCFAF7 with ctaFg #2E3AD6, and the
   `muted` variant renders bone-on-warm-grey instead — the indigo ink is what
   ties the button to the indigo card behind it. The other three cards are
   served correctly by their variants, so they are left alone rather than
   re-specified here: overriding a variant's background by appending a class
   depends on tailwind-merge resolving the two, which it does not do reliably
   for a variant applied inside the component. */
const PAPERS_CTA = "bg-[#FCFAF7] text-[#2E3AD6] hover:bg-white";

const CARD_FILL: Record<CardMode, string> = {
  dark: "bg-panel text-background",
  brand: "bg-brand-subtle text-foreground",
  whatsapp: "bg-mint text-foreground",
  papers: "bg-brand-blue text-brand-blue-foreground",
};

interface TourCard {
  mode: CardMode;
  headline: React.ReactNode;
  body: string;
  cta: string;
  illustration: React.ReactNode;
}

export interface ProductTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProductTour({ open, onOpenChange }: ProductTourProps) {
  const [step, setStep] = React.useState(0);
  const navigate = useNavigate();
  const paperCount = usePublishedPaperCount();

  const CARDS: TourCard[] = [
    {
      mode: "dark",
      headline: (
        <>
          Say what you need, <em className={cn("font-normal italic", CARD_ACCENT.dark)}>in three taps.</em>
        </>
      ),
      body: "Subject, class, area. No account, no forms, no waiting for a callback.",
      cta: "Show me",
      illustration: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3">
            <Search aria-hidden className="size-4 shrink-0 text-background/70" />
            <span className="text-body-secondary text-background/70">Subject, class or area</span>
          </div>
          {/* Illustrative example chips — not live filters, so no query backs
              them; copy substitutes Ballygunge for the handoff's Lalpur per
              the brief's Kolkata-locality rule. */}
          <div className="flex flex-wrap gap-2">
            {["Near Ballygunge", "Under ₹800", "Home tuition"].map((label) => (
              <span
                key={label}
                className="rounded-full bg-white/10 px-3 py-1.5 text-meta font-semibold text-background/80"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      mode: "brand",
      headline: (
        <>
          Every teacher is <em className={cn("font-normal italic", CARD_ACCENT.brand)}>checked by a human.</em>
        </>
      ),
      body: "ID and degree verified before a profile goes live. Reviews come from students who actually took classes.",
      cta: "Next",
      illustration: (
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3 text-foreground shadow-border">
          <StripePlaceholder name="Ananya Ghosh" initialSize={40} className="size-11 shrink-0 rounded-full" />
          <div className="min-w-0">
            <span className="flex items-center gap-1 text-body-secondary font-semibold">
              Ananya Ghosh
              <BadgeCheck aria-hidden className="size-4 shrink-0 text-brand" />
            </span>
            <span className="block truncate text-meta text-warm-meta">Maths · Ballygunge</span>
          </div>
        </div>
      ),
    },
    {
      mode: "whatsapp",
      headline: (
        <>
          Then talk to them <em className={cn("font-normal italic", CARD_ACCENT.whatsapp)}>yourself, on WhatsApp.</em>
        </>
      ),
      body: "No agent in the middle, no commission on the fee. You and the teacher agree the rest.",
      cta: "Next",
      illustration: (
        <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-3 text-foreground">
          <IconDisc tone="whatsapp" size={40} shape="circle">
            <MessageCircle aria-hidden className="size-4" />
          </IconDisc>
          <span className="text-body-secondary">One tap, then you're talking to them</span>
        </div>
      ),
    },
    {
      mode: "papers",
      headline: (
        <>
          {/* > 0, not !== null — the library is empty today, so `!== null` put
              the words "0 past papers, free to read." in front of anyone taking
              the tour. design.md §3.2: never advertise emptiness. */}
          {(paperCount ?? 0) > 0 ? `${paperCount} past papers, ` : "Past papers, "}
          <em className={cn("font-normal italic", CARD_ACCENT.papers)}>free to read.</em>
        </>
      ),
      /* "24 Kolkata schools" was a copy-deck number with nothing behind it —
         there are no papers and therefore no schools. design.md §0.10 allows
         only counts that can be fetched, so the claim is stated without one. */
      body: "Real prelim and half-yearly papers from Kolkata schools. Sign in once and your shelf follows you.",
      cta: "Start looking",
      illustration: (
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <Chip key={i} asChild tone="dark" size={34} icon={<FileText aria-hidden className="size-4" />}>
              {i === 0 ? "Class 10" : i === 1 ? "ICSE" : "Maths"}
            </Chip>
          ))}
        </div>
      ),
    },
  ];

  const isLast = step === CARDS.length - 1;
  const card = CARDS[step];

  const dismiss = () => {
    onOpenChange(false);
    setStep(0);
  };

  const advance = () => {
    if (isLast) {
      dismiss();
      navigate(BROWSE_PATH);
      return;
    }
    setStep((s) => Math.min(s + 1, CARDS.length - 1));
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && dismiss()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-[100] flex flex-col overflow-hidden outline-none",
            CARD_FILL[card.mode],
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">ShikshAQ product tour</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            A short tour of finding teachers and reading past papers on ShikshAQ.
          </DialogPrimitive.Description>

          {/* Progress bar + Skip */}
          <div className="flex items-center gap-3 p-4 sm:p-6">
            {/* Dots, not a segmented fill bar. dc.html draws four 5px-tall
                pills where only the CURRENT one is 20px wide and the rest stay
                5px — so it reads as "you are here", not "this much is done".
                The build had four equal bars filling left-to-right, which is a
                different idea and made a four-card tour look like a long form. */}
            <div className="flex flex-1 items-center gap-[5px]" aria-hidden>
              {CARDS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-[5px] rounded-full transition-all duration-300 ease-settle",
                    i === step ? "w-5 bg-current" : "w-[5px] bg-current/40",
                  )}
                />
              ))}
            </div>
            <DialogPrimitive.Close className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-body-secondary font-semibold text-current/80 transition-colors duration-150 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Skip
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 pb-8 text-left sm:px-8">
            {/* 31px / 900 / 1.02 / -0.04em per dc.html, not display-hero — the
                tour card is 300px wide in the spec and the hero size overran it. */}
            <h2 className="max-w-sm font-display text-[31px] font-black leading-[1.02] tracking-[-0.04em] sm:max-w-md sm:text-[34px]">
              {card.headline}
            </h2>
            <p className="mt-2.5 max-w-sm text-[14px] leading-[1.55] opacity-90 sm:max-w-md">{card.body}</p>
            <div className="mt-6 w-full max-w-xs">{card.illustration}</div>
          </div>

          <div className="flex flex-col items-stretch gap-3 px-6 pb-8 sm:pb-12">
            <Button
              variant={card.mode === "whatsapp" ? "whatsapp" : card.mode === "papers" ? "muted" : "primary"}
              size={54}
              onClick={advance}
              className={cn(
                "w-full max-w-xs justify-center",
                card.mode === "papers" && PAPERS_CTA,
              )}
            >
              {card.cta}
              {isLast ? null : <ChevronRight aria-hidden className="ml-1 size-4" />}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ProductTour };
