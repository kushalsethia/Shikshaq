/* The intent index — the shapes.
 *
 * ShikshAQ already decided what to show a visitor in five unrelated places,
 * each reading raw storage on its own terms: hero-copy.ts had a six-branch
 * precedence chain, auth-intent.ts its own sessionStorage handoff, Browse its
 * FilterState, SearchControl a hardcoded suggestion map. None of them could
 * see each other, so the site could only ever replay whichever fragment
 * happened to fire first.
 *
 * This module is the one model they all read instead. It is deterministic,
 * synchronous, local, and pure: no request, no model call, nothing that can
 * block a render or fail. When it knows nothing it says so, and the caller
 * renders exactly what the site renders today.
 *
 * Two departures from the brief that shaped this file, both deliberate:
 *
 * 1. PROVENANCE PER SLOT, not one global confidence number. The app can be
 *    certain about subject (the reader picked it from a dropdown) while
 *    knowing nothing at all about area. A single `confidence: 0.87` averages
 *    that away and every downstream check has to guess what it covered.
 *    Per-slot provenance lets a guardrail say exactly what it means:
 *    "adapt the headline only when subject.source === 'explicit'".
 *
 * 2. NO `urgency` FIELD. The brief lists one; nothing in ShikshAQ observes it.
 *    Board season is a fact about the calendar, not a signal from the person
 *    reading. Scoring urgency from that would be the "confidently wrong"
 *    failure the brief warns about, dressed up as a number. Omitted rather
 *    than faked. `priceSensitivity` is binary for the same reason: a fee
 *    filter being touched is a fact, "medium sensitivity" is a guess.
 */

import type { SearchMode } from '@/utils/searchFacets';

export type { SearchMode };

/** How we came to know a slot's value. Explicit always beats inferred. */
export type Provenance =
  /** The reader said so: a dropdown, a facet chip, a filter. */
  | 'explicit'
  /** Read off something they chose: a subject route, a viewed teacher's subject. */
  | 'derived'
  /** Guessed from behaviour. Never sufficient on its own to change the page. */
  | 'inferred';

export type JourneyStage =
  | 'discovery'
  | 'exploration'
  | 'specification'
  | 'evaluation'
  | 'decision';

/** Ordered, so a transition can be compared rather than pattern-matched. */
export const STAGE_ORDER: JourneyStage[] = [
  'discovery',
  'exploration',
  'specification',
  'evaluation',
  'decision',
];

export function stageRank(stage: JourneyStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export type PrimaryIntent =
  | 'find_tutor'
  | 'find_papers'
  | 'join_as_teacher'
  | 'understand';

export interface Slot<T> {
  value: T | null;
  source: Provenance;
  /** Epoch ms. Drives decay: a month-old subject is worth less than today's. */
  at: number;
}

export const EMPTY_SLOT: Slot<string> = { value: null, source: 'inferred', at: 0 };

/* ------------------------------------------------------------------ signals */

/** What the app can actually observe. Grouped by how much each is worth. */
export type SignalKind =
  /* STRONG — the reader stated it. */
  | 'search_submitted'
  | 'filters_applied'
  | 'builder_submitted'
  /* MEDIUM — the reader did something that implies it. */
  | 'teacher_viewed'
  | 'paper_viewed'
  | 'teacher_saved'
  | 'contact_started'
  | 'contact_completed'
  | 'mode_changed'
  | 'subject_route_viewed'
  /* WEAK — recorded for debugging, weighted zero, can never move the stage. */
  | 'route_viewed'
  | 'section_dwell';

export type SignalStrength = 'strong' | 'medium' | 'weak';

export const SIGNAL_STRENGTH: Record<SignalKind, SignalStrength> = {
  search_submitted: 'strong',
  filters_applied: 'strong',
  builder_submitted: 'strong',

  teacher_viewed: 'medium',
  paper_viewed: 'medium',
  teacher_saved: 'medium',
  contact_started: 'medium',
  contact_completed: 'medium',
  mode_changed: 'medium',
  subject_route_viewed: 'medium',

  route_viewed: 'weak',
  section_dwell: 'weak',
};

/** Signal payloads. Every field optional: a caller records what it has. */
export interface SignalPayload {
  subject?: string | null;
  classLevel?: string | null;
  area?: string | null;
  board?: string | null;
  mode?: SearchMode | null;
  /** Free-text query. Never becomes a slot value; kept for recent-searches. */
  query?: string | null;
  /** A teacher slug, or a paper id. */
  id?: string | null;
  name?: string | null;
  title?: string | null;
  subtitle?: string | null;
  path?: string | null;
  imageUrl?: string | null;
  /** True when a fee filter was actually touched. The only price evidence. */
  feeTouched?: boolean;
  /** Set when a filter set was emptied, so the machine can step back. */
  cleared?: boolean;
}

export interface Signal {
  kind: SignalKind;
  payload: SignalPayload;
  at: number;
}

/* ---------------------------------------------------------------- evidence */

/** Why the index says what it says. Powers the debug panel, and keeps
 *  analytics honest: an inference and a stated fact must never be logged as
 *  the same thing. */
export interface Evidence {
  /** What contributed. */
  kind: SignalKind | 'auth' | 'likes' | 'url' | 'stage';
  strength: SignalStrength;
  /** Human-readable, for the debug panel only. Never rendered to a visitor. */
  note: string;
  /** How much this added to confidence. Zero for weak signals, always. */
  weight: number;
  at: number;
}

/* ------------------------------------------------------------------- index */

export interface IntentIndex {
  /* WHAT. Every value normalised against the searchFacets vocabulary. */
  subject: Slot<string>;
  classLevel: Slot<string>;
  area: Slot<string>;
  board: Slot<string>;

  /* WHICH surface. */
  mode: SearchMode | null;
  primaryIntent: PrimaryIntent | null;

  /* HOW they are behaving. */
  stage: JourneyStage;
  priceSensitivity: 'unknown' | 'observed';
  familiarity: 'new' | 'returning' | 'known';

  /** Derived rollup of the slots' provenance and freshness. Not stored. */
  confidence: number;
  evidence: Evidence[];
}

/** What the site renders when it knows nothing, which is also what a crawler
 *  and a first-time visitor get. Every failure path returns exactly this. */
export const DEFAULT_INTENT: IntentIndex = {
  subject: EMPTY_SLOT,
  classLevel: EMPTY_SLOT,
  area: EMPTY_SLOT,
  board: EMPTY_SLOT,
  mode: null,
  primaryIntent: null,
  stage: 'discovery',
  priceSensitivity: 'unknown',
  familiarity: 'new',
  confidence: 0,
  evidence: [],
};
