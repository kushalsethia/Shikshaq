import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export interface FilterState {
  subjects: string[];
  classes: string[];
  boards: string[];
  classSize: string[];
  areas: string[];
  modeOfTeaching: string[];
  minFees: number | null;
  maxFees: number | null;
}

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

const BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];

const CLASS_SIZE = ['Group', 'Solo'];

const AREAS = [
  // Group 1
  'Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Gariahat', 'Garia', 'Jadavpur', 'Kasba', 
  'New Alipore', 'Southern Avenue', 'Tollygunge', 'Hazra',
  // Group 2
  'Baguihati', 'Belur', 'Howrah', 'Joka', 'Newtown', 'Rajarhat', 'Salt Lake', 'Science City',
  // Group 3
  'Dum Dum', 'Entally', 'Girish Park', 'Nagarbazar', 'Sealdah', 'Shyam Bazar', 'Tangra',
  // Group 4
  'Camac Street', 'College Street', 'Elgin', 'Minto Park', 'Park Street', 'Park Circus',
  // Group 5
  'Kankurgachi', 'Laketown', 'Phoolbagan', 'Ultadanga',
  // Group 6
  'Anandapur', 'Parnasree', 'Rabindra Nagar',
  // Group 7
  'Hooghly'
].sort();

const MODE_OF_TEACHING = ['Online', 'Offline'];

// Hardcoded subjects list (sorted alphabetically) - matches subjects table
const SUBJECTS = [
  'Accounts', 'ACT', 'AP', 'Bengali', 'Biology', 'Business Studies', 'CA', 'CAT', 'Chemistry',
  'Commerce', 'Computers', 'Drawing & Painting', 'Economics', 'English', 'Environmental Science',
  'Geography', 'Hindi', 'History & Civics', 'Home Science', 'JEE', 'Legal Studies', 'Maths',
  'NEET', 'NMAT', 'Physics', 'Political Science', 'Psychology', 'SAT', 'Science',
  'Sanskrit', 'Social Studies', 'Sociology'
];

