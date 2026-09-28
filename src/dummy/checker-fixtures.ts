/**
 * Dummy-mode fixtures for the paper checker (D75). Test builds only: reached
 * solely through the PREVIEW_TOOLS-gated lazy import in Checker.tsx, so none
 * of this reaches the live bundle (see src/lib/dummy-mode.ts).
 *
 * Every question here is MADE UP for the preview. None is copied from a real
 * paper, so nothing here is question-bank text. Each one exercises a case
 * the checker must handle: a trusted picture, no picture, a sub-part with a
 * whole-question picture, an English passage, scrambled text, a long
 * question with a table, maths, a split, and a blank row.
 */

import type { CheckerQuestion } from '@/lib/checker-api';
import type { ContextRow } from '@/lib/checker-context';

export const DUMMY_PAPER = '00000000-0000-4000-8000-00000000d0d0';

/** Made-up "printed page" crops, drawn as SVG so no image file ships. */
export const DUMMY_PICTURES: Record<string, string[]> = {
  'dummy/q-quadratic.png': ['4. (ii) Solve for x and verify your answer:', '        2x² − 7x + 3 = 0            [3]'],
  'dummy/q-trees_whole.png': [
    '5. Read the table and answer the questions that follow.',
    '   (a) Name the district with the most trees.      [1]',
    '   (b) Find the total number of trees planted.     [2]',
    '   (c) Which two districts planted the same number? [1]',
  ],
  'dummy/q-split.png': [
    '7. State two uses of a lever in daily life.          [2]',
    '8. Define power. Give its unit.                      [2]',
  ],
  'dummy/q-long.png': [
    '9. Case study: a school garden club recorded the number of',
    '   saplings each class planted over one week.',
    '   (i) Draw a bar graph of the data.                 [2]',
    '   (ii) Which class planted the fewest?              [1]',
  ],
};

function q(partial: Partial<CheckerQuestion> & Pick<CheckerQuestion, 'id' | 'body'>): CheckerQuestion {
  return {
    paper_id: DUMMY_PAPER,
    ord: 1,
    display_number: null,
    number_path: null,
    options: null,
    marks: null,
    instructions: null,
    flag_reasons: [],
    flag_detail: null,
    source: null,
    subject: 'Mathematics',
    school: 'Dummy School',
    cls: 'X',
    exam: 'Prelims',
    year: '2025',
    ...partial,
  };
}

