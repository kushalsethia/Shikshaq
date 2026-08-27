import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { PreFooter, preFooterFor, type PreFooterVariant, type B2Counts } from '@/components/layout/PreFooter';
import { BottomNavSpacer } from '@/components/layout/PageContainer';
import { isChromelessPath } from '@/lib/chromeless-routes';

/* AppShell — the single place shell config for every route is decided.

   pages.md §"Shell config for every route": "three decisions, made in
   AppShell, never in the page: control block ..., pre-footer block (B1-B4),
   nav (bottom tabs on mobile, top bar on desktop, always both, never
   per-page)." Before this component existed, ~28 page files each hand
   assembled their own Footer/PreFooter/BottomNav combination — some correct,
   some missing a pre-footer entirely, some duplicating a <Footer/> across
   every loading/error/success branch. AppShell is mounted once, above
   <Routes>, so none of that per-branch duplication is possible any more:
   whichever branch a page returns, the chrome around it is the same.

   Nav (TopBar + Navbar, the desktop bar and the mobile sticky bar + sheet)
   and BottomNav were already mounted once globally in App.tsx before this
   change — that part of "never per-page" already held. What moves here is
   Footer + PreFooter + BottomNavSpacer, which used to live inside every page.

   The auth flow, the admin console, and the paper reader are chromeless —
   no TopBar/Navbar/BottomNav/Footer/PreFooter at all, full-bleed screens with
   their own header. Admin additionally gets its own rail/toolbar shell
   (pages.md §15, not built yet) rather than this consumer AppShell. */

export { useIsChromelessRoute } from '@/lib/chromeless-routes';

export interface ChromeConfig {
  /** Override the pre-footer variant this route would otherwise get from `preFooterFor(pathname)`. Pass `'none'` to render no pre-footer at all (e.g. the reader). */
  preFooter?: PreFooterVariant | 'none';
  /** B2 live counts (teachers/reviews) — only the routes that have real counts to show need to call this. */
  preFooterCounts?: B2Counts;
  /** Extra "Find the best teachers for you" copy the Footer renders under a teacher profile. */
  footerExpandedContent?: string | null;
}

interface ChromeContextValue {
  setChrome: (patch: ChromeConfig | null) => void;
}

const ChromeContext = createContext<ChromeContextValue | null>(null);

/**
 * Lets a page override its pre-footer variant/counts or supply Footer's
 * `expandedContent`, without importing PreFooter/Footer itself. Most routes
 * never call this — AppShell already derives the right B1-B4 variant from the
 * URL via `preFooterFor`. Only Browse and TeacherProfile (live counts) and
 * the reader (no pre-footer) need it.
 */
export function useChromeConfig(config: ChromeConfig | null) {
  const ctx = useContext(ChromeContext);
  // Stringify so a fresh object literal passed on every render doesn't
  // re-trigger the effect (and, in dev/StrictMode, doesn't loop).
  const key = config ? JSON.stringify(config) : null;
  useEffect(() => {
    if (!ctx) return;
    ctx.setChrome(config ?? null);
    return () => ctx.setChrome(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, key]);
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const chromeless = isChromelessPath(location.pathname);
  const [chrome, setChrome] = useState<ChromeConfig | null>(null);

  // Reset any page-supplied override the moment the route changes, so a
  // stale `preFooter: 'none'` from the previous page can't leak onto the
  // next one before that page's own effect has a chance to run.
  useEffect(() => {
    setChrome(null);
  }, [location.pathname]);

  const ctxValue = useMemo<ChromeContextValue>(() => ({ setChrome }), []);

  const variant: PreFooterVariant | 'none' = chrome?.preFooter ?? preFooterFor(location.pathname);

  return (
    <ChromeContext.Provider value={ctxValue}>
      {!chromeless && (
        <>
          <TopBar />
          <Navbar />
        </>
      )}

      {children}

      {!chromeless && (
        <>
          {variant !== 'none' && <PreFooter variant={variant} counts={chrome?.preFooterCounts} />}
          <BottomNavSpacer />
          <Footer expandedContent={chrome?.footerExpandedContent} />
          <BottomNav />
        </>
      )}
    </ChromeContext.Provider>
  );
}
