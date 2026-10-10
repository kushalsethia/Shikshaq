import { useMemo, useRef, useState, type CSSProperties } from 'react';
import type { WordSearch } from '@/lib/games/wordsearch';
import { cn } from '@/lib/utils';
import { Progress, Solved } from './GameBits';
import { PAIR_TINT } from './tones';

/* Word search: drag across a word, or tap its first and last letter. Words read forwards: across, down or diagonally. */

type Cell = [number, number];
const cellsOf = (w: WordSearch['words'][number]): Cell[] => Array.from({ length: w.word.length }, (_, i) => [w.row + w.dr * i, w.col + w.dc * i]);
const sameCells = (a: Cell[], b: Cell[]) =>
  a.length === b.length &&
  (a.every((c, i) => c[0] === b[i][0] && c[1] === b[i][1]) || a.every((c, i) => c[0] === b[b.length - 1 - i][0] && c[1] === b[b.length - 1 - i][1]));

/** A straight line of cells from `a` towards `b`, snapped to the nearest of the eight directions. */
function line(a: Cell, b: Cell, n: number): Cell[] {
  const dr = b[0] - a[0];
  const dc = b[1] - a[1];
  if (!dr && !dc) return [a];
  const oct = Math.round(Math.atan2(dr, dc) / (Math.PI / 4));
  const sr = Math.round(Math.sin((oct * Math.PI) / 4));
  const sc = Math.round(Math.cos((oct * Math.PI) / 4));
  let len = Math.max(Math.abs(dr), Math.abs(dc));
  while (len > 0 && (a[0] + sr * len < 0 || a[0] + sr * len >= n || a[1] + sc * len < 0 || a[1] + sc * len >= n)) len--;
  return Array.from({ length: len + 1 }, (_, i) => [a[0] + sr * i, a[1] + sc * i]);
}

export function WordSearchGame({ g, onNext }: { g: WordSearch; onNext: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const [path, setPath] = useState<Cell[]>([]);
  const [anchor, setAnchor] = useState<Cell | null>(null); // first tap of a tap-tap selection
  const [miss, setMiss] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const drag = useRef<Cell | null>(null);
  const moved = useRef(false);

  const color = useMemo(() => {
    const m = new Map<string, number>();
    found.forEach((id, i) => {
      for (const c of cellsOf(g.words.find((w) => w.id === id)!)) m.set(`${c[0]},${c[1]}`, i % PAIR_TINT.length);
    });
    return m;
  }, [found, g.words]);
  const onPath = new Set(path.map((c) => `${c[0]},${c[1]}`));

  const cellAt = (x: number, y: number): Cell | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-r]');
    return el ? [Number(el.dataset.r), Number(el.dataset.c)] : null;
  };
  const finish = (cells: Cell[]) => {
    const hit = g.words.find((w) => !found.includes(w.id) && sameCells(cellsOf(w), cells));
    if (hit) setFound((f) => [...f, hit.id]);
    else if (cells.length > 1) {
      setMiss(true);
      setTimeout(() => setMiss(false), 400);
    }
    setPath([]);
  };

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-warm-secondary">Drag across a word, or tap its first and last letter. Words read forwards: across, down or diagonally.</p>
      <Progress done={found.length} total={g.words.length}>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[13px] font-semibold text-warm-prose">
          <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--brand-blue))]" checked={showWords} onChange={(e) => setShowWords(e.target.checked)} />
          Show the words
        </label>
      </Progress>
      <div className="flex flex-wrap items-start gap-5">
        <div
          className={cn('revise-ws-grid', miss && 'revise-shake')}
          style={{ '--n': g.size } as CSSProperties}
          role="grid"
          aria-label="Word search"
          onPointerDown={(e) => {
            const c = cellAt(e.clientX, e.clientY);
            if (!c) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            moved.current = false;
            if (anchor) {
              drag.current = anchor;
              setPath(line(anchor, c, g.size));
              setAnchor(null);
              moved.current = true;
              return;
            }
            drag.current = c;
            setPath([c]);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const c = cellAt(e.clientX, e.clientY);
            if (!c) return;
            const p = line(drag.current, c, g.size);
            if (p.length > 1) moved.current = true;
            setPath(p);
          }}
          onPointerUp={() => {
            if (!drag.current) return;
            const start = drag.current;
            drag.current = null;
            if (!moved.current) {
              setAnchor(start); // a tap: wait for the last letter
              return;
            }
            finish(path);
          }}
        >
          {g.grid.map((row, r) =>
            [...row].map((ch, c) => {
              const k = `${r},${c}`;
              const col = color.get(k);
              const lit = onPath.has(k) || (anchor && anchor[0] === r && anchor[1] === c);
              return (
                <span
                  key={k}
                  data-r={r}
                  data-c={c}
                  role="gridcell"
                  className={cn(
                    'revise-ws-cell',
                    lit ? 'bg-brand-blue text-brand-blue-foreground' : col !== undefined ? PAIR_TINT[col] : 'text-foreground hover:bg-muted',
                  )}
                >
                  {ch}
                </span>
              );
            }),
          )}
        </div>
        <ol className="min-w-[240px] flex-1 list-decimal space-y-1.5 pl-6 text-[15px] text-foreground marker:text-warm-label">
          {g.words.map((w) => {
            const got = found.includes(w.id);
            return (
              <li key={w.id} className={cn('transition-colors duration-200', got && 'text-warm-secondary')}>
                {showWords || got ? (
                  <b className={cn('font-mono', got && 'text-success line-through')}>{w.word}</b>
                ) : (
                  <span>
                    {w.clue} <span className="text-warm-secondary">({w.word.length})</span>
                  </span>
                )}
                {got && !showWords ? <span className="text-warm-secondary"> · {w.clue}</span> : null}
              </li>
            );
          })}
        </ol>
      </div>
      {found.length === g.words.length ? <Solved text="All words found!" onNext={onNext} /> : null}
    </div>
  );
}
