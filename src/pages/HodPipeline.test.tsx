import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}));
vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'hod@example.com' }, loading: false }),
}));

import { HodPipelinePage } from '@/pages/HodPipeline';
import { createFakePipelineRouteApi } from '@/dummy/pipeline-route-fake-api';
import { isChromelessPath, isFooterlessPath } from '@/lib/chromeless-routes';

/* No jsdom here, so these render to markup: the access check and the route
   itself run in effects, which static rendering does not start. What can be
   checked is the frame an HOD sees once access is known (dummy mode starts
   allowed), the loading frame while it is not, and the wiring in the source. */

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim();

function render(props: Parameters<typeof HodPipelinePage>[0]): string {
  return renderToStaticMarkup(
    <StaticRouter location="/hod/pipeline">
      <HodPipelinePage {...props} />
    </StaticRouter>,
  );
}

describe('the HOD pipeline page', () => {
  it('shows the frame for an HOD: a title, the way back to the HOD desk and the route', () => {
    const html = render({ routeApi: createFakePipelineRouteApi('full', 0), dummy: true });
    const t = text(html);
    expect(t).toContain('Pipeline');
    expect(t).toContain("Every paper on its way from a PDF on Kanishk's computer to live.");
    expect(html).toContain('href="/hod"');
    expect(t).toContain('Back to the HOD desk');
    expect(html).toContain('id="pipeline-route"');
  });

  it('while access is being checked it shows a loading frame and no numbers', () => {
    const html = render({ routeApi: createFakePipelineRouteApi('full', 0), checkAccess: () => new Promise<boolean>(() => {}) });
    expect(html).toContain('aria-label="Loading the pipeline"');
    expect(html).not.toContain('id="pipeline-route"');
  });

  it('passes the HOD audience to the route and links nowhere in /admin', () => {
    const src = readFileSync('src/pages/HodPipeline.tsx', 'utf8');
    expect(src).toContain('audience="hod"');
    expect(src).not.toContain("'/admin");
  });

  it('is its own route, kept footerless like the HOD desk', () => {
    expect(readFileSync('src/App.tsx', 'utf8')).toContain('<Route path="/hod/pipeline" element={<HodPipeline />} />');
    expect(isFooterlessPath('/hod/pipeline')).toBe(true);
    expect(isChromelessPath('/hod/pipeline')).toBe(false);
  });

  it('uses no em or en dash in what it says', () => {
    const html = render({ routeApi: createFakePipelineRouteApi('full', 0), dummy: true });
    expect(text(html)).not.toMatch(/[–—]/);
  });
});
