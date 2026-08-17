import * as React from "react";

import { cn } from "@/lib/utils";
import { Blob } from "@/components/ui/blob";
import { Button } from "@/components/ui/button";

/* Redesign F1 (components.md §4, design.md §3 "State coverage").

   Every list on every screen ships all five of these. They are one component so
   that a list cannot quietly implement three of them and call it done.

   Copy is verbatim from copy.md §4 — do not rewrite it here. Where a count is
   interpolated the caller must pass a REAL number from the query that would run
   (design.md §0.10); if the count cannot be fetched, use the variant that does
   not name one rather than inventing a figure. */

/* ---------- 1. Loading ---------- */

/* F5 SkeletonCard: shimmer over bg-warm-band, shaped like the card it replaces
   — never a generic grey box (components.md §4). Callers describe the real
   geometry so the skeleton matches what lands. */
export interface SkeletonCardProps {
  /** Height of the media block, e.g. the photo box. 0 for text-only rows. */
  media?: number;
  /** Number of text lines beneath. */
  lines?: number;
  className?: string;
}

function SkeletonCard({ media = 132, lines = 2, className }: SkeletonCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-border", className)}>
      {media > 0 ? (
        <div
          className="w-full rounded-2xl bg-warm-band motion-safe:animate-shimmer"
          style={{ height: media }}
        />
      ) : null}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-warm-band motion-safe:animate-shimmer"
          /* Last line short, so the block reads as text rather than as bars. */
          style={{ width: i === lines - 1 ? "58%" : "100%" }}
        />
      ))}
    </div>
  );
}

export interface ListLoadingProps {
  count?: number;
  media?: number;
  lines?: number;
  className?: string;
}

function ListLoading({ count = 4, media, lines, className }: ListLoadingProps) {
  return (
    <div className={cn("grid gap-4", className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} media={media} lines={lines} />
      ))}
    </div>
  );
}

/* ---------- shared panel shell ---------- */

/* States 3 and 4 share one panel shape (design.md §3). */
function StatePanel({
  tone = "muted",
  children,
  className,
}: {
  tone?: "muted" | "brand-subtle";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl p-6",
        tone === "brand-subtle" ? "bg-brand-subtle" : "bg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- 2. Empty, no data yet ---------- */

/* "Never advertise emptiness" (design.md §3.2): this state states a generic
   truth instead of "0 results". It takes a line from the caller because the
   right generic line is screen-specific (copy.md §7, §9). */
function ListEmpty({ line, className }: { line: string; className?: string }) {
  return (
    <StatePanel className={className}>
      <p className="text-body text-warm-prose">{line}</p>
    </StatePanel>
  );
}

/* ---------- 3. Empty after filters ---------- */

function ListOverFiltered({
  onClear,
  className,
}: {
  onClear: () => void;
  className?: string;
}) {
  return (
    <StatePanel tone="brand-subtle" className={className}>
      <Blob mood="meh" size={56} />
      <p className="text-body text-foreground">
        <strong className="font-semibold">Nothing matched all five filters.</strong>{" "}
        Loosen the rate or widen the area — most people find someone within 5 km.
      </p>
      <Button variant="primary" size={44} onClick={onClear}>
        Clear filters
      </Button>
    </StatePanel>
  );
}

/* ---------- 4. Error ---------- */

function ListError({ onRetry, className }: { onRetry: () => void; className?: string }) {
  return (
    /* role="alert" — a failed load must be announced, not just drawn. */
    <StatePanel className={className}>
      <div role="alert" className="flex flex-col items-start gap-4">
        <Blob mood="rough" size={56} />
        <p className="text-body text-foreground">We could not load this just now.</p>
        <Button variant="muted" size={44} onClick={onRetry}>
          Retry
        </Button>
      </div>
    </StatePanel>
  );
}

/* ---------- 5. End of list / truncated ---------- */

function ListEnd({ count, className }: { count: number; className?: string }) {
  return (
    <p className={cn("py-6 text-center text-meta text-warm-meta", className)}>
      That is all {count} for this search. Widen the area to see more.
    </p>
  );
}

export {
  SkeletonCard,
  ListLoading,
  ListEmpty,
  ListOverFiltered,
  ListError,
  ListEnd,
  StatePanel,
};
