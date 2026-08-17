import { useNavigate } from 'react-router-dom';
import { SearchControl } from '@/components/SearchControl';
import { HeroFieldSearch } from '@/components/home/HeroFieldSearch';
import { Chip } from '@/components/ui/chip';
import { Eyebrow } from '@/components/ui/eyebrow';
import type { SearchMode } from '@/utils/searchFacets';

/* Redesign C5 (design.md §2.8, C-053).

   The overhanging search card: a bone card that overhangs the dark slab's
   bottom edge (-26px mobile / -56px desktop) holding the mode toggle, the
   search field and the popular chips. The slab above keeps only eyebrow,
   headline and lede — everything interactive lives in here.

   Reuses the existing SearchControl (mode toggle + field + facet row +
   suggestions) rather than re-implementing search, and adds the popular
   chip row underneath it per design.md §2.8. */

const POPULAR_CHIPS: { label: string; href: string }[] = [
  { label: 'Class 10', href: '/all-tuition-teachers-in-kolkata?filter_classes=10' },
  { label: 'Maths', href: '/maths-tuition-teachers-in-kolkata' },
  { label: 'Under ₹800', href: '/all-tuition-teachers-in-kolkata' },
  { label: 'Home tuition', href: '/all-tuition-teachers-in-kolkata' },
];

export interface SearchDeskProps {
  onModeChange?: (mode: SearchMode) => void;
  className?: string;
}

export function SearchDesk({ onModeChange, className = '' }: SearchDeskProps) {
  const navigate = useNavigate();

  return (
    <div className={`rounded-3xl bg-card p-4 shadow-border-hover sm:p-6 ${className}`}>
      {/* Two devices, one search. desktop-01-home.png puts three labelled
          dropdowns and a Search button in this card; the mobile mockups put the
          single field with the Teachers/Papers toggle. The build previously used
          the mobile device at every width, which was the largest desktop
          departure from the handoff. Both write the same query string to the
          same route, so a URL from one width still works at the other. */}
      <div className="lg:hidden">
        <SearchControl align="flex-start" stackedToggle alwaysShowModeToggle onModeChange={onModeChange} />
      </div>
      <HeroFieldSearch className="hidden lg:block" />

      <div className="-mx-4 mt-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
        <div className="flex w-max items-center gap-2 sm:w-full sm:flex-wrap">
          <Eyebrow as="span" className="flex-none">
            Popular
          </Eyebrow>
          {POPULAR_CHIPS.map((c) => (
            <Chip
              key={c.label}
              tone="facet"
              size={40}
              className="flex-none"
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
