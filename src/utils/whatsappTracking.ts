import { supabase } from '@/integrations/supabase/client';

/**
 * Microsoft Clarity is loaded via a tag in index.html and exposes a global
 * window.clarity(...). No type ships with that tag, so we declare a minimal one.
 */
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Records a WhatsApp contact click for a single teacher.
 *
 * Primary record: a row in the `whatsapp_clicks` table in our own Supabase
 * database — durable, queryable, and free of any analytics ingestion lag.
 * Secondary: a Microsoft Clarity custom event for session-replay correlation.
 *
 * Both are best-effort and fully guarded. The Supabase insert is fire-and-forget
 * (never awaited) and swallows every error — including the table not existing
 * yet — so analytics can never block or break the contact flow.
 *
 * @param slug      - The teacher's slug (the per-teacher dimension to group by).
 * @param teacherId - The teacher's id, when available.
 */
export function trackWhatsAppClick(slug: string, teacherId?: string | null): void {
  // 1) Durable, owned record in our own database (fire-and-forget).
  try {
    void supabase
      // `whatsapp_clicks` isn't in the generated types yet — cast keeps TS happy.
      .from('whatsapp_clicks' as never)
      .insert({ teacher_slug: slug, teacher_id: teacherId ?? null } as never)
      .then(
        ({ error }) => {
          if (error && import.meta.env.DEV) {
            console.warn('[whatsapp_clicks] insert failed:', error.message);
          }
        },
        () => {
          /* swallow rejection — never surface to the contact flow */
        },
      );
  } catch {
    /* never break the contact flow */
  }

  // 2) Microsoft Clarity custom event + per-teacher tag (best-effort).
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      window.clarity('set', 'teacher_slug', slug);
      window.clarity('event', 'whatsapp_click');
    }
  } catch {
    /* analytics must never break the contact flow */
  }
}
