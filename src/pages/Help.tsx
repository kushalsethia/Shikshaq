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
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
        <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700 }}>Help</h1>
        <p style={{ marginTop: 14, maxWidth: '62ch', fontSize: 16, lineHeight: 1.65, color: '#7B736B' }}>
          Short answers to the things people actually write in about. If none of it fits, message us on WhatsApp and a person replies.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginTop: 28 }}>
          {topics.map((topic) => (
            <div key={topic.title} style={{ padding: 22, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 9 }}>{topic.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#7B736B' }}>{topic.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22, padding: 24, borderRadius: 20, background: '#F0EAE2', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: '#4A443E', maxWidth: '44ch' }}>
            Still stuck? We answer on WhatsApp between 8am and 10pm, Monday to Saturday.
          </p>
          <a
            href={getWhatsAppLink('8240980312')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            style={{ minHeight: 48, padding: '14px 22px', borderRadius: 12, background: '#25D366', color: '#0B3D1F', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}
          >
            <WhatsAppIcon className="w-4 h-4 text-[#0B3D1F]" />
            Message Shikshaq
          </a>
        </div>

        <p style={{ marginTop: 20, fontSize: 13.5, color: '#8B837A' }}>
          Got feedback instead of a question?{' '}
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            style={{
              font: 'inherit',
              fontSize: 13.5,
              color: '#4351FF',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
              verticalAlign: 'middle',
            }}
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
