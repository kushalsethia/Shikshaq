import * as React from "react";

import { cn } from "@/lib/utils";

/* Redesign C11 (components.md entry C11, design.md §5, S21/S22 mockups).

   A giant display statement sitting on a faint grid ground, with 3-4 tilted
   annotation pills scattered around it. Used on About (S21) and Contact (S22)
   so the two pages read as a pair.

   IMPORTANT: the pills are NOT hand-placed at fixed pixel offsets computed for
   one specific string. They are laid out on a 2-column x 3-row grid overlay
   that spans the whole statement block; each pill is assigned a corner/edge
   cell (top-left, top-right, mid-left, mid-right, bottom-left, bottom-right)
   and positioned within that cell via `place-self`. That means the anchoring
   is relative to the block's own box, not to where a particular character of
   a particular string happens to fall — so it keeps clear of the statement
   text whether the copy is two words or six, and whether it wraps to two
   lines or four. Callers should still pick anchors that make sense for their
   copy (see About/Contact usage), but the component itself never assumes a
   fixed string length. */

export type AnnotatedPillAnchor =
  | "top-left"
  | "top-right"
  | "mid-left"
  | "mid-right"
  | "bottom-left"
  | "bottom-right";

export type AnnotatedPillTone = "dark" | "bone" | "whatsapp" | "indigo" | "brand";

const PILL_TONE_CLASS: Record<AnnotatedPillTone, string> = {
  dark: "bg-panel text-background shadow-border",
  bone: "bg-card text-foreground shadow-border",
  whatsapp: "bg-whatsapp text-whatsapp-text shadow-border",
  indigo: "bg-brand-blue-subtle text-brand-blue-deep shadow-border",
  brand: "bg-brand text-brand-foreground shadow-border",
};

const PILL_DOT_CLASS: Record<AnnotatedPillTone, string> = {
  dark: "bg-brand",
  bone: "bg-whatsapp",
  whatsapp: "",
  indigo: "bg-brand-blue",
  brand: "bg-background",
};

const ANCHOR_CELL: Record<AnnotatedPillAnchor, string> = {
  "top-left": "col-start-1 row-start-1 justify-self-start self-start",
  "top-right": "col-start-2 row-start-1 justify-self-end self-start",
  "mid-left": "col-start-1 row-start-2 justify-self-start self-center",
  "mid-right": "col-start-2 row-start-2 justify-self-end self-center",
  "bottom-left": "col-start-1 row-start-3 justify-self-start self-end",
  "bottom-right": "col-start-2 row-start-3 justify-self-end self-end",
};

const TILT_CLASS: Record<number, string> = {
  [-9]: "-rotate-[9deg]",
  [-8]: "-rotate-[8deg]",
  [-6]: "-rotate-6",
  [-5]: "-rotate-[5deg]",
  [-4]: "-rotate-4",
  [-3]: "-rotate-3",
  3: "rotate-3",
  4: "rotate-4",
  5: "rotate-[5deg]",
  6: "rotate-6",
  7: "rotate-[7deg]",
  8: "rotate-[8deg]",
  9: "rotate-[9deg]",
};

export interface AnnotatedPill {
  label: React.ReactNode;
  anchor: AnnotatedPillAnchor;
  tone?: AnnotatedPillTone;
  tilt?: number;
  icon?: React.ReactNode;
  /** Show the small leading colour dot (mockup's status dot). Default true. */
  dot?: boolean;
}

export interface AnnotatedStatementProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The statement itself, already composed with a marker-highlight span. */
  statement: React.ReactNode;
  pills: AnnotatedPill[];
  align?: "left" | "center";
}

const AnnotatedStatement = React.forwardRef<HTMLDivElement, AnnotatedStatementProps>(
  ({ className, statement, pills, align = "left", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "ground-graph relative isolate overflow-visible rounded-3xl",
          "[--graph-cell:26px]",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "font-display font-black leading-[0.94] tracking-[-0.05em] text-foreground",
            "text-[44px] sm:text-[56px] lg:text-[80px]",
            align === "center" ? "text-center" : "text-left",
          )}
        >
          {statement}
        </div>

        {/* Pill overlay — a 2x3 grid spanning the statement's own box, per-anchor
            placement rather than fixed px tied to string length (see file header). */}
        <div
          aria-hidden={pills.every((p) => typeof p.label === "string")}
          className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-3"
        >
          {pills.map((pill, i) => {
            const tone = pill.tone ?? "dark";
            const tilt = pill.tilt ?? (i % 2 === 0 ? -4 : 4);
            return (
              <span
                key={i}
                className={cn(
                  "pointer-events-auto inline-flex h-[28px] items-center gap-[6px] whitespace-nowrap rounded-full px-3 text-[11px] font-extrabold",
                  PILL_TONE_CLASS[tone],
                  ANCHOR_CELL[pill.anchor],
                  TILT_CLASS[tilt] ?? "",
                )}
              >
                {pill.dot !== false && !pill.icon ? (
                  <span className={cn("h-[6px] w-[6px] shrink-0 rounded-full", PILL_DOT_CLASS[tone])} />
                ) : null}
                {pill.icon}
                {pill.label}
              </span>
            );
          })}
        </div>
      </div>
    );
  },
);
AnnotatedStatement.displayName = "AnnotatedStatement";

export { AnnotatedStatement };
