import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  changesFrom,
  isReady,
  normalisePaperHistory,
  normaliseQuestionHistory,
  normaliseQueueRow,
  normaliseReview,
  questionState,
  versionChanges,
  versionFrom,
  writeErrorWords,
  changesFromDraft,
} from './admin-approval-shape';
import { HistoryList } from '@/components/admin/approval/HistoryPanel';
import { HeldQuestionCard } from '@/components/papers/held-question-card';
import { createFakeApprovalApi, FIXTURE_NOW, FIXTURE_PAPER_ID } from '@/dummy/approval-fake-api';

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');

describe('approval RPC shapes are absorbed', () => {
  it('reads a queue row under the contract names and near-synonyms', () => {
    const a = normaliseQueueRow({
      audit_paper_id: 'p1',
      board: 'ICSE',
      cls: '10',
      subject: 'Physics',
      year: '2026',
      questions_total: 10,
      passed: 8,
      open: 1,
      set_aside: 1,
      ai_summary: { pass: 7, fix: 1, student: 2 },
      kind: 'retro',
      live_bank_paper_id: 'abc123',
    });
    expect(a.title).toBe('ICSE Class 10 Physics, 2026');
    expect(a.kind).toBe('retro');
    expect(isReady(a)).toBe(false);
    const b = normaliseQueueRow({ id: 'p2', total_questions: '4', passed_questions: 4, open_questions: 0 });
    expect(b.audit_paper_id).toBe('p2');
    expect(b.questions_total).toBe(4);
    expect(b.kind).toBe('new');
    expect(isReady(b)).toBe(true);
  });

  it('maps question status to passed / open / set aside', () => {
    expect(questionState('passed')).toBe('passed');
    expect(questionState('pending', true)).toBe('passed');
    expect(questionState('set_aside')).toBe('set_aside');
    expect(questionState('rejected')).toBe('set_aside');
    expect(questionState('flagged')).toBe('open');
    expect(questionState(null)).toBe('open');
  });

  it('reads a review payload, sorting by ord and counting open rows', () => {
    const r = normaliseReview({
      paper: { audit_paper_id: 'p', board: 'CBSE' },
      rows: [
        { id: 'b', ord: 2, kind: 'question', body: 'two', status: 'pending', options: ['x', { label: 'b', text: 'y' }] },
        { id: 'a', ord: 1, kind: 'question', body: 'one', status: 'passed', version: 3 },
      ],
    });
    expect(r.rows.map((x) => x.id)).toEqual(['a', 'b']);
    expect(r.open_count).toBe(1);
    expect(r.rows[0].version).toBe(3);
    expect(r.rows[1].options).toEqual([{ label: null, text: 'x' }, { label: 'b', text: 'y' }]);
  });

  it('reads admin_paper_review exactly as 20261003100000 returns it', () => {
    const r = normaliseReview({
      paper: {
        audit_paper_id: 'p', title: 'T', board: 'ICSE', class: '10', subject: 'Physics', exam_type: 'Pre-board',
        instructions: 'Answer all.', approval_state: 'awaiting', kind: 'retro', live_bank_paper_id: 'b1', is_live: true,
        approval_note: null,
      },
      counts: { total: 2, passed: 1, open: 1, set_aside: 0 },
      open: 1,
      pages: [{ page: 1, object_path: 'x' }],
      rows: [
        { id: 's', ord: 0, kind: 'section_break', body: 'Section A', state: 'section' },
        { id: 'a', ord: 1, kind: 'question', body: 'one', state: 'passed', figure: { path: 'f/1.webp' }, figure_path: 'f/1.webp', version: 2 },
        { id: 'b', ord: 2, kind: 'question', body: 'two', state: 'open', status: 'passed', set_aside_reason: null },
      ],
    });
    expect(r.paper.cls).toBe('10');
    expect(r.paper.exam).toBe('Pre-board');
    expect(r.paper.general_instructions).toBe('Answer all.');
    expect(r.paper.approval).toBe('pending');
    expect(r.paper.is_published).toBe(true);
    expect(r.open_count).toBe(1);
    expect(r.rows[1].figure).toBe('f/1.webp');
    expect(r.rows[2].state).toBe('open');
  });

  it('turns audit_review_log before/after objects into field changes', () => {
    expect(
      changesFrom({ before: { body: 'a', marks: 2, display_number: '1' }, after: { body: 'b', marks: 2, display_number: '1' } }),
    ).toEqual([{ field: 'body', before: 'a', after: 'b' }]);
    expect(changesFrom({ field: 'review_bucket', before: 'kid', after: 'escalated' })).toEqual([
      { field: 'review_bucket', before: 'kid', after: 'escalated' },
    ]);
    expect(changesFrom({ changes: [{ field: 'marks', before: 1, after: 2 }] })).toEqual([{ field: 'marks', before: 1, after: 2 }]);
  });

  it('reads histories newest first and versions oldest first', () => {
    const h = normaliseQuestionHistory({
      versions: [{ version: 2, snapshot: { body: 'b' }, created_at: '2026-10-02T02:00:00Z' }, { version: 1, body: 'a', created_at: '2026-10-02T01:00:00Z' }],
      events: [{ at: '2026-10-02T01:00:00Z', action: 'x' }, { at: '2026-10-02T03:00:00Z', action: 'y', actor_kind: 'checker' }],
      checks: [{ checker_kind: 'sonnet', verdict: 'pass', confidence: 0.9 }],
    });
    expect(h.versions.map((v) => v.version)).toEqual([1, 2]);
    expect(h.versions[1].body).toBe('b');
    expect(h.events[0].action).toBe('y');
    expect(h.events[0].actor_kind).toBe('student');
    expect(versionChanges(h.versions[0], h.versions[1])).toEqual([{ field: 'body', before: 'a', after: 'b' }]);
    expect(normalisePaperHistory({ events: [{ at: '1', action: 'a' }] })).toHaveLength(1);
  });

  it('reads a version number from any return shape', () => {
    expect(versionFrom(4)).toBe(4);
    expect(versionFrom('5')).toBe(5);
    expect(versionFrom({ version: 6 })).toBe(6);
    expect(versionFrom([{ new_version: 7 }])).toBe(7);
    expect(versionFrom(null)).toBeNull();
  });

  it('explains a failed write in words', () => {
    expect(writeErrorWords({ code: '42501', message: 'Not authorized' }, 'x')).toMatch(/not allowed/);
    expect(writeErrorWords({ message: 'paper has open questions' }, 'x')).toMatch(/still open/);
    expect(writeErrorWords({ message: 'stale version 3' }, 'x')).toMatch(/Someone else changed/);
    expect(writeErrorWords(new Error('boom'), 'fallback')).toBe('fallback');
    expect(writeErrorWords({ code: '55000', message: 'This paper is already off the site' }, 'x')).toBe(
      'This paper is already off the site.',
    );
    expect(writeErrorWords({ code: '55000', message: 'bad live_bank_question_id' }, 'fallback')).toBe('fallback');
    expect(writeErrorWords({ code: '40001', message: 'could not serialize' }, 'x')).toMatch(/Someone else changed/);
    expect(writeErrorWords({ code: '22023', message: 'These fields cannot be edited here: kind' }, 'x')).toMatch(
      /Only the question text/,
    );
    expect(writeErrorWords({ code: '22023', message: 'Say why the question is set aside' }, 'x')).toBe(
      'Say why the question is set aside.',
    );
  });
});

