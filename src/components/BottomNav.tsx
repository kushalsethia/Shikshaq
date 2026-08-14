import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, FileText, User, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const BROWSE_PATH = '/all-tuition-teachers-in-kolkata';
const DASHBOARD_PATHS = ['/dashboard/student', '/dashboard/guardian', '/dashboard/teacher'];

interface Tab {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

/**
 * Primary navigation on mobile (see DESIGN_SYSTEM §11 "Bottom navigation").
 * Hidden from `lg:` up, where the top Navbar carries navigation instead.
 *
 * Dark floating pill, detached from the screen edge. The active tab expands
 * (flex-grow transition) to reveal its label next to the icon on a solid
 * brand-orange background — an "expandable tabs" pattern, done with layout
 * transitions instead of a separately-positioned sliding indicator so it
 * never needs a measured bounding-rect / resize-listener sync step.
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

  const tabs: Tab[] = [
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
      <ul className="relative mx-auto flex max-w-sm items-stretch rounded-full bg-panel px-2 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.45)]">
        {tabs.map((tab) => {
          const active = tab.isActive(location.pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.label} className={`py-2 transition-[flex-grow] duration-300 ease-out ${active ? 'flex-[1.6]' : 'flex-1'}`}>
              <NavLink
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                aria-label={tab.label}
                className={`relative flex h-11 w-full items-center justify-center gap-1.5 overflow-hidden rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-panel active:scale-[0.94] ${
                  active ? 'bg-brand' : ''
                }`}
              >
                <Icon
                  className={`relative z-10 h-5 w-5 shrink-0 transition-colors duration-150 ${
                    active ? 'text-white' : 'text-white/50'
                  }`}
                  strokeWidth={active ? 2.25 : 1.8}
                  aria-hidden
                />
                <span
                  aria-hidden
                  className={`relative z-10 whitespace-nowrap text-xs font-medium text-white transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    active ? 'max-w-[6rem] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
