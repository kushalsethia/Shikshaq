/**
 * Microsoft Clarity custom event helpers.
 *
 * Clarity is loaded via a tag in index.html and exposes a global window.clarity(...).
 * No type ships with that tag, so we declare a minimal global here.
 */
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Records a per-teacher WhatsApp contact click in Microsoft Clarity.
 *
 * Sets a `teacher_slug` custom tag (the filterable per-teacher dimension) and
 * fires a `whatsapp_click` custom event (the action being counted). Defensively
 * guarded so it never throws if Clarity hasn't loaded — analytics must never
 * break the contact flow.
 *
 * @param slug - The teacher's slug, used as the filterable dimension.
 */
export function trackWhatsAppClick(slug: string): void {
  try {
    if (typeof window === 'undefined' || typeof window.clarity !== 'function') return;
    // custom tag = the filterable per-teacher dimension
    window.clarity('set', 'teacher_slug', slug);
    // custom event = the action being counted
    window.clarity('event', 'whatsapp_click');
  } catch {
    /* analytics must never break the contact flow */
  }
}
