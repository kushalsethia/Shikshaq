import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, ChevronDown } from 'lucide-react';
import { GAME_KEYS, type GameQuestionsApi, type SentBack } from '@/lib/game-questions/api';
import { EmptyNote, ListSkeleton, LoadError } from '@/components/hod/HodShared';
import { cn } from '@/lib/utils';

/* "Sent back to you" on /questions: the signed-in person's questions their HOD sent back, newest first, with the
   reason, who sent it back, and whether the same question has been sent again since. The number of new ones shows on
   the button; opening the panel marks them seen (they keep their "New" label while the page is open). "See why" after
   a send opens it at those questions. */

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export function SentBackPanel({
  api,
  scope,
  focus,
}: {
  api: GameQuestionsApi;
  scope: string;
  /** Opens the panel at these questions; `n` changes on every request, so the same ones can be asked for twice. */
  focus: { ids: string[]; n: number } | null;
}) {
  const qc = useQueryClient();
  // always asked afresh when the page opens: an HOD may have sent something back since
  const q = useQuery({ queryKey: GAME_KEYS.sentBack(scope), queryFn: () => api.sentBack(), staleTime: 0, refetchOnMount: 'always' });
  const [open, setOpen] = useState(false);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const list = q.data;
  const unseen = list?.filter((a) => !a.seen) ?? [];
  const box = useRef<HTMLDivElement>(null);

  // "See why" opens it, at the questions asked for, with the latest list
  const handled = useRef(0);
  useEffect(() => {
    if (!focus || handled.current === focus.n) return;
    handled.current = focus.n;
    setOpen(true);
    void q.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  // opening it marks what was new as seen
  useEffect(() => {
    if (!open || !unseen.length) return;
    setFresh((f) => new Set([...f, ...unseen.map((a) => a.id)]));
    qc.setQueryData<SentBack[]>(GAME_KEYS.sentBack(scope), (old) => old?.map((a) => ({ ...a, seen: true })));
    api.markSeen().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, unseen.length]);

  // the questions asked for come into view
  const flash = new Set(open ? focus?.ids : []);
  useEffect(() => {
    if (!open || !focus?.ids.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => box.current?.querySelector('[data-flash]')?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }));
  }, [open, focus, list]);

  return (
    <div ref={box} className="mt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="gq-sent-back"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'tap-44 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[14px] font-bold transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          open ? 'bg-panel text-background' : 'bg-muted text-foreground',
        )}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        Sent back to you
        {unseen.length > 0 ? (
          <span key={unseen.length} className="inline-flex h-[19px] min-w-[19px] animate-pop items-center justify-center rounded-full bg-brand px-[5px] text-[12px] font-bold tabular-nums text-foreground">
            {unseen.length}
            <span className="sr-only"> new</span>
          </span>
        ) : null}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open ? (
        <div id="gq-sent-back" role="region" aria-label="Questions sent back to you" className="mt-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <p className="mb-2 text-[13px] text-warm-secondary">Questions your HOD sent back, and why. Fix them below and send them again.</p>
          {q.isLoading ? (
            <ListSkeleton rows={2} label="Loading the questions sent back to you" />
          ) : q.isError ? (
            <LoadError what="The questions sent back to you" onRetry={() => void q.refetch()} />
          ) : !list?.length ? (
            <EmptyNote>Nothing has been sent back to you. When your HOD sends a question back, it shows up here with the reason.</EmptyNote>
          ) : (
            <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {list.map((a) => (
                <li
                  key={a.id}
                  data-flash={flash.has(a.id) ? '' : undefined}
                  className={cn('rounded-[16px] bg-muted px-4 py-3 transition-shadow duration-300', flash.has(a.id) && 'shadow-[0_0_0_2px_hsl(var(--brand))]')}
                >
                  <p className="text-[12px] text-warm-secondary">
                    {[a.chapter_no !== null && `Chapter ${a.chapter_no}`, a.chapter].filter(Boolean).join(': ')}
                    {a.topic && ` · ${a.topic}`}
                  </p>
                  <p className="mt-1 text-pretty text-[14px] text-foreground">{a.question}</p>
                  <p className="text-[14px] font-bold text-foreground">{a.answer}</p>
                  <p className="mt-2 rounded-[10px] bg-card px-3 py-2 text-[14px] text-foreground">
                    <b>Why:</b> {a.note}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[12px] text-warm-secondary">
                    {fresh.has(a.id) ? <span className="rounded-full bg-brand px-2 py-0.5 text-[12px] font-bold text-foreground">New</span> : null}
                    <span>
                      Sent back by {a.reviewer}
                      {a.reviewedAt && `, ${when(a.reviewedAt)}`}.
                      {a.now === 'approved' ? ' Since sent again, and approved.' : a.now === 'pending' ? ' Since sent again, and waiting for the HOD.' : ''}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
