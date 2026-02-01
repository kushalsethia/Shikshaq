import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { TeacherCardDetailed } from '@/components/TeacherCardDetailed';
import { TeacherCard } from '@/components/TeacherCard';
import { Footer } from '@/components/Footer';
import { FilterPanel, FilterState } from '@/components/FilterPanel';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { extractFiltersFromQuery, extractNameFromQuery } from '@/utils/searchKeywordExtractor';
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

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user has a role - redirect to role selection if not
  useEffect(() => {
    const checkUserRole = async () => {
      if (authLoading) return;
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile || !profile.role) {
          navigate('/select-role', { replace: true });
        }
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);
  
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
  const [filters, setFilters] = useState<FilterState>(() => ({
    subjects: parseArrayParam(searchParams.get('filter_subjects')),
    classes: parseArrayParam(searchParams.get('filter_classes')),
    boards: parseArrayParam(searchParams.get('filter_boards')),
    classSize: parseArrayParam(searchParams.get('filter_classSize')),
    areas: parseArrayParam(searchParams.get('filter_areas')),
    modeOfTeaching: parseArrayParam(searchParams.get('filter_modeOfTeaching')),
  }));
  const [featuredTeachers, setFeaturedTeachers] = useState<FeaturedTeacher[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [displayedTeachers, setDisplayedTeachers] = useState<Teacher[]>([]);
  const [allTeachersData, setAllTeachersData] = useState<Teacher[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isSearchBarScrolled, setIsSearchBarScrolled] = useState(false);
  const { isLiked } = useLikes();
  
  // Ref to track if we're updating URL ourselves (to prevent circular updates)
  const isUpdatingUrlRef = useRef(false);
  // Ref to track loading timeout
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Refs for floating search bar
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchBarElementRef = useRef<HTMLDivElement>(null);

  const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

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
    };

    // Extract filters from search query (q parameter)
    const searchQuery = searchParams.get('q');
    let extractedFilters: Partial<FilterState> = {};
    if (searchQuery && searchQuery.trim().length >= 2) {
      extractedFilters = extractFiltersFromQuery(searchQuery);
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
    };

    // Only update if filters actually differ (prevent unnecessary updates)
    // Sort arrays before comparing to handle order differences
    const filtersChanged = 
      JSON.stringify([...mergedFilters.subjects].sort()) !== JSON.stringify([...filters.subjects].sort()) ||
      JSON.stringify([...mergedFilters.classes].sort()) !== JSON.stringify([...filters.classes].sort()) ||
      JSON.stringify([...mergedFilters.boards].sort()) !== JSON.stringify([...filters.boards].sort()) ||
      JSON.stringify([...mergedFilters.classSize].sort()) !== JSON.stringify([...filters.classSize].sort()) ||
      JSON.stringify([...mergedFilters.areas].sort()) !== JSON.stringify([...filters.areas].sort()) ||
      JSON.stringify([...mergedFilters.modeOfTeaching].sort()) !== JSON.stringify([...filters.modeOfTeaching].sort());

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
          filters.areas.length > 0 || filters.modeOfTeaching.length > 0;

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

        // Fetch Shikshaqmine data for filtering and enrichment (always fetch to show all subjects/classes in cards)
        // Previously only fetched when filters/search were active, causing cards to only show one subject
        let allShikshaqData = null;
        if (teachersData && teachersData.length > 0) {
          const teacherSlugs = teachersData.map(t => t.slug);
          
          // Optimize: For preset filters only (no search query), we can potentially filter at DB level
          // But for now, we still need to fetch all and filter in JS due to complex matching logic
          // However, we can optimize chunk size for faster parallel fetching
          const chunkSize = 50; // Smaller chunks = faster parallel requests
          const chunks = [];
          for (let i = 0; i < teacherSlugs.length; i += chunkSize) {
            chunks.push(teacherSlugs.slice(i, i + chunkSize));
          }
          
          // Fetch data in parallel chunks - only fetch needed columns
          // Note: This fetches all Shikshaqmine data because filtering logic is complex (includes() checks)
          // Check cache for each chunk first
          const shikshaqPromises = chunks.map(async (chunk) => {
            const cacheKey = getShikshaqmineChunkCacheKey(chunk);
            const cached = getCache<any[]>(cacheKey);
            if (cached) {
              return { data: cached, error: null };
            }
            
            // Fetch from API if not in cache
            const result = await supabase
              .from('Shikshaqmine')
              .select('Slug, Subjects, "Classes Taught", "Classes Taught for Backend", Area, "AREAS FOR FILTERING", "Mode of Teaching", "School Boards Catered", "Class Size (Group/ Solo)", "Sir/Ma\'am?"')
              .in('Slug', chunk);
            
            // Cache the result if successful
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
            urlFilters.areas.length > 0 || urlFilters.modeOfTeaching.length > 0;

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
        };

        // Extract filters from search query if present (apply immediately, don't wait for state update)
        // If there's a search query, REPLACE all filters with extracted ones (clear previous search)
        let extractedFilters: Partial<FilterState> = {};
          if (searchQuery && searchQuery.trim().length >= 2) {
          extractedFilters = extractFiltersFromQuery(searchQuery);
          // Replace all filters with extracted ones (don't merge with previous search)
          effectiveFilters = {
            subjects: extractedFilters.subjects || [],
            classes: extractedFilters.classes || [],
            boards: extractedFilters.boards || [],
            classSize: extractedFilters.classSize || [],
            areas: extractedFilters.areas || [],
            modeOfTeaching: extractedFilters.modeOfTeaching || [],
          };
        }

        // Check if we have any active filters after extraction
        const hasActiveFiltersAfterExtraction = 
          effectiveFilters.subjects.length > 0 || 
          effectiveFilters.classes.length > 0 ||
          effectiveFilters.boards.length > 0 || 
          effectiveFilters.classSize.length > 0 || 
          effectiveFilters.areas.length > 0 || 
          effectiveFilters.modeOfTeaching.length > 0;

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
            namePart = extractNameFromQuery(searchQuery, extractedFilters);
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
          
          const matchingSlugs = recordsToFilter
            .filter((record: any) => {
              // Pre-compute lowercase values for this record once (inside loop but before checks)
              const subjects = (record.Subjects || '').toLowerCase();
              const classesBackend = (record["Classes Taught for Backend"] || '').toLowerCase();
              const classesDisplay = (record["Classes Taught"] || '').toLowerCase();
              const boards = (record["School Boards Catered"] || '').toLowerCase();
              const classSize = (record["Class Size (Group/ Solo)"] || '').toLowerCase();
              const areaData = (record.Area || record["AREAS FOR FILTERING"] || '').toLowerCase();
              const mode = (record["Mode of Teaching"] || '').toLowerCase();

              // Check subjects (includes both dropdown and advanced filter selections)
              if (effectiveFilters.subjects.length > 0) {
                const hasSubject = subjectFiltersLower.some(subjLower => {
                  // Handle "Accountancy" matching "Accounts" in database for backward compatibility
                  if (subjLower === 'accountancy') {
                    return subjects.includes('accountancy') || subjects.includes('accounts');
                  }
                  return subjects.includes(subjLower);
                });
                if (!hasSubject) {
                  return false;
                }
              }

              // Check classes - optimized with pre-computed values
              if (effectiveFilters.classes.length > 0) {
                const hasClass = classFiltersLower.some(classLower => {
                  // Check backend column (numeric values like "5,6,7,8")
                  if (classesBackend) {
                    const backendClasses = classesBackend.split(',').map(c => c.trim());
                    if (backendClasses.includes(classLower)) {
                      return true;
                    }
                  }
                  
                  // Fallback to display column (handles ranges like "Class V - X" or "Class 5-10")
                  if (classesDisplay) {
                    return classesDisplay.includes(classLower) || 
                           classesDisplay.includes(`class ${classLower}`) ||
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

              // Check boards - optimized
              if (effectiveFilters.boards.length > 0) {
                const hasBoard = boardFiltersLower.some(boardLower => 
                  boards.includes(boardLower)
                );
                if (!hasBoard) {
                  return false;
                }
              }

              // Check class size - optimized
              if (effectiveFilters.classSize.length > 0) {
                const hasSize = classSizeFiltersLower.some(sizeLower => 
                  classSize.includes(sizeLower)
                );
                if (!hasSize) {
                  return false;
                }
              }

              // Check areas - optimized
              if (effectiveFilters.areas.length > 0) {
                const hasArea = areaFiltersLower.some(areaLower => 
                  areaData.includes(areaLower)
                );
                if (!hasArea) {
                  return false;
                }
              }

              // Check mode of teaching - optimized
              if (effectiveFilters.modeOfTeaching.length > 0) {
                const hasMode = modeFiltersLower.some(modeLower => 
                  mode.includes(modeLower) || 
                  mode.includes(modeLower + ' /') ||
                  mode.includes('/ ' + modeLower) ||
                  mode.includes(modeLower + '/')
                );
                if (!hasMode) {
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

    fetchTeachers();
    
    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [searchParams, subjects]); // Remove filters from deps - filters are already in searchParams

  // Fetch featured teachers for "Other recommended" section - only when needed
  useEffect(() => {
    // Only fetch if we have search results or search query
    const shouldFetchFeatured = searchParams.get('q') || teachers.length > 0;
    if (!shouldFetchFeatured) {
      setFeaturedLoading(false);
      setFeaturedTeachers([]);
      return;
    }

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
              // Sort teachers to match upvote order
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
        const subjectsMap = new Map<string, string>(); // slug -> first subject name
        if (teachersData.length > 0) {
          const teacherSlugs = teachersData.map((t: any) => t.slug);
          const { data: shikshaqData } = await supabase
            .from('Shikshaqmine')
            .select('Slug, "Sir/Ma\'am?", Subjects')
            .in('Slug', teacherSlugs);
          
          if (shikshaqData) {
            shikshaqData.forEach((record: any) => {
              sirMaamMap.set(record.Slug, record["Sir/Ma'am?"]);
              // Extract first subject from comma-separated Subjects field
              if (record.Subjects) {
                const firstSubject = record.Subjects.split(',')[0].trim();
                if (firstSubject) {
                  subjectsMap.set(record.Slug, firstSubject);
                }
              }
            });
          }
        }

        // Process teachers data - add subjects from Shikshaqmine if missing
        if (teachersData.length > 0) {
          const processedTeachers = teachersData.map((teacher: any) => {
            // If no subject from relationship, try to get from Shikshaqmine
            if (!teacher.subjects) {
              const firstSubjectName = subjectsMap.get(teacher.slug);
              if (firstSubjectName) {
                // Try to find matching subject in subjects table
                const matchingSubject = subjects.find((s: any) => 
                  s.name.toLowerCase() === firstSubjectName.toLowerCase()
                );
                if (matchingSubject) {
                  teacher.subjects = { name: matchingSubject.name, slug: matchingSubject.slug };
                } else {
                  // If no match found, use the name from Shikshaqmine directly
                  teacher.subjects = { 
                    name: firstSubjectName, 
                    slug: firstSubjectName.toLowerCase().replace(/\s+/g, '-') 
                  };
                }
              }
            }
            
            // Add Sir/Ma'am data
            return {
              ...teacher,
              sir_maam: sirMaamMap.get(teacher.slug) || null
            };
          });

          setFeaturedTeachers(processedTeachers);
          // Cache featured teachers
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
  }, [searchParams.get('q'), teachers.length]);

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
    });
    setSearchParams({});
    setDisplayedTeachers([]);
    setHasMore(true);
  };

  const hasFilters = searchParams.get('subject') || searchParams.get('class') || searchParams.get('q') ||
    filters.subjects.length > 0 || filters.classes.length > 0 ||
    filters.boards.length > 0 || filters.classSize.length > 0 ||
    filters.areas.length > 0 || filters.modeOfTeaching.length > 0;

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
      // Subject from URL is a slug, need to look it up
      const subject = subjects.find(s => s.slug === subjectFromUrl);
      subjectName = subject?.name || subjectFromUrl.charAt(0).toUpperCase() + subjectFromUrl.slice(1);
    } else if (subjectFromFilters) {
      // Subject from advanced filters is already a name
      subjectName = subjectFromFilters;
    }

    // Build heading based on filters
    if (subjectName && activeClass && activeBoard) {
      return `All Class ${activeClass} ${subjectName} teachers in Kolkata for ${activeBoard}`;
    } else if (subjectName && activeClass) {
      return `All Class ${activeClass} ${subjectName} teachers in Kolkata`;
    } else if (subjectName) {
      return `All ${subjectName} teachers in Kolkata`;
    }

    // Default heading
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
          {/* Search Bar and Filter Button - Same Row on Mobile */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 sm:flex-col">
            <div ref={searchBarElementRef} className="flex-1 sm:w-full">
              <SearchBar />
            </div>
            
            {/* Small Filter Button - Mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterPanelOpen(true)}
              className="h-9 sm:hidden w-9 p-0 flex-shrink-0 relative"
            >
              <Filter className="w-4 h-4" />
              {(filters.subjects.length > 0 || filters.classes.length > 0 ||
                filters.boards.length > 0 || filters.classSize.length > 0 ||
                filters.areas.length > 0 || filters.modeOfTeaching.length > 0) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[8px]">
                  {filters.subjects.length + filters.classes.length + filters.boards.length +
                   filters.classSize.length + filters.areas.length + filters.modeOfTeaching.length}
                </span>
              )}
            </Button>
          </div>

          {/* Subject and Class Filters - Mobile: One row */}
          <div className="flex items-center gap-2 sm:hidden mb-3">
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.slug}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
            </div>

            <Button
              variant="outline"
              onClick={() => setFilterPanelOpen(true)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {(filters.subjects.length > 0 || filters.classes.length > 0 ||
                filters.boards.length > 0 || filters.classSize.length > 0 ||
                filters.areas.length > 0 || filters.modeOfTeaching.length > 0) && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {filters.subjects.length + filters.classes.length + filters.boards.length +
                   filters.classSize.length + filters.areas.length + filters.modeOfTeaching.length}
                </span>
              )}
            </Button>

            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.slug}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="w-4 h-4" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Sticky Search Bar - Only visible when scrolled past original */}
        {isSearchBarScrolled && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 py-3 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-4">
              <div className="w-full">
                <SearchBar />
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-serif text-foreground">
            {getHeading()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? 'Loading...' : `${teachers.length} teachers found`}
          </p>
        </div>

        {/* Teachers List */}
        {loading ? (
          // Check if this is initial page load (no teachers loaded yet)
          displayedTeachers.length === 0 && allTeachersData.length === 0 ? (
            // Show loading screen for initial page load
            <div className="flex flex-col items-center justify-center py-24 md:py-32 min-h-[60vh]">
              <div className="text-center space-y-6">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
                <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                  Finding your favourite teachers
                </h2>
                <p className="text-muted-foreground text-lg">
                  Please wait while we load the best tutors for you...
                </p>
              </div>
            </div>
          ) : hasFilters ? (
            // Show search message when filters are active
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">
                  We are searching for your perfect teacher
                </h2>
                <p className="text-muted-foreground text-lg">
                  Please wait while we find the best matches for you...
                </p>
              </div>
            </div>
          ) : (
            // Show skeleton loaders when loading more (has some teachers already)
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 bg-card rounded-2xl p-4 border border-border">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : displayedTeachers.length > 0 ? (
          <div className="space-y-4">
            {displayedTeachers.map((teacher) => {
              // Always prefer subjects_from_shikshaq (all subjects) over subjects?.name (single featured subject)
              // subjects_from_shikshaq contains all subjects the teacher teaches from Shikshaqmine
              const displaySubjects = teacher.subjects_from_shikshaq || teacher.subjects?.name || '';
              
              return (
                <TeacherCardDetailed
                  key={teacher.id}
                  id={teacher.id}
                  name={teacher.name}
                  slug={teacher.slug}
                  imageUrl={teacher.image_url}
                  subjects={displaySubjects}
                  classes={teacher.classes_taught}
                  modeOfTeaching={teacher.mode_of_teaching}
                  sirMaam={(teacher as any).sir_maam}
                />
              );
            })}
            
            {/* Infinite scroll loading indicator */}
            {hasMore && (
              <div 
                id="scroll-trigger" 
                className="h-20 flex items-center justify-center"
              >
                <div className="animate-pulse text-muted-foreground">
                  Loading more teachers...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-serif text-foreground mb-2">No teachers found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}

        {/* Other Recommended Tuition Teachers Section - Show after any search or when there are results */}
        {!loading && (searchParams.get('q') || teachers.length > 0) && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="section-title">Other recommended tuition teachers</h2>
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
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {featuredTeachers.map((teacher) => (
                      <CarouselItem 
                        key={teacher.id} 
                        className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                      >
                        <TeacherCard
                          id={teacher.id}
                          name={teacher.name}
                          slug={teacher.slug}
                          subject={teacher.subjects?.name || 'Tuition Teacher'}
                          subjectSlug={teacher.subjects?.slug}
                          imageUrl={teacher.image_url}
                          isFeatured={true}
                          sirMaam={teacher.sir_maam}
                          isLiked={isLiked(teacher.id)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 md:left-4" />
                  <CarouselNext className="right-0 md:right-4" />
                </Carousel>
              </div>
            ) : null}
          </section>
        )}
      </main>

      <FilterPanel
        key={JSON.stringify(filters)} // Force re-render when filters change
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
          });
        }}
      />

      <Footer />
    </div>
  );
}
