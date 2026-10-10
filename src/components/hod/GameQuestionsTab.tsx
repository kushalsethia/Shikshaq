import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Download } from 'lucide-react';
import { EmptyNote, ListSkeleton, LoadError } from '@/components/hod/HodShared';
import { RowsTable } from '@/components/game-questions/shared';
import { downloadText, offerUndo, plural } from '@/components/game-questions/actions';
import { Button } from '@/components/ui/button';
import { APPROVED_PAGE, GAME_KEYS, realGameQuestionsApi, type GameQuestionsApi } from '@/lib/game-questions/api';
import { counts, setStatus, toCSV, toJSON, type Bank, type BankQuestion, type Status } from '@/lib/game-questions/rows';
import { actionToneClass, CHIP } from '@/lib/checker-button-styles';
import { cn } from '@/lib/utils';
import type { HodTabProps } from '@/pages/Hod';

/* Questions: teachers' batches from /questions wait here until an HOD approves each question or sends it back with a
   reason the teacher sees under "Sent back to you". Approved questions are the question bank that /revise uses.
   Waiting and sent-back questions load at once; approved ones a page at a time, newest first, as they're needed.
   Every change is saved at once and can be undone for a few seconds. The server checks game_is_hod() on every call
   (paper HODs, admins, and anyone in game_hods). */

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '';
const VIEWS: { key: Status; label: string }[] = [
  { key: 'pending', label: 'Waiting' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Sent back' },
];

/** Adds questions (and their batches) the page doesn't have yet. */
const merge = (b: Bank, more: Bank): Bank => {
  const have = new Set(b.questions.map((q) => q.id));
  const batches = new Set(b.batches.map((x) => x.id));
  return {
    batches: [...b.batches, ...more.batches.filter((x) => !batches.has(x.id))],
    questions: [...b.questions, ...more.questions.filter((q) => !have.has(q.id))],
  };
};
/** Puts these questions back as they were. */
const restore = (b: Bank, qs: BankQuestion[]): Bank => ({ ...b, questions: b.questions.map((q) => qs.find((o) => o.id === q.id) ?? q) });

export function GameQuestionsTab({ gameApi, scope }: HodTabProps) {
  return <GameQuestionsDesk api={gameApi ?? realGameQuestionsApi} scope={scope} />;
}

export function GameQuestionsDesk({ api, scope }: { api: GameQuestionsApi; scope: string }) {
  const qc = useQueryClient();
  const [bank, setBank] = useState<Bank | null>(null); // the page's copy: waiting, sent back, and the approved pages loaded
  const [error, setError] = useState(false);
  const [approvedTotal, setApprovedTotal] = useState<number | null>(null);
  // approved questions, a page at a time: `last` is the oldest one loaded, `done` when there are no older ones
  const [older, setOlder] = useState<{ started: boolean; loading: boolean; done: boolean; failed: boolean; last?: BankQuestion }>({
    started: false,
    loading: false,
    done: false,
    failed: false,
  });
  const [saveError, setSaveError] = useState('');
  const [view, setView] = useState<Status>('pending');
  const [back, setBack] = useState<{ where: string; ids: string[] } | null>(null); // the "why?" box that is open
  const [reason, setReason] = useState('');
  const [leaving, setLeaving] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);

  const recount = useCallback(() => {
    api.approvedCount().then(setApprovedTotal, () => {});
    // the waiting count on the tab, the teachers' sent-back lists and the bank /revise reads all follow a decision
    void qc.invalidateQueries({ queryKey: GAME_KEYS.all(scope) });
  }, [api, qc, scope]);
  /** Loads the waiting and sent-back questions afresh (keeping the old ones on screen until they arrive). */
  const load = useCallback(() => {
    setError(false);
    // the approved pages start again once the new list is in
    api.forHod().then(
      (b) => {
        setBank(b);
        setOlder({ started: false, loading: false, done: false, failed: false });
      },
      () => setError(true),
    );
    recount();
  }, [api, recount]);
  useEffect(load, [load]);

  /** The next page of approved questions (the first when the Approved view opens). */
  const loadOlder = () => {
    setOlder((o) => ({ ...o, started: true, loading: true, failed: false }));
    api.approved(older.last).then(
      (page) => {
        setBank((b) => b && merge(b, page));
        setOlder({ started: true, loading: false, done: page.questions.length < APPROVED_PAGE, failed: false, last: page.questions[page.questions.length - 1] ?? older.last });
      },
      (e: Error) => {
        setOlder((o) => ({ ...o, loading: false, failed: true }));
        setSaveError(`Couldn't load the approved questions: ${e.message}`);
      },
    );
  };
  useEffect(() => {
    if (view === 'approved' && bank && !older.started) loadOlder();
  });

  /** When a save fails, say so and show what the database really holds. */
  const failed = (e: unknown) => {
    setSaveError(`That change wasn't saved: ${(e as Error).message}`);
    load();
  };
  const refresh = () => {
    setBank(null);
    load();
  };
  /** The whole question bank as a file, straight from the database. */
  const downloadBank = (csv: boolean) => {
    setDownloading(true);
    api
      .bank()
      .then(
        (rows) =>
          csv ? downloadText('approved-questions.csv', toCSV(rows), 'text/csv') : downloadText('approved-questions.json', toJSON(rows), 'application/json'),
        (e: Error) => setSaveError(`Couldn't download the question bank: ${e.message}`),
      )
      .finally(() => setDownloading(false));
  };

  if (!bank) {
    return error ? <LoadError what="The questions" onRetry={refresh} /> : <ListSkeleton rows={3} label="Loading the questions" />;
  }

  const c = { ...counts(bank), approved: approvedTotal ?? counts(bank).approved };

  /** Rows fade out, then move, and the change is saved; every action can be undone for a few seconds. */
  const act = (ids: string[], status: Status, note = '') => {
    const before = bank;
    const old = before.questions.filter((q) => ids.includes(q.id));
    setBack(null);
    setReason('');
    setSaveError('');
    setLeaving(new Set(ids));
    setTimeout(() => {
      setBank((b) => setStatus(b ?? before, ids, status, note, new Date().toISOString()));
      setLeaving(new Set());
    }, 220);
    // after the row has left: questions that stayed sent back (the same question was sent again) come back
    const left = new Promise((done) => setTimeout(done, 240));
    Promise.all([api.setStatus(ids, status, note), left]).then(([r]) => {
      recount();
      const kept = old.filter((q) => r.skipped.includes(q.id));
      if (!kept.length) return;
      setBank((b) => b && restore(b, kept));
      setSaveError(`${plural(kept.length, 'question')} stayed sent back: the same question was sent again and is already waiting or approved.`);
    }, failed);
    const did = status === 'approved' ? 'approved' : status === 'rejected' ? 'sent back' : 'moved to waiting';
    offerUndo(`${plural(ids.length, 'question')} ${did}`, () => {
      setBank(before);
      // put each question back as it was (questions sent back keep their own reason)
      const groups = new Map<string, BankQuestion[]>();
      for (const q of old) groups.set(`${q.status}\u0000${q.note}`, [...(groups.get(`${q.status}\u0000${q.note}`) ?? []), q]);
      Promise.all([...groups.values()].map((qs) => api.setStatus(qs.map((q) => q.id), qs[0].status, qs[0].note))).then(recount, failed);
    });
  };

  const shown = bank.questions.filter((q) => q.status === view);

  /** The "why are these going back?" box, under a row or a batch. */
  const whyBox = (where: string, ids: string[]) =>
    back?.where === where ? (
      <form
        className="mt-2 space-y-2 rounded-[14px] bg-card p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (reason.trim()) act(ids, 'rejected', reason);
        }}
      >
        <label htmlFor={`gq-why-${where}`} className="block text-[13px] font-semibold text-foreground">
          Why {ids.length > 1 ? 'are these' : 'is this'} going back? The teacher will see this.
        </label>
        <textarea
          id={`gq-why-${where}`}
          rows={2}
          value={reason}
          maxLength={500}
          autoFocus
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. The answer should be Rusting, not Rust."
          className="w-full rounded-[10px] bg-muted px-3 py-2 text-[14px] text-foreground placeholder:text-warm-label focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={cn(CHIP, 'bg-destructive text-destructive-foreground disabled:opacity-50')} disabled={!reason.trim()}>
            Send back
          </button>
          <button type="button" className={cn(CHIP, 'bg-muted text-warm-secondary')} onClick={() => setBack(null)}>
            Cancel
          </button>
        </div>
      </form>
    ) : null;

  const rowActions = (q: BankQuestion) => {
    if (q.status === 'pending') {
      return back?.where === q.id ? (
        whyBox(q.id, [q.id])
      ) : (
        <div className="mt-1 flex flex-wrap gap-2">
          <button type="button" className={cn(CHIP, 'gap-1 bg-mint text-foreground')} onClick={() => act([q.id], 'approved')}>
            <Check className="h-4 w-4" aria-hidden="true" /> Approve
          </button>
          <button
            type="button"
            className={cn(CHIP, 'bg-card text-foreground')}
            onClick={() => {
              setBack({ where: q.id, ids: [q.id] });
              setReason('');
            }}
          >
            Send back
          </button>
        </div>
      );
    }
    return (
      <div className="mt-1 space-y-2">
        {q.status === 'rejected' ? (
          <p className="rounded-[10px] bg-card px-3 py-2 text-[13px] text-foreground">
            <b>Sent back:</b> {q.note}
          </p>
        ) : null}
        <button type="button" className={cn(CHIP, 'bg-card text-warm-secondary')} onClick={() => act([q.id], 'pending')}>
          Move to waiting
        </button>
      </div>
    );
  };

  const byBatch = bank.batches
    .map((b) => ({ b, qs: shown.filter((q) => q.batch === b.id) }))
    .filter((x) => x.qs.length)
    .sort((x, y) => y.b.at.localeCompare(x.b.at)); // newest first
  const isLeaving = (q: BankQuestion) => leaving.has(q.id);

  return (
    <div className="space-y-4">
      <p className="text-pretty text-[14px] text-warm-secondary">
        Questions teachers send from{' '}
        <Link to="/questions" className="font-semibold text-brand-blue underline-offset-2 hover:underline">
          Write questions
        </Link>{' '}
        wait here. Only approved questions go into the question bank and the games on{' '}
        <Link to="/revise" className="font-semibold text-brand-blue underline-offset-2 hover:underline">
          Revise
        </Link>
        .
      </p>
      {saveError ? (
        <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-[14px] text-foreground" role="alert">
          {saveError}
        </p>
      ) : null}

      <div role="tablist" aria-label="Questions" className="inline-flex max-w-full flex-wrap gap-1 rounded-[20px] bg-muted p-1 sm:rounded-full">
        {VIEWS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={view === t.key}
            onClick={() => {
              setView(t.key);
              setBack(null);
            }}
            className={cn(
              'flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              view === t.key ? 'bg-card text-foreground' : 'text-warm-secondary hover:text-foreground',
            )}
          >
            {t.label}
            <span key={c[t.key]} className="inline-flex h-[19px] min-w-[19px] animate-pop items-center justify-center rounded-full bg-background px-[5px] text-[12px] font-bold tabular-nums text-foreground">
              {c[t.key]}
            </span>
          </button>
        ))}
      </div>

      {view === 'pending' ? (
        byBatch.length ? (
          byBatch.map(({ b, qs }) => (
            <section key={b.id} aria-label={`Batch from ${b.by}`} className="rounded-[24px] bg-muted/60 p-4 shadow-[inset_0_0_0_1px_hsl(var(--border))]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-balance text-[16px] font-bold text-foreground">
                    {plural(qs.length, 'question')} from {b.by}
                  </h3>
                  <p className="text-[12px] text-warm-secondary">
                    Sent {when(b.at)}
                    {b.email && ` · ${b.email}`} · <span className="font-mono">{b.id}</span>
                  </p>
                </div>
                {back?.where !== `batch:${b.id}` ? (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={cn(CHIP, 'gap-1 bg-mint text-foreground')} onClick={() => act(qs.map((q) => q.id), 'approved')}>
                      <Check className="h-4 w-4" aria-hidden="true" /> Approve all {qs.length}
                    </button>
                    <button
                      type="button"
                      className={cn(CHIP, 'bg-card text-foreground')}
                      onClick={() => {
                        setBack({ where: `batch:${b.id}`, ids: qs.map((q) => q.id) });
                        setReason('');
                      }}
                    >
                      Send all back
                    </button>
                  </div>
                ) : null}
              </div>
              {whyBox(`batch:${b.id}`, qs.map((q) => q.id))}
              <div className="mt-3">
                <RowsTable rows={qs} keyOf={(q) => q.id} extra={rowActions} leaving={isLeaving} />
              </div>
            </section>
          ))
        ) : (
          <div className="space-y-3 rounded-2xl bg-muted px-4 py-8 text-center">
            <p className="text-[14px] text-warm-secondary">
              <b className="text-foreground">Nothing is waiting.</b> Questions teachers send from Write questions appear here.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className={actionToneClass('dark')} onClick={refresh}>
                Check for new questions
              </button>
              <Link to="/questions" className={actionToneClass('muted')}>
                Go to Write questions
              </Link>
            </div>
          </div>
        )
      ) : shown.length ? (
        <section className="space-y-3">
          {view === 'approved' ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] text-warm-secondary">This is the question bank: what the games use. Newest first.</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="primary" size={44} disabled={downloading} onClick={() => downloadBank(true)}>
                  <Download className="h-4 w-4" aria-hidden="true" /> Download CSV
                </Button>
                <Button type="button" variant="muted" size={44} disabled={downloading} onClick={() => downloadBank(false)}>
                  <Download className="h-4 w-4" aria-hidden="true" /> Download JSON
                </Button>
              </div>
            </div>
          ) : null}
          <RowsTable
            rows={[...shown].sort(
              (x, y) => (x.chapter_id ?? '').localeCompare(y.chapter_id ?? '') || (x.topic_no ?? 0) - (y.topic_no ?? 0) || x.question_no - y.question_no,
            )}
            keyOf={(q) => q.id}
            extra={rowActions}
            leaving={isLeaving}
          />
          {view === 'approved' && !older.done ? (
            <Button type="button" variant="muted" size={44} disabled={older.loading} onClick={loadOlder}>
              {older.loading ? 'Loading...' : 'Show older approved questions'}
            </Button>
          ) : null}
        </section>
      ) : view === 'rejected' || older.done ? (
        <EmptyNote>{view === 'approved' ? 'No approved questions yet.' : 'Nothing has been sent back.'}</EmptyNote>
      ) : older.failed ? (
        <LoadError what="The approved questions" onRetry={loadOlder} />
      ) : (
        <ListSkeleton rows={3} label="Loading the approved questions" />
      )}
    </div>
  );
}
