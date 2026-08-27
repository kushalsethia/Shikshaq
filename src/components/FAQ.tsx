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

/* The `FAQ` accordion component that used to live here was deleted.
 * It was never rendered: App.tsx's `<FAQ />` resolves to `pages/FAQ`, and
 * the only import from this module anywhere is `FAQ_ITEMS` (pages/FAQ.tsx).
 * It still carried pre-redesign chrome — `rounded-2xl bg-card shadow-border`
 * cards, a rotating `+` glyph and an inline <style> keyframe block — none of
 * which match the redesign's accordion (see HelpFaqStack, which is the real
 * one). Dead code that can only drift further from the design. FAQ_ITEMS
 * above is live and stays. */
