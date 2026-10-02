import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useBusyActions } from '@/lib/busy-guard';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState, adminToast, adminPrimaryBtnStyle, adminSecondaryBtnStyle, AdminStatTiles } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePaperReviewChannel, useLiveRefresh } from '@/hooks/usePaperReviewChannel';
import { formatOnlineNames } from '@/lib/paper-review-realtime';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { AdminPageIntro, InfoTip } from '@/components/admin/AdminHelp';
import { TIPS } from '@/lib/admin-hints';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyLibrary = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminLibraryDummy')) : null;
import {
  adminPaperQueue,
  adminLibraryExtras,
  adminHideBankPaper,
  adminRestoreBankPaper,
  adminPaperHistory,
  adminUndoRevision,
  type PaperQueueRow,
  type RevisionRow,
} from '@/lib/checker-api';
import { PAGE_SIZE, leftToCheck, sortForReview } from '@/lib/paper-review-filter';
import {
  LIBRARY_VIEWS,
  hiddenWhy,
  viewCounts,
  viewRows,
  withExtras,
  type LibraryExtra,
  type LibraryRow,
  type LibraryView,
} from '@/lib/library-views';

/* /admin/library: every paper in the question bank (bank_papers), live or
   hidden. It used to be "Paper review" and also held the checkers list and
   the escalations; those now live where their names say (Checkers, Admin
   queue), so each job has one home. Edit any paper or question, hide with a
   reason, restore, and read each paper's history with undo.

   admin/papers.tsx (Student uploads) is the separate, older surface for the
   `papers` table. */

/** The pieces of the Library the page needs, as one object so the dummy mode
 *  can run the real page against made-up papers. */
export interface LibraryApi {
  papers(): Promise<PaperQueueRow[]>;
  extras(): Promise<LibraryExtra[] | null>;
  hide(paperId: string, reason: string): Promise<void>;
  restore(paperId: string): Promise<void>;
  history(paperId: string): Promise<RevisionRow[]>;
  undo(revisionId: number): Promise<void>;
}

export const realLibraryApi: LibraryApi = {
  papers: adminPaperQueue,
  extras: adminLibraryExtras,
  hide: adminHideBankPaper,
  restore: adminRestoreBankPaper,
  history: adminPaperHistory,
  undo: (id) => adminUndoRevision(id),
};

// The revision actions admin_undo_revision() can reverse; every other
// action (merge/split/reorder/add/undo, live_apply/live_clear) it refuses.
const UNDOABLE_ACTIONS = new Set(['admin_edit', 'admin_delete', 'admin_hide', 'admin_restore']);

