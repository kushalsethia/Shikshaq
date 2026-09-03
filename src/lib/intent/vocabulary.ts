/* The gate. Nothing reaches the intent index that is not already a value the
 * app filters, routes or renders by.
 *
 * searchFacets.ts is the single source: its SUBJECTS/CLASSES/AREAS/BOARDS are
 * the same values that drive Browse's filters and SearchControl's facets. If a
 * value cannot be matched against those lists it is dropped, not stored. That
 * is what stops a stray query string, a renamed school or a typo from becoming
 * a "subject" the headline then says back to the reader.
 *
 * ⚠ There is a second, near-duplicate facet vocabulary in FilterPanel.tsx
 * (its own header admits the two are kept in sync by hand). This module
 * reads searchFacets.ts for everything that file carries, and copies only
 * the four small closed sets that exist nowhere else — see the note on those
 * constants below. Reconciling the two files properly is real work and is out
 * of scope here.
 *
 * School is the one facet with no closed list at all; normaliseSchool
 * sanitises instead of validating, and says why.
 */

import { SUBJECTS, CLASSES, AREAS, BOARDS, EXAM_TYPES } from '@/utils/searchFacets';

/* These four are the one vocabulary searchFacets.ts does NOT carry — they
   live only in FilterPanel.tsx, which is a React component module, and
   importing that here would drag a filter sheet into every bundle that
   merely wants to normalise a string. They are copied rather than imported
   for that reason, and they are safe to copy because they are closed sets of
   two to six literals that have not changed since they were written.

   ⚠ If FilterPanel.tsx's CLASS_SIZE / MODE_OF_TEACHING / PLACE_OF_TEACHING /
   EXPERIENCE_OPTIONS ever change, these must change with them. searchFacets.ts
   already carries the same warning about its own overlap with that file, so
   this is the established shape of the problem here, not a new one. */
const CLASS_SIZE = ['Group', 'Solo'];
const MODE_OF_TEACHING = ['Online', 'Offline'];
const PLACE_OF_TEACHING = ["Teacher's place", "Student's Home"];
const EXPERIENCE_VALUES = ['1', '3', '5', '10', '15', '20'];

/** Case- and punctuation-insensitive key for matching. */
function fold(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function buildLookup(values: readonly string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const v of values) map.set(fold(v), v);
  return map;
}

const SUBJECT_LOOKUP = buildLookup(SUBJECTS);
const CLASS_LOOKUP = buildLookup(CLASSES);
const AREA_LOOKUP = buildLookup(AREAS);
const BOARD_LOOKUP = buildLookup(BOARDS);
const CLASS_SIZE_LOOKUP = buildLookup(CLASS_SIZE);
const TEACHING_MODE_LOOKUP = buildLookup(MODE_OF_TEACHING);
const PLACE_LOOKUP = buildLookup(PLACE_OF_TEACHING);
const EXAM_TYPE_LOOKUP = buildLookup(EXAM_TYPES);
const EXPERIENCE_LOOKUP = buildLookup(EXPERIENCE_VALUES);

function normalise(
  raw: string | null | undefined,
  lookup: Map<string, string>,
): string | null {
  if (typeof raw !== 'string') return null;
  const key = fold(raw);
  if (!key) return null;
  return lookup.get(key) ?? null;
}

export function normaliseSubject(raw: string | null | undefined): string | null {
  return normalise(raw, SUBJECT_LOOKUP);
}

/** Accepts "10", "Class 10" and "class-10" alike; stores the bare "10" that
 *  filter_classes uses, so a slot value can go straight into a URL. */
export function normaliseClass(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const stripped = raw.trim().replace(/^class\s*/i, '');
  return normalise(stripped, CLASS_LOOKUP);
}

export function normaliseArea(raw: string | null | undefined): string | null {
  return normalise(raw, AREA_LOOKUP);
}

/** Teachers store the combined "ICSE/ISC" where papers store the two apart,
 *  so an exact fold can miss. Falls back to a substring hit against the
 *  canonical list, which is the same accommodation searchFacets documents. */
export function normaliseBoard(raw: string | null | undefined): string | null {
  const exact = normalise(raw, BOARD_LOOKUP);
  if (exact) return exact;
  if (typeof raw !== 'string') return null;
  const key = fold(raw);
  if (!key) return null;
  for (const board of BOARDS) {
    const b = fold(board);
    if (key.includes(b) || b.includes(key)) return board;
  }
  return null;
}

/** Slug form, for building the subject routes the CTAs point at. Matches the
 *  slugify hero-copy.ts already uses so the two produce identical hrefs. */
export function subjectSlug(subject: string): string {
  return subject.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function normaliseClassSize(raw: string | null | undefined): string | null {
  return normalise(raw, CLASS_SIZE_LOOKUP);
}

export function normaliseTeachingMode(raw: string | null | undefined): string | null {
  return normalise(raw, TEACHING_MODE_LOOKUP);
}

export function normalisePlaceOfTeaching(raw: string | null | undefined): string | null {
  return normalise(raw, PLACE_LOOKUP);
}

export function normaliseExamType(raw: string | null | undefined): string | null {
  return normalise(raw, EXAM_TYPE_LOOKUP);
}

/** The filter stores minimum years as a bare numeral string. Accepts "5+
 *  years" and "5" alike so a label and a value both land on the value. */
export function normaliseExperience(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const digits = raw.match(/\d+/)?.[0];
  return normalise(digits ?? raw, EXPERIENCE_LOOKUP);
}

/**
 * School is the one facet with no closed vocabulary to check against: the
 * list is built at runtime from the `papers` table, so validating it would
 * mean a query, and this module is deliberately synchronous and pure.
 *
 * Every value still arrives from a constrained source — the sentence
 * builder's own dropdown (populated from that query) or a `filter_schools`
 * URL parameter — so this sanitises rather than validates: it caps the
 * length and rejects control characters, which is enough to stop a
 * hand-edited URL from getting arbitrary text into a headline, and it is
 * honest about being a weaker guarantee than the others.
 */
export function normaliseSchool(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim().replace(/\s+/g, ' ');
  if (value.length === 0 || value.length > 80) return null;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    // C0 controls, DEL, and the two angle brackets that would let a
    // hand-edited URL push markup into a headline.
    if (code < 0x20 || code === 0x7f || value[i] === '<' || value[i] === '>') return null;
  }
  return value;
}

/** Normalises a single value or a list through one normaliser, dropping
 *  everything that fails and de-duplicating what survives. Order is
 *  preserved, so the reader's first choice stays the slot's primary. */
export function normaliseMany(
  raw: string | null | undefined | Array<string | null | undefined>,
  normaliser: (v: string | null | undefined) => string | null,
): string[] {
  const list = Array.isArray(raw) ? raw : [raw];
  const out: string[] = [];
  for (const item of list) {
    const clean = normaliser(item);
    if (clean !== null && !out.includes(clean)) out.push(clean);
  }
  return out;
}
