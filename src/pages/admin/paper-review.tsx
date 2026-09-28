import { useEffect, useMemo, useState } from 'react';
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
import {
  adminPaperQueue,
  adminEscalationQueue,
  adminListCheckers,
  adminCheckerLog,
  adminGrantPaperChecker,
  adminRevokePaperChecker,
  adminHideBankPaper,
  adminRestoreBankPaper,
  adminEditBankPaper,
  adminPaperHistory,
  adminUndoRevision,
  adminResolveEscalation,
  adminSearchUsers,
  type PaperQueueRow,
  type EscalationRow,
  type CheckerRow,
  type CheckerLogRow,
  type RevisionRow,
  type UserSearchRow,
} from '@/lib/checker-api';

/* Paper admin -- D22. A tab of the existing Shikshaq admin console (not a
   separate app, per D11), covering every capability the owner asked for:
   edit any paper/question field, fix structure, hide/restore with full
   history + undo, and manage checkers. The Papers & Submissions tab
   (admin/papers.tsx) is a different, older surface -- it manages the
   `papers`/`paper_submissions` tables (student uploads); this page manages
   `bank_papers`/`bank_questions` (the library) and the audit_* review
   pipeline that feeds it. Kept separate rather than merged into
   admin/papers.tsx because the data model, RPCs and filters are entirely
   different (needs_review / escalated / AI-approved / incomplete are bank_*
   concepts, published/taken-down is the submissions concept). */

type View = 'papers' | 'checkers' | 'escalations';
type PaperFilter = 'needs_review' | 'escalated' | 'hidden' | 'incomplete' | 'verified' | 'all';

const ACTION_LABELS: Record<string, string> = {
  checker_pass: 'Passed',
  checker_fix: 'Fixed',
  checker_split: 'Split',
  checker_ask_help: 'Asked for help',
  checker_skip: 'Skipped',
  admin_resolve_escalation: 'Resolved escalation',
  admin_grant_checker: 'Switched on a checker',
  admin_revoke_checker: 'Switched off a checker',
};

// Fully verified = live and cleared: published, and needs_review is off.
const isVerified = (p: PaperQueueRow) => p.is_published && !p.needs_review;

// Questions on this paper still waiting for a check. A paper with no audit
// copy yet (total 0) has nothing countable and sorts after every paper that
// does.
const leftToCheck = (p: PaperQueueRow) =>
  p.total_questions > 0 ? Math.max(p.total_questions - p.passed_questions, 0) : Number.POSITIVE_INFINITY;

// The revision actions admin_undo_revision() can reverse; every other
// action (merge/split/reorder/add/undo, live_apply/live_clear) it refuses.
const UNDOABLE_ACTIONS = new Set(['admin_edit', 'admin_delete', 'admin_hide', 'admin_restore']);

// The queue row only carries some of the editable fields; the rest start
// blank rather than borrowing another field's text.
function currentFieldValue(p: PaperQueueRow, field: string): string {
  switch (field) {
    case 'incomplete_note': return p.incomplete_note ?? '';
    case 'school': return p.school ?? '';
    case 'subject': return p.subject ?? '';
    case 'year': return p.year ?? '';
    default: return '';
  }
}

