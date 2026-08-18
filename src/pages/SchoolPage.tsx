import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { schoolSlug } from '@/lib/school-slug';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Footer } from '@/components/Footer';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { PageContainer, BottomNavSpacer } from '@/components/layout/PageContainer';
import { ListLoading, ListEmpty, ListError } from '@/components/ui/list-states';
import { Button } from '@/components/ui/button';
import { BROWSE_PATH, PAST_PAPERS_PATH } from '@/lib/nav-config';
import { generateBreadcrumbSchema, injectSchemas } from '@/utils/structuredDataGenerators';

/* S16 — the school page.
 *
 * a-to-z.md lists this as the one route marked `new`: "Does not exist;
 * PastPapers has by-school rows that go nowhere". They were buttons with no
 * href, so a school was a dead end — you could read that La Martiniere has four
 * papers and had no way to open them.
 *
 * Everything here is derived from the paper rows themselves. There is no
 * schools table, so the summary line, the facets and the year range are all
 * computed from what has actually been uploaded, and a school with no papers
 * cannot exist as a page at all.
 */

interface SchoolPaper {
  id: string;
  title: string;
  subject: string;
  class: string;
  board: string;
  year: number;
}

export default function SchoolPage() {
  const { slug = '' } = useParams();

  const query = useQuery({
    queryKey: ['school', slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      /* No schools table and no slug column, so the match happens here: pull
         published papers and compare derived slugs. At this scale that is one
         query; past a few thousand papers this wants a generated column and an
         index rather than a client-side filter. */
      const { data } = await supabase
        .from('papers')
        .select('id, title, school, subject, class, board, year')
        .eq('is_published', true)
        .order('year', { ascending: false });

      const rows = (data || []).filter((p) => schoolSlug(p.school) === slug);
      return { name: rows[0]?.school ?? null, papers: rows as SchoolPaper[] };
    },
  });

  const school = query.data;
  const papers = school?.papers ?? [];

  const summary = useMemo(() => {
    if (papers.length === 0) return null;
    const boards = [...new Set(papers.map((p) => p.board).filter(Boolean))];
    const classes = [...new Set(papers.map((p) => Number(p.class)).filter((n) => !Number.isNaN(n)))].sort(
      (a, b) => a - b,
    );
    const years = [...new Set(papers.map((p) => p.year).filter(Boolean))].sort((a, b) => a - b);

    /* Each clause drops rather than guesses when its data is missing
       (design.md §0.10). A school with one year shows that year, not a range. */
    const parts = [`${papers.length} paper${papers.length === 1 ? '' : 's'}`];
    if (boards.length) parts.push(boards.join(' & '));
    if (classes.length) {
      parts.push(
        classes.length === 1
          ? `Class ${classes[0]}`
          : `Classes ${classes[0]} to ${classes[classes.length - 1]}`,
      );
    }
    if (years.length) {
      parts.push(years.length === 1 ? String(years[0]) : `${years[0]}–${years[years.length - 1]}`);
    }
    return parts.join(' · ');
  }, [papers]);

  const subjects = useMemo(
    () => [...new Set(papers.map((p) => p.subject).filter(Boolean))].sort(),
    [papers],
  );

  const name = school?.name ?? 'School';
  usePageMeta(
    papers.length ? `${name} past papers | Shikshaq` : 'School past papers | Shikshaq',
    papers.length
      ? `${papers.length} past papers from ${name}, free to read on Shikshaq.`
      : 'Past papers from Kolkata schools, free to read on Shikshaq.',
  );

  // This route (S16, "new" per a-to-z.md) shipped with no structured data at
  // all — every other listing-style page (Browse, subject/board pages) emits
  // at least a BreadcrumbList. Only injected once a real school has resolved
  // (papers.length > 0), matching what usePageMeta above already does for
  // title/description, so a not-found slug doesn't assert a fake breadcrumb
  // for a page name that isn't real.
  useEffect(() => {
    if (!papers.length) return;
    injectSchemas([
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Past papers', url: PAST_PAPERS_PATH },
        { name, url: `/school/${slug}` },
      ]),
    ]);
    return () => {
      const existing = document.getElementById('page-schemas');
      if (existing) existing.remove();
    };
  }, [papers.length, name, slug]);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Indigo header — papers are the indigo half of the brand pair (S16). */}
        <div className="rounded-b-4xl bg-brand-blue px-4 pb-5 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Link
              to={PAST_PAPERS_PATH}
              className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-white/80 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All schools
            </Link>

            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 font-display text-[20px] font-black text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <h1 className="font-display text-[28px] font-black leading-[1.05] tracking-[-0.035em] text-white">
              {name}
            </h1>
            {summary && <p className="mt-2 text-[14px] leading-[1.55] text-white/85">{summary}</p>}
          </div>
        </div>

        <PageContainer className="pt-6">
          {/* isError before the empty check. A failed fetch used to fall
              through to "No papers from this school yet.", which is a factual
              claim about the data made on the strength of a network error, and
              it offered no way to retry. ListError already exists and is wired
              correctly in Browse and PaperResults. */}
          {query.isLoading ? (
            <ListLoading />
          ) : query.isError ? (
            <ListError onRetry={() => query.refetch()} />
          ) : papers.length === 0 ? (
            <ListEmpty line="No papers from this school yet." />
          ) : (
            <>
              {subjects.length > 1 && (
                <div className="-mx-4 mb-5 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
                  <div className="flex w-max gap-2">
                    {subjects.map((subject) => (
                      <Link
                        key={subject}
                        to={`${PAST_PAPERS_PATH}/results?filter_subjects=${encodeURIComponent(subject)}`}
                        className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-muted px-4 text-[13.5px] font-semibold text-warm-prose transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {subject}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hairline rows, per S16 — not cover cards. This page is a list
                  you scan by year; the shelf is the browsing surface. */}
              <ul className="divide-y divide-border">
                {papers.map((paper) => (
                  <li key={paper.id}>
                    <Link
                      to={`${PAST_PAPERS_PATH}/${paper.id}`}
                      className="flex min-h-11 items-center gap-3 py-3 transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-blue-subtle text-brand-blue-deep">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-foreground">{paper.title}</span>
                        <span className="block truncate text-meta text-warm-meta">
                          {[paper.subject, paper.class ? `Class ${paper.class}` : null, paper.board, paper.year]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Orange cross-sell (S16). The papers surface is indigo
                  throughout, so this is the one warm block on the page and it
                  points at the other half of the product. */}
              <div className="mt-8 rounded-3xl bg-brand-subtle p-6 sm:p-8">
                <h2 className="font-display text-section-head font-extrabold text-brand-deep">
                  Need someone to go through these with you?
                </h2>
                <p className="mt-2 max-w-prose text-body-secondary text-warm-prose">
                  Verified tuition teachers in Kolkata, free to contact. No commission, ever.
                </p>
                <div className="mt-6">
                  <Button asChild variant="primary" size={44}>
                    <Link to={BROWSE_PATH}>
                      Find a teacher
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </PageContainer>

        <PageContainer className="pb-8 pt-10">
          <PreFooter variant={preFooterFor(PAST_PAPERS_PATH)} />
        </PageContainer>
      </main>

      <BottomNavSpacer />
      <Footer />
    </div>
  );
}
