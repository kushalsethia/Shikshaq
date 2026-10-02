import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminPageIntroPanel } from '@/components/admin/AdminHelp';
import { AdminTable, AdminPanelHeader, AdminStatusPill, type AdminTableColumn, type AdminTableRow } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import {
  paperState,
  pct,
  seriesMax,
  seriesTotal,
  type DailyPoint,
  type FeedRow,
  type PipelineApi,
  type PipelineStats,
} from '@/lib/pipeline-stats';
import { realPipelineApi } from '@/lib/pipeline-api';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';

const DummyAdminPipeline = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminPipelineDummy')) : null;

/* /admin/pipeline: the papers pipeline in one place (owner 2026-10-02:
   "how many papers, last papers ... graphs stats logs etc in one place").
   Read-only. Everything comes from two admin-only RPCs: admin_pipeline_stats()
   (counts, newest papers, a 30-day series) and the existing
   admin_activity_feed() (the log). No question text reaches this page.

   Words used here match the library's: Verified = published and checked,
   Needs review = published but not fully checked, Hidden = not published.
   "Student queue" is the checker's pile (every row has its page image),
   "Admin queue" is the admin pile. */

function Tile({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted px-4 py-3">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-warm-label">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {sub ? <p className="mt-0.5 text-[13px] text-warm-meta">{sub}</p> : null}
    </div>
  );
}

