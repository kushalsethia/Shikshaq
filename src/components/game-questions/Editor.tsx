import { Fragment, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { lineLevels, type Issue } from '@/lib/game-questions/format';
import { cn } from '@/lib/utils';
import './editor.css';

/**
 * The Questions box. A textarea can't style parts of its text, so a copy of the text sits behind it with the same font,
 * padding and width: the copy is invisible except for the underlines on lines with a problem. The two scroll together.
 * Moving the cursor onto an underlined line shows why it is underlined, in the note under the box.
 */
export function Editor({
  value,
  onChange,
  onPaste,
  onTyping,
  issues,
  boxRef,
  caret,
  setCaret,
}: {
  value: string;
  onChange: (v: string) => void;
  onPaste: () => void;
  /** The line just typed on (null when the box is left): problems there wait until the cursor moves on. */
  onTyping: (line: number | null) => void;
  issues: Issue[];
  boxRef: RefObject<HTMLTextAreaElement>;
  /** The line the cursor is on (set from outside too, when a listed problem is clicked). */
  caret: number;
  setCaret: (line: number) => void;
}) {
  const back = useRef<HTMLDivElement>(null);
  const pasted = useRef(false); // a paste is finished text: check all of it at once

  const sync = () => {
    const ta = boxRef.current;
    const b = back.current;
    if (!ta || !b) return;
    (b.firstElementChild as HTMLElement).style.width = `${ta.clientWidth}px`; // excludes the textarea's scrollbar
    b.scrollTop = ta.scrollTop;
    b.scrollLeft = ta.scrollLeft;
  };
  useLayoutEffect(sync);
  useEffect(() => {
    const ta = boxRef.current;
    if (!ta || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(ta);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lineOf = (ta: HTMLTextAreaElement) => ta.value.slice(0, ta.selectionStart).split('\n').length;
  const onCaret = (ta: HTMLTextAreaElement) => setCaret(lineOf(ta));
  const levels = lineLevels(issues);
  const here = issues.filter((x) => x.line === caret);
  const errors = issues.filter((x) => x.level === 'error').length;
  const hereLevel = here.length ? (here.some((x) => x.level === 'error') ? 'error' : 'warn') : null;

  return (
    <>
      <div className="gq-editor">
        <div className="gq-backdrop" ref={back} aria-hidden="true">
          <div className="gq-backdrop-in">
            {value.split('\n').map((l, i) => {
              const level = levels.get(i + 1);
              const body = l.trim();
              const nl = i > 0 ? '\n' : '';
              if (!level || !body) return <Fragment key={i}>{nl}{l}</Fragment>;
              const lead = l.slice(0, l.indexOf(body[0]));
              return (
                <Fragment key={i}>
                  {nl}
                  {lead}
                  <span className={`gq-mark ${level}`}>{body}</span>
                  {l.slice(lead.length + body.length)}
                </Fragment>
              );
            })}
            {/* keeps an empty last line as tall as the textarea draws it */}
            {'​'}
          </div>
        </div>
        <textarea
          id="gq-questions"
          ref={boxRef}
          spellCheck={false}
          value={value}
          aria-invalid={errors > 0}
          aria-describedby="gq-caret-note"
          onChange={(e) => {
            onChange(e.target.value);
            if (pasted.current) {
              pasted.current = false;
              onCaret(e.target);
              onTyping(null);
            } else onTyping(lineOf(e.target));
          }}
          onPaste={() => {
            pasted.current = true;
            onPaste();
          }}
          onFocus={(e) => onCaret(e.currentTarget)}
          onBlur={() => onTyping(null)}
          onScroll={sync}
          onSelect={(e) => onCaret(e.currentTarget)}
          onClick={(e) => onCaret(e.currentTarget)}
          onKeyUp={(e) => onCaret(e.currentTarget)}
          placeholder={'One question per line, like this:\n\nTopic 1: Chemical Equations\nQuestion | Answer\nQuestion | Answer | easy'}
        />
      </div>
      <p
        id="gq-caret-note"
        aria-live="polite"
        className={cn(
          'mt-2 min-h-[44px] rounded-[12px] px-3 py-2 text-[13px] leading-[1.5] transition-colors duration-150',
          hereLevel === 'error' ? 'bg-destructive/10 text-foreground' : hereLevel === 'warn' ? 'bg-brand-subtle text-foreground' : 'text-warm-secondary',
        )}
      >
        {here.length ? (
          <span key={`l${caret}`} className="animate-in fade-in-0 duration-150">
            <b>Line {caret}:</b> {here.map((x) => x.text).join(' ')}
          </span>
        ) : issues.length ? (
          <span key="hint" className="animate-in fade-in-0 duration-150">
            <span className="rounded-[2px] bg-destructive/15 px-1 font-semibold underline decoration-destructive decoration-wavy underline-offset-2">Red</span> lines are left out.{' '}
            <span className="rounded-[2px] bg-brand/20 px-1 font-semibold underline decoration-brand decoration-wavy underline-offset-2">Amber</span> lines are kept, but check them. Put the cursor on one to see why.
          </span>
        ) : (
          ' '
        )}
      </p>
    </>
  );
}
