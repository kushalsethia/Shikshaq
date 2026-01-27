import { FilterState } from '@/components/FilterPanel';

// --- CONSTANTS (Must match FilterPanel.tsx exactly) ---
const SUBJECTS = [
  'Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer', 'Hindi',
  'History & Civics', 'Geography', 'Economics', 'Accounts', 'Business Studies',
  'Commerce', 'Psychology', 'Sociology', 'Political Science', 'Environmental Science',
  'Bengali', 'Drawing', 'SAT', 'ACT', 'CAT', 'NMAT', 'GMAT', 'CA', 'CFA', 'JEE'
];

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];
const AREAS = [
  'Behala', 'Tollygunge', 'New Town', 'Howrah', 'Liluah', 'Beliaghata', 'Sealdah', 'Alipore',
  'New Alipore', 'Chetla', 'Bhowanipore', 'Park Street', 'Ruby', 'Bypass', 'Southern Avenue',
  'Gariahat', 'Hazra', 'Kankurgachi', 'Ultadanga', 'Baguihati', 'Salt Lake', 'Lake Town', 'Dum Dum',
  'Keshtopur', 'Ballygunge', 'Kasba', 'Jadavpur'
];
const MODE_OF_TEACHING = ['Online', 'Offline'];

// --- NORMALIZATION MAPS ---
const AREA_NORMALIZATION: Record<string, string> = {
  // Alipore variations (Added Alipur)
  'alipur': 'Alipore', 'alipor': 'Alipore', 'alipore': 'Alipore',

  // Bhowanipore variations
  'bhowanipur': 'Bhowanipore', 'bhawanipur': 'Bhowanipore', 'bhawanipore': 'Bhowanipore',
  'bhowanipore': 'Bhowanipore', 'bhawanipor': 'Bhowanipore',
  
  // Tollygunge variations
  'tollygunge': 'Tollygunge', 'tollygunj': 'Tollygunge', 'tollyganj': 'Tollygunge', 'tolly': 'Tollygunge',
  
  // Ballygunge variations
  'ballygunge': 'Ballygunge', 'ballygunj': 'Ballygunge', 'ballyganj': 'Ballygunge',
  
  // Salt Lake variations
  'saltlake': 'Salt Lake', 'salt lake': 'Salt Lake', 'bidhannagar': 'Salt Lake', 'sector 1': 'Salt Lake', 'sector 2': 'Salt Lake', 'sector 3': 'Salt Lake', 'sector 5': 'Salt Lake',
  
  // New Town variations
  'newtown': 'New Town', 'new town': 'New Town', 'rajarhat': 'New Town', 'action area': 'New Town',
  
  // Multi-word areas needing specific handling
  'parkstreet': 'Park Street', 'park street': 'Park Street',
  'southern avenue': 'Southern Avenue', 'southernavenue': 'Southern Avenue',
  'dumdum': 'Dum Dum', 'dum dum': 'Dum Dum',
  'newalipore': 'New Alipore', 'new alipore': 'New Alipore', 'new alipur': 'New Alipore',
  'lake town': 'Lake Town', 'laketown': 'Lake Town',
  
  // Common single word typos
  'jadabpur': 'Jadavpur', 'jadavpur': 'Jadavpur',
  'behala': 'Behala', 'behung': 'Behala',
  'howrah': 'Howrah', 'haora': 'Howrah',
  'sealdah': 'Sealdah', 'sialdah': 'Sealdah'
};

const SUBJECT_NORMALIZATION: Record<string, string> = {
  'math': 'Maths', 'mathematics': 'Maths', 'maths': 'Maths',
  'bio': 'Biology', 'biology': 'Biology', 'biol': 'Biology',
  'chem': 'Chemistry', 'chemistry': 'Chemistry',
  'phy': 'Physics', 'physics': 'Physics',
  'eng': 'English', 'english': 'English',
  'comp': 'Computer', 'computer': 'Computer', 'cs': 'Computer', 'it': 'Computer', 'coding': 'Computer',
  'hist': 'History & Civics', 'history': 'History & Civics', 'civics': 'History & Civics',
  'geo': 'Geography', 'geography': 'Geography',
  'eco': 'Economics', 'economics': 'Economics', 'econ': 'Economics',
  'acc': 'Accounts', 'accounts': 'Accounts', 'accountancy': 'Accounts',
  'bst': 'Business Studies', 'business studies': 'Business Studies', 'business': 'Business Studies',
  'pol sc': 'Political Science', 'political science': 'Political Science', 'pol science': 'Political Science',
  'evs': 'Environmental Science', 'env science': 'Environmental Science', 'environmental': 'Environmental Science',
  'beng': 'Bengali', 'bengali': 'Bengali', 'bangla': 'Bengali',
  'draw': 'Drawing', 'drawing': 'Drawing', 'art': 'Drawing', 'painting': 'Drawing'
};

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'teacher', 'teachers', 'tutor', 'tutors', 'tuition', 'need', 'want', 'looking', 'find'
]);

