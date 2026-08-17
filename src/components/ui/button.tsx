import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Redesign P1 (handoff components.md §1).
   The redesign adds six named variants — primary / indigo / whatsapp / muted /
   dark / ghost — and a 40/44/46/52/54px size ramp. The stock shadcn variants
   (default, destructive, outline, secondary, link) and sizes are KEPT: ~29 files
   still call them, and the handoff's rule is "design wins, keep functionality".
   New work should use the redesign variants; the shadcn ones are legacy.

   Heights come from components.md verbatim. 46/52/54 have no step on the spacing
   scale (44 = h-11, 48 = h-12), so they are arbitrary px. design.md §0.2 bans
   arbitrary *spacing* (`p-5`, `gap-7`, `[13px]` padding) — control height is a
   component dimension the spec fixes, not page rhythm. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* ---- redesign variants (components.md P1) ---- */
        primary:
          "rounded-full bg-brand text-brand-foreground shadow-border hover:bg-brand-hover hover:-translate-y-0.5 hover:shadow-border-hover",
        indigo:
          "rounded-full bg-brand-blue text-brand-blue-foreground shadow-border hover:bg-brand-blue-hover hover:-translate-y-0.5 hover:shadow-border-hover",
        /* Rule 4: the WhatsApp green is #25D366 on #0B3D1F and appears nowhere
           else in the product. Do not add a second green. */
        whatsapp:
          "rounded-full bg-whatsapp text-whatsapp-text shadow-border hover:-translate-y-0.5 hover:shadow-border-hover",
        muted:
          "rounded-full bg-muted text-warm-prose hover:bg-accent hover:-translate-y-0.5",
        dark: "rounded-full bg-panel text-background hover:-translate-y-0.5 hover:shadow-border-hover",

        /* ---- stock shadcn variants (legacy, still in use) ---- */
        default: "rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-md hover:bg-accent hover:text-accent-foreground",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
      },
      size: {
        /* redesign ramp — 44px is the mobile floor (design.md §7) */
        40: "h-10 px-4 text-meta",
        44: "h-11 px-6 text-body-secondary",
        46: "h-[46px] px-6 text-body-secondary",
        52: "h-[52px] px-8 text-body",
        54: "h-[54px] px-8 text-body",

        /* stock shadcn sizes (legacy) */
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-sm",
        icon: "h-10 w-10 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Disable the scale-on-press feedback when motion would be distracting. */
  static?: boolean;
  /**
   * Busy state (components.md P1): the label is swapped for three dots while the
   * button keeps its measured width, so the row never reflows mid-submit.
   */
  busy?: boolean;
}

// Tactile press feedback. 0.97 is the floor — anything smaller feels exaggerated.
// Disabled buttons already have pointer-events-none, so :active can't fire on them.
const tapScale = "active:scale-[0.97]";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      static: isStatic = false,
      busy = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const [lockedWidth, setLockedWidth] = React.useState<number>();

    /* Measure before the label is swapped, so the dots inherit the label's width
       instead of collapsing the button. Released when busy clears. */
    React.useLayoutEffect(() => {
      if (busy) {
        if (innerRef.current && lockedWidth === undefined) {
          setLockedWidth(innerRef.current.getBoundingClientRect().width);
        }
      } else if (lockedWidth !== undefined) {
        setLockedWidth(undefined);
      }
    }, [busy, lockedWidth]);

    /* asChild renders someone else's element (a Link, usually) — Slot requires a
       single child, so the busy treatment does not apply there. */
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size }), !isStatic && tapScale, className)}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(buttonVariants({ variant, size }), !isStatic && tapScale, className)}
        style={lockedWidth !== undefined ? { width: lockedWidth } : undefined}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        {...props}
      >
        {busy ? (
          <>
            <span className="sr-only">Working…</span>
            <span aria-hidden className="inline-flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full bg-current opacity-70 motion-safe:animate-shimmer"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
