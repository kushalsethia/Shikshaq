import { Star } from "lucide-react";

import { getSubjectPalette } from "@/lib/subject-palette";

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
  className?: string;
}

export function ReviewCard({ review, index, fan = false, className }: ReviewCardProps) {
  const palette = getSubjectPalette(review.subject);
  const title = [review.subject, review.className].filter(Boolean).join(" · ") || "Review";
  const tilt = TILTS[index % TILTS.length];
  const stickerTilt = STICKER_TILTS[index % STICKER_TILTS.length];
  const drop = DROPS[index % DROPS.length];

  return (
    <div
      className={[
        fan
          ? `relative w-[224px] shrink-0 ${drop} ${index === 0 ? "ml-0" : "-ml-[22px]"} ${tilt} transition-transform duration-150 hover:z-10 hover:rotate-0 hover:-translate-y-1`
          : "relative w-[262px] shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ zIndex: index }}
    >
      <div
        className={
          fan
            ? "relative rounded-[20px] pt-[22px] px-[20px] pb-[20px] shadow-border"
            : "relative rounded-[20px] pt-[22px] px-[18px] pb-[18px] shadow-border"
        }
        style={{ backgroundColor: palette.tint }}
      >
        {review.gain && (
          <span
            className={
              fan
                ? `absolute -top-[13px] left-[16px] inline-flex h-[28px] items-center whitespace-nowrap rounded-full px-[12px] text-[11px] font-extrabold shadow-border ${stickerTilt}`
                : `absolute -top-[12px] left-[14px] inline-flex h-[26px] items-center whitespace-nowrap rounded-full px-[11px] text-[10.5px] font-extrabold shadow-border ${stickerTilt}`
            }
            style={{ backgroundColor: palette.solid, color: palette.badgeText }}
          >
            {review.gain}
          </span>
        )}

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
        <hr
          className={fan ? "mt-[12px] mb-[14px] h-[1.5px] border-0" : "mt-[10px] mb-[12px] h-[1.5px] border-0"}
          style={{ backgroundColor: palette.solid, opacity: 0.2 }}
        />
        <p className={fan ? "mb-[16px] text-[14px] leading-[1.55] text-warm-prose" : "mb-[14px] text-[14px] leading-[1.55] text-warm-prose"}>
          &ldquo;{review.quote}&rdquo;
        </p>

        <div className="flex items-center gap-[9px]">
          <span
            className={
              fan
                ? "flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
                : "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold"
            }
            style={{ backgroundColor: palette.solid, color: palette.badgeText }}
            aria-hidden="true"
          >
            {review.initial}
          </span>
          <div className="min-w-0">
            <p className={fan ? "truncate text-[13px] font-extrabold text-foreground" : "truncate text-[12.5px] font-extrabold text-foreground"}>
              {review.who}
            </p>
            <p className={fan ? "text-[11.5px] text-warm-meta" : "text-[11px] text-warm-meta"}>{review.when}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
