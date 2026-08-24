import * as React from "react";
import { Search, BadgeCheck, MessageCircle, FileText, ChevronRight, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { StripePlaceholder } from "@/components/ui/stripe-placeholder";
import { Logo } from "@/components/Logo";
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
/* Handoff OB-002: every step is now `fixed inset-0 bg-panel` (uniformly
   dark), so the accent ink is each mode's own saturated colour rather than
   the light-background "deep"/ink variants the old per-card fills used. */
const CARD_ACCENT: Record<CardMode, string> = {
  dark: "text-brand",
  brand: "text-brand",
  whatsapp: "text-whatsapp",
  papers: "text-brand-blue",
};

/* The two flat background shapes behind each step's illustration, in that
   step's mode colour, bleeding off the art well's edges. */
const CARD_SHAPES: Record<CardMode, string> = {
  dark: "bg-brand",
  brand: "bg-brand",
  whatsapp: "bg-whatsapp",
  papers: "bg-brand-blue",
};

/* Card 4's CTA only. The spec pairs ctaBg #FCFAF7 with ctaFg #2E3AD6, and the
   `muted` variant renders bone-on-warm-grey instead — the indigo ink is what
   ties the button to the indigo card behind it. The other three cards are
   served correctly by their variants, so they are left alone rather than
   re-specified here: overriding a variant's background by appending a class
   depends on tailwind-merge resolving the two, which it does not do reliably
   for a variant applied inside the component. */
/* Tokens, not literals: --card is #FCFAF7 and --brand-blue-deep is #2E3AD6,
   so these were re-typing values the theme already owns and would not follow
   a token change. */
/* Handoff OB-002: every step shares one fill now (bg-panel), so this
   per-mode fill map is gone — kept only as the CTA variant map below. */
const CARD_CTA_VARIANT: Record<CardMode, "primary" | "whatsapp" | "indigo"> = {
  dark: "primary",
  brand: "primary",
  whatsapp: "whatsapp",
  papers: "indigo",
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
      /* secondary-06 draws this as an actual teacher-card fragment: avatar +
         name + verified mark, THEN a row of subject chips underneath — the
         same shape TeacherCard renders everywhere else in the app. The build
         stopped at the name row and dropped the chips, which is the one
         thing that makes it read as a teacher card rather than a contact
         row. Chip tone="subject" pulls its fill from getSubjectPalette, same
         as every other subject chip on the site — no new colour here. */
      illustration: (
        <div className="flex flex-col gap-2.5 rounded-2xl bg-card p-3 text-foreground shadow-border">
          <div className="flex items-center gap-3">
            <StripePlaceholder name="Ananya Ghosh" initialSize={40} className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0">
              <span className="flex items-center gap-1 text-body-secondary font-semibold">
                Ananya Ghosh
                <BadgeCheck aria-hidden className="size-4 shrink-0 text-brand" />
              </span>
              <span className="block truncate text-meta text-warm-meta">Ballygunge · ID verified</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Chip asChild tone="subject" subject="Maths" size={38}>
              Maths
            </Chip>
            <Chip asChild tone="subject" subject="Physics" size={38}>
              Physics
            </Chip>
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
      /* secondary-06 illustrates this card with an actual two-bubble WhatsApp
         exchange plus an "Opens in WhatsApp" tag — a real conversation
         fragment. An icon disc with a caption is a drawn icon, which is
         exactly what this file's own top comment says the illustrations are
         not supposed to be. */
      illustration: (
        <div className="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-border">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-whatsapp px-3 py-2 text-meta text-whatsapp-text">
            Hello ma'am, do you take Class 10 ICSE Maths?
          </div>
          <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-meta text-foreground">
            Yes, free trial class this Saturday, 5pm?
          </div>
          <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-whatsapp px-3 py-1.5 text-meta font-semibold text-whatsapp-text">
            <MessageCircle aria-hidden className="size-3.5 shrink-0" />
            Opens in WhatsApp
          </span>
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
            <Chip key={i} asChild tone="on-dark" size={38} icon={<FileText aria-hidden className="size-4" />}>
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
        {/* Handoff OB-002: every step is now fixed inset-0 bg-panel, no
            rounding — nav row -> art well -> text block. */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-[100] flex flex-col overflow-hidden bg-panel text-background outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">ShikshAQ product tour</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            A short tour of finding teachers and reading past papers on ShikshAQ.
          </DialogPrimitive.Description>

          {/* Nav row: inverted logo left, 40px close disc right. */}
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <Logo size="nav" onDark ariaLabel="Shikshaq" className="tap-44" />
            <DialogPrimitive.Close className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-background transition-colors duration-150 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel">
              <X className="h-4 w-4" strokeWidth={2.25} aria-hidden />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Art well: the step's existing illustration plus two flat mode-
              coloured shapes bleeding off the edges, clipped by the well. */}
          <div className="relative m-[10px_16px_0] flex-1 overflow-hidden rounded-[34px] bg-white/[0.04]">
            <span
              aria-hidden
              className={cn("pointer-events-none absolute -left-16 -top-16 h-[240px] w-[240px] rounded-full opacity-[0.16]", CARD_SHAPES[card.mode])}
            />
            <span
              aria-hidden
              className={cn("pointer-events-none absolute -bottom-20 -right-14 h-[280px] w-[280px] rounded-[40px] opacity-[0.16]", CARD_SHAPES[card.mode])}
            />
            {/* Handoff M-012: stepping animates only the art well's contents
                and the text block, opacity 0->1 + translateY(10px->0) over
                500ms ease-snap — key={step} remounts this div each step so
                the animation replays; the outer well itself (this whole
                bg-white/[0.04] block) does not move. */}
            <div key={step} className="relative flex h-full items-center justify-center p-6 animate-tour-step-in">
              <div className="w-full max-w-xs rotate-[-2deg] drop-shadow-[0_18px_30px_rgba(0,0,0,.35)] motion-reduce:rotate-0">{card.illustration}</div>
            </div>
          </div>

          <div className="p-[22px_22px_26px]">
            {/* Same M-012 step animation, isolated to the headline+body only
                — the dot row, CTA and Skip link below (the "CTA row") stay
                still, per the entry's own instruction. */}
            <div key={step} className="animate-tour-step-in">
              <h2 className="font-display text-[30px] font-bold leading-[1.06] tracking-[-0.045em] text-background">
                {card.headline}
              </h2>
              <p className="mt-[10px] text-[14.5px] leading-[1.55] text-background/65">{card.body}</p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              {/* Dots, not a segmented fill bar. dc.html draws four 6px-tall
                  pills where only the CURRENT one is 20px wide and the rest
                  stay 6px — so it reads as "you are here", not "this much is
                  done". */}
              <div className="flex items-center gap-1.5" aria-hidden>
                {CARDS.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      /* Handoff M-012: 500ms ease-snap, not the old 300ms —
                         same curve as the step content above so the dot and
                         the art/text it's tracking read as one movement. */
                      "h-[6px] rounded-full transition-[width,background-color] duration-500 ease-snap",
                      i === step ? "w-5 bg-background" : "w-[6px] bg-background/28",
                    )}
                  />
                ))}
              </div>
              <Button variant={CARD_CTA_VARIANT[card.mode]} size={52} onClick={advance} className="flex-none">
                {card.cta}
                {isLast ? null : <ChevronRight aria-hidden className="ml-1 size-4" />}
              </Button>
            </div>

            {!isLast && (
              <DialogPrimitive.Close className="mt-1 flex h-11 w-full items-center justify-center text-[13.5px] font-semibold text-background/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel">
                Skip
              </DialogPrimitive.Close>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ProductTour };
