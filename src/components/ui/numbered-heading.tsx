import * as React from "react";

import { cn } from "@/lib/utils";

/* Redesign P6 (components.md §1, design.md §2.7).

   Anatomy, in order:
     line 1 (display)
     [ordinal 01–04]  line 2 (display)
     one support sentence (secondary body)

   The ordinals ARE the page's reading order — if sections move, renumber them.
   They are decorative as far as assistive tech is concerned (the heading text
   carries the meaning), so the ordinal is aria-hidden.

   Sizing: mobile 27px / desktop 34–46px — that is `text-section-head`, which
   already clamps between 23px and 34px, so `lg:text-page-title` carries the
   larger desktop end. */
export interface NumberedHeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** First display line. */
  line1: string;
  /** Ordinal between the lines, e.g. "01". */
  ordinal: string;
  /** Second display line. */
  line2: string;
  /** One supporting sentence beneath. */
  support?: string;
  /** Heading level — never skip levels (design.md §7). */
  as?: "h2" | "h3";
  onDark?: boolean;
}

const NumberedHeading = React.forwardRef<HTMLElement, NumberedHeadingProps>(
  (
    { className, line1, ordinal, line2, support, as = "h2", onDark = false, ...props },
    ref,
  ) => {
    const Heading = as as React.ElementType;
    return (
      <div className={cn("flex flex-col gap-3", className)} {...props}>
        <Heading
          ref={ref}
          className={cn(
            "font-display font-extrabold text-section-head lg:text-page-title",
            onDark ? "text-background" : "text-foreground",
          )}
        >
          <span className="block">{line1}</span>
          <span className="flex items-baseline gap-3">
            <span
              aria-hidden
              className={cn(
                "text-label font-bold tracking-[0.07em]",
                onDark ? "text-background/55" : "text-warm-label",
              )}
            >
              {ordinal}
            </span>
            <span>{line2}</span>
          </span>
        </Heading>
        {support ? (
          <p
            className={cn(
              "max-w-prose text-body-secondary",
              onDark ? "text-background/70" : "text-warm-prose",
            )}
          >
            {support}
          </p>
        ) : null}
      </div>
    );
  },
);
NumberedHeading.displayName = "NumberedHeading";

export { NumberedHeading };
