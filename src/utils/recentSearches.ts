import type { SearchMode } from '@/utils/searchFacets';

export interface RecentSearch {
  q: string;
  mode: SearchMode;
  ts: number;
}

const STORAGE_KEY = 'shikshaq_recent_searches';
const MAX_RECENTS = 5;

export function getRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(q: string, mode: SearchMode) {
  const trimmed = q.trim();
  if (!trimmed) return;
  try {
    const existing = getRecentSearches().filter(
      (r) => r.q.toLowerCase() !== trimmed.toLowerCase() || r.mode !== mode
    );
    const next = [{ q: trimmed, mode, ts: Date.now() }, ...existing].slice(0, MAX_RECENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, etc.) — recents just won't persist
  }
}
