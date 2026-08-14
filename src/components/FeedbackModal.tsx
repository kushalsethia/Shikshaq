import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Frown, Meh, Smile, Laugh, Angry, type LucideIcon } from 'lucide-react';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mood/reaction quick-select — replaces the previous image-based emoji set (the
// `/images/emojis/emoji-N-*.png` assets it depended on) with lucide-react icons.
// Same 1-5 scale as before, so this still maps straight onto the existing
// `feedback.rating` column and handleSubmit below — no schema change needed.
const emojiOptions: { id: number; label: string; Icon: LucideIcon; tone: string }[] = [
  { id: 1, label: 'Frustrated', Icon: Angry, tone: 'text-destructive' },
  { id: 2, label: 'Confused', Icon: Frown, tone: 'text-brand-blue' },
  { id: 3, label: 'Neutral', Icon: Meh, tone: 'text-muted-foreground' },
  { id: 4, label: 'Happy', Icon: Smile, tone: 'text-brand' },
  { id: 5, label: 'Delighted', Icon: Laugh, tone: 'text-brand' },
];

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const { user } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(3); // Default to "Neutral"
  const [comment, setComment] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmoji) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const feedbackData: {
        user_id: string | null;
        rating: number;
        comment: string | null;
        is_guest: boolean;
        guest_email?: string | null;
      } = {
        user_id: user?.id || null,
        rating: selectedEmoji,
        comment: comment.trim() || null,
        is_guest: !user,
        ...(user ? {} : { guest_email: guestEmail.trim() || null }),
      };

      const { error } = await supabase
        .from('feedback')
        .insert([feedbackData]);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error submitting feedback:', error);
        }
        toast.error('Failed to submit feedback. Please try again.');
        return;
      }

      toast.success('Thank you for your feedback!');
      onOpenChange(false);
      // Reset form
      setSelectedEmoji(3);
      setComment('');
      setGuestEmail('');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error submitting feedback:', error);
      }
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left text-lg sm:text-xl font-bold text-foreground">
            Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4 overflow-x-hidden w-full">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
              Give us a feedback!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your input is important for us. We take customer feedback very seriously.
            </p>
          </div>

          {/* Mood quick-select — how do you feel about this? Same 1-5 scale as the
              rating the submission handler already expects (see feedbackData below);
              this is a restyle of the selector, not a new field. */}
          <div className="w-full">
            <p className="text-center text-sm font-medium text-foreground mb-2 sm:mb-3">
              How do you feel about this?
            </p>
            <div className="flex gap-2 sm:gap-3 items-start justify-center w-full max-w-full">
              {emojiOptions.map(({ id, label, Icon, tone }) => {
                const isSelected = selectedEmoji === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedEmoji(id)}
                    aria-pressed={isSelected}
                    aria-label={label}
                    className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-[transform,box-shadow,background-color] duration-150 ${
                        isSelected
                          ? `bg-muted ${tone} ring-2 ring-brand scale-110`
                          : 'bg-muted text-muted-foreground scale-100 hover:scale-105'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guest Email Input (only for non-logged-in users) */}
          {!user && (
            <div className="w-full space-y-2">
              <Label htmlFor="guest-email" className="text-sm">Email (Optional)</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="your.email@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Optional: Provide your email if you'd like us to follow up on your feedback
              </p>
            </div>
          )}

          {/* Comment Input */}
          <div className="w-full">
            <Label htmlFor="comment" className="text-sm">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] sm:min-h-[100px] resize-none rounded-lg w-full max-w-full mt-2 text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !selectedEmoji}
              className="w-full text-white font-medium py-2.5 sm:py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              style={{ background: '#4351FF' }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#2E3AD6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#4351FF'; }}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

