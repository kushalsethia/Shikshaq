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
 * deliberately reads only searchFacets.ts. Reconciling the two is real work
 * and is out of scope here; picking one and saying so is better than reading
 * both and inheriting the drift.
 */

import { SUBJECTS, CLASSES, AREAS, BOARDS } from '@/utils/searchFacets';

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
