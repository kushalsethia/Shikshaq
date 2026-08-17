import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { getSubjectPalette } from "@/lib/subject-palette";

/* Redesign P2 (components.md §1, design.md §2.4).

   One pill, four surfaces. A chip NEVER tilts — that is the sticker's job (P8),
   and mixing the two makes filter rows look accidental.

   Sizing: 44px wherever the chip is the primary control (design.md §7 floor);
   34px is allowed only for read-only badges that are not tap targets. */
const chipVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        /* Facet / filter on a light ground — design.md §2.4 row 1 */
        facet: "bg-muted text-foreground hover:bg-accent",
        "facet-on": "bg-brand-subtle text-brand-deep",
        /* Papers mode uses the indigo pair rather than orange */
        "facet-on-papers": "bg-brand-blue-subtle text-brand-blue-deep",
        /* On a near-black or saturated block — design.md §2.4 row 2 */
        dark: "bg-white/10 text-background hover:bg-white/20",
        "dark-on": "bg-brand text-brand-foreground",
        "dark-on-papers": "bg-brand-blue text-brand-blue-foreground",
        /* Solid selected state from components.md P2 ("on": bg-panel / white) */
        solid: "bg-panel text-background",
        /* Subject-tinted — fill comes from getSubjectPalette via `subject` */
        subject: "",
      },
      size: {
        /* Read-only badge. Not a tap target — do not attach onClick. */
        34: "h-[34px] px-3 text-meta",
        40: "h-10 px-4 text-meta",
        /* The default: meets the 44px floor. */
        44: "h-11 px-4 text-body-secondary",
      },
    },
    defaultVariants: { tone: "facet", size: 44 },
  },
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof chipVariants> {
  /** Leading icon. Decorative — it is aria-hidden and never the only label. */
  icon?: React.ReactNode;
  /** Trailing count badge, e.g. the number of results behind a facet. */
  count?: number;
  /**
   * Subject name. When set with tone="subject" the fill and text come from
   * getSubjectPalette() — the one sanctioned inline-style colour source
   * (design.md §0.1). Never hand-author a subject colour.
   */
  subject?: string;
  /** Render as a static element rather than a button (read-only badges). */
  asChild?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    { className, tone, size, icon, count, subject, children, asChild, style, ...props },
    ref,
  ) => {
    const palette = tone === "subject" && subject ? getSubjectPalette(subject) : undefined;

    const content = (
      <>
        {icon ? (
          <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
        <span className="truncate">{children}</span>
        {count !== undefined ? (
          <span
            className="ml-1 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-black/10 px-1 text-label tabular-nums"
            /* The count is meaningful, so it stays real text — not a ::after. */
          >
            {count}
          </span>
        ) : null}
      </>
    );

    const merged = {
      ...(palette ? { backgroundColor: palette.tint, color: palette.text } : null),
      ...style,
    };

    if (asChild) {
      return (
        <span
          className={cn(chipVariants({ tone, size }), className)}
          style={merged}
          /* Static badge: no ref, no button semantics. */
        >
          {content}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(chipVariants({ tone, size }), "active:scale-[0.97]", className)}
        style={merged}
        {...props}
      >
        {content}
      </button>
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
