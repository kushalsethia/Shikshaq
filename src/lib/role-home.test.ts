import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() } },
}));

import { ADMIN_HOME, CHECKER_HOME, HOD_HOME, homeFor, roleLinks } from '@/lib/role-home';
import { ADMIN_GROUPS } from '@/lib/admin-hints';
import { buildAdminNav } from '@/pages/admin/shell';

/* Each role lands on one home, and every link the roles are given resolves to
   a real route (read from App.tsx, so renaming a route fails here). */

const app = readFileSync('src/App.tsx', 'utf8');
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
const matches = (href: string) => routes.some((r) => new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+') + '$').test(href.split(/[?#]/)[0]));

describe('role home', () => {
  it('sends each role to its own home, admin first', () => {
    expect(homeFor({ isAdmin: false, isHod: false, isChecker: true })).toBe('/checker');
    expect(homeFor({ isAdmin: false, isHod: true, isChecker: true })).toBe('/hod');
    expect(homeFor({ isAdmin: true, isHod: true, isChecker: true })).toBe('/admin');
    expect(homeFor({ isAdmin: false, isHod: false, isChecker: false })).toBeNull();
  });

  it('offers one account menu link per role, in order', () => {
    expect(roleLinks({ isAdmin: false, isHod: false, isChecker: false })).toEqual([]);
    expect(roleLinks({ isAdmin: false, isHod: false, isChecker: true }).map((l) => l.label)).toEqual(['My work']);
    expect(roleLinks({ isAdmin: false, isHod: true, isChecker: false }).map((l) => l.label)).toEqual(['HOD view']);
    expect(roleLinks({ isAdmin: true, isHod: true, isChecker: true }).map((l) => l.label)).toEqual(['My work', 'HOD view', 'Admin']);
  });

  it('every home and menu link is a real route', () => {
    for (const to of [ADMIN_HOME, HOD_HOME, CHECKER_HOME]) expect(matches(to), to).toBe(true);
    for (const l of roleLinks({ isAdmin: true, isHod: true, isChecker: true })) expect(matches(l.to), l.to).toBe(true);
  });
});

describe('admin menu after the clean-up', () => {
  const nav = buildAdminNav('library');

  it('keeps four short tabs, with the rarely used pages under More', () => {
    expect(ADMIN_GROUPS.map((g) => g.label)).toEqual(['Papers', 'Checking', 'Teachers', 'More']);
    const day = ADMIN_GROUPS.filter((g) => g.key !== 'more').flatMap((g) => g.pages);
    expect(day.length).toBeLessThanOrEqual(8);
    expect(day).toContain('hod');
    expect(day).toContain('admin-queue');
    expect(ADMIN_GROUPS.find((g) => g.key === 'more')!.pages).toEqual(
      expect.arrayContaining(['reviews', 'feedback', 'audit', 'checker-log']),
    );
  });

  it('puts the HOD view in the menu and it resolves', () => {
    const hod = nav.find((n) => n.key === 'hod');
    expect(hod?.path).toBe('/hod');
    expect(matches('/hod')).toBe(true);
  });

  it('every menu link resolves', () => {
    for (const n of nav) expect(matches(n.path), `${n.label} -> ${n.path}`).toBe(true);
  });
});

/* Static links written straight into the page files must resolve too. Only
   plain string literals are checked (a template with ${} is dynamic). */
describe('links written into the role screens', () => {
  const files = [
    'src/pages/Checker.tsx',
    'src/pages/Hod.tsx',
    'src/pages/CheckerHelp.tsx',
    'src/pages/CheckerPractice.tsx',
    'src/components/layout/TopBar.tsx',
    'src/components/Navbar.tsx',
    'src/components/admin/HodSection.tsx',
    'src/lib/checker-onboarding.ts',
  ];
  it('every to="/x" and navigate(\'/x\') points at a real route', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      const found = [...src.matchAll(/\bto="(\/[^"{}$]*)"/g), ...src.matchAll(/navigate\('(\/[^'$`]*)'/g), ...src.matchAll(/_PATH = '(\/[^']*)'/g)].map((m) => m[1]);
      for (const href of found) if (!matches(href)) bad.push(`${f}: ${href}`);
    }
    expect(bad).toEqual([]);
  });
});
