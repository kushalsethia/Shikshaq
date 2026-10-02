// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import type { PaperQueueRow } from '@/lib/checker-api';
import { LIBRARY_VIEWS, hiddenWhy, normaliseExtra, viewCounts, viewRows, withExtras } from '@/lib/library-views';
import { buildAdminNav } from '@/pages/admin/shell';

const row = (o: Partial<PaperQueueRow>): PaperQueueRow => ({
  paper_id: 'p', title: '', school: 's', subject: 'x', cls: '10', board: 'ICSE', year: '2024',
  needs_review: false, is_published: true, incomplete_note: null, audit_paper_id: null,
  escalated_count: 0, total_questions: 10, passed_questions: 10, ...o,
});

describe('library views', () => {
  const papers = [
    row({ paper_id: 'a' }),
    row({ paper_id: 'b', needs_review: true }),
    row({ paper_id: 'c', is_published: false }),
  ];
  const extras = [
    normaliseExtra({ paper_id: 'b', with_students: '4', with_admin: 0, ready: false }),
    normaliseExtra({ paper_id: 'c', hidden_reason: 'Duplicate upload', hidden_by: 'Priya', with_admin: 2, ready: 't' }),
  ].filter((e) => e !== null);

  it('counts every view from the same predicate the list uses', () => {
    const rows = withExtras(papers, extras);
    const counts = viewCounts(rows);
    for (const v of LIBRARY_VIEWS) expect(viewRows(rows, v.key)).toHaveLength(counts[v.key]);
    expect(counts.live).toBe(2);
    expect(counts.hidden).toBe(1);
    expect(counts.with_students).toBe(1);
    expect(counts.with_admin).toBe(1);
    expect(counts.ready).toBe(1);
  });

  it('says why a paper is hidden, and never leaves it blank', () => {
    const rows = withExtras(papers, extras);
    expect(hiddenWhy(rows[2], true)).toBe('Duplicate upload (Priya)');
    expect(hiddenWhy({ is_published: false, hidden_reason: null, hidden_by: null }, true)).toMatch(/No reason/);
    expect(hiddenWhy({ is_published: false, hidden_reason: null, hidden_by: null }, false)).toMatch(/not available/);
    expect(hiddenWhy(rows[0], true)).toBe('');
  });

  it('labels contain no em or en dashes', () => {
    for (const v of LIBRARY_VIEWS) expect(v.label).not.toMatch(/[\u2013\u2014]/);
  });
});

describe('admin nav', () => {
  it('has four groups, one active page, and badges only for real counts', () => {
    const nav = buildAdminNav('admin-queue', { adminQueue: 657, paperApprovals: 0 });
    expect(new Set(nav.map((n) => n.group))).toEqual(new Set(['papers', 'checking', 'teachers', 'site']));
    expect(nav.filter((n) => n.active).map((n) => n.key)).toEqual(['admin-queue']);
    expect(nav.find((n) => n.key === 'admin-queue')?.count).toBe(657);
    expect(nav.find((n) => n.key === 'ready')?.count).toBe(0);
    expect(nav.every((n) => n.short.length > 10)).toBe(true);
  });
});
