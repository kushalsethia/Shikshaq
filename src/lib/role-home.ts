/**
 * Each role lands on one home (owner, 7 Oct 2026: "UI is too confusing to
 * navigate"). Pure: which page a person starts on and which links the account
 * menu offers, given the roles they hold. The roles themselves are read from
 * the database by role-home-api.ts and the badge hooks.
 *
 * is_paper_checker() and is_hod() are both true for an admin, so the order
 * below decides: admin, then HOD, then checker.
 */

export interface Roles {
  isAdmin: boolean;
  isHod: boolean;
  isChecker: boolean;
}

export const ADMIN_HOME = '/admin';
export const HOD_HOME = '/hod';
export const CHECKER_HOME = '/checker';

/** Where this person starts, or null when they hold no staff role (the ordinary site home). */
export function homeFor(r: Roles): string | null {
  if (r.isAdmin) return ADMIN_HOME;
  if (r.isHod) return HOD_HOME;
  if (r.isChecker) return CHECKER_HOME;
  return null;
}

export interface RoleLink {
  key: 'my-work' | 'hod' | 'admin';
  to: string;
  label: string;
}

/** The staff links for the account menu, one per role, in the order a person is most likely to want them. */
export function roleLinks(r: Roles): RoleLink[] {
  const out: RoleLink[] = [];
  if (r.isChecker) out.push({ key: 'my-work', to: CHECKER_HOME, label: 'My work' });
  if (r.isHod) out.push({ key: 'hod', to: HOD_HOME, label: 'HOD view' });
  if (r.isAdmin) out.push({ key: 'admin', to: ADMIN_HOME, label: 'Admin' });
  return out;
}
