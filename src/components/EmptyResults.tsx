import type { CSSProperties, ReactNode } from 'react';
import { SearchX } from 'lucide-react';

export interface EmptyResultsOption {
  /** Pill label. For real relax options this is "Without {value} · {n}"; the
   * caller is responsible for computing the count and the URL update. */
  label: string;
  onClick: () => void;
}

export interface EmptyResultsAction {
  label: string;
  onClick: () => void;
}

interface EmptyResultsProps {
  /** e.g. "No teachers match all of those filters yet" */
  heading: string;
  /** e.g. "Try relaxing the most restrictive one. These are the nearest sets we have." */
  message: string;
  /** Relax-filter pills — secondary, `bg-muted` (§7). Spec: at most three,
   * highest count first; if none would return results, pass a single option
   * that clears everything. */
  options?: EmptyResultsOption[];
  /** The single primary action, e.g. "Request this paper". */
  action?: EmptyResultsAction;
  /** Optional icon override. Defaults to a "no results" glyph — any page can
   * swap in something closer to its own subject matter. */
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * The canonical empty state (DESIGN_SYSTEM.md §9): icon, one-line explanation,
 * one action. This is a LOUD surface per VISUAL_DIRECTION.md §4 — the user is
 * never comparing anything here, so full Cluster A collage vocabulary applies.
 * Framed as a wrong turn, not a failure (§2): the sticker badge is the
 * "you've wandered off the map" marker, and the relax-filter options render as
 * signposted alternate routes (`.signpost`) rather than plain pills — each one
 * is a way forward, never just an apology. Keeps the page shell intact — this
 * replaces only the section body, never the whole screen.
 */
export function EmptyResults({ heading, message, options, action, icon, className, style }: EmptyResultsProps) {
  const hasRow = Boolean((options && options.length > 0) || action);

  return (
    <div
      className={`halftone-overlay relative flex flex-col items-center overflow-hidden rounded-2xl bg-card p-6 text-center shadow-border sm:p-12 ${className ?? ''}`}
      style={style}
    >
      {/* Die-cut sticker badge — the "wrong turn" marker. Pops in with a
          slight overshoot rather than fading, per VISUAL_DIRECTION §7. */}
      <span
        className="sticker sticker-rotate-sm outline-offset-shadow relative z-10 mb-5 flex h-16 w-16 shrink-0 animate-pop items-center justify-center rounded-full bg-brand/15 text-brand"
      >
        {icon ?? <SearchX className="h-7 w-7" strokeWidth={2} aria-hidden="true" />}
      </span>

      <h3 className="relative z-10 text-card-title-lg font-display font-semibold text-foreground">{heading}</h3>
      <p className="relative z-10 mt-2 max-w-prose text-body-secondary text-muted-foreground">{message}</p>

      {hasRow && (
        <div className="stagger-children relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          {options?.map((option, i) => (
            <button
              key={`${option.label}-${i}`}
              type="button"
              onClick={option.onClick}
              className={`signpost flex min-h-11 animate-card-reveal items-center bg-muted pl-4 text-sm font-medium text-foreground transition-colors duration-hover active:scale-[0.97] ${FOCUS}`}
            >
              {option.label}
            </button>
          ))}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={`flex min-h-11 animate-card-reveal items-center rounded-lg bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors duration-hover hover:bg-brand-hover active:scale-[0.97] ${FOCUS}`}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
