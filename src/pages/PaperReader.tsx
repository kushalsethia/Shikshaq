import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Lock, Maximize2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { getSubjectPalette } from '@/lib/subject-palette';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { recordVisit } from '@/lib/recently-visited';
import { GateSheet } from '@/components/auth/gate-sheet';
import { DisclaimerStrip } from '@/components/papers/disclaimer-strip';

interface Paper {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  file_url: string | null;
}

interface SiblingPaper {
  id: string;
  title: string;
  year: number;
}

const CONTAINER = 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8';
const SKELETON = 'bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * NOTE on scope vs. the design_handoff spec (pages/PaperReader.md):
 *
 * The spec was written against a prototype that has per-question structured
 * content (sections, numbered questions, sub-parts, MCQ options, tables,
 * figures) and a "show question 1 free, then lock" gate. The real `papers`
 * table (supabase/migrations/20260812000001_create_papers_table.sql) has no
 * such structure — a paper is just metadata plus one `file_url` pointing at
 * an admin-uploaded PDF in the public `paper-files` bucket. There is also no
 * reading-history table and no per-user free-read-allowance table.
 *
 * Rather than fabricate fake section/question markup (which would misrepresent
 * a real school's actual paper — the one thing this screen is explicitly
 * warned not to do), this implementation:
 *  - Renders the real PDF in-page via an iframe with the native toolbar
 *    suppressed (no target=_blank, no download link surfaced by us).
 *  - Gates the entire body for signed-out visitors instead of a literal
 *    "question 1 free" partial reveal, since a flat PDF has no question
 *    boundary to reveal to. No iframe `src` is rendered in the DOM for a
 *    signed-out visitor.
 *  - Omits the "{n} questions remaining" pill and the rail's per-question
 *    index grid, since both require question-level data that doesn't exist
 *    (an invented count would violate the "live Supabase data, never
 *    fabricated" rule harder than omitting it does).
 *  - Ships NO reading-progress indicator. There used to be one: a bar across
 *    the top of the page fed by window scroll across the paper-body card's
 *    bounding box. It was a lie. The card is a single fixed-height block, so
 *    the bar hit ~100% the moment that block scrolled past the viewport,
 *    whether the student had read one page or forty — and the PDF renders in
 *    the browser's native (often cross-origin) viewer whose internal scroll
 *    position is not readable, so nothing honest could be computed from the
 *    page at all. Rather than dress a fake number up as a smaller fake number,
 *    it is gone. The viewer instead offers real controls (full screen, open in
 *    a new tab) which are the things a student actually wanted when they
 *    reached for the scrollbar on a phone.
 *  - Deliberately does NOT imply "continue reading" / reading history exists
 *    (VISUAL_DIRECTION §9.2): there is no reading-progress table in the DB.
 *  - Skips "reading a paper records to history" — needs a new table plus
 *    StudentDashboard wiring, both out of this task's file scope.
 */

export default function PaperReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [siblings, setSiblings] = useState<SiblingPaper[]>([]);
  const [openedAt] = useState(() => new Date());
  const viewerRef = useRef<HTMLDivElement>(null);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchPaper() {
      setLoading(true);
      setNotFound(false);
      setLoadError(false);
      try {
        const { data, error } = await supabase.from('papers').select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
        } else {
          setPaper(data as Paper);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPaper();
    return () => { cancelled = true; };
  }, [id]);

  // Sibling papers (same subject/class/board) for the signed-in prev/next rail.
  useEffect(() => {
    if (!paper || !user) { setSiblings([]); return; }
    let cancelled = false;
    async function fetchSiblings() {
      const { data } = await supabase
        .from('papers')
        .select('id,title,year')
        .eq('is_published', true)
        .eq('subject', paper.subject)
        .eq('class', paper.class)
        .eq('board', paper.board)
        .order('year', { ascending: false })
        .order('title', { ascending: true })
        .limit(50);
      if (!cancelled && data) setSiblings(data as SiblingPaper[]);
    }
    fetchSiblings();
    return () => { cancelled = true; };
  }, [paper, user]);

  // Record this visit for the home page's "Recently visited" section
  // (device-local only, see src/lib/recently-visited.ts).
  useEffect(() => {
    if (!paper) return;
    recordVisit({
      type: 'paper',
      id: paper.id,
      title: paper.title,
      subtitle: `${paper.subject} · ${paper.school}`,
      path: `/past-papers/${paper.id}`,
    });
  }, [paper?.id]);

  usePageMeta(
    paper ? `${paper.title} | ${paper.school} | Shikshaq Past Papers` : 'Past paper | Shikshaq',
    paper ? `${paper.subject} Class ${paper.class} ${paper.board} paper from ${paper.school}, shared free on Shikshaq.` : 'Read a free past year question paper on Shikshaq.'
  );

  // Full-screen the viewer shell (not the iframe itself, so the watermark
  // layer above it travels with it). Presentation only — no data, no history.
  function openFullScreen() {
    const el = viewerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }

  const currentIndex = useMemo(() => siblings.findIndex((s) => s.id === id), [siblings, id]);
  const prevPaper = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextPaper = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const signedIn = !authLoading && !!user;

  // Opens the gate sheet automatically once we know the visitor is signed
  // out and the paper metadata (not the file) has resolved — design.md §6.5:
  // "never fetch the paper before auth". file_url only ever reaches the DOM
  // in the `signedIn` branch below.
  useEffect(() => {
    if (!loading && !authLoading && paper && !signedIn) setGateOpen(true);
    else setGateOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, authLoading, !!paper, signedIn]);

  function requestRemovalUrl(p: Paper): string {
    const message = `Hi! I'd like to request removal of a paper on Shikshaq: "${p.title}" (${p.school}, ${p.subject} Class ${p.class} ${p.board}, ${p.year}). Paper ID: ${p.id}.`;
    return `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(message)}`;
  }

  const colors = paper ? getSubjectPalette(paper.subject) : null;

  // ---------------- Loading shell ----------------
  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className={`flex-1 ${CONTAINER} pb-16 pt-6`}>
          <div className={`mb-4 h-4 w-32 rounded-lg ${SKELETON}`} />
          <div className={`mb-3 h-6 w-72 max-w-full rounded-full ${SKELETON}`} />
          <div className={`h-12 w-3/4 max-w-xl rounded-lg ${SKELETON}`} />
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[2fr,1fr] sm:gap-8">
            <div className={`h-96 rounded-2xl ${SKELETON}`} />
            <div className={`h-56 rounded-2xl ${SKELETON}`} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---------------- Not found / error ----------------
  if (notFound || loadError || !paper) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className={`flex-1 ${CONTAINER} pb-16 pt-8`}>
          <Link
            to="/past-papers"
            className="mb-[18px] inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            ← Back to papers
          </Link>
          <EmptyResults
            heading={loadError ? 'Unable to load this paper right now' : "This paper isn't available"}
            message={loadError ? 'Please refresh the page and try again.' : "It may have been removed, or the link is incorrect. It's still free to browse the rest of the collection."}
            action={{ label: 'Browse past papers', onClick: () => navigate('/past-papers') }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const tagPillClass = (variant: 'muted' | 'blue') =>
    `inline-flex min-h-6 items-center rounded-full px-3 py-1 text-label font-bold uppercase tabular-nums ${
      variant === 'blue' ? 'bg-brand-blue-subtle text-brand-blue-deep' : 'bg-muted text-foreground'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* The fake reading-progress bar that used to sit here is gone on
          purpose — see the file-level note. Nothing replaces it: an honest
          "you are viewing this paper" indicator is what the page title
          already is. */}
      <div className="pr-hide-print"><Navbar /></div>

      {/* Subtle continuation of the same hero token used on PastPapers.tsx /
          PaperResults.tsx — kept to just the title/meta block, not the reading
          area itself, so it reads as "same product" without competing with
          the PDF the student is here to focus on. */}
      <div className="pr-hide-print bg-gradient-to-b from-brand-blue-subtle to-background">
        <div className={`${CONTAINER} pb-6 pt-6`}>
          <Link
            to="/past-papers"
            className={`mb-4 inline-flex min-h-11 items-center text-body-secondary font-semibold text-muted-foreground transition-colors duration-tap ease-tap hover:text-foreground ${FOCUS}`}
          >
            ← Back to papers
          </Link>

          <div className="mb-3 flex flex-wrap gap-2">
            {colors && (
              // Signpost = subject, the milestone's category marker.
              <span
                className="signpost inline-flex min-h-6 items-center py-1 pl-3 text-label font-bold uppercase"
                style={{ backgroundColor: colors.solid, color: colors.badgeText }}
              >
                {paper.subject}
              </span>
            )}
            <span className={tagPillClass('muted')}>Class {paper.class}</span>
            <span className={tagPillClass('blue')}>{paper.board}</span>
            <span className={tagPillClass('muted')}>{paper.exam_type}</span>
            <span className={tagPillClass('muted')}>{paper.year}</span>
          </div>

          <h1 className="text-page-title font-display font-bold text-foreground">{paper.title}</h1>

          <div className="mt-3 flex flex-wrap gap-4 text-body font-medium tabular-nums text-warm-prose">
            <span>{paper.school}</span>
            <span>·</span>
            <span>{paper.exam_type}</span>
            <span>·</span>
            <span>{paper.year}</span>
          </div>
        </div>
      </div>

      <main className={`flex-1 ${CONTAINER} pb-16 pt-6`}>
        {/* F4 — permanent strip under the header, regardless of sign-in state.
            School name is per-paper data, never static copy. */}
        <DisclaimerStrip school={paper.school} reportHref={requestRemovalUrl(paper)} />

        {/* Only true once there IS an account to watermark with — this used to
            render for signed-out visitors too, where it was simply false. */}
        {signedIn && (
          <div className="pr-hide-print mt-3 flex items-center gap-2 text-meta text-warm-meta">
            <Lock size={14} strokeWidth={2} aria-hidden="true" />
            This page is watermarked with your account and the time you opened it.
          </div>
        )}

        <div className="pr-hide-print mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[2fr,1fr] sm:gap-8">
          {/* ---------------- Paper body ---------------- */}
          <div
            className={`${signedIn ? 'p-3 pb-0 sm:p-6 sm:pb-0' : 'p-0'} relative select-none overflow-hidden rounded-2xl bg-card shadow-border`}
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          >
            {signedIn ? (
              paper.file_url ? (
                <>
                  {/* Viewer controls. The embedded native PDF viewer's pinch-zoom
                      is unreliable on mobile Safari and there is no custom
                      zoom/pagination here (adding a JS PDF renderer is out of
                      scope), so the honest fix is to give the student a way OUT
                      of the embed: full screen, or the browser's own viewer in a
                      new tab where zoom and page controls actually work.
                      This does not "unlock" anything — file_url is a public
                      bucket URL and always was. */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={openFullScreen}
                      className={`flex min-h-11 items-center gap-2 rounded-full bg-muted px-4 text-body-secondary font-semibold text-foreground transition-colors duration-tap ease-tap hover:bg-border active:scale-[0.97] ${FOCUS}`}
                    >
                      <Maximize2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      Full screen
                    </button>
                    <a
                      href={paper.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex min-h-11 items-center gap-2 rounded-full bg-muted px-4 text-body-secondary font-semibold text-foreground transition-colors duration-tap ease-tap hover:bg-border active:scale-[0.97] ${FOCUS}`}
                    >
                      <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      Open in a new tab
                    </a>
                  </div>

                  {/* Taller than the old fixed 78vh on phones, and sized in dvh
                      so the mobile URL bar collapsing doesn't clip the page. */}
                  <div
                    ref={viewerRef}
                    className="relative h-[78dvh] min-h-96 overflow-hidden rounded-lg bg-background"
                  >
                    <iframe
                      title={paper.title}
                      src={`${paper.file_url}#toolbar=0&navpanes=0&view=FitH`}
                      className="h-full w-full border-0"
                    />
                    {/* Watermark layer: absolute, decorative, pointer-events none so
                        the iframe underneath stays fully interactive (scroll/zoom). */}
                    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
                      <div className="absolute -left-20 -top-20 flex flex-col gap-6 [transform:rotate(-24deg)_scale(1.7)]">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <span
                            key={i}
                            className="block whitespace-nowrap font-mono text-label font-semibold text-foreground/[.075]"
                            style={{ marginLeft: (i % 3) * 40 }}
                          >
                            {(user?.email || 'shikshaq')} · {openedAt.toLocaleString('en-IN')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pb-6">
                  <EmptyResults
                    className="bg-transparent shadow-none"
                    heading="This paper's file hasn't been uploaded yet"
                    message='The listing is here but the PDF itself is still missing. Check back soon — or use "Request removal" above if this listing looks wrong.'
                    action={{ label: 'Browse other papers', onClick: () => navigate('/past-papers') }}
                  />
                </div>
              )
            ) : (
              // Signed-out: no file_url ever reaches the DOM here. design.md
              // §6.5 — the gate is a bottom sheet over a BLURRED page, not a
              // full inline wall. This is the blurred page: real paper meta
              // (title/subject/school), no PDF, `select-none` + blur so
              // nothing behind the sheet is actually readable.
              <div className="relative overflow-hidden rounded-2xl">
                <div aria-hidden className="pointer-events-none select-none blur-md" style={{ backgroundColor: colors?.tint }}>
                  <div className="flex h-[60dvh] min-h-80 flex-col justify-end p-6 sm:p-12">
                    <span
                      className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-label font-bold uppercase"
                      style={{ backgroundColor: colors?.solid, color: colors?.badgeText }}
                    >
                      {paper.subject}
                    </span>
                    <span className="block h-6 w-3/4 rounded bg-foreground/10" />
                    <span className="mt-3 block h-4 w-1/2 rounded bg-foreground/10" />
                    <span className="mt-8 block h-3 w-full rounded bg-foreground/10" />
                    <span className="mt-2 block h-3 w-full rounded bg-foreground/10" />
                    <span className="mt-2 block h-3 w-2/3 rounded bg-foreground/10" />
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 p-4">
                  <button
                    type="button"
                    onClick={() => setGateOpen(true)}
                    className={`flex min-h-12 items-center gap-2 rounded-full bg-brand-blue px-8 text-body font-semibold text-white shadow-glow-brand-blue transition-transform duration-tap ease-tap hover:-translate-y-0.5 active:scale-[0.97] motion-reduce:hover:translate-y-0 ${FOCUS}`}
                  >
                    <Lock className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                    Sign in to read this paper
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ---------------- Rail ---------------- */}
          <div className="pr-rail">
            {/* Redistribution copy — deliberately says "please don't", not
                "you can't". Downloading and printing are NOT blocked (public
                bucket URL); do not reintroduce any claim that they are. */}
            <div className="rounded-2xl bg-muted px-4 py-3 text-meta text-warm-prose">
              These papers are shared for personal study only. Please don't redistribute or reupload them elsewhere — schools can request removal any time.
            </div>

            {/* Route markers along the same stretch of road: the previous and
                next paper in this subject/class/board run. This is sibling
                navigation, NOT reading history — nothing here claims the
                student has read anything (VISUAL_DIRECTION §9.2). */}
            {signedIn && (prevPaper || nextPaper) && (
              <div className="mt-4 grid gap-2">
                {prevPaper && (
                  <Link
                    to={`/past-papers/${prevPaper.id}`}
                    className={`flex min-h-11 flex-col justify-center rounded-2xl bg-card px-4 py-3 shadow-border transition-colors duration-tap ease-tap hover:bg-muted ${FOCUS}`}
                  >
                    <span className="block text-label font-bold uppercase text-warm-meta">← Previous</span>
                    <span className="mt-1 block break-words text-body-secondary font-semibold tabular-nums text-foreground">{prevPaper.title} ({prevPaper.year})</span>
                  </Link>
                )}
                {nextPaper && (
                  <Link
                    to={`/past-papers/${nextPaper.id}`}
                    className={`flex min-h-11 flex-col justify-center rounded-2xl bg-card px-4 py-3 shadow-border transition-colors duration-tap ease-tap hover:bg-muted ${FOCUS}`}
                  >
                    <span className="block text-label font-bold uppercase text-warm-meta">Next →</span>
                    <span className="mt-1 block break-words text-body-secondary font-semibold tabular-nums text-foreground">{nextPaper.title} ({nextPaper.year})</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="pr-hide-print"><Footer /></div>

      <GateSheet
        open={gateOpen}
        onOpenChange={setGateOpen}
        redirectTo={`/past-papers/${id}`}
        flavor="papers"
      />

      <style>{`
        @media print {
          /*
           * NOTE: .pr-hide-print is applied to the grid wrapping the paper
           * body (including the iframe) further up, so Ctrl+P no longer
           * renders the PDF itself, not just the chrome around it. This is
           * still only a client-side print stylesheet, not real access
           * control: file_url points at a PUBLIC Supabase storage bucket
           * URL, visible in the network tab and directly openable/
           * downloadable/printable outside this page regardless of what
           * this stylesheet does. Real enforcement requires server-side
           * changes out of this page's scope — short-lived signed URLs
           * and/or an authenticated proxy endpoint that streams the PDF
           * instead of exposing a public bucket URL.
           */
          .pr-hide-print { display: none !important; }
        }
        .pr-rail {
          position: sticky;
          top: 96px;
          align-self: start;
        }
        @media (max-width: 700px) {
          .pr-rail { position: static; top: auto; }
        }
      `}</style>
    </div>
  );
}
