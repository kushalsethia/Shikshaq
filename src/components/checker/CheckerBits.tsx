import { useEffect, useRef, useState } from 'react';
import { MathText } from '@/components/papers/math-text';
import { OptionList } from '@/components/checker/OptionList';
import { cn } from '@/lib/utils';
import type { CheckerApi } from '@/lib/checker-api';
import { describeLanes } from '@/lib/checker-lanes';
import { contextHeading, partLabel, type QuestionContext } from '@/lib/checker-context';
import { canSplitAt, splitHalves } from '@/lib/checker-body';
import { CHIP } from '@/lib/checker-button-styles';

/* Small pieces the verify screen and the page around it share: a signed
   picture link, the "what to check" card, the dialog shell, the whole-question
   view and the chip button. Moved out of pages/Checker.tsx unchanged. */

/**
 * A short-lived signed URL for one object, re-asked whenever `key` changes.
 * undefined = still looking (or nothing to look for yet), null = no object or
 * it failed. One per picture: the crop and the page load side by side.
 */
export function useSignedUrl(api: CheckerApi, key: string, path: string): string | null | undefined {
  const [state, setState] = useState<{ key: string; url: string | null } | null>(null);
  useEffect(() => {
    if (!key) return;
    if (!path) {
      setState({ key, url: null });
      return;
    }
    let cancelled = false;
    api.pictureUrl(path).then((url) => {
      if (!cancelled) setState({ key, url });
    });
    return () => {
      cancelled = true;
    };
    // `path` is part of `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, api]);
  if (!key || !state || state.key !== key) return undefined;
  return state.url;
}

/**
 * "What to check": one block per lane the question is in (checker-lanes.ts),
 * in plain English. Lanes a student is asked to settle come first; lanes
 * that ask nothing of a student (a label, a possible repeat) are one muted
 * line. A flag with no lane still shows its fallback sentence.
 */
export function LaneCard({ summary }: { summary: ReturnType<typeof describeLanes> }) {
  const asked = summary.blocks.filter((b) => b.asked);
  const quiet = summary.blocks.filter((b) => !b.asked);
  if (asked.length === 0 && summary.unmapped.length === 0 && quiet.length === 0) return null;
  return (
    <div className="mb-3 rounded-2xl bg-brand-subtle p-3" data-testid="lane-card">
      <p className="mb-1 text-[13px] font-semibold text-foreground">What to check</p>
      <ul className="flex flex-col gap-2">
        {asked.map((b) => (
          <li key={b.lane.id} data-lane={b.lane.id}>
            <p className="text-[14px] font-semibold leading-snug text-foreground">{b.lane.name}</p>
            <p className="text-[14px] leading-snug text-foreground">{b.lane.what_to_do}</p>
            {b.detail ? <p className="mt-0.5 text-[12px] text-warm-secondary">What the computer noticed: {b.detail}</p> : null}
          </li>
        ))}
        {summary.unmapped.map((u) => (
          <li key={u.code}>
            <p className="text-[14px] leading-snug text-foreground">{u.sentence}</p>
          </li>
        ))}
      </ul>
      {quiet.length > 0 ? (
        <p className="mt-2 text-[12px] leading-snug text-warm-secondary">
          Not for you to settle: {quiet.map((b) => b.lane.name.toLowerCase()).join(', ')}. Someone else sorts that out.
        </p>
      ) : null}
      {summary.note ? <p className="mt-1 text-[12px] text-warm-secondary">What the computer noticed: {summary.note}</p> : null}
    </div>
  );
}

/* Shaped like what it replaces: a picture box and a question box. */
export function CheckerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Loading the next question" role="status">
      <div className="h-48 animate-pulse rounded-2xl bg-muted lg:h-72" />
      <div className="flex flex-col gap-3">
        <div className="h-16 animate-pulse rounded-2xl bg-muted" />
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export function Callout({ tone, title, children }: { tone: 'warn'; title: string; children: React.ReactNode }) {
  return (
    <div role="note" className={cn('mb-3 rounded-2xl p-3', tone === 'warn' && 'bg-destructive/10')}>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-[13px] leading-snug text-warm-secondary">{children}</p>
    </div>
  );
}

/* What the two halves will be, before the checker commits to a split. */
export function SplitPreview({ body, at }: { body: string; at: number | null }) {
  if (at === null) {
    return <p className="mt-2 text-[13px] text-warm-meta">Nothing chosen yet.</p>;
  }
  if (!canSplitAt(body, at)) {
    return (
      <p className="mt-2 text-[13px] text-destructive">
        Tap inside the words, between the two questions. Both parts need some words.
      </p>
    );
  }
  const { first, second } = splitHalves(body, at);
  const tail = Array.from(first.trimEnd()).slice(-60).join('');
  const head = Array.from(second.trimStart()).slice(0, 60).join('');
  return (
    <div className="mt-2 grid gap-2 text-[13px] sm:grid-cols-2">
      <div className="rounded-xl bg-muted p-2">
        <p className="font-semibold text-foreground">First question ends with</p>
        <p className="break-words text-warm-secondary">...{tail}</p>
      </div>
      <div className="rounded-xl bg-muted p-2">
        <p className="font-semibold text-foreground">Second question starts with</p>
        <p className="break-words text-warm-secondary">{head}...</p>
      </div>
    </div>
  );
}

/* A dialog: Escape and the backdrop close it, focus goes inside. */
export function Modal({
  onClose,
  labelledBy,
  children,
}: {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) el.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* W11: the whole question a sub-part belongs to, read-only, with the part
   being checked highlighted. Bodies go through MathText verbatim. */
export function WholeQuestion({ context }: { context: QuestionContext }) {
  return (
    <div className="mb-3 rounded-2xl border border-warm-hairline p-3">
      <p className="mb-2 text-[13px] font-semibold text-foreground">{contextHeading(context)}</p>
      {context.parent ? (
        <div
          aria-current={context.currentIsParent ? 'true' : undefined}
          className={cn('rounded-xl p-2.5', context.currentIsParent ? 'bg-brand-subtle ring-2 ring-brand' : 'bg-muted')}
        >
          {context.currentIsParent ? <CheckingTag /> : null}
          <MathText text={context.parent.body ?? ''} className="text-[14px] leading-relaxed text-foreground" />
          <OptionList options={context.parent.options} />
        </div>
      ) : null}
      <ol className="mt-2 space-y-2">
        {context.parts.map((part, i) => {
          const current = part.id === context.currentId;
          return (
            <li
              key={part.id}
              aria-current={current ? 'true' : undefined}
              className={cn('rounded-xl p-2.5', current ? 'bg-brand-subtle ring-2 ring-brand' : 'bg-muted')}
              style={{ marginLeft: Math.min(Math.max(part.depth - 1, 0), 3) * 12 }}
            >
              {current ? <CheckingTag /> : null}
              {/* The printed label, unless the body already starts with it
                  ("(a)" over "(a) Name the..." read twice). */}
              {(part.body ?? '').trimStart().startsWith(partLabel(part, i)) ? null : (
                <p className="mb-0.5 text-[12px] font-semibold text-warm-secondary">{partLabel(part, i)}</p>
              )}
              <MathText text={part.body ?? ''} className="text-[14px] leading-relaxed text-foreground" />
              <OptionList options={part.options} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CheckingTag() {
  return (
    <span className="mb-1 inline-block rounded-full bg-brand px-2 py-0.5 text-[12px] font-bold text-foreground">
      You are checking this part
    </span>
  );
}

export function Chip({
  onClick,
  pressed,
  tone,
  children,
}: {
  onClick: () => void;
  pressed?: boolean;
  tone: 'brand' | 'muted';
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn(CHIP, tone === 'brand' ? 'bg-brand-subtle text-foreground' : 'bg-muted text-warm-secondary')}
    >
      {children}
    </button>
  );
}

