import { useEffect, useState } from 'react';
import { LegalReader, type LegalSection } from '@/pages/legal/reader';
import { FeedbackModal } from '@/components/FeedbackModal';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { FAQSchema, type FAQItem } from '@/components/FAQSchema';

interface HelpTopic {
  title: string;
  body: string;
}

// FAQPage JSON-LD content for this page. Kept separate from FALLBACK_TOPICS
// (which are display copy, possibly overridden from page_content) — these are
// the fixed platform-level Q&A Google indexes for this route.
const HELP_FAQS: FAQItem[] = [
  {
    question: 'Is Shikshaq completely free?',
    answer:
      'Yes, Shikshaq is completely free for both students and tutors. There are no registration fees, subscription charges, or hidden costs.',
  },
  {
    question: 'How do I find a tutor on Shikshaq?',
    answer:
      'Simply visit shikshaq.in and use our search filters to find tutors by subject, board, class, location, and teaching mode. Browse verified tutor profiles and contact them directly.',
  },
  {
    question: 'Does Shikshaq handle payments?',
    answer:
      'No, Shikshaq does not handle any payments. All fees are negotiated directly between students and tutors. We are a connection-only platform.',
  },
  {
    question: 'How are tutors verified on Shikshaq?',
    answer:
      'All tutors undergo a verification process that includes educational qualification verification and identity verification.',
  },
  {
    question: 'Which areas does Shikshaq serve?',
    answer:
      'Shikshaq currently serves Kolkata and surrounding areas including Howrah, Salt Lake, Jadavpur, Bhowanipore, Ballygunge, and many other localities.',
  },
];

// Fallback topics, used until page_content carries a page_type support can
// edit for this page (see the Help.tsx handoff report — the live table's
// CHECK constraint only allows 'general' | 'subject' | 'board' |
// 'subject_board' today, one active row each, so it can't yet hold six
// standalone topic rows). Copy matches the design handoff's own sample copy.
// short/body split from a single stored paragraph: short is the bold
// one-line answer LegalReader wants, body is the rest of the explanation.
const FALLBACK_TOPICS: HelpTopic[] = [
  { title: 'Finding a teacher', body: 'Use the search bar in Teachers mode: pick a subject, a class and board, and an area.|Filters stay as removable chips above the results so you can loosen one at a time.' },
  { title: 'Contacting a teacher', body: 'Open a profile and use Contact via WhatsApp.|Your number is never shared with the teacher until you message them yourself.' },
  { title: 'Reading past papers', body: 'Switch the search to Papers mode, or open Past Papers from the navigation.|Papers open in a reader on Shikshaq, and the page is watermarked to your account.' },
  { title: 'Contributing a paper', body: 'Send us the paper through the contribute link on the Past Papers page.|Nothing publishes until an admin has reviewed and published it deliberately.' },
  { title: 'Getting a paper removed', body: 'Schools can use the removal link on any paper or in the reader header.|We unpublish first, which is immediate and reversible.' },
  { title: 'Joining as a teacher', body: 'Apply through Join as a teacher.|It is a four-step form and there is no listing fee, ever.' },
];

function splitTopic(body: string): { short: string; rest: string } {
  const [short, ...restParts] = body.split('|');
  const rest = restParts.join(' ').trim();
  return { short: short.trim(), rest };
}

function topicsToSections(topics: HelpTopic[]): LegalSection[] {
  return topics.map((topic, i) => {
    const { short, rest } = splitTopic(topic.body);
    return {
      n: String(i + 1).padStart(2, '0'),
      title: topic.title,
      short,
      body: rest || short,
    };
  });
}

export default function Help() {
  usePageMeta(
    'Help and Contact | Shikshaq',
    'Need help finding a tuition teacher in Kolkata? Contact the Shikshaq team on WhatsApp or email, and learn how our free tutor matching works.'
  );

  const [topics, setTopics] = useState<HelpTopic[]>(FALLBACK_TOPICS);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchTopics() {
      const { data } = await supabase
        .from('page_content')
        .select('heading, full_content')
        .eq('page_type', 'help_topic')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setTopics(data.map((row) => ({ title: row.heading, body: row.full_content })));
      }
    }
    fetchTopics();
  }, []);

  return (
    <>
      <FAQSchema faqs={HELP_FAQS} url="/more" />
      <LegalReader
        pill="short answers, real person on WhatsApp"
        pillTone="blue"
        h1="We reply fast"
        lede="Short answers to the things people actually write in about. If none of it fits, a person replies on WhatsApp."
        updated="8am – 10pm · Mon – Sat"
        accent="blue"
        summary={[
          { head: 'Free, always', text: 'No fee to search, message a teacher, or read a past paper.', tone: 'bone' },
          { head: 'Real replies', text: 'A person on our team answers WhatsApp — not a bot, not a queue.', tone: 'blue' },
          { head: 'Verified teachers', text: 'ID and degree checked before a profile goes live.', tone: 'muted' },
          { head: 'Kolkata, first', text: 'Every listing and every paper is local to this city.', tone: 'mint' },
        ]}
        sections={topicsToSections(topics)}
        footHead="Still stuck?"
        footBody="Ask our assistant, or write to us on WhatsApp — we reply within a day."
        footerExtra={
          <p className="mt-2 text-[13px] text-warm-meta">
            Got feedback instead of a question?{' '}
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="inline-flex min-h-[44px] items-center align-middle text-[13px] text-brand-blue underline"
            >
              Tell us here
            </button>
          </p>
        }
      />
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
