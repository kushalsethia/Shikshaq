import img001 from '@/assets/0001.jpg';
import img002 from '@/assets/0002.jpg';
import img003 from '@/assets/0003.jpg';

const steps = [
  {
    number: '01',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
    image: img002,
  },
  {
    number: '02',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
    image: img003,
  },
  {
    number: '03',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via WhatsApp to discuss classes, and more without any intermediaries.',
    image: img001,
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
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Three steps from search to a message.
            </h2>
          </div>

          <ol className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
            {steps.map((step, i) => (
              <li
                key={step.number}
                className="w-[80%] flex-none snap-start rounded-2xl bg-card p-4 shadow-border sm:w-auto sm:p-6"
              >
                <img
                  src={step.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground tabular-nums">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                {i === steps.length - 1 && (
                  <p className="mt-3 text-xs text-muted-foreground">
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
