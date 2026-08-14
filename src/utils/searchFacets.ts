/**
 * Shared facet vocabulary for the dual-mode Teachers/Papers search control.
 * Kept in sync with FilterPanel.tsx / AdminTeachers.tsx so the same values
 * that filter the Browse page also work as search facets.
 */

export const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'CLAT', 'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
  'Geography', 'Hindi', 'History & Civics', 'Home Science', 'JEE', 'Legal Studies', 'Maths',
  'NEET', 'NMAT', 'Physics', 'Political Science', 'Psychology', 'SAT', 'Science',
  'Sanskrit', 'Social Studies', 'Sociology',
];

export const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

export const BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];

export const AREAS = [
  'Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Gariahat', 'Garia', 'Jadavpur', 'Kasba',
  'New Alipore', 'Southern Avenue', 'Tollygunge', 'Hazra',
  'Baguihati', 'Belur', 'Howrah', 'Joka', 'Newtown', 'Rajarhat', 'Salt Lake', 'Science City',
  'Dum Dum', 'Entally', 'Girish Park', 'Nagarbazar', 'Sealdah', 'Shyam Bazar', 'Tangra',
  'Camac Street', 'College Street', 'Elgin', 'Minto Park', 'Park Street', 'Park Circus',
  'Kankurgachi', 'Laketown', 'Phoolbagan', 'Ultadanga',
  'Anandapur', 'Parnasree', 'Rabindra Nagar',
  'Hooghly',
].sort();

export const EXAM_TYPES = ['Prelims', 'Half-Yearly', 'Final', 'Unit Test', 'Sample Paper'];

export type SearchMode = 'teachers' | 'papers';
export type TeacherFacetKey = 'subject' | 'cls' | 'area' | 'board';
export type PaperFacetKey = 'subject' | 'cls' | 'board' | 'school';
export type FacetKey = TeacherFacetKey | PaperFacetKey;

export const TEACHER_FACET_KEYS: TeacherFacetKey[] = ['subject', 'cls', 'area', 'board'];
export const PAPER_FACET_KEYS: PaperFacetKey[] = ['subject', 'cls', 'board', 'school'];

export const FACET_LABELS: Record<FacetKey, string> = {
  subject: 'Subject',
  cls: 'Class',
  area: 'Area',
  board: 'Board',
  school: 'School',
};

// Mode tokens — literal values from the Shikshaq Search build spec. Do not round or reintroduce as new hex.
export const MODE_TOKENS = {
  teachers: {
    color: '#FF8000',
    glow: 'rgba(255,128,0,.3)',
    tintBg: '#FFF4E8',
    tintText: '#B35900',
    // Orange fails WCAG AA contrast with white (~2.1:1) — every other orange
    // surface on the site (subjects section, footer CTA) already uses dark
    // text on orange, so the search button matches that instead of #fff.
    onColor: '#1F1F1F',
    label: 'Teachers',
  },
  papers: {
    color: '#4351FF',
    glow: 'rgba(67,81,255,.3)',
    tintBg: '#EDEEFF',
    tintText: '#2E3AD6',
    onColor: '#fff',
    label: 'Papers',
  },
} as const;

export const SURFACE_TOKENS = {
  shell: '#F9F5F1',
  field: '#FCFAF7',
  panel: '#F4EEE7',
  mutedFill: '#F0EAE2',
  hairline: '#E7DFD5',
  hairlineRaised: '#E4DCD2',
  hairlineStrong: '#D8CFC4',
  ink: '#1B1A18',
  textPrimary: '#1F1F1F',
  textBody: '#4A443E',
  textMuted: '#666',
  textSecondary: '#7B736B',
  textTertiary: '#8B837A',
  narrowItLabel: '#A39A90',
};

export const EASE = 'cubic-bezier(.2,.9,.2,1)';

// Entry easing — the curve _tokens.md's "Easing and keyframes" table calls "entry", used by the
// `rise`/`heroSwap` reveals and card hover. Distinct from EASE, which is the search-geometry curve.
export const ENTRY_EASE = 'cubic-bezier(.16,1,.3,1)';

// Accent tokens outside the surface/mode systems — literal values from _tokens.md's "Accents" table.
export const ACCENT_TOKENS = {
  success: '#228B22',
  settledBg: '#E6F4E6',
  settledText: '#1B5E20',
  destructive: '#E5484D',
  whatsappBg: '#25D366',
  whatsappText: '#0B3D1F',
  indigoLinkOnDark: '#8B93FF',
} as const;
