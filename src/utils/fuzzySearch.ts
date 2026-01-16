import Fuse from 'fuse.js';

export interface SearchableRecord {
  name?: string;
  subjects?: string;
  area?: string;
  classesBackend?: string;
  classesDisplay?: string;
  [key: string]: any;
}

/**
 * Common prepositions and non-essential words to ignore in search
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'the', 'this', 'these', 'those',
  'teachers', 'teacher', 'tuition', 'tutor', 'tutors', 'class', 'classes'
]);

/**
 * Normalize search terms (e.g., "grade" -> "class", "mathematics" -> "maths")
 */
function normalizeSearchTerm(term: string): string {
  let lower = term.toLowerCase().trim();
  
  // Map "grade" to "class" for class searches
  if (lower === 'grade' || lower.startsWith('grade ')) {
    lower = lower.replace(/^grade\s*/, 'class ');
  }
  
  // Map "std" to "class"
  if (lower === 'std' || lower.startsWith('std ')) {
    lower = lower.replace(/^std\s*/, 'class ');
  }
  
  // Map "standard" to "class"
  if (lower === 'standard' || lower.startsWith('standard ')) {
    lower = lower.replace(/^standard\s*/i, 'class ');
  }
  
  // Map "mathematics" to "maths"
  if (lower === 'mathematics' || lower.includes('mathematics')) {
    lower = lower.replace(/mathematics/gi, 'maths');
  }
  
  return lower;
}

/**
 * Clean and normalize search query by removing stop words and normalizing terms
 */
function cleanSearchQuery(query: string): string[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 0)
    .filter(word => !STOP_WORDS.has(word))
    .map(word => normalizeSearchTerm(word))
    .filter(word => word.length > 0);
  
  return words;
}

/**
 * Fuzzy search configuration for teacher name search
 * Uses threshold 0.2 for name searches (stricter matching)
 */
export function createNameFuseInstance<T extends SearchableRecord>(records: T[]) {
  return new Fuse(records, {
    keys: [
      { name: 'name', weight: 0.4 }, // Teacher name has high weight
      { name: 'subjects', weight: 0.25 }, // Subjects are important
      { name: 'area', weight: 0.25 }, // Areas are equally important
      { name: 'classesBackend', weight: 0.05 }, // Classes backend
      { name: 'classesDisplay', weight: 0.05 }, // Classes display
    ],
    threshold: 0.2, // Stricter for name searches
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: false,
    findAllMatches: false,
    distance: 100,
    shouldSort: true,
  });
}

/**
 * Fuzzy search configuration for subject search
 * Uses threshold 0.4 for subject searches (more lenient matching)
 */
export function createSubjectFuseInstance<T extends SearchableRecord>(records: T[]) {
  return new Fuse(records, {
    keys: [
      { name: 'subjects', weight: 0.4 }, // Subjects have high weight for subject searches
      { name: 'area', weight: 0.3 }, // Areas are very important
      { name: 'name', weight: 0.15 }, // Name is less important
      { name: 'classesBackend', weight: 0.075 }, // Classes backend
      { name: 'classesDisplay', weight: 0.075 }, // Classes display
    ],
    threshold: 0.4, // More lenient for subject searches
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: false,
    findAllMatches: false,
    distance: 100,
    shouldSort: true,
  });
}

/**
 * Fuzzy search configuration for area search
 * Uses threshold 0.5 for area searches (very lenient matching for area names)
 */
export function createAreaFuseInstance<T extends SearchableRecord>(records: T[]) {
  return new Fuse(records, {
    keys: [
      { name: 'area', weight: 0.6 }, // Areas have highest weight
      { name: 'subjects', weight: 0.2 }, // Subjects are moderately important
      { name: 'name', weight: 0.1 }, // Name is less important
      { name: 'classesBackend', weight: 0.05 }, // Classes backend
      { name: 'classesDisplay', weight: 0.05 }, // Classes display
    ],
    threshold: 0.5, // Very lenient for area searches (handles typos better)
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: false,
    findAllMatches: false,
    distance: 100,
    shouldSort: true,
  });
}

/**
 * Categorize words into subjects, areas, classes, and names for better matching
 */
