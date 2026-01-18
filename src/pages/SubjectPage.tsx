import { useLayoutEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Browse from './Browse';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

export default function SubjectPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Use useLayoutEffect to set filter synchronously before Browse renders
  // This prevents flicker and ensures the filter is set immediately
  useLayoutEffect(() => {
    const pathname = location.pathname;
    const filterValue = SUBJECT_PATH_TO_FILTER[pathname];

    if (filterValue) {
      // Check if the filter is already set correctly
      const currentFilter = searchParams.get('filter_subjects') || '';
      const currentSubjects = currentFilter.split(',').map(s => s.trim()).filter(Boolean);
      const expectedSubjects = filterValue.split(',').map(s => s.trim()).filter(Boolean);
      
      // Check if filters match (order-independent comparison)
      const currentSet = new Set(currentSubjects);
      const expectedSet = new Set(expectedSubjects);
      const isMatch = 
        currentSet.size === expectedSet.size && 
        [...currentSet].every(subj => expectedSet.has(subj));
      
      // If filter is not set correctly, update it synchronously
      if (!isMatch) {
        const newSearchParams = new URLSearchParams(searchParams);
        // Set the subject filter (replace any existing subject filters for this page)
        newSearchParams.set('filter_subjects', filterValue);
        // Use replace: true to avoid adding to history and keep URL clean
        setSearchParams(newSearchParams, { replace: true });
      }
    }
    // Only run on mount/pathname change, not on every searchParams change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Render Browse page (which will automatically use the filter_subjects param)
  return <Browse />;
}

