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
 */
export function createFuseInstance<T extends SearchableRecord>(records: T[]) {
  return new Fuse(records, {
    keys: [
      { name: 'name', weight: 0.4 }, // Teacher name has highest weight
      { name: 'subjects', weight: 0.3 }, // Subjects are important
      { name: 'area', weight: 0.2 }, // Areas are moderately important
      { name: 'classesBackend', weight: 0.05 }, // Classes backend
      { name: 'classesDisplay', weight: 0.05 }, // Classes display
    ],
    threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
    // Lower threshold = stricter matching (fewer results)
    // Higher threshold = more lenient matching (more results)
    includeScore: true,
    minMatchCharLength: 2, // Minimum character length to trigger fuzzy search
    ignoreLocation: true, // Don't care where in the string the match occurs
    findAllMatches: true, // Return all matches, not just the first
  });
}

/**
 * Perform fuzzy search on records
 * Returns records that match the search query with a relevance score
 */
export function fuzzySearch<T extends SearchableRecord>(
  records: T[],
  query: string
): T[] {
  if (!query || query.trim().length < 2) {
    return records; // Return all records if query is too short
  }

  const fuse = createFuseInstance(records);
  const results = fuse.search(query.trim());
  
  // Return records sorted by relevance (best matches first)
  // Fuse.js returns results with score and item, we just need the item
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