export function AdminLibraryPage({
  api = realLibraryApi,
  dummy = false,
  banner,
}: {
  api?: LibraryApi;
  dummy?: boolean;
  banner?: ReactNode;
}) {
  usePageMeta('Library | Shikshaq Admin', 'Every past paper: find one, fix it, hide it or bring it back.');
  const { user, profile } = useAuth();
  const actorName = dummy ? 'admin@example.com' : profile?.full_name || user?.email || 'an admin';
  const guard = useAdminGuard(dummy ? null : user, { redirectOnDenied: !dummy });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const sectionCounts = useAdminSectionCounts();

  const [view, setView] = useState<LibraryView>('needs_review');

  // The two reads run side by side and are cached: coming back to the Library
  // from another tab shows the list at once and refreshes it quietly. The
  // extras are optional, so a failure there never blocks the list.
  const papersQ = useQuery({
    queryKey: ['admin', 'library', 'papers', dummy],
    queryFn: () => api.papers(),
    enabled: isAdmin,
    staleTime: 60_000,
  });
  const extrasQ = useQuery({
    queryKey: ['admin', 'library', 'extras', dummy],
    queryFn: () => api.extras(),
    enabled: isAdmin,
    staleTime: 60_000,
  });
  const papersLoading = papersQ.isLoading;
  const extrasKnown = extrasQ.data != null;
  const rows: LibraryRow[] = useMemo(() => withExtras(papersQ.data ?? [], extrasQ.data ?? null), [papersQ.data, extrasQ.data]);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ['admin', 'library'] });
  };

  const [historyTarget, setHistoryTarget] = useState<LibraryRow | null>(null);
  const [history, setHistory] = useState<RevisionRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [hideTarget, setHideTarget] = useState<LibraryRow | null>(null);
  const [hideReason, setHideReason] = useState('');
  // One write per row at a time: undo, hide, restore.
  const { run: runBusy, busy } = useBusyActions();

  // Realtime: when anyone checks, fixes or edits, refetch a few seconds
  // later, quietly, and show who is online. Does nothing if it cannot connect.
  const refreshLive = useLiveRefresh(refresh);
  const { status: liveStatus, online } = usePaperReviewChannel({
    enabled: !!isAdmin && !dummy,
    userId: user?.id,
    fullName: profile?.full_name,
    onActivity: refreshLive,
  });
  const othersOnline = online.filter((p) => p.userId !== user?.id);

  const counts = useMemo(() => viewCounts(rows), [rows]);
  const filtered = useMemo(() => sortForReview(viewRows(rows, view)) as LibraryRow[], [rows, view]);

  const [shown, setShown] = useState(PAGE_SIZE);
  useEffect(() => setShown(PAGE_SIZE), [view]);
  const visible = filtered.slice(0, shown);

  async function openHistory(p: LibraryRow) {
    setHistoryTarget(p);
    setHistoryLoading(true);
    try {
      setHistory(await api.history(p.paper_id));
    } catch {
      adminToast('Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }

  async function doUndo(revisionId: number) {
    await runBusy(`undo:${revisionId}`, async () => {
      try {
        await api.undo(revisionId);
        adminToast('Reverted');
        if (historyTarget) void openHistory(historyTarget);
        refresh();
      } catch (e) {
        const msg = (e as { message?: string } | null)?.message;
        adminToast('Could not undo that revision', msg ? { description: msg } : undefined);
      }
    });
  }

  async function confirmHide() {
    if (!hideTarget) return;
    const reason = hideReason.trim();
    if (!reason) {
      adminToast('A reason is required to hide a paper');
      return;
    }
    const paperId = hideTarget.paper_id;
    await runBusy(`paper:${paperId}`, async () => {
      try {
        await api.hide(paperId, reason);
        adminToast('Paper hidden');
        setHideTarget(null);
        setHideReason('');
        refresh();
      } catch {
        adminToast('Failed to hide the paper');
      }
    });
  }

  async function doRestore(p: LibraryRow) {
    await runBusy(`paper:${p.paper_id}`, async () => {
      try {
        await api.restore(p.paper_id);
        adminToast('Paper restored');
        refresh();
      } catch {
        adminToast('Failed to restore the paper');
      }
    });
  }

  const nav = buildAdminNav('library', sectionCounts);
  const signedIn = user?.email ?? actorName;

  if (checkingAdmin) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={signedIn} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
      </BentoStack>
    );
  }

  if (!dummy && guard.error) return <AdminGuardErrorState onRetry={guard.retry} />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="max-w-[380px] rounded-bento bg-card p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-foreground">Access denied</h1>
          <p className="text-sm text-warm-secondary">You need to be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  const showWhy = view === 'hidden' || view === 'all';
  const columns: AdminTableColumn[] = [
    { key: 'school', label: 'School', width: '1.6fr', hint: TIPS['col.school'] },
    { key: 'subject', label: 'Subject', width: '1fr', hint: TIPS['col.subject'] },
    { key: 'cls', label: 'Class', width: '0.6fr', hint: TIPS['col.class'] },
    { key: 'year', label: 'Year', width: '0.6fr', hint: TIPS['col.year'] },
    { key: 'progress', label: 'Progress', width: '0.9fr', hint: TIPS['col.progress'] },
    { key: 'left', label: 'To check', width: '0.7fr', hint: TIPS['col.to_check'] },
    { key: 'status', label: 'Status', width: '0.9fr', hint: TIPS['col.status'] },
    ...(showWhy ? [{ key: 'why', label: 'Why hidden', width: '1.8fr', hint: TIPS['col.why_hidden'] }] : []),
  ];

  const tableRows: AdminTableRow[] = visible.map((p) => ({
    id: p.paper_id,
    cells: [
      p.school,
      p.subject,
      p.cls,
      p.year,
      p.total_questions > 0 ? `${p.passed_questions}/${p.total_questions}` : '-',
      p.total_questions > 0 ? String(leftToCheck(p)) : '-',
      <AdminStatusPill
        key="status"
        status={!p.is_published ? 'hidden' : p.needs_review ? 'pending' : 'live'}
        label={!p.is_published ? 'Hidden' : p.needs_review ? 'Needs review' : 'Live'}
      />,
      ...(showWhy ? [<span key="why" className="whitespace-normal">{hiddenWhy(p, extrasKnown) || '-'}</span>] : []),
    ],
    actions: [
      { label: 'History', tone: 'primary', onClick: () => void openHistory(p) },
      { label: 'Edit', tone: 'primary', onClick: () => navigate(`/admin/library/${encodeURIComponent(p.paper_id)}`) },
      p.is_published
        ? { label: busy(`paper:${p.paper_id}`) ? '...' : 'Hide', tone: 'destructive', onClick: () => setHideTarget(p), disabled: busy(`paper:${p.paper_id}`) }
        : { label: busy(`paper:${p.paper_id}`) ? '...' : 'Restore', tone: 'mint', onClick: () => void doRestore(p), disabled: busy(`paper:${p.paper_id}`) },
    ],
  }));

  const tiles = LIBRARY_VIEWS.filter((v) => v.key !== 'all' && v.key !== 'incomplete').map((v) => ({
    label: v.label,
    hint: TIPS[v.tip],
    value: papersLoading && rows.length === 0 ? '...' : v.needsExtras && !extrasKnown ? '?' : counts[v.key],
  }));

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={signedIn} />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-3 px-[18px]">
          <AdminPageIntro page="library" />
        </div>
        <AdminPanelHeader title="Library" meta={`${counts.needs_review} need review, ${counts.hidden} hidden`} />

        {liveStatus === 'live' ? (
          <p className="mb-4 flex items-center gap-2 px-[18px] text-[13px] text-warm-secondary" aria-live="polite">
            <span className="h-2 w-2 shrink-0 rounded-full bg-mint" aria-hidden />
            {othersOnline.length > 0 ? (
              <span><span className="font-semibold text-foreground">Online now:</span> {formatOnlineNames(othersOnline)}</span>
            ) : (
              <span>No one else is checking right now. This page updates as people work.</span>
            )}
          </p>
        ) : null}

        <div className="mb-4 px-[18px]">
          <AdminStatTiles stats={tiles} />
        </div>
        <div role="group" aria-label="Show papers" className="mb-2 flex flex-wrap gap-2 px-[18px]">
          {LIBRARY_VIEWS.map((v) => (
            <span key={v.key} className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-pressed={view === v.key}
                onClick={() => setView(v.key)}
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 active:scale-[0.96]',
                  view === v.key ? 'bg-panel text-background' : 'bg-muted text-warm-secondary hover:text-foreground',
                )}
              >
                {v.label}
                <span className="tabular-nums opacity-70">{v.needsExtras && !extrasKnown ? '?' : counts[v.key]}</span>
              </button>
            </span>
          ))}
        </div>
        <p className="mb-3 flex items-start gap-1.5 px-[18px] text-[13px] text-warm-meta">
          <InfoTip tip={LIBRARY_VIEWS.find((v) => v.key === view)?.tip} label="this view" className="mt-0.5" />
          <span>{TIPS[LIBRARY_VIEWS.find((v) => v.key === view)?.tip ?? 'view.all']}</span>
        </p>
        {!extrasKnown && !extrasQ.isLoading ? (
          <p className="mb-3 px-[18px] text-[13px] text-warm-secondary" role="status">
            With students, With an admin, Ready to go live and the reason a paper was hidden need a database update that has not been applied yet. They show a question mark until it is.
          </p>
        ) : null}
        {!papersLoading && filtered.length > 0 ? (
          <p className="mb-3 px-[18px] text-[13px] text-warm-meta" aria-live="polite">
            Showing {Math.min(shown, filtered.length)} of {filtered.length}
          </p>
        ) : null}
        {papersLoading ? (
          <div className="animate-pulse space-y-3 px-[18px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        ) : papersQ.isError ? (
          <div className="px-[18px]" role="alert">
            <p className="text-sm text-foreground">The papers did not load. Check your internet and try again.</p>
            <button type="button" onClick={refresh} className="tap-44 mt-2 text-sm font-semibold text-brand-blue">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-[18px] py-8 text-center text-[15px] text-warm-meta">No papers match this view.</p>
        ) : (
          <>
            <AdminTable columns={columns} rows={tableRows} />
            {filtered.length > shown ? (
              <div className="mt-4 flex justify-center px-[18px]">
                <button type="button" onClick={() => setShown((n) => n + PAGE_SIZE)} className={adminSecondaryBtnStyle}>
                  Show {Math.min(PAGE_SIZE, filtered.length - shown)} more
                </button>
              </div>
            ) : null}
          </>
        )}
      </BentoPanel>

      <AdminAuditNote />

      {/* Hide dialog: a reason is required and stays on the paper. */}
      <Dialog open={!!hideTarget} onOpenChange={(open) => { if (!open) setHideTarget(null); }}>
        <DialogContent aria-describedby={undefined} className="w-full max-w-md rounded-bento bg-card p-6">
          <DialogTitle className="text-xl font-bold text-foreground">Hide this paper?</DialogTitle>
          <p className="mt-1.5 text-[14px] text-warm-secondary">Readers stop seeing it straight away. Restore brings it back. Your reason is shown on the paper in the Library.</p>
          <Textarea value={hideReason} onChange={(e) => setHideReason(e.target.value)} placeholder="Reason" rows={3} className="mt-3" autoFocus />
          <div className="mt-4 flex gap-2">
            <button onClick={confirmHide} disabled={!hideReason.trim() || (!!hideTarget && busy(`paper:${hideTarget.paper_id}`))} className={cn('disabled:opacity-60', adminPrimaryBtnStyle)}>Hide</button>
            <button onClick={() => setHideTarget(null)} className={adminSecondaryBtnStyle}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History dialog: full change log, undo per revision. */}
      <Dialog open={!!historyTarget} onOpenChange={(open) => { if (!open) setHistoryTarget(null); }}>
        <DialogContent aria-describedby={undefined} className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-bento bg-card p-6">
          <DialogTitle className="text-xl font-bold text-foreground">History: {historyTarget?.school}</DialogTitle>
          {historyLoading ? (
            <p className="mt-4 text-[14px] text-warm-secondary">Loading...</p>
          ) : history.length === 0 ? (
            <p className="mt-4 text-[14px] text-warm-secondary">No changes recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {history.map((r) => (
                <li key={r.id} className="rounded-xl bg-muted p-3 text-[13px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">
                      {r.action}{r.field ? ` - ${r.field}` : ''}
                    </span>
                    <span className="text-warm-meta">{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-warm-secondary">by {r.actor} ({r.source})</div>
                  {r.reason ? <div className="mt-1 text-foreground">Reason: {r.reason}</div> : null}
                  {UNDOABLE_ACTIONS.has(r.action) && (
                    <button onClick={() => void doUndo(r.id)} disabled={busy(`undo:${r.id}`)} className="mt-2 rounded-full bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground disabled:opacity-60">
                      {busy(`undo:${r.id}`) ? 'Undoing...' : 'Undo'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </BentoStack>
  );
}

export default function AdminLibrary() {
  if (DummyLibrary && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyLibrary />
      </Suspense>
    );
  }
  return <AdminLibraryPage />;
}
