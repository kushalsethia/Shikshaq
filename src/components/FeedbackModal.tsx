import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    if (open && scrollContainerRef.current) {
      // Scroll to selected emoji on open only
      const selectedIndex = emojiOptions.findIndex(e => e.id === selectedEmoji);
      if (selectedIndex >= 0 && scrollContainerRef.current) {
        const emojiElement = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
        if (emojiElement) {
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            emojiElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }, 100);
        }
      }
      checkScrollability();
    }
  }, [open]); // Only run when modal opens, not on selection change

  // Separate effect to scroll when selection changes (but not on initial open)
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      const selectedIndex = emojiOptions.findIndex(e => e.id === selectedEmoji);
      if (selectedIndex >= 0 && scrollContainerRef.current) {
        const emojiElement = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
        if (emojiElement) {
          // Small delay to allow size transition
          setTimeout(() => {
            emojiElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            checkScrollability();
          }, 150);
        }
      }
    }
  }, [selectedEmoji]); // Only run when selection changes

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 120; // Adjust based on emoji width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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

          {/* Emoji Selection Slider */}
          <div className="relative w-full overflow-hidden">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
            )}
            
            {/* Scrollable emoji container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollability}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-8 py-2 pb-4"
            >
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

            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
            )}
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

