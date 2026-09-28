import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  autosaveReducer,
  initialAutosave,
  hasEditsBeyondSave,
  hasUnsavedWork,
  saveStatusLabel,
  parseMarks,
  numberForSave,
  fieldsEqual,
  summarizeForVerify,
  verifyConfirmLines,
  verifyResultHeadline,
  depthMap,
  paperDetailValue,
  type AutosaveEvent,
  type AutosaveState,
} from './paper-edit';

const run = (events: AutosaveEvent[], from: AutosaveState = initialAutosave) => events.reduce(autosaveReducer, from);

describe('autosave state', () => {
  it('goes dirty, saving, saved', () => {
    const s = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'save_ok' }]);
    expect(s.status).toBe('saved');
    expect(hasUnsavedWork(s)).toBe(false);
  });

  it('stays dirty when the admin typed during the save, so one more save runs', () => {
    const s = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'edit' }, { type: 'save_ok' }]);
    expect(s.status).toBe('dirty');
    expect(hasUnsavedWork(s)).toBe(true);
  });

  it('keeps showing Saving while an edit lands mid-save', () => {
    const s = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'edit' }]);
    expect(s.status).toBe('saving');
  });

  it('a failure counts as unsaved work and keeps the message', () => {
    const s = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'save_fail', error: 'offline' }]);
    expect(s.status).toBe('failed');
    expect(s.error).toBe('offline');
    expect(hasUnsavedWork(s)).toBe(true);
  });

  it('typing again after a failure clears the error and goes dirty', () => {
    const s = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'save_fail', error: 'x' }, { type: 'edit' }]);
    expect(s.status).toBe('dirty');
    expect(s.error).toBeNull();
  });

  it('a conflict is not unsaved work: the page reloads the other version', () => {
    const s = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'conflict' }]);
    expect(s.status).toBe('conflict');
    expect(hasUnsavedWork(s)).toBe(false);
  });

  it('labels every visible state, with no em or en dashes', () => {
    for (const st of ['dirty', 'saving', 'saved', 'failed', 'conflict'] as const) {
      const label = saveStatusLabel(st);
      expect(label.length).toBeGreaterThan(0);
      expect(label).not.toMatch(/[–—]/);
    }
    expect(saveStatusLabel('idle')).toBe('');
  });

  it('still owes a save for keystrokes typed while a save was on the wire', () => {
    expect(hasEditsBeyondSave(run([{ type: 'edit' }]))).toBe(true);
    expect(hasEditsBeyondSave(run([{ type: 'edit' }, { type: 'save_start' }]))).toBe(false);
    // Status reads "saving" here, which is why an unmount cannot trust it.
    const typedDuringSave = run([{ type: 'edit' }, { type: 'save_start' }, { type: 'edit' }]);
    expect(typedDuringSave.status).toBe('saving');
    expect(hasEditsBeyondSave(typedDuringSave)).toBe(true);
    expect(hasEditsBeyondSave(run([{ type: 'edit' }, { type: 'save_start' }, { type: 'save_ok' }]))).toBe(false);
    expect(hasEditsBeyondSave(run([{ type: 'edit' }, { type: 'save_start' }, { type: 'conflict' }]))).toBe(false);
  });
});

describe('field parsing', () => {
  it('blank marks mean none printed', () => {
    expect(parseMarks('  ')).toEqual({ ok: true, value: null });
  });
  it('accepts whole and half marks', () => {
    expect(parseMarks('4')).toEqual({ ok: true, value: 4 });
    expect(parseMarks('0.5')).toEqual({ ok: true, value: 0.5 });
  });
  it('refuses negatives and words', () => {
    expect(parseMarks('-1').ok).toBe(false);
    expect(parseMarks('four').ok).toBe(false);
    expect(parseMarks('4 marks').ok).toBe(false);
  });
  it('a cleared number is null, anything else is sent exactly as typed', () => {
    expect(numberForSave('')).toBeNull();
    expect(numberForSave(' 5(ii) ')).toBe(' 5(ii) ');
  });
  it('compares all three fields', () => {
    const a = { body: 'x', display_number: '1', marks: 2 };
    expect(fieldsEqual(a, { ...a })).toBe(true);
    expect(fieldsEqual(a, { ...a, marks: null })).toBe(false);
    expect(fieldsEqual(a, { ...a, body: 'x ' })).toBe(false);
  });
});

