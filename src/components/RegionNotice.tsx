import { useCallback, useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';

import { WhatsAppIcon } from '@/components/BrandIcons';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { ensureRegion, requestRegion, cachedRegion, type RegionStatus } from '@/lib/user-region';

/* A one-line notice for readers outside West Bengal.

   Every teacher on this site travels to a Kolkata address, so someone browsing
   from another state is filtering a list that cannot reach them. Better to say
   so in a line than to let them find out after picking someone.

   It is deliberately quiet:
   - never prompts on load; `ensureRegion` only reads an already-granted
     permission, and the prompt is behind an explicit "Check my area"
   - dismissible, and it stays dismissed
   - it offers the way forward (online tuition, which is real — `Offline,
     Online` is a mode this site already filters on) rather than just refusing

   `variant="inline"` is the compact form for under the home search. */

const DISMISS_KEY = 'shikshaq.regionNoticeDismissed';

export function RegionNotice({
  variant = 'panel',
  className = '',
}: {
  variant?: 'panel' | 'inline';
  className?: string;
}) {
  const [status, setStatus] = useState<RegionStatus>(() => cachedRegion());
  const [asked, setAsked] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let cancelled = false;
    ensureRegion().then((s) => { if (!cancelled) setStatus(s); });
    return () => { cancelled = true; };
  }, []);

  const check = useCallback(async () => {
    setAsked(true);
    const s = await requestRegion();
    setStatus(s);
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* private mode */ }
  }, []);

  if (dismissed) return null;

  /* Unknown and not yet asked: offer the check, never force it. Only on the
     roomier panel variant — a permission prompt has no business interrupting
     someone who has just run a search. */
  if (status === 'unknown') {
    if (variant !== 'panel' || asked) return null;
    return (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[16px] bg-muted px-4 py-3 ${className}`}>
        <MapPin className="h-4 w-4 flex-none text-warm-label" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-[13.5px] leading-[1.5] text-warm-secondary">
          These teachers all teach in and around Kolkata.
        </p>
        <button
          type="button"
          onClick={check}
          className="flex min-h-11 items-center rounded-full px-1 text-[13px] font-semibold text-brand-deep underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Check my area
        </button>
      </div>
    );
  }

  if (status !== 'outside') return null;

  const wa = `${getWhatsAppLink('8240980312')}?text=${encodeURIComponent(
    'Hi Shikshaq, I am outside West Bengal. Do you have teachers who take online classes?',
  )}`;

  if (variant === 'inline') {
    return (
      <div className={`flex items-start gap-2.5 rounded-[14px] bg-brand-subtle px-3.5 py-2.5 ${className}`}>
        <MapPin className="mt-0.5 h-4 w-4 flex-none text-brand-deep" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-[13px] leading-[1.5] text-brand-deep">
          Looks like you are outside West Bengal. These teachers are Kolkata-based for now. Many
          take online classes.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="tap-44 -m-1 flex-none rounded-full p-1 text-brand-deep/70 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative rounded-[18px] bg-brand-subtle p-4 pr-10 ${className}`}>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss this notice"
        className="tap-44 absolute right-3 top-3 rounded-full p-1 text-brand-deep/70 transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-brand-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[14.5px] font-bold text-brand-deep">
            You are outside West Bengal
          </p>
          <p className="mt-1 text-[13.5px] leading-[1.55] text-brand-deep/85">
            Every teacher listed here teaches in and around Kolkata, so in-person classes will not
            reach you yet, and more cities are coming. Plenty of these teachers do take online
            classes, though, and you can ask any of them directly.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-4 text-[13.5px] font-bold text-whatsapp-text transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Ask about online classes
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegionNotice;
