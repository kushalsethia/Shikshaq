import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { useConfirm } from '@/components/ui/use-confirm';
import { Search, Star } from 'lucide-react';

/* Site NPS/star-rating feedback (the `feedback` table). Deliberately kept
   separate from admin/reviews.tsx: that page's own header comment says so
   explicitly -- feedback has no teacher column and no publish/convert
   action, so it doesn't fit that page's card-queue merge of teacher-review-
   adjacent sources. Table view (audit.tsx's shape), not a queue: this is
   browsable history a moderator scans and occasionally deletes, not a
   pending-work queue to clear to zero.

   RLS on `feedback` already does the gating (see pg_policies: "Admins can
   view all feedback" / "Admins can delete feedback", both keyed off
   is_admin()), so this reads and deletes the table directly -- no new RPC
   needed, matching the same pattern admin/audit.tsx uses for
   admin_audit_log. */

interface FeedbackRow {
  id: string;
  user_id: string | null;
  rating: number | null;
  comment: string | null;
  is_guest: boolean;
  guest_email: string | null;
  created_at: string;
}

export default function AdminFeedback() {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'Signed-in admin';
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { confirm, confirmDialog } = useConfirm();

  const { isAdmin, checkingAdmin, error: adminGuardError, retry: retryAdminGuard } = useAdminGuard(user, {
    onGranted: fetchFeedback,
    redirectOnDenied: true,
  });
  const sectionCounts = useAdminSectionCounts();

  async function fetchFeedback() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, rating, comment, is_guest, guest_email, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching feedback:', error);
        sonnerToast.error('Failed to load feedback');
        return;
      }
      setRows((data || []) as FeedbackRow[]);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (row: FeedbackRow) => {
    const ok = await confirm({
      title: 'Delete this feedback?',
      description: 'This cannot be undone.',
      confirmLabel: 'Delete feedback',
    });
    if (!ok) return;

    try {
      const { error } = await supabase.from('feedback').delete().eq('id', row.id);
      if (error) {
        if (import.meta.env.DEV) console.error('Error deleting feedback:', error);
        sonnerToast.error('Failed to delete feedback');
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      sonnerToast.success('Feedback deleted');
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'delete',
          targetType: 'feedback',
          targetId: row.id,
          targetLabel: row.guest_email || (row.is_guest ? 'guest feedback' : 'feedback'),
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to delete feedback');
    }
  };

  const nav = buildAdminNav('feedback', { approvals: sectionCounts.approvals, reviews: sectionCounts.reviews });

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
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
          r.comment?.toLowerCase().includes(query) ||
          r.guest_email?.toLowerCase().includes(query)
      )
    : rows;

  const columns: AdminTableColumn[] = [
    { key: 'when', label: 'When', width: '1fr' },
    { key: 'from', label: 'From', width: '1.4fr' },
    { key: 'rating', label: 'Rating', width: '0.8fr' },
    { key: 'comment', label: 'Comment', width: '2.6fr' },
  ];

  const tableRows: AdminTableRow[] = filteredRows.map((r) => ({
    id: r.id,
    cells: [
      <span key="when" className="font-normal text-warm-meta">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>,
      r.is_guest ? (r.guest_email || 'Guest') : 'Signed-in user',
      r.rating != null ? (
        <span key="rating" className="inline-flex items-center gap-1 font-bold text-foreground">
          {r.rating}
          <Star className="h-3.5 w-3.5 fill-current text-brand" aria-hidden />
        </span>
      ) : (
        '—'
      ),
      <span key="comment" className="line-clamp-2 text-warm-prose">{r.comment || '—'}</span>,
    ],
    actions: [{ label: 'Delete', tone: 'destructive', onClick: () => handleDelete(r) }],
  }));

  const searchSlot = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by comment or email..."
        aria-label="Search feedback"
        className="h-11 w-[280px] rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
      />
    </div>
  );

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Feedback" meta={`most recent · ${rows.length} entries`} />

        <div className="mb-4 flex flex-wrap items-center gap-2 px-[18px]">{searchSlot}</div>

        {filteredRows.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="text-sm text-warm-label">
              {query ? `No feedback matches "${searchQuery.trim()}".` : 'No feedback submitted yet.'}
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
          <AdminTable columns={columns} rows={tableRows} />
        )}
      </BentoPanel>

      <AdminAuditNote />
      {confirmDialog}
    </BentoStack>
  );
}
