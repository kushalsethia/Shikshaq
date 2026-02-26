import { FilterState } from '@/components/FilterPanel';

// Base normalization for common subjects (always available)
const BASE_SUBJECT_NORMALIZATION: Record<string, string> = {
  'math': 'Maths', 'mathematics': 'Maths', 'maths': 'Maths',
  'bio': 'Biology', 'biology': 'Biology', 'biol': 'Biology',
  'chem': 'Chemistry', 'chemistry': 'Chemistry',
  'phy': 'Physics', 'physics': 'Physics',
  'eng': 'English', 'english': 'English',
  'comp': 'Computers', 'computer': 'Computers', 'computers': 'Computers', 'cs': 'Computers', 'it': 'Computers', 'coding': 'Computers',
  'hist': 'History & Civics', 'history': 'History & Civics', 'civics': 'History & Civics', 'history civics': 'History & Civics',
  'geo': 'Geography', 'geography': 'Geography',
  'eco': 'Economics', 'economics': 'Economics', 'econ': 'Economics',
  'acc': 'Accounts', 'accounts': 'Accounts', 'accountancy': 'Accounts', 'accounting': 'Accounts',
  'bst': 'Business Studies', 'business studies': 'Business Studies', 'business': 'Business Studies', 'bs': 'Business Studies',
  'pol sc': 'Political Science', 'political science': 'Political Science', 'pol science': 'Political Science', 'political': 'Political Science',
  'evs': 'Environmental Science', 'env science': 'Environmental Science', 'environmental': 'Environmental Science', 'environmental science': 'Environmental Science',
  'beng': 'Bengali', 'bengali': 'Bengali', 'bangla': 'Bengali',
  'draw': 'Drawing & Painting', 'drawing': 'Drawing & Painting', 'art': 'Drawing & Painting', 'painting': 'Drawing & Painting', 'drawing painting': 'Drawing & Painting', 'drawing & painting': 'Drawing & Painting',
  'science': 'Science', 'sci': 'Science',
  'sst': 'Social Studies', 'social studies': 'Social Studies', 'social': 'Social Studies',
  'soc': 'Sociology', 'sociology': 'Sociology',
  'psy': 'Psychology', 'psychology': 'Psychology', 'psych': 'Psychology',
  'hindi': 'Hindi',
  'sanskrit': 'Sanskrit', 'sansk': 'Sanskrit',
  'legal': 'Legal Studies', 'legal studies': 'Legal Studies', 'law': 'Legal Studies',
  'home': 'Home Science', 'home science': 'Home Science', 'home sci': 'Home Science',
  'act': 'ACT',
  'ap': 'AP', 'advanced placement': 'AP',
  'ca': 'CA', 'chartered accountant': 'CA', 'chartered accountancy': 'CA',
  'cat': 'CAT', 'common admission test': 'CAT',
  'jee': 'JEE', 'joint entrance exam': 'JEE', 'joint entrance examination': 'JEE',
  'neet': 'NEET', 'national eligibility cum entrance test': 'NEET',
  'nmat': 'NMAT',
  'sat': 'SAT', 'scholastic assessment test': 'SAT'
};

