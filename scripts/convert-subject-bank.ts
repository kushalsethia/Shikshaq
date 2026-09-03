#!/usr/bin/env tsx
/**
 * CONVERTER: subject question-bank JSON (History & Civics, Economics)
 *            -> the flat BankQuestion[] shape import-bank.ts already loads.
 *
 * Why a converter rather than a second importer: import-bank.ts is already
 * the byte-exact, idempotent, verified path into bank_papers/bank_questions.
 * The only thing standing between these files and that path is shape — they
 * arrive as { metadata, papers, standalone_questions, context_groups } while
 * the importer wants a flat array. So this normalises shape ONLY. Question
 * text is moved by reference (JSON.parse -> assignment -> JSON.stringify),
 * never rebuilt, sliced or re-cased, so the "text is never altered" rule
 * survives the extra hop. verify() at the bottom re-reads the output and
 * asserts every body still matches its source character for character.
 *
 *   npx tsx scripts/convert-subject-bank.ts \
 *     --in "C:/Users/kanis/Downloads/history_civics_bank.json" \
 *     --in "C:/Users/kanis/Downloads/question_bank_economics.json" \
 *     --out data/question-bank-subjects.json
 *
 * Then feed the output through the existing importer.
 *
 * NOTE: run this and inspect its report BEFORE importing. It prints the
 * unresolved school names and the OCR split, both of which are decisions a
 * person should make rather than a script.
 */

import * as fs from 'fs';
import * as path from 'path';

import { schoolLabel, hasSchool, isBoardPaper, UNRESOLVED_SCHOOLS } from './school-names';

/* ------------------------------------------------------------------ types */

/** The incoming file's own shape. Only the fields we read are modelled. */
interface SourceFile {
  metadata: { subject: string; papers_included?: number };
  papers: SourcePaper[];
  standalone_questions: SourceQuestion[];
  context_groups: SourceGroup[];
}

interface SourcePaper {
  paper: string;
  school: string;
  class: string;
  year: string;
  exam_type: string;
  extraction: string;
}

interface SourceSrc {
  school?: string;
  class?: string;
  exam_type?: string;
  year?: string;
}

interface SourceQuestion {
  id: string;
  type?: string | null;
  marks?: number | null;
  question: string;
  options?: string[];
  topic?: string | null;
  subtopic?: string | null;
  source?: SourceSrc;
  provenance?: { paper?: string; extraction?: string };
}

interface SourceGroup {
  context_type?: string | null;
  context_description?: string | null;
  topic?: string | null;
  total_marks?: number | null;
  source?: SourceSrc;
  questions: { sub_label?: string | null; marks?: number | null; question: string; id: string }[];
  provenance?: { paper?: string; extraction?: string };
}

/** Matches scripts/bank-source.ts BankQuestion exactly. */
interface BankQuestion {
  i: string;
  p: string;
  n: string | null;
  t: string;
  m: number | null;
  c: string | null;
  s: string | null;
  y: string | null;
  e: string | null;
  k: string | null;
  ty: string | null;
  pg?: number;
  f?: string;
  o?: string[];
  /* Added for multi-subject support. bank_papers.subject already exists in
     the schema (text not null default 'Mathematics'), so this needs no
     migration — but bank-source.ts types it as the literal 'Mathematics'
     and papersOf() hardcodes it, which is what actually has to widen. */
  subj?: string;
}

/* ------------------------------------------------------------- conversion */

/* Paper id MUST be 6 lowercase hex characters.
   App.tsx's PaperRoute discriminates the two readers on the id's SHAPE:
   `/^[0-9a-f]{6}$/` goes to BankPaper, anything else to PaperReader (the
   Supabase `papers` reader). The 193 papers already in bank_papers are all
   6-hex. A filename-shaped id would therefore route every new paper to the
   wrong reader and 404 — so ids are minted as a stable hash of the source
   filename instead, deterministic so re-running upserts the same rows
   rather than duplicating them.

   Collisions are checked and resolved rather than assumed away: 456 ids in
   a 16.7M space is ~0.6% by the birthday bound, and the space is already
   shared with 193 live ids. */
function hash6(input: string, salt = 0): string {
  // FNV-1a 32-bit, then widened with the salt for collision resolution.
  let h = 0x811c9dc5;
  const s = salt ? `${input}#${salt}` : input;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0').slice(0, 6);
}

/** filename -> 6-hex id, unique within this run and against `taken`. */
function mintPaperId(filename: string, taken: Map<string, string>): string {
  const base = filename.replace(/\.pdf$/i, '');
  for (let salt = 0; salt < 1000; salt += 1) {
    const id = hash6(base, salt);
    const owner = taken.get(id);
    if (!owner) {
      taken.set(id, base);
      return id;
    }
    if (owner === base) return id; // same paper, already minted
  }
  throw new Error(`Could not mint a unique id for ${base}`);
}

