import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Browse from './Browse';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

export default function SubjectPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const pathname = location.pathname;
  const filterValue = SUBJECT_PATH_TO_FILTER[pathname];

  if (!filterValue) {
    // Not a subject page, just render Browse
    return <Browse />;
  }

  // Check if user has cleared all filters (no filter params at all)
  // If so, redirect to main browse page for better UX
  const hasAnyFilters = searchParams.has('filter_subjects') || 
                        searchParams.has('filter_classes') || 
                        searchParams.has('filter_boards') ||
                        searchParams.has('filter_classSize') ||
                        searchParams.has('filter_areas') ||
                        searchParams.has('filter_modeOfTeaching') ||
                        searchParams.has('q') ||
                        searchParams.has('subject') ||
                        searchParams.has('class');

  // If all filters are cleared on a subject page, redirect to main browse page
  // This provides a smooth UX - clearing all filters on a subject page returns you to browse
  if (!hasAnyFilters) {
    return <Navigate to="/all-tuition-teachers-in-kolkata" replace />;
  }

  // Only set the initial filter if filter_subjects param is completely missing
  // If it exists (even if different), it means the user has already interacted with filters
  // This ensures SEO on first load while allowing full filter functionality afterward
  if (!searchParams.has('filter_subjects')) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_subjects', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    return <Navigate to={newUrl} replace />;
  }

  // Render Browse page - users can now change filters freely
  // If filter_subjects param exists (even if changed), we don't redirect
  return <Browse />;
}