const ADDRESS_INDICATORS = new Set([
  'sector', 'sec', 'ward', 'block', 'phase', 'lane', 'road', 'st', 'street', 'no', 'flat', 'apt', 'plot', 'number', 'pin'
]);

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

export function extractFiltersFromQuery(query: string): Partial<FilterState> {
  if (!query || query.trim().length < 2) return {};

  const normalizedQuery = normalizeText(query);
  
  const extractedFilters: Partial<FilterState> = {
    subjects: [], classes: [], boards: [], classSize: [], areas: [], modeOfTeaching: [],
  };

  // --- STEP 1: Handle Multi-Word Areas & Subjects First (Priority) ---
  let remainingQuery = normalizedQuery;

  // 1A. Check Area Normalization Map (Multi-word matches)
  Object.keys(AREA_NORMALIZATION).forEach(key => {
    if (key.includes(' ') && remainingQuery.includes(key)) {
      const area = AREA_NORMALIZATION[key];
      if (!extractedFilters.areas!.includes(area)) {
        extractedFilters.areas!.push(area);
        remainingQuery = remainingQuery.replace(key, ''); 
      }
    }
  });

  // 1B. Check Subject Normalization Map (Multi-word matches)
  // Handle multi-word subjects first (e.g., "environmental science" before "science")
  Object.keys(SUBJECT_NORMALIZATION).forEach(key => {
    if (key.includes(' ') && remainingQuery.includes(key)) {
      const subject = SUBJECT_NORMALIZATION[key];
      if (!extractedFilters.subjects!.includes(subject)) {
        extractedFilters.subjects!.push(subject);
        remainingQuery = remainingQuery.replace(key, '');
      }
    }
  });
  
  // Handle composite subjects as standalone words (after multi-word matches to avoid conflicts)
  // This ensures "environmental science" is handled first, then standalone "science"
  
  // Science → Physics, Chemistry, Biology
  if (remainingQuery.includes('science') && !remainingQuery.includes('environmental science') && 
      !remainingQuery.includes('political science')) {
    const scienceSubjects = ['Physics', 'Chemistry', 'Biology'];
    scienceSubjects.forEach(subj => {
      if (!extractedFilters.subjects!.includes(subj)) {
        extractedFilters.subjects!.push(subj);
      }
    });
    remainingQuery = remainingQuery.replace(/\bscience\b/gi, '');
  }
  
  // Social Studies / SST → History & Civics, Geography
  if (remainingQuery.match(/\b(social\s+studies|sst)\b/gi)) {
    const socialStudiesSubjects = ['History & Civics', 'Geography'];
    socialStudiesSubjects.forEach(subj => {
      if (!extractedFilters.subjects!.includes(subj)) {
        extractedFilters.subjects!.push(subj);
      }
    });
    remainingQuery = remainingQuery.replace(/\b(social\s+studies|sst)\b/gi, '');
  }
  
  // 2nd Language / 3rd Language → Hindi, Bengali, Sanskrit, German, French (and others)
  if (remainingQuery.match(/\b(2nd\s+lang|2nd\s+language|3rd\s+lang|3rd\s+language|second\s+lang|second\s+language|third\s+lang|third\s+language)\b/gi)) {
    const languageSubjects = ['Hindi', 'Bengali', 'Sanskrit', 'German', 'French'];
    languageSubjects.forEach(subj => {
      if (!extractedFilters.subjects!.includes(subj)) {
        extractedFilters.subjects!.push(subj);
      }
    });
    remainingQuery = remainingQuery.replace(/\b(2nd\s+lang|2nd\s+language|3rd\s+lang|3rd\s+language|second\s+lang|second\s+language|third\s+lang|third\s+language)\b/gi, '');
  }
  
  // Commerce → Commerce only (NOT Accounts, Economics, Business Studies)
  if (remainingQuery.match(/\bcommerce\b/gi)) {
    if (!extractedFilters.subjects!.includes('Commerce')) {
      extractedFilters.subjects!.push('Commerce');
    }
    remainingQuery = remainingQuery.replace(/\bcommerce\b/gi, '');
  }
  
  // Competitive Exams → SAT, ACT, CAT, NMAT, GMAT, CA, CFA, JEE
  if (remainingQuery.match(/\b(competitive\s+exam|competitive\s+exams)\b/gi)) {
    const competitiveSubjects = ['SAT', 'ACT', 'CAT', 'NMAT', 'GMAT', 'CA', 'CFA', 'JEE'];
    competitiveSubjects.forEach(subj => {
      if (!extractedFilters.subjects!.includes(subj)) {
        extractedFilters.subjects!.push(subj);
      }
    });
    remainingQuery = remainingQuery.replace(/\b(competitive\s+exam|competitive\s+exams)\b/gi, '');
  }
  
  // CA / Chartered Accountant / Chartered Accountancy → CA
  if (remainingQuery.match(/\b(ca|chartered\s+accountant|chartered\s+accountancy)\b/gi)) {
    if (!extractedFilters.subjects!.includes('CA')) {
      extractedFilters.subjects!.push('CA');
    }
    remainingQuery = remainingQuery.replace(/\b(ca|chartered\s+accountant|chartered\s+accountancy)\b/gi, '');
  }
  
  // Humanities → Psychology, Sociology, Political Science, Legal Studies, Home Science
  if (remainingQuery.match(/\bhumanities\b/gi)) {
    const humanitiesSubjects = ['Psychology', 'Sociology', 'Political Science'];
    // Note: Legal Studies and Home Science will be added when they exist in database
    humanitiesSubjects.forEach(subj => {
      if (!extractedFilters.subjects!.includes(subj)) {
        extractedFilters.subjects!.push(subj);
      }
    });
    remainingQuery = remainingQuery.replace(/\bhumanities\b/gi, '');
  }
  
  // Literature / Language → English
  if (remainingQuery.match(/\b(literature|language)\b/gi)) {
    if (!extractedFilters.subjects!.includes('English')) {
      extractedFilters.subjects!.push('English');
    }
    remainingQuery = remainingQuery.replace(/\b(literature|language)\b/gi, '');
  }

  // --- STEP 2: Process Single Words ---
  const words = remainingQuery.split(/\s+/).filter(w => w.length > 0);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i-1] : '';

    if (STOP_WORDS.has(word)) continue;

    // A. Class Extraction
    if (['class', 'grade', 'std', 'standard'].includes(word)) {
      const nextWord = words[i+1];
      if (nextWord && /^\d+$/.test(nextWord)) {
        if (CLASSES.includes(nextWord)) extractedFilters.classes!.push(nextWord);
        i++; 
        continue;
      }
      continue;
    }
    
    if (/^\d+(th|nd|rd|st)$/.test(word)) {
      const num = word.replace(/\D/g, '');
      if (CLASSES.includes(num)) extractedFilters.classes!.push(num);
      continue;
    }

    if (/^\d+$/.test(word)) {
      if (ADDRESS_INDICATORS.has(prevWord)) continue; 
      if (CLASSES.includes(word)) extractedFilters.classes!.push(word);
      continue;
    }

            // B. Subject Matching
            // Special handling for composite subjects
            
            // Science → Physics, Chemistry, Biology
            if (word === 'science' || word === 'sci') {
              const scienceSubjects = ['Physics', 'Chemistry', 'Biology'];
              scienceSubjects.forEach(subj => {
                if (!extractedFilters.subjects!.includes(subj)) extractedFilters.subjects!.push(subj);
              });
              continue;
            }
            
            // SST → History & Civics, Geography
            if (word === 'sst') {
              const socialStudiesSubjects = ['History & Civics', 'Geography'];
              socialStudiesSubjects.forEach(subj => {
                if (!extractedFilters.subjects!.includes(subj)) extractedFilters.subjects!.push(subj);
              });
              continue;
            }
            
            // Commerce → Commerce only
            if (word === 'commerce') {
              if (!extractedFilters.subjects!.includes('Commerce')) {
                extractedFilters.subjects!.push('Commerce');
              }
              continue;
            }
            
            // CA → CA
            if (word === 'ca') {
              if (!extractedFilters.subjects!.includes('CA')) {
                extractedFilters.subjects!.push('CA');
              }
              continue;
            }
            
            // Humanities → Psychology, Sociology, Political Science
            if (word === 'humanities') {
              const humanitiesSubjects = ['Psychology', 'Sociology', 'Political Science'];
              humanitiesSubjects.forEach(subj => {
                if (!extractedFilters.subjects!.includes(subj)) extractedFilters.subjects!.push(subj);
              });
              continue;
            }
            
            // Literature / Language → English
            if (word === 'literature' || word === 'language') {
              if (!extractedFilters.subjects!.includes('English')) {
                extractedFilters.subjects!.push('English');
              }
              continue;
            }
            
            if (SUBJECT_NORMALIZATION[word]) {
              const subject = SUBJECT_NORMALIZATION[word];
              if (!extractedFilters.subjects!.includes(subject)) extractedFilters.subjects!.push(subject);
              continue;
            }

    // C. Area Matching
    // 1. Check normalization map (Handles "tollygunj", "bhowanipur", "alipur")
    if (AREA_NORMALIZATION[word]) {
      const area = AREA_NORMALIZATION[word];
      if (!extractedFilters.areas!.includes(area)) extractedFilters.areas!.push(area);
      continue;
    }
    
    // 2. Check DIRECTLY against the main AREAS list (Handles "Alipore", "Kasba", "Ruby")
    const directAreaMatch = AREAS.find(a => a.toLowerCase() === word);
    if (directAreaMatch) {
      if (!extractedFilters.areas!.includes(directAreaMatch)) extractedFilters.areas!.push(directAreaMatch);
      continue;
    }

    // D. Board Matching
    const boardMatch = BOARDS.find(b => b.toLowerCase() === word);
    if (boardMatch) {
      extractedFilters.boards!.push(boardMatch);
      continue;
    }

    // E. Mode & Size
    if (word === 'online' || word === 'offline') {
      extractedFilters.modeOfTeaching!.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    if (word === 'group' || word === 'solo') {
      extractedFilters.classSize!.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
  }

  // --- STEP 3: Cleanup ---
  const result: Partial<FilterState> = {};
  if (extractedFilters.subjects!.length) result.subjects = [...new Set(extractedFilters.subjects)];
  if (extractedFilters.classes!.length) result.classes = [...new Set(extractedFilters.classes)];
  if (extractedFilters.boards!.length) result.boards = [...new Set(extractedFilters.boards)];
  if (extractedFilters.areas!.length) result.areas = [...new Set(extractedFilters.areas)];
  if (extractedFilters.classSize!.length) result.classSize = [...new Set(extractedFilters.classSize)];
  if (extractedFilters.modeOfTeaching!.length) result.modeOfTeaching = [...new Set(extractedFilters.modeOfTeaching)];

  return result;
}

