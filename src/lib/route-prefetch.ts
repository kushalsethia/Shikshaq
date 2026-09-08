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
  /* Added — every one of these is a real, commonly-hovered nav/footer/card
     destination that was silently missing from this table (a missing entry
     costs nothing but the prefetch, so nothing broke; it just meant these
     routes never got the warm-chunk treatment the rest of the app has had
     since this file was written). */
  ['/account', () => import('@/pages/Account')],
  ['/dashboard/teacher', () => import('@/pages/TeacherDashboard')],
  ['/subjects', () => import('@/pages/SubjectsPage')],
  ['/schools', () => import('@/pages/SchoolsPage')],
  ['/school/', () => import('@/pages/SchoolPage')],
  ['/blog/', () => import('@/pages/BlogPost')],
  ['/blog', () => import('@/pages/Blog')],
  ['/select-role', () => import('@/pages/SelectRole')],
  ['/teacher-terms-agreement', () => import('@/pages/TeacherTermsAgreement')],
  ['/signup-success', () => import('@/pages/SignUpSuccess')],
];

/* The ~30 subject and 5 board landing pages (`/maths-tuition-teachers-in-
   kolkata`, `/icse-tuition-teachers-in-kolkata`, ...) all share one suffix
   but no common prefix, so they can't join the table above without listing
   every slug — duplicating App.tsx's route list a second time, which is
   exactly the staleness risk this file's own top comment warns about ("keep
   in step with the lazy imports"). A suffix rule needs only the 5 board
   slugs (subject is the default), so it stays correct as subjects are added
   without ever being touched again. */
const BOARD_SLUGS = new Set([
  'cbse-ncert', 'icse', 'igcse', 'international-board', 'state-board',
]);

function subjectOrBoardImport(pathname: string): [string, Importer] | null {
  const m = /^\/([a-z-]+)-tuition-teachers-in-kolkata\/?$/.exec(pathname);
  if (!m || m[1] === 'all') return null; // '/all-...' is Browse, already in ROUTES
  return BOARD_SLUGS.has(m[1])
    ? ['board-page', () => import('@/pages/BoardPage')]
    : ['subject-page', () => import('@/pages/SubjectPage')];
}

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
  const staticMatch = ROUTES
    .filter(([prefix]) => pathname === prefix || pathname.startsWith(prefix))
    .sort((a, b) => b[0].length - a[0].length)[0];
  const match = staticMatch ?? subjectOrBoardImport(pathname);
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
