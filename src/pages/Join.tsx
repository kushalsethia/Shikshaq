import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';

const BENEFITS = [
  {
    title: 'No commission fees',
    body: 'Fees are agreed between you and the family. We never sit in the middle of a payment.',
  },
  {
    title: 'Direct student contact',
    body: 'Enquiries reach you on WhatsApp. No lead credits, no bidding for students.',
  },
  {
    title: 'Empathy',
    body: 'We were students in this city. The platform is built for how tuition actually works in Kolkata.',
  },
  {
    title: 'Values',
    body: 'Real reviews from real students, and no paid placement in results. Ever.',
  },
];

export default function Join() {
  usePageMeta(
    'Join as a Tuition Teacher in Kolkata | Shikshaq',
    'List yourself as a tuition teacher in Kolkata for free. Reach students near you directly. No commission, no middlemen, no platform fees. Apply to join Shikshaq today.'
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight max-w-[18ch] text-foreground">
          Teach on Shikshaq. <span className="text-brand">Keep every rupee.</span>
        </h1>

        <p className="mt-4 max-w-prose text-base sm:text-lg leading-relaxed text-muted-foreground">
          We list local tuition teachers, students contact you directly on WhatsApp, and we take nothing from what you charge. There is no listing fee either.
        </p>

        <Link
          to="/join/apply"
          className="hover:opacity-90 active:scale-[0.97] transition-[opacity,transform] duration-150 inline-flex items-center min-h-11 mt-6 px-6 py-4 rounded-lg bg-foreground text-background text-sm font-semibold"
        >
          Apply to be listed
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {BENEFITS.map((b) => (
            <div key={b.title} className="p-6 rounded-2xl bg-card shadow-border">
              <h3 className="text-base font-semibold mb-2 text-foreground">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
