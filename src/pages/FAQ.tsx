import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/FAQ';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Find answers to common questions about ShikshAq
          </p>
          
          <FAQ />
        </div>
      </main>

      <Footer />
    </div>
  );
}

