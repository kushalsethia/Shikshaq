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
  /* Handoff tilts: -8 / 6 / -5. Sticker's tilt prop carries the angle as a CSS
     custom property precisely so any integer in the ±3–9 range works. */
  const tilts = [-8, 6, -5];
  const STICKER_TONES = ["brand", "whatsapp", "papers"] as const;

  /* The floating nav pill sits at `inset-x-3 bottom-3` and is 60px tall, so it
     occupies the bottom ~72px of the viewport plus the safe-area inset. The
     page's BottomNavSpacer reserves room INSIDE <main>, which is above the
     footer — nothing reserves space below it. Measured at 390px the wordmark
     ran 8px under the pill, so the clearance is reserved here instead.
     lg:pb-0 because the pill is lg:hidden. */
  return (
    <div
      className={cn("relative pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-0", className)}
    >
      {/* The wordmark itself is decorative — the site name is already a real
          heading and link elsewhere in the footer, so this must not be read
          out a second time. */}
      <div aria-hidden className="overflow-hidden">
        <span
          /* Solid bone (#F9F5F1), not 10% alpha. The handoff draws this
             wordmark as the footer's largest element; at text-background/10 it
             was all but invisible against the near-black slab, which is why the
             whole footer read as unfinished. Tracking and line-height are the
             handoff's too — -0.06em and 1, not the 0.78 that was crushing it. */
          className="block select-none whitespace-nowrap font-display font-black leading-[1] tracking-[-0.06em] text-background"
          style={{
            fontStretch: "125%",
            fontSize: "clamp(5.125rem, 22vw, 14rem)",
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
              {/* One tone per sticker, per the handoff: orange for the tutor
                  count, WhatsApp green for "no commission" (the promise the
                  green is doing the work of), indigo for the paper count —
                  papers are the indigo half of the brand pair. Two of the three
                  were rendering as undifferentiated bone. */}
              <Sticker tone={STICKER_TONES[i]} tilt={tilts[i]} size={26}>
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
