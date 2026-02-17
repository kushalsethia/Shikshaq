const steps = [
  {
    number: '01',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
  },
  {
    number: '02',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
  },
  {
    number: '03',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via Whatsapp to discuss classes, and more without any intermediaries.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#F9F5F1]">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#1F1F1F] text-center mb-12 md:mb-16">
          Looking for a tutor?
          <br />
          Just <span className="text-[#FF8000]">Shikshaq</span> it!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mb-4 md:mb-6 flex justify-center">
                <div className="bg-[#4351FF] text-white rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-sans font-bold text-lg md:text-xl">
                  {step.number}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-sans font-semibold text-[#1F1F1F] mb-3">
                {step.title}
              </h3>
              <p className="text-sm md:text-base font-sans font-normal text-[#666666] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
