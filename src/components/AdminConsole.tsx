import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { AdminHeader, AdminAuditNote, type AdminNavItem } from '@/pages/admin/shell';
import { toast as sonnerToast } from 'sonner';
import { SURFACE_TOKENS, ACCENT_TOKENS, MODE_TOKENS, EASE } from '@/utils/searchFacets';
import type { User } from '@supabase/supabase-js';

/**
 * Shared admin-gate check, used by every /admin/* page instead of each page
 * re-implementing its own `admins` lookup + redirect. Kept separate from
 * AdminConsole (the layout shell) since a couple of callers need the
 * isAdmin/checkingAdmin flags before they've fetched their own data.
 */
export function useAdminGuard(
  user: User | null | undefined,
  opts?: { onGranted?: () => void; redirectOnDenied?: boolean }
) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) {
        if (!cancelled) {
          setCheckingAdmin(false);
          setIsAdmin(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (!error && data?.id === user.id) {
          setIsAdmin(true);
          opts?.onGranted?.();
        } else {
          setIsAdmin(false);
          if (opts?.redirectOnDenied) {
            navigate('/');
          }
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setCheckingAdmin(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { isAdmin, checkingAdmin };
}

/**
 * Resolves admin user ids (e.g. `reviewed_by`/`approved_by` columns) to
 * display names, so admin consoles can show "Reviewed by X" instead of a
 * raw uuid. Silently returns an empty map on failure — display falls back
 * to "an admin".
 */
export function useReviewerNames(reviewerIds: (string | null | undefined)[]) {
  const [names, setNames] = useState<Record<string, string>>({});
  const key = Array.from(new Set(reviewerIds.filter(Boolean))).sort().join(',');

  useEffect(() => {
    let cancelled = false;
    const ids = key ? key.split(',') : [];
    if (ids.length === 0) {
      setNames({});
      return;
    }

    async function run() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', ids);

      if (cancelled || error || !data) return;

      const map: Record<string, string> = {};
      data.forEach((row) => {
        map[row.id] = row.full_name || row.email || 'an admin';
      });
      setNames(map);
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return names;
}

/**
 * Shared shell for every /admin/* console screen — changelog 09i
 * (AD-001/AD-002/AD-002a). One `AdminHeader` (logo, Admin chip, signed-in
 * email, avatar, pill tab row) at every breakpoint — admin does not get the
 * consumer redesign's tilts, stickers, eyes panel, footer or bottom nav
 * (AD-001), only the 30px panel radius, the bone fill and the pill tabs.
 *
 * AD-002a's literal tab set is five: Approvals · Teachers · Papers ·
 * Reviews · Audit, with a count badge on only the two queues. This
 * codebase's actual admin surface has grown three more real, live,
 * mutation-backed sections the handoff's mockup never details
 * (Recommendations, Upvotes, Feedback) — dropping them from the nav would
 * silently take away working functionality, so they stay as three more
 * tabs after the canonical five, styled identically but never badged
 * (AD-002a reserves badges for the two queues only).
 */

export type AdminTabKey =
  | 'approvals'
  | 'teachers'
  | 'papers'
  | 'reviews'
  | 'audit'
  | 'recommendations'
  | 'upvotes'
  | 'feedback';

const TAB_ORDER: { key: AdminTabKey; label: string; path: string }[] = [
  { key: 'approvals', label: 'Approvals', path: '/admin/applications' },
  { key: 'teachers', label: 'Teachers', path: '/admin/teachers' },
  { key: 'papers', label: 'Papers', path: '/admin/papers' },
  { key: 'reviews', label: 'Reviews', path: '/admin/comments' },
  { key: 'audit', label: 'Audit', path: '/admin/audit' },
  { key: 'recommendations', label: 'Recommendations', path: '/admin/recommendations' },
  { key: 'upvotes', label: 'Upvotes', path: '/admin/upvotes' },
  { key: 'feedback', label: 'Feedback', path: '/admin/feedback' },
];

const QUEUE_TABS: AdminTabKey[] = ['approvals', 'reviews'];

/**
 * Real pending counts for the two queue tabs only (AD-002a: badges belong to
 * Approvals and Reviews alone). The page currently being viewed overrides
 * with its own already-fetched live number, so the tab you're on updates
 * instantly as you clear items instead of waiting on this background query.
 */
function useAdminQueueCounts(activeTab: AdminTabKey, liveCount?: number) {
  const [counts, setCounts] = useState<Partial<Record<AdminTabKey, number>>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const [applications, comments] = await Promise.all([
        supabase.from('teacher_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('approved', false),
      ]);
      if (cancelled) return;
      setCounts({
        approvals: applications.count ?? undefined,
        reviews: comments.count ?? undefined,
      });
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (QUEUE_TABS.includes(activeTab) && liveCount !== undefined) {
    return { ...counts, [activeTab]: liveCount };
  }
  return counts;
}

interface AdminConsoleProps {
  activeTab: AdminTabKey;
  title: string;
  subtitle: string;
  /** @deprecated unused by the current shell — kept so existing callers
   *  (all eight admin pages) don't need to drop the prop from their JSX. */
  tint?: { bg: string; text: string };
  /** Live count for the tab currently being viewed, computed from data the
   *  page already fetched. Only rendered as a badge when activeTab is one
   *  of the two queues (approvals/reviews) — AD-002a. */
  tabCount?: number;
  /** Search field slot, rendered above the content alongside the subtitle.
   *  Omit if the page has no search. */
  search?: ReactNode;
  /** Sort control slot, next to search. Only pass this when a real,
   *  meaningful data column backs the sort (e.g. created_at) — never a
   *  placeholder. */
  sort?: ReactNode;
  children: ReactNode;
}

export function AdminConsole({ activeTab, title, subtitle, tabCount, search, sort, children }: AdminConsoleProps) {
  const counts = useAdminQueueCounts(activeTab, tabCount);
  const { user, profile } = useAuth();

  /* Same derivation the admin pages already use for the audit trail
     (profile.full_name ?? email), so the name in the header and the name in
     the log are the same string. */
  const signedInEmail = user?.email || profile?.full_name || 'Signed-in admin';

  const shellNav: AdminNavItem[] = TAB_ORDER.map((tab) => ({
    key: tab.key,
    label: tab.label,
    path: tab.path,
    count: QUEUE_TABS.includes(tab.key) ? counts[tab.key] : undefined,
    active: tab.key === activeTab,
  }));

  return (
    <div className="flex min-h-screen flex-col gap-seam bg-muted">
      <AdminHeader nav={shellNav} signedInEmail={signedInEmail} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-foreground">{title}</h1>
              <p className="mt-1.5 max-w-prose text-[13.5px] leading-[1.5] text-warm-secondary">{subtitle}</p>
            </div>
            {(search || sort) ? (
              <div className="flex flex-wrap items-center gap-2">
                {search}
                {sort}
              </div>
            ) : null}
          </div>

          {children}
        </div>
      </main>

      <AdminAuditNote />
    </div>
  );
}

// ---- Shared row / pill / button primitives (used by AdminConsole routes and AdminPapers) ----

export const adminRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 14,
  padding: '18px 20px',
  borderRadius: 18,
  background: SURFACE_TOKENS.field,
  boxShadow: '0 0 0 1px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04)',
};

export const adminRowListStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
};

export function AdminTile({
  tint,
  children,
}: {
  tint: { bg: string; text: string };
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 13,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 700,
        background: tint.bg,
        color: tint.text,
      }}
    >
      {children}
    </div>
  );
}

export type AdminPillTone = 'settled' | 'pending' | 'flagged' | 'destructive';

const PILL_TONE_STYLE: Record<AdminPillTone, CSSProperties> = {
  settled: { background: ACCENT_TOKENS.settledBg, color: ACCENT_TOKENS.settledText },
  pending: { background: SURFACE_TOKENS.mutedFill, color: SURFACE_TOKENS.textBody },
  flagged: { background: MODE_TOKENS.teachers.tintBg, color: MODE_TOKENS.teachers.tintText },
  // hsl(var(--destructive)) — not a raw hex literal (design.md §0.1). ACCENT_TOKENS.destructive
  // stays for the icon-only usages below that pre-date this component.
  destructive: { background: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))' },
};

export function AdminPill({ tone, children }: { tone: AdminPillTone; children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        ...PILL_TONE_STYLE[tone],
      }}
    >
      {children}
    </span>
  );
}

