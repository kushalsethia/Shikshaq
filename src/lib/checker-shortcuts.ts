/**
 * Keyboard shortcuts for the paper-checker (Kid Mode) screen. Ported from
 * the standalone auditor's `shortcuts.ts` / `lib/useShortcuts.ts`
 * (UnlimitedOCR/auditor/web/src), trimmed to the four actions Kid Mode
 * actually has: Looks right / Fix it / Split / Ask for help. Kept as pure
 * functions (no DOM/React here) so they can be unit tested directly --
 * `matchCheckerShortcut` is the one thing a test needs to call.
 */

export type CheckerAction = 'pass' | 'fix' | 'split' | 'help' | 'skip';

export interface CheckerShortcutDef {
  action: CheckerAction;
  keys: string; // display form, shown in the small hint under the buttons
  key: string; // KeyboardEvent.key, lowercased
}

export const CHECKER_SHORTCUTS: CheckerShortcutDef[] = [
  { action: 'pass', keys: 'Enter / P', key: 'enter' },
  { action: 'pass', keys: 'Enter / P', key: 'p' },
  { action: 'fix', keys: 'F', key: 'f' },
  { action: 'split', keys: 'S', key: 's' },
  { action: 'help', keys: 'H', key: 'h' },
  { action: 'skip', keys: 'K', key: 'k' },
];

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

/**
 * Pure matcher: given a lowercased key and whether focus is currently in a
 * typing target, returns the action to run, or null. No modifier keys are
 * used (deliberately -- these are one-handed, one-key presses for a class
 * 9-12 student on a phone or laptop, matching the prototype's plain-letter
 * bindings), which is exactly why shortcuts must be suppressed while typing
 * in the Fix/Split text areas -- otherwise typing the letter "f" while
 * editing a question body would fire "Fix it" on every keystroke.
 */
export function matchCheckerShortcut(key: string, isTyping: boolean): CheckerAction | null {
  if (isTyping) return null;
  const lower = key.toLowerCase();
  const hit = CHECKER_SHORTCUTS.find((s) => s.key === lower);
  return hit ? hit.action : null;
}

/** Real DOM entry point: wraps matchCheckerShortcut with the actual event's
 * typing-target check, mirroring lib/useShortcuts.ts's isTypingTarget. */
export function matchCheckerKeyboardEvent(e: KeyboardEvent): CheckerAction | null {
  return matchCheckerShortcut(e.key, isTypingTarget(e.target));
}
