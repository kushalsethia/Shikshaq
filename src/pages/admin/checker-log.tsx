import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth-context';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { cn } from '@/lib/utils';
import { realCheckerLogApi } from '@/lib/checker-log-api';
import { ROLE_LABELS, type CheckerLogApi, type CheckerRow } from '@/lib/checker-log';
import { timeWords, type ActorKind } from '@/lib/history-labels';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyCheckerLog = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminCheckerLogDummy')) : null;

/* /admin/checker-log: everyone and everything that checks papers, people
   first, then the AI checks and the pipeline. Open one to read their work
   day by day (owner, 2026-10-02: "an admin page to see a checker's log day
   wise in good english language visually").

   Named checker-log because /admin/checkers is the page that grants checker
   access, and stays as it is. */

type Filter = 'all' | 'people' | 'machines';

const ROLE_ORDER: Record<ActorKind, number> = { student: 0, admin: 1, ai: 2, pipeline: 3 };

export function AdminCheckerLogPage({
  api = realCheckerLogApi,
  dummy = false,
  banner,
}: {
  api?: CheckerLogApi;
  dummy?: boolean;
  banner?: ReactNode;
}) {
  usePageMeta('Checker log | Shikshaq Admin', 'What each checker did, day by day.');
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const signedIn = dummy ? 'admin@example.com' : user?.email ?? profile?.full_name ?? 'Signed-in admin';
  const [rows, setRows] = useState<CheckerRow[]>([]);
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
      setRows(await api.list());
    } catch (e) {
      if (import.meta.env.DEV) console.error('checker log', e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  const nav = buildAdminNav('checker-log', { approvals: sectionCounts.approvals, reviews: sectionCounts.reviews });

  const sorted = useMemo(
    () =>
      [...rows]
        .filter((r) => (filter === 'people' ? r.role === 'student' || r.role === 'admin' : filter === 'machines' ? r.role === 'ai' || r.role === 'pipeline' : true))
        .sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role] || (b.last_at ?? '').localeCompare(a.last_at ?? '')),
    [rows, filter],
  );

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={signedIn} />
        {banner}
        <BentoPanel fill="card" className="px-[18px] py-[18px]">
          <div className="animate-pulse space-y-2" role="status" aria-label="Loading the checker log">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
    );
  }
  if (!dummy && guard.error) return <AdminGuardErrorState onRetry={guard.retry} />;
  if (!isAdmin) return null;

  const people = rows.filter((r) => r.role === 'student' || r.role === 'admin').length;
  const dayAgo = Date.now() - 24 * 3600_000;
  const activeToday = rows.filter((r) => r.last_at && new Date(r.last_at).getTime() >= dayAgo).length;
  const total = rows.reduce((s, r) => s + r.total_actions, 0);

  const columns: AdminTableColumn[] = [
    { key: 'name', label: 'Name', width: '1.6fr' },
    { key: 'role', label: 'Role', width: '1.1fr' },
    { key: 'last', label: 'Last active', width: '1.4fr' },
    { key: 'total', label: 'Actions', width: '0.8fr' },
    { key: 'since', label: 'Since', width: '1fr' },
  ];
  const tableRows: AdminTableRow[] = sorted.map((r) => ({
    id: r.actor_key,
    cells: [
      <span key="n">{r.name}</span>,
      ROLE_LABELS[r.role],
      <span key="l" className="text-warm-meta" title={r.last_at ? timeWords(r.last_at) : undefined}>
        {r.last_at ? formatDistanceToNow(new Date(r.last_at), { addSuffix: true }) : 'Never'}
      </span>,
      <span key="t" className="tabular-nums">
        {r.total_actions.toLocaleString()}
      </span>,
      <span key="s" className="text-warm-meta">
        {r.first_at ? timeWords(r.first_at).split(',')[0] : 'Not recorded'}
      </span>,
    ],
    actions: [
      {
        label: 'Open log',
        tone: 'primary',
        onClick: () => navigate(`/admin/checker-log/${encodeURIComponent(r.actor_key)}`),
      },
    ],
  }));

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={signedIn} />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Checker log" meta={`${rows.length} in the log`} />
        <p className="-mt-1 mb-3 px-[18px] text-pretty text-[14px] text-warm-secondary">
          Everyone who checks papers, and the AI checks and pipeline that help them. Open a name to read what they did, day by
          day.
        </p>
        <div className="grid grid-cols-2 gap-3 px-[18px] md:grid-cols-4">
          <Stat label="People" value={people} sub="student checkers and admins" />
          <Stat label="AI and pipeline" value={rows.length - people} />
          <Stat label="Active in the last day" value={activeToday} />
          <Stat label="Actions recorded" value={total.toLocaleString()} />
        </div>
      </BentoPanel>

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-3 flex flex-wrap gap-1.5 px-[18px]" role="group" aria-label="Show">
          {(
            [
              ['all', 'Everyone'],
              ['people', 'People'],
              ['machines', 'AI and pipeline'],
            ] as [Filter, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={filter === k}
              onClick={() => setFilter(k)}
              className={cn(
                'inline-flex h-10 items-center rounded-full px-4 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                filter === k ? 'bg-panel font-bold text-background' : 'bg-muted font-semibold text-warm-secondary hover:bg-warm-hairline',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {loadError ? (
          <div className="px-[18px]" role="alert">
            <p className="text-sm text-foreground">The checker log did not load. Check your internet and try again.</p>
            <button type="button" onClick={() => void load()} className="tap-44 mt-2 text-sm font-semibold text-brand-blue">
              Try again
            </button>
          </div>
        ) : sorted.length ? (
          <AdminTable columns={columns} rows={tableRows} />
        ) : (
          <div className="px-[18px] py-6 text-center">
            <p className="text-[15px] font-semibold text-foreground">Nobody has checked anything yet.</p>
            <p className="mt-1 text-[13px] text-warm-secondary">Give someone checker access on the Checkers page to get started.</p>
            <button
              type="button"
              onClick={() => navigate('/admin/checkers')}
              className="mt-3 inline-flex min-h-10 items-center rounded-full bg-muted px-4 text-[13px] font-bold text-foreground"
            >
              Open Checkers
            </button>
          </div>
        )}
      </BentoPanel>

      <AdminAuditNote />
    </BentoStack>
  );
}

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-2xl bg-muted px-4 py-3">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-warm-label">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {sub ? <p className="mt-0.5 text-[13px] text-warm-meta">{sub}</p> : null}
    </div>
  );
}

export default function AdminCheckerLog() {
  if (DummyCheckerLog && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyCheckerLog />
      </Suspense>
    );
  }
  return <AdminCheckerLogPage />;
}
