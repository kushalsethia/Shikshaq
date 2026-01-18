import { useRef } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Browse from './Browse';
import { BOARD_PATH_TO_FILTER } from '@/utils/boardMapping';

export default function BoardPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hasSetInitialFilterRef = useRef(false);
  
  const pathname = location.pathname;
  const filterValue = BOARD_PATH_TO_FILTER[pathname];

  if (!filterValue) {
    // Not a board page, just render Browse
    return <Browse />;
  }

  // Track if we've already set the initial filter during this component's lifecycle
  // This helps us distinguish between "initial load" vs "filters were cleared"
  const filterBoardsExists = searchParams.has('filter_boards');
  const hasAnyParams = filterBoardsExists || 
                       searchParams.has('filter_subjects') || 
                       searchParams.has('filter_classes') ||
                       searchParams.has('filter_classSize') ||
                       searchParams.has('filter_areas') ||
                       searchParams.has('filter_modeOfTeaching') ||
                       searchParams.has('q') ||
                       searchParams.has('subject') ||
                       searchParams.has('class');

  // If user cleared all filters (we had set initial filter before, but now all params are gone)
  // Redirect to browse page
  if (hasSetInitialFilterRef.current && !hasAnyParams) {
    return <Navigate to="/all-tuition-teachers-in-kolkata" replace />;
  }

  // First, set the initial filter if filter_boards param is completely missing
  // This handles the initial load from footer links (SEO)
  if (!filterBoardsExists) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_boards', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    hasSetInitialFilterRef.current = true;
    return <Navigate to={newUrl} replace />;
  }

  // Mark that we've set the initial filter (either just now or it was already there)
  if (!hasSetInitialFilterRef.current) {
    hasSetInitialFilterRef.current = true;
  }

  // Render Browse page - users can now change filters freely
  // If filter_boards param exists (even if changed), we don't redirect
  return <Browse />;
}