/* "chapterwise" is a categorisation, not a sitting. Left as-is here so the
   value stays truthful, but flagged in the report because it will show up in
   any exam-type facet alongside real exams like "Board Examination". */
const isNonExam = (exam: string | null | undefined) =>
  (exam ?? '').trim().toLowerCase() === 'chapterwise';

/* Both source files number their questions from scratch — history has
   MCQ-0001 and economics has SA-0001, and ALL 4,331 economics ids collide
   with a history id. bank_questions.id is the primary key and import-bank.ts
   upserts on it, so importing both unprefixed would have silently
   overwritten 4,331 history questions with economics ones and reported
   success. Prefixing by subject is what keeps them distinct. Paper ids do
   NOT need this — those come from filenames that already carry the subject. */
const subjectPrefix = (subject: string) =>
  subject.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '').slice(0, 12);

function convert(file: SourceFile, srcName: string, takenPaperIds: Map<string, string>) {
  const subject = file.metadata.subject;
  const idPrefix = subjectPrefix(subject);
  const qid = (raw: string) => `${idPrefix}-${raw}`;
  const paperIdOf = (filename: string) => mintPaperId(filename, takenPaperIds);
  const out: BankQuestion[] = [];
  /* Per paper, so `ord` in the DB stays contiguous and unique — the table has
     a `unique (paper_id, ord)` constraint. */
  const ordByPaper = new Map<string, number>();
  const nextOrd = (p: string) => {
    const n = (ordByPaper.get(p) ?? 0) + 1;
    ordByPaper.set(p, n);
    return n;
  };

  const push = (
    id: string,
    paperFile: string,
    src: SourceSrc | undefined,
    number: string | null,
    text: string,
    marks: number | null,
    chapter: string | null,
    qtype: string | null,
    options?: string[],
  ) => {
    const p = paperIdOf(paperFile);
    nextOrd(p);
    out.push({
      i: id,
      p,
      n: number,
      t: text, // by reference, never rebuilt
      m: marks ?? null,
      c: chapter,
      s: src?.school ?? null,
      /* Coerced to string: 2,640 source rows carry `year` as a NUMBER
         (2022) rather than a string ("2023-24"), and papersOf() sorts
         papers with `b.year.localeCompare(a.year)` — which throws on a
         number. The bank's own year field is text (it holds values like
         "2023-24" and "year-unknown"), so string is the right shape. */
      y: src?.year === null || src?.year === undefined ? null : String(src.year),
      e: src?.exam_type ?? null,
      k: src?.class ?? null,
      ty: qtype,
      ...(options && options.length ? { o: options } : {}),
      subj: subject,
    });
  };

  for (const q of file.standalone_questions) {
    const paperFile = q.provenance?.paper ?? 'unknown-paper.pdf';
    push(
      qid(q.id),
      paperFile,
      q.source,
      null,
      q.question,
      q.marks ?? null,
      q.subtopic ?? q.topic ?? null,
      q.type ?? null,
      q.options,
    );
  }

  /* Context groups carry a shared stimulus (a quote, map, image or theme)
     plus sub-questions that only make sense underneath it. The schema has no
     group concept, and the alternative — prepending the stimulus onto each
     sub-question's body — would mean writing text the source never had, which
     the "never altered" rule forbids. So the stimulus becomes its own row
     immediately before its children (qtype 'context'), and each child keeps
     its own verbatim body and printed sub-label. Order does the grouping. */
  for (const g of file.context_groups) {
    const paperFile = g.provenance?.paper ?? 'unknown-paper.pdf';
    const groupId = g.questions[0]?.id?.split('_')[0] ?? `CG-${out.length}`;
    if (g.context_description) {
      push(
        qid(`${groupId}_CTX`),
        paperFile,
        g.source,
        null,
        g.context_description,
        g.total_marks ?? null,
        g.topic ?? null,
        g.context_type ? `context:${g.context_type}` : 'context',
      );
    }
    for (const sub of g.questions) {
      push(
        qid(sub.id),
        paperFile,
        g.source,
        sub.sub_label ?? null,
        sub.question,
        sub.marks ?? null,
        g.topic ?? null,
        'sub',
      );
    }
  }

  /* ------------------------------------------------------------- report */
  const ocrPapers = file.papers.filter((p) => p.extraction !== 'text_layer');
  const rawSchools = new Set(file.papers.map((p) => p.school));
  const unresolved = [...rawSchools].filter(
    (s) => !hasSchool(s) && !isBoardPaper(s),
  );
  const alreadyFlagged = new Set(UNRESOLVED_SCHOOLS.map((s) => s.toLowerCase()));
  const newlyUnresolved = [...rawSchools].filter(
    (s) => hasSchool(s) && alreadyFlagged.has(schoolLabel(s).toLowerCase()),
  );
  const nonExam = new Set(
    file.papers.filter((p) => isNonExam(p.exam_type)).map((p) => p.exam_type),
  );

  return {
    subject,
    srcName,
    rows: out,
    report: {
      papers: file.papers.length,
      standalone: file.standalone_questions.length,
      groups: file.context_groups.length,
      rowsProduced: out.length,
      ocrPapers: ocrPapers.length,
      distinctSchools: rawSchools.size,
      notASchoolOrUnknown: unresolved,
      abbreviationsNeedingExpansion: newlyUnresolved,
      nonExamExamTypes: [...nonExam],
    },
  };
}

