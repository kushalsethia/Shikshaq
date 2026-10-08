import { describe, expect, it } from 'vitest';
import {
  barPosition,
  buildTrustGrid,
  checksNeeded,
  DECISION_HINT,
  DECISION_LABEL,
  formatRate,
  normaliseTrustRows,
  switchState,
  TRUST_EXPLAINER,
  trustExplainer,
  trustStatus,
} from '@/lib/ai-trust';

const base = { min_rate: 0.97, min_checked: 100, spot_check_every: 20 };

describe('AI trust formatting', () => {
  it('formats a rate as a percentage with at most one decimal', () => {
    expect(formatRate(0.9776)).toBe('97.8%');
    expect(formatRate(1)).toBe('100%');
    expect(formatRate(0.97)).toBe('97%');
    expect(formatRate(0)).toBe('0%');
    expect(formatRate(null)).toBe('No checks yet');
  });

  it('says how many checks are still needed, and when there are enough', () => {
    expect(checksNeeded({ checked: 60, min_checked: 100 })).toBe('60 of 100 checks needed');
    expect(checksNeeded({ checked: 250, min_checked: 100 })).toBe('250 checks done (100 needed)');
  });

  it('places the fill and the bar on a 0 to 100 track', () => {
    expect(barPosition({ rate: 0.91, min_rate: 0.97 })).toEqual({ fill: 91, bar: 97 });
    expect(barPosition({ rate: null, min_rate: 0.97 })).toEqual({ fill: 0, bar: 97 });
  });

  it('words the status chip for all three states', () => {
    expect(trustStatus({ trusted: false, auto_off_at: null, auto_off_reason: null, spot_check_every: 20 })).toEqual({
      kind: 'people',
      label: 'Checked by people',
    });
    expect(trustStatus({ trusted: true, auto_off_at: null, auto_off_reason: null, spot_check_every: 20 })).toEqual({
      kind: 'trusted',
      label: 'Trusted, 1 in 20 still checked',
    });
    expect(trustStatus({ trusted: false, auto_off_at: '2026-10-07T00:00:00Z', auto_off_reason: 'it fell to 91%', spot_check_every: 20 })).toEqual({
      kind: 'auto_off',
      label: 'Switched off automatically: it fell to 91%',
    });
  });

  it('the admin button is disabled with the reason until the level is eligible', () => {
    const notYet = switchState({ trusted: false, eligible: false, checked: 60, rate: 0.93, ...base });
    expect(notYet.disabled).toBe(true);
    expect(notYet.action).toBe('trust');
    expect(notYet.reason).toBe('Not earned yet: needs 100 checks at 97% agreed. It has 60 checks at 93% agreed.');
    expect(switchState({ trusted: false, eligible: true, checked: 300, rate: 0.98, ...base })).toMatchObject({ action: 'trust', disabled: false, reason: null });
    expect(switchState({ trusted: true, eligible: false, checked: 300, rate: 0.9, ...base })).toMatchObject({ action: 'stop', disabled: false });
  });

  it('with no checks at all the reason does not say "0 checks at No checks yet"', () => {
    const none = switchState({ trusted: false, eligible: false, checked: 0, rate: null, ...base });
    expect(none.reason).toBe('Not earned yet: needs 100 checks at 97% agreed. No checks yet.');
    expect(none.reason).not.toMatch(/\b0 checks at/);
  });

  it('builds the reason from the row, so a changed bar changes the words', () => {
    const r = switchState({ trusted: false, eligible: false, checked: 0, rate: null, min_rate: 0.95, min_checked: 150 });
    expect(r.reason).toBe('Not earned yet: needs 150 checks at 95% agreed. No checks yet.');
  });

  it('explains the rule in plain words with no dashes', () => {
    expect(TRUST_EXPLAINER).toContain('97%');
    expect(TRUST_EXPLAINER).toContain('at least 100 checks');
    expect(TRUST_EXPLAINER).not.toContain('200');
    expect(TRUST_EXPLAINER).toContain('probably has an issue');
    expect(TRUST_EXPLAINER).not.toMatch(/[–—]/);
  });

  it('the explainer follows the bar it is given', () => {
    expect(trustExplainer(250, 0.98, 10)).toContain('98% over at least 250 checks');
    expect(trustExplainer(250, 0.98, 10)).toContain('1 in 10');
  });

  it('says what each kind of AI decision means, in plain words', () => {
    expect(DECISION_LABEL.pass).toBe('AI said it was right');
    expect(DECISION_LABEL.fix).toBe('AI fixed it');
    expect(DECISION_HINT.pass).toBe('The AI kept the question as read.');
    expect(DECISION_HINT.fix).toBe('The AI corrected the words, number or marks, usually a scanning misread.');
    expect(TRUST_EXPLAINER).toContain('"AI fixed it" means');
    for (const text of [...Object.values(DECISION_LABEL), ...Object.values(DECISION_HINT)]) expect(text).not.toMatch(/[–—]/);
    expect(JSON.stringify(DECISION_LABEL)).not.toContain('changed the words');
  });

  it('falls back to the bar of 100 checks when a row does not carry one', () => {
    const [row] = normaliseTrustRows([{ level: 'high', decision: 'pass', subject: null, checked: 3 }]);
    expect(row.min_checked).toBe(100);
  });
});

describe('AI trust grid', () => {
  const rows = normaliseTrustRows([
    { level: 'high', decision: 'pass', subject: null, checked: 312, as_is: 305, rate: '0.9776', waiting: 5, trusted: false, eligible: true, ...base },
    { level: 'high', decision: 'pass', subject: 'Physics', checked: 30, as_is: 29, rate: 0.9667, waiting: 1, ...base },
    { level: 'high', decision: 'pass', subject: 'Mathematics', checked: 180, as_is: 176, rate: 0.9778, waiting: 4, ...base },
    { level: 'low', decision: 'fix', subject: null, checked: 10, as_is: 4, rate: 0.4, waiting: 0, ...base },
    { level: 'bogus', decision: 'pass', subject: null },
  ]);

  it('drops an unknown level and reads numbers from strings', () => {
    expect(rows).toHaveLength(4);
    expect(rows[0].rate).toBeCloseTo(0.9776);
    expect(rows[0].eligible).toBe(true);
  });

  it('builds 3 levels by 2 decisions, with subjects most checked first', () => {
    const grid = buildTrustGrid(rows);
    expect(grid).toHaveLength(3);
    expect(grid.every((line) => line.length === 2)).toBe(true);
    const highPass = grid[0][0];
    expect(highPass.level).toBe('high');
    expect(highPass.decision).toBe('pass');
    expect(highPass.total?.checked).toBe(312);
    expect(highPass.subjects.map((s) => s.subject)).toEqual(['Mathematics', 'Physics']);
    expect(grid[0][1].total).toBeNull();
    expect(grid[2][1].total?.checked).toBe(10);
  });
});
