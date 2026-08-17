import { Flag } from "lucide-react";

/* Redesign F4 (components.md §4, design.md §6.5).

   Permanent strip under the reader header — never conditional on sign-in
   state. Revision-use only, copyright with the named school (per-paper data,
   not static copy), and a Report link. Copy verbatim from copy.md §6
   "Reader strip". */
export interface DisclaimerStripProps {
  school: string;
  reportHref: string;
}

function DisclaimerStrip({ school, reportHref }: DisclaimerStripProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted px-4 py-3 text-body-secondary text-warm-prose">
      <span className="break-words">
        Shared for revision only. Copyright stays with {school} — reading is free, downloading and
        reposting are not.
      </span>
      <a
        href={reportHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-blue-deep underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Flag size={14} strokeWidth={2} aria-hidden="true" />
        Report this paper
      </a>
    </div>
  );
}

export { DisclaimerStrip };