export const adminPrimaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minHeight: 44,
  padding: '11px 17px',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  background: SURFACE_TOKENS.ink,
  color: '#fff',
  border: 'none',
};

export const adminSecondaryBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minHeight: 44,
  padding: '11px 17px',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  background: SURFACE_TOKENS.field,
  color: SURFACE_TOKENS.textPrimary,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
};

export const adminDestructiveBtnStyle: CSSProperties = {
  ...adminSecondaryBtnStyle,
  color: ACCENT_TOKENS.destructive,
};

/**
 * Single toast system for the admin console (see _rules.md #19 and
 * AdminConsole.md "Toast"): a dark pill, bottom-center, with an optional
 * Undo action. Wraps the app's existing `sonner` toast (already used by
 * every admin page and the rest of the app) rather than introducing the
 * separate shadcn use-toast system, which is mounted but otherwise unused.
 */
export function adminToast(message: string, opts?: { description?: string; undo?: () => void }) {
  sonnerToast(message, {
    description: opts?.description,
    duration: 4000,
    action: opts?.undo ? { label: 'Undo', onClick: opts.undo } : undefined,
    style: {
      background: SURFACE_TOKENS.ink,
      color: '#fff',
      border: 'none',
      borderRadius: 14,
      padding: '14px 20px',
      fontSize: 14,
      fontWeight: 500,
      boxShadow: '0 12px 32px rgba(0,0,0,.24)',
    },
  });
}

