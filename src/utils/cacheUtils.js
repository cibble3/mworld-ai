/**
 * Client-side caching utilities
 */

const CACHE_PREFIX = 'mworld_';
const DEFAULT_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Get an item from cache with expiration check
 * 
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if not found or expired
 */
export const getCachedItem = (key) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const storedItem = localStorage.getItem(cacheKey);
    
    if (!storedItem) return null;
    
    const parsedItem = JSON.parse(storedItem);
    const now = new Date().getTime();
    
    // If item has expired, remove it and return null
    if (parsedItem.expiry && parsedItem.expiry < now) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return parsedItem.value;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

/**
 * Set an item in cache with expiration
 * 
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in milliseconds (default: 10 minutes)
 */
export const setCachedItem = (key, value, ttl = DEFAULT_CACHE_DURATION) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const now = new Date().getTime();
    const item = {
      value,
      expiry: now + ttl
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(item));
  } catch (error) {
    console.error('Cache storage error:', error);
  }
};

/**
 * Remove an item from cache
 * 
 * @param {string} key - Cache key
 */
export const removeCachedItem = (key) => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Cache removal error:', error);
  }
};

/**
 * Clear all cached items with prefix
 */
export const clearCache = () => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Cache clearing error:', error);
  }
};

export default {
  getCachedItem,
  setCachedItem,
  removeCachedItem,
  clearCache
}; 