import { useState } from 'react';
import { Check } from 'lucide-react';
import type { FillIn } from '@/lib/games/fill';
import { sameAnswer } from '@/lib/games/shared';
import { CHIP } from '@/lib/checker-button-styles';
import { cn } from '@/lib/utils';
import { Progress, Solved } from './GameBits';

/* Fill in the blank: type in the gap, then Enter. "Show answer" appears after two wrong tries. */

export function FillGame({ g, onNext }: { g: FillIn; onNext: () => void }) {
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [state, setState] = useState<Record<string, 'right' | 'wrong' | 'shown'>>({});
  const [tries, setTries] = useState<Record<string, number>>({});
  const check = (id: string, answer: string) => {
    const v = typed[id] ?? '';
    if (!v.trim() || state[id] === 'right' || state[id] === 'shown') return;
    if (sameAnswer(v, answer)) setState((s) => ({ ...s, [id]: 'right' }));
    else {
      setState((s) => ({ ...s, [id]: 'wrong' }));
      setTries((t) => ({ ...t, [id]: (t[id] ?? 0) + 1 }));
    }
  };
  const solved = g.rows.filter((r) => state[r.id] === 'right' || state[r.id] === 'shown').length;
  const right = g.rows.filter((r) => state[r.id] === 'right').length;

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-warm-secondary">Type the missing word or words, then press Enter.</p>
      <Progress done={solved} total={g.rows.length}>
        <button type="button" className={cn(CHIP, 'bg-muted text-foreground')} onClick={() => g.rows.forEach((r) => check(r.id, r.answer))}>
          Check all
        </button>
      </Progress>
      <ol className="space-y-2">
        {g.rows.map((r, i) => {
          const st = state[r.id];
          const locked = st === 'right' || st === 'shown';
          return (
            <li
              key={r.id}
              className={cn(
                'flex flex-wrap items-center gap-x-1.5 gap-y-2 rounded-[14px] px-3.5 py-3 text-[15px] leading-[1.7] text-foreground transition-colors duration-200',
                st === 'right' ? 'bg-mint' : st === 'shown' ? 'bg-brand-subtle' : 'bg-muted',
              )}
            >
              <span className="mr-1 text-[12px] font-semibold tabular-nums text-warm-label">{i + 1}.</span>
              {r.before ? <span>{r.before}</span> : null}
              <input
                type="text"
                aria-label={`Answer ${i + 1}`}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                key={`${st}${tries[r.id] ?? 0}`}
                style={{ width: `${Math.min(26, Math.max(7, r.answer.length + 2))}ch` }}
                value={st === 'shown' ? r.answer : typed[r.id] ?? ''}
                readOnly={locked}
                onChange={(e) => {
                  setTyped((t) => ({ ...t, [r.id]: e.target.value }));
                  if (st === 'wrong') {
                    setState((s) => {
                      const n = { ...s };
                      delete n[r.id];
                      return n;
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') check(r.id, r.answer);
                }}
                onBlur={() => check(r.id, r.answer)}
                className={cn(
                  'h-9 max-w-full rounded-[10px] border-0 bg-card px-2 text-[16px] font-semibold text-foreground outline-none transition-shadow duration-150 focus-visible:shadow-[inset_0_0_0_2px_hsl(var(--brand-blue))]',
                  st === 'wrong' && 'revise-shake shadow-[inset_0_0_0_2px_hsl(var(--destructive))]',
                  st === 'right' && 'shadow-[inset_0_0_0_2px_hsl(var(--brand-blue))]',
                )}
              />
              {r.after ? <span>{r.after}</span> : null}
              {st === 'right' ? (
                <span className="inline-flex h-6 w-6 animate-pop items-center justify-center rounded-full bg-mint-solid text-foreground" aria-label="Right">
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </span>
              ) : null}
              {st === 'wrong' && (tries[r.id] ?? 0) >= 2 ? (
                <button type="button" className={cn(CHIP, 'bg-card text-foreground')} onClick={() => setState((s) => ({ ...s, [r.id]: 'shown' }))}>
                  Show answer
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>
      {solved === g.rows.length ? <Solved text={`${right} of ${g.rows.length} right without help.`} onNext={onNext} /> : null}
    </div>
  );
}
