import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppIcon, InstagramIcon } from '@/components/BrandIcons';

interface PageContent {
  id: string;
  page_type: 'general' | 'subject' | 'board' | 'subject_board';
  subject_slug: string | null;
  board_slug: string | null;
  heading: string;
  short_content: string | null;
  full_content: string;
}

interface FooterProps {
  expandedContent?: string | null; // EXPANDED content from Shikshaqmine for teacher profiles
}

export function Footer({ expandedContent }: FooterProps = {}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedContentExpanded, setIsExpandedContentExpanded] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchPageContent() {
      try {
        setLoading(true);
        
        // Extract subject/board slug from pathname
        const pathname = location.pathname;
        
        // Don't show Footer content on teacher profile pages (they have their own EXPANDED section)
        if (pathname.startsWith('/tuition-teachers/')) {
          setLoading(false);
          return;
        }
        
        let subjectSlug: string | null = null;
        let boardSlug: string | null = null;
        
        // Known board slugs from boardMapping
        const boardPathSlugs: Record<string, string> = {
          '/cbse-ncert-tuition-teachers-in-kolkata': 'cbse',
          '/icse-tuition-teachers-in-kolkata': 'icse',
          '/igcse-tuition-teachers-in-kolkata': 'igcse',
          '/international-board-tuition-teachers-in-kolkata': 'ib',
          '/state-board-tuition-teachers-in-kolkata': 'state',
        };
        
        // Check if it's a board page first
        if (boardPathSlugs[pathname]) {
          boardSlug = boardPathSlugs[pathname];
        } 
        // Check if it's a subject page (pattern: /{subject}-tuition-teachers-in-kolkata)
        // But exclude /all-tuition-teachers-in-kolkata
        else if (pathname !== '/all-tuition-teachers-in-kolkata') {
          const subjectMatch = pathname.match(/^\/([^-]+)-tuition-teachers-in-kolkata/);
          if (subjectMatch) {
            subjectSlug = subjectMatch[1].toLowerCase();
          }
        }
        
        // Extract board from URL params (e.g., filter_boards=ICSE -> icse)
        // This takes precedence if both pathname and params have board info
        const boardFromUrl = searchParams.get('filter_boards')?.split(',')[0]?.trim();
        if (boardFromUrl) {
          boardSlug = boardFromUrl.toLowerCase();
        }
        
        // Determine page type and build query
        let query = supabase
          .from('page_content')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(1);

        if (subjectSlug && boardSlug) {
          // Both subject and board - try subject_board first
          query = query
            .eq('page_type', 'subject_board')
            .eq('subject_slug', subjectSlug)
            .eq('board_slug', boardSlug);
        } else if (boardSlug) {
          // Only board
          query = query
            .eq('page_type', 'board')
            .eq('board_slug', boardSlug);
        } else if (subjectSlug) {
          // Only subject
          query = query
            .eq('page_type', 'subject')
            .eq('subject_slug', subjectSlug);
        } else {
          // General page (no filters)
          query = query
            .eq('page_type', 'general')
            .is('subject_slug', null)
            .is('board_slug', null);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching page content:', error);
          // Fallback to default content
          setPageContent({
            id: 'default',
            page_type: 'general',
            subject_slug: null,
            board_slug: null,
            heading: 'Find the best teachers for you',
            short_content: null,
            full_content: 'Whether you need help with Mathematics, Science, English, Commerce, or any other subject, our verified teachers are here to help you succeed. All teachers on our platform have been verified and come with student reviews to help you make an informed decision.'
          });
          return;
        }

        // If no exact match found, try fallback
        if (!data || data.length === 0) {
          if (subjectSlug && boardSlug) {
            // Try subject-only fallback
            const { data: subjectData } = await supabase
              .from('page_content')
              .select('*')
              .eq('is_active', true)
              .eq('page_type', 'subject')
              .eq('subject_slug', subjectSlug)
              .order('display_order', { ascending: true })
              .limit(1);
            
            if (subjectData && subjectData.length > 0) {
              setPageContent(subjectData[0] as PageContent);
              return;
            }
          }
          
          // Fallback to general content
          const { data: generalData } = await supabase
            .from('page_content')
            .select('*')
            .eq('is_active', true)
            .eq('page_type', 'general')
            .is('subject_slug', null)
            .is('board_slug', null)
            .order('display_order', { ascending: true })
            .limit(1);
          
          if (generalData && generalData.length > 0) {
            setPageContent(generalData[0] as PageContent);
            return;
          }
          
          // Ultimate fallback
          setPageContent({
            id: 'default',
            page_type: 'general',
            subject_slug: null,
            board_slug: null,
            heading: 'Find the best teachers for you',
            short_content: null,
            full_content: 'Whether you need help with Mathematics, Science, English, Commerce, or any other subject, our verified teachers are here to help you succeed. All teachers on our platform have been verified and come with student reviews to help you make an informed decision.'
          });
        } else {
          setPageContent(data[0] as PageContent);
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        // Fallback to default content
        setPageContent({
          id: 'default',
          page_type: 'general',
          subject_slug: null,
          board_slug: null,
          heading: 'Find the best teachers for you',
          short_content: null,
          full_content: 'Whether you need help with Mathematics, Science, English, Commerce, or any other subject, our verified teachers are here to help you succeed. All teachers on our platform have been verified and come with student reviews to help you make an informed decision.'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPageContent();
    // Reset expanded state when content changes
    setIsExpanded(false);
  }, [location.pathname, searchParams]);

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
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
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

      {/* Find the best teachers section - EXPANDED content from teacher profiles */}
      {expandedContent && (
        <div className="container pb-6">
          <div className="max-w-4xl">
            <h1 className="text-sm font-normal text-foreground mb-2">
              Find the best teachers for you
            </h1>
            {isExpandedContentExpanded && (
              <div 
                className="text-sm text-muted-foreground mb-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: (() => {
                    const content = expandedContent || '';
                    // If content contains HTML tags, render as-is
                    // Otherwise, convert line breaks to <br /> tags
                    if (/<[a-z][\s\S]*>/i.test(content)) {
                      return content;
                    }
                    return content.replace(/\n/g, '<br />');
                  })()
                }}
              />
            )}
            {expandedContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpandedContentExpanded(!isExpandedContentExpanded)}
                className="mt-2 p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
              >
                {isExpandedContentExpanded ? (
                  <>
                    Read less
                    <ChevronUp className="w-3 h-3 ml-1" />
                  </>
                ) : (
                  <>
                    Read more
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Find the best teachers section */}
      {!loading && pageContent && (
        <div className="container pb-6">
          <div className="max-w-4xl">
            <h1 className="text-sm font-normal text-foreground mb-2">
              {pageContent.heading}
            </h1>
            {(isExpanded || pageContent.short_content) && (
              <div 
                className="text-sm text-muted-foreground mb-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: (() => {
                    const content = isExpanded 
                      ? pageContent.full_content 
                      : (pageContent.short_content || pageContent.full_content);
                    // If content contains HTML tags, render as-is
                    // Otherwise, convert line breaks to <br /> tags
                    if (/<[a-z][\s\S]*>/i.test(content)) {
                      return content;
                    }
                    return content.replace(/\n/g, '<br />');
                  })()
                }}
              />
            )}
            {pageContent.full_content && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <>
                    Read less
                    <ChevronUp className="w-3 h-3 ml-1" />
                  </>
                ) : (
                  <>
                    Read more
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="border-t border-border">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />

            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/all-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
                Browse Teachers
              </Link>
              <Link to="/more" className="text-foreground/80 hover:text-foreground transition-colors">
                Help
              </Link>
              <Link to="/terms" className="text-foreground/80 hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-foreground/80 hover:text-foreground transition-colors">
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
                <WhatsAppIcon className="w-5 h-5 text-foreground" />
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
                <InstagramIcon className="w-5 h-5 text-foreground" />
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
            <Link to="/accounts-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Accounts in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/act-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for ACT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/bengali-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Bengali in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/biology-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Biology in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/business-studies-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Business Studies in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/ca-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for CA in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/cat-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for CAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/cfa-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for CFA in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/chemistry-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Chemistry in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/commerce-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Commerce in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/commercial-studies-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Commercial Studies in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/computer-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Computer in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/drawing-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Drawing in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/economics-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Economics in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/english-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for English in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/environmental-science-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Environmental Science in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/geography-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Geography in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/gmat-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for GMAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/hindi-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Hindi in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/history-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for History in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/maths-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Maths in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/nmat-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for NMAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/physics-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Physics in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/political-science-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Political Science in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/psychology-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Psychology in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/sat-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for SAT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/science-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Science in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/sociology-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for Sociology in Kolkata
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Board Links Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="container py-6">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Find via BOARD
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
            <Link to="/all-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for All teachers in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/cbse-ncert-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for CBSE/NCERT in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/icse-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for ICSE in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/igcse-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for IGCSE in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/international-board-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for International Board in Kolkata
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/state-board-tuition-teachers-in-kolkata" className="text-foreground/80 hover:text-foreground transition-colors">
              Tuition teachers for State Board in Kolkata
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
