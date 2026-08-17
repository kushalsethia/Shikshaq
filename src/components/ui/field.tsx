import * as React from "react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/eyebrow";

/* Redesign P4 (components.md §1).

   Anatomy, top to bottom: uppercase label → control → error line.
   - 56px single-line, 112–132px multiline
   - radius 15px, shadow-border (never border + shadow stacked, design.md §0.5)
   - focus: ring-2 brand plus a brand hairline
   - NO floating labels. The label sits above and stays there.
   - Errors appear on BLUR only, never while typing, and read as one plain
     sentence (design.md §3 "Feedback"). Never a bare red border.

   This is a wrapper: it owns the label/error/ids and renders whatever control
   you give it, so <input>, <textarea> and <select> all share one appearance. */

const controlBase =
  "w-full rounded-[15px] bg-card px-4 text-[15.5px] text-foreground shadow-border outline-none transition-shadow duration-150 placeholder:text-warm-label focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50";

export interface FieldProps {
  label: string;
  /** Rendered under the control on blur. One plain-language sentence. */
  error?: string;
  /** Quiet helper line, shown only when there is no error. */
  hint?: string;
  /** Marks the control required and appends a visible cue to the label. */
  required?: boolean;
  className?: string;
  children: (controlProps: {
    id: string;
    className: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    required: boolean | undefined;
  }) => React.ReactNode;
}

function Field({ label, error, hint, required, className, children }: FieldProps) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Eyebrow as="span">
        <label htmlFor={id}>
          {label}
          {required ? <span className="text-facet-destructive"> *</span> : null}
        </label>
      </Eyebrow>

      {children({
        id,
        className: cn(
          controlBase,
          "h-14",
          error && "ring-2 ring-facet-destructive",
        ),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        required: required || undefined,
      })}

      {error ? (
        /* role="alert" so the message is announced when it appears on blur. */
        <p id={errorId} role="alert" className="text-meta text-facet-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-meta text-warm-meta">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Single-line input, 56px. */
const FieldInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(controlBase, "h-14", className)} {...props} />
));
FieldInput.displayName = "FieldInput";

/** Multiline, 112–132px per components.md P4. */
const FieldTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(controlBase, "min-h-[112px] max-h-[132px] py-4 leading-relaxed", className)}
    {...props}
  />
));
FieldTextarea.displayName = "FieldTextarea";

/**
 * Convenience hook for the blur-only error rule: keeps the message hidden until
 * the control has been blurred at least once, so typing is never interrupted.
 */
function useBlurValidation(value: string, validate: (v: string) => string | undefined) {
  const [touched, setTouched] = React.useState(false);
  const message = validate(value);
  return {
    error: touched ? message : undefined,
    onBlur: () => setTouched(true),
    /* Clear the touched flag when the field becomes valid again, so a corrected
       field stops shouting before the next blur. */
    reset: () => setTouched(false),
    isValid: !message,
  };
}

export { Field, FieldInput, FieldTextarea, useBlurValidation, controlBase };
