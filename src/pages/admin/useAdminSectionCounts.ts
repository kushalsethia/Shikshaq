import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/* Shared by every /admin/* page for its AdminRail nav counts (design pixel
   spec: "real per-section counts only, never a placeholder"). Cheap
   head-count queries only — no row bodies fetched. Each page may still pass
   its own live number for the section it's currently viewing (computed from
   data it already has in memory) instead of this hook's snapshot. */

export interface AdminSectionCounts {
  approvals?: number;
  teachers?: number;
  papers?: number;
  reviews?: number;
}

export function useAdminSectionCounts(): AdminSectionCounts {
  const [counts, setCounts] = useState<AdminSectionCounts>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const [approvals, comments, recommendations, papers] = await Promise.all([
        supabase.from('teacher_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('approved', false),
        supabase.from('teacher_recommendations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', false),
      ]);
      if (cancelled) return;
      setCounts({
        approvals: approvals.count ?? undefined,
        reviews: (comments.count ?? 0) + (recommendations.count ?? 0),
        papers: papers.count ?? undefined,
      });
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}
