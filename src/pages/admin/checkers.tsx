import { useEffect, useState, lazy, Suspense, type ReactNode } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { useConfirm } from '@/components/ui/use-confirm';
import { UserPlus } from 'lucide-react';
import { realCheckerAdminApi, type CheckerAdminApi, type CheckerAdminRow } from '@/lib/checker-admin-api';
import { looksLikeEmail } from '@/lib/email-shape';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyAdminCheckers = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminCheckersDummy')) : null;

/* Pipeline-plan Step 2, #7: who can open /checker. Its own admin page
   rather than a section of an existing one because none of the existing
   admin pages hold "which accounts have a permission" -- this is a small
   membership list, closer in shape to Feedback's plain table than to a
   moderation queue. Add-by-email is deliberately the whole flow: no role
   picker, no bulk import, because there is no evidence yet this list will
   ever need either. */

export function AdminCheckersPage({
  api = realCheckerAdminApi,
  dummy = false,
  banner,
}: {
  api?: CheckerAdminApi;
  /** Dummy mode (D75): no sign-in, no real admin check, a fake API. */
  dummy?: boolean;
  banner?: ReactNode;
}) {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'Signed-in admin';
  const [rows, setRows] = useState<CheckerAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const { confirm, confirmDialog } = useConfirm();

  // In dummy mode there is no real signed-in admin to check for, so the
  // guard is asked never to redirect and its verdict is overridden below --
  // same shape Checker.tsx uses for CheckerPage's own `dummy` prop.
  const guard = useAdminGuard(dummy ? null : user, {
    onGranted: fetchCheckers,
    redirectOnDenied: !dummy,
  });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const { error: adminGuardError, retry: retryAdminGuard } = guard;
  useEffect(() => {
    if (dummy) void fetchCheckers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummy]);
  const sectionCounts = useAdminSectionCounts();

  async function fetchCheckers() {
    try {
      setLoading(true);
      const data = await api.listCheckers();
      setRows(data);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching checkers:', error);
      sonnerToast.error('Failed to load the checker list');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const trimmed = email.trim();
    if (!looksLikeEmail(trimmed)) {
      setAddError('Enter a full email address.');
      return;
    }
    if (rows.some((r) => r.email.toLowerCase() === trimmed.toLowerCase())) {
      setAddError('That email is already a checker.');
      return;
    }
    setAddError(null);
    setAdding(true);
    try {
      const newUserId = await api.addChecker(trimmed);
      setEmail('');
      sonnerToast.success(`${trimmed} can now check papers`);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'grant_checker',
          targetType: 'checker',
          targetId: newUserId,
          targetLabel: trimmed,
        });
      }
      await fetchCheckers();
    } catch (error) {
      const message =
        error instanceof Error && /no account|not found/i.test(error.message)
          ? 'No Shikshaq account has that email yet. They need to sign up first.'
          : 'Could not add that checker. Check the email and try again.';
      setAddError(message);
      if (import.meta.env.DEV) console.error('Error adding checker:', error);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(row: CheckerAdminRow) {
    const ok = await confirm({
      title: `Remove ${row.email} as a checker?`,
      description: 'They will no longer be able to open the paper checker. This does not undo any question they already checked.',
      confirmLabel: 'Remove checker',
    });
    if (!ok) return;

    try {
      await api.removeChecker(row.user_id);
      setRows((prev) => prev.filter((r) => r.user_id !== row.user_id));
      sonnerToast.success(`${row.email} removed`);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'revoke_checker',
          targetType: 'checker',
          targetId: row.user_id,
          targetLabel: row.email,
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error removing checker:', error);
      sonnerToast.error('Failed to remove that checker');
    }
  }

  const nav = buildAdminNav('checkers', { approvals: sectionCounts.approvals, reviews: sectionCounts.reviews });

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
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

  const columns: AdminTableColumn[] = [
    { key: 'email', label: 'Checker', width: '1.6fr' },
    { key: 'added', label: 'Added', width: '1fr' },
    { key: 'today', label: 'Today', width: '0.7fr' },
    { key: 'total', label: 'Total', width: '0.7fr' },
  ];

  const tableRows: AdminTableRow[] = rows.map((r) => ({
    id: r.user_id,
    cells: [
      <div key="email" className="min-w-0">
        <p className="truncate font-semibold text-foreground">{r.full_name || r.email}</p>
        {r.full_name ? <p className="truncate text-[12px] text-warm-label">{r.email}</p> : null}
      </div>,
      <span key="added" className="text-warm-meta">{formatDistanceToNow(new Date(r.added_at), { addSuffix: true })}</span>,
      <span key="today" className="font-bold tabular-nums text-foreground">{r.checked_today}</span>,
      <span key="total" className="font-bold tabular-nums text-foreground">{r.checked_total}</span>,
    ],
    actions: [{ label: 'Remove', tone: 'destructive', onClick: () => handleRemove(r) }],
  }));

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Paper checkers" meta={`${rows.length} ${rows.length === 1 ? 'checker' : 'checkers'}`} />

        <div className="mb-4 flex flex-wrap items-end gap-2 px-[18px]">
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-warm-secondary">Add a checker by email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAddError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleAdd();
                }
              }}
              placeholder="name@example.com"
              aria-label="Email to add as a checker"
              aria-invalid={Boolean(addError) || undefined}
              className="h-11 w-[280px] rounded-full bg-muted px-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
            />
          </label>
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={adding || !email.trim()}
            className="flex h-11 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-foreground transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            {adding ? 'Adding...' : 'Add checker'}
          </button>
        </div>
        {addError ? <p role="alert" className="mb-3 px-[18px] text-[13px] text-destructive">{addError}</p> : null}

        {rows.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="text-sm text-warm-label">No one can check papers yet. Add someone above by their email.</p>
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

export default function AdminCheckers() {
  if (DummyAdminCheckers && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyAdminCheckers />
      </Suspense>
    );
  }
  return <AdminCheckersPage />;
}
