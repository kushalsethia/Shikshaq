import { useCallback, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { supabase } from '@/integrations/supabase/client';

export interface TeacherHit {
  id: string;
  name: string;
  slug: string;
  subjects: string | null;
  location: string | null;
  honorific: string | null;
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
  const [teachersRes, papersRes] = await Promise.all([
    supabase
      .from('teachers_list')
      .select('id,name,slug,subjects,location,honorific')
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
    const { data: pausedRows, error: pausedError } = await (supabase
      .from('Shikshaqmine')
      .select('Slug') as any)
      .eq('is_paused', true);
    if (pausedError && import.meta.env.DEV) {
      console.warn('Search index: pause filter skipped —', pausedError.message);
    }
    const pausedSlugs = new Set((pausedRows ?? []).map((r: any) => r.Slug));
    if (pausedSlugs.size > 0) {
      teachersData = teachersData.filter((t) => !pausedSlugs.has(t.slug));
    }
  }

  teachersCache = teachersData;
  papersCache = papersRes.data ?? [];
}

export function invalidateSearchIndexCache() {
  teachersCache = null;
  papersCache = null;
  loadPromise = null;
}

const RESULT_LIMIT = 3;

export function useSearchIndex() {
  const [ready, setReady] = useState(teachersCache !== null && papersCache !== null);
  const [schools, setSchools] = useState<string[]>(
    papersCache ? Array.from(new Set(papersCache.map((p) => p.school))).sort() : []
  );
  const teachersFuse = useRef<Fuse<TeacherHit> | null>(null);
  const papersFuse = useRef<Fuse<PaperHit> | null>(null);

  const buildFuseIndexes = useCallback(() => {
    teachersFuse.current = new Fuse(teachersCache ?? [], {
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
      keys: ['name', 'subjects', 'location'],
    });
    papersFuse.current = new Fuse(papersCache ?? [], {
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
      keys: ['title', 'school', 'subject'],
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

  return { ensureLoaded, search, ready, schools };
}
