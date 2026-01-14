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
 * Fuzzy search configuration for teacher search
 * Searches across name, subjects, areas, and classes
 * Stricter threshold for better relevance
 */
export function createFuseInstance<T extends SearchableRecord>(records: T[]) {
  return new Fuse(records, {
    keys: [
      { name: 'name', weight: 0.5 }, // Teacher name has highest weight
      { name: 'subjects', weight: 0.3 }, // Subjects are important
      { name: 'area', weight: 0.15 }, // Areas are moderately important
      { name: 'classesBackend', weight: 0.025 }, // Classes backend
      { name: 'classesDisplay', weight: 0.025 }, // Classes display
    ],
    threshold: 0.2, // 0.0 = perfect match, 1.0 = match anything
    // Lower threshold = stricter matching (fewer, more relevant results)
    // 0.2 means matches must be quite close to the query
    includeScore: true,
    minMatchCharLength: 2, // Minimum character length to trigger fuzzy search
    ignoreLocation: false, // Prioritize matches at the start of strings
    findAllMatches: false, // Return only the best matches
    distance: 100, // Maximum distance for a match (lower = stricter)
    shouldSort: true, // Sort results by relevance
  });
}

/**
 * Perform fuzzy search on records with exact match prioritization
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
        const fuse = createFuseInstance(remainingRecords);
        const fuzzyResults = fuse.search(trimmedQuery);
        fuzzyMatches.push(...fuzzyResults.map(result => result.item));
      }
    }
    
    return [...exactMatches, ...fuzzyMatches];
  }

  // If no exact matches, use fuzzy search but with stricter criteria
  const fuse = createFuseInstance(records);
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

