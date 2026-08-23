import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { saveAuthRedirect } from '@/utils/authRedirect';
import { toast as sonnerToast } from 'sonner';
import { SURFACE_TOKENS } from '@/utils/searchFacets';
import type { User } from '@supabase/supabase-js';

/**
 * Shared admin-gate check, used by every /admin/* page instead of each page
 * re-implementing its own `admins` lookup + redirect. Kept separate from
 * AdminConsole (the layout shell) since a couple of callers need the
 * isAdmin/checkingAdmin flags before they've fetched their own data.
 */
// The admin-role lookup must never hang the UI indefinitely — a stalled
// request (bad connection, unreachable Supabase) used to leave every /admin/*
// page stuck on its loading skeleton (or a blank `return null`) forever, with
// no way to tell "unauthorized" apart from "broken". This timeout guarantees
// the check always resolves to granted / denied / error within a bounded time.
const ADMIN_CHECK_TIMEOUT_MS = 12000;

export function useAdminGuard(
  user: User | null | undefined,
  opts?: { onGranted?: () => void; redirectOnDenied?: boolean }
) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setCheckingAdmin(true);
      setError(null);

      if (!user) {
        if (!cancelled) {
          setCheckingAdmin(false);
          setIsAdmin(false);
          if (opts?.redirectOnDenied) {
            saveAuthRedirect(window.location.pathname);
            navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
          }
        }
        return;
      }

      try {
        const timeout = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), ADMIN_CHECK_TIMEOUT_MS);
        });
        const { data, error: queryError } = await Promise.race([
          supabase.from('admins').select('id').eq('id', user.id).maybeSingle(),
          timeout,
        ]);

        if (cancelled) return;

        if (queryError) {
          // A real error from the query (network, RLS, etc.) is not the same
          // as "checked and you're not an admin" — surface it instead of
          // silently denying/redirecting.
          setIsAdmin(false);
          setError("Couldn't verify your access — try again.");
          return;
        }

        if (data?.id === user.id) {
          setIsAdmin(true);
          opts?.onGranted?.();
        } else {
          setIsAdmin(false);
          if (opts?.redirectOnDenied) {
            navigate('/');
          }
        }
      } catch {
        // Includes the timeout above and any thrown/network failure.
        if (!cancelled) {
          setIsAdmin(false);
          setError("Couldn't verify your access — try again.");
        }
      } finally {
        if (!cancelled) setCheckingAdmin(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, retryCount]);

  const retry = () => setRetryCount((n) => n + 1);

  return { isAdmin, checkingAdmin, error, retry };
}

/**
 * Shared error state for a failed/timed-out admin check — rendered by every
 * /admin/* page in place of an indefinite skeleton or a silent blank page.
 * Deliberately minimal (no rail/toolbar dependency on auth state) so it
 * renders even if the surrounding shell also depends on admin data.
 */
export function AdminGuardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-page">
      <div className={`mx-auto w-full max-w-sm p-8 text-center ${adminPanelStyle}`}>
        <p className="text-[15.5px] font-semibold text-foreground">Couldn't verify your access</p>
        <p className="mt-2 text-[13.5px] text-warm-prose">
          We weren't able to confirm your admin permissions. Check your connection and try again.
        </p>
        <button type="button" onClick={onRetry} className={`mt-5 ${adminPrimaryBtnStyle}`}>
          Try again
        </button>
      </div>
    </div>
  );
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

// ---- Shared row / pill / button primitives (used by AdminConsole routes and AdminPapers) ----

export const adminRowStyle =
  'flex flex-wrap items-center gap-3.5 rounded-[18px] bg-warm-card px-5 py-[18px] shadow-[0_0_0_1px_rgba(0,0,0,.06),0_2px_4px_rgba(0,0,0,.04)]';

export const adminRowListStyle = 'grid gap-2.5';

export function AdminTile({
  tint,
  children,
}: {
  tint: { bg: string; text: string };
  children: ReactNode;
}) {
  return (
    <div
      className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] text-[15px] font-bold"
      style={{ background: tint.bg, color: tint.text }}
    >
      {children}
    </div>
  );
}

export type AdminPillTone = 'settled' | 'pending' | 'flagged' | 'destructive';

const PILL_TONE_CLASS: Record<AdminPillTone, string> = {
  settled: 'bg-success-subtle-bg text-success-subtle-text',
  pending: 'bg-warm-muted text-warm-prose',
  flagged: 'bg-brand-subtle text-brand-deep',
  // hsl(var(--destructive)) via the Tailwind `destructive` token, not a raw hex literal
  // (design.md §0.1).
  destructive: 'bg-destructive/10 text-destructive',
};

export function AdminPill({ tone, children }: { tone: AdminPillTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11.5px] font-bold ${PILL_TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

export const adminPrimaryBtnStyle =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-0 bg-panel px-[17px] text-[13px] font-semibold text-white';

export const adminSecondaryBtnStyle =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-warm-card px-[17px] text-[13px] font-semibold text-foreground shadow-border';

export const adminDestructiveBtnStyle = `${adminSecondaryBtnStyle} text-facet-destructive`;

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

export const adminFieldStyle = 'min-h-[48px] rounded-xl bg-warm-page shadow-border';

/**
 * Squircle stat-tile row for admin console headers — the same device the dashboards use
 * (learning-education-squircles reference: a different flat token fill per tile). Admin pages
 * are internal tools so this stays a small, single-row summary rather than the dashboards'
 * bigger hero treatment — but a page of nothing but rows and pills reads as flat, and this is
 * a free device to reuse since it only ever renders numbers each page has already fetched.
 */
export function AdminStatTiles({ stats }: { stats: { label: string; value: number | string }[] }) {
  const fills = ['bg-warm-card', 'bg-brand-blue-subtle', 'bg-warm-muted', 'bg-success-subtle-bg'];
  return (
    <div
      className="mb-[18px] grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0,1fr))` }}
    >
      {stats.map((st, i) => (
        <div key={st.label} className={`rounded-[18px] px-4 py-3.5 shadow-border ${fills[i % fills.length]}`}>
          <div className="text-[11px] font-semibold uppercase tracking-[.02em] text-warm-label">{st.label}</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">{st.value}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Verbatim footnote shown under the table on every admin section page (applications, teachers,
 * papers, comments, recommendations) — NOT the audit log page, which has its own copy. The audit
 * log and its recordAdminAction instrumentation now exist, so this is factual, not aspirational.
 */
export function AdminAuditFootnote() {
  return (
    <p className="mt-5 max-w-prose text-[13px] leading-[1.5] text-warm-label">
      Approvals, rejections and takedowns are written to the audit log with your name and the exact time. Rejections
      always carry a reason the teacher can read.
    </p>
  );
}

export const adminPanelStyle = 'rounded-[20px] bg-warm-card shadow-border';
