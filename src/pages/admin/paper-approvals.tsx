import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth-context';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { cn } from '@/lib/utils';
import { AdminPageIntro, InfoTip } from '@/components/admin/AdminHelp';
import { TIPS, type TipKey } from '@/lib/admin-hints';
import { displaySchool } from '@/lib/school-display';
import { realApprovalApi } from '@/lib/admin-approval';
import { isReady, type ApprovalApi, type ApprovalQueueRow } from '@/lib/admin-approval-shape';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyPaperApprovals = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminPaperApprovalsDummy')) : null;

/* /admin/paper-approvals: papers waiting for an admin to approve them for
   launch (owner, 2026-10-02: "papers whose AI checks pass go to an admin
   approval queue ... an admin views, may edit, then approves").

   Two kinds share the list: NEW papers (not on the site yet) and papers that
   are ALREADY LIVE and need approving after the fact (the 23 auto-published
   on 2 October). A paper with any open question cannot be approved; the
   counts say so before you open it.

   Named paper-approvals, not approvals: /admin/approvals is the teacher
   applications queue and stays as it is. */

type Filter = 'all' | 'ready' | 'open' | 'retro';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ready', label: 'Ready to approve' },
  { key: 'open', label: 'Has open questions' },
  { key: 'retro', label: 'Already live' },
];

function Tile({ label, value, sub, tip }: { label: string; value: ReactNode; sub?: ReactNode; tip?: TipKey }) {
  return (
    <div className="rounded-2xl bg-muted px-4 py-3">
      <p className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wide text-warm-label">
        {label}
        {tip ? <InfoTip tip={tip} label={label} /> : null}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {sub ? <p className="mt-0.5 text-[13px] text-warm-meta">{sub}</p> : null}
    </div>
  );
}

/** "38 passed, 2 open, 1 set aside", with the open part stressed. */
function Counts({ row }: { row: ApprovalQueueRow }) {
  return (
    <span className="tabular-nums">
      {row.passed} passed
      {row.open ? (
        <>
          , <span className="font-bold text-brand-deep">{row.open} open</span>
        </>
      ) : null}
      {row.set_aside ? `, ${row.set_aside} set aside` : null}
    </span>
  );
}

