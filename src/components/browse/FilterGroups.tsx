import { useState } from 'react';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SUBJECT_DISPLAY_ORDER } from '@/utils/subjectOrder';
import type { FilterState } from '@/components/FilterPanel';

/**
 * C6 — components.md §2 / design.md §2.3.
 *
 * One chip-group component, TWO presentations: inside a bottom Sheet on
 * mobile (`FilterSheet`), and as a persistent 284px rail on desktop
 * (`FilterRail`). Both render the same `FilterGroupsBody` — the body is
 * extracted once, never duplicated (components.md C6 note).
 *
 * Design's five groups are Subject / Class / Area / Rate / Mode. The app's
 * existing FilterState also carries Board, Class size and Experience — fields
 * the mockup doesn't model but the data layer and ~35 SEO routes depend on
 * (Board in particular is part of the `filter_boards` URL contract). Per the
 * "design wins, keep functionality" rule those stay, as extra groups appended
 * after the five mandated ones, so no existing filter capability is dropped.
 */

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];
const BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];
const CLASS_SIZE = ['Group', 'Solo'];
const SUBJECTS = SUBJECT_DISPLAY_ORDER;
const EXPERIENCE_OPTIONS = [
  { value: '1', label: '1+ years' },
  { value: '3', label: '3+ years' },
  { value: '5', label: '5+ years' },
  { value: '10', label: '10+ years' },
  { value: '15', label: '15+ years' },
  { value: '20', label: '20+ years' },
];

// copy.md §4 "Mode options: Home tuition / Online / At tutor's place" — the
// data layer splits this into two Shikshaqmine columns (Mode of Teaching,
// Place of Teaching); each pill here toggles the matching underlying value.
const MODE_OPTIONS: { label: string; isActive: (f: FilterState) => boolean; toggle: (f: FilterState) => FilterState }[] = [
  {
    label: "Home tuition",
    isActive: (f) => f.placeOfTeaching.includes("Student's Home"),
    toggle: (f) => ({
      ...f,
      placeOfTeaching: f.placeOfTeaching.includes("Student's Home")
        ? f.placeOfTeaching.filter((v) => v !== "Student's Home")
        : [...f.placeOfTeaching, "Student's Home"],
    }),
  },
  {
    label: 'Online',
    isActive: (f) => f.modeOfTeaching.includes('Online'),
    toggle: (f) => ({
      ...f,
      modeOfTeaching: f.modeOfTeaching.includes('Online')
        ? f.modeOfTeaching.filter((v) => v !== 'Online')
        : [...f.modeOfTeaching, 'Online'],
    }),
  },
  {
    label: "At tutor's place",
    isActive: (f) => f.placeOfTeaching.includes("Teacher's place"),
    toggle: (f) => ({
      ...f,
      placeOfTeaching: f.placeOfTeaching.includes("Teacher's place")
        ? f.placeOfTeaching.filter((v) => v !== "Teacher's place")
        : [...f.placeOfTeaching, "Teacher's place"],
    }),
  },
];

const AREA_GROUPS: { label: string; areas: string[] }[] = [
  { label: 'South Kolkata', areas: ['Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Gariahat', 'Garia', 'Jadavpur', 'Kasba', 'New Alipore', 'Southern Avenue', 'Tollygunge', 'Hazra'] },
  { label: 'Salt Lake & New Town', areas: ['Baguihati', 'Belur', 'Howrah', 'Joka', 'Newtown', 'Rajarhat', 'Salt Lake', 'Science City'] },
  { label: 'North Kolkata', areas: ['Dum Dum', 'Entally', 'Girish Park', 'Nagarbazar', 'Sealdah', 'Shyam Bazar', 'Tangra'] },
  { label: 'Central Kolkata', areas: ['Camac Street', 'College Street', 'Elgin', 'Minto Park', 'Park Street', 'Park Circus'] },
  { label: 'East Kolkata', areas: ['Kankurgachi', 'Laketown', 'Phoolbagan', 'Ultadanga'] },
  { label: 'South East Kolkata', areas: ['Anandapur', 'Parnasree', 'Rabindra Nagar'] },
  { label: 'Greater Kolkata', areas: ['Hooghly'] },
];

export interface FilterGroupsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  /** Real result count for the current filter set — never invented (design.md §0.10). */
  resultCount: number;
}

type ArrayFilterKey = 'subjects' | 'classes' | 'boards' | 'classSize' | 'areas';

