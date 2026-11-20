import { describe, expect, it } from 'vitest';

import { MAX_BULK, moveAllWords, movePlan } from '@/lib/hod-bulk-assign';

/* Moving everything one checker holds to another (owner, 20 Nov 2026: "allow me to move around assignments of the
   papers"). The screen runs the existing one-paper move over these items; these are the plain rules around it. */

const held = (n: number) => Array.from({ length: n }, (_, i) => ({ paper_id: `p${i + 1}`, title: `Paper ${i + 1}` }));
describe('movePlan', () => {
  it('lists every paper in the order shown, with its label', () => {
    const plan = movePlan(held(3), (p) => p.title);
    expect(plan.items).toEqual([
      { paperId: 'p1', label: 'Paper 1' },
      { paperId: 'p2', label: 'Paper 2' },
      { paperId: 'p3', label: 'Paper 3' },
    ]);
    expect(plan.left).toBe(0);
  });

  it('moves at most one bulk run (50) and says how many are left behind', () => {
    const plan = movePlan(held(MAX_BULK + 7), (p) => p.title);
    expect(plan.items).toHaveLength(MAX_BULK);
    expect(plan.left).toBe(7);
    expect(plan.items[0].paperId).toBe('p1');
  });

  it('has nothing to move for a person who holds nothing', () => {
    expect(movePlan(held(0), (p) => p.title)).toEqual({ items: [], left: 0 });
  });
});

describe('moveAllWords', () => {
  it('names who loses the papers, who gets them, and that done work stays', () => {
    const w = moveAllWords(4, 'Asha', 'Krish', 0);
    expect(w.title).toBe('Move all 4 papers from Asha to Krish?');
    expect(w.description).toContain('Asha will no longer have them.');
    expect(w.description).toContain('Work already done on them stays.');
    expect(w.description).toContain('Krish may be refused some of them');
    expect(w.description).not.toContain('Only the first');
  });

  it('uses the singular for one paper', () => {
    const w = moveAllWords(1, 'Asha', 'you', 0);
    expect(w.title).toBe('Move the paper from Asha to you?');
    expect(w.description).toContain('Asha will no longer have it.');
  });

  it('says plainly when only the first batch moves now', () => {
    const w = moveAllWords(50, 'Asha', 'Krish', 7);
    expect(w.description).toContain('Only the first 50 move now; 7 more stay with Asha until you do it again.');
  });
});
