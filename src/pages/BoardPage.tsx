import { useRef, useEffect } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Browse from './Browse';
import { BOARD_PATH_TO_FILTER } from '@/utils/boardMapping';

const BOARD_SEO: Record<string, { title: string; description: string }> = {
  '/cbse-ncert-tuition-teachers-in-kolkata': {
    title: 'CBSE Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find verified CBSE/NCERT tuition teachers in Kolkata for Classes 1–12. Maths, Science, English, Social Studies, and more. Connect directly for free on Shikshaq.',
  },
  '/icse-tuition-teachers-in-kolkata': {
    title: 'ICSE Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find verified ICSE and ISC tuition teachers in Kolkata for Classes 1–12. Connect directly with local tutors for free on Shikshaq — no commission.',
  },
  '/igcse-tuition-teachers-in-kolkata': {
    title: 'IGCSE Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find IGCSE tuition teachers in Kolkata for Cambridge International curriculum. Connect directly with experienced educators for free on Shikshaq.',
  },
  '/international-board-tuition-teachers-in-kolkata': {
    title: 'IB Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find IB (International Baccalaureate) MYP and DP tuition teachers in Kolkata. Connect directly for free on Shikshaq — no commission, no middlemen.',
  },
  '/state-board-tuition-teachers-in-kolkata': {
    title: 'State Board Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find West Bengal State Board tuition teachers in Kolkata for Secondary and Higher Secondary. Connect directly for free on Shikshaq.',
  },
};

export default function BoardPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hasSetInitialFilterRef = useRef(false);

  const pathname = location.pathname;
  const filterValue = BOARD_PATH_TO_FILTER[pathname];

  useEffect(() => {
    const seo = BOARD_SEO[pathname];
    if (!seo) return;

    document.title = seo.title;

    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDesc) metaDesc.setAttribute('content', seo.description);

    // Canonical is handled globally by <CanonicalTag>, keyed on pathname.
    return () => {
      document.title = 'Shikshaq - Find Tuition Teachers in Kolkata';
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Find verified tuition teachers in Kolkata for free. Search by subject, class, board, and area. Connect directly with local tutors for CBSE, ICSE, IGCSE, IB, State Board — no commission, no middlemen.');
      }
    };
  }, [pathname]);

  if (!filterValue) {
    return <Browse manageSeo={!BOARD_SEO[pathname]} />;
  }

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

  if (hasSetInitialFilterRef.current && !hasAnyParams) {
    return <Navigate to="/all-tuition-teachers-in-kolkata" replace />;
  }

  if (!filterBoardsExists) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_boards', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    hasSetInitialFilterRef.current = true;
    return <Navigate to={newUrl} replace />;
  }

  if (!hasSetInitialFilterRef.current) {
    hasSetInitialFilterRef.current = true;
  }

  return <Browse manageSeo={!BOARD_SEO[pathname]} />;
}
