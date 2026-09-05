import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/integrations/supabase/client';

/**
 * The three figures the site describes itself with: verified teachers,
 * published papers, and the number of schools those papers came from.
 *
 * There are four hand-rolled copies of this query in the codebase already
 * (Navbar, ProductTour, About, papers-live-announcement), each with its own
 * caching, its own error handling and its own idea of which table to count.
 * This is the canonical one. New callers use it; the existing four can be
 * retired onto it one at a time.
 *
 * A count that does not arrive stays `null` and its caller draws nothing,
 * rather than rendering a zero or a plausible-looking figure. That is the
 * site's standing rule for numbers and the reason this returns nulls instead
 * of defaulting to 0.
 */
export interface SiteCounts {
  teachers: number | null;
  papers: number | null;
  schools: number | null;
}

export function useSiteCounts() {
  return useQuery<SiteCounts>({
    queryKey: ['site', 'counts'],
    /* These move a handful of times a week at most, and every surface that
       shows them is chrome rather than the page's subject. */
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [teachers, papers, schools] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase
          .from('bank_papers')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true),
        /* Distinct schools has no head-count equivalent, so this reads the
           column and counts uniques. `school` is resolved at import time and
           stored on the row, so this is a single narrow column, not a join. */
        supabase.from('bank_papers').select('school').eq('is_published', true),
      ]);

      return {
        teachers: teachers.count ?? null,
        papers: papers.count ?? null,
        schools: schools.data
          ? new Set(schools.data.map((r) => r.school).filter(Boolean)).size || null
          : null,
      };
    },
  });
}
