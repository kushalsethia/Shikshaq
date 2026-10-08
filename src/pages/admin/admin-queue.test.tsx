import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

// CI has no Supabase env; the page only needs the client to exist.
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() } },
}));

import {
  ACCEPT_FAILED_WORDS,
  HelpCardView,
  QUEUE_UNAVAILABLE_WORDS,
  WaitingListView,
  acceptAsIs,
  helpPaperHref,
  waitingState,
  type AcceptStep,
  type WaitingState,
} from '@/pages/admin/admin-queue';
import { createFakeAdminQueueApi } from '@/dummy/admin-queue-fake-api';
import type { EscalationRow } from '@/lib/checker-api';
import type { QueuePaper } from '@/lib/admin-queue';

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
const NOTHING_WAITING = 'Nothing is waiting for an admin.';

const PAPER: QueuePaper = { audit_paper_id: 'p1', title: 'ICSE Class 10 Mathematics, 2024', school: 'Sample Hill School', waiting: 3, is_live: true };

function list(state: WaitingState, open: string | null = null) {
  return renderToStaticMarkup(
    <WaitingListView state={state} open={open} onToggle={() => {}} onRetry={() => {}} renderQuestions={() => <span>questions here</span>} />,
  );
}

describe('the waiting tab tells a failed read from an empty list', () => {
  it('maps the query to one of four states', () => {
    expect(waitingState({ isLoading: true, isError: false, data: undefined })).toEqual({ kind: 'loading' });
    expect(waitingState({ isLoading: false, isError: true, data: undefined })).toEqual({ kind: 'error' });
    expect(waitingState({ isLoading: false, isError: false, data: null })).toEqual({ kind: 'unavailable' });
    expect(waitingState({ isLoading: false, isError: false, data: [] })).toEqual({ kind: 'ready', papers: [] });
    expect(waitingState({ isLoading: false, isError: false, data: [PAPER] })).toEqual({ kind: 'ready', papers: [PAPER] });
  });

  it('a failed read shows Try again and never says nothing is waiting', () => {
    const html = list({ kind: 'error' });
    expect(html).toContain('role="alert"');
    expect(text(html)).toContain('The queue did not load.');
    expect(text(html)).toContain('Try again');
    expect(text(html)).not.toContain(NOTHING_WAITING);
  });

  it('an unavailable list says so in plain words, with no mention of a database update', () => {
    const t = text(list({ kind: 'unavailable' }));
    expect(t).toContain(QUEUE_UNAVAILABLE_WORDS);
    expect(t).toContain('The count on the tab is still correct.');
    expect(t).not.toMatch(/database|update|migration/i);
    expect(t).not.toContain(NOTHING_WAITING);
  });

  it('only a successful empty read says nothing is waiting; loading is a skeleton', () => {
    expect(text(list({ kind: 'ready', papers: [] }))).toContain(NOTHING_WAITING);
    const loading = list({ kind: 'loading' });
    expect(loading).toContain('role="status"');
    expect(text(loading)).not.toContain(NOTHING_WAITING);
  });

  it('a paper row is a disclosure with an id the button controls', () => {
    const closed = list({ kind: 'ready', papers: [PAPER] });
    expect(closed).toContain('aria-expanded="false"');
    expect(closed).toContain('aria-controls="queue-paper-p1"');
    expect(text(closed)).toContain('3 waiting');
    const opened = list({ kind: 'ready', papers: [PAPER] }, 'p1');
    expect(opened).toContain('aria-expanded="true"');
    expect(opened).toContain('id="queue-paper-p1"');
    expect(text(opened)).toContain('questions here');
  });
});

const HELP: EscalationRow = {
  question_id: 'q9',
  paper_id: 'p9',
  live_bank_paper_id: null,
  display_number: '4',
  body: 'Find the value of $x$ if $3x + 7 = 22$.',
  flag_reasons: ['display_number_missing'],
  school: 'Sample Hill School',
  subject: 'Mathematics',
  cls: '10',
  updated_at: '2026-10-01T10:00:00Z',
};

function card(step: AcceptStep, e: EscalationRow = HELP) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <ul>
        <HelpCardView e={e} step={step} onAsk={() => {}} onCancel={() => {}} onConfirm={() => {}} />
      </ul>
    </MemoryRouter>,
  );
}

describe('Asked for help shows the question and asks twice before accepting', () => {
  it('shows the question text read-only, and a link to the paper', () => {
    const html = card('idle');
    expect(html).toContain('data-testid="help-question-body"');
    expect(html).not.toContain('<textarea');
    expect(html).not.toContain('<input');
    expect(html).toContain('href="/admin/paper-approvals/p9#q-q9"');
    expect(text(html)).toContain('Open the paper');
    expect(helpPaperHref(HELP)).toBe('/admin/paper-approvals/p9#q-q9');
  });

  it('the first step has Accept as-is but not the confirm button', () => {
    const t = text(card('idle'));
    expect(t).toContain('Accept as-is');
    expect(t).not.toContain('Yes, accept it');
  });

  it('the second step explains what happens and offers Yes and Cancel', () => {
    const t = text(card('confirm'));
    expect(t).toContain('Accept this question exactly as it is? It counts as passed and leaves this list.');
    expect(t).toContain('Yes, accept it');
    expect(t).toContain('Cancel');
    expect(t).not.toContain('Open the paper');
  });

  it('busy disables both buttons, and a failure says nothing changed', () => {
    const busy = card('busy');
    expect(text(busy)).toContain('Accepting...');
    expect(busy.match(/disabled=""/g)?.length).toBe(2);
    const failed = card('failed');
    expect(failed).toContain('role="alert"');
    expect(text(failed)).toContain(ACCEPT_FAILED_WORDS);
    expect(ACCEPT_FAILED_WORDS).toBe('Nothing changed. Try again.');
    expect(text(failed)).toContain('Accept as-is');
  });

  it('a question with no text points to the paper instead of showing a blank box', () => {
    const html = card('idle', { ...HELP, body: '' });
    expect(html).not.toContain('data-testid="help-question-body"');
    expect(text(html)).toContain('This question has no text. Open the paper to see it.');
  });

  it('accepting makes the same single call as before: resolveHelp with the question id and nothing else', async () => {
    const resolveHelp = vi.fn().mockResolvedValue(undefined);
    expect(await acceptAsIs({ resolveHelp }, 'q9')).toBe('ok');
    expect(resolveHelp).toHaveBeenCalledTimes(1);
    expect(resolveHelp).toHaveBeenCalledWith('q9');
    expect(await acceptAsIs({ resolveHelp: vi.fn().mockRejectedValue(new Error('boom')) }, 'q9')).toBe('failed');
  });

  it('the fake api drops the request once accepted', async () => {
    const api = createFakeAdminQueueApi();
    const before = await api.helpRequests();
    expect(before.length).toBeGreaterThan(0);
    expect(await acceptAsIs(api, before[0].question_id)).toBe('ok');
    expect((await api.helpRequests()).map((h) => h.question_id)).not.toContain(before[0].question_id);
  });
});
