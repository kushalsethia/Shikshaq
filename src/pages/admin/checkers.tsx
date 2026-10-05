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
import { Search, UserPlus } from 'lucide-react';
import { realCheckerAdminApi, type CheckerAdminApi, type CheckerAdminRow } from '@/lib/checker-admin-api';
import type { UserSearchRow } from '@/lib/checker-api';
import { AdminPageIntro, InfoTip } from '@/components/admin/AdminHelp';
import { AddStudentGuide } from '@/components/admin/AddStudentGuide';
import { TIPS } from '@/lib/admin-hints';
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
   ever need either.

   One place to add a checker (owner, 2026-10-02: the same job lived on two
   pages and only one could search). Type a name or an email, pick the person,
   press Add. The old Paper review checkers tab is gone. */

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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
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

  // Search by name or email as the admin types (two letters or more).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(() => {
      api
        .searchUsers(q)
        .then((r) => {
          if (!cancelled) setResults(r);
        })
        .catch(() => {
          if (!cancelled) setAddError('The search did not work. Try again.');
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, api]);

  async function handleAdd(email: string, key: string) {
    const trimmed = email.trim();
    if (!looksLikeEmail(trimmed)) {
      setAddError('That person has no email on file. Ask them to update their profile.');
      return;
    }
    setAddError(null);
    setAddingId(key);
    try {
      const newUserId = await api.addChecker(trimmed);
      setQuery('');
      setResults([]);
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
          ? 'No Shikshaq account has that email yet. They may not have signed up, or they used a different email.'
          : 'Could not add that checker. Check the email and try again.';
      setAddError(message);
      if (import.meta.env.DEV) console.error('Error adding checker:', error);
    } finally {
      setAddingId(null);
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

  const nav = buildAdminNav('checkers', sectionCounts);

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
    { key: 'email', label: 'Checker', width: '1.6fr', hint: TIPS['col.checker'] },
    { key: 'added', label: 'Added', width: '1fr', hint: TIPS['col.added'] },
    { key: 'today', label: 'Today', width: '0.7fr', hint: TIPS['col.today'] },
    { key: 'total', label: 'Total', width: '0.7fr', hint: TIPS['col.total'] },
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
        <div className="mb-3 px-[18px]">
          <AdminPageIntro page="checkers" />
        </div>
        <AddStudentGuide />
        <AdminPanelHeader title="Paper checkers" meta={`${rows.length} ${rows.length === 1 ? 'checker' : 'checkers'}`} />

        <div className="mb-4 px-[18px]">
          <label className="flex max-w-md flex-col gap-1">
            <span className="flex items-center gap-1 text-[12px] font-semibold text-warm-secondary">
              Find a person to add
              <InfoTip tip="checkers.search" label="the search" />
            </span>
            <span className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setAddError(null);
                }}
                placeholder="Search by name or email"
                aria-label="Search by name or email to add a checker"
                className="h-11 w-full rounded-full bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
              />
            </span>
          </label>
          {query.trim().length >= 2 ? (
            <ul className="mt-2 max-w-md space-y-1.5" aria-label="People found">
              {searching ? (
                <li className="text-[13px] text-warm-meta">Searching...</li>
              ) : results.length === 0 ? (
                <li className="rounded-xl bg-muted px-3 py-2.5 text-[13px] text-warm-secondary">
                  No account matches that.{' '}
                  {looksLikeEmail(query.trim()) ? (
                    <button
                      type="button"
                      onClick={() => void handleAdd(query, 'typed')}
                      disabled={addingId !== null}
                      className="font-bold text-brand-blue disabled:opacity-60"
                    >
                      {addingId === 'typed' ? 'Adding...' : `Try adding ${query.trim()} anyway`}
                    </button>
                  ) : (
                    'Only people who have signed up on Shikshaq can be added.'
                  )}
                </li>
              ) : (
                results.map((u) => {
                  const already = u.is_checker && u.checker_active && rows.some((r) => r.user_id === u.user_id);
                  return (
                    <li key={u.user_id} className="flex items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-foreground">{u.full_name || 'Unnamed account'}</span>
                        <span className="block truncate text-[12px] text-warm-meta">{u.email ?? 'No email on file'}</span>
                      </span>
                      {already ? (
                        <span className="shrink-0 text-[12px] font-semibold text-warm-secondary">Already a checker</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleAdd(u.email ?? '', u.user_id)}
                          disabled={addingId !== null}
                          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-foreground transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                        >
                          <UserPlus className="h-4 w-4" aria-hidden />
                          {addingId === u.user_id ? 'Adding...' : u.is_checker ? 'Turn back on' : 'Add'}
                        </button>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}
        </div>
        {addError ? <p role="alert" className="mb-3 px-[18px] text-[13px] text-destructive">{addError}</p> : null}

        {rows.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="text-sm text-warm-label">No one can check papers yet. Search for someone above and add them.</p>
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