function categorizeWords(words: string[]) {
  const classes: string[] = [];
  const subjects: string[] = [];
  const areas: string[] = [];
  const names: string[] = [];
  
  words.forEach(word => {
    const lower = word.toLowerCase();
    // Check if it's a class number
    if (/^\d+$/.test(word) || lower.includes('class') || lower.includes('grade') || 
        lower.includes('std') || lower.includes('standard')) {
      classes.push(word);
    }
    // Check if it's likely an area
    else if (lower.includes('lake') || lower.includes('town') || lower.includes('street') ||
             lower.includes('road') || lower.includes('avenue') || lower.includes('park') ||
             lower.includes('howrah') || lower.includes('behala') || lower.includes('salt') ||
             lower.includes('new') || lower.includes('old') || word.length > 5) {
      areas.push(word);
    }
    // Check if it's likely a subject (common subject names)
    else if (lower.includes('math') || lower.includes('physics') || lower.includes('chemistry') ||
             lower.includes('biology') || lower.includes('english') || lower.includes('hindi') ||
             lower.includes('history') || lower.includes('geography') || lower.includes('economics') ||
             lower.includes('accounts') || lower.includes('commerce') || word.length > 4) {
      subjects.push(word);
    }
    // Otherwise, treat as potential name
    else {
      names.push(word);
    }
  });
  
  return { classes, subjects, areas, names };
}

/**
 * Check if a record matches all words in a query (AND search)
 * Also checks for normalized terms (e.g., "grade" matches "class")
 */
function matchesAllWords<T extends SearchableRecord>(record: T, words: string[]): boolean {
  return words.every(word => {
    const wordLower = word.toLowerCase();
    const normalizedWord = normalizeSearchTerm(word);
    
    // Check original word
    const matchesOriginal = (
      record.name?.toLowerCase().includes(wordLower) ||
      record.subjects?.toLowerCase().includes(wordLower) ||
      record.area?.toLowerCase().includes(wordLower) ||
      record.classesBackend?.toLowerCase().includes(wordLower) ||
      record.classesDisplay?.toLowerCase().includes(wordLower)
    );
    
    // Also check normalized version (e.g., "grade 9" should match "class 9")
    if (normalizedWord !== wordLower) {
      const matchesNormalized = (
        record.name?.toLowerCase().includes(normalizedWord) ||
        record.subjects?.toLowerCase().includes(normalizedWord) ||
        record.area?.toLowerCase().includes(normalizedWord) ||
        record.classesBackend?.toLowerCase().includes(normalizedWord) ||
        record.classesDisplay?.toLowerCase().includes(normalizedWord)
      );
      return matchesOriginal || matchesNormalized;
    }
    
    return matchesOriginal;
  });
}

/**
 * Perform fuzzy search on records with exact match prioritization
 * Uses threshold 0.2 for name searches and 0.4 for subject searches
 * For multi-word queries, performs AND search (all words must match)
 * Returns records that match the search query, prioritizing exact matches
 */
