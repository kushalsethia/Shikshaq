import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { WhatsAppIcon, InstagramIcon } from '@/components/BrandIcons';
import DOMPurify from 'dompurify';
import aquaterraLogo from '@/assets/Frame 48095868.png';

type FooterLink = { to: string; label: string };

const BOARD_FOOTER_LINKS: FooterLink[] = [
  { to: '/all-tuition-teachers-in-kolkata', label: 'All boards' },
  { to: '/cbse-ncert-tuition-teachers-in-kolkata', label: 'CBSE / NCERT' },
  { to: '/icse-tuition-teachers-in-kolkata', label: 'ICSE' },
  { to: '/igcse-tuition-teachers-in-kolkata', label: 'IGCSE' },
  { to: '/international-board-tuition-teachers-in-kolkata', label: 'International Board' },
  { to: '/state-board-tuition-teachers-in-kolkata', label: 'WB State Board' },
];

const footerContentCache = new Map<string, PageContent>();

const SUBJECT_SEO_LINKS: FooterLink[] = [
  { to: '/accounts-tuition-teachers-in-kolkata', label: 'Accounts' },
  { to: '/act-tuition-teachers-in-kolkata', label: 'ACT' },
  { to: '/bengali-tuition-teachers-in-kolkata', label: 'Bengali' },
  { to: '/biology-tuition-teachers-in-kolkata', label: 'Biology' },
  { to: '/business-studies-tuition-teachers-in-kolkata', label: 'Business Studies' },
  { to: '/ca-tuition-teachers-in-kolkata', label: 'CA' },
  { to: '/cat-tuition-teachers-in-kolkata', label: 'CAT' },
  { to: '/cfa-tuition-teachers-in-kolkata', label: 'CFA' },
  { to: '/chemistry-tuition-teachers-in-kolkata', label: 'Chemistry' },
  { to: '/clat-tuition-teachers-in-kolkata', label: 'CLAT' },
  { to: '/commerce-tuition-teachers-in-kolkata', label: 'Commerce' },
  { to: '/commercial-studies-tuition-teachers-in-kolkata', label: 'Commercial Studies' },
  { to: '/computer-tuition-teachers-in-kolkata', label: 'Computer' },
  { to: '/drawing-tuition-teachers-in-kolkata', label: 'Drawing' },
  { to: '/economics-tuition-teachers-in-kolkata', label: 'Economics' },
  { to: '/english-tuition-teachers-in-kolkata', label: 'English' },
  { to: '/environmental-science-tuition-teachers-in-kolkata', label: 'Environmental Science' },
  { to: '/geography-tuition-teachers-in-kolkata', label: 'Geography' },
  { to: '/gmat-tuition-teachers-in-kolkata', label: 'GMAT' },
  { to: '/hindi-tuition-teachers-in-kolkata', label: 'Hindi' },
  { to: '/history-tuition-teachers-in-kolkata', label: 'History' },
  { to: '/maths-tuition-teachers-in-kolkata', label: 'Maths' },
  { to: '/nmat-tuition-teachers-in-kolkata', label: 'NMAT' },
  { to: '/physics-tuition-teachers-in-kolkata', label: 'Physics' },
  { to: '/political-science-tuition-teachers-in-kolkata', label: 'Political Science' },
  { to: '/psychology-tuition-teachers-in-kolkata', label: 'Psychology' },
  { to: '/sat-tuition-teachers-in-kolkata', label: 'SAT' },
  { to: '/science-tuition-teachers-in-kolkata', label: 'Science' },
  { to: '/social-studies-tuition-teachers-in-kolkata', label: 'Social Studies' },
  { to: '/sociology-tuition-teachers-in-kolkata', label: 'Sociology' },
];

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

// Dark panel — VISUAL_LANGUAGE.md §2.1 `#1B1A18` (the `panel` token). Text roles
// below are picked for 4.5:1+ contrast against that near-black, using only
// existing tokens/Tailwind built-ins (no new hex values).
const COL_LABEL = 'text-xs font-medium uppercase tracking-wide text-white/70';
// Safari still paints a disclosure triangle even with `list-none`.
const SUMMARY_RESET = '[&::-webkit-details-marker]:hidden';
const FOOTER_LINK = 'flex min-h-[44px] items-center text-sm text-white/85 transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-lg';

function sanitize(content: string) {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
  }
  return DOMPurify.sanitize(content.replace(/\n/g, '<br />'), { ALLOWED_TAGS: ['br'] });
}

function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <div className="grid">
      {links.map(({ to, label }) => (
        <Link key={to + label} to={to} className={FOOTER_LINK}>{label}</Link>
      ))}
    </div>
  );
}

