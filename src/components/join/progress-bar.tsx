import { cn } from "@/lib/utils";

/* Redesign C14 (components.md §2) — the teacher-listing form's step indicator.

   A segmented bar, one segment per step, filled brand orange as steps complete.
   NEVER a percentage, NEVER a number-in-a-circle stepper (components.md §7). */

export interface ProgressStepsProps {
  /** Total number of steps. */
  steps: number;
  /** Zero-based index of the current step. */
  current: number;
  /** Step label, read by screen readers and shown as the visible "Step N of M" line. */
  label: string;
  className?: string;
}

function ProgressSteps({ steps, current, label, className }: ProgressStepsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-label={label}
        className="flex gap-1.5"
      >
        {Array.from({ length: steps }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-150",
              i <= current ? "bg-brand" : "bg-warm-hairline",
            )}
          />
        ))}
      </div>
      <p className="text-meta font-semibold text-warm-meta">
        Step {current + 1} of {steps} · {label}
      </p>
    </div>
  );
}

export { ProgressSteps };
