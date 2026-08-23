import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminRail, AdminToolbar, type AdminNavItem } from '@/pages/admin/shell';
import { AdminTable, type AdminTableColumn, type AdminTableRow, type AdminPillTone } from '@/pages/admin/AdminTable';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { Search } from 'lucide-react';

/* Redesign S7/A5 (pages.md §15) — "Audit log". No legacy page to port from
   (grepped the repo — nothing else reads admin_audit_log). Read-only,
   append-only, no delete: RLS on admin_audit_log grants `authenticated`
   only SELECT + INSERT (see supabase/migrations/20260818000000_admin_audit_log.sql
   and src/lib/audit.ts's own doc comment). AdminTable's new `readOnly` prop
   hides the action column entirely so this page can't offer one. */

interface AuditRow {
  id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_label: string;
  reason: string | null;
  created_at: string;
}

const ACTION_TONE: Record<string, AdminPillTone> = {
  approve: 'ok',
  publish: 'ok',
  reject: 'bad',
  delete: 'bad',
  takedown: 'bad',
  unpublish: 'idle',
  hold: 'wait',
  sent_back: 'wait',
  edit: 'info',
  resolve: 'info',
};

export default function AdminAuditLog() {
  const { user, profile } = useAuth();
  const signedInName = profile?.full_name || user?.email || 'Signed-in admin';
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { isAdmin, checkingAdmin, error: adminGuardError, retry: retryAdminGuard } = useAdminGuard(user, {
    onGranted: fetchLog,
    redirectOnDenied: true,
  });
  const sectionCounts = useAdminSectionCounts();

  useEffect(() => {
    if (!checkingAdmin) setLoading(false);
  }, [checkingAdmin]);

  async function fetchLog() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching audit log:', error);
        sonnerToast.error('Failed to load the audit log');
        return;
      }
      setRows((data || []) as AuditRow[]);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to load the audit log');
    } finally {
      setLoading(false);
    }
  }

  const nav: AdminNavItem[] = [
    { key: 'approvals', label: 'Approvals', path: '/admin/approvals', count: sectionCounts.approvals, active: false },
    { key: 'teachers', label: 'Live teachers', path: '/admin/teachers', count: sectionCounts.teachers, active: false },
    { key: 'papers', label: 'Papers', path: '/admin/papers', count: sectionCounts.papers, active: false },
    { key: 'reviews', label: 'Reviews & recs', path: '/admin/reviews', count: sectionCounts.reviews, active: false },
    { key: 'audit', label: 'Audit log', path: '/admin/audit', active: true },
  ];

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminRail nav={nav} signedInName={signedInName} />
        <div className="flex min-h-screen flex-col lg:pl-[244px]">
          <AdminToolbar title="Audit log" />
          <main className="flex-1 p-7">
            <div className="animate-pulse space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (adminGuardError) return <AdminGuardErrorState onRetry={retryAdminGuard} />;

  if (!isAdmin) return null;

  const query = searchQuery.trim().toLowerCase();
  const filteredRows = query
    ? rows.filter(
        (r) =>
          r.actor_name?.toLowerCase().includes(query) ||
          r.action?.toLowerCase().includes(query) ||
          r.target_type?.toLowerCase().includes(query) ||
          r.target_label?.toLowerCase().includes(query) ||
          r.reason?.toLowerCase().includes(query)
      )
    : rows;

  const columns: AdminTableColumn[] = [
    { key: 'when', label: 'When', width: '1.2fr' },
    { key: 'admin', label: 'Admin', width: '1.4fr' },
    { key: 'action', label: 'Action', width: '1fr' },
    { key: 'entity', label: 'Entity', width: '1.6fr' },
    { key: 'reason', label: 'Reason', width: '2fr' },
  ];

  const tableRows: AdminTableRow[] = filteredRows.map((r) => ({
    id: r.id,
    title: formatDistanceToNow(new Date(r.created_at), { addSuffix: true }),
    subtitle: new Date(r.created_at).toLocaleString(),
    cells: [
      r.actor_name,
      r.action,
      `${r.target_type} · ${r.target_label}`,
      r.reason || '-',
    ],
    tone: ACTION_TONE[r.action] ?? 'idle',
    tag: r.action,
    actionLabel: '',
    onAction: () => {},
  }));

  const searchSlot = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by admin, action, or entity..."
        aria-label="Search audit log"
        className="h-11 w-[280px] rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminRail nav={nav} signedInName={signedInName} />

      <div className="flex min-h-screen flex-col lg:pl-[244px]">
        <AdminToolbar title="Audit log" search={searchSlot} />

        <main className="flex-1 p-5 lg:p-7">
          <div className="mb-4 lg:hidden">
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-foreground">Audit log</h1>
            <p className="mt-1 text-sm text-warm-label">Every approve, reject, edit and takedown, in order. Read-only.</p>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the log..."
                className="h-11 w-full rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none"
              />
            </div>
          </div>

          {filteredRows.length === 0 ? (
            <div className="rounded-[20px] bg-card p-12 text-center shadow-border">
              <p className="text-sm text-warm-label">
                {query ? `No log entries match "${searchQuery.trim()}".` : 'No actions recorded yet.'}
              </p>
              {query ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm font-semibold text-brand underline-offset-2 hover:underline"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          ) : (
            <AdminTable columns={columns} rows={tableRows} readOnly />
          )}

          <p className="mt-5 max-w-prose text-[13px] leading-[1.5] text-warm-label">
            This log is append-only. Nobody, including admins, can edit or delete an entry.
          </p>
        </main>
      </div>
    </div>
  );
}
