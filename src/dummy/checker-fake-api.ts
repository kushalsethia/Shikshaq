/**
 * In-memory fake of the checker API for dummy mode (D75). Test builds only
 * (see src/lib/dummy-mode.ts). Same shape as realCheckerApi, so the real
 * page runs unchanged; nothing here touches Supabase.
 *
 * It copies the server's rules that the page depends on: kid questions in
 * order, a skipped question does not come back, subject/class picks filter
 * exactly, a split counts characters (code points) like Postgres left(),
 * refuses 0 or the end, and a blank question cannot be passed. `simulate`
 * lets the preview force the failure states a real checker hits.
 */

import type { CheckerApi, CheckerQuestion, LeaderboardRow, QueueFacetRow } from '@/lib/checker-api';
import { dummyContext, dummyPageDataUrl, dummyPictureDataUrl, dummyQuestions } from '@/dummy/checker-fixtures';
import { isBlankBody } from '@/lib/checker-body';

export type DummySimulation = 'none' | 'lease' | 'offline' | 'slow' | 'blank';

export interface FakeCheckerApi extends CheckerApi {
  simulate: DummySimulation;
  /** Put every fixture back and clear counters and picks. */
  reset(): void;
  /** Serve nothing, to see the end-of-queue state. */
  emptyQueue(): void;
}

function pgError(code: string, message: string) {
  return Object.assign(new Error(message), { code, message, details: null, hint: null });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createFakeCheckerApi(): FakeCheckerApi {
  let queue: CheckerQuestion[] = dummyQuestions();
  let skipped = new Set<string>();
  let prefs: { subjects: string[] | null; classes: string[] | null; chosen: boolean } = {
    subjects: null,
    classes: null,
    chosen: false,
  };
  let today = 0;
  let total = 41;

  const api: FakeCheckerApi = {
    simulate: 'none',

    reset() {
      queue = dummyQuestions();
      skipped = new Set();
      prefs = { subjects: null, classes: null, chosen: false };
      today = 0;
      total = 41;
      api.simulate = 'none';
    },

    emptyQueue() {
      queue = [];
    },

    async isPaperChecker() {
      return true;
    },

    async nextQuestion() {
      await gate();
      if (api.simulate === 'blank') {
        const blank = queue.find((q) => isBlankBody(q.body));
        if (blank) return { ...blank };
      }
      const next = queue.find(
        (q) =>
          // Like 20260929013000: a blank body is never served.
          !isBlankBody(q.body) &&
          !skipped.has(q.id) &&
          (!prefs.subjects || prefs.subjects.length === 0 || prefs.subjects.includes(q.subject ?? '')) &&
          (!prefs.classes || prefs.classes.length === 0 || prefs.classes.includes(q.cls ?? '')),
      );
      return next ? { ...next } : null;
    },

    async passQuestion(id) {
      await gateSave();
      const q = find(id);
      if (!q.body || !q.body.trim()) throw pgError('22023', 'This question has no words; it cannot be passed');
      done(id);
    },

    async fixQuestion(id, patch) {
      await gateSave();
      const q = find(id);
      const body = patch.body ?? q.body;
      if (!body || !body.trim()) throw pgError('22023', 'This question has no words; it cannot be passed');
      done(id);
    },

    async splitQuestion(id, bodyBefore, splitAt) {
      await gateSave();
      const q = find(id);
      if (bodyBefore !== q.body) throw pgError('40001', 'stale question text, reload and retry');
      const chars = Array.from(bodyBefore);
      if (splitAt <= 0 || splitAt >= chars.length) throw pgError('P0001', 'Split point out of range');
      const secondId = `${id.slice(0, 24)}${String(Date.now()).slice(-12)}`;
      q.body = chars.slice(0, splitAt).join('');
      q.flag_reasons = q.flag_reasons.filter((r) => r !== 'ocr_fused');
      const second: CheckerQuestion = {
        ...q,
        id: secondId,
        ord: q.ord + 0.5,
        display_number: null,
        body: chars.slice(splitAt).join(''),
        flag_reasons: [`split_from_${id}`],
        flag_detail: null,
      };
      queue.splice(queue.indexOf(q) + 1, 0, second);
      today++;
      total++;
      return { first_id: id, second_id: secondId };
    },

    async askForHelp(id) {
      await gateSave();
      find(id);
      done(id);
    },

    async skipQuestion(id) {
      await gateSave();
      find(id);
      skipped.add(id);
    },

    async checkedTodayCount() {
      return today;
    },

    async myStats() {
      await gate();
      return { today_count: today, total_count: total };
    },

    async leaderboard(): Promise<LeaderboardRow[]> {
      await gate();
      const rows = [
        { first_name: 'Riya', weekly_count: 58 },
        { first_name: 'Arjun', weekly_count: 44 },
        { first_name: 'You', weekly_count: 12 + today },
        { first_name: 'Sana', weekly_count: 9 },
      ].sort((a, b) => b.weekly_count - a.weekly_count);
      return rows.map((r, i) => ({ rank: i + 1, ...r }));
    },

    async getPreferences() {
      await gate();
      return { ...prefs };
    },

    async setPreferences(subjects, classes) {
      await gateSave();
      prefs = { subjects: subjects.length ? subjects : null, classes: classes.length ? classes : null, chosen: true };
    },

    async questionContext(id) {
      return dummyContext(id);
    },

    async queueFacets(): Promise<QueueFacetRow[] | null> {
      const counts = new Map<string, QueueFacetRow>();
      for (const q of queue) {
        if (isBlankBody(q.body)) continue;
        const key = `${q.subject}|${q.cls}`;
        const row = counts.get(key) ?? { subject: q.subject, cls: q.cls, waiting: 0 };
        row.waiting++;
        counts.set(key, row);
      }
      return [...counts.values()];
    },

    async pictureUrl(path) {
      return dummyPageDataUrl(path) ?? dummyPictureDataUrl(path);
    },
  };

  function find(id: string): CheckerQuestion {
    const q = queue.find((x) => x.id === id);
    if (!q) throw pgError('42501', 'This question is not currently assigned to you');
    return q;
  }

  function done(id: string) {
    queue = queue.filter((x) => x.id !== id);
    today++;
    total++;
  }

  async function gate() {
    if (api.simulate === 'offline') throw new TypeError('Failed to fetch');
    if (api.simulate === 'slow') await wait(1500);
  }

  async function gateSave() {
    await gate();
    if (api.simulate === 'lease') {
      api.simulate = 'none';
      throw pgError('42501', 'This question is not currently assigned to you');
    }
  }

  return api;
}
