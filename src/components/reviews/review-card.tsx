import { Star } from "lucide-react";

import { getSubjectPalette } from "@/lib/subject-palette";
import { StripePlaceholder } from "@/components/ui/stripe-placeholder";

/* C7 — Redesign Reviews.dc.html R1 (desktop fan) / R2 (mobile scroll rail):
   subject-tinted card, one tilted gain sticker, subject+class title, hairline
   rule, quote, initial+who+when. Literal px from the mockup per the owner's
   pixel-exact override (see BRIEF.md) — arbitrary Tailwind values, not the
   spacing scale. Desktop fans the cards (-22px overlap, per-card tilt/drop
   stagger lifted straight from R1's `fan` array); mobile (R2) scrolls a row
   of untilted cards — R2 draws no rotation on the mobile cards, unlike the
   desktop fan, so `fan=false` renders flat. */

export interface ReviewCardData {
  id: string;
  quote: string;
  subject?: string | null;
  className?: string | null;
  gain?: string | null;
  initial: string;
  who: string;
  when: string;
  /** 1–5, or null for the reviews written before ratings existed. Never a default. */
  rating?: number | null;
}

// R1 fan array: tilt / stickerTilt / drop / overlap, in mockup order.
const TILTS = ["-rotate-[5deg]", "rotate-[3deg]", "-rotate-[3deg]", "rotate-[5deg]", "-rotate-[4deg]"];
const STICKER_TILTS = ["-rotate-[4deg]", "rotate-[5deg]", "-rotate-[6deg]", "rotate-[4deg]", "-rotate-[3deg]"];
const DROPS = ["mt-[18px]", "mt-0", "mt-[26px]", "mt-[6px]", "mt-[30px]"];

interface ReviewCardProps {
  review: ReviewCardData;
  index: number;
  /** Fans the cards for the desktop-only stacked layout (R1). Mobile (R2) passes false and scrolls them flat, untilted. */
  fan?: boolean;
  /** Only meaningful when fan=false. TeacherProfile's mobile reviews stack
      top to bottom (bug fix, mobile QA — was a horizontal scroll rail) and
      need the card to fill the stack's width instead of the fixed 262px
      built for a horizontal-scroll rail. TeacherDashboard still scrolls its
      reviews horizontally and keeps the fixed width, so this is opt-in. */
  fullWidth?: boolean;
  className?: string;
}

export function ReviewCard({ review, index, fan = false, fullWidth = false, className }: ReviewCardProps) {
  const palette = getSubjectPalette(review.subject);
  const title = [review.subject, review.className].filter(Boolean).join(" · ") || "Review";
  const tilt = TILTS[index % TILTS.length];
  const drop = DROPS[index % DROPS.length];
  // "Name · meta" -> "Name", for the stripe avatar's initial (handoff P-010).
  const authorName = review.who.split(" · ")[0];

  return (
    <div
      className={[
        fan
          ? `relative w-[224px] shrink-0 ${drop} ${index === 0 ? "ml-0" : "-ml-[22px]"} ${tilt} transition-transform duration-150 hover:z-10 hover:rotate-0 hover:-translate-y-1`
          : fullWidth
          ? "relative w-full"
          : "relative w-[262px] shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ zIndex: index }}
    >
      {/* Handoff P-010: rounded-[20px] bg-card p-4, no shadow — the subject
          tint, gain sticker and hairline rule are dropped (gain/className
          are always null in practice, so nothing real is lost); the subject
          title and rating stars stay, since they carry real data the entry
          doesn't say to remove. */}
      <div className="relative rounded-[20px] bg-card p-4">
        <p
          className={fan ? "font-display text-[19px] font-bold leading-[1.15] tracking-[-0.03em]" : "font-display text-[18px] font-bold tracking-[-0.03em]"}
          style={{ color: palette.text }}
        >
          {title}
        </p>
        {/* Drawn only when this review carries a rating. An unrated review
            shows no stars at all rather than five empty ones — five hollow
            stars read as "rated zero", which is a claim nobody made. */}
        {typeof review.rating === "number" && review.rating > 0 && (
          <div className="mt-[6px] flex items-center gap-[2px]" role="img" aria-label={`${review.rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={fan ? "h-[13px] w-[13px]" : "h-[12px] w-[12px]"}
                style={
                  value <= review.rating!
                    ? { fill: palette.solid, color: palette.solid }
                    : { fill: "transparent", color: palette.solid, opacity: 0.28 }
                }
                aria-hidden="true"
              />
            ))}
          </div>
        )}
        <p className="mt-[10px] text-[14px] leading-[1.55] text-warm-prose">
          &ldquo;{review.quote}&rdquo;
        </p>

        <div className="mt-[12px] flex items-center gap-[9px]">
          <StripePlaceholder name={authorName} initialSize={13} className="h-[26px] w-[26px] flex-none rounded-full" />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-foreground">
              {review.who}
            </p>
            <p className="text-[12.5px] text-warm-tertiary">{review.when}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