describe('verify confirmation counts', () => {
  const rows = [
    { kind: 'master_instruction', question_passed: false, review_bucket: 'none', flag_reasons: [] },
    { kind: 'question', question_passed: true, review_bucket: 'kid', flag_reasons: [] },
    { kind: 'question', question_passed: false, review_bucket: 'kid', flag_reasons: ['marks_mismatch'] },
    { kind: 'question', question_passed: false, review_bucket: 'escalated', flag_reasons: ['ocr_fused'] },
    { kind: 'section_break', question_passed: false, review_bucket: null, flag_reasons: null },
  ];

  it('counts only question rows, the same ones Verify passes', () => {
    expect(summarizeForVerify(rows)).toEqual({ total: 3, stillFlagged: 2, escalated: 1, alreadyPassed: 1 });
  });

  it('says how many are still flagged and that edits go live', () => {
    const lines = verifyConfirmLines(summarizeForVerify(rows), { isRed: false, reason: null });
    expect(lines[0]).toBe('2 questions are still flagged, out of 3.');
    expect(lines).toContain('1 of them was sent for help.');
    expect(lines[lines.length - 1]).toBe('Your edits go live for readers straight away.');
  });

  it('uses the singular for one', () => {
    const lines = verifyConfirmLines({ total: 5, stillFlagged: 1, escalated: 0, alreadyPassed: 4 }, { isRed: false, reason: null });
    expect(lines[0]).toBe('1 question is still flagged, out of 5.');
  });

  it('says all checked when nothing is flagged', () => {
    const lines = verifyConfirmLines({ total: 4, stillFlagged: 0, escalated: 0, alreadyPassed: 4 }, { isRed: false, reason: null });
    expect(lines[0]).toBe('All 4 questions are already checked.');
  });

  it('warns when the AI marked the paper red', () => {
    const lines = verifyConfirmLines({ total: 1, stillFlagged: 0, escalated: 0, alreadyPassed: 1 }, { isRed: true, reason: 'page 3 missing' });
    expect(lines.some((l) => l.includes('red: page 3 missing'))).toBe(true);
  });

  it('never uses an em or en dash', () => {
    const lines = verifyConfirmLines({ total: 2, stillFlagged: 2, escalated: 2, alreadyPassed: 0 }, { isRed: true, reason: null });
    for (const l of lines) expect(l).not.toMatch(/[–—]/);
  });

  it('headline reflects live or not', () => {
    const base = { needs_review: false, is_published: true, reason: null, questions_total: 3, questions_newly_passed: 1 };
    expect(verifyResultHeadline({ ...base, is_live: true })).toMatch(/^Live\./);
    expect(verifyResultHeadline({ ...base, is_live: false })).toMatch(/not live/);
  });
});

describe('layout helpers', () => {
  it('nests sub-parts by parent_id', () => {
    const d = depthMap([
      { id: 'a', parent_id: null },
      { id: 'b', parent_id: 'a' },
      { id: 'c', parent_id: 'b' },
      { id: 'x', parent_id: 'missing' },
    ]);
    expect([d.get('a'), d.get('b'), d.get('c'), d.get('x')]).toEqual([0, 1, 2, 0]);
  });

  it('survives a parent cycle in bad data', () => {
    const d = depthMap([
      { id: 'a', parent_id: 'b' },
      { id: 'b', parent_id: 'a' },
    ]);
    expect(d.get('a')).toBeLessThanOrEqual(6);
  });

  it('prefills the details editor with that field only', () => {
    const p = { school: 'St X', year: null, allowed_time_minutes: 90 };
    expect(paperDetailValue(p, 'school')).toBe('St X');
    expect(paperDetailValue(p, 'year')).toBe('');
    expect(paperDetailValue(p, 'allowed_time_minutes')).toBe('90');
    expect(paperDetailValue(p, 'subject')).toBe('');
  });
});

describe('the admin paper edit migration', () => {
  /* The grant trap (CLAUDE.md): revoking from PUBLIC alone leaves Supabase's
     by-name grant to anon/authenticated in place. Pin the full lockdown for
     each function this page calls. */
  const sql = readFileSync('supabase/migrations/20260928170000_admin_paper_edit.sql', 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  const fns: [string, string][] = [
    ['admin_paper_draft', 'text'],
    ['admin_save_draft_question', 'uuid, text, text, numeric, text'],
    ['admin_verify_paper', 'text'],
  ];

  for (const [name, args] of fns) {
    it(`${name} is admin-checked, definer, and closed to anon`, () => {
      // Literal substrings, not a RegExp built from the signature: nothing to escape.
      expect(sql).toContain(`revoke all on function public.${name}(${args}) from public, anon, authenticated;`);
      expect(sql).toContain(`grant execute on function public.${name}(${args}) to authenticated;`);
      const body = sql.slice(sql.indexOf(`function public.${name}(`));
      const head = body.slice(0, body.indexOf('$function$;'));
      expect(head).toMatch(/security definer/);
      expect(head).toMatch(/set search_path to 'public'/);
      expect(head).toMatch(/if not public\.is_admin\(\) then\s+raise exception 'Not authorized' using errcode = '42501';/);
    });
  }

  it('never grants anything to anon', () => {
    expect(sql).not.toMatch(/grant[^;]*\banon\b/i);
  });

  it('never writes bank_questions directly: edits go to the draft', () => {
    expect(sql).not.toMatch(/update\s+public\.bank_questions/i);
    expect(sql).not.toMatch(/insert\s+into\s+public\.bank_questions/i);
  });

  it('refuses a stale save with 40001', () => {
    expect(sql).toMatch(/is distinct from p_body_before then\s+raise exception '[^']+' using errcode = '40001';/);
  });
});