export function FilterPanel({ open, onOpenChange, filters, onFilterChange, onClearFilters }: FilterPanelProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Handle scroll detection for sticky header - similar to navbar behavior
  useEffect(() => {
    if (!open) {
      // Reset scroll state when panel closes
      setIsScrolled(false);
      lastScrollY.current = 0;
      return;
    }

    let cleanup: (() => void) | null = null;

    // Small delay to ensure ref is available
    const timeoutId = setTimeout(() => {
      const sheetContent = sheetContentRef.current;
      if (!sheetContent) return;

      const handleScroll = () => {
        const scrollPosition = Math.max(0, sheetContent.scrollTop);
        const previousScrollY = lastScrollY.current;
        
        // Use hysteresis with different thresholds to prevent jumping
        // Scrolling down: trigger at 50px (higher threshold)
        // Scrolling up: return to original when at top (0px)
        if (scrollPosition > previousScrollY) {
          // Scrolling down - make sticky when past 50px
          setIsScrolled(scrollPosition > 50);
        } else if (scrollPosition < previousScrollY) {
          // Scrolling up - return to original position when at top
          setIsScrolled(scrollPosition > 0);
        } else {
          // Same position - maintain current state based on scroll position
          setIsScrolled(scrollPosition > 50);
        }
        
        lastScrollY.current = scrollPosition;
      };

      // Check initial scroll position
      lastScrollY.current = Math.max(0, sheetContent.scrollTop);
      handleScroll();
      
      sheetContent.addEventListener('scroll', handleScroll, { passive: true });
      
      cleanup = () => {
        sheetContent.removeEventListener('scroll', handleScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, [open]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const hasActiveFilters = 
    filters.subjects.length > 0 ||
    filters.classes.length > 0 ||
    filters.boards.length > 0 ||
    filters.classSize.length > 0 ||
    filters.areas.length > 0 ||
    filters.modeOfTeaching.length > 0 ||
    filters.minFees != null ||
    filters.maxFees != null;

  const handleApplyFilters = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        ref={sheetContentRef}
        side="right" 
        className="w-full sm:max-w-lg overflow-y-auto [&>button:last-child]:hidden"
        style={{
          paddingTop: isScrolled ? 0 : undefined,
          transition: 'padding-top 0.3s ease-in-out'
        }}
      >
        {/* Sticky header with Advanced Filters title and X button - sticky when scrolling down, returns to original position when at top */}
        <div className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 -mx-6 px-6 pb-4 mb-6 transition-all duration-300 ease-in-out ${
          isScrolled ? 'pt-[7px]' : 'pt-6'
        }`}>
          <div className="flex items-center justify-between">
            <SheetHeader className="flex-1">
              <SheetTitle className="text-2xl font-sans font-normal tracking-tight">Advanced Filters</SheetTitle>
            </SheetHeader>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-2">
          <X className="h-6 w-6 stroke-[2.5]" />
          <span className="sr-only">Close</span>
        </SheetClose>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {/* Subjects taught */}
          <div>
            <h3 className="text-lg font-medium mb-4">Subjects taught</h3>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleFilter('subjects', subject)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.subjects.includes(subject)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Classes taught */}
          <div>
            <h3 className="text-lg font-medium mb-4">Classes taught</h3>
            <div className="flex flex-wrap gap-2">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  onClick={() => toggleFilter('classes', cls)}
                  className={`w-12 h-12 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${
                    filters.classes.includes(cls)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Boards taught */}
          <div>
            <h3 className="text-lg font-medium mb-4">Boards taught</h3>
            <div className="flex flex-wrap gap-2">
              {BOARDS.map((board) => (
                <button
                  key={board}
                  onClick={() => toggleFilter('boards', board)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.boards.includes(board)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {board}
                </button>
              ))}
            </div>
          </div>

          {/* Classes Size */}
          <div>
            <h3 className="text-lg font-medium mb-4">Classes Size</h3>
            <div className="flex flex-wrap gap-2">
              {CLASS_SIZE.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleFilter('classSize', size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.classSize.includes(size)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-lg font-medium mb-4">Areas</h3>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleFilter('areas', area)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.areas.includes(area)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Mode of teaching */}
          <div>
            <h3 className="text-lg font-medium mb-4">Mode of teaching</h3>
            <div className="flex flex-wrap gap-2">
              {MODE_OF_TEACHING.map((mode) => (
                <button
                  key={mode}
                  onClick={() => toggleFilter('modeOfTeaching', mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.modeOfTeaching.includes(mode)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Fees per month */}
          <div>
            <h3 className="text-lg font-medium mb-4">Fees per month (₹)</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minFees">Minimum</Label>
                  <Input
                    id="minFees"
                    type="tel"
                    placeholder="e.g., 2000"
                    value={filters.minFees?.toString() || ''}
                    onChange={(e) => {
                      // Only allow digits, limit to 6 digits
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      onFilterChange({
                        ...filters,
                        minFees: digits ? parseInt(digits) : null,
                      });
                    }}
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFees">Maximum</Label>
                  <Input
                    id="maxFees"
                    type="tel"
                    placeholder="e.g., 5000"
                    value={filters.maxFees?.toString() || ''}
                    onChange={(e) => {
                      // Only allow digits, limit to 6 digits
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                      onFilterChange({
                        ...filters,
                        maxFees: digits ? parseInt(digits) : null,
                      });
                    }}
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Filter teachers by their monthly fee range. Leave empty to show all.
              </p>
            </div>
          </div>
        </div>

        {/* Filter action buttons */}
        <div className="mt-8 pt-6 border-t space-y-3 sticky bottom-0 bg-background pb-4">
          <div className="flex gap-3">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex-1"
              >
                Clear filters
              </Button>
            )}
            <Button
              onClick={handleApplyFilters}
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white ${!hasActiveFilters ? 'w-full' : ''}`}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