function aiWords(a: ApprovalQueueRow['ai_summary']): string {
  const parts = [
    a.pass ? `${a.pass} passed` : null,
    a.fix ? `${a.fix} fixed` : null,
    a.student ? `${a.student} sent to students` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Not checked yet';
}

export function AdminPaperApprovalsPage({
  api = realApprovalApi,
  dummy = false,
  banner,
}: {
  api?: ApprovalApi;
  dummy?: boolean;
  banner?: ReactNode;
}) {
  usePageMeta('Ready to go live | Shikshaq Admin', 'Approve checked papers for launch on the site.');
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const signedIn = dummy ? 'admin@example.com' : user?.email ?? profile?.full_name ?? 'Signed-in admin';
  const [rows, setRows] = useState<ApprovalQueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const guard = useAdminGuard(dummy ? null : user, { onGranted: load, redirectOnDenied: !dummy });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const sectionCounts = useAdminSectionCounts();

  useEffect(() => {
    if (dummy) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummy]);
  useEffect(() => {
    if (!checkingAdmin && !isAdmin) setLoading(false);
  }, [checkingAdmin, isAdmin]);

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      setRows(await api.queue());
    } catch (e) {
      if (import.meta.env.DEV) console.error('paper approvals', e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  const ready = rows.filter(isReady).length;
  const withOpen = rows.length - ready;
  const retro = rows.filter((r) => r.kind === 'retro').length;
  const nav = buildAdminNav('ready', { ...sectionCounts, paperApprovals: rows.length });

  const shown = useMemo(
    () =>
      rows.filter((r) =>
        filter === 'ready' ? isReady(r) : filter === 'open' ? !isReady(r) : filter === 'retro' ? r.kind === 'retro' : true,
      ),
    [rows, filter],
  );

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={signedIn} />
        {banner}
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="grid animate-pulse grid-cols-2 gap-3 px-[18px] md:grid-cols-4" role="status" aria-label="Loading the queue">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted" />
            ))}
          </div>
          <div className="mt-4 space-y-2 px-[18px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
    );
  }
  if (!dummy && guard.error) return <AdminGuardErrorState onRetry={guard.retry} />;
  if (!isAdmin) return null;

  const columns: AdminTableColumn[] = [
    { key: 'paper', label: 'Paper', width: '2fr', hint: TIPS['col.ready.paper'] },
    { key: 'school', label: 'School', width: '1.5fr', hint: TIPS['col.school'] },
    { key: 'questions', label: 'Questions', width: '1.5fr', hint: TIPS['col.ready.questions'] },
    { key: 'ai', label: 'AI check', width: '1.4fr', hint: TIPS['col.ready.ai'] },
    { key: 'queued', label: 'Waiting', width: '0.9fr', hint: TIPS['col.ready.waiting'] },
    { key: 'state', label: 'State', width: '1fr', hint: TIPS['col.ready.state'] },
  ];
  const tableRows: AdminTableRow[] = shown.map((r) => ({
    id: r.audit_paper_id,
    cells: [
      <span key="t">{r.title}</span>,
      r.school ? displaySchool(r.school) : 'School not recorded',
      <Counts key="c" row={r} />,
      aiWords(r.ai_summary),
      <span key="q" className="text-warm-meta">
        {r.queued_at ? formatDistanceToNow(new Date(r.queued_at), { addSuffix: true }) : 'Not recorded'}
      </span>,
      r.kind === 'retro' ? (
        <AdminStatusPill key="s" status="live" label="Already live" />
      ) : isReady(r) ? (
        <AdminStatusPill key="s" status="pending" label="Ready" />
      ) : (
        <AdminStatusPill key="s" status="paused" label={`${r.open} open`} />
      ),
    ],
    actions: [
      {
        label: 'Review',
        tone: 'primary',
        onClick: () => navigate(`/admin/paper-approvals/${encodeURIComponent(r.audit_paper_id)}`),
      },
    ],
  }));

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={signedIn} />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-3 px-[18px]">
          <AdminPageIntro page="ready" />
        </div>
        <AdminPanelHeader title="Ready to go live" meta={`${rows.length} waiting`} />
        <div className="grid grid-cols-2 gap-3 px-[18px] md:grid-cols-4">
          <Tile label="Waiting" value={rows.length} tip="ready.waiting" />
          <Tile label="Ready to approve" value={ready} sub="no open questions" tip="ready.ready" />
          <Tile label="Has open questions" value={withOpen} sub="cannot be approved yet" tip="ready.open" />
          <Tile label="Already live" value={retro} sub="approve after the fact" tip="ready.live" />
        </div>
      </BentoPanel>

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-3 flex flex-wrap gap-1.5 px-[18px]" role="group" aria-label="Show">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'inline-flex h-10 items-center rounded-full px-4 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                filter === f.key ? 'bg-panel font-bold text-background' : 'bg-muted font-semibold text-warm-secondary hover:bg-warm-hairline',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {loadError ? (
          <div className="px-[18px]" role="alert">
            <p className="text-sm text-foreground">The queue did not load. Check your internet and try again.</p>
            <button type="button" onClick={() => void load()} className="tap-44 mt-2 text-sm font-semibold text-brand-blue">
              Try again
            </button>
          </div>
        ) : shown.length ? (
          <AdminTable columns={columns} rows={tableRows} />
        ) : (
          <div className="px-[18px] py-6 text-center">
            <p className="text-[15px] font-semibold text-foreground">
              {rows.length ? 'No papers match this view.' : 'Nothing is waiting for approval.'}
            </p>
            <p className="mt-1 text-[13px] text-warm-secondary">
              {rows.length
                ? 'Pick another view above.'
                : 'Papers appear here once their checks finish. The pipeline page shows what is still being checked.'}
            </p>
            {rows.length ? (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-3 inline-flex min-h-10 items-center rounded-full bg-muted px-4 text-[13px] font-bold text-foreground"
              >
                Show all
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/admin/pipeline')}
                className="mt-3 inline-flex min-h-10 items-center rounded-full bg-muted px-4 text-[13px] font-bold text-foreground"
              >
                Open the pipeline
              </button>
            )}
          </div>
        )}
      </BentoPanel>

      <AdminAuditNote />
    </BentoStack>
  );
}

export default function AdminPaperApprovals() {
  if (DummyPaperApprovals && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyPaperApprovals />
      </Suspense>
    );
  }
  return <AdminPaperApprovalsPage />;
}
