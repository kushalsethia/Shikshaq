import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createFakeCheckerApi } from '@/dummy/checker-fake-api';

/* The owner's loophole answers, 7 Oct 2026 (20261007140000): idle papers
   come back after 7 days, a skipped question goes to the end of the paper,
   a paper with no class goes only to Class 12 verifiers. */

const sql = readFileSync(resolve(__dirname, '../../supabase/migrations/20261007140000_verifier_loophole_rules.sql'), 'utf8');

describe('20261007140000 verifier loophole rules', () => {
  it('returns papers idle for 7 days, logs it, and does not hand them straight back', () => {
    expect(sql).toMatch(/create or replace function public\.verifier_idle_days\(\)[\s\S]*select 7/);
    expect(sql).toContain("'auto_return_idle'");
    expect(sql).toContain('perform public.verifier_return_idle();');
    expect(sql).toContain("x.closed_reason like 'nothing done for %'");
  });

  it('treats an unknown class as Class 12 in the hand-out', () => {
    expect(sql).toContain('coalesce(public.class_grade(ap.class), 12) as grade');
    expect(sql).not.toContain('public.class_grade(ap.class) is not null');
  });

  it('puts skipped questions last instead of hiding them for a day', () => {
    expect(sql).toContain('sk.at nulls first');
    expect(sql).not.toContain("interval '24 hours'");
  });

  it('closes every new function to anon', () => {
    for (const f of ['verifier_idle_days()', 'verifier_return_idle()', 'distribute_unassigned_papers()', 'verifier_next_in_paper(uuid)']) {
      expect(sql).toContain(`'public.${f}'`);
    }
    expect(sql).toContain('revoke all on function %s from public, anon, authenticated');
    expect(sql).not.toMatch(/grant execute[^;]*\banon\b/);
  });
});

describe('dummy verifier: a skipped question comes back at the end of its paper', () => {
  it('serves the rest first, then the skipped ones earliest first, and keeps counting them', async () => {
    const api = createFakeCheckerApi();
    const [paper] = await api.myPapers();
    const first = await api.nextInPaper(paper.paper_id);
    expect(first).not.toBeNull();
    await api.skipQuestion(first!.id);
    const second = await api.nextInPaper(paper.paper_id);
    expect(second?.id).not.toBe(first!.id);
    // Still to do: the skipped one is not dropped from the count.
    const [after] = await api.myPapers();
    expect(after.remaining).toBe(paper.remaining);

    // Skip everything else; the first skipped must come round again first.
    const seen = new Set([first!.id]);
    let q = second;
    while (q && !seen.has(q.id)) {
      seen.add(q.id);
      await api.skipQuestion(q.id);
      q = await api.nextInPaper(paper.paper_id);
    }
    expect(q?.id).toBe(first!.id);
  });
});
