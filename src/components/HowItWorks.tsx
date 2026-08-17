import { Search, Heart, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    fill: 'bg-brand text-white',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
  },
  {
    number: '02',
    icon: Heart,
    fill: 'bg-brand-blue text-white',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
  },
  {
    number: '03',
    icon: MessageCircle,
    fill: 'bg-mint text-foreground',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via WhatsApp to discuss classes, and more without any intermediaries.',
  },
];

/**
 * Rebuilt against a specific reference (Creative Kids Academy / Artistry —
 * "Why choose Artistry?" section): a centered headline mixing a bold sans
 * lead-in with an italic accent word, then three columns of icon-in-circle +
 * bold heading + body copy, threaded by a dashed connector line — replacing
 * the previous photo-card-with-numbered-sticker layout entirely rather than
 * re-skinning it. The reference's own colors are not carried over — brand
 * orange/blue/mint and the existing Geist/Archivo type system throughout.
 */
export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 sm:space-y-14">
          <h2 className="text-center font-display text-section-head leading-tight">
            <span className="block font-bold">Three steps,</span>
            <span className="block italic text-muted-foreground">no cost, no catch.</span>
          </h2>

          <div className="relative">
            {/* Dashed connector thread — the reference's wavy line snaking under each
                column; simplified to a straight dashed rule at icon-center height,
                sitting behind the icons so it reads as "connecting" them. Row layout
                only exists from `sm:` up, so the connector matches that breakpoint. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-6 hidden border-t-2 border-dashed border-warm-hairline-strong sm:block"
            />

            <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.number} className="flex flex-col items-center text-center">
                    <span
                      className={`relative z-10 mb-4 flex h-12 w-12 flex-none items-center justify-center rounded-full ring-4 ring-background ${step.fill}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="text-subsection font-display font-bold">{step.title}</h3>
                    <p className="mt-2 max-w-[26ch] text-body-secondary text-muted-foreground">{step.description}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="text-center text-meta text-muted-foreground">No middlemen, no commission, no fees.</p>
        </div>
      </div>
    </section>
  );
}
