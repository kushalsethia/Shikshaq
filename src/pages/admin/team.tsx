import { useEffect, useMemo, useState, lazy, Suspense, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState, AdminStatTiles } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminTable, AdminPanelHeader, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { QuestionTimeline } from '@/components/admin/QuestionTimeline';
import { DebugId } from '@/components/DebugId';
import { formatSeconds } from '@/lib/format-seconds';
import {
  realTeamDashboardApi,
  type TeamDashboardApi,
  type TeamStatsRow,
  type PaperProgressRow,
  type QuestionHistoryRow,
} from '@/lib/team-dashboard-api';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';
import { cn } from '@/lib/utils';

const DummyAdminTeam = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminTeamDummy')) : null;

/* Owner Round 6 ("00 Owner Brief and Answers.md"): "a visual dashboard for
   HODs, in the admin paper-review section: how each team member performs,
   a neat per-question tracker, without much effort -- readable at a
   glance." Its own tab (Team) next to Paper review, rather than a section
   folded into that already-large page, for the same reason Checkers got
   its own tab: this is a different shape of screen (aggregate stats +
   drill-down), not another moderation queue. */

type Range = 'today' | '7d' | '30d' | 'all';

const RANGE_LABEL: Record<Range, string> = { today: 'Today', '7d': '7 days', '30d': '30 days', all: 'All' };

function rangeToDates(range: Range): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to);
  if (range === 'today') {
    from.setHours(0, 0, 0, 0);
  } else if (range === '7d') {
    from.setDate(from.getDate() - 7);
  } else if (range === '30d') {
    from.setDate(from.getDate() - 30);
  } else {
    from.setFullYear(from.getFullYear() - 10);
  }
  return { from, to };
}

