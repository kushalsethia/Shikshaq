import { useEffect, useRef, type ReactNode } from 'react';
import { BOARDS, MAX_NAME, MAX_NO, STATES, SUBJECTS } from '@/lib/game-questions/details';
import { MAX_ANSWER, MAX_QUESTION } from '@/lib/game-questions/format';
import { cn } from '@/lib/utils';

/* How to write questions for /questions: for people. Chatbots get their own instructions in the page's prerendered
   HTML (src/content/game-question-instructions.html). The code lists and limits come from the code, so they can't
   drift. Cards fade up the first time they scroll into view. */

const CODE = 'rounded-[6px] bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground';

function Card({ title, wide, children }: { title: string; wide?: boolean; children: ReactNode }) {
  return (
    <article
      data-guide-card=""
      className={cn(
        'min-w-0 rounded-[20px] bg-card p-5 opacity-0 transition-[opacity,transform] duration-300 ease-out motion-safe:translate-y-3 [&.seen]:translate-y-0 [&.seen]:opacity-100',
        wide && 'md:col-span-2',
      )}
    >
      <h3 className="text-balance text-[17px] font-bold text-foreground">{title}</h3>
      <div className="mt-2 space-y-2 text-pretty text-[14px] leading-[1.6] text-warm-prose">{children}</div>
    </article>
  );
}

