import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  useAdminGuard,
  AdminGuardErrorState,
  adminToast,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
} from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminStatusPill } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MathText } from '@/components/papers/math-text';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { cn } from '@/lib/utils';
import { displaySchool } from '@/lib/school-display';
import { realApprovalApi } from '@/lib/admin-approval';
import {
  reviewCounts,
  writeErrorWords,
  type ApprovalApi,
  type PaperReview,
  type ReviewRow,
} from '@/lib/admin-approval-shape';
import { ReviewQuestionCard } from '@/components/admin/approval/ReviewQuestionCard';
import { PaperHistoryPanel } from '@/components/admin/approval/HistoryPanel';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyPaperApproval = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminPaperApprovalDummy')) : null;

/* /admin/paper-approvals/:auditPaperId: one paper, read the way a visitor
   will see it, before an admin approves it for launch.

   - Every question is drawn as on /past-papers/:id (question text verbatim).
   - Edit on a question saves a NEW version (admin_edit_question). On a paper
     that is already live the site changes at once; Versions can put any
     earlier text back.
   - Approve is refused while any question is open; the button says why.
   - History, on the right (below on a phone), says who did what and when, in
     sentences. Owner, 2026-10-02: "That this user edited this. And that user
     edited this." */

type Action = 'approve' | 'reject' | 'unpublish' | 'restore';

const ACTION_COPY: Record<Action, { title: string; body: string; button: string; busy: string; noteLabel: string; needsNote: boolean }> = {
  approve: {
    title: 'Approve this paper for launch?',
    body: 'Passed questions go on the site straight away. Set-aside questions show as a short placeholder card with no text. You can take the paper off the site later.',
    button: 'Approve for launch',
    busy: 'Approving...',
    noteLabel: 'Note (optional, shown in the history)',
    needsNote: false,
  },
  reject: {
    title: 'Send this paper back?',
    body: 'The paper is not approved and stays off the site. Say what needs to change so the next person knows.',
    button: 'Send back',
    busy: 'Sending back...',
    noteLabel: 'What needs to change',
    needsNote: true,
  },
  unpublish: {
    title: 'Take this paper off the site?',
    body: 'Visitors stop seeing it at once. Nothing is deleted, and it can be put back.',
    button: 'Take it off the site',
    busy: 'Taking it off...',
    noteLabel: 'Why',
    needsNote: true,
  },
  restore: {
    title: 'Put this paper back on the site?',
    body: 'Visitors can read it again at once, with the questions as they are now. Set-aside questions still show as placeholder cards.',
    button: 'Put it back',
    busy: 'Putting it back...',
    noteLabel: '',
    needsNote: false,
  },
};

function depthMap(rows: ReviewRow[]): Map<string, number> {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const out = new Map<string, number>();
  for (const r of rows) {
    let d = 0;
    let p = r.parent_id;
    const seen = new Set<string>();
    while (p && byId.has(p) && !seen.has(p) && d < 4) {
      seen.add(p);
      d++;
      p = byId.get(p)?.parent_id ?? null;
    }
    out.set(r.id, d);
  }
  return out;
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'warn' }) {
  return (
    <div className={cn('rounded-2xl px-4 py-3', tone === 'warn' && value > 0 ? 'bg-brand-subtle' : 'bg-muted')}>
      <p className="text-[12px] font-semibold uppercase tracking-wide text-warm-label">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold tabular-nums', tone === 'warn' && value > 0 ? 'text-brand-deep' : 'text-foreground')}>
        {value}
      </p>
    </div>
  );
}

