/**
 * Google Analytics 4 custom event helpers.
 *
 * gtag.js is loaded via a tag in index.html and exposes a global window.gtag(...).
 * No type ships with that tag, so we declare a minimal global here.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Records a per-teacher WhatsApp contact click in GA4.
 *
 * Sent as a `whatsapp_click` event with the teacher slug as a parameter, so
 * clicks can be broken down per teacher without relying on the page path.
 * Defensively guarded so it never throws if gtag hasn't loaded — analytics must
 * never break the contact flow.
 *
 * @param slug - The teacher's slug.
 */
export function trackWhatsAppClickGA(slug: string): void {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', { teacher_slug: slug });
  } catch {
    /* analytics must never break the contact flow */
  }
}
