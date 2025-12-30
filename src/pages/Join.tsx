import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function Join() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-muted-foreground mb-2 block">Free of charge, no commissions!</span>
          
          <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-6">
            Join ShikshAQ as a teacher today!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Be part of Kolkata's most trusted tutoring platform. Share your expertise, 
            connect directly with students, and grow your teaching practice without 
            any platform fees.
          </p>

          <div className="bg-card rounded-3xl p-8 border border-border mb-12">
            <h2 className="text-xl font-serif text-foreground mb-6">Why join ShikshAQ?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">No commission fees</h3>
                  <p className="text-sm text-muted-foreground">Keep 100% of what you earn</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Direct student contact</h3>
                  <p className="text-sm text-muted-foreground">No middlemen, no delays</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Build your profile</h3>
                  <p className="text-sm text-muted-foreground">Showcase your qualifications</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Verified badge</h3>
                  <p className="text-sm text-muted-foreground">Stand out from the crowd</p>
                </div>
              </div>
            </div>

            <a
              href="https://forms.gle/6ks9bpsz2EojgfrQA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                Apply to Join
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            Have questions? <a href="https://wa.me/8240980312" className="text-foreground hover:underline">Contact us on WhatsApp</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
