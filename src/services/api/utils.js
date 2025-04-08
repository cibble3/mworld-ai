/**
 * API Utilities
 * 
 * Common utility functions for API operations
 */

/**
 * Ensure URLs are properly formatted
 * This is especially important for some APIs which return protocol-relative URLs
 * @param {string} url - URL to format
 * @returns {string} Properly formatted URL
 */
export function ensureAbsoluteUrl(url) {
  if (!url) return '';
  if (typeof url === 'string' && url.startsWith('//')) {
    return `https:${url}`;
  }
  return url;
}

/**
 * Generate a cache key for API requests
 * @param {string} prefix - Prefix for the cache key
 * @param {Object} params - Request parameters
 * @returns {string} Cache key
 */
export function generateCacheKey(prefix, params) {
  const sortedParams = Object.entries(params || {})
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value).toLowerCase()}`)
    .join('&');
  
  return `${prefix}:${sortedParams}`;
}

/**
 * Normalize tag string for consistency
 * @param {string} tag - Raw tag from API
 * @returns {string|null} Normalized tag or null if invalid
 */
export function normalizeTag(tag) {
  if (!tag || typeof tag !== 'string') return null;
  
  return tag.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Generate a random ID with specified prefix
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Random ID
 */
export function generateRandomId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}

export default {
  ensureAbsoluteUrl,
  generateCacheKey,
  normalizeTag,
  generateRandomId
}; 