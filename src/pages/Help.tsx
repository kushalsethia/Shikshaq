import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/FAQ';
import { Mail } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { WhatsAppIcon, InstagramIcon } from '@/components/BrandIcons';

export default function Help() {
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
          "name": "Is ShikshAQ completely free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, ShikshAQ is completely free for both students and tutors. There are no registration fees, subscription charges, or hidden costs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I find a tutor on ShikshAQ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply visit shikshaq.in and use our search filters to find tutors by subject, board, class, location, and teaching mode. Browse verified tutor profiles and contact them directly."
          }
        },
        {
          "@type": "Question",
          "name": "Does ShikshAQ handle payments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, ShikshAQ does not handle any payments. All fees are negotiated directly between students and tutors. We are a connection-only platform."
          }
        },
        {
          "@type": "Question",
          "name": "How are tutors verified on ShikshAQ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All tutors undergo a verification process that includes educational qualification verification and identity verification."
          }
        },
        {
          "@type": "Question",
          "name": "Which areas does ShikshAQ serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ShikshAQ currently serves Kolkata and surrounding areas including Howrah, Salt Lake, Jadavpur, Bhowanipore, Ballygunge, and many other localities."
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions or reach out to our team directly.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          <a
            href={getWhatsAppLink('8240980312')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 bg-badge-science/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <WhatsAppIcon className="w-6 h-6 text-badge-science" />
            </div>
            <h3 className="font-medium text-foreground mb-2">WhatsApp</h3>
            <p className="text-sm text-muted-foreground">Quick responses on chat</p>
          </a>

          <a
            href="mailto:join.shikshaq@gmail.com"
            className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 bg-badge-commerce/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-badge-commerce" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">join.shikshaq@gmail.com</p>
          </a>

          <a
            href="https://instagram.com/shikshaq.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 bg-badge-hindi/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <InstagramIcon className="w-6 h-6 text-badge-hindi" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Instagram</h3>
            <p className="text-sm text-muted-foreground">@shikshaq.in</p>
          </a>
        </div>

        {/* FAQ */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
