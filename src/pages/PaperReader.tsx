import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { getSubjectColors } from '@/utils/subjectColors';
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

  const colors = paper ? getSubjectColors(paper.subject) : null;
  const signedIn = !authLoading && !!user;

  // ---------------- Loading shell ----------------
  if (loading || authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }} className="flex flex-col">
        <Navbar />
        <main className="flex-1" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '28px clamp(16px,3vw,28px) 60px' }}>
          <div className="animate-pulse" style={{ width: 120, height: 16, borderRadius: 8, background: '#F0EAE2', marginBottom: 18 }} />
          <div className="animate-pulse" style={{ width: 280, height: 20, borderRadius: 999, background: '#F0EAE2', marginBottom: 14 }} />
          <div className="animate-pulse" style={{ width: '70%', maxWidth: 560, height: 36, borderRadius: 10, background: '#F0EAE2' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 36, marginTop: 26 }}>
            <div className="animate-pulse" style={{ height: 480, borderRadius: 20, background: '#F0EAE2' }} />
            <div className="animate-pulse" style={{ height: 220, borderRadius: 16, background: '#F0EAE2' }} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---------------- Not found / error ----------------
  if (notFound || loadError || !paper) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9F5F1' }} className="flex flex-col">
        <Navbar />
        <main className="flex-1" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '28px clamp(16px,3vw,28px) 60px' }}>
          <Link to="/past-papers" className="shikshaq-tap" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, fontSize: 13, fontWeight: 600, color: '#8B837A', marginBottom: 18 }}>← Back to papers</Link>
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

  const tagPill = (label: string, bg: string, fg: string, key: string) => (
    <span key={key} style={{ padding: '5px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: bg, color: fg }}>
      {label}
    </span>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }} className="flex flex-col">
      <div className="pr-hide-print" style={{ height: 3, background: '#F0EAE2' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: '#4351FF', transition: 'width .3s ease' }} />
      </div>

      <div className="pr-hide-print"><Navbar /></div>

      <main className="flex-1" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '28px clamp(16px,3vw,28px) 60px' }}>
        <Link to="/past-papers" className="shikshaq-tap pr-hide-print" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, fontSize: 13, fontWeight: 600, color: '#8B837A', marginBottom: 18 }}>← Back to papers</Link>

        <div className="pr-hide-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {colors && tagPill(paper.subject, colors.solid, colors.badgeText, 'subject')}
          {tagPill(`Class ${paper.class}`, '#F0EAE2', '#1F1F1F', 'class')}
          {tagPill(paper.board, '#EDEEFF', '#2E3AD6', 'board')}
          {tagPill(paper.exam_type, '#F0EAE2', '#1F1F1F', 'exam')}
          {tagPill(String(paper.year), '#F0EAE2', '#1F1F1F', 'year')}
        </div>

        <h1 className="pr-hide-print" style={{ fontSize: 'clamp(24px,3.2vw,36px)', lineHeight: 1.03, fontWeight: 700 }}>{paper.title}</h1>

        <div className="pr-hide-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, fontSize: 15, fontWeight: 500, color: '#4A443E' }}>
          <span>{paper.school}</span>
          <span>·</span>
          <span>{paper.exam_type}</span>
          <span>·</span>
          <span>{paper.year}</span>
        </div>

        <div style={{ marginTop: 16, padding: '11px 16px', borderRadius: 12, background: '#F0EAE2', fontSize: 13, lineHeight: 1.5, color: '#4A443E' }}>
          This paper is the property of {paper.school}. Shikshaq claims no ownership and hosts it as a free community resource.{' '}
          <a href={requestRemovalUrl(paper)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: '#2E3AD6', textDecoration: 'underline' }}>Request removal</a>
        </div>

        <div className="pr-hide-print" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12.5, color: '#8B837A' }}>
          <Lock size={14} strokeWidth={2} />
          This page is watermarked with your account and the time you opened it.
        </div>

        <div className="pr-hide-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 36, marginTop: 26 }}>
          {/* ---------------- Paper body ---------------- */}
          <div
            ref={bodyRef}
            style={{
              position: 'relative',
              padding: signedIn ? 'clamp(20px,3vw,36px) clamp(16px,3vw,40px) 0' : 0,
              borderRadius: 20,
              background: '#FCFAF7',
              boxShadow: '0 0 0 1px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04)',
              overflow: 'hidden',
              userSelect: 'none',
              minHeight: signedIn ? undefined : 420,
            }}
            onContextMenu={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
          >
            {signedIn ? (
              paper.file_url ? (
                <div style={{ position: 'relative', height: '78vh', minHeight: 480 }}>
                  <iframe
                    title={paper.title}
                    src={`${paper.file_url}#toolbar=0&navpanes=0`}
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px 8px 0 0' }}
                  />
                  {/* Watermark layer: absolute, decorative, pointer-events none so
                      the iframe underneath stays fully interactive (scroll/zoom). */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
                    <div style={{ position: 'absolute', top: '-20%', left: '-20%', display: 'flex', flexDirection: 'column', gap: 26, transform: 'rotate(-24deg) scale(1.7)' }}>
                      {Array.from({ length: 14 }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'block',
                            whiteSpace: 'nowrap',
                            marginLeft: (i % 3) * 40,
                            font: '600 10px ui-monospace,Menlo,monospace',
                            letterSpacing: '.06em',
                            color: 'rgba(31,31,31,.075)',
                          }}
                        >
                          {(user?.email || 'shikshaq')} · {openedAt.toLocaleString('en-IN')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#7B736B', fontSize: 15 }}>
                  This paper's file hasn't been uploaded yet. Check back soon, or use "Request removal" above if this looks wrong.
                </div>
              )
            ) : (
              // Signed-out: no file_url ever reaches the DOM here.
              <div style={{ padding: 'clamp(24px,3vw,36px) clamp(16px,3vw,40px) 44px' }}>
                <div style={{ maxWidth: 520, margin: '0 auto', padding: 32, borderRadius: 20, background: '#F9F5F1', boxShadow: '0 0 0 1px #E7DFD5, 0 8px 24px rgba(0,0,0,.06)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: 27, lineHeight: 1.15, fontWeight: 700, marginBottom: 12 }}>Sign in to read the rest of this paper</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#7B736B', marginBottom: 22 }}>
                    We ask for an account so every paper can be attributed to the student who shared it, and so we can stop anyone bulk-copying the collection. That's the whole reason. It's free and takes a minute.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                    <button onClick={goToAuth} className="shikshaq-tap" style={{ minHeight: 44, padding: '13px 22px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: '#4351FF', color: '#fff' }}>Sign in</button>
                    <button onClick={goToAuth} className="shikshaq-tap" style={{ minHeight: 44, padding: '13px 22px', borderRadius: 10, fontSize: 15, fontWeight: 600, color: '#1F1F1F', boxShadow: '0 0 0 1px #D8CFC4' }}>Create an account</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------------- Rail ---------------- */}
          <div className="pr-rail">
            <div style={{ padding: '14px 16px', borderRadius: 14, background: '#F0EAE2', fontSize: 12.5, lineHeight: 1.5, color: '#4A443E' }}>
              No download, no print. Papers are for reading here only.
            </div>

            {signedIn && (prevPaper || nextPaper) && (
              <div style={{ display: 'grid', gap: 9, marginTop: 14 }}>
                {prevPaper && (
                  <Link to={`/past-papers/${prevPaper.id}`} className="shikshaq-tap" style={{ display: 'block', padding: '14px 16px', borderRadius: 14, background: '#FCFAF7', boxShadow: '0 0 0 1px #E7DFD5' }}>
                    <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8B837A' }}>Previous</span>
                    <span style={{ display: 'block', marginTop: 4, fontSize: 14, fontWeight: 600 }}>{prevPaper.title} ({prevPaper.year})</span>
                  </Link>
                )}
                {nextPaper && (
                  <Link to={`/past-papers/${nextPaper.id}`} className="shikshaq-tap" style={{ display: 'block', padding: '14px 16px', borderRadius: 14, background: '#FCFAF7', boxShadow: '0 0 0 1px #E7DFD5' }}>
                    <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8B837A' }}>Next</span>
                    <span style={{ display: 'block', marginTop: 4, fontSize: 14, fontWeight: 600 }}>{nextPaper.title} ({nextPaper.year})</span>
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
