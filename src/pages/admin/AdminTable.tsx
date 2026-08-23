import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BentoPanel } from '@/components/layout/PageContainer';

/* Redesign 09i (changelog/09-Join-Onboarding-Shelf-Dashboards-School-Legal-
   Admin.md, AD-003/AD-004) — the one AdminTable column template shared by
   every admin section. Pixel values below are transcribed literally from
   "Admin Screens Redesign.dc.html" per the handoff's pixel-exact override:
   card radius 30 (BentoPanel), header cell padding 10px 14px, row padding
   12px 14px, row action pill h36 px14 r999, status pill h26 px10 r999 with
   a leading 6px dot. Admin carries no fun layer (AD-001) — bone card,
   bg-muted header wash is dropped in favour of the mockup's literal hairline
   header (no filled header band), a state pill, and up to three tinted
   row actions in a fixed reading order. Destructive actions are tinted,
   never solid red, and never first (AD-003's warning). */

export type AdminStatusTone = 'live' | 'pending' | 'paused' | 'hidden' | 'info';

// AD-004's literal fill/ink table (Live/Pending/Paused/Hidden). `info` is not
// one of the four named record states — it is a real "selected / currently
// editing" indicator a couple of screens use, kept as its own tone rather
// than folded into one of the four so it never misrepresents the record.
const STATUS_PILL_CLASS: Record<AdminStatusTone, string> = {
  live: 'bg-mint text-[#24603D]',
  pending: 'bg-brand-subtle text-brand-deep',
  paused: 'bg-muted text-warm-secondary',
  hidden: 'bg-[#F9E2E2] text-[#8C2A2A]',
  info: 'bg-brand-blue-subtle text-brand-blue-deep',
};

/** Back-compat alias — most call sites already spell this `AdminPillTone`. */
export type AdminPillTone = AdminStatusTone;

export function AdminStatePill({ tone, children }: { tone: AdminStatusTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[26px] w-fit items-center gap-[6px] whitespace-nowrap rounded-full px-[10px] text-[11.5px] font-bold',
        STATUS_PILL_CLASS[tone],
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

export type AdminActionTone = 'neutral' | 'neutral-soft' | 'positive' | 'destructive';

// AD-003's literal row-action palette: Approve/Review = mint, Hold/Pause =
// muted (two ink weights depending on whether the verb is a primary
// navigation action or a lighter secondary one — matches the mockup's
// "Edit" vs "Pause" ink), Reject/Unpublish/Hide = tinted red, never solid.
const ACTION_BUTTON_CLASS: Record<AdminActionTone, string> = {
  neutral: 'bg-muted text-foreground',
  'neutral-soft': 'bg-muted text-warm-secondary',
  positive: 'bg-mint text-[#24603D]',
  destructive: 'bg-[#F9E2E2] text-[#8C2A2A]',
};

export interface AdminRowAction {
  label: string;
  tone: AdminActionTone;
  onClick: () => void;
}

export interface AdminTableColumn {
  key: string;
  label: string;
  /** Unused by the current (real <table>, auto layout) markup — kept
   *  optional so existing callers built for the old CSS-grid table still
   *  type-check without editing every column list. */
  width?: string;
}

export interface AdminTableRow {
  id: string;
  /** First column: initial disc (StripePlaceholder-style) + title + subtitle. */
  initial?: string;
  title: string;
  subtitle?: string;
  /** Every AdminTable screen's first column is bold identity text (AD-003)
   *  — except the audit log, whose literal mockup renders its first column
   *  ("When") as plain muted meta text instead, matching the rest of that
   *  one screen's "read-only record" feel. Defaults to 'bold'. */
  titleTone?: 'bold' | 'muted';
  /** Remaining plain-text cells, in column order after the first. */
  cells: ReactNode[];
  tone: AdminStatusTone;
  tag: string;
  /** Up to three tinted actions, right-aligned, in reading order. Put the
   *  destructive one last — never first (AD-003). */
  actions: AdminRowAction[];
}

export interface AdminTableProps {
  columns: AdminTableColumn[];
  rows: AdminTableRow[];
  className?: string;
}

/** One shared column template — every section passes its own columns/rows.
 *  A real `<table>`, `border-collapse`, per AD-003 — not a CSS grid of divs. */
export function AdminTable({ columns, rows, className }: AdminTableProps) {
  const dataColumns = columns.filter((c) => c.key !== 'actions');

  return (
    <BentoPanel fill="card" className={cn('overflow-x-auto px-1.5 py-[18px]', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-warm-hairline">
            {dataColumns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="whitespace-nowrap px-[14px] py-[10px] text-left text-[11px] font-bold uppercase tracking-[.06em] text-warm-label"
              >
                {c.label}
              </th>
            ))}
            <th className="px-[14px] py-[10px]" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-warm-muted last:border-b-0">
              <td className="px-[14px] py-[12px]">
                <div className="flex min-w-0 items-center gap-3">
                  {row.initial ? (
                    <span className="stripe-placeholder flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-[13.5px] font-semibold text-foreground/40">
                      {row.initial}
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <div
                      className={cn(
                        'truncate text-[13.5px]',
                        row.titleTone === 'muted' ? 'text-warm-meta' : 'font-bold text-foreground',
                      )}
                    >
                      {row.title}
                    </div>
                    {row.subtitle ? (
                      <div className="mt-px truncate text-[12px] text-warm-label">{row.subtitle}</div>
                    ) : null}
                  </div>
                </div>
              </td>

              {row.cells.map((cell, i) => (
                <td key={i} className="whitespace-nowrap px-[14px] py-[12px] text-[13.5px] text-foreground">
                  {cell}
                </td>
              ))}

              <td className="whitespace-nowrap px-[14px] py-[12px]">
                <AdminStatePill tone={row.tone}>{row.tag}</AdminStatePill>
              </td>

              <td className="whitespace-nowrap px-[14px] py-[12px]">
                <div className="flex justify-end gap-1.5">
                  {row.actions.map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={action.onClick}
                      className={cn(
                        'inline-flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-bold transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        ACTION_BUTTON_CLASS[action.tone],
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </BentoPanel>
  );
}
