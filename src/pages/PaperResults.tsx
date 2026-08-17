import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUp, FileText } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { PaperSheetCard } from '@/components/papers/paper-sheet-card';
import { FilterChips, type FilterChipItem } from '@/components/FilterChips';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { PageHeader } from '@/components/devices';
import { useAuth } from '@/lib/auth-context';

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

const PAGE_SIZE = 24;

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const SKELETON = 'bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function parseArrayParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(',').filter(Boolean);
}

// Escapes % and _ (ILIKE wildcards) plus the comma/backtick .or() uses as a
// PostgREST filter separator, so free-text search can't be used to inject an
// unintended filter clause.
function sanitizeForIlike(value: string): string {
  return value.replace(/[%_,]/g, '\\$&');
}

export default function PaperResults() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const subjectFilters = parseArrayParam(searchParams.get('filter_subjects'));
  const classFilters = parseArrayParam(searchParams.get('filter_classes'));
  const boardFilters = parseArrayParam(searchParams.get('filter_boards'));
  const schoolFilters = parseArrayParam(searchParams.get('filter_schools'));
  // Single-value convenience accessors, used for heading/chip/handoff display
  // (which show one value per filter). Query filtering itself honours the
  // full array via .in() below — see runQuery.
  const subjectFilter = subjectFilters[0] || '';
  const classFilter = classFilters[0] || '';
  const boardFilter = boardFilters[0] || '';
  const schoolFilter = schoolFilters[0] || '';

  const [papers, setPapers] = useState<Paper[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // Presentation-only: shows the back-to-top affordance once the student has
  // scrolled past roughly a viewport of results. This is an honest boolean
  // about the WINDOW's own scroll position — it makes no claim about how much
  // of any paper has been read.
  const [showTop, setShowTop] = useState(false);

  // Every active value per facet (not just the first) so the heading doesn't
  // understate a multi-value filter the query is actually honouring via .in().
  const heading = useMemo(() => {
    if (q) return `Results for "${q}"`;
    const parts = [
      boardFilters.length ? boardFilters.join(', ') : '',
      classFilters.length ? `Class ${classFilters.join(', ')}` : '',
      subjectFilters.length ? subjectFilters.join(', ') : '',
      schoolFilters.length ? schoolFilters.join(', ') : '',
    ].filter(Boolean);
    return parts.length ? `${parts.join(' ')} papers` : 'Past papers';
    // Depend on the raw joined params (not just the first value) so the heading
    // updates when a non-first value in the list changes, matching the fetch effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, subjectFilters.join(','), classFilters.join(','), boardFilters.join(','), schoolFilters.join(',')]);

  usePageMeta(
    `${heading} | Shikshaq`,
    'Browse free past year question papers shared by students from Kolkata schools. Read online, no download, no sign-up wall.'
  );

  function runQuery(pageNum: number) {
    let query = supabase
      .from('papers')
      .select('id,title,school,subject,class,board,exam_type,year,file_url', { count: 'exact' })
      .eq('is_published', true);

    if (subjectFilters.length > 1) query = query.in('subject', subjectFilters);
    else if (subjectFilters.length === 1) query = query.eq('subject', subjectFilters[0]);
    if (classFilters.length > 1) query = query.in('class', classFilters);
    else if (classFilters.length === 1) query = query.eq('class', classFilters[0]);
    if (boardFilters.length > 1) query = query.in('board', boardFilters);
    else if (boardFilters.length === 1) query = query.eq('board', boardFilters[0]);
    if (schoolFilters.length > 1) query = query.in('school', schoolFilters);
    else if (schoolFilters.length === 1) query = query.eq('school', schoolFilters[0]);
    if (q.trim()) {
      const needle = sanitizeForIlike(q.trim());
      query = query.or(`title.ilike.%${needle}%,school.ilike.%${needle}%,subject.ilike.%${needle}%`);
    }

    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    return query.order('year', { ascending: false }).order('school', { ascending: true }).range(from, to);
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchFirstPage() {
      setLoading(true);
      setLoadError(false);
      setPage(0);
      try {
        const { data, error, count } = await runQuery(0);
        if (error) throw error;
        if (cancelled) return;
        setPapers((data as Paper[]) || []);
        setTotal(count ?? 0);
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFirstPage();
    return () => { cancelled = true; };
    // Depend on the raw joined params (not just the first value) so a change
    // to e.g. "Maths,Physics" -> "Maths,Chemistry" re-fetches even though the
    // first value in the list didn't change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, subjectFilters.join(','), classFilters.join(','), boardFilters.join(','), schoolFilters.join(',')]);

  // Back-to-top visibility. Long lists here are unbounded ("Load more" with no
  // virtualization by design), so getting back to the filter row must not mean
  // flicking for ten seconds.
  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > (window.innerHeight || 800));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, []);

  async function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data, error } = await runQuery(nextPage);
      if (error) throw error;
      setPapers((prev) => [...prev, ...((data as Paper[]) || [])]);
      setPage(nextPage);
    } catch {
      // Leave the existing results in place; the button stays put so the
      // student can just try again rather than losing what already loaded.
    } finally {
      setLoadingMore(false);
    }
  }

  // Removes just one value from a multi-value filter param, leaving the rest
  // intact — so a student filtering by two subjects can drop one without
  // losing the other.
  const removeFilterValue = (
    key: 'filter_subjects' | 'filter_classes' | 'filter_boards' | 'filter_schools',
    value: string
  ) => {
    const current = parseArrayParam(searchParams.get(key));
    const remaining = current.filter((v) => v !== value);
    const next = new URLSearchParams(searchParams);
    if (remaining.length > 0) next.set(key, remaining.join(','));
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());

  // Subject/class/board carry to the teachers browse page; school and free-text
  // search don't apply there (mirrors Browse's equivalent handoff).
  const handleSeeTeachers = () => {
    const params = new URLSearchParams();
    if (subjectFilter) params.set('filter_subjects', subjectFilter);
    if (classFilter) params.set('filter_classes', classFilter);
    if (boardFilter) params.set('filter_boards', boardFilter);
    const qs = params.toString();
    navigate(qs ? `/all-tuition-teachers-in-kolkata?${qs}` : '/all-tuition-teachers-in-kolkata');
  };

  // Prefilled WhatsApp message for the EmptyResults "Request this paper" action,
  // carrying whatever filters/search the student had applied.
  const requestPaperUrl = () => {
    const parts = [subjectFilter, classFilter && `Class ${classFilter}`, boardFilter, schoolFilter, q && `"${q}"`].filter(Boolean);
    const context = parts.length ? ` (${parts.join(', ')})` : '';
    const message = `Hi! I couldn't find a paper on Shikshaq${context}. Could you add it?`;
    return `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(message)}`;
  };

  // One chip per active VALUE (not per facet) so a multi-select filter shows
  // and can remove each value independently — matching the .in() query above.
  const filterChips: FilterChipItem[] = [
    ...subjectFilters.map((v) => ({
      key: `filter_subjects:${v}`,
      label: v,
      onRemove: () => removeFilterValue('filter_subjects', v),
    })),
    ...classFilters.map((v) => ({
      key: `filter_classes:${v}`,
      label: `Class ${v}`,
      onRemove: () => removeFilterValue('filter_classes', v),
    })),
    ...boardFilters.map((v) => ({
      key: `filter_boards:${v}`,
      label: v,
      onRemove: () => removeFilterValue('filter_boards', v),
    })),
    ...schoolFilters.map((v) => ({
      key: `filter_schools:${v}`,
      label: v,
      onRemove: () => removeFilterValue('filter_schools', v),
    })),
  ];

  const hasMore = papers.length < total;
  const remaining = Math.max(0, total - papers.length);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {/* Proper header fold for the results list (VISUAL_DIRECTION §9a: every
            page gets a designed opening, not just the landing page). Crisp
            surface below (the card grid) stays calm; this fold carries the
            energy via the graph-paper ground and a tabular-nums SpeechTag
            standing in for the old bare stat line — the same "distance
            marker" idea, just carried by the shared device instead of a
            one-off block. */}
        <div className={`${CONTAINER} pt-4`}>
          <Link
            to="/past-papers"
            className={`-m-1 mb-1 inline-flex min-h-11 items-center p-1 text-body-secondary font-semibold text-muted-foreground transition-colors duration-tap ease-tap hover:text-foreground ${FOCUS}`}
          >
            ← Past Papers
          </Link>
        </div>
        <PageHeader
          title={heading}
          tags={[
            {
              label: loading
                ? 'Counting…'
                : `${total.toLocaleString('en-IN')} paper${total === 1 ? '' : 's'} found`,
            },
          ]}
          accent="hsl(var(--brand-blue))"
          ground="graph"
        />

        {/* Sticky filter summary. The list below is unbounded, so the applied
            filters (and the way back out of them) must stay reachable without
            scrolling to the top. Kept to one short row per DESIGN_SYSTEM §11
            ("sticky headers must be short"), offset by the navbar's own height. */}
        <div className="sticky top-14 z-20 border-b border-border bg-background/95 backdrop-blur lg:top-16">
          <div className={`${CONTAINER} py-3`}>
            <FilterChips
              mode="papers"
              chips={filterChips}
              onClearAll={filterChips.length > 0 ? clearFilters : undefined}
              handoff={{ label: 'See teachers with these filters →', onClick: handleSeeTeachers }}
            />
          </div>
        </div>

        <div className={`${CONTAINER} pb-20 pt-6 sm:pt-8`}>
          {loading ? (
            // One coherent skeleton in the real grid's shape, not a spinner.
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-48 rounded-2xl ${SKELETON}`} />
              ))}
            </div>
          ) : loadError ? (
            <EmptyResults
              heading="Unable to load papers right now"
              message="Please refresh the page and try again."
              action={{ label: 'Refresh', onClick: () => window.location.reload() }}
            />
          ) : papers.length > 0 ? (
            <>
              <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {papers.map((p) => (
                  <div key={p.id} className="animate-card-reveal motion-reduce:animate-none">
                    <PaperSheetCard paper={p} locked={!user} />
                  </div>
                ))}
              </div>

              {/* Honest position-in-list readout plus the load-more affordance.
                  "Showing 24 of 61" is the piece that was missing: without it
                  a student can't tell whether one more tap ends the list or
                  starts another five. */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-meta tabular-nums text-muted-foreground">
                  Showing {papers.length.toLocaleString('en-IN')} of {total.toLocaleString('en-IN')}
                </p>
                {hasMore ? (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className={`flex min-h-12 items-center gap-2 rounded-full bg-card px-6 text-body-secondary font-semibold text-foreground shadow-border transition-transform duration-tap ease-tap hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60 motion-reduce:hover:translate-y-0 ${FOCUS}`}
                  >
                    {loadingMore ? (
                      'Loading…'
                    ) : (
                      <>
                        <FileText className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        Load {Math.min(PAGE_SIZE, remaining)} more
                      </>
                    )}
                  </button>
                ) : (
                  <p className="text-meta text-muted-foreground">That's every paper matching these filters.</p>
                )}
              </div>
            </>
          ) : (
            <EmptyResults
              heading="No papers match all of those filters yet"
              message="The collection is still growing. Relax a filter, or ask for this paper and we'll add it when a student shares it."
              options={filterChips.length > 0 ? [{ label: 'Clear all filters', onClick: clearFilters }] : undefined}
              action={{
                label: 'Request this paper',
                onClick: () => window.open(requestPaperUrl(), '_blank', 'noopener,noreferrer'),
              }}
            />
          )}
        </div>
      </main>

      {/* Back to top — sits above the bottom tab bar on mobile. */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`animate-pop fixed bottom-24 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-border transition-transform duration-tap ease-tap active:scale-[0.97] motion-reduce:animate-none lg:bottom-8 lg:right-8 ${FOCUS}`}
        >
          <ArrowUp className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}

      <Footer />
    </div>
  );
}
