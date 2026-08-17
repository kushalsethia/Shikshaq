import * as React from "react";

import { cn } from "@/lib/utils";
import { Sticker } from "@/components/ui/sticker";

/* Redesign C12 (components.md §2).

   The oversized `shikshaq` wordmark that the footer's bottom edge clips, with
   one to three stickers sitting on it.

   Two constraints that are easy to get wrong:
   1. It must sit ABOVE the reserved bottom-nav strip on mobile — the nav pill
      floats at inset-x-3 bottom-3, so the wordmark cannot run to the very
      bottom or the pill lands on top of it.
   2. The clip belongs to this block, not to the footer, so the stickers can
      overhang the wordmark without the footer's own overflow cutting them off.

   Archivo at 125% width is the widest axis setting the variable font carries
   (index.html loads wdth 62..125), so this is the token max, not a magic
   number. */
export interface WordmarkBleedProps {
  /**
   * Sticker labels. Real counts only — a count that could not be fetched is
   * dropped by the caller, never rendered as a placeholder (design.md §0.10).
   */
  stickers?: string[];
  className?: string;
}

function WordmarkBleed({ stickers = [], className }: WordmarkBleedProps) {
  /* Alternate the tilt so the row reads as hand-placed rather than stepped. */
  const tilts: (-6 | -3 | 3 | 6)[] = [-3, 3, -6];

  return (
    <div className={cn("relative", className)}>
      {/* The wordmark itself is decorative — the site name is already a real
          heading and link elsewhere in the footer, so this must not be read
          out a second time. */}
      <div aria-hidden className="overflow-hidden">
        <span
          className="block select-none whitespace-nowrap font-display font-black leading-[0.78] text-background/10"
          style={{
            fontStretch: "125%",
            fontSize: "clamp(4.5rem, 22vw, 14rem)",
            /* Clipped by the container's bottom edge: the descender sits below
               the box on purpose. */
            marginBottom: "-0.18em",
          }}
        >
          shikshaq
        </span>
      </div>

      {stickers.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex flex-wrap items-center justify-center gap-4">
          {stickers.slice(0, 3).map((label, i) => (
            <span key={label} className="relative">
              {/* Sticker positions itself absolutely against this span. */}
              <Sticker tone={i === 0 ? "brand" : "bone"} tilt={tilts[i]} size={30}>
                {label}
              </Sticker>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { WordmarkBleed };
