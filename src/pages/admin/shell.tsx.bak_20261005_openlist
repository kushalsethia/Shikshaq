import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BentoPanel } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import { useAdminDebugToggle } from '@/lib/admin-debug';
import { AdminDebugToggle } from '@/components/DebugId';
import { ADMIN_GROUPS, ADMIN_PAGES, type AdminGroupKey, type AdminPageKey } from '@/lib/admin-hints';

/* Handoff 09i AD-001/AD-002/AD-002a — the admin shell.

   Replaces the old S7 "Redesign Admin.dc.html" rail + toolbar (a 244px
   fixed near-black sidebar, desktop-only) with the actual handoff spec:
   admin opts OUT of the bento tilt/sticker/eyes/footer/bottom-nav language
   but opts IN to the panel radius, bone/bg-card fills, type scale and a
   pill tab row (AD-001). Structure and every pixel value below are
   transcribed from "Admin Screens Redesign.dc.html" — one bg-card
   BentoPanel (edge="top", square top / rounded bottom) holding the
   logo+Admin chip+email+avatar row and the pill tab row underneath it. */

export interface AdminNavItem {
  key: AdminPageKey;
  label: string;
  path: string;
  /** One line about the page, shown on hover and in the map of the admin. */
  short: string;
  group: AdminGroupKey;
  /** Real count only — omit rather than show a placeholder. A `0` count
   *  must still be omitted by the caller, never rendered as a badge. */
  count?: number;
  active: boolean;
}

export interface AdminHeaderProps {
  nav: AdminNavItem[];
  /** Signed-in staff email, shown top-right next to the avatar disc. */
  signedInEmail: string;
  className?: string;
}

function Badge({ n, on }: { n: number; on: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full px-[5px] text-[11px] font-bold tabular-nums',
        on ? 'bg-brand text-foreground' : 'bg-card text-warm-secondary',
      )}
    >
      {n}
    </span>
  );
}

/** The header BentoPanel (logo, Admin chip, email, avatar) with a two level
 *  nav inside it: four labelled groups, and under them the active group's
 *  pages. Each page link carries its one-line description (hover and screen
 *  readers), and "Map of the admin" lists every page with its line. */
