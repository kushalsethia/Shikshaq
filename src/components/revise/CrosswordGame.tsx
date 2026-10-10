import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { Crossword } from '@/lib/games/crossword';
import { CHIP } from '@/lib/checker-button-styles';
import { cn } from '@/lib/utils';
import { Progress, Solved } from './GameBits';

/* Crossword: tap a square and type (a hidden input catches keys and phone keyboards), Backspace, arrows, Enter for
   the next clue, tap again to switch between across and down, Check, Reveal word. */

type Cell = [number, number];
type Clue = Crossword['clues'][number];

export function CrosswordGame({ g, onNext }: { g: Crossword; onNext: () => void }) {
  const blank = () => g.grid.map((row) => [...row].map((ch) => (ch === '#' ? '#' : '')));
  const [letters, setLetters] = useState<string[][]>(blank);
  const [cur, setCur] = useState<{ r: number; c: number; dir: 'across' | 'down' }>(() => ({ r: g.clues[0].row, c: g.clues[0].col, dir: g.clues[0].dir }));
  const [checked, setChecked] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const numberAt = useMemo(() => new Map(g.clues.map((cl) => [`${cl.row},${cl.col}`, cl.n])), [g.clues]);
  const cellsOfClue = (cl: Clue): Cell[] => Array.from({ length: cl.answer.length }, (_, i) => (cl.dir === 'across' ? [cl.row, cl.col + i] : [cl.row + i, cl.col]));
  const clueAt = (r: number, c: number, dir: 'across' | 'down') => g.clues.find((cl) => cl.dir === dir && cellsOfClue(cl).some(([y, x]) => y === r && x === c));
  const clue = clueAt(cur.r, cur.c, cur.dir) ?? clueAt(cur.r, cur.c, cur.dir === 'across' ? 'down' : 'across')!;
  const inWord = new Set(cellsOfClue(clue).map(([y, x]) => `${y},${x}`));
  const done = g.grid.every((row, r) => [...row].every((ch, c) => ch === '#' || letters[r][c] === ch));

  // keeps the keyboard open on the square being typed in, without scrolling the page to the hidden input
  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, [cur]);

  const select = (r: number, c: number) => {
    if (g.grid[r][c] === '#') return;
    const both = clueAt(r, c, 'across') && clueAt(r, c, 'down');
    const dir =
      r === cur.r && c === cur.c && both ? (cur.dir === 'across' ? 'down' : 'across') : clueAt(r, c, cur.dir) ? cur.dir : clueAt(r, c, 'across') ? 'across' : 'down';
    setCur({ r, c, dir });
  };
  const step = (by: 1 | -1) => {
    const cells = cellsOfClue(clue);
    const i = cells.findIndex(([y, x]) => y === cur.r && x === cur.c);
    const next = cells[i + by];
    if (next) setCur({ r: next[0], c: next[1], dir: clue.dir });
  };
  const type = (ch: string) => {
    if (done) return;
    setLetters((L) => L.map((row, r) => row.map((v, c) => (r === cur.r && c === cur.c ? ch : v))));
    setChecked(false);
    if (ch) step(1);
  };
  const jump = (cl: Clue) => setCur({ r: cl.row, c: cl.col, dir: cl.dir });
  const reveal = (cells: Cell[]) => setLetters((L) => L.map((row, r) => row.map((v, c) => (cells.some(([y, x]) => y === r && x === c) ? g.grid[r][c] : v))));

  const keys = (e: KeyboardEvent) => {
    if (/^[a-z]$/i.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      type(e.key.toUpperCase());
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (letters[cur.r][cur.c]) {
        type('');
        return;
      }
      // on an empty square, go back one and clear that one
      const cells = cellsOfClue(clue);
      const prev = cells[cells.findIndex(([y, x]) => y === cur.r && x === cur.c) - 1];
      if (!prev) return;
      setCur({ r: prev[0], c: prev[1], dir: clue.dir });
      setLetters((L) => L.map((row, r) => row.map((v, c) => (r === prev[0] && c === prev[1] ? '' : v))));
    } else if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      const [dr, dc] = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key as 'ArrowUp']!;
      const r = cur.r + dr;
      const c = cur.c + dc;
      if (g.grid[r]?.[c] && g.grid[r][c] !== '#') setCur({ r, c, dir: dr ? 'down' : 'across' });
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const i = g.clues.indexOf(clue);
      jump(g.clues[(i + (e.shiftKey ? g.clues.length - 1 : 1)) % g.clues.length]);
    }
  };

  const filled = g.clues.filter((cl) => cellsOfClue(cl).every(([y, x]) => letters[y][x] === g.grid[y][x])).length;

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-warm-secondary">Tap a square and type. Tap it again to switch between across and down.</p>
      <Progress done={filled} total={g.clues.length}>
        <button type="button" className={cn(CHIP, 'bg-muted text-foreground')} onClick={() => setChecked(true)}>
          Check
        </button>
        <button type="button" className={cn(CHIP, 'bg-muted text-foreground')} onClick={() => reveal(cellsOfClue(clue))}>
          Reveal word
        </button>
      </Progress>
      <p className="sticky top-[76px] z-10 rounded-[16px] bg-panel px-4 py-3 text-[15px] text-background shadow-lg lg:top-[84px]" aria-live="polite">
        <b className="text-brand">
          {clue.n} {clue.dir}
        </b>{' '}
        {clue.clue} <span className="text-background/60">{clue.enumeration}</span>
      </p>
      <div className="flex flex-wrap items-start gap-5">
        <div className="relative max-w-full flex-none overflow-x-auto">
          <div className="revise-cw-grid" style={{ '--cols': g.cols } as CSSProperties} onClick={() => input.current?.focus({ preventScroll: true })}>
            {g.grid.map((row, r) =>
              [...row].map((ch, c) => {
                const k = `${r},${c}`;
                if (ch === '#') return <span key={k} className="revise-cw-cell block" />;
                const v = letters[r][c];
                const bad = checked && v && v !== ch;
                const here = r === cur.r && c === cur.c;
                return (
                  <button
                    key={k}
                    type="button"
                    data-r={r}
                    data-c={c}
                    aria-label={`Row ${r + 1}, column ${c + 1}${v ? `, ${v}` : ''}`}
                    className={cn(
                      'revise-cw-cell focus-visible:outline-none',
                      done ? 'bg-mint text-foreground' : here ? 'bg-brand-blue text-brand-blue-foreground' : inWord.has(k) ? 'bg-brand-blue-subtle text-foreground' : 'bg-card text-foreground',
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      select(r, c);
                    }}
                  >
                    {numberAt.has(k) ? <span className={cn('revise-cw-n', here && !done ? 'text-brand-blue-foreground/80' : 'text-warm-secondary')}>{numberAt.get(k)}</span> : null}
                    <span className={cn(bad && (here ? 'text-white line-through' : 'text-destructive line-through'))}>{v}</span>
                  </button>
                );
              }),
            )}
          </div>
          <input
            ref={input}
            className="revise-cw-input"
            aria-label="Type a letter"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            value=""
            onKeyDown={keys}
            onChange={(e) => {
              const ch = e.target.value.slice(-1);
              if (/^[a-z]$/i.test(ch)) type(ch.toUpperCase());
            }}
          />
        </div>
        <div className="flex min-w-[260px] flex-1 flex-col gap-3">
          {(['across', 'down'] as const).map((dir) => (
            <div key={dir}>
              <h4 className="mb-1 text-[12px] font-bold uppercase tracking-[0.04em] text-warm-label">{dir === 'across' ? 'Across' : 'Down'}</h4>
              <ol className="flex flex-col gap-0.5">
                {g.clues
                  .filter((cl) => cl.dir === dir)
                  .map((cl) => {
                    const ok = cellsOfClue(cl).every(([y, x]) => letters[y][x] === g.grid[y][x]);
                    return (
                      <li key={`${cl.n}${dir}`}>
                        <button
                          type="button"
                          data-n={cl.n}
                          data-dir={dir}
                          onClick={() => jump(cl)}
                          className={cn(
                            'min-h-11 w-full rounded-[10px] px-2.5 py-1.5 text-left text-[15px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                            cl === clue ? 'bg-brand-blue-subtle' : 'hover:bg-muted',
                            ok ? 'text-success' : 'text-foreground',
                          )}
                        >
                          <b className="mr-1.5">{cl.n}</b>
                          {cl.clue} <span className="text-warm-secondary">{cl.enumeration}</span>
                        </button>
                      </li>
                    );
                  })}
              </ol>
            </div>
          ))}
        </div>
      </div>
      {done ? <Solved text="Crossword complete!" onNext={onNext} /> : null}
    </div>
  );
}
