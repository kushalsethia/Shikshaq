import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function PastPapers() {
  usePageMeta(
    'Past Year Question Papers (PYQs) for CBSE, ICSE and State Board | Shikshaq',
    'Download free past year question papers and previous year solved papers for CBSE, ICSE, ISC and West Bengal State Board exams. Practice PYQs by subject and class.'
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-start justify-center px-4 pt-[40vh] pb-[40vh] sm:items-center sm:pt-40 sm:pb-40 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40">
        <div className="text-center w-full max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-sans font-normal text-foreground mb-4 sm:mb-6">
            Past Papers
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">
            Coming Soon
          </p>
        </div>
      </main>
      <div className="mt-auto pt-16 sm:pt-20 md:pt-24">
        <Footer />
      </div>
    </div>
  );
}

