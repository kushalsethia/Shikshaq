import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What exactly is ShikshAq?',
    answer: 'ShikshAq is a platform that connects students and parents with verified tuition teachers across Kolkata. We make it easy to find, compare, and reach out to quality educators without any intermediaries.',
  },
  {
    question: 'How does it actually work?',
    answer: 'Simply search for teachers by subject, grade, or locality. Browse through detailed profiles, read reviews, and when you find someone you like, reach out to them directly via WhatsApp. No middlemen, no hassle.',
  },
  {
    question: 'Is this safe? Are the tutors actually verified?',
    answer: 'Yes! All tutors on our platform go through a verification process. We verify their identity, qualifications, and teaching experience to ensure you connect with genuine educators.',
  },
  {
    question: "What if I search and can't find the right tutor?",
    answer: "If you can't find a suitable tutor, you can contact us and we'll help you find the right match. We're constantly adding new teachers to our platform.",
  },
  {
    question: "What if I connect with a tutor and it doesn't work out?",
    answer: "That's okay! There's no commitment. You can always browse and connect with other tutors until you find the perfect fit for your learning needs.",
  },
  {
    question: 'How much does this cost? What about payments?',
    answer: 'ShikshAq is completely free for students and parents! There are no commissions or hidden fees. You negotiate the tuition fees directly with the teacher.',
  },
  {
    question: 'What if I need help? How do I reach your team?',
    answer: 'You can reach us via WhatsApp or email. Our team is always ready to help you with any questions or concerns you might have.',
  },
];

export function FAQ() {
  return (
    <section className="py-16 bg-card">
      <div className="container max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-8">
          Common Queries Answered
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-xl px-6 border-none"
            >
              <AccordionTrigger className="faq-trigger hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
