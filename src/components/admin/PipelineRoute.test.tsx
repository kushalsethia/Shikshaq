import { isValidElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}));

import { PipelineRouteView, type PipelineRouteViewProps } from '@/components/admin/PipelineRoute';
import { StopCard } from '@/components/admin/PipelineRouteParts';
import { EXAMPLE_ROUTE_RAW, UNSYNCED_ROUTE_RAW } from '@/lib/pipeline-route.fixture';
import { buildMainStops, normaliseRoute } from '@/lib/pipeline-route';

/* No jsdom here (see admin-shared.test.tsx), so the route renders to markup.
   PipelineRouteView is pure, so every state is a props object. Clicks walk the
   element tree of a function component and call the handler it holds. */

const NOW = Date.parse('2026-10-12T06:00:00.000Z');
const noop = () => {};
const route = normaliseRoute(EXAMPLE_ROUTE_RAW);
const unsynced = normaliseRoute(UNSYNCED_ROUTE_RAW);

function view(over: Partial<PipelineRouteViewProps> = {}): string {
  const props: PipelineRouteViewProps = {
    route,
    status: 'ok',
    refreshFailed: false,
    updatedAt: NOW - 12_000,
    now: NOW,
    reducedMotion: false,
    onRetry: noop,
    onRefresh: noop,
    onShowRegistry: noop,
    ...over,
  };
  return renderToStaticMarkup(
    <StaticRouter location="/admin/pipeline">
      <PipelineRouteView {...props} />
    </StaticRouter>,
  );
}

const text = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

function findButton(node: ReactNode): { onClick?: () => void } | null {
  if (!isValidElement(node)) return null;
  const props = node.props as Record<string, unknown>;
  if (node.type === 'button') return props as { onClick?: () => void };
  const kids = props.children;
  for (const k of Array.isArray(kids) ? kids : [kids]) {
    const hit = findButton(k as ReactNode);
    if (hit) return hit;
  }
  return null;
}

