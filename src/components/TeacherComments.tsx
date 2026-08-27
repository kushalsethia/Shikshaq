import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, Sparkles, CheckCircle2, Star, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { saveAuthRedirect } from '@/utils/authRedirect';
import { ReviewCard, type ReviewCardData } from '@/components/reviews/review-card';
import { WriteReviewSheet } from '@/components/reviews/write-review-sheet';
import { ListLoading, ListError } from '@/components/ui/list-states';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { hasContactedTeacher } from '@/lib/contact-record';

interface Comment {
  id: string;
  comment: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_anonymous: boolean;
  approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  profiles: {
    full_name: string | null;
    role: string | null;
    school_college: string | null;
    grade: string | null;
    avatar_url: string | null;
  } | null;
}

interface TeacherCommentsProps {
  teacherId: string;
  /** Primary subject, so review cards pick up the same subject tint as the rest of the page. */
  subject?: string | null;
  /** Teacher's slug — used only to check whether this device has a recorded
      WhatsApp contact with them (pages.md §"Reviews": the write-review
      button is gated on a recorded contact). */
  teacherSlug?: string | null;
}

function getCommentAuthorName(comment: Comment): string {
  if (comment.is_anonymous) return 'Anonymous';
  if (comment.profiles?.full_name) return comment.profiles.full_name;
  return 'Anonymous';
}

function getCommentAuthorInfo(comment: Comment): string {
  if (comment.is_anonymous) return '';
  if (comment.profiles?.role === 'guardian') return 'Guardian';
  if (comment.profiles?.role === 'student') {
    const parts: string[] = [];
    if (comment.profiles.school_college) parts.push(comment.profiles.school_college);
    if (comment.profiles.grade) parts.push(`Grade ${comment.profiles.grade}`);
    return parts.join(' • ');
  }
  return '';
}

function getCommentInitials(comment: Comment): string {
  if (comment.is_anonymous) return 'A';
  if (comment.profiles?.full_name) {
    const names = comment.profiles.full_name.split(' ');
    if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    return names[0][0].toUpperCase();
  }
  return 'U';
}

