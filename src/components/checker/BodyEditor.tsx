import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { segmentBody, reassemble, type BodySegment } from '@/lib/math-segments';
import { MathPreview } from './MathPreview';

/* Step 2 Checker, "Fix it": the owner's ask --
 *   "Edit the maths visually: tap the maths and edit it the way it looks,
 *    like a calculator, with buttons for fraction, power and root. No code
 *    on screen. Plain text stays a normal text box."
 *
 * A body is split into ordered text/maths segments (src/lib/math-segments.ts).
 * Each text segment is an auto-growing plain textbox; each maths segment is a
 * tappable "how it looks" preview that opens a small calculator-style editor
 * (MathFieldEditor.tsx, MathLive, lazy-loaded only on tap). "Show code"
 * reveals today's raw textarea for power users; switching back re-segments.
 *
 * D76: reassembling untouched segments is byte-identical to the original
 * body (see math-segments.test.ts). This component never rewrites a segment
 * it did not touch -- a text segment's own value changes only by the
 * checker's own typing, and a maths segment's `inner` changes only when
 * MathFieldEditor reports back a real edit (never on open-and-close). */

const MathFieldEditor = lazy(() => import('./MathFieldEditor'));

export interface BodyEditorProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  textareaClassName?: string;
}

function AutoTextarea({
  value,
  onChange,
  disabled,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={1}
      aria-label={ariaLabel}
      className={cn(
        'w-full resize-none overflow-hidden rounded-2xl bg-muted p-3 text-[16px] leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-70',
        className,
      )}
    />
  );
}

export function BodyEditor({ value, onChange, disabled, textareaClassName }: BodyEditorProps) {
  const initial = useState(() => segmentBody(value))[0];
  const [segments, setSegments] = useState<BodySegment[]>(initial.segments);
  // "Show code" is forced on when the body could not be safely segmented
  // (unbalanced delimiter) -- there is nothing visual to show, and guessing
  // would risk the byte-exact guarantee this whole feature exists to keep.
  const [codeMode, setCodeMode] = useState(initial.fallback);
  const [codeText, setCodeText] = useState(value);
  const [fellBack, setFellBack] = useState(initial.fallback);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function commitSegments(next: BodySegment[]) {
    setSegments(next);
    onChange(reassemble(next));
  }

  function toggleCode() {
    if (!codeMode) {
      // Visual -> code: show exactly the current reassembled text.
      setCodeText(reassemble(segments));
      setCodeMode(true);
      return;
    }
    // Code -> visual: re-segment from whatever the checker typed as code.
    const result = segmentBody(codeText);
    setSegments(result.segments);
    setFellBack(result.fallback);
    onChange(codeText);
    if (!result.fallback) setCodeMode(false);
    // If it's still unbalanced, stay in code mode -- nothing safe to show.
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleCode}
          disabled={disabled || (codeMode && fellBack)}
          className="rounded-full bg-muted px-3 py-1 text-[12px] font-semibold text-warm-secondary transition-transform duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
        >
          {codeMode ? 'Show as maths' : 'Show code'}
        </button>
      </div>

      {fellBack && codeMode ? (
        <p className="mb-2 text-[12px] text-warm-secondary">
          This question has a $ sign that never closes, so it is shown as plain text.
        </p>
      ) : null}

      {codeMode ? (
        <AutoTextarea
          value={codeText}
          onChange={(v) => {
            setCodeText(v);
            onChange(v);
          }}
          disabled={disabled}
          ariaLabel="The question's words, as code"
          className={cn('font-mono text-[14px]', textareaClassName)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {segments.length === 0 ? (
            <AutoTextarea
              value=""
              onChange={(v) => commitSegments([{ kind: 'text', value: v }])}
              disabled={disabled}
              ariaLabel="The question's words"
              className={textareaClassName}
            />
          ) : (
            segments.map((seg, i) =>
              seg.kind === 'text' ? (
                <AutoTextarea
                  key={i}
                  value={seg.value}
                  onChange={(v) => {
                    const next = segments.slice();
                    next[i] = { kind: 'text', value: v };
                    commitSegments(next);
                  }}
                  disabled={disabled}
                  ariaLabel="The question's words"
                  className={textareaClassName}
                />
              ) : (
                <div key={i}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setOpenIndex(i)}
                    aria-label="Tap to edit this maths"
                    className="tap-44 w-full rounded-2xl border-2 border-dashed border-brand/50 bg-brand-subtle px-3 py-2 text-left transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-70"
                  >
                    <MathPreview latex={seg.inner} display={seg.display} className="text-[16px] text-foreground" />
                  </button>
                  {openIndex === i ? (
                    <div className="mt-2">
                      <Suspense
                        fallback={<p className="text-[12px] text-warm-secondary">Loading the maths keypad...</p>}
                      >
                        <MathFieldEditor
                          initialLatex={seg.inner}
                          display={seg.display}
                          onDone={(latex) => {
                            setOpenIndex(null);
                            if (latex === null) return; // untouched: keep original bytes
                            const next = segments.slice();
                            next[i] = { ...seg, inner: latex };
                            commitSegments(next);
                          }}
                          onCancel={() => setOpenIndex(null)}
                        />
                      </Suspense>
                    </div>
                  ) : null}
                </div>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}
