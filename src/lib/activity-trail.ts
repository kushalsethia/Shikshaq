/* The writers behind H-005's "where you left off" hero branches.

   `hero-copy.ts` branches 3-5 read `shikshaq.lastSearch`,
   `shikshaq.lastViewedTeacher` and `shikshaq.lastPaperSubject` from
   localStorage. The changelog described those keys as "already written by the
   app"; nothing wrote any of them, so three of the six hero branches could
   never fire and every visitor fell through to the branch-6 pool. This module
   is those writers, and nothing more — the shapes and the key names are the
   ones hero-copy.ts already reads, so the two must stay in step.

   Deliberately localStorage, not a profile row: this is a convenience, it is
   worthless to us on a server, and a signed-out reader should get it too.
   Nothing here is sent anywhere. Every write is wrapped, because Safari's
   private mode throws on setItem and a greeting is never worth an exception. */

const LAST_SEARCH = 'shikshaq.lastSearch';
const LAST_TEACHER = 'shikshaq.lastViewedTeacher';
const LAST_PAPER = 'shikshaq.lastPaperSubject';

function write(key: string, value: Record<string, unknown>): void {
  try {
    localStorage.setItem(key, JSON.stringify({ ...value, at: Date.now() }));
  } catch {
    /* Private mode, quota, or storage disabled — the hero falls through to its
       pool branch, which is a fine outcome and not worth surfacing. */
  }
}

/** Branch 3. Only recorded when there is something to say it back with:
 *  the branch needs BOTH a subject and an area, so a bare keyword search
 *  writes nothing rather than storing a half-line the hero can't use. */
export function recordSearch(input: {
  subject?: string | null;
  classLevel?: string | null;
  area?: string | null;
}): void {
  const subject = input.subject?.trim();
  const area = input.area?.trim();
  if (!subject || !area) return;
  write(LAST_SEARCH, {
    subject,
    area,
    classLevel: input.classLevel?.trim() || undefined,
  });
}

/** Branch 4. Name is the only field the branch requires; subject and area
 *  ride along because they cost nothing and future copy may want them.
 *  slug/imageUrl let the hero link straight to this teacher's own profile
 *  and show this teacher's own photo — without them the hero either falls
 *  back to a name search (can land on a different teacher) or, worse,
 *  another teacher's photo next to this one's name. */
export function recordViewedTeacher(input: {
  name?: string | null;
  subject?: string | null;
  area?: string | null;
  slug?: string | null;
  imageUrl?: string | null;
}): void {
  const name = input.name?.trim();
  if (!name) return;
  write(LAST_TEACHER, {
    name,
    subject: input.subject?.trim() || undefined,
    area: input.area?.trim() || undefined,
    slug: input.slug?.trim() || undefined,
    imageUrl: input.imageUrl || undefined,
  });
}

/** Branch 5. Needs both board and subject to read as a sentence. */
export function recordPaperSubject(input: {
  board?: string | null;
  subject?: string | null;
  count?: number;
}): void {
  const board = input.board?.trim();
  const subject = input.subject?.trim();
  if (!board || !subject) return;
  write(LAST_PAPER, { board, subject, count: input.count });
}

export interface ActivityTrail {
  teacherName: string | null;
  searchSubject: string | null;
  searchArea: string | null;
  paperBoard: string | null;
  paperSubject: string | null;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
function fresh(at: unknown): boolean {
  return typeof at === 'number' && Date.now() - at < THIRTY_DAYS_MS;
}

/** What the trail knows right now, for surfaces other than the hero (the
 *  footer sign-off). Same freshness window hero-copy.ts uses, so the two
 *  never disagree about whether a visit still counts. */
export function readActivityTrail(): ActivityTrail {
  const s = read<{ subject?: string; area?: string; at?: number }>(LAST_SEARCH);
  const t = read<{ name?: string; at?: number }>(LAST_TEACHER);
  const p = read<{ board?: string; subject?: string; at?: number }>(LAST_PAPER);
  return {
    teacherName: t && fresh(t.at) ? t.name ?? null : null,
    searchSubject: s && fresh(s.at) ? s.subject ?? null : null,
    searchArea: s && fresh(s.at) ? s.area ?? null : null,
    paperBoard: p && fresh(p.at) ? p.board ?? null : null,
    paperSubject: p && fresh(p.at) ? p.subject ?? null : null,
  };
}
