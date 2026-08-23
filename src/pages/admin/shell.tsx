import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

/* Redesign S7 (components.md §3) — the desktop admin shell.

   244px fixed near-black rail (logo + ADMIN tag, nav with real per-section
   pending counts, signed-in card) + a body with a 68px toolbar. Desktop-first
   — admin is the one place desktop leads (design.md §5, changelog C-061).
   The mobile console keeps its existing tab row (design.md §4 "Admin (S12)");
   the rail and toolbar here only render lg: and up.

   Split into two chrome-only pieces (AdminRail, AdminToolbar) rather than one
   shell that wraps children, so a page's body content — and its data-fetching
   hooks — mount exactly once instead of once per breakpoint.

   Rule 10 is absolute here: no stickers, no tilts, no blobs. Pixel values
   below are transcribed literally from "Redesign Admin.dc.html" (A1–A5) per
   the owner's pixel-exact override — rail 244px, rail padding 22px 16px, nav
   gap 3px, nav item 44px/radius 12px, toolbar 68px/padding 0 28px. */

export interface AdminNavItem {
  key: string;
  label: string;
  path: string;
  /** Real count only — omit rather than show a placeholder. */
  count?: number;
  active: boolean;
}

export interface AdminRailProps {
  nav: AdminNavItem[];
  signedInName: string;
  className?: string;
}

/** The 244px fixed rail. Renders lg: and up only. */
export function AdminRail({ nav, signedInName, className }: AdminRailProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-20 hidden w-[244px] flex-col gap-[22px] overflow-y-auto bg-panel px-4 py-[22px] lg:flex',
        className,
      )}
    >
      <div className="flex items-center gap-[10px]">
        <Logo className="h-7 w-auto brightness-0 invert" />
        <span className="inline-flex h-[22px] items-center rounded-full bg-background/12 px-[9px] text-[10.5px] font-extrabold tracking-[.06em] text-background/75">
          ADMIN
        </span>
      </div>

      <nav aria-label="Admin sections" className="flex flex-col gap-[3px]">
        {nav.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            aria-current={item.active ? 'page' : undefined}
            className={cn(
              'flex h-11 items-center gap-[11px] rounded-xl px-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel',
              item.active ? 'bg-background/12 font-bold text-background' : 'font-semibold text-background/62 hover:bg-background/8 hover:text-background',
            )}
          >
            <span className="flex-1">{item.label}</span>
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-[7px] text-[11.5px] font-bold tabular-nums',
                  item.active ? 'bg-brand text-brand-foreground' : 'bg-background/12 text-background/70',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-background/6 p-[14px]">
        <div className="text-[11px] font-bold uppercase tracking-[.07em] text-background/45">Signed in</div>
        <div className="mt-[5px] text-sm font-bold text-background">{signedInName}</div>
        <div className="mt-0.5 text-[12.5px] leading-[1.45] text-background/55">
          Every approve, reject and edit is logged with your name.
        </div>
      </div>
    </aside>
  );
}

export interface AdminToolbarProps {
  title: string;
  /** Real "N waiting"-style badge. Omit if no count applies. */
  badge?: string;
  /** Search field slot, top-right of the toolbar. Omit if the page has no search. */
  search?: ReactNode;
  /** Sort control slot, top-right of the toolbar, next to search. Only pass this when a
   *  real, meaningful data column backs the sort (e.g. created_at) — never a placeholder. */
  sort?: ReactNode;
  className?: string;
}

/** The 68px toolbar. Renders lg: and up only. */
export function AdminToolbar({ title, badge, search, sort, className }: AdminToolbarProps) {
  return (
    <div className={cn('hidden h-[68px] items-center justify-between gap-4 border-b border-warm-hairline bg-card px-7 lg:flex', className)}>
      <div className="flex items-center gap-[14px]">
        <span className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-foreground">{title}</span>
        {badge ? (
          <span className="inline-flex h-[26px] items-center whitespace-nowrap rounded-full bg-brand-subtle px-[11px] text-xs font-bold tabular-nums text-brand-deep">
            {badge}
          </span>
        ) : null}
      </div>
      {(search || sort) ? (
        <div className="flex items-center gap-2">
          {search}
          {sort}
        </div>
      ) : null}
    </div>
  );
}
