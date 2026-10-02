import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* Shared by every /admin/* page for its nav badges: real counts only, never a
   placeholder, head-count queries only (no row bodies).

   Load cost, measured by reading the code: this ran on every one of the 13
   admin pages and fired 4 count queries each time, uncached, so moving between
   tabs paid 4 round trips every time. It is now one React Query entry shared
   by every page (60 s fresh, kept 10 min), so a tab change costs nothing.

   If the server has admin_nav_counts() (20261003130000_admin_queue_library.sql),
   one call returns all five numbers, including Ready to go live and the Admin
   queue. Until it is applied the four count queries below answer, and the two
   new badges are simply left off. The choice is remembered for the session so
   a missing function is not retried on every page. */

export interface AdminSectionCounts {
  /** Teacher applications waiting. */
  approvals?: number;
  /** Teacher comments plus recommendations waiting. */
  reviews?: number;
  /** Papers waiting in Ready to go live. */
  paperApprovals?: number;
  /** Questions waiting in the Admin queue. */
  adminQueue?: number;
}

let oneCallMissing = false;

async function viaOneCall(): Promise<AdminSectionCounts | null> {
  if (oneCallMissing) return null;
  const { data, error } = await supabase.rpc('admin_nav_counts' as never);
  if (error) {
    // 42883 / PGRST202: the function is not there yet. Anything else (a
    // dropped connection) is retried next time.
    if (/42883|PGRST202|does not exist|Could not find/i.test(`${error.code ?? ''} ${error.message ?? ''}`)) oneCallMissing = true;
    return null;
  }
  const raw = data as unknown;
  const d = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null;
  if (!d) return null;
  const n = (v: unknown) => (typeof v === 'number' ? v : typeof v === 'string' && v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined);
  return {
    approvals: n(d.applications),
    reviews: n(d.reviews),
    paperApprovals: n(d.ready),
    adminQueue: n(d.admin_queue),
  };
}

async function viaCounts(): Promise<AdminSectionCounts> {
  const [approvals, comments, recommendations] = await Promise.all([
    supabase.from('teacher_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('approved', false),
    supabase.from('teacher_recommendations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);
  return {
    approvals: approvals.count ?? undefined,
    reviews: (comments.count ?? 0) + (recommendations.count ?? 0),
  };
}

export const ADMIN_COUNTS_KEY = ['admin', 'section-counts'] as const;

export function useAdminSectionCounts(): AdminSectionCounts {
  const { data } = useQuery({
    queryKey: ADMIN_COUNTS_KEY,
    queryFn: async () => (await viaOneCall()) ?? (await viaCounts()),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return data ?? {};
}
