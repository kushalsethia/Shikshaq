import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { TeacherCardDetailed, type TeacherCardDetailedProps } from '@/components/TeacherCardDetailed';
import { TeacherCard } from '@/components/TeacherCard';
import { Footer } from '@/components/Footer';
import { FilterPanel, FilterState } from '@/components/FilterPanel';
import { SlidersHorizontal, X } from 'lucide-react';
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
import { useLikes } from '@/lib/likes-context';
import { getCache, setCache, CACHE_TTL, getTeachersListCacheKey, getShikshaqmineChunkCacheKey, clearExpiredCache } from '@/utils/cache';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';


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
}

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface FeaturedTeacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subjects: { name: string; slug: string } | null;
  sir_maam?: string | null;
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
 * Loading placeholder that mirrors TeacherCardDetailed's geometry (rounded-2xl p-1.5
 * shell, w-32 md:w-40 aspect-[3/4] image) so the list doesn't jump when results land.
 */
function TeacherCardSkeletons({ count }: { count: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3 bg-card rounded-2xl p-1.5 border border-border">
          <div className="w-32 md:w-40 flex-shrink-0 self-start aspect-[3/4] bg-muted rounded-[10px]" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
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
  const [isSearchBarScrolled, setIsSearchBarScrolled] = useState(false);
  const [featuredTeachers, setFeaturedTeachers] = useState<FeaturedTeacher[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const { isLiked } = useLikes();
  
  // Ref to track if we're updating URL ourselves (to prevent circular updates)
  const isUpdatingUrlRef = useRef(false);
  // Ref to track loading timeout
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to debounce filter-driven refetches
  const fetchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Refs for floating search bar
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchBarElementRef = useRef<HTMLDivElement>(null);

  const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

  useEffect(() => {
    // Canonical is handled globally by <CanonicalTag>.
    if (!manageSeo) return;

    document.title = 'All Tuition Teachers in Kolkata | Shikshaq';
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDesc) metaDesc.setAttribute('content', 'Browse all verified tuition teachers in Kolkata. Filter by subject, class, board, area, mode of teaching, and fees. Free to use — connect directly with local tutors.');
    return () => {
      document.title = 'Shikshaq - Find Tuition Teachers in Kolkata';
      if (metaDesc) metaDesc.setAttribute('content', 'Find verified tuition teachers in Kolkata for free. Search by subject, class, board, and area. Connect directly with local tutors for CBSE, ICSE, IGCSE, IB, State Board — no commission, no middlemen.');
    };
  }, [manageSeo]);

  useEffect(() => {
    async function fetchSubjects() {
      // Check cache first
      const cacheKey = 'subjects';
      const cached = getCache(cacheKey);
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

    const urlFilters = {
      subjects: parseArrayParam(searchParams.get('filter_subjects')),
      classes: parseArrayParam(searchParams.get('filter_classes')),
      boards: parseArrayParam(searchParams.get('filter_boards')),
      classSize: parseArrayParam(searchParams.get('filter_classSize')),
      areas: parseArrayParam(searchParams.get('filter_areas')),
      modeOfTeaching: parseArrayParam(searchParams.get('filter_modeOfTeaching')),
      placeOfTeaching: parseArrayParam(searchParams.get('filter_placeOfTeaching')),
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
            .select('id, name, slug, image_url, bio, location, subjects(name, slug)')
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
              
              const result = await supabase
                .from('Shikshaqmine')
                .select('*')
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
        const urlFilters = {
          subjects: parseArrayParam(searchParams.get('filter_subjects')),
          classes: parseArrayParam(searchParams.get('filter_classes')),
          boards: parseArrayParam(searchParams.get('filter_boards')),
          classSize: parseArrayParam(searchParams.get('filter_classSize')),
          areas: parseArrayParam(searchParams.get('filter_areas')),
          modeOfTeaching: parseArrayParam(searchParams.get('filter_modeOfTeaching')),
          placeOfTeaching: parseArrayParam(searchParams.get('filter_placeOfTeaching')),
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
          
          // Pre-compute lowercase filter values once (outside loop for performance)
          const subjectFiltersLower = effectiveFilters.subjects.map(s => s.toLowerCase());
          const classFiltersLower = effectiveFilters.classes.map(c => c.toLowerCase());
          const boardFiltersLower = effectiveFilters.boards.map(b => b.toLowerCase());
          const classSizeFiltersLower = effectiveFilters.classSize.map(s => s.toLowerCase());
          const areaFiltersLower = effectiveFilters.areas.map(a => a.toLowerCase());
          const modeFiltersLower = effectiveFilters.modeOfTeaching.map(m => m.toLowerCase());
          const placeFiltersLower = effectiveFilters.placeOfTeaching.map(p => p.toLowerCase());
          
          const matchingSlugs = recordsToFilter
            .filter((record: any) => {
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
            })
            .map((record: any) => record.Slug);

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

        // Store all teachers
        setAllTeachersData(enrichedTeachers);
        // Show first 20 teachers initially for infinite scroll
        const initialDisplay = 20;
        setDisplayedTeachers(enrichedTeachers.slice(0, initialDisplay));
        setTeachers(enrichedTeachers); // Keep for count display
        setHasMore(enrichedTeachers.length > initialDisplay);
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

  // Fetch featured teachers for bottom section
  useEffect(() => {
    async function fetchFeaturedTeachers() {
      try {
        setFeaturedLoading(true);

        // Check cache for featured teachers
        const cacheKey = 'featured_teachers_browse';
        const cached = getCache<any[]>(cacheKey);
        if (cached) {
          setFeaturedTeachers(cached);
          setFeaturedLoading(false);
          return;
        }

        // Use the view to get top teachers efficiently
        const { data: upvoteStats } = await supabase
          .from('teacher_upvote_stats')
          .select('teacher_id')
          .order('upvote_count', { ascending: false })
          .limit(16);

        let teachersData: any[] = [];

        if (upvoteStats && upvoteStats.length > 0) {
          const topTeacherIds = upvoteStats.map((stat: any) => stat.teacher_id);

          if (topTeacherIds.length > 0) {
            const { data: topTeachers } = await supabase
              .from('teachers_list')
              .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
              .in('id', topTeacherIds);

            if (topTeachers) {
              const teacherMap = new Map(topTeachers.map((t: any) => [t.id, t]));
              teachersData = topTeacherIds
                .map(id => teacherMap.get(id))
                .filter(Boolean) as any[];
            }
          }
        }

        // If we have less than 16 teachers, fill with random teachers
        if (teachersData.length < 16) {
          const existingIds = new Set(teachersData.map((t: any) => t.id));
          const { data: allTeachers } = await supabase
            .from('teachers_list')
            .select('id, name, slug, image_url, subject_id, subjects(name, slug)')
            .limit(100);

          if (allTeachers && allTeachers.length > 0) {
            const availableTeachers = allTeachers.filter((t: any) => !existingIds.has(t.id));
            const shuffled = [...availableTeachers].sort(() => Math.random() - 0.5);
            const needed = 16 - teachersData.length;
            teachersData = [...teachersData, ...shuffled.slice(0, needed)];
          }
        }

        // Fetch Sir/Ma'am and Subjects data from Shikshaqmine table
        let sirMaamMap = new Map();
        const subjectsMap = new Map<string, string>();
        if (teachersData.length > 0) {
          const teacherSlugs = teachersData.map((t: any) => t.slug).filter(Boolean);
          if (teacherSlugs.length > 0) {
            const { data: shikshaqData } = await supabase
              .from('Shikshaqmine')
              .select('*')
              .in('Slug', teacherSlugs);

            if (shikshaqData) {
              shikshaqData.forEach((record: any) => {
                sirMaamMap.set(record.Slug, record["Sir/Ma'am?"]);
                if (record.Subjects) {
                  const firstSubject = record.Subjects.split(',')[0].trim();
                  if (firstSubject) {
                    subjectsMap.set(record.Slug, firstSubject);
                  }
                }
              });
            }
          }
        }

        // Process teachers data
        if (teachersData.length > 0) {
          const processedTeachers = teachersData.map((teacher: any) => {
            if (!teacher.subjects) {
              const firstSubjectName = subjectsMap.get(teacher.slug);
              if (firstSubjectName) {
                const matchingSubject = subjects.find((s: any) =>
                  s.name.toLowerCase() === firstSubjectName.toLowerCase()
                );
                if (matchingSubject) {
                  teacher.subjects = { name: matchingSubject.name, slug: matchingSubject.slug };
                } else {
                  teacher.subjects = {
                    name: firstSubjectName,
                    slug: firstSubjectName.toLowerCase().replace(/\s+/g, '-')
                  };
                }
              }
            }

            return {
              ...teacher,
              sir_maam: sirMaamMap.get(teacher.slug) || null
            };
          });

          setFeaturedTeachers(processedTeachers);
          setCache(cacheKey, processedTeachers, CACHE_TTL.FEATURED_TEACHERS);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching featured teachers:', error);
        }
      } finally {
        setFeaturedLoading(false);
      }
    }

    fetchFeaturedTeachers();
  }, []);

  // Handle scroll detection for making search bar sticky
  useEffect(() => {
    const handleScroll = () => {
      if (!searchBarRef.current) return;
      
      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      // Show sticky bar when original search bar is scrolled past
      // Once shown, keep it visible until we're back near the top
      const threshold = window.innerWidth < 768 ? 200 : 100;
      const scrollY = window.scrollY;
      
      // Show sticky bar if original is scrolled past OR if we're scrolled down significantly
      // Hide only when we're back near the top (scrollY < 100) so original is visible
      if (scrollY < 100) {
        setIsSearchBarScrolled(false);
      } else if (searchBarRect.top < threshold) {
        setIsSearchBarScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    const initialCheck = () => {
      if (!searchBarRef.current) return;
      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      const threshold = window.innerWidth < 768 ? 200 : 100;
      const scrollY = window.scrollY;
      
      if (scrollY < 100) {
        setIsSearchBarScrolled(false);
      } else if (searchBarRect.top < threshold) {
        setIsSearchBarScrolled(true);
      }
    };
    initialCheck();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      minExperience: null,
    });
    setSearchParams({});
    setDisplayedTeachers([]);
    setHasMore(true);
  };

  const hasFilters = searchParams.get('subject') || searchParams.get('class') || searchParams.get('q') ||
    filters.subjects.length > 0 || filters.classes.length > 0 ||
    filters.boards.length > 0 || filters.classSize.length > 0 ||
    filters.areas.length > 0 || filters.modeOfTeaching.length > 0 ||
    filters.placeOfTeaching.length > 0 || filters.minExperience != null;

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

  // Infinite scroll handler
  useEffect(() => {
    if (!hasMore || loading || allTeachersData.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Load next batch of 20 teachers
          const currentCount = displayedTeachers.length;
          const nextBatch = allTeachersData.slice(currentCount, currentCount + 20);
          
          if (nextBatch.length > 0) {
            setDisplayedTeachers((prev) => [...prev, ...nextBatch]);
            setHasMore(currentCount + 20 < allTeachersData.length);
          } else {
            setHasMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    const trigger = document.getElementById('scroll-trigger');
    if (trigger) {
      observer.observe(trigger);
    }

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [hasMore, loading, allTeachersData, displayedTeachers.length]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-6 sm:pt-[120px] pb-8 md:pt-8">
        {/* Search and Filters */}
        <div ref={searchBarRef} className="mb-3 sm:mb-4">
          {/* Search Bar and Filter Button - Same Row on Mobile, Search + Advanced Filters on Desktop */}
          <div className="flex items-center sm:items-stretch gap-2 mb-3 sm:mb-4">
            <div ref={searchBarElementRef} className="flex-1">
              <SearchBar showGlow={false} />
            </div>

            {/* Small Filter Button - Mobile */}
            <Button
              onClick={() => setFilterPanelOpen(true)}
              variant="secondary"
              className="h-14 sm:hidden w-auto px-3 flex-shrink-0 relative gap-1.5 transition-transform active:scale-[0.96]"
            >
              <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-sm whitespace-nowrap">Filters</span>
              {(filters.subjects.length > 0 || filters.classes.length > 0 ||
                filters.boards.length > 0 || filters.classSize.length > 0 ||
                filters.areas.length > 0 || filters.modeOfTeaching.length > 0 ||
                filters.placeOfTeaching.length > 0 || filters.minExperience != null) && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm tabular-nums">
                  {filters.subjects.length + filters.classes.length + filters.boards.length +
                   filters.classSize.length + filters.areas.length + filters.modeOfTeaching.length +
                   filters.placeOfTeaching.length + (filters.minExperience != null ? 1 : 0)}
                </span>
              )}
            </Button>

            {/* Filters Button - Desktop, beside search bar */}
            <Button
              onClick={() => setFilterPanelOpen(true)}
              variant="secondary"
              className="hidden sm:flex gap-2 h-auto px-4 py-2.5 flex-shrink-0 font-medium transition-transform active:scale-[0.96]"
            >
              <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Filters</span>
              {(filters.subjects.length > 0 || filters.classes.length > 0 ||
                filters.boards.length > 0 || filters.classSize.length > 0 ||
                filters.areas.length > 0 || filters.modeOfTeaching.length > 0 ||
                filters.placeOfTeaching.length > 0 || filters.minExperience != null) && (
                <span className="ml-1 px-2.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full font-bold shadow-sm tabular-nums">
                  {filters.subjects.length + filters.classes.length + filters.boards.length +
                   filters.classSize.length + filters.areas.length + filters.modeOfTeaching.length +
                   filters.placeOfTeaching.length + (filters.minExperience != null ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {/* Subject and Class Filters - Mobile: One row */}
          <div className="flex items-center gap-2 sm:hidden mb-3">
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="flex-1 h-10 text-sm">
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
              <SelectTrigger className="flex-1 h-10 text-sm">
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
          </div>

          {/* Clear filters - Mobile only, just under class filter */}
          {hasFilters && (
            <div className="sm:hidden mb-3">
              <Button variant="ghost" onClick={clearFilters} className="gap-1.5 h-10 text-muted-foreground active:scale-[0.96] transition-transform">
                <X className="w-4 h-4" />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Sticky Search Bar - Only visible when scrolled past original */}
        {isSearchBarScrolled && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 py-3 transition-[opacity] duration-300 ease-in-out">
            <div className="container mx-auto px-4">
              <div className="w-full">
                <SearchBar showGlow={false} />
              </div>
            </div>
          </div>
        )}

        {/* Results Header with Desktop Subject/Class dropdowns inline */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h1 className="text-2xl font-sans text-foreground tracking-tight">
                {getHeading()}
              </h1>
              <p className="text-muted-foreground mt-1">
                {loading ? 'Loading...' : <><span className="tabular-nums">{teachers.length}</span> teachers found</>}
              </p>
            </div>

            {/* Desktop Subject/Class dropdowns - inline with heading */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-[160px]">
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
                <SelectTrigger className="w-[160px]">
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

              {hasFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-1 active:scale-[0.96] transition-transform">
                  <X className="w-4 h-4" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Teachers List */}
        {loading ? (
          // Check if this is initial page load (no teachers loaded yet)
          displayedTeachers.length === 0 && allTeachersData.length === 0 ? (
            // Show card skeletons for initial page load
            <TeacherCardSkeletons count={6} />
          ) : hasFilters ? (
            // Show card skeletons while filters are being applied
            <TeacherCardSkeletons count={5} />
          ) : (
            // Show skeleton loaders when loading more (has some teachers already)
            <TeacherCardSkeletons count={5} />
          )
        ) : displayedTeachers.length > 0 ? (
          <div className="space-y-4">
            {displayedTeachers.map((teacher, index) => {
              // Prefer subjects_from_shikshaq; on browse page limit to 5 subjects (profile page shows all)
              const allSubjects = teacher.subjects_from_shikshaq || teacher.subjects?.name || '';
              const displaySubjects = allSubjects
                ? allSubjects.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5).join(', ')
                : '';

              const cardProps: TeacherCardDetailedProps = {
                id: teacher.id,
                name: teacher.name,
                slug: teacher.slug,
                imageUrl: teacher.image_url ?? undefined,
                subjects: displaySubjects,
                classes: teacher.classes_taught ?? undefined,
                area: (teacher as { area?: string | null }).area ?? null,
                sirMaam: (teacher as { sir_maam?: string | null }).sir_maam ?? null,
                index,
                returnToBrowseUrl,
              };
              return <TeacherCardDetailed key={teacher.id} {...cardProps} />;
            })}
            
            {/* Infinite scroll loading indicator */}
            {hasMore && (
              <div id="scroll-trigger">
                <TeacherCardSkeletons count={2} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-sans text-foreground mb-2">No teachers found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} variant="outline" className="transition-transform active:scale-[0.96]">
              Clear all filters
            </Button>
          </div>
        )}

        {/* Featured Teachers Section */}
        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-sans font-bold text-foreground mb-6 sm:mb-8">More tuition teachers you can explore on Shikshaq</h2>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted rounded-2xl" />
                  <div className="mt-3 h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : featuredTeachers.length > 0 ? (
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  dragFree: true,
                  containScroll: "trimSnaps",
                  slidesToScroll: "auto",
                  watchDrag: true,
                }}
                className="w-full overflow-visible"
              >
                <CarouselContent className="-ml-2 md:-ml-4 pr-2 md:pr-0">
                  {featuredTeachers.map((teacher) => (
                    <CarouselItem
                      key={teacher.id}
                      className="pl-2 md:pl-4 basis-[45vw] md:basis-1/3 lg:basis-1/4 xl:basis-1/6 flex-shrink-0"
                    >
                      <TeacherCard
                        id={teacher.id}
                        name={teacher.name}
                        slug={teacher.slug}
                        subject={teacher.subjects?.name || 'Tuition Teacher'}
                        subjectSlug={teacher.subjects?.slug}
                        imageUrl={teacher.image_url}
                        isFeatured={true}
                        showShareOnMobile={false}
                        sirMaam={teacher.sir_maam}
                        isLiked={isLiked(teacher.id)}
                        hideFavourite={true}
                        hideShare={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ) : null}
        </section>

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
            minExperience: null,
          });
        }}
      />

      <Footer />
    </div>
  );
}
