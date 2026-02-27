import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWhatsAppLink } from '@/utils/whatsapp';

export default function Join() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
        <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-6">
          <span className="text-muted-foreground block">Free of charge, no commissions!</span>
          
          <h1 className="text-3xl md:text-5xl font-sans text-foreground">
            Join Shikshaq as a teacher today!
          </h1>
          
          <p className="text-lg text-muted-foreground">
            We're simply a community of students who are trying to make tuition teacher discovery easier in Kolkata. Join as a teacher to help students find you and learn!
          </p>

          <div className="bg-card rounded-3xl p-8 border border-border space-y-4 md:space-y-6">
            <h2 className="text-xl font-sans text-foreground">Why join Shikshaq?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-6 text-left">
              <div className="order-1">
                <h3 className="font-medium text-foreground">No commission fees</h3>
                <p className="text-sm text-muted-foreground">Keep 100% of what you earn.</p>
              </div>
              <div className="order-2 md:order-3">
                <h3 className="font-medium text-foreground">Direct student contact</h3>
                <p className="text-sm text-muted-foreground">Students get in touch with you directly. No middlemen.</p>
              </div>
              <div className="order-3 md:order-2">
                <h3 className="font-medium text-foreground">Empathy</h3>
                <p className="text-sm text-muted-foreground">Who'd know students better than students themselves?</p>
              </div>
              <div className="order-4">
                <h3 className="font-medium text-foreground">Values</h3>
                <p className="text-sm text-muted-foreground">Shikshaq is built by NGO AquaTerra, with the aim of helping students learn.</p>
              </div>
            </div>

            <Link to="/join/apply" className="inline-block mt-6 md:mt-8">
              <Button size="lg" className="gap-2">
                Apply to Join
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Have questions? <a href={getWhatsAppLink('8240980312')} className="text-foreground hover:underline">Contact us on WhatsApp</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