// Function to build dynamic subject normalization from database subjects
function buildSubjectNormalization(subjects: { name: string; slug: string }[]): Record<string, string> {
  // Start with both base normalization and static normalization
  const normalization: Record<string, string> = { ...BASE_SUBJECT_NORMALIZATION, ...SUBJECT_NORMALIZATION };
  
  subjects.forEach(subject => {
    const name = subject.name;
    const nameLower = name.toLowerCase();
    const slug = subject.slug.toLowerCase();
    
    // Add exact name match
    normalization[nameLower] = name;
    
    // Add slug match
    if (slug !== nameLower) {
      normalization[slug] = name;
    }
    
    // Generate common variations for new subjects
    // Remove common words and create variations
    const words = nameLower.split(/\s+/);
    
    // Add first word as abbreviation if it's a multi-word subject
    if (words.length > 1) {
      const firstWord = words[0];
      if (firstWord.length >= 3) {
        normalization[firstWord] = name;
      }
    }
    
    // Add acronym if subject has multiple words
    if (words.length > 1) {
      const acronym = words.map(w => w[0]).join('');
      if (acronym.length >= 2) {
        normalization[acronym] = name;
      }
    }
    
    // Add variations without spaces
    const noSpace = nameLower.replace(/\s+/g, '');
    if (noSpace !== nameLower) {
      normalization[noSpace] = name;
    }
    
    // Add variations with hyphens
    const withHyphen = nameLower.replace(/\s+/g, '-');
    if (withHyphen !== nameLower && withHyphen !== noSpace) {
      normalization[withHyphen] = name;
    }
  });
  
  return normalization;
}

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];
const AREAS = [
  // Group 1
  'Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Gariahat', 'Garia', 'Jadavpur', 'Kasba', 
  'New Alipore', 'Southern Avenue', 'Tollygunge', 'Hazra',
  // Group 2
  'Baguihati', 'Belur', 'Howrah', 'Joka', 'Newtown', 'Rajarhat', 'Salt Lake', 'Science City',
  // Group 3
  'Dum Dum', 'Entally', 'Girish Park', 'Nagarbazar', 'Sealdah', 'Shyam Bazar', 'Tangra',
  // Group 4
  'Camac Street', 'College Street', 'Elgin', 'Minto Park', 'Park Street', 'Park Circus',
  // Group 5
  'Kankurgachi', 'Laketown', 'Phoolbagan', 'Ultadanga',
  // Group 6
  'Anandapur', 'Parnasree', 'Rabindra Nagar',
  // Group 7
  'Hooghly'
].sort();
const MODE_OF_TEACHING = ['Online', 'Offline'];

