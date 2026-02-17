import step1Image from '@/assets/0001.jpg';
import step2Image from '@/assets/0002.jpg';
import step3Image from '@/assets/0003.jpg';

const steps = [
  {
    number: '01',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
    image: step2Image,
  },
  {
    number: '02',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
    image: step3Image,
  },
  {
    number: '03',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via Whatsapp to discuss classes, and more without any intermediaries.',
    image: step1Image,
  },
];

export function HowItWorks() {
  return (
    <section className="py-4">
      <div className="container">
        <div className="mb-2">
          <h2 className="section-title">
            Looking for a tutor? Just{' '}
            <span style={{ color: '#FF8000' }}>Shikshaq</span> it!
          </h2>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={[
                index < steps.length - 1
                  ? 'pb-4 mb-4 border-b border-gray-200 md:border-0 md:pb-0 md:mb-0'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-[150px] md:h-[105px] object-cover rounded-xl"
              />
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                    style={{ backgroundColor: '#4351FF' }}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mt-2">
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
