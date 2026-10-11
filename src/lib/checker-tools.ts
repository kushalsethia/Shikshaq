/**
 * The four tools under the typed words ("Fix the words", "Split into two
 * questions", "Edit a formula", "This is just the OR"). One list, so the verify
 * screen, the practice round and the help page say the same thing in the same
 * words. Pure strings, no imports: the practice round uses it.
 *
 * Owner, 11 Oct 2026: "The checker UI needs additional options to split a
 * question, edit the formulas and all that." Every tool has a one-line
 * explanation, shown on hover and focus and on the Help page.
 */

export type CheckerToolId = 'fix' | 'split' | 'formula' | 'or';

export interface CheckerTool {
  id: CheckerToolId;
  /** The button label, in words. */
  label: string;
  /** One line, shown on hover or focus. */
  hint: string;
  /** Said when the tool is pressed but does not apply to this question. */
  unavailable: string;
  /** The longer version for the Help page. */
  help: string;
}

export const CHECKER_TOOLS: CheckerTool[] = [
  {
    id: 'fix',
    label: 'Fix the words',
    hint: 'Change a letter, number or word so the typed text matches the printed paper.',
    unavailable: 'You can always fix the words.',
    help: 'Opens the text so you can change it. Fix only what is different from the printed paper: a wrong letter, a wrong number, a missing word. Leave everything else as it is.',
  },
  {
    id: 'split',
    label: 'Split into two questions',
    hint: 'Use this when the computer joined two questions into one. You tap where the second one starts.',
    unavailable: 'There are no words here to split.',
    help: 'When the printed paper shows two questions but the computer typed them as one, press this, tap just before where the second question starts, then press Split here. If the two are joined by the word OR, tap next to the OR and it is left out.',
  },
  {
    id: 'formula',
    label: 'Edit a formula',
    hint: 'Change a fraction, power or root with a keypad, and watch how it will look.',
    unavailable: 'You can always edit a formula.',
    help: 'Opens the formula keypad. If you selected some words first, those words become the formula. If the question already has formulas, it opens the one you pick. A box under the keypad shows how readers will see it. No code needed.',
  },
  {
    id: 'or',
    label: 'This is just the OR',
    hint: 'Use this when the whole row is only the word OR between two questions.',
    unavailable: 'This button is only for a row that is nothing but the word OR.',
    help: 'Some rows hold only the word OR, the choice between the question above and the one below. It is not a question. Press this and the row is set aside, and the two questions around it are kept together as an either/or pair.',
  },
];

export const TOOLS_HEADING = 'Tools';
export const TOOLS_LEAD = 'Need to change something?';
export const TOOLS_IDLE_HINT = 'Point at a tool, or tab to it, to see what it does.';

export function toolById(id: CheckerToolId): CheckerTool {
  return CHECKER_TOOLS.find((t) => t.id === id)!;
}
