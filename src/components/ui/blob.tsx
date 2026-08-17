import * as React from "react";

import { cn } from "@/lib/utils";
import { getSubjectPalette } from "@/lib/subject-palette";

/* Redesign P10 (components.md §1).

   Five flat characters. One shape, two dots, one mouth — that is the whole
   vocabulary. No emoji, no gradients, no eyes that follow the cursor.

   Used by F1 (list states: `meh` for over-filtered, `rough` for error), F6
   (feedback sheet) and the product tour.

   Colour comes from getSubjectPalette when a subject is in play, otherwise the
   neutral warm fill — never a hand-authored hex (design.md §0.1). */

export type BlobMood = "rough" | "meh" | "fine" | "good" | "great";

/* Mouth paths, drawn in a 64×64 box. Only the curve changes between moods —
   keeping one shape and one pair of dots is what makes the set read as a
   family rather than five drawings. */
const MOUTHS: Record<BlobMood, string> = {
  rough: "M22 44 Q32 34 42 44",
  meh: "M22 42 L42 42",
  fine: "M22 41 Q32 45 42 41",
  good: "M21 39 Q32 48 43 39",
  great: "M20 38 Q32 52 44 38",
};

const LABELS: Record<BlobMood, string> = {
  rough: "Rough",
  meh: "Not great",
  fine: "Fine",
  good: "Good",
  great: "Great",
};

export interface BlobProps extends React.HTMLAttributes<HTMLSpanElement> {
  mood: BlobMood;
  /** Pixel size of the square. */
  size?: number;
  /** Subject name — tints the body via getSubjectPalette. */
  subject?: string;
  /**
   * Accessible name. Blobs are usually decorative because the surrounding copy
   * says the same thing; pass this only when the blob is the sole carrier.
   */
  label?: string;
}

const Blob = React.forwardRef<HTMLSpanElement, BlobProps>(
  ({ className, mood, size = 64, subject, label, ...props }, ref) => {
    const palette = subject ? getSubjectPalette(subject) : undefined;
    const body = palette?.tint ?? "var(--warm-muted)";
    const ink = palette?.text ?? "var(--foreground)";

    return (
      <span
        ref={ref}
        className={cn("inline-flex shrink-0", className)}
        {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
        {...props}
      >
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          {/* One soft shape — a squircle, not a circle, so it reads as drawn. */}
          <path
            d="M32 4C48 4 60 16 60 32C60 48 48 60 32 60C16 60 4 48 4 32C4 16 16 4 32 4Z"
            fill={body}
          />
          <circle cx="23" cy="27" r="3.2" fill={ink} />
          <circle cx="41" cy="27" r="3.2" fill={ink} />
          <path
            d={MOUTHS[mood]}
            stroke={ink}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
    );
  },
);
Blob.displayName = "Blob";

export { Blob, LABELS as BLOB_LABELS };
