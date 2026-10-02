import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth-context';
import { useAdminGuard, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import { AdminPageIntroPanel } from '@/components/admin/AdminHelp';
import { AdminPanelHeader } from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';
import { VersionHistory } from '@/components/admin/VersionHistory';
import { DebugId } from '@/components/DebugId';
import { DebugFacts } from '@/components/admin/DebugFacts';
import { realActivityApi, type ActivityApi, type ActivityRow, type ActivityScope, type VersionedTable } from '@/lib/activity-api';
import { actionWords, actorText, canOpenHistory, shortId, tableWords } from '@/lib/activity-format';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PREVIEW_TOOLS } from '@/lib/preview-tools';
import { isDummyMode } from '@/lib/dummy-mode';
import { cn } from '@/lib/utils';

const DummyAdminActivity = PREVIEW_TOOLS ? lazy(() => import('@/dummy/AdminActivityDummy')) : null;

/* Owner round 24: "checker logs kept and visible on admin", and every
   question's versions with a revert. One newest-first list of who checked or
   edited what (audit_review_log + content_versions + content_checks, merged
   server side by admin_activity_feed), and a History button on every
   question row that opens its versions. Actor ids and labels only: this
   list never shows a name or an email (owner, 2026-10-02). */

const SCOPES: { value: ActivityScope; label: string }[] = [
  { value: 'people', label: 'Checkers and admins' },
  { value: 'ai', label: 'Computer' },
  { value: 'all', label: 'Everything' },
];

const PAGE = 100;

export function AdminActivityPage({
  api = realActivityApi,
  dummy = false,
  banner,
}: {
  api?: ActivityApi;
  dummy?: boolean;
  banner?: ReactNode;
}) {
  usePageMeta('Activity | Shikshaq admin', 'Who checked or edited what, newest first.');
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'Signed-in admin';
  const guard = useAdminGuard(dummy ? null : user, { redirectOnDenied: !dummy });
  const isAdmin = dummy ? true : guard.isAdmin;
  const checkingAdmin = dummy ? false : guard.checkingAdmin;
  const sectionCounts = useAdminSectionCounts();

  const [scope, setScope] = useState<ActivityScope>('people');
  const [rows, setRows] = useState<ActivityRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState<{ table: VersionedTable; rowId: string } | null>(null);
  const requestId = useRef(0);

  const load = useCallback(
    async (next: ActivityScope) => {
      const id = ++requestId.current;
      setRows(null);
      setError(null);
      setDone(false);
      try {
        const got = await api.feed(next, null, PAGE);
        if (id !== requestId.current) return;
        setRows(got);
        setDone(got.length < PAGE);
      } catch {
        if (id !== requestId.current) return;
        setError('Could not load the activity. Check your internet and try again.');
      }
    },
    [api],
  );

  useEffect(() => {
    if (isAdmin) void load(scope);
  }, [isAdmin, scope, load]);

  async function loadMore() {
    if (!rows || rows.length === 0) return;
    setLoadingMore(true);
    try {
      const older = await api.feed(scope, rows[rows.length - 1].at, PAGE);
      const seen = new Set(rows.map((r) => `${r.stream}:${r.event_id}`));
      setRows([...rows, ...older.filter((r) => !seen.has(`${r.stream}:${r.event_id}`))]);
      setDone(older.length < PAGE);
    } catch {
      setError('Could not load older activity. Try again.');
    } finally {
      setLoadingMore(false);
    }
  }

  const nav = buildAdminNav('activity', sectionCounts);

  if (checkingAdmin) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? actorName} />
        <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
          <ListSkeleton />
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
    );
  }
  if (guard.error && !dummy) return <AdminGuardErrorState onRetry={guard.retry} />;
  if (!isAdmin) return null;

  return (
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={dummy ? 'dummy admin' : user?.email ?? actorName} />
      <AdminPageIntroPanel page="activity" />
      {banner}
      <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]">
        <AdminPanelHeader title="Activity" meta={rows ? `${rows.length} shown, newest first` : undefined} />

        <div className="mb-4 flex flex-wrap gap-1.5 px-[18px]" role="group" aria-label="Whose activity">
          {SCOPES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setScope(s.value)}
              aria-pressed={scope === s.value}
              className={cn(
                'tap-44 min-h-9 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                scope === s.value ? 'bg-panel text-background' : 'bg-muted text-warm-secondary hover:bg-warm-hairline',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="px-[18px]">
          {error && !rows ? (
            <div role="alert" className="rounded-2xl bg-muted p-8 text-center">
              <p className="text-[14px] font-semibold text-foreground">{error}</p>
              <button
                type="button"
                onClick={() => void load(scope)}
                className="tap-44 min-h-9mt-3 rounded-full bg-brand px-4 text-[14px] font-bold text-foreground"
              >
                Try again
              </button>
            </div>
          ) : rows === null ? (
            <ListSkeleton />
          ) : rows.length === 0 ? (
            <div className="rounded-2xl bg-muted p-8 text-center">
              <p className="text-[14px] font-semibold text-foreground">Nothing here yet</p>
              <p className="mt-1 text-[13px] text-warm-secondary">
                {scope === 'people'
                  ? 'No checker or admin has checked or edited a question yet. Try Everything to see the computer and pipeline too.'
                  : 'No activity recorded for this view yet.'}
              </p>
              {scope !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className="tap-44 min-h-9mt-3 rounded-full bg-brand px-4 text-[14px] font-bold text-foreground"
                >
                  Show everything
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <ol className="divide-y divide-warm-hairline">
                {rows.map((row) => (
                  <ActivityItem
                    key={`${row.stream}:${row.event_id}`}
                    row={row}
                    onOpen={() =>
                      setOpen({ table: (row.table_name as VersionedTable) ?? 'audit_questions', rowId: row.question_id! })
                    }
                  />
                ))}
              </ol>
              {error ? <p role="alert" className="mt-3 text-[13px] text-destructive">{error}</p> : null}
              {!done ? (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => void loadMore()}
                    className="tap-44 min-h-9rounded-full bg-muted px-5 text-[14px] font-semibold text-foreground transition-transform duration-150 hover:bg-warm-hairline active:scale-[0.96] disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Show older'}
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-center text-[12px] text-warm-meta">That is everything for this view.</p>
              )}
            </>
          )}
        </div>
      </BentoPanel>
      <AdminAuditNote />

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Version history"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <VersionHistory api={api} table={open.table} rowId={open.rowId} />
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="tap-44 min-h-9mt-4 rounded-full bg-muted px-4 text-[13px] font-semibold text-warm-secondary"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </BentoStack>
  );
}

