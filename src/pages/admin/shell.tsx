import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { BentoPanel } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';

/* Redesign 09i (changelog/09-Join-Onboarding-Shelf-Dashboards-School-Legal-
   Admin.md, AD-001/AD-002) — the one admin header, replacing the earlier S7
   244px rail + 68px toolbar pair. Admin opts out of the bento language
   (tilts, stickers, the eyes panel, the footer, the bottom nav) but keeps the
   30px panel radius, the bone/bg-card fill, the type scale and the pill tab
   row (AD-001's "adopts from the redesign only" list) — one region for every
   breakpoint, not a desktop rail + a separate mobile tab strip.

   Pixel values below are transcribed literally from "Admin Screens
   Redesign.dc.html" per the handoff's pixel-exact override: header padding
   18px 24px, Admin chip h24 r8, avatar 36px, tab row h40 gap6, tab pill
   px16 r999, badge h19 min-w19. */

export interface AdminNavItem {
  key: string;
  label: string;
  path: string;
  /** Real count only — omit rather than show a placeholder. AD-002a: a
   *  queue badge never renders 0, so a caller may also pass 0 and this
   *  component will still hide it. */
  count?: number;
  active: boolean;
}

export interface AdminHeaderProps {
  nav: AdminNavItem[];
  signedInEmail: string;
  className?: string;
}

/** The header + pill tab row, in one `BentoPanel`. Renders at every
 *  breakpoint — admin is dense and desktop-first (AD-001), so it does not
 *  get the consumer redesign's separate mobile header treatment. */
export function AdminHeader({ nav, signedInEmail, className }: AdminHeaderProps) {
  return (
    <BentoPanel
      fill="card"
      edge="top"
      className={cn('flex flex-col gap-4 px-4 py-[18px] sm:px-6', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo's presets top out at 28px (`size="sm"`) — the mockup's literal
              22px is not one of them, and the component has no custom-height
              escape hatch on the <img> itself (only on its <Link> wrapper,
              which does not affect the image). Closest available preset. */}
          <Logo size="sm" />
          <span className="inline-flex h-6 items-center rounded-lg bg-muted px-[9px] text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-secondary">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden truncate text-[13px] text-warm-secondary sm:inline">{signedInEmail}</span>
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted" aria-hidden="true" />
        </div>
      </div>

      <nav
        aria-label="Admin sections"
        className="flex items-center gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {nav.map((item) => {
          const showBadge = typeof item.count === 'number' && item.count > 0;
          return (
            <Link
              key={item.key}
              to={item.path}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                item.active
                  ? 'bg-foreground font-bold text-background'
                  : 'bg-muted font-semibold text-warm-secondary hover:bg-warm-hairline-raised',
              )}
            >
              {item.label}
              {showBadge ? (
                <span
                  className={cn(
                    'inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full px-[5px] text-[11px] font-bold',
                    item.active ? 'bg-brand text-foreground' : 'bg-card text-warm-secondary',
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </BentoPanel>
  );
}

/** The muted strip every admin screen ends on — AD-003's audit-log
 *  reminder, always visible, never just a footnote under the fold. */
export function AdminAuditNote({ auditHref = '/admin/audit' }: { auditHref?: string }) {
  return (
    <BentoPanel
      fill="muted"
      edge="bottom"
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6"
    >
      <span className="text-[12.5px] text-warm-secondary">
        Every action is written to the audit log with your account and a timestamp.
      </span>
      <Link
        to={auditHref}
        className="shrink-0 text-[12.5px] font-bold text-brand-blue transition-colors hover:text-brand-blue-hover"
      >
        Open audit log
      </Link>
    </BentoPanel>
  );
}
