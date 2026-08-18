import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* R3 — Redesign Reviews.dc.html "Leaving one": bottom sheet, literal px per
   the owner's pixel-exact override (see BRIEF.md). Wraps the same submit
   logic TeacherComments already has (teacher_comments insert, anonymous →
   pending approval). copy.md §12's privacy line is reproduced verbatim.

   The star row is now real: teacher_comments.rating exists and this writes to
   it. It stays OPTIONAL — a review with words and no stars is a complete
   review, and forcing a number to get a sentence would fill the table with
   scores nobody meant. The "what changed" gain-chip row from the mockup is
   still not built: there is no column for it, and unlike a rating it has no
   single obvious value, so it is omitted rather than faked. */

const RATING_WORDS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const PRIVACY_LINE =
  "Your first name and class show; your number never does. Reviews cannot be edited by the teacher, and we do not delete honest ones.";

export interface WriteReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (comment: string, isAnonymous: boolean, rating: number | null) => Promise<void> | void;
}

export function WriteReviewSheet({ open, onOpenChange, submitting, error, onSubmit }: WriteReviewSheetProps) {
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment.trim(), isAnonymous, rating || null);
    setComment("");
    setIsAnonymous(false);
    setRating(0);
    setHovered(0);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-[28px] border-0 pb-[22px] pt-[20px] px-[18px]">
        <span className="mx-auto mb-[18px] block h-[4px] w-[44px] rounded-full bg-border" aria-hidden="true" />
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-[21px] font-black tracking-[-0.035em] text-foreground">
            Write a review
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-[18px] flex flex-col gap-[14px]">
          {/* R3's rating row. Optional by design, so it carries no required
              marker and no validation — the submit button is gated on words,
              not stars.

              micro-05: tapping the third star fills one through three, and
              tapping the star that is already the current value clears back
              one, which is how a mis-tap gets undone without a separate
              "clear" link. Hover previews on pointer devices only; on touch,
              `hovered` never fires, so what is filled is what was chosen. */}
          <fieldset className="flex flex-col gap-2" disabled={submitting}>
            <legend className="text-[13px] font-bold text-foreground">
              Rating <span className="font-medium text-warm-meta">(optional)</span>
            </legend>
            <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((value) => {
                const filled = value <= (hovered || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(rating === value ? value - 1 : value)}
                    onMouseEnter={() => setHovered(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={value <= rating}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <Star
                      className={cn(
                        "h-[26px] w-[26px] transition-colors duration-150",
                        filled ? "fill-brand text-brand" : "fill-transparent text-border",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
              {/* The word carries the meaning for anyone who cannot see which
                  stars are filled. Reserved height, so choosing a rating does
                  not shove the textarea down the sheet. */}
              <span className="ml-1 min-h-[18px] text-[13px] font-semibold text-warm-meta" aria-live="polite">
                {rating ? RATING_WORDS[rating] : ""}
              </span>
            </div>
          </fieldset>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this teacher..."
            className="min-h-[96px] resize-none rounded-[18px] px-[16px] py-[14px] text-[15px] leading-[1.6]"
            disabled={submitting}
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="write-review-anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              disabled={submitting}
            />
            <label htmlFor="write-review-anonymous" className="cursor-pointer text-sm font-medium text-foreground">
              Post as anonymous
            </label>
          </div>

          <p className="rounded-2xl bg-muted p-4 text-[12px] leading-[1.5] text-warm-meta">{PRIVACY_LINE}</p>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size={52}
            className="h-[52px] rounded-[14px] text-[15.5px] font-extrabold"
            disabled={!comment.trim() || submitting}
            busy={submitting}
          >
            Post review
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default WriteReviewSheet;
