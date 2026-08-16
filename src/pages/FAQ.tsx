import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQ_ITEMS } from '@/components/FAQ';
import { FAQSchema } from '@/components/FAQSchema';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageHeader, NumberedIndex } from '@/components/devices';

const NUMBER_COLORS = ['hsl(var(--brand))', 'hsl(var(--brand-blue))'];

export default function FAQPage() {
  usePageMeta(
    'Tuition FAQs for Students and Parents in Kolkata | Shikshaq',
    'Answers to common questions about finding a tuition teacher in Kolkata on Shikshaq: how matching works, fees, verification, and contacting tutors directly for free.'
  );

  // Answers stay collapsed by default (NumberedIndex has no built-in
  // expand/collapse — this state + a clickable title stands in for one
  // without touching the shared device component).
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <FAQSchema faqs={FAQ_ITEMS} url="/faq" />
      <Navbar />

      <PageHeader
        eyebrow="Frequently asked"
        title={
          <>
            Questions people{' '}
            <span className="marker-highlight marker-highlight--pill" style={{ ['--marker-color' as string]: 'hsl(var(--brand))' }}>
              actually ask
            </span>
          </>
        }
        lede="Matching, fees, verification, and how to reach a teacher directly — answered plainly."
        tags={[{ label: `${FAQ_ITEMS.length} questions` }, { label: 'Free, always' }]}
        accent="hsl(var(--brand))"
        ground="graph"
      />

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <NumberedIndex
          items={FAQ_ITEMS.map((faq, i) => {
            const isOpen = openIndex === i;
            return {
              key: faq.question,
              title: (
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
                >
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex-shrink-0 text-warm-meta transition-transform duration-200"
                    style={{ fontSize: 19, lineHeight: 1, transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </button>
              ),
              description: isOpen ? faq.answer : undefined,
              color: NUMBER_COLORS[i % NUMBER_COLORS.length],
            };
          })}
        />
      </div>

      <Footer />
    </div>
  );
}
