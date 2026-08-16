import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeedbackModal } from '@/components/FeedbackModal';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';
import { trackWhatsAppClick } from '@/utils/clarityEvents';
import { trackWhatsAppClickGA } from '@/utils/gaEvents';
import { FAQSchema, type FAQItem } from '@/components/FAQSchema';
import { PageHeader, NumberedIndex } from '@/components/devices';

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
const FALLBACK_TOPICS: HelpTopic[] = [
  { title: 'Finding a teacher', body: 'Use the search bar in Teachers mode: pick a subject, a class and board, and an area. Filters stay as removable chips above the results so you can loosen one at a time.' },
  { title: 'Contacting a teacher', body: 'Open a profile and use Contact via WhatsApp. Your number is never shared with the teacher until you message them yourself.' },
  { title: 'Reading past papers', body: 'Switch the search to Papers mode, or open Past Papers from the navigation. Papers open in a reader on Shikshaq, and the page is watermarked to your account.' },
  { title: 'Contributing a paper', body: 'Send us the paper through the contribute link on the Past Papers page. Nothing publishes until an admin has reviewed and published it deliberately.' },
  { title: 'Getting a paper removed', body: 'Schools can use the removal link on any paper or in the reader header. We unpublish first, which is immediate and reversible.' },
  { title: 'Joining as a teacher', body: 'Apply through Join as a teacher. It is a four-step form and there is no listing fee, ever.' },
];

const TOPIC_COLORS = ['hsl(var(--brand))', 'hsl(var(--brand-blue))'];

export default function Help() {
  usePageMeta(
    'Help and Contact | Shikshaq',
    'Need help finding a tuition teacher in Kolkata? Contact the Shikshaq team on WhatsApp or email, and learn how our free tutor matching works.'
  );

  const [topics, setTopics] = useState<HelpTopic[]>(FALLBACK_TOPICS);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('help-page');
    trackWhatsAppClickGA('help-page');
  };

  return (
    <div className="min-h-screen bg-background">
      <FAQSchema faqs={HELP_FAQS} url="/more" />
      <Navbar />

      <PageHeader
        eyebrow="Support"
        title={
          <>
            We reply{' '}
            <span className="marker-highlight marker-highlight--pill" style={{ ['--marker-color' as string]: 'hsl(var(--brand-blue))' }}>
              fast
            </span>
          </>
        }
        lede="Short answers to the things people actually write in about. If none of it fits, a person replies on WhatsApp."
        tags={[{ label: '8am – 10pm' }, { label: 'Mon – Sat' }]}
        accent="hsl(var(--brand-blue))"
        ground="ruled"
      >
        <a
          href={getWhatsAppLink('8240980312')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-mint px-6 py-3 text-sm font-bold text-foreground transition-transform duration-150 active:scale-[0.97]"
        >
          <WhatsAppIcon className="h-4 w-4 text-foreground" />
          Message Shikshaq
        </a>
      </PageHeader>

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <NumberedIndex
          items={topics.map((topic, i) => ({
            key: topic.title,
            title: topic.title,
            description: topic.body,
            color: TOPIC_COLORS[i % TOPIC_COLORS.length],
          }))}
        />

        <p className="mt-10 text-xs text-warm-meta">
          Got feedback instead of a question?{' '}
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="inline-flex items-center min-h-11 text-xs text-brand-blue underline bg-transparent border-0 p-0 cursor-pointer align-middle"
          >
            Tell us here
          </button>
        </p>
      </div>

      <Footer />

      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
