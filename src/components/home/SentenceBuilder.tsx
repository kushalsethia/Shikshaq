import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* Redesign C8 (components.md §2, design.md §2.2).

   "I need a [Maths] teacher for [Class 10] in [Lalpur]" — the sentence IS the
   search form. Lives in the footer on every page.

   Two modes:
     teachers  I need a [subject] teacher for [class] near [area]
     papers    Show me [board] [class] papers in [subject] from [school]

   Rules that matter:
   - The CTA states a LIVE count, orange in teacher mode, indigo in papers mode.
     The count is a real number from the query that would run; when the caller
     cannot supply one, the CTA drops the clause rather than showing a zero
     (design.md §0.10).
   - Filled chips alternate ±1.5° rotation so the line reads as handwritten;
     reduced motion flattens them.
   - Chips never wrap inside themselves (design.md §2.4). */

export interface SentenceSlot {
  key: string;
  /** Placeholder shown when the slot is empty, e.g. "subject". */
  placeholder: string;
  value?: string;
  options: string[];
}

export interface SentenceBuilderProps {
  mode: "teachers" | "papers";
  slots: SentenceSlot[];
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  /** Real result count. Omit entirely if it cannot be fetched. */
  count?: number;
  className?: string;
}

/* The literal words between the slots, per design.md §2.2. */
const FRAMES: Record<SentenceBuilderProps["mode"], string[]> = {
  /* leading, then one connector after each slot */
  teachers: ["I need a", "teacher for", "near", ""],
  papers: ["Show me", "", "papers in", "from", ""],
};

function SlotChip({
  slot,
  index,
  onPick,
}: {
  slot: SentenceSlot;
  index: number;
  onPick: (value: string) => void;
}) {
  const filled = Boolean(slot.value);
  /* Alternating tilt — decorative only. */
  const tilt = index % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3 align-middle transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-panel active:scale-[0.97]",
            filled
              ? "bg-card text-foreground"
              : "bg-white/[0.14] text-background ring-[1.5px] ring-inset ring-white/45",
            tilt,
            "motion-reduce:rotate-0",
          )}
          aria-label={filled ? `${slot.placeholder}: ${slot.value}` : `Choose ${slot.placeholder}`}
        >
          {filled ? (
            slot.value
          ) : (
            <>
              <Plus aria-hidden className="size-4" />
              {slot.placeholder}
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-72 w-56 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1">
          {slot.options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => onPick(opt)}
                className={cn(
                  "flex h-11 w-full items-center rounded-lg px-3 text-left text-body-secondary transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  slot.value === opt && "bg-muted font-semibold",
                )}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function SentenceBuilder({
  mode,
  slots,
  onChange,
  onSubmit,
  count,
  className,
}: SentenceBuilderProps) {
  const frame = FRAMES[mode];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-3 font-display text-[26px] font-black leading-tight text-background lg:text-page-title">
        {frame[0] ? <span>{frame[0]}</span> : null}
        {slots.map((slot, i) => (
          <React.Fragment key={slot.key}>
            <SlotChip slot={slot} index={i} onPick={(v) => onChange(slot.key, v)} />
            {frame[i + 1] ? <span>{frame[i + 1]}</span> : null}
          </React.Fragment>
        ))}
      </p>

      <div>
        <Button
          variant={mode === "teachers" ? "primary" : "indigo"}
          size={52}
          onClick={onSubmit}
        >
          {count === undefined
            ? mode === "teachers"
              ? "Find them"
              : "Find papers"
            : `Show ${count} ${mode === "teachers" ? "teachers" : "papers"}`}
        </Button>
      </div>
    </div>
  );
}

export { SentenceBuilder };
