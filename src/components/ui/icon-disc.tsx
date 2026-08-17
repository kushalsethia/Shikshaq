import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { getSubjectPalette } from "@/lib/subject-palette";

/* Redesign P3 (components.md §1).

   A circle (or soft square) holding exactly one line icon. Used for section
   heading tiles (design.md §1), WhatsApp discs on cards, social discs in the
   footer, lock discs on paper covers and overflow actions in admin.

   The icon inside is decorative by default: if the disc is the only thing
   carrying meaning, pass `label` so it reaches a screen reader. */
const iconDiscVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-colors duration-150 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        muted: "bg-muted text-foreground",
        brand: "bg-brand text-brand-foreground",
        "brand-subtle": "bg-brand-subtle text-brand-deep",
        papers: "bg-brand-blue text-brand-blue-foreground",
        "papers-subtle": "bg-brand-blue-subtle text-brand-blue-deep",
        whatsapp: "bg-whatsapp text-whatsapp-text",
        dark: "bg-panel text-background",
        /* On a dark slab: white at 10% (components.md P3) */
        "on-dark": "bg-white/10 text-background",
        subject: "",
      },
      size: {
        /* Section heading tile — design.md §1 calls for 24–26px. */
        26: "h-[26px] w-[26px] [&_svg]:size-4",
        36: "h-9 w-9 [&_svg]:size-4",
        40: "h-10 w-10 [&_svg]:size-5",
        44: "h-11 w-11 [&_svg]:size-5",
      },
      shape: {
        circle: "rounded-full",
        /* 11–14px radius square (components.md P3) */
        square: "rounded-xl",
      },
    },
    defaultVariants: { tone: "muted", size: 40, shape: "circle" },
  },
);

export interface IconDiscProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof iconDiscVariants> {
  /**
   * Accessible name. Provide it whenever the disc is the only carrier of
   * meaning (design.md §7). When omitted the disc is treated as decorative and
   * hidden from assistive tech.
   */
  label?: string;
  /** Subject name — fill/icon colour from getSubjectPalette (tone="subject"). */
  subject?: string;
  /** Render as <button>. Remember the 44px floor for real tap targets. */
  as?: "div" | "span" | "button";
  children: React.ReactNode;
}

const IconDisc = React.forwardRef<HTMLElement, IconDiscProps>(
  (
    { className, tone, size, shape, label, subject, as = "div", children, style, ...props },
    ref,
  ) => {
    const palette = tone === "subject" && subject ? getSubjectPalette(subject) : undefined;
    const Comp = as as React.ElementType;

    return (
      <Comp
        ref={ref}
        className={cn(
          iconDiscVariants({ tone, size, shape }),
          as === "button" &&
            "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        style={
          palette
            ? /* `solid` is an icon-tile fill — the one place tokens.md §3 allows
                 it. Never let it back a surface that carries body copy. */
              { backgroundColor: palette.solid, color: palette.badgeText, ...style }
            : style
        }
        {...(as === "button" ? { type: "button" } : null)}
        {...(label ? { "aria-label": label } : { "aria-hidden": true })}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
IconDisc.displayName = "IconDisc";

export { IconDisc, iconDiscVariants };
