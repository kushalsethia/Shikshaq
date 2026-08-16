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

async function loadIndex(): Promise<void> {
  const [teachersRes, papersRes] = await Promise.all([
    supabase
      .from('teachers_list')
      .select('id,name,slug,subjects,location,honorific')
      .limit(500),
    supabase
      .from('papers')
      .select('id,title,school,subject,class,board,exam_type,year,file_url')
      .eq('is_published', true)
      .order('year', { ascending: false })
      .limit(500),
  ]);

  teachersCache = teachersRes.data ?? [];
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
