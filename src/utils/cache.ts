/**
 * Cache utility for client-side data caching
 * Uses localStorage with TTL (time-to-live) support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SUBJECTS: 24 * 60 * 60 * 1000, // 24 hours - subjects rarely change
  TEACHERS_LIST: 30 * 60 * 1000, // 30 minutes - teachers update occasionally
  SHIKSHAQMINE: 30 * 60 * 1000, // 30 minutes - Shikshaqmine data updates occasionally
  TEACHER_PROFILE: 15 * 60 * 1000, // 15 minutes - individual teacher profiles
  FEATURED_TEACHERS: 10 * 60 * 1000, // 10 minutes - featured teachers update more frequently
  UPVOTES: 5 * 60 * 1000, // 5 minutes - upvote counts change frequently
  SHIKSHAQMINE_CHUNK: 30 * 60 * 1000, // 30 minutes - for chunked Shikshaqmine fetches
} as const;

const CACHE_PREFIX = 'shikshaq_cache_';

/**
 * Get a cached value if it exists and hasn't expired
 */
export function getCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache has expired
    if (now - entry.timestamp > entry.ttl) {
      // Cache expired, remove it
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Cache read error:', error);
    }
    return null;
  }
}

/**
 * Set a value in cache with TTL
 */
export function setCache<T>(key: string, data: T, ttl: number): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    // If storage is full, try to clear old cache entries
    if (error instanceof DOMException && error.code === 22) {
      clearExpiredCache();
      try {
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
          ttl,
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch (retryError) {
        if (import.meta.env.DEV) {
          console.warn('Cache write error after cleanup:', retryError);
        }
      }
    } else {
      if (import.meta.env.DEV) {
        console.warn('Cache write error:', error);
      }
    }
  }
}

/**
 * Remove a specific cache entry
 */
export function removeCache(key: string): void {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Cache remove error:', error);
    }
  }
}

/**
 * Clear all expired cache entries
 */
export function clearExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (now - entry.timestamp > entry.ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Cache cleanup error:', error);
    }
  }
}

/**
 * Clear all cache entries (useful for testing or forced refresh)
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Cache clear error:', error);
    }
  }
}

/**
 * Generate cache key for teachers list query
 */
export function getTeachersListCacheKey(limit?: number): string {
  return `teachers_list_${limit || 200}`;
}

/**
 * Generate cache key for Shikshaqmine chunk query
 */
export function getShikshaqmineChunkCacheKey(slugs: string[]): string {
  // Sort slugs for consistent cache key
  const sortedSlugs = [...slugs].sort().join(',');
  return `shikshaqmine_chunk_${sortedSlugs}`;
}

/**
 * Generate cache key for teacher profile
 */
export function getTeacherProfileCacheKey(slug: string): string {
  return `teacher_profile_${slug}`;
}

/**
 * Generate cache key for Shikshaqmine by slug
 */
export function getShikshaqmineBySlugCacheKey(slug: string): string {
  return `shikshaqmine_slug_${slug}`;
}

/**
 * Invalidate cache for a specific teacher (when teacher data is updated)
 */
export function invalidateTeacherCache(slug: string): void {
  removeCache(getTeacherProfileCacheKey(slug));
  removeCache(getShikshaqmineBySlugCacheKey(slug));
  // Also clear teachers list cache since it might include this teacher
  // Clear all teachers list cache keys
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX + 'teachers_list_')) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Run cleanup on module load
 */
if (typeof window !== 'undefined') {
  // Clean up expired cache entries on load
  clearExpiredCache();
  
  // Set up periodic cleanup (every hour)
  setInterval(clearExpiredCache, 60 * 60 * 1000);
}
