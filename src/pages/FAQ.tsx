import { useEffect } from 'react';
import { LegalReader, type LegalSection } from '@/pages/legal/reader';
import { FAQ_ITEMS } from '@/components/FAQ';
import { FAQSchema } from '@/components/FAQSchema';
import { usePageMeta } from '@/hooks/usePageMeta';

const SECTIONS: LegalSection[] = FAQ_ITEMS.map((faq, i) => ({
  n: String(i + 1).padStart(2, '0'),
  title: faq.question,
  short: faq.answer,
  body: '',
}));

export default function FAQPage() {
  usePageMeta(
    'Tuition FAQs for Students and Parents in Kolkata | Shikshaq',
    // Was 164 chars, over the ~160 SERP-snippet guideline. 153 now.
    'Common questions about finding a tuition teacher in Kolkata on Shikshaq: how matching works, fees, verification, and contacting tutors directly for free.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <FAQSchema faqs={FAQ_ITEMS} url="/faq" />
      <LegalReader
        pill="matching, fees, verification"
        pillTone="brand"
        h1="Questions people actually ask"
        lede="Matching, fees, verification, and how to reach a teacher directly — answered plainly."
        updated={`${FAQ_ITEMS.length} questions · free, always`}
        accent="brand"
        summary={[
          { head: 'Free, always', text: 'No listing fee, no commission, no premium tier — for anyone.', tone: 'bone' },
          { head: 'You pay the teacher', text: 'Fees are settled directly between you. We never touch the money.', tone: 'brand' },
          { head: 'Kolkata only', text: 'Every teacher and every filter is local to this city.', tone: 'muted' },
          { head: 'Your number stays private', text: 'Shown to a teacher only when you choose to message them.', tone: 'mint' },
        ]}
        sections={SECTIONS}
        footHead="Still have a question?"
        footBody="Ask our assistant, or write to us on WhatsApp — we reply within a day."
      />
    </>
  );
}
