import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PaperCard } from '@/components/PaperCard';
import { FilterChips, type FilterChipItem } from '@/components/FilterChips';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { getWhatsAppLink } from '@/utils/whatsapp';

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
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const subjectFilter = parseArrayParam(searchParams.get('filter_subjects'))[0] || '';
  const classFilter = parseArrayParam(searchParams.get('filter_classes'))[0] || '';
  const boardFilter = parseArrayParam(searchParams.get('filter_boards'))[0] || '';
  const schoolFilter = parseArrayParam(searchParams.get('filter_schools'))[0] || '';

  const [papers, setPapers] = useState<Paper[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const heading = useMemo(() => {
    if (q) return `Results for "${q}"`;
    const parts = [boardFilter, classFilter && `Class ${classFilter}`, subjectFilter, schoolFilter].filter(Boolean);
    return parts.length ? `${parts.join(' ')} papers` : 'Past papers';
  }, [q, subjectFilter, classFilter, boardFilter, schoolFilter]);

  usePageMeta(
    `${heading} | Shikshaq`,
    'Browse free past year question papers shared by students from Kolkata schools. Read online, no download, no sign-up wall.'
  );

  function runQuery(pageNum: number) {
    let query = supabase
      .from('papers')
      .select('id,title,school,subject,class,board,exam_type,year,file_url', { count: 'exact' })
      .eq('is_published', true);

    if (subjectFilter) query = query.eq('subject', subjectFilter);
    if (classFilter) query = query.eq('class', classFilter);
    if (boardFilter) query = query.eq('board', boardFilter);
    if (schoolFilter) query = query.eq('school', schoolFilter);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, subjectFilter, classFilter, boardFilter, schoolFilter]);

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

  const updateFilter = (key: 'filter_subjects' | 'filter_classes' | 'filter_boards' | 'filter_schools') => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
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

  const filterChips: FilterChipItem[] = [
    subjectFilter && { key: 'filter_subjects', label: subjectFilter, onRemove: () => updateFilter('filter_subjects') },
    classFilter && { key: 'filter_classes', label: `Class ${classFilter}`, onRemove: () => updateFilter('filter_classes') },
    boardFilter && { key: 'filter_boards', label: boardFilter, onRemove: () => updateFilter('filter_boards') },
    schoolFilter && { key: 'filter_schools', label: schoolFilter, onRemove: () => updateFilter('filter_schools') },
  ].filter(Boolean) as FilterChipItem[];

  const hasMore = papers.length < total;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className={`${CONTAINER} pb-16 pt-6 sm:pt-8`}>
          <Link
            to="/past-papers"
            className="-m-1 mb-3 inline-flex min-h-11 items-center p-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            ← Past Papers
          </Link>
          <h1 className="text-[clamp(25px,3.4vw,38px)] font-bold leading-none text-foreground">{heading}</h1>
          <p className="mt-2 text-sm tabular-nums text-muted-foreground">
            {loading ? 'Loading…' : `${total} paper${total === 1 ? '' : 's'}`}
          </p>

          <div className="my-5">
            <FilterChips
              mode="papers"
              chips={filterChips}
              onClearAll={filterChips.length > 0 ? clearFilters : undefined}
              handoff={{ label: 'See teachers with these filters →', onClick: handleSeeTeachers }}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className={`h-[180px] rounded-2xl ${SKELETON}`} />)}
            </div>
          ) : loadError ? (
            <EmptyResults
              heading="Unable to load papers right now"
              message="Please refresh the page and try again."
              action={{ label: 'Refresh', onClick: () => window.location.reload() }}
            />
          ) : papers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                {papers.map((p) => (
                  <PaperCard key={p.id} paper={p} variant="result" />
                ))}
              </div>

              {hasMore && (
                <div className="mt-7 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex min-h-12 items-center rounded-lg bg-card px-[22px] text-sm font-semibold text-foreground shadow-border transition-colors duration-150 hover:bg-muted active:scale-[0.97] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
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
      <Footer />
    </div>
  );
}