export function AdminHeader({ nav, signedInEmail, className }: AdminHeaderProps) {
  const debug = useAdminDebugToggle();
  const [mapOpen, setMapOpen] = useState(false);
  const activeItem = nav.find((n) => n.active);
  const activeGroup = (activeItem?.group ?? 'papers') as AdminGroupKey;
  const groupCount = (g: AdminGroupKey) => nav.filter((n) => n.group === g).reduce((a, n) => a + (n.count ?? 0), 0);
  const pagesOfActive = nav.filter((n) => n.group === activeGroup);
  const activeCopy = ADMIN_GROUPS.find((g) => g.key === activeGroup);
  return (
    <BentoPanel fill="card" edge="top" className={cn('px-6 py-[18px] lg:px-6 lg:py-[18px]', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" className="tap-44" />
          <span className="inline-flex h-6 items-center rounded-lg bg-muted px-[9px] text-[12px] font-bold uppercase tracking-[.04em] text-warm-secondary">
            Admin
          </span>
          {/* Owner, 2026-09-28: admin-only debug mode -- shows teacher/paper/
              question/audit ids on screen. Never rendered for a non-admin
              (AdminDebugToggle itself returns null when canToggle is false). */}
          <AdminDebugToggle on={debug.on} canToggle={debug.canToggle} toggle={debug.toggle} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden text-[13px] text-warm-secondary sm:inline">{signedInEmail}</span>
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted" aria-hidden />
        </div>
      </div>

      <nav aria-label="Admin sections" className="mt-4">
        <ul className="flex items-center gap-1.5 overflow-x-auto" aria-label="Groups">
          {ADMIN_GROUPS.map((g) => {
            const first = nav.find((n) => n.group === g.key);
            const on = g.key === activeGroup;
            const n = groupCount(g.key);
            return (
              <li key={g.key} className="shrink-0">
                <Link
                  to={first?.path ?? '/admin'}
                  aria-current={on ? 'true' : undefined}
                  title={g.blurb}
                  className={cn(
                    'inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:h-10',
                    on ? 'bg-panel font-bold text-background' : 'bg-muted font-semibold text-warm-secondary hover:bg-warm-hairline',
                  )}
                >
                  {g.label}
                  {n > 0 ? <Badge n={n} on={on} /> : null}
                </Link>
              </li>
            );
          })}
          <li className="ml-auto shrink-0">
            <button
              type="button"
              aria-expanded={mapOpen}
              aria-controls="admin-map"
              onClick={() => setMapOpen((v) => !v)}
              className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold text-brand-blue transition-colors duration-150 hover:bg-brand-blue-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-10"
            >
              <MapIcon className="h-4 w-4" aria-hidden />
              Map of the admin
            </button>
          </li>
        </ul>

        <ul className="mt-2 flex items-center gap-1.5 overflow-x-auto" aria-label={`${activeCopy?.label ?? ''} pages`}>
          {pagesOfActive.map((item) => (
            <li key={item.key} className="shrink-0">
              <Link
                to={item.path}
                aria-current={item.active ? 'page' : undefined}
                title={item.short}
                className={cn(
                  'inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:h-10',
                  item.active
                    ? 'bg-brand-blue-subtle font-bold text-foreground shadow-[inset_0_0_0_1.5px_hsl(var(--foreground))]'
                    : 'bg-muted font-semibold text-warm-secondary hover:bg-warm-hairline',
                )}
              >
                {item.label}
                {typeof item.count === 'number' && item.count > 0 ? <Badge n={item.count} on={item.active} /> : null}
              </Link>
            </li>
          ))}
        </ul>
        {activeCopy ? <p className="mt-2 text-pretty text-[13px] leading-[1.5] text-warm-secondary">{activeCopy.blurb}</p> : null}

        {mapOpen ? (
          <div id="admin-map" className="mt-3 grid gap-3 rounded-[18px] bg-muted p-4 sm:grid-cols-2 xl:grid-cols-4">
            {ADMIN_GROUPS.map((g) => (
              <div key={g.key}>
                <p className="text-[11px] font-bold uppercase tracking-[.06em] text-warm-label">{g.label}</p>
                <ul className="mt-1.5 space-y-2">
                  {nav
                    .filter((n) => n.group === g.key)
                    .map((n) => (
                      <li key={n.key}>
                        <Link to={n.path} onClick={() => setMapOpen(false)} className="block rounded-xl py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <span className="text-[14px] font-bold text-foreground">{n.label}</span>
                          <span className="block text-[13px] leading-[1.45] text-warm-secondary">{n.short}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </nav>
    </BentoPanel>
  );
}

export type AdminSectionKey = AdminPageKey;

export interface AdminNavCounts {
  /** Teacher applications waiting. */
  approvals?: number;
  /** Teacher reviews waiting. */
  reviews?: number;
  /** Papers waiting in Ready to go live. */
  paperApprovals?: number;
  /** Questions waiting in the Admin queue. */
  adminQueue?: number;
}

/** The fixed tab set, in four groups (Papers, Checking, Teachers, Site), each
 *  page with its one-line description from admin-hints.ts. Every section page
 *  builds its nav through this one function so labels, order and descriptions
 *  can't drift between pages. A count of 0 or undefined never renders a badge. */
export function buildAdminNav(active: AdminSectionKey, counts: AdminNavCounts = {}): AdminNavItem[] {
  const countFor: Partial<Record<AdminPageKey, number | undefined>> = {
    applications: counts.approvals,
    reviews: counts.reviews,
    ready: counts.paperApprovals,
    'admin-queue': counts.adminQueue,
  };
  return ADMIN_GROUPS.flatMap((g) =>
    g.pages.map((key) => {
      const copy = ADMIN_PAGES[key];
      return { key, label: copy.label, path: copy.path, short: copy.short, group: g.key, count: countFor[key], active: active === key };
    }),
  );
}

/** AD-003 footer note, present on every section's content: "every mutation
 *  still writes to the audit log ... the footer note is visible." Square
 *  top corners (butts the panel above), rounded bottom (meets the page's
 *  bottom edge — admin renders no bottom nav to reserve space for). */
export function AdminAuditNote({ className }: { className?: string }) {
  return (
    <BentoPanel
      fill="muted"
      edge="bottom"
      className={cn('flex flex-wrap items-center justify-between gap-2 px-6 py-4 lg:px-6 lg:py-4', className)}
    >
      <span className="text-[13px] text-warm-secondary">
        Every action is written to the audit log with your account and a timestamp.
      </span>
      <Link to="/admin/audit" className="tap-44 text-[13px] font-bold text-brand-blue hover:text-brand-blue-deep">
        Open audit log
      </Link>
    </BentoPanel>
  );
}
