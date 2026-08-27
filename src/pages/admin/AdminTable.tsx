import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* Handoff 09i AD-003/AD-004 — the one AdminTable column template shared by
   every admin section (approvals, teachers, papers, reviews-as-table
   sources, audit log). Pixel values transcribed from "Admin Screens
   Redesign.dc.html": card radius 30 (BentoPanel), header row 10px 14px
   with an inset hairline rule, body row 12px 14px with a lighter inset
   hairline, first column bold, status is a dot pill (AD-004), row actions
   right-aligned h36 r999 12.5px/700 with destructive tinted and always
   last (never first) in reading order. */

export type AdminStatus = 'live' | 'pending' | 'paused' | 'hidden';

const STATUS_CONFIG: Record<AdminStatus, { label: string; fillClass: string; inkClass: string; dotClass: string }> = {
  live: { label: 'Live', fillClass: 'bg-mint', inkClass: 'text-[#24603D]', dotClass: 'bg-[#24603D]' },
  pending: { label: 'Pending', fillClass: 'bg-brand-subtle', inkClass: 'text-brand-deep', dotClass: 'bg-brand-deep' },
  paused: { label: 'Paused', fillClass: 'bg-muted', inkClass: 'text-warm-secondary', dotClass: 'bg-warm-secondary' },
  hidden: { label: 'Hidden', fillClass: 'bg-[#F9E2E2]', inkClass: 'text-[#8C2A2A]', dotClass: 'bg-[#8C2A2A]' },
};

/** AD-004: every status cell is one pill, dot + label, coloured from a
 *  fixed 4-tone palette. `label` overrides the default tone label (e.g.
 *  Approvals' "Approved"/"Rejected" instead of the generic "Live"/"Hidden")
 *  — the record's real state always decides the *label*, never a hardcoded
 *  string; the *tone* just picks which of the 4 colours it reads with. */
export function AdminStatusPill({ status, label, className }: { status: AdminStatus; label?: string; className?: string }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex h-[26px] w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-[10px] text-[11.5px] font-bold',
        cfg.fillClass,
        cfg.inkClass,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', cfg.dotClass)} aria-hidden />
      {label ?? cfg.label}
    </span>
  );
}

export type AdminActionTone = 'primary' | 'muted' | 'mint' | 'destructive';

const ACTION_TONE_CLASS: Record<AdminActionTone, string> = {
  primary: 'bg-muted text-foreground hover:bg-warm-hairline',
  muted: 'bg-muted text-warm-secondary hover:bg-warm-hairline',
  mint: 'bg-mint text-[#24603D] hover:brightness-95',
  destructive: 'bg-[#F9E2E2] text-[#8C2A2A] hover:brightness-95',
};

export interface AdminRowAction {
  label: string;
  onClick: () => void;
  tone: AdminActionTone;
  disabled?: boolean;
}

/** AD-003: h36 px-3.5 r999 12.5px/700 admin action pill. Rendered in the
 *  order given — callers are responsible for putting destructive actions
 *  last, never first (⚠ AD-003). Exported so AD-007's review-card queue
 *  (which isn't a table) can render the identical action-pill treatment. */
export function AdminRowActions({ actions }: { actions: AdminRowAction[] }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1.5">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            'relative inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full px-[14px] text-[12.5px] font-bold before:absolute before:-inset-[4px] before:content-[""] transition-colors duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            ACTION_TONE_CLASS[action.tone],
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
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
  /** One ReactNode per column, in column order — first cell renders bold.
   *  A status column is just a regular cell holding an `<AdminStatusPill>`
   *  — its position varies per section (AD-005's Teachers puts "Updated"
   *  after "Status"; AD-006/AD-008 put Status/Result last), so AdminTable
   *  doesn't special-case it: the caller places it wherever its own
   *  `columns` array says it goes. */
  cells: ReactNode[];
  /** Row actions, left-to-right reading order. Empty/omitted for a row
   *  with nothing to do (readOnly tables never pass this at all). */
  actions?: AdminRowAction[];
}

