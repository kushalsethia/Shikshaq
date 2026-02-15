import step1Image from '@/assets/0001.jpg';
import step2Image from '@/assets/0002.jpg';
import step3Image from '@/assets/0003.jpg';

const steps = [
  {
    number: '1',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
    image: step2Image,
  },
  {
    number: '2',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
    image: step3Image,
  },
  {
    number: '3',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via Whatsapp to discuss classes, and more without any intermediaries.',
    image: step1Image,
  },
];

export function HowItWorks() {
  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-2">
          <h2 className="section-title">Looking for a tutor? Just ShikshAq it!</h2>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col text-left rounded-3xl overflow-hidden"
              style={{ backgroundColor: '#fcfbf8' }}
            >
              <div className="p-2.5 pb-0">
                <div className="w-full rounded-xl overflow-hidden group cursor-pointer">
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-[150px] object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 border-[8px] border-transparent group-hover:border-black rounded-xl transition-all duration-200 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="p-2.5 pt-2">
                <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-foreground mb-1">
                  {step.number}. {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
