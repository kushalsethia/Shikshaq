import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BentoPanel } from '@/components/layout/PageContainer';
import { AdminPanelHeader } from '@/pages/admin/AdminTable';
import { reportLoadError } from '@/lib/load-error';
import { cn } from '@/lib/utils';
import { realPaperRegistryApi } from '@/lib/paper-registry-api';
import {
  PROCESSED_STATES,
  REGISTRY_PAGE_SIZE,
  STATE_LOOK,
  adminPaperHref,
  barSegments,
  hasMore,
  headlineCounts,
  mergeRows,
  openCount,
  percent,
  questionsLine,
  rowFacts,
  rowTitle,
  stateCount,
  stateLabel,
  subjectOptions,
  type PaperRegistryApi,
  type ProcessedState,
  type RegistryRow,
  type RegistrySummary,
} from '@/lib/paper-registry';

/* "Papers: processed and not processed" on /admin/pipeline.

   Owner, 2026-10-05: "you maintain an active database of which papers have
   been processed and which have not been processed and that is also data on
   the papers dashboard of the website."

   Reads public.paper_registry through two admin-only RPCs. Four states on
   purpose: loading (skeleton), empty ("The pipeline has not sent the list
   yet"), error (what happened, with Retry) and the list itself. Not started
   comes first everywhere: first tile, first bar slice, first rows. */

const PANEL = 'px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]';
const CONTROL = 'h-11 rounded-xl bg-muted px-3 text-[14px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function StateBadge({ state }: { state: ProcessedState }) {
  const look = STATE_LOOK[state];
  return (
    <span
      title={look.hint}
      className={cn('inline-flex h-[26px] w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-[10px] text-[12px] font-bold', look.pill)}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', look.dot)} aria-hidden />
      {look.label}
    </span>
  );
}

function Headline({ label, value, sub, tone, wide }: { label: string; value: number; sub: string; tone: 'alert' | 'plain' | 'good'; wide?: boolean }) {
  const toneClass =
    tone === 'alert' ? 'bg-rose-100 text-rose-950' : tone === 'good' ? 'bg-mint text-[#24603D]' : 'bg-muted text-foreground';
  return (
    <div className={cn('min-w-0 rounded-2xl px-4 py-3', wide && 'col-span-2 sm:col-span-1', toneClass)}>
      <p className="text-[12px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-[13px] opacity-80">{sub}</p>
    </div>
  );
}

