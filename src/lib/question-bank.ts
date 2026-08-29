/* The Class X Mathematics bank, as papers.

   193 individual ICSE/CBSE papers (6,912 questions across 100 schools). They
   are papers like any other on this site, so they belong IN the papers surface
   — listed on /past-papers, filterable on /past-papers/results, and each one
   opening at its own /past-papers/:id — not behind a separate browser of their
   own. The only thing that differs is the reading experience: these have
   structured questions, so the reader renders them as questions rather than
   embedding a scan.

   The bank is a 2.5MB static asset fetched on demand and memoised for the
   session. Nothing imports it eagerly, so no other route pays for it.

   ⚠ Question text is byte-exact from the source and is never cleaned or
   retyped anywhere in this app. */

import { schoolSlug } from '@/lib/school-slug';

export interface BankQuestion {
  i: string;              // stable id
  p: string;              // paper id
  n: string | null;       // printed number
  t: string;              // text, verbatim
  m: number | null;       // marks
  c: string | null;       // chapter
  s: string | null;       // school
  y: string | null;       // year
  e: string | null;       // exam type
  k: string | null;       // class
  ty: string | null;      // short | long | MCQ
  pg?: number;            // source page
  f?: string;             // figure filename
  o?: string[];           // options
}

export interface BankPaper {
  id: string;
  school: string;
  year: string;
  exam: string;
  cls: string;
  subject: 'Mathematics';
  board: string;
  questionCount: number;
  marks: number;
}

/* Several papers carry the bank's placeholder year, and not always in the same
   shape — "year-unknown" and "year-unknown (2)" both occur. Anything starting
   with it is treated as no year at all rather than shown to a reader. */
export const hasYear = (y: string | null | undefined): boolean =>
  Boolean(y) && !String(y).startsWith('year-unknown');

/** The school column doubles as the board for board-published papers. */
function boardOf(school: string | null, examType: string | null): string {
  const s = (school ?? '').trim();
  if (/^(ICSE|ISC|CBSE|IGCSE|IB)$/i.test(s)) return s.toUpperCase();
  const e = (examType ?? '').toLowerCase();
  if (e.includes('board')) return 'Board';
  return 'ICSE';
}

let cache: Promise<BankQuestion[]> | null = null;

