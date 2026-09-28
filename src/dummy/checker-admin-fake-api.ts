import type { CheckerAdminApi, CheckerAdminRow } from '@/lib/checker-admin-api';
import { looksLikeEmail } from '@/lib/email-shape';

/**
 * In-memory fake of the "add checkers by email" admin RPCs (D75), for
 * previewing /admin/checkers without a real admin sign-in. Made-up people,
 * not real Shikshaq staff or checkers.
 */
export function createFakeCheckerAdminApi(): CheckerAdminApi & { reset: () => void } {
  let rows: CheckerAdminRow[] = [
    {
      user_id: 'd1111111-0000-4000-8000-000000000001',
      email: 'asha.reviewer@example.com',
      full_name: 'Asha Reviewer',
      added_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      checked_today: 14,
      checked_total: 812,
    },
    {
      user_id: 'd1111111-0000-4000-8000-000000000002',
      email: 'nikhil.k@example.com',
      full_name: 'Nikhil K',
      added_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      checked_today: 0,
      checked_total: 47,
    },
    {
      user_id: 'd1111111-0000-4000-8000-000000000003',
      email: 'no-name-yet@example.com',
      full_name: null,
      added_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      checked_today: 2,
      checked_total: 2,
    },
  ];

  function reset() {
    rows = rows.slice(0, 2);
  }

  return {
    async listCheckers() {
      return rows.map((r) => ({ ...r }));
    },
    async addChecker(email: string) {
      const trimmed = email.trim();
      if (!looksLikeEmail(trimmed)) throw new Error('Enter a full email address.');
      if (rows.some((r) => r.email.toLowerCase() === trimmed.toLowerCase())) {
        throw new Error('That email is already a checker.');
      }
      // 20% of made-up addresses simulate "no account with that email yet",
      // so the preview can show that path without a real Supabase lookup.
      if (trimmed.startsWith('nobody')) throw new Error('No account found for that email');
      const newRow: CheckerAdminRow = {
        user_id: `d2${Math.random().toString(16).slice(2, 10)}-0000-4000-8000-000000000000`,
        email: trimmed,
        full_name: null,
        added_at: new Date().toISOString(),
        checked_today: 0,
        checked_total: 0,
      };
      rows = [newRow, ...rows];
      return newRow.user_id;
    },
    async removeChecker(userId: string) {
      rows = rows.filter((r) => r.user_id !== userId);
    },
    reset,
  };
}
