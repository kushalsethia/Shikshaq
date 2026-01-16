import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
import { fuzzySearch, prepareRecordForSearch } from '@/utils/fuzzySearch';
import { useLikes } from '@/lib/likes-context';
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
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    classes: [],
    boards: [],
    classSize: [],
    areas: [],
    modeOfTeaching: [],
  });
  const [featuredTeachers, setFeaturedTeachers] = useState<FeaturedTeacher[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const { isLiked } = useLikes();

  const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    async function fetchSubjects() {
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
      }
    }

    fetchSubjects();
  }, []);

  // Sync selectedSubject with URL parameter when it changes
  useEffect(() => {
    const subjectFromUrl = searchParams.get('subject') || '';
    setSelectedSubject(subjectFromUrl);
  }, [searchParams]);

  useEffect(() => {
    async function fetchTeachers() {
      // Don't fetch if subjects haven't loaded yet (needed for subject filtering)
      if (subjects.length === 0 && searchParams.get('subject')) {
        return;
      }
      
      setLoading(true);
      try {
        // First, get teachers from teachers_list with a reasonable limit
        const searchQuery = searchParams.get('q');
        const subjectFilter = searchParams.get('subject');
        const classFilter = searchParams.get('class');

        let query = supabase
          .from('teachers_list')
          .select('id, name, slug, image_url, bio, location, subjects(name, slug)')
          .order('is_featured', { ascending: false })
          .order('name')
          .limit(500); // Limit to prevent fetching too much data

        // Don't filter by subject at database level - we'll filter using Shikshaqmine data
        // This allows matching all subjects a teacher teaches, not just the featured one
        const { data: teachersData, error } = await query;
        
        if (error) {
          console.error('Error fetching teachers:', error);
          setLoading(false);
          return;
        }

        if (!teachersData) {
          setTeachers([]);
          setLoading(false);
          return;
        }

        // Fetch Shikshaqmine data for filtering and enrichment (only if we have teachers)
        let allShikshaqData = null;
        if (teachersData && teachersData.length > 0) {
          const teacherSlugs = teachersData.map(t => t.slug);
          // Split into chunks if too many slugs to avoid query size limits
          const chunkSize = 100;
          const chunks = [];
          for (let i = 0; i < teacherSlugs.length; i += chunkSize) {
            chunks.push(teacherSlugs.slice(i, i + chunkSize));
          }
          
          // Fetch data in parallel chunks
          const shikshaqPromises = chunks.map(chunk =>
            supabase
              .from('Shikshaqmine')
              .select('Slug, Subjects, "Classes Taught", "Classes Taught for Backend", Area, "AREAS FOR FILTERING", "Mode of Teaching", "School Boards Catered", "Class Size (Group/ Solo)", "Sir/Ma\'am?"')
              .in('Slug', chunk)
          );
          
          const shikshaqResults = await Promise.all(shikshaqPromises);
          allShikshaqData = shikshaqResults.flatMap(result => result.data || []);
          
          if (shikshaqResults.some(result => result.error)) {
            console.error('Error fetching some Shikshaqmine data');
          }
        }

        // Now filter based on Shikshaqmine table data
        let filteredTeachers = teachersData;

        // Include class from dropdown in filters (combine URL param and filter panel selections)
        const classFromDropdown = (selectedClass && selectedClass !== 'all') ? selectedClass : null;
        const classFromUrl = (classFilter && classFilter !== 'all') ? classFilter : null;
        const allClassFilters = new Set([
          ...filters.classes,
          ...(classFromDropdown ? [classFromDropdown] : []),
          ...(classFromUrl ? [classFromUrl] : [])
        ]);
        const effectiveClassFilters = Array.from(allClassFilters);

        // Include subject from dropdown in filters (combine URL param and filter panel selections)
        let effectiveSubjectFilters = [...filters.subjects];
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
            filters.boards.length > 0 || filters.classSize.length > 0 || 
            filters.areas.length > 0 || filters.modeOfTeaching.length > 0;

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
          
          const matchingSlugs = recordsToFilter
            .filter((record: any) => {

              // Check subjects (includes both dropdown and advanced filter selections)
              if (effectiveSubjectFilters.length > 0) {
                const subjects = (record.Subjects || '').toLowerCase();
                const hasSubject = effectiveSubjectFilters.some(subj => {
                  const subjLower = subj.toLowerCase();
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

              // Check classes - use "Classes Taught for Backend" column (has numeric values like "5,6,7,8")
              if (effectiveClassFilters.length > 0) {
                // First try the backend column with numeric values
                const classesBackend = (record["Classes Taught for Backend"] || '').toLowerCase();
                // Also check the display column as fallback
                const classesDisplay = (record["Classes Taught"] || '').toLowerCase();
                
                const hasClass = effectiveClassFilters.some(cls => {
                  const classLower = cls.toLowerCase();
                  
                  // Check backend column (numeric values like "5,6,7,8")
                  if (classesBackend) {
                    // Split by comma and check if the class number matches
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

              // Check boards
              if (filters.boards.length > 0) {
                const boards = (record["School Boards Catered"] || '').toLowerCase();
                const hasBoard = filters.boards.some(board => 
                  boards.includes(board.toLowerCase())
                );
                if (!hasBoard) {
                  return false;
                }
              }

              // Check class size
              if (filters.classSize.length > 0) {
                const classSize = (record["Class Size (Group/ Solo)"] || '').toLowerCase();
                const hasSize = filters.classSize.some(size => 
                  classSize.includes(size.toLowerCase())
                );
                if (!hasSize) {
                  return false;
                }
              }

              // Check areas - use "Area" column first, fallback to "AREAS FOR FILTERING"
              if (filters.areas.length > 0) {
                const areaData = (record.Area || record["AREAS FOR FILTERING"] || '').toLowerCase();
                const hasArea = filters.areas.some(area => {
                  const areaLower = area.toLowerCase();
                  // Check if the area name appears in the Area field
                  return areaData.includes(areaLower);
                });
                if (!hasArea) {
                  return false;
                }
              }

              // Check mode of teaching
              if (filters.modeOfTeaching.length > 0) {
                const mode = (record["Mode of Teaching"] || '').toLowerCase();
                const hasMode = filters.modeOfTeaching.some(m => {
                  const modeLower = m.toLowerCase();
                  return mode.includes(modeLower) || 
                         mode.includes(modeLower + ' /') ||
                         mode.includes('/ ' + modeLower) ||
                         mode.includes(modeLower + '/');
                });
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
        setTeachers(enrichedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeachers();
  }, [searchParams, filters, subjects]);

  // Fetch featured teachers for "Other recommended" section
  useEffect(() => {
    async function fetchFeaturedTeachers() {
      try {
        setFeaturedLoading(true);
        // Fetch teachers by upvotes (top 16) similar to home page
        const upvotesRes = await supabase
          .from('teacher_upvotes')
          .select('teacher_id');

        let teachersData: any[] = [];
        
        if (upvotesRes.data && upvotesRes.data.length > 0) {
          // Count upvotes per teacher
          const upvoteCounts = new Map<string, number>();
          upvotesRes.data.forEach((upvote: any) => {
            const current = upvoteCounts.get(upvote.teacher_id) || 0;
            upvoteCounts.set(upvote.teacher_id, current + 1);
          });

          // Sort by upvote count and get top 16 teacher IDs
          const topTeacherIds = Array.from(upvoteCounts.entries())
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 16)
            .map(([teacherId]) => teacherId);

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
        }
      } catch (error) {
        console.error('Error fetching featured teachers:', error);
      } finally {
        setFeaturedLoading(false);
      }
    }

    fetchFeaturedTeachers();
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
  };

  const hasFilters = searchParams.get('subject') || searchParams.get('class') || searchParams.get('q') ||
    filters.subjects.length > 0 || filters.classes.length > 0 ||
    filters.boards.length > 0 || filters.classSize.length > 0 ||
    filters.areas.length > 0 || filters.modeOfTeaching.length > 0;

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
        ) : teachers.length > 0 ? (
          <div className="space-y-4">
            {teachers.map((teacher) => (
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
