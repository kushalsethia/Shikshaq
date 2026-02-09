import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PastPapers() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-foreground mb-4">
            Past Papers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Coming Soon
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

