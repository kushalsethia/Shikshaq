import { useMemo, useLayoutEffect } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Browse from './Browse';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

export default function SubjectPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const pathname = location.pathname;
  const filterValue = SUBJECT_PATH_TO_FILTER[pathname];

  // Check if filter is already in URL
  const currentFilter = searchParams.get('filter_subjects') || '';
  const currentSubjects = currentFilter.split(',').map(s => s.trim()).filter(Boolean);
  const expectedSubjects = filterValue ? filterValue.split(',').map(s => s.trim()).filter(Boolean) : [];
  
  // Check if filters match (order-independent comparison)
  const currentSet = new Set(currentSubjects);
  const expectedSet = new Set(expectedSubjects);
  const isMatch = 
    expectedSubjects.length > 0 &&
    currentSet.size === expectedSet.size && 
    [...currentSet].every(subj => expectedSet.has(subj));

  // If filter is not set, redirect to the same URL with filter added
  // This ensures the filter is in the URL before Browse initializes
  if (filterValue && !isMatch) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_subjects', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    return <Navigate to={newUrl} replace />;
  }

  // Render Browse page with filter already in URL
  return <Browse />;
}

