import type { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

/* Redesign C13 (components.md §2) — the one AdminTable column template shared by
   all five admin sections (approvals, live teachers, papers, reviews, audit log).

   Pixel values below are transcribed literally from "Redesign Admin.dc.html"
   (A1–A5) per the owner's pixel-exact override (BRIEF.md), not rounded to the
   site-wide spacing scale: card radius 20px, header row padding 14px 20px,
   row padding 15px 20px, row gap 16px, primary action 38px/radius 11px,
   overflow disc 38px/radius 11px. Admin carries no fun layer (rule 10) — bone
   card, bg-muted header, hairline separators, a state pill, one primary
   action and an overflow disc per row. Nothing tilts, nothing stickers. */

export type AdminPillTone = 'wait' | 'ok' | 'bad' | 'idle' | 'info';

const PILL_TONE_CLASS: Record<AdminPillTone, string> = {
  wait: 'bg-brand-subtle text-brand-deep',
  ok: 'bg-mint text-foreground',
  bad: 'bg-destructive/10 text-destructive',
  idle: 'bg-muted text-warm-prose',
  info: 'bg-brand-blue-subtle text-brand-blue-deep',
};

export function AdminStatePill({ tone, children }: { tone: AdminPillTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center whitespace-nowrap rounded-full text-[11.5px] font-bold h-[26px] px-[11px]',
        PILL_TONE_CLASS[tone],
      )}
    >
      {children}
    </span>
  );
}

export interface AdminTableColumn {
  key: string;
  label: string;
  /** Tailwind grid-template-columns fraction, e.g. "2.2fr". */
  width: string;
}

export interface AdminTableRow {
  id: string;
  /** First column: initial disc (StripePlaceholder-style) + title + subtitle. */
  initial?: string;
  title: string;
  subtitle?: string;
  /** Remaining plain-text cells, in column order after the first. */
  cells: ReactNode[];
  tone: AdminPillTone;
  tag: string;
  actionLabel: string;
  onAction: () => void;
  onOverflow?: () => void;
}

export interface AdminTableProps {
  columns: AdminTableColumn[];
  rows: AdminTableRow[];
  className?: string;
}

/** One shared column template — every section passes its own columns/rows. */
export function AdminTable({ columns, rows, className }: AdminTableProps) {
  /* Every row renders a trailing action cell (primary button + optional
     overflow disc) unconditionally below — it isn't one of the caller's
     declared `columns`. Some callers compensate by adding their own matching
     `{ key: 'actions', width: ... }` entry (AdminApplications, AdminFeedback,
     AdminUpvotes, AdminComments, AdminRecommendations, AdminPapers); two
     forgot to (AdminTeachers, AdminAuditLog), which leaves the actions cell
     to fall into an unbounded implicit grid track sized to its own content —
     widening the row past the card, which then silently clips it via
     `overflow-hidden`, hiding the Edit/Open button entirely on narrower
     screens. Owning the track here, once, means every section lines up the
     same way regardless of what its own column list says, and a caller-
     supplied `actions` entry (kept for backward compat) is ignored for
     sizing rather than doubled up. `auto` (not a guessed fixed px value)
     sizes the track to what the buttons actually need — AdminPapers already
     used `auto` for this same column, which is the value adopted here.

     The first column is documented above as always being the initial disc +
     title + subtitle block, and that block's title wrapper carries `min-w-0`
     so its text can truncate instead of forcing the column wide. A bare
     `Nfr` track has no minimum of its own beyond that, so on a narrow
     viewport the grid is free to squeeze it to 0px — while the 38px avatar
     disc inside is `shrink-0` and refuses to shrink with it, so it renders
     floating on top of the next column's text instead of sizing its column.
     `minmax(…, Nfr)` gives that first track a floor (disc + gap + a few
     characters of name) it can never be squeezed under. */
  const dataColumns = columns.filter((c) => c.key !== 'actions');
  const gridTemplate = [
    ...dataColumns.map((c, i) => (i === 0 ? `minmax(160px, ${c.width})` : c.width)),
    'auto',
  ].join(' ');

  return (
    <div className={cn('overflow-x-auto overflow-y-hidden rounded-[20px] bg-card shadow-border', className)}>
      <div
        className="grid gap-4 bg-muted px-5 py-[14px]"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {dataColumns.map((c) => (
          <span key={c.key} className="text-[11.5px] font-bold uppercase tracking-[.07em] text-warm-label">
            {c.label}
          </span>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid items-center gap-4 border-t border-warm-hairline px-5 py-[15px]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="flex min-w-0 items-center gap-3">
            {row.initial ? (
              <span className="stripe-placeholder flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] text-[15px] font-semibold text-foreground/40">
                {row.initial}
              </span>
            ) : null}
            <div className="min-w-0">
              <div className="truncate text-[14.5px] font-bold text-foreground">{row.title}</div>
              {row.subtitle ? <div className="mt-px truncate text-[12.5px] text-warm-label">{row.subtitle}</div> : null}
            </div>
          </div>

          {row.cells.map((cell, i) => (
            <span key={i} className="text-[13.5px] leading-[1.45] text-warm-prose">
              {cell}
            </span>
          ))}

          <AdminStatePill tone={row.tone}>{row.tag}</AdminStatePill>

          <div className="flex gap-2">
            {/* Mockup draws these controls at 38px. Rule 4 (BRIEF.md) forbids
                regressing the tap target, so the visible pill stays 38px while
                the button element itself is the full 44px hit area. */}
            <button
              type="button"
              onClick={row.onAction}
              className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[11px] px-[3px] text-[13px] font-bold text-background transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="inline-flex h-[38px] items-center whitespace-nowrap rounded-[11px] bg-foreground px-[15px]">
                {row.actionLabel}
              </span>
            </button>
            {row.onOverflow ? (
              <button
                type="button"
                onClick={row.onOverflow}
                aria-label="More actions"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[11px] text-warm-prose transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-muted">
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
