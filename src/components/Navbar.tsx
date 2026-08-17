import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, HelpCircle, Menu, Heart, Shield, GraduationCap, Users,
  ExternalLink, BookMarked, FileText, ClipboardList, Info, type LucideIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { openProductTour } from '@/components/ProductTour';
import { logger } from '@/utils/logger';
import { useSearchExpanded } from '@/hooks/useSearchExpanded';
import {
  Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { getDashboardLink, type UserRole } from '@/lib/nav-config';

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

  /* Logo renders its own <Link>, so this must NOT wrap it in another anchor or
     a button — that produced nested interactive elements (invalid HTML, and a
     real "<a> inside <a>" console warning). Instead the handler is passed down
     and the navigation suppressed, keeping exactly one control. */
  if (isHome) {
    return (
      <Logo
        size="nav"
        className="flex-none"
        ariaLabel="How ShikshAQ works"
        priority
        onClick={(e) => {
          e.preventDefault();
          openProductTour();
        }}
      />
    );
  }

  return <Logo size="nav" className="flex-none" priority />;
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
      className={`sticky top-0 backdrop-blur transition-colors duration-300 border-b lg:hidden ${
        scrolled ? 'border-border bg-background/95' : 'border-transparent bg-background/70'
      } ${searchExpanded ? 'z-30' : 'z-50'}`}
      /* Desktop chrome now lives in <TopBar> (mounted globally, hidden below
         lg). Navbar is retained purely for the mobile sticky bar + sheet menu
         — the hamburger's Sign out / admin / favourites / My teachers items
         have no desktop equivalent elsewhere except TopBar's own account
         dropdown, so this component must not disappear on mobile. */
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: short bar — logo + a single action. The bottom tab bar carries navigation. */}
        <div className="flex h-14 items-center justify-between gap-4">
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

