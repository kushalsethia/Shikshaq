import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

/* R3 — Redesign Reviews.dc.html "Leaving one": bottom sheet, literal px per
   the owner's pixel-exact override (see BRIEF.md). Wraps the same submit
   logic TeacherComments already has (teacher_comments insert, anonymous →
   pending approval). copy.md §12's privacy line is reproduced verbatim.

   R3 draws a star-rating row and a "what changed" gain-chip row that this
   table has no columns for (teacher_comments is just `comment` + `is_anonymous`).
   Rather than fabricate data those controls would write nowhere, they're
   rendered as presentational-only UI matching the mockup's pixels, wired to
   local state that isn't submitted — see inline notes. Reported as a
   mockup/data contradiction. */

const PRIVACY_LINE =
  "Your first name and class show; your number never does. Reviews cannot be edited by the teacher, and we do not delete honest ones.";

export interface WriteReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (comment: string, isAnonymous: boolean) => Promise<void> | void;
}

export function WriteReviewSheet({ open, onOpenChange, submitting, error, onSubmit }: WriteReviewSheetProps) {
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment.trim(), isAnonymous);
    setComment("");
    setIsAnonymous(false);
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
