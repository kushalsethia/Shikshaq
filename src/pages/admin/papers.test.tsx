import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), storage: { from: vi.fn() }, auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}));
vi.mock('@/lib/admin-debug', () => ({
  useAdminDebugToggle: () => ({ on: false, canToggle: false, toggle: () => {} }),
  useAdminDebugOn: () => false,
}));

import { buildPaperPayload, listView, mapSubmittedExamType, missingPaperFields, statusWords, type FormState } from '@/pages/admin/papers';
import { createFakePapersApi } from '@/dummy/papers-fake-api';

const FORM: FormState = {
  title: ' Prelims 2025 ',
  school: ' Sample Hill School ',
  subject: 'Mathematics',
  class: '10',
  board: 'ICSE',
  exam_type: 'Prelims',
  year: 2025,
  file_url: 'https://example.invalid/a.pdf',
};

describe('upload form: Publish and Save as draft say what they do', () => {
  it('"Publish this paper" writes is_published true', () => {
    expect(buildPaperPayload(FORM, true).is_published).toBe(true);
  });

  it('"Save as draft" writes is_published false', () => {
    expect(buildPaperPayload(FORM, false).is_published).toBe(false);
  });

  it('trims the title and school and keeps the rest', () => {
    expect(buildPaperPayload(FORM, true)).toEqual({
      title: 'Prelims 2025',
      school: 'Sample Hill School',
      subject: 'Mathematics',
      class: '10',
      board: 'ICSE',
      exam_type: 'Prelims',
      year: 2025,
      file_url: 'https://example.invalid/a.pdf',
      is_published: true,
    });
  });

  it('through the fake api, a draft is stored hidden and a publish is stored live', async () => {
    const api = createFakePapersApi();
    const draftId = await api.insertPaper(buildPaperPayload({ ...FORM, title: 'Draft one' }, false));
    const liveId = await api.insertPaper(buildPaperPayload({ ...FORM, title: 'Live one' }, true));
    const all = await api.papers();
    expect(all.find((p) => p.id === draftId)?.is_published).toBe(false);
    expect(all.find((p) => p.id === liveId)?.is_published).toBe(true);
  });

  it('lists the required fields that are still empty', () => {
    expect(missingPaperFields(FORM)).toEqual([]);
    expect(missingPaperFields({ ...FORM, title: '  ', school: '' })).toEqual(['title', 'school']);
    expect(missingPaperFields({ ...FORM, year: undefined })).toEqual(['year']);
  });
});

describe('the lists never turn a failed read into "No papers yet"', () => {
  it('error is its own state, whatever else is true', () => {
    expect(listView({ state: 'error', total: 0, shown: 0, searching: false })).toBe('error');
    expect(listView({ state: 'error', total: 0, shown: 0, searching: true })).toBe('error');
  });

  it('loading, rows, and the three honest empties are distinct', () => {
    expect(listView({ state: 'loading', total: 0, shown: 0, searching: false })).toBe('loading');
    expect(listView({ state: 'ok', total: 5, shown: 2, searching: false })).toBe('rows');
    expect(listView({ state: 'ok', total: 0, shown: 0, searching: false })).toBe('none-yet');
    expect(listView({ state: 'ok', total: 5, shown: 0, searching: false })).toBe('filter-empty');
    expect(listView({ state: 'ok', total: 5, shown: 0, searching: true })).toBe('search-empty');
  });
});

describe('hide, restore, approve and reject keep their writes (G6)', () => {
  it('hide and restore flip is_published on the same row', async () => {
    const api = createFakePapersApi();
    const first = (await api.papers())[0];
    await api.setPublished(first.id, false);
    expect((await api.papers()).find((p) => p.id === first.id)?.is_published).toBe(false);
    await api.setPublished(first.id, true);
    expect((await api.papers()).find((p) => p.id === first.id)?.is_published).toBe(true);
  });

  it('approve publishes a new paper and marks the upload approved; reject keeps the reason', async () => {
    const api = createFakePapersApi();
    const waiting = (await api.submissions()).filter((s) => s.status === 'pending');
    const [a, b] = waiting;
    const { paperId } = await api.approveSubmission({ target: a, title: 'Physics Prelims', board: 'ICSE', cls: '10', examType: 'Prelims', year: '2025', reviewerId: 'dummy-admin' });
    expect((await api.papers()).find((p) => p.id === paperId)).toMatchObject({ title: 'Physics Prelims', is_published: true });
    expect((await api.submissions()).find((s) => s.id === a.id)?.status).toBe('approved');
    await api.rejectSubmission(b.id, 'Pages are unreadable', 'dummy-admin');
    expect((await api.submissions()).find((s) => s.id === b.id)).toMatchObject({ status: 'rejected', review_note: 'Pages are unreadable' });
  });

  it('keeps the original exam-type mapping that the papers CHECK constraint needs', () => {
    expect(mapSubmittedExamType('Prelim / Pre-board')).toBe('Prelims');
    expect(mapSubmittedExamType('Half-yearly')).toBe('Half-Yearly');
    expect(mapSubmittedExamType('Annual / Final')).toBe('Final');
    expect(mapSubmittedExamType('Unit test')).toBe('Unit Test');
  });

  it('shows a waiting upload as Pending, as the page help says', () => {
    expect(statusWords('pending')).toBe('Pending');
    expect(statusWords('approved')).toBe('Approved');
    expect(statusWords('rejected')).toBe('Rejected');
  });
});

describe('the Student uploads page source', () => {
  const src = readFileSync('src/pages/admin/papers.tsx', 'utf8');

  it('uses Hide, Restore and Hidden, never Unpublish or Taken down', () => {
    expect(src).not.toMatch(/Unpublish|Taken down|Take down/);
  });

  it('has no leftover "publish immediately" checkbox', () => {
    expect(src).not.toContain('Publish immediately');
    expect(src).not.toContain('u-is-published');
  });

  it('reads papers and uploads with explicit column lists', () => {
    expect(src).not.toMatch(/\.select\(\s*['"`]\*['"`]/);
  });
});
