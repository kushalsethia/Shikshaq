/**
 * Shared navigation logic for Navbar and BottomNav.
 *
 * Holds route definitions, `isActive` predicates, and the role-aware
 * account-destination logic that both navs need. Presentation (top bar vs.
 * dark floating pill, Sheet vs. inline dropdown) stays in each component —
 * only the routing/active/role logic lives here.
 */

export const BROWSE_PATH = '/all-tuition-teachers-in-kolkata';
export const PAST_PAPERS_PATH = '/past-papers';
export const DASHBOARD_PATHS = ['/dashboard/student', '/dashboard/guardian', '/dashboard/teacher'] as const;

export type UserRole = 'student' | 'guardian' | 'teacher' | null;

/** Matches any of the ~30 hardcoded subject landing routes ending in this suffix, plus `/browse` and `/subjects` (handoff SB-005: the subjects index is a teacher-funnel surface). */
export const isBrowseActive = (p: string) => p === '/browse' || p === '/subjects' || p.endsWith('-tuition-teachers-in-kolkata');

export const isHomeActive = (p: string) => p === '/';

/** Handoff SC-005: `/schools` is a papers-funnel surface, so it activates the same tab as `/past-papers`. */
export const isPapersActive = (p: string) => p.startsWith(PAST_PAPERS_PATH) || p === '/schools';

export const isAboutActive = (p: string) => p === '/about';

export const isAccountActive = (p: string) =>
  p === '/auth' || p === '/select-role' || (DASHBOARD_PATHS as readonly string[]).includes(p);

/** Role-aware destination for "my dashboard" / account entry points. */
export function getAccountPath(user: unknown, role: UserRole): string {
  if (!user) return '/auth';
  switch (role) {
    case 'student':
      return '/dashboard/student';
    case 'guardian':
      return '/dashboard/guardian';
    case 'teacher':
      return '/dashboard/teacher';
    default:
      return '/select-role';
  }
}

export interface DashboardLinkConfig {
  role: Exclude<UserRole, null>;
  to: string;
  label: string;
}

/** Single source of truth for the role -> dashboard link mapping, used by both signed-in menus. */
export const DASHBOARD_LINKS: DashboardLinkConfig[] = [
  { role: 'student', to: '/dashboard/student', label: 'Student dashboard' },
  { role: 'guardian', to: '/dashboard/guardian', label: 'Guardian dashboard' },
  { role: 'teacher', to: '/dashboard/teacher', label: "Teacher's dashboard" },
];

export function getDashboardLink(role: UserRole): DashboardLinkConfig | undefined {
  return DASHBOARD_LINKS.find((d) => d.role === role);
}
