import { useLocation } from 'react-router-dom';
import { Home, Search, FileText, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ExpandableTabs, type ExpandableTab } from '@/components/ui/expandable-tabs';

const BROWSE_PATH = '/all-tuition-teachers-in-kolkata';
const DASHBOARD_PATHS = ['/dashboard/student', '/dashboard/guardian', '/dashboard/teacher'];

/**
 * Primary navigation on mobile (see DESIGN_SYSTEM §11 "Bottom navigation").
 * Hidden from `lg:` up, where the top Navbar carries navigation instead.
 *
 * Dark floating pill, detached from the screen edge. The active tab expands
 * to reveal its label next to the icon on a solid mode-color background —
 * brand orange for teacher-mode destinations, brand blue for the papers
 * destination (VISUAL_LANGUAGE §2.2's two-mode color system) — built on the
 * shared `ExpandableTabs` primitive (framer-motion width/opacity animation,
 * active state driven by route via `useLocation()`).
 */
export function BottomNav() {
  const location = useLocation();
  const { user, profile } = useAuth();

  const role = (profile?.role as 'student' | 'guardian' | 'teacher' | null) || null;
  const accountPath = !user
    ? '/auth'
    : role === 'student'
      ? '/dashboard/student'
      : role === 'guardian'
        ? '/dashboard/guardian'
        : role === 'teacher'
          ? '/dashboard/teacher'
          : '/select-role';

  const tabs: ExpandableTab[] = [
    { to: '/', label: 'Home', icon: Home, isActive: (p) => p === '/' },
    {
      to: BROWSE_PATH,
      label: 'Browse',
      icon: Search,
      isActive: (p) => p === '/browse' || p.endsWith('-tuition-teachers-in-kolkata'),
    },
    {
      to: '/past-papers',
      label: 'Papers',
      icon: FileText,
      isActive: (p) => p.startsWith('/past-papers'),
      accent: 'brand-blue',
    },
    {
      to: accountPath,
      label: 'Account',
      icon: User,
      isActive: (p) => p === '/auth' || p === '/select-role' || DASHBOARD_PATHS.includes(p),
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 bottom-3 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ExpandableTabs
        tabs={tabs}
        pathname={location.pathname}
        theme="dark"
        className="mx-auto max-w-sm rounded-full bg-panel px-2 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.45)]"
      />
    </nav>
  );
}
