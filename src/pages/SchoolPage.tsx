import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { schoolSlug } from '@/lib/school-slug';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useChromeConfig } from '@/components/layout/AppShell';
import { PageContainer } from '@/components/layout/PageContainer';
import { ListLoading, ListEmpty, ListError } from '@/components/ui/list-states';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { ScrollRail } from '@/components/ui/scroll-rail';
import { TeacherCard } from '@/components/TeacherCard';
import { getShikshaqmineBasicBySlugs } from '@/lib/teachers';
import { BROWSE_PATH, PAST_PAPERS_PATH } from '@/lib/nav-config';
import { generateBreadcrumbSchema, generateCollectionPageSchema, injectSchemas } from '@/utils/structuredDataGenerators';

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

/* Mixed-weight H1 split (design system signature move, see Index.tsx/Join.tsx
   hero H1s): a font-normal base clause followed by a font-black payoff. A
   school name has no clause to split on, so the trailing word carries the
   heavy weight, matching how TeacherProfile.tsx handles its own bare-name H1. */
function splitNameForHeading(name: string): [string, string] {
  const lastSpace = name.trim().lastIndexOf(' ');
  if (lastSpace === -1) return ['', name];
  return [name.slice(0, lastSpace), name.slice(lastSpace + 1)];
}

interface SchoolPaper {
  id: string;
  title: string;
  subject: string;
  class: string;
  board: string;
  year: number;
}

