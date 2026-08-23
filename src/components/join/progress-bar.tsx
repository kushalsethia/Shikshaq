import { cn } from "@/lib/utils";

/* Redesign JA-002 (09-Join-Onboarding-...md) — the apply wizard's step
   indicator. A segmented bar, one segment per step, filled brand orange as
   steps complete. NEVER a percentage, NEVER a number-in-a-circle stepper.

   This component is now just the segment row — JA-002 puts the back disc to
   its left and the "Step N of M" caption to its right in the SAME row (not
   stacked below, as the previous version did), so that composition lives in
   JoinApply.tsx's header, and this component owns only the bar itself. It
   has exactly one consumer (JoinApply.tsx), so this is a safe reshape. */

export interface ProgressStepsProps {
  /** Total number of steps. */
  steps: number;
  /** Zero-based index of the current step. */
  current: number;
  /** Read by screen readers via aria-label on the progressbar role. */
  label: string;
  className?: string;
}

function ProgressSteps({ steps, current, label, className }: ProgressStepsProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={steps}
      aria-label={label}
      className={cn("flex gap-1.5", className)}
    >
      {Array.from({ length: steps }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "h-[5px] flex-1 rounded-full transition-colors duration-150",
            i <= current ? "bg-brand" : "bg-white/[0.18]",
          )}
        />
      ))}
    </div>
  );
}

export { ProgressSteps };