export function TeacherComments({ teacherId, subject, teacherSlug }: TeacherCommentsProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  /* Which review the confirm dialog is asking about. micro-06-non-negotiables
     rule 4 forbids a browser alert for a confirmation; window.confirm is also
     unstyled, unbranded, and on iOS says "localhost says". */
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const [writeSheetOpen, setWriteSheetOpen] = useState(false);
  // Success moment (task #4) — LOUD is permitted here, it's an arrival not a
  // comparison. Distinguishes the immediate-post case from the anonymous
  // approval-queue case, since those are genuinely different outcomes.
  const [justSubmitted, setJustSubmitted] = useState<'approved' | 'pending' | null>(null);
  /* Recomputed on mount and on window focus — the common path is: tap
     WhatsApp, leave the tab (mobile hands off to the WhatsApp app; desktop
     opens a new tab), come back, the button should now be enabled without a
     full page reload. */
  const [contacted, setContacted] = useState(() => hasContactedTeacher(teacherSlug));
  useEffect(() => {
    setContacted(hasContactedTeacher(teacherSlug));
    const onFocus = () => setContacted(hasContactedTeacher(teacherSlug));
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [teacherSlug]);

  useEffect(() => {
    fetchComments();
  }, [teacherId, user]);

  async function fetchComments() {
    try {
      setLoading(true);
      setError(null);

      // Fetch approved comments, or pending comments if they're the current user's
      // The RLS policies will handle filtering:
      // - Public can see approved comments
      // - Users can see their own pending comments
      const { data: commentsData, error: commentsError } = await supabase
        /* Reads go through teacher_comments_public; only writes and the
           own-row delete touch the base table. `anon` has no SELECT on
           teacher_comments.user_id any more — that column joined against an
           unfiltered public_profiles undid "post as anonymous" for all 158
           anonymous reviews. The view nulls the author id on anonymous rows
           EXCEPT your own, so you can still find and delete a review you
           posted anonymously. */
        .from('teacher_comments_public')
        .select('id, comment, rating, created_at, updated_at, user_id, is_anonymous, approved')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (commentsError) {
        if (import.meta.env.DEV) {
          console.error('Comments fetch error:', commentsError);
        }
        throw commentsError;
      }

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      const commentsWithDefaults = commentsData.map((comment) => ({
        ...comment,
        approved: (comment as any).approved ?? true,
        approved_by: (comment as any).approved_by ?? null,
        approved_at: (comment as any).approved_at ?? null,
      }));

      const filteredComments = commentsWithDefaults.filter(
        (comment) => comment.approved || (user && comment.user_id === user.id),
      );

      /* Boolean filter is load-bearing now: teacher_comments_public returns
         user_id as NULL for anonymous reviews, and passing those straight into
         .in('id', …) sent the string "null" to PostgREST, which rejected the
         whole request with 'invalid input syntax for type uuid'. Anonymous
         rows have no profile to look up by design. */
      const userIds = [...new Set(filteredComments.map((c) => c.user_id).filter(Boolean))];
      if (userIds.length === 0) {
        setComments([]);
        return;
      }

      // Use public_profiles view to avoid exposing PII (email, phone, address, etc.)
      const { data: profilesData, error: profilesError } = await supabase
        .from('public_profiles')
        .select('id, full_name, role, school_college, grade, avatar_url')
        .in('id', userIds);

      if (profilesError && import.meta.env.DEV) {
        console.error('Profiles fetch error:', profilesError);
      }

      const profilesMap = new Map((profilesData || []).map((profile) => [profile.id, profile]));

      const commentsWithProfiles = filteredComments.map((comment) => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null,
      }));

      setComments(commentsWithProfiles);
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Error fetching comments:', err);
      }
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(comment: string, isAnonymous: boolean, rating: number | null) {
    if (!user || !comment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Only require approval for anonymous comments. Non-anonymous comments
      // are approved immediately.
      const approved = !isAnonymous;

      const { error } = await supabase.from('teacher_comments').insert({
        teacher_id: teacherId,
        user_id: user.id,
        comment: comment.trim(),
        is_anonymous: isAnonymous,
        // Null when nobody picked a star. Stored as null rather than 0 so the
        // average counts only ratings people actually chose.
        rating,
        approved,
      });

      if (error) throw error;

      setWriteSheetOpen(false);
      setJustSubmitted(approved ? 'approved' : 'pending');
      await fetchComments();
      setVisibleCommentsCount(5);
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Error submitting comment:', err);
      }
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!user) return;
    setPendingDeleteId(null);

    try {
      setDeletingCommentId(commentId);
      setError(null);

      const { error } = await supabase
        .from('teacher_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id); // Extra safety check

      if (error) throw error;

      toast.success('Review deleted successfully');
      await fetchComments();
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Error deleting comment:', err);
      }
      toast.error(err.message || 'Failed to delete review');
    } finally {
      setDeletingCommentId(null);
    }
  }

  const handleWriteReviewClick = () => {
    if (!user) {
      saveAuthRedirect(location.pathname);
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!contacted) {
      toast.info('Message the teacher on WhatsApp first, then you can leave a review.');
      return;
    }
    setWriteSheetOpen(true);
  };

  const visibleComments = comments.slice(0, visibleCommentsCount);
  const cards: ReviewCardData[] = visibleComments.map((comment) => ({
    id: comment.id,
    quote: comment.comment,
    subject: subject || null,
    className: null,
    gain: null,
    initial: getCommentInitials(comment),
    who: [getCommentAuthorName(comment), getCommentAuthorInfo(comment)].filter(Boolean).join(' · '),
    when: formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }),
    rating: comment.rating,
  }));

  /* The average is over rated reviews only, so it never counts the 377 older
     reviews that were written before ratings existed as if they were silence
     or as if they were five stars. Below three ratings there is no average
     shown: one person's opinion rendered as "5.0" reads like a track record
     and is not one. */
  const rated = comments.filter((c) => typeof c.rating === 'number' && c.rating > 0);
  const average =
    rated.length >= 3
      ? Math.round((rated.reduce((sum, c) => sum + (c.rating ?? 0), 0) / rated.length) * 10) / 10
      : null;

  return (
    <div className="min-w-0">
      {/* Handoff P-010: heading 18px/800/-0.03em/text-brand-deep (was
          27px/900 mobile, 46px desktop, text-foreground — this section now
          lives inside its own orange-tinted BentoPanel, so it takes that
          panel's heading scale, not the page's section-break scale).
          ⚠ Ratings kept per owner direction — the changelog's "no rating
          column" premise predates this feature; only restyled, not removed. */}
      <div className="mb-[16px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-[18px] font-extrabold tracking-[-0.03em] text-brand-deep">
            Reviews
          </h2>
          <span className="tabular-nums text-warm-meta">({comments.length})</span>
          {average !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[13px] font-bold text-brand-deep">
              <Star className="h-[13px] w-[13px] fill-current" aria-hidden="true" />
              <span className="tabular-nums">{average.toFixed(1)}</span>
              <span className="font-semibold text-warm-meta">
                ({rated.length} rating{rated.length === 1 ? '' : 's'})
              </span>
            </span>
          )}
        </div>
        <Button
          size={44}
          className="rounded-full bg-brand text-[13.5px] font-bold text-brand-foreground hover:bg-brand-hover"
          onClick={handleWriteReviewClick}
          disabled={Boolean(user) && !contacted}
          title={user && !contacted ? 'Message the teacher on WhatsApp first to unlock this' : undefined}
        >
          Add your review
        </Button>
      </div>

      {/* Gate notice — pages.md §"Reviews": the write-review button is only
          offered once a WhatsApp contact is on record for this user + teacher.
          Stated plainly rather than left as a silently-disabled button, per
          design.md's rule that a gate names itself on the page. */}
      {user && !contacted && (
        <p className="mb-6 text-sm text-muted-foreground">
          Message the teacher on WhatsApp first, then you can leave a review.
        </p>
      )}

      {/* Post-submission success — LOUD moment (task #4). Anonymous reviews go to
          an approval queue, which is a genuinely different outcome from an
          immediately-live review, so it gets its own copy rather than one
          generic "thanks" message. */}
      {justSubmitted && (
        <div
          role="status"
          className="sticker sticker-rotate-sm outline-offset-shadow animate-pop relative mb-8 flex items-start gap-3 rounded-2xl bg-brand-subtle p-6"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
            {justSubmitted === 'approved' ? (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Clock className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold tracking-tight text-brand-deep">
              {justSubmitted === 'approved' ? 'Posted! Thanks for sharing.' : 'Sent for approval'}
            </p>
            <p className="mt-1 text-sm text-warm-prose">
              {justSubmitted === 'approved'
                ? 'Your review is live for other parents and students to see.'
                : "Anonymous reviews are checked by our team first. Yours will appear here once it's approved."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setJustSubmitted(null)}
            aria-label="Dismiss"
            className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-brand-deep/70 transition-colors duration-150 before:absolute before:-inset-1 before:content-[''] hover:bg-brand/10 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {!user && (
        // Signals the sign-in requirement up front rather than gating on click
        // (task #2).
        <p className="mb-6 text-sm text-muted-foreground">
          <Button
            variant="link"
            className="h-auto p-0 text-foreground underline"
            onClick={handleWriteReviewClick}
          >
            Sign in
          </Button>{' '}
          to leave a review
        </p>
      )}

      {/* Comments List — all five list states (design.md §3), via the shared
          ui/list-states component so this list can't quietly ship fewer than
          five. Loading/error use the shared shell; empty stays the richer
          sticker moment below (VISUAL_DIRECTION §4 names it a LOUD moment). */}
      {loading ? (
        <ListLoading count={3} media={0} lines={3} className="grid-flow-col auto-cols-[16rem] overflow-x-hidden" />
      ) : error ? (
        <ListError onRetry={fetchComments} />
      ) : comments.length === 0 ? (
        // "No reviews yet" is one of VISUAL_DIRECTION §4's named LOUD moments —
        // the single highest-leverage empty state on this page, since a new
        // teacher profile will sit at zero reviews for a while.
        <div className="sticker sticker-rotate-sm outline-offset-shadow animate-pop mx-auto max-w-sm rounded-2xl bg-card px-6 py-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-subtle">
            <Sparkles className="h-6 w-6 text-brand-deep" aria-hidden="true" />
          </span>
          <p className="font-display text-xl font-bold tracking-tight text-foreground">No reviews yet</p>
          <p className="mx-auto mt-2 max-w-[32ch] text-sm text-muted-foreground">
            Be the first parent or student to share how it went.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: vertical stack, top to bottom (bug fix, mobile QA — was
              a horizontal scroll rail, which buried later reviews behind a
              swipe nobody was told to make). Desktop: fanned overlapping
              stack (C7 / C-062) — −22px overlap approximated with allowed
              spacing steps, see review-card.tsx. */}
          <div className="stagger-children flex flex-col gap-[12px] pb-4 pt-2 md:flex-row md:flex-wrap md:gap-[12px] md:overflow-visible md:pb-8 md:pt-0">
            {cards.map((card, i) => (
              <ReviewCard key={card.id} review={card} index={i} fan className="hidden md:block" />
            ))}
            {cards.map((card, i) => (
              <div key={card.id} className="md:hidden">
                <ReviewCard review={card} index={i} fan={false} fullWidth />
              </div>
            ))}
          </div>

          {/* Delete affordance for the visitor's own review — retained control
              the mockup doesn't picture but the app needs (brief "keep
              functionality"). Kept as a plain list under the cards rather than
              inline on the card, since ReviewCard's shape has no room for it. */}
          {user && visibleComments.some((c) => c.user_id === user.id) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {visibleComments
                .filter((c) => c.user_id === user.id)
                .map((c) => (
                  <div key={c.id} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs text-warm-meta">
                    {!c.approved && (
                      <span className="inline-flex items-center gap-1 text-warm-meta">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        Pending approval
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(c.id)}
                      disabled={deletingCommentId === c.id}
                      className="inline-flex items-center gap-1 rounded-sm font-semibold text-destructive transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      Delete your review
                    </button>
                  </div>
                ))}
            </div>
          )}

          {comments.length > visibleCommentsCount && (
            <div className="mt-4 flex justify-center">
              <Button variant="muted" size={44} onClick={() => setVisibleCommentsCount((prev) => prev + 5)}>
                Load more reviews (
                <span className="tabular-nums">{comments.length - visibleCommentsCount}</span> remaining)
              </Button>
            </div>
          )}
        </>
      )}

      <WriteReviewSheet
        open={writeSheetOpen}
        onOpenChange={setWriteSheetOpen}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
      />

      {/* In-design confirm, replacing window.confirm. Rule 4 of
          micro-06-non-negotiables rules out a browser alert, and beyond the
          rule this one is worth having: window.confirm renders unstyled, blocks
          the whole tab, and on iOS Safari prefixes the message with the site's
          hostname — so a user deleting their own review was reading
          "localhost says" over a bone-and-orange page. */}
      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(o) => !o && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              It disappears from the teacher&rsquo;s profile straight away. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDeleteId && handleDeleteComment(pendingDeleteId)}
            >
              Delete review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