// --- NORMALIZATION MAPS ---
const AREA_NORMALIZATION: Record<string, string> = {
  // Group 1 - Alipore variations
  'alipur': 'Alipore', 'alipor': 'Alipore', 'alipore': 'Alipore',
  
  // Group 1 - Ballygunge variations
  'ballygunge': 'Ballygunge', 'ballygunj': 'Ballygunge', 'ballyganj': 'Ballygunge',
  
  // Group 1 - Behala variations
  'behala': 'Behala', 'behung': 'Behala',
  
  // Group 1 - Bhowanipore variations
  'bhowanipur': 'Bhowanipore', 'bhawanipur': 'Bhowanipore', 'bhawanipore': 'Bhowanipore',
  'bhowanipore': 'Bhowanipore', 'bhawanipor': 'Bhowanipore',
  
  // Group 1 - Gariahat variations
  'gariahat': 'Gariahat', 'garia hat': 'Gariahat',
  
  // Group 1 - Garia variations
  'garia': 'Garia',
  
  // Group 1 - Jadavpur variations
  'jadabpur': 'Jadavpur', 'jadavpur': 'Jadavpur',
  
  // Group 1 - Kasba variations
  'kasba': 'Kasba',
  
  // Group 1 - New Alipore variations
  'newalipore': 'New Alipore', 'new alipore': 'New Alipore', 'new alipur': 'New Alipore',
  
  // Group 1 - Southern Avenue variations
  'southern avenue': 'Southern Avenue', 'southernavenue': 'Southern Avenue', 'southern': 'Southern Avenue',
  
  // Group 1 - Tollygunge variations
  'tollygunge': 'Tollygunge', 'tollygunj': 'Tollygunge', 'tollyganj': 'Tollygunge', 'tolly': 'Tollygunge',
  
  // Group 1 - Hazra variations
  'hazra': 'Hazra',
  
  // Group 2 - Baguihati variations
  'baguihati': 'Baguihati', 'bagui hati': 'Baguihati',
  
  // Group 2 - Belur variations
  'belur': 'Belur',
  
  // Group 2 - Howrah variations
  'howrah': 'Howrah', 'haora': 'Howrah', 'salkia': 'Howrah', 'ac market': 'Howrah', 'bandhaghat': 'Howrah',
  
  // Group 2 - Joka variations
  'joka': 'Joka',
  
  // Group 2 - Newtown variations
  'newtown': 'Newtown', 'new town': 'Newtown', 'newtown kolkata': 'Newtown',
  
  // Group 2 - Rajarhat variations
  'rajarhat': 'Rajarhat', 'rajar hat': 'Rajarhat',
  
  // Group 2 - Salt Lake variations
  'saltlake': 'Salt Lake', 'salt lake': 'Salt Lake', 'bidhannagar': 'Salt Lake', 
  'sector 1': 'Salt Lake', 'sector 2': 'Salt Lake', 'sector 3': 'Salt Lake', 'sector 5': 'Salt Lake',
  
  // Group 2 - Science City variations
  'science city': 'Science City', 'sciencecity': 'Science City', 'science': 'Science City',
  
  // Group 3 - Dum Dum variations
  'dumdum': 'Dum Dum', 'dum dum': 'Dum Dum',
  
  // Group 3 - Entally variations
  'entally': 'Entally', 'entali': 'Entally',
  
  // Group 3 - Girish Park variations
  'girish park': 'Girish Park', 'girishpark': 'Girish Park', 'girish': 'Girish Park',
  
  // Group 3 - Nagarbazar variations
  'nagarbazar': 'Nagarbazar', 'nagar bazar': 'Nagarbazar', 'nagar': 'Nagarbazar',
  
  // Group 3 - Sealdah variations
  'sealdah': 'Sealdah', 'sialdah': 'Sealdah',
  
  // Group 3 - Shyam Bazar variations
  'shyam bazar': 'Shyam Bazar', 'shyambazar': 'Shyam Bazar', 'shyam bazaar': 'Shyam Bazar',
  
  // Group 3 - Tangra variations
  'tangra': 'Tangra',
  
  // Group 4 - Camac Street variations
  'camac street': 'Camac Street', 'camacstreet': 'Camac Street', 'camac': 'Camac Street',
  
  // Group 4 - College Street variations
  'college street': 'College Street', 'collegestreet': 'College Street', 'college': 'College Street',
  
  // Group 4 - Elgin variations
  'elgin': 'Elgin', 'elgin road': 'Elgin',
  
  // Group 4 - Minto Park variations
  'minto park': 'Minto Park', 'mintopark': 'Minto Park', 'minto': 'Minto Park',
  
  // Group 4 - Park Street variations
  'parkstreet': 'Park Street', 'park street': 'Park Street', 'park st': 'Park Street',
  
  // Group 4 - Park Circus variations
  'park circus': 'Park Circus', 'parkcircus': 'Park Circus',
  
  // Group 5 - Kankurgachi variations
  'kankurgachi': 'Kankurgachi', 'kankur gachi': 'Kankurgachi',
  
  // Group 5 - Laketown variations
  'laketown': 'Laketown', 'lake town': 'Laketown', 'lake': 'Laketown',
  
  // Group 5 - Phoolbagan variations
  'phoolbagan': 'Phoolbagan', 'phool bagan': 'Phoolbagan', 'phool': 'Phoolbagan',
  
  // Group 5 - Ultadanga variations
  'ultadanga': 'Ultadanga', 'ulta danga': 'Ultadanga',
  
  // Group 6 - Anandapur variations
  'anandapur': 'Anandapur', 'ananda pur': 'Anandapur',
  
  // Group 6 - Parnasree variations
  'parnasree': 'Parnasree', 'parna sree': 'Parnasree',
  
  // Group 6 - Rabindra Nagar variations
  'rabindra nagar': 'Rabindra Nagar', 'rabindranagar': 'Rabindra Nagar', 'rabindra': 'Rabindra Nagar',
  
  // Group 7 - Hooghly variations
  'hooghly': 'Hooghly', 'hugli': 'Hooghly', 'chandannagar': 'Hooghly', 'serampore': 'Hooghly', 'chandannagore': 'Hooghly'
};

