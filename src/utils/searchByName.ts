import Fuse from 'fuse.js';

// Define the interface for your Teacher record
// Make sure this matches your actual data structure
export interface TeacherRecord {
  id: string | number;
  name: string;
  // ... other fields are optional for name search, but good to have
  [key: string]: any;
}

// Configuration options for Fuse.js
const fuseOptions = {
  includeScore: true,
  // Threshold: 0.0 is perfect match, 1.0 is match anything.
  // 0.3 is usually the sweet spot for names (handles "Rahull" -> "Rahul")
  threshold: 0.3, 
  keys: ['name'], // We ONLY search the name field here
  minMatchCharLength: 3, // Don't search for "Al" or "Ed" to avoid noise
};

/**
 * Performs a fuzzy search on teacher names.
 * @param records All teacher records
 * @param query The search string (e.g., "Rahul", "Priya Ma'am")
 * @returns Array of matching teacher records with scores
 */
export function searchByNameWithScores<T extends TeacherRecord>(
  records: T[], 
  query: string
): Array<{ item: T; score: number }> {
  // 1. Sanity Check
  if (!query || query.trim().length < 3) {
    return []; // Return empty if query is too short
  }

  // 2. Initialize Fuse
  const fuse = new Fuse(records, fuseOptions);

  // 3. Search and return with scores
  const results = fuse.search(query);
  return results.map(result => ({
    item: result.item,
    score: result.score || 1.0 // Lower score = better match
  }));
}

/**
 * Performs a fuzzy search on teacher names.
 * @param records All teacher records
 * @param query The search string (e.g., "Rahul", "Priya Ma'am")
 * @returns Array of matching teacher records
 */
export function searchByName<T extends TeacherRecord>(records: T[], query: string): T[] {
  const results = searchByNameWithScores(records, query);
  return results.map(result => result.item);
}

