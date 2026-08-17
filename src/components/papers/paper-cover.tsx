import * as React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { getSubjectPalette } from "@/lib/subject-palette";
import { IconDisc } from "@/components/ui/icon-disc";

/* Redesign C2 (components.md §2, design.md §2.6).

   A paper drawn as an OBJECT, not a row: subject `tint` fill, a 9–10px
   `solid` spine down the left with a faint inner strip beside it, radius
   `6px 16px 16px 6px`, board eyebrow, subject in display type, paper line,
   and a lock disc when the reader is signed out. The spine is the one large
   surface allowed to use `solid` — it carries no copy (tokens.md §3 scope
   rule / components.md C2 note).

   Sizes: 118×156 mobile, 136–150×206–210 desktop — set via `size`. */
export interface PaperCoverPaper {
  id: string;
  title: string;
  subject: string;
  board: string;
  year: number;
}

export interface PaperCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  paper: PaperCoverPaper;
  /** Show the 26px lock disc — the reader is not signed in. */
  locked?: boolean;
  size?: "mobile" | "desktop";
  href?: string;
}

const SIZE_CLASSES = {
  mobile: "h-[156px] w-[118px]",
  desktop: "h-[206px] w-[136px] lg:h-[210px] lg:w-[150px]",
} as const;

const PaperCover = React.forwardRef<HTMLDivElement, PaperCoverProps>(
  ({ className, paper, locked = false, size = "mobile", href, ...props }, ref) => {
    const palette = getSubjectPalette(paper.subject);

    const content = (
      <div
        ref={ref}
        className={cn(
          "group relative flex shrink-0 flex-col overflow-hidden pl-3 pr-3 pt-3 transition-transform duration-150 ease-out active:scale-[0.97] hover:-translate-y-0.5",
          SIZE_CLASSES[size],
          className,
        )}
        style={{ backgroundColor: palette.tint, borderRadius: "6px 16px 16px 6px" }}
        {...props}
      >
        {/* Spine: the one large surface allowed a subject `solid` fill. No copy. */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[9px] sm:w-[10px]"
          style={{ backgroundColor: palette.solid }}
        />
        {/* Faint inner strip beside the spine. */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-[9px] w-1 sm:left-[10px]"
          style={{ backgroundColor: palette.meta, opacity: 0.18 }}
        />

        {locked ? (
          <IconDisc
            tone="dark"
            size={26}
            className="absolute right-2 top-2 z-10 bg-panel/85"
            label="Sign in to read"
          >
            <Lock size={13} strokeWidth={2.25} aria-hidden="true" />
          </IconDisc>
        ) : null}

        <span
          className="text-label font-bold uppercase tabular-nums"
          style={{ color: palette.meta }}
        >
          {paper.board}
        </span>

        <span
          className="mt-1 line-clamp-3 break-words font-display text-card-title font-bold leading-tight"
          style={{ color: palette.text }}
        >
          {paper.subject}
        </span>

        <span className="mt-auto block truncate pb-3 text-meta font-medium" style={{ color: palette.meta }}>
          {paper.title} · {paper.year}
        </span>
      </div>
    );

    if (href) {
      return (
        <Link
          to={href}
          className="inline-flex rounded-[6px_16px_16px_6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${paper.subject} — ${paper.title}${locked ? " (sign in to read)" : ""}`}
        >
          {content}
        </Link>
      );
    }
    return content;
  },
);
PaperCover.displayName = "PaperCover";

/* C4 ShelfLedge — the surface covers stand on. `#EFE9E1` on bone maps to the
   `warm-band` token; on indigo it's white at 14%. Never a raw hex. */
export interface ShelfLedgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "bone" | "indigo";
}

const ShelfLedge = React.forwardRef<HTMLDivElement, ShelfLedgeProps>(
  ({ className, tone = "bone", children, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <div className="flex items-end gap-3 overflow-x-auto pb-4 pl-1 pr-1 pt-2 scrollbar-hide sm:gap-4">
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "h-2 rounded-full",
          tone === "bone" ? "bg-warm-band" : "bg-white/[.14]",
        )}
      />
    </div>
  ),
);
ShelfLedge.displayName = "ShelfLedge";

export { PaperCover, ShelfLedge };
