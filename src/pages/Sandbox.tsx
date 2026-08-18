import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ReviewCard, type ReviewCardData } from '@/components/reviews/review-card';
import { WriteReviewSheet } from '@/components/reviews/write-review-sheet';
import { AdminRail, AdminToolbar, type AdminNavItem } from '@/pages/admin/shell';
import { AdminTable, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';

/* DEV-ONLY design sandbox.
 *
 * The admin console and dashboards sit behind an admin login, so their layout,
 * contrast and spacing could not be checked against admin-01..05 without a
 * session. This renders the SHELL COMPONENTS those screens are built from —
 * rail, toolbar, stat cards, table — against fixed mock props, so the design
 * can be reviewed and edited without one.
 *
 * What this deliberately does NOT do:
 *   - touch Supabase, or read any real row
 *   - render the real Admin* page components, which fetch their own data
 *   - bypass, weaken or stand in for the admin gate
 *
 * It is a component gallery with hardcoded strings. The route is registered
 * only when import.meta.env.DEV is true, so it cannot exist in a production
 * build, and nothing here can show data the viewer is not entitled to —
 * because it holds no data at all.
 *
 * The mock rows are obviously synthetic on purpose ("Sandbox Row A"), so a
 * screenshot of this can never be mistaken for the real console.
 */

const NAV: AdminNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '#', count: undefined, active: false },
  { key: 'approvals', label: 'Teacher approvals', path: '#', count: 12, active: true },
  { key: 'teachers', label: 'Live teachers', path: '#', count: 147, active: false },
  { key: 'papers', label: 'Papers', path: '#', count: 9, active: false },
  { key: 'reviews', label: 'Reviews', path: '#', count: 4, active: false },
  { key: 'recommendations', label: 'Recommendations', path: '#', count: 6, active: false },
  { key: 'audit', label: 'Audit log', path: '#', count: undefined, active: false },
];

const COLUMNS: AdminTableColumn[] = [
  { key: 'applicant', label: 'Applicant', width: '2.2fr' },
  { key: 'teaches', label: 'Teaches', width: '1.4fr' },
  { key: 'area', label: 'Area', width: '1fr' },
  { key: 'state', label: 'State', width: '1fr' },
];

const ROWS: AdminTableRow[] = [
  {
    id: 'a',
    initial: 'A',
    title: 'Sandbox Row A',
    subtitle: '+91 00000 00001',
    cells: ['Maths, Physics · 9–10', 'Ballygunge'],
    tone: 'wait',
    tag: 'Docs in',
    actionLabel: 'Review',
    onAction: () => {},
    onOverflow: () => {},
  },
  {
    id: 'b',
    initial: 'B',
    title: 'Sandbox Row B',
    subtitle: '+91 00000 00002',
    cells: ['English · 6–10', 'Salt Lake'],
    tone: 'bad',
    tag: 'No degree',
    actionLabel: 'Review',
    onAction: () => {},
    onOverflow: () => {},
  },
  {
    id: 'c',
    initial: 'C',
    title: 'Sandbox Row C',
    subtitle: '+91 00000 00003',
    cells: ['Accounts · 11–12', 'Behala'],
    tone: 'ok',
    tag: 'Approved',
    actionLabel: 'Review',
    onAction: () => {},
    onOverflow: () => {},
  },
];

function StatCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="rounded-2xl bg-card p-[18px] shadow-border">
      <div className="text-[11px] font-bold uppercase tracking-[.07em] text-warm-label">{label}</div>
      <div className="mt-2 font-display text-[34px] font-black leading-none text-foreground">{value}</div>
      <div className="mt-2 text-[12.5px] text-warm-prose">{caption}</div>
    </div>
  );
}

const RATED_REVIEW: ReviewCardData = {
  id: 'rated',
  quote: 'Sandbox review text, four stars.',
  subject: 'Maths',
  className: 'Class 10',
  initial: 'S',
  who: 'Sandbox Reviewer',
  when: '2 days ago',
  rating: 4,
};

const UNRATED_REVIEW: ReviewCardData = {
  id: 'unrated',
  quote: 'Sandbox review text, written before ratings existed.',
  subject: 'Physics',
  className: 'Class 12',
  initial: 'S',
  who: 'Sandbox Reviewer',
  when: '3 months ago',
  rating: null,
};

export default function Sandbox() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminRail nav={NAV} signedInName="Sandbox viewer" />

      <div className="flex min-h-screen flex-col lg:pl-[244px]">
        <AdminToolbar title="Teacher approvals" badge="12 waiting" />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <p className="mb-5 rounded-xl bg-brand-subtle px-4 py-3 text-body-secondary text-brand-deep">
            <strong className="font-bold">Design sandbox, development only.</strong> Mock props, no
            database access, not the real console. Registered only when <code>import.meta.env.DEV</code>{' '}
            is true.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Waiting" value="12" caption="oldest is 2 days old" />
            <StatCard label="Approved this week" value="18" caption="all live within a day" />
            <StatCard label="Sent back" value="5" caption="missing a document" />
            <StatCard label="Rejected" value="2" caption="both unverifiable" />
          </div>

          <div className="mt-5">
            <AdminTable columns={COLUMNS} rows={ROWS} />
          </div>

          {/* Ratings. Every real teacher's reviews predate the rating column,
              so the rated card and the star input cannot be seen anywhere on
              the live site yet, and the alternative to this was writing fake
              ratings onto real named teachers' reviews. Mock props only. */}
          <h2 className="mb-3 mt-8 font-display text-[20px] font-black text-foreground">Review ratings</h2>
          <div className="flex flex-wrap items-start gap-4">
            <ReviewCard index={0} review={RATED_REVIEW} />
            <ReviewCard index={1} review={UNRATED_REVIEW} />
            <div className="rounded-2xl bg-card p-4 shadow-border">
              <Button variant="primary" size={44} onClick={() => setSheetOpen(true)}>
                Open the review sheet
              </Button>
              <WriteReviewSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                submitting={false}
                error={null}
                /* Logs instead of inserting — the sandbox never touches the database. */
                onSubmit={(comment, isAnonymous, rating) =>
                  console.info('sandbox review (not saved):', { comment, isAnonymous, rating })
                }
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
