/* Handoff H-005 — the home hero's copy resolver.
   One pure function, no new query: branches 1-2 read the useAuth() profile
   the page already holds, 3-5 read localStorage keys the app already writes
   (or should — see the note below), 6 is a session-stable random pool.

   ⚠ Branches 3-5 read `shikshaq.lastSearch` / `shikshaq.lastViewedTeacher` /
   `shikshaq.lastPaperSubject` from localStorage. The changelog describes these
   as "already written by the app" — a repo-wide grep found no writer for any
   of the three, so until something writes them these branches simply never
   fire (harmless: resolution falls through to 6). Flagged rather than
   invented a writer, since adding one is a behavioural change H-005 doesn't
   ask for.
   ⚠ Branch 1b's copy calls for a gendered pronoun ("message her/him?") that
   the app has no reliable source for; "message them?" is used instead rather
   than guessing a gender. */

export type HeroMode = 'teachers' | 'papers';
export type HeroChip = 'avatar' | 'stripe' | 'cover' | null;

export interface HeroCopy {
  eyebrow: string;
  /** Plain text before the bold span. */
  before: string;
  /** The single font-extrabold span. */
  bold: string;
  /** Plain text after it. */
  after: string;
  chip: HeroChip;
  mode: HeroMode;
}

interface LastSearch {
  subject?: string;
  classLevel?: string;
  area?: string;
  at: number;
}
interface LastViewedTeacher {
  name?: string;
  subject?: string;
  area?: string;
  at: number;
}
interface LastPaperSubject {
  board?: string;
  subject?: string;
  count?: number;
  at: number;
}

export interface ResolveHeroCopyInput {
  profile: { full_name?: string | null } | null | undefined;
  /** From useLikes().likedCount. */
  likedCount: number;
  /**
   * Only meaningful when likedCount === 1. The caller resolves this from
   * whatever teacher data the page already holds (e.g. the featured list) —
   * H-005 adds no new query, so when the single liked teacher isn't already
   * in hand this is left undefined and branch 1b falls through to 2.
   */
  likedSingleTeacherName?: string | null;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_KEY = 'shikshaq.heroLine';

const POOL: Array<{ before: string; bold: string; after: string }> = [
  { before: 'Who is ', bold: 'teaching your child', after: ' this term?' },
  { before: "Tell us the subject. ", bold: "We'll show you who teaches it", after: ' nearby.' },
  { before: 'Every tutor here is ', bold: 'someone a parent already met', after: '.' },
  { before: 'Find the teacher, ', bold: 'message them yourself', after: '. No agent in between.' },
  { before: 'Which subject is ', bold: 'giving you trouble', after: ' this year?' },
  { before: 'Start where most parents start: ', bold: 'a name and an area', after: '.' },
];

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isFresh(at: number | undefined): boolean {
  return typeof at === 'number' && Date.now() - at < THIRTY_DAYS_MS;
}

// H-005a rule 4: counts under ten are spelled out.
const SPELLED = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
function spellOut(n: number): string {
  return n < 10 ? SPELLED[n] : String(n);
}

function greetingTime(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function weekday(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

/** Draws the branch-6 pool index once per session (sessionStorage), so the
 *  line never changes on re-render or client-side nav back home. */
function sessionPoolIndex(): number {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    const parsed = stored === null ? NaN : Number(stored);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < POOL.length) return parsed;
    const index = Math.floor(Math.random() * POOL.length);
    sessionStorage.setItem(SESSION_KEY, String(index));
    return index;
  } catch {
    return 0;
  }
}

export function resolveHeroCopy({ profile, likedCount, likedSingleTeacherName }: ResolveHeroCopyInput): HeroCopy {
  const name = profile?.full_name ? firstNameOf(profile.full_name) : null;

  // Branch 1 — signed in, multiple saved teachers.
  if (name && likedCount > 1) {
    return {
      eyebrow: 'Your shortlist',
      before: `${name}, `,
      bold: `${spellOut(likedCount)} saved tutors`,
      after: " haven't heard from you yet",
      chip: 'stripe',
      mode: 'teachers',
    };
  }

  // Branch 1b — signed in, exactly one saved teacher whose name is in hand.
  if (name && likedCount === 1 && likedSingleTeacherName) {
    return {
      eyebrow: 'Your shortlist',
      before: `${name}, you saved `,
      bold: likedSingleTeacherName,
      after: ' — message them?',
      chip: 'stripe',
      mode: 'teachers',
    };
  }

  // Branch 2 — signed in, name known.
  if (name) {
    return {
      eyebrow: `${weekday()} ${greetingTime()}`,
      before: `Hello \u{1F44B} ${name}, `,
      bold: 'what are we finding',
      after: ' today?',
      chip: 'avatar',
      mode: 'teachers',
    };
  }

  // Branch 3 — recent search, fresh and complete.
  const lastSearch = readJSON<LastSearch>('shikshaq.lastSearch');
  if (lastSearch && isFresh(lastSearch.at) && lastSearch.subject && lastSearch.area) {
    const subjectClass = lastSearch.classLevel ? `${lastSearch.subject} ${lastSearch.classLevel}` : lastSearch.subject;
    return {
      eyebrow: 'Where you left off',
      before: 'Still looking for ',
      bold: subjectClass,
      after: ` in ${lastSearch.area}?`,
      chip: 'avatar',
      mode: 'teachers',
    };
  }

  // Branch 4 — recently viewed teacher.
  const lastViewedTeacher = readJSON<LastViewedTeacher>('shikshaq.lastViewedTeacher');
  if (lastViewedTeacher && isFresh(lastViewedTeacher.at) && lastViewedTeacher.name) {
    return {
      eyebrow: 'Where you left off',
      before: 'You looked at ',
      bold: lastViewedTeacher.name,
      after: ' last time. Still deciding?',
      chip: 'stripe',
      mode: 'teachers',
    };
  }

  // Branch 5 — recent paper subject.
  const lastPaperSubject = readJSON<LastPaperSubject>('shikshaq.lastPaperSubject');
  if (lastPaperSubject && isFresh(lastPaperSubject.at) && lastPaperSubject.board && lastPaperSubject.subject) {
    return {
      eyebrow: 'Past papers',
      before: 'Two papers open in ',
      bold: `${lastPaperSubject.board} ${lastPaperSubject.subject}`,
      after: '. Want a tutor for it?',
      chip: 'cover',
      mode: 'papers',
    };
  }

  // Branch 6 — the pool, resolved once per session.
  const line = POOL[sessionPoolIndex()];
  return {
    eyebrow: 'Tuition in Kolkata',
    before: line.before,
    bold: line.bold,
    after: line.after,
    chip: 'avatar',
    mode: 'teachers',
  };
}
