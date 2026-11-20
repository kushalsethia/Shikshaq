import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

/**
 * Pins the shape of 20261121100000_hod_question_context.sql (owner, 20 Nov 2026: "when a question has been sent to the
 * HOD, they should be able to see the full parts and everything"). No typecheck can see inside SQL, so these are string
 * assertions on what must never regress: read only, HOD-only, the lead-in row always returned, grants by role name.
 */
const MIGRATION = 'supabase/migrations/20261121100000_hod_question_context.sql';
const raw = readFileSync(MIGRATION, 'utf8');
const sql = raw
  .split('\n')
  .filter((l) => !l.trim().startsWith('--'))
  .join('\n');

/** The text of one function: from its create line to the next create, revoke or commit. */
function bodyOf(name: string): string {
  const start = sql.search(new RegExp(`create or replace function public\\.${name}\\(`, 'i'));
  expect(start).toBeGreaterThanOrEqual(0);
  const rest = sql.slice(start);
  const end = rest.search(/\nrevoke all on function/i);
  return end > 0 ? rest.slice(0, end) : rest;
}

describe('hod_question_context migration', () => {
  it('creates the HOD function and replaces the checker function, nothing else', () => {
    const creates = sql.match(/create (?:or replace )?function public\.\w+/gi) ?? [];
    expect(creates.map((c) => c.toLowerCase().replace(/create (?:or replace )?function /, ''))).toEqual([
      'public.hod_question_context',
      'public.checker_question_context',
    ]);
  });

  it('is read only: no insert, update, delete or DDL inside either function', () => {
    for (const name of ['hod_question_context', 'checker_question_context']) {
      const body = bodyOf(name);
      expect(body).not.toMatch(/\binsert\s+into\b/i);
      expect(body).not.toMatch(/\bupdate\s+public\./i);
      expect(body).not.toMatch(/\bdelete\s+from\b/i);
      expect(body).not.toMatch(/\balter\s+table\b/i);
    }
  });

  it('checks is_hod() inside the HOD function, before it reads anything', () => {
    const body = bodyOf('hod_question_context');
    expect(body).toMatch(/if not public\.is_hod\(\) then\s+raise exception 'Only HODs and admins can use this\.' using errcode = '42501'/i);
    expect(body.search(/is_hod\(\)/i)).toBeLessThan(body.search(/from public\.audit_questions/i));
  });

  it('keeps the checker function behind its own lease check', () => {
    expect(bodyOf('checker_question_context')).toMatch(/v_q := public\.checker_authorize_question\(p_question_id\);/);
  });

  it('always returns the top row of the group, whatever its kind, so the lead-in shows', () => {
    expect(bodyOf('hod_question_context')).toContain("(aq.kind = 'question' or aq.id = v_root)");
    expect(bodyOf('checker_question_context')).toContain("(aq.kind = 'question' or aq.id = v_root)");
  });

  it('still limits every other row to real questions on the same paper', () => {
    for (const name of ['hod_question_context', 'checker_question_context']) {
      const body = bodyOf(name);
      expect(body).toContain('aq.paper_id = v_q.paper_id');
      // The live Maths copy shape keeps its plain "kind = 'question'" filter.
      expect(body).toMatch(/and aq\.kind = 'question'/);
    }
  });

  it('is security definer with a pinned search_path, on both functions', () => {
    expect((sql.match(/security definer/gi) ?? []).length).toBe(2);
    expect((sql.match(/set search_path to 'public', 'pg_temp'/gi) ?? []).length).toBe(2);
  });

  it('revokes from public, anon and authenticated by name, then grants authenticated only', () => {
    for (const sig of ['hod_question_context', 'checker_question_context']) {
      expect(sql).toContain(`revoke all on function public.${sig}(uuid) from public, anon, authenticated;`);
      expect(sql).toContain(`grant execute on function public.${sig}(uuid) to authenticated;`);
    }
    expect(sql).not.toMatch(/grant execute on function public\.\w+\(uuid\) to (?:anon|public)/i);
  });

  it('does not return where the picture lives for the HOD copy (no source column)', () => {
    expect(bodyOf('hod_question_context')).not.toMatch(/\bsource\b/i);
  });

  it('ends with ONE check table of five lines (the SQL editor shows only the last result), each saying ok when right', () => {
    const tail = raw.slice(raw.lastIndexOf('-- Check it'));
    expect((tail.match(/then 'ok'/g) ?? []).length).toBe(5);
    expect((tail.match(/union all/gi) ?? []).length).toBe(4);
    expect((tail.match(/^select /gim) ?? []).length).toBe(5);
  });

  it('is one transaction', () => {
    expect(sql).toMatch(/^\s*begin;/m);
    expect(sql).toMatch(/^\s*commit;/m);
  });
});
