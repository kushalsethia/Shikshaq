import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import {
  addDays,
  categoryOf,
  checkerName,
  countEvents,
  dayRange,
  daySentence,
  dayWords,
  heatLevel,
  kolkataDay,
  normaliseCheckerRow,
  normaliseDayLog,
  type LogDay,
  type LogEvent,
} from './checker-log';
import { historyLine } from './history-labels';
import { HistoryList } from '@/components/admin/approval/HistoryPanel';
import { createFakeCheckerLogApi, FIXTURE_ACTOR_KEY } from '@/dummy/checker-log-fake-api';
import { FIXTURE_NOW } from '@/dummy/approval-fake-api';

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');

function ev(action: string, q: string | null, paper: string | null): LogEvent {
  return {
    at: '2026-10-02T06:00:00Z',
    actor_name: 'Rahul Das',
    actor_kind: 'student',
    action,
    model: null,
    question_id: q,
    question_label: null,
    changes: [],
    note: null,
    verdict: null,
    confidence: null,
    version: null,
    to_version: null,
    paper_title: paper ? `Paper ${paper}` : null,
    paper_audit_id: paper,
  };
}

describe('checker log days are Kolkata days', () => {
  it('buckets an instant by its Asia/Kolkata date', () => {
    expect(kolkataDay('2026-10-01T18:29:00Z')).toBe('2026-10-01');
    expect(kolkataDay('2026-10-01T18:31:00Z')).toBe('2026-10-02');
  });
  it('walks calendar days', () => {
    expect(addDays('2026-10-01', -1)).toBe('2026-09-30');
    expect(dayRange('2026-09-29', '2026-10-02')).toEqual(['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
    expect(dayWords('2026-10-02', 2026)).toBe('Friday 2 Oct');
    expect(dayWords('2025-10-02', 2026)).toBe('Thursday 2 Oct 2025');
  });
});

describe('the day in one sentence', () => {
  it('reads like the owner asked', () => {
    const events = [
      ...Array.from({ length: 28 }, (_, i) => ev('checker_pass', `q${i}`, `p${i % 3}`)),
      ...Array.from({ length: 4 }, (_, i) => ev('checker_fix', `f${i}`, 'p0')),
      ...Array.from({ length: 2 }, (_, i) => ev('admin_set_aside', `s${i}`, 'p1')),
    ];
    const day: LogDay = { day: '2026-09-29', counts: countEvents(events), events };
    expect(daySentence({ name: 'Rahul Das', role: 'student' }, day, 2026)).toBe(
      'Tuesday 29 Sep: Rahul checked 34 questions on 3 papers, passed 28, fixed 4, set aside 2.',
    );
  });

  it('keeps AI and pipeline names whole and counts approvals as papers', () => {
    const events = [ev('check_pass', 'a', 'p'), ev('check_flag', 'b', 'p')];
    expect(daySentence({ name: 'AI check (Haiku)', role: 'ai' }, { day: '2026-10-02', counts: countEvents(events), events }, 2026)).toBe(
      'Friday 2 Oct: AI check (Haiku) checked 2 questions on 1 paper, passed 1, flagged 1.',
    );
    const ap = [ev('admin_approve', null, 'p1'), ev('admin_approve', null, 'p2')];
    expect(daySentence({ name: 'Priya Sharma', role: 'admin' }, { day: '2026-10-02', counts: countEvents(ap), events: ap }, 2026)).toBe(
      'Friday 2 Oct: Priya worked on 2 papers, approved 2 papers.',
    );
  });

  it('puts every action in a bucket', () => {
    expect(categoryOf('checker_pass')).toBe('passed');
    expect(categoryOf('check_printed_typo')).toBe('fixed');
    expect(categoryOf('admin_set_aside')).toBe('set_aside');
    expect(categoryOf('checker_ask_help')).toBe('flagged');
    expect(categoryOf('admin_revert')).toBe('edited');
    expect(categoryOf('admin_approve')).toBe('approved');
    expect(categoryOf('locate_page')).toBe('other');
    expect(heatLevel(0, 10)).toBe(0);
    expect(heatLevel(10, 10)).toBe(4);
  });
});

describe('checker log shapes', () => {
  it('reads admin_checker_list rows and never shows a key as a name', () => {
    expect(normaliseCheckerRow({ actor_key: 'ai:haiku', name: null, role: 'ai', total_actions: '12' })).toMatchObject({
      name: 'AI check (Haiku)',
      role: 'ai',
      total_actions: 12,
    });
    expect(checkerName('3f2a9c1e-0000-4000-8000-000000000001', 'student')).toBe('A student checker');
    expect(checkerName('rahul.das@example.com', 'student')).toBe('Rahul Das');
  });

  it('reads admin_checker_day_log, newest day first, counting when counts are missing', () => {
    const log = normaliseDayLog({
      actor: { name: 'Meera Iyer', role: 'student' },
      days: [
        { day: '2026-09-30', counts: { passed: 2 }, events: [] },
        { day: '2026-10-01', events: [{ at: '2026-10-01T05:00:00Z', action: 'checker_fix', actor_kind: 'student', paper_title: 'T', paper_audit_id: 'p' }] },
      ],
    });
    expect(log.days.map((d) => d.day)).toEqual(['2026-10-01', '2026-09-30']);
    expect(log.days[0].counts.fixed).toBe(1);
    expect(log.days[0].events[0].paper_title).toBe('T');
    expect(log.days[1].counts.passed).toBe(2);
  });
});

describe('the fixture log reads like people', () => {
  it('every day sentence and every action line is friendly, and lines link to their paper', async () => {
    const api = createFakeCheckerLogApi(0);
    const list = await api.list();
    expect(list.length).toBeGreaterThan(4);
    const today = kolkataDay(FIXTURE_NOW);
    for (const row of list) {
      expect(row.name).not.toMatch(UUID);
      expect(row.name).not.toMatch(/^(u:|ai:)/);
      const log = await api.dayLog(row.actor_key, addDays(today, -29), today);
      for (const d of log.days) {
        const s = daySentence(log.actor, d, 2026);
        expect(s).not.toMatch(/[–—_{}]/);
        for (const e of d.events) {
          const { line } = historyLine(e, FIXTURE_NOW);
          expect(line, line).not.toMatch(UUID);
          expect(line, line).not.toMatch(/\b[a-z]+_[a-z_]+\b|\{|\bai:/);
        }
      }
    }
    const rahul = await api.dayLog(FIXTURE_ACTOR_KEY, addDays(today, -29), today);
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <HistoryList<LogEvent>
          events={rahul.days[0].events.slice(0, 3)}
          now={FIXTURE_NOW}
          paperFor={(e) => (e.paper_title ? { title: e.paper_title, to: `/admin/paper-approvals/${e.paper_audit_id}` } : null)}
        />
      </MemoryRouter>,
    );
    expect(html).toContain('href="/admin/paper-approvals/');
    expect(text(html)).toContain('Rahul Das (student checker)');
  });

  it('copy in the checker log files has no em or en dashes', () => {
    for (const f of [
      'src/lib/checker-log.ts',
      'src/lib/checker-log-api.ts',
      'src/pages/admin/checker-log.tsx',
      'src/pages/admin/checker-log-person.tsx',
    ]) {
      expect(readFileSync(f, 'utf8'), f).not.toMatch(/[–—]/);
    }
  });
});