export default function AdminPaperReviewPage() {
  usePageMeta('Paper review | Shikshaq Admin', 'Review, fix and clear papers in the question bank.');
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
  const { isAdmin, checkingAdmin, error: adminGuardError, retry } = useAdminGuard(user, { redirectOnDenied: true });

  const [view, setView] = useState<View>('papers');
  const [filter, setFilter] = useState<PaperFilter>('needs_review');
  const [papers, setPapers] = useState<PaperQueueRow[]>([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [escalations, setEscalations] = useState<EscalationRow[]>([]);
  const [escalationsLoading, setEscalationsLoading] = useState(true);
  const [checkers, setCheckers] = useState<CheckerRow[]>([]);
  const [checkersLoading, setCheckersLoading] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<UserSearchRow[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  const [historyTarget, setHistoryTarget] = useState<PaperQueueRow | null>(null);
  const [history, setHistory] = useState<RevisionRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [hideTarget, setHideTarget] = useState<PaperQueueRow | null>(null);
  const [hideReason, setHideReason] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editTarget, setEditTarget] = useState<PaperQueueRow | null>(null);
  const [editField, setEditField] = useState('general_instructions');
  const [editValue, setEditValue] = useState('');
  const [checkerLog, setCheckerLog] = useState<CheckerLogRow[]>([]);
  const [checkerLogError, setCheckerLogError] = useState(false);
  const [logActor, setLogActor] = useState<string>('all');

  async function loadPapers() {
    setPapersLoading(true);
    try {
      setPapers(await adminPaperQueue());
    } catch {
      adminToast('Failed to load papers');
    } finally {
      setPapersLoading(false);
    }
  }

  async function loadEscalations() {
    setEscalationsLoading(true);
    try {
      setEscalations(await adminEscalationQueue());
    } catch {
      adminToast('Failed to load the escalation queue');
    } finally {
      setEscalationsLoading(false);
    }
  }

  async function loadCheckers() {
    setCheckersLoading(true);
    try {
      setCheckers(await adminListCheckers());
    } catch {
      adminToast('Failed to load checkers');
    } finally {
      setCheckersLoading(false);
    }
    // Loaded separately so a failure here never hides the checker list.
    try {
      setCheckerLog(await adminCheckerLog());
      setCheckerLogError(false);
    } catch {
      setCheckerLogError(true);
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    loadPapers();
    loadEscalations();
    loadCheckers();
  }, [isAdmin]);

  // W13 realtime: when anyone checks, fixes or edits, refetch the numbers
  // and the log a few seconds later, quietly (no skeleton, no toast), and
  // show who is online. Does nothing if the channel cannot connect.
  const refreshLive = useLiveRefresh(() => {
    adminPaperQueue().then(setPapers).catch(() => undefined);
    adminEscalationQueue().then(setEscalations).catch(() => undefined);
    adminListCheckers().then(setCheckers).catch(() => undefined);
    adminCheckerLog().then((rows) => { setCheckerLog(rows); setCheckerLogError(false); }).catch(() => undefined);
  });
  const { status: liveStatus, online } = usePaperReviewChannel({
    enabled: !!isAdmin,
    userId: user?.id,
    fullName: profile?.full_name,
    onActivity: refreshLive,
  });
  const othersOnline = online.filter((p) => p.userId !== user?.id);

  const filteredPapers = useMemo(() => {
    switch (filter) {
      case 'needs_review':
        return papers.filter((p) => p.needs_review);
      case 'escalated':
        return papers.filter((p) => p.escalated_count > 0);
      case 'hidden':
        return papers.filter((p) => !p.is_published);
      case 'incomplete':
        return papers.filter((p) => !!p.incomplete_note);
      case 'verified':
        return papers.filter(isVerified);
      default:
        return papers;
    }
  }, [papers, filter]);

  // Fewest questions left first: those papers clear and go live soonest.
  const sortedPapers = useMemo(
    () => [...filteredPapers].sort((a, b) => leftToCheck(a) - leftToCheck(b) || a.paper_id.localeCompare(b.paper_id)),
    [filteredPapers],
  );

  async function openHistory(p: PaperQueueRow) {
    setHistoryTarget(p);
    setHistoryLoading(true);
    try {
      setHistory(await adminPaperHistory(p.paper_id));
    } catch {
      adminToast('Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }

  async function doUndo(revisionId: number) {
    try {
      await adminUndoRevision(revisionId);
      adminToast('Reverted');
      if (historyTarget) openHistory(historyTarget);
      loadPapers();
    } catch {
      adminToast('Could not undo that revision');
    }
  }

  async function confirmHide() {
    if (!hideTarget) return;
    const reason = hideReason.trim();
    if (!reason) {
      adminToast('A reason is required to hide a paper');
      return;
    }
    setBusyId(hideTarget.paper_id);
    try {
      await adminHideBankPaper(hideTarget.paper_id, reason);
      adminToast('Paper hidden');
      setHideTarget(null);
      setHideReason('');
      loadPapers();
    } catch {
      adminToast('Failed to hide the paper');
    } finally {
      setBusyId(null);
    }
  }

  async function doRestore(p: PaperQueueRow) {
    setBusyId(p.paper_id);
    try {
      await adminRestoreBankPaper(p.paper_id);
      adminToast('Paper restored');
      loadPapers();
    } catch {
      adminToast('Failed to restore the paper');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmEdit() {
    if (!editTarget) return;
    try {
      await adminEditBankPaper(editTarget.paper_id, editField, editValue);
      adminToast('Saved');
      setEditTarget(null);
      loadPapers();
    } catch {
      adminToast('Failed to save that field');
    }
  }

  // D32: search Shikshaq accounts by name or email instead of requiring the
  // admin to already know a raw account id.
  useEffect(() => {
    const q = userSearchQuery.trim();
    if (q.length < 2) {
      setUserSearchResults([]);
      return;
    }
    let cancelled = false;
    setUserSearchLoading(true);
    const timer = setTimeout(() => {
      adminSearchUsers(q)
        .then((rows) => {
          if (!cancelled) setUserSearchResults(rows);
        })
        .catch(() => {
          if (!cancelled) adminToast('Search failed');
        })
        .finally(() => {
          if (!cancelled) setUserSearchLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userSearchQuery]);

  async function doGrant(userId: string) {
    try {
      await adminGrantPaperChecker(userId);
      adminToast('Paper checker permission granted');
      setUserSearchQuery('');
      setUserSearchResults([]);
      loadCheckers();
    } catch {
      adminToast('Failed to grant the paper checker permission');
    }
  }

  async function doReactivate(userId: string) {
    try {
      await adminGrantPaperChecker(userId);
      adminToast('Paper checker permission turned back on');
      loadCheckers();
    } catch {
      adminToast('Failed to turn the permission back on');
    }
  }

  async function doRevoke(userId: string) {
    try {
      await adminRevokePaperChecker(userId);
      adminToast('Paper checker permission revoked');
      loadCheckers();
    } catch {
      adminToast('Failed to revoke');
    }
  }

  const nav = buildAdminNav('paper-review', { paperReview: escalations.length || undefined });

  if (checkingAdmin) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
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

  if (adminGuardError) return <AdminGuardErrorState onRetry={retry} />;
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

  const paperColumns: AdminTableColumn[] = [
    { key: 'school', label: 'School', width: '1.6fr' },
    { key: 'subject', label: 'Subject', width: '1fr' },
    { key: 'cls', label: 'Class', width: '0.6fr' },
    { key: 'year', label: 'Year', width: '0.6fr' },
    { key: 'progress', label: 'Progress', width: '0.9fr' },
    { key: 'left', label: 'To check', width: '0.7fr' },
    { key: 'status', label: 'Status', width: '0.9fr' },
  ];

  const paperRows: AdminTableRow[] = sortedPapers.map((p) => ({
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
    ],
    actions: [
      { label: 'History', tone: 'primary', onClick: () => openHistory(p) },
      { label: 'Edit', tone: 'primary', onClick: () => { setEditTarget(p); setEditField('incomplete_note'); setEditValue(currentFieldValue(p, 'incomplete_note')); } },
      p.is_published
        ? { label: busyId === p.paper_id ? '...' : 'Hide', tone: 'destructive', onClick: () => setHideTarget(p), disabled: busyId === p.paper_id }
        : { label: busyId === p.paper_id ? '...' : 'Restore', tone: 'mint', onClick: () => doRestore(p), disabled: busyId === p.paper_id },
    ],
  }));

  const escalationColumns: AdminTableColumn[] = [
    { key: 'school', label: 'School', width: '1.4fr' },
    { key: 'subject', label: 'Subject', width: '1fr' },
    { key: 'number', label: 'Question', width: '0.6fr' },
    { key: 'reasons', label: 'Flags', width: '1.6fr' },
  ];

  async function doResolveEscalation(questionId: string) {
    try {
      await adminResolveEscalation(questionId);
      adminToast('Marked resolved');
      loadEscalations();
    } catch {
      adminToast('Failed to resolve this escalation');
    }
  }

  const escalationRows: AdminTableRow[] = escalations.map((e) => ({
    id: e.question_id,
    cells: [e.school ?? 'Unknown', e.subject ?? '-', e.display_number ?? '-', e.flag_reasons.join(', ') || '-'],
    actions: [{ label: 'Accept as-is', tone: 'mint', onClick: () => doResolveEscalation(e.question_id) }],
  }));

  const logActorNames = new Map<string, string>();
  for (const r of checkerLog) if (!logActorNames.has(r.actor_user_id)) logActorNames.set(r.actor_user_id, r.actor_name);
  const logActors = [...logActorNames.entries()];

  const logColumns: AdminTableColumn[] = [
    { key: 'who', label: 'Who', width: '1.2fr' },
    { key: 'did', label: 'Did', width: '1fr' },
    { key: 'paper', label: 'Paper', width: '1.8fr' },
    { key: 'q', label: 'Question', width: '0.6fr' },
    { key: 'when', label: 'When', width: '1fr' },
  ];

  const logRows: AdminTableRow[] = checkerLog
    .filter((r) => logActor === 'all' || r.actor_user_id === logActor)
    .map((r, i) => ({
      id: `${r.at}-${i}`,
      cells: [
        r.actor_name,
        ACTION_LABELS[r.action] ?? r.action,
        [r.school || 'Unnamed school', r.subject, r.cls, r.year].filter(Boolean).join(' · ') || (r.note ?? '-'),
        r.question_number ?? '-',
        new Date(r.at).toLocaleString(),
      ],
    }));

  const checkerColumns: AdminTableColumn[] = [
    { key: 'email', label: 'Checker', width: '1.6fr' },
    { key: 'passed', label: 'Passed', width: '0.7fr' },
    { key: 'fixed', label: 'Fixed', width: '0.7fr' },
    { key: 'split', label: 'Split', width: '0.7fr' },
    { key: 'escalated', label: 'Escalated', width: '0.7fr' },
    { key: 'status', label: 'Status', width: '0.8fr' },
  ];

  const checkerRows: AdminTableRow[] = checkers.map((c) => ({
    id: c.user_id,
    cells: [
      c.email ?? c.user_id,
      String(c.passed_count),
      String(c.fixed_count),
      String(c.split_count),
      String(c.escalated_count),
      <AdminStatusPill key="status" status={c.active ? 'live' : 'paused'} label={c.active ? 'Active' : 'Off'} />,
    ],
    actions: [
      c.active
        ? { label: 'Turn off', tone: 'destructive', onClick: () => doRevoke(c.user_id) }
        : { label: 'Turn on', tone: 'mint', onClick: () => doReactivate(c.user_id) },
    ],
  }));

  const viewTabs: { key: View; label: string; count?: number }[] = [
    { key: 'papers', label: 'Papers' },
    { key: 'escalations', label: 'Escalations', count: escalations.length },
    { key: 'checkers', label: 'Checkers' },
  ];

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-[18px]">
          <AdminPanelHeader
            title="Paper review"
            meta={`${papers.filter((p) => p.needs_review).length} need review - ${escalations.length} escalated`}
          />
          <div role="tablist" aria-label="Paper review view" className="inline-flex h-11 shrink-0 items-center rounded-full bg-muted p-1">
            {viewTabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={view === t.key}
                onClick={() => setView(t.key)}
                className={cn(
                  'flex h-9 items-center gap-1.5 rounded-full px-[14px] text-[13px] font-bold transition-colors duration-150',
                  view === t.key ? 'bg-card text-foreground' : 'text-warm-secondary hover:text-foreground',
                )}
              >
                {t.label}
                {typeof t.count === 'number' && t.count > 0 ? (
                  <span className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-brand px-[5px] text-[11px] font-bold tabular-nums text-foreground">
                    {t.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {liveStatus === 'live' ? (
          <p className="mb-4 flex items-center gap-2 px-[18px] text-[13px] text-warm-secondary" aria-live="polite">
            <span className="h-2 w-2 shrink-0 rounded-full bg-mint" aria-hidden />
            {othersOnline.length > 0
              ? <span><span className="font-semibold text-foreground">Online now:</span> {formatOnlineNames(othersOnline)}</span>
              : <span>No one else is checking right now. This page updates as people work.</span>}
          </p>
        ) : null}

        {view === 'papers' ? (
          <>
            <div className="mb-4 px-[18px]">
              <AdminStatTiles
                stats={[
                  { label: 'Needs review', value: papers.filter((p) => p.needs_review).length },
                  { label: 'Escalated', value: papers.filter((p) => p.escalated_count > 0).length },
                  { label: 'Hidden', value: papers.filter((p) => !p.is_published).length },
                  { label: 'Incomplete', value: papers.filter((p) => !!p.incomplete_note).length },
                  { label: 'Verified', value: papers.filter(isVerified).length },
                ]}
              />
            </div>
            <div className="mb-4 flex flex-wrap gap-2 px-[18px]">
              {(['needs_review', 'escalated', 'hidden', 'incomplete', 'verified', 'all'] as PaperFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'h-9 rounded-full px-3.5 text-[13px] font-semibold',
                    filter === f ? 'bg-panel text-background' : 'bg-muted text-warm-secondary',
                  )}
                >
                  {f === 'needs_review' ? 'Needs review' : f === 'escalated' ? 'Escalated' : f === 'hidden' ? 'Hidden' : f === 'incomplete' ? 'Incomplete' : f === 'verified' ? 'Verified' : 'All'}
                </button>
              ))}
            </div>
            {papersLoading ? (
              <div className="animate-pulse space-y-3 px-[18px]">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : filteredPapers.length === 0 ? (
              <p className="px-[18px] py-8 text-center text-[15px] text-warm-meta">No papers match this filter.</p>
            ) : (
              <AdminTable columns={paperColumns} rows={paperRows} />
            )}
          </>
        ) : view === 'escalations' ? (
          escalationsLoading ? (
            <div className="animate-pulse space-y-3 px-[18px]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-muted" />
              ))}
            </div>
          ) : escalationRows.length === 0 ? (
            <p className="px-[18px] py-8 text-center text-[15px] text-warm-meta">Nothing is waiting for admin help right now.</p>
          ) : (
            <AdminTable columns={escalationColumns} rows={escalationRows} />
          )
        ) : (
          <>
            <div className="mb-4 px-[18px]">
              <input
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by name or email to grant the paper checker permission"
                className="h-11 w-full max-w-md rounded-full bg-muted px-4 text-sm outline-none"
              />
              {userSearchQuery.trim().length >= 2 && (
                <div className="mt-2 max-w-md space-y-1.5">
                  {userSearchLoading ? (
                    <p className="text-[13px] text-warm-meta">Searching...</p>
                  ) : userSearchResults.length === 0 ? (
                    <p className="text-[13px] text-warm-meta">No accounts match.</p>
                  ) : (
                    userSearchResults.map((u) => (
                      <div key={u.user_id} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{u.full_name || 'Unnamed account'}</p>
                          <p className="text-[12px] text-warm-meta">{u.email}</p>
                        </div>
                        {u.is_checker && u.checker_active ? (
                          <span className="text-[12px] font-semibold text-warm-secondary">Already a checker</span>
                        ) : (
                          <button onClick={() => doGrant(u.user_id)} className={adminPrimaryBtnStyle}>Grant checker</button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {checkersLoading ? (
              <div className="animate-pulse space-y-3 px-[18px]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 rounded-2xl bg-muted" />
                ))}
              </div>
            ) : checkerRows.length === 0 ? (
              <p className="px-[18px] py-8 text-center text-[15px] text-warm-meta">No paper checkers yet.</p>
            ) : (
              <AdminTable columns={checkerColumns} rows={checkerRows} />
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-2 px-[18px]">
              <h3 className="text-[16px] font-bold text-foreground">Checker log</h3>
              <select
                value={logActor}
                onChange={(e) => setLogActor(e.target.value)}
                aria-label="Show actions by"
                className="h-9 rounded-full bg-muted px-3 text-[13px] font-semibold text-foreground"
              >
                <option value="all">Everyone</option>
                {logActors.map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            {checkerLogError ? (
              <p className="px-[18px] py-6 text-[14px] text-warm-meta">The log is not available yet.</p>
            ) : logRows.length === 0 ? (
              <p className="px-[18px] py-6 text-[14px] text-warm-meta">No checker actions yet.</p>
            ) : (
              <AdminTable columns={logColumns} rows={logRows} readOnly />
            )}
          </>
        )}
      </BentoPanel>

      <AdminAuditNote />

      {/* Hide dialog -- reason required, mirrors admin/papers.tsx's takedown flow. */}
      <Dialog open={!!hideTarget} onOpenChange={(open) => { if (!open) setHideTarget(null); }}>
        <DialogContent aria-describedby={undefined} className="w-full max-w-md rounded-bento bg-card p-6">
          <DialogTitle className="text-xl font-bold text-foreground">Hide this paper?</DialogTitle>
          <p className="mt-1.5 text-[14px] text-warm-secondary">Readers stop seeing it straight away. Restore brings it back.</p>
          <Textarea value={hideReason} onChange={(e) => setHideReason(e.target.value)} placeholder="Reason" rows={3} className="mt-3" autoFocus />
          <div className="mt-4 flex gap-2">
            <button onClick={confirmHide} disabled={!hideReason.trim()} className={cn('disabled:opacity-60', adminPrimaryBtnStyle)}>Hide</button>
            <button onClick={() => setHideTarget(null)} className={adminSecondaryBtnStyle}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog -- one field at a time, whitelisted server-side by admin_edit_bank_paper. */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent aria-describedby={undefined} className="w-full max-w-md rounded-bento bg-card p-6">
          <DialogTitle className="text-xl font-bold text-foreground">Edit {editTarget?.school}</DialogTitle>
          <label className="mt-3 block text-[13px] font-semibold text-foreground">Field</label>
          <select
            value={editField}
            onChange={(e) => {
              setEditField(e.target.value);
              // Prefill with THIS field's current value so Save can never
              // write one field's text into another.
              setEditValue(editTarget ? currentFieldValue(editTarget, e.target.value) : '');
            }}
            className="mt-1 h-11 w-full rounded-xl bg-muted px-3 text-sm"
          >
            <option value="general_instructions">General instructions</option>
            <option value="incomplete_note">Incomplete note</option>
            <option value="allowed_time_minutes">Allowed time (minutes)</option>
            <option value="school">School</option>
            <option value="subject">Subject</option>
            <option value="year">Year</option>
          </select>
          <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={3} className="mt-3" />
          <div className="mt-4 flex gap-2">
            <button onClick={confirmEdit} className={adminPrimaryBtnStyle}>Save</button>
            <button onClick={() => setEditTarget(null)} className={adminSecondaryBtnStyle}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History dialog -- full change log + undo per revision. */}
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
                  {UNDOABLE_ACTIONS.has(r.action) && (
                    <button onClick={() => doUndo(r.id)} className="mt-2 rounded-full bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground">
                      Undo
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
