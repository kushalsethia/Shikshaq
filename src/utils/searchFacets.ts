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

// Mode tokens — sourced from the CSS variables in src/index.css (single source
// of truth) instead of re-declaring hex here. Shapes/keys are unchanged so
// every existing consumer (FilterPanel, AdminTeachers, etc.) keeps working.
export const MODE_TOKENS = {
  teachers: {
    color: 'hsl(var(--brand))',            // #FF8000
    glow: 'rgba(255,128,0,.3)',            // no CSS var backs this; matches --shadow-glow-brand's rgb triple
    tintBg: 'hsl(var(--brand-subtle))',    // #FFF4E8
    tintText: 'hsl(var(--brand-deep))',    // #B35900
    // Orange fails WCAG AA contrast with white (~2.1:1) — every other orange
    // surface on the site (subjects section, footer CTA) already uses dark
    // text on orange, so the search button matches that instead of #fff.
    onColor: 'hsl(var(--foreground))',     // #1F1F1F
    label: 'Teachers',
  },
  papers: {
    color: 'hsl(var(--brand-blue))',           // #4351FF
    glow: 'rgba(67,81,255,.3)',                // no CSS var backs this; matches --shadow-glow-brand-blue's rgb triple
    tintBg: 'hsl(var(--brand-blue-subtle))',   // #EDEEFF
    tintText: 'hsl(var(--brand-blue-deep))',   // #2E3AD6
    onColor: '#fff',
    label: 'Papers',
  },
} as const;

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

export const EASE = 'cubic-bezier(.2,.9,.2,1)';

// Entry easing — the curve _tokens.md's "Easing and keyframes" table calls "entry", used by the
// `rise`/`heroSwap` reveals and card hover. Distinct from EASE, which is the search-geometry curve.
export const ENTRY_EASE = 'cubic-bezier(.16,1,.3,1)';

// Accent tokens outside the surface/mode systems — sourced from src/index.css.
// `destructive` here is intentionally the narrower --facet-destructive, NOT
// the site-wide --destructive token; see the collision note in index.css.
export const ACCENT_TOKENS = {
  success: 'var(--success)',
  settledBg: 'var(--success-subtle-bg)',
  settledText: 'var(--success-subtle-text)',
  destructive: 'var(--facet-destructive)',
  whatsappBg: 'var(--whatsapp)',
  whatsappText: 'var(--whatsapp-text)',
  indigoLinkOnDark: 'var(--indigo-link-on-dark)',
} as const;
