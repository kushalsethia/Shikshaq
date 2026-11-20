import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), storage: { from: vi.fn() }, auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}));

import { QUESTION_CONTEXT_KEY, WholeQuestion } from '@/components/hod/WholeQuestion';
import type { HodApi } from '@/lib/hod-api';
import { normaliseContextRows, type HodContextRow } from '@/lib/hod-publish';

/* The whole question on the HOD desk (owner, 20 Nov 2026: "if I just see 34 part 1 part 2, it doesn't make sense").
   The rows are put straight into the query cache, so this draws exactly what a loaded block draws. */

const row = (over: Partial<HodContextRow>): HodContextRow => ({
  id: 'x',
  ord: 0,
  display_number: null,
  number_path: null,
  body: '',
  options: null,
  source: null,
  is_current: false,
  is_parent: false,
  depth: 1,
  passed: false,
  set_aside: false,
  ...over,
});

const stem = row({ id: 'stem', ord: 1, display_number: '34', body: 'With reference to the passage, answer the following:', is_parent: true, depth: 0 });
const partA = row({ id: 'a', ord: 2, display_number: '34(a)', body: 'Why was the king worried?', passed: true });
const partB = row({ id: 'b', ord: 3, display_number: '34(b)', body: 'Name one thing he did next.', is_current: true });
const partC = row({ id: 'c', ord: 4, display_number: '34(c)', body: 'Which word means "afraid"?', set_aside: true });

function draw(rows: HodContextRow[] | null, questionId: string, open: boolean): string {
  const qc = new QueryClient();
  if (rows) qc.setQueryData(QUESTION_CONTEXT_KEY(questionId), rows);
  const api = { questionContext: async () => rows ?? [] } as unknown as Pick<HodApi, 'questionContext'>;
  return renderToStaticMarkup(
    createElement(QueryClientProvider, { client: qc }, createElement(WholeQuestion, { api, questionId, defaultOpen: open })),
  );
}

describe('the whole question on the HOD desk', () => {
  it('is closed with one button and loads nothing until it is opened', () => {
    const html = draw(null, 'b', false);
    expect(html).toContain('Show the whole question');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('data-testid="whole-question"');
  });

  it('shows the lead-in and every part in order, with the sent part marked', () => {
    const html = draw([stem, partA, partB, partC], 'b', true);
    expect(html).toContain('Hide the whole question');
    expect(html).toContain('The whole question 34');
    expect(html).toContain('The lead-in');
    // The lead-in is its own block above the parts, and each part is its own block, in order (the words themselves
    // are drawn by MathText, which swaps some letters for look-alikes on purpose, so the text is not matched here).
    expect(html).toContain('data-testid="whole-question-stem"');
    expect((html.match(/data-testid="whole-question-part"/g) ?? []).length).toBe(3);
    expect(html.indexOf('34(a)')).toBeLessThan(html.indexOf('34(b)'));
    expect(html.indexOf('34(b)')).toBeLessThan(html.indexOf('34(c)'));
    expect(html.indexOf('The lead-in')).toBeLessThan(html.indexOf('34(a)'));
    expect(html).toContain('This is the part you were sent');
    expect((html.match(/data-current="true"/g) ?? []).length).toBe(1);
  });

  it('says plainly which other parts are already passed or left out', () => {
    const html = draw([stem, partA, partB, partC], 'b', true);
    expect(html).toContain('Already passed');
    expect(html).toContain('Left out');
  });

  it('shows no lead-in block for a group that has none', () => {
    const html = draw([partA, partB], 'b', true);
    expect(html).not.toContain('data-testid="whole-question-stem"');
    expect((html.match(/data-testid="whole-question-part"/g) ?? []).length).toBe(2);
  });

  it('says so when the question stands on its own', () => {
    const html = draw([], 'solo', true);
    expect(html).toContain('This question stands on its own');
  });

  it('says so when only one row comes back (a group needs two rows to be a group)', () => {
    const html = draw([row({ id: 'solo', ord: 1, display_number: '5', body: 'One part only', is_current: true, is_parent: true, depth: 0 })], 'solo', true);
    expect(html).toContain('This question stands on its own');
  });
});

describe('normaliseContextRows', () => {
  it('keeps the words untouched and reads the flags', () => {
    const rows = normaliseContextRows([
      { id: 'a', ord: '2', display_number: '1(a)', number_path: '1.a', body: '  spaced  ', options: [{ label: 'A', text: 'x' }], is_current: true, is_parent: false, depth: 1, passed: true, set_aside: false },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].body).toBe('  spaced  ');
    expect(rows[0].ord).toBe(2);
    expect(rows[0].is_current).toBe(true);
    expect(rows[0].passed).toBe(true);
    expect(rows[0].source).toBeNull();
    expect(Array.isArray(rows[0].options)).toBe(true);
  });

  it('drops a row with no id and survives a non-list answer', () => {
    expect(normaliseContextRows([{ body: 'no id' }, null, 'junk'])).toEqual([]);
    expect(normaliseContextRows(null)).toEqual([]);
    expect(normaliseContextRows('nope')).toEqual([]);
  });

  it('treats a missing flag as false and a missing body as empty', () => {
    const [r] = normaliseContextRows([{ id: 'z' }]);
    expect(r.is_current).toBe(false);
    expect(r.is_parent).toBe(false);
    expect(r.passed).toBe(false);
    expect(r.set_aside).toBe(false);
    expect(r.body).toBe('');
  });
});
