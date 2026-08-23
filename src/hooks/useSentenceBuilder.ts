import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, CLASSES, AREAS, BOARDS, type SearchMode } from '@/utils/searchFacets';
import { BROWSE_PATH, PAST_PAPERS_PATH } from '@/lib/nav-config';
import type { SentenceSlot } from '@/components/home/SentenceBuilder';

/* Redesign 09 (00-shared-components.md S-015 "the eyes panel") — the
   sentence-builder state EyesPanel needs (mode, slot values, submit
   routing). Extracted so every page that renders the eyes panel (Join,
   RecommendTeacher in this file's scope) gets the same live-query facets and
   the same submit behaviour, rather than each page re-deriving its own copy.

   schoolOptions is the one query this needs beyond what searchFacets.ts
   already exports statically — the school list is real data, not a fixed
   vocabulary. Result counts are the caller's own concern; EyesPanel's `count`
   prop is simply omitted here since neither Join nor Recommend has a live
   result count to show (design.md §0.10 — never show a zero, and there is no
   query behind "how many teachers/papers" on these two pages). */
export function useSentenceBuilder() {
  const navigate = useNavigate();
  const [builderMode, setBuilderMode] = useState<SearchMode>('teachers');
  const [teacherSlotValues, setTeacherSlotValues] = useState<Record<string, string>>({});
  const [paperSlotValues, setPaperSlotValues] = useState<Record<string, string>>({});

  const schoolOptionsQuery = useQuery({
    queryKey: ['sentence-builder', 'school-options'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase.from('papers').select('school').eq('is_published', true);
      return data ? Array.from(new Set(data.map((p) => p.school))).sort() : [];
    },
  });
  const schoolOptions = useMemo(() => schoolOptionsQuery.data ?? [], [schoolOptionsQuery.data]);

  const teacherSlots: SentenceSlot[] = useMemo(() => ([
    { key: 'subject', placeholder: 'subject', value: teacherSlotValues.subject, options: SUBJECTS },
    { key: 'cls', placeholder: 'class', value: teacherSlotValues.cls, options: CLASSES.map((c) => `Class ${c}`) },
    { key: 'area', placeholder: 'area', value: teacherSlotValues.area, options: AREAS },
  ]), [teacherSlotValues]);

  const paperSlots: SentenceSlot[] = useMemo(() => ([
    { key: 'board', placeholder: 'board', value: paperSlotValues.board, options: BOARDS },
    { key: 'cls', placeholder: 'class', value: paperSlotValues.cls, options: CLASSES.map((c) => `Class ${c}`) },
    { key: 'subject', placeholder: 'subject', value: paperSlotValues.subject, options: SUBJECTS },
    { key: 'school', placeholder: 'school', value: paperSlotValues.school, options: schoolOptions },
  ]), [paperSlotValues, schoolOptions]);

  const handleSlotChange = useCallback((key: string, value: string) => {
    if (builderMode === 'teachers') {
      setTeacherSlotValues((prev) => ({ ...prev, [key]: value }));
    } else {
      setPaperSlotValues((prev) => ({ ...prev, [key]: value }));
    }
  }, [builderMode]);

  const handleSubmit = useCallback(() => {
    if (builderMode === 'teachers') {
      const params = new URLSearchParams();
      if (teacherSlotValues.subject) params.set('filter_subjects', teacherSlotValues.subject);
      if (teacherSlotValues.cls) params.set('filter_classes', teacherSlotValues.cls.replace(/^Class /, ''));
      if (teacherSlotValues.area) params.set('filter_areas', teacherSlotValues.area);
      const qs = params.toString();
      navigate(`${BROWSE_PATH}${qs ? `?${qs}` : ''}`);
    } else {
      const params = new URLSearchParams();
      if (paperSlotValues.board) params.set('filter_boards', paperSlotValues.board);
      if (paperSlotValues.cls) params.set('filter_classes', paperSlotValues.cls.replace(/^Class /, ''));
      if (paperSlotValues.subject) params.set('filter_subjects', paperSlotValues.subject);
      if (paperSlotValues.school) params.set('filter_schools', paperSlotValues.school);
      const qs = params.toString();
      navigate(`${PAST_PAPERS_PATH}/results${qs ? `?${qs}` : ''}`);
    }
  }, [builderMode, teacherSlotValues, paperSlotValues, navigate]);

  return {
    builderMode,
    setBuilderMode,
    slots: builderMode === 'teachers' ? teacherSlots : paperSlots,
    onSlotChange: handleSlotChange,
    onSubmit: handleSubmit,
  };
}
