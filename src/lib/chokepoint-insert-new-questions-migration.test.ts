import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

/**
 * Pins the shape of 20260929150000_chokepoint_insert_new_questions.sql.
 *
 * apply_live_copy_paper_to_live() used to update existing bank_questions rows
 * and insert only split children; a passed audit question with no live row and
 * no split parent (a hidden empty paper refilled through the pipeline) was
 * never inserted, so the paper cleared needs_review but stayed empty and the
 * auto-return block never fired. The migration adds a "Pass 0" that inserts
 * those rows. No typecheck or lint rule can see inside a SQL string that is
 * `execute`d from a patched pg_get_functiondef() text, so this is a string
 * assertion, like auto-return-lease-timing-migration.test.ts.
 *
 * The rollback probes that proved the behaviour live are recorded in the
 * commit message; this test only stops the key lines being edited away.
 */

const MIGRATION = 'supabase/migrations/20260929150000_chokepoint_insert_new_questions.sql';

describe('the chokepoint insert-new-questions migration', () => {
  /* Comments stripped so prose (the header names every column and action)
     can never be mistaken for the SQL itself. */
  const sql = readFileSync(MIGRATION, 'utf8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  it('patches the live definition in place and refuses to apply if the anchor is gone', () => {
    expect(sql).toMatch(/pg_get_functiondef\('public\.apply_live_copy_paper_to_live\(uuid\)'::regprocedure\)/);
    expect(sql).toMatch(/raise exception 'apply_live_copy_paper_to_live: pass 1 anchor not found'/);
    expect(sql).toMatch(/replace\(d, v_anchor, v_pass0 \|\| v_anchor\)/);
  });

  it('runs before the split pass, so a split child of a new parent can be placed', () => {
    // The new block is spliced in front of the Pass 1 header.
    expect(sql).toContain('Pass 1: split halves that have no live row yet (fix #3)');
    expect(sql).toMatch(/v_pass0 \|\| v_anchor/);
  });

  it('selects exactly the passed, unlinked, unsplit question rows in audit order', () => {
    expect(sql).toMatch(/and kind = 'question'\s+and question_passed = true\s+and live_bank_question_id is null\s+and split_from_id is null\s+order by ord, id/);
  });

  it('copies the body byte-exact, never trimmed or normalised', () => {
    expect(sql).toMatch(/v_q\.body, v_q\.marks, v_q\.chapter, v_q\.answer_key/);
    expect(sql).not.toMatch(/\b(btrim|trim|ltrim|rtrim|lower|upper|regexp_replace|translate)\s*\(\s*v_q\.body/i);
    expect(sql).not.toMatch(/replace\s*\(\s*v_q\.body/i);
  });

  it('derives the id from the audit row uuid, like the split branch, and is idempotent', () => {
    expect(sql).toMatch(/v_new_live_id := v_live_paper_id \|\| '-n-' \|\| left\(replace\(v_q\.id::text, '-', ''\), 12\)/);
    expect(sql).toMatch(/if exists \(select 1 from public\.bank_questions where id = v_new_live_id and paper_id = v_live_paper_id\)/);
  });

  it('places the row after the nearest preceding live row, or first, with the two-step ord shift', () => {
    expect(sql).toMatch(/and a\.ord < v_q\.ord\s+order by a\.ord desc\s+limit 1/);
    expect(sql).toMatch(/v_anchor_ord := coalesce\(v_anchor_ord, -1\)/);
    expect(sql).toMatch(/set ord = -\(ord \+ 1\)\s+where paper_id = v_live_paper_id and ord > v_anchor_ord/);
    expect(sql).toMatch(/set ord = -ord\s+where paper_id = v_live_paper_id and ord < 0/);
    expect(sql).toMatch(/v_live_paper_id, v_anchor_ord \+ 1/);
  });

  it('records the new id on the audit row and logs each insert as live_apply', () => {
    expect(sql).toMatch(/update public\.audit_questions set live_bank_question_id = v_new_live_id where id = v_q\.id/);
    expect(sql).toMatch(/values \('bank_questions', v_new_live_id, 'live_apply', null, null, v_new_row/);
  });

  it('resyncs question_count when it inserted anything, because public reads filter on it', () => {
    expect(sql).toMatch(/if v_inserted > 0 then/);
    expect(sql).toMatch(/update public\.bank_papers set question_count = v_qc_after where id = v_live_paper_id/);
    expect(sql).toMatch(/'live_apply', 'question_count'/);
  });

  it('leaves marks alone', () => {
    expect(sql).not.toMatch(/update public\.bank_papers set marks/);
  });

  it('restates EXECUTE revoked from public, anon and authenticated, and grants nothing', () => {
    expect(sql).toMatch(
      /revoke all on function public\.apply_live_copy_paper_to_live\(uuid\) from public, anon, authenticated;/,
    );
    expect(sql).not.toMatch(/grant execute on function public\.apply_live_copy_paper_to_live/i);
  });
});
