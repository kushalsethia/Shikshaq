import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowUp, BadgeCheck } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useUpvotes } from '@/lib/upvotes-context';
import { useAuth } from '@/lib/auth-context';
import { memo, useEffect, useState } from 'react';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { getSubjectPalette } from '@/lib/subject-palette';
import { Chip } from '@/components/ui/chip';
import { StripePlaceholder } from '@/components/ui/stripe-placeholder';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { SignInSheet } from '@/components/SignInSheet';
import { resolveTeacherWhatsAppUrl } from '@/utils/whatsapp';

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
  /**
   * Real data only (design.md §0.10) — each is entirely optional and the card
   * degrades cleanly (no line/pill, never a "₹0" or blank) when absent.
   */
  whatsappLink?: string | null; // Shikshaqmine."Link" — routed through /whatsapp-click for tracking
  experienceYears?: number | null; // derived from Shikshaqmine."Years they started teaching"
  minFees?: number | null; // Shikshaqmine."Min Fees"
  maxFees?: number | null; // Shikshaqmine."Max Fees"
  area?: string | null; // Shikshaqmine.Area / "LOCATION V2"
}

// "₹1,800" / "₹1,200 - ₹1,800" / "₹1,200+" / "Up to ₹1,800". Null when neither is set.
function formatFeeLabel(minFees?: number | null, maxFees?: number | null): string | null {
  if (minFees != null && maxFees != null) {
    return minFees === maxFees ? `₹${minFees.toLocaleString()}` : `₹${minFees.toLocaleString()} - ₹${maxFees.toLocaleString()}`;
  }
  if (minFees != null) return `₹${minFees.toLocaleString()}+`;
  if (maxFees != null) return `Up to ₹${maxFees.toLocaleString()}`;
  return null;
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
  whatsappLink,
  experienceYears,
  minFees,
  maxFees,
  area,
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

  // WhatsApp — design.md §3 / micro-interactions: signed-out tap opens the soft
  // sign-in sheet (never a route change), and continues straight to the click-
  // tracking redirect for THIS teacher once auth completes. Mirrors the
  // handleWhatsAppClick pattern on TeacherProfile, scoped per-card since a page
  // can render many of these.
  const [signInSheetOpen, setSignInSheetOpen] = useState(false);
  const pendingWhatsAppKey = `shikshaq_pending_whatsapp_card`;

  useEffect(() => {
    if (!user) return;
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(pendingWhatsAppKey);
    } catch {
      return;
    }
    if (pending && pending === slug) {
      try {
        sessionStorage.removeItem(pendingWhatsAppKey);
      } catch {
        /* ok */
      }
      const url = resolveTeacherWhatsAppUrl(whatsappLink);
      navigate(`/tuition-teachers/${slug}/whatsapp-click`, { state: { url, name } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, slug]);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = resolveTeacherWhatsAppUrl(whatsappLink);
    if (!user) {
      try {
        sessionStorage.setItem(pendingWhatsAppKey, slug);
      } catch {
        /* storage unavailable — sign-in still works, just without auto-continue */
      }
      setSignInSheetOpen(true);
      return;
    }
    navigate(`/tuition-teachers/${slug}/whatsapp-click`, { state: { url, name } });
  };

  const feeLabel = formatFeeLabel(minFees, maxFees);
  const factsParts = [
    experienceYears != null ? `${experienceYears} yrs` : null,
    area || null,
    feeLabel,
  ].filter(Boolean) as string[];
  const factsLine = factsParts.length > 0 ? factsParts.join(' · ') : null;

  const whatsappButton = whatsappLink !== undefined && (
    <Button
      variant="whatsapp"
      size={isSm ? 40 : isRow ? 40 : 44}
      onClick={handleWhatsAppClick}
      /* micro-04-cards-lists-pages.png: "The whole card is one target... the
         WhatsApp button inside does not grow its own hover — only one thing may
         respond at a time." The card lifts on hover and so did this button, so
         pointing at Chat lifted the button inside a card that was already
         lifting. hover:translate-y-0 lands in the same tailwind-merge class
         group as the variant's hover:-translate-y-0.5 and replaces it, leaving
         the card as the only thing that moves. */
      className={`hover:translate-y-0 ${isRow ? 'shrink-0' : 'mt-2 w-full'}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {isRow ? 'Chat' : 'WhatsApp'}
    </Button>
  );

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
      /* 700, not 600 — code.md C1 sets the name at 16px/700 on `row` and
         15px/700 on `grid`. The card's name is the only thing on it competing
         with the photo for attention, and semibold lost that fight. */
      className={`flex items-center gap-1 font-display font-extrabold tracking-[-0.03em] text-foreground ${isSm || isRow ? 'text-card-title' : 'min-w-0 truncate text-[15.5px] sm:text-[19px]'}`}
      title={displayName}
    >
      <span className="min-w-0 truncate">{displayName}</span>
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

  // Experience / area / fee — design.md §2.1 card facts line ("8 yrs · Ballygunge ·
  // ₹1,800"). Entirely optional per-part; the line itself drops when every part is
  // absent rather than rendering empty punctuation.
  const factsRow = factsLine && (
    <p className={`mt-1 truncate font-semibold tabular-nums text-foreground ${isSm || isRow ? 'text-meta' : 'text-body-secondary'}`}>
      {factsLine}
    </p>
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
      <>
        <Link
          to={`/tuition-teachers/${slug}`}
          /* code.md C1, `row` density: card radius 20, padding 10, photo
             96x120 at radius 12. This was radius 16 / padding 8 / a 76x76
             SQUARE photo — so the list showed cropped square thumbnails where
             the spec calls for a portrait, and the concentric maths
             (photo radius = card radius − padding) did not hold. A square crop
             of a portrait photo takes the top of someone's head off. */
          className="group flex items-start gap-3 rounded-[20px] bg-card p-2.5 shadow-border outline-none transition-transform duration-hover ease-settle hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] active:duration-tap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
        >
          <div className="h-[120px] w-24 shrink-0 overflow-hidden rounded-[12px] bg-muted">{photo}</div>
          <div className="min-w-0 flex-1 py-1">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <div className="min-w-[132px] flex-1">{nameHeading}</div>
              {upvotePill}
            </div>
            {metaRow}
            {chipsRow}
            {factsRow}
          </div>
          <div className="flex flex-none flex-col items-end gap-1">
            {heartButton}
            {whatsappButton}
          </div>
        </Link>
        {whatsappLink !== undefined && (
          <SignInSheet open={signInSheetOpen} onOpenChange={setSignInSheetOpen} intent="message" teacherName={name} />
        )}
      </>
    );
  }

  return (
    <>
      {/* §5: depth from shadow-border alone — never border + shadow stacked.
         §7: one bold title, everything else text-sm text-muted-foreground.
         §2.5: concentric photo — 8px (mobile) / 10px (desktop) padded frame,
         26px/28px outer radius, 19px/20px inner radius around the photo. */}
      <Link
        to={`/tuition-teachers/${slug}`}
        className="group block overflow-hidden rounded-[26px] bg-card p-2 shadow-border outline-none transition-transform duration-hover ease-settle hover:-translate-y-0.5 hover:shadow-border-hover active:scale-[0.97] active:duration-tap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:rounded-[28px] sm:p-2.5"
      >
        {/* §2.5 compact grid card (mockup "01 Start with the teachers parents pick"):
            shorter photo than the old 4/5 portrait, tighter body, so four cards read
            as a dense scannable row instead of large portrait tiles. */}
        <div /* Radius is card radius MINUS card padding, per code.md C1, which is
           binding: 26-8=18 mobile and 28-10=18 desktop, so one value covers
           both. components.md C1 tabulates 20 for desktop, which contradicts
           its own subtraction; the rule wins because code.md marks it binding.
           The previous desktop pair broke it outright (22-8=14, drawn as 16),
           which is why the photo corner did not sit concentric inside the
           card corner. */
        className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-muted">
          {photo}
        </div>

        {/* Body — everything the photo used to carry now lives here. */}
        <div className="px-1 pb-0.5 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
            <div className="min-w-[132px] flex-1">{nameHeading}</div>
            <div className="flex flex-none items-center gap-1">
              {upvotePill}
              {heartButton}
            </div>
          </div>
          {metaRow}
          {chipsRow}
          {factsRow}
          {whatsappButton}
        </div>
      </Link>
      {whatsappLink !== undefined && (
        <SignInSheet open={signInSheetOpen} onOpenChange={setSignInSheetOpen} intent="message" teacherName={name} />
      )}
    </>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-renders when props change or hook state for this specific teacher changes
export const TeacherCard = memo(TeacherCardComponent);
