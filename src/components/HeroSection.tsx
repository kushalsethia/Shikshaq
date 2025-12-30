import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground mb-6 animate-slide-up">
          Your ideal teacher,{' '}
          <span className="block">one search away.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Pick your subject, grade and location. Read real student reviews. 
          Reach out directly. ShikshAq makes finding quality education in 
          Kolkata authentic and stress-free.
        </p>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/browse" className="hero-cta">
            Explore tuition teachers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
