import { getSubjectPalette } from "@/lib/subject-palette";

/* C7 — components.md §2: "Subject-tinted card, one tilted gain sticker,
   subject + class as the title, hairline rule, quote, then initial + who +
   when. Desktop fans them (−22px overlap, ±3–5° tilt, staggered top margin);
   mobile scrolls them."

   Fan overlap/tilt values come from the mockup, but design.md §0.2 bans new
   spacing values on the margin/padding/gap rhythm — -22px isn't on the
   allowed step list. The fan is approximated with the nearest allowed step
   (-ml-6 / mt-4 / mt-8) plus a `rotate()` transform (which is not a spacing
   value and isn't restricted), so the staggered-fan feel survives without a
   new margin token. */

export interface ReviewCardData {
  id: string;
  quote: string;
  subject?: string | null;
  className?: string | null;
  gain?: string | null;
  initial: string;
  who: string;
  when: string;
}

const TILTS = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3", "rotate-1", "-rotate-1"];
const DROPS = ["mt-0", "mt-4", "mt-2", "mt-6", "mt-1", "mt-3"];
const OVERLAPS = ["ml-0", "-ml-6", "ml-0", "-ml-6", "ml-0", "-ml-6"];

interface ReviewCardProps {
  review: ReviewCardData;
  index: number;
  /** Fans the cards for the desktop-only stacked layout. Mobile passes false and scrolls them in a row/column. */
  fan?: boolean;
  className?: string;
}

export function ReviewCard({ review, index, fan = false, className }: ReviewCardProps) {
  const palette = getSubjectPalette(review.subject);
  const title = [review.subject, review.className].filter(Boolean).join(" · ") || "Review";
  const tilt = TILTS[index % TILTS.length];

  return (
    <div
      className={[
        fan
          ? `relative w-64 shrink-0 ${DROPS[index % DROPS.length]} ${OVERLAPS[index % OVERLAPS.length]} ${tilt} transition-transform duration-150 hover:z-10 hover:rotate-0 hover:-translate-y-1`
          : `relative w-64 shrink-0 ${tilt}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ zIndex: index }}
    >
      <div
        className="relative rounded-2xl p-6 shadow-border"
        style={{ backgroundColor: palette.tint }}
      >
        {review.gain && (
          <span
            className="absolute -top-3 right-4 inline-flex -rotate-3 items-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.04em] shadow-border"
            style={{ backgroundColor: palette.solid, color: palette.badgeText }}
          >
            {review.gain}
          </span>
        )}

        <p className="mt-2 font-display text-sm font-bold tracking-tight" style={{ color: palette.text }}>
          {title}
        </p>
        <hr className="my-3 border-t" style={{ borderColor: palette.solid, opacity: 0.25 }} />
        <p className="text-sm leading-6 text-warm-prose">&ldquo;{review.quote}&rdquo;</p>

        <div className="mt-4 flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: palette.solid, color: palette.badgeText }}
            aria-hidden="true"
          >
            {review.initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">{review.who}</p>
            <p className="text-[11px] text-warm-meta">{review.when}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
