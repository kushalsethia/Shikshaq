import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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
}

const SUBJECTS = [
  'Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer', 'Hindi',
  'History & Civics', 'Geography', 'Economics', 'Accountancy', 'Business Studies',
  'Commerce', 'Psychology', 'Sociology', 'Political Science', 'Environmental Science',
  'Bengali', 'Drawing', 'SAT', 'ACT', 'CAT', 'NMAT', 'GMAT', 'CA', 'CFA'
];

const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const BOARDS = ['ICSE', 'CBSE', 'IGCSE', 'IB', 'State'];

const CLASS_SIZE = ['Group', 'Solo'];

const AREAS = [
  'Behala', 'Tollygunge', 'New Town', 'Howrah', 'Liluah', 'Beliaghata', 'Sealdah', 'Alipore',
  'New Alipore', 'Chetla', 'Bhowanipore', 'Park Street', 'Ruby', 'Bypass', 'Southern Avenue',
  'Gariahat', 'Hazra', 'Kankurgachi', 'Ultadanga', 'Baguihati', 'Salt Lake', 'Lake Town', 'Dum Dum',
  'Keshtopur', 'Ballygunge', 'Kasba', 'Jadavpur'
];

const MODE_OF_TEACHING = ['Online', 'Offline'];

export function FilterPanel({ open, onOpenChange, filters, onFilterChange, onClearFilters }: FilterPanelProps) {
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
    filters.modeOfTeaching.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Filter your search</SheetTitle>
        </SheetHeader>

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
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <div className="mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