/** Collapsible group — the mobile-compact form of a footer column. */
function FooterAccordion({ label, links }: { label: string; links: FooterLink[] }) {
  return (
    <details className="border-b border-white/10">
      <summary className={`flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 ${COL_LABEL} ${SUMMARY_RESET}`}>
        {label}
        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
      </summary>
      <div className="pb-2">
        <LinkList links={links} />
      </div>
    </details>
  );
}

export function Footer({ expandedContent }: FooterProps = {}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedContentExpanded, setIsExpandedContentExpanded] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const userRole = (profile?.role as 'student' | 'guardian' | 'teacher') || null;
  const [isAdmin, setIsAdmin] = useState(false);
  const dashboardPath = userRole === 'student' ? '/dashboard/student' : userRole === 'guardian' ? '/dashboard/guardian' : userRole === 'teacher' ? '/dashboard/teacher' : null;
  const [ctaTotals, setCtaTotals] = useState<{ teachers: number | null; papers: number | null; schools: number | null }>({ teachers: null, papers: null, schools: null });

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    let cancelled = false;
    supabase.from('admins').select('id').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (!cancelled) setIsAdmin(!!data);
    });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function fetchCtaTotals() {
      const [teachersRes, papersRes, schoolsRes] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('papers').select('school').eq('is_published', true),
      ]);
      if (cancelled) return;
      const schoolCount = schoolsRes.data ? new Set(schoolsRes.data.map((p) => p.school)).size : null;
      setCtaTotals({ teachers: teachersRes.count ?? null, papers: papersRes.count ?? null, schools: schoolCount });
    }
    fetchCtaTotals();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    async function fetchPageContent() {
      try {
        setLoading(true);

        const pathname = location.pathname;

        if (pathname.startsWith('/tuition-teachers/')) {
          setLoading(false);
          return;
        }

        // Check in-memory cache by route key to avoid re-fetching on back navigation
        const routeKey = pathname + '|' + (searchParams.get('filter_boards') || '');
        const cachedContent = footerContentCache.get(routeKey);
        if (cachedContent) {
          setPageContent(cachedContent);
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
          if (import.meta.env.DEV) {
            console.error('Error fetching page content:', error);
          }
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
              const content = subjectData[0] as PageContent;
              setPageContent(content);
              footerContentCache.set(routeKey, content);
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
            const content = generalData[0] as PageContent;
            setPageContent(content);
            footerContentCache.set(routeKey, content);
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
          const content = data[0] as PageContent;
          setPageContent(content);
          footerContentCache.set(routeKey, content);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching page content:', error);
        }
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

  const shikshaqLinks: FooterLink[] = [
    { to: '/', label: 'Home' },
    { to: '/all-tuition-teachers-in-kolkata', label: 'Browse teachers' },
    { to: '/past-papers', label: 'Past papers' },
    ...(dashboardPath ? [{ to: dashboardPath, label: 'Your dashboard' }] : []),
    { to: '/liked-teachers', label: 'Favourite teachers' },
    { to: '/about', label: 'About us' },
    { to: '/recommend-teacher', label: 'Recommend a teacher' },
  ];

  const supportLinks: FooterLink[] = [
    { to: '/more', label: 'Help' },
    { to: '/faq', label: 'FAQ' },
    { to: '/terms-of-service', label: 'Terms of Service' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
    ...(isAdmin ? [
      { to: '/admin/recommendations', label: 'Admin console' },
      { to: '/admin/papers', label: 'Admin · upload papers' },
    ] : []),
  ];

  const subjectLinks: FooterLink[] = SUBJECT_SEO_LINKS.map(({ to, label }) => ({
    to,
    label: `${label} tuition teachers in Kolkata`,
  }));

  return (
    <footer className="bg-panel text-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="space-y-8">
          {/* CTA tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <Link
              to="/all-tuition-teachers-in-kolkata"
              className="relative rounded-2xl bg-brand p-4 sm:p-6 text-brand-foreground transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className="absolute -top-2.5 -right-2.5 rotate-6 rounded-full bg-panel px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.04em] text-white shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)] motion-reduce:rotate-0"
              >
                Free
              </span>
              <span className="block text-lg font-semibold tabular-nums">
                {ctaTotals.teachers != null ? `${ctaTotals.teachers.toLocaleString('en-IN')} teachers →` : 'Teachers →'}
              </span>
              <span className="mt-2 block text-sm">Verified, across Kolkata. No commission.</span>
            </Link>

            <Link
              to="/past-papers"
              className="rounded-2xl bg-white/10 p-4 sm:p-6 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="block text-lg font-semibold tabular-nums text-brand-blue-subtle">
                {ctaTotals.papers != null ? `${ctaTotals.papers.toLocaleString('en-IN')} papers →` : 'Papers →'}
              </span>
              <span className="mt-2 block text-sm text-white/70 tabular-nums">
                {ctaTotals.schools != null ? `${ctaTotals.schools.toLocaleString('en-IN')} schools. ` : ''}Free, in-page, no download.
              </span>
            </Link>

            <Link
              to="/join"
              className="rounded-2xl bg-white/10 p-4 sm:p-6 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="block text-lg font-semibold text-white">Teach with us →</span>
              <span className="mt-2 block text-sm text-white/70">List free. Keep every rupee you charge.</span>
            </Link>
          </div>

          {/* Identity + socials */}
          <div className="space-y-4">
            <Logo size="nav" onDark />
            <p className="max-w-prose text-sm text-white/70">
              Quality tuition teachers in Kolkata, and past papers from Kolkata schools. Free on both counts.
            </p>
            <div className="flex gap-2">
              <a
                href="mailto:join.shikshaq@gmail.com"
                aria-label="Email Shikshaq"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-brand-blue-subtle transition-colors duration-150 hover:bg-brand-blue-subtle hover:text-brand-blue-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              </a>
              <a
                href="https://instagram.com/shikshaq.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shikshaq on Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-brand-subtle hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={getWhatsAppLink('8240980312')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shikshaq on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-brand-subtle hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile: collapsible groups, so the footer never becomes a wall of links
              stacked above the bottom tab bar. Desktop: open columns. */}
          <div className="lg:hidden">
            <FooterAccordion label="Shikshaq" links={shikshaqLinks} />
            <FooterAccordion label="Support & legal" links={supportLinks} />
            <FooterAccordion label="Teachers by board · Kolkata" links={BOARD_FOOTER_LINKS} />
            <FooterAccordion label="Tuition teachers by subject in Kolkata" links={subjectLinks} />
          </div>

          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            <div className="space-y-2">
              <h2 className={COL_LABEL}>Shikshaq</h2>
              <LinkList links={shikshaqLinks} />
            </div>
            <div className="space-y-2">
              <h2 className={COL_LABEL}>Support &amp; legal</h2>
              <LinkList links={supportLinks} />
            </div>
            <div className="space-y-2">
              <h2 className={COL_LABEL}>Teachers by board · Kolkata</h2>
              <LinkList links={BOARD_FOOTER_LINKS} />
            </div>
          </div>

          <details className="hidden border-t border-white/10 pt-4 lg:block">
            <summary className={`flex min-h-[44px] cursor-pointer list-none items-center gap-2 ${COL_LABEL} ${SUMMARY_RESET}`}>
              Tuition teachers by subject in Kolkata
              <ChevronDown className="h-4 w-4" aria-hidden />
            </summary>
            <div className="flex flex-wrap gap-x-6">
              {subjectLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={`${FOOTER_LINK} whitespace-nowrap text-xs text-white/70`}>
                  {label}
                </Link>
              ))}
            </div>
          </details>

          <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
            Past papers are the property of the schools that set them. Shikshaq claims no ownership and hosts them as a free community resource.{' '}
            <Link to="/terms-of-service" className="text-brand-blue-subtle underline-offset-2 hover:underline">Read our full position</Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
            <a
              href="https://ngoaquaterra.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2 transition-opacity duration-150 hover:opacity-70"
            >
              <span>© {new Date().getFullYear()} Shikshaq. An AquaTerra Start-up.</span>
              <img
                src={aquaterraLogo}
                alt="AquaTerra"
                width={64}
                height={17}
                loading="lazy"
                decoding="async"
                className="h-4 w-auto object-contain opacity-70"
              />
            </a>
            <span>Kolkata, West Bengal, India</span>
          </div>
        </div>
      </div>

      {/* Find the best teachers section - EXPANDED content from teacher profiles */}
      {expandedContent && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-prose">
            <h2 className="text-lg font-semibold">Find the best teachers for you</h2>
            {isExpandedContentExpanded && (
              <div
                className="prose prose-sm mt-2 max-w-none text-sm text-white/70"
                dangerouslySetInnerHTML={{ __html: sanitize(expandedContent || '') }}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpandedContentExpanded(!isExpandedContentExpanded)}
              className="mt-2 h-11 px-1 -mx-1 text-sm text-white/70 hover:text-white"
            >
              {isExpandedContentExpanded ? (
                <>Read less<ChevronUp className="ml-2 h-4 w-4" /></>
              ) : (
                <>Read more<ChevronDown className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Find the best teachers section */}
      {!loading && pageContent && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-prose">
            <h2 className="text-lg font-semibold">{pageContent.heading}</h2>
            {(isExpanded || pageContent.short_content) && (
              <div
                className="prose prose-sm mt-2 max-w-none text-sm text-white/70"
                dangerouslySetInnerHTML={{
                  __html: sanitize(
                    isExpanded ? pageContent.full_content : (pageContent.short_content || pageContent.full_content),
                  ),
                }}
              />
            )}
            {pageContent.full_content && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 h-11 px-1 -mx-1 text-sm text-white/70 hover:text-white"
              >
                {isExpanded ? (
                  <>Read less<ChevronUp className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Read more<ChevronDown className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
