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
 * Fuzzy search configuration for teacher name search
 * Uses threshold 0.3 for name searches (stricter matching)
 */
export function createNameFuseInstance<T extends SearchableRecord>(records: T[]) {
  return new Fuse(records, {
    keys: [
      { name: 'name', weight: 0.5 }, // Teacher name has highest weight
      { name: 'subjects', weight: 0.3 }, // Subjects are important
      { name: 'area', weight: 0.15 }, // Areas are moderately important
      { name: 'classesBackend', weight: 0.025 }, // Classes backend
      { name: 'classesDisplay', weight: 0.025 }, // Classes display
    ],
    threshold: 0.3, // Stricter for name searches
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
      { name: 'subjects', weight: 0.6 }, // Subjects have highest weight for subject searches
      { name: 'name', weight: 0.2 }, // Name is less important
      { name: 'area', weight: 0.1 }, // Areas are moderately important
      { name: 'classesBackend', weight: 0.05 }, // Classes backend
      { name: 'classesDisplay', weight: 0.05 }, // Classes display
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
 * Perform fuzzy search on records with exact match prioritization
 * Uses threshold 0.3 for name searches and 0.4 for subject searches
 * Returns records that match the search query, prioritizing exact matches
 */
export function fuzzySearch<T extends SearchableRecord>(
  records: T[],
  query: string
): T[] {
  if (!query || query.trim().length < 2) {
    return records; // Return all records if query is too short
  }

  const trimmedQuery = query.trim().toLowerCase();
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

