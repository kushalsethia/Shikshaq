import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Footer } from '@/components/Footer';
import { PreFooter } from '@/components/layout/PreFooter';
import { AdminRail, AdminToolbar, type AdminNavItem } from '@/pages/admin/shell';
import { AdminTable, AdminStatePill, type AdminTableColumn, type AdminTableRow, type AdminPillTone } from '@/pages/admin/AdminTable';
import { useAdminGuard } from '@/components/AdminConsole';
import { SURFACE_TOKENS } from '@/utils/searchFacets';

/* Redesign admin-05-audit-log.png — the last buildable gap in the redesign
   (docs/REDESIGN_STATUS.md #3). Reads public.admin_audit_log (see
   supabase/migrations/20260818000000_admin_audit_log.sql, applied by the
   orchestrator). The table is written to by src/lib/audit.ts from every
   other admin mutation. Rule 10: no stickers, no tilts, no blobs — admin
   carries no fun layer. */

const NAV_ITEMS: { key: string; label: string; path: string }[] = [
  { key: 'applications', label: 'Teacher approvals', path: '/admin/applications' },
  { key: 'teachers', label: 'Live teachers', path: '/admin/teachers' },
  { key: 'papers', label: 'Papers', path: '/admin/papers' },
  { key: 'upvotes', label: 'Reviews', path: '/admin/upvotes' },
  { key: 'recommendations', label: 'Recommendations', path: '/admin/recommendations' },
  { key: 'feedback', label: 'Enquiries', path: '/admin/feedback' },
  { key: 'audit', label: 'Audit log', path: '/admin/audit' },
];

interface AuditRow {
  id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  target_label: string;
  reason: string | null;
  created_at: string;
}

const ACTION_TONE: Record<string, AdminPillTone> = {
  approve: 'ok',
  publish: 'ok',
  sent_back: 'idle',
  reject: 'bad',
  takedown: 'bad',
  delete: 'bad',
  hold: 'wait',
  edit: 'info',
  resolve: 'ok',
};

const ACTION_PILL_LABEL: Record<string, string> = {
  approve: 'Approve',
  publish: 'Approve',
  sent_back: 'Sent back',
  reject: 'Reject',
  takedown: 'Takedown',
  delete: 'Takedown',
  hold: 'Held',
  edit: 'Edit',
  resolve: 'Approve',
};