/** Fetches once per session; every caller shares the same promise. */
export function loadBank(): Promise<BankQuestion[]> {
  if (!cache) {
    cache = fetch('/question-bank.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bank ${r.status}`))))
      .catch((err) => {
        cache = null; // let a later caller retry rather than caching the failure
        throw err;
      });
  }
  return cache;
}

/* The light index: the same BankPaper[] papersOf produces, precomputed at
   build time by scripts/generate-paper-index.ts.

   Listing surfaces need paper metadata, not question text, and the text is
   what makes the bank 559KB gzipped. Fetching the index instead is the same
   data for a fraction of the bytes. Falls back to deriving from the full bank
   if the file is missing, so a stale deploy degrades to the old cost rather
   than to an empty page. */
let indexCache: Promise<BankPaper[]> | null = null;

export function loadPaperIndex(): Promise<BankPaper[]> {
  if (!indexCache) {
    indexCache = fetch('/paper-index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`index ${r.status}`))))
      .catch(() => loadBank().then(papersOf))
      .catch((err) => {
        indexCache = null;
        throw err;
      });
  }
  return indexCache;
}

/** Groups the questions into their papers, newest first, undated last. */
export function papersOf(bank: BankQuestion[]): BankPaper[] {
  const map = new Map<string, BankPaper>();
  bank.forEach((row) => {
    let p = map.get(row.p);
    if (!p) {
      p = {
        id: row.p,
        school: row.s ?? 'Unknown school',
        year: row.y ?? '',
        exam: row.e ?? '',
        cls: row.k ?? 'X',
        subject: 'Mathematics',
        board: boardOf(row.s, row.e),
        questionCount: 0,
        marks: 0,
      };
      map.set(row.p, p);
    }
    p.questionCount += 1;
    p.marks += row.m ?? 0;
  });
  return [...map.values()].sort((a, b) => {
    const ay = hasYear(a.year);
    const by = hasYear(b.year);
    if (ay !== by) return ay ? -1 : 1;
    return b.year.localeCompare(a.year) || a.school.localeCompare(b.school);
  });
}

/** A paper's own questions, in printed order. */
export function questionsOf(bank: BankQuestion[], paperId: string): BankQuestion[] {
  return bank.filter((row) => row.p === paperId);
}

/** The title a paper is listed under across the papers surface. */
export function paperTitle(p: BankPaper): string {
  return [p.school, `Class ${p.cls} Mathematics`, hasYear(p.year) ? p.year : null]
    .filter(Boolean)
    .join(' · ');
}

/* ---------------------------------------------------------------------------
   School names

   The bank's `school` field is derived from source filenames, so it arrives
   abbreviated and with paper-code fragments attached ("Avm Juhu Icse10
   Preprelim", "Cnms Mpe", "Jgs Icse10 2Ndterm"). Two passes fix what can be
   fixed honestly:

   1. strip the code fragments — they are filename residue, not part of a name
   2. expand only schools that are unambiguous and well known

   Anything not in the map is left as the source had it, cleaned but not
   invented. A wrong school name on a question paper is worse than a terse one,
   so nothing here is a guess — see UNRESOLVED_SCHOOLS for what was left alone
   deliberately.

   ⚠ This is display only. The bank data itself is never rewritten.
--------------------------------------------------------------------------- */

/* Paper-code fragments that are filename residue rather than name.
 *
 * Four of these earned their place by splitting one school into several:
 *   `prelims?\d*`   "Children'S Academy Prelim01" kept the 01, because \b sits
 *                   between two word characters and so never matched
 *   `xii|xi|x|...`  a trailing class numeral: "Ariv X ...", "... Pfe Ii".
 *                   Longest-first, or `x` would match the front of `xii`
 *   `\d{1,4}`       a bare trailing digit, which made "Avm" and "Avm 6" two
 *                   different schools with one paper each
 *   `rehearsal`     this source's word for a mock ("Cbs Rehearsal X Maths")
 */
const CODE_FRAGMENTS =
  /\b(icse\s?10|icse|isc|cbse|maths?|mathematics|prelims?\d*|preprelim|pre\s?boards?|pre|prel|rehearsal|midterms?|term\s?\d*|\d?nd\s?term|unit|ut\s?\d+|s\d{2}|t\d{2}|a\d{2}|qp\d+|nov\d+|fpe|cpe|spe|mpe|pfe|pie|fre|question|questions|paper|sample|xii|xi|x|iii|ii|\d{1,4}(?:-\d{2})?)\b/gi;

/* cnms.ac.in brands itself "CNM School"; the registered name is Shree
   Chandulal Nanavati Vinay Mandir (ICSE, Vile Parle West). The bank spells it
   five ways -- Cnm, Cnms, C.N.M. School, Chandulal, Chandulal Nanavati -- which
   was five schools holding eight papers between them. One constant so they
   cannot drift apart again. */
const CNM = 'Chandulal Nanavati Vinay Mandir';

/** Only schools that are unambiguous. Terse entries stay terse on purpose. */
const SCHOOL_ALIASES: Record<string, string> = {
  // Kolkata
  'delhi public school joka': 'Delhi Public School, Joka',
  'dps megacity': 'Delhi Public School, Megacity',
  'dps newton': 'Delhi Public School, Newtown',
  'bhavans gangabux kanoria vidyamandir': "Bhavan's Gangabux Kanoria Vidyamandir",
  'la martiniere for boys': 'La Martiniere for Boys',
  'la martiniere for girls': 'La Martiniere for Girls',
  'don bosco park circus': 'Don Bosco School, Park Circus',
  'calcutta boys school': 'Calcutta Boys\u2019 School',
  // Mumbai
  cathedral: 'The Cathedral and John Connon School',
  'cathedral and john canon': 'The Cathedral and John Connon School',
  'dhirubhai ambani': 'Dhirubhai Ambani International School',
  dais: 'Dhirubhai Ambani International School',
  'bombay scottish': 'Bombay Scottish School',
  'bombay scottish mahim': 'Bombay Scottish School, Mahim',
  jamnabai: 'Jamnabai Narsee School',
  'jamnabai narsee': 'Jamnabai Narsee School',
  'j b petit': 'J. B. Petit High School for Girls',
  "children's academy": "Children's Academy",
  'childrens academy': "Children's Academy",
  gokuldham: 'Gokuldham High School',
  'gokuldham int': 'Gokuldham High School',
  'lilavatibai poddar high school': 'Lilavatibai Podar High School',
  'bai avabai framji petite first': 'Bai Avabai Framji Petit Girls\u2019 High School',
  'bai avabai': 'Bai Avabai Framji Petit Girls\u2019 High School',
  'thakur international school': 'Thakur International School',
  'chandulal nanavati': CNM,
  chandulal: CNM,
  vissanji: 'Vissanji Academy',
  'hfs powai': 'Hiranandani Foundation School, Powai',
  'hfs thane': 'Hiranandani Foundation School, Thane',
  'c.n.m. school': CNM,
  cnm: CNM,
  cnms: CNM,
  billabong: 'Billabong High International School',
  euroschool: 'EuroSchool',
  // Elsewhere
  'baldwin girls hs': 'Baldwin Girls\u2019 High School, Bengaluru',
  'greenwood high': 'Greenwood High International School, Bengaluru',
  'hyderabad public school': 'The Hyderabad Public School',
  'bishop westcott': 'Bishop Westcott School, Ranchi',
  'bhuta high school': 'Bhuta High School',

  /* Verified against each school's own site or its CISCE listing before being
     added here, because the whole point of this map is that it does not
     guess. Each of these was merging two ways at once: the abbreviation and
     the spelled-out name were separate schools with a paper or two each. */
  avm: 'Arya Vidya Mandir',
  'avm juhu': 'Arya Vidya Mandir, Juhu',
  orion: 'IES Orion, Dadar',
  'ies orion': 'IES Orion, Dadar',
  gea: 'Gundecha Education Academy, Kandivali',
  gundecha: 'Gundecha Education Academy, Kandivali',
  svis: 'Swami Vivekanand International School, Kandivali',
  'swami vivekanand': 'Swami Vivekanand International School, Kandivali',
  bhaktivedanta: 'Bhaktivedanta Swami Mission School',
  bss: 'Bombay Scottish School',
  bssm: 'Bombay Scottish School, Mahim',
  jns: 'Jamnabai Narsee School',

  /* Not expansions: an initialism the source never spelled out reads as a
     typo in Title Case ("Nps", "Ghsjc"). Printing it as an initialism says
     "abbreviation we could not resolve" instead, which is the truth. Listed
     one by one rather than upper-casing every short label, because "Apex"
     and "Ariv" are words, not initials. */
  ais: 'AIS',
  'ais se': 'AIS SE',
  asc: 'ASC',
  cbs: 'CBS',
  dbcs: 'DBCS',
  faps: 'FAPS',
  ges: 'GES',
  ghsjc: 'GHSJC',
  hcs: 'HCS',
  ies: 'IES',
  jgs: 'JGS',
  lfs: 'LFS',
  lml: 'LML',
  nps: 'NPS',
  nsm: 'NSM',
  pis: 'PIS',
  ppsc: 'PPSC',
  rbs: 'RBS',
};

/** Placeholders the bank uses when it could not read a school at all. */
const NO_SCHOOL = /^(unknownschool|unknown school|unknown)$/i;

/* Values in the school column that are not schools. "Graphs Question" is a
   topic file and "Brugesh Sir" is a tutor; both were being given a school
   page of their own, and both were in the sitemap. */
const NOT_A_SCHOOL = /^(graphs?|brugesh sir)$/i;

/** Names the source abbreviated past the point of safe expansion. */
export const UNRESOLVED_SCHOOLS = [
  // Initialisms printed as initialisms; nobody could tell us what they expand to.
  'AIS', 'AIS SE', 'ASC', 'CBS', 'DBCS', 'FAPS', 'GES', 'GHSJC', 'HCS', 'IES',
  'JGS', 'LFS', 'LML', 'MPBFHS', 'NPS', 'NSM', 'PIS', 'PPSC', 'RBS',
  // Words, but not ones that identify a school on their own.
  'Anubhuti', 'Apex', 'Ariv', 'Champion', 'Dr Mts Pune', 'Hare Krishna',
  'Hutchings', 'Internobilian', 'Podar', 'St Mary',
];

/** The name to print for a bank school. Display only. */
export function schoolLabel(raw: string | null | undefined): string {
  const s = (raw ?? '').trim();
  if (!s) return 'Unnamed school';
  if (NO_SCHOOL.test(s)) return 'School not recorded';
  if (/^(icse|isc|cbse|igcse|ib)$/i.test(s)) return `${s.toUpperCase()} board paper`;

  const cleaned = s
    .replace(CODE_FRAGMENTS, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\s,.-]+$/, '')
    .trim();

  const key = (cleaned || s).toLowerCase();
  if (SCHOOL_ALIASES[key]) return SCHOOL_ALIASES[key];

  // Longest alias that the cleaned name starts with, so "Gokuldham Int" hits
  // "gokuldham" without "Gundecha Cpe" hitting anything it should not.
  const prefix = Object.keys(SCHOOL_ALIASES)
    .filter((k) => key === k || key.startsWith(`${k} `))
    .sort((a, b) => b.length - a.length)[0];
  if (prefix) return SCHOOL_ALIASES[prefix];

  return cleaned || s;
}

/* ---------------------------------------------------------------------------
   Schools

   The papers surface has two sources: the `papers` table and this bank. Only
   the table was ever wired into /schools and /school/:slug, so every bank
   paper was invisible to both — a school could have papers live on the site
   and an empty page of its own. These helpers give those two routes the
   bank's half of the data, derived the same way everything else here is:
   from the rows themselves, with no schools table to fall out of date.
--------------------------------------------------------------------------- */

/** A board-published paper (ICSE 2026), not a paper from any one school. */
export const isBoardPaper = (school: string | null | undefined): boolean =>
  /^(icse|isc|cbse|igcse|ib)$/i.test((school ?? '').trim());

/** Whether a row can be attributed to a named school at all. */
export const hasSchool = (school: string | null | undefined): boolean => {
  const s = (school ?? '').trim();
  if (!s || NO_SCHOOL.test(s) || isBoardPaper(s)) return false;
  // Tested against the cleaned label, because the raw value carries the
  // filename residue that hides it ("Graphs Question" -> "Graphs").
  return !NOT_A_SCHOOL.test(schoolLabel(s));
};

export interface BankSchool {
  slug: string;
  name: string;
  papers: BankPaper[];
}

/* loadBank memoises one array for the session, so keying on that identity
   means the grouping below runs once no matter how many routes ask for it.
   A WeakMap rather than a plain cache so a discarded bank can be collected. */
const schoolsCache = new WeakMap<object, BankSchool[]>();

/**
 * Bank papers grouped by the school they came from, largest first.
 *
 * Board papers are deliberately excluded: an ICSE board paper belongs to the
 * board, not to a school, and a /school/icse page would be a category error.
 * Rows whose school the source could not read are excluded for the same
 * reason — there is no page to send them to.
 */
export function schoolsOf(bank: BankQuestion[]): BankSchool[] {
  const hit = schoolsCache.get(bank);
  if (hit) return hit;
  const out = schoolsOfPapers(papersOf(bank));
  schoolsCache.set(bank, out);
  return out;
}

/** The same grouping over an already-summarised paper list (loadPaperIndex). */
export function schoolsOfPapers(papers: BankPaper[]): BankSchool[] {
  const hit = schoolsCache.get(papers);
  if (hit) return hit;

  const map = new Map<string, BankSchool>();
  papers.forEach((p) => {
    if (!hasSchool(p.school)) return;
    const name = schoolLabel(p.school);
    const slug = schoolSlug(name);
    /* Keyed on the slug, not the raw string: two source spellings that clean
       to the same name are one school and must not become two rows that each
       claim half its papers. */
    const entry = map.get(slug) ?? { slug, name, papers: [] };
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
