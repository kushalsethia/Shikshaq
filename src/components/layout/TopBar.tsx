import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search, FileText, BookOpen, School, Heart, Shield, GraduationCap, Users,
  MessageSquare, ThumbsUp, ClipboardList, BookMarked, type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Logo } from "@/components/Logo";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { openProductTour } from "@/components/ProductTour";
import { logger } from "@/utils/logger";
import { useExitPresence } from "@/hooks/useExitPresence";
import {
  BROWSE_PATH,
  PAST_PAPERS_PATH,
  getDashboardLink,
  isBrowseActive,
  isPapersActive,
  type UserRole,
} from "@/lib/nav-config";

/* Redesign S2 (components.md §3, design.md §5).

   The desktop counterpart to the bottom nav: a 72px near-black bar carrying the
   logo, four nav links with icons, Sign in, and the orange "List yourself" CTA.
   `hidden lg:flex` — below lg the floating pill (S1) is the navigation, and the
   two must never both be visible.

   On papers routes the orange CTA is replaced by the indigo Papers-mode tag,
   so the accent in view always matches the mode (design.md §0.6). */

const NAV_LINKS = [
  { to: BROWSE_PATH, label: "Find teachers", icon: Search, match: isBrowseActive },
  { to: PAST_PAPERS_PATH, label: "Past papers", icon: FileText, match: isPapersActive },
  { to: "/maths-tuition-teachers-in-kolkata", label: "Subjects", icon: BookOpen, match: () => false },
  { to: "/cbse-ncert-tuition-teachers-in-kolkata", label: "Schools", icon: School, match: () => false },
] as const;

function LogoOrTourTrigger() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) {
    return (
      <Logo
        className="h-8 w-auto"
        onDark
        ariaLabel="How ShikshAQ works"
        onClick={(e) => {
          e.preventDefault();
          openProductTour();
        }}
      />
    );
  }

  return <Logo className="tap-44 h-8 w-auto" onDark priority />;
}

export function TopBar({ className }: { className?: string }) {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const role = (profile?.role as UserRole) || null;
  const papersMode = isPapersActive(location.pathname);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPresence = useExitPresence(menuOpen);
  const initial = (user?.email?.charAt(0) || "?").toUpperCase();
  const dashboardLink = getDashboardLink(role);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (adminError) {
          if (import.meta.env.DEV) logger.log("Error checking admin status:", adminError.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(adminData));
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error("Error:", error);
        setIsAdmin(false);
      }
    }
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn("hidden bg-panel text-background lg:block", className)}
      /* One <nav> per bar; the links inside are the primary desktop navigation. */
    >
      <PageContainer>
        <nav aria-label="Primary" className="flex h-[72px] items-center gap-8">
          <LogoOrTourTrigger />

          <ul className="flex items-center gap-2">
            {NAV_LINKS.map(({ to, label, icon: Icon, match }) => {
              const active = match(location.pathname);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-full px-4 text-body-secondary font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
                      active
                        ? "bg-white/15 text-background"
                        : "text-background/70 hover:bg-white/10 hover:text-background",
                    )}
                  >
                    <Icon aria-hidden className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-3">
            {papersMode ? (
              <Chip tone="dark-on-papers" size={40} asChild>
                Papers mode
              </Chip>
            ) : null}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-background transition-colors duration-150 hover:bg-white/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
                >
                  {initial}
                </button>
                {menuPresence.mounted && (
                  <>
                    <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-50" />
                    <div
                      className={cn(
                        "absolute right-0 top-full z-[51] mt-2 grid min-w-[220px] gap-1 rounded-2xl bg-card p-2 text-foreground shadow-border-hover",
                        menuPresence.closing ? "animate-accordion-up" : "animate-fade-slide-up",
                      )}
                    >
                      <div className="truncate px-3 py-2 text-xs text-muted-foreground">{user.email}</div>
                      <hr className="border-border" />
                      {dashboardLink && (
                        <TopBarMenuLink
                          to={dashboardLink.to}
                          icon={role === "guardian" ? Users : GraduationCap}
                          label={dashboardLink.label}
                          onClick={() => setMenuOpen(false)}
                        />
                      )}
                      <TopBarMenuLink to="/liked-teachers" icon={Heart} label="Favourite teachers" onClick={() => setMenuOpen(false)} />
                      {role === "student" && (
                        <TopBarMenuLink to="/my-teachers" icon={BookMarked} label="My teachers" onClick={() => setMenuOpen(false)} />
                      )}
                      {isAdmin && (
                        <>
                          <hr className="border-border" />
                          <TopBarMenuLink to="/admin/recommendations" icon={Shield} label="Recommendations" onClick={() => setMenuOpen(false)} />
                          <TopBarMenuLink to="/admin/comments" icon={MessageSquare} label="Comments" onClick={() => setMenuOpen(false)} />
                          <TopBarMenuLink to="/admin/upvotes" icon={ThumbsUp} label="Upvotes" onClick={() => setMenuOpen(false)} />
                          <TopBarMenuLink to="/admin/feedback" icon={MessageSquare} label="Feedback" onClick={() => setMenuOpen(false)} />
                          <TopBarMenuLink to="/admin/teachers" icon={GraduationCap} label="Teachers" onClick={() => setMenuOpen(false)} />
                          <TopBarMenuLink to="/admin/applications" icon={ClipboardList} label="Applications" onClick={() => setMenuOpen(false)} />
                          <TopBarMenuLink to="/admin/papers" icon={FileText} label="Past papers" onClick={() => setMenuOpen(false)} />
                        </>
                      )}
                      <hr className="border-border" />
                      <button
                        onClick={async () => {
                          setMenuOpen(false);
                          try {
                            await signOut();
                          } finally {
                            window.location.href = "/";
                          }
                        }}
                        className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold text-destructive transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex h-10 items-center rounded-full px-4 text-body-secondary font-medium text-background/80 transition-colors duration-150 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
              >
                Sign in
              </Link>
            )}

            {papersMode ? null : (
              <Button asChild variant="primary" size={40}>
                <Link to="/join">List yourself</Link>
              </Button>
            )}
          </div>
        </nav>
      </PageContainer>
    </header>
  );
}

function TopBarMenuLink({ to, icon: Icon, label, onClick }: { to: string; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      {label}
    </Link>
  );
}
