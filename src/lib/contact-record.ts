// Device-local "recorded contact" tracker — same pattern as recently-visited.ts.
//
// R7 / pages.md §"Reviews": the write-review button is only offered "if a
// contact was recorded for this user + teacher" — a light anti-spam trust
// signal so a review has to follow an actual WhatsApp outreach rather than
// being posted by someone who never spoke to the teacher.
//
// O-04 (a-to-z.md §5) is unresolved: there is no server-side WhatsApp-tap
// event table (`whatsapp_clicks` does not exist — see TeacherDashboard.tsx's
// own note on this). Per a-to-z.md §5's instruction to "ship the screen
// without the dependent clause" rather than guess and build around a missing
// dependency, this is a client-side, best-effort record: not tamper-proof,
// not synced across devices, but it does gate the button on a real WhatsApp
// hand-off in the common case, which is what the feature is for.
const STORAGE_KEY = 'shikshaq_contacted_teachers';
const MAX_ENTRIES = 100;

interface ContactRecord {
  slug: string;
  ts: number;
}

function readAll(): ContactRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ContactRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Marks this teacher (by slug) as contacted on this device. */
export function recordContact(slug: string) {
  if (!slug) return;
  try {
    const existing = readAll().filter((entry) => entry.slug !== slug);
    const next = [{ slug, ts: Date.now() }, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — gating just stays closed, fails safe.
  }
}

/** Whether this device has a recorded WhatsApp contact for this teacher. */
export function hasContactedTeacher(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return readAll().some((entry) => entry.slug === slug);
}

/**
 * All recorded contacts on this device, most-recent first — used by the
 * Account page's Contacted tab (pages.md §11). Exposes the read-only shape
 * `{ slug, ts }` rather than the raw storage type so callers can't mutate it.
 */
export function readAllContacts(): { slug: string; ts: number }[] {
  return readAll();
}
