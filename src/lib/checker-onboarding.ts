/**
 * Everything a new student checker needs to get started, in one place with
 * no network and no Supabase: the routes, the once-per-account flag for the
 * walkthrough, the walkthrough steps, and the rules in plain words.
 *
 * The rules text quotes the live copy (FIX_RULE_NOTE, TYPO_RULE_NOTE,
 * TYPO_CHECKBOX_LABEL) rather than restating it, so the help page cannot
 * drift from what the Fix screen tells a checker.
 */

import { FIX_RULE_NOTE } from '@/lib/checker-body';
import { TYPO_CHECKBOX_LABEL, TYPO_RULE_NOTE } from '@/lib/checker-save';
import { CHECKER_SHORTCUTS, type CheckerAction } from '@/lib/checker-shortcuts';

export const CHECKER_PATH = '/checker';
export const CHECKER_PRACTICE_PATH = '/checker/practice';
export const CHECKER_HELP_PATH = '/checker/help';
/** `/checker?tour=1` replays the walkthrough. */
export const CHECKER_TOUR_PARAM = 'tour';

/* ---- once per account, per browser ------------------------------------ */

const SEEN_PREFIX = 'shikshaq:checker-walkthrough:v1:';

function seenKey(userId: string): string {
  return `${SEEN_PREFIX}${userId}`;
}

/** True when this account has already been shown (or skipped) the walkthrough
 *  in this browser. Storage unavailable counts as seen: never nag on every
 *  load, and never block the page. */
export function hasSeenWalkthrough(userId: string): boolean {
  try {
    return window.localStorage.getItem(seenKey(userId)) === '1';
  } catch {
    return true;
  }
}

export function markWalkthroughSeen(userId: string): void {
  try {
    window.localStorage.setItem(seenKey(userId), '1');
  } catch {
    // Nothing to persist; closing the walkthrough still works.
  }
}

/* ---- walkthrough steps ------------------------------------------------- */

export interface WalkthroughStep {
  /** Matches `data-tour="..."` on the real element in Checker.tsx. */
  target: 'paper' | 'picture' | 'question' | 'pass' | 'fix' | 'help' | 'skip';
  title: string;
  body: string;
}

/** The labels in these steps are the live button labels on the checker. */
export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    target: 'paper',
    title: 'This is your paper',
    body: 'You get one paper at a time. The bar shows how far through it you are. When it is finished the next paper comes by itself.',
  },
  {
    target: 'picture',
    title: 'This is the printed page',
    body: 'It is the picture of the real paper. It is always right. Your job is to make the typed words match it.',
  },
  {
    target: 'question',
    title: 'This is what the computer typed',
    body: 'Read it against the picture, slowly. Look at the words, the numbers and the marks.',
  },
  {
    target: 'pass',
    title: 'Looks right',
    body: 'Press this when the typed words match the picture exactly. Most questions are like this.',
  },
  {
    target: 'fix',
    title: 'Fix it',
    body: 'Press this only when something differs from the picture: a wrong number, a missing word, wrong marks. Change just that, nothing else.',
  },
  {
    target: 'help',
    title: 'Ask the HOD',
    body: 'Not sure? Press this instead of guessing. Your HOD will look at it, and you carry on with the rest of your paper.',
  },
  {
    target: 'skip',
    title: 'Skip this question',
    body: 'Press this to skip the question for now. It will come back to you after a day, and you currently move to the next question.',
  },
];

/* ---- the rules, in plain words ---------------------------------------- */

export interface CheckerRule {
  title: string;
  body: string;
}

export const CHECKER_RULES: CheckerRule[] = [
  {
    title: 'The printed page is always right',
    body: 'Fix only what is different from the picture of the printed page. If the typed words already match it, press Looks right.',
  },
  {
    title: 'Never retype or improve the words',
    body: `${FIX_RULE_NOTE} If the paper itself says it that way, so do we.`,
  },
  {
    title: 'If the paper has a typo',
    body: `Normally leave it as printed. If it is a misprinted letter, number or symbol, open Fix it and tick "${TYPO_CHECKBOX_LABEL}". ${TYPO_RULE_NOTE}`,
  },
  {
    title: 'Not sure? Ask the HOD, do not guess',
    body: 'A wrong guess is worse than a question. If the words are scrambled, there are no words, or the picture shows a different question, press Ask the HOD.',
  },
  {
    title: 'If you cannot read the picture, skip it',
    body: 'Press Skip this question, or Hand this paper back if the whole paper is unreadable. Never fill in words you cannot see.',
  },
  {
    title: 'Two questions in one box',
    body: 'If the typed text is really two questions joined together, and you are offered Split here, tap where the second one starts and press Split here.',
  },
];

/* ---- the shortcut table, read from checker-shortcuts.ts ---------------- */

export const ACTION_LABELS: Record<CheckerAction, string> = {
  pass: 'Looks right',
  fix: 'Fix it',
  split: 'Split here',
  help: 'Ask the HOD',
  skip: 'Skip this question',
};

/** One row per action, in the order the shortcuts file lists them, with the
 *  key text exactly as the checker's own hint shows it. */
export function shortcutRows(): { action: CheckerAction; label: string; keys: string }[] {
  const seen = new Set<CheckerAction>();
  const rows: { action: CheckerAction; label: string; keys: string }[] = [];
  for (const s of CHECKER_SHORTCUTS) {
    if (seen.has(s.action)) continue;
    seen.add(s.action);
    rows.push({ action: s.action, label: ACTION_LABELS[s.action], keys: s.keys });
  }
  return rows;
}

/* ---- the admin guide on /admin/checkers -------------------------------- */

export function addStudentSteps(origin: string): string[] {
  return [
    'The student signs up on the Shikshaq site with their own email address.',
    'Type that same email in the search box below. Their name appears. Press Add.',
    `Send them the link to ${origin}${CHECKER_PATH}. The first time they open it, a short walkthrough shows them around, and there is a practice round they can try.`,
  ];
}

export const NO_ACCOUNT_EXPLAINED =
  'If it says no account has that email, either the student has not signed up yet, or they signed up with a different email than the one you typed. Ask them which email they used.';

/* ---- the HODs section on /admin/checkers ------------------------------- */

export const HOD_PATH = '/hod';

export function addHodSteps(origin: string): string[] {
  return [
    'The person signs up on the Shikshaq site with their own email address, the same way a student does.',
    'Search for them below by name or email and press Make HOD. One HOD leads every verifier.',
    `Send them the link to ${origin}${HOD_PATH}. It shows the questions verifiers sent up, how each verifier is doing, and who holds which paper.`,
  ];
}

export const HOD_NOTE =
  'An HOD does not need to be a checker. Removing an HOD only takes away the HOD view; their earlier decisions stay. Admins can always open the HOD view.';
