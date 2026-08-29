import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/* Renders a question exactly as the paper set it.

   The bank's `text` is reconstructed byte-exact from the OCR source and is
   never retyped, so nothing here edits a single character. What this does is
   decide how the source's OWN structure should be presented:

   - blank lines separate paragraphs (28 of 41 questions use them)
   - pipe rows are a table (4 questions — a histogram distribution, a frequency
     table; as raw text those were unreadable)
   - dash rows are a list (2 questions)
   - $…$ and $$…$$ are maths

   The one subtle rule is the last. `$$` normally means "display maths on its
   own line", but in this source 9 of the 12 `$$` blocks sit MID-SENTENCE —
   "The given quadratic equation $$3x^2+\\sqrt{7}x+2=0$$ has:". Rendering those
   as display blocks split one sentence into three stacked pieces and left
   "has:" stranded on its own line. So a `$$` run is only given its own block
   when it genuinely occupies its own line; otherwise it renders inline and the
   sentence stays a sentence.

   `throwOnError: false` throughout: the LaTeX is whoever set the paper's, and
   one unsupported macro must degrade to raw source for that span rather than
   blank the question. */

function render(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, { displayMode, throwOnError: false, strict: false, trust: false });
  } catch {
    return '';
  }
}

interface Seg {
  kind: 'text' | 'math';
  value: string;
  display: boolean;
}

/** Split one line-run into text and maths, deciding display vs inline by
 *  whether the maths stands alone on its line. */
function segment(source: string): Seg[] {
  const out: Seg[] = [];
  // All four delimiter forms, because this source uses all four: `\(…\)` alone
  // appears 58 times against 12 `$$` and 6 `$`, so handling only the dollar
  // forms left most of the maths on the page — every matrix option in the
  // MCQs among it — rendering as raw LaTeX source.
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (m.index > last) out.push({ kind: 'text', value: source.slice(last, m.index), display: false });
    // 1 = $$…$$, 2 = \[…\] (both display-capable); 3 = $…$, 4 = \(…\) (inline).
    const isDisplayForm = m[1] !== undefined || m[2] !== undefined;
    const body = m[1] ?? m[2] ?? m[3] ?? m[4];
    // Alone on its line? Look at what sits either side of it on that line.
    const before = source.slice(0, m.index).split('\n').pop() ?? '';
    const after = (source.slice(m.index + m[0].length).split('\n')[0] ?? '');
    const standsAlone = isDisplayForm && before.trim() === '' && after.trim() === '';
    out.push({ kind: 'math', value: body, display: standsAlone });
    last = re.lastIndex;
  }
  if (last < source.length) out.push({ kind: 'text', value: source.slice(last), display: false });
  return out;
}

function Inline({ parts }: { parts: Seg[] }) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === 'text') {
          return (
            <span key={i} className="whitespace-pre-wrap">
              {p.value}
            </span>
          );
        }
        const html = render(p.value, false);
        return html ? (
          <span key={i} className="inline-block max-w-full align-middle" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <span key={i} className="whitespace-pre-wrap">{`$${p.value}$`}</span>
        );
      })}
    </>
  );
}

const isSeparator = (line: string) => /^\s*\|?[\s:|-]*-{2,}[\s:|-]*\|?\s*$/.test(line);
const cells = (line: string) =>
  line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());

function Block({ block }: { block: string }) {
  const lines = block.split('\n');
  const pipeLines = lines.filter((l) => l.trim().startsWith('|'));

  /* A table: pipe rows plus a --- separator. Rendered as a real table because
     these carry the data the question is ABOUT (a frequency distribution is
     the whole question), and as raw pipes they were unreadable. */
  if (pipeLines.length >= 2 && lines.some(isSeparator)) {
    const rows = pipeLines.filter((l) => !isSeparator(l)).map(cells);
    const [head, ...body] = rows;
    return (
      <div className="my-3 -mx-1 overflow-x-auto px-1">
        <table className="w-max min-w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {head.map((c, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap border border-warm-hairline bg-card px-3 py-2 text-left font-bold text-foreground"
                >
                  <Inline parts={segment(c)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className="whitespace-nowrap border border-warm-hairline px-3 py-2 text-foreground"
                  >
                    <Inline parts={segment(c)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* A list: every non-empty line starts with a dash or star. */
  const listItems = lines.filter((l) => l.trim());
  if (listItems.length > 0 && listItems.every((l) => /^\s*[-*]\s+/.test(l))) {
    return (
      <ul className="my-2 grid gap-1.5 pl-1">
        {listItems.map((l, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-warm-label" />
            <span className="min-w-0">
              <Inline parts={segment(l.replace(/^\s*[-*]\s+/, ''))} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  /* Otherwise a paragraph. Display maths inside it still gets its own
     scroller — a long equation is the one thing here that cannot wrap. */
  const parts = segment(block);
  const hasDisplay = parts.some((p) => p.kind === 'math' && p.display);
  if (!hasDisplay) {
    return (
      <p className="[&:not(:first-child)]:mt-2">
        <Inline parts={parts} />
      </p>
    );
  }
  return (
    <div className="[&:not(:first-child)]:mt-2">
      {parts.map((p, i) => {
        if (p.kind === 'math' && p.display) {
          const html = render(p.value, true);
          return html ? (
            <div key={i} className="-mx-1 my-3 overflow-x-auto px-1 py-1" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div key={i} className="my-3 whitespace-pre-wrap font-mono text-[13px] text-warm-secondary">
              {p.value}
            </div>
          );
        }
        return <Inline key={i} parts={[p]} />;
      })}
    </div>
  );
}

export function MathText({ text, className = '' }: { text: string; className?: string }) {
  /* Blank lines are the source's own paragraph breaks. Splitting on them and
     spacing the blocks beats `whitespace-pre-wrap` over the whole string,
     which turned every one into a full empty line of dead space. */
  const blocks = useMemo(
    () => text.split(/\n\s*\n/).map((b) => b.replace(/\s+$/, '')).filter((b) => b.trim() !== ''),
    [text],
  );

  return (
    <div className={className}>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}
