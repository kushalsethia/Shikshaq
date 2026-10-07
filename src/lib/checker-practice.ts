/**
 * The practice round for new student checkers: made-up questions, each with
 * ONE planted mistake of a kind students really meet, and the fake API that
 * marks the answers.
 *
 * THE GUARANTEE. This file, the practice page and everything they import
 * stay clear of Supabase and of src/lib/checker-api.ts, so nothing a student
 * does in a practice round can reach the real queue, a real question or the
 * checker log. src/lib/checker-practice.test.ts walks the import graph to
 * prove it, so a later edit that wires a real call in fails CI.
 *
 * The question text here is invented for practice. None of it is copied
 * from a real paper.
 */

import { canSplitAt } from '@/lib/checker-body';

export type PracticeAction = 'pass' | 'fix' | 'split' | 'help' | 'skip';

export interface PracticeQuestion {
  id: string;
  /** What the printed page says, one entry per line (drawn as the picture). */
  printed: string[];
  /** Draw the picture smudged, as a bad scan. */
  blurry?: boolean;
  /** What the computer typed. */
  body: string;
  /** The marks the computer typed, or null for none. */
  marks: number | null;
  /** Split here is offered on this question (it looks like two). */
  offersSplit: boolean;
  /** The right move. */
  correct: PracticeAction;
  /** Fix: what the typed words must become, and the marks. */
  fixedBody?: string;
  fixedMarks?: number | null;
  /** Split: the second question starts at this code point offset (a tap one
   *  place before it is accepted too, because the space sits between). */
  splitAt?: number;
  /** What the student should notice, in a sentence. Shown after answering. */
  lesson: string;
  /** Names the planted mistake, for the summary. */
  planted: string;
}

export type PracticeAnswer =
  | { action: 'pass' }
  | { action: 'fix'; body: string; marks: number | null }
  | { action: 'split'; at: number | null }
  | { action: 'help' }
  | { action: 'skip' };

export interface PracticeResult {
  correct: boolean;
  /** One line: "Right." or "Not quite." */
  headline: string;
  /** What was right or wrong, and why. */
  explanation: string;
}

export const ACTION_NAMES: Record<PracticeAction, string> = {
  pass: 'Looks right',
  fix: 'Fix it',
  split: 'Split here',
  help: 'Ask the HOD',
  skip: 'Skip this question',
};

const FUSED = '4. State the SI unit of force. 5. Name the force that pulls objects towards the Earth.';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'practice-1',
    printed: ["1. Write the plural of 'child'.   [1]"],
    body: "1. Write the plural of 'child'.",
    marks: 1,
    offersSplit: false,
    correct: 'pass',
    lesson:
      'The typed words and the marks match the printed page exactly, so there is nothing to fix. Most real questions are like this.',
    planted: 'A clean question that only needs Looks right',
  },
  {
    id: 'practice-2',
    printed: ['2. Find the HCF of 18 and 24.   [2]'],
    body: '2. Find the HCF of 18 and 24.',
    marks: 3,
    offersSplit: false,
    correct: 'fix',
    fixedBody: '2. Find the HCF of 18 and 24.',
    fixedMarks: 2,
    lesson:
      'The words are right, but the printed page says [2] and the typed marks say 3. Press Fix it, change only the marks, and leave the words alone.',
    planted: 'Wrong marks',
  },
  {
    id: 'practice-3',
    printed: ['3. Name the largest planet in the solar system.   [1]'],
    body: '3. Name the largest planet in the system.',
    marks: 1,
    offersSplit: false,
    correct: 'fix',
    fixedBody: '3. Name the largest planet in the solar system.',
    fixedMarks: 1,
    lesson: 'The word "solar" is on the printed page but missing from the typed text. Press Fix it and add just that word.',
    planted: 'A missing word',
  },
  {
    id: 'practice-4',
    printed: ['4. State the SI unit of force.   [1]', '5. Name the force that pulls objects towards the Earth.   [1]'],
    body: FUSED,
    marks: null,
    offersSplit: true,
    correct: 'split',
    splitAt: Array.from(FUSED.slice(0, FUSED.indexOf('5.'))).length,
    lesson:
      'The printed page shows two separate questions, 4 and 5, but the computer joined them into one. Press Split here and tap just before "5.".',
    planted: 'Two questions joined into one (needs Split)',
  },
  {
    id: 'practice-5',
    printed: ['6. Name the gas that plants take in for photosynthesis.   [1]'],
    body: '6. Nme th# g@s tha7 pl^nts t4ke 1n f0r phot0syn+hesis.',
    marks: 1,
    offersSplit: false,
    correct: 'help',
    lesson:
      'The typed words are scrambled. Do not try to retype a whole question from the picture. Press Ask the HOD and your HOD will sort it out.',
    planted: 'Scrambled words, too broken to fix',
  },
  {
    id: 'practice-6',
    printed: ['7. Whcih river flows through Kolkata? Write its name.   [1]'],
    body: '7. Whcih river flows through Kolkata? Write its name.',
    marks: 1,
    offersSplit: false,
    correct: 'pass',
    lesson:
      'The paper itself misprints "Which", and the typed text copies the paper exactly. We check against the page, so Looks right is correct. Do not tidy the spelling.',
    planted: 'A typo that is in the printed paper itself',
  },
  {
    id: 'practice-7',
    printed: ['8. Find the area of the shaded region.   [3]', '   (a) Write down the formula you use.'],
    blurry: true,
    body: '8. Find the area of the shaded region.',
    marks: 3,
    offersSplit: false,
    correct: 'skip',
    lesson:
      'The picture is too blurry to read, so you cannot honestly say the words match. Press Skip this question. Never guess from a picture you cannot read.',
    planted: 'A picture too blurry to read',
  },
];

