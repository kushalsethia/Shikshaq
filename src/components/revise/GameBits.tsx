import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* What the four games share on screen: the progress bar and the "solved" banner. The colours a matched pair or a
   found word takes are in ./tones.ts. */

export function Progress({ done, total, children }: { done: number; total: number; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className="h-2 min-w-[120px] flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="Progress"
      >
        <span className="block h-full origin-left rounded-full bg-mint-solid transition-transform duration-300 ease-out" style={{ transform: `scaleX(${total ? done / total : 0})` }} />
      </div>
      <span className="text-[13px] tabular-nums text-warm-secondary">
        {done} of {total}
      </span>
      {children}
    </div>
  );
}

export function Solved({ text, onNext }: { text: string; onNext: () => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[20px] bg-mint px-4 py-3 animate-in fade-in-0 zoom-in-95 duration-300" role="status">
      <span className="flex h-9 w-9 flex-none animate-pop items-center justify-center rounded-full bg-mint-solid text-foreground">
        <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
      </span>
      <b className="flex-1 text-[15px] text-foreground">{text}</b>
      <Button type="button" variant="dark" size={44} onClick={onNext}>
        Next puzzle
      </Button>
    </div>
  );
}
