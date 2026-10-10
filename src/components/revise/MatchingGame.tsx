import { useState } from 'react';
import type { Matching } from '@/lib/games/matching';
import { cn } from '@/lib/utils';
import { Progress, Solved } from './GameBits';
import { PAIR_SOLID, plural } from './tones';

/* Matching: tap a question, then its answer (either side first). A wrong pair shakes; a right one takes a colour. */

export function MatchingGame({ g, onNext }: { g: Matching; onNext: () => void }) {
  const [sel, setSel] = useState<{ side: 'left' | 'right'; id: string } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const pick = (side: 'left' | 'right', id: string) => {
    if (matched.includes(id) && side === 'left') return;
    if (!sel || sel.side === side) {
      setSel(sel?.side === side && sel.id === id ? null : { side, id });
      return;
    }
    if (sel.id === id) setMatched([...matched, id]);
    else {
      setWrong([`${sel.side}:${sel.id}`, `${side}:${id}`]);
      setMistakes((m) => m + 1);
      setTimeout(() => setWrong([]), 450);
    }
    setSel(null);
  };
  const tone = (side: 'left' | 'right', id: string) => {
    const n = matched.indexOf(id);
    if (n >= 0) return PAIR_SOLID[n % PAIR_SOLID.length];
    if (wrong.includes(`${side}:${id}`)) return 'revise-shake bg-destructive/10 shadow-[inset_0_0_0_2px_hsl(var(--destructive))] text-foreground';
    if (sel?.side === side && sel.id === id) return 'bg-brand-blue-subtle shadow-[inset_0_0_0_2px_hsl(var(--brand-blue))] text-foreground';
    return 'bg-card text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))] hover:shadow-[inset_0_0_0_1px_hsl(var(--brand-blue))]';
  };
  const done = matched.length === g.left.length;

  const column = (side: 'left' | 'right', label: string, items: { id: string; text: string }[]) => (
    <ul aria-label={label} className="flex flex-col gap-2">
      {items.map((x) => (
        <li key={x.id}>
          <button
            type="button"
            data-id={x.id}
            aria-pressed={sel?.side === side && sel.id === x.id}
            disabled={matched.includes(x.id)}
            onClick={() => pick(side, x.id)}
            className={cn(
              'min-h-[52px] w-full rounded-[14px] px-3.5 py-2.5 text-left text-[15px] transition-[background-color,box-shadow,color,transform] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default disabled:active:scale-100',
              side === 'right' ? 'font-bold' : 'font-medium',
              tone(side, x.id),
            )}
          >
            {x.text}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-warm-secondary">Tap a question, then its answer.</p>
      <Progress done={matched.length} total={g.left.length} />
      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3">
        {column('left', 'Questions', g.left)}
        {column('right', 'Answers', g.right)}
      </div>
      {done ? (
        <Solved text={mistakes ? `All matched, with ${plural(mistakes, 'wrong try', 'wrong tries')}.` : 'All matched, first time!'} onNext={onNext} />
      ) : null}
    </div>
  );
}
