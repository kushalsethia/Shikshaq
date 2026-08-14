import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
        <div className="text-[clamp(64px,12vw,132px)] leading-none font-extrabold tracking-tight text-border">
          404
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          This page is not on the syllabus
        </h1>
        <p className="mt-3 max-w-prose mx-auto text-base text-muted-foreground">
          The link may be old, or the paper may have been unpublished at a school's request.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.97] transition-transform duration-150"
          >
            Back home
          </Link>
          <Link
            to="/all-tuition-teachers-in-kolkata"
            className="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-lg ring-1 ring-warm-hairline-strong text-foreground text-sm font-semibold active:scale-[0.97] transition-transform duration-150"
          >
            Browse teachers
          </Link>
          <Link
            to="/past-papers"
            className="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-lg ring-1 ring-warm-hairline-strong text-foreground text-sm font-semibold active:scale-[0.97] transition-transform duration-150"
          >
            Past papers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
