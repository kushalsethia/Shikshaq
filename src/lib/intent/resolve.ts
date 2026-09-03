/* Stored state plus live context, in, one IntentIndex out. Pure, synchronous,
 * no network. Given identical inputs it returns an identical index, which is
 * what makes the debug panel trustworthy and the whole thing testable.
 *
 * Confidence is DERIVED here, never stored. Storing it would let a stale
 * number outlive the evidence that justified it. It is a rollup of what each
 * slot is worth, discounted by how old that slot is, and the discount is the
 * point: a subject chosen a month ago should not drive today's headline with
 * the same force as one chosen a minute ago.
 */

import {
  DEFAULT_INTENT,
  type Evidence,
  type IntentIndex,
  type PrimaryIntent,
  type Slot,
} from './types';
import { readSession, readStore, THIRTY_DAYS_MS } from './store';
import { deriveStage } from './signals';

/** What a slot contributes at full freshness, by provenance. Explicit values
 *  carry most of the weight because they are the only ones the reader
 *  actually said. */
const SLOT_WEIGHT = {
  subject: { explicit: 0.34, derived: 0.18, inferred: 0.06 },
  classLevel: { explicit: 0.2, derived: 0.1, inferred: 0.04 },
  area: { explicit: 0.2, derived: 0.1, inferred: 0.04 },
  board: { explicit: 0.12, derived: 0.06, inferred: 0.02 },
} as const;

/** Full value for a day, then a straight decline to nothing at thirty days.
 *  A slot past the window contributes zero rather than a small amount, so
 *  stale state cannot accumulate into confidence. */
const FULL_VALUE_MS = 24 * 60 * 60 * 1000;

export function freshness(at: number, now: number): number {
  if (at <= 0) return 0;
  const age = now - at;
  if (age < 0) return 1;
  if (age <= FULL_VALUE_MS) return 1;
  if (age >= THIRTY_DAYS_MS) return 0;
  return 1 - (age - FULL_VALUE_MS) / (THIRTY_DAYS_MS - FULL_VALUE_MS);
}

export interface LiveContext {
  /** From useAuth(). Signed in is the strongest familiarity signal there is. */
  signedIn: boolean;
  /** From useLikes().likedCount. Server-side, so it survives a new device. */
  likedCount: number;
  /** Current pathname, for primary-intent resolution only. */
  pathname: string;
}

function slotEvidence(
  name: string,
  slot: Slot<string>,
  weights: { explicit: number; derived: number; inferred: number },
  now: number,
): { weight: number; evidence: Evidence | null } {
  if (!slot.value) return { weight: 0, evidence: null };
  const f = freshness(slot.at, now);
  if (f === 0) return { weight: 0, evidence: null };
  const weight = weights[slot.source] * f;
  return {
    weight,
    evidence: {
      kind: 'url',
      strength: slot.source === 'explicit' ? 'strong' : 'medium',
      note: `${name} = ${slot.value} (${slot.source}, ${Math.round(f * 100)}% fresh)`,
      weight,
      at: slot.at,
    },
  };
}

function resolvePrimaryIntent(pathname: string, mode: string | null): PrimaryIntent | null {
  if (pathname.startsWith('/join')) return 'join_as_teacher';
  if (pathname.startsWith('/about') || pathname.startsWith('/faq')) return 'understand';
  if (pathname.startsWith('/past-papers')) return 'find_papers';
  if (pathname.startsWith('/all-tuition-teachers') || pathname.startsWith('/tuition-teachers')) {
    return 'find_tutor';
  }
  if (mode === 'papers') return 'find_papers';
  if (mode === 'teachers') return 'find_tutor';
  return null;
}

/**
 * Resolves the index. Never throws: if storage is unavailable or the envelope
 * is unreadable, every path lands on DEFAULT_INTENT, which is exactly what the
 * site renders today.
 */
export function resolveIntent(live: LiveContext): IntentIndex {
  let store;
  let session;
  try {
    store = readStore();
    session = readSession();
  } catch {
    return { ...DEFAULT_INTENT };
  }

  const now = Date.now();
  const evidence: Evidence[] = [];
  let confidence = 0;

  const slots = [
    ['subject', store.slots.subject, SLOT_WEIGHT.subject],
    ['class', store.slots.classLevel, SLOT_WEIGHT.classLevel],
    ['area', store.slots.area, SLOT_WEIGHT.area],
    ['board', store.slots.board, SLOT_WEIGHT.board],
  ] as const;

  for (const [name, slot, weights] of slots) {
    const { weight, evidence: e } = slotEvidence(name, slot, weights, now);
    confidence += weight;
    if (e) evidence.push(e);
  }

  const stage = deriveStage({ store, session });

  /* Behaviour corroborates the slots rather than standing in for them. A
     reader deep in a journey is more likely to be understood correctly, but
     depth alone never makes the page confident about WHAT they want. */
  if (stage === 'specification' || stage === 'evaluation' || stage === 'decision') {
    const weight = 0.1;
    confidence += weight;
    evidence.push({
      kind: 'stage',
      strength: 'medium',
      note: `journey stage is ${stage}`,
      weight,
      at: now,
    });
  }

  const familiarity: IntentIndex['familiarity'] = live.signedIn
    ? 'known'
    : store.visitCount > 1 || store.lastTeacher !== null || store.lastSearch !== null
      ? 'returning'
      : 'new';

  if (live.signedIn) {
    const weight = 0.05;
    confidence += weight;
    evidence.push({
      kind: 'auth',
      strength: 'strong',
      note: 'signed in',
      weight,
      at: now,
    });
  }

  if (live.likedCount > 0) {
    const weight = 0.05;
    confidence += weight;
    evidence.push({
      kind: 'likes',
      strength: 'medium',
      note: `${live.likedCount} saved teacher${live.likedCount === 1 ? '' : 's'}`,
      weight,
      at: now,
    });
  }

  /* Weak signals appear in the panel so a journey can be read in full, and
     contribute exactly nothing. */
  for (const s of session.signals) {
    if (s.kind === 'route_viewed' || s.kind === 'section_dwell') {
      evidence.push({
        kind: s.kind,
        strength: 'weak',
        note: s.payload.path ?? s.payload.id ?? 'observed',
        weight: 0,
        at: s.at,
      });
    }
  }

  return {
    subject: store.slots.subject,
    classLevel: store.slots.classLevel,
    area: store.slots.area,
    board: store.slots.board,
    mode: store.mode,
    primaryIntent: resolvePrimaryIntent(live.pathname, store.mode),
    stage,
    priceSensitivity: store.priceObserved ? 'observed' : 'unknown',
    familiarity,
    confidence: Math.min(1, Math.round(confidence * 1000) / 1000),
    evidence,
  };
}
