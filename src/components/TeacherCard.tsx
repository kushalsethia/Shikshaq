import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowUp, BadgeCheck } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { memo } from 'react';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { getSubjectPalette } from '@/lib/subject-palette';
import { Chip } from '@/components/ui/chip';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';

/**
 * C1 — components.md §2 / design.md §2.1 + §2.5 (CONCENTRIC PHOTO, binding).
 *
 * The photo never carries type. The card is a padded frame (mobile 26px radius /
 * 8px padding / 19px inner radius; desktop 28 / 10 / 20) with the photo inset in
 * it; name, verified mark, rating, subject chip and meta all sit BELOW the
 * picture. No gradient scrim, no overhanging sticker, no "Teacher of the week"
 * badge on the image, nothing overlapping a teacher's face — that includes the
 * favourite heart, which moves off the photo into the body row next to the name.
 */

export type TeacherCardVariant = 'grid' | 'rail' | 'row';

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
  /**
   * C1 density (components.md §2, design.md §2.1). `grid` = 174px standard
   * card, `rail` = 172px narrow shelf card, `row` = horizontal list row.
   * Defaults from `size` when omitted so existing callers keep their current
   * layout: size="sm" -> rail, size="md" -> grid.
   */
  variant?: TeacherCardVariant;
  /** Show the read-only upvote-count pill (size 'md' only). Defaults to !isFeatured to match prior behaviour. */
  showUpvotes?: boolean;
  /**
   * Real rating only (design.md §0.10 — every count shown is real, never a
   * fabricated rating). Omitted entirely when absent; never defaulted.
   */
  rating?: number;
  /** Verified mark next to the name. Only rendered when explicitly true. */
  verified?: boolean;
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
  variant,
  showUpvotes: showUpvotesProp,
  rating,
  verified,
}: TeacherCardProps) {
  const isSm = size === 'sm';
  const resolvedVariant: TeacherCardVariant = variant ?? (isSm ? 'rail' : 'grid');
  const isRow = resolvedVariant === 'row';

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
  const placeholderInitialSize = resolvedVariant === 'grid' ? 64 : resolvedVariant === 'rail' ? 46 : 32;

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

  const photo = imageUrl ? (
    <img
      src={validateImageSrc(imageUrl)}
      alt={name}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  ) : (
    <StripePlaceholder name={name} initialSize={placeholderInitialSize} className="h-full w-full" />
  );

  // §7 — an isFeatured card gets a facet chip in the body instead of a
  // "Teacher of the week" badge on the photo (binding: never on the image).
  const featuredChip = isFeatured ? (
    <Chip tone="dark-on" size={34} asChild>
      Featured
    </Chip>
  ) : null;

  const nameHeading = (
    <h3
      className={`line-clamp-2 flex items-center gap-1 break-words font-display font-semibold text-foreground ${isSm || isRow ? 'text-card-title' : 'text-card-title-lg'}`}
      title={displayName}
    >
      <span className="truncate">{displayName}</span>
      {verified && (
        <BadgeCheck className="h-4 w-4 shrink-0 fill-brand text-brand-foreground" aria-label="Verified" />
      )}
    </h3>
  );

  const upvotePill = showUpvotes && upvoteCount > 0 && (
    <span className="flex flex-none items-center gap-1 rounded-full bg-muted px-2 py-1 text-meta font-bold tabular-nums text-foreground">
      <ArrowUp className="h-3 w-3 text-brand" strokeWidth={2.5} aria-hidden="true" />
      {upvoteCount}
    </span>
  );

  const metaRow = meta && (
    <p className={`mt-1 truncate text-muted-foreground ${isSm || isRow ? 'text-meta' : 'text-body-secondary'}`}>{meta}</p>
  );

  const chipsRow = (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <Chip tone="subject" subject={subject} size={34} asChild className="max-w-full">
        {subject}
      </Chip>
      {rating !== undefined && (
        <span className="inline-flex items-center gap-1 text-meta font-bold tabular-nums text-foreground">
          ★ {rating.toFixed(1)}
        </span>
      )}
      {featuredChip}
    </div>
  );

  // Favourite heart — real 44px hit target, now living beside the name instead
  // of overlapping the photo (design.md §2.5 binding rule).
  const heartButton = showFavourite && (
    <button
      type="button"
      onClick={handleHeartClick}
      aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
      aria-pressed={liked}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-tap ease-tap active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <Heart
          className={`h-4 w-4 transition-colors duration-150 ${
            liked ? 'fill-destructive text-destructive' : 'text-muted-foreground'
          }`}
        />
      </span>
    </button>
  );

  if (isRow) {
    return (
      <Link
        to={`/tuition-teachers/${slug}`}
        className="group flex items-center gap-3 rounded-2xl bg-card p-2 shadow-border outline-none transition-transform duration-hover ease-settle hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] active:duration-tap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      >
        <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[19px] bg-muted">{photo}</div>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">{nameHeading}</div>
            {upvotePill}
          </div>
          {metaRow}
          {chipsRow}
        </div>
        {heartButton}
      </Link>
    );
  }

  return (
    /* §5: depth from shadow-border alone — never border + shadow stacked.
       §7: one bold title, everything else text-sm text-muted-foreground.
       §2.5: concentric photo — 8px (mobile) / 10px (desktop) padded frame,
       26px/28px outer radius, 19px/20px inner radius around the photo. */
    <Link
      to={`/tuition-teachers/${slug}`}
      className="group block overflow-hidden rounded-[26px] bg-card p-2 shadow-border outline-none transition-transform duration-hover ease-settle hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] active:duration-tap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:rounded-[28px] sm:p-2.5"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[19px] bg-muted sm:rounded-[20px]">
        {photo}
      </div>

      {/* Body — everything the photo used to carry now lives here. */}
      <div className="px-1 pb-1 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">{nameHeading}</div>
          <div className="flex flex-none items-center gap-1">
            {upvotePill}
            {heartButton}
          </div>
        </div>
        {metaRow}
        {chipsRow}
      </div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-renders when props change or hook state for this specific teacher changes
export const TeacherCard = memo(TeacherCardComponent);