// Static subject normalization (merged with dynamic normalization)
const SUBJECT_NORMALIZATION: Record<string, string> = {
  // Maths variations
  'math': 'Maths', 'mathematics': 'Maths', 'maths': 'Maths',
  
  // Biology variations
  'bio': 'Biology', 'biology': 'Biology', 'biol': 'Biology',
  
  // Chemistry variations
  'chem': 'Chemistry', 'chemistry': 'Chemistry',
  
  // Physics variations
  'phy': 'Physics', 'physics': 'Physics',
  
  // English variations
  'eng': 'English', 'english': 'English',
  
  // Computers variations
  'comp': 'Computers', 'computer': 'Computers', 'computers': 'Computers', 'cs': 'Computers', 'it': 'Computers', 'coding': 'Computers',
  
  // History & Civics variations
  'hist': 'History & Civics', 'history': 'History & Civics', 'civics': 'History & Civics', 'history civics': 'History & Civics',
  
  // Geography variations
  'geo': 'Geography', 'geography': 'Geography',
  
  // Economics variations
  'eco': 'Economics', 'economics': 'Economics', 'econ': 'Economics',
  
  // Accounts variations
  'acc': 'Accounts', 'accounts': 'Accounts', 'accountancy': 'Accounts', 'accounting': 'Accounts',
  
  // Business Studies variations
  'bst': 'Business Studies', 'business studies': 'Business Studies', 'business': 'Business Studies', 'bs': 'Business Studies',
  
  // Political Science variations
  'pol sc': 'Political Science', 'political science': 'Political Science', 'pol science': 'Political Science', 'political': 'Political Science',
  
  // Environmental Science variations
  'evs': 'Environmental Science', 'env science': 'Environmental Science', 'environmental': 'Environmental Science', 'environmental science': 'Environmental Science',
  
  // Bengali variations
  'beng': 'Bengali', 'bengali': 'Bengali', 'bangla': 'Bengali',
  
  // Drawing & Painting variations
  'draw': 'Drawing & Painting', 'drawing': 'Drawing & Painting', 'art': 'Drawing & Painting', 'painting': 'Drawing & Painting', 'drawing painting': 'Drawing & Painting', 'drawing & painting': 'Drawing & Painting',
  
  // Science variations (maps to Science subject)
  'science': 'Science', 'sci': 'Science',
  
  // Social Studies variations
  'sst': 'Social Studies', 'social studies': 'Social Studies', 'social': 'Social Studies',
  
  // Sociology variations
  'soc': 'Sociology', 'sociology': 'Sociology',
  
  // Psychology variations
  'psy': 'Psychology', 'psychology': 'Psychology', 'psych': 'Psychology',
  
  // Hindi variations
  'hindi': 'Hindi',
  
  // Sanskrit variations
  'sanskrit': 'Sanskrit', 'sansk': 'Sanskrit',
  
  // Legal Studies variations
  'legal': 'Legal Studies', 'legal studies': 'Legal Studies', 'law': 'Legal Studies',
  
  // Home Science variations
  'home': 'Home Science', 'home science': 'Home Science', 'home sci': 'Home Science',
  
  // Competitive exams - ACT
  'act': 'ACT',
  
  // Competitive exams - AP
  'ap': 'AP', 'advanced placement': 'AP',
  
  // Competitive exams - CA
  'ca': 'CA', 'chartered accountant': 'CA', 'chartered accountancy': 'CA',
  
  // Competitive exams - CAT
  'cat': 'CAT', 'common admission test': 'CAT',
  
  // Competitive exams - JEE
  'jee': 'JEE', 'joint entrance exam': 'JEE', 'joint entrance examination': 'JEE',
  
  // Competitive exams - NEET
  'neet': 'NEET', 'national eligibility cum entrance test': 'NEET',
  
  // Competitive exams - NMAT
  'nmat': 'NMAT',
  
  // Competitive exams - SAT
  'sat': 'SAT', 'scholastic assessment test': 'SAT'
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

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractFiltersFromQuery(query: string, subjects?: { name: string; slug: string }[]): Partial<FilterState> {
  if (!query || query.trim().length < 2) return {};

  const normalizedQuery = normalizeText(query);
  
  // Build subject normalization dynamically if subjects are provided
  const SUBJECT_NORMALIZATION = subjects ? buildSubjectNormalization(subjects) : BASE_SUBJECT_NORMALIZATION;
  
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
  
  // Science can mean either the subject "Science" OR the composite (Physics, Chemistry, Biology)
  // We'll add both "Science" subject and the composite subjects
  if (remainingQuery.includes('science') && !remainingQuery.includes('environmental science') && 
      !remainingQuery.includes('political science') && !remainingQuery.includes('home science')) {
    // Add "Science" as a subject
    if (!extractedFilters.subjects!.includes('Science')) {
      extractedFilters.subjects!.push('Science');
    }
    // Also add composite science subjects
    const scienceSubjects = ['Physics', 'Chemistry', 'Biology'];
    scienceSubjects.forEach(subj => {
      if (!extractedFilters.subjects!.includes(subj)) {
        extractedFilters.subjects!.push(subj);
      }
    });
    remainingQuery = remainingQuery.replace(/\bscience\b/gi, '');
  }
  
  // Social Studies / SST → Social Studies, History & Civics, Geography (all shown in advanced filters; filter matches History/Geography)
  if (remainingQuery.match(/\b(social\s+studies|sst)\b/gi)) {
    if (!extractedFilters.subjects!.includes('Social Studies')) {
      extractedFilters.subjects!.push('Social Studies');
    }
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
            
            // Science can mean either the subject "Science" OR the composite (Physics, Chemistry, Biology)
            // We'll add both "Science" subject and the composite subjects
            if (word === 'science' || word === 'sci') {
              // Add "Science" as a subject
              if (!extractedFilters.subjects!.includes('Science')) {
                extractedFilters.subjects!.push('Science');
              }
              // Also add composite science subjects
              const scienceSubjects = ['Physics', 'Chemistry', 'Biology'];
              scienceSubjects.forEach(subj => {
                if (!extractedFilters.subjects!.includes(subj)) extractedFilters.subjects!.push(subj);
              });
              continue;
            }
            
            // SST → Social Studies, History & Civics, Geography
            if (word === 'sst') {
              if (!extractedFilters.subjects!.includes('Social Studies')) extractedFilters.subjects!.push('Social Studies');
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
            
            // Check normalization map (built dynamically)
            if (SUBJECT_NORMALIZATION[word]) {
              const subject = SUBJECT_NORMALIZATION[word];
              if (!extractedFilters.subjects!.includes(subject)) extractedFilters.subjects!.push(subject);
              continue;
            }
            
            // Also check direct subject name matches from database.
            // Require subject name/slug to be at least 4 chars when matching as substring of query,
            // so "aparna" (a name) is not matched as subject "AP" (word.includes("ap")).
            // Require word boundary when subject contains query so "social" matches "Social Studies" not "Sociology".
            const MIN_SUBJECT_LENGTH_FOR_SUBSTRING = 4;
            if (subjects) {
              const wordBoundary = new RegExp(`\\b${escapeRegex(word)}\\b`);
              const directSubjectMatch = subjects.find(s => {
                const nameLower = s.name.toLowerCase();
                const slug = s.slug.toLowerCase();
                const exactMatch = nameLower === word || slug === word;
                const queryContainsSubject = (key: string) => key.length >= MIN_SUBJECT_LENGTH_FOR_SUBSTRING && word.includes(key);
                const subjectContainsQueryAsWord = wordBoundary.test(nameLower) || wordBoundary.test(slug);
                return exactMatch || subjectContainsQueryAsWord || queryContainsSubject(nameLower) || queryContainsSubject(slug);
              });
              if (directSubjectMatch && !extractedFilters.subjects!.includes(directSubjectMatch.name)) {
                extractedFilters.subjects!.push(directSubjectMatch.name);
                continue;
              }
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
export function extractNameFromQuery(query: string, extractedFilters: Partial<FilterState>, subjects?: { name: string; slug: string }[]): string {
  if (!query || query.trim().length < 3) {
    return '';
  }

  // Build subject normalization dynamically if subjects are provided
  const SUBJECT_NORMALIZATION = subjects ? buildSubjectNormalization(subjects) : BASE_SUBJECT_NORMALIZATION;

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
