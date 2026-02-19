import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/FAQ';
import { WaveDivider } from '@/components/WaveDivider';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-sans text-foreground mb-4 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Find answers to common questions about Shikshaq
          </p>
        </div>
      </main>

      {/* Wave: Page → Orange */}
      <WaveDivider fillColor="#FF8000" bgColor="#ffffff" inverted={false} />

      {/* FAQ — Orange */}
      <FAQ />

      {/* Wave: Orange → Footer */}
      <WaveDivider fillColor="#fcfbf8" bgColor="#FF8000" inverted={false} />

      <Footer />
    </div>
  );
}