describe('the inline editor sends only what changed', () => {
  const row = normaliseReview({ rows: [{ id: 'q', body: 'Find x.', marks: 2, display_number: '3', options: [] }] }).rows[0];
  it('sends nothing when nothing changed', () => {
    expect(changesFromDraft(row, { body: 'Find x.', number: '3', marks: '2', options: [] })).toEqual({});
  });
  it('sends only the changed fields, and refuses marks that are not a number', () => {
    expect(changesFromDraft(row, { body: 'Find y.', number: '3', marks: '3', options: [] })).toEqual({ body: 'Find y.', marks: 3 });
    expect(changesFromDraft(row, { body: 'Find x.', number: '', marks: '', options: [] })).toEqual({ display_number: null, marks: null });
    expect(changesFromDraft(row, { body: 'Find x.', number: '3', marks: 'two', options: [] })).toBe('bad-marks');
  });
});

describe('rendered history reads like people', () => {
  it('the fixture paper history renders sentences with names, never codes', async () => {
    const api = createFakeApprovalApi(0);
    const events = await api.paperHistory(FIXTURE_PAPER_ID);
    const html = renderToStaticMarkup(<HistoryList events={events} now={FIXTURE_NOW} />);
    const t = text(html);
    expect(t).toContain('Priya Sharma changed the marks on question 2');
    expect(t).toContain('Rahul Das (student checker) fixed a reading mistake in the question text on question 2');
    expect(t).toContain('AI check (Sonnet) passed question 2, confidence 92%');
    expect(t).toContain('Pipeline (automatic) put the paper in the approval queue');
    expect(t).not.toMatch(UUID);
    expect(t).not.toMatch(/\b[a-z]+_[a-z_]+\b/);
    expect(t).not.toMatch(/\bai:/);
    expect(t).not.toContain('{');
  });

  it('an approval writes a new history line with the admin\'s name', async () => {
    const api = createFakeApprovalApi(0);
    const queue = await api.queue();
    const ready = queue.find((q) => q.open === 0 && q.kind === 'new');
    expect(ready).toBeTruthy();
    await api.approve(ready!.audit_paper_id, 'Read it end to end');
    const events = await api.paperHistory(ready!.audit_paper_id);
    const t = text(renderToStaticMarkup(<HistoryList events={events} now={FIXTURE_NOW} />));
    expect(t).toContain('Arjun Mehta approved the paper for launch');
    expect(t).toContain('Read it end to end');
    await expect(api.approve(FIXTURE_PAPER_ID, '')).rejects.toBeTruthy();
  });

  it('an edit then a restore are both versions, both named', async () => {
    const api = createFakeApprovalApi(0);
    const review = await api.review(FIXTURE_PAPER_ID);
    const q = review.rows.find((r) => r.display_number === '5')!;
    const v2 = await api.editQuestion(q.id, q.version, { marks: 6 }, '');
    expect(v2).toBe(2);
    const v3 = await api.revertQuestion(q.id, 1, 'Paper says 5');
    expect(v3).toBe(3);
    const h = await api.questionHistory(q.id);
    expect(h.versions.map((v) => v.version)).toEqual([1, 2, 3]);
    expect(h.versions[2].marks).toBe(5);
    await expect(api.editQuestion(q.id, 1, { marks: 7 }, '')).rejects.toBeTruthy();
  });
});

