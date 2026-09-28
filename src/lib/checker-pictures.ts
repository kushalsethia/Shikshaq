/**
 * Which picture of the printed paper the checker (Kid Mode) sees, and how
 * much to trust it.
 *
 * Stem crops live in the private `audit-figures` bucket. audit_questions.source
 * says whether one exists and how well it was matched:
 *
 *   snippet_object         '<paper_id>/<question_id>.png' when a crop exists
 *                          (every kid row that has it has the file; none that
 *                          lacks it does, measured 2026-09-28)
 *   align_score            live_copy rows only: how well the crop's printed
 *                          text matched the question. Below 0.6 the crop
 *                          often shows a DIFFERENT question (4 of 9 sampled
 *                          were wrong; every one at 0.9 or more was right).
 *                          new_ocr rows have no score: their crop IS the
 *                          region the text was read from.
 *   whole_snippet_object   on a parent / shared-context row: one crop of the
 *                          whole question, '<paper_id>/<parent_id>_whole.png'
 *   whole_snippet_members  {located, members, min_align}: how many of the
 *                          question's parts were found inside that crop
 *
 * Both checker RPCs already return `source` (the question's own, and every
 * context row's including the parent's), so this is all decided here, pure,
 * with no extra columns.
 *
 * Rules (owner, 2026-09-28, from the picture-upload report):
 *   - no crop at all: the "no picture" note, and no signed URL is requested
 *   - a doubtful crop is never shown as if it were right: it starts hidden
 *     behind a plain warning, and the checker taps to see it
 *   - a sub-part prefers the whole-question crop; if that crop is missing
 *     some parts, say so
 */

import type { QuestionContext } from '@/lib/checker-context';

/** Crops matched worse than this are treated as possibly the wrong question. */
export const DOUBTFUL_ALIGN_BELOW = 0.6;

export const PICTURE_MAY_BE_WRONG =
  'This picture may be of a different question. If it does not match, check the words only.';
export const PICTURE_MAY_MISS_PARTS = 'This picture may not show every part.';
export const SHOW_PICTURE_LABEL = 'Show the picture';

type Source = Record<string, unknown> | null | undefined;

export interface PicturePlan {
  /** Object path inside the audit-figures bucket. */
  path: string;
  /** 'whole' = the whole-question crop, 'parent' = the parent's own crop, 'own' = this question's crop. */
  kind: 'whole' | 'parent' | 'own';
  /** True when the crop may show a different question: show it collapsed, behind the warning. */
  doubtful: boolean;
  /** True when the whole-question crop is missing some of the parts. */
  mayMissParts: boolean;
}

/** A bucket-relative object path, or null. Refuses anything path-like that could escape the paper's folder. */
function objectPath(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const p = v.trim();
  if (!p || p.startsWith('/') || p.includes('..') || p.includes('\\')) return null;
  return p;
}

export function snippetObject(source: Source): string | null {
  return objectPath(source?.snippet_object);
}

/** The crop's match score, or null when there is none (new_ocr rows, or no crop). */
export function alignScore(source: Source): number | null {
  const raw = source?.align_score;
  if (raw === null || raw === undefined || raw === '') return null;
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** A crop is doubtful only when it has a score and the score is below the line. */
export function isDoubtfulCrop(source: Source): boolean {
  const s = alignScore(source);
  return s !== null && s < DOUBTFUL_ALIGN_BELOW;
}

/** The whole-question crop on a parent row, and whether it may be missing parts. */
export function wholeCrop(source: Source): { path: string; mayMissParts: boolean } | null {
  const path = objectPath(source?.whole_snippet_object);
  if (!path) return null;
  const m = source?.whole_snippet_members as { located?: unknown; members?: unknown } | null | undefined;
  const located = Number(m?.located);
  const members = Number(m?.members);
  const mayMissParts = Number.isFinite(located) && Number.isFinite(members) && located < members;
  return { path, mayMissParts };
}

/**
 * The one picture to show for the question being checked, or null for the
 * "no picture" note. Candidates, best first:
 *   1. the whole-question crop (on the parent row; members were placed in it
 *      only when they matched, so it is not treated as doubtful)
 *   2. the parent's own crop, when this is a sub-part
 *   3. this question's own crop
 * The first candidate that is not doubtful wins. If every candidate is
 * doubtful, the first one is returned with `doubtful: true`, so the page
 * shows it collapsed behind the warning rather than dropping it.
 *
 * Only one picture is ever planned, so only one signed URL is ever needed.
 */
export function planCheckerPicture(
  question: { id: string; source: Source },
  ctx: QuestionContext | null,
): PicturePlan | null {
  const candidates: PicturePlan[] = [];

  // The row that would carry the whole-question crop: the group's parent, or
  // the question itself when it stands alone (a parent checked on its own).
  const wholeHolder: Source = ctx ? ctx.parent?.source : question.source;
  const whole = wholeCrop(wholeHolder);
  if (whole) candidates.push({ path: whole.path, kind: 'whole', doubtful: false, mayMissParts: whole.mayMissParts });

  if (ctx?.parent && ctx.parent.id !== question.id) {
    const p = snippetObject(ctx.parent.source);
    if (p) candidates.push({ path: p, kind: 'parent', doubtful: isDoubtfulCrop(ctx.parent.source), mayMissParts: false });
  }

  const own = snippetObject(question.source);
  if (own) candidates.push({ path: own, kind: 'own', doubtful: isDoubtfulCrop(question.source), mayMissParts: false });

  return candidates.find((c) => !c.doubtful) ?? candidates[0] ?? null;
}

/** The small caption over the picture. */
export function pictureHeading(plan: PicturePlan | null): string {
  return plan && plan.kind !== 'own' ? 'The printed paper, whole question' : 'The printed paper';
}
