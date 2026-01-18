import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Browse from './Browse';

// Map of subject path slugs to subject filter values
// Special cases:
// - Science maps to Physics, Chemistry, Biology (comma-separated = OR logic)
// - Commercial Studies maps to Commerce
const SUBJECT_PATH_TO_FILTER: Record<string, string> = {
  '/maths-tuition-teachers-in-kolkata': 'Maths',
  '/english-tuition-teachers-in-kolkata': 'English',
  '/science-tuition-teachers-in-kolkata': 'Physics,Chemistry,Biology', // Science = Physics OR Chemistry OR Biology
  '/commercial-studies-tuition-teachers-in-kolkata': 'Commerce', // Commercial Studies = Commerce
  '/physics-tuition-teachers-in-kolkata': 'Physics',
  '/chemistry-tuition-teachers-in-kolkata': 'Chemistry',
  '/biology-tuition-teachers-in-kolkata': 'Biology',
  '/computer-tuition-teachers-in-kolkata': 'Computer',
  '/hindi-tuition-teachers-in-kolkata': 'Hindi',
  '/history-tuition-teachers-in-kolkata': 'History & Civics', // Note: FilterPanel uses 'History & Civics'
  '/geography-tuition-teachers-in-kolkata': 'Geography',
  '/economics-tuition-teachers-in-kolkata': 'Economics',
  '/accounts-tuition-teachers-in-kolkata': 'Accounts',
  '/business-studies-tuition-teachers-in-kolkata': 'Business Studies',
  '/commerce-tuition-teachers-in-kolkata': 'Commerce',
  '/psychology-tuition-teachers-in-kolkata': 'Psychology',
  '/sociology-tuition-teachers-in-kolkata': 'Sociology',
  '/political-science-tuition-teachers-in-kolkata': 'Political Science',
  '/environmental-science-tuition-teachers-in-kolkata': 'Environmental Science',
  '/bengali-tuition-teachers-in-kolkata': 'Bengali',
  '/drawing-tuition-teachers-in-kolkata': 'Drawing',
  '/sat-tuition-teachers-in-kolkata': 'SAT',
  '/act-tuition-teachers-in-kolkata': 'ACT',
  '/cat-tuition-teachers-in-kolkata': 'CAT',
  '/nmat-tuition-teachers-in-kolkata': 'NMAT',
  '/gmat-tuition-teachers-in-kolkata': 'GMAT',
  '/ca-tuition-teachers-in-kolkata': 'CA',
  '/cfa-tuition-teachers-in-kolkata': 'CFA',
};

export default function SubjectPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
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
      
      // If filter is not set correctly, update it
      if (!isMatch) {
        const newSearchParams = new URLSearchParams(searchParams);
        // Set the subject filter (replace any existing subject filters for this page)
        newSearchParams.set('filter_subjects', filterValue);
        // Preserve other filters if needed
        setSearchParams(newSearchParams, { replace: true });
      }
    }
  }, [location.pathname, searchParams, setSearchParams]);

  // Render Browse page (which will automatically use the filter_subjects param)
  return <Browse />;
}

