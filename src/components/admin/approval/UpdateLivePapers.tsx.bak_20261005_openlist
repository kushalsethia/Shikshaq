import { useCallback, useEffect, useState } from 'react';
import { adminPrimaryBtnStyle, adminSecondaryBtnStyle, adminToast } from '@/components/AdminConsole';
import { BentoPanel } from '@/components/layout/PageContainer';
import { AdminStatusPill } from '@/pages/admin/AdminTable';
import { displaySchool } from '@/lib/school-display';
import { cn } from '@/lib/utils';
import {
  canUpdate,
  confirmWords,
  doneWords,
  realLiveUpdateApi,
  updateErrorWords,
  type LiveUpdateApi,
  type LivePendingRow,
} from '@/lib/admin-live-update';

/* Live papers whose reviewed changes have not reached the site yet, each with
   an "Update live paper" button (Ready to go live page). The button asks first,
   in plain words, and says how many questions it will touch. A paper with a
   question still open cannot be pushed; the row says so instead. */

function counts(r: LivePendingRow): string {
  const parts = [
    `${r.updated} ${r.updated === 1 ? 'question' : 'questions'} updated`,
    `${r.added} added`,
    `${r.hidden} hidden`,
  ];
  return parts.join(', ');
}

export function UpdateLivePapersView({
  rows,
  state,
  confirmingId = null,
  busyId = null,
  errorFor = null,
  onAsk,
  onCancel,
  onConfirm,
  onRetry,
}: {
  rows: LivePendingRow[] | null;
  state: 'idle' | 'loading' | 'error';
  confirmingId?: string | null;
  busyId?: string | null;
  errorFor?: { id: string; message: string } | null;
  onAsk: (id: string) => void;
  onCancel: () => void;
  onConfirm: (id: string) => void;
  onRetry: () => void;
}) {
  return (
    <BentoPanel fill="card" className="px-1.5 py-[18px] lg:px-1.5 lg:py-[18px]" data-testid="update-live-papers">
      <div className="px-[18px]">
        <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-foreground">Live papers with changes waiting</h2>
        <p className="mb-3 text-[13px] text-warm-secondary">
          These papers are already on the site, and their reviewed changes are not. Updating a live paper copies the
          reviewed text, new questions and hidden questions to the site.
        </p>
      </div>

      {state === 'error' ? (
        <div className="px-[18px]" role="alert">
          <p className="text-sm text-foreground">The list did not load. Check your internet and try again.</p>
          <button type="button" onClick={onRetry} className="tap-44 mt-2 text-sm font-semibold text-brand-blue">
            Try again
          </button>
        </div>
      ) : rows === null ? (
        <div className="animate-pulse space-y-2 px-[18px]" role="status" aria-label="Loading live papers with changes">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-12 rounded-2xl bg-muted" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="px-[18px] py-4 text-[14px] text-warm-meta">No live paper has changes waiting.</p>
      ) : (
        <ul className="space-y-2 px-[18px]">
          {rows.map((r) => {
            const open = r.open;
            const asking = confirmingId === r.audit_paper_id;
            const busy = busyId === r.audit_paper_id;
            return (
              <li key={r.audit_paper_id} className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">{r.title}</p>
                    <p className="text-[13px] text-warm-secondary">
                      {r.school ? displaySchool(r.school) : 'School not recorded'}
                      {', '}
                      <span className="tabular-nums">{counts(r)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {open ? (
                      <AdminStatusPill status="paused" label={`${open} open`} />
                    ) : (
                      <AdminStatusPill status="pending" label="Ready" />
                    )}
                    {asking ? null : (
                      <button
                        type="button"
                        disabled={!canUpdate(r) || busy}
                        onClick={() => onAsk(r.audit_paper_id)}
                        title={canUpdate(r) ? undefined : 'Pass or set aside every question first.'}
                        className={cn(adminPrimaryBtnStyle, 'disabled:cursor-not-allowed disabled:opacity-50')}
                      >
                        Update live paper
                      </button>
                    )}
                  </div>
                </div>
                {!canUpdate(r) ? (
                  <p className="mt-2 text-[13px] text-warm-secondary">
                    {open === 1 ? '1 question is' : `${open} questions are`} still open. Pass or set aside each one first.
                  </p>
                ) : null}
                {asking ? (
                  <div className="mt-3 rounded-xl bg-card px-4 py-3">
                    <p className="text-[14px] text-foreground">{confirmWords(r)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onConfirm(r.audit_paper_id)}
                        disabled={busy}
                        className={cn(adminPrimaryBtnStyle, 'disabled:opacity-60')}
                      >
                        {busy ? 'Updating...' : 'Yes, update the live paper'}
                      </button>
                      <button type="button" onClick={onCancel} disabled={busy} className={adminSecondaryBtnStyle}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                {errorFor && errorFor.id === r.audit_paper_id ? (
                  <p role="alert" className="mt-2 text-[13px] text-destructive">
                    {errorFor.message}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </BentoPanel>
  );
}

export function UpdateLivePapers({ api = realLiveUpdateApi, onChanged }: { api?: LiveUpdateApi; onChanged?: () => void }) {
  const [rows, setRows] = useState<LivePendingRow[] | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('loading');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorFor, setErrorFor] = useState<{ id: string; message: string } | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    try {
      setRows(await api.pending());
      setState('idle');
    } catch (e) {
      if (import.meta.env.DEV) console.error('live papers pending', e);
      setState('error');
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  async function confirm(id: string) {
    setBusyId(id);
    setErrorFor(null);
    try {
      const done = await api.update(id);
      adminToast(doneWords(done));
      setConfirmingId(null);
      await load();
      onChanged?.();
    } catch (e) {
      setErrorFor({ id, message: updateErrorWords(e) });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <UpdateLivePapersView
      rows={rows}
      state={state}
      confirmingId={confirmingId}
      busyId={busyId}
      errorFor={errorFor}
      onAsk={(id) => {
        setErrorFor(null);
        setConfirmingId(id);
      }}
      onCancel={() => setConfirmingId(null)}
      onConfirm={(id) => void confirm(id)}
      onRetry={() => void load()}
    />
  );
}
