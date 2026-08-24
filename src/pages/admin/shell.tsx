import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { BentoPanel } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';

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
  key: string;
  label: string;
  path: string;
  /** Real count only — omit rather than show a placeholder. AD-002a: only
   *  Approvals and Reviews (the two queues) ever pass this; a `0` count
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

/** AD-002: the header BentoPanel (logo/Admin chip/email/avatar) with the
 *  pill tab row nested inside it, exactly as the dc.html mockup lays it
 *  out — square top corners (butts the page's top edge), rounded bottom. */
export function AdminHeader({ nav, signedInEmail, className }: AdminHeaderProps) {
  return (
    <BentoPanel fill="card" edge="top" className={cn('px-6 py-[18px] lg:px-6 lg:py-[18px]', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="inline-flex h-6 items-center rounded-lg bg-muted px-[9px] text-[11.5px] font-bold uppercase tracking-[.04em] text-warm-secondary">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden text-[13px] text-warm-secondary sm:inline">{signedInEmail}</span>
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted" aria-hidden />
        </div>
      </div>

      <nav aria-label="Admin sections" className="mt-4 flex items-center gap-1.5 overflow-x-auto">
        {nav.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            aria-current={item.active ? 'page' : undefined}
            className={cn(
              'inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              item.active
                ? 'bg-panel font-bold text-background'
                : 'bg-muted font-semibold text-warm-secondary hover:bg-warm-hairline',
            )}
          >
            {item.label}
            {typeof item.count === 'number' && item.count > 0 ? (
              <span
                className={cn(
                  'inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full px-[5px] text-[11px] font-bold tabular-nums',
                  item.active ? 'bg-brand text-foreground' : 'bg-card text-warm-secondary',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </BentoPanel>
  );
}

export type AdminSectionKey = 'approvals' | 'teachers' | 'papers' | 'reviews' | 'audit';

/** AD-002a: the fixed five-tab set and order — Approvals · Teachers ·
 *  Papers · Reviews · Audit — with badges only on the two queues
 *  (Approvals, Reviews). Every section page builds its nav through this
 *  one function so the label text and tab order can't drift between
 *  pages. `approvalsCount`/`reviewsCount` are the two real counts callers
 *  already fetch (or already have in memory); omit or pass 0 for "no
 *  badge" — this never renders a `0` badge either way. */
export function buildAdminNav(active: AdminSectionKey, counts: { approvals?: number; reviews?: number }): AdminNavItem[] {
  return [
    { key: 'approvals', label: 'Approvals', path: '/admin/approvals', count: counts.approvals, active: active === 'approvals' },
    { key: 'teachers', label: 'Teachers', path: '/admin/teachers', active: active === 'teachers' },
    { key: 'papers', label: 'Papers', path: '/admin/papers', active: active === 'papers' },
    { key: 'reviews', label: 'Reviews', path: '/admin/reviews', count: counts.reviews, active: active === 'reviews' },
    { key: 'audit', label: 'Audit', path: '/admin/audit', active: active === 'audit' },
  ];
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
      className={cn('flex flex-wrap items-center justify-between gap-2 px-6 py-4', className)}
    >
      <span className="text-[12.5px] text-warm-secondary">
        Every action is written to the audit log with your account and a timestamp.
      </span>
      <Link to="/admin/audit" className="text-[12.5px] font-bold text-brand-blue hover:text-brand-blue-deep">
        Open audit log
      </Link>
    </BentoPanel>
  );
}
