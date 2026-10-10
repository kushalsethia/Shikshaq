/* The colours a matched pair or a found word takes, one per pair, so the student can see which went with which.
   Tokens only (CRAFT.md section 3). */

/** A matched pair's tile: strong fills, each with its own text colour. */
export const PAIR_SOLID = [
  'bg-mint-solid text-foreground',
  'bg-brand-blue text-brand-blue-foreground',
  'bg-brand text-brand-foreground',
  'bg-panel text-background',
  'bg-brand-blue-deep text-white',
  'bg-brand-deep text-white',
];

/** A found word's letters in the word search: light tints with dark text. */
export const PAIR_TINT = [
  'bg-mint text-foreground',
  'bg-brand-blue-subtle text-brand-blue-deep',
  'bg-brand-subtle text-brand-deep',
  'bg-warm-band text-foreground',
  'bg-peach-tint text-brand-deep',
  'bg-success-subtle-bg text-success-subtle-text',
];

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
