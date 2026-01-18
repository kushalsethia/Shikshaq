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

  // First, set the initial filter if filter_subjects param is completely missing
  // This handles the initial load from footer links (SEO)
  if (!searchParams.has('filter_subjects')) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_subjects', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    return <Navigate to={newUrl} replace />;
  }

  // After initial filter is set, check if user has cleared all filters
  // This handles the "clear filters" button case - redirect to browse page
  const hasAnyOtherFilters = searchParams.has('filter_classes') || 
                             searchParams.has('filter_boards') ||
                             searchParams.has('filter_classSize') ||
                             searchParams.has('filter_areas') ||
                             searchParams.has('filter_modeOfTeaching') ||
                             searchParams.has('q') ||
                             searchParams.has('subject') ||
                             searchParams.has('class');

  // If filter_subjects was removed (user cleared it) and no other filters exist,
  // redirect to main browse page for better UX
  const currentSubjects = searchParams.get('filter_subjects');
  if (!currentSubjects || currentSubjects.trim() === '') {
    if (!hasAnyOtherFilters) {
      return <Navigate to="/all-tuition-teachers-in-kolkata" replace />;
    }
  }

  // Render Browse page - users can now change filters freely
  // If filter_subjects param exists (even if changed), we don't redirect
  return <Browse />;
}

