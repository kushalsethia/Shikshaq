import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/utils/whatsapp';

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
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
              We're always on the lookout for the best tuition teachers!
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/recommend-teacher" 
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:scale-105 transition-all duration-200 text-center"
              >
                Recommend a Teacher
              </Link>
              <a
                href="https://forms.gle/6ks9bpsz2EojgfrQA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:scale-105 transition-all duration-200 text-center"
              >
                I am a Teacher
              </a>
            </div>
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
                href={getWhatsAppLink('8240980312')}
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
                href="https://instagram.com/shikshaq.in"
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

      {/* SEO Subject Links Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="container py-6">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Find via SUBJECT
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
            <Link to="/accounts-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Accounts in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/act-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for ACT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/bengali-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Bengali in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/biology-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Biology in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/business-studies-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Business Studies in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/ca-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for CA in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/cat-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for CAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/cfa-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for CFA in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/chemistry-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Chemistry in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/commerce-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Commerce in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/commercial-studies-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Commercial Studies in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/computer-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Computer in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/drawing-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Drawing in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/economics-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Economics in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/english-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for English in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/environmental-science-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Environmental Science in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/geography-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Geography in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/gmat-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for GMAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/hindi-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Hindi in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/history-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for History in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/maths-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Maths in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/nmat-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for NMAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/physics-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Physics in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/political-science-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Political Science in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/psychology-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Psychology in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/sat-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for SAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/science-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Science in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/sociology-tuition-teachers-in-kolkata" className="text-muted-foreground hover:text-foreground transition-colors">
              Tuition teachers for Sociology in Kolkata
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
