import { Link } from 'react-router-dom';
import { ArrowRight, ThumbsUp } from 'lucide-react';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';

interface TeacherCardDetailedProps {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  subjects?: string; // Comma-separated subjects from Shikshaqmine
  classes?: string; // Classes taught from Shikshaqmine
  modeOfTeaching?: string; // Mode of teaching from Shikshaqmine
  sirMaam?: string | null; // Sir/Ma'am from Shikshaqmine
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
  sirMaam
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

  return (
    <Link 
      to={`/teacher/${slug}`} 
      className="group flex gap-4 bg-card rounded-2xl p-4 border border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Teacher Image */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-serif text-muted-foreground">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Teacher Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
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
        {/* Upvote Button */}
        <button
          onClick={handleUpvoteClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background transition-colors z-10"
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

