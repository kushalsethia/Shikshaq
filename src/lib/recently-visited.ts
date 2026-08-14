// Device-local "recently visited" tracker. Not account-linked — a fresh
// browser/device starts empty even for a signed-in user. Account-level sync
// would need a new Supabase table; deliberately out of scope here, ship the
// local cache first (see HANDOFF.md-style task note where this was added).
const STORAGE_KEY = 'recently_visited';
const MAX_ENTRIES = 8;

export interface RecentVisit {
  type: 'teacher' | 'paper';
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  ts: number;
}

export function getRecentlyVisited(): RecentVisit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentVisit[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function recordVisit(entry: Omit<RecentVisit, 'ts'>) {
  try {
    const existing = getRecentlyVisited().filter(
      (item) => !(item.type === entry.type && item.id === entry.id)
    );
    const next = [{ ...entry, ts: Date.now() }, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, quota) — visit history is
    // a nicety, fail silently rather than breaking the page.
  }
}
