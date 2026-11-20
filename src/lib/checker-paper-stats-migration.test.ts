import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createFakeCheckerApi } from '@/dummy/checker-fake-api';

/* 20261120100000_checker_my_paper_stats.sql cannot run in CI (no database), so its load-bearing lines
   are pinned here: it is a NEW read-only definer function (checker_my_stats is not touched, so the old
   screen works whether the file is applied before or after the website), behind is_paper_checker(),
   counts distinct papers of THIS checker whose assignment is closed as done, uses the Kolkata day, and
   is closed to public, anon AND authenticated before being granted to authenticated only.
   The demo's fake gives the same two numbers. */

const raw = readFileSync('supabase/migrations/20261120100000_checker_my_paper_stats.sql', 'utf8');
const sql = raw
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

const start = sql.indexOf('create or replace function public.checker_my_paper_stats(');
const fn = sql.slice(start, sql.indexOf('$$;', sql.indexOf('as $$', start)));

describe('checker_my_paper_stats (migration text)', () => {
  it('is a new function with a fixed shape, a gate and a pinned search path', () => {
    expect(start).toBeGreaterThan(-1);
    expect(fn).toContain('returns table (papers_today bigint, papers_total bigint)');
    expect(fn).toContain('security definer');
    expect(fn).toContain('set search_path = public, pg_temp');
    expect(fn).toContain('if not public.is_paper_checker() then');
    expect(fn).toContain("errcode = '42501'");
  });

  it('counts distinct papers (a paper handed twice counts once) of this checker, closed as done', () => {
    expect(fn).toContain('count(distinct a.audit_paper_id)');
    expect(fn).not.toMatch(/count\(\*\)/);
    expect(fn).toContain('from public.checker_assignments a');
    expect(fn).toContain('a.user_id = auth.uid()');
    expect(fn).toContain("a.status = 'done'");
  });

  it('uses the Kolkata day and the closing time for "today"', () => {
    expect(fn).toContain("'Asia/Kolkata'");
    expect(fn).toContain('a.closed_at >= v_today');
  });

  it('writes nothing and leaves the question counter alone', () => {
    expect(fn).not.toMatch(/\b(insert|update|delete)\b/i);
    expect(sql).not.toContain('checker_my_stats(');
  });

  it('is closed to everyone, then opened to signed-in users only', () => {
    expect(sql).toContain('revoke all on function public.checker_my_paper_stats() from public, anon, authenticated;');
    expect(sql).toContain('grant execute on function public.checker_my_paper_stats() to authenticated;');
    expect(sql).not.toMatch(/grant execute on function public\.checker_my_paper_stats\(\) to (anon|public)/);
  });
});

describe('the demo gives the papers numbers too', () => {
  it('starts with a total and none today, and one answer mid-paper does not finish a paper', async () => {
    const api = createFakeCheckerApi();
    expect(await api.myPaperStats()).toEqual({ papers_today: 0, papers_total: 12 });
    const first = await api.nextQuestion();
    await api.passQuestion(first!.id);
    const after = await api.myPaperStats();
    expect(after.papers_today).toBe(0);
    expect(after.papers_total).toBe(12);
  });
});
