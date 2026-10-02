import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ADMIN_GROUPS, ADMIN_PAGES, PAGE_ORDER, TIPS, groupOf } from '@/lib/admin-hints';

describe('admin hints copy', () => {
  it('has no em or en dashes in the file', () => {
    const src = readFileSync(new URL('./admin-hints.ts', import.meta.url), 'utf8');
    expect(src).not.toMatch(/[\u2013\u2014]/);
  });

  it('puts every page in exactly one group and gives it all its copy', () => {
    const seen = new Set<string>();
    for (const g of ADMIN_GROUPS) {
      expect(g.blurb.length).toBeGreaterThan(10);
      for (const p of g.pages) {
        expect(seen.has(p)).toBe(false);
        seen.add(p);
        expect(groupOf(p).key).toBe(g.key);
      }
    }
    expect([...seen].sort()).toEqual(Object.keys(ADMIN_PAGES).sort());
    expect(PAGE_ORDER).toHaveLength(Object.keys(ADMIN_PAGES).length);
    for (const page of Object.values(ADMIN_PAGES)) {
      expect(page.short.length).toBeGreaterThan(10);
      expect(page.purpose.length).toBeGreaterThan(30);
      expect(page.flow.length).toBeGreaterThan(10);
      expect(page.path.startsWith('/')).toBe(true);
    }
  });

  it('uses plain words, not internal codes or table names', () => {
    const all = JSON.stringify([ADMIN_GROUPS, ADMIN_PAGES, TIPS]);
    expect(all).not.toMatch(/review_bucket|bank_papers|audit_|_id\b|rpc|SECURITY|snake_case/i);
  });
});
