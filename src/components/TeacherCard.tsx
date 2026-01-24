import { Link } from 'react-router-dom';
import { Heart, ThumbsUp } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { ShareButton } from '@/components/ShareButton';

interface TeacherCardProps {
  id: string;
  name: string;
  slug: string;
  subject: string;
  imageUrl?: string;
  subjectSlug?: string;
  isFeatured?: boolean; // Optional prop to indicate if this is a featured teacher
  sirMaam?: string | null; // Sir/Ma'am from Shikshaqmine
  isLiked?: boolean; // Optional: pass liked state directly to avoid hook call
}

// Helper function to format name with Sir/Ma'am
function formatTeacherName(name: string, sirMaam?: string | null): string {
  if (!sirMaam) return name;
  
  const sirMaamLower = String(sirMaam).toLowerCase().trim();
  if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
    return `${name} Sir`;
  } else if (sirMaamLower === "ma'am" || sirMaamLower === "maam" || sirMaamLower.includes("ma'am")) {
    return `${name} Ma'am`;
  }
  return name;
}

const subjectColors: Record<string, string> = {
  maths: 'bg-badge-maths',
  english: 'bg-badge-english',
  science: 'bg-badge-science',
  commerce: 'bg-badge-commerce',
  computer: 'bg-badge-computer',
  hindi: 'bg-badge-hindi',
  history: 'bg-badge-history',
  geography: 'bg-badge-geography',
  physics: 'bg-badge-science',
  chemistry: 'bg-badge-science',
  biology: 'bg-badge-science',
  economics: 'bg-badge-commerce',
};

function TeacherCardComponent({ id, name, slug, subject, imageUrl, subjectSlug, isFeatured, sirMaam, isLiked: isLikedProp }: TeacherCardProps) {
  // If featured, always use green; otherwise use subject-specific colors
  const badgeColor = isFeatured 
    ? 'bg-badge-science' // Green color for featured teachers
    : (subjectColors[subjectSlug?.toLowerCase() || subject.toLowerCase()] || 'bg-muted-foreground');
  
  const displayName = formatTeacherName(name, sirMaam);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use hook for real-time updates (optimistic updates make this instant)
  const { isLiked, toggleLike } = useLikes();
  const { isUpvoted, toggleUpvote, getUpvoteCount } = useUpvotes();
  // Use hook's state for real-time updates, prop is only for initial optimization
  const liked = isLiked(id);
  const upvoted = isUpvoted(id);
  const upvoteCount = getUpvoteCount(id);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    // Optimistic update happens in the hook - UI updates instantly
    await toggleLike(id);
  };

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    await toggleUpvote(id);
  };

  return (
    <Link to={`/tuition-teachers/${slug}`} className="teacher-card group">
      <div className="rounded-2xl border-4 border-white overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center">
            <span className="text-4xl font-serif text-muted-foreground">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Subject Badge - Top-left corner */}
        <div className="absolute top-1 left-1 z-10">
          <span className={`subject-badge ${badgeColor}`}>
            {subject}
          </span>
        </div>

        {/* Heart Icon (Favourite) */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              liked
                ? 'fill-red-500 text-red-500'
                : 'text-foreground/70 hover:text-red-500'
            }`}
          />
        </button>

        {/* Upvote Button - Only show if not featured */}
        {!isFeatured && (
          <button
            onClick={handleUpvoteClick}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10 flex items-center gap-1"
            aria-label={upvoted ? 'Remove upvote' : 'Upvote teacher'}
          >
            <ThumbsUp
              className={`w-4 h-4 transition-colors ${
                upvoted
                  ? 'fill-blue-500 text-blue-500'
                  : 'text-foreground/70 hover:text-blue-500'
              }`}
            />
            {upvoteCount > 0 && (
              <span className={`text-xs font-medium ${
                upvoted ? 'text-blue-500' : 'text-foreground/70'
              }`}>
                {upvoteCount}
              </span>
            )}
          </button>
        )}

        {/* Share Button - Only show if featured */}
        {isFeatured && (
          <div className="absolute bottom-3 right-3 z-10">
            <ShareButton
              url={`/tuition-teachers/${slug}`}
              title={displayName}
              description={`${subject} Tuition Teacher`}
              className=""
              iconSize="md"
            />
          </div>
        )}
        </div>
        
        {/* Teacher Name - Inside the bordered card */}
        <div className="py-2.5 bg-white">
          <h3 className="font-semibold text-foreground text-sm group-hover:text-foreground/80 transition-colors px-3">
            {displayName}
          </h3>
        </div>
      </div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-renders when props change or hook state for this specific teacher changes
export const TeacherCard = memo(TeacherCardComponent);
