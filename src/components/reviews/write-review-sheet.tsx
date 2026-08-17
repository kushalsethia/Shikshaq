import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

/* R3 — the review write sheet (components.md / design.md, changelog C-062).
   A bottom Sheet wrapping the same submit logic TeacherComments already has
   (teacher_comments insert, anonymous → pending approval). copy.md §12's
   privacy line is reproduced verbatim, unedited. */

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
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl border-0 pb-8 pt-6">
        <SheetHeader>
          <SheetTitle className="font-display text-xl font-bold tracking-tight text-foreground">
            Write a review
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this teacher..."
            className="min-h-[120px] resize-none"
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

          <p className="rounded-2xl bg-muted p-4 text-xs leading-5 text-warm-meta">{PRIVACY_LINE}</p>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" variant="primary" size={52} disabled={!comment.trim() || submitting} busy={submitting}>
            Post review
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default WriteReviewSheet;
