import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { TeacherCardDetailed } from '@/components/TeacherCardDetailed';
import { TeacherCard } from '@/components/TeacherCard';
import { Footer } from '@/components/Footer';
import { FilterPanel, FilterState } from '@/components/FilterPanel';
import { Filter, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fuzzySearch, prepareRecordForSearch } from '@/utils/fuzzySearch';
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
  const { isLiked } = useLikes();
  
  // Ref to track if we're updating URL ourselves (to prevent circular updates)
  const isUpdatingUrlRef = useRef(false);
  // Ref to track loading timeout
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // Update filter params
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

  // Sync filters from URL when URL changes (e.g., browser back/forward)
  // Only sync if filters in URL are different from current filters
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

    // Only update if filters actually differ (prevent unnecessary updates)
    // Sort arrays before comparing to handle order differences
    const filtersChanged = 
      JSON.stringify([...urlFilters.subjects].sort()) !== JSON.stringify([...filters.subjects].sort()) ||
      JSON.stringify([...urlFilters.classes].sort()) !== JSON.stringify([...filters.classes].sort()) ||
      JSON.stringify([...urlFilters.boards].sort()) !== JSON.stringify([...filters.boards].sort()) ||
      JSON.stringify([...urlFilters.classSize].sort()) !== JSON.stringify([...filters.classSize].sort()) ||
      JSON.stringify([...urlFilters.areas].sort()) !== JSON.stringify([...filters.areas].sort()) ||
      JSON.stringify([...urlFilters.modeOfTeaching].sort()) !== JSON.stringify([...filters.modeOfTeaching].sort());

    if (filtersChanged) {
      // Use a ref to prevent recursive updates
      isUpdatingUrlRef.current = false; // Allow this update
      setFilters(urlFilters);
    }
  }, [searchParams]); // Don't include filters in deps to prevent loops

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
      
      // Use a delay before showing loading state to prevent flickering on fast filters
      // Only show loading if filtering takes more than 150ms (fast filters won't show loading screen)
      loadingTimeoutRef.current = setTimeout(() => {
        setLoading(true);
      }, 150);
      
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
            console.error('Error fetching teachers:', error);
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

        // Fetch Shikshaqmine data for filtering and enrichment (only if we have teachers and need it)
        let allShikshaqData = null;
        if (teachersData && teachersData.length > 0 && (searchQuery || hasFiltersOrSearch)) {
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
            console.error('Error fetching some Shikshaqmine data');
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
            console.warn('Subject not found in subjects list:', subjectFilter);
          }
        }

        const hasActiveFilters = effectiveSubjectFilters.length > 0 || effectiveClassFilters.length > 0 || 
            urlFilters.boards.length > 0 || urlFilters.classSize.length > 0 || 
            urlFilters.areas.length > 0 || urlFilters.modeOfTeaching.length > 0;

        // Apply search query if present - use fuzzy search across name, subjects, areas, and classes
        // This should be combined with other filters
        // Filter if we have a search query OR active filters
        if (allShikshaqData && (searchQuery || hasActiveFilters)) {
          let recordsToFilter = allShikshaqData;
          
          // Apply fuzzy search if we have a search query
          if (searchQuery && searchQuery.trim().length >= 2) {
            // Prepare records for fuzzy search
            const searchableRecords = allShikshaqData.map((record: any) => {
              const teacher = teachersData.find(t => t.slug === record.Slug);
              return prepareRecordForSearch(record, teacher?.name);
            });
            
            // Perform fuzzy search
            const fuzzyResults = fuzzySearch(searchableRecords, searchQuery);
            
            // Get the slugs from fuzzy search results
            const fuzzySlugs = new Set(fuzzyResults.map((r: any) => r.Slug));
            
            // Filter records to only include those that matched fuzzy search
            recordsToFilter = allShikshaqData.filter((record: any) => 
              fuzzySlugs.has(record.Slug)
            );
          }
          
          // Pre-compute lowercase filter values once (outside loop for performance)
          const subjectFiltersLower = effectiveSubjectFilters.map(s => s.toLowerCase());
          const classFiltersLower = effectiveClassFilters.map(c => c.toLowerCase());
          const boardFiltersLower = urlFilters.boards.map(b => b.toLowerCase());
          const classSizeFiltersLower = urlFilters.classSize.map(s => s.toLowerCase());
          const areaFiltersLower = urlFilters.areas.map(a => a.toLowerCase());
          const modeFiltersLower = urlFilters.modeOfTeaching.map(m => m.toLowerCase());
          
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
              if (effectiveSubjectFilters.length > 0) {
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
              if (effectiveClassFilters.length > 0) {
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
              if (urlFilters.boards.length > 0) {
                const hasBoard = boardFiltersLower.some(boardLower => 
                  boards.includes(boardLower)
                );
                if (!hasBoard) {
                  return false;
                }
              }

              // Check class size - optimized
              if (urlFilters.classSize.length > 0) {
                const hasSize = classSizeFiltersLower.some(sizeLower => 
                  classSize.includes(sizeLower)
                );
                if (!hasSize) {
                  return false;
                }
              }

              // Check areas - optimized
              if (urlFilters.areas.length > 0) {
                const hasArea = areaFiltersLower.some(areaLower => 
                  areaData.includes(areaLower)
                );
                if (!hasArea) {
                  return false;
                }
              }

              // Check mode of teaching - optimized
              if (urlFilters.modeOfTeaching.length > 0) {
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
        } else if ((searchQuery || hasActiveFilters) && !allShikshaqData) {
          // If we have search query or filters but no Shikshaqmine data, fall back to name-only search
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase().trim();
            filteredTeachers = teachersData.filter(teacher => 
              teacher.name?.toLowerCase().includes(searchLower)
            );
          } else {
            // If we have filters but no Shikshaqmine data, show empty results
            // (can't filter without Shikshaqmine data)
            filteredTeachers = [];
          }
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

        console.log('Fetched and filtered teachers:', enrichedTeachers.length);
        // Store all teachers
        setAllTeachersData(enrichedTeachers);
        // Show first 20 teachers initially for infinite scroll
        const initialDisplay = 20;
        setDisplayedTeachers(enrichedTeachers.slice(0, initialDisplay));
        setTeachers(enrichedTeachers); // Keep for count display
        setHasMore(enrichedTeachers.length > initialDisplay);
      } catch (error) {
        console.error('Error fetching teachers:', error);
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

        // Fetch Sir/Ma'am data from Shikshaqmine table
        let sirMaamMap = new Map();
        if (teachersData.length > 0) {
          const teacherSlugs = teachersData.map((t: any) => t.slug);
          const { data: shikshaqData } = await supabase
            .from('Shikshaqmine')
            .select('Slug, "Sir/Ma\'am?"')
            .in('Slug', teacherSlugs);
          
          if (shikshaqData) {
            shikshaqData.forEach((record: any) => {
              sirMaamMap.set(record.Slug, record["Sir/Ma'am?"]);
            });
          }
        }

        // Process teachers data
        if (teachersData.length > 0) {
          const processedTeachers = teachersData.map((teacher: any) => {
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
        console.error('Error fetching featured teachers:', error);
      } finally {
        setFeaturedLoading(false);
      }
    }

    fetchFeaturedTeachers();
  }, [searchParams.get('q'), teachers.length]);

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

      <main className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar className="mb-4" />
          
          <div className="flex flex-wrap items-center gap-4">
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

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-serif text-foreground">
            {searchParams.get('q') 
              ? `Search results for "${searchParams.get('q')}"`
              : searchParams.get('subject')
              ? `${subjects.find(s => s.slug === searchParams.get('subject'))?.name || 'Subject'} Teachers`
              : 'All Tuition Teachers in Kolkata'
            }
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
            {displayedTeachers.map((teacher) => (
              <TeacherCardDetailed
                key={teacher.id}
                id={teacher.id}
                name={teacher.name}
                slug={teacher.slug}
                imageUrl={teacher.image_url}
                subjects={teacher.subjects_from_shikshaq || teacher.subjects?.name}
                classes={teacher.classes_taught}
                modeOfTeaching={teacher.mode_of_teaching}
                sirMaam={(teacher as any).sir_maam}
              />
            ))}
            
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
                          subject={teacher.subjects?.name || 'General'}
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
