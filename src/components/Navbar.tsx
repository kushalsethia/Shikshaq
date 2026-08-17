import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Search, HelpCircle, Menu, Heart, Shield, GraduationCap, Users, MessageSquare,
  ThumbsUp, ExternalLink, BookMarked, FileText, ClipboardList, Info, type LucideIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { openProductTour } from '@/components/ProductTour';
import { logger } from '@/utils/logger';
import { useExitPresence } from '@/hooks/useExitPresence';
import { useSearchExpanded } from '@/hooks/useSearchExpanded';
import {
  Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { ExpandableTabs, type ExpandableTab } from '@/components/ui/expandable-tabs';
import {
  BROWSE_PATH, isHomeActive, isBrowseActive, isPapersActive, isAboutActive, getDashboardLink, type UserRole,
} from '@/lib/nav-config';

const NAV_TABS: ExpandableTab[] = [
  { to: '/', label: 'Home', icon: Home, isActive: isHomeActive },
  { to: BROWSE_PATH, label: 'Teachers', icon: GraduationCap, isActive: isBrowseActive },
  { to: '/past-papers', label: 'Papers', icon: FileText, isActive: isPapersActive, accent: 'brand-blue' },
  { to: '/about', label: 'About', icon: Info, isActive: isAboutActive },
];

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';

/**
 * The logo does double duty (components.md C10): on the home page there is
 * nowhere to navigate to, so tapping it opens the product tour; everywhere else
 * it goes home, which is what people expect a wordmark to do.
 *
 * The tour itself is mounted by the page and listens for the event, so the
 * trigger needs no prop path to it.
 */
function LogoOrTourTrigger() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return (
      <button
        type="button"
        onClick={openProductTour}
        aria-label="How ShikshAQ works"
        className={`flex h-11 flex-none items-center rounded-lg ${FOCUS_RING}`}
      >
        <Logo size="nav" className="flex-none" />
      </button>
    );
  }

  return (
    <Link to="/" aria-label="ShikshAQ home" className={`flex h-11 flex-none items-center rounded-lg ${FOCUS_RING}`}>
      <Logo size="nav" className="flex-none" />
    </Link>
  );
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const userRole = (profile?.role as UserRole) || null;
  const dashboardLink = getDashboardLink(userRole);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (adminError) {
          if (import.meta.env.DEV) logger.log('Error checking admin status:', adminError.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(adminData));
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error:', error);
        setIsAdmin(false);
      }
    }
    checkAdminStatus();
  }, [user]);

  // Close the mobile sheet on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const searchExpanded = useSearchExpanded();
  const initial = (user?.email?.charAt(0) || '?').toUpperCase();

  // Nav track dissolve — VISUAL_LANGUAGE.md §9: the header's hairline/backdrop
  // fades in once the page has scrolled past 48px, distinguishing "at top" from
  // "scrolled" states. `prefers-reduced-motion` makes the transition instant via
  // the global guard in index.css, so no separate branch is needed here.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 backdrop-blur transition-colors duration-300 border-b ${
        scrolled ? 'border-border bg-background/95' : 'border-transparent bg-background/70'
      } ${searchExpanded ? 'z-30' : 'z-50'}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: short bar — logo + a single action. The bottom tab bar carries navigation. */}
        <div className="flex h-14 items-center justify-between gap-4 lg:hidden">
          <LogoOrTourTrigger />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={`flex h-11 w-11 flex-none items-center justify-center rounded-full text-foreground shadow-border transition-colors duration-150 hover:bg-muted active:scale-[0.97] ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="max-h-[80vh] overflow-y-auto rounded-t-2xl border-border bg-card p-4 pb-[env(safe-area-inset-bottom)]"
            >
              <SheetHeader className="pb-2">
                <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              </SheetHeader>

              <nav className="grid gap-1 pb-4">
                <SheetLink to="/all-tuition-teachers-in-kolkata" icon={Search} label="Browse teachers" />
                <SheetLink to="/past-papers" icon={FileText} label="Past papers" />
                <hr className="my-2 border-border" />
                <SheetLink to="/about" icon={Info} label="About us" />
                <SheetLink to="/join" icon={ExternalLink} label="Join as a teacher" />
                <SheetLink to="/more" icon={HelpCircle} label="Help" />
                <SheetLink to="/faq" icon={HelpCircle} label="FAQ" />

                {user ? (
                  <>
                    <hr className="my-2 border-border" />
                    {dashboardLink && (
                      <SheetLink
                        to={dashboardLink.to}
                        icon={userRole === 'guardian' ? Users : GraduationCap}
                        label={dashboardLink.label}
                      />
                    )}
                    <SheetLink to="/liked-teachers" icon={Heart} label="Favourite teachers" />
                    {userRole === 'student' && <SheetLink to="/my-teachers" icon={BookMarked} label="My teachers" />}
                    {isAdmin && (
                      <>
                        <SheetLink to="/admin/recommendations" icon={Shield} label="Admin: Recommendations" />
                        <SheetLink to="/admin/teachers" icon={GraduationCap} label="Admin: Teachers" />
                        <SheetLink to="/admin/applications" icon={ClipboardList} label="Admin: Applications" />
                        <SheetLink to="/admin/papers" icon={FileText} label="Admin: Past papers" />
                      </>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          await signOut();
                        } finally {
                          window.location.href = '/';
                        }
                      }}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 text-base font-semibold text-destructive transition-colors duration-150 hover:bg-muted ${FOCUS_RING}`}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/auth')}
                    className={`mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-brand px-4 text-base font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover active:scale-[0.97] ${FOCUS_RING}`}
                  >
                    Sign in
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: full navigation */}
        <div className="hidden h-16 items-center gap-6 lg:flex">
          <LogoOrTourTrigger />

          <div
            className={`flex flex-1 justify-center rounded-full transition-all duration-300 ${
              scrolled ? 'bg-transparent p-0' : 'bg-warm-muted/70 p-1'
            }`}
          >
            <ExpandableTabs
              tabs={NAV_TABS}
              pathname={location.pathname}
              theme="light"
              className="max-w-md"
            />
          </div>

          <div className="flex flex-none items-center gap-3">
            <Link
              to="/join"
              className={`flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground ${FOCUS_RING}`}
            >
              Join as a teacher
            </Link>
            {user ? (
              <UserMenu user={user} userRole={userRole} isAdmin={isAdmin} signOut={signOut} initial={initial} />
            ) : (
              <Link
                to="/auth"
                className={`flex min-h-[44px] items-center whitespace-nowrap rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover active:scale-[0.97] ${FOCUS_RING}`}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function SheetLink({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <SheetClose asChild>
      <Link
        to={to}
        className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-base font-medium text-foreground transition-colors duration-150 hover:bg-muted ${FOCUS_RING}`}
      >
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
        {label}
      </Link>
    </SheetClose>
  );
}

interface UserMenuProps {
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
  userRole: UserRole;
  isAdmin: boolean;
  signOut: ReturnType<typeof useAuth>['signOut'];
  initial: string;
}

function UserMenu({ user, userRole, isAdmin, signOut, initial }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuPresence = useExitPresence(open);
  const dashboardLink = getDashboardLink(userRole);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground shadow-border transition-colors duration-150 hover:bg-brand-subtle active:scale-[0.97] ${FOCUS_RING}`}
      >
        {initial}
      </button>
      {menuPresence.mounted && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-50" />
          <div
            className={`absolute right-0 top-full z-[51] mt-2 grid min-w-[220px] gap-1 rounded-2xl bg-card p-2 shadow-border-hover ${
              menuPresence.closing ? 'animate-accordion-up' : 'animate-fade-slide-up'
            }`}
          >
            <div className="truncate px-3 py-2 text-xs text-muted-foreground">{user.email}</div>
            <hr className="border-border" />
            {dashboardLink && (
              <DropdownLink
                to={dashboardLink.to}
                icon={userRole === 'guardian' ? Users : GraduationCap}
                label={dashboardLink.label}
                onClick={() => setOpen(false)}
              />
            )}
            <DropdownLink to="/liked-teachers" icon={Heart} label="Favourite teachers" onClick={() => setOpen(false)} />
            {userRole === 'student' && <DropdownLink to="/my-teachers" icon={BookMarked} label="My teachers" onClick={() => setOpen(false)} />}
            {isAdmin && (
              <>
                <hr className="border-border" />
                <DropdownLink to="/admin/recommendations" icon={Shield} label="Recommendations" onClick={() => setOpen(false)} />
                <DropdownLink to="/admin/comments" icon={MessageSquare} label="Comments" onClick={() => setOpen(false)} />
                <DropdownLink to="/admin/upvotes" icon={ThumbsUp} label="Upvotes" onClick={() => setOpen(false)} />
                <DropdownLink to="/admin/feedback" icon={MessageSquare} label="Feedback" onClick={() => setOpen(false)} />
                <DropdownLink to="/admin/teachers" icon={GraduationCap} label="Teachers" onClick={() => setOpen(false)} />
                <DropdownLink to="/admin/applications" icon={ClipboardList} label="Applications" onClick={() => setOpen(false)} />
                <DropdownLink to="/admin/papers" icon={FileText} label="Past papers" onClick={() => setOpen(false)} />
              </>
            )}
            <hr className="border-border" />
            <button
              onClick={async () => {
                setOpen(false);
                try {
                  await signOut();
                } finally {
                  window.location.href = '/';
                }
              }}
              className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold text-destructive transition-colors duration-150 hover:bg-muted ${FOCUS_RING}`}
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DropdownLink({ to, icon: Icon, label, onClick }: { to: string; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted ${FOCUS_RING}`}
    >
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      {label}
    </Link>
  );
}