export const adminFieldStyle: CSSProperties = {
  background: SURFACE_TOKENS.shell,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
  borderRadius: 12,
  minHeight: 48,
};

/**
 * Squircle stat-tile row for admin console headers — the same device the dashboards use
 * (learning-education-squircles reference: a different flat token fill per tile). Admin pages
 * are internal tools so this stays a small, single-row summary rather than the dashboards'
 * bigger hero treatment — but a page of nothing but rows and pills reads as flat, and this is
 * a free device to reuse since it only ever renders numbers each page has already fetched.
 */
export function AdminStatTiles({ stats }: { stats: { label: string; value: number | string }[] }) {
  const fills = [SURFACE_TOKENS.field, MODE_TOKENS.papers.tintBg, SURFACE_TOKENS.mutedFill, ACCENT_TOKENS.settledBg];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0,1fr))`,
        gap: 10,
        marginBottom: 18,
      }}
    >
      {stats.map((st, i) => (
        <div
          key={st.label}
          style={{
            borderRadius: 18,
            padding: '14px 16px',
            background: fills[i % fills.length],
            boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.02em', textTransform: 'uppercase', color: SURFACE_TOKENS.textTertiary }}>
            {st.label}
          </div>
          <div style={{ marginTop: 4, fontSize: 24, fontWeight: 700, color: SURFACE_TOKENS.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
            {st.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Verbatim footnote shown under the table on every admin section page (applications, teachers,
 * papers, comments, recommendations) — NOT the audit log page, which has its own copy. The audit
 * log and its recordAdminAction instrumentation now exist, so this is factual, not aspirational.
 *
 * Superseded by `AdminAuditNote` (admin/shell.tsx), which AdminConsole now renders once at the
 * bottom of every screen (AD-003's "the audit note is visible" acceptance line) — this export
 * stays only because a couple of pages still import it directly for an inline mention.
 */
export function AdminAuditFootnote() {
  return (
    <p className="mt-5 max-w-prose text-[13px] leading-[1.5] text-warm-label">
      Approvals, rejections and takedowns are written to the audit log with your name and the exact time. Rejections
      always carry a reason the teacher can read.
    </p>
  );
}

export const adminPanelStyle: CSSProperties = {
  background: SURFACE_TOKENS.field,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
  borderRadius: 20,
};
