import { useRef, useEffect } from 'react';
import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Browse from './Browse';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';

const SUBJECT_SEO: Record<string, { title: string; description: string }> = {
  '/maths-tuition-teachers-in-kolkata': {
    title: 'Maths Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find experienced Maths tutors in Kolkata for CBSE, ICSE, IGCSE, State Board, and JEE preparation. Connect directly for free — no commission, no middlemen.',
  },
  '/english-tuition-teachers-in-kolkata': {
    title: 'English Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find English tutors in Kolkata for all boards and classes. Language, literature, grammar, and writing skills. Connect directly for free on Shikshaq.',
  },
  '/science-tuition-teachers-in-kolkata': {
    title: 'Science Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Science tutors in Kolkata covering Physics, Chemistry, and Biology for Classes 6–12. CBSE, ICSE, IGCSE, and State Board. Free on Shikshaq.',
  },
  '/physics-tuition-teachers-in-kolkata': {
    title: 'Physics Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Physics tutors in Kolkata for Classes 9–12 and JEE preparation. CBSE, ICSE, IGCSE, and State Board. Connect directly for free on Shikshaq.',
  },
  '/chemistry-tuition-teachers-in-kolkata': {
    title: 'Chemistry Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Chemistry tutors in Kolkata for Classes 9–12 and JEE/NEET preparation. CBSE, ICSE, IGCSE, and State Board. Connect directly for free on Shikshaq.',
  },
  '/biology-tuition-teachers-in-kolkata': {
    title: 'Biology Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Biology tutors in Kolkata for Classes 9–12 and NEET preparation. CBSE, ICSE, IGCSE, and State Board. Connect directly for free on Shikshaq.',
  },
  '/computer-tuition-teachers-in-kolkata': {
    title: 'Computer Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Computer Science tutors in Kolkata for programming (Python, Java, C++), IT fundamentals, and school curricula. Free on Shikshaq.',
  },
  '/hindi-tuition-teachers-in-kolkata': {
    title: 'Hindi Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Hindi language and literature tutors in Kolkata for CBSE, ICSE, and IGCSE students. Connect directly for free on Shikshaq.',
  },
  '/history-tuition-teachers-in-kolkata': {
    title: 'History Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find History tutors in Kolkata for Indian and world history, Classes 6–12. CBSE, ICSE, and State Board. Connect directly for free on Shikshaq.',
  },
  '/geography-tuition-teachers-in-kolkata': {
    title: 'Geography Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Geography tutors in Kolkata for physical and human geography, Classes 6–12. CBSE, ICSE, and State Board. Connect directly for free on Shikshaq.',
  },
  '/economics-tuition-teachers-in-kolkata': {
    title: 'Economics Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Economics tutors in Kolkata for micro and macro economics, Classes 11–12, and competitive exams. Connect directly for free on Shikshaq.',
  },
  '/accounts-tuition-teachers-in-kolkata': {
    title: 'Accounts Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Accounts tutors in Kolkata for Classes 11–12 and CA preparation. CBSE, ICSE, and State Board. Connect directly for free on Shikshaq.',
  },
  '/business-studies-tuition-teachers-in-kolkata': {
    title: 'Business Studies Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Business Studies tutors in Kolkata for Classes 11–12 across all boards. Connect directly for free on Shikshaq.',
  },
  '/commerce-tuition-teachers-in-kolkata': {
    title: 'Commerce Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Commerce tutors in Kolkata covering Accounts, Economics, and Business Studies for Classes 11–12. Connect directly for free on Shikshaq.',
  },
  '/commercial-studies-tuition-teachers-in-kolkata': {
    title: 'Commercial Studies Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Commercial Studies tutors in Kolkata. Practical business education and commercial applications. Connect directly for free on Shikshaq.',
  },
  '/psychology-tuition-teachers-in-kolkata': {
    title: 'Psychology Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Psychology tutors in Kolkata for IGCSE, IB, and Class 11–12. Behavioural sciences and introduction to psychology. Connect directly for free on Shikshaq.',
  },
  '/sociology-tuition-teachers-in-kolkata': {
    title: 'Sociology Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Sociology tutors in Kolkata for Classes 11–12. Social structures, culture, and society. Connect directly for free on Shikshaq.',
  },
  '/political-science-tuition-teachers-in-kolkata': {
    title: 'Political Science Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Political Science tutors in Kolkata for Indian polity and international relations, Classes 11–12. Connect directly for free on Shikshaq.',
  },
  '/environmental-science-tuition-teachers-in-kolkata': {
    title: 'Environmental Science Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Environmental Science tutors in Kolkata for primary and middle school students. Connect directly for free on Shikshaq.',
  },
  '/bengali-tuition-teachers-in-kolkata': {
    title: 'Bengali Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Bengali language tutors in Kolkata for CBSE, ICSE, and West Bengal State Board students. Connect directly for free on Shikshaq.',
  },
  '/drawing-tuition-teachers-in-kolkata': {
    title: 'Drawing Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find Drawing and Painting tutors in Kolkata for art, sketching, and visual arts for all age groups. Connect directly for free on Shikshaq.',
  },
  '/sat-tuition-teachers-in-kolkata': {
    title: 'SAT Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find SAT tutors in Kolkata for Digital SAT preparation and US college admissions. Connect directly for free on Shikshaq.',
  },
  '/act-tuition-teachers-in-kolkata': {
    title: 'ACT Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find ACT tutors in Kolkata for American College Testing preparation. Connect directly for free on Shikshaq.',
  },
  '/cat-tuition-teachers-in-kolkata': {
    title: 'CAT Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find CAT tutors in Kolkata for MBA entrance preparation. Connect directly for free on Shikshaq.',
  },
  '/nmat-tuition-teachers-in-kolkata': {
    title: 'NMAT Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find NMAT tutors in Kolkata for NMIMS Management Aptitude Test preparation. Connect directly for free on Shikshaq.',
  },
  '/gmat-tuition-teachers-in-kolkata': {
    title: 'GMAT Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find GMAT tutors in Kolkata for Graduate Management Admission Test preparation. Connect directly for free on Shikshaq.',
  },
  '/ca-tuition-teachers-in-kolkata': {
    title: 'CA Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find CA tutors in Kolkata for Chartered Accountancy foundation, intermediate, and final preparation. Connect directly for free on Shikshaq.',
  },
  '/cfa-tuition-teachers-in-kolkata': {
    title: 'CFA Tuition Teachers in Kolkata | Shikshaq',
    description: 'Find CFA tutors in Kolkata for Chartered Financial Analyst certification preparation. Connect directly for free on Shikshaq.',
  },
};

