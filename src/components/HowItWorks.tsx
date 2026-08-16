import { ArrowRight } from 'lucide-react';
import img001 from '@/assets/0001.jpg';
import img001Webp from '@/assets/0001.webp';
import img001Avif from '@/assets/0001.avif';
import img002 from '@/assets/0002.jpg';
import img002Webp from '@/assets/0002.webp';
import img002Avif from '@/assets/0002.avif';
import img003 from '@/assets/0003.jpg';
import img003Webp from '@/assets/0003.webp';
import img003Avif from '@/assets/0003.avif';

const steps = [
  {
    number: '01',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
    image: img002,
    webp: img002Webp,
    avif: img002Avif,
  },
  {
    number: '02',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
    image: img003,
    webp: img003Webp,
    avif: img003Avif,
  },
  {
    number: '03',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via WhatsApp to discuss classes, and more without any intermediaries.',
    image: img001,
    webp: img001Webp,
    avif: img001Avif,
  },
];

/**
 * Mobile-first: a horizontal snap-scroll carousel of full-bleed step cards at 375px,
 * becoming a three-column row from `sm:` up. Never a cramped 3-column grid on a phone.
 */
export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-label font-semibold uppercase tracking-wide text-muted-foreground">How it works</p>
            <h2 className="text-section-head font-display font-bold">
              Three steps from search to{' '}
              <span
                className="marker-highlight marker-highlight--pill"
                style={{ '--marker-color': 'hsl(var(--brand-blue))' } as React.CSSProperties}
              >
                a message
              </span>
              .
            </h2>
          </div>

          {/* Section-transition moment — Cluster A permitted (VISUAL_DIRECTION §4). The
              source photos read dark/fisheye and don't carry the search -> choose -> contact
              story on their own, so the numbered sticker badge (not the photo) is what
              actually communicates sequence; the <picture>/AVIF/WebP markup underneath is
              preserved exactly, just no longer asked to do the explaining by itself. */}
          <ol className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
            {steps.map((step, i) => (
              <li
                key={step.number}
                className="outline-thick outline-offset-shadow relative w-[80%] flex-none snap-start rounded-2xl bg-card p-4 sm:w-auto sm:p-6"
              >
                <div className="relative">
                  <picture>
                    <source srcSet={step.avif} type="image/avif" />
                    <source srcSet={step.webp} type="image/webp" />
                    <img
                      src={step.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                  </picture>
                  {/* Numbered die-cut sticker, pinned over the photo's corner — the thing
                      that actually carries "step N", full sticker treatment, one per card. */}
                  <span
                    aria-hidden="true"
                    className={`sticker animate-pop absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand font-display text-card-title font-black text-brand-foreground ${
                      i % 2 === 0 ? 'sticker-rotate-sm' : 'sticker-rotate-md-rev'
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {step.number}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-label font-semibold uppercase tracking-wide text-muted-foreground tabular-nums">
                    Step {step.number}
                  </span>
                  {i < steps.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 flex-none text-muted-foreground" aria-hidden="true" />
                  )}
                </div>
                <h3 className="mt-2 text-subsection font-semibold">{step.title}</h3>
                <p className="mt-2 text-body-secondary text-muted-foreground">{step.description}</p>
                {i === steps.length - 1 && (
                  <p className="mt-3 text-meta text-muted-foreground">
                    No middlemen, no commission, no fees.
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
