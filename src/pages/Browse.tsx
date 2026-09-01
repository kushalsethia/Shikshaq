import { useEffect, useState, useMemo, useCallback, useRef, type CSSProperties } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { SearchControl } from '@/components/SearchControl';
import { TeacherCard } from '@/components/TeacherCard';
import { useChromeConfig } from '@/components/layout/AppShell';
import { FilterChips, type FilterChipItem } from '@/components/FilterChips';
import { type FilterState } from '@/components/FilterPanel';
import { FilterSheet, FilterRail, activeFilterCount } from '@/components/browse/FilterGroups';
import { SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Chip, chipVariants } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { IconDisc } from '@/components/ui/icon-disc';
import { PullToRefresh } from '@/components/devices/PullToRefresh';
import { ScrollRail } from '@/components/ui/scroll-rail';
import { PAST_PAPERS_PATH } from '@/lib/nav-config';
import { cn } from '@/lib/utils';
import { BentoStack, BentoPanel } from '@/components/layout/PageContainer';
import { ListLoading, ListEmpty, ListOverFiltered, ListError, ListEnd } from '@/components/ui/list-states';
import { useUpvotes } from '@/lib/upvotes-context';
import { RegionNotice } from '@/components/RegionNotice';
import { extractFiltersFromQuery, extractNameFromQuery } from '@/utils/searchKeywordExtractor';
import { searchByName, searchByNameWithScores } from '@/utils/searchByName';
import { getCache, setCache, CACHE_TTL, getTeachersListCacheKey, getShikshaqmineChunkCacheKey, clearExpiredCache } from '@/utils/cache';
import { getSubjectPalette } from '@/lib/subject-palette';
import { deriveExperienceYears, pageAllTeachers, fetchShikshaqmineChunked } from '@/lib/teachers';
import { PaperSheetCard, type PaperSheetCardPaper } from '@/components/papers/paper-sheet-card';
import { loadPaperIndex, hasYear } from '@/lib/question-bank';
import { SEOHead } from '@/components/SEOHead';
import { FAQSchema } from '@/components/FAQSchema';
import { SEOContentBlock } from '@/components/seo/SEOContentBlock';
import type { SubjectContent } from '@/content/subject-seo';
import { generateSubjectPageSchemas, generateBoardPageSchemas, generateBrowsePageSchemas, injectSchemas } from '@/utils/structuredDataGenerators';


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
  /**
   * Set by SubjectPage/BoardPage so the ~35 SEO landing routes get the
   * templated, subject/board-coloured first fold (VISUAL_DIRECTION.md §9a:
   * "one templated fold, subject-coloured... so all 35 feel bespoke but are
   * built and maintained once"). `label` is the human-readable subject/board
   * name (e.g. "Maths", "ICSE") used to drive both the palette lookup and
   * the headline copy. Omitted on the generic /all-tuition-teachers-in-kolkata
   * route.
   */
  pageContext?: { kind: 'subject' | 'board'; label: string };
  /**
   * Phase 13 (C-040/C-041): title/description + the SUBJECT_CONTENT /
   * BOARD_CONTENT entry (src/content/subject-seo.ts) for the ~35 SEO routes.
   * Lives here rather than in SubjectPage/BoardPage because the real teacher
   * count (for CollectionPage/Service JSON-LD, never hardcoded) only exists
   * once Browse's own fetch has run.
   */
  seo?: { title: string; description: string; content?: SubjectContent };
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

// Columns filterShikshaqRecords() and the enrichment step actually read (verified by
// grepping every `record.X` / `record["X"]` access in this file). `is_paused` is a live
// column (migration 20260816160605) added separately per-query with a fail-soft retry
// (see runShikshaqQuery/runChunk below); on the current schema that retry never fires,
// and it stays as protection against a future schema change rather than a live one.
const SHIKSHAQ_COLUMNS =
  'Slug, Subjects, "Classes Taught for Backend", "Classes Taught", "School Boards Catered", "Class Size (Group/ Solo)", Area, "Mode of Teaching", "Place of Teaching", "Min Fees", "Max Fees", "Sir/Ma\'am?", "Years they started teaching", "Link"';

// PostgREST's `.or()` filter-string syntax uses `,` to separate conditions and `%`/`_` as
// ILIKE wildcards — strip them from user-supplied filter values so they can't break the
// query string or widen a match in an unintended way.
function escOrValue(v: string): string {
  return v.replace(/[%_,()]/g, '');
}

function orIlike(column: string, values: string[]): string {
  return values.map((v) => `${column}.ilike.%${escOrValue(v)}%`).join(',');
}

/**
 * Broad, deliberately over-inclusive server-side prefilter over Shikshaqmine: every
 * condition is a plain substring ILIKE, so it can't reproduce filterShikshaqRecords'
 * exact whole-token-boundary matching (e.g. "5" here would also match "15"). That's fine
 * — every row this returns is re-checked by filterShikshaqRecords client-side before
 * reaching the UI. What this must NEVER do is exclude a row filterShikshaqRecords would
 * have accepted, so each OR list mirrors (or widens) filterShikshaqRecords' synonym
 * handling for the two subject aliases that don't share a substring relationship
 * (Accountancy/Accounts, Social Studies/History & Civics/Geography — the Computer(s) and
 * Drawing variants are already covered because one is a substring of the other).
 */
function applyServerPrefilters(query: any, f: FilterState) {
  if (f.subjects.length > 0) {
    const expanded = f.subjects.flatMap((s) => {
      const lower = s.toLowerCase();
      if (lower === 'accountancy') return [s, 'Accounts'];
      if (lower === 'social studies') return [s, 'History & Civics', 'Geography'];
      return [s];
    });
    query = query.or(orIlike('Subjects', expanded));
  }
  if (f.classes.length > 0) {
    // Both the backend (token) and display (free-text) class columns can carry a match.
    query = query.or([orIlike('Classes Taught for Backend', f.classes), orIlike('Classes Taught', f.classes)].join(','));
  }
  if (f.boards.length > 0) query = query.or(orIlike('School Boards Catered', f.boards));
  if (f.classSize.length > 0) query = query.or(orIlike('Class Size (Group/ Solo)', f.classSize));
  if (f.areas.length > 0) query = query.or(orIlike('Area', f.areas));
  if (f.modeOfTeaching.length > 0) query = query.or(orIlike('Mode of Teaching', f.modeOfTeaching));
  if (f.placeOfTeaching.length > 0) query = query.or(orIlike('Place of Teaching', f.placeOfTeaching));
  // Fee-overlap prefilter, widened with "OR unset" on each side so teachers who only have
  // one of Min/Max Fees populated (handled specially by filterShikshaqRecords) aren't lost.
  if (f.maxFees != null) query = query.or(`Min Fees.lte.${f.maxFees},Min Fees.is.null`);
  if (f.minFees != null) query = query.or(`Max Fees.gte.${f.minFees},Max Fees.is.null`);
  // minExperience is NOT prefiltered: "Years they started teaching" is a free-text column
  // and the exact arithmetic (currentYear - yearStarted) already runs cheaply client-side
  // over the (now much smaller) candidate set, so pushing it server-side buys nothing.
  return query;
}

/**
 * Applies the active sort to the FULL result set (never just the visible page), so
 * "Load more" batches stay in the same order as what's already on screen. Pure function
 * so the sort control can re-order via cached data (see lastEnrichedRef) without a
 * network round trip when only the sort — not the filters/search — changed.
 */
function applySortOrder(list: any[], sortParam: string, upvoteMap: Map<string, number>): any[] {
  if (sortParam === 'name') {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortParam === 'experience') {
    const currentYear = new Date().getFullYear();
    return [...list].sort((a, b) => {
      const expA = a._yearStarted ? currentYear - a._yearStarted : -Infinity;
      const expB = b._yearStarted ? currentYear - b._yearStarted : -Infinity;
      return expB - expA || a.name.localeCompare(b.name);
    });
  }
  if (sortParam === 'fees') {
    return [...list].sort((a, b) => {
      const feeA = a._minFees ?? Infinity;
      const feeB = b._minFees ?? Infinity;
      return feeA - feeB || a.name.localeCompare(b.name);
    });
  }
  // 'upvotes' (default)
  return [...list].sort((a, b) => {
    const diff = (upvoteMap.get(b.id) || 0) - (upvoteMap.get(a.id) || 0);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });
}

