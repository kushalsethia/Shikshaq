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

/* ISC was missing. It is a real board with real papers, it is named in the
   papers page's own sub-line ("ICSE, CBSE and ISC"), and leaving it out broke
   pages.md §4's reviewer check outright: the board tab counts summed to 13
   against a grid total of 18, because the five ISC papers had no tab to be
   counted under and no way to be filtered to.

   Teachers store the combined value "ICSE/ISC" (141 of them) where papers store
   the two separately, so a substring match serves both: "ICSE" and "ISC" each
   hit "ICSE/ISC", and ISC papers now have a facet of their own. */
export const BOARDS = ['ICSE', 'ISC', 'CBSE', 'IGCSE', 'IB', 'State'];

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

export const SURFACE_TOKENS = {
  shell: 'var(--warm-page)',
  field: 'var(--warm-card)',
  panel: 'var(--surface-panel-light)',
  mutedFill: 'var(--warm-muted)',
  hairline: 'var(--warm-hairline)',
  hairlineRaised: 'var(--warm-hairline-raised)',
  hairlineStrong: 'var(--warm-hairline-strong)',
  ink: 'var(--panel-dark)',
  textPrimary: 'hsl(var(--foreground))',
  textBody: 'var(--text-prose)',
  // #666 (cool grey) was a known handoff inconsistency — VISUAL_LANGUAGE.md §0
  // resolves it: migrate to the warm secondary token. Applied here — this
  // intentionally changes the rendered color from #666 to #7B736B.
  textMuted: 'var(--text-secondary)',
  textSecondary: 'var(--text-secondary)',
  textTertiary: 'var(--text-tertiary)',
  narrowItLabel: 'var(--text-quaternary)',
};