function groupCard(label: string, children: React.ReactNode) {
  return (
    <div key={label} className="rounded-[20px] bg-card p-[18px] shadow-border">
      <h3 className="mb-[14px] text-[11.5px] font-bold uppercase tracking-[.07em] text-warm-meta">{label}</h3>
      {children}
    </div>
  );
}

/** The shared body — icon-labelled groups of 44px pill toggles + the fee
 * slider. Rendered once, used inside both the mobile Sheet and the desktop
 * rail (design.md §2.3 / components.md C6). */
export function FilterGroupsBody({ filters, onFilterChange }: Pick<FilterGroupsProps, 'filters' | 'onFilterChange'>) {
  const [areaQuery, setAreaQuery] = useState('');
  const filteredAreaGroups = areaQuery.trim()
    ? AREA_GROUPS.map((g) => ({
        label: g.label,
        areas: g.areas.filter((a) => a.toLowerCase().includes(areaQuery.trim().toLowerCase())),
      })).filter((g) => g.areas.length > 0)
    : AREA_GROUPS;

  const toggle = (category: ArrayFilterKey, value: string) => {
    const current = filters[category];
    onFilterChange({
      ...filters,
      [category]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    });
  };

  const pill = (label: string, active: boolean, onClick: () => void, key?: string) => (
    <Chip key={key ?? label} tone={active ? 'facet-on' : 'facet'} size={44} onClick={onClick} aria-pressed={active}>
      {label}
    </Chip>
  );

  const feeMin = filters.minFees ?? 0;
  const feeMax = filters.maxFees ?? 20000;

  return (
    <div className="flex flex-col gap-[14px]">
      {groupCard(
        'Subject',
        <div className="flex flex-wrap gap-[8px]">
          {SUBJECTS.map((s) => pill(s, filters.subjects.includes(s), () => toggle('subjects', s)))}
        </div>,
      )}

      {groupCard(
        'Class',
        <div className="flex flex-wrap gap-[8px]">
          {CLASSES.map((c) => pill(c === 'UG' ? 'UG' : `Class ${c}`, filters.classes.includes(c), () => toggle('classes', c), c))}
        </div>,
      )}

      {groupCard(
        'Area',
        <div className="flex flex-col gap-4">
          <Input
            type="search"
            value={areaQuery}
            onChange={(e) => setAreaQuery(e.target.value)}
            placeholder="Search areas…"
            aria-label="Search areas"
            className="h-11"
          />
          {filteredAreaGroups.length === 0 ? (
            <p className="text-body-secondary text-warm-meta">No areas match &ldquo;{areaQuery}&rdquo;.</p>
          ) : (
            filteredAreaGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-label font-medium uppercase tracking-wide text-warm-meta">{group.label}</p>
                <div className="flex flex-wrap gap-[8px]">
                  {group.areas.map((a) => pill(a, filters.areas.includes(a), () => toggle('areas', a), a))}
                </div>
              </div>
            ))
          )}
        </div>,
      )}

      {groupCard(
        'Rate per hour',
        <div className="flex flex-col gap-3">
          {/* Two-handle range: simple overlaid <input type=range> pair — no
              slider primitive exists in the codebase yet, and the values map
              onto the app's existing monthly Min/Max Fees filter (the only
              fee granularity the data has — see report). */}
          <div className="relative h-11">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
            <div
              className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
              style={{
                left: `${(feeMin / 20000) * 100}%`,
                right: `${100 - (feeMax / 20000) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={feeMin}
              aria-label="Minimum fees per month"
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), feeMax);
                onFilterChange({ ...filters, minFees: v > 0 ? v : null });
              }}
              className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent"
            />
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={feeMax}
              aria-label="Maximum fees per month"
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), feeMin);
                onFilterChange({ ...filters, maxFees: v < 20000 ? v : null });
              }}
              className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent"
            />
          </div>
          <p className="text-body-secondary text-warm-meta tabular-nums">
            ₹{feeMin.toLocaleString('en-IN')} – ₹{feeMax.toLocaleString('en-IN')}/mo
          </p>
        </div>,
      )}

      {groupCard(
        'Mode',
        <div className="flex flex-wrap gap-[8px]">
          {MODE_OPTIONS.map((opt) =>
            pill(opt.label, opt.isActive(filters), () => onFilterChange(opt.toggle(filters)), opt.label),
          )}
        </div>,
      )}

      {/* Kept for functionality — not one of design.md's five groups, but the
          only way to set board/class-size/experience filters, and Board feeds
          the `filter_boards` URL contract the SEO routes depend on. */}
      {groupCard(
        'Board',
        <div className="flex flex-wrap gap-[8px]">
          {BOARDS.map((b) => pill(b, filters.boards.includes(b), () => toggle('boards', b), b))}
        </div>,
      )}

      {groupCard(
        'Class size',
        <div className="flex flex-wrap gap-[8px]">
          {CLASS_SIZE.map((s) =>
            pill(s === 'Solo' ? 'One-on-one' : s, filters.classSize.includes(s), () => toggle('classSize', s), s),
          )}
        </div>,
      )}

      {groupCard(
        'Experience',
        <Select
          value={filters.minExperience || 'all'}
          onValueChange={(value) => onFilterChange({ ...filters, minExperience: value === 'all' ? null : value })}
        >
          <SelectTrigger className="h-11 w-full text-sm">
            <SelectValue placeholder="Any experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any experience</SelectItem>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>,
      )}

      <style>{`
        .range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: hsl(var(--brand));
          border: 3px solid hsl(var(--background));
          box-shadow: 0 1px 4px rgba(0,0,0,.3);
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: hsl(var(--brand));
          border: 3px solid hsl(var(--background));
          box-shadow: 0 1px 4px rgba(0,0,0,.3);
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track { background: transparent; }
        .range-thumb::-moz-range-track { background: transparent; }
      `}</style>
    </div>
  );
}

export function activeFilterCount(filters: FilterState): number {
  return (
    filters.subjects.length +
    filters.classes.length +
    filters.boards.length +
    filters.classSize.length +
    filters.areas.length +
    filters.modeOfTeaching.length +
    filters.placeOfTeaching.length +
    (filters.minFees != null ? 1 : 0) +
    (filters.maxFees != null ? 1 : 0) +
    (filters.minExperience != null ? 1 : 0)
  );
}

const EMPTY_FILTERS: FilterState = {
  subjects: [],
  classes: [],
  boards: [],
  classSize: [],
  areas: [],
  modeOfTeaching: [],
  placeOfTeaching: [],
  minFees: null,
  maxFees: null,
  minExperience: null,
};

/** Mobile presentation — bottom Sheet. design.md §2.3: grab handle → sticky
 * header (Filters + Clear all) → scrollable body (flex:1, min-height:0,
 * overflow-y:auto) → sticky footer (N filters active + Show N teachers). No
 * Apply button — chips apply instantly (components.md §7); the footer's
 * count is feedback, and its button just closes the sheet. */
export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  resultCount,
}: FilterGroupsProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const count = activeFilterCount(filters);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex h-[85vh] flex-col rounded-t-[28px] p-0 [&>button:last-child]:hidden"
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-[12px]" aria-hidden>
          <div className="h-[4px] w-[40px] rounded-full bg-warm-hairline-strong" />
        </div>

        {/* Sticky header */}
        <div className="flex items-center justify-between gap-3 px-[16px] pb-[8px] pt-[12px]">
          <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] text-foreground">Filters</h2>
          <button
            type="button"
            onClick={() => onFilterChange(EMPTY_FILTERS)}
            className="min-h-11 rounded-lg px-2 text-[13.5px] font-semibold text-brand-blue transition-colors duration-150 hover:text-brand-blue-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Clear all
          </button>
        </div>

        {/* Scrollable body — must stay flex:1/min-height:0 or long option sets
            clip (design.md §2.3). */}
        <div className="min-h-0 flex-1 overflow-y-auto px-[16px] pb-[16px] pt-[4px]">
          <FilterGroupsBody filters={filters} onFilterChange={onFilterChange} />
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-between gap-[10px] border-t border-border bg-card px-[16px] py-[14px]">
          <span className="text-[13px] text-warm-secondary">
            {count} filter{count === 1 ? '' : 's'} active
          </span>
          <Button
            variant="primary"
            size={52}
            className="rounded-[14px] px-[22px] text-[15px] font-bold"
            onClick={() => onOpenChange(false)}
          >
            Show {resultCount} teachers
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Desktop presentation — persistent 284px rail, the sheet's content
 * unwrapped (design.md §5 / components.md C6). No Clear-all/footer chrome;
 * the sticky filter bar above the results carries the applied chips and the
 * global "Clear all" already. */
export function FilterRail({ filters, onFilterChange, resultCount }: FilterGroupsProps) {
  return (
    <div className="hidden lg:block lg:w-[284px] lg:flex-none">
      <div className="sticky top-6">
        <FilterGroupsBody filters={filters} onFilterChange={onFilterChange} />
      </div>
    </div>
  );
}
