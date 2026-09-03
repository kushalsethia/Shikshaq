import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUp, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PaperSheetCard } from '@/components/papers/paper-sheet-card';
import { loadPaperIndex, hasYear } from '@/lib/question-bank';
import { bankSubjectToSite, bankSubjectMatches } from '@/lib/subject-vocabulary';
import { FilterChips, type FilterChipItem } from '@/components/FilterChips';
import { EmptyResults } from '@/components/EmptyResults';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { useAuth } from '@/lib/auth-context';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';
import { ArrowLeft } from 'lucide-react';

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

  /* The 193 question-bank papers are papers on this surface too, so a filter
     for "ICSE Class X Maths" has to find them. They cannot ride the Supabase
     query — they are a static file — so they are filtered here with the same
     params and merged in ahead of the database rows, which is also the right
     order: they read as questions rather than as a scan. 193 rows filter in
     well under a frame. */
  const bankQuery = useQuery({
    queryKey: ['paper-results', 'bank'],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async (): Promise<Paper[]> =>
      /* b.subject, not the literal 'Mathematics'/'Maths' these two lines used
         to carry. That was true while the bank held nothing else; once History
         & Civics and Economics landed it meant all 619 bank papers claimed to
         be maths, so a History filter returned none of its 302 papers and every
         one of them rendered as "Class X Mathematics". Subject is mapped into
         the SITE vocabulary here so it matches the filter chips, the facets and
         the subject pages. */
      (await loadPaperIndex()).map((b) => ({
        id: b.id,
        title: `Class ${b.cls} ${b.subject}`,
        school: b.school,
        subject: bankSubjectToSite(b.subject),
        class: b.cls,
        board: b.board,
        exam_type: b.exam,
        year: hasYear(b.year) ? Number(String(b.year).slice(0, 4)) : 0,
        file_url: null,
      })) as Paper[],
  });

  const bankMatches = useMemo(() => {
    const rows = bankQuery.data ?? [];
    const needle = q.trim().toLowerCase();
    const eq = (want: string[], value: string) =>
      want.length === 0 || want.some((w) => w.toLowerCase() === value.toLowerCase());
    return rows.filter((p) =>
      /* Subject goes through the vocabulary map rather than a plain equality:
         a ?filter_subjects=Maths link has to find rows whose bank subject is
         "Mathematics", and an older ?filter_subjects=Mathematics link has to
         keep working. */
      (subjectFilters.length === 0 ||
        subjectFilters.some((w) => bankSubjectMatches(w, p.subject))) &&
      eq(classFilters, p.class) &&
      eq(boardFilters, p.board) &&
      eq(schoolFilters, p.school) &&
      (!needle ||
        p.title.toLowerCase().includes(needle) ||
        p.school.toLowerCase().includes(needle) ||
        p.subject.toLowerCase().includes(needle)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankQuery.data, q, subjectFilters.join(','), classFilters.join(','), boardFilters.join(','), schoolFilters.join(',')]);
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

  /* Bank matches lead, then the database page. Only on the first page — they
     are not part of the server's pagination. */
  const shownPapers = page === 0 ? [...bankMatches, ...papers] : papers;
  const shownTotal = total + bankMatches.length;

  const hasMore = papers.length < total;
  const remaining = Math.max(0, total - papers.length);

  // Handoff PR-006: this route renders its own eyes panel (papers mode).
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();
  useEffect(() => { setBuilderMode('papers'); }, [setBuilderMode]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Owner correction: edge-to-edge (0 gutter) is the intended
          pattern — a prior pass wrapped this in PageContainer/max-w-6xl,
          backwards from what the handoff actually calls for. */}
      <main className="flex-1">
      <BentoStack>
        {/* Handoff PR-001: one BentoPanel carries the back link, h1 and count
            tag — PageHeader's graph ground is dropped on this route. No
            separate in-panel logo/menu row (see PP-002's note — Home and
            Browse don't duplicate the floating Navbar pill either).
            Copy unchanged: `heading`, and the count tag's two strings. The
            entry's "weight 400 with a font-black span" doesn't say which
            substring is bold, and `heading` has no fixed trailing phrase to
            split on (unlike Browse's "in Kolkata") — rendered at the base
            weight rather than guessing a split point. */}
        <BentoPanel fill="papers" edge="top" className="px-[22px] pt-[14px] pb-[22px]">
          <Link
            to="/past-papers"
            className={`-m-1 mb-3 flex h-11 w-fit items-center gap-1.5 p-1 text-[13px] font-semibold text-white/75 transition-colors duration-tap ease-tap hover:text-white ${FOCUS}`}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            Past Papers
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[27px] font-normal leading-[1.05] tracking-[-0.035em] text-white lg:text-[44px] lg:leading-[1.02] lg:tracking-[-0.04em]">
              {heading}
            </h1>
            <span className="inline-flex h-8 flex-none items-center whitespace-nowrap rounded-full bg-white/15 px-[14px] text-[13px] font-bold text-white">
              {loading ? 'Counting…' : `${shownTotal.toLocaleString('en-IN')} paper${shownTotal === 1 ? '' : 's'} found`}
            </span>
          </div>
        </BentoPanel>

        {/* Handoff PR-002: sticky filter row becomes a BentoPanel pill row —
            no hairline, no blur, isolate kept (same compositing reason as
            Browse B-007). FilterChips.tsx's own S-006-matched tint and the
            handoff pill styling apply automatically. */}
        {/* lg:py-3 restates the mobile value on purpose. Without it BentoPanel's
            `lg:py-8` applies and this sticky bar becomes 108px tall at 1280 —
            64px of padding around a 44px control row, sitting under a 60px nav.
            D-003 excepts counter tiles for exactly this reason ("they stay
            compact; py-8 would make them tall boxes"); a sticky control bar has
            the same reason and simply is not in its table. Desktop Layouts.dc.html
            does not draw this screen, so this follows the spec's own logic. */}
        <BentoPanel fill="card" className="sticky top-[80px] z-20 isolate !px-0 !pl-4 py-3 lg:py-3">
          <FilterChips
            mode="papers"
            chips={filterChips}
            onClearAll={filterChips.length > 0 ? clearFilters : undefined}
            handoff={{ label: 'See teachers with these filters →', onClick: handleSeeTeachers }}
            className="pr-4"
          />
        </BentoPanel>

        {/* Handoff PR-003/PR-004: results live inside one BentoPanel; base
            grid is a single column at gap-[10px] (sm:/lg: unchanged). */}
        <BentoPanel fill="card" className="px-4 py-[18px]">
          {loading ? (
            // One coherent skeleton in the real grid's shape, not a spinner.
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
          ) : /* shownPapers, not papers. This gated the whole result list on the
                 Supabase PDF rows alone while the count beside the heading used
                 the MERGED total, so any filter matching bank papers but no PDF
                 rows rendered "302 papers found" directly above "No papers match
                 all of those filters yet". It stayed hidden while every bank row
                 claimed to be Maths, which is the one subject with PDF rows to
                 carry it; correcting the bank's subjects surfaced it for all 302
                 History & Civics and 124 Economics papers. */
            shownPapers.length > 0 ? (
            <>
              <div className="stagger-children grid grid-cols-1 gap-[10px] sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {shownPapers.map((p) => (
                  <div key={p.id} className="animate-card-reveal motion-reduce:animate-none">
                    <PaperSheetCard paper={p} locked={!user} />
                  </div>
                ))}
              </div>

              {/* Honest position-in-list readout plus the load-more affordance.
                  "Showing 24 of 61" is the piece that was missing: without it
                  a student can't tell whether one more tap ends the list or
                  starts another five.
                  Handoff PR-004: bg-card -> bg-muted (sits on a bone panel now), shadow-border removed. */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-meta tabular-nums text-muted-foreground">
                  Showing {shownPapers.length.toLocaleString('en-IN')} of {shownTotal.toLocaleString('en-IN')}
                </p>
                {hasMore ? (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className={`flex h-12 items-center gap-2 rounded-full bg-muted px-6 text-[14px] font-bold text-foreground transition-transform duration-tap ease-tap hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60 motion-reduce:hover:translate-y-0 ${FOCUS}`}
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
        </BentoPanel>

        {/* Handoff PR-005: ownership panel, BentoPanel fill="dark". */}
        <BentoPanel fill="dark" className="p-[22px]">
          <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] lg:text-[26px]">Who owns these papers</h2>
          <p className="mt-3 max-w-prose text-[14px] leading-[1.55] text-white/75 lg:text-[16px] lg:leading-[1.65]">
            Every paper here is the property of the school that set it. Shikshaq claims no
            ownership, derives no revenue from any paper, and hosts these materials solely as a
            free revision resource. If you represent a school and want a paper removed, tell us
            and it goes the same day.
          </p>
        </BentoPanel>

        {/* Handoff PR-006: shared tail, identical to Home/PastPapers. */}
        <EyesPanel
          mode={builderMode}
          onModeChange={setBuilderMode}
          heading={(
            <>
              Need a paper? <span className="font-extrabold">We keep an eye out.</span>
            </>
          )}
          subline="Fill in the blanks and we'll take you straight there."
          slots={builderSlots}
          onSlotChange={handleSlotChange}
          onSubmit={handleBuilderSubmit}
        />
      </BentoStack>
      </main>

      {/* Back to top — sits above the bottom tab bar on mobile. */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`animate-card-reveal fixed bottom-24 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-border transition-transform duration-tap ease-tap active:scale-[0.97] motion-reduce:animate-none lg:bottom-8 lg:right-8 ${FOCUS}`}
        >
          <ArrowUp className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
