import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EmptyNote, ListSkeleton, LoadError, ago } from '@/components/hod/HodShared';
import { PROFILES_KEY, TEAM_KEY } from '@/components/hod/VerifiersTab';
import { useConfirm } from '@/components/ui/use-confirm';
import { actionToneClass } from '@/lib/checker-button-styles';
import { paperLabel } from '@/lib/checker-progress';
import {
  groupByVerifier,
  memberName,
  pickBlock,
  type HodApi,
  type HodAssignment,
  type HodTeamMember,
  type HodVerifierProfile,
  type UnassignedPaper,
} from '@/lib/hod-api';

/* "Assignments": which paper each verifier holds, with Move and Unassign, and
   the papers nobody holds with an Assign to control. A whole paper goes to
   one verifier. The server refuses a move that breaks its rules (a paper above
   the verifier's grade, details missing or expired); its reason is shown as
   written. "Give out papers now" runs the automatic hand-out straight away.
   Papers whose class is unknown are handed out as Class 12; papers left
   untouched for 7 days come back to the list below (20261007140000). */

export const ASSIGNMENTS_KEY = (scope: string) => ['hod', scope, 'assignments'] as const;
export const UNASSIGNED_KEY = (scope: string) => ['hod', scope, 'unassigned'] as const;

/** A person picker and its button: "Move to another verifier", "Assign to". */
function PickVerifier({
  label,
  buttonLabel,
  options,
  busy,
  onPick,
  paperClass,
  profileOf,
}: {
  label: string;
  buttonLabel: string;
  options: HodTeamMember[];
  busy: boolean;
  onPick: (userId: string) => void;
  /** The paper's class, so verifiers below it are shown but cannot be picked. */
  paperClass: string | null;
  profileOf: (userId: string) => HodVerifierProfile | undefined;
}) {
  const [value, setValue] = useState('');
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={busy || options.length === 0}
        className="min-h-10 max-w-[14rem] rounded-full bg-card px-3 text-[13px] font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <option value="">{label}</option>
        {options.map((m) => {
          const p = profileOf(m.user_id);
          const block = pickBlock(p, paperClass);
          const grade = p?.grade != null ? `Class ${p.grade}` : null;
          return (
            // The server refuses these anyway (verifier_can_take); greyed out
            // with the reason, so the HOD sees why before pressing.
            <option key={m.user_id} value={m.user_id} disabled={block !== null}>
              {memberName(m)}
              {grade ? ` (${grade})` : ''}
              {block ? `, ${block}` : ''}
            </option>
          );
        })}
      </select>
      <button
        type="button"
        disabled={busy || value === ''}
        onClick={() => {
          onPick(value);
          setValue('');
        }}
        className="tap-44 rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-bold text-foreground disabled:opacity-40"
      >
        {buttonLabel}
      </button>
    </span>
  );
}