function RowItem({ row }: { row: RegistryRow }) {
  const href = adminPaperHref(row);
  const facts = rowFacts(row);
  const qs = questionsLine(row);
  const showOpen = row.open_student != null || row.open_admin != null;
  return (
    <li className="flex flex-col gap-3 px-[18px] py-3.5 md:grid md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-4">
      <div className="min-w-0">
        <p className="break-words text-[15px] font-bold leading-snug text-foreground">{rowTitle(row)}</p>
        <p className="mt-0.5 break-words text-[13px] text-warm-meta">{facts || 'Details not sent yet'}</p>
        {qs ? <p className="mt-0.5 text-[13px] tabular-nums text-warm-meta">{qs}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
        <StateBadge state={row.processed_state} />
        {row.frozen ? (
          <span className="inline-flex h-[26px] items-center rounded-full bg-muted px-[10px] text-[12px] font-bold text-warm-secondary">On hold</span>
        ) : null}
        {showOpen ? (
          <span className="flex gap-3 text-[13px] tabular-nums text-warm-prose">
            <span>
              <span className="font-bold text-foreground">{openCount(row.open_student)}</span> with students
            </span>
            <span>
              <span className="font-bold text-foreground">{openCount(row.open_admin)}</span> with admin
            </span>
          </span>
        ) : null}
      </div>
      <div className="md:justify-self-end">
        {href ? (
          <Link
            to={href}
            className="tap-44 inline-flex min-h-11 items-center justify-center rounded-full bg-muted px-4 text-[13px] font-bold text-foreground transition-colors duration-150 hover:bg-warm-hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
          >
            Open paper
          </Link>
        ) : null}
      </div>
    </li>
  );
}

export function PaperRegistryPanel({ api = realPaperRegistryApi }: { api?: PaperRegistryApi }) {
  const [summary, setSummary] = useState<RegistrySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);

  const [stateFilter, setStateFilter] = useState<ProcessedState | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [rows, setRows] = useState<RegistryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [listError, setListError] = useState(false);
  const requestId = useRef(0);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(false);
    try {
      setSummary(await api.summary());
    } catch (e) {
      setSummaryError(true);
      reportLoadError('paper-registry-summary', e, { what: 'the paper list', retry: () => void loadSummary() });
    } finally {
      setSummaryLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    const t = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const fetchPage = useCallback(
    async (offset: number) => {
      const id = ++requestId.current;
      const append = offset > 0;
      if (append) setMoreLoading(true);
      else setListLoading(true);
      setListError(false);
      try {
        const page = await api.list({ state: stateFilter, search, subject, limit: REGISTRY_PAGE_SIZE, offset });
        if (id !== requestId.current) return;
        setTotal(page.total);
        setRows((prev) => (append ? mergeRows(prev, page.rows) : page.rows));
      } catch (e) {
        if (id !== requestId.current) return;
        setListError(true);
        reportLoadError('paper-registry-list', e, { what: 'the paper list', retry: () => void fetchPage(offset) });
      } finally {
        if (id === requestId.current) {
          setListLoading(false);
          setMoreLoading(false);
        }
      }
    },
    [api, stateFilter, search, subject],
  );

  const hasRegistry = !!summary && summary.total > 0;
  useEffect(() => {
    if (hasRegistry) void fetchPage(0);
  }, [hasRegistry, fetchPage]);

  const filtered = stateFilter !== null || subject !== null || search !== '';
  const clearFilters = () => {
    setStateFilter(null);
    setSubject(null);
    setSearchInput('');
    setSearch('');
  };

  if (summaryLoading && !summary) {
    return (
      <BentoPanel fill="card" className={PANEL}>
        <AdminPanelHeader title="Papers: processed and not processed" />
        <div className="grid animate-pulse grid-cols-1 gap-3 px-[18px] sm:grid-cols-3" aria-busy="true" aria-label="Loading the paper list">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted" />)}
          <div className="h-3 rounded-full bg-muted sm:col-span-3" />
        </div>
      </BentoPanel>
    );
  }

  if (summaryError || !summary) {
    return (
      <BentoPanel fill="card" className={PANEL}>
        <AdminPanelHeader title="Papers: processed and not processed" />
        <div className="px-[18px]" role="alert">
          <p className="text-sm text-foreground">Couldn't load the paper list.</p>
          <button type="button" onClick={() => void loadSummary()}
            className="tap-44 mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand underline-offset-2 hover:underline">
            Try again
          </button>
        </div>
      </BentoPanel>
    );
  }

  if (summary.total === 0) {
    return (
      <BentoPanel fill="card" className={PANEL}>
        <AdminPanelHeader title="Papers: processed and not processed" />
        <div className="px-[18px]">
          <p className="text-sm font-semibold text-foreground">The pipeline has not sent the list yet.</p>
          <p className="mt-1 text-[13px] text-warm-meta">
            Every PDF the desk knows about will show here, started or not, as soon as it syncs the list.
          </p>
        </div>
      </BentoPanel>
    );
  }

  const head = headlineCounts(summary);
  const segments = barSegments(summary);
  const subjects = subjectOptions(summary, null);
  const meta = summary.last_updated_at
    ? `${head.total.toLocaleString()} PDFs, synced ${formatDistanceToNow(new Date(summary.last_updated_at), { addSuffix: true })}`
    : `${head.total.toLocaleString()} PDFs`;

  return (
    <BentoPanel fill="card" className={PANEL}>
      <AdminPanelHeader title="Papers: processed and not processed" meta={meta} />

      <div className="grid grid-cols-2 gap-3 px-[18px] sm:grid-cols-3">
        <Headline wide tone="alert" label="Not started" value={head.notStarted}
          sub={`${percent(head.notStarted, head.total)}% of all PDFs`} />
        <Headline tone="plain" label="In progress" value={head.inProgress}
          sub="read, loaded, checked or waiting" />
        <Headline tone="good" label="On the site" value={head.live}
          sub={`${percent(head.live, head.total)}% of all PDFs`} />
      </div>

      <div className="mt-4 px-[18px]">
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={segments.map((s) => `${stateLabel(s.state)} ${s.count}`).join(', ')}
        >
          {segments.map((s) => (
            <div key={s.state} className={STATE_LOOK[s.state].bar} style={{ width: `${s.widthPct}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by state">
          {PROCESSED_STATES.map((s) => {
            const n = stateCount(summary, s);
            const on = stateFilter === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                disabled={n === 0 && !on}
                onClick={() => setStateFilter(on ? null : s)}
                title={STATE_LOOK[s].hint}
                className={cn(
                  'tap-44 inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] disabled:opacity-50',
                  on ? 'bg-foreground text-background' : 'bg-muted text-foreground hover:bg-warm-hairline',
                )}
              >
                <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', STATE_LOOK[s].bar)} aria-hidden />
                {STATE_LOOK[s].label}
                <span className="tabular-nums opacity-80">{n.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 px-[18px] sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <label className="block min-w-0">
          <span className="sr-only">Search by PDF name or paper id</span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by PDF name or paper id"
            className={cn(CONTROL, 'w-full placeholder:text-warm-meta')}
          />
        </label>
        <label className="block min-w-0">
          <span className="sr-only">Subject</span>
          <select
            value={subject ?? ''}
            onChange={(e) => setSubject(e.target.value || null)}
            className={cn(CONTROL, 'w-full')}
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s.subject} value={s.subject}>{`${s.subject} (${s.count})`}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-[18px] text-[13px] text-warm-meta" aria-live="polite">
        <span className="tabular-nums">
          {listError
            ? ''
            : `Showing ${rows.length.toLocaleString()} of ${total.toLocaleString()}${filtered ? ' matching' : ''}`}
        </span>
        {filtered ? (
          <button type="button" onClick={clearFilters}
            className="tap-44 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-2 hover:underline">
            Clear filters
          </button>
        ) : null}
      </div>

      {listError ? (
        <div className="px-[18px] pb-2" role="alert">
          <p className="text-sm text-foreground">Couldn't load the paper list.</p>
          <button type="button" onClick={() => void fetchPage(0)}
            className="tap-44 mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-brand underline-offset-2 hover:underline">
            Try again
          </button>
        </div>
      ) : rows.length === 0 && listLoading ? (
        <div className="animate-pulse space-y-3 px-[18px]" aria-busy="true" aria-label="Loading papers">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-2xl bg-muted" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="px-[18px] pb-2">
          <p className="text-sm text-foreground">No papers match these filters.</p>
        </div>
      ) : (
        <ul className={cn('divide-y divide-warm-hairline transition-opacity duration-150', listLoading && 'opacity-50')}
          aria-busy={listLoading}>
          {rows.map((r) => <RowItem key={r.registry_key} row={r} />)}
        </ul>
      )}

      {hasMore(total, rows.length) && !listError ? (
        <div className="flex justify-center px-[18px] pt-3">
          <button type="button" onClick={() => void fetchPage(rows.length)} disabled={moreLoading}
            className="tap-44 inline-flex min-h-11 items-center justify-center rounded-full bg-muted px-5 text-[13px] font-bold text-foreground transition-colors duration-150 hover:bg-warm-hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] disabled:opacity-60">
            {moreLoading ? 'Loading' : `Show more (${(total - rows.length).toLocaleString()} left)`}
          </button>
        </div>
      ) : null}

      {summary.excluded > 0 || summary.frozen > 0 ? (
        <p className="mt-3 px-[18px] text-[13px] text-warm-meta">
          {[
            summary.frozen > 0 ? `${summary.frozen} on hold` : null,
            summary.excluded > 0 ? `${summary.excluded} left out on purpose, not counted above` : null,
          ].filter(Boolean).join('. ')}
          .
        </p>
      ) : null}
    </BentoPanel>
  );
}
