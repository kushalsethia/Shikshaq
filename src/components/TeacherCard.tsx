import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowUp } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { memo } from 'react';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { getSubjectPalette } from '@/lib/subject-palette';

interface TeacherCardProps {
  id: string;
  name: string;
  slug: string;
  subject: string;
  imageUrl?: string;
  subjectSlug?: string;
  isFeatured?: boolean; // Optional prop to indicate if this is a featured teacher
  /**
   * @deprecated Sharing is not part of the current components/TeacherCard.md spec (the card has
   * no share affordance). Kept so existing callers still compile; it is now a no-op.
   */
  showShareOnMobile?: boolean;
  sirMaam?: string | null; // Sir/Ma'am from Shikshaqmine
  isLiked?: boolean; // Unused: liked state always comes from the useLikes() hook for live updates
  hideFavourite?: boolean; // Hide heart/favourite button
  /**
   * @deprecated Sharing is not part of the current components/TeacherCard.md spec. Kept so
   * existing callers still compile; it is now a no-op.
   */
  hideShare?: boolean;
  meta?: string; // Secondary line below the name, e.g. "Class 9-12 · Ballygunge" (size 'md' only)
  /** Card size per components/TeacherCard.md. Defaults to 'md' (Browse, dashboards, Liked/My Teachers today). */
  size?: 'sm' | 'md';
  /** Show the read-only upvote-count pill (size 'md' only). Defaults to !isFeatured to match prior behaviour. */
  showUpvotes?: boolean;
}

// Formats "{name}, {honorific}" per components/TeacherCard.md. Omits the comma entirely when
// there's no recognisable honorific, so nothing is ever left trailing.
function formatDisplayName(name: string, sirMaam?: string | null): string {
  if (!sirMaam) return name;
  const lower = String(sirMaam).toLowerCase().trim();
  let honorific: string | null = null;
  if (lower === 'sir' || lower.includes('sir')) honorific = 'Sir';
  else if (lower === "ma'am" || lower === 'maam' || lower.includes("ma'am")) honorific = "Ma'am";
  return honorific ? `${name}, ${honorific}` : name;
}

function TeacherCardComponent({
  id,
  name,
  slug,
  subject,
  imageUrl,
  isFeatured,
  sirMaam,
  hideFavourite = false,
  meta,
  size = 'md',
  showUpvotes: showUpvotesProp,
}: TeacherCardProps) {
  const isSm = size === 'sm';

  const displayName = formatDisplayName(name, sirMaam);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hook state drives the heart so likes update instantly everywhere; upvote count is read-only here.
  const { isLiked, toggleLike } = useLikes();
  const { getUpvoteCount } = useUpvotes();
  const liked = isLiked(id);
  const upvoteCount = getUpvoteCount(id);

  const showFavourite = !hideFavourite;
  const showUpvotes = (showUpvotesProp ?? !isFeatured) && !isSm;
  const palette = getSubjectPalette(subject);

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

  return (
    /* §5: depth from shadow-border alone — never border + shadow stacked.
       §7: one bold title, everything else text-sm text-muted-foreground. */
    <Link
      to={`/tuition-teachers/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-card shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={validateImageSrc(imageUrl)}
            alt={name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          /* VISUAL_LANGUAGE §1.4 — diagonal-stripe placeholder for missing photos,
             with a giant low-alpha initial centred on it. */
          <div className="stripe-placeholder flex h-full w-full items-center justify-center">
            <span className="text-6xl font-semibold text-foreground/20" aria-hidden="true">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Subject badge — subject-tinted per VISUAL_LANGUAGE §3 (applies "everywhere",
            including teacher-card badges). Inline style is the sanctioned exception for
            getSubjectPalette values (subject-palette.ts). */}
        <span
          className="absolute left-2 top-2 inline-flex max-w-[calc(100%-4rem)] items-center truncate rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: palette.solid, color: palette.badgeText }}
        >
          {subject}
        </span>

        {/* Featured sticker — VISUAL_LANGUAGE §1.5: tilted, overhanging, one per card,
            white on near-black. Only on featured cards, so it stays well under the
            "never on more than a third of the cards in a grid" ceiling. */}
        {isFeatured && (
          <span
            className="absolute -top-2.5 right-4 rotate-6 rounded-full bg-panel px-3 py-1 text-[11px] font-bold text-white motion-reduce:rotate-0"
            aria-hidden="true"
          >
            Featured
          </span>
        )}

        {/* Favourite heart — 44px hit target (§11). */}
        {showFavourite && (
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={liked}
            className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-border">
              <Heart
                className={`h-4 w-4 transition-colors duration-150 ${
                  liked ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                }`}
              />
            </span>
          </button>
        )}

        {/* Upvote count — read-only pill, size 'md' only */}
        {showUpvotes && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground shadow-border">
            <ArrowUp className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
            {upvoteCount}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        <h3
          className={`line-clamp-2 break-words font-semibold text-foreground ${isSm ? 'text-sm' : 'text-base'}`}
          title={displayName}
        >
          {displayName}
        </h3>
        {!isSm && meta && <p className="mt-1 truncate text-sm text-muted-foreground">{meta}</p>}
      </div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-renders when props change or hook state for this specific teacher changes
export const TeacherCard = memo(TeacherCardComponent);