/** One horizontal stacked bar: verified / needs review / hidden. */
function StackBar({ parts }: { parts: { value: number; className: string; label: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted" role="img"
      aria-label={parts.map((p) => `${p.label} ${p.value}`).join(', ')}>
      {parts.map((p) => (
        <div key={p.label} className={p.className} style={{ width: `${(p.value / total) * 100}%` }} />
      ))}
    </div>
  );
}

/** 30 small bars for one daily series, drawn as plain SVG (no chart library). */
function DayBars({ points, field, label, barClass }: {
  points: DailyPoint[];
  field: 'papers_added' | 'desk_papers' | 'questions_cleared';
  label: string;
  barClass: string;
}) {
  const max = seriesMax(points, field);
  const w = 300;
  const h = 72;
  const gap = 2;
  const bw = points.length ? (w - gap * (points.length - 1)) / points.length : w;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="text-[13px] tabular-nums text-warm-meta">{seriesTotal(points, field)} in 30 days</p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[72px] w-full" role="img" aria-label={`${label}, last 30 days`}>
        {points.map((p, i) => {
          const v = Number(p[field]) || 0;
          const bh = v ? Math.max(2, (v / max) * (h - 4)) : 0;
          return (
            <rect key={p.day} x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx={1.5} className={barClass}>
              <title>{`${format(new Date(p.day), 'd MMM')}: ${v}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[12px] text-warm-label">
        <span>{points[0] ? format(new Date(points[0].day), 'd MMM') : ''}</span>
        <span>today</span>
      </div>
    </div>
  );
}

export function AdminPipelinePage({
  api = realPipelineApi,
  dummy = false,
  banner,
}: {
  api?: PipelineApi;
  /** Dummy mode (D75): no sign-in, no real admin check, a fake API. */
  dummy?: boolean;
  banner?: ReactNode;
}) {
  const { user, profile } = useAuth();
  const signedInName = profile?.full_name || user?.email || 'Signed-in admin';
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [feed, setFeed] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const guard = useAdminGuard(dummy ? null : user, {
    onGranted: load,
    redirectOnDenied: !dummy,
  });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const { error: adminGuardError, retry: retryAdminGuard } = guard;
  const sectionCounts = useAdminSectionCounts();

  useEffect(() => {
    if (dummy) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummy]);
  useEffect(() => {
    if (!checkingAdmin && !isAdmin) setLoading(false);
  }, [checkingAdmin, isAdmin]);

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const [s, f] = await Promise.all([api.stats(), api.feed(40)]);
      setStats(s);
      setFeed(f);
    } catch (e) {
      if (import.meta.env.DEV) console.error('pipeline stats', e);
      setLoadError('Could not load the pipeline numbers.');
    } finally {
      setLoading(false);
    }
  }

  const nav = buildAdminNav('pipeline', sectionCounts);

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <div className="grid animate-pulse grid-cols-2 gap-3 px-[18px] md:grid-cols-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-muted" />)}
          </div>
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
    );
  }

  if (adminGuardError && !dummy) return <AdminGuardErrorState onRetry={retryAdminGuard} />;
  if (!isAdmin) return null;

  if (loadError || !stats) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />
        <BentoPanel fill="card" className="px-[18px] py-[18px]">
          <p className="text-sm text-foreground">{loadError ?? 'No numbers yet.'}</p>
          <button type="button" onClick={() => void load()}
            className="tap-44 mt-3 text-sm font-semibold text-brand underline-offset-2 hover:underline">
            Try again
          </button>
        </BentoPanel>
      </BentoStack>
    );
  }

  const { library: lib, queues: q, desk } = stats;
  const mathsLive = lib.maths_verified + lib.maths_needs_review;

  const recentColumns: AdminTableColumn[] = [
    { key: 'paper', label: 'Paper', width: '2fr' },
    { key: 'school', label: 'School', width: '1.6fr' },
    { key: 'qs', label: 'Questions', width: '0.8fr' },
    { key: 'added', label: 'Added', width: '1fr' },
    { key: 'state', label: 'State', width: '1fr' },
  ];
  const recentRows: AdminTableRow[] = stats.recent_papers.map((p) => {
    const state = paperState(p);
    return {
      id: p.id,
      cells: [
        <span key="p" className="font-bold text-foreground">{`${p.board ?? ''} ${p.cls} ${p.subject}`.trim()}{p.year ? `, ${p.year}` : ''}</span>,
        p.school || 'School not recorded',
        String(p.questions ?? 0),
        <span key="a" className="font-normal text-warm-meta">{formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>,
        <AdminStatusPill key="s" status={state === 'Verified' ? 'live' : state === 'Hidden' ? 'hidden' : 'paused'} label={state} />,
      ],
    };
  });

  const feedColumns: AdminTableColumn[] = [
    { key: 'when', label: 'When', width: '1fr' },
    { key: 'who', label: 'Who', width: '1fr' },
    { key: 'what', label: 'What', width: '1.4fr' },
    { key: 'detail', label: 'Detail', width: '2fr' },
  ];
  const feedRows: AdminTableRow[] = feed.map((r) => ({
    id: `${r.stream}:${r.event_id}`,
    cells: [
      <span key="w" className="font-normal text-warm-meta">{formatDistanceToNow(new Date(r.at), { addSuffix: true })}</span>,
      r.actor_label || r.actor_kind || 'pipeline',
      <span key="a" className="font-bold text-foreground">{r.action.replace(/_/g, ' ')}</span>,
      r.detail || '',
    ],
  }));

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />
      <AdminPageIntroPanel page="pipeline" />
      {banner}

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Papers library"
          meta={`updated ${formatDistanceToNow(new Date(stats.generated_at), { addSuffix: true })}`} />
        <div className="grid grid-cols-2 gap-3 px-[18px] md:grid-cols-4">
          <Tile label="Live papers" value={lib.published.toLocaleString()} sub={`${lib.questions.toLocaleString()} questions`} />
          <Tile label="Verified" value={lib.verified.toLocaleString()} sub={`${pct(lib.verified, lib.published)}% of live`} />
          <Tile label="Needs review" value={lib.needs_review.toLocaleString()} sub="live, not fully checked" />
          <Tile label="Hidden" value={lib.hidden.toLocaleString()} sub="not published" />
        </div>
        <div className="mt-4 px-[18px]">
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="text-[13px] font-semibold text-foreground">Maths</p>
            <p className="text-[13px] tabular-nums text-warm-meta">
              {mathsLive} of {lib.maths_papers} live, {lib.maths_verified} verified
            </p>
          </div>
          <StackBar parts={[
            { value: lib.maths_verified, className: 'bg-emerald-500', label: 'Verified' },
            { value: lib.maths_needs_review, className: 'bg-amber-400', label: 'Needs review' },
            { value: lib.maths_hidden, className: 'bg-slate-300', label: 'Hidden' },
          ]} />
        </div>
      </BentoPanel>

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Checking" meta={`${desk.papers.toLocaleString()} papers on the desk`} />
        <div className="grid grid-cols-2 gap-3 px-[18px] md:grid-cols-4">
          <Tile label="Student queue" value={q.student_queue.toLocaleString()} sub="with the page picture" />
          <Tile label="Admin queue" value={q.admin_queue.toLocaleString()} />
          <Tile label="Questions cleared" value={q.passed.toLocaleString()} sub={`${pct(q.passed, q.questions)}% of ${q.questions.toLocaleString()}`} />
          <Tile label="New scans" value={desk.new_scans.toLocaleString()} sub={`${desk.passed} papers fully passed`} />
        </div>
        <div className="mt-5 grid gap-6 px-[18px] md:grid-cols-3">
          <DayBars points={stats.daily} field="desk_papers" label="Papers loaded to the desk" barClass="fill-brand-blue" />
          <DayBars points={stats.daily} field="questions_cleared" label="Questions cleared" barClass="fill-emerald-500" />
          <DayBars points={stats.daily} field="papers_added" label="Papers added to the library" barClass="fill-amber-400" />
        </div>
      </BentoPanel>

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="By subject" meta={`${stats.by_subject.length} subjects`} />
        <ul className="space-y-3 px-[18px]">
          {stats.by_subject.map((s) => (
            <li key={s.subject}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-semibold text-foreground">{s.subject}</span>
                <span className="text-[13px] tabular-nums text-warm-meta">
                  {s.published} live, {s.verified} verified{s.hidden ? `, ${s.hidden} hidden` : ''}
                </span>
              </div>
              <StackBar parts={[
                { value: s.verified, className: 'bg-emerald-500', label: 'Verified' },
                { value: s.needs_review, className: 'bg-amber-400', label: 'Needs review' },
                { value: s.hidden, className: 'bg-slate-300', label: 'Hidden' },
              ]} />
            </li>
          ))}
        </ul>
        <p className="mt-4 px-[18px] text-[13px] text-warm-label">
          Boards: {Object.entries(stats.by_board).map(([b, n]) => `${b} ${n}`).join(', ')}
        </p>
      </BentoPanel>

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Newest papers" meta={`last ${stats.recent_papers.length}`} />
        <AdminTable columns={recentColumns} rows={recentRows} readOnly />
      </BentoPanel>

      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Activity" meta={`most recent ${feed.length}`} />
        {feedRows.length ? (
          <AdminTable columns={feedColumns} rows={feedRows} readOnly />
        ) : (
          <p className="px-[18px] text-sm text-warm-label">No activity recorded yet.</p>
        )}
      </BentoPanel>

      <AdminAuditNote />
    </BentoStack>
  );
}

export default function AdminPipeline() {
  if (DummyAdminPipeline && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyAdminPipeline />
      </Suspense>
    );
  }
  return <AdminPipelinePage />;
}