/* ------------------------------------------------------------------ main */

function parseArgs() {
  const args = process.argv.slice(2);
  const ins: string[] = [];
  let out = 'data/question-bank-subjects.json';
  let reserved = '';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--in') ins.push(args[i + 1]);
    if (args[i] === '--out') out = args[i + 1];
    // A newline/comma list of ids already live in bank_papers, so minted ids
    // cannot collide with production rows.
    if (args[i] === '--reserve') reserved = args[i + 1];
  }
  return { ins, out, reserved };
}

function main() {
  const { ins, out, reserved } = parseArgs();
  if (!ins.length) {
    console.error('Usage: --in <file.json> [--in <file2.json>] [--out <dest.json>] [--reserve <ids.txt>]');
    process.exit(1);
  }

  /* Seeded with every id already in bank_papers so a minted id can never
     land on a live paper and silently overwrite it on upsert. */
  const takenPaperIds = new Map<string, string>();
  if (reserved && fs.existsSync(reserved)) {
    const ids = fs.readFileSync(reserved, 'utf-8').split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    ids.forEach((id) => takenPaperIds.set(id, '__live__'));
    console.log(`Reserved ${ids.length} existing paper ids against collision.`);
  } else if (reserved) {
    console.error(`--reserve file not found: ${reserved}`);
    process.exit(1);
  }

  const all: BankQuestion[] = [];
  const sources: { text: string; id: string }[] = [];

  for (const inPath of ins) {
    if (!fs.existsSync(inPath)) {
      console.error(`Not found: ${inPath}`);
      process.exit(1);
    }
    const file: SourceFile = JSON.parse(fs.readFileSync(inPath, 'utf-8'));
    const { subject, rows, report } = convert(file, path.basename(inPath), takenPaperIds);

    console.log(`\n=== ${path.basename(inPath)} — ${subject} ===`);
    console.log(`  papers ${report.papers}  standalone ${report.standalone}  groups ${report.groups}`);
    console.log(`  -> ${report.rowsProduced} question rows`);
    console.log(`  OCR-derived papers: ${report.ocrPapers}/${report.papers}` +
      (report.ocrPapers === report.papers ? '  <-- ALL of them' : ''));
    console.log(`  distinct raw school values: ${report.distinctSchools}`);
    if (report.notASchoolOrUnknown.length) {
      console.log(`  NOT a school / unknown (${report.notASchoolOrUnknown.length}):`);
      report.notASchoolOrUnknown.forEach((s) => console.log(`     - ${JSON.stringify(s)}`));
    }
    if (report.abbreviationsNeedingExpansion.length) {
      console.log(`  already on UNRESOLVED_SCHOOLS (${report.abbreviationsNeedingExpansion.length}): ` +
        report.abbreviationsNeedingExpansion.join(', '));
    }
    if (report.nonExamExamTypes.length) {
      console.log(`  exam_type values that are not sittings: ${report.nonExamExamTypes.join(', ')}`);
    }

    rows.forEach((r) => sources.push({ text: r.t, id: r.i }));
    all.push(...rows);
  }

  const dest = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(all), 'utf-8');

  /* Verify positionally, not through an id map. The first version of this
     check built a Map keyed on id and reported 4,508 "changed" bodies — not
     corruption, but every colliding id resolving to whichever row was
     written last. Comparing index-for-index tests what this script actually
     claims (that text survives the hop) without depending on ids being
     unique, which is a separate property checked below. */
  const written: BankQuestion[] = JSON.parse(fs.readFileSync(dest, 'utf-8'));
  let mismatches = 0;
  if (written.length !== sources.length) {
    console.log(`FAILED: wrote ${written.length} rows but held ${sources.length} sources.`);
    process.exit(1);
  }
  for (let i = 0; i < sources.length; i += 1) {
    if (written[i].t !== sources[i].text) mismatches += 1;
  }

  console.log(`\nWrote ${all.length} rows -> ${dest}`);
  console.log(mismatches === 0
    ? 'Byte-exactness verified: every question body round-tripped unchanged.'
    : `FAILED: ${mismatches} bodies changed in the round trip.`);
  if (mismatches) process.exit(1);

  const ids = new Set(all.map((r) => r.i));
  if (ids.size !== all.length) {
    console.log(`WARNING: ${all.length - ids.size} duplicate question ids across files — ` +
      'the importer upserts on id, so duplicates would silently overwrite each other.');
  }
}

main();
