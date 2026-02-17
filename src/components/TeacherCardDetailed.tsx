import { Link } from 'react-router-dom';
import { ArrowRight, ThumbsUp } from 'lucide-react';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { validateImageSrc } from '@/utils/imageSanitizer';

interface TeacherCardDetailedProps {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  subjects?: string; // Comma-separated subjects from Shikshaqmine
  classes?: string; // Classes taught from Shikshaqmine
  modeOfTeaching?: string; // Mode of teaching from Shikshaqmine
  sirMaam?: string | null; // Sir/Ma'am from Shikshaqmine
  index?: number; // For staggered entrance animation
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

export function TeacherCardDetailed({
  id,
  name,
  slug,
  imageUrl,
  subjects,
  classes,
  modeOfTeaching,
  sirMaam,
  index = 0
}: TeacherCardDetailedProps) {
  const displayName = formatTeacherName(name, sirMaam);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isUpvoted, toggleUpvote, getUpvoteCount } = useUpvotes();
  const upvoted = isUpvoted(id);
  const upvoteCount = getUpvoteCount(id);

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    await toggleUpvote(id);
  };

  // Mobile: 60ms stagger, Desktop: 80ms stagger, capped at 600ms
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const staggerMs = isMobile ? 60 : 80;
  const delay = Math.min(index * staggerMs, 600);

  return (
    <Link
      to={`/tuition-teachers/${slug}`}
      className="group flex gap-3 bg-card rounded-2xl p-1.5 border border-border hover:shadow-lg transition-all duration-150 active:scale-[0.97] animate-card-reveal opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Teacher Image */}
      <div className="relative w-32 md:w-40 flex-shrink-0 overflow-hidden rounded-xl self-stretch">
        {imageUrl ? (
          <img
            src={imageUrl ? validateImageSrc(imageUrl) : ''}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center min-h-[8rem] md:min-h-[10rem]">
            <span className="text-2xl md:text-3xl font-sans text-muted-foreground">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Upvote Button - On image for mobile, hidden on desktop (shown in right section) */}
        <button
          onClick={handleUpvoteClick}
          className="md:hidden absolute bottom-2 right-2 p-1.5 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors z-10 flex items-center gap-1"
          aria-label={upvoted ? 'Remove upvote' : 'Upvote teacher'}
        >
          <ThumbsUp
            className={`w-3.5 h-3.5 transition-colors ${
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
      </div>

      {/* Teacher Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg md:text-xl font-sans font-semibold tracking-tight text-foreground mb-0.5 group-hover:text-foreground/80 transition-colors">
          {displayName}
        </h3>

        {/* Subjects */}
        {subjects && (
          <p className="text-sm text-muted-foreground mb-2">
            {subjects}
          </p>
        )}

        {/* Classes and Mode of Teaching */}
        <div className="flex flex-wrap gap-2 mt-3">
          {classes && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              {classes}
            </span>
          )}
          {modeOfTeaching && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {modeOfTeaching}
            </span>
          )}
        </div>
      </div>

      {/* View More Arrow and Upvote Button */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Upvote Button - Hidden on mobile (shown on image), visible on desktop */}
        <button
          onClick={handleUpvoteClick}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background transition-colors z-10"
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
            <span className={`text-sm font-medium ${
              upvoted ? 'text-blue-500' : 'text-foreground/70'
            }`}>
              {upvoteCount}
            </span>
          )}
        </button>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
          <span className="text-sm font-bold hidden sm:inline">View more details</span>
          <ArrowRight className="w-4 h-4 font-bold" strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}