export function dummyQuestions(): CheckerQuestion[] {
  return [
    q({
      id: 'd0000001-0000-4000-8000-000000000001',
      ord: 1,
      display_number: '4(ii)',
      marks: 3,
      body: '(ii) Solve for $x$ and verify your answer: $$2x^2 - 7x + 3 = 0$$ Answer: $x = 3$ or $x = \\frac{1}{2}$',
      flag_reasons: ['answer_in_question'],
      flag_detail: JSON.stringify({ answer_in_question: 'Computer check: the last line gives the answer.' }),
      source: { snippet_object: 'dummy/q-quadratic.png', align_score: 0.97 },
    }),
    q({
      id: 'd0000002-0000-4000-8000-000000000002',
      ord: 2,
      subject: 'Economics',
      cls: 'XII',
      body: 'With the help of a diagram, explain what happens to the price of a good when its supply falls and demand stays the same.',
      flag_reasons: ['chapter_unresolved', 'display_number_missing', 'figure_missing', 'missing_marks'],
      flag_detail: JSON.stringify({
        chapter_unresolved: "chapter is null -- ch= was '?' or did not resolve against the chapter list",
      }),
      // A doubtful crop (0.42): never shown, so the page says "no picture".
      source: { snippet_object: 'dummy/q-quadratic.png', align_score: 0.42 },
    }),
    q({
      id: 'd0000003-0000-4000-8000-000000000003',
      ord: 4,
      display_number: '(b)',
      marks: 2,
      body: '(b) Find the total number of trees planted.',
      flag_reasons: ['merged_subparts'],
      source: { snippet_object: 'dummy/q-trees_b.png', align_score: 0.5 },
    }),
    q({
      id: 'd0000004-0000-4000-8000-000000000004',
      ord: 10,
      subject: 'English',
      cls: 'VII',
      display_number: '3',
      body: '3. Why does the girl in the story hide the letter under her pillow?\n(a) She is afraid her brother will read it.\n(b) She wants to keep it dry.\n(c) She forgot where her bag was.\n(d) She plans to post it later.',
      flag_reasons: ['hidden_on_site', 'gate_source'],
      flag_detail: JSON.stringify({
        hidden_on_site: 'Two computer checks read it and think it is fine. Please confirm.',
        gate_source: "Text printed just after it on the paper: 'Complete the following sentences'",
      }),
      source: {
        pipeline: 'english_w14',
        role: 'rescue',
        set_text: 'A made-up short story',
        stimulus: {
          id: 'dummy-passage-1',
          kind: 'prose_extract',
          title: null,
          text: 'Meera read the letter twice. Her brother was already at the door, calling her name, so she pushed the envelope under her pillow and smoothed the sheet flat. She would post it tomorrow, on the way to school, before anyone could ask what it said.',
        },
      },
    }),
    q({
      id: 'd0000005-0000-4000-8000-000000000005',
      ord: 11,
      subject: 'History & Civics',
      cls: 'X',
      display_number: '6',
      marks: 4,
      body: 'st te th fu ct ns o th Pr me M n st r nd h s c unc l f m n st rs wh ch ar e ls o r sp ns bl e t o th L k S bh a',
      flag_reasons: ['ocr_junk'],
    }),
    q({
      id: 'd0000006-0000-4000-8000-000000000006',
      ord: 12,
      display_number: '9',
      marks: 3,
      body:
        '9. Case study: a school garden club recorded the number of saplings each class planted over one week.\n\n' +
        '| Class | VI | VII | VIII | IX | X |\n| --- | --- | --- | --- | --- | --- |\n| Saplings | 14 | 22 | 9 | 17 | 22 |\n\n' +
        '(i) Draw a bar graph of the data. [2]\n(ii) Which class planted the fewest saplings? [1]\n' +
        '(iii) The club wants every class to plant at least 15 next week. How many more saplings must each class that fell short plant? Show your working clearly, and write your final answer in a sentence.',
      flag_reasons: ['figure_missing', 'marks_mismatch'],
      flag_detail: JSON.stringify({ marks_mismatch: 'questions sum to 100.0, paper.max_marks is 80.0' }),
      source: { snippet_object: 'dummy/q-long.png', align_score: 0.93 },
    }),
    q({
      id: 'd0000007-0000-4000-8000-000000000007',
      ord: 13,
      subject: 'Physics',
      display_number: '7',
      marks: 2,
      body: '7. State two uses of a lever in daily life. [2] 8. Define power. Give its unit. [2]',
      flag_reasons: ['ocr_fused'],
      flag_detail: JSON.stringify({
        ocr_fused: "shares one un-splittable OCR block with other question(s) in fused_group 'grpA' -- needs a human to split",
      }),
      source: { snippet_object: 'dummy/q-split.png' },
    }),
    q({
      id: 'd0000008-0000-4000-8000-000000000008',
      ord: 14,
      subject: 'Chemistry',
      display_number: '8',
      marks: 2,
      body: '',
      flag_reasons: ['ocr_fused'],
      flag_detail: JSON.stringify({ ocr_fused: "shares one un-splittable OCR block in fused_group 'grpA'" }),
      source: { snippet_object: 'dummy/q-split.png' },
    }),
  ];
}

/** The whole question 5 that fixture 3 is part (b) of. */
export function dummyContext(questionId: string): ContextRow[] {
  if (questionId !== 'd0000003-0000-4000-8000-000000000003') return [];
  const row = (r: Partial<ContextRow> & Pick<ContextRow, 'id' | 'ord' | 'body'>): ContextRow => ({
    display_number: null,
    number_path: null,
    options: null,
    source: null,
    is_current: false,
    is_parent: false,
    depth: 1,
    ...r,
  });
  return [
    row({
      id: 'd0000003-0000-4000-8000-0000000000ff',
      ord: 2,
      display_number: '5',
      body: '5. Read the table and answer the questions that follow.',
      is_parent: true,
      depth: 0,
      source: {
        whole_snippet_object: 'dummy/q-trees_whole.png',
        whole_snippet_members: { located: 3, members: 3, min_align: 0.95 },
      },
    }),
    row({ id: 'd0000003-0000-4000-8000-0000000000aa', ord: 3, display_number: '(a)', body: '(a) Name the district with the most trees.' }),
    row({ id: 'd0000003-0000-4000-8000-000000000003', ord: 4, display_number: '(b)', body: '(b) Find the total number of trees planted.', is_current: true }),
    row({ id: 'd0000003-0000-4000-8000-0000000000cc', ord: 5, display_number: '(c)', body: '(c) Which two districts planted the same number?' }),
  ];
}

/** An SVG "photo" of the printed lines, as a data URL. */
export function dummyPictureDataUrl(path: string): string | null {
  const lines = DUMMY_PICTURES[path];
  if (!lines) return null;
  const width = 560;
  const height = 28 + lines.length * 26;
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const text = lines
    .map((l, i) => `<text x="16" y="${34 + i * 26}" font-family="Times New Roman, serif" font-size="17" fill="#222" xml:space="preserve">${esc(l)}</text>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fbfaf6"/>${text}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
