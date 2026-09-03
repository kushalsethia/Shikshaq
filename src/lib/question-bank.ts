/* The Class X Mathematics bank, as papers.

   193 individual ICSE/CBSE papers (6,912 questions across 66 schools). They
   are papers like any other on this site, so they belong IN the papers surface
   — listed on /past-papers, filterable on /past-papers/results, and each one
   opening at its own /past-papers/:id — not behind a separate browser of their
   own. The only thing that differs is the reading experience: these have
   structured questions, so the reader renders them as questions rather than
   embedding a scan.

   The bank lives in Supabase, in bank_papers and bank_questions, and is read
   from there. It used to be a 2.5MB JSON asset in public/, which meant every
   reader of one 40-question paper downloaded all 6,912 questions, and every
   correction to a school's name was a code change and a deploy. Now a listing
   reads 193 summary rows and a paper reads its own questions and nothing else.

   Both tables are world-readable for published papers, so none of this waits
   on a session — the library is open to anyone who lands on it.

   ⚠ Question text is byte-exact from the source and is never cleaned or
   retyped anywhere in this app. It is read from the column and rendered. */

import { supabase } from '@/integrations/supabase/client';
import { schoolSlug } from '@/lib/school-slug';

/** One question, as the reader needs it. Paper-level facts live on BankPaper. */
export interface BankQuestion {
  i: string;              // stable id
  p: string;              // paper id
  n: string | null;       // printed number
  t: string;              // text, verbatim
  m: number | null;       // marks
  c: string | null;       // chapter
  ty: string | null;      // short | long | MCQ
  pg?: number;            // source page
  f?: string;             // figure filename
  o?: string[];           // options
}

export interface BankPaper {
  id: string;
  /** The resolved display name, already expanded in the database. */
  school: string;
  /** What the source filename actually said. Kept for search, not for display. */
  schoolRaw: string | null;
  /** A board's own paper (ICSE 2026) rather than any one school's. */
  isBoardPaper: boolean;
  /** Whether this paper can be attributed to a named school at all. */
  hasSchool: boolean;
  year: string;
  exam: string;
  cls: string;
  /* Was the literal 'Mathematics' — true only while the bank held nothing
     else. bank_papers.subject is a plain text column, and the bank now also
     carries History & Civics and Economics. */
  subject: string;
  board: string;
  questionCount: number;
  marks: number;
}

/* Several papers carry no year at all. The column is null in those cases;
   this keeps the old empty-string contract for callers that only ever ask the
   question through hasYear. */
export const hasYear = (y: string | null | undefined): boolean =>
  Boolean(y) && !String(y).startsWith('year-unknown');

/* ---------------------------------------------------------------------------
   Reading
--------------------------------------------------------------------------- */

const PAPER_COLUMNS =
  'id, school, school_raw, is_board_paper, has_school, year, exam, cls, subject, board, question_count, marks';

interface PaperRow {
  id: string;
  school: string;
  school_raw: string | null;
  is_board_paper: boolean;
  has_school: boolean;
  year: string | null;
  exam: string | null;
  cls: string;
  subject: string;
  board: string;
  question_count: number;
  marks: number;
}

const toPaper = (r: PaperRow): BankPaper => ({
  id: r.id,
  school: r.school,
  schoolRaw: r.school_raw,
  isBoardPaper: r.is_board_paper,
  hasSchool: r.has_school,
  year: r.year ?? '',
  exam: r.exam ?? '',
  cls: r.cls,
  /* Reads the column instead of asserting Mathematics. bank_papers.subject
     has always existed; the bank simply only held maths until the History &
     Civics and Economics banks landed. */
  subject: r.subject ?? 'Mathematics',
  board: r.board,
  questionCount: r.question_count,
  /* Number(): marks is a numeric column now (half marks are real), and
     PostgREST serialises numeric as a STRING to preserve precision. Without
     this the declared `marks: number` would quietly be "82.5". */
  marks: Number(r.marks) || 0,
});

let indexCache: Promise<BankPaper[]> | null = null;

/**
 * Every published bank paper, newest first, undated last.
 *
 * Fetched once per session and shared by every caller. The ordering is the
 * database's, not the client's: year descending with the undated last, then
 * school, which is the order these listings have always been in.
 */
export function loadPaperIndex(): Promise<BankPaper[]> {
  if (!indexCache) {
    indexCache = Promise.resolve(
      supabase
        .from('bank_papers')
        .select(PAPER_COLUMNS)
        .eq('is_published', true)
        .order('year', { ascending: false, nullsFirst: false })
        .order('school', { ascending: true }),
    )
      .then(({ data, error }) => {
        if (error) throw new Error(`bank papers: ${error.message}`);
        return (data ?? []).map(toPaper);
      })
      .catch((err: unknown) => {
        indexCache = null; // let a later caller retry rather than caching the failure
        throw err;
      });
  }
  return indexCache;
}

