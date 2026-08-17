import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, FileText, BookOpen, School } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Logo } from "@/components/Logo";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/lib/auth-context";
import {
  BROWSE_PATH,
  PAST_PAPERS_PATH,
  getAccountPath,
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

export function TopBar({ className }: { className?: string }) {
  const location = useLocation();
  const { user, profile } = useAuth();
  const role = (profile?.role as UserRole) || null;
  const papersMode = isPapersActive(location.pathname);

  return (
    <header
      className={cn("hidden bg-panel text-background lg:block", className)}
      /* One <nav> per bar; the links inside are the primary desktop navigation. */
    >
      <PageContainer>
        <nav aria-label="Primary" className="flex h-[72px] items-center gap-8">
          <Link
            to="/"
            className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
          >
            <Logo className="h-8 w-auto" onDark />
            <span className="sr-only">ShikshAQ home</span>
          </Link>

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
              <Button asChild variant="muted" size={40}>
                <Link to={getAccountPath(user, role)}>Account</Link>
              </Button>
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