export function AssignmentsTab({ api, scope }: { api: HodApi; scope: string }) {
  const qc = useQueryClient();
  const { confirm, confirmDialog } = useConfirm();
  const [busy, setBusy] = useState(false);
  /** The server's reason for the last refusal, kept on screen (a toast is gone too fast to read). */
  const [refusal, setRefusal] = useState<string | null>(null);
  const assignmentsQ = useQuery({ queryKey: ASSIGNMENTS_KEY(scope), queryFn: () => api.assignments(), staleTime: 10_000, refetchOnMount: true });
  const unassignedQ = useQuery({ queryKey: UNASSIGNED_KEY(scope), queryFn: () => api.unassignedPapers(200), staleTime: 10_000, refetchOnMount: true });
  const teamQ = useQuery({ queryKey: TEAM_KEY(scope), queryFn: () => api.team(), staleTime: 15_000, refetchOnMount: true });
  const profilesQ = useQuery({ queryKey: PROFILES_KEY(scope), queryFn: () => api.profiles(), staleTime: 15_000, refetchOnMount: true });
  const profileOf = (id: string) => (profilesQ.data ?? []).find((p) => p.user_id === id);
  /** Why someone holds nothing, when it is not just "nothing to give out". */
  const whyIdle = (id: string): string | null => {
    const p = profileOf(id);
    if (!profilesQ.data) return null;
    if (!p || p.missing || p.grade == null) return 'No grade, school and board yet, so no papers are given to them. Add them on Verifiers.';
    if (p.expired) return 'Their details have expired, so no new papers are given to them. Update them on Verifiers.';
    return null;
  };

  const refresh = () => void qc.invalidateQueries({ queryKey: ['hod', scope] });
  const verifiers = (teamQ.data ?? []).filter((m) => m.active);

  async function act(fn: () => Promise<unknown>, done: (r: unknown) => string) {
    setBusy(true);
    setRefusal(null);
    try {
      const r = await fn();
      toast.success(done(r));
      refresh();
    } catch (err) {
      const raw = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '';
      setRefusal(raw || 'That did not work. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const nameOf = (id: string) => {
    const m = verifiers.find((c) => c.user_id === id);
    return m ? memberName(m) : 'that verifier';
  };

  async function unassign(a: HodAssignment) {
    const ok = await confirm({
      title: `Take ${paperLabel(a)} back from ${a.checker_name ?? 'this verifier'}?`,
      description: 'The paper goes back to the pool and can be given out again. Work already done on it stays.',
      confirmLabel: 'Unassign',
    });
    if (!ok) return;
    await act(() => api.unassign(a.assignment_id), () => 'Paper taken back.');
  }

  if (assignmentsQ.isLoading || unassignedQ.isLoading) return <ListSkeleton label="Loading assignments" />;
  if (assignmentsQ.isError) return <LoadError what="The assignments" onRetry={() => void assignmentsQ.refetch()} />;

  const groups = groupByVerifier(assignmentsQ.data ?? []);
  const idle = verifiers.filter((m) => !groups.some((g) => g.user_id === m.user_id));
  const free = unassignedQ.data ?? [];

  const row = (a: HodAssignment) => (
    <li key={a.assignment_id} className="rounded-2xl bg-card p-3" data-testid="assignment-row">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-foreground">{paperLabel(a)}</p>
          <p className="text-[12px] text-warm-meta">
            {a.remaining} {a.remaining === 1 ? 'question' : 'questions'} left · {!a.given_by_name || a.given_by_name === 'Automatic' ? 'Given automatically' : `Given by ${a.given_by_name}`}
            {a.assigned_at ? ` ${ago(a.assigned_at)}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PickVerifier
            label="Move to another verifier"
            buttonLabel="Move"
            busy={busy}
            options={verifiers.filter((m) => m.user_id !== a.user_id)}
            paperClass={a.cls}
            profileOf={profileOf}
            onPick={(uid) => void act(() => api.assignPaper(a.paper_id, uid), () => `Moved to ${nameOf(uid)}.`)}
          />
          <button type="button" disabled={busy} onClick={() => void unassign(a)} className={actionToneClass('muted')}>
            Unassign
          </button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="space-y-8">
      {refusal ? (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-2xl bg-destructive/10 px-4 py-3 text-[14px] text-destructive" data-testid="assign-refusal">
          <span>{refusal}</span>
          <button type="button" onClick={() => setRefusal(null)} className="shrink-0 font-semibold underline">
            Dismiss
          </button>
        </div>
      ) : null}

      <section aria-labelledby="who-has-what">
        <h2 id="who-has-what" className="mb-2 text-[16px] font-bold text-foreground">
          Who has what
        </h2>
        {groups.length === 0 && idle.length === 0 ? (
          <EmptyNote>No paper is assigned to anyone right now.</EmptyNote>
        ) : (
          <ul className="space-y-3">
            {groups.map((g) => (
              <li key={g.user_id} className="rounded-[18px] bg-muted p-3" data-testid="verifier-load">
                <p className="mb-2 px-1 text-[15px] font-bold text-foreground">
                  {g.name}
                  <span className="ml-2 text-[12px] font-normal text-warm-meta">
                    {g.papers.length} {g.papers.length === 1 ? 'paper' : 'papers'}
                  </span>
                </p>
                <ul className="space-y-2">{g.papers.map(row)}</ul>
              </li>
            ))}
            {idle.map((m) => (
              <li key={m.user_id} className="rounded-[18px] bg-muted px-4 py-3">
                <p className="text-[15px] font-bold text-foreground">
                  {memberName(m)} <span className="ml-2 text-[12px] font-normal text-warm-meta">no papers yet</span>
                </p>
                {whyIdle(m.user_id) ? (
                  <p className="mt-0.5 text-[13px] text-warm-secondary" data-testid="idle-reason">
                    {whyIdle(m.user_id)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="papers-nobody-has">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 id="papers-nobody-has" className="text-[16px] font-bold text-foreground">
            Papers nobody has
          </h2>
          <button
            type="button"
            disabled={busy}
            className={actionToneClass('mint')}
            onClick={() =>
              void act(
                () => api.distribute(),
                (n) => (Number(n) > 0 ? `Gave out ${n} ${Number(n) === 1 ? 'paper' : 'papers'}.` : 'Nothing could be given out by the rules right now.'),
              )
            }
          >
            Give out papers now
          </button>
        </div>
        <p className="mb-2 text-[13px] text-warm-secondary">
          Papers go to verifiers automatically, a whole paper to one verifier and never above their grade. A paper whose class is not known goes only to Class 12
          verifiers. A paper with nothing done on it for 7 days comes back here by itself.
        </p>
        {unassignedQ.isError ? (
          <LoadError what="The list of free papers" onRetry={() => void unassignedQ.refetch()} />
        ) : free.length === 0 ? (
          <EmptyNote>Every paper with questions waiting has a verifier.</EmptyNote>
        ) : (
          <ul className="space-y-2">
            {free.map((p: UnassignedPaper) => (
              <li key={p.paper_id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted p-3" data-testid="free-paper">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{paperLabel(p)}</p>
                  <p className="text-[12px] text-warm-meta">
                    {p.open_count} {p.open_count === 1 ? 'question' : 'questions'} waiting
                    {p.cls ? '' : ' · class not known'}
                  </p>
                </div>
                <PickVerifier
                  label="Assign to"
                  buttonLabel="Assign"
                  busy={busy}
                  options={verifiers}
                  paperClass={p.cls}
                  profileOf={profileOf}
                  onPick={(uid) => void act(() => api.assignPaper(p.paper_id, uid), () => `Given to ${nameOf(uid)}.`)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      {confirmDialog}
    </div>
  );
}