export default function Browse({ manageSeo = true, pageContext, seo }: BrowseProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') || '');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  // Error state (list-states.tsx "Error" — design.md §3 state coverage).
  // Retrying just bumps this counter, which the fetch effect below depends on.
  const [fetchError, setFetchError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
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
  /* Upvote counts come from UpvotesProvider, which already fetches the whole
     teacher_upvote_stats view once and caches it. This page used to refetch the
     same view on every mount with `.in('teacher_id', [147 ids])` — a ~7KB URL
     that tripped a CORS preflight, so a warm navigation back to Browse paid an
     OPTIONS plus a GET for data the app was already holding. */
  const { upvoteCounts } = useUpvotes();
  const upvoteCountsRef = useRef(upvoteCounts);
  upvoteCountsRef.current = upvoteCounts;

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

  /* The mobile and desktop card blocks below each independently re-derived
     firstSubject/firstArea/meta per teacher — string splits/maps/filters/
     joins for up to 24 teachers, TWICE (once per block), on every render of
     this component regardless of cause (a filter chip, a keystroke,
     anything). displayedTeachers only actually changes when a fetch
     resolves; memoising the derived fields once here, keyed on it, cuts
     that redundant work from "every render" to "only when the list
     genuinely changes" — part of the page-wide lag/glitch reports on this
     page. TeacherCard itself is already React.memo'd, but every prop here
     was already a stable primitive, so that memoisation was never the
     bottleneck — this recomputation was. */
  // In-place Teachers/Past-papers toggle — no navigation, same URL, this
  // page's own filter state reused for both. See handleSearchModeChange.
  const [viewMode, setViewMode] = useState<'teachers' | 'papers'>('teachers');
  const [papers, setPapers] = useState<PaperSheetCardPaper[]>([]);
  const [papersTotal, setPapersTotal] = useState(0);
  const [papersPage, setPapersPage] = useState(0);
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersLoadingMore, setPapersLoadingMore] = useState(false);
  const [papersLoadError, setPapersLoadError] = useState(false);
  const bankPapersRef = useRef<PaperSheetCardPaper[] | null>(null);
  const [papersRetryToken, setPapersRetryToken] = useState(0);
  const PAPERS_PAGE_SIZE = 24;

  useEffect(() => {
    if (viewMode !== 'papers') return;
    let cancelled = false;

    async function loadBankOnce(): Promise<PaperSheetCardPaper[]> {
      if (bankPapersRef.current) return bankPapersRef.current;
      const rows = await loadPaperIndex();
      const mapped: PaperSheetCardPaper[] = rows.map((b) => ({
        id: b.id,
        title: `Class ${b.cls} Mathematics`,
        school: b.school,
        subject: 'Maths',
        class: b.cls,
        board: b.board,
        exam_type: b.exam,
        year: hasYear(b.year) ? Number(String(b.year).slice(0, 4)) : 0,
        file_url: null,
      }));
      bankPapersRef.current = mapped;
      return mapped;
    }

    async function fetchPapers() {
      setPapersLoading(true);
      setPapersLoadError(false);
      setPapersPage(0);
      try {
        const bank = await loadBankOnce();
        const eq = (want: string[], value: string) =>
          want.length === 0 || want.some((w) => w.toLowerCase() === value.toLowerCase());
        const bankMatches = bank.filter((p) =>
          eq(filters.subjects, p.subject) && eq(filters.classes, p.class) && eq(filters.boards, p.board));

        let query = supabase
          .from('papers')
          .select('id,title,school,subject,class,board,exam_type,year,file_url', { count: 'exact' })
          .eq('is_published', true);
        if (filters.subjects.length > 1) query = query.in('subject', filters.subjects);
        else if (filters.subjects.length === 1) query = query.eq('subject', filters.subjects[0]);
        if (filters.classes.length > 1) query = query.in('class', filters.classes);
        else if (filters.classes.length === 1) query = query.eq('class', filters.classes[0]);
        if (filters.boards.length > 1) query = query.in('board', filters.boards);
        else if (filters.boards.length === 1) query = query.eq('board', filters.boards[0]);
        const { data, error, count } = await query
          .order('year', { ascending: false })
          .order('school', { ascending: true })
          .range(0, PAPERS_PAGE_SIZE - 1);
        if (error) throw error;
        if (cancelled) return;

        const merged = [...bankMatches, ...((data as PaperSheetCardPaper[]) ?? [])];
        setPapers(merged.slice(0, PAPERS_PAGE_SIZE));
        setPapersTotal((count ?? 0) + bankMatches.length);
      } catch {
        if (!cancelled) setPapersLoadError(true);
      } finally {
        if (!cancelled) setPapersLoading(false);
      }
    }

    fetchPapers();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, filters.subjects.join(','), filters.classes.join(','), filters.boards.join(','), papersRetryToken]);

  const enrichedDisplayedTeachers = useMemo(
    () =>
      displayedTeachers.map((teacher) => {
        const allSubjects = teacher.subjects_from_shikshaq || teacher.subjects?.name || '';
        const subjectList = allSubjects ? allSubjects.split(',').map((s) => s.trim()).filter(Boolean) : [];
        const firstSubject = subjectList[0] || teacher.subjects?.name || 'Tuition Teacher';
        const area = (teacher as { area?: string | null }).area ?? null;
        const firstArea = area ? area.split(',').map((a) => a.trim()).filter(Boolean)[0] : null;
        const meta = [teacher.classes_taught, firstArea].filter(Boolean).join(' · ');
        const experienceYears = deriveExperienceYears((teacher as { _yearStarted?: number | null })._yearStarted);
        return { teacher, firstSubject, firstArea, meta, experienceYears };
      }),
    [displayedTeachers],
  );
  const [allTeachersData, setAllTeachersData] = useState<Teacher[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Ref to track if we're updating URL ourselves (to prevent circular updates)
  const isUpdatingUrlRef = useRef(false);
  // Ref to track loading timeout
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to debounce filter-driven refetches
  const fetchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Monotonically increasing id guarding against out-of-order fetch responses: typing quickly
  // can fire overlapping requests, and without this the LAST TO RESOLVE (not the last issued)
  // would win and overwrite newer results with a stale response.
  const fetchIdRef = useRef(0);
  // Whether the base teachers_list fetch hit the pagination safety cap (see MAX_TEACHER_PAGES
  // below) and some teachers are therefore not represented in this result set.
  const [resultsTruncated, setResultsTruncated] = useState(false);
  // Snapshot of the Shikshaqmine records + effective filters behind the most recent
  // fetch, so the EmptyResults "relax a filter" options can be computed with real
  // counts (components/EmptyResults.md) without a second Supabase round trip.
  const lastQueryRef = useRef<{ shikshaqRecords: any[]; effectiveFilters: FilterState } | null>(null);
  // Cache of the last fetch's enriched (pre-sort) result set + upvote counts, keyed by the
  // searchParams that determined it (everything EXCEPT `sort`). Lets the sort control
  // re-order the whole result set with zero network round trips when only `sort` changes.
  const lastFetchKeyRef = useRef<string | null>(null);
  const lastEnrichedRef = useRef<{ enriched: any[]; upvoteMap: Map<string, number> } | null>(null);

  const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'];

  // Real, site-wide approved-review count for the B2 trust slab (design.md §0.10 —
  // every count shown is a real query; PreFooter already drops the "student
  // reviews" line entirely when this stays undefined). Same predicate Index.tsx
  // uses for its own review count. Fetched once, independent of the main
  // teacher-list fetch above.
  const [reviewsCount, setReviewsCount] = useState<number | undefined>(undefined);

  // AppShell renders the B2 pre-footer for this route already (preFooterFor
  // matches BROWSE_PATH); this only hands it the live counts, which AppShell
  // has no way to know on its own.
  useChromeConfig({ preFooter: 'B2', preFooterCounts: { teachers: teachers.length, reviews: reviewsCount } });

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('teacher_comments')
      .select('id', { count: 'exact', head: true })
      .eq('approved', true)
      .then(({ count, error }) => {
        if (cancelled || error || count == null) return;
        setReviewsCount(count);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Real per-subject papers count + distinct-school count for the subject page's
  // "{Subject} papers too" promo card (secondary-01-subject-page.png). Only
  // relevant on the ~35 templated subject routes, so it's scoped to
  // pageContext?.kind === 'subject' and skipped everywhere else. Dropped
  // entirely (see JSX below) if the query fails or returns zero — never a
  // fabricated stat.
  const [subjectPapers, setSubjectPapers] = useState<{ count: number; schools: number } | null>(null);
  useEffect(() => {
    if (pageContext?.kind !== 'subject') {
      setSubjectPapers(null);
      return;
    }
    let cancelled = false;
    supabase
      .from('papers')
      .select('school')
      .eq('is_published', true)
      .ilike('subject', `%${pageContext.label}%`)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const schools = new Set(data.map((p) => p.school).filter(Boolean));
        if (data.length > 0) setSubjectPapers({ count: data.length, schools: schools.size });
      });
    return () => {
      cancelled = true;
    };
  }, [pageContext?.kind, pageContext?.label]);

  useEffect(() => {
    // Canonical is handled globally by <CanonicalTag>. When `seo` is set
    // (SubjectPage/BoardPage's ~35 templated routes), <SEOHead> below owns
    // title/description/OG/Twitter/schema instead of this manual effect.
    if (!manageSeo || seo) return;

    document.title = 'All Tuition Teachers in Kolkata | Shikshaq';
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDesc) metaDesc.setAttribute('content', 'Browse all verified tuition teachers in Kolkata. Filter by subject, class, board, area, mode of teaching, and fees. Free to use, connect directly with local tutors.');
    return () => {
      document.title = 'Shikshaq - Find Tuition Teachers in Kolkata';
      if (metaDesc) metaDesc.setAttribute('content', 'Find verified tuition teachers in Kolkata for free. Search by subject, class, board, and area. Connect directly with local tutors for CBSE, ICSE, IGCSE, IB, State Board. No commission, no middlemen.');
    };
  }, [manageSeo]);

  // Schema for the generic "/all-tuition-teachers-in-kolkata" route. The ~35
  // templated subject/board routes get CollectionPage+Service+Breadcrumb via
  // seoSchemas below (SEOHead owns injection there); this is the one other
  // real landing page Browse renders (seo unset, pageContext unset), and it
  // had no page-level JSON-LD at all — generateBrowsePageSchemas existed in
  // structuredDataGenerators.ts for exactly this page but was never called
  // from anywhere. Waits for the real fetch to finish so numberOfItems is
  // never a stale/zero count from the loading state.
  useEffect(() => {
    if (!manageSeo || seo || loading) return;
    injectSchemas(generateBrowsePageSchemas({ teacherCount: teachers.length }));
    return () => {
      const existing = document.getElementById('page-schemas');
      if (existing) existing.remove();
    };
  }, [manageSeo, seo, loading, teachers.length]);

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
      // Claim this fetch's id so we can tell, when it resolves, whether a newer fetch
      // (triggered by the user changing the query/filters again) has since superseded it.
      const myFetchId = ++fetchIdRef.current;
      const isStale = () => fetchIdRef.current !== myFetchId;

      // Don't fetch if subjects haven't loaded yet (needed for subject filtering)
      if (subjects.length === 0 && searchParams.get('subject')) {
        return;
      }

      const sortParam = searchParams.get('sort') || 'upvotes';
      const nonSortParams = new URLSearchParams(searchParams);
      nonSortParams.delete('sort');
      const nonSortKey = nonSortParams.toString();

      // If ONLY the sort control changed, re-order the already-fetched result set from
      // cache instead of re-running the whole query — the sort applies to the full result
      // set either way, so there's nothing new to fetch.
      if (lastFetchKeyRef.current === nonSortKey && lastEnrichedRef.current) {
        const { enriched, upvoteMap } = lastEnrichedRef.current;
        const sorted = applySortOrder(enriched, sortParam, upvoteMap);
        setAllTeachersData(sorted);
        const pageSize = 24;
        setDisplayedTeachers(sorted.slice(0, pageSize));
        setTeachers(sorted);
        setHasMore(sorted.length > pageSize);
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
        const subjectFilter = searchParams.get('subject');
        const classFilter = searchParams.get('class');
        const selectCols = 'id, name, slug, image_url, bio, location, is_featured, subjects(name, slug)';

        // ---- Compute effective filters up front (decides the fetch strategy below) ----
        const minFeesParam = searchParams.get('filter_minFees');
        const maxFeesParam = searchParams.get('filter_maxFees');
        const urlFilters: FilterState = {
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

        // Include class/subject from the quick-pick dropdowns (combine with filter panel selections)
        const classFromDropdown = (selectedClass && selectedClass !== 'all') ? selectedClass : null;
        const classFromUrl = (classFilter && classFilter !== 'all') ? classFilter : null;
        const effectiveClassFilters = Array.from(new Set([
          ...urlFilters.classes,
          ...(classFromDropdown ? [classFromDropdown] : []),
          ...(classFromUrl ? [classFromUrl] : []),
        ]));

        let effectiveSubjectFilters = [...urlFilters.subjects];
        if (subjectFilter && subjectFilter !== 'all') {
          const selSubject = subjects.find(s => s.slug === subjectFilter);
          if (selSubject) {
            if (!effectiveSubjectFilters.includes(selSubject.name)) {
              effectiveSubjectFilters = [...effectiveSubjectFilters, selSubject.name];
            }
          } else if (import.meta.env.DEV) {
            console.warn('Subject not found in subjects list:', subjectFilter);
          }
        }

        const hasActiveFilters = effectiveSubjectFilters.length > 0 || effectiveClassFilters.length > 0 ||
            urlFilters.boards.length > 0 || urlFilters.classSize.length > 0 ||
            urlFilters.areas.length > 0 || urlFilters.modeOfTeaching.length > 0 ||
            urlFilters.placeOfTeaching.length > 0 ||
            urlFilters.minFees != null || urlFilters.maxFees != null ||
            urlFilters.minExperience != null;

        let effectiveFilters: FilterState = {
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

        // If there's a search query, REPLACE all filters with ones extracted from it
        // (don't merge with previous filter-panel selections).
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

        // Name search needs to fuzzy-scan every teacher's name — it can't be pushed
        // server-side without a dedicated search index/RPC, so that path keeps the
        // original full-fetch strategy. Structural filters WITHOUT a name search are the
        // common case this hook is optimizing (every "Apply filter" click) and get the
        // new server-side-prefiltered path below.
        const isNameSearch = !!(searchQuery && searchQuery.trim().length >= 3);

        const TEACHER_PAGE_SIZE = 500;
        const MAX_TEACHER_PAGES = 6; // safety cap: up to 3000 teachers fetched per query
        const limit = TEACHER_PAGE_SIZE * MAX_TEACHER_PAGES;
        let truncated = false;
        let teachersData: any[] = [];
        let allShikshaqData: any[] | null = null;
        let filteredTeachers: any[] = [];

        if (hasActiveFiltersAfterExtraction && !isNameSearch) {
          // ---- Server-side filtered path ----
          // Query Shikshaqmine FIRST with a broad server-side prefilter (applyServerPrefilters),
          // then fetch only the teachers_list rows that survived it — instead of fetching every
          // teacher and every teacher's Shikshaqmine row on every filter change.
          const SHIKSHAQ_PREFILTER_LIMIT = 1500;
          const runShikshaqQuery = async (withPaused: boolean) => {
            let q = (supabase.from('Shikshaqmine').select(SHIKSHAQ_COLUMNS + (withPaused ? ', is_paused' : '')) as any);
            q = applyServerPrefilters(q, effectiveFilters);
            return q.limit(SHIKSHAQ_PREFILTER_LIMIT);
          };

          let shikRes = await runShikshaqQuery(true);
          if (isStale()) return;
          if (shikRes.error) {
            // is_paused may not exist in this environment — fail soft and retry without it
            // rather than losing the whole filtered result set over one column.
            if (import.meta.env.DEV) {
              console.warn('Shikshaqmine prefilter (with is_paused) failed, retrying without it:', shikRes.error.message);
            }
            shikRes = await runShikshaqQuery(false);
            if (isStale()) return;
          }

          const candidateRecords: any[] = shikRes.error ? [] : (shikRes.data || []);
          if (shikRes.error && import.meta.env.DEV) {
            console.error('Error fetching Shikshaqmine prefilter:', shikRes.error.message);
          }
          allShikshaqData = candidateRecords;

          // Exact-match pass: the server prefilter above is deliberately over-inclusive
          // (plain substring ILIKE), so re-run the real predicate to restore exact
          // token-boundary semantics before this reaches the UI or EmptyResults.
          const matchingRecords = filterShikshaqRecords(candidateRecords, effectiveFilters);
          lastQueryRef.current = { shikshaqRecords: candidateRecords, effectiveFilters };

          let matchingSlugs = matchingRecords.map((r: any) => r.Slug).filter(Boolean);
          if (candidateRecords.some((r: any) => 'is_paused' in r)) {
            const pausedSlugs = new Set(candidateRecords.filter((r: any) => r.is_paused).map((r: any) => r.Slug));
            matchingSlugs = matchingSlugs.filter((slug) => !pausedSlugs.has(slug));
          }

          if (matchingSlugs.length > 0) {
            const chunkSize = 200;
            const chunks: string[][] = [];
            for (let i = 0; i < matchingSlugs.length; i += chunkSize) chunks.push(matchingSlugs.slice(i, i + chunkSize));
            const results = await Promise.all(
              chunks.map((chunk) => supabase.from('teachers_list').select(selectCols).in('slug', chunk))
            );
            if (isStale()) return;
            teachersData = results.flatMap((r) => r.data || []);
          }

          truncated = candidateRecords.length >= SHIKSHAQ_PREFILTER_LIMIT;
          filteredTeachers = teachersData;
        } else {
          // ---- Full-fetch path (name search, or the unfiltered default view) ----
          const hasFiltersOrSearch = !!searchQuery || hasActiveFilters;

          let cachedTeachers: { rows: any[]; truncated: boolean } | null = null;
          if (!hasFiltersOrSearch) {
            const cacheKey = getTeachersListCacheKey(limit);
            cachedTeachers = getCache<{ rows: any[]; truncated: boolean }>(cacheKey);
          }

          if (cachedTeachers) {
            teachersData = cachedTeachers.rows;
            truncated = cachedTeachers.truncated;
          } else {
            /* Paging mechanics now live in lib/teachers.ts. Only the "how
               many rows, in what order, up to what cap" part moved; nothing
               about filters went with it. */
            const paged = await pageAllTeachers({
              selectCols,
              pageSize: TEACHER_PAGE_SIZE,
              maxPages: MAX_TEACHER_PAGES,
              isStale,
            });

            if (isStale()) return;

            if (paged.failed) {
              setTeachers([]);
              if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
              setLoading(false);
              return;
            }

            truncated = paged.truncated;
            teachersData = paged.rows;

            if (!hasFiltersOrSearch) {
              const cacheKey = getTeachersListCacheKey(limit);
              setCache(cacheKey, { rows: teachersData, truncated }, CACHE_TTL.TEACHERS_LIST);
            }
          }

          if (teachersData.length > 0) {
            /* Chunking mechanics and the is_paused fallback now live in
               lib/teachers.ts. SHIKSHAQ_COLUMNS is passed IN rather than moved,
               because it is FilterState-aware and belongs to this file. */
            const chunked = await fetchShikshaqmineChunked({
              slugs: teachersData.map((t) => t.slug),
              columns: SHIKSHAQ_COLUMNS,
              chunkSize: 200,
              isStale,
              cache: {
                key: (slugs, withPaused) =>
                  getShikshaqmineChunkCacheKey(slugs) + (withPaused ? '_ispaused' : '_nopaused'),
                get: (key) => getCache<any[]>(key),
                set: (key, rows) => setCache(key, rows, CACHE_TTL.SHIKSHAQMINE_CHUNK),
              },
            });
            if (isStale()) return;

            allShikshaqData = chunked.rows;
            if (chunked.partialFailure && import.meta.env.DEV) {
              console.error('Error fetching some Shikshaqmine data');
            }

            if (allShikshaqData.some((r: any) => 'is_paused' in r)) {
              const pausedSlugs = new Set(allShikshaqData.filter((r: any) => r.is_paused).map((r: any) => r.Slug));
              if (pausedSlugs.size > 0) teachersData = teachersData.filter((t) => !pausedSlugs.has(t.slug));
            }
          }

          filteredTeachers = teachersData;

          // Smart Search Logic: Handle both Name Search and Filters
          // 1. If filters found, extract name part from remaining query
          // 2. If no filters found, treat entire query as name search
          // 3. When both present, prioritize name matches but apply filters
          let namePart = '';
          let nameSearchResults: Teacher[] = [];
          let nameSearchResultsWithScores: Array<{ item: Teacher; score: number }> = [];

          if (isNameSearch) {
            if (hasActiveFiltersAfterExtraction) {
              namePart = extractNameFromQuery(searchQuery!, extractedFilters, subjects);
              if (namePart.length >= 3) {
                nameSearchResultsWithScores = searchByNameWithScores(teachersData, namePart);
                nameSearchResults = nameSearchResultsWithScores.map((r) => r.item);
              }
            } else {
              nameSearchResults = searchByName(teachersData, searchQuery!.trim());
            }
          }

          if (nameSearchResults.length > 0 && !hasActiveFiltersAfterExtraction) {
            filteredTeachers = nameSearchResults;
          } else if (allShikshaqData && hasActiveFiltersAfterExtraction) {
            const recordsToFilter = allShikshaqData;
            const matchingSlugs = filterShikshaqRecords(recordsToFilter, effectiveFilters).map((r: any) => r.Slug);
            lastQueryRef.current = { shikshaqRecords: recordsToFilter, effectiveFilters };
            // Was matchingSlugs.includes(t.slug) inside this filter -- an O(n) array
            // scan run once per teacher, so up to ~3000 teachers x ~3000 matching
            // slugs (both capped at MAX_TEACHER_PAGES*TEACHER_PAGE_SIZE /
            // SHIKSHAQ_PREFILTER_LIMIT) was up to ~9M string comparisons on every
            // filtered fetch on this, the full-fetch (name-search) path. A Set
            // lookup is O(1) per teacher instead.
            const matchingSlugSet = new Set(matchingSlugs);
            filteredTeachers = teachersData.filter((t) => matchingSlugSet.has(t.slug));

            if (nameSearchResultsWithScores.length > 0) {
              const nameScoreMap = new Map<string, number>();
              nameSearchResultsWithScores.forEach(({ item, score }) => nameScoreMap.set(item.slug, score));
              const nameMatches: Array<{ teacher: Teacher; score: number }> = [];
              const nonNameMatches: Teacher[] = [];
              filteredTeachers.forEach((teacher) => {
                const score = nameScoreMap.get(teacher.slug);
                if (score !== undefined) nameMatches.push({ teacher, score });
                else nonNameMatches.push(teacher);
              });
              nameMatches.sort((a, b) => a.score - b.score);
              filteredTeachers = [...nameMatches.map((m) => m.teacher), ...nonNameMatches];
            }
          } else if ((searchQuery || hasActiveFilters) && !allShikshaqData) {
            if (searchQuery && !hasActiveFiltersAfterExtraction) {
              filteredTeachers = searchByName(teachersData, searchQuery.trim());
            } else if (hasActiveFiltersAfterExtraction) {
              filteredTeachers = [];
            } else {
              filteredTeachers = teachersData;
            }
          } else if (searchQuery && !hasActiveFiltersAfterExtraction && nameSearchResults.length === 0) {
            filteredTeachers = [];
          }
        }

        setResultsTruncated(truncated);

        // ---- Enrichment (shared by both fetch paths) ----
        const shikshaqMap = new Map<string, any>();
        if (allShikshaqData) {
          allShikshaqData.forEach((record: any) => {
            shikshaqMap.set(record.Slug, {
              subjects: record.Subjects,
              classes: record['Classes Taught'],
              modeOfTeaching: record['Mode of Teaching'],
              sirMaam: record["Sir/Ma'am?"],
              area: record.Area || null,
              minFees: record['Min Fees'] != null ? Number(record['Min Fees']) : null,
              maxFees: record['Max Fees'] != null ? Number(record['Max Fees']) : null,
              yearStarted: record['Years they started teaching'] ? parseInt(record['Years they started teaching']) : null,
              whatsappLink: record['Link'] || null,
            });
          });
        }

        const enrichedTeachers = filteredTeachers.map((teacher) => {
          const info = shikshaqMap.get(teacher.slug);
          return {
            ...teacher,
            subjects_from_shikshaq: info?.subjects || null,
            classes_taught: info?.classes || null,
            mode_of_teaching: info?.modeOfTeaching || null,
            sir_maam: info?.sirMaam || null,
            area: info?.area || null,
            _minFees: info?.minFees ?? null,
            _maxFees: info?.maxFees ?? null,
            _yearStarted: info?.yearStarted ?? null,
            whatsapp_link: info?.whatsappLink ?? null,
          };
        });

        // Read, do not fetch — see the note on upvoteCountsRef above.
        const upvoteMap = upvoteCountsRef.current;

        // A newer fetch (from a filter/query change that happened while this one was in
        // flight) has already superseded this response — discard it instead of clobbering
        // the newer results with stale ones.
        if (isStale()) return;

        lastFetchKeyRef.current = nonSortKey;
        lastEnrichedRef.current = { enriched: enrichedTeachers, upvoteMap };

        const sortedTeachers = applySortOrder(enrichedTeachers, sortParam, upvoteMap);

        setAllTeachersData(sortedTeachers);
        // Page size 24 with an explicit "Load more" button, never infinite scroll (Browse.md).
        const pageSize = 24;
        setDisplayedTeachers(sortedTeachers.slice(0, pageSize));
        setTeachers(sortedTeachers); // Keep for count display
        setHasMore(sortedTeachers.length > pageSize);
        setFetchError(false);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching teachers:', error);
        }
        if (!isStale()) setFetchError(true);
      } finally {
        // Only the most recent fetch owns the loading indicator; a stale fetch finishing
        // later must not flip loading back off underneath the active one.
        if (isStale()) return;
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
    // Was 0ms for text search — every keystroke fired the full fetch +
    // Shikshaqmine-enrichment pipeline immediately, which is exactly what
    // made typing a name feel slow (a network round trip and a re-render
    // per character, sometimes arriving out of order). Debounced like every
    // other filter now, letting keystrokes coalesce into one request.
    const searchQuery = searchParams.get('q');
    const debounceMs = searchQuery ? 300 : 250;
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
  }, [searchParams, subjects, retryToken]);

  const handleRetry = () => {
    setFetchError(false);
    setRetryToken((t) => t + 1);
  };

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

  // Sort control state lives directly in the `sort` URL param (no separate React state
  // needed) so it round-trips through back/forward and share links like every other filter.
  const currentSort = searchParams.get('sort') || 'upvotes';
  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'upvotes') {
      newParams.set('sort', value);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  // The search bar's Teachers/Papers toggle doubles as the page-mode switch —
  // flipping to Papers carries the active subject/class/board filters over.
  // Was navigating to `/past-papers` — that route's own general landing
  // page (steps/hero/browse-by-board), not filtered results, so flipping
  // this toggle dropped the visitor on an unfiltered page instead of
  // "just filtering" as asked. That was itself a partial fix — the owner
  // then asked directly for a true same-page toggle, no navigation at all:
  // "you don't have to reload or refresh... simply instead of the teacher
  // cards, the paper cards come up." viewMode below swaps the results panel
  // in place; this page's own subjects/classes/boards filter state is
  // reused as-is for the papers query rather than a second, parallel filter
  // UI, since a teacher's subject/class/board and a paper's are the same
  // three facets on the same URL.
  const handleSearchModeChange = (mode: 'teachers' | 'papers') => {
    setViewMode(mode);
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

  // Removes a single value from one of the "More filters" (advanced panel) arrays.
  const removeArrayFilterValue = (
    category: 'subjects' | 'classes' | 'boards' | 'classSize' | 'areas' | 'modeOfTeaching' | 'placeOfTeaching',
    value: string
  ) => {
    setFilters({ ...filters, [category]: filters[category].filter((v) => v !== value) });
  };

  // The quick-pick Subject/Class dropdowns (selectedSubject/selectedClass, URL params
  // `subject`/`class`) and the advanced FilterPanel (filters.subjects/classes, URL params
  // `filter_subjects`/`filter_classes`) are two separate state systems merged with Sets at
  // fetch time (see effectiveSubjectFilters/effectiveClassFilters above). Resolved here to
  // display names/values so the chip row can show BOTH systems' active values as one
  // deduplicated set — a subject picked from the dropdown that's already in the panel's
  // list isn't shown twice, and either chip removes the value from whichever system holds it.
  const quickPickSubjectName = useMemo(() => {
    if (!selectedSubject || selectedSubject === 'all') return null;
    const subject = subjects.find((s) => s.slug === selectedSubject);
    return subject?.name || null;
  }, [selectedSubject, subjects]);
  const quickPickClassValue = selectedClass && selectedClass !== 'all' ? selectedClass : null;

  // Chip per selected value from BOTH the quick-pick dropdowns and the advanced filter
  // panel (URL params filter_*). The free-text q is deliberately not represented here —
  // the spec scopes FilterChips to filter_* (plus the quick-pick subject/class) only.
  const filterChips: FilterChipItem[] = [
    ...(quickPickSubjectName && !filters.subjects.includes(quickPickSubjectName)
      ? [{ key: `subjects:${quickPickSubjectName}`, label: quickPickSubjectName, onRemove: () => handleSubjectChange('all') }]
      : []),
    ...filters.subjects.map((v) => ({ key: `subjects:${v}`, label: v, onRemove: () => removeArrayFilterValue('subjects', v) })),
    ...(quickPickClassValue && !filters.classes.includes(quickPickClassValue)
      ? [{ key: `classes:${quickPickClassValue}`, label: `Class ${quickPickClassValue}`, onRemove: () => handleClassChange('all') }]
      : []),
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
  /* activeFilterCount(filters) is what the Filters badge itself counts, and it
     has to be in here too. Without it a filter that produces no removable chip
     (a rate ceiling, a mode, a board) left isDefaultView true, so a search that
     genuinely matched nobody rendered the "Kolkata's verified tutors, across
     every subject and board" line — an advert, under a heading reading "0
     tuition teachers", with no way to clear the filter that emptied the page.
     The over-filtered state and its Clear filters button now show whenever any
     filter is actually on. */
  const isDefaultView =
    !searchParams.get('q') &&
    !selectedSubject &&
    !selectedClass &&
    filterChips.length === 0 &&
    activeFilterCount(filters) === 0;

  /* sortedSubjectsForDisplay was removed with the subject quick-pick pills —
     it had no other reader, so keeping it would have meant sorting the subject
     list on every change for nobody. */

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

  // Templated first-fold copy/colour (VISUAL_DIRECTION.md §9a "SEO subject/board
  // pages" ruling + REFERENCE_DEVICES.md's wayfinding table: subject = signpost,
  // board = route marker/secondary). Subjects get their real getSubjectPalette()
  // colour; boards (not subject-coded) use brand blue as the "route marker"
  // secondary accent. Falls back to brand orange for the generic /all- route.
  // `getSubjectPalette` already degrades unknown subjects to a legible neutral
  // (never grey-on-grey), so subjects outside the 8 seeds — e.g. Bengali — still
  // read as intentional rather than broken.
  // pageContext (SubjectPage/BoardPage) still drives a themed accent used on
  // the h1's sub-line for the ~35 SEO routes, so they keep reading as
  // bespoke even though the control block itself is the standard near-black
  // (design.md §1 control block is one fixed treatment, not per-route).
  const isSubjectPage = pageContext?.kind === 'subject';
  const subjectPaletteForContext = pageContext?.kind === 'subject' ? getSubjectPalette(pageContext.label) : null;
  const headerAccent = subjectPaletteForContext?.solid ?? (pageContext?.kind === 'board' ? 'hsl(var(--brand-blue))' : null);
  // getHeading() already gives the exact, precise "All {subject} teachers in
  // Kolkata"-style heading pageContext needs; the h1 below uses the real
  // count instead (design.md's binding Browse spec), so pageContext's
  // heading text becomes the sub-line, not a separate templated title.
  const pageContextLine = pageContext
    ? pageContext.kind === 'subject'
      ? `${pageContext.label} teachers`
      : `${pageContext.label} board`
    : null;

  // Sub-line under the h1 -- copy.md Section 4 gives "Maths . Class 10 . within
  // 5 km of Lalpur" as an illustrative example; there is no real distance/radius
  // query behind a "within N km" claim (design.md Section 0 rule 10 forbids a
  // number that cannot be fetched), so the sub-line is built from the actual
  // active facets only and simply omits parts that are unset.
  const activeSubjectLabel = quickPickSubjectName || filters.subjects[0] || null;
  const activeClassLabel = quickPickClassValue ? `Class ${quickPickClassValue}` : filters.classes[0] ? `Class ${filters.classes[0]}` : null;
  const activeAreaLabel = filters.areas[0] || null;
  const subLineParts = [pageContextLine, activeSubjectLabel, activeClassLabel, activeAreaLabel].filter(Boolean) as string[];
  const resultCountLabel = loading ? '...' : teachers.length;
  const sortPills: { value: string; label: string }[] = [
    { value: 'upvotes', label: 'Most upvoted' },
    { value: 'experience', label: 'Experience' },
    { value: 'fees', label: 'Fees' },
    { value: 'name', label: 'Name' },
  ];
  const filterCount =
    activeFilterCount(filters) +
    (activeSubjectLabel && !filters.subjects.includes(activeSubjectLabel) ? 1 : 0) +
    (quickPickClassValue && !filters.classes.includes(quickPickClassValue) ? 1 : 0);

  // Phase 13 schema: only built for the ~35 templated subject/board routes
  // (`seo` set by SubjectPage/BoardPage). numberOfItems is the live
  // teachers.length from this component's own fetch -- never hardcoded.
  const seoBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: pageContext?.label || seo?.title || '', url: location.pathname },
  ];
  const seoSchemas = seo
    ? pageContext?.kind === 'board'
      ? generateBoardPageSchemas({
          board: pageContext.label,
          url: location.pathname,
          description: seo.description,
          teacherCount: teachers.length,
          breadcrumbs: seoBreadcrumbs,
        })
      : generateSubjectPageSchemas({
          subject: pageContext?.label || '',
          url: location.pathname,
          description: seo.description,
          teacherCount: teachers.length,
          breadcrumbs: seoBreadcrumbs,
        })
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      {seo && (
        <>
          <SEOHead title={seo.title} description={seo.description} canonical={location.pathname} schema={seoSchemas} />
          {seo.content && seo.content.faqs.length > 0 && (
            <FAQSchema faqs={seo.content.faqs} url={location.pathname} />
          )}
        </>
      )}

      {/* handleRetry() is fire-and-forget (bumps retryToken, the real fetch
          runs inside a debounced effect with no promise handle back to here)
          — the pill's minimum on-screen time in the hook covers "refreshing"
          feels instant even when it is; the results grid keeps its own
          loading state independently if the real fetch runs long. Disabled
          while the loading skeleton is already showing, so a pull can't
          double-trigger a fetch that's already in flight. */}
      <PullToRefresh onRefresh={handleRetry} disabled={loading}>
      <BentoStack>

      {/* Handoff B-002: the near-black control block becomes the stack's
          bone header panel — one dark surface on this page (the footer), not
          two fighting the tinted result cards. */}
      {/* px-[22px]: B-002 writes this panel as `pt-[14px] pb-5` and says
          nothing about the sides, so it had been sitting on BentoPanel's 20px
          default — but Browse Redesign.dc.html measures 14/22/20, and every
          other header panel in the family (Home, About, Contact, Help,
          Subjects, Schools) is 22px in its own geometry appendix. */}
      <BentoPanel fill="card" edge="top" className="px-[22px] pt-[14px] pb-5">
        {/* Handoff B-003: its own 44px row, lucide ArrowLeft (not the literal
            glyph), warm-secondary ink. */}
        <Link
          to="/"
          className="shikshaq-tap mb-[14px] flex h-11 w-fit items-center gap-1.5 text-[13px] font-semibold text-warm-secondary transition-colors duration-tap hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          {isSubjectPage ? 'All subjects' : 'Home'}
        </Link>

        {/* Subject icon tile (secondary-01-subject-page.png): a subject-tinted
            square disc above the h1, templated across the ~35 subject routes
            the same way the rest of this first fold is (VISUAL_DIRECTION.md
            §9a). Not present on the generic /all- route or board routes. */}
        {isSubjectPage && (
          <div className="mb-[14px]">
            <IconDisc
              tone="subject"
              subject={pageContext!.label}
              shape="square"
              size={44}
              className="text-[19px] font-black"
            >
              {pageContext!.label.charAt(0).toUpperCase()}
            </IconDisc>
          </div>
        )}

        <h1 className="font-display text-[27px] font-normal leading-[1.05] tracking-[-0.035em] text-foreground lg:text-[44px] lg:leading-[1.02] lg:tracking-[-0.04em]">
          {/* Board routes take the labelled heading too. They used to fall
              through to the generic count branch, so /icse-…, /cbse-ncert-…,
              /igcse-…, /international-board-… and /state-board-… all rendered
              "147 tuition teachers in Kolkata" with the board name nowhere in
              the h1 — the strongest on-page relevance signal, missing the
              target keyword on five commercial routes whose title tag and URL
              are both built from it. */}
          {viewMode === 'papers' ? (
            /* Client-side toggle only (teachers stays the URL's/crawler's
               default state) — safe to swap the heading without touching
               pageContext's SEO-critical board/subject branch below. */
            <>{papersTotal || ''} past paper{papersTotal === 1 ? '' : 's'} <span className="font-black">in Kolkata</span></>
          ) : pageContext ? (
            <>{pageContext.label} tuition teachers <span className="font-black">in Kolkata</span></>
          ) : (
            /* "147 tuition teachers in Kolkata", not the bare "147 teachers"
               this used to render. Two reasons it has to carry the phrase:
               core-01-browse-teachers.png shows the count and the phrase
               together ("312 tuition teachers in Kolkata"), and every one of
               the ~34 subject routes below already says "<Subject> tuition
               teachers in Kolkata" — this hub, the one they all link to and
               the strongest page on the site, was the only browse h1 dropping
               the phrase its own URL and title tag are built from. The count
               stays real; it just stopped being the whole heading. */
            <>{resultCountLabel} tuition teacher{teachers.length === 1 ? '' : 's'} <span className="font-black">in Kolkata</span></>
          )}
        </h1>
        {viewMode === 'papers' ? null : pageContext ? (
          <p className="mt-1 text-[14.5px] text-warm-meta">
            {loading ? 'Loading teachers…' : `${resultCountLabel} teacher${teachers.length === 1 ? '' : 's'} in Kolkata`}
          </p>
        ) : subLineParts.length > 0 && (
          <p
            className="mt-1 text-[14.5px] text-warm-meta"
            style={headerAccent ? { color: headerAccent } : undefined}
          >
            {subLineParts.join(' · ')}
          </p>
        )}

        {!loading && resultsTruncated && (
          <p className="mt-2 text-xs font-medium text-warm-meta">
            Showing the first {teachers.length} results. Narrow your search to see more.
          </p>
        )}

        <div className="mt-3 min-w-0 max-w-[820px]">
          {/* Handoff B-005: drop onDark — the panel is bone now, so the field
              inherits Home's H-009 metrics (60px, rounded-[22px], bg-muted,
              46px submit disc) via heroDesk instead. */}
          {/* alwaysShowModeToggle: the Teachers/Past papers switch belongs here
              as much as on the home desk, and without it this page was the one
              search on the site that could not change what it searched.
              hideFacets: the Subject/Class/Area row duplicated the filter rail
              sitting directly beneath it. */}
          <SearchControl
            align="flex-start"
            stackedToggle
            alwaysShowModeToggle
            hideFacets
            heroDesk
            initialMode="teachers"
            onModeChange={handleSearchModeChange}
          />
        </div>

        {/* Handoff B-006: class quick-picks move inside the header panel,
            directly under the search field — they used to sit in their own
            bare container between two panels, where the seam made them look
            like a dropped element. */}
        {isSubjectPage && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip
              tone={!quickPickClassValue ? 'facet-on' : 'facet'}
              size={44}
              onClick={() => handleClassChange('all')}
              aria-pressed={!quickPickClassValue}
            >
              All classes
            </Chip>
            {['9', '10', '11', '12'].map((c) => (
              <Chip
                key={c}
                tone={quickPickClassValue === c ? 'facet-on' : 'facet'}
                size={44}
                onClick={() => handleClassChange(c)}
                aria-pressed={quickPickClassValue === c}
              >
                Class {c}
              </Chip>
            ))}
          </div>
        )}
      </BentoPanel>


      {/* Sticky filter bar (design.md S4 "Browse (S1)"): dark Filters pill
          with an orange count badge (mobile -- desktop uses the persistent
          rail below instead), applied chips, count + sort line. */}
      {/* Handoff B-007: sticky filter bar becomes a floating BentoPanel pill
          row — no hairline, no blur, opaque bg-card. `isolate` stays: without
          its own stacking context this bar can paint above the results grid
          during scroll compositing (observed at 1440px), even though z-30 vs
          the grid's implicit z-0 "should" already resolve it. */}
      {/* lg:hidden when there is nothing to show. The only thing in this bar
          below lg is the Filters button, which is itself lg:hidden — so with no
          chips applied the desktop rendered an empty ~68px white band between
          the search panel and the results. py-2, not py-3: it holds one 44px
          control, and the extra padding made a slim bar chunky. */}
      <BentoPanel
        fill="card"
        className={`sticky top-[80px] z-30 isolate px-0 py-2 pl-4 ${
          filterChips.length === 0 ? 'lg:hidden' : ''
        }`}
      >
          <div className="flex items-center gap-[8px] pr-4">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="shikshaq-tap flex h-11 flex-none items-center gap-[7px] rounded-full bg-panel px-[16px] text-[13.5px] font-bold text-background transition-transform duration-tap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
              Filters
              {filterCount > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold tabular-nums text-brand-foreground">
                  {filterCount}
                </span>
              )}
            </button>

            <ScrollRail railClassName="flex-1" fadeFrom="from-card">
              <FilterChips
                mode="teachers"
                chips={filterChips}
                onClearAll={clearFilters}
              />
            </ScrollRail>
          </div>
      </BentoPanel>

      {/* Handoff B-014: the desktop two-column shell (rail + results) is
          unchanged in structure, each side now its own BentoPanel. */}
      <div className="lg:flex lg:items-start lg:gap-8">
        {/* Desktop persistent filter rail (design.md S5 / C-048) -- the
            sheet's content unwrapped, same FilterGroupsBody as the mobile
            sheet. Handoff B-014: FilterRail renders itself as a BentoPanel now. */}
        <FilterRail filters={filters} onFilterChange={setFilters} resultCount={teachers.length} />

        {/* Handoff B-011/B-013: results live inside one BentoPanel — list
            states render inside it too, so the panel is never empty while a
            state shows. */}
        <BentoPanel fill="card" className="min-w-0 flex-1 px-4 py-[18px] lg:p-6">
          {/* Handoff B-010: the "Featured teachers" shelf is removed —
              featured teachers already sort first in the results list itself
              (is_featured drives the fetch's order()), so this repeated the
              same people in a second presentation immediately above them.
              Only this render block and its now-dead `featuredTeachers`
              local are deleted; the query, the select and the order() chain
              are untouched. */}

          {/* Five list states (design.md Section 3). */}
          {viewMode === 'papers' ? (
            /* In-place papers mode — same page, same filters, no navigation.
               A simpler subset of PaperResults.tsx's own states (loading/
               error/empty/results/load-more), reusing this page's existing
               subjects/classes/boards filter state rather than a second
               parallel filter UI. */
            <div>
              <h2 className="sr-only">Past papers</h2>
              {papersLoadError ? (
                <ListError onRetry={() => setPapersRetryToken((t) => t + 1)} />
              ) : papersLoading ? (
                <ListLoading count={8} media={96} lines={2} />
              ) : papers.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {papers.map((p) => (
                      <PaperSheetCard key={p.id} paper={p} className="h-full" />
                    ))}
                  </div>
                  {papers.length < papersTotal ? (
                    <div className="mt-8 flex justify-center">
                      <Button
                        variant="muted"
                        size={46}
                        disabled={papersLoadingMore}
                        onClick={async () => {
                          setPapersLoadingMore(true);
                          try {
                            const nextPage = papersPage + 1;
                            const from = nextPage * PAPERS_PAGE_SIZE;
                            let query = supabase
                              .from('papers')
                              .select('id,title,school,subject,class,board,exam_type,year,file_url')
                              .eq('is_published', true);
                            if (filters.subjects.length > 1) query = query.in('subject', filters.subjects);
                            else if (filters.subjects.length === 1) query = query.eq('subject', filters.subjects[0]);
                            if (filters.classes.length > 1) query = query.in('class', filters.classes);
                            else if (filters.classes.length === 1) query = query.eq('class', filters.classes[0]);
                            if (filters.boards.length > 1) query = query.in('board', filters.boards);
                            else if (filters.boards.length === 1) query = query.eq('board', filters.boards[0]);
                            const { data, error } = await query
                              .order('year', { ascending: false })
                              .order('school', { ascending: true })
                              .range(from - (bankPapersRef.current?.length ?? 0), from - (bankPapersRef.current?.length ?? 0) + PAPERS_PAGE_SIZE - 1);
                            if (error) throw error;
                            setPapers((prev) => [...prev, ...((data as PaperSheetCardPaper[]) ?? [])]);
                            setPapersPage(nextPage);
                          } catch {
                            // Leave existing results in place; try again on next click.
                          } finally {
                            setPapersLoadingMore(false);
                          }
                        }}
                      >
                        {papersLoadingMore ? 'Loading…' : 'Load more'}
                      </Button>
                    </div>
                  ) : (
                    <ListEnd count={papers.length} />
                  )}
                </>
              ) : (
                <ListEmpty line="No papers match these filters. Try a different subject, class or board." />
              )}
            </div>
          ) : fetchError ? (
            <ListError onRetry={handleRetry} />
          ) : loading ? (
            <ListLoading count={8} media={96} lines={2} />
          ) : displayedTeachers.length > 0 ? (
            <div>
              {/* Each result card titles itself with an h3. Without a section
                  heading above them the page ran h1 -> h3. The h1 already states
                  the count visibly, so this level is supplied to assistive tech
                  only rather than drawing a title the mockup does not show. */}
              <h2 className="sr-only">Teachers</h2>
              {/* Every teacher here travels to a Kolkata address, so a reader in
                  another state is filtering a list that cannot reach them. */}
              <RegionNotice
                className="mb-3"
                onWantRemote={() => {
                  if (!filters.modeOfTeaching.includes('Online')) {
                    setFilters({ ...filters, modeOfTeaching: [...filters.modeOfTeaching, 'Online'] });
                  }
                }}
              />
              {/* Mobile: result rows. Desktop: three-column card grid
                  (design.md Section 5 / C-048). Same data, two TeacherCard variants. */}
              <div className="flex flex-col gap-[10px] lg:hidden">
                {enrichedDisplayedTeachers.map(({ teacher, firstSubject, firstArea, meta, experienceYears }) => (
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
                    variant="row"
                    whatsappLink={(teacher as { whatsapp_link?: string | null }).whatsapp_link ?? null}
                    experienceYears={experienceYears}
                    minFees={(teacher as { _minFees?: number | null })._minFees ?? null}
                    maxFees={(teacher as { _maxFees?: number | null })._maxFees ?? null}
                    area={firstArea}
                  />
                ))}
              </div>

              {/* 4 columns from xl. At 1900px three columns gave each card a
                  ~450px photo, which is a portrait gallery rather than a list
                  you scan — the whole point of this page is comparing many
                  teachers at once. gap tightened with it. */}
              <div className="hidden grid-cols-3 gap-[14px] stagger-children lg:grid xl:grid-cols-4">
                {enrichedDisplayedTeachers.map(({ teacher, firstSubject, firstArea, meta, experienceYears }, cardIndex) => {
                  return (
                    /* micro-06 rule 7: "Nothing animates on page load except the
                       entrance fade-up on the first fold." Every card in the
                       list carried animate-card-reveal, so all 24 ran their
                       0.45s reveal at once — including cards four thousand
                       pixels down, which finish long before anyone scrolls to
                       them. That is the rule broken and the paint wasted at the
                       same time: invisible motion, on the page that renders the
                       most cards, on the phones least able to afford it. Only
                       the first row of three can be on screen at load. */
                    <div key={teacher.id} className={cardIndex < 3 ? 'h-full animate-card-reveal' : 'h-full'}>
                      <TeacherCard
                        id={teacher.id}
                        name={teacher.name}
                        slug={teacher.slug}
                        subject={firstSubject}
                        subjectSlug={teacher.subjects?.slug}
                        imageUrl={teacher.image_url ?? undefined}
                        sirMaam={(teacher as { sir_maam?: string | null }).sir_maam ?? null}
                        meta={meta || undefined}
                        isFeatured={!!teacher.is_featured}
                        variant="grid"
                        whatsappLink={(teacher as { whatsapp_link?: string | null }).whatsapp_link ?? null}
                        experienceYears={experienceYears}
                        minFees={(teacher as { _minFees?: number | null })._minFees ?? null}
                        maxFees={(teacher as { _maxFees?: number | null })._maxFees ?? null}
                        area={firstArea}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Page size 24, explicit "Load more" -- never infinite scroll. */}
              {hasMore ? (
                <div className="mt-8 flex justify-center">
                  <Button variant="muted" size={46} onClick={handleLoadMore}>
                    Load more
                  </Button>
                </div>
              ) : (
                /* "Widen your area" now clears just the area facet rather than
                   every filter — the sentence names one thing, so it should do
                   that one thing and leave the subject/class the user chose
                   alone. Omitted entirely when no area is set, so the link is
                   never offered with nothing to widen. */
                <ListEnd
                  count={teachers.length}
                  onWiden={
                    filters.areas.length > 0
                      ? () => setFilters({ ...filters, areas: [] })
                      : undefined
                  }
                />
              )}
            </div>
          ) : isDefaultView ? (
            // Empty, no data yet -- never advertise emptiness (design.md Section 3.2).
            <ListEmpty line="Kolkata's verified tutors, across every subject and board." />
          ) : (
            <ListOverFiltered onClear={clearFilters} count={filterCount} />
          )}
        </BentoPanel>
      </div>

      {/* Handoff B-016: "{Subject} papers too" promo becomes a BentoPanel
          (orange-tinted, indigo CTA into the papers surface, subject filter
          carried through so the handoff lands pre-filtered). Real counts
          only (papers table, is_published + subject match); the whole card
          is skipped if the subject has no published papers rather than
          showing a zero or fabricated stat. */}
      {isSubjectPage && subjectPapers && subjectPapers.count > 0 && (
        <BentoPanel fill="brandTint" className="p-[22px]">
            <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] lg:text-[26px] text-brand-deep">
              {pageContext!.label} papers too
            </h2>
            <p className="mt-2 max-w-prose text-body-secondary text-warm-prose lg:text-[16px] lg:leading-[1.65]">
              {subjectPapers.count} past {pageContext!.label.toLowerCase()} paper{subjectPapers.count === 1 ? '' : 's'} from{' '}
              {subjectPapers.schools} Kolkata school{subjectPapers.schools === 1 ? '' : 's'}, free to read.
            </p>
            <div className="mt-6">
              <Button
                asChild
                variant="indigo"
                size={44}
              >
                <Link to={`${PAST_PAPERS_PATH}/results?filter_subjects=${encodeURIComponent(pageContext!.label)}`}>
                  Open {pageContext!.label.toLowerCase()} papers
                </Link>
              </Button>
            </div>
        </BentoPanel>
      )}

      {/* Handoff B-016: "{Subject} tuition, by area" link grid becomes a
          BentoPanel -- real Kolkata localities from utils/searchFacets AREAS
          (the same list the filter panel's Area facet uses), routed through
          the existing filter_areas query param so the URL contract is
          untouched. */}
      {isSubjectPage && (
        <BentoPanel fill="card" className="p-[22px]">
          <h2 className="font-display text-[21px] font-extrabold tracking-[-0.03em] lg:text-[26px] text-foreground">
            {pageContext!.label} tuition, by area
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Ballygunge', 'Salt Lake', 'Behala', 'Alipore', 'Gariahat', 'Kasba', 'Howrah', 'Dum Dum'].map((area) => (
              <Link
                key={area}
                to={`${location.pathname}?filter_subjects=${encodeURIComponent(pageContext!.label)}&filter_areas=${encodeURIComponent(area)}`}
                className={cn(chipVariants({ tone: 'facet', size: 44 }), 'tap-44 active:scale-[0.97] hover:-translate-y-0.5')}
              >
                {area}
              </Link>
            ))}
          </div>
        </BentoPanel>
      )}

      </BentoStack>

      {/* pages.md §6 order: facet chips -> result rows -> papers cross-link
          strip -> area pill grid -> SEO prose block -> B2 strip. The prose
          block used to render first, ahead of the cross-link strip and the
          area grid above -- moved here so it sits last, immediately before
          the B2 strip, matching the spec. Not itself a stack panel — not in
          03's geometry appendix / COVERAGE. */}
      {seo?.content && pageContext && <SEOContentBlock content={seo.content} label={pageContext.label} />}

      </PullToRefresh>

      {/* Outside the wrapper on purpose: FilterSheet is a Radix Sheet, which
          portals to document.body regardless of where it's written in JSX —
          it isn't part of the page content the pull gesture shifts. */}
      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onFilterChange={setFilters}
        resultCount={teachers.length}
        onClear={clearFilters}
      />
    </div>
  );
}