export function fuzzySearch<T extends SearchableRecord>(
  records: T[],
  query: string
): T[] {
  if (!query || query.trim().length < 2) {
    return records; // Return all records if query is too short
  }

  // Clean query: remove stop words and normalize terms
  const cleanedWords = cleanSearchQuery(query);
  
  if (cleanedWords.length === 0) {
    return records; // If all words were stop words, return all records
  }

  const trimmedQuery = cleanedWords.join(' ').toLowerCase();
  const words = cleanedWords;
  const isMultiWord = words.length > 1;

  // For multi-word queries, use AND logic with optimized relevance scoring
  if (isMultiWord) {
    const exactMatches: T[] = [];
    const fuzzyMatches: T[] = [];
    const categorized = categorizeWords(words);

    // First, find exact matches where ALL words match
    records.forEach(record => {
      if (matchesAllWords(record, words)) {
        exactMatches.push(record);
      }
    });

    // Enhanced relevance scoring: prioritize subjects > areas > classes > names
    exactMatches.sort((a, b) => {
      // Score based on subject matches (highest priority)
      const aSubjectScore = categorized.subjects.filter(word => 
        a.subjects?.toLowerCase().includes(word.toLowerCase())
      ).length * 10;
      const bSubjectScore = categorized.subjects.filter(word => 
        b.subjects?.toLowerCase().includes(word.toLowerCase())
      ).length * 10;
      if (aSubjectScore !== bSubjectScore) return bSubjectScore - aSubjectScore;

      // Score based on area matches
      const aAreaScore = categorized.areas.filter(word => 
        a.area?.toLowerCase().includes(word.toLowerCase())
      ).length * 8;
      const bAreaScore = categorized.areas.filter(word => 
        b.area?.toLowerCase().includes(word.toLowerCase())
      ).length * 8;
      if (aAreaScore !== bAreaScore) return bAreaScore - aAreaScore;

      // Score based on class matches
      const aClassScore = categorized.classes.filter(word => {
        const lower = word.toLowerCase();
        return a.classesBackend?.toLowerCase().includes(lower) ||
               a.classesDisplay?.toLowerCase().includes(lower);
      }).length * 6;
      const bClassScore = categorized.classes.filter(word => {
        const lower = word.toLowerCase();
        return b.classesBackend?.toLowerCase().includes(lower) ||
               b.classesDisplay?.toLowerCase().includes(lower);
      }).length * 6;
      if (aClassScore !== bClassScore) return bClassScore - aClassScore;

      // Score based on name matches (lowest priority)
      const aNameScore = categorized.names.filter(word => 
        a.name?.toLowerCase().includes(word.toLowerCase())
      ).length * 2;
      const bNameScore = categorized.names.filter(word => 
        b.name?.toLowerCase().includes(word.toLowerCase())
      ).length * 2;
      if (aNameScore !== bNameScore) return bNameScore - aNameScore;

      return 0;
    });

    // If we have exact matches, use them
    if (exactMatches.length > 0) {
      // For fuzzy matches, search each word individually with fuzzy search and find intersection
      // For longer queries (3+ words), be more selective to avoid too many results
      const maxFuzzyResults = words.length > 3 ? 10 : 20;
      
      if (exactMatches.length < maxFuzzyResults) {
        const exactSlugs = new Set(exactMatches.map((r: any) => r.Slug));
        const remainingRecords = records.filter((r: any) => !exactSlugs.has(r.Slug));
        
        // Search for each word with fuzzy search, prioritizing important word types
        const wordMatches: Map<string, Set<T>> = new Map();
        
        // Search in priority order: subjects > areas > classes > names
        const searchOrder = [
          ...categorized.subjects,
          ...categorized.areas,
          ...categorized.classes,
          ...categorized.names
        ];
        
        searchOrder.forEach(word => {
          const isLikelyArea = categorized.areas.includes(word);
          const isLikelySubject = categorized.subjects.includes(word);
          const isLikelyClass = categorized.classes.includes(word);
          
          const fuse = isLikelyArea
            ? createAreaFuseInstance(remainingRecords)
            : isLikelySubject
            ? createSubjectFuseInstance(remainingRecords)
            : isLikelyClass
            ? createNameFuseInstance(remainingRecords)
            : createNameFuseInstance(remainingRecords);
          
          const results = fuse.search(word);
          // Limit results per word for longer queries to improve performance
          const limit = words.length > 3 ? 50 : 100;
          const matchedRecords = new Set(
            results.slice(0, limit).map(result => result.item)
          );
          wordMatches.set(word, matchedRecords);
        });

        // Find intersection: records that appear in all word match sets
        if (wordMatches.size > 0) {
          // Start with the smallest set for efficiency
          const sortedWordMatches = Array.from(wordMatches.entries())
            .sort((a, b) => a[1].size - b[1].size);
          
          if (sortedWordMatches.length > 0) {
            const [firstWord, firstSet] = sortedWordMatches[0];
            const otherSets = sortedWordMatches.slice(1).map(([_, set]) => set);
            
            for (const record of firstSet) {
              const matchesAll = otherSets.every(matchSet => matchSet.has(record));
              if (matchesAll) {
                fuzzyMatches.push(record);
              }
            }
          }
        }
        
        // Sort fuzzy matches by relevance using same scoring as exact matches
        fuzzyMatches.sort((a, b) => {
          const aSubjectScore = categorized.subjects.filter(word => 
            a.subjects?.toLowerCase().includes(word.toLowerCase())
          ).length * 10;
          const bSubjectScore = categorized.subjects.filter(word => 
            b.subjects?.toLowerCase().includes(word.toLowerCase())
          ).length * 10;
          if (aSubjectScore !== bSubjectScore) return bSubjectScore - aSubjectScore;

          const aAreaScore = categorized.areas.filter(word => 
            a.area?.toLowerCase().includes(word.toLowerCase())
          ).length * 8;
          const bAreaScore = categorized.areas.filter(word => 
            b.area?.toLowerCase().includes(word.toLowerCase())
          ).length * 8;
          if (aAreaScore !== bAreaScore) return bAreaScore - aAreaScore;

          return 0;
        });
      }
      
      return [...exactMatches, ...fuzzyMatches];
    }

    // If no exact matches, use fuzzy search with AND logic and optimized relevance
    const wordMatches: Map<string, Set<T>> = new Map();
    
    // Search in priority order: subjects > areas > classes > names
    const searchOrder = [
      ...categorized.subjects,
      ...categorized.areas,
      ...categorized.classes,
      ...categorized.names
    ];
    
    searchOrder.forEach(word => {
      const isLikelyArea = categorized.areas.includes(word);
      const isLikelySubject = categorized.subjects.includes(word);
      const isLikelyClass = categorized.classes.includes(word);
      
      const fuse = isLikelyArea
        ? createAreaFuseInstance(records)
        : isLikelySubject
        ? createSubjectFuseInstance(records)
        : isLikelyClass
        ? createNameFuseInstance(records)
        : createNameFuseInstance(records);
      
      const results = fuse.search(word);
      // Limit results per word for longer queries to improve performance
      const limit = words.length > 3 ? 50 : 100;
      const matchedRecords = new Set(
        results.slice(0, limit).map(result => result.item)
      );
      wordMatches.set(word, matchedRecords);
    });

    // Find intersection: records that appear in all word match sets
    if (wordMatches.size > 0) {
      // Start with the smallest set for efficiency
      const sortedWordMatches = Array.from(wordMatches.entries())
        .sort((a, b) => a[1].size - b[1].size);
      
      if (sortedWordMatches.length > 0) {
        const [firstWord, firstSet] = sortedWordMatches[0];
        const otherSets = sortedWordMatches.slice(1).map(([_, set]) => set);
        const finalMatches: T[] = [];
        
        for (const record of firstSet) {
          const matchesAll = otherSets.every(matchSet => matchSet.has(record));
          if (matchesAll) {
            finalMatches.push(record);
          }
        }
        
        // Sort by relevance: subjects > areas > classes > names
        finalMatches.sort((a, b) => {
          const aSubjectScore = categorized.subjects.filter(word => 
            a.subjects?.toLowerCase().includes(word.toLowerCase())
          ).length * 10;
          const bSubjectScore = categorized.subjects.filter(word => 
            b.subjects?.toLowerCase().includes(word.toLowerCase())
          ).length * 10;
          if (aSubjectScore !== bSubjectScore) return bSubjectScore - aSubjectScore;

          const aAreaScore = categorized.areas.filter(word => 
            a.area?.toLowerCase().includes(word.toLowerCase())
          ).length * 8;
          const bAreaScore = categorized.areas.filter(word => 
            b.area?.toLowerCase().includes(word.toLowerCase())
          ).length * 8;
          if (aAreaScore !== bAreaScore) return bAreaScore - aAreaScore;

          const aClassScore = categorized.classes.filter(word => {
            const lower = word.toLowerCase();
            return a.classesBackend?.toLowerCase().includes(lower) ||
                   a.classesDisplay?.toLowerCase().includes(lower);
          }).length * 6;
          const bClassScore = categorized.classes.filter(word => {
            const lower = word.toLowerCase();
            return b.classesBackend?.toLowerCase().includes(lower) ||
                   b.classesDisplay?.toLowerCase().includes(lower);
          }).length * 6;
          if (aClassScore !== bClassScore) return bClassScore - aClassScore;

          return 0;
        });
        
        return finalMatches;
      }
    }

    return [];
  }

  // Single word search - use existing logic
  const exactMatches: T[] = [];
  const fuzzyMatches: T[] = [];

  // Check if query looks like a name (not a common subject/area/class word)
  const commonSubjects = ['math', 'physics', 'chemistry', 'biology', 'english', 'hindi', 'history', 
    'geography', 'economics', 'accounts', 'commerce', 'computer', 'science', 'drawing'];
  const commonAreas = ['lake', 'town', 'street', 'road', 'avenue', 'park', 'howrah', 'behala', 
    'salt', 'new', 'old', 'sealdah', 'alipore', 'park'];
  const isLikelyName = trimmedQuery.length >= 3 && 
    !commonSubjects.some(subj => trimmedQuery.includes(subj)) &&
    !commonAreas.some(area => trimmedQuery.includes(area)) &&
    !/^\d+$/.test(trimmedQuery) &&
    !trimmedQuery.includes('class') && !trimmedQuery.includes('grade') && 
    !trimmedQuery.includes('std') && !trimmedQuery.includes('standard');

  // First, find exact matches (highest priority)
  records.forEach(record => {
    const nameMatch = record.name?.toLowerCase().includes(trimmedQuery);
    const subjectsMatch = record.subjects?.includes(trimmedQuery);
    const areaMatch = record.area?.includes(trimmedQuery);
    const classesMatch = record.classesBackend?.includes(trimmedQuery) || 
                         record.classesDisplay?.includes(trimmedQuery);
    
    // For name-like queries, prioritize name matches
    if (isLikelyName) {
      if (nameMatch) {
        exactMatches.push(record);
      }
    } else {
      if (nameMatch || subjectsMatch || areaMatch || classesMatch) {
        exactMatches.push(record);
      }
    }
  });

  // Determine search type: area > subject > name
  // Check if query matches any area names in the records
  const isAreaSearch = !isLikelyName && (
    exactMatches.some(record => 
      record.area?.toLowerCase().includes(trimmedQuery)
    ) || records.some(record => 
      record.area?.toLowerCase().includes(trimmedQuery)
    ) || (
      trimmedQuery.includes('lake') || trimmedQuery.includes('town') || trimmedQuery.includes('street') ||
      trimmedQuery.includes('road') || trimmedQuery.includes('avenue') || trimmedQuery.includes('park') ||
      trimmedQuery.includes('howrah') || trimmedQuery.includes('behala') || trimmedQuery.includes('salt') ||
      trimmedQuery.includes('new') || trimmedQuery.includes('old') || trimmedQuery.length > 5
    )
  );
  
  // Check if query matches any subject names in the records
  const isSubjectSearch = !isLikelyName && !isAreaSearch && (
    exactMatches.some(record => 
      record.subjects?.toLowerCase().includes(trimmedQuery)
    ) || records.some(record => 
      record.subjects?.toLowerCase().includes(trimmedQuery)
    )
  );

  // If we have exact matches, prioritize them
  if (exactMatches.length > 0) {
    // Sort exact matches: name matches first, then subjects, then areas
    exactMatches.sort((a, b) => {
      const aNameMatch = a.name?.toLowerCase().includes(trimmedQuery) ? 1 : 0;
      const bNameMatch = b.name?.toLowerCase().includes(trimmedQuery) ? 1 : 0;
      if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
      
      const aSubjectMatch = a.subjects?.includes(trimmedQuery) ? 1 : 0;
      const bSubjectMatch = b.subjects?.includes(trimmedQuery) ? 1 : 0;
      if (aSubjectMatch !== bSubjectMatch) return bSubjectMatch - aSubjectMatch;
      
      const aAreaMatch = a.area?.toLowerCase().includes(trimmedQuery) ? 1 : 0;
      const bAreaMatch = b.area?.toLowerCase().includes(trimmedQuery) ? 1 : 0;
      if (aAreaMatch !== bAreaMatch) return bAreaMatch - aAreaMatch;
      
      return 0;
    });
    
    // Only use fuzzy search if we have very few exact matches (less than 10)
    if (exactMatches.length < 10) {
      const exactSlugs = new Set(exactMatches.map((r: any) => r.Slug));
      const remainingRecords = records.filter((r: any) => !exactSlugs.has(r.Slug));
      
      if (remainingRecords.length > 0) {
        // Use appropriate fuse instance based on search type
        const fuse = isAreaSearch
          ? createAreaFuseInstance(remainingRecords)
          : isSubjectSearch 
          ? createSubjectFuseInstance(remainingRecords)
          : createNameFuseInstance(remainingRecords);
        const fuzzyResults = fuse.search(trimmedQuery);
        
        // For name-like queries, filter to only include results where name field has a match
        // This allows fuzzy matching (typos) but ensures relevance
        if (isLikelyName) {
          const nameFuzzyMatches = fuzzyResults
            .map(result => ({ item: result.item, score: result.score || 1 }))
            .filter(({ item }) => {
              const name = item.name?.toLowerCase() || '';
              // Check if name contains the query or any word in name starts with query
              // This allows fuzzy matching while ensuring name relevance
              return name.includes(trimmedQuery) ||
                     name.split(/\s+/).some(word => word.startsWith(trimmedQuery)) ||
                     trimmedQuery.split('').every(char => name.includes(char)); // Allow character-based fuzzy
            })
            .sort((a, b) => {
              // Sort by name match quality first, then by fuzzy score
              const aName = a.item.name?.toLowerCase() || '';
              const bName = b.item.name?.toLowerCase() || '';
              const aStartsWith = aName.startsWith(trimmedQuery) ? 1 : 0;
              const bStartsWith = bName.startsWith(trimmedQuery) ? 1 : 0;
              if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;
              return (a.score || 1) - (b.score || 1);
            })
            .map(({ item }) => item);
          fuzzyMatches.push(...nameFuzzyMatches);
        } else {
          fuzzyMatches.push(...fuzzyResults.map(result => result.item));
        }
      }
    }
    
    return [...exactMatches, ...fuzzyMatches];
  }

  // If no exact matches, use fuzzy search with appropriate threshold
  const fuse = isAreaSearch
    ? createAreaFuseInstance(records)
    : isSubjectSearch 
    ? createSubjectFuseInstance(records)
    : createNameFuseInstance(records);
  const results = fuse.search(trimmedQuery);
  
  // For name-like queries, filter to only include results where name field has a match
  // This allows fuzzy matching (typos) but ensures relevance
  if (isLikelyName) {
    const nameMatches = results
      .map(result => ({ item: result.item, score: result.score || 1 }))
      .filter(({ item }) => {
        const name = item.name?.toLowerCase() || '';
        // Check if name contains the query or any word in name starts with query
        // This allows fuzzy matching while ensuring name relevance
        return name.includes(trimmedQuery) ||
               name.split(/\s+/).some(word => word.startsWith(trimmedQuery)) ||
               trimmedQuery.split('').every(char => name.includes(char)); // Allow character-based fuzzy
      })
      .sort((a, b) => {
        // Sort by name match quality first, then by fuzzy score
        const aName = a.item.name?.toLowerCase() || '';
        const bName = b.item.name?.toLowerCase() || '';
        const aStartsWith = aName.startsWith(trimmedQuery) ? 1 : 0;
        const bStartsWith = bName.startsWith(trimmedQuery) ? 1 : 0;
        if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;
        return (a.score || 1) - (b.score || 1);
      })
      .map(({ item }) => item);
    return nameMatches;
  }
  
  // Return records sorted by relevance (best matches first)
  return results.map(result => result.item);
}

/**
 * Prepare a record for fuzzy search by extracting searchable fields
 */
export function prepareRecordForSearch(record: any, teacherName?: string): SearchableRecord & { Slug: string } {
  return {
    name: teacherName || '',
    subjects: (record.Subjects || '').toLowerCase(),
    area: ((record.Area || record["AREAS FOR FILTERING"] || '')).toLowerCase(),
    classesBackend: (record["Classes Taught for Backend"] || '').toLowerCase(),
    classesDisplay: (record["Classes Taught"] || '').toLowerCase(),
    Slug: record.Slug, // Keep Slug for matching
    ...record, // Include original record for reference
  };
}

