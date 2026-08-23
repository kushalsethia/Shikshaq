import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { AdminConsole, useAdminGuard } from '@/components/AdminConsole';
import { AdminTable, type AdminTableColumn, type AdminTableRow, type AdminStatusTone } from '@/pages/admin/AdminTable';
import { SURFACE_TOKENS } from '@/utils/searchFacets';

/* Redesign 09i (changelog/09-...-Admin.md, AD-008) — read-only, no actions
   column. Reads public.admin_audit_log (see
   supabase/migrations/20260818000000_admin_audit_log.sql). The table is
   written to by src/lib/audit.ts from every other admin mutation. Now
   routes through the shared `AdminConsole` shell (AD-002) instead of
   duplicating the rail/toolbar/footer markup this file used to carry on
   its own — same guard, same header, same "no eyes panel, no footer, no
   bottom nav" as every other /admin route (AD-001). */

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

// AD-008: "Result is the AD-004 status pill." An audit row has no status of
// its own — this maps the real, already-stored `action` verb to the state
// it left the target in, using the same tone vocabulary AdminStatePill
// renders everywhere else.
const ACTION_RESULT: Record<string, { tag: string; tone: AdminStatusTone }> = {
  approve: { tag: 'Live', tone: 'live' },
  publish: { tag: 'Live', tone: 'live' },
  resolve: { tag: 'Resolved', tone: 'live' },
  sent_back: { tag: 'Sent back', tone: 'paused' },
  reject: { tag: 'Rejected', tone: 'hidden' },
  takedown: { tag: 'Unpublished', tone: 'hidden' },
  delete: { tag: 'Deleted', tone: 'hidden' },
  hold: { tag: 'Held', tone: 'pending' },
  edit: { tag: 'Edited', tone: 'info' },
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

// AD-008 order: When · Who · Action · Target · Result. "When" is the row's
// own first column (AdminTable always renders that one unconditionally);
// these three are the plain `cells`, then AdminTable appends Result as the
// status pill and (empty, since this screen has none) actions.
const COLUMNS: AdminTableColumn[] = [
  { key: 'when', label: 'When' },
  { key: 'who', label: 'Who' },
  { key: 'action', label: 'Action' },
  { key: 'target', label: 'Target' },
];

export default function AdminAuditLog() {
  const { user } = useAuth();
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

  const tableRows: AdminTableRow[] = filteredRows.map((r) => {
    const result = ACTION_RESULT[r.action] || { tag: r.action, tone: 'paused' as AdminStatusTone };
    return {
      id: r.id,
      title: formatWhen(r.created_at),
      titleTone: 'muted',
      cells: [
        r.actor_name,
        <span key="action" className="font-bold text-foreground">{actionTitle(r)}</span>,
        `${r.target_label}${r.target_type ? ` · ${r.target_type.replace('_', ' ')}` : ''}`,
      ],
      tone: result.tone,
      tag: result.tag,
      // AD-008: read-only, no actions column. Nothing here mutates anything.
      actions: [],
    };
  });

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

  const searchSlot = (
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
  );

  // The mockup's literal header meta reads "last 30 days · {n} entries", but
  // this screen's real queries don't match that window (the log fetch is
  // "most recent 100 rows", the stat cards below are a real 7-day window) —
  // claiming "30 days" would not be true of what is actually being shown,
  // so the count is described honestly instead of copying the mockup's
  // literal string onto a different query shape.
  const entriesMeta = errored ? undefined : `most recent ${rows.length} ${rows.length === 1 ? 'entry' : 'entries'}`;

  return (
    <AdminConsole
      activeTab="audit"
      title="Audit log"
      subtitle="Every approve, reject and takedown, written with the acting account and a timestamp. Append only — nothing here can be edited or deleted."
      search={searchSlot}
    >
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Actions this week" value={stats.total} caption={typeof stats.admins === 'number' ? `across ${stats.admins} admin${stats.admins === 1 ? '' : 's'}` : undefined} />
        <StatCard label="Approvals" value={stats.approvals} caption="written with name and time" />
        <StatCard label="Rejections" value={stats.rejections} caption="always carry a reason" />
        <StatCard label="Takedowns" value={stats.takedowns} caption="acted within the week" />
      </div>

      {entriesMeta ? (
        <p className="mb-2 text-[12.5px] text-warm-meta" style={{ fontVariantNumeric: 'tabular-nums' }}>{entriesMeta}</p>
      ) : null}

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
    </AdminConsole>
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
