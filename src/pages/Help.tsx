import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/FAQ';
import { MessageCircle, Mail, Instagram } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions or reach out to our team directly.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          <a
            href="https://wa.me/8240980312"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 bg-badge-science/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-badge-science" />
            </div>
            <h3 className="font-medium text-foreground mb-2">WhatsApp</h3>
            <p className="text-sm text-muted-foreground">Quick responses on chat</p>
          </a>

          <a
            href="mailto:join.shikshaq@gmail.com"
            className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 bg-badge-commerce/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-badge-commerce" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">join.shikshaq@gmail.com</p>
          </a>

          <a
            href="https://www.instagram.com/shikshaq.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
          >
            <div className="w-12 h-12 bg-badge-hindi/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="w-6 h-6 text-badge-hindi" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Instagram</h3>
            <p className="text-sm text-muted-foreground">@shikshaq.in</p>
          </a>
        </div>

        {/* FAQ */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