export function Guide() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const cards = [...(ref.current?.querySelectorAll<HTMLElement>('[data-guide-card]') ?? [])];
    cards.forEach((c, i) => (c.style.transitionDelay = `${(i % 3) * 60}ms`));
    if (typeof IntersectionObserver === 'undefined') {
      cards.forEach((c) => c.classList.add('seen'));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('seen');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="guide" tabIndex={-1} ref={ref} aria-labelledby="guide-h" className="scroll-mt-24 focus:outline-none">
      <h2 id="guide-h" className="text-balance font-display text-[24px] font-extrabold tracking-[-0.03em] text-foreground">
        How to write your questions
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card title="The format" wide>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>
              <b>Fill in Board, Class, Subject and Chapter.</b> They are written at the top of the Questions box for you, and you can edit them in
              either place.
            </li>
            <li>
              <b>Add a Topic line, then one question per line:</b> the question, a bar <code className={CODE}>|</code>, then the answer. To say how
              hard it is, add another bar and <i>easy</i>, <i>medium</i> or <i>hard</i>.
            </li>
            <li>
              <b>Fix anything underlined</b>, check the table, then <b>send it for approval</b> (or download it). Your HOD approves it; only approved
              questions are used in the games.
            </li>
          </ol>
          <pre data-guide-sample="" className="overflow-x-auto rounded-[14px] bg-muted p-3 font-mono text-[13px] leading-[1.6] text-foreground">{`Board: CBSE
Class: 10
Subject: Science
Chapter 1: Chemical Reactions and Equations
Topic 1: Chemical Equations
Law that requires a chemical equation to be balanced | Law of conservation of mass | medium
Equation with the same number of atoms of each element on both sides | Balanced equation
Topic 2: Types of Chemical Reactions
Reaction in which a single reactant breaks down into simpler products | Decomposition reaction | easy`}</pre>
        </Card>

        <Card title="Detail lines">
          <p>Each one applies to every question below it, until it is changed.</p>
          <dl className="space-y-1.5">
            <dt><code className={CODE}>Board: CBSE</code></dt>
            <dd className="pl-3">CBSE, ICSE, ISC, IB, IGCSE, Cambridge, NIOS, or a state board such as <i>Maharashtra</i>.</dd>
            <dt><code className={CODE}>Class: 10</code></dt>
            <dd className="pl-3">1 to 12.</dd>
            <dt><code className={CODE}>Subject: Chemistry</code></dt>
            <dd className="pl-3">The subject's full name.</dd>
            <dt><code className={CODE}>Chapter 3: Acids, Bases and Salts</code></dt>
            <dd className="pl-3">Number and name, as in the textbook.</dd>
            <dt><code className={CODE}>Topic 2: Indicators</code></dt>
            <dd className="pl-3">Number and name, as in the textbook. Its questions go under it.</dd>
          </dl>
          <p className="text-[13px] text-warm-secondary">
            Names are capitalised for you: <i>acids, bases and salts</i> becomes <i>Acids, Bases and Salts</i>. Questions and answers are never changed.
          </p>
        </Card>

        <Card title="Writing good questions">
          <ul className="list-disc space-y-1.5 pl-5">
            <li><b>One fact per question</b>, with exactly one correct answer.</li>
            <li><b>Short answers:</b> a word, a short phrase or a number (at most {MAX_ANSWER} characters). Puzzles need them short.</li>
            <li><b>Questions that stand alone:</b> no <i>this</i>, <i>the above</i> or <i>as mentioned</i>. At most {MAX_QUESTION} characters.</li>
            <li>
              <b>Fill in the blank:</b> write <code className={CODE}>___</code> where the answer goes:{' '}
              <code className={CODE}>The ___ is the powerhouse of the cell | Mitochondria</code>.
            </li>
            <li><b>No <code className={CODE}>|</code> inside</b> a question or answer: it separates them. Use <code className={CODE}>/</code>.</li>
            <li><b>No repeats:</b> the same question twice in a chapter is left out.</li>
          </ul>
        </Card>

        <Card title="Underlines and warnings">
          <p>
            <span className="rounded-[2px] bg-destructive/15 px-1 font-semibold underline decoration-destructive decoration-wavy underline-offset-2">Red</span>: the line is{' '}
            <b>left out</b>. It has no answer, no question, an empty part, too many parts, is too long, is a repeat, or the class is not 1 to 12.
          </p>
          <p>
            <span className="rounded-[2px] bg-brand/20 px-1 font-semibold underline decoration-brand decoration-wavy underline-offset-2">Amber</span>: the line is{' '}
            <b>kept, but check it</b>. An unknown board or subject, a chapter with no number, a topic with no questions, a detail set twice, or the same
            chapter number with two different names.
          </p>
          <p className="text-[13px] text-warm-secondary">
            You can write first: a line is only checked once you move on from it, and a box once you leave it or pause. Put the cursor on an underlined
            line to see why, or click a line number in the list.
          </p>
        </Card>

        <Card title="Chapter and topic IDs">
          <p>Every question gets the ID of its chapter and topic, made from the details, so the same chapter always gets the same ID:</p>
          <p className="flex flex-wrap gap-1" aria-label="CBSE, class 10, Science, chapter 1, topic 2">
            {[
              ['CBSE', 'board'],
              ['10', 'class'],
              ['SCI', 'subject'],
              ['01', 'chapter'],
              ['T02', 'topic'],
            ].map(([code, what]) => (
              <span key={what} className="flex flex-col items-center rounded-[10px] bg-muted px-2.5 py-1.5" aria-hidden="true">
                <b className="font-mono text-[15px] text-brand-blue-deep">{code}</b>
                <span className="text-[12px] text-warm-secondary">{what}</span>
              </span>
            ))}
          </p>
          <p className="text-[13px] text-warm-secondary">
            A question needs a board, class, subject and chapter number to get a chapter ID, and a topic number too for a topic ID. Chapter and topic
            numbers go up to {MAX_NO}; names up to {MAX_NAME} characters.
          </p>
          <details className="group rounded-[12px] bg-muted px-3 py-2">
            <summary className="cursor-pointer text-[14px] font-semibold text-foreground">Board codes</summary>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
              {BOARDS.map((b) => (
                <span key={b.code}><b className="font-mono">{b.code}</b> {b.name}</span>
              ))}
              {STATES.map((s) => (
                <span key={s.code}><b className="font-mono">{s.code}</b> {s.name}</span>
              ))}
            </p>
          </details>
          <details className="group rounded-[12px] bg-muted px-3 py-2">
            <summary className="cursor-pointer text-[14px] font-semibold text-foreground">Subject codes</summary>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
              {SUBJECTS.map((s) => (
                <span key={s.code}><b className="font-mono">{s.code}</b> {s.name}</span>
              ))}
            </p>
            <p className="mt-1 text-[13px] text-warm-secondary">Any other subject gets a code made from its name. Spell it the same way every time.</p>
          </details>
        </Card>

        <Card title="Starting from notes">
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Press <b>Copy chatbot prompt</b>.</li>
            <li>Paste it into ChatGPT, Gemini or Claude, and add your notes, or just the class, subject and chapter.</li>
            <li>Paste its reply into the Questions box, and check the answers before you use them.</li>
          </ol>
        </Card>
      </div>
    </section>
  );
}
