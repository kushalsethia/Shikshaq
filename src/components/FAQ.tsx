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
            style={{ borderRadius: 16, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                width: '100%',
                minHeight: 44,
                padding: '18px 22px',
                fontWeight: 600,
                fontSize: questionSize,
                textAlign: 'left',
                color: '#1F1F1F',
                background: 'transparent',
                border: 'none',
                borderRadius: 16,
                cursor: 'pointer',
              }}
            >
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  fontSize: 19,
                  lineHeight: 1,
                  color: '#8B837A',
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform .2s ease',
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p
                style={{
                  margin: 0,
                  padding: '0 22px 20px',
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: '#666',
                  animation: 'shikshaq-faq-rise .22s ease-out',
                }}
              >
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
        <section id="faq" className="scroll-mt-20" style={{ maxWidth: 820, margin: '0 auto', padding: '60px clamp(16px,3vw,28px) 20px' }}>
          <h2 style={{ fontSize: 'clamp(23px,3vw,34px)', lineHeight: 1, fontWeight: 700, textAlign: 'center', marginBottom: 26, color: '#1F1F1F' }}>
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
