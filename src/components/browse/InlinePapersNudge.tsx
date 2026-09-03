import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';

import { loadPaperIndex } from '@/lib/question-bank';
import { supabase } from '@/integrations/supabase/client';
import { bankSubjectMatches } from '@/lib/subject-vocabulary';
import { PAST_PAPERS_PATH } from '@/lib/nav-config';
import { cn } from '@/lib/utils';

/* A papers card, sitting in the teacher results.
 *
 * Someone comparing Class 10 ICSE Maths teachers is the single most likely
 * person on the site to want Class 10 ICSE Maths papers, and until now the only
 * route between the two surfaces was a promo below the fold on subject pages
 * and the nav. This puts one card in the flow of the thing they are already
 * reading.
 *
 * Three rules keep it a nudge rather than an ad:
 *
 *   1. It carries the READER'S OWN filters through. Subject, class and board
 *      are matched against the bank and passed to the papers surface, so the
 *      handoff lands pre-filtered on what they were already looking at.
 *   2. It states a real count, computed from the same index the papers surface
 *      renders from. Never a rounded or fabricated figure.
 *   3. It renders NOTHING when the count is zero. The bank covers three
 *      subjects; a reader browsing Physics or Bengali teachers must not be
 *      offered a link to an empty results page. That is the whole reason this
 *      counts before it draws.
 */

export interface InlinePapersNudgeProps {
  subjects: string[];
  classes: string[];
  boards: string[];
  /** 'row' for the mobile list, 'card' for the desktop grid. */
  variant: 'row' | 'card';
  className?: string;
}

export function InlinePapersNudge({
  subjects,
  classes,
  boards,
  variant,
  className,
}: InlinePapersNudgeProps) {
  /* BOTH paper sources, because the papers surface this links to renders both
     and the subject-page promo further down counts both. Counting only the bank
     here would put "193 Maths papers" beside a promo saying 197 on the same
     page, which reads as one of them being wrong.

     Shared react-query keys, so this is two fetches per session no matter how
     many nudges render, and the PDF table is 18 rows. */
  const { data: bankRows } = useQuery({
    queryKey: ['bank-index'],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: () => loadPaperIndex(),
  });
  const { data: pdfRows } = useQuery({
    queryKey: ['pdf-papers-index'],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('papers')
        .select('subject, class, board')
        .eq('is_published', true);
      if (error) return [];
      return data ?? [];
    },
  });

  const eq = (want: string[], value: string | null) =>
    want.length === 0 || want.some((w) => w.toLowerCase() === (value ?? '').toLowerCase());

  const bankMatches = (bankRows ?? []).filter(
    (p) =>
      (subjects.length === 0 || subjects.some((s) => bankSubjectMatches(s, p.subject))) &&
      eq(classes, p.cls) &&
      eq(boards, p.board),
  );
  const pdfMatches = (pdfRows ?? []).filter(
    (p) => eq(subjects, p.subject) && eq(classes, p.class) && eq(boards, p.board),
  );
  const total = bankMatches.length + pdfMatches.length;

  // No papers for what they are looking at: draw nothing rather than a dead end.
  if (total === 0) return null;

  const params = new URLSearchParams();
  if (subjects.length) params.set('filter_subjects', subjects.join(','));
  if (classes.length) params.set('filter_classes', classes.join(','));
  if (boards.length) params.set('filter_boards', boards.join(','));
  const href = `${PAST_PAPERS_PATH}/results${params.toString() ? `?${params}` : ''}`;

  /* The label names only the facets actually applied, so an unfiltered browse
     says "619 past papers" rather than inventing a subject the reader never
     chose. */
  const facet = [
    boards.length === 1 ? boards[0] : null,
    classes.length === 1 ? `Class ${classes[0]}` : null,
    subjects.length === 1 ? subjects[0] : null,
  ]
    .filter(Boolean)
    .join(' ');

  const headline = facet
    ? `${total} ${facet} paper${total === 1 ? '' : 's'}`
    : `${total} past paper${total === 1 ? '' : 's'}`;

  return (
    <Link
      to={href}
      className={cn(
        /* papersTint, not the solid indigo: this sits among teacher cards and
           has to read as a peer offering something else, not as an advert
           shouting over the results. */
        'group flex items-center gap-3 rounded-[18px] bg-brand-blue-subtle p-4 transition-transform duration-tap hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0',
        variant === 'card' && 'h-full flex-col items-start justify-center',
        className,
      )}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] bg-brand-blue text-white">
        <FileText size={18} strokeWidth={2.1} aria-hidden="true" />
      </span>
      <span className={cn('min-w-0 flex-1', variant === 'card' && 'mt-3')}>
        <span className="block text-[11px] font-extrabold uppercase tracking-[0.09em] text-brand-blue-deep">
          Past papers
        </span>
        <span className="mt-1 block font-display text-[17px] font-extrabold leading-[1.15] tracking-[-0.03em] text-foreground">
          {headline}
        </span>
        <span className="mt-1 block text-[12.5px] leading-[1.45] text-warm-prose">
          Free to read. First five questions need no account.
        </span>
      </span>
      <ArrowUpRight
        size={18}
        strokeWidth={2.2}
        aria-hidden="true"
        className={cn('flex-none text-brand-blue-deep', variant === 'card' && 'self-end')}
      />
    </Link>
  );
}

export default InlinePapersNudge;
