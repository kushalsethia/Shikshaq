import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { getSubjectPalette } from '@/lib/subject-palette';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { saveAuthRedirect } from '@/utils/authRedirect';
import { recordVisit } from '@/lib/recently-visited';

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
 *  - Approximates the progress bar from window scroll across the paper-body
 *    card's extent, since the PDF renders in the browser's native (often
 *    cross-origin) viewer whose internal scroll position isn't readable —
 *    true page-level tracking would need a JS PDF renderer (e.g. pdfjs-dist),
 *    which is a real dependency addition outside a page-only, no-dev-server
 *    task.
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
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

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

  // Progress bar: proxy for "reading progress" using how far the window has
  // scrolled across the paper-body card's own extent (see the file-level note
  // on why this can't track the PDF's own internal scroll).
  useEffect(() => {
    function onScroll() {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const total = rect.height - viewportH;
      if (total <= 0) { setProgress(rect.top <= 0 ? 1 : 0); return; }
      const scrolled = -rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [paper]);

  const currentIndex = useMemo(() => siblings.findIndex((s) => s.id === id), [siblings, id]);
  const prevPaper = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextPaper = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  function goToAuth() {
    saveAuthRedirect(`/past-papers/${id}`);
    navigate('/auth');
  }

  function requestRemovalUrl(p: Paper): string {
    const message = `Hi! I'd like to request removal of a paper on Shikshaq: "${p.title}" (${p.school}, ${p.subject} Class ${p.class} ${p.board}, ${p.year}). Paper ID: ${p.id}.`;
    return `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(message)}`;
  }

  const colors = paper ? getSubjectPalette(paper.subject) : null;
  const signedIn = !authLoading && !!user;

  // ---------------- Loading shell ----------------
  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className={`flex-1 ${CONTAINER} pb-16 pt-7`}>
          <div className={`mb-[18px] h-4 w-[120px] rounded-lg ${SKELETON}`} />
          <div className={`mb-3.5 h-5 w-[280px] rounded-full ${SKELETON}`} />
          <div className={`h-9 w-[70%] max-w-[560px] rounded-[10px] ${SKELETON}`} />
          <div className="mt-6 grid grid-cols-1 gap-9 sm:grid-cols-[2fr,1fr]">
            <div className={`h-[480px] rounded-2xl ${SKELETON}`} />
            <div className={`h-[220px] rounded-2xl ${SKELETON}`} />
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
        <main className={`flex-1 ${CONTAINER} pb-16 pt-7`}>
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
    `inline-flex items-center rounded-full px-[11px] py-[5px] text-xs font-semibold ${
      variant === 'blue' ? 'bg-brand-blue-subtle text-brand-blue-deep' : 'bg-muted text-foreground'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="pr-hide-print h-[3px] bg-muted">
        <div
          className="h-full bg-brand-blue transition-[width] duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="pr-hide-print"><Navbar /></div>

      {/* Subtle continuation of the same hero token used on PastPapers.tsx /
          PaperResults.tsx — kept to just the title/meta block, not the reading
          area itself, so it reads as "same product" without competing with
          the PDF the student is here to focus on. */}
      <div className="pr-hide-print bg-gradient-to-b from-brand-blue-subtle to-background">
        <div className={`${CONTAINER} pb-6 pt-7`}>
          <Link
            to="/past-papers"
            className="mb-[18px] inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            ← Back to papers
          </Link>

          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {colors && (
              <span
                className="inline-flex items-center rounded-full px-[11px] py-[5px] text-xs font-semibold"
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

          <h1 className="text-[clamp(24px,3.2vw,36px)] font-bold leading-[1.03] text-foreground">{paper.title}</h1>

          <div className="mt-3 flex flex-wrap gap-4 text-base font-medium text-warm-prose">
            <span>{paper.school}</span>
            <span>·</span>
            <span>{paper.exam_type}</span>
            <span>·</span>
            <span>{paper.year}</span>
          </div>
        </div>
      </div>

      <main className={`flex-1 ${CONTAINER} pb-16 pt-6`}>
        <div className="rounded-xl bg-muted px-4 py-[11px] text-sm leading-relaxed text-warm-prose">
          This paper is the property of {paper.school}. Shikshaq claims no ownership and hosts it as a free community resource.{' '}
          <a
            href={requestRemovalUrl(paper)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue-deep underline"
          >
            Request removal
          </a>
        </div>

        <div className="pr-hide-print mt-2.5 flex items-center gap-2 text-xs text-warm-meta">
          <Lock size={14} strokeWidth={2} aria-hidden="true" />
          This page is watermarked with your account and the time you opened it.
        </div>

        <div className="pr-hide-print mt-6 grid grid-cols-1 gap-9 sm:grid-cols-[2fr,1fr]">
          {/* ---------------- Paper body ---------------- */}
          <div
            ref={bodyRef}
            className={`${signedIn ? 'p-5 pb-0 sm:p-9 sm:pb-0' : 'p-0 min-h-[420px]'} relative select-none overflow-hidden rounded-2xl bg-card shadow-border`}
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          >
            {signedIn ? (
              paper.file_url ? (
                <div className="relative h-[78vh] min-h-[480px]">
                  <iframe
                    title={paper.title}
                    src={`${paper.file_url}#toolbar=0&navpanes=0`}
                    className="h-full w-full rounded-t-lg border-0"
                  />
                  {/* Watermark layer: absolute, decorative, pointer-events none so
                      the iframe underneath stays fully interactive (scroll/zoom). */}
                  <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
                    <div className="absolute -left-[20%] -top-[20%] flex flex-col gap-[26px] [transform:rotate(-24deg)_scale(1.7)]">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <span
                          key={i}
                          className="block whitespace-nowrap font-mono text-[10px] font-semibold tracking-[.06em] text-foreground/[.075]"
                          style={{ marginLeft: (i % 3) * 40 }}
                        >
                          {(user?.email || 'shikshaq')} · {openedAt.toLocaleString('en-IN')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-base text-muted-foreground">
                  This paper's file hasn't been uploaded yet. Check back soon, or use "Request removal" above if this looks wrong.
                </div>
              )
            ) : (
              // Signed-out: no file_url ever reaches the DOM here.
              <div className="px-4 pb-11 pt-6 sm:px-10 sm:pt-9">
                <div className="mx-auto max-w-[520px] rounded-2xl bg-background p-8 text-center shadow-border">
                  <h2 className="mb-3 text-[27px] font-bold leading-tight text-foreground">Sign in to read the rest of this paper</h2>
                  <p className="mb-[22px] text-base leading-relaxed text-muted-foreground">
                    We ask for an account so every paper can be attributed to the student who shared it, and so we can stop anyone bulk-copying the collection. That's the whole reason. It's free and takes a minute.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    <button
                      onClick={goToAuth}
                      className="flex min-h-11 items-center rounded-lg bg-brand-blue px-[22px] text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-blue-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={goToAuth}
                      className="flex min-h-11 items-center rounded-lg px-[22px] text-sm font-semibold text-foreground shadow-border transition-colors duration-150 hover:bg-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Create an account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------------- Rail ---------------- */}
          <div className="pr-rail">
            <div className="rounded-2xl bg-muted px-4 py-3.5 text-xs leading-relaxed text-warm-prose">
              No download, no print. Papers are for reading here only.
            </div>

            {signedIn && (prevPaper || nextPaper) && (
              <div className="mt-3.5 grid gap-2">
                {prevPaper && (
                  <Link
                    to={`/past-papers/${prevPaper.id}`}
                    className="block rounded-2xl bg-card px-4 py-3.5 shadow-border transition-colors duration-150 hover:bg-muted"
                  >
                    <span className="block text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-meta">Previous</span>
                    <span className="mt-1 block text-sm font-semibold text-foreground">{prevPaper.title} ({prevPaper.year})</span>
                  </Link>
                )}
                {nextPaper && (
                  <Link
                    to={`/past-papers/${nextPaper.id}`}
                    className="block rounded-2xl bg-card px-4 py-3.5 shadow-border transition-colors duration-150 hover:bg-muted"
                  >
                    <span className="block text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-meta">Next</span>
                    <span className="mt-1 block text-sm font-semibold text-foreground">{nextPaper.title} ({nextPaper.year})</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="pr-hide-print"><Footer /></div>

      <style>{`
        @media print {
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