export function AdminTeamPage({
  api = realTeamDashboardApi,
  dummy = false,
  banner,
}: {
  api?: TeamDashboardApi;
  dummy?: boolean;
  banner?: ReactNode;
}) {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'Signed-in admin';
  const [range, setRange] = useState<Range>('7d');
  const [stats, setStats] = useState<TeamStatsRow[]>([]);
  const [progress, setProgress] = useState<PaperProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionQuery, setQuestionQuery] = useState('');
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [historyRows, setHistoryRows] = useState<QuestionHistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const guard = useAdminGuard(dummy ? null : user, { onGranted: load, redirectOnDenied: !dummy });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const { error: adminGuardError, retry: retryAdminGuard } = guard;
  const sectionCounts = useAdminSectionCounts();

  async function load() {
    setLoading(true);
    try {
      const { from, to } = rangeToDates(range);
      const [s, p] = await Promise.all([api.teamStats(from, to), api.paperProgress()]);
      setStats(s);
      setProgress(p);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (dummy || isAdmin) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, dummy, isAdmin]);

  async function openHistory(id: string) {
    if (!id.trim()) return;
    setOpenQuestionId(id.trim());
    setHistoryLoading(true);
    try {
      const rows = await api.questionHistory(id.trim());
      setHistoryRows(rows);
    } catch {
      setHistoryRows([]);
    } finally {
      setHistoryLoading(false);
    }
  }

  const totals = useMemo(
    () => ({
      checked: stats.reduce((n, r) => n + r.questions_checked, 0),
      passed: stats.reduce((n, r) => n + r.passed, 0),
      fixed: stats.reduce((n, r) => n + r.fixed, 0),
      askedHelp: stats.reduce((n, r) => n + r.asked_help, 0),
      overturns: stats.reduce((n, r) => n + r.admin_overturns, 0),
    }),
    [stats],
  );
  const maxChecked = Math.max(1, ...stats.map((r) => r.questions_checked));

  const navWithTeam = buildAdminNav('team', { approvals: sectionCounts.approvals, reviews: sectionCounts.reviews });

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={navWithTeam} signedInEmail={user?.email ?? actorName} />
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

  // Median time from picking a question up to acting on it. Only recorded
  // from 2026-09-29 on, so the column stays hidden until someone has a value.
  const showTime = stats.some((r) => r.median_seconds !== null);

  const checkerColumns: AdminTableColumn[] = [
    { key: 'name', label: 'Checker', width: '1.4fr' },
    { key: 'checked', label: 'Checked', width: '0.8fr' },
    { key: 'bar', label: '', width: '1.3fr' },
    { key: 'passed', label: 'Passed', width: '0.7fr' },
    { key: 'fixed', label: 'Fixed', width: '0.7fr' },
    { key: 'help', label: 'Asked for help', width: '0.9fr' },
    { key: 'skipped', label: 'Skipped', width: '0.7fr' },
    { key: 'papers', label: 'Papers done', width: '0.8fr' },
    ...(showTime ? [{ key: 'time', label: 'Time per question', width: '0.9fr' }] : []),
    { key: 'overturns', label: 'Overturned', width: '0.8fr' },
  ];

  const checkerRows: AdminTableRow[] = stats.map((r) => ({
    id: r.user_id,
    cells: [
      <div key="name" className="flex min-w-0 items-center gap-1.5">
        <span className="truncate font-semibold text-foreground">{r.name}</span>
        <DebugId label="checker" value={r.user_id} />
      </div>,
      <span key="checked" className="font-bold tabular-nums text-foreground">{r.questions_checked}</span>,
      <MiniBar key="bar" value={r.questions_checked} max={maxChecked} />,
      <span key="passed" className="tabular-nums text-warm-secondary">{r.passed}</span>,
      <span key="fixed" className="tabular-nums text-warm-secondary">{r.fixed}</span>,
      <span key="help" className="tabular-nums text-warm-secondary">{r.asked_help}</span>,
      <span key="skipped" className="tabular-nums text-warm-secondary">{r.skipped}</span>,
      <span key="papers" className="tabular-nums text-warm-secondary">{r.papers_completed}</span>,
      ...(showTime
        ? [<span key="time" className="tabular-nums text-warm-secondary">{formatSeconds(r.median_seconds)}</span>]
        : []),
      <span
        key="overturns"
        className={cn('tabular-nums font-semibold', r.admin_overturns > 0 ? 'text-destructive' : 'text-warm-secondary')}
      >
        {r.admin_overturns}
      </span>,
    ],
  }));

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={navWithTeam} signedInEmail={user?.email ?? actorName} />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Team" meta={`${stats.length} ${stats.length === 1 ? 'checker' : 'checkers'} active`} />

        <div className="mb-4 flex flex-wrap gap-1.5 px-[18px]">
          {(Object.keys(RANGE_LABEL) as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                'tap-44 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150',
                range === r ? 'bg-panel text-background' : 'bg-muted text-warm-secondary hover:bg-warm-hairline',
              )}
            >
              {RANGE_LABEL[r]}
            </button>
          ))}
        </div>

        <div className="px-[18px]">
          <AdminStatTiles
            stats={[
              { label: 'Questions checked', value: totals.checked },
              { label: 'Passed', value: totals.passed },
              { label: 'Fixed', value: totals.fixed },
              { label: 'Asked for help', value: totals.askedHelp },
              { label: 'Admin overturns', value: totals.overturns },
            ]}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-end gap-2 px-[18px]">
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-warm-secondary">Look up a question by id</span>
            <div className="flex gap-1.5">
              <input
                value={questionQuery}
                onChange={(e) => setQuestionQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void openHistory(questionQuery);
                  }
                }}
                placeholder="question id"
                aria-label="Question id"
                className="h-11 w-[320px] rounded-full bg-muted px-4 font-mono text-[13px] text-foreground placeholder:text-warm-label outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <button
                type="button"
                onClick={() => void openHistory(questionQuery)}
                disabled={!questionQuery.trim()}
                className="flex h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-foreground disabled:opacity-50"
              >
                Show history
              </button>
            </div>
          </label>
        </div>

        {stats.length === 0 ? (
          <div className="mx-[18px] rounded-2xl bg-muted p-12 text-center">
            <p className="text-sm text-warm-label">Nobody checked a question in this range.</p>
          </div>
        ) : (
          <AdminTable columns={checkerColumns} rows={checkerRows} />
        )}

        <div className="mt-8 px-[18px]">
          <h2 className="mb-3 text-[15px] font-bold text-foreground">Papers, fewest doubts left first</h2>
          <div className="space-y-2">
            {progress.slice(0, 30).map((p) => (
              <PaperProgressCard key={p.audit_paper_id} row={p} onOpenQuestion={openHistory} />
            ))}
            {progress.length === 0 ? <p className="text-[13px] text-warm-label">No papers in the pipeline right now.</p> : null}
          </div>
        </div>
      </BentoPanel>

      <AdminAuditNote />

      {openQuestionId ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setOpenQuestionId(null)}>
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <QuestionTimeline questionId={openQuestionId} rows={historyRows} loading={historyLoading} />
            <button
              type="button"
              onClick={() => setOpenQuestionId(null)}
              className="mt-4 rounded-full bg-muted px-4 py-2 text-[13px] font-semibold text-warm-secondary"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </BentoStack>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(2, Math.round((value / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${value} of ${max}`}>
      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
    </div>
  );
}

function PaperProgressCard({ row, onOpenQuestion }: { row: PaperProgressRow; onOpenQuestion: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-[13px] font-semibold text-foreground">
            {[row.school || 'School not known', row.subject, row.cls ? `Class ${row.cls}` : null].filter(Boolean).join(' · ')}
          </p>
          <DebugId label="paper" value={row.live_bank_paper_id ?? row.audit_paper_id} />
          <DebugId label="audit-paper" value={row.audit_paper_id} />
        </div>
        <span className="text-[12px] tabular-nums text-warm-secondary">{row.open_doubts} open · {row.pct_done}% done</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-warm-hairline">
        <div className="h-full rounded-full bg-mint" style={{ width: `${Math.min(100, row.pct_done)}%` }} />
      </div>
      {row.workers.length > 0 ? (
        <p className="mt-1.5 text-[12px] text-warm-label">Worked on by: {row.workers.join(', ')}</p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          const id = window.prompt('Which question id in this paper?');
          if (id) onOpenQuestion(id);
        }}
        className="mt-1.5 text-[12px] font-semibold text-brand-blue underline underline-offset-2"
      >
        Look up a question in this paper
      </button>
    </div>
  );
}

export default function AdminTeam() {
  if (DummyAdminTeam && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyAdminTeam />
      </Suspense>
    );
  }
  return <AdminTeamPage />;
}
