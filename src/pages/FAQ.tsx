import { useEffect } from 'react';
import { FAQ_ITEMS } from '@/components/FAQ';
import { FAQSchema } from '@/components/FAQSchema';
import { usePageMeta } from '@/hooks/usePageMeta';
import { HelpFaqStack, type HelpFaqCategory, type HelpFaqQuestion } from '@/components/help/HelpFaqStack';
import { useHelpTopics, topicToGuideBody } from '@/hooks/useHelpTopics';

// FAQ_ITEMS (components/FAQ.tsx) is shared with Index.tsx's teaser block, so
// its question/answer strings stay the single source of truth for the JSON-LD
// (byte-identical, unchanged) — `category` is layered on here, display-only,
// for the HP-002 chip filter this page adds.
const CATEGORY_BY_QUESTION: Record<string, HelpFaqCategory> = {
  'What is Shikshaq and how does it work?': 'general',
  'Which classes/grades and boards do you support?': 'teachers',
  'Which cities or localities do you currently cater to?': 'general',
  'How do I find the right tutor on Shikshaq?': 'finding',
  'How do I contact a teacher through Shikshaq?': 'finding',
  'Do I pay through Shikshaq or directly to the teacher?': 'general',
  'Is my phone number and personal data safe on Shikshaq?': 'general',
};

const QUESTIONS: HelpFaqQuestion[] = FAQ_ITEMS.map((f) => ({
  question: f.question,
  answer: f.answer,
  category: CATEGORY_BY_QUESTION[f.question] ?? 'general',
}));

export default function FAQPage() {
  usePageMeta(
    'Tuition FAQs for Students and Parents in Kolkata | Shikshaq',
    // Was 164 chars, over the ~160 SERP-snippet guideline. 153 now.
    'Common questions about finding a tuition teacher in Kolkata on Shikshaq: how matching works, fees, verification, and contacting tutors directly for free.'
  );

  const topics = useHelpTopics();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <FAQSchema faqs={FAQ_ITEMS} url="/faq" />
      <HelpFaqStack
        heading={{ line1: 'Questions people', ordinal: '01', line2: 'actually ask' }}
        questionsHeading="Common questions"
        questions={QUESTIONS}
        guides={topics.map((t) => ({ title: t.title, body: topicToGuideBody(t.body) }))}
        contactHeading="Still have a question?"
        contactBody="Ask our assistant, or write to us on WhatsApp. We reply within a day."
      />
    </>
  );
}
