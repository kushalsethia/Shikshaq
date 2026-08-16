import { useState } from 'react';

export interface FAQEntry {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQEntry[] = [
  {
    question: 'What is Shikshaq and how does it work?',
    answer: 'Shikshaq helps students find tuition teachers based on subject, class, board, and locality. You can compare teachers through past student reviews, teaching experience, and educational qualifications, then directly connect with the one that best fits your needs.',
  },
  {
    question: 'Which classes/grades and boards do you support?',
    answer: 'Shikshaq caters to students across all school classes, from primary to senior secondary levels, under boards including CISCE, CBSE, IB, IGCSE, and State Boards. The platform also supports college students at the undergraduate level, along with learners preparing for various competitive examinations.',
  },
  {
    question: 'Which cities or localities do you currently cater to?',
    answer: 'Shikshaq currently focuses on Kolkata, with teachers listed across different neighbourhoods in the city.',
  },
  {
    question: 'How do I find the right tutor on Shikshaq?',
    answer: 'You can use filters such as subject, class, board, and locality to narrow down your search. Review each teacher\'s experience, qualifications, and student feedback to further shortlist the right fit.',
  },
  {
    question: 'How do I contact a teacher through Shikshaq?',
    answer: 'You can contact teachers directly via WhatsApp through the contact option on their profile to discuss classes and availability.',
  },
  {
    question: 'Do I pay through Shikshaq or directly to the teacher?',
    answer: 'Fees are decided directly between you and the teacher. Payments are made directly to the teacher. Shikshaq has no role in financial transactions between students and teachers.',
  },
  {
    question: 'Is my phone number and personal data safe on Shikshaq?',
    answer: 'Yes. Your personal details remain private, and you choose whom you contact.',
  },
];

interface FAQProps {
  /** Which entries to render. Defaults to the first four (the Index teaser block). */
  items?: FAQEntry[];
  /** Question button font size — 17px on Index, 16.5px on /faq. */
  questionSize?: number;
  /** Renders the "Common queries answered" heading + section chrome (Index use). */
  heading?: boolean;
}

export function FAQ({ items = FAQ_ITEMS.slice(0, 4), questionSize = 17, heading = true }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const accordion = (
    <div style={{ display: 'grid', gap: 8 }}>
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="rounded-2xl bg-card shadow-border"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex min-h-11 w-full items-center justify-between gap-4 rounded-2xl border-0 bg-transparent px-[22px] py-[18px] text-left font-semibold text-foreground cursor-pointer"
              style={{ fontSize: questionSize }}
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
            {isOpen && (
              <p className="m-0 px-[22px] pb-5 text-[15px] leading-relaxed text-warm-secondary animate-[shikshaq-faq-rise_.22s_ease-out]">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {heading ? (
        <section id="faq" className="scroll-mt-20 mx-auto max-w-[820px] px-4 py-[60px] sm:px-7">
          <h2 className="mb-[26px] text-center font-display text-display-hero leading-none text-foreground">
            Common queries answered
          </h2>
          {accordion}
        </section>
      ) : (
        accordion
      )}
      <style>{`
        @keyframes shikshaq-faq-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
