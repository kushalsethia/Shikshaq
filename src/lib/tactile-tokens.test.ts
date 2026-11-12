// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import tailwindConfig from '../../tailwind.config';
import { buttonVariants } from '@/components/ui/button';
import { actionToneClass, CHIP, type ActionTone } from '@/lib/checker-button-styles';
import { TABLE_COLUMN_RULE, TABLE_FRAME, TABLE_HEAD_LABEL, TABLE_ROW_PRESS, TABLE_ROW_RULE } from '@/lib/table-styles';
import { BAR_WELL, FIGURE_LABEL, FIGURE_NUMBER, FIGURE_TILE } from '@/lib/chart-styles';

/* The tactile layer (12 Nov 2026) is a set of tokens in src/index.css and a few
   Tailwind names that map to them. These tests pin the parts other stages and
   other people lean on, and guard the "a rule is global" part: nobody may bring
   back a hand-typed press number or the orange focus ring on one control. */

const ROOT = resolve(__dirname, '../..');
const css = readFileSync(join(ROOT, 'src/index.css'), 'utf8');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

describe('tactile tokens in index.css', () => {
  it('defines the press scales, the strong ease-out, the disabled opacity and the focus ring', () => {
    expect(css).toMatch(/--press-scale:\s*0\.97;/);
    expect(css).toMatch(/--press-scale-small:\s*0\.94;/);
    expect(css).toMatch(/--press-scale-card:\s*0\.99;/);
    expect(css).toMatch(/--ease-out-strong:\s*cubic-bezier\(0\.23, 1, 0\.32, 1\);/);
    expect(css).toMatch(/--disabled-opacity:\s*0\.6;/);
    expect(css).toMatch(/--focus-ring:\s*hsl\(var\(--ring\)\);/);
  });

  it('defines the whole shadow family stages 2 and 3 reuse', () => {
    for (const name of ['button', 'button-hover', 'card', 'card-lift', 'table', 'menu', 'popover', 'modal']) {
      expect(css, `--shadow-${name}`).toMatch(new RegExp(`--shadow-${name}:`));
    }
  });

  it('keeps every shadow crisp: no blur radius above 8px in the family', () => {
    const block = css.slice(css.indexOf('--shadow-ink:'), css.indexOf('--shadow-border:'));
    const drops = [...block.matchAll(/0 (\d+)px (\d+)px (?:-?\d+px |0 )?rgb\(/g)];
    expect(drops.length).toBeGreaterThanOrEqual(8);
    // "0 y blur spread colour": the blur is the 2nd number
    for (const m of drops) expect(Number(m[2])).toBeLessThanOrEqual(8);
  });

  it('turns every press squeeze off under prefers-reduced-motion', () => {
    const at = css.indexOf('Tactile press, reduced motion');
    expect(at).toBeGreaterThan(0);
    const block = css.slice(at, at + 700);
    expect(block).toContain('prefers-reduced-motion: reduce');
    expect(block).toMatch(/--press-scale:\s*1;/);
    expect(block).toMatch(/--press-scale-small:\s*1;/);
    expect(block).toMatch(/--press-scale-card:\s*1;/);
  });
});

describe('tactile names in tailwind.config', () => {
  const ext = (tailwindConfig.theme as { extend: Record<string, Record<string, unknown>> }).extend;

  it('maps the shadow names to the tokens', () => {
    expect(ext.boxShadow.button).toBe('var(--shadow-button)');
    expect(ext.boxShadow.card).toBe('var(--shadow-card)');
    expect(ext.boxShadow['card-lift']).toBe('var(--shadow-card-lift)');
    expect(ext.boxShadow.menu).toBe('var(--shadow-menu)');
    expect(ext.boxShadow.modal).toBe('var(--shadow-modal)');
  });

  it('reads the solid edge at the element, so a control can set its own colour', () => {
    expect(String(ext.boxShadow.solid)).toContain('var(--tactile-edge)');
  });

  it('names the three press scales and the disabled opacity', () => {
    expect(ext.scale).toEqual({
      press: 'var(--press-scale)',
      'press-small': 'var(--press-scale-small)',
      'press-card': 'var(--press-scale-card)',
    });
    expect(ext.opacity.disabled).toBe('var(--disabled-opacity)');
  });

  it('makes the bare ease-out and the default easing the strong ease-out', () => {
    const e = ext.transitionTimingFunction as Record<string, string>;
    expect(e.out).toBe('cubic-bezier(0.23, 1, 0.32, 1)');
    expect(e.DEFAULT).toBe('cubic-bezier(0.23, 1, 0.32, 1)');
  });
});

describe('the shared button recipes', () => {
  it('give every redesign variant an edge, and every filled one the same press', () => {
    for (const v of ['primary', 'indigo', 'whatsapp', 'muted', 'dark'] as const) {
      expect(buttonVariants({ variant: v }), v).toMatch(/shadow-(solid|button)/);
    }
    expect(buttonVariants({ variant: 'primary' })).toContain('[--tactile-edge:var(--brand-deep)]');
    expect(buttonVariants({ variant: 'indigo' })).toContain('[--tactile-edge:var(--brand-blue-deep)]');
  });

  it('use the shared focus ring and disabled opacity, and name the properties they animate', () => {
    const base = buttonVariants({ variant: 'primary' });
    expect(base).toContain('focus-visible:ring-focus');
    expect(base).toContain('disabled:opacity-disabled');
    expect(base).not.toMatch(/transition-all/);
  });

  it("give the checker's action buttons an edge, the press and the shared focus ring", () => {
    const tones: ActionTone[] = ['mint', 'dark', 'brand', 'muted', 'outline'];
    for (const t of tones) {
      const c = actionToneClass(t);
      expect(c, t).toContain('active:scale-press');
      expect(c, t).toContain('focus-visible:ring-focus');
      expect(c, t).toContain('disabled:opacity-disabled');
    }
    for (const t of ['mint', 'dark', 'brand', 'muted'] as const) expect(actionToneClass(t), t).toMatch(/shadow-(solid|button)/);
    expect(CHIP).toContain('active:scale-press-small');
  });
});

describe('a rule is global: no one-off press numbers or orange focus rings come back', () => {
  const files = walk(join(ROOT, 'src'));

  it('uses no hand-typed active:scale-[0.9x]; presses name the shared scales', () => {
    const bad = files.filter((f) => /active:scale-\[0\.9\d*\]/.test(readFileSync(f, 'utf8')));
    expect(bad.map((f) => f.replace(ROOT, ''))).toEqual([]);
  });

  it('dims a disabled control with the one token, not a hand-typed 50, 60 or 70', () => {
    const bad = files.filter((f) => /disabled:opacity-(50|60|70)(?![0-9])/.test(readFileSync(f, 'utf8')));
    expect(bad.map((f) => f.replace(ROOT, ''))).toEqual([]);
  });

  it('uses the one focus-ring colour, not the brand orange, on focus-visible rings', () => {
    const bad = files.filter((f) => /focus-visible:ring-brand(?![-a-zA-Z/])/.test(readFileSync(f, 'utf8')));
    expect(bad.map((f) => f.replace(ROOT, ''))).toEqual([]);
  });
});

describe('stage 2: tables share one recipe', () => {
  it('frames a table with a 0.5px edge and the table drop, and rules rows and columns at 0.5px', () => {
    expect(TABLE_FRAME).toContain('shadow-table');
    expect(TABLE_FRAME).toContain('border-[0.5px]');
    expect(TABLE_ROW_RULE).toContain('border-t-[0.5px]');
    expect(TABLE_COLUMN_RULE).toContain('border-l-[0.5px]');
  });

  it('keeps header labels in an ink that reaches 4.5:1 (secondary, not the quaternary 3.5:1 one)', () => {
    expect(TABLE_HEAD_LABEL).toContain('text-warm-secondary');
    expect(TABLE_HEAD_LABEL).not.toContain('text-warm-label');
  });

  it('gives a pressable row the card-level press, and not while a button inside it is pressed', () => {
    expect(TABLE_ROW_PRESS).toContain('scale-press-card');
    expect(TABLE_ROW_PRESS).toContain(':not(:has(button:active))');
    expect(TABLE_ROW_PRESS).not.toMatch(/transition-all/);
  });

  it('puts every table frame through the shared recipe, not a hand-typed shadow or rule', () => {
    const hod = readFileSync(join(ROOT, 'src/components/hod/VerifiersTab.tsx'), 'utf8');
    const admin = readFileSync(join(ROOT, 'src/pages/admin/AdminTable.tsx'), 'utf8');
    expect(hod).toContain('TABLE_FRAME');
    expect(admin).toContain('TABLE_ROW_PRESS');
    expect(admin).not.toMatch(/shadow-\[inset_0_-1px_0_#/);
  });
});

describe('stage 2: charts share one recipe', () => {
  it('sinks a bar track into its card with a hairline ring and a short shade, nothing blurrier than 1px', () => {
    expect(BAR_WELL).toContain('inset_0_1px_1px_0');
    expect(BAR_WELL).toContain('inset_0_0_0_0.5px');
  });

  it('draws a stat tile as a 24/32 number over a 13/20 label on a raised card', () => {
    expect(FIGURE_NUMBER).toContain('text-[24px]');
    expect(FIGURE_NUMBER).toContain('leading-8');
    expect(FIGURE_NUMBER).toContain('tabular-nums');
    expect(FIGURE_LABEL).toContain('text-[13px]');
    expect(FIGURE_LABEL).toContain('leading-5');
    expect(FIGURE_TILE).toContain('shadow-card');
  });

  it('does not animate a data figure: the tile and the well carry no transition', () => {
    for (const c of [BAR_WELL, FIGURE_TILE, FIGURE_NUMBER]) expect(c).not.toMatch(/transition|animate-/);
  });
});
