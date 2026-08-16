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
    <div className="min-h-screen bg-background">
      <FAQSchema faqs={FAQ_ITEMS} url="/faq" />
      <Navbar />

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Frequently asked questions
        </h1>

        <div className="mt-6">
          <FAQ items={FAQ_ITEMS} questionSize={16.5} heading={false} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
