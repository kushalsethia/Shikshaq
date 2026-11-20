import { useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { MathText } from '@/components/papers/math-text';
import { OptionList } from '@/components/checker/OptionList';
import { quietButton } from '@/components/hod/HodShared';
import { assembleQuestionContext, contextHeading, partLabel } from '@/lib/checker-context';
import type { HodApi } from '@/lib/hod-api';
import { cn } from '@/lib/utils';

/* The whole question a part belongs to, on the HOD desk (owner, 20 Nov 2026: "when a question has been sent to the
   HOD, they should be able to see the full parts and everything ... if I just see 34 part 1 part 2, it doesn't make
   sense"). It shows the lead-in (the shared words above the parts) and every part in paper order, with the part the
   HOD was sent marked. Read only: it never changes a word. A question that stands alone says so. */

export const QUESTION_CONTEXT_KEY = (questionId: string) => ['hod', 'question-context', questionId] as const;

export function WholeQuestion({
  api,
  questionId,
  defaultOpen = false,
}: {
  api: Pick<HodApi, 'questionContext'>;
  questionId: string;
  /** Open at once (used when the question is known to be a part of a bigger one). */
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const query = useQuery({
    queryKey: QUESTION_CONTEXT_KEY(questionId),
    queryFn: () => api.questionContext(questionId),
    enabled: open,
    staleTime: 60_000,
    retry: false,
  });

  const rows = query.data ?? [];
  const ctx = assembleQuestionContext(rows, questionId);
  const extras = new Map(rows.map((r) => [r.id, r] as const));

  return (
    <div className="mb-2" data-testid="whole-question-block">
      <button
        type="button"
        className={cn(quietButton, 'h-[40px] gap-1.5 px-4 text-[13px]')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide the whole question' : 'Show the whole question'}
        <ChevronDown aria-hidden className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div id={panelId} className="mt-2 rounded-2xl bg-card p-3" data-testid="whole-question">
          {query.isLoading ? (
            <p className="text-[13px] text-warm-secondary">Loading the whole question...</p>
          ) : query.isError ? (
            <div role="alert" className="text-[13px] text-destructive">
              <p>The other parts could not be loaded.</p>
              <button type="button" className={cn(quietButton, 'mt-2 h-[40px] px-4 text-[13px]')} onClick={() => void query.refetch()}>
                Try again
              </button>
            </div>
          ) : !ctx ? (
            <p className="text-[13px] text-warm-secondary" data-testid="whole-question-alone">
              This question stands on its own. It has no other parts.
            </p>
          ) : (
            <div>
              <p className="mb-2 text-[13px] font-bold text-foreground">{contextHeading(ctx)}</p>
              <p className="mb-2 text-[12px] text-warm-meta">The part you were sent is marked.</p>
              <ol className="space-y-2" aria-label="Every part of this question, in order">
                {ctx.parent ? (
                  <li
                    className={cn('rounded-xl px-3 py-2', ctx.currentIsParent ? 'border-l-4 border-brand-blue bg-brand-subtle' : 'bg-muted')}
                    data-testid="whole-question-stem"
                    data-current={ctx.currentIsParent ? 'true' : undefined}
                  >
                    <p className="mb-1 text-[11px] font-bold uppercase text-warm-meta">The lead-in</p>
                    <MathText text={ctx.parent.body} className="break-words text-[14px] leading-relaxed text-foreground" />
                    <OptionList options={ctx.parent.options} />
                  </li>
                ) : null}
                {ctx.parts.map((p, i) => {
                  const current = p.id === ctx.currentId;
                  const more = extras.get(p.id);
                  return (
                    <li
                      key={p.id}
                      className={cn('rounded-xl px-3 py-2', current ? 'border-l-4 border-brand-blue bg-brand-subtle' : 'bg-muted')}
                      style={p.depth > 1 ? { marginLeft: `${Math.min(p.depth - 1, 3) * 12}px` } : undefined}
                      data-testid="whole-question-part"
                      data-current={current ? 'true' : undefined}
                    >
                      <p className="mb-1 flex flex-wrap items-baseline gap-x-2 text-[12px] font-bold text-warm-secondary">
                        <span>{partLabel(p, i)}</span>
                        {current ? <span className="text-brand-blue">This is the part you were sent</span> : null}
                        {more?.passed ? <span className="font-semibold text-warm-meta">Already passed</span> : null}
                        {more?.set_aside ? <span className="font-semibold text-warm-meta">Left out</span> : null}
                      </p>
                      <MathText text={p.body} className="break-words text-[14px] leading-relaxed text-foreground" />
                      <OptionList options={p.options} />
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
