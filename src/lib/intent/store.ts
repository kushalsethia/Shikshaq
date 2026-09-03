/* One envelope, replacing five.
 *
 * Before this, the same behaviour was scattered across five device-local keys
 * with three naming conventions and three different freshness rules:
 *
 *   shikshaq.lastSearch            hero-copy branch 3
 *   shikshaq.lastViewedTeacher     hero-copy branch 4
 *   shikshaq.lastPaperSubject      hero-copy branch 5
 *   recently_visited               HomeActivitySection
 *   shikshaq_recent_searches       SearchControl's resting overlay
 *   shikshaq_contacted_teachers    Account's Contacted tab, review gating
 *
 * They are now sub-records of `shikshaq.intent.v1`, migrated on first read.
 *
 * THE SAFETY PROPERTY: each legacy sub-shape is kept VERBATIM inside the
 * envelope. Nothing is merged, renamed or reinterpreted on the way in. That is
 * what lets activity-trail.ts, recently-visited.ts, recentSearches.ts and
 * contact-record.ts keep their exact current exports as thin shims over this
 * file, so hero-copy, HomeActivitySection, SearchControl and Account carry on
 * working without knowing anything changed. Consolidation here means one key
 * instead of five, not one shape instead of six.
 *
 * Durable state is localStorage; session state is sessionStorage, because the
 * two have genuinely different lifetimes and the journey machine needs to ask
 * "how many teachers THIS session". That is two keys rather than one, and it
 * is the right two.
 *
 * Every access is wrapped. Safari private mode throws on setItem, and a
 * greeting is never worth an exception.
 */

import type { JourneyStage, SearchMode, Signal, Slot } from './types';
import { EMPTY_SLOT } from './types';

const STORE_KEY = 'shikshaq.intent.v1';
const SESSION_KEY = 'shikshaq.intent.session';

/* Legacy keys, still written for one release so a rollback is clean. Flip to
 * false, ship, confirm, then delete the legacy writers and this constant. */
export const DUAL_WRITE_LEGACY = true;

export const LEGACY_KEYS = {
  lastSearch: 'shikshaq.lastSearch',
  lastTeacher: 'shikshaq.lastViewedTeacher',
  lastPaper: 'shikshaq.lastPaperSubject',
  visits: 'recently_visited',
  searches: 'shikshaq_recent_searches',
  contacts: 'shikshaq_contacted_teachers',
} as const;

export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/* Caps match what each legacy store used, so a shim's output is identical. */
const MAX_VISITS = 8;
const MAX_SEARCHES = 5;
const MAX_CONTACTS = 100;
const MAX_SESSION_SIGNALS = 60;

/* ------------------------------------------------------------------ shapes */

/** recently-visited.ts's RecentVisit, unchanged. */
export interface StoredVisit {
  type: 'teacher' | 'paper';
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  ts: number;
}

/** recentSearches.ts's RecentSearch, unchanged. */
export interface StoredSearch {
  q: string;
  mode: SearchMode;
  ts: number;
}

export interface StoredContact {
  slug: string;
  ts: number;
}

/** activity-trail.ts's three trail records, unchanged. */
export interface StoredLastSearch {
  subject?: string;
  classLevel?: string;
  area?: string;
  at: number;
}
export interface StoredLastTeacher {
  name?: string;
  subject?: string;
  area?: string;
  slug?: string;
  imageUrl?: string | null;
  at: number;
}
export interface StoredLastPaper {
  board?: string;
  subject?: string;
  count?: number;
  at: number;
}

export interface IntentStore {
  v: 1;
  slots: {
    subject: Slot<string>;
    classLevel: Slot<string>;
    area: Slot<string>;
    board: Slot<string>;
  };
  mode: SearchMode | null;
  /** True only once a fee filter has actually been touched. */
  priceObserved: boolean;
  /** Highest stage reached durably. Session stage may sit above it. */
  stage: JourneyStage;

  lastSearch: StoredLastSearch | null;
  lastTeacher: StoredLastTeacher | null;
  lastPaper: StoredLastPaper | null;
  visits: StoredVisit[];
  searches: StoredSearch[];
  contacts: StoredContact[];

  firstSeen: number;
  lastSeen: number;
  visitCount: number;
}

export interface SessionState {
  startedAt: number;
  /** Distinct teacher slugs opened this session. Drives 'evaluation'. */
  teacherSlugs: string[];
  paperIds: string[];
  contactStarted: boolean;
  contactCompleted: boolean;
  saved: boolean;
  stage: JourneyStage;
  /** Recent signals, for the debug panel only. Capped. */
  signals: Signal[];
}

export function emptyStore(): IntentStore {
  const now = Date.now();
  return {
    v: 1,
    slots: {
      subject: { ...EMPTY_SLOT },
      classLevel: { ...EMPTY_SLOT },
      area: { ...EMPTY_SLOT },
      board: { ...EMPTY_SLOT },
    },
    mode: null,
    priceObserved: false,
    stage: 'discovery',
    lastSearch: null,
    lastTeacher: null,
    lastPaper: null,
    visits: [],
    searches: [],
    contacts: [],
    firstSeen: now,
    lastSeen: now,
    visitCount: 0,
  };
}

