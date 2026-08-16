import { useLocation } from 'react-router-dom';
import { Home, Search, FileText, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ExpandableTabs, type ExpandableTab } from '@/components/ui/expandable-tabs';
import {
  BROWSE_PATH, isHomeActive, isBrowseActive, isPapersActive, isAccountActive, getAccountPath, type UserRole,
} from '@/lib/nav-config';

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

  const role = (profile?.role as UserRole) || null;
  const accountPath = getAccountPath(user, role);

  const tabs: ExpandableTab[] = [
    { to: '/', label: 'Home', icon: Home, isActive: isHomeActive },
    {
      to: BROWSE_PATH,
      label: 'Browse',
      icon: Search,
      isActive: isBrowseActive,
    },
    {
      to: '/past-papers',
      label: 'Papers',
      icon: FileText,
      isActive: isPapersActive,
      accent: 'brand-blue',
    },
    {
      to: accountPath,
      label: 'Account',
      icon: User,
      isActive: isAccountActive,
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
