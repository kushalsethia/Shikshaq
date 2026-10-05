import { describe, expect, it } from 'vitest';
import {
  PROCESSED_STATES,
  STATE_LOOK,
  adminPaperHref,
  barSegments,
  hasMore,
  headlineCounts,
  isProcessedState,
  mergeRows,
  openCount,
  percent,
  questionsLine,
  rowFacts,
  rowTitle,
  stateLabel,
  subjectOptions,
  type RegistryRow,
  type RegistrySummary,
} from './paper-registry';
import { createFakePaperRegistryApi } from '@/dummy/paper-registry-fake-api';

const summary: RegistrySummary = {
  total: 10,
  by_state: { not_started: 4, ocr_queued: 1, loaded: 2, awaiting_approval: 1, live: 2 },
  by_subject: [
    { subject: 'Physics', total: 6, by_state: { not_started: 3, live: 2, loaded: 1 } },
    { subject: 'Mathematics', total: 4, by_state: { not_started: 1, ocr_queued: 1, loaded: 1, awaiting_approval: 1 } },
  ],
  by_board: { ICSE: 10 },
  frozen: 0,
  excluded: 0,
  last_updated_at: null,
};

const row = (k: string, extra: Partial<RegistryRow> = {}): RegistryRow => ({
  registry_key: k, pdf_name: null, board: null, class: null, subject: null, year: null, school: null,
  ocr_state: null, processed_state: 'not_started', audit_paper_id: null, bank_paper_id: null, source: null,
  questions_total: null, questions_passed: null, open_student: null, open_admin: null, approval_state: null,
  frozen: false, excluded: false, updated_at: null, ...extra,
});

describe('paper registry helpers', () => {
  it('knows exactly the eight states the table allows, not started first', () => {
    expect(PROCESSED_STATES[0]).toBe('not_started');
    expect(PROCESSED_STATES).toHaveLength(8);
    expect(Object.keys(STATE_LOOK).sort()).toEqual([...PROCESSED_STATES].sort());
    expect(isProcessedState('live')).toBe(true);
    expect(isProcessedState('done')).toBe(false);
  });

  it('uses plain words and no dashes in every label and hint', () => {
    expect(stateLabel('not_started')).toBe('Not started');
    expect(stateLabel('ocr_queued')).toBe('Reading pages');
    expect(stateLabel('fully_checked')).toBe('Checked');
    expect(stateLabel('awaiting_approval')).toBe('Waiting for approval');
    expect(stateLabel('live')).toBe('On the site');
    expect(stateLabel(null)).toBe('Not started');
    for (const s of PROCESSED_STATES) {
      expect(STATE_LOOK[s].label + STATE_LOOK[s].hint).not.toMatch(/[\u2013\u2014]/);
    }
  });

  it('splits the headline into not started, in progress and on the site', () => {
    expect(headlineCounts(summary)).toEqual({ notStarted: 4, inProgress: 4, live: 2, total: 10 });
    expect(headlineCounts({ total: 0, by_state: {} })).toEqual({ notStarted: 0, inProgress: 0, live: 0, total: 0 });
  });

  it('draws bar slices in pipeline order, dropping empty states, summing to 100', () => {
    const seg = barSegments(summary);
    expect(seg.map((s) => s.state)).toEqual(['not_started', 'ocr_queued', 'loaded', 'awaiting_approval', 'live']);
    expect(seg.reduce((n, s) => n + s.widthPct, 0)).toBeCloseTo(100);
    expect(barSegments({ total: 0, by_state: {} })).toEqual([]);
  });

  it('percent never divides by zero', () => {
    expect(percent(3, 0)).toBe(0);
    expect(percent(1, 3)).toBe(33);
    expect(percent(-2, 5)).toBe(0);
  });

  it('lists subjects with the count in the chosen state, dropping empty ones', () => {
    expect(subjectOptions(summary, null)).toEqual([
      { subject: 'Mathematics', count: 4 },
      { subject: 'Physics', count: 6 },
    ]);
    expect(subjectOptions(summary, 'live')).toEqual([{ subject: 'Physics', count: 2 }]);
  });

  it('merges a next page without repeating a row', () => {
    const merged = mergeRows([row('a'), row('b')], [row('b'), row('c')]);
    expect(merged.map((r) => r.registry_key)).toEqual(['a', 'b', 'c']);
    expect(hasMore(120, 50)).toBe(true);
    expect(hasMore(50, 50)).toBe(false);
  });

  it('shows whatever a row knows without stray commas', () => {
    expect(rowTitle(row('k1'))).toBe('k1');
    expect(rowTitle(row('k1', { pdf_name: ' A.pdf ' }))).toBe('A.pdf');
    expect(rowFacts(row('k', { board: 'ICSE', class: 'X', subject: 'Physics', year: '2025', school: null }))).toBe(
      'ICSE, Class X, Physics, 2025',
    );
    expect(rowFacts(row('k'))).toBe('');
    expect(questionsLine(row('k'))).toBe('');
    expect(questionsLine(row('k', { questions_total: 40, questions_passed: 12 }))).toBe('12 of 40 questions cleared');
    expect(questionsLine(row('k', { questions_total: 40, questions_passed: 99 }))).toBe('40 of 40 questions cleared');
    expect(openCount(null)).toBe('n/a');
    expect(openCount(3)).toBe('3');
  });

  it('links to the admin paper page only when the audit id is known', () => {
    expect(adminPaperHref(row('k'))).toBeNull();
    expect(adminPaperHref(row('k', { audit_paper_id: 'abc' }))).toBe('/admin/paper-approvals/abc');
  });
});

describe('fake registry api', () => {
  it('puts not started first, filters, searches and pages like the real RPC', async () => {
    const api = createFakePaperRegistryApi();
    const sum = await api.summary();
    expect(sum.total).toBeGreaterThan(100);
    expect(sum.by_state.not_started).toBeGreaterThan(sum.by_state.live ?? 0);

    const first = await api.list({ state: null, search: '', subject: null, limit: 50, offset: 0 });
    expect(first.total).toBe(sum.total);
    expect(first.rows).toHaveLength(50);
    expect(first.rows[0].processed_state).toBe('not_started');
    const second = await api.list({ state: null, search: '', subject: null, limit: 50, offset: 50 });
    expect(mergeRows(first.rows, second.rows)).toHaveLength(100);

    const live = await api.list({ state: 'live', search: '', subject: null, limit: 50, offset: 0 });
    expect(live.total).toBe(sum.by_state.live);
    expect(live.rows.every((r) => r.processed_state === 'live')).toBe(true);

    const hit = await api.list({ state: null, search: 'DEMO-007', subject: null, limit: 50, offset: 0 });
    expect(hit.rows.map((r) => r.registry_key)).toContain('demo-007');
  });

  it('can be told to be empty or to fail', async () => {
    expect((await createFakePaperRegistryApi('empty').summary()).total).toBe(0);
    await expect(createFakePaperRegistryApi('error').summary()).rejects.toThrow();
  });
});
