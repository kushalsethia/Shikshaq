import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { Row } from '@/lib/game-questions/rows';
import { cn } from '@/lib/utils';

/* What /questions and the HOD page's Questions tab share on screen: the grouped table of rows and the button icon
   that turns into a check mark. The helpers without a screen (copy, download, undo) are in ./actions.ts. */

/** An icon that turns into a check mark for a moment after its action worked, without changing the button's size. */
export function ActionIcon({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <span className="relative inline-flex h-4 w-4 flex-none" aria-hidden="true">
      <span className={cn('absolute inset-0 inline-flex transition-[opacity,transform] duration-150', done ? 'scale-50 opacity-0' : 'opacity-100')}>
        {children}
      </span>
      <span className={cn('absolute inset-0 inline-flex transition-[opacity,transform] duration-200 ease-pop', done ? 'opacity-100' : 'scale-50 opacity-0')}>
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    </span>
  );
}

const DIFFICULTY_TONE: Record<string, string> = {
  easy: 'bg-mint text-foreground',
  medium: 'bg-brand-subtle text-brand-deep',
  hard: 'bg-brand-blue-subtle text-brand-blue-deep',
};

/** The rows as they will be stored, grouped under a heading for each chapter and topic, with their IDs. */
export function RowsTable<R extends Row>({
  rows,
  keyOf = (_r, i) => i,
  extra,
  leaving,
}: {
  rows: R[];
  /** A stable key per row, so rows that leave or arrive don't disturb the others. */
  keyOf?: (r: R, i: number) => string | number;
  /** Buttons or a note under a row (the HOD's actions). */
  extra?: (r: R) => ReactNode;
  /** Rows on their way out: they fade and slide away before they go. */
  leaving?: (r: R) => boolean;
}) {
  // Rows slide in as they are added. On the first render (a paste, the example) they come in one after another,
  // briefly; later only a newly added row animates, and only once.
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);
  const delay = (n: number): CSSProperties | undefined => (first.current ? { animationDelay: `${Math.min(n, 16) * 30}ms` } : undefined);
  const enter = 'animate-fade-slide-up [animation-duration:280ms]';
  let shown = 0;
  const out: ReactNode[] = [];
  let chapter = '';
  let topic = '';
  rows.forEach((r, i) => {
    const ch = [r.chapter_id, r.board, r.class, r.subject, r.chapter_no, r.chapter].join('\u0000');
    if (ch !== chapter || i === 0) {
      chapter = ch;
      topic = '';
      const title = r.chapter || r.chapter_no !== null ? [r.chapter_no !== null && `Chapter ${r.chapter_no}`, r.chapter].filter(Boolean).join(': ') : 'No chapter';
      const meta = [r.board, r.class && `Class ${r.class}`, r.subject].filter(Boolean).join(' · ');
      out.push(
        <div className={cn('mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 first:mt-0', enter)} style={delay(shown++)} key={`c${i}`}>
          <span className="text-balance text-[16px] font-bold text-foreground">{title}</span>
          <small className="text-[12px] text-warm-secondary">
            {meta}
            {meta && ' · '}
            {r.chapter_id ? <code className="font-mono text-[12px] font-semibold text-brand-blue-deep">{r.chapter_id}</code> : 'no chapter ID yet'}
          </small>
        </div>,
      );
    }
    const tp = `${r.topic_no}\u0000${r.topic}`;
    if (tp !== topic) {
      topic = tp;
      const has = r.topic || r.topic_no !== null;
      out.push(
        <div className={cn('mt-2 flex flex-wrap items-baseline justify-between gap-x-3 text-[13px] font-semibold', has ? 'text-warm-prose' : 'italic text-warm-secondary', enter)} style={delay(shown++)} key={`t${i}`}>
          <span>{has ? [r.topic_no !== null && `Topic ${r.topic_no}`, r.topic].filter(Boolean).join(': ') : 'No topic'}</span>
          {r.topic_id && <code className="font-mono text-[12px] text-warm-secondary">{r.topic_id}</code>}
        </div>,
      );
    }
    const out_ = leaving?.(r);
    out.push(
      <div
        key={keyOf(r, i)}
        style={delay(shown++)}
        className={cn(
          'mt-1.5 grid grid-cols-[28px_minmax(0,1fr)] gap-x-2 gap-y-1 rounded-[14px] bg-muted px-3 py-2.5 transition-[opacity,transform] duration-200 sm:grid-cols-[28px_minmax(0,3fr)_minmax(0,2fr)_auto]',
          out_ ? 'translate-x-4 opacity-0' : enter,
        )}
      >
        <span className="pt-px text-right text-[12px] font-semibold tabular-nums text-warm-label">{r.question_no}</span>
        <span className="text-pretty text-[14px] text-foreground">{r.question}</span>
        <span className="col-start-2 text-[14px] font-bold text-foreground sm:col-start-auto">{r.answer}</span>
        {r.difficulty ? (
          <span className={cn('col-start-2 justify-self-start rounded-full px-2 py-0.5 text-[12px] font-semibold sm:col-start-auto sm:self-start', DIFFICULTY_TONE[r.difficulty])}>
            {r.difficulty}
          </span>
        ) : (
          <span className="hidden sm:block" />
        )}
        {extra && <div className="col-span-full sm:col-start-2">{extra(r)}</div>}
      </div>,
    );
  });
  return <div>{out}</div>;
}
