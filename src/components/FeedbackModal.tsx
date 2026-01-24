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

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emojiOptions = [
  { id: 1, emoji: '🥵', label: 'Poor', image: '/images/emojis/emoji-1' },
  { id: 2, emoji: '😩', label: 'Below Average', image: '/images/emojis/emoji-2' },
  { id: 3, emoji: '😐', label: 'Average', image: '/images/emojis/emoji-3' },
  { id: 4, emoji: '😊', label: 'Good', image: '/images/emojis/emoji-4' },
  { id: 5, emoji: '🥰', label: 'Excellent', image: '/images/emojis/emoji-5' },
];

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const { user } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(3); // Default to "Average"
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
        console.error('Error submitting feedback:', error);
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
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
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

          {/* Emoji Selection */}
          <div className="w-full flex justify-center px-0.5 sm:px-1">
            <div className="flex gap-0 sm:gap-0.5 md:gap-1 items-center justify-center w-full max-w-full">
              {emojiOptions.map((option) => {
                const isSelected = selectedEmoji === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedEmoji(option.id)}
                    className="flex flex-col items-center transition-all flex-1 relative"
                    style={{ minHeight: '85px' }}
                  >
                    <div
                      className="rounded-full transition-all relative flex items-center justify-center"
                      style={{
                        width: 'clamp(3rem, 15vw, 5rem)',
                        height: 'clamp(3rem, 15vw, 5rem)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(0.7)',
                        opacity: isSelected ? 1 : 0.6,
                        zIndex: isSelected ? 20 : 10,
                      }}
                    >
                      <img
                        src={`${option.image}-${isSelected ? 'selected' : 'unselected'}.png`}
                        alt={option.emoji}
                        className="w-full h-full object-contain transition-all"
                        style={{ margin: 0, padding: 0, display: 'block' }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          if (!img.parentElement?.querySelector('.emoji-fallback')) {
                            const fallback = document.createElement('span');
                            fallback.className = 'emoji-fallback text-2xl';
                            fallback.textContent = option.emoji;
                            img.parentElement?.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="h-4 sm:h-5 mt-0.5 sm:mt-1 flex items-center justify-center">
                      {isSelected ? (
                        <span className="text-[10px] sm:text-xs font-medium text-foreground whitespace-nowrap text-center">
                          {option.label}
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs font-medium text-transparent whitespace-nowrap text-center">
                          {option.label}
                        </span>
                      )}
                    </div>
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
              className="min-h-[80px] sm:min-h-[100px] resize-none border-gray-300 rounded-lg w-full max-w-full mt-2 text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !selectedEmoji}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 sm:py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

