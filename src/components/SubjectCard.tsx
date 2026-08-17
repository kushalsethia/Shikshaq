import { Link } from 'react-router-dom';
import { memo } from 'react';
import {
  Atom,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  Dna,
  FileSpreadsheet,
  FlaskConical,
  Globe,
  GraduationCap,
  House,
  Landmark,
  Languages,
  Leaf,
  Monitor,
  Palette,
  Scale,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { SUBJECT_PATH_TO_FILTER } from '@/utils/subjectMapping';
import { getSubjectPalette, paletteFromSeed, resolveSubjectFamily, SUBJECT_SEEDS } from '@/lib/subject-palette';
import { CutPaperShape } from '@/components/devices';

// Deterministic per-subject shape variant so the same subject always gets the
// same mark across renders/reloads (matches the seeded-palette determinism
// above), instead of a random flicker.
const SHAPE_VARIANTS = ['blob', 'star', 'squiggle'] as const;

// Subjects outside the 8 seeded families (Sanskrit, Bengali, JEE, NEET, ...)
// resolve to `FALLBACK_SUBJECT_PALETTE` — a single flat grey that looks dull
// and "broken" sitting in an otherwise colorful grid. Rather than inventing a
// new hex, an unmatched subject is deterministically assigned one of the 8
// existing seed families (same generator, same formula) by hashing its name —
// so overflow subjects still look intentional and stay visually stable across
// renders/reloads instead of looking grey-and-forgotten.
const SEED_FAMILIES = Object.values(SUBJECT_SEEDS);

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function paletteForSubject(name: string) {
  if (resolveSubjectFamily(name)) return getSubjectPalette(name);
  const seed = SEED_FAMILIES[hashString(name) % SEED_FAMILIES.length];
  return paletteFromSeed(seed);
}

export type SubjectCardContext = 'teachers' | 'papers';

interface SubjectCardProps {
  name: string;
  slug: string;
  /** Icon override — if omitted, an icon is resolved internally by subject
   *  name (one per subject, chosen once here rather than per page). */
  iconComponent?: React.ReactNode;
  index?: number;
  isVisible?: boolean;
  /** Which surface this tile renders for. Controls the meta line copy and
   *  the navigation target. Defaults to 'teachers' (original behaviour). */
  context?: SubjectCardContext;
  /** Live teacher count for this subject — required copy in teachers context. */
  teacherCount?: number;
  /** Live paper count for this subject — shown in both contexts. */
  paperCount?: number;
}

// Icons are lucide, one per subject, chosen once here rather than repeated
// per page. Keys match `src/utils/searchFacets.ts` SUBJECTS plus known aliases
// ("Mathematics" for "Maths", "Computer" for "Computers").
const SUBJECT_ICONS: Record<string, typeof BookOpen> = {
  Accounts: Landmark,
  ACT: GraduationCap,
  AP: GraduationCap,
  Bengali: Languages,
  Biology: Dna,
  'Business Studies': Briefcase,
  CA: FileSpreadsheet,
  CAT: Target,
  Chemistry: FlaskConical,
  CLAT: Scale,
  Commerce: TrendingUp,
  Computer: Monitor,
  Computers: Monitor,
  'Drawing & Painting': Palette,
  Economics: Wallet,
  English: BookOpen,
  'Environmental Science': Leaf,
  Geography: Globe,
  Hindi: Languages,
  'History & Civics': Landmark,
  'Home Science': House,
  JEE: Atom,
  'Legal Studies': Scale,
  Maths: Calculator,
  Mathematics: Calculator,
  NEET: Stethoscope,
  NMAT: GraduationCap,
  Physics: Atom,
  'Political Science': Landmark,
  Psychology: Brain,
  SAT: GraduationCap,
  Science: FlaskConical,
  Sanskrit: Languages,
  'Social Studies': Globe,
  Sociology: Users,
};

// Reverse lookup: subject name -> SEO teachers route, derived from the
// existing path->filter map in subjectMapping.ts. Multi-subject combo
// entries (e.g. "Physics,Chemistry,Biology") are skipped since they don't
// resolve 1:1 from an individual subject name, then re-added by hand for
// the two subject names that legitimately mean "the combo page" (Science,
// Social Studies).
const SUBJECT_NAME_TO_PATH: Record<string, string> = Object.entries(SUBJECT_PATH_TO_FILTER).reduce(
  (acc, [path, filterValue]) => {
    if (!filterValue.includes(',')) acc[filterValue] = path;
    return acc;
  },
  {} as Record<string, string>
);
SUBJECT_NAME_TO_PATH.Science = '/science-tuition-teachers-in-kolkata';
SUBJECT_NAME_TO_PATH['Social Studies'] = '/social-studies-tuition-teachers-in-kolkata';

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function SubjectCardComponent({
  name,
  iconComponent,
  context = 'teachers',
  teacherCount = 0,
  paperCount = 0,
}: SubjectCardProps) {
  const Icon = SUBJECT_ICONS[name] ?? BookOpen;
  const palette = paletteForSubject(name);

  const href =
    context === 'papers'
      ? `/past-papers/results?filter_subjects=${encodeURIComponent(name)}`
      : SUBJECT_NAME_TO_PATH[name] ?? `/all-tuition-teachers-in-kolkata?filter_subjects=${encodeURIComponent(name)}`;

  // DESIGN_SYSTEM §13 "never render a literal zero": with papers data still
  // unseeded, every card in the grid was reading "... · 0 papers" — not an
  // honest "empty" state but a broken-looking one, repeated on every tile.
  // Drop the paper-count clause entirely when there's nothing to report.
  const meta =
    context === 'papers'
      ? pluralize(paperCount, 'paper')
      : paperCount > 0
        ? `${pluralize(teacherCount, 'teacher')} · ${pluralize(paperCount, 'paper')}`
        : pluralize(teacherCount, 'teacher');

  /* VISUAL_LANGUAGE §3/§5 — subject-tinted card: background = subject `tint`,
     icon tile = subject `solid` holding a `badgeText`-coloured icon, title in
     subject `text`, meta in subject `meta`. "Structural contrast is
     intentional" (§5): tinted cards drop the ring/shadow that neutral cards
     (TeacherCard) keep — the tint alone carries the surface. Inline style is
     the sanctioned exception for getSubjectPalette values. */
  // Signpost shape (VISUAL_DIRECTION §2 wayfinding metaphor) at card scale — a
  // pointed left edge reading as a route marker. This grid is a scannable,
  // comparable list (§4 "Crisp"), so no rotation/tape/grain/stickers here —
  // the signpost clip-path is the only character device, and it's structural,
  // not decorative.
  const shapeVariant = SHAPE_VARIANTS[hashString(name) % SHAPE_VARIANTS.length];

  return (
    <Link
      to={href}
      className="signpost-card relative block min-h-11 overflow-hidden rounded-2xl p-4 text-left transition-transform duration-hover hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ backgroundColor: palette.tint }}
    >
      {/* Cut-paper mark (device S) — every subject card gets presence, even
          the flat-palette overflow subjects, so nothing looks unfinished. */}
      <CutPaperShape
        variant={shapeVariant}
        color={palette.solid}
        size={72}
        outlined={false}
        className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.16]"
      />
      <span
        className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: palette.solid, color: palette.badgeText }}
      >
        {iconComponent ?? <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
      </span>
      <h3 className="relative truncate text-card-title font-display font-bold" style={{ color: palette.text }} title={name}>
        {name}
      </h3>
      <p className="relative mt-1 truncate text-meta tabular-nums" style={{ color: palette.meta }}>
        {meta}
      </p>
    </Link>
  );
}

export const SubjectCard = memo(SubjectCardComponent);