function norm(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function right(explanation: string): PracticeResult {
  return { correct: true, headline: 'Right.', explanation };
}

function wrong(explanation: string): PracticeResult {
  return { correct: false, headline: 'Not quite.', explanation };
}

/** Marks one answer. Pure: the same question and answer give the same result. */
export function evaluatePracticeAnswer(q: PracticeQuestion, a: PracticeAnswer): PracticeResult {
  if (a.action !== q.correct) {
    return wrong(`You pressed ${ACTION_NAMES[a.action]}, but ${ACTION_NAMES[q.correct]} was the right move here. ${q.lesson}`);
  }
  if (q.correct === 'fix' && a.action === 'fix') {
    const bodyOk = norm(a.body) === norm(q.fixedBody ?? q.body);
    const marksOk = (a.marks ?? null) === (q.fixedMarks ?? null);
    if (!bodyOk && !marksOk) {
      return wrong(
        `Fix it was right, but the words and the marks still differ from the page. The words should read: ${q.fixedBody} The marks should be ${q.fixedMarks}. ${q.lesson}`,
      );
    }
    if (!bodyOk) {
      return wrong(`Fix it was right, but the words still differ from the page. They should read: ${q.fixedBody} ${q.lesson}`);
    }
    if (!marksOk) {
      return wrong(`Fix it was right, but the marks still differ from the page. They should be ${q.fixedMarks}. ${q.lesson}`);
    }
    return right(q.lesson);
  }
  if (q.correct === 'split' && a.action === 'split') {
    const want = q.splitAt ?? -1;
    const at = a.at;
    if (at === null || !canSplitAt(q.body, at) || (at !== want && at !== want - 1)) {
      return wrong(`Split here was right, but the cut is in the wrong place. The second question starts at "5.". ${q.lesson}`);
    }
    return right(q.lesson);
  }
  return right(q.lesson);
}

export interface PracticeCall {
  id: string;
  action: PracticeAction;
}

export interface PracticeApi {
  questions(): PracticeQuestion[];
  answer(id: string, a: PracticeAnswer): PracticeResult;
  /** Every answer given, for tests. */
  calls: PracticeCall[];
}

/** The fake API the practice page talks to. In memory, no network. */
export function createPracticeApi(): PracticeApi {
  const calls: PracticeCall[] = [];
  return {
    calls,
    questions: () => PRACTICE_QUESTIONS.map((q) => ({ ...q })),
    answer(id, a) {
      const q = PRACTICE_QUESTIONS.find((x) => x.id === id);
      if (!q) throw new Error(`No practice question ${id}`);
      calls.push({ id, action: a.action });
      return evaluatePracticeAnswer(q, a);
    },
  };
}

/** The printed-page picture, drawn as SVG so no image file ships. */
export function practicePictureDataUrl(lines: string[], blurry = false): string {
  const width = 520;
  const height = 28 + lines.length * 28;
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const text = lines
    .map(
      (l, i) =>
        `<text x="16" y="${34 + i * 28}" font-family="Times New Roman, serif" font-size="18" fill="#222" xml:space="preserve">${esc(l)}</text>`,
    )
    .join('');
  const filter = blurry ? '<filter id="b"><feGaussianBlur stdDeviation="3.2"/></filter>' : '';
  const group = blurry ? `<g filter="url(#b)">${text}</g>` : text;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${filter}<rect width="100%" height="100%" fill="#fbfaf6"/>${group}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
