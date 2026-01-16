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

  // For multi-word queries, use AND logic
  if (isMultiWord) {
    const exactMatches: T[] = [];
    const fuzzyMatches: T[] = [];

    // First, find exact matches where ALL words match
    records.forEach(record => {
      if (matchesAllWords(record, words)) {
        exactMatches.push(record);
      }
    });

    // Sort exact matches by relevance (prioritize name matches, then subjects, then classes)
    exactMatches.sort((a, b) => {
      // Count how many words match in name
      const aNameMatches = words.filter(word => 
        a.name?.toLowerCase().includes(word.toLowerCase())
      ).length;
      const bNameMatches = words.filter(word => 
        b.name?.toLowerCase().includes(word.toLowerCase())
      ).length;
      if (aNameMatches !== bNameMatches) return bNameMatches - aNameMatches;

      // Count how many words match in subjects
      const aSubjectMatches = words.filter(word => 
        a.subjects?.toLowerCase().includes(word.toLowerCase())
      ).length;
      const bSubjectMatches = words.filter(word => 
        b.subjects?.toLowerCase().includes(word.toLowerCase())
      ).length;
      if (aSubjectMatches !== bSubjectMatches) return bSubjectMatches - aSubjectMatches;

      // Count how many words match in classes
      const aClassMatches = words.filter(word => 
        a.classesBackend?.toLowerCase().includes(word.toLowerCase()) ||
        a.classesDisplay?.toLowerCase().includes(word.toLowerCase())
      ).length;
      const bClassMatches = words.filter(word => 
        b.classesBackend?.toLowerCase().includes(word.toLowerCase()) ||
        b.classesDisplay?.toLowerCase().includes(word.toLowerCase())
      ).length;
      if (aClassMatches !== bClassMatches) return bClassMatches - aClassMatches;

      return 0;
    });

    // If we have exact matches, use them
    if (exactMatches.length > 0) {
      // For fuzzy matches, search each word individually with fuzzy search and find intersection
      if (exactMatches.length < 20) {
        const exactSlugs = new Set(exactMatches.map((r: any) => r.Slug));
        const remainingRecords = records.filter((r: any) => !exactSlugs.has(r.Slug));
        
        // Search for each word with fuzzy search and find records that match all words
        const wordMatches: Map<string, Set<T>> = new Map();
        
        words.forEach(word => {
          // Determine if word is likely an area, subject, or name/class
          // Areas and subjects are usually longer words, classes are numbers
          const isLikelySubjectOrArea = word.length > 3 && !/^\d+$/.test(word);
          
          // Check if word might be an area name (common area patterns)
          const isLikelyArea = isLikelySubjectOrArea && (
            word.includes('lake') || word.includes('town') || word.includes('street') ||
            word.includes('road') || word.includes('avenue') || word.includes('park') ||
            word.includes('howrah') || word.includes('behala') || word.includes('salt') ||
            word.includes('new') || word.includes('old') || word.length > 5
          );
          
          const fuse = isLikelyArea
            ? createAreaFuseInstance(remainingRecords)
            : isLikelySubjectOrArea
            ? createSubjectFuseInstance(remainingRecords)
            : createNameFuseInstance(remainingRecords);
          
          const results = fuse.search(word);
          const matchedRecords = new Set(results.map(result => result.item));
          wordMatches.set(word, matchedRecords);
        });

        // Find intersection: records that appear in all word match sets
        if (wordMatches.size > 0) {
          const allMatchedRecords = Array.from(wordMatches.values())[0];
          for (const record of allMatchedRecords) {
            const matchesAll = Array.from(wordMatches.values()).every(matchSet => 
              matchSet.has(record)
            );
            if (matchesAll) {
              fuzzyMatches.push(record);
            }
          }
        }
      }
      
      return [...exactMatches, ...fuzzyMatches];
    }

    // If no exact matches, use fuzzy search with AND logic
    const wordMatches: Map<string, Set<T>> = new Map();
    
    words.forEach(word => {
      // Determine if word is likely an area, subject, or name/class
      // Areas and subjects are usually longer words, classes are numbers
      const isLikelySubjectOrArea = word.length > 3 && !/^\d+$/.test(word);
      
      // Check if word might be an area name (common area patterns)
      const isLikelyArea = isLikelySubjectOrArea && (
        word.includes('lake') || word.includes('town') || word.includes('street') ||
        word.includes('road') || word.includes('avenue') || word.includes('park') ||
        word.includes('howrah') || word.includes('behala') || word.includes('salt') ||
        word.includes('new') || word.includes('old') || word.length > 5
      );
      
      const fuse = isLikelyArea
        ? createAreaFuseInstance(records)
        : isLikelySubjectOrArea
        ? createSubjectFuseInstance(records)
        : createNameFuseInstance(records);
      
      const results = fuse.search(word);
      const matchedRecords = new Set(results.map(result => result.item));
      wordMatches.set(word, matchedRecords);
    });

    // Find intersection: records that appear in all word match sets
    if (wordMatches.size > 0) {
      const allMatchedRecords = Array.from(wordMatches.values())[0];
      const finalMatches: T[] = [];
      
      for (const record of allMatchedRecords) {
        const matchesAll = Array.from(wordMatches.values()).every(matchSet => 
          matchSet.has(record)
        );
        if (matchesAll) {
          finalMatches.push(record);
        }
      }
      
      return finalMatches;
    }

    return [];
  }

  // Single word search - use existing logic
  const exactMatches: T[] = [];
  const fuzzyMatches: T[] = [];

  // First, find exact matches (highest priority)
  records.forEach(record => {
    const nameMatch = record.name?.toLowerCase().includes(trimmedQuery);
    const subjectsMatch = record.subjects?.includes(trimmedQuery);
    const areaMatch = record.area?.includes(trimmedQuery);
    const classesMatch = record.classesBackend?.includes(trimmedQuery) || 
                         record.classesDisplay?.includes(trimmedQuery);
    
    if (nameMatch || subjectsMatch || areaMatch || classesMatch) {
      exactMatches.push(record);
    }
  });

  // Determine if this is primarily a subject search or name search
  // Check if query matches any subject names in the records
  const isSubjectSearch = exactMatches.some(record => 
    record.subjects?.toLowerCase().includes(trimmedQuery)
  ) || records.some(record => 
    record.subjects?.toLowerCase().includes(trimmedQuery)
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
      
      return 0;
    });
    
    // Only use fuzzy search if we have very few exact matches (less than 10)
    if (exactMatches.length < 10) {
      const exactSlugs = new Set(exactMatches.map((r: any) => r.Slug));
      const remainingRecords = records.filter((r: any) => !exactSlugs.has(r.Slug));
      
      if (remainingRecords.length > 0) {
        // Use appropriate fuse instance based on search type
        const fuse = isSubjectSearch 
          ? createSubjectFuseInstance(remainingRecords)
          : createNameFuseInstance(remainingRecords);
        const fuzzyResults = fuse.search(trimmedQuery);
        fuzzyMatches.push(...fuzzyResults.map(result => result.item));
      }
    }
    
    return [...exactMatches, ...fuzzyMatches];
  }

  // If no exact matches, use fuzzy search with appropriate threshold
  const fuse = isSubjectSearch 
    ? createSubjectFuseInstance(records)
    : createNameFuseInstance(records);
  const results = fuse.search(trimmedQuery);
  
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