export default function SchoolPage() {
  // /school/:slug doesn't match any of preFooterFor's own patterns, so it
  // would otherwise default to B4; this route wants the papers-flavoured B3,
  // same as the rest of the papers surface.
  useChromeConfig({ preFooter: 'B3' });
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

  // Shared facets — boards/classes/years feed the summary line, years also
  // drive the year chips below, and boards+subjects drive the teacher
  // cross-sell query further down.
  const boards = useMemo(() => [...new Set(papers.map((p) => p.board).filter(Boolean))], [papers]);
  const classes = useMemo(
    () => [...new Set(papers.map((p) => Number(p.class)).filter((n) => !Number.isNaN(n)))].sort((a, b) => a - b),
    [papers],
  );
  const years = useMemo(
    () => [...new Set(papers.map((p) => p.year).filter(Boolean))].sort((a, b) => b - a),
    [papers],
  );

  const summary = useMemo(() => {
    if (papers.length === 0) return null;

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
      const ascYears = [...years].sort((a, b) => a - b);
      parts.push(ascYears.length === 1 ? String(ascYears[0]) : `${ascYears[0]}–${ascYears[ascYears.length - 1]}`);
    }
    return parts.join(' · ');
  }, [papers, boards, classes, years]);

  const subjects = useMemo(
    () => [...new Set(papers.map((p) => p.subject).filter(Boolean))].sort(),
    [papers],
  );

  // Year chips filter the paper rows client-side — the whole set is already
  // loaded (one query per school, S16), so there is no reason to round-trip.
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const filteredPapers = useMemo(
    () => (selectedYear == null ? papers : papers.filter((p) => p.year === selectedYear)),
    [papers, selectedYear],
  );

  // Cross-sell: teachers who cater to this school's board(s) — the "School
  // Boards Catered" free-text column on Shikshaqmine is the closest thing to a
  // school-syllabus match that exists (there is no school<->teacher table).
  // Subject overlap against the papers on this page then ranks the matches so
  // the 3 shown are the most relevant, not just whichever sorts first.
  const crossSellTeachers = useQuery({
    queryKey: ['school-teachers', slug, boards.join('|'), subjects.join('|')],
    enabled: papers.length > 0 && (boards.length > 0 || subjects.length > 0),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      let q = (supabase.from('Shikshaqmine').select('"Slug","School Boards Catered","Subjects"') as any).limit(60);
      if (boards.length > 0) {
        q = q.or(boards.map((b) => `School Boards Catered.ilike.%${b}%`).join(','));
      } else {
        q = q.or(subjects.map((s) => `Subjects.ilike.%${s}%`).join(','));
      }
      const { data, error } = await q;
      if (error || !data) return [];

      const ranked = (data as any[])
        .filter((row) => row.Slug)
        .map((row) => {
          const rowSubjects = String(row.Subjects || '').toLowerCase();
          const overlap = subjects.filter((s) => rowSubjects.includes(s.toLowerCase())).length;
          return { slug: row.Slug as string, overlap };
        })
        .sort((a, b) => b.overlap - a.overlap);

      const topSlugs = [...new Set(ranked.map((r) => r.slug))].slice(0, 3);
      if (topSlugs.length === 0) return [];

      const [{ data: teacherRows, error: teacherError }, basicMap] = await Promise.all([
        supabase.from('teachers_list').select('id, name, slug, image_url, subjects(name, slug)').in('slug', topSlugs),
        getShikshaqmineBasicBySlugs(topSlugs),
      ]);
      if (teacherError || !teacherRows) return [];

      return (teacherRows as any[]).map((t) => {
        const basic = basicMap.get(t.slug);
        return {
          id: t.id as string,
          name: t.name as string,
          slug: t.slug as string,
          image_url: t.image_url as string | null,
          subjects: t.subjects as { name: string; slug: string } | null,
          // Bug 5 fix: `basicMap` (getShikshaqmineBasicBySlugs) already resolves
          // a real subject from Shikshaqmine.Subjects for rows whose
          // teachers_list `subjects` FK is null — the same helper LikedTeachers/
          // MyTeachers/StudentDashboard/GuardianDashboard use via getTeachersByIds.
          // This mapping fetched `basicMap` but never read `.firstSubject`, so
          // any teacher without the FK relation fell straight through to
          // TeacherCard's generic fallback below even though a real subject was
          // sitting right there in `basic`.
          firstSubject: basic?.firstSubject ?? null,
          whatsappLink: basic?.whatsappLink ?? null,
          experienceYears: basic?.experienceYears ?? null,
          minFees: basic?.minFees ?? null,
          maxFees: basic?.maxFees ?? null,
          area: basic?.area ?? null,
        };
      });
    },
  });
  const railTeachers = crossSellTeachers.data ?? [];

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
      generateCollectionPageSchema({
        url: `https://www.shikshaq.in/school/${slug}`,
        name: `${name} past papers`,
        description: `${papers.length} past papers from ${name}, free to read on Shikshaq.`,
        about: name,
        numberOfItems: papers.length,
      }),
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
              className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-white/80 transition-colors duration-tap hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All schools
            </Link>

            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 font-display text-[22px] font-black text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <h1 className="font-display text-[28px] font-normal leading-[1.05] tracking-[-0.035em] text-white">
              {(() => {
                const [base, payoff] = splitNameForHeading(name);
                return base ? <>{base} <span className="font-black">{payoff}</span></> : <span className="font-black">{payoff}</span>;
              })()}
            </h1>
            {summary && <p className="mt-2 text-[14px] leading-[1.55] tabular-nums text-white/85">{summary}</p>}
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
              {/* Year chips, per S16: "year chips → subject chips → hairline
                  paper rows". Client-side toggle over the already-loaded set —
                  there's one query per school page, so no round-trip is
                  needed to re-slice it by year. */}
              {years.length > 1 && (
                <div className="-mx-4 mb-2.5 px-4 sm:mx-0 sm:px-0">
                  <ScrollRail className="flex items-center gap-2" fadeFrom="from-background">
                    <Chip
                      tone={selectedYear == null ? 'dark-on-papers' : 'facet'}
                      size={44}
                      onClick={() => setSelectedYear(null)}
                      aria-pressed={selectedYear == null}
                    >
                      All years
                    </Chip>
                    {years.map((year) => (
                      <Chip
                        key={year}
                        tone={selectedYear === year ? 'dark-on-papers' : 'facet'}
                        size={44}
                        onClick={() => setSelectedYear((prev) => (prev === year ? null : year))}
                        aria-pressed={selectedYear === year}
                      >
                        {year}
                      </Chip>
                    ))}
                  </ScrollRail>
                </div>
              )}

              {subjects.length > 1 && (
                <div className="-mx-4 mb-5 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
                  <div className="flex w-max gap-2">
                    {subjects.map((subject) => (
                      <Link
                        key={subject}
                        to={`${PAST_PAPERS_PATH}/results?filter_subjects=${encodeURIComponent(subject)}`}
                        className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-muted px-4 text-[13.5px] font-semibold text-warm-prose transition-colors duration-tap hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {subject}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredPapers.length === 0 ? (
                <ListEmpty line={`No papers from ${selectedYear}.`} />
              ) : (
              /* Hairline rows, per S16 — not cover cards. This page is a list
                  you scan by year; the shelf is the browsing surface. */
              <ul className="divide-y divide-border">
                {filteredPapers.map((paper) => (
                  <li key={paper.id}>
                    <Link
                      to={`${PAST_PAPERS_PATH}/${paper.id}`}
                      className="flex min-h-11 items-center gap-3 py-3 transition-colors duration-tap hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              )}

              {/* Orange cross-sell (S16). The papers surface is indigo
                  throughout, so this is the one warm block on the page and it
                  points at the other half of the product. Real rail cards when
                  a board/subject match exists; the generic CTA is the fallback
                  for a school where nothing matches rather than an empty or
                  broken rail. */}
              <div className="mt-8 rounded-3xl bg-brand-subtle p-6 sm:p-8">
                <h2 className="font-display text-section-head font-extrabold text-brand-deep">
                  {railTeachers.length > 0
                    ? "Teachers who teach this school's syllabus"
                    : 'Need someone to go through these with you?'}
                </h2>
                <p className="mt-2 max-w-prose text-body-secondary text-warm-prose">
                  Verified tuition teachers in Kolkata, free to contact. No commission, ever.
                </p>

                {railTeachers.length > 0 ? (
                  <div className="-mx-2 mt-5 px-2">
                    <ScrollRail className="flex items-stretch gap-3" fadeFrom="from-brand-subtle">
                      {railTeachers.map((t) => (
                        <div key={t.id} className="w-[172px] flex-none">
                          <TeacherCard
                            id={t.id}
                            name={t.name}
                            slug={t.slug}
                            subject={t.firstSubject || t.subjects?.name || 'Tuition Teacher'}
                            subjectSlug={t.subjects?.slug}
                            imageUrl={t.image_url ?? undefined}
                            variant="grid-compact"
                            size="sm"
                            minFees={t.minFees}
                            maxFees={t.maxFees}
                          />
                        </div>
                      ))}
                    </ScrollRail>
                  </div>
                ) : (
                  <div className="mt-6">
                    <Button asChild variant="primary" size={44}>
                      <Link to={BROWSE_PATH}>
                        Find a teacher
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </PageContainer>
      </main>
    </div>
  );
}
