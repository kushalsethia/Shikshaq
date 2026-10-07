import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() } },
}));

import { createFakeCheckerApi } from '@/dummy/checker-fake-api';
import { classGrade, pickBlock, type HodVerifierProfile } from '@/lib/hod-api';

describe('classGrade reads a class like public.class_grade (20261007160000)', () => {
  it.each([
    ['X', 10],
    ['XII', 12],
    ['10', 10],
    ['10th', 10],
    ['GRADE X', 10],
    ['GRADE-X', 10],
    ['Class X', 10],
    ['class 10', 10],
    ['Std 9', 9],
    ['Grade XII', 12],
    ['ix', 9],
    ['Class-XI', 11],
    ['1st', 1],
    ['13', null],
    ['0', null],
    ['unknown', null],
    ['', null],
    [null, null],
  ])('%s -> %s', (cls, want) => {
    expect(classGrade(cls as string | null)).toBe(want);
  });
});

describe('pickBlock: what the HOD cannot pick, before pressing', () => {
  const prof = (over: Partial<HodVerifierProfile>): HodVerifierProfile => ({
    user_id: 'u',
    email: null,
    name: null,
    active: true,
    full_name: 'V',
    grade: 10,
    school: 'S',
    board: 'ICSE',
    valid_until: '2027-03-31',
    expired: false,
    missing: false,
    preferred_subjects: [],
    requested_subjects: [],
    requested_at: null,
    ...over,
  });
  it('allows a paper at or below the grade, and an unknown class (the HOD decides)', () => {
    expect(pickBlock(prof({}), 'X')).toBeNull();
    expect(pickBlock(prof({}), 'IX')).toBeNull();
    expect(pickBlock(prof({}), 'unknown')).toBeNull();
  });
  it('blocks above the grade, no profile, missing grade, expired', () => {
    expect(pickBlock(prof({}), 'XII')).toBe('paper above their class');
    expect(pickBlock(undefined, 'X')).toBe('no grade yet');
    expect(pickBlock(prof({ grade: null }), 'X')).toBe('no grade yet');
    expect(pickBlock(prof({ missing: true }), 'X')).toBe('no grade yet');
    expect(pickBlock(prof({ expired: true }), 'X')).toBe('details expired');
  });
});

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

const read = (f: string) => readFileSync(resolve(__dirname, `../../supabase/migrations/${f}`), 'utf8');

describe('7 Oct edge-case fixes', () => {
  it('150000: idle return and the cap only count papers with work left; inactive verifiers lose papers at once', () => {
    const s = read('20261007150000_verifier_waiting_on_hod.sql');
    expect(s).toContain('and public.verifier_has_work(a.audit_paper_id)');
    expect(s).toContain("'auto_return_inactive'");
    expect(s).toContain('not exists (select 1 from public.paper_checkers pc where pc.user_id = a.user_id and pc.active)');
  });
  it('160000: class_grade upper-cases before stripping', () => {
    expect(read('20261007160000_class_grade_case.sql')).toContain("regexp_replace(upper(coalesce(p_class, ''))");
  });
  it('170000: subjects fold into families and unknown subjects are refused', () => {
    const s = read('20261007170000_subject_family.sql');
    expect(s).toContain("when s like '%english%' or s like '%literature%' then 'english'");
    expect(s).toContain("raise exception 'No papers in %.");
    expect(s).toContain('v := public.clean_subject_list(p_subjects);');
  });
  it('180000: preferred subjects go first and beat the even-load band, and the patch refuses to half-apply', () => {
    const s = read('20261007180000_preferred_subjects_first.sql');
    expect(s).toContain("raise exception 'patch did not apply'");
    expect(s).toContain('_dist_papers dp order by (exists');
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
