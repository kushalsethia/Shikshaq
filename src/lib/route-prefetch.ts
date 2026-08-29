/* Fetch a route's JavaScript before the click, not after it.

   Every page in this app is a lazy chunk, so the first visit to a route pays
   for downloading and parsing it while the reader stares at a spinner —
   measured at ~190ms of the ~630ms it took to open Browse from Home. The
   pointer arrives at a link a good few hundred milliseconds before the click
   does, which is enough time to have the chunk already in memory.

   Deliberately modest about it:
   - only same-origin, in-app hrefs
   - each route imported at most once (the browser caches the module anyway,
     but this avoids the repeated promise churn on a link the pointer crosses
     several times)
   - nothing prefetches on a slow or metered connection, where speculative
     downloads cost the reader real money
   - `pointerenter` and `touchstart`, so it covers mouse and touch alike */

type Importer = () => Promise<unknown>;

/* Paths are matched longest-first, so '/past-papers/results' wins over
   '/past-papers'. Keep in step with the lazy imports in App.tsx — a missing
   entry costs nothing but the prefetch. */
const ROUTES: [string, Importer][] = [
  ['/all-tuition-teachers-in-kolkata', () => import('@/pages/Browse')],
  ['/past-papers/results', () => import('@/pages/PaperResults')],
  ['/past-papers', () => import('@/pages/PastPapers')],
  ['/submit-a-paper', () => import('@/pages/SubmitPaper')],
  ['/tuition-teachers/', () => import('@/pages/TeacherProfile')],
  ['/recommend-teacher', () => import('@/pages/RecommendTeacher')],
  ['/auth', () => import('@/pages/Auth')],
  ['/about', () => import('@/pages/About')],
  ['/help', () => import('@/pages/Help')],
  ['/contact', () => import('@/pages/Contact')],
  ['/join', () => import('@/pages/Join')],
  ['/faq', () => import('@/pages/FAQ')],
];

const done = new Set<string>();

function saveData(): boolean {
  const c = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!c) return false;
  return Boolean(c.saveData) || /(^|-)2g$/.test(c.effectiveType ?? '');
}

/** Warms the chunk behind a pathname. Safe to call as often as you like. */
export function prefetchRoute(pathname: string): void {
  if (saveData()) return;
  const match = ROUTES
    .filter(([prefix]) => pathname === prefix || pathname.startsWith(prefix))
    .sort((a, b) => b[0].length - a[0].length)[0];
  if (!match) return;
  const [key, load] = match;
  if (done.has(key)) return;
  done.add(key);
  void load().catch(() => { done.delete(key); });
}

/** One delegated listener for the whole app; returns its own cleanup. */
export function installRoutePrefetch(): () => void {
  if (typeof window === 'undefined') return () => {};

  const onIntent = (e: Event) => {
    const el = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!el) return;
    const href = el.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;
    if (el.target && el.target !== '_self') return;
    prefetchRoute(href.split('?')[0].split('#')[0]);
  };

  window.addEventListener('pointerenter', onIntent, { capture: true, passive: true });
  window.addEventListener('touchstart', onIntent, { capture: true, passive: true });
  return () => {
    window.removeEventListener('pointerenter', onIntent, { capture: true });
    window.removeEventListener('touchstart', onIntent, { capture: true });
  };
}