describe('resolving open questions', () => {
  it('pass and set aside bring the open count to zero, then approval goes through', async () => {
    const api = createFakeApprovalApi(0);
    const review = await api.review(FIXTURE_PAPER_ID);
    const open = review.rows.filter((r) => r.kind === 'question' && r.state === 'open');
    expect(open.length).toBeGreaterThan(0);
    await expect(api.setQuestionState(open[0].id, 'set_aside', '')).rejects.toMatchObject({ code: '22023' });
    for (const q of open) expect(await api.setQuestionState(q.id, 'pass', '')).toBe('passed');
    expect((await api.review(FIXTURE_PAPER_ID)).open_count).toBe(0);
    await api.approve(FIXTURE_PAPER_ID, '');
    const t = text(renderToStaticMarkup(<HistoryList events={await api.paperHistory(FIXTURE_PAPER_ID)} now={FIXTURE_NOW} />));
    expect(t).toContain('Arjun Mehta passed question 4(b)');
    expect(t).toContain('Priya Sharma set question 6 aside');
  });

  it('take off the site, then put back', async () => {
    const api = createFakeApprovalApi(0);
    const queue = await api.queue();
    const retro = queue.find((q) => q.kind === 'retro')!;
    await api.unpublish(retro.live_bank_paper_id!, 'Wrong school');
    expect((await api.review(retro.audit_paper_id)).paper.is_published).toBe(false);
    await expect(api.unpublish(retro.live_bank_paper_id!, 'again')).rejects.toMatchObject({ code: '55000' });
    await api.restorePaper(retro.live_bank_paper_id!);
    expect((await api.review(retro.audit_paper_id)).paper.is_published).toBe(true);
  });
});

describe('the live page placeholder for a held question', () => {
  it('shows its number and one friendly line, no question text', () => {
    const html = renderToStaticMarkup(<HeldQuestionCard id="h1" number="6" />);
    expect(text(html)).toContain('This question is being checked and will appear soon.');
    expect(html).toContain('>6<');
    expect(html).not.toMatch(/[–—]/);
  });
});
