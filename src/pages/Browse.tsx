import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { SearchControl } from '@/components/SearchControl';
import { TeacherCard } from '@/components/TeacherCard';
import { Footer } from '@/components/Footer';
import { EmptyResults } from '@/components/EmptyResults';
import { FilterChips, type FilterChipItem } from '@/components/FilterChips';
import { FilterPanel, FilterState } from '@/components/FilterPanel';
import { Nudge } from '@/components/Nudge';
import { SlidersHorizontal, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { extractFiltersFromQuery, extractNameFromQuery } from '@/utils/searchKeywordExtractor';
import { SUBJECT_DISPLAY_ORDER } from '@/utils/subjectOrder';
import { searchByName, searchByNameWithScores } from '@/utils/searchByName';
import { getCache, setCache, CACHE_TTL, getTeachersListCacheKey, getShikshaqmineChunkCacheKey, clearExpiredCache } from '@/utils/cache';
import { getSubjectPalette } from '@/lib/subject-palette';


interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  bio: string | null;
  location: string | null;
  subjects: { name: string; slug: string } | null;
  subjects_from_shikshaq?: string | null;
  classes_taught?: string | null;
  mode_of_teaching?: string | null;
  is_featured?: boolean | null;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface BrowseProps {
  /**
   * Whether Browse owns the page title/description. SubjectPage and BoardPage
   * render Browse as a child, and this component mounts *after* their effects
   * have run — so without this flag it overwrites their keyword-targeted SEO
   * tags with the generic "All Tuition Teachers" copy.
   */
  manageSeo?: boolean;
}

/**
 * Loading placeholder that mirrors TeacherCard's sm-size geometry (18px radius,
 * 4/5 portrait) so the list doesn't jump when results land. Grid matches the
 * live results grid via the shared .shikshaq-teacher-grid class — a fixed
 * 2-column layout below 640px (so mobile genuinely gets 2 columns rather than
 * relying on auto-fill math that can collapse to 1 column on narrow phones),
 * reverting to the original auto-fill minmax(220px,1fr) at sm+ (TeacherCard.md).
 */
function TeacherCardSkeletons({ count }: { count: number }) {
  return (
    <div className="shikshaq-teacher-grid">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-shimmer aspect-[4/5] rounded-[18px] bg-warm-band" />
      ))}
    </div>
  );
}

/**
 * Pure filter predicate against Shikshaqmine records, extracted so it can be reused
 * both for the live results (main fetch below) and for computing EmptyResults' relax
 * options (real "drop one filter, re-run the count" counts per components/EmptyResults.md,
 * not static/hardcoded copy).
 */
function filterShikshaqRecords(recordsToFilter: any[], effectiveFilters: FilterState): any[] {
  // Pre-compute lowercase filter values once (outside loop for performance)
  const subjectFiltersLower = effectiveFilters.subjects.map(s => s.toLowerCase());
  const classFiltersLower = effectiveFilters.classes.map(c => c.toLowerCase());
  const boardFiltersLower = effectiveFilters.boards.map(b => b.toLowerCase());
  const classSizeFiltersLower = effectiveFilters.classSize.map(s => s.toLowerCase());
  const areaFiltersLower = effectiveFilters.areas.map(a => a.toLowerCase());
  const modeFiltersLower = effectiveFilters.modeOfTeaching.map(m => m.toLowerCase());
  const placeFiltersLower = effectiveFilters.placeOfTeaching.map(p => p.toLowerCase());

  return recordsToFilter.filter((record: any) => {
    // Pre-compute lowercase values for this record once (inside loop but before checks)
    const subjectsRaw = (record.Subjects || '').toLowerCase();
    // Match by whole subject tokens (comma-separated) so "AP" matches only subject AP, not "ap" in "Geography"
    const subjectTokens = subjectsRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
    const classesBackend = (record["Classes Taught for Backend"] || '').toLowerCase();
    const classesDisplay = (record["Classes Taught"] || '').toLowerCase();
    // Tokenize comma- or slash-separated values so "IB" doesn't match inside "ICSE", "Park" doesn't match "Park Street", etc.
    const tokenize = (s: string) => s.split(/\s*[,/]\s*/).map((x: string) => x.trim().toLowerCase()).filter(Boolean);
    const boardTokens = tokenize(record["School Boards Catered"] || '');
    const classSizeTokens = tokenize(record["Class Size (Group/ Solo)"] || '');
    const areaTokens = tokenize(record.Area || record["AREAS FOR FILTERING"] || '');
    const modeTokens = tokenize(record["Mode of Teaching"] || '');
    const placeTokens = tokenize(record["Place of Teaching"] || '');

    // Check subjects (match whole tokens only so AP does not match Geography)
    if (effectiveFilters.subjects.length > 0) {
      const hasSubject = subjectFiltersLower.some(subjLower => {
        const tokenMatches = (token: string) => subjectTokens.includes(token);
        const tokenMatchesAny = (tokens: string[]) => tokens.some(t => subjectTokens.includes(t));
        // Handle "Accountancy" matching "Accounts" in database for backward compatibility
        if (subjLower === 'accountancy') {
          return tokenMatchesAny(['accountancy', 'accounts']);
        }
        // Handle "Computers" matching "Computer" (singular/plural variants in DB)
        if (subjLower === 'computers') {
          return tokenMatchesAny(['computers', 'computer']);
        }
        if (subjLower === 'computer') {
          return tokenMatches('computer');
        }
        // Handle "Drawing & Painting" / "Drawing and Painting" / "Drawing" variants in DB
        if (subjLower === 'drawing & painting' || subjLower === 'drawing and painting') {
          return tokenMatchesAny(['drawing & painting', 'drawing and painting', 'drawing']);
        }
        if (subjLower === 'drawing') {
          return tokenMatches('drawing');
        }
        // Social Studies = History & Civics OR Geography (and optionally "Social Studies" in DB)
        if (subjLower === 'social studies') {
          return tokenMatchesAny(['history & civics', 'geography', 'social studies']);
        }
        return tokenMatches(subjLower);
      });
      if (!hasSubject) {
        return false;
      }
    }

    // Check classes - backend is token-based; display uses word boundary so "5" doesn't match "15"
    if (effectiveFilters.classes.length > 0) {
      const hasClass = classFiltersLower.some(classLower => {
        if (classesBackend) {
          const backendClasses = classesBackend.split(',').map(c => c.trim());
          if (backendClasses.includes(classLower)) {
            return true;
          }
        }
        if (classesDisplay) {
          const escaped = classLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (new RegExp(`\\b${escaped}\\b`).test(classesDisplay)) {
            return true;
          }
          return classesDisplay.includes(`class ${classLower}`) ||
                 classesDisplay.includes(`class ${classLower} -`) ||
                 classesDisplay.includes(`- ${classLower}`) ||
                 classesDisplay.includes(`class ${classLower}-`);
        }
        return false;
      });
      if (!hasClass) {
        return false;
      }
    }

    // Check boards - whole tokens only (e.g. IB matches only "IB", not inside "ICSE")
    if (effectiveFilters.boards.length > 0) {
      const hasBoard = boardFiltersLower.some(boardLower =>
        boardTokens.includes(boardLower)
      );
      if (!hasBoard) {
        return false;
      }
    }

    // Check class size - whole tokens only (e.g. "Group" only as token, not substring)
    if (effectiveFilters.classSize.length > 0) {
      const hasSize = classSizeFiltersLower.some(sizeLower =>
        classSizeTokens.includes(sizeLower)
      );
      if (!hasSize) {
        return false;
      }
    }

    // Check areas - whole tokens only (e.g. "Park" only as token, not inside "Park Street")
    if (effectiveFilters.areas.length > 0) {
      const hasArea = areaFiltersLower.some(areaLower =>
        areaTokens.includes(areaLower)
      );
      if (!hasArea) {
        return false;
      }
    }

    // Check mode of teaching - whole tokens only
    if (effectiveFilters.modeOfTeaching.length > 0) {
      const hasMode = modeFiltersLower.some(modeLower =>
        modeTokens.includes(modeLower)
      );
      if (!hasMode) {
        return false;
      }
    }

    // Check place of teaching - whole tokens only
    if (effectiveFilters.placeOfTeaching.length > 0) {
      const hasPlace = placeFiltersLower.some(placeLower =>
        placeTokens.includes(placeLower)
      );
      if (!hasPlace) {
        return false;
      }
    }

    // Check fees - filter by Min Fees and Max Fees from Shikshaqmine
    const teacherMinFees = (record["Min Fees"] != null) ? Number(record["Min Fees"]) : null;
    const teacherMaxFees = (record["Max Fees"] != null) ? Number(record["Max Fees"]) : null;
    const filterMinFees = effectiveFilters.minFees;
    const filterMaxFees = effectiveFilters.maxFees;

    // Only filter if at least one fee filter is set
    if (filterMinFees != null || filterMaxFees != null) {
      // If teacher has no fees data, exclude them
      if (teacherMinFees == null && teacherMaxFees == null) {
        return false;
      }

      // Check if fee ranges overlap
      // Filter: [filterMinFees, filterMaxFees] - user wants teachers in this range
      // Teacher: [teacherMinFees, teacherMaxFees] - teacher's actual fee range
      // Match if ranges overlap (teacher's range intersects with filter range)

      let matches = true;

      // If filter has minFees, check if teacher's range can include values >= filterMinFees
      if (filterMinFees != null) {
        if (teacherMaxFees != null) {
          // Teacher has maxFees - check if their range goes high enough (maxFees >= filterMinFees)
          matches = matches && teacherMaxFees >= filterMinFees;
        } else if (teacherMinFees != null) {
          // Teacher only has minFees - check if their minimum is acceptable (minFees >= filterMinFees)
          // If teacher charges at least filterMinFees, they match
          matches = matches && teacherMinFees >= filterMinFees;
        } else {
          matches = false;
        }
      }

      // If filter has maxFees, check if teacher's range can include values <= filterMaxFees
      if (filterMaxFees != null) {
        if (teacherMinFees != null) {
          // Teacher has minFees - check if their range goes low enough (minFees <= filterMaxFees)
          matches = matches && teacherMinFees <= filterMaxFees;
        } else if (teacherMaxFees != null) {
          // Teacher only has maxFees - check if their maximum is acceptable (maxFees <= filterMaxFees)
          // If teacher charges at most filterMaxFees, they match
          matches = matches && teacherMaxFees <= filterMaxFees;
        } else {
          matches = false;
        }
      }

      if (!matches) {
        return false;
      }
    }

    // Check experience
    if (effectiveFilters.minExperience != null) {
      const yearStarted = parseInt(record["Years they started teaching"]);
      if (!yearStarted || isNaN(yearStarted)) {
        return false;
      }
      const currentYear = new Date().getFullYear();
      const yearsExp = currentYear - yearStarted;
      if (yearsExp < parseInt(effectiveFilters.minExperience)) {
        return false;
      }
    }

    return true;
  });
}

