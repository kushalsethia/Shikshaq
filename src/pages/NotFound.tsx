import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { PreFooter, preFooterFor } from '@/components/layout/PreFooter';
import { PageContainer, BottomNavSpacer } from '@/components/layout/PageContainer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { BROWSE_PATH, PAST_PAPERS_PATH } from '@/lib/nav-config';

// F5 — an orange slab with a giant ghosted "404", a tilted "Wrong classroom"
// sticker and two real exits (changelog C-039). Copy is verbatim from
// copy.md §12. Ends with the standard pre-footer -> sentence footer ->
// rounded footer sequence, per design.md §0.9 — no exceptions, error pages
// included.
const NotFound = () => {
  const location = useLocation();

  usePageMeta(
    "This page isn't on the timetable | Shikshaq",
    'The link may be old. Try a subject, or start a new search.'
  );

  /* Soft-404 defence. vercel.json rewrites everything to index.html, so a
     garbage URL returns HTTP 200 and Google indexes it as thin content, then
     reports it under "Soft 404". A real 404 status is not available from a
     static SPA, so `noindex, follow` is the practical fix — follow, not
     nofollow, so the two working exits on this page still pass equity.

     This is paired with removing `Disallow: /404` from robots.txt: a page
     that cannot be fetched cannot have its noindex read. */
  useEffect(() => {
    const tag = document.createElement('meta');
    tag.name = 'robots';
    tag.content = 'noindex, follow';
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">

      <main>
        <PageContainer as="section" className="flex flex-col items-center justify-center pt-10 sm:pt-16 lg:pt-20">
          <div className="relative w-full max-w-[430px] overflow-hidden rounded-[26px] bg-brand p-[18px] pb-[22px] text-brand-foreground sm:p-8 sm:pb-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-[10px] -top-[18px] select-none font-display text-[120px] font-black leading-none tracking-[-0.06em] text-brand-foreground/18 sm:text-[180px]"
            >
              404
            </span>

            <span className="relative inline-flex h-6 -rotate-[4deg] items-center whitespace-nowrap rounded-full bg-panel px-[10px] text-[10.5px] font-extrabold text-background">
              Wrong classroom
            </span>

            <h1 className="relative mt-3 font-display text-[26px] font-black leading-[1.1] tracking-[-0.04em] sm:text-[34px]">
              This page isn&rsquo;t on the timetable.
            </h1>
            <p className="relative mb-[14px] mt-2 text-[13.5px] leading-[1.55] text-brand-foreground/85 sm:text-body-secondary">
              The link may be old. Try a subject, or start a new search.
            </p>

            <div className="relative flex gap-2">
              <Button className="flex-1" to={BROWSE_PATH} tone="light">
                Find a teacher
              </Button>
              <Button className="flex-1" to={PAST_PAPERS_PATH} tone="tint">
                Read papers
              </Button>
            </div>
          </div>
        </PageContainer>

        <PageContainer as="section" className="py-8 sm:py-12">
          <PreFooter variant={preFooterFor(location.pathname)} />
        </PageContainer>
        <BottomNavSpacer />
      </main>

      <Footer />
    </div>
  );
};

// A tiny local pill-link — the mockup's two 44px CTAs inside the orange card
// are equal-weight exits, not the product's Button variants (one is bone,
// one is white-at-18%-on-orange), so they're built inline rather than
// stretching the shared Button's tone ramp for a one-off pairing.
function Button({
  to,
  tone,
  className,
  children,
}: {
  to: string;
  tone: 'light' | 'tint';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl text-[13.5px] font-bold transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand ${
        tone === 'light' ? 'bg-card text-foreground' : 'bg-brand-foreground/18 text-brand-foreground'
      } ${className ?? ''}`}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

export default NotFound;
