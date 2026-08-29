import { useCallback, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { supabase } from '@/integrations/supabase/client';
import { loadPaperIndex, hasYear, schoolLabel } from '@/lib/question-bank';

export interface TeacherHit {
  id: string;
  name: string;
  slug: string;
  subjects: string | null;
  location: string | null;
  honorific: string | null;
  is_featured: boolean | null;
}

export interface PaperHit {
  id: string;
  title: string;
  school: string;
  subject: string;
  class: string;
  board: string;
  exam_type: string;
  year: number;
  file_url: string | null;
}

export interface SearchGroups {
  teachers: TeacherHit[];
  papers: PaperHit[];
  teachersTotal: number;
  papersTotal: number;
}

// Module-level cache so every mount of the search control shares one fetch per page session.
let teachersCache: TeacherHit[] | null = null;
let papersCache: PaperHit[] | null = null;
let loadPromise: Promise<void> | null = null;

// Raised from 500 (which had no ORDER BY, so which 500 rows you got — and therefore which
// teachers were searchable at all — was undefined) to 2000, with a deterministic order so the
// same rows are always included. 2000 is the practical ceiling for teachers searchable via the
// name/subject/location Fuse index today; past that, teachers again become unsearchable and this
// cap would need to be paginated properly (mirroring Browse.tsx's paginated fetch).
const TEACHER_INDEX_LIMIT = 2000;
const PAPER_INDEX_LIMIT = 500;

async function loadIndex(): Promise<void> {
  const [teachersRes, papersRes, bankRes] = await Promise.all([
    supabase
      .from('teachers_list')
      .select('id,name,slug,subjects,location,honorific,is_featured')
      .order('name', { ascending: true })
      .order('id', { ascending: true })
      .limit(TEACHER_INDEX_LIMIT),
    supabase
      .from('papers')
      .select('id,title,school,subject,class,board,exam_type,year,file_url')
      .eq('is_published', true)
      .order('year', { ascending: false })
      .order('id', { ascending: true })
      .limit(PAPER_INDEX_LIMIT),
    /* The question bank was invisible to search: 193 papers you could reach
       from /past-papers but could not find by typing their school's name.
       It is the light 31KB index, not the 2.5MB bank, and it is caught on its
       own so a bank failure costs the bank rows and never the whole index. */
    loadPaperIndex().catch(() => []),
  ]);

  let teachersData = teachersRes.data ?? [];

  // Exclude paused listings (Shikshaqmine.is_paused — the self-service pause toggle teachers
  // flip from their dashboard). is_paused IS live (migration
  // 20260816160605_add_is_paused_to_shikshaqmine, boolean not null default false, confirmed
  // against the running database) — the fail-soft handling below is not compensating for a
  // missing column any more. It stays anyway: this is a separate, isolated query specifically
  // so a pause-filter failure of ANY kind (RLS, a future rename, a transient error) costs only
  // the pause filter and never the search index itself. Do NOT merge this column into the main
  // teachers select; doing that in Browse rejected the whole query and wiped out all teacher
  // data — that failure mode has nothing to do with whether the column exists.
  if (teachersData.length > 0) {
    const { data: pausedRows, error: pausedError } = await supabase
      .from('Shikshaqmine')
      .select('Slug')
      .eq('is_paused', true)
      .returns<{ Slug: string | null }[]>();
    if (pausedError && import.meta.env.DEV) {
      console.warn('Search index: pause filter skipped:', pausedError.message);
    }
    const pausedSlugs = new Set((pausedRows ?? []).map((r) => r.Slug));
    if (pausedSlugs.size > 0) {
      teachersData = teachersData.filter((t) => !pausedSlugs.has(t.slug));
    }
  }

  teachersCache = teachersData;

  /* Mapped exactly as PastPapers maps them, so a paper found by search and the
     same paper found by browsing read identically. */
  const bankHits: PaperHit[] = (bankRes ?? []).map((b) => ({
    id: b.id,
    title: `Class ${b.cls} Mathematics`,
    school: schoolLabel(b.school),
    subject: 'Maths',
    class: b.cls,
    board: b.board,
    exam_type: b.exam,
    year: hasYear(b.year) ? Number(String(b.year).slice(0, 4)) : 0,
    file_url: null,
  }));
  papersCache = [...(papersRes.data ?? []), ...bankHits];
}

export function invalidateSearchIndexCache() {
  teachersCache = null;
  papersCache = null;
  loadPromise = null;
}

const RESULT_LIMIT = 3;
const SUGGEST_LIMIT = 4;

export function useSearchIndex() {
  const [ready, setReady] = useState(teachersCache !== null && papersCache !== null);
  const [schools, setSchools] = useState<string[]>(
    papersCache ? Array.from(new Set(papersCache.map((p) => p.school))).sort() : []
  );
  const teachersFuse = useRef<Fuse<TeacherHit> | null>(null);
  const papersFuse = useRef<Fuse<PaperHit> | null>(null);

  const buildFuseIndexes = useCallback(() => {
    /* ignoreLocation is the important one. Fuse defaults to location 0 with a
       distance of 100, meaning it scores a match by how near the START of the
       field it is -- so "Computer" sitting 40 characters into a teacher's
       "Physics, Chemistry, Biology, Mathematics, Computer Science" was scored
       almost out of existence. These are lists and titles, not prose: where a
       word sits in them carries no meaning, so position should not be scored.

       Weights then decide what a match is worth once found. A name match is
       what someone typing "Rekha" wants; an area match for the same letters is
       a weaker signal, and without weights Fuse treated them as equal. */
    teachersFuse.current = new Fuse(teachersCache ?? [], {
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
      ignoreLocation: true,
      keys: [
        { name: 'name', weight: 3 },
        { name: 'subjects', weight: 2 },
        { name: 'location', weight: 1 },
      ],
    });
    /* board/exam_type/year were not searchable at all, so "ICSE 2024" and
       "prelim" matched nothing however many such papers existed. */
    papersFuse.current = new Fuse(papersCache ?? [], {
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
      ignoreLocation: true,
      keys: [
        { name: 'school', weight: 3 },
        { name: 'title', weight: 2 },
        { name: 'subject', weight: 2 },
        { name: 'board', weight: 1 },
        { name: 'exam_type', weight: 1 },
        /* Fuse only matches strings; a numeric year would be read as no
           value at all, so this key would have matched nothing at all. */
        { name: 'year', weight: 1, getFn: (p: PaperHit) => (p.year ? String(p.year) : '') },
      ],
    });
  }, []);

  if ((teachersCache !== null && papersCache !== null) && !teachersFuse.current) {
    buildFuseIndexes();
  }

  const ensureLoaded = useCallback(async () => {
    if (teachersCache !== null && papersCache !== null) {
      if (!teachersFuse.current) buildFuseIndexes();
      setReady(true);
      return;
    }
    if (!loadPromise) loadPromise = loadIndex();
    await loadPromise;
    buildFuseIndexes();
    setSchools(Array.from(new Set((papersCache ?? []).map((p) => p.school))).sort());
    setReady(true);
  }, [buildFuseIndexes]);

  const search = useCallback((query: string): SearchGroups => {
    const q = query.trim();
    if (!q || q.length < 2 || !teachersFuse.current || !papersFuse.current) {
      return { teachers: [], papers: [], teachersTotal: 0, papersTotal: 0 };
    }
    const teacherResults = teachersFuse.current.search(q).map((r) => r.item);
    const paperResults = papersFuse.current.search(q).map((r) => r.item);
    return {
      teachers: teacherResults.slice(0, RESULT_LIMIT),
      papers: paperResults.slice(0, RESULT_LIMIT),
      teachersTotal: teacherResults.length,
      papersTotal: paperResults.length,
    };
  }, []);

  // Resting-state suggestions — shown before the user has typed anything.
  // Both flavors reuse data already fetched for the index rather than a
  // separate query: `is_featured` is the same column Browse.tsx's "Featured
  // teachers" shelf reads (real, human-curated, not derived from search
  // activity), and papersCache is already ordered newest-year-first, so its
  // head is "recently relevant" papers with no extra sorting needed.
  /* Curated first, but never an empty shelf while real teachers exist. No row
     in this database has `is_featured` set, so the strict filter returned
     nothing and the resting control showed papers with no teachers beside
     them — telling you less than typing one letter did. The fallback is still
     real data off the same cache, just uncurated, so nothing is fabricated. */
  const featuredTeachers = useMemo(
    () => {
      const all = teachersCache ?? [];
      const curated = all.filter((t) => t.is_featured);
      return (curated.length > 0 ? curated : all).slice(0, SUGGEST_LIMIT);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready]
  );
  const recentPapers = useMemo(
    () => (papersCache ?? []).slice(0, SUGGEST_LIMIT),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready]
  );

  return { ensureLoaded, search, ready, schools, featuredTeachers, recentPapers };
}