export default function SubjectPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hasSetInitialFilterRef = useRef(false);

  const pathname = location.pathname;
  const filterValue = SUBJECT_PATH_TO_FILTER[pathname];

  useEffect(() => {
    const seo = SUBJECT_SEO[pathname];
    if (!seo) return;

    document.title = seo.title;

    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDesc) metaDesc.setAttribute('content', seo.description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://www.shikshaq.in${pathname}`;

    return () => {
      document.title = 'Shikshaq - Find Tuition Teachers in Kolkata';
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Find verified tuition teachers in Kolkata for free. Search by subject, class, board, and area. Connect directly with local tutors for CBSE, ICSE, IGCSE, IB, State Board — no commission, no middlemen.');
      }
    };
  }, [pathname]);

  if (!filterValue) {
    return <Browse />;
  }

  const filterSubjectsExists = searchParams.has('filter_subjects');
  const hasAnyParams = filterSubjectsExists ||
                       searchParams.has('filter_classes') ||
                       searchParams.has('filter_boards') ||
                       searchParams.has('filter_classSize') ||
                       searchParams.has('filter_areas') ||
                       searchParams.has('filter_modeOfTeaching') ||
                       searchParams.has('q') ||
                       searchParams.has('subject') ||
                       searchParams.has('class');

  if (hasSetInitialFilterRef.current && !hasAnyParams) {
    return <Navigate to="/all-tuition-teachers-in-kolkata" replace />;
  }

  if (!filterSubjectsExists) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('filter_subjects', filterValue);
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    hasSetInitialFilterRef.current = true;
    return <Navigate to={newUrl} replace />;
  }

  if (!hasSetInitialFilterRef.current) {
    hasSetInitialFilterRef.current = true;
  }

  return <Browse />;
}
