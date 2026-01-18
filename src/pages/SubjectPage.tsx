import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Browse from './Browse';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

export default function SubjectPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const pathname = location.pathname;
  const filterValue = SUBJECT_PATH_TO_FILTER[pathname];

  // Only set the initial filter if filter_subjects param is completely missing
  // If it exists (even if different), it means the user has already interacted with filters
  // This ensures SEO on first load while allowing full filter functionality afterward
  if (filterValue && !searchParams.has('filter_subjects')) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_subjects', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    return <Navigate to={newUrl} replace />;
  }

  // Render Browse page - users can now change filters freely
  // If filter_subjects param exists (even if changed), we don't redirect
  return <Browse />;
}

