import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PreFooter } from '@/components/layout/PreFooter';
import { AdminRail, AdminToolbar, type AdminNavItem } from '@/pages/admin/shell';
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
 * Shared shell for every /admin/* console screen — see design-handoff
 * pages/AdminConsole.md. Six routes (applications, teachers, upvotes,
 * comments, feedback, recommendations) render through this shell so the
 * eyebrow, heading, tab rail, row shape, and toast style stay identical.
 * AdminPapers.tsx (upload/manage) is a separate, differently-shaped screen
 * and only reuses the row/button/pill primitives, not the tab rail.
 */

export type AdminTabKey =
  | 'applications'
  | 'teachers'
  | 'upvotes'
  | 'comments'
  | 'feedback'
  | 'recommendations';

const TAB_ORDER: { key: AdminTabKey; label: string; path: string }[] = [
  { key: 'applications', label: 'Applications', path: '/admin/applications' },
  { key: 'teachers', label: 'Teachers', path: '/admin/teachers' },
  { key: 'upvotes', label: 'Upvotes', path: '/admin/upvotes' },
  { key: 'comments', label: 'Comments', path: '/admin/comments' },
  { key: 'feedback', label: 'Feedback', path: '/admin/feedback' },
  { key: 'recommendations', label: 'Recommendations', path: '/admin/recommendations' },
];

/**
 * Lightweight, read-only badge counts for the tab rail. Each admin page
 * that already has its own data loaded passes its own live number in via
 * `tabCount` (so the tab you're on updates instantly as you clear items);
 * the other five come from a cheap head-count query on mount so the rail
 * is never empty on first paint.
 */
function useAdminTabCounts(activeTab: AdminTabKey, liveCount?: number) {
  const [counts, setCounts] = useState<Partial<Record<AdminTabKey, number>>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const [applications, comments, recommendations, feedback, teachers, upvotes] = await Promise.all([
        supabase.from('teacher_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('teacher_comments').select('id', { count: 'exact', head: true }).eq('approved', false),
        supabase.from('teacher_recommendations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('feedback').select('id', { count: 'exact', head: true }),
        supabase.from('Shikshaqmine').select('id', { count: 'exact', head: true }),
        supabase.from('teacher_upvotes').select('teacher_id', { count: 'exact', head: true }),
      ]);
      if (cancelled) return;
      setCounts({
        applications: applications.count ?? undefined,
        comments: comments.count ?? undefined,
        recommendations: recommendations.count ?? undefined,
        feedback: feedback.count ?? undefined,
        teachers: teachers.count ?? undefined,
        upvotes: upvotes.count ?? undefined,
      });
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (liveCount !== undefined) {
    return { ...counts, [activeTab]: liveCount };
  }
  return counts;
}

interface AdminConsoleProps {
  activeTab: AdminTabKey;
  title: string;
  subtitle: string;
  tint: { bg: string; text: string };
  /** Live count for the tab currently being viewed, computed from data the page already fetched. */
  tabCount?: number;
  children: ReactNode;
}

export function AdminConsole({ activeTab, title, subtitle, tint, tabCount, children }: AdminConsoleProps) {
  const counts = useAdminTabCounts(activeTab, tabCount);

  // Redesign S7/C-061 — real per-section counts only, never a placeholder.
  const shellNav: AdminNavItem[] = TAB_ORDER.map((tab) => ({
    key: tab.key,
    label: tab.label,
    path: tab.path,
    count: counts[tab.key],
    active: tab.key === activeTab,
  }));
  const activeCount = counts[activeTab];

  const uploadLinks = (
    <div style={{ display: 'flex', gap: 10, marginTop: 26, flexWrap: 'wrap' }}>
      <Link
        to="/admin/papers?tab=upload"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: 46,
          padding: '13px 20px',
          borderRadius: 12,
          fontSize: 13.5,
          fontWeight: 600,
          color: SURFACE_TOKENS.textPrimary,
          background: SURFACE_TOKENS.field,
          boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
        }}
      >
        Upload papers
      </Link>
      <Link
        to="/admin/papers?tab=manage"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: 46,
          padding: '13px 20px',
          borderRadius: 12,
          fontSize: 13.5,
          fontWeight: 600,
          color: SURFACE_TOKENS.textPrimary,
          background: SURFACE_TOKENS.field,
          boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
        }}
      >
        Manage papers
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
      {/* Desktop: S7 rail (fixed, near-black) — the one place desktop leads
          (design.md §5). No fun layer — rule 10. */}
      <AdminRail nav={shellNav} signedInName="Sourav · owner" />

      <div className="flex min-h-screen flex-col lg:pl-[244px]">
        {/* Desktop toolbar, 68px. Mobile keeps its own header below. */}
        <AdminToolbar title={title} badge={typeof activeCount === 'number' ? `${activeCount} waiting` : undefined} />

        {/* Mobile / tablet: the existing tab-row console (design.md §4 "Admin
            (S12)") stays the on-call view, unchanged. */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 w-full mx-auto lg:max-w-none" style={{ maxWidth: 1100 }}>
          <div
            className="lg:hidden"
            style={{ padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,28px) 0' }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: SURFACE_TOKENS.textTertiary }}>Admin console</p>
            <h1
              style={{
                marginTop: 8,
                fontSize: 'clamp(25px,3.4vw,38px)',
                lineHeight: 1,
                fontWeight: 700,
                color: SURFACE_TOKENS.textPrimary,
                letterSpacing: '-.05em',
              }}
            >
              {title}
            </h1>
            <p style={{ marginTop: 10, fontSize: 15, color: SURFACE_TOKENS.textSecondary }}>{subtitle}</p>

            <nav
              aria-label="Admin sections"
              style={{
                display: 'flex',
                gap: 6,
                marginTop: 22,
                padding: 5,
                width: 'max-content',
                maxWidth: '100%',
                borderRadius: 999,
                background: SURFACE_TOKENS.mutedFill,
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {TAB_ORDER.map((tab) => {
                const active = tab.key === activeTab;
                const count = counts[tab.key];
                return (
                  <Link
                    key={tab.key}
                    to={tab.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 42,
                      padding: '11px 18px',
                      borderRadius: 999,
                      fontSize: 13.5,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      background: active ? SURFACE_TOKENS.field : 'transparent',
                      color: active ? SURFACE_TOKENS.textPrimary : SURFACE_TOKENS.textBody,
                      boxShadow: active ? `0 0 0 1px ${SURFACE_TOKENS.hairline}` : 'none',
                      transition: `background .2s ${EASE}, box-shadow .2s ${EASE}`,
                    }}
                  >
                    {tab.label}
                    {typeof count === 'number' && (
                      <span style={{ marginLeft: 8, opacity: 0.55 }}>{count}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Shared body — rendered once, used by both breakpoints. */}
          <div
            className="lg:mx-auto lg:w-full lg:max-w-[1100px]"
            style={{ padding: 'clamp(16px,3vw,28px)' }}
          >
            <p className="mb-5 hidden max-w-prose text-body-secondary text-warm-prose lg:block">{subtitle}</p>
            {children}
            {uploadLinks}
          </div>
        </main>

        <PreFooter variant="B4" />
        <Footer />
      </div>
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

export const adminPanelStyle: CSSProperties = {
  background: SURFACE_TOKENS.field,
  boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}`,
  borderRadius: 20,
};
