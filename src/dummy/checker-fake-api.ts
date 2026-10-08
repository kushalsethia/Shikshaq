/**
 * In-memory fake of the checker API for dummy mode (D75). Test builds only
 * (see src/lib/dummy-mode.ts). Same shape as realCheckerApi, so the real
 * page runs unchanged; nothing here touches Supabase.
 *
 * It copies the server's rules that the page depends on: kid questions in
 * order, a skipped question comes back at the end of its paper (the old
 * one-queue nextQuestion still hides it), subject/class picks filter
 * exactly, a split counts characters (code points) like Postgres left(),
 * refuses 0 or the end, and a blank question cannot be passed. `simulate`
 * lets the preview force the failure states a real checker hits.
 */

import type { CheckerApi, CheckerQuestion, LeaderboardRow, QueueFacetRow } from '@/lib/checker-api';
import type { MyAssignment } from '@/lib/checker-progress';
import { isVerifierGrade, type MyPaper, type PaperQuestion, type PaperQuestionState, type VerifierProfile } from '@/lib/verifier-papers';
import type { PaperPage } from '@/lib/paper-pages';
import { DUMMY_PAPER, dummyContext, dummyPageDataUrl, dummyPictureDataUrl, dummyQuestions } from '@/dummy/checker-fixtures';
import { isBlankBody } from '@/lib/checker-body';
import { lostTextSuggestion } from '@/lib/checker-lost-text';
import { checkerSaveRoute, TYPO_NEEDS_VERSION } from '@/lib/checker-save';

export type DummySimulation = 'none' | 'lease' | 'stale' | 'offline' | 'slow' | 'blank' | 'nopages';

/** What the fake recorded for the last fix, so tests can see the version lock and typo flag. */
export interface FakeFixRecord {
  id: string;
  version: number | null | undefined;
  printedTypo: boolean;
  typoNote: string | null;
  body: string | null;
}

export interface FakeCheckerApi extends CheckerApi {
  simulate: DummySimulation;
  /** Every fix the fake accepted, newest last. */
  fixes: FakeFixRecord[];
  /** Put every fixture back and clear counters and picks. */
  reset(): void;
  /** Serve nothing, to see the end-of-queue state. */
  emptyQueue(): void;
  /** A new question appears in the queue (what the pipeline does between polls). */
  arrive(): void;
  /** Reasons given to returnPaper, newest last. */
  returns: string[];
}

/** The made-up papers the checker is handed one at a time. B is "given by your HOD". */
const PAPER_B = '00000000-0000-4000-8000-00000000d0d1';
const PAPERS: Record<string, { id: string; school: string; year: string; givenByHod: boolean; pages: number }> = {
  A: { id: DUMMY_PAPER, school: 'Dummy School', year: '2025', givenByHod: false, pages: 4 },
  B: { id: PAPER_B, school: 'Riverside Academy', year: '2024', givenByHod: true, pages: 3 },
};
const PAPER_ORDER = ['A', 'B'];
/** The first few fixtures are paper A, the rest paper B. */
const PAPER_A_COUNT = 5;