/* A reader opens one paper, so it fetches one paper's questions. Memoised per
   paper id: going back and forward between two papers should not re-fetch
   either of them.

   Keyed by paper id AND by whether the caller is signed in, because those two
   states now return different rows. Signing in from the gate has to be able to
   re-ask for the same paper and get all of it, rather than being handed the
   five questions cached a moment earlier while signed out. */
const questionCache = new Map<string, Promise<BankQuestion[]>>();

/**
 * One paper's questions, in printed order.
 *
 * Reads through the `bank_paper_questions` RPC, not the table: anon SELECT on
 * bank_questions is revoked, and the function returns five rows to a signed-out
 * caller and the whole paper to a signed-in one. A signed-out reader therefore
 * receives five questions and no trace of the rest -- there is nothing in the
 * payload to un-blur, which is the point.
 *
 * @param signedIn only ever affects the CACHE KEY. The gate itself is decided
 *   server-side from auth.uid(); passing true here cannot unlock anything.
 */
export function loadPaperQuestions(paperId: string, signedIn = false): Promise<BankQuestion[]> {
  const key = `${paperId}:${signedIn ? 'full' : 'free'}`;
  const hit = questionCache.get(key);
  if (hit) return hit;

  const req = Promise.resolve(
    supabase.rpc('bank_paper_questions', { p_paper_id: paperId }),
  )
    .then(({ data, error }) => {
      if (error) throw new Error(`bank questions: ${error.message}`);
      return ((data ?? []) as any[]).map(
        (r): BankQuestion => ({
          i: r.id,
          p: r.paper_id,
          n: r.number,
          t: r.body,
          m: r.marks === null || r.marks === undefined ? null : Number(r.marks),
          c: r.chapter,
          ty: r.qtype,
          pg: r.page ?? undefined,
          f: r.figure ?? undefined,
          o: r.options ?? undefined,
        }),
      );
    })
    .catch((err: unknown) => {
      questionCache.delete(key);
      throw err;
    });

  questionCache.set(key, req);
  return req;
}

/** One paper's summary row, without pulling the whole index. */
export function loadPaper(paperId: string): Promise<BankPaper | null> {
  return Promise.resolve(
    supabase
      .from('bank_papers')
      .select(PAPER_COLUMNS)
      .eq('id', paperId)
      .eq('is_published', true)
      .maybeSingle(),
  ).then(({ data, error }) => {
    if (error) throw new Error(`bank paper: ${error.message}`);
    return data ? toPaper(data) : null;
  });
}

/** The title a paper is listed under across the papers surface. */
export function paperTitle(p: BankPaper): string {
  return [p.school, `Class ${p.cls} ${p.subject}`, hasYear(p.year) ? p.year : null]
    .filter(Boolean)
    .join(' · ');
}

/* ---------------------------------------------------------------------------
   Schools

   The papers surface has two sources: the `papers` table and this bank. Only
   the table was ever wired into /schools and /school/:slug, so every bank
   paper was invisible to both — a school could have papers live on the site
   and an empty page of its own. These helpers give those two routes the
   bank's half of the data.

   The names themselves are resolved at import time, in scripts/school-names.ts,
   and stored in bank_papers.school. Correcting one is an UPDATE now, not a
   deploy, and the alias table is no longer in anybody's browser.
--------------------------------------------------------------------------- */

export interface BankSchool {
  slug: string;
  name: string;
  papers: BankPaper[];
}

/* loadPaperIndex memoises one array for the session, so keying on that
   identity means the grouping below runs once no matter how many routes ask
   for it. A WeakMap rather than a plain cache so a discarded index can be
   collected. */
const schoolsCache = new WeakMap<object, BankSchool[]>();

/**
 * Bank papers grouped by the school they came from, largest first.
 *
 * Board papers are deliberately excluded: an ICSE board paper belongs to the
 * board, not to a school, and a /school/icse page would be a category error.
 * Rows whose school the source could not read are excluded for the same
 * reason — there is no page to send them to. Both are decided by the
 * has_school column rather than re-derived here.
 */
export function schoolsOfPapers(papers: BankPaper[]): BankSchool[] {
  const hit = schoolsCache.get(papers);
  if (hit) return hit;

  const map = new Map<string, BankSchool>();
  papers.forEach((p) => {
    if (!p.hasSchool) return;
    const slug = schoolSlug(p.school);
    /* Keyed on the slug, not the name: two source spellings that resolve to
       the same school are one school and must not become two rows that each
       claim half its papers. */
    const entry = map.get(slug) ?? { slug, name: p.school, papers: [] };
    entry.papers.push(p);
    map.set(slug, entry);
  });

  const out = [...map.values()].sort(
    (a, b) => b.papers.length - a.papers.length || a.name.localeCompare(b.name),
  );
  schoolsCache.set(papers, out);
  return out;
}

/** The one school a slug resolves to, or null. */
export function schoolBySlug(papers: BankPaper[], slug: string): BankSchool | null {
  return schoolsOfPapers(papers).find((s) => s.slug === slug) ?? null;
}