export function AdminPaperApprovalPage({
  auditPaperId,
  api = realApprovalApi,
  dummy = false,
  banner,
  now,
}: {
  auditPaperId: string;
  api?: ApprovalApi;
  dummy?: boolean;
  banner?: ReactNode;
  /** Fixed clock for fixtures, so "2 Oct" never turns into "2 Oct 2026". */
  now?: Date;
}) {
  const { user, profile } = useAuth();
  const signedIn = dummy ? 'admin@example.com' : user?.email ?? profile?.full_name ?? 'Signed-in admin';
  const [review, setReview] = useState<PaperReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const [action, setAction] = useState<Action | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  usePageMeta(
    review ? `${review.paper.title} | Paper approval | Shikshaq Admin` : 'Paper approval | Shikshaq Admin',
    'Read, edit and approve a checked paper for launch.',
  );

  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      setLoadError(false);
      try {
        setReview(await api.review(auditPaperId));
      } catch (e) {
        if (import.meta.env.DEV) console.error('paper approval', e);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [api, auditPaperId],
  );

  const guard = useAdminGuard(dummy ? null : user, { redirectOnDenied: !dummy });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const sectionCounts = useAdminSectionCounts();

  useEffect(() => {
    if (isAdmin) void load();
    else if (!checkingAdmin) setLoading(false);
  }, [isAdmin, checkingAdmin, load]);

  const rows = useMemo(() => review?.rows ?? [], [review]);
  const depths = useMemo(() => depthMap(rows), [rows]);
  const counts = useMemo(() => reviewCounts(rows), [rows]);
  const firstOpen = rows.find((r) => r.kind === 'question' && r.state === 'open');

  const nav = buildAdminNav('ready', sectionCounts);

  function afterWrite() {
    setHistoryKey((k) => k + 1);
    void load(true);
  }

  async function runAction() {
    if (!review || !action) return;
    const copy = ACTION_COPY[action];
    if (copy.needsNote && !note.trim()) {
      setActionError('Write a short note first, so the history says why.');
      return;
    }
    setBusy(true);
    setActionError(null);
    try {
      if (action === 'approve') {
        await api.approve(review.paper.audit_paper_id, note.trim());
        adminToast(review.paper.kind === 'retro' ? 'Paper approved. It was already live.' : 'Paper approved. It is now on the site.');
      } else if (action === 'reject') {
        await api.reject(review.paper.audit_paper_id, note.trim());
        adminToast('Paper sent back. It stays off the site.');
      } else if (action === 'unpublish' && review.paper.live_bank_paper_id) {
        await api.unpublish(review.paper.live_bank_paper_id, note.trim());
        adminToast('Paper taken off the site.');
      } else if (action === 'restore' && review.paper.live_bank_paper_id) {
        await api.restorePaper(review.paper.live_bank_paper_id);
        adminToast('Paper is back on the site.');
      }
      setAction(null);
      setNote('');
      afterWrite();
    } catch (e) {
      setActionError(writeErrorWords(e, 'That did not go through. Nothing was changed. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={signedIn} />
        {banner}
        <BentoPanel fill="card" className="px-[18px] py-[18px]">
          <div className="animate-pulse space-y-3" role="status" aria-label="Loading the paper">
            <div className="h-7 w-2/3 rounded-xl bg-muted" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-muted" />
              ))}
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-[18px] bg-muted" />
            ))}
          </div>
        </BentoPanel>
      </BentoStack>
    );
  }
  if (!dummy && guard.error) return <AdminGuardErrorState onRetry={guard.retry} />;
  if (!isAdmin) return null;

  if (loadError || !review) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={signedIn} />
        {banner}
        <BentoPanel fill="card" className="px-[18px] py-[18px]" role="alert">
          <p className="text-sm text-foreground">This paper did not load. Check your internet and try again.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => void load()} className={adminPrimaryBtnStyle}>
              Try again
            </button>
            <Link to="/admin/paper-approvals" className={adminSecondaryBtnStyle}>
              Back to the queue
            </Link>
          </div>
        </BentoPanel>
      </BentoStack>
    );
  }

  const { paper } = review;
  const open = review.open_count || counts.open;
  const isLive = Boolean(paper.live_bank_paper_id) && paper.is_published;
  const approved = paper.approval === 'approved';
  const wasLive = Boolean(paper.live_bank_paper_id) && !paper.is_published && (approved || paper.kind === 'retro');
  const rejected = paper.approval === 'rejected';
  const copy = action ? ACTION_COPY[action] : null;
  const meta = [paper.school ? displaySchool(paper.school) : null, paper.exam, paper.year].filter(Boolean).join(' · ');

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={signedIn} />
      {banner}

      <BentoPanel fill="card" className="px-[18px] py-[18px] lg:px-[18px] lg:py-[18px]">
        <Link
          to="/admin/paper-approvals"
          className="tap-44 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-blue hover:text-brand-blue-deep"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All paper approvals
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-balance text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-foreground">{paper.title}</h1>
            {meta ? <p className="mt-0.5 text-[14px] text-warm-secondary">{meta}</p> : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {paper.kind === 'retro' ? <AdminStatusPill status="live" label="Already live" /> : null}
            {approved ? <AdminStatusPill status="live" label="Approved" /> : null}
            {rejected ? <AdminStatusPill status="hidden" label="Sent back" /> : null}
            {wasLive ? <AdminStatusPill status="paused" label="Off the site" /> : null}
            {!approved && !rejected ? <AdminStatusPill status="pending" label="Waiting for approval" /> : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Questions" value={counts.total} />
          <Stat label="Passed" value={counts.passed} />
          <Stat label="Open" value={open} tone="warn" />
          <Stat label="Set aside" value={counts.set_aside} />
        </div>

        {open > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-brand-subtle px-4 py-3 text-[14px] text-brand-deep" role="status">
            <span className="font-semibold">
              {open === 1 ? '1 question is still open.' : `${open} questions are still open.`} Each must be passed or set aside before
              this paper can be approved.
            </span>
            {firstOpen ? (
              <a href={`#q-${firstOpen.id}`} className="tap-44 font-bold underline underline-offset-2">
                Go to the first one
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={open > 0 || approved}
            onClick={() => {
              setAction('approve');
              setNote('');
              setActionError(null);
            }}
            className={cn(adminPrimaryBtnStyle, 'disabled:cursor-not-allowed disabled:opacity-50')}
            title={open > 0 ? 'Resolve the open questions first' : undefined}
          >
            {approved ? 'Approved' : paper.kind === 'retro' ? 'Approve (already live)' : 'Approve for launch'}
          </button>
          {!approved ? (
            <button
              type="button"
              onClick={() => {
                setAction('reject');
                setNote('');
                setActionError(null);
              }}
              className={adminSecondaryBtnStyle}
            >
              Send back
            </button>
          ) : null}
          {isLive ? (
            <button
              type="button"
              onClick={() => {
                setAction('unpublish');
                setNote('');
                setActionError(null);
              }}
              className={adminDestructiveBtnStyle}
            >
              Take off the site
            </button>
          ) : null}
          {wasLive ? (
            <button
              type="button"
              onClick={() => {
                setAction('restore');
                setNote('');
                setActionError(null);
              }}
              className={adminSecondaryBtnStyle}
            >
              Put back on the site
            </button>
          ) : null}
          <a href="#paper-history" className={cn(adminSecondaryBtnStyle, 'lg:hidden')}>
            History
          </a>
        </div>
      </BentoPanel>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_400px]">
        <BentoPanel fill="card" className="px-[18px] py-[18px] lg:px-[18px] lg:py-[18px]">
          <h2 className="mb-1 text-[19px] font-extrabold tracking-[-0.03em] text-foreground">The paper, as visitors will see it</h2>
          <p className="mb-3 text-[13px] text-warm-secondary">
            Edit fixes a reading mistake and saves a new version. Versions shows every earlier one.
          </p>
          {paper.general_instructions ? (
            <MathText text={paper.general_instructions} className="mb-3 text-[14px] leading-[1.55] text-warm-prose" />
          ) : null}
          <ol className="flex flex-col gap-2.5">
            {rows.map((r) => {
              if (r.kind === 'section_break') {
                return (
                  <li key={r.id} className="pt-2 text-[13px] font-extrabold uppercase tracking-[.06em] text-warm-label">
                    {r.body || 'Section'}
                  </li>
                );
              }
              if (r.kind !== 'question') {
                return (
                  <li key={r.id}>
                    <MathText text={r.body} className="text-[13px] italic leading-[1.5] text-warm-secondary" />
                  </li>
                );
              }
              return (
                <ReviewQuestionCard
                  key={r.id}
                  row={r}
                  label={r.display_number ?? r.number_path}
                  depth={depths.get(r.id) ?? 0}
                  api={api}
                  onSaved={afterWrite}
                  canResolve={paper.approval === 'pending'}
                  now={now}
                />
              );
            })}
          </ol>
        </BentoPanel>

        <BentoPanel fill="card" id="paper-history" className="px-[18px] py-[18px] lg:px-[18px] lg:py-[18px]">
          <div className="lg:sticky lg:top-4">
            <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-foreground">History</h2>
            <p className="mb-2 text-[13px] text-warm-secondary">Who did what to this paper, newest first.</p>
            <PaperHistoryPanel api={api} auditPaperId={paper.audit_paper_id} reloadKey={historyKey} now={now} />
          </div>
        </BentoPanel>
      </div>

      <AdminAuditNote />

      <Dialog
        open={action !== null}
        onOpenChange={(o) => {
          if (!o && !busy) setAction(null);
        }}
      >
        <DialogContent aria-describedby={undefined} className="w-full max-w-md rounded-bento bg-card p-6">
          {copy ? (
            <>
              <DialogTitle className="text-balance text-xl font-bold text-foreground">{copy.title}</DialogTitle>
              <p className="mt-2 text-[14px] text-warm-secondary">{copy.body}</p>
              {copy.noteLabel ? (
              <label className="mt-3 flex flex-col gap-1 text-[12px] font-semibold text-warm-secondary">
                {copy.noteLabel}
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="rounded-xl bg-muted px-3 py-2 text-[14px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </label>
              ) : null}
              {actionError ? (
                <p role="alert" className="mt-2 text-[13px] text-destructive">
                  {actionError}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void runAction()}
                  disabled={busy}
                  className={cn(action === 'unpublish' ? adminDestructiveBtnStyle : adminPrimaryBtnStyle, 'disabled:opacity-60')}
                >
                  {busy ? copy.busy : copy.button}
                </button>
                <button type="button" onClick={() => setAction(null)} disabled={busy} className={adminSecondaryBtnStyle}>
                  Cancel
                </button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </BentoStack>
  );
}

export default function AdminPaperApproval() {
  const { auditPaperId = '' } = useParams<{ auditPaperId: string }>();
  if (DummyPaperApproval && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyPaperApproval auditPaperId={auditPaperId} />
      </Suspense>
    );
  }
  return <AdminPaperApprovalPage auditPaperId={auditPaperId} />;
}
