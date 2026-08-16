import type { CSSProperties, ReactNode } from 'react';
import { X } from 'lucide-react';
import type { SearchMode } from '@/utils/searchFacets';
import { getSubjectPalette } from '@/lib/subject-palette';

/**
 * The applied-filter row shared by Browse (teachers) and PastPapers (papers).
 * Purely presentational: callers own the URL-param state (q, filter_subjects,
 * filter_classes, filter_boards, filter_areas, filter_schools) and pass in
 * already-resolved chip labels + removal handlers.
 *
 * DESIGN_SYSTEM.md §11: on mobile this is a horizontal snap-scroll row, never
 * wrapped into ragged rows. Every chip is a 44px-minimum tap target.
 */

export interface FilterChipItem {
  /** Stable, unique key for this chip's value (e.g. `subjects:Maths`). */
  key: string;
  /** Display label — copy is owned by the caller, rendered verbatim. */
  label: string;
  /** Removes only this value. */
  onRemove: () => void;
}

export interface FilterChipsHandoff {
  /** Full button copy, e.g. "See papers instead →" — owned by the caller. */
  label: string;
  onClick: () => void;
}

export interface FilterChipsProps {
  /** Current page's search mode — drives the value-chip tint pair. The handoff button (if any) uses the *other* mode's tint automatically. */
  mode: SearchMode;
  /** One chip per selected filter value. */
  chips: FilterChipItem[];
  /** Shown only when chips.length > 0. */
  onClearAll?: () => void;
  /** Right-aligned "Edit search" ring button — typically re-focuses/re-expands SearchControl. Omit to hide. */
  onEditSearch?: () => void;
  /** Right-aligned cross-mode handoff button (e.g. "See papers with these filters"). Omit to hide. */
  handoff?: FilterChipsHandoff;
  /** Optional one-sentence note under the row naming what carries over on handoff (Browse only per spec). */
  carryOverNote?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Selected chips carry the accent (§2); everything else is `bg-muted`. */
const SELECTED_TINT: Record<SearchMode, string> = {
  teachers: 'bg-brand text-brand-foreground',
  papers: 'bg-brand-blue text-brand-blue-foreground',
};

/** Subject-filter chips ("subjects:Maths" on Browse, the bare "filter_subjects"
 * key on PaperResults) get the subject's own tint instead of the mode accent —
 * VISUAL_LANGUAGE §3: "Subject is the one facet that escapes the orange/indigo
 * mode color," applied "everywhere ... filter pills, and selected-facet states." */
function isSubjectChipKey(key: string): boolean {
  return key.startsWith('subjects:') || key.startsWith('filter_subjects:') || key === 'filter_subjects';
}

export function FilterChips({
  mode,
  chips,
  onClearAll,
  onEditSearch,
  handoff,
  carryOverNote,
  className,
  style,
}: FilterChipsProps) {
  const hasRow = chips.length > 0 || Boolean(onEditSearch) || Boolean(handoff);
  if (!hasRow) return null;

  const pillBase = `flex min-h-11 flex-none snap-start items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-[color,background-color,transform] duration-tap ease-tap active:scale-95 motion-reduce:active:scale-100 ${FOCUS}`;

  return (
    <div className={className} style={style}>
      <div className="flex snap-x items-center gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible">
        {chips.map((chip) => {
          const isSubject = isSubjectChipKey(chip.key);
          const subjectPalette = isSubject ? getSubjectPalette(chip.label) : null;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              aria-label={`Remove filter ${chip.label}`}
              className={`${pillBase} gap-2 ${subjectPalette ? '' : SELECTED_TINT[mode]}`}
              style={
                subjectPalette
                  ? { backgroundColor: subjectPalette.solid, color: subjectPalette.badgeText }
                  : undefined
              }
            >
              <span className="max-w-[12rem] truncate">{chip.label}</span>
              <X className="h-4 w-4 flex-none opacity-70" aria-hidden="true" />
            </button>
          );
        })}

        {chips.length > 0 && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className={`${pillBase} bg-transparent px-2 text-muted-foreground hover:text-foreground`}
          >
            Clear all
          </button>
        )}

        {(onEditSearch || handoff) && (
          <div className="ml-auto flex flex-none items-center gap-2">
            {onEditSearch && (
              <button type="button" onClick={onEditSearch} className={`${pillBase} bg-muted text-foreground`}>
                Edit search
              </button>
            )}
            {handoff && (
              <button
                type="button"
                onClick={handoff.onClick}
                className={`${pillBase} bg-muted text-foreground`}
              >
                {handoff.label}
              </button>
            )}
          </div>
        )}
      </div>

      {carryOverNote && <p className="mt-2 text-sm text-muted-foreground">{carryOverNote}</p>}
    </div>
  );
}
