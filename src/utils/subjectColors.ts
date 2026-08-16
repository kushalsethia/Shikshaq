/**
 * Per-subject colour ramp for subject tiles (SubjectCard and anything else
 * that needs a subject's tint/solid/text colours).
 *
 * Generated from a seed hue/saturation/lightness per subject rather than
 * hand-picked hexes — see design_handoff_shikshaq/_tokens.md, "Subject
 * colour ramp":
 *
 *   tint      = hsl(h s% 93%)
 *   solid     = hsl(h s% l%)
 *   titleText = hsl(h 45% 26%)
 *   metaText  = hsl(h 28% 34%)
 *   badgeText = #fff when the subject is flagged "dark", else #1F1F1F
 *
 * Only 8 subjects have a named seed (Maths, Science, English, Commerce,
 * Computer, Hindi, History, Geography). Everything else — exam-prep names
 * like SAT/CAT/JEE, languages like Bengali/Sanskrit, etc. — falls back to
 * the neutral grey defined below, exactly as the spec calls for.
 */

export interface SubjectColorSet {
  tint: string;
  solid: string;
  titleText: string;
  metaText: string;
  badgeText: string;
}

interface SubjectSeed {
  /** Lowercase prefix matched against the (lowercased) subject name. Using a
   *  prefix rather than an exact match lets one seed cover known aliases,
   *  e.g. "Maths"/"Mathematics" both start with "math", "Computers" starts
   *  with "computer", "History & Civics" starts with "history". */
  prefix: string;
  h: number;
  s: number;
  l: number;
  dark: boolean;
}

// Seeds: Maths 28/85/65 light · Science 145/55/45 dark · English 180/45/50 light ·
// Commerce 220/60/55 dark · Computer 280/50/55 dark · Hindi 0/65/55 dark ·
// History 35/55/50 light · Geography 160/50/45 dark.
const SUBJECT_SEEDS: SubjectSeed[] = [
  { prefix: 'math', h: 28, s: 85, l: 65, dark: false },
  { prefix: 'science', h: 145, s: 55, l: 45, dark: true },
  { prefix: 'english', h: 180, s: 45, l: 50, dark: false },
  { prefix: 'commerce', h: 220, s: 60, l: 55, dark: true },
  { prefix: 'computer', h: 280, s: 50, l: 55, dark: true },
  { prefix: 'hindi', h: 0, s: 65, l: 55, dark: true },
  { prefix: 'history', h: 35, s: 55, l: 50, dark: false },
  { prefix: 'geography', h: 160, s: 50, l: 45, dark: true },
];

const FALLBACK: SubjectColorSet = {
  tint: '#F0EAE2',
  solid: '#7B736B',
  titleText: '#1F1F1F',
  metaText: '#7B736B',
  badgeText: '#fff',
};

// Subjects that read as one of the 8 seeded families for colour purposes even though they
// don't share a text prefix with their family name (e.g. "Physics" -> science). Exact-match
// only, checked before prefix matching, so these never bleed into unrelated subjects.
const SUBJECT_ALIASES: Record<string, string> = {
  physics: 'science',
  chemistry: 'science',
  biology: 'science',
  economics: 'commerce',
  'business studies': 'commerce',
};

const cache = new Map<string, SubjectColorSet>();

/** WCAG contrast ratio between an HSL color and white — see the matching
 *  comment in src/lib/subject-palette.ts's paletteFromSeed for why this
 *  exists: seed.dark is intent carried from the spec's exact h/s/l values,
 *  not a guarantee of real 4.5:1 contrast, and a few seeds' solids land
 *  under that threshold despite reading as "dark" at a glance. */
function whiteContrastRatio(h: number, s: number, l: number): number {
  const sat = s / 100;
  const lig = l / 100;
  const a = sat * Math.min(lig, 1 - lig);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return lig - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(channel(0)) + 0.7152 * toLinear(channel(8)) + 0.0722 * toLinear(channel(4));
  return (1.0 + 0.05) / (luminance + 0.05);
}

/**
 * Resolve the colour set for a subject name (e.g. "Maths", "Computers",
 * "History & Civics"). Unknown/unseeded subjects get the neutral fallback.
 */
export function getSubjectColors(subjectName: string | null | undefined): SubjectColorSet {
  const key = (subjectName ?? '').trim().toLowerCase();
  if (!key) return FALLBACK;

  const cached = cache.get(key);
  if (cached) return cached;

  const lookupKey = SUBJECT_ALIASES[key] ?? key;
  const seed = SUBJECT_SEEDS.find((candidate) => lookupKey.startsWith(candidate.prefix));
  const result: SubjectColorSet = !seed
    ? FALLBACK
    : {
        tint: `hsl(${seed.h} ${seed.s}% 93%)`,
        solid: `hsl(${seed.h} ${seed.s}% ${seed.l}%)`,
        titleText: `hsl(${seed.h} 45% 26%)`,
        metaText: `hsl(${seed.h} 28% 34%)`,
        badgeText: whiteContrastRatio(seed.h, seed.s, seed.l) >= 4.5 ? '#fff' : '#1F1F1F',
      };

  cache.set(key, result);
  return result;
}