function actionTitle(row: AuditRow): string {
  switch (row.action) {
    case 'approve':
      return `Approved ${row.target_type.replace('_', ' ')}`;
    case 'publish':
      return `Published ${row.target_type.replace('_', ' ')}`;
    case 'reject':
      return `Rejected ${row.target_type.replace('_', ' ')}`;
    case 'takedown':
      return `Took down ${row.target_type.replace('_', ' ')}`;
    case 'delete':
      return `Deleted ${row.target_type.replace('_', ' ')}`;
    case 'edit':
      return `Edited ${row.target_type.replace('_', ' ')}`;
    case 'resolve':
      return `Resolved ${row.target_type.replace('_', ' ')}`;
    default:
      return `${row.action} ${row.target_type.replace('_', ' ')}`;
  }
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  const days = Math.round((now.getTime() - date.getTime()) / 86400000);
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

const COLUMNS: AdminTableColumn[] = [
  { key: 'action', label: 'Action', width: '2.4fr' },
  { key: 'by', label: 'By', width: '1fr' },
  { key: 'when', label: 'When', width: '1fr' },
  { key: 'reason', label: 'Reason given', width: '1.2fr' },
];

export default function AdminAuditLog() {
  const { user, profile } = useAuth();
  const signedInName = profile?.full_name || user?.email || 'Admin';
  const navigate = useNavigate();
  const { isAdmin, checkingAdmin } = useAdminGuard(user, { redirectOnDenied: true });

  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [search, setSearch] = useState('');

  const [stats, setStats] = useState<{ total: number | null; approvals: number | null; rejections: number | null; takedowns: number | null; admins: number | null }>({
    total: null,
    approvals: null,
    rejections: null,
    takedowns: null,
    admins: null,
  });

  const sevenDaysAgoIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }, []);

  async function fetchLog() {
    setLoading(true);
    setErrored(false);
    try {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('id, actor_name, action, target_type, target_id, target_label, reason, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setRows((data as AuditRow[]) || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching audit log:', error);
      setErrored(true);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const [totalRes, approvalsRes, rejectionsRes, takedownsRes, weekRows] = await Promise.all([
        supabase.from('admin_audit_log').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso),
        supabase.from('admin_audit_log').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso).in('action', ['approve', 'publish', 'resolve']),
        supabase.from('admin_audit_log').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso).eq('action', 'reject'),
        supabase.from('admin_audit_log').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgoIso).in('action', ['takedown', 'delete']),
        supabase.from('admin_audit_log').select('actor_name').gte('created_at', sevenDaysAgoIso),
      ]);

      const distinctAdmins = weekRows.data ? new Set(weekRows.data.map((r: { actor_name: string }) => r.actor_name)).size : null;

      setStats({
        total: totalRes.count ?? null,
        approvals: approvalsRes.count ?? null,
        rejections: rejectionsRes.count ?? null,
        takedowns: takedownsRes.count ?? null,
        admins: distinctAdmins,
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching audit stats:', error);
      // Real counts only — if the query fails, drop the clause rather than fabricate.
      setStats({ total: null, approvals: null, rejections: null, takedowns: null, admins: null });
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    fetchLog();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.actor_name.toLowerCase().includes(q) ||
        r.target_label.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        (r.reason || '').toLowerCase().includes(q)
    );
  }, [rows, search]);

  const tableRows: AdminTableRow[] = filteredRows.map((r) => ({
    id: r.id,
    title: actionTitle(r),
    subtitle: `${r.target_label}${r.target_type ? ` · ${r.target_type.replace('_', ' ')}` : ''}`,
    cells: [r.actor_name, formatWhen(r.created_at)],
    tone: ACTION_TONE[r.action] || 'idle',
    tag: ACTION_PILL_LABEL[r.action] || r.action,
    actionLabel: 'Open',
    onAction: () => {
      // Audit rows are read-only records, not editable resources — "Open"
      // routes back to the section that owns the target rather than to an
      // edit form the audit log itself has no business exposing.
      if (r.target_type === 'teacher_application') navigate('/admin/applications');
      else if (r.target_type === 'teacher') navigate('/admin/teachers');
      else if (r.target_type === 'paper') navigate('/admin/papers');
      else if (r.target_type === 'comment') navigate('/admin/upvotes');
      else if (r.target_type === 'recommendation') navigate('/admin/recommendations');
      else if (r.target_type === 'feedback') navigate('/admin/feedback');
    },
  }));

  if (checkingAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: SURFACE_TOKENS.shell }} className="flex flex-col items-center justify-center">
        <p className="text-body-secondary text-warm-prose">Checking admin access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // useAdminGuard already redirected
  }

  const shellNav: AdminNavItem[] = NAV_ITEMS.map((item) => ({
    key: item.key,
    label: item.label,
    path: item.path,
    active: item.key === 'audit',
  }));

  return (
    <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
      <AdminRail nav={shellNav} signedInName={signedInName} />

      <div className="flex min-h-screen flex-col lg:pl-[244px]">
        <div className="hidden lg:flex h-[68px] items-center justify-between border-b border-warm-hairline bg-card px-7">
          <div className="flex items-center gap-[14px]">
            <span className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-foreground">Audit log</span>
            <span className="inline-flex h-[26px] items-center whitespace-nowrap rounded-full bg-muted px-[11px] text-xs font-bold text-warm-prose">
              Append only
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search admin, action or teacher"
                aria-label="Search admin, action or teacher"
                className="h-11 w-[280px] rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>
            <span className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-foreground px-5 text-sm font-bold text-background">
              Last 7 days
            </span>
          </div>
        </div>

        {/* Mobile header — the rail/toolbar above render lg: and up only. */}
        <div className="lg:hidden" style={{ padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 0' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: SURFACE_TOKENS.textTertiary }}>Admin console</p>
          <div className="mt-2 flex items-center gap-2">
            <h1 style={{ fontSize: 'clamp(25px,3.4vw,38px)', lineHeight: 1, fontWeight: 700, color: SURFACE_TOKENS.textPrimary, letterSpacing: '-.05em' }}>
              Audit log
            </h1>
            <span className="inline-flex h-6 items-center whitespace-nowrap rounded-full bg-muted px-2.5 text-[11px] font-bold text-warm-prose">
              Append only
            </span>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admin, action or teacher"
              aria-label="Search admin, action or teacher"
              className="h-11 w-full rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none tap-44 focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>
        </div>

        <main className="flex-1 w-full lg:mx-auto lg:w-full lg:max-w-[1100px]" style={{ padding: 'clamp(16px,3vw,28px)' }}>
          {/* Stat row — real counts only. A zero here is honest; a fabricated
              count would not be (docs/REDESIGN_STATUS.md). */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <StatCard label="Actions this week" value={stats.total} caption={typeof stats.admins === 'number' ? `across ${stats.admins} admin${stats.admins === 1 ? '' : 's'}` : undefined} />
            <StatCard label="Approvals" value={stats.approvals} caption="written with name and time" />
            <StatCard label="Rejections" value={stats.rejections} caption="always carry a reason" />
            <StatCard label="Takedowns" value={stats.takedowns} caption="acted within the week" />
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[68px] rounded-2xl bg-warm-band motion-safe:animate-shimmer" />
                ))}
              </div>
            ) : errored ? (
              <div className="rounded-[20px] bg-card p-8 text-center shadow-border">
                <p className="text-body text-foreground">We could not load the audit log just now.</p>
                <button
                  type="button"
                  onClick={fetchLog}
                  className="tap-44 mt-4 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-bold text-background"
                >
                  Retry
                </button>
              </div>
            ) : tableRows.length === 0 ? (
              <div className="rounded-[20px] bg-card p-8 text-center shadow-border">
                <p className="text-body text-foreground">
                  {search
                    ? 'Nothing here matches that search.'
                    : 'Nothing logged yet. Approvals, rejections and takedowns will appear here as soon as an admin acts.'}
                </p>
              </div>
            ) : (
              <AdminTable columns={COLUMNS} rows={tableRows} />
            )}
          </div>

          <p className="mt-5 max-w-prose text-[13px] leading-[1.5] text-warm-label">
            Approvals, rejections and takedowns are written to the audit log with your name and the exact time. Rejections
            always carry a reason the teacher can read.
          </p>
        </main>

        <PreFooter variant="B4" />
        <Footer />
      </div>
    </div>
  );
}

function StatCard({ label, value, caption }: { label: string; value: number | null; caption?: string }) {
  return (
    <div className="rounded-[18px] bg-card p-4 shadow-border">
      <div className="text-[11px] font-bold uppercase tracking-[.07em] text-warm-label">{label}</div>
      <div className="mt-1.5 font-display text-[26px] font-extrabold tracking-[-0.02em] text-foreground">
        {value === null ? '—' : value}
      </div>
      {caption ? <div className="mt-0.5 text-[12.5px] text-warm-label">{caption}</div> : null}
    </div>
  );
}
