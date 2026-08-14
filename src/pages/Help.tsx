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

interface HelpTopic {
  title: string;
  body: string;
}

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

  // Add FAQPage JSON-LD structured data
  useEffect(() => {
    const faqPageScript = document.createElement('script');
    faqPageScript.type = 'application/ld+json';
    faqPageScript.id = 'helppage-faqpage-schema';
    faqPageScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.shikshaq.in/faq#faqpage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Shikshaq completely free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Shikshaq is completely free for both students and tutors. There are no registration fees, subscription charges, or hidden costs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I find a tutor on Shikshaq?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply visit shikshaq.in and use our search filters to find tutors by subject, board, class, location, and teaching mode. Browse verified tutor profiles and contact them directly."
          }
        },
        {
          "@type": "Question",
          "name": "Does Shikshaq handle payments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, Shikshaq does not handle any payments. All fees are negotiated directly between students and tutors. We are a connection-only platform."
          }
        },
        {
          "@type": "Question",
          "name": "How are tutors verified on Shikshaq?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All tutors undergo a verification process that includes educational qualification verification and identity verification."
          }
        },
        {
          "@type": "Question",
          "name": "Which areas does Shikshaq serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Shikshaq currently serves Kolkata and surrounding areas including Howrah, Salt Lake, Jadavpur, Bhowanipore, Ballygunge, and many other localities."
          }
        }
      ]
    });

    // Add script to head
    document.head.appendChild(faqPageScript);

    // Cleanup: remove script when component unmounts
    return () => {
      const existingFaqPage = document.getElementById('helppage-faqpage-schema');
      if (existingFaqPage) existingFaqPage.remove();
    };
  }, []);

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('help-page');
    trackWhatsAppClickGA('help-page');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Help</h1>
        <p className="mt-3 max-w-prose text-base text-muted-foreground">
          Short answers to the things people actually write in about. If none of it fits, message us on WhatsApp and a person replies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {topics.map((topic) => (
            <div key={topic.title} className="p-4 sm:p-6 rounded-2xl bg-card shadow-border">
              <h3 className="text-base font-semibold text-foreground mb-2">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-muted flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-warm-prose max-w-prose">
            Still stuck? We answer on WhatsApp between 8am and 10pm, Monday to Saturday.
          </p>
          <a
            href={getWhatsAppLink('8240980312')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="min-h-12 px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 bg-mint text-foreground"
          >
            <WhatsAppIcon className="w-4 h-4 text-foreground" />
            Message Shikshaq
          </a>
        </div>

        <p className="mt-6 text-xs text-warm-meta">
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
