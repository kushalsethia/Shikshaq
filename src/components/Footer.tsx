import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* CTA Section */}
      <div className="container py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 p-12 md:p-16 text-center">
          {/* Background Images - Overlapping and semi-transparent */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Top-left: Desk with cup and notebook */}
            <div 
              className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-purple-500 rounded-full blur-3xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                transform: 'translate(-20%, -20%)',
              }}
            />
            
            {/* Middle-left: Laptop typing */}
            <div 
              className="absolute top-1/4 left-0 w-40 h-40 md:w-56 md:h-56 bg-purple-400 rounded-full blur-3xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%)',
                transform: 'translate(-15%, -10%)',
              }}
            />
            
            {/* Bottom-left: Person reading */}
            <div 
              className="absolute bottom-0 left-0 w-44 h-44 md:w-60 md:h-60 bg-purple-500 rounded-full blur-3xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
                transform: 'translate(-25%, 20%)',
              }}
            />
            
            {/* Top-right: Classroom desk */}
            <div 
              className="absolute top-0 right-0 w-52 h-52 md:w-72 md:h-72 bg-purple-400 rounded-full blur-3xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, transparent 70%)',
                transform: 'translate(20%, -25%)',
              }}
            />
            
            {/* Bottom-right: Light fixture */}
            <div 
              className="absolute bottom-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-purple-300 rounded-full blur-3xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(221, 214, 254, 0.4) 0%, transparent 70%)',
                transform: 'translate(15%, 25%)',
              }}
            />
            
            {/* Middle-right: Documents */}
            <div 
              className="absolute top-1/3 right-1/4 w-40 h-40 md:w-56 md:h-56 bg-purple-500 rounded-full blur-3xl"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
                transform: 'translate(10%, -5%)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <p className="text-purple-50 mb-2 text-sm md:text-base">Free of charge, no commissions!</p>
            <h2 className="text-2xl md:text-4xl font-serif text-white mb-6">
              Join ShikshAQ as a teacher today!
            </h2>
            <Link 
              to="/join" 
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-border">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />

            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Teachers
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/8240980312"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="mailto:join.shikshaq@gmail.com"
                className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
              >
                <Mail className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="https://www.instagram.com/shikshaq.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
              >
                <Instagram className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ShikshAq. An Aquaterra Start-up.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
