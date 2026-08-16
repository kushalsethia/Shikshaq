import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { MapPinOff } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

// A dead end, designed as one (VISUAL_DIRECTION.md §4/§2): the metaphor is
// wayfinding, so a 404 is "wrong turn, here's the map back" — not an apology
// page. Loud surface, full Cluster A permission: sticker badge, offset
// shadow, halftone grain. Always offers a genuine route back to BOTH halves
// of the product (teachers and papers), never just "home".
const NotFound = () => {
  const location = useLocation();

  usePageMeta(
    'Page not found | Shikshaq',
    'This page is not on the syllabus. The link may be old, or the paper may have been unpublished at a school\'s request.'
  );

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16 sm:py-20">
      <div className="halftone-overlay relative w-full max-w-lg overflow-hidden rounded-2xl bg-card p-6 text-center shadow-border sm:p-12">
        <span className="sticker sticker-rotate-md outline-offset-shadow relative z-10 mb-6 inline-flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-brand-blue/15 text-brand-blue">
          <MapPinOff className="h-9 w-9" strokeWidth={2} aria-hidden="true" />
        </span>

        <div className="relative z-10 text-[clamp(56px,10vw,96px)] font-display font-black leading-none tracking-tight text-border">
          404
        </div>
        <h1 className="relative z-10 mt-4 text-page-title font-display font-semibold text-foreground">
          This page is not on the syllabus
        </h1>
        <p className="relative z-10 mx-auto mt-3 max-w-prose text-body-secondary text-muted-foreground">
          The link may be old, or the paper may have been unpublished at a school's request. Here's the way
          back to both halves of ShikshAQ.
        </p>

        <div className="stagger-children relative z-10 mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-12 animate-card-reveal items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-transform duration-tap active:scale-[0.97]"
          >
            Back home
          </Link>
          <Link
            to="/all-tuition-teachers-in-kolkata"
            className="signpost inline-flex min-h-12 animate-card-reveal items-center justify-center bg-muted pl-6 text-sm font-semibold text-foreground transition-transform duration-tap active:scale-[0.97]"
          >
            Browse teachers
          </Link>
          <Link
            to="/past-papers"
            className="signpost inline-flex min-h-12 animate-card-reveal items-center justify-center bg-muted pl-6 text-sm font-semibold text-foreground transition-transform duration-tap active:scale-[0.97]"
          >
            Past papers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