function pgError(code: string, message: string) {
  return Object.assign(new Error(message), { code, message, details: null, hint: null });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createFakeCheckerApi(): FakeCheckerApi {
  let queue: CheckerQuestion[] = dummyQuestions();
  let skipped = new Set<string>();
  /** When each question was last skipped, so skipped ones come back earliest first. */
  const skipOrder = new Map<string, number>();
  let skipClock = 0;
  let prefs: { subjects: string[] | null; classes: string[] | null; chosen: boolean } = {
    subjects: null,
    classes: null,
    chosen: false,
  };
  let today = 0;
  let total = 41;
  let arrivals = 0;
  // Which paper each question belongs to, who has been through how many, and
  // which paper is the checker's current one.
  let paperOf = new Map<string, string>();
  let doneByPaper: Record<string, number> = {};
  let returned = new Set<string>();
  let current: string | null = null;
  // What happened to each question this verifier has been through.
  let outcome = new Map<string, PaperQuestionState>();
  let allQuestions: CheckerQuestion[] = [];
  let requested: string[] = [];
  let myDetails: VerifierProfile = {
    full_name: 'Dummy Verifier',
    grade: 10,
    school: 'Dummy School',
    board: 'ICSE',
    valid_until: '2027-03-31',
    expired: false,
    preferred_subjects: ['Mathematics'],
    requested_subjects: [],
  };
  const seedPapers = () => {
    paperOf = new Map(queue.map((q, i) => [q.id, i < PAPER_A_COUNT ? 'A' : 'B']));
    doneByPaper = {};
    returned = new Set();
    current = null;
    outcome = new Map();
    allQuestions = queue.map((q) => ({ ...q }));
    requested = [];
  };
  seedPapers();
  const paperKey = (q: CheckerQuestion) => paperOf.get(q.id) ?? current ?? 'A';
  const decorate = (q: CheckerQuestion): CheckerQuestion => {
    const meta = PAPERS[paperKey(q)];
    return { ...q, paper_id: meta.id, school: meta.school, year: meta.year };
  };

  // A blank body is served only when the AI left a transcription of the page
  // for the verifier to confirm (like 20261003160000).
  const servable = (q: CheckerQuestion) => !isBlankBody(q.body) || lostTextSuggestion(q.body, q.flag_detail) !== null;

  const api: FakeCheckerApi = {
    simulate: 'none',
    fixes: [],
    returns: [],

    reset() {
      api.fixes = [];
      api.returns = [];
      queue = dummyQuestions();
      seedPapers();
      skipped = new Set();
      skipOrder.clear();
      prefs ={ subjects: null, classes: null, chosen: false };
      today = 0;
      total = 41;
      api.simulate = 'none';
    },

    emptyQueue() {
      queue = [];
    },

    arrive() {
      const n = ++arrivals;
      queue.push({
        ...dummyQuestions()[0],
        id: `d00000a0-0000-4000-8000-${String(n).padStart(12, '0')}`,
        ord: 100 + n,
        display_number: String(20 + n),
        body: `${20 + n}. A new question that arrived while you waited. Find the mean of 2, 4 and 9.`,
        flag_reasons: ['marks_mismatch'],
        flag_detail: null,
        source: { snippet_object: 'dummy/q-factorise.png', align_score: 0.96 },
      });
      paperOf.set(queue[queue.length - 1].id, current ?? 'B');
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
      const servable = (q: CheckerQuestion) =>
        // Like 20261003160000: a blank body is served only when the AI left
        // a transcription of the page for the student to confirm.
        (!isBlankBody(q.body) || lostTextSuggestion(q.body, q.flag_detail) !== null) &&
        !skipped.has(q.id) &&
        (!prefs.subjects || prefs.subjects.length === 0 || prefs.subjects.includes(q.subject ?? '')) &&
        (!prefs.classes || prefs.classes.length === 0 || prefs.classes.includes(q.cls ?? ''));
      // One paper at a time, in printed order. When the current paper has
      // nothing left, the next paper nobody handed back is given automatically.
      if (!current || !queue.some((q) => paperKey(q) === current && servable(q))) {
        current = PAPER_ORDER.find((k) => !returned.has(k) && queue.some((q) => paperKey(q) === k && servable(q))) ?? null;
      }
      if (!current) return null;
      const next = queue.find((q) => paperKey(q) === current && servable(q));
      return next ? decorate(next) : null;
    },

    async passQuestion(id, version) {
      await gateSave();
      const q = find(id);
      checkVersion(q, version);
      if (!q.body || !q.body.trim()) throw pgError('22023', 'This question has no words; it cannot be passed');
      done(id);
    },

    async fixQuestion(id, patch, options = {}) {
      await gateSave();
      const q = find(id);
      // Same rules as checker_fix_locked (20261002090000).
      const route = checkerSaveRoute(options.version, Boolean(options.printedTypo));
      if (route === 'refuse') throw new Error(TYPO_NEEDS_VERSION);
      if (route === 'locked') checkVersion(q, options.version);
      const body = patch.body ?? q.body;
      if (!body || !body.trim()) throw pgError('22023', 'This question has no words; it cannot be passed');
      if (options.printedTypo && (patch.body == null || patch.body === q.body)) {
        throw pgError('22023', 'A printed typo fix must change the words');
      }
      api.fixes.push({
        id,
        version: options.version,
        printedTypo: Boolean(options.printedTypo),
        typoNote: options.typoNote ?? null,
        body: patch.body ?? null,
      });
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
      paperOf.set(secondId, paperOf.get(id) ?? 'A');
      allQuestions.push({ ...second });
      queue.splice(queue.indexOf(q) + 1, 0, second);
      today++;
      total++;
      return { first_id: id, second_id: secondId };
    },

    async askForHelp(id) {
      await gateSave();
      find(id);
      done(id, 'with_hod');
    },

    async skipQuestion(id) {
      await gateSave();
      find(id);
      skipped.add(id);
      skipOrder.set(id, ++skipClock);
    },

    async myPapers(): Promise<MyPaper[]> {
      await gate();
      return PAPER_ORDER.filter((k) => !returned.has(k)).map((k, i) => {
        const meta = PAPERS[k];
        const mine = allQuestions.filter((q) => paperOf.get(q.id) === k);
        const withHod = mine.filter((q) => outcome.get(q.id) === 'with_hod').length;
        const doneCount = mine.filter((q) => outcome.get(q.id) === 'done').length;
        // Skipped questions still count: the verifier has to come back to them.
        const open = queue.filter((q) => paperOf.get(q.id) === k && servable(q)).length;
        return {
          assignment_id: i + 1,
          paper_id: meta.id,
          subject: 'Mathematics',
          school: meta.school,
          cls: 'X',
          exam: 'Prelims',
          year: meta.year,
          given_by_hod: meta.givenByHod,
          assigned_at: `2026-10-0${i + 5}T09:00:00Z`,
          // Only the questions that are the verifier's to settle (the real
          // total leaves out the ones marked "not for verifiers").
          total: mine.filter((q) => outcome.has(q.id) || servable(q)).length,
          done: doneCount,
          remaining: open,
          with_hod: withHod,
        };
      });
    },

    async paperQuestions(paperId): Promise<PaperQuestion[]> {
      await gate();
      const key = PAPER_ORDER.find((k) => PAPERS[k].id === paperId);
      if (!key) throw pgError('42501', 'This paper is not assigned to you');
      return allQuestions
        .filter((q) => paperOf.get(q.id) === key)
        .map((q) => {
          const served = outcome.get(q.id);
          const state: PaperQuestionState = served ?? (servable(q) ? 'to_verify' : 'not_for_verifiers');
          return {
            id: q.id,
            ord: q.ord,
            display_number: q.display_number,
            number_path: null,
            body: q.body,
            options: null,
            marks: q.marks ?? null,
            instructions: null,
            page: typeof q.source?.page === 'number' ? q.source.page : null,
            page_path: null,
            snippet_path: null,
            state,
            version: q.version ?? 1,
          };
        });
    },

    async nextInPaper(paperId) {
      await gate();
      const key = PAPER_ORDER.find((k) => PAPERS[k].id === paperId);
      if (!key) throw pgError('42501', 'This paper is not assigned to you');
      if (api.simulate === 'blank') {
        const blank = queue.find((q) => isBlankBody(q.body) && paperOf.get(q.id) === key);
        if (blank) return decorate({ ...blank });
      }
      // Like 20261007140000: skipped questions come last, the earliest skipped first.
      const open = queue.filter((q) => paperOf.get(q.id) === key && servable(q));
      const next =
        open.find((q) => !skipped.has(q.id)) ??
        [...open].sort((a, b) => (skipOrder.get(a.id) ?? 0) - (skipOrder.get(b.id) ?? 0))[0];
      return next ? decorate(next) : null;
    },

    async myProfile(): Promise<VerifierProfile | null> {
      await gate();
      return { ...myDetails, requested_subjects: requested };
    },

    async setMyProfile(input) {
      await gateSave();
      // Like verifier_set_my_profile: grade 1 to 17 or blank; valid until stays.
      if (input.grade !== null && !isVerifierGrade(input.grade)) throw pgError('22023', 'Grade is out of range');
      myDetails = { ...myDetails, full_name: input.full_name, grade: input.grade, school: input.school, board: input.board };
    },

    async requestSubjects(subjects) {
      await gateSave();
      requested = subjects;
    },

    async myAssignment(): Promise<MyAssignment | null> {
      await gate();
      if (!current) return null;
      const meta = PAPERS[current];
      const here = current;
      const open = queue.filter((q) => paperKey(q) === here && (!isBlankBody(q.body) || lostTextSuggestion(q.body, q.flag_detail) !== null));
      const lined = PAPER_ORDER.filter((k) => k !== here && !returned.has(k) && queue.some((q) => paperKey(q) === k)).length;
      return {
        assignment_id: 1,
        paper_id: meta.id,
        subject: 'Mathematics',
        school: meta.school,
        cls: 'X',
        exam: 'Prelims',
        year: meta.year,
        given_by_hod: meta.givenByHod,
        started_at: new Date().toISOString(),
        done_count: doneByPaper[here] ?? 0,
        remaining_count: open.length,
        queued_count: lined,
      };
    },

    async returnPaper(reason) {
      await gateSave();
      if (current) returned.add(current);
      current = null;
      api.returns.push(reason);
    },

    async paperPages(paperId): Promise<PaperPage[]> {
      await gate();
      if (api.simulate === 'nopages') return [];
      const meta = Object.values(PAPERS).find((p) => p.id === paperId);
      const n = meta?.pages ?? 3;
      return Array.from({ length: n }, (_, i) => ({ page: i + 1, object_path: `pages/${paperId}/${i + 1}.jpg` }));
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
        if (isBlankBody(q.body) && lostTextSuggestion(q.body, q.flag_detail) === null) continue;
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

  function done(id: string, state: PaperQuestionState = 'done') {
    outcome.set(id, state);
    const q = queue.find((x) => x.id === id);
    if (q) {
      const k = paperKey(q);
      doneByPaper[k] = (doneByPaper[k] ?? 0) + 1;
    }
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
    if (api.simulate === 'stale') {
      // Someone else (an AI pass, an admin) saved a newer version meanwhile.
      api.simulate = 'none';
      for (const q of queue) q.version = (q.version ?? 1) + 1;
    }
  }

  function checkVersion(q: CheckerQuestion, seen: number | null | undefined) {
    if (typeof seen === 'number' && q.version != null && seen !== q.version) {
      throw pgError('40001', `stale question: you saw version ${seen}, it is now at version ${q.version}`);
    }
  }

  return api;
}
