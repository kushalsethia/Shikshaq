import * as React from "react";

import { cn } from "@/lib/utils";

/* Redesign S3 + S4 (components.md §3, design.md §1).

   PageContainer is the one horizontal measure for the whole product. Every
   route body goes through it so gutters cannot drift screen to screen:
     mobile 16px · sm 24px · lg 32px, capped at max-w-6xl. */
export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "main" | "section" | "footer";
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, as = "div", ...props }, ref) => {
    const Comp = as as React.ElementType;
    return (
      <Comp
        ref={ref}
        className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
        {...props}
      />
    );
  },
);
PageContainer.displayName = "PageContainer";

/* S4 Slab — a rounded saturated block, inset by the gutter.

   FOUR FILLS ONLY (components.md S4): brand orange, brand indigo, muted warm,
   near-black. Never a subject `solid` — that colour is reserved for icon tiles,
   badges and paper spines (tokens.md §3 scope rule).

   The coloured glow is allowed only on the two saturated fills. */
const SLAB_FILLS = {
  brand: "bg-brand text-brand-foreground shadow-glow-brand",
  papers: "bg-brand-blue text-brand-blue-foreground shadow-glow-brand-blue",
  muted: "bg-muted text-foreground",
  dark: "bg-panel text-background",
} as const;

export interface SlabProps extends React.HTMLAttributes<HTMLDivElement> {
  fill?: keyof typeof SLAB_FILLS;
  /** Drop the glow where the slab sits against another saturated surface. */
  flat?: boolean;
}

const Slab = React.forwardRef<HTMLDivElement, SlabProps>(
  ({ className, fill = "muted", flat = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-4xl",
        SLAB_FILLS[fill],
        flat && "shadow-none",
        className,
      )}
      {...props}
    />
  ),
);
Slab.displayName = "Slab";

/* The control block from design.md §1 — the near-black (or mode-coloured) top
   of every route, square at the top and 32px-rounded at the bottom.

   Mode: teachers routes are near-black, papers routes indigo, the teacher
   dashboard orange. */
const CONTROL_FILLS = {
  dark: "bg-panel text-background",
  papers: "bg-brand-blue text-brand-blue-foreground",
  teacher: "bg-brand text-brand-foreground",
} as const;

export interface ControlBlockProps extends React.HTMLAttributes<HTMLElement> {
  mode?: keyof typeof CONTROL_FILLS;
}

const ControlBlock = React.forwardRef<HTMLElement, ControlBlockProps>(
  ({ className, mode = "dark", children, ...props }, ref) => (
    /* A <div>, not a <header>. TopBar and Navbar are already top-level
       <header> elements, and this block sits outside <main> too — so making it
       a third one gave the page three `banner` landmarks, where ARIA allows
       exactly one. The h1 it contains still carries the document structure. */
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn("rounded-b-4xl", CONTROL_FILLS[mode], className)}
      {...props}
    >
      <PageContainer className="py-8">{children}</PageContainer>
    </div>
  ),
);
ControlBlock.displayName = "ControlBlock";

/* Reserves the space the floating bottom-nav pill occupies, so the last real
   element on a page is never sitting under it. design.md §1 / components.md S1
   call for 130px on mobile; the nav is lg:hidden, so the reserve is too. */
function BottomNavSpacer() {
  /* 84px, not 130. The bottom nav measures 60px tall and floats 12px off the
     bottom edge, so the real clearance needed is 72px plus the safe-area
     inset. 130px was a guess, and every page that rendered this ALSO carried
     `pb-20` on <main>, reserving 210px in total for a 72px nav — which is the
     bulk of the dead space that appeared above the footer. */
  return (
    <div
      aria-hidden
      className="lg:hidden"
      style={{ height: 'calc(84px + env(safe-area-inset-bottom))' }}
    />
  );
}

export { PageContainer, Slab, ControlBlock, BottomNavSpacer, SLAB_FILLS };
