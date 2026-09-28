import { describe, expect, it } from 'vitest';

import { matchCheckerShortcut, CHECKER_SHORTCUTS } from './checker-shortcuts';

/**
 * Kid Mode's keyboard shortcuts are a class 9-12 student's main input on a
 * laptop -- a regression here silently breaks "press Enter to pass" for
 * every checker, which is easy to miss in manual testing because clicking
 * the button still works fine.
 */

describe('matchCheckerShortcut', () => {
  it('maps Enter and P to pass', () => {
    expect(matchCheckerShortcut('Enter', false)).toBe('pass');
    expect(matchCheckerShortcut('p', false)).toBe('pass');
    expect(matchCheckerShortcut('P', false)).toBe('pass');
  });

  it('maps F to fix, S to split, H to help, K to skip', () => {
    expect(matchCheckerShortcut('f', false)).toBe('fix');
    expect(matchCheckerShortcut('s', false)).toBe('split');
    expect(matchCheckerShortcut('h', false)).toBe('help');
    expect(matchCheckerShortcut('k', false)).toBe('skip');
  });

  it('returns null for an unmapped key', () => {
    expect(matchCheckerShortcut('x', false)).toBeNull();
    expect(matchCheckerShortcut('1', false)).toBeNull();
  });

  it('suppresses every shortcut while typing, so editing a body never fires an action', () => {
    for (const key of ['Enter', 'p', 'f', 's', 'h', 'k']) {
      expect(matchCheckerShortcut(key, true)).toBeNull();
    }
  });

  it('has no duplicate key bindings in the registry', () => {
    // 'enter' and 'p' both map to 'pass' by design (two keys, one action),
    // but no single KEY should ever be bound to two different actions.
    const keys = CHECKER_SHORTCUTS.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);

    const passBindings = CHECKER_SHORTCUTS.filter((s) => s.action === 'pass');
    expect(passBindings.map((b) => b.key).sort()).toEqual(['enter', 'p']);
  });
});
