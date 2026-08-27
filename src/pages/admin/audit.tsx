import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow, type AdminStatus } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { Search } from 'lucide-react';

/* Handoff 09i AD-008 — "Audit". No legacy page to port from (grepped the
   repo — nothing else reads admin_audit_log). Read-only, append-only, no
   delete: RLS on admin_audit_log grants `authenticated` only SELECT +
   INSERT (see supabase/migrations/20260818000000_admin_audit_log.sql and
   src/lib/audit.ts's own doc comment). AdminTable's `readOnly` prop hides
   the action column entirely so this page can't offer one. */

interface AuditRow {
  id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_label: string;
  reason: string | null;
  created_at: string;
}

/* AD-008: When · Who · Action · Target · Result, with Action a plain bold
   verb phrase and Result the AD-004 status pill. The audit_log table has
   no separate "resulting status" column (it's an append-only record of the
   action taken, not a live snapshot of the target's current state) — both
   are derived here from the same `action`/`target_type` the row already
   carries, keyed on the exact action/targetType strings every
   recordAdminAction() call site in this codebase actually uses. Anything
   not in the map falls back to an honest, unstyled phrase rather than a
   guessed one. */
const ACTION_META: Record<string, { verb: string; result: string; status: AdminStatus }> = {
  'approve:teacher_application': { verb: 'Approved teacher', result: 'Live', status: 'live' },
  'reject:teacher_application': { verb: 'Rejected application', result: 'Rejected', status: 'hidden' },
  'edit:teacher': { verb: 'Edited teacher', result: 'Updated', status: 'paused' },
  'unlist:teacher': { verb: 'Paused teacher', result: 'Paused', status: 'paused' },
  'relist:teacher': { verb: 'Unpaused teacher', result: 'Live', status: 'live' },
  'publish:paper': { verb: 'Published paper', result: 'Live', status: 'live' },
  'takedown:paper': { verb: 'Took down paper', result: 'Hidden', status: 'hidden' },
  'approve:comment': { verb: 'Published review', result: 'Live', status: 'live' },
  'delete:comment': { verb: 'Removed review', result: 'Removed', status: 'hidden' },
  'edit:recommendation': { verb: 'Updated recommendation', result: 'Updated', status: 'paused' },
  'reject:recommendation': { verb: 'Dismissed recommendation', result: 'Dismissed', status: 'hidden' },
  'delete:upvotes': { verb: 'Cleared upvotes', result: 'Cleared', status: 'paused' },
};

function describeAction(row: AuditRow): { verb: string; result: string; status: AdminStatus } {
  const known = ACTION_META[`${row.action}:${row.target_type}`];
  if (known) return known;
  const verb = `${row.action.charAt(0).toUpperCase()}${row.action.slice(1)} ${row.target_type.replace(/_/g, ' ')}`.trim();
  return { verb, result: 'Recorded', status: 'paused' };
}

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

  const nav = buildAdminNav('audit', { approvals: sectionCounts.approvals, reviews: sectionCounts.reviews });

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="animate-pulse space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
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

  // AD-008 columns: When · Who · Action · Target · Result — read-only, no actions column.
  const columns: AdminTableColumn[] = [
    { key: 'when', label: 'When', width: '1.1fr' },
    { key: 'who', label: 'Who', width: '1.4fr' },
    { key: 'action', label: 'Action', width: '1.3fr' },
    { key: 'target', label: 'Target', width: '1.6fr' },
    { key: 'result', label: 'Result', width: '1fr' },
  ];

  const tableRows: AdminTableRow[] = filteredRows.map((r) => {
    const { verb, result, status } = describeAction(r);
    return {
      id: r.id,
      cells: [
        // AD-008: "When" is relative time in the muted meta colour, NOT bold — overrides
        // AdminTable's default bold-first-column treatment (right for every other section,
        // where column 1 is the record's name; wrong here, where "Action" carries the weight).
        <span key="when" className="font-normal text-warm-meta">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>,
        r.actor_name,
        <span key="action" className="font-bold text-foreground">{verb}</span>,
        r.target_label || r.target_type,
        <AdminStatusPill key="result" status={status} label={result} />,
      ],
    };
  });

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
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        {/* AD-008's mockup meta reads "last 30 days · {n} entries" — the real query has no
            30-day window (it's `order by created_at desc limit 500`), so the honest framing
            here is "most recent · {n} entries" rather than a date-range claim the query
            doesn't actually enforce. */}
        <AdminPanelHeader title="Audit log" meta={`most recent · ${rows.length} entries`} />

        <div className="mb-4 flex flex-wrap items-center gap-2 px-[18px]">{searchSlot}</div>

        {filteredRows.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
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

        <p className="mt-4 px-[18px] text-[13px] leading-[1.5] text-warm-label">
          This log is append-only. Nobody, including admins, can edit or delete an entry. Nothing on this screen mutates anything.
        </p>
      </BentoPanel>

      <AdminAuditNote />
    </BentoStack>
  );
}
