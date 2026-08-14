import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { resolveTeacherWhatsAppUrl, isWhatsAppUrl } from '@/utils/whatsapp';
import { trackWhatsAppClick } from '@/utils/clarityEvents';
import { trackWhatsAppClickGA } from '@/utils/gaEvents';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { Button } from '@/components/ui/button';

/**
 * Interstitial at /tuition-teachers/:slug/whatsapp-click.
 *
 * Exists so WhatsApp contact clicks become a real, per-teacher URL that shows
 * up in GA4 and Clarity — the teacher is readable straight off the page path.
 * Tracks the click, then forwards to WhatsApp.
 *
 * Never indexed: noindex here, Disallow in robots.txt.
 */

type Status = 'resolving' | 'redirecting' | 'manual' | 'notfound';

/** Grace period so analytics beacons flush before the page unloads. */
const REDIRECT_DELAY_MS = 500;

export default function WhatsAppRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const routerLocation = useLocation();

  const [status, setStatus] = useState<Status>('resolving');
  const [url, setUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  // The profile page passes the already-resolved URL through router state, so
  // the common path needs no round-trip. State lives in memory only — it can't
  // be set by a crafted link, so this isn't an open-redirect surface.
  const stateUrl = (routerLocation.state as { url?: string; name?: string } | null)?.url;
  const stateName = (routerLocation.state as { url?: string; name?: string } | null)?.name;

  // Guards against firing analytics twice under StrictMode's double-invoke.
  const trackedRef = useRef(false);

  useEffect(() => {
    // Redirect pages must never be indexed.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let cleanupTimer: (() => void) | undefined;

    async function resolve() {
      if (!slug) {
        setStatus('notfound');
        return;
      }

      if (stateName) setName(stateName);

      let target = stateUrl ?? null;

      // Direct hit, refresh, or shared link: no router state, so look the
      // teacher up by slug and resolve the destination here instead.
      if (!target) {
        const { data: teacher } = await supabase
          .from('teachers_list')
          .select('name, slug')
          .eq('slug', slug)
          .maybeSingle();

        if (cancelled) return;

        if (!teacher) {
          setStatus('notfound');
          return;
        }
        setName((teacher as { name?: string }).name ?? null);

        const { data: mine } = await supabase
          .from('Shikshaqmine')
          .select('"Link"')
          .eq('Slug', slug)
          .maybeSingle();

        if (cancelled) return;

        const rawLink = (mine as Record<string, string> | null)?.['Link'] ?? null;
        target = resolveTeacherWhatsAppUrl(rawLink);
      }

      if (cancelled) return;
      setUrl(target);

      if (!trackedRef.current) {
        trackedRef.current = true;
        trackWhatsAppClick(slug);
        trackWhatsAppClickGA(slug);
      }

      // Anything that isn't WhatsApp is shown as a button the user taps
      // deliberately, never an automatic hop off the domain.
      if (!isWhatsAppUrl(target)) {
        setStatus('manual');
        return;
      }

      setStatus('redirecting');

      // Brief pause before leaving so the analytics beacons can flush. GA4 uses
      // sendBeacon and survives unload, but Clarity buffers its events and an
      // instant navigation drops them — which would defeat the point of this
      // page. Also stops the "Opening WhatsApp…" state flashing past unread.
      const timer = window.setTimeout(() => {
        // replace() so this page never enters history — Back returns to the
        // profile rather than bouncing through the redirect again.
        window.location.replace(target);
      }, REDIRECT_DELAY_MS);
      cleanupTimer = () => window.clearTimeout(timer);
    }

    resolve();
    return () => {
      cancelled = true;
      cleanupTimer?.();
    };
  }, [slug, stateUrl, stateName]);

  const profilePath = slug ? `/tuition-teachers/${slug}` : '/all-tuition-teachers-in-kolkata';

  if (status === 'notfound') {
    return (
      <Shell>
        <h1 className="text-lg font-semibold text-foreground">Teacher not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find this teacher. They may no longer be listed.
        </p>
        <Button asChild className="mt-6 rounded-lg bg-primary text-primary-foreground">
          <Link to="/all-tuition-teachers-in-kolkata">Browse all teachers</Link>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Light green icon well — WhatsApp's own brand green, no token exists
          for it in the design system (see final report: "not covered"). */}
      <span
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
        style={{ background: '#E6F4E6' }}
      >
        <WhatsAppIcon className="w-8 h-8" style={{ color: '#228B22' }} />
      </span>
      <h1 className="mt-4 text-lg font-semibold text-foreground">
        {status === 'manual' ? 'Ready to message' : 'Opening WhatsApp…'}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {name ? `Connecting you with ${name}.` : 'Connecting you with your teacher.'}
      </p>

      {/* On mobile, wa.me hands off to the app and this tab stays parked here,
          so the page needs a real way onward rather than a bare spinner. */}
      {url && (
        <Button
          asChild
          className="mt-6 gap-2 rounded-lg font-bold"
          /* WhatsApp's own brand green — no token exists for it (flagged in
             the final report as "not covered" per VISUAL_LANGUAGE §0). */
          style={{ background: '#25D366', color: '#0B3D1F' }}
        >
          <a href={url} rel="noopener noreferrer">
            <WhatsAppIcon className="w-5 h-5" />
            {status === 'manual' ? 'Open WhatsApp' : "Tap here if it didn't open"}
          </a>
        </Button>
      )}

      <div className="mt-4">
        <Link to={profilePath} className="text-xs font-semibold text-warm-meta">
          {name ? `← Back to ${name}` : '← Back to profile'}
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-sm">{children}</div>
    </div>
  );
}
