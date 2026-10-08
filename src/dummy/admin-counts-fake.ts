import type { AdminCountField, AdminCountsResult } from '@/pages/admin/useAdminSectionCounts';

/* Made-up nav counts for dummy mode (D75). Test builds only: reached solely
   through a dynamic import behind PREVIEW_TOOLS in useAdminSectionCounts.ts.

   `?counts=error` on the URL makes the FIRST read fail on every field, and
   `?counts=partial` makes it fail on two, so the "?" badge and the Retry
   button can be seen. Every later read (the Retry button) succeeds. The state
   is per page load, so it never leaks into a real session. */

const FIXTURE = {
  paperApprovals: 6,
  adminQueue: 41,
  submissions: 3,
  approvals: 4,
  reviews: 2,
} as const;

function mode(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('counts');
  } catch {
    return null;
  }
}

let firstRead = true;

export async function fakeCounts(): Promise<AdminCountsResult> {
  const failFirst = firstRead ? mode() : null;
  firstRead = false;
  if (failFirst === 'error') return { counts: {}, failed: ['paperApprovals', 'adminQueue', 'submissions', 'approvals', 'reviews'] };
  if (failFirst === 'partial') {
    const failed: AdminCountField[] = ['adminQueue', 'reviews'];
    const counts = { ...FIXTURE } as Partial<Record<AdminCountField, number>>;
    for (const f of failed) delete counts[f];
    return { counts, failed };
  }
  return { counts: { ...FIXTURE }, failed: [] };
}
