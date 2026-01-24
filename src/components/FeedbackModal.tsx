import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(3); // Default to "Average"
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // TODO: Implement feedback submission logic
    console.log('Feedback submitted:', { emoji: selectedEmoji, comment });
    // Close modal after submission
    onOpenChange(false);
    // Reset form
    setSelectedEmoji(3);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left text-xl font-bold text-foreground">
            Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 overflow-x-hidden w-full">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Give us a feedback!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your input is important for us. We take customer feedback very seriously.
            </p>
          </div>

          {/* Emoji Selection */}
          <div className="w-full flex justify-center">
            <div className="flex gap-1 md:gap-4 items-center justify-center w-full max-w-full">
              {emojiOptions.map((option) => {
                const isSelected = selectedEmoji === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedEmoji(option.id)}
                    className={`flex flex-col items-center transition-all flex-shrink-0 relative ${
                      isSelected ? 'scale-110 z-20' : 'scale-90 opacity-60 z-10'
                    }`}
                  >
                    <div
                      className={`rounded-full transition-all relative ${
                        isSelected
                          ? 'w-20 h-20 bg-transparent'
                          : 'w-14 h-14 bg-gray-100 flex items-center justify-center'
                      }`}
                      style={isSelected ? { padding: 0, margin: 0, display: 'block' } : {}}
                    >
                      <img
                        src={`${option.image}-${isSelected ? 'selected' : 'unselected'}.png`}
                        alt={option.emoji}
                        className={`transition-all ${
                          isSelected ? 'w-[80px] h-[80px] object-contain block' : 'w-10 h-10 object-contain'
                        }`}
                        style={isSelected ? { margin: 0, padding: 0, display: 'block', width: '100%', height: '100%' } : {}}
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
                    {isSelected && (
                      <span className="text-xs font-medium text-foreground whitespace-nowrap -mt-2">
                        {option.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Input */}
          <div className="w-full">
            <Textarea
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none border-gray-300 rounded-lg w-full max-w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full">
            <Button
              onClick={handleSubmit}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

