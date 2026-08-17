import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/* Redesign F4 (components.md §4, design.md §6.5).

   Permanent strip under the reader header — never conditional on sign-in
   state. Revision-use only, copyright with the named school (per-paper data,
   not static copy), and a Report link. Copy verbatim from copy.md §6
   "Reader strip".

   S5 draws this on the dark reader ground: padding 11px 16px, white/6% fill,
   1px white/10% bottom hairline, 15px info glyph in --indigo-link-on-dark,
   11.5px/1.5 body at white/66%, links in --indigo-link-on-dark at weight 600.
   `tone="bone"` keeps the original light treatment for any light surface. */
export interface DisclaimerStripProps {
  school: string;
  reportHref: string;
  tone?: "bone" | "dark";
}

function DisclaimerStrip({ school, reportHref, tone = "bone" }: DisclaimerStripProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex items-start gap-[9px]",
        dark
          ? "border-b border-white/10 bg-white/[.06] px-4 py-[11px]"
          : "flex-wrap items-center gap-2 rounded-lg bg-muted px-4 py-3",
      )}
    >
      <Info
        size={15}
        strokeWidth={2.2}
        aria-hidden="true"
        className={cn("mt-px flex-none", dark ? "text-indigo-link-on-dark" : "text-muted-foreground")}
      />
      <span
        className={cn(
          "break-words",
          dark ? "text-[11.5px] leading-[1.5] text-white/[.66]" : "text-body-secondary text-warm-prose",
        )}
      >
        Shared for revision only. Copyright stays with{" "}
        <span className={cn(dark && "font-semibold text-indigo-link-on-dark")}>{school}</span> — reading is
        free, downloading and reposting are not.{" "}
        <a
          href={reportHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            /* Mockup draws this inline at 11.5px; the 44px floor is met with a
               padded inline-flex hit area rather than by growing the type. */
            "inline-flex min-h-11 items-center gap-1.5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            dark
              ? "text-indigo-link-on-dark focus-visible:ring-offset-panel"
              : "text-brand-blue-deep underline focus-visible:ring-offset-background",
          )}
        >
          Report this paper
        </a>
      </span>
    </div>
  );
}

export { DisclaimerStrip };
