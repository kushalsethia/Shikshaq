import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchControl } from '@/components/SearchControl';
import { HeroFieldSearch } from '@/components/home/HeroFieldSearch';
import { Chip } from '@/components/ui/chip';
import type { SearchMode } from '@/utils/searchFacets';

/* Redesign C5 (design.md §2.8, C-053).

   The overhanging search card: a bone card that overhangs the dark slab's
   bottom edge (-26px mobile / -56px desktop) holding the mode toggle, the
   search field and the popular chips. The slab above keeps only eyebrow,
   headline and lede — everything interactive lives in here.

   Reuses the existing SearchControl (mode toggle + field + facet row +
   suggestions) rather than re-implementing search, and adds the popular
   chip row underneath it per design.md §2.8. */

/* One chip row per mode. The row used to be teacher-only at both settings, so
   flipping to Past papers left "Under ₹800" and "Home tuition" — fee and
   travel filters that no paper has — sitting under a papers field. Each papers
   chip lands on /past-papers/results, which is the route that actually reads
   these filter params (/past-papers ignores them). */
const POPULAR_CHIPS: Record<SearchMode, { label: string; href: string }[]> = {
  teachers: [
    { label: 'Class 10', href: '/all-tuition-teachers-in-kolkata?filter_classes=10' },
    { label: 'Maths', href: '/maths-tuition-teachers-in-kolkata' },
    { label: 'Under ₹800', href: '/all-tuition-teachers-in-kolkata?filter_maxFees=800' },
    { label: 'Home tuition', href: `/all-tuition-teachers-in-kolkata?filter_placeOfTeaching=${encodeURIComponent("Student's Home")}` },
  ],
  papers: [
    { label: 'Class 10', href: '/past-papers/results?filter_classes=10' },
    { label: 'ICSE', href: '/past-papers/results?filter_boards=ICSE' },
    { label: 'CBSE', href: '/past-papers/results?filter_boards=CBSE' },
    { label: 'Maths', href: '/past-papers/results?filter_subjects=Maths' },
  ],
};

export interface SearchDeskProps {
  onModeChange?: (mode: SearchMode) => void;
  className?: string;
}

export function SearchDesk({ onModeChange, className = '' }: SearchDeskProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SearchMode>('teachers');
  // Mirrors the control's mode locally so this card can dress itself, while
  // still forwarding it to the page (which swaps the hero copy off it).
  const handleModeChange = useCallback((next: SearchMode) => {
    setMode(next);
    onModeChange?.(next);
  }, [onModeChange]);

  return (
    /* Handoff H-008: SearchDesk becomes a plain BentoPanel-radius'd panel —
       no overhang, no shadow. The wrapping `-mt` negative margin that used to
       hang this card off the hero block is gone from Index.tsx entirely. */
    <div className={`rounded-bento bg-card p-4 pb-[18px] sm:p-6 ${className}`}>
      {/* Two devices, one search. desktop-01-home.png puts three labelled
          dropdowns and a Search button in this card; the mobile mockups put the
          single field with the Teachers/Papers toggle. The build previously used
          the mobile device at every width, which was the largest desktop
          departure from the handoff. Both write the same query string to the
          same route, so a URL from one width still works at the other. */}
      <div className="lg:hidden">
        <SearchControl align="flex-start" stackedToggle alwaysShowModeToggle onModeChange={handleModeChange} heroDesk />
      </div>
      <HeroFieldSearch className="hidden lg:block" />

      {/* No "Popular" label. Home concepts 2a runs the facet chips straight
          under the field with nothing introducing them — the row is self-evident
          and the label was costing a chip's width of scroll on a 390px screen.
          Handoff H-010: 44px chips (was 40, below the floor), -mx-4 px-4 scroller. */}
      <div className="-mx-4 mt-2.5 overflow-x-auto px-4 pb-0.5 scrollbar-hide sm:mx-0 sm:px-0">
        <div key={mode} className="flex w-max animate-blur-swap items-center gap-2 motion-reduce:animate-none sm:w-full sm:flex-wrap">
          {POPULAR_CHIPS[mode].map((c) => (
            <Chip
              key={c.label}
              tone="facet"
              size={44}
              className={`flex-none whitespace-nowrap px-[18px] text-[14.5px] font-semibold ${
                mode === 'papers' ? '!bg-brand-blue-subtle !text-brand-blue' : ''
              }`}
              onClick={() => navigate(c.href)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
