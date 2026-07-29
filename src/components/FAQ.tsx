import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
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

export function FAQ() {
  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 bg-[#FF8000] scroll-mt-20">
      <div className="container max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#1F1F1F] text-center mb-2 md:mb-6">
          Common <span className="text-[#1F1F1F]">Queries</span> Answered
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl px-6 border-none"
              style={{ backgroundColor: '#fcfbf8' }}
            >
              <AccordionTrigger className="flex items-center justify-between w-full py-4 text-left text-base sm:text-lg md:text-xl font-sans font-semibold text-[#1F1F1F] hover:text-[#4351FF] transition-colors hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base md:text-lg font-sans font-normal text-[#666666] pb-4 leading-relaxed text-pretty">
                {faq.answer}
                <p className="mt-4 pt-3 border-t border-[#1F1F1F]/10">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('shikshaq-open-chat'))}
                    className="text-[#4351FF] font-medium hover:underline focus:outline-none focus:underline"
                  >
                    Not the answer you were looking for? Ask our AI assistant
                  </button>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
