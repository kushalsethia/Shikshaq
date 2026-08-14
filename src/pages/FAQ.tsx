import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQ, FAQ_ITEMS } from '@/components/FAQ';
import { FAQSchema } from '@/components/FAQSchema';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function FAQPage() {
  usePageMeta(
    'Tuition FAQs for Students and Parents in Kolkata | Shikshaq',
    'Answers to common questions about finding a tuition teacher in Kolkata on Shikshaq: how matching works, fees, verification, and contacting tutors directly for free.'
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <FAQSchema faqs={FAQ_ITEMS} url="/faq" />
      <Navbar />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
        <h1 style={{ fontSize: 'clamp(26px,3.6vw,38px)', lineHeight: 1.02, fontWeight: 700, color: '#1F1F1F' }}>
          Frequently asked questions
        </h1>

        <div style={{ marginTop: 26 }}>
          <FAQ items={FAQ_ITEMS} questionSize={16.5} heading={false} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
