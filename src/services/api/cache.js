/**
 * API Cache Service
 * 
 * Provides caching for API responses to improve performance and
 * reduce unnecessary API calls. Uses both memory and localStorage
 * for persistent caching between page refreshes.
 */

// In-memory cache for fastest access
const memoryCache = new Map();

// Default TTLs (in seconds)
const CACHE_DURATIONS = {
  MODELS_SHORT: 60, // 1 minute for model lists (frequently updated)
  MODELS_DEFAULT: 300, // 5 minutes for model details
  CATEGORIES: 3600, // 1 hour for categories (rarely change)
  TAGS: 1800, // 30 minutes for tags
  DEFAULT: 300, // 5 minutes default
  VIDEOS: 1800, // 30 minutes for videos
  TRENDING: 300, // 5 minutes for trending models
};

/**
 * Generate a unique cache key for API requests
 * @param {string} prefix - Prefix for the key (e.g., 'models')
 * @param {Object} params - The request parameters
 * @returns {string} The cache key
 */
export function generateCacheKey(prefix, params) {
  // Sort params to ensure consistent key generation
  const sortedParams = Object.entries(params || {})
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => {
      // Handle array values by sorting and joining
      if (Array.isArray(value)) {
        return `${key}=${value.sort().join(',')}`;
      }
      return `${key}=${value}`;
    })
    .join('&');

  return `${prefix}:${sortedParams}`;
}

/**
 * Set a value in both memory and localStorage cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - TTL in seconds
 */
export function setCacheValue(key, value, ttl = CACHE_DURATIONS.DEFAULT) {
  if (!key) return;

  const now = Date.now();
  const item = {
    value,
    expires: now + (ttl * 1000),
  };

  // Store in memory
  memoryCache.set(key, item);

  // Store in localStorage for persistence - only if we're in the browser
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
      console.warn('Failed to cache item in localStorage:', err);
      // If localStorage fails (quota exceeded, etc.), just use memory cache
    }
  }
}

/**
 * Get a value from cache, checking expiration
 * @param {string} key - Cache key
 * @returns {any|null} Cached value or null if expired/not found
 */
export function getCacheValue(key) {
  if (!key) return null;
  
  // Check memory cache first (faster)
  const memItem = memoryCache.get(key);
  if (memItem) {
    if (memItem.expires > Date.now()) {
      return memItem.value;
    }
    // Expired, remove from memory
    memoryCache.delete(key);
  }

  // Check localStorage as fallback - only if we're in the browser
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        
        // Check if still valid
        if (parsed.expires > Date.now()) {
          // Update memory cache with this value
          memoryCache.set(key, parsed);
          return parsed.value;
        }
        
        // Expired, remove from localStorage
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn('Failed to read cached item from localStorage:', err);
    }
  }

  return null;
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache() {
  const now = Date.now();
  
  // Clear memory cache
  for (const [key, item] of memoryCache.entries()) {
    if (item.expires <= now) {
      memoryCache.delete(key);
    }
  }
  
  // Clear localStorage - only if we're in the browser
  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('api:')) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              if (parsed.expires <= now) {
                localStorage.removeItem(key);
              }
            } catch {
              // If parsing fails, remove the item
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to clear expired cache from localStorage:', err);
    }
  }
}

// Auto-cleanup every 5 minutes - only in browser
if (typeof window !== 'undefined') {
  setInterval(clearExpiredCache, 5 * 60 * 1000);
}

/**
 * Cache helpers for specific content types
 */
const cache = {
  /**
   * Cache models list with appropriate TTL
   */
  storeModels: (key, models, isRealtime = false) => {
    const ttl = isRealtime ? CACHE_DURATIONS.MODELS_SHORT : CACHE_DURATIONS.MODELS_DEFAULT;
    setCacheValue(key, models, ttl);
  },
  
  /**
   * Cache categories with long TTL
   */
  storeCategories: (key, categories) => {
    setCacheValue(key, categories, CACHE_DURATIONS.CATEGORIES);
  },
  
  /**
   * Cache tags with medium TTL
   */
  storeTags: (key, tags) => {
    setCacheValue(key, tags, CACHE_DURATIONS.TAGS);
  },
  
  /**
   * Cache trending models with short TTL
   */
  storeTrending: (key, trending) => {
    setCacheValue(key, trending, CACHE_DURATIONS.TRENDING);
  },
  
  // Generic get function
  get: getCacheValue,
  
  // Generic set function
  set: setCacheValue,
  
  // Clear function
  clear: (key) => {
    if (key) {
      memoryCache.delete(key);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  },
  
  // Clear all cache
  clearAll: () => {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('api:')) {
            localStorage.removeItem(key);
          }
        }
      } catch (err) {
        console.warn('Failed to clear all cache from localStorage:', err);
      }
    }
  },
  
  // Export cache constants
  DURATIONS: CACHE_DURATIONS,
};

export default cache; 