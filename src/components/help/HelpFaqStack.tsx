import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { EyesPanel } from '@/components/home/EyesPanel';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useChromeConfig } from '@/components/layout/AppShell';

/* Handoff HP-001..HP-005 (About Contact Help 404 Redesign.dc.html).

   Help.tsx and FAQ.tsx used to each render a <LegalReader> (pill + lede +
   four-card summary + numbered prose sections) — neither had accordions,
   category chips, or a guides section, so there was no existing disclosure
   markup to preserve. This is a new shared layout built to the handoff's
   literal spec, used by both routes so they read as one product ("Both
   routes share this layout" — HP-001). `<LegalReader>` itself is untouched
   and still serves the legal pages (privacy policy, terms). */

export type HelpFaqCategory = 'finding' | 'papers' | 'teachers' | 'general';

export interface HelpFaqQuestion {
  question: string;
  answer: string;
  /** 'general' questions only surface under the "All" chip — they don't map
   *  cleanly to one of the three filterable categories in the mockup. */
  category: HelpFaqCategory;
}

const CATEGORY_CHIPS: { key: HelpFaqCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'finding', label: 'Finding a teacher' },
  { key: 'papers', label: 'Past papers' },
  { key: 'teachers', label: 'Teachers' },
];

/** HP-004's four tint/ink pairs, cycled across however many real guide
 *  topics exist (the source data is the live, admin-editable `page_content`
 *  table — see `useHelpTopics()` — not a fixed four, so this can't be a
 *  static 4-item array without silently dropping real content). */
const GUIDE_TINTS = [
  { tint: 'bg-brand-subtle', ink: 'text-brand-deep' },
  { tint: 'bg-mint', ink: 'text-[#24603D]' },
  { tint: 'bg-brand-blue-subtle', ink: 'text-brand-blue-deep' },
  { tint: 'bg-muted', ink: 'text-foreground' },
] as const;

export interface HelpFaqGuide {
  title: string;
  body: string;
}

export interface HelpFaqStackProps {
  heading: { line1: string; ordinal: string; line2: string };
  questionsHeading: string;
  questions: HelpFaqQuestion[];
  guides: HelpFaqGuide[];
  contactHeading: string;
  contactBody: string;
  /** Help.tsx's "Tell us here" feedback link, rendered under the contact CTA. */
  footerExtra?: ReactNode;
}

export function HelpFaqStack({ heading, questionsHeading, questions, guides, contactHeading, contactBody, footerExtra }: HelpFaqStackProps) {
  // Handoff HP-001: this route renders its own eyes panel, replacing
  // AppShell's default pre-footer.
  useChromeConfig({ preFooter: 'none' });
  const {
    builderMode, setBuilderMode, slots: builderSlots, onSlotChange: handleSlotChange, onSubmit: handleBuilderSubmit,
  } = useSentenceBuilder();

  const [activeCategory, setActiveCategory] = useState<HelpFaqCategory | 'all'>('all');

  return (
    <BentoStack>
      {/* Handoff HP-002: header + category chips. */}
      <BentoPanel fill="card" edge="top" className="pt-[14px] pb-[22px]">
        <NumberedHeading as="h1" line1={heading.line1} ordinal={heading.ordinal} line2={heading.line2} />
        <div className="-mx-5 mt-4 overflow-x-auto px-5 scrollbar-hide lg:-mx-8 lg:px-8">
          <div className="flex w-max gap-2">
            {CATEGORY_CHIPS.map((c) => {
              const on = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveCategory(c.key)}
                  aria-pressed={on}
                  className={`flex h-11 flex-none items-center whitespace-nowrap rounded-full px-[18px] text-[14.5px] transition-colors duration-tap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    on ? 'bg-panel font-bold text-background' : 'bg-muted font-semibold text-foreground'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </BentoPanel>

      {/* Handoff HP-003: question accordions — native <details>/<summary>, so
          disclosure semantics and keyboard operability come from the browser,
          not custom state. Every question stays in the DOM regardless of the
          active chip (HP-002's crawler requirement) — filtering only toggles
          a `hidden` class. */}
      <BentoPanel fill="card">
        <h2 className="text-[21px] font-extrabold tracking-[-0.03em] text-foreground">{questionsHeading}</h2>
        <div className="mt-3.5 flex flex-col gap-2">
          {questions.map((q) => (
            <details
              key={q.question}
              data-category={q.category}
              className={`group rounded-2xl bg-card p-[16px_18px] shadow-[inset_0_0_0_1px_hsl(var(--border))] [&[open]]:bg-muted [&[open]]:shadow-none ${
                activeCategory !== 'all' && activeCategory !== q.category ? 'hidden' : ''
              }`}
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span className="text-[15.5px] font-bold tracking-[-0.02em] text-foreground">{q.question}</span>
                <ChevronDown className="mt-0.5 h-[18px] w-[18px] flex-none text-warm-secondary transition-transform duration-200 group-open:rotate-180" strokeWidth={2.25} aria-hidden="true" />
              </summary>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-warm-prose">{q.answer}</p>
            </details>
          ))}
        </div>
      </BentoPanel>

      {/* Handoff HP-004: guides. Copy unchanged — sourced from the live,
          admin-editable page_content table (see useHelpTopics()), not
          hardcoded, so an owner edit still shows up here. */}
      <BentoPanel fill="card">
        <h2 className="text-[21px] font-extrabold tracking-[-0.03em] text-foreground">Guides</h2>
        <div className="mt-3.5 flex flex-col gap-2">
          {guides.map((g, i) => {
            const { tint, ink } = GUIDE_TINTS[i % GUIDE_TINTS.length];
            return (
              <div key={g.title} className={`rounded-[18px] p-[16px_18px] ${tint}`}>
                <div className={`text-[15.5px] font-bold tracking-[-0.02em] ${ink}`}>{g.title}</div>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-warm-prose">{g.body}</p>
              </div>
            );
          })}
        </div>
      </BentoPanel>

      {/* Handoff HP-005: contact CTA. */}
      <BentoPanel fill="dark">
        <h2 className="text-[19px] font-extrabold tracking-[-0.03em]">{contactHeading}</h2>
        <p className="mt-2 text-[14px] leading-[1.55] text-background/70">{contactBody}</p>
        <Link
          to="/contact"
          className="mt-3.5 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-5 text-[14.5px] font-extrabold text-brand-foreground transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
        >
          Contact us
          <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
        </Link>
        {footerExtra}
      </BentoPanel>

      {/* Shared tail. */}
      <EyesPanel
        mode={builderMode}
        onModeChange={setBuilderMode}
        heading={(
          <>
            Still deciding? <span className="font-extrabold">We&rsquo;re watching out for you.</span>
          </>
        )}
        subline="Fill in the blanks and we'll take you straight there."
        slots={builderSlots}
        onSlotChange={handleSlotChange}
        onSubmit={handleBuilderSubmit}
      />
    </BentoStack>
  );
}