/**
 * Extracts the name part from a query by removing filter keywords.
 * This helps identify when a user is searching for both a name and filters.
 * @param query The search query (e.g., "aparna chemistry")
 * @param extractedFilters The filters that were extracted from the query
 * @returns The remaining query text that likely contains a name
 */
export function extractNameFromQuery(query: string, extractedFilters: Partial<FilterState>): string {
  if (!query || query.trim().length < 3) {
    return '';
  }

  let remainingQuery = query.toLowerCase().trim();
  
  // Remove extracted subjects from query
  if (extractedFilters.subjects && extractedFilters.subjects.length > 0) {
    extractedFilters.subjects.forEach(subject => {
      const subjectLower = subject.toLowerCase();
      // Remove subject and its variations
      remainingQuery = remainingQuery.replace(new RegExp(subjectLower, 'gi'), '');
      // Also check normalization map
      Object.entries(SUBJECT_NORMALIZATION).forEach(([key, value]) => {
        if (value === subject) {
          remainingQuery = remainingQuery.replace(new RegExp(key, 'gi'), '');
        }
      });
    });
  }

  // Remove extracted classes from query
  if (extractedFilters.classes && extractedFilters.classes.length > 0) {
    extractedFilters.classes.forEach(cls => {
      // Remove "class X", "Xth", or just "X"
      remainingQuery = remainingQuery.replace(new RegExp(`\\bclass\\s*${cls}\\b`, 'gi'), '');
      remainingQuery = remainingQuery.replace(new RegExp(`\\b${cls}(th|nd|rd|st)\\b`, 'gi'), '');
      remainingQuery = remainingQuery.replace(new RegExp(`\\b${cls}\\b`, 'gi'), '');
    });
  }

  // Remove extracted areas from query
  if (extractedFilters.areas && extractedFilters.areas.length > 0) {
    extractedFilters.areas.forEach(area => {
      const areaLower = area.toLowerCase();
      remainingQuery = remainingQuery.replace(new RegExp(areaLower, 'gi'), '');
      // Also check normalization map
      Object.entries(AREA_NORMALIZATION).forEach(([key, value]) => {
        if (value === area) {
          remainingQuery = remainingQuery.replace(new RegExp(key, 'gi'), '');
        }
      });
    });
  }

  // Remove extracted boards from query
  if (extractedFilters.boards && extractedFilters.boards.length > 0) {
    extractedFilters.boards.forEach(board => {
      remainingQuery = remainingQuery.replace(new RegExp(board.toLowerCase(), 'gi'), '');
    });
  }

  // Remove stop words and clean up
  const words = remainingQuery.split(/\s+/).filter(w => {
    const word = w.trim();
    return word.length > 0 && !STOP_WORDS.has(word);
  });

  return words.join(' ').trim();
}