export interface AdminTableProps {
  columns: AdminTableColumn[];
  rows: AdminTableRow[];
  className?: string;
  /** AD-008 audit log: hides the action column entirely, both grid and
   *  mobile list — nothing on that screen mutates anything. */
  readOnly?: boolean;
}

/** One shared column template — every section passes its own columns/rows.
 *  Rendered inside a `<BentoPanel fill="card">` by the caller (the panel
 *  also carries the section's own title/meta row above the table). */
export function AdminTable({ columns, rows, className, readOnly }: AdminTableProps) {
  const gridTemplate = [
    ...columns.map((c, i) => (i === 0 ? `minmax(140px, ${c.width})` : c.width)),
    ...(readOnly ? [] : ['auto']),
  ].join(' ');

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* Desktop / tablet: the grid, lg: and up.

          AD-003 specifies a `border-collapse` <table>; this is a CSS grid so
          the same rows can restack as cards below lg (see below). The visual
          spec is met either way, but a bare grid of <div>s announces as a flat
          run of text with no column association — C-015 asks that the
          semantics survive the restyle, so the ARIA table roles carry what the
          <table> element would have. */}
      <div className="hidden overflow-x-auto lg:block" role="table">
        <div
          role="row"
          className="grid gap-3.5 px-[14px] py-[10px] shadow-[inset_0_-1px_0_#E7DFD5]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((c) => (
            <span role="columnheader" key={c.key} className="text-[11px] font-bold uppercase tracking-[.06em] text-warm-label">
              {c.label}
            </span>
          ))}
          {/* The actions column is unlabelled by design, but a header cell
              with no accessible name leaves the column count wrong for AT. */}
          {readOnly ? null : <span role="columnheader"><span className="sr-only">Actions</span></span>}
        </div>

        {rows.map((row) => (
          <div
            key={row.id}
            role="row"
            className="grid items-center gap-3.5 px-[14px] py-[12px] shadow-[inset_0_-1px_0_#F0EAE2] transition-colors duration-150 hover:bg-muted/40"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {row.cells.map((cell, i) => (
              <span
                role="cell"
                key={i}
                className={cn(
                  'min-w-0 truncate text-[13.5px] leading-[1.45]',
                  i === 0 ? 'font-bold text-foreground' : 'text-warm-prose',
                )}
              >
                {cell}
              </span>
            ))}

            {readOnly ? null : (
              <span role="cell">
                <AdminRowActions actions={row.actions ?? []} />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Mobile / tablet: a single-column list of row cards. */}
      <div className="divide-y divide-warm-hairline lg:hidden">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-col gap-3 px-[14px] py-4">
            <div className="min-w-0 text-[14.5px] font-bold leading-[1.35] text-foreground">{row.cells[0]}</div>

            {row.cells.length > 1 ? (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                {row.cells.slice(1).map((cell, i) => (
                  <div key={i} className="min-w-0">
                    {columns[i + 1] ? (
                      <dt className="text-[10.5px] font-bold uppercase tracking-[.06em] text-warm-label">
                        {columns[i + 1].label}
                      </dt>
                    ) : null}
                    <dd className="truncate text-[13.5px] leading-[1.45] text-warm-prose">{cell}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {readOnly ? null : row.actions?.length ? <AdminRowActions actions={row.actions} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/** AD-003: the title + meta row every table-bearing section renders above
 *  its `AdminTable`, inside the same content `BentoPanel`. */
export function AdminPanelHeader({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-[18px] pb-3">
      <h2 className="text-[19px] font-extrabold tracking-[-0.03em] text-foreground">{title}</h2>
      {meta ? <span className="text-[12.5px] tabular-nums text-warm-meta">{meta}</span> : null}
    </div>
  );
}
