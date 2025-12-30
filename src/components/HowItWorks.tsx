const steps = [
  {
    number: '1',
    title: 'Search across tutors.',
    description: 'Filter by subject, grade, locality and more to find all verified tutors in the city that suit your needs.',
  },
  {
    number: '2',
    title: 'Choose your favourite.',
    description: 'Compare profiles, teaching styles, reviews, and qualifications to identify the tutor who feels right.',
  },
  {
    number: '3',
    title: 'Talk to them directly.',
    description: 'Reach out to teachers directly via Whatsapp to discuss classes, and more without any intermediaries.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-2">Looking for a tutor? Just ShikshAq it!</p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            Tuition teachers across Kolkata
          </h2>
        </div>

        <div className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
            >
              <div className="flex-1 text-center md:text-left">
                <span className="step-number">{step.number}</span>
                <h3 className="text-2xl md:text-3xl font-serif text-foreground -mt-8 mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-3" />
                  <div className="relative rounded-3xl shadow-xl w-full max-w-md mx-auto aspect-[4/5] bg-gradient-to-br from-muted via-accent to-primary/20 flex items-center justify-center">
                    <span className="text-6xl font-serif text-muted-foreground/50">
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