export default function Browse({ manageSeo = true }: BrowseProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const { user, loading: authLoading, profile: userProfile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnToBrowseUrl = location.pathname + location.search;

  // Redirect using centralized profile from auth context instead of an extra fetch
  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) return;

    if (!userProfile || !userProfile.role) {
      navigate('/select-role', { replace: true });
      return;
    }
    if (userProfile.role === 'teacher' && userProfile.terms_agreement !== true) {
      navigate('/teacher-terms-agreement', { replace: true });
    }
  }, [user, authLoading, userProfile, profileLoading, navigate]);
  
  // Helper function to parse array from URL params
  const parseArrayParam = (param: string | null): string[] => {
    if (!param) return [];
    return param.split(',').filter(Boolean);
  };

  // Helper function to serialize array to URL param
  const serializeArrayParam = (arr: string[]): string | null => {
    return arr.length > 0 ? arr.join(',') : null;
  };

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const minFeesParam = searchParams.get('filter_minFees');
    const maxFeesParam = searchParams.get('filter_maxFees');
    return {
      subjects: parseArrayParam(searchParams.get('filter_subjects')),
      classes: parseArrayParam(searchParams.get('filter_classes')),
      boards: parseArrayParam(searchParams.get('filter_boards')),
      classSize: parseArrayParam(searchParams.get('filter_classSize')),
      areas: parseArrayParam(searchParams.get('filter_areas')),
      modeOfTeaching: parseArrayParam(searchParams.get('filter_modeOfTeaching')),
      placeOfTeaching: parseArrayParam(searchParams.get('filter_placeOfTeaching')),
      minFees: minFeesParam ? parseInt(minFeesParam) : null,
      maxFees: maxFeesParam ? parseInt(maxFeesParam) : null,
      minExperience: searchParams.get('filter_experience') || null,
    };
  });
  const [displayedTeachers, setDisplayedTeachers] = useState<Teacher[]>([]);
  const [allTeachersData, setAllTeachersData] = useState<Teacher[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Ref to track if we're updating URL ourselves (to prevent circular updates)
  const isUpdatingUrlRef = useRef(false);
  // Ref to track loading timeout
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to debounce filter-driven refetches
  const fetchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Wraps SearchControl so "Edit search" can focus its input, which re-expands it
  const searchControlWrapRef = useRef<HTMLDivElement>(null);
  // Snapshot of the Shikshaqmine records + effective filters behind the most recent
  // fetch, so the EmptyResults "relax a filter" options can be computed with real
  // counts (components/EmptyResults.md) without a second Supabase round trip.
  const lastQueryRef = useRef<{ shikshaqRecords: any[]; effectiveFilters: FilterState } | null>(null);

  const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

  useEffect(() => {
    // Canonical is handled globally by <CanonicalTag>.
    if (!manageSeo) return;

    document.title = 'All Tuition Teachers in Kolkata | Shikshaq';
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDesc) metaDesc.setAttribute('content', 'Browse all verified tuition teachers in Kolkata. Filter by subject, class, board, area, mode of teaching, and fees. Free to use, connect directly with local tutors.');
    return () => {
      document.title = 'Shikshaq - Find Tuition Teachers in Kolkata';
      if (metaDesc) metaDesc.setAttribute('content', 'Find verified tuition teachers in Kolkata for free. Search by subject, class, board, and area. Connect directly with local tutors for CBSE, ICSE, IGCSE, IB, State Board. No commission, no middlemen.');
    };
  }, [manageSeo]);

  useEffect(() => {
    async function fetchSubjects() {
      // Check cache first
      const cacheKey = 'subjects';
      const cached = getCache<Subject[]>(cacheKey);
      if (cached) {
        setSubjects(cached);
        return;
      }

      const { data } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (data) {
        // Filter out duplicates and fix misspellings
        const seen = new Set<string>();
        const cleanedSubjects = data
          .map((subject: any) => {
            // Fix common misspellings
            let name = subject.name;
            if (name.toLowerCase() === 'englsih') {
              name = 'English';
            }
            return { ...subject, name };
          })
          .filter((subject: any) => {
            // Remove duplicates (case-insensitive)
            const nameLower = subject.name.toLowerCase();
            if (seen.has(nameLower)) {
              return false;
            }
            seen.add(nameLower);
            return true;
          });

        setSubjects(cleanedSubjects);
        // Cache the cleaned subjects
        setCache(cacheKey, cleanedSubjects, CACHE_TTL.SUBJECTS);
      }
    }

    fetchSubjects();
    // Clean up expired cache on mount
    clearExpiredCache();
  }, []);

  // Sync selectedSubject with URL parameter when it changes
  useEffect(() => {
    const subjectFromUrl = searchParams.get('subject') || '';
    setSelectedSubject(subjectFromUrl);
  }, [searchParams]);

  // Update URL when filters change (but not when URL changes filters)
  useEffect(() => {
    // Skip if we're in the middle of syncing from URL
    if (isUpdatingUrlRef.current) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    
    // Update filter params - ensure ALL filters are synced to URL
    const subjectsParam = serializeArrayParam(filters.subjects);
    if (subjectsParam) {
      newParams.set('filter_subjects', subjectsParam);
    } else {
      newParams.delete('filter_subjects');
    }

    const classesParam = serializeArrayParam(filters.classes);
    if (classesParam) {
      newParams.set('filter_classes', classesParam);
    } else {
      newParams.delete('filter_classes');
    }

    const boardsParam = serializeArrayParam(filters.boards);
    if (boardsParam) {
      newParams.set('filter_boards', boardsParam);
    } else {
      newParams.delete('filter_boards');
    }

    const classSizeParam = serializeArrayParam(filters.classSize);
    if (classSizeParam) {
      newParams.set('filter_classSize', classSizeParam);
    } else {
      newParams.delete('filter_classSize');
    }

    const areasParam = serializeArrayParam(filters.areas);
    if (areasParam) {
      newParams.set('filter_areas', areasParam);
    } else {
      newParams.delete('filter_areas');
    }

    const modeParam = serializeArrayParam(filters.modeOfTeaching);
    if (modeParam) {
      newParams.set('filter_modeOfTeaching', modeParam);
    } else {
      newParams.delete('filter_modeOfTeaching');
    }

    const placeParam = serializeArrayParam(filters.placeOfTeaching);
    if (placeParam) {
      newParams.set('filter_placeOfTeaching', placeParam);
    } else {
      newParams.delete('filter_placeOfTeaching');
    }

    // Handle fees filters
    if (filters.minFees != null) {
      newParams.set('filter_minFees', filters.minFees.toString());
    } else {
      newParams.delete('filter_minFees');
    }

    if (filters.maxFees != null) {
      newParams.set('filter_maxFees', filters.maxFees.toString());
    } else {
      newParams.delete('filter_maxFees');
    }

    if (filters.minExperience != null) {
      newParams.set('filter_experience', filters.minExperience);
    } else {
      newParams.delete('filter_experience');
    }

    // Only update URL if params actually changed (avoid infinite loop)
    const currentParams = searchParams.toString();
    const newParamsStr = newParams.toString();
    if (currentParams !== newParamsStr) {
      isUpdatingUrlRef.current = true;
      setSearchParams(newParams, { replace: true });
      // Reset flag after a short delay to allow URL update to complete
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
      }, 0);
    }
  }, [filters, searchParams, setSearchParams]);

  // Extract filters from search query and merge with URL filters
  useEffect(() => {
    // Skip if we just updated the URL ourselves
    if (isUpdatingUrlRef.current) {
      return;
    }

    const minFeesParam = searchParams.get('filter_minFees');
    const maxFeesParam = searchParams.get('filter_maxFees');
    const urlFilters = {
      subjects: parseArrayParam(searchParams.get('filter_subjects')),
      classes: parseArrayParam(searchParams.get('filter_classes')),
      boards: parseArrayParam(searchParams.get('filter_boards')),
      classSize: parseArrayParam(searchParams.get('filter_classSize')),
      areas: parseArrayParam(searchParams.get('filter_areas')),
      modeOfTeaching: parseArrayParam(searchParams.get('filter_modeOfTeaching')),
      placeOfTeaching: parseArrayParam(searchParams.get('filter_placeOfTeaching')),
      minFees: minFeesParam ? parseInt(minFeesParam) : null,
      maxFees: maxFeesParam ? parseInt(maxFeesParam) : null,
      minExperience: searchParams.get('filter_experience') || null,
    };

    // Extract filters from search query (q parameter)
    const searchQuery = searchParams.get('q');
    let extractedFilters: Partial<FilterState> = {};
    if (searchQuery && searchQuery.trim().length >= 2) {
      extractedFilters = extractFiltersFromQuery(searchQuery, subjects);
    }

    // If there's a search query, use ONLY the extracted filters (clear previous search filters)
    // If no search query, use URL filters (from filter panel selections)
    // Always create new arrays to ensure React detects the change
    const mergedFilters: FilterState = {
      subjects: searchQuery ? [...(extractedFilters.subjects || [])] : [...urlFilters.subjects],
      classes: searchQuery ? [...(extractedFilters.classes || [])] : [...urlFilters.classes],
      boards: searchQuery ? [...(extractedFilters.boards || [])] : [...urlFilters.boards],
      classSize: searchQuery ? [...(extractedFilters.classSize || [])] : [...urlFilters.classSize],
      areas: searchQuery ? [...(extractedFilters.areas || [])] : [...urlFilters.areas],
      modeOfTeaching: searchQuery ? [...(extractedFilters.modeOfTeaching || [])] : [...urlFilters.modeOfTeaching],
      placeOfTeaching: searchQuery ? [...(extractedFilters.placeOfTeaching || [])] : [...urlFilters.placeOfTeaching],
      minFees: searchQuery ? (extractedFilters.minFees ?? null) : urlFilters.minFees,
      maxFees: searchQuery ? (extractedFilters.maxFees ?? null) : urlFilters.maxFees,
      minExperience: searchQuery ? (extractedFilters.minExperience ?? null) : urlFilters.minExperience,
    };

    // Only update if filters actually differ (prevent unnecessary updates)
    // Sort arrays before comparing to handle order differences
    const filtersChanged = 
      JSON.stringify([...mergedFilters.subjects].sort()) !== JSON.stringify([...filters.subjects].sort()) ||
      JSON.stringify([...mergedFilters.classes].sort()) !== JSON.stringify([...filters.classes].sort()) ||
      JSON.stringify([...mergedFilters.boards].sort()) !== JSON.stringify([...filters.boards].sort()) ||
      JSON.stringify([...mergedFilters.classSize].sort()) !== JSON.stringify([...filters.classSize].sort()) ||
      JSON.stringify([...mergedFilters.areas].sort()) !== JSON.stringify([...filters.areas].sort()) ||
      JSON.stringify([...mergedFilters.modeOfTeaching].sort()) !== JSON.stringify([...filters.modeOfTeaching].sort()) ||
      JSON.stringify([...mergedFilters.placeOfTeaching].sort()) !== JSON.stringify([...filters.placeOfTeaching].sort()) ||
      mergedFilters.minFees !== filters.minFees ||
      mergedFilters.maxFees !== filters.maxFees ||
      mergedFilters.minExperience !== filters.minExperience;

    if (filtersChanged) {
      // Update filters - the URL sync effect will handle updating the URL
      // Don't block URL sync - let it run normally to update the URL with all filters
      setFilters(mergedFilters);
    }
  }, [searchParams]); // Don't include filters to prevent loops - only run when searchParams change

  useEffect(() => {
    async function fetchTeachers() {
      // Don't fetch if subjects haven't loaded yet (needed for subject filtering)
      if (subjects.length === 0 && searchParams.get('subject')) {
        return;
      }
      
      // Reset infinite scroll when filters/search change
      setDisplayedTeachers([]);
      setAllTeachersData([]);
      setHasMore(true);
      
      // Clear any existing loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // If there's a search query, show loading immediately to prevent flash of all teachers
      const searchQuery = searchParams.get('q');
      if (searchQuery && searchQuery.trim().length >= 2) {
        setLoading(true);
      } else {
        // For filter-only changes, use a delay to prevent flickering on fast filters
      loadingTimeoutRef.current = setTimeout(() => {
        setLoading(true);
      }, 150);
      }
      
      try {
        // First, get teachers from teachers_list with a reasonable limit
        const searchQuery = searchParams.get('q');
        const subjectFilter = searchParams.get('subject');
        const classFilter = searchParams.get('class');

        // Check if we have active filters or search (for conditional Shikshaqmine fetch)
        const hasFiltersOrSearch = searchQuery || subjectFilter || classFilter || 
          filters.subjects.length > 0 || filters.classes.length > 0 ||
          filters.boards.length > 0 || filters.classSize.length > 0 ||
          filters.areas.length > 0 || filters.modeOfTeaching.length > 0 ||
          filters.placeOfTeaching.length > 0 || filters.minExperience != null;

        // Fetch all teachers (up to 200) for infinite scroll
        const limit = 200;
        
        // Check cache for teachers list (only when no filters/search - cached data won't have filters applied)
        let teachersData = null;
        if (!hasFiltersOrSearch) {
          const cacheKey = getTeachersListCacheKey(limit);
          const cached = getCache<any[]>(cacheKey);
          if (cached) {
            teachersData = cached;
          }
        }

        // Fetch from API if not in cache
        if (!teachersData) {
          let query = supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, bio, location, is_featured, subjects(name, slug)')
            .order('is_featured', { ascending: false })
            .order('name')
            .limit(limit);

          // Don't filter by subject at database level - we'll filter using Shikshaqmine data
          // This allows matching all subjects a teacher teaches, not just the featured one
          const { data, error } = await query;
          
          if (error) {
            if (import.meta.env.DEV) {
              console.error('Error fetching teachers:', error);
            }
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }
            setLoading(false);
            return;
          }

          if (!data) {
            setTeachers([]);
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }
            setLoading(false);
            return;
          }

          teachersData = data;
          
          // Cache the teachers list (only if no filters/search - we want fresh data when filtering)
                  if (!hasFiltersOrSearch) {
            const cacheKey = getTeachersListCacheKey(limit);
            setCache(cacheKey, teachersData, CACHE_TTL.TEACHERS_LIST);
          }
        }

        // Fetch Shikshaqmine data for filtering and enrichment
        let allShikshaqData = null;
        if (teachersData && teachersData.length > 0) {
          const teacherSlugs = teachersData.map(t => t.slug);
          
          // Chunked parallel queries (50 per chunk) so this scales past 300+ teachers
          const chunkSize = 50;
          const chunks = [];
          for (let i = 0; i < teacherSlugs.length; i += chunkSize) {
            chunks.push(teacherSlugs.slice(i, i + chunkSize));
          }
          
          const shikshaqPromises = chunks
            .filter(chunk => chunk.length > 0)
            .map(async (chunk) => {
              const cacheKey = getShikshaqmineChunkCacheKey(chunk);
              const cached = getCache<any[]>(cacheKey);
              if (cached) {
                return { data: cached, error: null };
              }
              
              // Column list is every field filterShikshaqRecords() and the
              // enrichment step below actually read (verified by grepping
              // every `record.X` / `record["X"]` access in this file) — not
              // '*', which pulled ~20 unused columns (Description, bios,
              // review text, phone numbers, etc.) per 50-slug chunk.
              const result = await supabase
                .from('Shikshaqmine')
                .select('Slug, Subjects, "Classes Taught for Backend", "Classes Taught", "School Boards Catered", "Class Size (Group/ Solo)", Area, "Mode of Teaching", "Place of Teaching", "Min Fees", "Max Fees", "Sir/Ma\'am?", "Years they started teaching"')
                .in('Slug', chunk);
              
              if (result.data && !result.error) {
                setCache(cacheKey, result.data, CACHE_TTL.SHIKSHAQMINE_CHUNK);
              }
              
              return result;
            });
          
          const shikshaqResults = await Promise.all(shikshaqPromises);
          allShikshaqData = shikshaqResults.flatMap(result => result.data || []);
          
          if (shikshaqResults.some(result => result.error)) {
            if (import.meta.env.DEV) {
              console.error('Error fetching some Shikshaqmine data');
            }
          }
        }

        // Now filter based on Shikshaqmine table data
        let filteredTeachers = teachersData;

        // Read ALL filters from searchParams for consistency (source of truth)
        // This ensures filters persist even when state might be temporarily out of sync
        const minFeesParam = searchParams.get('filter_minFees');
        const maxFeesParam = searchParams.get('filter_maxFees');
        const urlFilters = {
          subjects: parseArrayParam(searchParams.get('filter_subjects')),
          classes: parseArrayParam(searchParams.get('filter_classes')),
          boards: parseArrayParam(searchParams.get('filter_boards')),
          classSize: parseArrayParam(searchParams.get('filter_classSize')),
          areas: parseArrayParam(searchParams.get('filter_areas')),
          modeOfTeaching: parseArrayParam(searchParams.get('filter_modeOfTeaching')),
          placeOfTeaching: parseArrayParam(searchParams.get('filter_placeOfTeaching')),
          minFees: minFeesParam ? parseInt(minFeesParam) : null,
          maxFees: maxFeesParam ? parseInt(maxFeesParam) : null,
          minExperience: searchParams.get('filter_experience') || null,
        };

        // Include class from dropdown in filters (combine URL param and filter panel selections)
        const classFromDropdown = (selectedClass && selectedClass !== 'all') ? selectedClass : null;
        const classFromUrl = (classFilter && classFilter !== 'all') ? classFilter : null;
        const allClassFilters = new Set([
          ...urlFilters.classes,
          ...(classFromDropdown ? [classFromDropdown] : []),
          ...(classFromUrl ? [classFromUrl] : [])
        ]);
        const effectiveClassFilters = Array.from(allClassFilters);

        // Include subject from dropdown in filters (combine URL param and filter panel selections)
        let effectiveSubjectFilters = [...urlFilters.subjects];
        if (subjectFilter && subjectFilter !== 'all') {
          // Find the subject name from the subjects list to match against Shikshaqmine data
          const selectedSubject = subjects.find(s => s.slug === subjectFilter);
          if (selectedSubject) {
            // Add to filters if not already present
            if (!effectiveSubjectFilters.includes(selectedSubject.name)) {
              effectiveSubjectFilters = [...effectiveSubjectFilters, selectedSubject.name];
            }
          } else {
            // If subject not found in subjects list, try to use the slug as a fallback
            // This handles cases where subjects haven't loaded yet
            if (import.meta.env.DEV) {
              console.warn('Subject not found in subjects list:', subjectFilter);
            }
          }
        }

        const hasActiveFilters = effectiveSubjectFilters.length > 0 || effectiveClassFilters.length > 0 || 
            urlFilters.boards.length > 0 || urlFilters.classSize.length > 0 || 
            urlFilters.areas.length > 0 || urlFilters.modeOfTeaching.length > 0 ||
            urlFilters.placeOfTeaching.length > 0 ||
            urlFilters.minFees != null || urlFilters.maxFees != null ||
            urlFilters.minExperience != null;

        // Apply filters (extracted from search query or URL params)
        // If we have a search query, extract filters directly to ensure they're applied immediately
        // This prevents showing all teachers before filters are applied
        let effectiveFilters = {
          subjects: effectiveSubjectFilters,
          classes: effectiveClassFilters,
          boards: urlFilters.boards,
          classSize: urlFilters.classSize,
          areas: urlFilters.areas,
          modeOfTeaching: urlFilters.modeOfTeaching,
          placeOfTeaching: urlFilters.placeOfTeaching,
          minFees: urlFilters.minFees,
          maxFees: urlFilters.maxFees,
          minExperience: urlFilters.minExperience,
        };

        // Extract filters from search query if present (apply immediately, don't wait for state update)
        // If there's a search query, REPLACE all filters with extracted ones (clear previous search)
        let extractedFilters: Partial<FilterState> = {};
          if (searchQuery && searchQuery.trim().length >= 2) {
          extractedFilters = extractFiltersFromQuery(searchQuery, subjects);
          // When query is exactly a subject-only term (e.g. "neet", "ap"), treat as subject filter only so
          // we don't run name search and match similar names (e.g. "Neeta", "Aparna")
          const subjectOnlyQueries: Record<string, string> = { 'ap': 'AP', 'neet': 'NEET' };
          const q = searchQuery.trim().toLowerCase();
          if (subjectOnlyQueries[q]) {
            const subj = subjectOnlyQueries[q];
            if (!(extractedFilters.subjects || []).includes(subj)) {
              extractedFilters = { ...extractedFilters, subjects: [...(extractedFilters.subjects || []), subj] };
            }
          }
          // Replace all filters with extracted ones (don't merge with previous search)
          // Note: Fees and experience are not extracted from search query, keep URL values
          effectiveFilters = {
            subjects: extractedFilters.subjects || [],
            classes: extractedFilters.classes || [],
            boards: extractedFilters.boards || [],
            classSize: extractedFilters.classSize || [],
            areas: extractedFilters.areas || [],
            modeOfTeaching: extractedFilters.modeOfTeaching || [],
            placeOfTeaching: extractedFilters.placeOfTeaching || [],
            minFees: urlFilters.minFees,
            maxFees: urlFilters.maxFees,
            minExperience: extractedFilters.minExperience ?? urlFilters.minExperience,
          };
        }

        // Check if we have any active filters after extraction
        const hasActiveFiltersAfterExtraction = 
          effectiveFilters.subjects.length > 0 || 
          effectiveFilters.classes.length > 0 ||
          effectiveFilters.boards.length > 0 || 
          effectiveFilters.classSize.length > 0 || 
          effectiveFilters.areas.length > 0 || 
          effectiveFilters.modeOfTeaching.length > 0 ||
          effectiveFilters.placeOfTeaching.length > 0 ||
          effectiveFilters.minFees != null ||
          effectiveFilters.maxFees != null ||
          effectiveFilters.minExperience != null;

        // Smart Search Logic: Handle both Name Search and Filters
        // Strategy: 
        // 1. If filters found, extract name part from remaining query
        // 2. If no filters found, treat entire query as name search
        // 3. When both present, prioritize name matches but apply filters
        let namePart = '';
        let nameSearchResults: Teacher[] = [];
        let nameSearchResultsWithScores: Array<{ item: Teacher; score: number }> = [];
        
        if (searchQuery && searchQuery.trim().length >= 3) {
          if (hasActiveFiltersAfterExtraction) {
            // Extract name part from query (e.g., "aparna chemistry" -> "aparna")
            namePart = extractNameFromQuery(searchQuery, extractedFilters, subjects);
            if (namePart.length >= 3) {
              // Both name and filters present - search with scores for prioritization
              nameSearchResultsWithScores = searchByNameWithScores(teachersData, namePart);
              nameSearchResults = nameSearchResultsWithScores.map(r => r.item);
            }
          } else {
            // No filters found - treat entire query as name search
            nameSearchResults = searchByName(teachersData, searchQuery.trim());
          }
        }

        // Apply search logic: Name Search OR Filters OR Both
        if (nameSearchResults.length > 0 && !hasActiveFiltersAfterExtraction) {
          // B. Pure Name Search! Show these specific teachers directly
          filteredTeachers = nameSearchResults;
        } else if (allShikshaqData && hasActiveFiltersAfterExtraction) {
          // A. Apply the extracted filters (existing filter logic)
          const recordsToFilter = allShikshaqData;
          
          const matchingSlugs = filterShikshaqRecords(recordsToFilter, effectiveFilters)
            .map((record: any) => record.Slug);

          // Snapshot the exact records + filters this query used, so the empty state
          // (below) can compute real "drop one filter" counts instead of a static option.
          lastQueryRef.current = { shikshaqRecords: recordsToFilter, effectiveFilters };

          // Filter teachers by matching slugs
          filteredTeachers = teachersData.filter(teacher => 
            matchingSlugs.includes(teacher.slug)
          );

          // If we also have name search results, prioritize name matches
          if (nameSearchResultsWithScores.length > 0) {
            // Create a map of name match scores for quick lookup
            const nameScoreMap = new Map<string, number>();
            nameSearchResultsWithScores.forEach(({ item, score }) => {
              nameScoreMap.set(item.slug, score);
            });

            // Separate teachers into: name matches (with scores) and non-name matches
            const nameMatches: Array<{ teacher: Teacher; score: number }> = [];
            const nonNameMatches: Teacher[] = [];

            filteredTeachers.forEach(teacher => {
              const nameScore = nameScoreMap.get(teacher.slug);
              if (nameScore !== undefined) {
                nameMatches.push({ teacher, score: nameScore });
          } else {
                nonNameMatches.push(teacher);
              }
            });

            // Sort name matches by score (lower = better match)
            nameMatches.sort((a, b) => a.score - b.score);

            // Combine: name matches first (sorted by relevance), then non-name matches
            filteredTeachers = [
              ...nameMatches.map(m => m.teacher),
              ...nonNameMatches
            ];
          }
        } else if ((searchQuery || hasActiveFilters) && !allShikshaqData) {
          // If we have search query or filters but no Shikshaqmine data
          if (searchQuery && !hasActiveFiltersAfterExtraction) {
            // Fall back to fuzzy name search if no filters found
            filteredTeachers = searchByName(teachersData, searchQuery.trim());
          } else if (hasActiveFiltersAfterExtraction) {
            // If we have filters but no Shikshaqmine data, show empty results
            // (can't filter without Shikshaqmine data)
            filteredTeachers = [];
          } else {
            // No search query and no filters - show all teachers
            filteredTeachers = teachersData;
          }
        } else if (searchQuery && !hasActiveFiltersAfterExtraction && nameSearchResults.length === 0) {
          // C. No filters found AND no names found - show empty results
          filteredTeachers = [];
        }

        // Create a map of slug to Shikshaqmine data for enrichment
        const shikshaqMap = new Map();
        if (allShikshaqData) {
          allShikshaqData.forEach((record: any) => {
            shikshaqMap.set(record.Slug, {
              subjects: record.Subjects,
              classes: record["Classes Taught"],
              modeOfTeaching: record["Mode of Teaching"],
              sirMaam: record["Sir/Ma'am?"],
              area: record.Area || null,
            });
          });
        }

        // Enrich teachers with Shikshaqmine data
        const enrichedTeachers = filteredTeachers.map(teacher => {
          const shikshaqInfo = shikshaqMap.get(teacher.slug);
          return {
            ...teacher,
            subjects_from_shikshaq: shikshaqInfo?.subjects || null,
            classes_taught: shikshaqInfo?.classes || null,
            mode_of_teaching: shikshaqInfo?.modeOfTeaching || null,
            sir_maam: shikshaqInfo?.sirMaam || null,
            area: shikshaqInfo?.area || null,
          };
        });

        // Sort: upvotes desc, then name (pages/Browse.md "Data" section).
        let sortedTeachers = enrichedTeachers;
        if (enrichedTeachers.length > 0) {
          const teacherIds = enrichedTeachers.map((t) => t.id);
          const { data: upvoteRows } = await supabase
            .from('teacher_upvote_stats')
            .select('teacher_id, upvote_count')
            .in('teacher_id', teacherIds);
          const upvoteMap = new Map<string, number>(
            (upvoteRows || []).map((r: any) => [r.teacher_id, r.upvote_count || 0])
          );
          sortedTeachers = [...enrichedTeachers].sort((a, b) => {
            const diff = (upvoteMap.get(b.id) || 0) - (upvoteMap.get(a.id) || 0);
            return diff !== 0 ? diff : a.name.localeCompare(b.name);
          });
        }

        // Store all teachers
        setAllTeachersData(sortedTeachers);
        // Page size 24 with an explicit "Load more" button, never infinite scroll (Browse.md).
        const pageSize = 24;
        setDisplayedTeachers(sortedTeachers.slice(0, pageSize));
        setTeachers(sortedTeachers); // Keep for count display
        setHasMore(sortedTeachers.length > pageSize);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching teachers:', error);
        }
      } finally {
        // Clear loading timeout and set loading to false
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setLoading(false);
      }
    }

    // Debounce filter-driven refetches to avoid rapid-fire queries when toggling filters
    if (fetchDebounceRef.current) {
      clearTimeout(fetchDebounceRef.current);
    }
    const searchQuery = searchParams.get('q');
    const debounceMs = searchQuery ? 0 : 250;
    fetchDebounceRef.current = setTimeout(() => {
      fetchTeachers();
    }, debounceMs);
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (fetchDebounceRef.current) {
        clearTimeout(fetchDebounceRef.current);
        fetchDebounceRef.current = null;
      }
    };
  }, [searchParams, subjects]);

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    if (value && value !== 'all') {
      searchParams.set('subject', value);
    } else {
      searchParams.delete('subject');
    }
    setSearchParams(searchParams);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (value && value !== 'all') {
      searchParams.set('class', value);
    } else {
      searchParams.delete('class');
    }
    setSearchParams(searchParams);
  };

  // The search bar's Teachers/Papers toggle doubles as the page-mode switch —
  // flipping to Papers carries the active subject/class/board filters over.
  const handleSearchModeChange = (mode: 'teachers' | 'papers') => {
    if (mode !== 'papers') return;
    const params = new URLSearchParams();
    if (selectedSubject && selectedSubject !== 'all') params.set('filter_subjects', selectedSubject);
    if (selectedClass && selectedClass !== 'all') params.set('filter_classes', selectedClass);
    if (filters.boards.length) params.set('filter_boards', filters.boards.join(','));
    const qs = params.toString();
    navigate(qs ? `/past-papers?${qs}` : '/past-papers');
  };

  const clearFilters = () => {
    setSelectedSubject('');
    setSelectedClass('');
    setFilters({
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
    });
    setSearchParams({});
    setDisplayedTeachers([]);
    setHasMore(true);
  };

  // Re-focuses the input inside SearchControl, which re-expands it (SearchControl
  // owns its own expand/collapse state; this just triggers the input's onFocus).
  const handleEditSearch = () => {
    searchControlWrapRef.current?.querySelector('input')?.focus();
  };

  // Removes a single value from one of the "More filters" (advanced panel) arrays.
  const removeArrayFilterValue = (
    category: 'subjects' | 'classes' | 'boards' | 'classSize' | 'areas' | 'modeOfTeaching' | 'placeOfTeaching',
    value: string
  ) => {
    setFilters({ ...filters, [category]: filters[category].filter((v) => v !== value) });
  };

  // Chip per selected value from the advanced filter panel (URL params filter_*).
  // Quick-filter subject/class (the two Selects above) and the free-text q are
  // deliberately not represented here — the spec scopes FilterChips to filter_* only.
  const filterChips: FilterChipItem[] = [
    ...filters.subjects.map((v) => ({ key: `subjects:${v}`, label: v, onRemove: () => removeArrayFilterValue('subjects', v) })),
    ...filters.classes.map((v) => ({ key: `classes:${v}`, label: `Class ${v}`, onRemove: () => removeArrayFilterValue('classes', v) })),
    ...filters.boards.map((v) => ({ key: `boards:${v}`, label: v, onRemove: () => removeArrayFilterValue('boards', v) })),
    ...filters.classSize.map((v) => ({ key: `classSize:${v}`, label: v === 'Solo' ? 'One-on-one' : v, onRemove: () => removeArrayFilterValue('classSize', v) })),
    ...filters.areas.map((v) => ({ key: `areas:${v}`, label: v, onRemove: () => removeArrayFilterValue('areas', v) })),
    ...filters.modeOfTeaching.map((v) => ({ key: `modeOfTeaching:${v}`, label: v, onRemove: () => removeArrayFilterValue('modeOfTeaching', v) })),
    ...filters.placeOfTeaching.map((v) => ({ key: `placeOfTeaching:${v}`, label: v, onRemove: () => removeArrayFilterValue('placeOfTeaching', v) })),
    ...(filters.minExperience
      ? [{ key: 'minExperience', label: `${filters.minExperience}+ years`, onRemove: () => setFilters({ ...filters, minExperience: null }) }]
      : []),
  ];

  // Whether the page is showing the unfiltered, un-searched default view — the only
  // context where a "Featured teachers" shelf makes sense (mixing it into an already-
  // filtered/searched result set would be confusing, and would mean re-deriving which
  // featured teachers also match the active filters for no real benefit).
  const isDefaultView = !searchParams.get('q') && !selectedSubject && !selectedClass && filterChips.length === 0;

  // Horizontal shelf source (VISUAL_UPGRADE_PLAN.md / WAVE2_INSPO.md ref 05, the
  // books-app shelf) — real is_featured teachers already in hand from the main fetch,
  // not a separate query or invented data.
  const featuredTeachers = useMemo(() => {
    if (!isDefaultView) return [];
    return teachers.filter((t) => t.is_featured).slice(0, 8);
  }, [teachers, isDefaultView]);

  // Subjects in display order for Browse dropdowns (UI only)
  const sortedSubjectsForDisplay = useMemo(() => {
    return [...subjects].sort((a, b) => {
      const i = SUBJECT_DISPLAY_ORDER.indexOf(a.name);
      const j = SUBJECT_DISPLAY_ORDER.indexOf(b.name);
      const orderA = i === -1 ? 9999 : i;
      const orderB = j === -1 ? 9999 : j;
      return orderA - orderB;
    });
  }, [subjects]);

  // Generate dynamic heading based on filters
  const getHeading = () => {
    // Priority: search query > subject/class/board filters
    if (searchParams.get('q')) {
      return `Search results for "${searchParams.get('q')}"`;
    }

    // Get active filters
    const subjectFromUrl = selectedSubject || null;
    const subjectFromFilters = filters.subjects[0] || null;
    const activeClass = selectedClass || filters.classes[0] || null;
    const activeBoard = filters.boards[0] || null;

    // Find subject name - check URL param first (slug), then advanced filters (direct name)
    let subjectName = null;
    if (subjectFromUrl) {
      const subject = subjects.find(s => s.slug === subjectFromUrl);
      subjectName = subject?.name || subjectFromUrl.charAt(0).toUpperCase() + subjectFromUrl.slice(1);
    } else if (subjectFromFilters) {
      subjectName = subjectFromFilters;
    }

    // Build heading: include board when selected
    const citySuffix = activeBoard ? ` in Kolkata for ${activeBoard}` : ' in Kolkata';
    if (subjectName && activeClass && activeBoard) {
      return `All Class ${activeClass} ${subjectName} teachers${citySuffix}`;
    } else if (subjectName && activeClass) {
      return `All Class ${activeClass} ${subjectName} teachers${citySuffix}`;
    } else if (subjectName && activeBoard) {
      return `All ${subjectName} teachers${citySuffix}`;
    } else if (subjectName) {
      return `All ${subjectName} teachers in Kolkata`;
    } else if (activeClass && activeBoard) {
      return `All Class ${activeClass} teachers${citySuffix}`;
    } else if (activeClass) {
      return `All Class ${activeClass} teachers in Kolkata`;
    } else if (activeBoard) {
      return `All Tuition Teachers in Kolkata for ${activeBoard}`;
    }

    return 'All Tuition Teachers in Kolkata';
  };

  // Page size 24 with an explicit "Load more" button — never infinite scroll (Browse.md).
  const handleLoadMore = () => {
    const pageSize = 24;
    const currentCount = displayedTeachers.length;
    const nextBatch = allTeachersData.slice(currentCount, currentCount + pageSize);
    setDisplayedTeachers((prev) => [...prev, ...nextBatch]);
    setHasMore(currentCount + pageSize < allTeachersData.length);
  };

  // EmptyResults relax options: for each applied filter (the same values FilterChips
  // shows), re-run the last query with that one value dropped and offer the ones that
  // would return results, "Without {value} · {n}", highest count first, max 3
  // (components/EmptyResults.md). Falls back to a single "Clear all filters" option
  // when nothing would relax into results, or when the empty state isn't filter-driven.
  const emptyStateOptions = useMemo(() => {
    const fallback = [{ label: 'Clear all filters', onClick: clearFilters }];
    if (loading || displayedTeachers.length > 0) return fallback;

    const ctx = lastQueryRef.current;
    if (!ctx) return fallback;

    type Category = 'subjects' | 'classes' | 'boards' | 'classSize' | 'areas' | 'modeOfTeaching' | 'placeOfTeaching' | 'minExperience';
    const entries: Array<{ category: Category; value: string; label: string }> = [
      ...filters.subjects.map((v) => ({ category: 'subjects' as const, value: v, label: v })),
      ...filters.classes.map((v) => ({ category: 'classes' as const, value: v, label: `Class ${v}` })),
      ...filters.boards.map((v) => ({ category: 'boards' as const, value: v, label: v })),
      ...filters.classSize.map((v) => ({ category: 'classSize' as const, value: v, label: v === 'Solo' ? 'One-on-one' : v })),
      ...filters.areas.map((v) => ({ category: 'areas' as const, value: v, label: v })),
      ...filters.modeOfTeaching.map((v) => ({ category: 'modeOfTeaching' as const, value: v, label: v })),
      ...filters.placeOfTeaching.map((v) => ({ category: 'placeOfTeaching' as const, value: v, label: v })),
      ...(filters.minExperience
        ? [{ category: 'minExperience' as const, value: filters.minExperience, label: `${filters.minExperience}+ years` }]
        : []),
    ];
    if (entries.length === 0) return fallback;

    const withoutOne = (base: FilterState, category: Category, value: string): FilterState => {
      switch (category) {
        case 'subjects': return { ...base, subjects: base.subjects.filter((v) => v !== value) };
        case 'classes': return { ...base, classes: base.classes.filter((v) => v !== value) };
        case 'boards': return { ...base, boards: base.boards.filter((v) => v !== value) };
        case 'classSize': return { ...base, classSize: base.classSize.filter((v) => v !== value) };
        case 'areas': return { ...base, areas: base.areas.filter((v) => v !== value) };
        case 'modeOfTeaching': return { ...base, modeOfTeaching: base.modeOfTeaching.filter((v) => v !== value) };
        case 'placeOfTeaching': return { ...base, placeOfTeaching: base.placeOfTeaching.filter((v) => v !== value) };
        case 'minExperience': return { ...base, minExperience: null };
        default: return base;
      }
    };

    const scored = entries
      .map((entry) => {
        const without = withoutOne(ctx.effectiveFilters, entry.category, entry.value);
        const n = filterShikshaqRecords(ctx.shikshaqRecords, without).length;
        return { entry, n };
      })
      .filter((s) => s.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 3);

    if (scored.length === 0) return fallback;

    return scored.map(({ entry, n }) => ({
      label: `Without ${entry.label} · ${n}`,
      onClick: () => {
        if (entry.category === 'minExperience') {
          setFilters({ ...filters, minExperience: null });
        } else {
          removeArrayFilterValue(entry.category, entry.value);
        }
      },
    }));
  }, [loading, displayedTeachers.length, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12">
        {/* Gradient hero band — same device PastPapers/PaperResults use, so this
            (the other most-trafficked page in the app) reads as the same product
            instead of a flat white header. Constrained to main's own box rather
            than full viewport bleed — this page's <main> carries the max-w-6xl
            constraint directly (no separate full-width CONTAINER wrapper like
            PastPapers has), and restructuring that for one gradient wasn't worth
            the risk across a 1500-line file with a lot of filter/query logic
            below it. Negative margin brings it flush to main's own edges. */}
        <div className="-mx-4 -mt-4 rounded-b-[32px] bg-gradient-to-b from-brand-blue-subtle to-background px-4 pb-6 pt-4 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pb-8 sm:pt-6 lg:-mx-8 lg:px-8">
          <Link
            to="/"
            className="shikshaq-tap -mt-1.5 mb-3.5 inline-flex min-h-11 items-center py-1 text-sm font-semibold text-warm-meta transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          >
            ← Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-none">{getHeading()}</h1>
          <div className="mt-3 flex items-end justify-between gap-2.5">
            {/* Bold numeric stat callout (WAVE2_INSPO.md ref 05 — the "250 / Top" device),
                replacing the old plain-text count line. Real data, not a placeholder. */}
            <p className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold leading-none tabular-nums text-brand-blue">
                {loading ? '–' : teachers.length}
              </span>
              <span className="text-sm font-medium text-warm-secondary">
                {loading ? 'Loading…' : teachers.length === 1 ? 'teacher matches' : 'teachers match'}
              </span>
            </p>

            {/* HelpCircle anchor for the one-time "see papers instead" nudge. Deliberately placed
                inline in the header row, not floating — Chatbot.tsx already owns a fixed
                bottom-right "Ask AI" button on every page, and a second floating control there
                would collide with/be confused for it. */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => handleSearchModeChange('papers')}
                aria-label="Looking for exam papers instead? See past papers"
                className="shikshaq-tap flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-warm-secondary shadow-border">
                  <HelpCircle size={17} />
                </span>
              </button>
              <Nudge
                id="browse-see-papers"
                message="Looking for exam papers instead? Tap here →"
                onCtaClick={() => handleSearchModeChange('papers')}
                align="right"
              />
            </div>
          </div>

          <div ref={searchControlWrapRef} className="mt-5 max-w-[820px]">
            <SearchControl align="flex-start" stackedToggle initialMode="teachers" onModeChange={handleSearchModeChange} />
          </div>

          {/* Subject quick-picks — colorful, using the site's own strongest visual asset
              (getSubjectPalette, the same tinted system the home page's subject grid uses)
              instead of a plain grey dropdown as the primary way to narrow by subject.
              A first attempt here was just a background gradient, which read as
              imperceptible — this is the actual visible move: real color, on the page,
              not behind it. Default-view only, same gating as the featured shelf below. */}
          {isDefaultView && sortedSubjectsForDisplay.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {sortedSubjectsForDisplay.slice(0, 10).map((subject) => {
                const palette = getSubjectPalette(subject.name);
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectChange(subject.slug)}
                    className="flex min-h-11 items-center rounded-full px-4 text-sm font-bold transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                    style={{ backgroundColor: palette.solid, color: palette.badgeText }}
                  >
                    {subject.name}
                  </button>
                );
              })}
            </div>
          )}

        {/* Featured teachers shelf — horizontal-scroll, drop-shadowed cards on the default
            (unfiltered, un-searched) view only, mirroring the PastPapers.tsx "Recently added"
            shelf pattern for consistency and the books-app shelf reference (ref 05). Real
            is_featured data from the main fetch, not a static/decorative row. */}
        {!loading && featuredTeachers.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold tracking-tight">Featured teachers</h2>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredTeachers.map((teacher) => {
                const allSubjects = teacher.subjects_from_shikshaq || teacher.subjects?.name || '';
                const subjectList = allSubjects ? allSubjects.split(',').map(s => s.trim()).filter(Boolean) : [];
                const firstSubject = subjectList[0] || teacher.subjects?.name || 'Tuition Teacher';
                return (
                  <div key={teacher.id} className="w-[150px] flex-none snap-start sm:w-[170px]">
                    <TeacherCard
                      id={teacher.id}
                      name={teacher.name}
                      slug={teacher.slug}
                      subject={firstSubject}
                      subjectSlug={teacher.subjects?.slug}
                      imageUrl={teacher.image_url ?? undefined}
                      sirMaam={(teacher as { sir_maam?: string | null }).sir_maam ?? null}
                      isFeatured
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
        {/* ^ closes the gradient hero band opened above the "← Home" link */}

        {/* Structured filters (subject/class quick-pick + the advanced FilterPanel dialog)
            aren't part of the literal Browse.md mockup — that only models the applied-filter
            row below — but they're the only way to set board/class-size/mode/area/fees/
            experience filters at all, so they stay. Sized to the 44px touch-target rule. */}
        <div className="mt-5">
          {/* flex-nowrap + flex-1/min-w-0 selects so this genuinely fits on one line down to a
              375px viewport instead of just wrapping onto a second line — the fixed w-[150px]/
              w-[130px] triggers used to overflow narrow screens. Selects revert to their original
              fixed desktop widths at sm+; the "More filters" button never shrinks (shrink-0) so
              its active-count badge stays legible, and the two selects give way to it first. */}
          <div className="flex flex-nowrap items-center gap-2">
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="h-11 text-sm flex-1 min-w-0 sm:flex-none sm:w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {sortedSubjectsForDisplay.map((subject) => (
                  <SelectItem key={subject.id} value={subject.slug}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="h-11 text-sm flex-1 min-w-0 sm:flex-none sm:w-[130px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls === 'UG' ? 'UG' : `Class ${cls}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setFilterPanelOpen(true)}
              className="shikshaq-outline-btn shrink-0 flex items-center gap-1.5 sm:gap-[7px] min-h-11 px-2.5 sm:px-[15px] py-2 rounded-lg text-xs sm:text-[13px] font-semibold text-foreground shadow-border transition-colors duration-150"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">More filters</span>
              {(filters.subjects.length > 0 || filters.classes.length > 0 ||
                filters.boards.length > 0 || filters.classSize.length > 0 ||
                filters.areas.length > 0 || filters.modeOfTeaching.length > 0 ||
                filters.placeOfTeaching.length > 0 || filters.minExperience != null) && (
                <span className="rounded-full bg-brand px-[7px] py-px text-[11px] font-bold text-foreground">
                  {filters.subjects.length + filters.classes.length + filters.boards.length +
                   filters.classSize.length + filters.areas.length + filters.modeOfTeaching.length +
                   filters.placeOfTeaching.length + (filters.minExperience != null ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* FilterChips row: margin:20px 0 8px, carry line below at margin-bottom:22px (Browse.md item 5) */}
        <FilterChips
          mode="teachers"
          chips={filterChips}
          onClearAll={clearFilters}
          onEditSearch={handleEditSearch}
          handoff={{ label: 'See papers with these filters →', onClick: () => handleSearchModeChange('papers') }}
          carryOverNote="Subject, class and board carry over. Area does not apply to papers."
          className="mt-5 mb-[22px]"
        />

        {/* Teachers List */}
        {loading ? (
          <TeacherCardSkeletons count={8} />
        ) : displayedTeachers.length > 0 ? (
          <div>
            <div className="shikshaq-teacher-grid animate-card-reveal">
              {displayedTeachers.map((teacher) => {
                // Prefer subjects_from_shikshaq; on browse page limit to 5 subjects (profile page shows all)
                const allSubjects = teacher.subjects_from_shikshaq || teacher.subjects?.name || '';
                const subjectList = allSubjects ? allSubjects.split(',').map(s => s.trim()).filter(Boolean) : [];
                const firstSubject = subjectList[0] || teacher.subjects?.name || 'Tuition Teacher';
                const area = (teacher as { area?: string | null }).area ?? null;
                const firstArea = area ? area.split(',').map((a) => a.trim()).filter(Boolean)[0] : null;
                const meta = [teacher.classes_taught, firstArea].filter(Boolean).join(' · ');

                return (
                  <TeacherCard
                    key={teacher.id}
                    id={teacher.id}
                    name={teacher.name}
                    slug={teacher.slug}
                    subject={firstSubject}
                    subjectSlug={teacher.subjects?.slug}
                    imageUrl={teacher.image_url ?? undefined}
                    sirMaam={(teacher as { sir_maam?: string | null }).sir_maam ?? null}
                    meta={meta || undefined}
                    isFeatured={!!teacher.is_featured}
                    size="sm"
                  />
                );
              })}
            </div>

            {/* Page size 24, explicit "Load more" — never infinite scroll (Browse.md "Data"). */}
            {hasMore && (
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="shikshaq-outline-btn inline-flex min-h-12 items-center justify-center rounded-lg bg-card px-[22px] py-3.5 text-sm font-semibold text-foreground shadow-border transition-colors duration-150"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmptyResults
            heading="No teachers match all of those filters yet"
            message="Try relaxing the most restrictive one. These are the nearest sets we have."
            options={emptyStateOptions}
          />
        )}
      </main>

      <FilterPanel
        open={filterPanelOpen}
        onOpenChange={setFilterPanelOpen}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={() => {
          setFilters({
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
          });
        }}
      />

      <Footer />

      {/* These buttons/tiles declared transitions but had nothing hover-driven to
          transition to on a desktop pointer — same gap fixed on Home/Past papers. */}
      <style>{`
        @media (hover: hover) {
          .shikshaq-outline-btn:hover { background-color: hsl(var(--muted)); }
        }
        /* Tap feedback (unconditional, not hover-gated) — matches the
           active:scale-[0.97] convention used elsewhere. */
        .shikshaq-outline-btn:active { transform: scale(0.97); }

        /* Teacher card grid — explicit 2-column layout below 640px (rather than relying on
           auto-fill minmax math, which can collapse to a single column on narrow phones) so
           mobile genuinely gets a compact 2-up grid of size='sm' cards. Reverts to the original
           auto-fill minmax(220px,1fr) desktop/tablet layout at sm+. */
        .shikshaq-teacher-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .shikshaq-teacher-grid {
            gap: 18px;
            grid-template-columns: repeat(auto-fill, minmax(220px,1fr));
          }
        }
      `}</style>
    </div>
  );
}