export function emptySession(): SessionState {
  return {
    startedAt: Date.now(),
    teacherSlugs: [],
    paperIds: [],
    contactStarted: false,
    contactCompleted: false,
    saved: false,
    stage: 'discovery',
    signals: [],
  };
}

/* ---------------------------------------------------------------------- io */

function readRaw<T>(storage: 'local' | 'session', key: string): T | null {
  try {
    const s = storage === 'local' ? localStorage : sessionStorage;
    const raw = s.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeRaw(storage: 'local' | 'session', key: string, value: unknown): void {
  try {
    const s = storage === 'local' ? localStorage : sessionStorage;
    s.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, quota, storage disabled. The default experience is a
       correct outcome, so there is nothing to report. */
  }
}

function removeRaw(storage: 'local' | 'session', key: string): void {
  try {
    const s = storage === 'local' ? localStorage : sessionStorage;
    s.removeItem(key);
  } catch {
    /* nothing to remove if storage is unavailable */
  }
}

function isArrayOf<T>(v: unknown): v is T[] {
  return Array.isArray(v);
}

/* --------------------------------------------------------------- migration */

/** Folds the five legacy keys into a fresh envelope. Runs once: after it
 *  writes, the envelope exists and this is never consulted again. Legacy keys
 *  are left in place, not deleted, so a rollback still finds them. */
function migrateLegacy(): IntentStore {
  const store = emptyStore();

  const lastSearch = readRaw<StoredLastSearch>('local', LEGACY_KEYS.lastSearch);
  if (lastSearch && typeof lastSearch.at === 'number') store.lastSearch = lastSearch;

  const lastTeacher = readRaw<StoredLastTeacher>('local', LEGACY_KEYS.lastTeacher);
  if (lastTeacher && typeof lastTeacher.at === 'number') store.lastTeacher = lastTeacher;

  const lastPaper = readRaw<StoredLastPaper>('local', LEGACY_KEYS.lastPaper);
  if (lastPaper && typeof lastPaper.at === 'number') store.lastPaper = lastPaper;

  const visits = readRaw<StoredVisit[]>('local', LEGACY_KEYS.visits);
  if (isArrayOf<StoredVisit>(visits)) store.visits = visits.slice(0, MAX_VISITS);

  const searches = readRaw<StoredSearch[]>('local', LEGACY_KEYS.searches);
  if (isArrayOf<StoredSearch>(searches)) store.searches = searches.slice(0, MAX_SEARCHES);

  const contacts = readRaw<StoredContact[]>('local', LEGACY_KEYS.contacts);
  if (isArrayOf<StoredContact>(contacts)) store.contacts = contacts.slice(0, MAX_CONTACTS);

  /* Someone with a trail is not a first-time visitor, and the greeting should
     not treat them as one just because the envelope is new. */
  const stamps = [
    store.lastSearch?.at,
    store.lastTeacher?.at,
    store.lastPaper?.at,
    store.visits[0]?.ts,
    store.searches[0]?.ts,
    store.contacts[0]?.ts,
  ].filter((n): n is number => typeof n === 'number' && n > 0);
  if (stamps.length > 0) {
    store.firstSeen = Math.min(...stamps);
    store.visitCount = 1;
  }

  return store;
}

/** Repairs anything missing or wrong-typed, so a hand-edited or half-written
 *  envelope degrades to defaults rather than throwing at a call site. */
function reconcile(raw: unknown): IntentStore | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<IntentStore>;
  if (r.v !== 1) return null;
  const base = emptyStore();
  const slot = (s: unknown): Slot<string> => {
    if (!s || typeof s !== 'object') return { ...EMPTY_SLOT };
    const c = s as Partial<Slot<string>>;
    if (typeof c.value !== 'string' || typeof c.at !== 'number') return { ...EMPTY_SLOT };
    const source =
      c.source === 'explicit' || c.source === 'derived' || c.source === 'inferred'
        ? c.source
        : 'inferred';
    return { value: c.value, source, at: c.at };
  };
  return {
    v: 1,
    slots: {
      subject: slot(r.slots?.subject),
      classLevel: slot(r.slots?.classLevel),
      area: slot(r.slots?.area),
      board: slot(r.slots?.board),
    },
    mode: r.mode === 'teachers' || r.mode === 'papers' ? r.mode : null,
    priceObserved: r.priceObserved === true,
    stage: typeof r.stage === 'string' ? (r.stage as JourneyStage) : base.stage,
    lastSearch: r.lastSearch ?? null,
    lastTeacher: r.lastTeacher ?? null,
    lastPaper: r.lastPaper ?? null,
    visits: isArrayOf<StoredVisit>(r.visits) ? r.visits.slice(0, MAX_VISITS) : [],
    searches: isArrayOf<StoredSearch>(r.searches) ? r.searches.slice(0, MAX_SEARCHES) : [],
    contacts: isArrayOf<StoredContact>(r.contacts) ? r.contacts.slice(0, MAX_CONTACTS) : [],
    firstSeen: typeof r.firstSeen === 'number' ? r.firstSeen : base.firstSeen,
    lastSeen: typeof r.lastSeen === 'number' ? r.lastSeen : base.lastSeen,
    visitCount: typeof r.visitCount === 'number' ? r.visitCount : 0,
  };
}

/* --------------------------------------------------------------- accessors */

let cached: IntentStore | null = null;

export function readStore(): IntentStore {
  if (cached) return cached;
  const reconciled = reconcile(readRaw<unknown>('local', STORE_KEY));
  if (reconciled) {
    cached = reconciled;
    return cached;
  }
  cached = migrateLegacy();
  writeRaw('local', STORE_KEY, cached);
  return cached;
}

/** structuredClone is not available in every browser this ships to; the
 *  envelope is plain JSON by construction, so a round trip is both correct
 *  and cheap. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Keeps the legacy keys truthful during the dual-write release, so rolling
 *  back to the previous build loses nothing the reader did in between. */
function mirrorToLegacy(store: IntentStore): void {
  if (store.lastSearch) writeRaw('local', LEGACY_KEYS.lastSearch, store.lastSearch);
  if (store.lastTeacher) writeRaw('local', LEGACY_KEYS.lastTeacher, store.lastTeacher);
  if (store.lastPaper) writeRaw('local', LEGACY_KEYS.lastPaper, store.lastPaper);
  writeRaw('local', LEGACY_KEYS.visits, store.visits);
  writeRaw('local', LEGACY_KEYS.searches, store.searches);
  writeRaw('local', LEGACY_KEYS.contacts, store.contacts);
}

export function writeStore(next: IntentStore): void {
  cached = next;
  writeRaw('local', STORE_KEY, next);
}

export function updateStore(fn: (draft: IntentStore) => void): IntentStore {
  const next = clone(readStore());
  fn(next);
  next.lastSeen = Date.now();
  writeStore(next);
  if (DUAL_WRITE_LEGACY) mirrorToLegacy(next);
  return next;
}

/* ----------------------------------------------------------------- session */

let sessionCached: SessionState | null = null;

export function readSession(): SessionState {
  if (sessionCached) return sessionCached;
  const raw = readRaw<Partial<SessionState>>('session', SESSION_KEY);
  if (raw && typeof raw.startedAt === 'number') {
    const base = emptySession();
    sessionCached = {
      startedAt: raw.startedAt,
      teacherSlugs: isArrayOf<string>(raw.teacherSlugs) ? raw.teacherSlugs : [],
      paperIds: isArrayOf<string>(raw.paperIds) ? raw.paperIds : [],
      contactStarted: raw.contactStarted === true,
      contactCompleted: raw.contactCompleted === true,
      saved: raw.saved === true,
      stage: typeof raw.stage === 'string' ? (raw.stage as JourneyStage) : base.stage,
      signals: isArrayOf<Signal>(raw.signals) ? raw.signals.slice(-MAX_SESSION_SIGNALS) : [],
    };
    return sessionCached;
  }
  /* Creating the session IS the start of the visit, so the count belongs
     here rather than in a caller. An earlier version counted from a
     beginSession() effect, which never fired: resolveIntent runs during
     render and reads the session first, so by the time the effect ran the
     session already existed and the increment was skipped every time. Tying
     it to creation makes the count independent of call order. */
  sessionCached = emptySession();
  writeRaw('session', SESSION_KEY, sessionCached);
  updateStore((draft) => {
    draft.visitCount += 1;
  });
  return sessionCached;
}

export function updateSession(fn: (draft: SessionState) => void): SessionState {
  const next = clone(readSession());
  fn(next);
  if (next.signals.length > MAX_SESSION_SIGNALS) {
    next.signals = next.signals.slice(-MAX_SESSION_SIGNALS);
  }
  sessionCached = next;
  writeRaw('session', SESSION_KEY, next);
  return next;
}

/** Called once per app boot, to make sure the session exists even on a route
 *  that never resolves the index. The visit count lives in readSession's
 *  creation path, so calling this more than once is harmless. */
export function beginSession(): void {
  readSession();
}

/* Caps, exported so the shims slice identically to the stores they replace. */
export const CAPS = {
  visits: MAX_VISITS,
  searches: MAX_SEARCHES,
  contacts: MAX_CONTACTS,
} as const;

/** Debug-panel only: forget everything, including the legacy keys, so a
 *  journey can be walked from a genuinely cold start. */
export function resetAll(): void {
  cached = null;
  sessionCached = null;
  removeRaw('local', STORE_KEY);
  removeRaw('session', SESSION_KEY);
  for (const key of Object.values(LEGACY_KEYS)) removeRaw('local', key);
}