const KIND_TONE: Record<string, string> = {
  checker: 'bg-mint text-foreground',
  admin: 'bg-brand text-foreground',
  ai: 'bg-brand-subtle text-brand-deep',
};

function ActivityItem({ row, onOpen }: { row: ActivityRow; onOpen: () => void }) {
  const actor = actorText(row);
  const historyable = canOpenHistory(row);
  return (
    <li className="flex flex-wrap items-start gap-x-3 gap-y-1.5 py-3">
      <time dateTime={row.at} className="w-[118px] shrink-0 pt-0.5 text-[12px] tabular-nums text-warm-meta">
        {format(new Date(row.at), 'd MMM, h:mm a')}
      </time>
      <div className="min-w-0 flex-1 basis-[220px]">
        <p className="text-[14px] font-semibold text-foreground">{actionWords(row.action)}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px] text-warm-secondary">
          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', KIND_TONE[row.actor_kind] ?? 'bg-muted text-warm-secondary')}>
            {actor.kind}
          </span>
          <span className="font-mono" title={actor.full}>
            {actor.who}
          </span>
          {row.question_id ? (
            <span>
              · {tableWords(row.table_name)} <span className="font-mono">{shortId(row.question_id)}</span>
            </span>
          ) : null}
          {row.version != null ? <span className="tabular-nums">· v{row.version}</span> : null}
        </p>
        {row.detail ? <p className="mt-0.5 break-words text-[12px] text-warm-meta">{row.detail}</p> : null}
        <span className="mt-1 inline-flex flex-wrap gap-1">
          <DebugId label="question" value={row.question_id} />
          <DebugId label="paper" value={row.paper_id} />
          <DebugFacts facts={{ stream: row.stream, event: row.event_id, action: row.action }} />
        </span>
      </div>
      {historyable ? (
        <button
          type="button"
          onClick={onOpen}
          className="tap-44 min-h-9shrink-0 rounded-full bg-muted px-3.5 text-[13px] font-bold text-foreground transition-transform duration-150 hover:bg-warm-hairline active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          History
        </button>
      ) : null}
    </li>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3 px-[18px]" role="status" aria-label="Loading the activity">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

export default function AdminActivity() {
  if (DummyAdminActivity && isDummyMode()) {
    return (
      <Suspense fallback={null}>
        <DummyAdminActivity />
      </Suspense>
    );
  }
  return <AdminActivityPage />;
}
