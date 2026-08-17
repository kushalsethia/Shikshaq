import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { IndianRupee, MessageCircle, Heart, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { StarburstBadge, SpeechTag } from '@/components/devices';

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

      {/* Gradient hero band — same device PastPapers.tsx uses (brand-tint fading to page
          ground), applied here in orange instead of blue since this page's whole pitch is
          "keep your fees", the brand-orange side of the token pair. Reads as one considered
          hero moment instead of the previous flat bg-background page. */}
      <main>
      <div className="relative overflow-hidden bg-gradient-to-b from-brand-subtle to-background">
        {/* Organic blob decoration behind the hero headline — mobile-vibes-event-app
            reference. Ornamental only, tokens only, sits behind the text (-z-10). Sized up
            and a second shape added on the right so the hero reads as a full composition,
            not one shape parked in a corner. */}
        <div
          className="absolute -left-16 -top-10 -z-10 h-72 w-72 rounded-[55%_45%_65%_35%/50%_40%_60%_50%] bg-card/60 sm:h-96 sm:w-96"
          aria-hidden="true"
        />
        <div
          className="absolute -right-12 top-10 -z-10 hidden h-56 w-56 rounded-[40%_60%_35%_65%/55%_35%_65%_45%] bg-brand-blue-subtle sm:block"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-10">
          {/* Starburst replaces the flat pill chip — same message, loud device. */}
          <StarburstBadge
            variant="burst"
            color="hsl(var(--brand-blue))"
            tilt={-6}
            size={92}
            className="absolute right-4 top-6 hidden sm:grid lg:right-10"
          >
            No fees
          </StarburstBadge>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[.04em] text-brand-deep">
            <Sparkles size={12} aria-hidden="true" />
            No commission, ever
          </span>

          {/* Mixed-weight, oversized headline — scaled up from the first pass's 3xl/5xl to
              match the clamp-based "display" scale PastPapers.tsx uses for its hero, per the
              owner's direction that devices were "composed too lightly." Base weight 400,
              payoff phrase carries the marker-highlight device instead of plain color weight
              alone, per VISUAL_DIRECTION §9a's "every first fold gets a designed opening." */}
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(31px,5.2vw,58px)] font-normal leading-[.98] tracking-[-.04em] text-foreground">
            Teach on Shikshaq.{' '}
            <span
              className="marker-highlight marker-highlight--tilt font-extrabold"
              style={{ '--marker-color': 'hsl(var(--brand))' } as React.CSSProperties}
            >
              Keep every rupee.
            </span>
          </h1>

          <div className="mt-5 flex flex-wrap items-start gap-3">
            <p className="max-w-prose text-base sm:text-lg leading-relaxed text-muted-foreground">
              We list local tuition teachers, students contact you directly on WhatsApp, and we take nothing from what you charge. There is no listing fee either.
            </p>
            <SpeechTag tail="top-left" dotColor="hsl(var(--brand-blue))" tilt={-2} className="hidden sm:inline-flex">
              Reviewed in ~3 working days
            </SpeechTag>
          </div>

          <Link
            to="/join/apply"
            className="hover:opacity-90 active:scale-[0.97] transition-[opacity,transform] duration-150 inline-flex items-center min-h-11 mt-7 px-6 py-4 rounded-lg bg-foreground text-background text-sm font-semibold"
          >
            Apply to be listed
          </Link>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16"
               aria-labelledby="join-benefits-heading">
        {/* The four tiles were h3 with no h2 above them, so the outline jumped
            h1 -> h3. They are a named group, not loose cards, so the fix is the
            missing group heading rather than demoting the cards. It is sr-only
            because the tiles are self-evident when you can see them. */}
        <h2 id="join-benefits-heading" className="sr-only">Why teach on Shikshaq</h2>
        {/* Slight alternating tilt on the tile row — the "overlapping angled card stack"
            device from the reference, applied restrained enough to still read as a clean
            grid at a glance rather than genuine chaos. Tilt resets on hover so nothing feels
            broken when a user actually looks closely. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            const tilt = i % 2 === 0 ? '-rotate-1' : 'rotate-1';
            return (
              <div
                key={b.title}
                className={`animate-card-reveal p-6 rounded-2xl bg-card shadow-border transition-transform duration-150 hover:-translate-y-0.5 hover:rotate-0 ${tilt}`}
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
      </section>
      </main>

      <Footer />
    </div>
  );
}