describe('the route with the example payload', () => {
  const html = view();
  const t = text(html);

  it('is a real ordered list with the seven stops and their numbers as text', () => {
    expect(html).toContain('<ol');
    expect(html).toContain("aria-label=\"The papers route, from the PDFs on Kanishk&#x27;s computer to live\"");
    for (const id of ['computer', 'read', 'pictures', 'students', 'needsYou', 'ready', 'live']) {
      expect(html).toContain(`data-stop="${id}"`);
    }
    expect(html).toContain('data-stop="leftOut"');
    expect(html).toContain('data-stop="side-piles"');
  });

  it("labels the computer exactly as Kanishk's computer, with the file count on it", () => {
    expect(t).toContain("PDFs on Kanishk's computer");
    expect(t).toMatch(/6,880\s+PDFs/);
    expect(t).toContain('6,445 sorted by class and subject');
    expect(t).toContain('9.3 GB in all');
  });

  it('shows the six numbers the owner asked for', () => {
    expect(t).toMatch(/6,880\s+PDFs/); // how many PDFs on the computer
    expect(t).toMatch(/1,159\s+papers/); // OCR'd
    expect(t).toContain('Also read by the AI 295'); // run through AI
    expect(t).toContain('Pictures waiting'); // pending image uploads
    expect(t).toContain('More, once their questions are sorted 3,382 (702 MB)');
    expect(t).toMatch(/9,291\s+questions/); // pending clearance from students
    expect(t).toMatch(/223\s+questions/); // pending clearance from an HOD or admin
    expect(t).toContain('Can go live now 1 paper'); // pending the go-live decision
    expect(t).toMatch(/1,506\s+papers/); // live
  });

  it('carries the AI trust counter and where each level stands', () => {
    expect(t).toContain('AI trust: 0 of 100 checks');
    expect(t).toContain('High confidence, says fix');
    expect(t).toContain('Not trusted yet, 0 checked');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain('href="/hod?tab=ai-trust"');
  });

  it('stops carry their count on the list item, for anything that reads the DOM', () => {
    expect(html).toMatch(/data-stop="computer" data-count="6880"/);
    expect(html).toMatch(/data-stop="live" data-count="1506"/);
    expect(html).toMatch(/data-stop="leftOut" data-count="1909"/);
  });

  it('the student stop shows papers by questions left, and the checkers', () => {
    expect(t).toContain('1 checker active');
    expect(t).toContain('318 papers with questions open');
    for (const band of ['1-5', '6-15', '16-40', '41+']) expect(html).toContain(`data-band="${band}"`);
    expect(t).toContain('1 to 5 left 29 papers');
    expect(t).toContain('41 or more left 88 papers');
  });

  it('the side piles read in plain words, and sit beneath the route', () => {
    expect(t).toContain('Held for data fixes');
    expect(t).toContain('Held for the renderer');
    expect(t).toContain('Not yet sorted');
    expect(t).toContain('5,081 questions');
    expect(html.indexOf('data-stop="side-piles"')).toBeGreaterThan(html.indexOf('data-stop="live"'));
  });

  it('the frozen papers are a side track, with the excluded small print on the computer stop', () => {
    expect(t).toContain('Side track');
    expect(t).toContain('earlier library, frozen on purpose');
    expect(t).toContain('11 files are not real papers, not counted');
    expect(t).toContain('1,385 of them are already live');
  });

  it('one honest progress strip: questions cleared of the total', () => {
    expect(t).toContain('Questions: 171 of 14,929 cleared');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="1"');
  });

  it('stops lead to the HOD desk tabs, never to an admin page', () => {
    expect(html).toContain('href="/hod?tab=assignments"');
    expect(html).toContain('href="/hod?tab=needs-you"');
    expect(html).toContain('href="/hod?tab=ready"');
    expect(html).toContain('href="/hod?tab=live"');
    expect(html).not.toContain('href="/admin');
  });

  it('for admins the computer stop is a button that filters the paper list', () => {
    expect(html).toMatch(/<button type="button"[^>]*>PDFs on Kanishk(&#x27;|')s computer<span class="sr-only">\. Show every paper in the list<\/span>/);
  });

  it('says when the browser read it AND when the desk last sent numbers, as two different things', () => {
    expect(t).toContain('Checked 12 seconds ago');
    expect(t).toMatch(/Data as of \d{1,2} Oct/);
    expect(t).toContain('30 minutes ago');
    expect(t).toContain("from the desk's last sync");
    expect(html).toContain('data-data-as-of="fresh"');
    expect(html).toContain('data-live-dot="live"');
    expect(html).toContain('aria-label="Refresh the numbers now"');
    expect(html).not.toContain('data-refresh-failed');
    expect(t).not.toContain('Updated 12 seconds ago');
  });

  it('the moving parts are hidden from screen readers', () => {
    const lanes = html.match(/<span aria-hidden="true" data-lane=/g) ?? [];
    expect(lanes.length).toBe(6); // 7 stops, 6 lanes
    expect(html).toContain('data-elbow');
    expect(html).toMatch(/<svg aria-hidden="true" data-elbow/);
  });

  it('parcels travel the lanes, more on busier ones', () => {
    expect(html).toContain('animate-route-dot-y');
    expect(html).toContain('lg:animate-route-dot-x');
    const dots = [...html.matchAll(/data-dots="(\d)"/g)].map((m) => Number(m[1]));
    expect(dots.length).toBe(6);
    expect(Math.max(...dots)).toBeGreaterThan(Math.min(...dots));
  });

  it('uses no em or en dashes in what it says', () => {
    expect(t).not.toMatch(/[–—]/);
  });

  it('the unit reads right for exactly one', () => {
    expect(t).toMatch(/\b1 checker\b/);
  });
});

describe('the route for an HOD', () => {
  const html = view({ audience: 'hod' });
  const t = text(html);

  it('shows the same numbers', () => {
    expect(t).toMatch(/6,880\s+PDFs/);
    expect(t).toMatch(/9,291\s+questions/);
    expect(t).toContain('AI trust: 0 of 100 checks');
  });

  it('hides the admin-only filter: the computer stop is plain text, not a button', () => {
    expect(html).not.toMatch(/<button type="button"[^>]*>PDFs on/);
    expect(html).not.toContain('Show every paper in the list');
  });

  it('keeps every link, all of them tabs of the HOD desk', () => {
    expect(html).toContain('href="/hod?tab=needs-you"');
    expect(html).toContain('href="/hod?tab=ready"');
    expect(html).not.toContain('href="/admin');
  });
});

describe('numbers the desk has not sent yet', () => {
  const html = view({ route: unsynced });
  const t = text(html);

  it('the pictures stop is ?, never 0, and says why', () => {
    expect(html).toMatch(/data-stop="pictures" data-count=""/);
    expect(html).toContain('data-unknown');
    expect(t).toContain('The desk has not sent the picture numbers yet.');
    expect(t).not.toMatch(/\b0 papers waiting/);
  });

  it('the computer stop falls back to the desk list and says it has not counted the files', () => {
    expect(t).toMatch(/8,038\s+PDFs/);
    expect(t).toContain('has not counted the files on the computer yet');
  });

  it('the data time is the old registry change, and the line turns amber with a warning', () => {
    expect(html).toContain('data-data-as-of="stale"');
    expect(t).toMatch(/Data as of \d{1,2} Oct/);
    expect(t).toContain('3 days ago');
    expect(t).toContain('may be out of date');
  });
});

describe('a route that never synced', () => {
  it('says the desk has not sent any numbers', () => {
    const bare = normaliseRoute({ registry: { total: 5 }, desk: {}, open: {}, checkers: {} });
    const t = text(view({ route: bare }));
    expect(t).toContain('The desk has not sent any numbers yet');
  });
});

describe('a refresh that fails', () => {
  const html = view({ refreshFailed: true, updatedAt: NOW - 95_000 });
  const t = text(html);

  it('keeps the last numbers on screen', () => {
    expect(t).toMatch(/6,880\s+PDFs/);
    expect(t).toMatch(/1,159\s+papers/);
    expect(html).toContain('data-stop="live"');
  });

  it('says so quietly, in a status line, and the dot turns amber', () => {
    expect(t).toContain('Could not refresh, showing the last numbers.');
    expect(html).toContain('role="status"');
    expect(html).toContain('data-live-dot="stale"');
  });

  it('still says how old the browser read is', () => {
    expect(t).toContain('Checked 1 minute ago');
  });

  it('does not show the loud error for the whole route', () => {
    expect(html).not.toContain('role="alert"');
  });
});

describe('the first read fails or is still out', () => {
  it('with nothing to show it says the route did not load and offers Try again, never zeros', () => {
    const html = view({ route: null, status: 'error', updatedAt: null });
    const t = text(html);
    expect(html).toContain('role="alert"');
    expect(t).toContain('The papers route did not load.');
    expect(t).toContain('Try again');
    expect(html).not.toContain('data-stop=');
    expect(t).not.toMatch(/\b0 papers\b/);
  });

  it('while loading it shows a skeleton and no numbers', () => {
    const html = view({ route: null, status: 'loading', updatedAt: null });
    expect(html).toContain('aria-label="Loading the papers route"');
    expect(html).not.toContain('data-stop=');
    expect(text(html)).toContain('Reading the numbers');
  });

  it('a route with nothing in it yet says what happens next', () => {
    const empty = normaliseRoute({ registry: {}, desk: {}, open: {}, checkers: {} });
    const t = text(view({ route: empty }));
    expect(t).toContain('The pipeline has not sent any papers yet');
  });
});

describe('reduced motion', () => {
  const html = view({ reducedMotion: true });
  const t = text(html);

  it('keeps every number and every word', () => {
    expect(t).toMatch(/6,880\s+PDFs/);
    expect(t).toContain('Questions: 171 of 14,929 cleared');
    expect(html).toContain('data-stop="live"');
    expect(t).toContain('Checked 12 seconds ago');
  });

  it('turns the movement off: no parcels, a still elbow, no ping on the live dot', () => {
    expect(html).not.toContain('animate-route-dot-y');
    expect(html).not.toContain('animate-route-dash');
    expect(html).not.toContain('animate-ping');
    const dots = [...html.matchAll(/data-dots="(\d)"/g)].map((m) => Number(m[1]));
    expect(dots.every((d) => d === 0)).toBe(true);
    expect(html).toContain('data-reduced-motion="true"');
  });

  it('keeps the lanes and the arrows as a static picture', () => {
    expect((html.match(/data-lane=/g) ?? []).length).toBe(6);
    expect(html).toContain('data-elbow');
  });

  it('with motion allowed the page says so', () => {
    expect(view()).toContain('data-reduced-motion="false"');
    expect(view()).toContain('animate-ping');
  });
});

describe('clicking a stop', () => {
  const stops = buildMainStops(route);
  const stop = (id: string) => stops.find((s) => s.id === id)!;

  it('the computer stop shows every paper in the list', () => {
    const onShow = vi.fn();
    findButton(StopCard({ stop: stop('computer'), animate: false, onShowRegistry: onShow }))?.onClick?.();
    expect(onShow).toHaveBeenCalledWith([]);
  });

  it('a stop with nowhere to go has no button and no link', () => {
    const html = renderToStaticMarkup(
      <StaticRouter location="/">
        <StopCard stop={stop('pictures')} animate={false} onShowRegistry={noop} />
      </StaticRouter>,
    );
    expect(html).not.toContain('<button');
    expect(html).not.toContain('<a ');
    expect(text(html)).toContain('Pictures waiting');
  });

  it('a stop whose number did not arrive reads ? and not a number', () => {
    const pics = buildMainStops(unsynced).find((s) => s.id === 'pictures')!;
    const html = renderToStaticMarkup(
      <StaticRouter location="/">
        <StopCard stop={pics} animate={false} onShowRegistry={noop} />
      </StaticRouter>,
    );
    expect(html).toContain('data-unknown');
    expect(text(html)).toContain('? not sent yet');
  });
});
