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
 * one action. Keeps the page shell intact — this replaces only the section body,
 * never the whole screen.
 */
export function EmptyResults({ heading, message, options, action, icon, className, style }: EmptyResultsProps) {
  const hasRow = Boolean((options && options.length > 0) || action);

  return (
    <div
      className={`flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-border sm:p-12 ${className ?? ''}`}
      style={style}
    >
      {/* VISUAL_LANGUAGE §1.4's stripe texture, reused here per its own doc comment
          ("any empty media box") so the empty state reads as designed texture
          rather than a bare apologetic icon circle. */}
      <span className="stripe-placeholder mb-4 flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground">
        {icon ?? <SearchX className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />}
      </span>

      <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">{message}</p>

      {hasRow && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {options?.map((option, i) => (
            <button
              key={`${option.label}-${i}`}
              type="button"
              onClick={option.onClick}
              className={`flex min-h-11 items-center rounded-full bg-muted px-4 text-sm font-medium text-foreground transition-colors duration-150 active:scale-[0.97] ${FOCUS}`}
            >
              {option.label}
            </button>
          ))}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={`flex min-h-11 items-center rounded-lg bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors duration-150 hover:bg-brand-hover active:scale-[0.97] ${FOCUS}`}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
