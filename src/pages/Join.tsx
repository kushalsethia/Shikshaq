import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { IndianRupee, MessageCircle, Heart, ShieldCheck, type LucideIcon } from 'lucide-react';

const BENEFITS: { title: string; body: string; icon: LucideIcon; tile: string }[] = [
  {
    title: 'No commission fees',
    body: 'Fees are agreed between you and the family. We never sit in the middle of a payment.',
    icon: IndianRupee,
    tile: 'bg-brand-subtle text-brand-deep',
  },
  {
    title: 'Direct student contact',
    body: 'Enquiries reach you on WhatsApp. No lead credits, no bidding for students.',
    icon: MessageCircle,
    tile: 'bg-brand-blue-subtle text-brand-blue-deep',
  },
  {
    title: 'Empathy',
    body: 'We were students in this city. The platform is built for how tuition actually works in Kolkata.',
    icon: Heart,
    tile: 'bg-mint text-foreground',
  },
  {
    title: 'Values',
    body: 'Real reviews from real students, and no paid placement in results. Ever.',
    icon: ShieldCheck,
    tile: 'bg-muted text-foreground',
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

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-16">
        {/* Organic blob decoration behind the hero headline — mobile-vibes-event-app
            reference. Ornamental only, tokens only, sits behind the text (-z-10). */}
        <div
          className="absolute -left-10 top-0 -z-10 h-56 w-56 rounded-[55%_45%_65%_35%/50%_40%_60%_50%] bg-brand-subtle sm:h-72 sm:w-72"
          aria-hidden="true"
        />

        {/* Mixed-weight headline — VISUAL_LANGUAGE §4 signature move: base weight 400,
            payoff phrase in weight 800. */}
        <h1 className="max-w-[18ch] text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Teach on Shikshaq.{' '}
          <span className="font-extrabold text-brand">Keep every rupee.</span>
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
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="animate-card-reveal p-6 rounded-2xl bg-card shadow-border transition-transform duration-150 hover:-translate-y-0.5"
                style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${b.tile}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-foreground">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
