/**
 * The blog's article set.
 *
 * Every article here is built from CHAPTER_STATS, which scripts/generate-blog-
 * stats.ts counts out of the real question bank. That is the whole editorial
 * position: there is no shortage of pages telling a Class 10 student that
 * Trigonometry is important, and none of them have counted how many marks it
 * actually carried across 193 Kolkata prelim and board papers. This has.
 *
 * WHAT IS DELIBERATELY NOT HERE. The bank is Class 10 ICSE Maths and nothing
 * else, so there are no Physics, English or Class 8 articles. Writing 20
 * templated posts per subject off a subject name and a class number is the
 * thing that gets a whole domain demoted, and it would put invented syllabus
 * claims next to a papers library whose entire value is that its numbers are
 * real. When the bank covers another subject, this file grows; until then it
 * does not pretend to.
 *
 * House style (CLAUDE.md): no em or en dashes anywhere in reader-facing copy.
 */
import { BANK_SCOPE, BANK_TOTALS, CHAPTER_STATS, type ChapterStat } from './blog-stats';

export interface BlogArticle {
  slug: string;
  /** <h1> and card title. */
  title: string;
  /** Meta description and card standfirst. Aim under 160 characters. */
  description: string;
  /** Small routing label above the title. */
  eyebrow: string;
  /** Ordering on the index. Lower sorts first. */
  order: number;
  /** The chapter this article is about, if it is a chapter article. */
  chapter?: ChapterStat;
  /** Reading estimate, in minutes, from the rendered section count. */
  minutes: number;
}

const nf = new Intl.NumberFormat('en-IN');
export const fmt = (n: number) => nf.format(n);

/** Percent of the bank's papers a chapter appeared in, as a whole number. */
export function paperCoverage(c: ChapterStat): number {
  return Math.round((c.papers / BANK_TOTALS.papers) * 100);
}

/** A chapter's share of every mark counted in the bank. */
export function markShare(c: ChapterStat): number {
  return Math.round((c.marks / BANK_TOTALS.marks) * 1000) / 10;
}

/** The mark value a chapter is most often set at, and how often. */
export function commonestMarkValue(c: ChapterStat): { value: number; count: number } | null {
  if (!c.markValues.length) return null;
  return c.markValues.reduce((best, m) => (m.count > best.count ? m : best));
}

export const SCOPE_LABEL = `${BANK_SCOPE.board} Class ${BANK_SCOPE.classLevel} ${BANK_SCOPE.subject}`;

/* ---------------------------------------------------------------------------
   The two overview articles, then one per chapter.
--------------------------------------------------------------------------- */

const OVERVIEW: BlogArticle[] = [
  {
    slug: 'which-chapters-carry-the-marks',
    title: `Which ${SCOPE_LABEL} chapters actually carry the marks`,
    description:
      `Every chapter in the ${SCOPE_LABEL} syllabus, ranked by the marks it really carried ` +
      `across ${fmt(BANK_TOTALS.papers)} papers from ${fmt(BANK_TOTALS.schools)} Kolkata schools.`,
    eyebrow: 'Counted from real papers',
    order: 0,
    minutes: 6,
  },
  {
    slug: 'how-kolkata-schools-set-their-papers',
    title: 'How Kolkata schools actually set their Class 10 Maths papers',
    description:
      `What ${fmt(BANK_TOTALS.questions)} questions from ${fmt(BANK_TOTALS.schools)} schools show ` +
      `about paper types, mark weights and how much of the syllabus a prelim really covers.`,
    eyebrow: 'Counted from real papers',
    order: 1,
    minutes: 5,
  },
];

const CHAPTER_ARTICLES: BlogArticle[] = CHAPTER_STATS.map((chapter, i) => ({
  slug: `${chapter.slug}-in-icse-class-10-maths-papers`,
  title: `${chapter.name} in ${SCOPE_LABEL} papers`,
  description:
    `${chapter.name} carried ${fmt(chapter.marks)} marks across ${fmt(chapter.papers)} of ` +
    `${fmt(BANK_TOTALS.papers)} papers. What that looks like question by question.`,
  eyebrow: chapter.name,
  order: 10 + i,
  chapter,
  minutes: 4,
}));

export const BLOG_ARTICLES: BlogArticle[] = [...OVERVIEW, ...CHAPTER_ARTICLES].sort(
  (a, b) => a.order - b.order,
);

export const ARTICLE_BY_SLUG: Record<string, BlogArticle> = Object.fromEntries(
  BLOG_ARTICLES.map((a) => [a.slug, a]),
);

export const BLOG_PATH = '/blog';

export { BANK_TOTALS, CHAPTER_STATS, BANK_SCOPE };
export type { ChapterStat };
