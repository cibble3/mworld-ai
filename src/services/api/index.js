/**
 * API Module
 * 
 * Central API handling with:
 * - Provider selection (AWE, VPAPI)
 * - Caching layer
 * - Response normalization
 */

import { Redis } from '@upstash/redis';
import aweProvider from './providers/awe';
import vpapiProvider from './providers/vpapi';
import cache from './cache';
// Import utils
import { ensureAbsoluteUrl, normalizeTag, generateRandomId } from './utils';

/**
 * API Providers 
 * Available data providers for the application
 */
export const Providers = {
  AWE: 'awe',       // AWE Network
  VPAPI: 'vpapi',   // VideoPlayerAPI
};

// For backward compatibility - maintain the old naming but without FREE
export const ApiProviders = {
  AWE: 'awe',
  VPAPI: 'vpapi'
};

/**
 * Content Types
 * Available content types in the application
 */
export const ContentTypes = {
  MODEL: 'model',
  VIDEO: 'video',
  BLOG: 'blog',
  CATEGORY: 'category',
  PAGE: 'page'
};

/**
 * API endpoint URLs
 * NextJS API routes for each provider
 */
export const API_URLS = {
  [Providers.AWE]: '/api/models',
  [Providers.VPAPI]: '/api/videos'
};

/**
 * Fetch models from the appropriate provider
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.provider - API provider (awe, vpapi)
 * @param {string} params.category - Model category (girls, trans, fetish)
 * @param {number} params.limit - Number of models to return
 * @param {number} params.offset - Pagination offset
 * @param {boolean} skipCache - Whether to skip the cache
 * @returns {Promise<Object>} - Normalized API response
 */
export const fetchModels = async (params, skipCache = false) => {
  const { provider = Providers.AWE, ...otherParams } = params;
  
  console.log(`[API] fetchModels with provider: ${provider}`);
  
  try {
    switch (provider) {
      case Providers.AWE:
        return aweProvider.fetchModels(otherParams, skipCache);
      case Providers.VPAPI:
        return vpapiProvider.fetchModels(otherParams, skipCache);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  } catch (error) {
    console.error(`[API] Error fetching models from ${provider}:`, error);
    throw error;
  }
};

/**
 * Fetch videos with a consistent interface
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.category - Category (popular, new, lesbian, etc.)
 * @param {string} params.subcategory - Subcategory if applicable
 * @param {number} params.limit - Number of results to return
 * @param {number} params.offset - Pagination offset
 * @param {Object} params.filters - Filter options (quality, tags, etc.)
 * @param {boolean} params.skipCache - Whether to skip cache
 * @returns {Promise<Object>} - Normalized response with videos and pagination
 */
export async function fetchVideos(params = {}) {
  const { skipCache = false, ...otherParams } = params;
  
  console.log(`[API] fetchVideos called with category: ${params.category || 'popular'}`);
  
  return vpapiProvider.fetchVideos(otherParams, skipCache);
}

/**
 * Clear cache entries
 * @param {string} prefix - Optional prefix to clear only matching keys
 * @returns {void}
 */
export function clearCache(prefix = '') {
  return cache.clear(prefix);
}

/**
 * Get cache statistics for monitoring
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  return cache.stats();
}

/**
 * Ensure URLs are properly formatted
 * This is especially important for VPAPI which returns protocol-relative URLs
 * @param {string} url - URL to format
 * @returns {string} Properly formatted URL
 */
export { ensureAbsoluteUrl };

/**
 * Standardize model data across different providers
 * @param {Object} model - Raw model data
 * @param {string} provider - API provider
 * @returns {Object} - Standardized model object
 */
export function standardizeModelData(model, provider) {
  // Create a standard model object regardless of source
  return {
    id: model.id || model.uid || model.model_id || generateRandomId('model'),
    slug: model.slug || model.username || model.id || generateRandomId('slug'),
    name: model.name || model.displayName || model.model_name || 'Unknown Model',
    preview: model.preview || model.thumbnail || model.image || '',
    category: model.category, 
    subcategory: model.subcategory,
    isLive: Boolean(model.isLive || model.is_online || model.isOnline),
    tags: model.tags || [],
    provider: provider || model._provider,
    // We'll merge with AI-generated content later
    bioTop: model.bioTop || null,
    bioBottom: model.bioBottom || null,
    // Original data preserved for access if needed
    _original: model._original || model
  };
}

/**
 * Calculate tag statistics and popularity scores across all providers
 * This helps prioritize which tags should be displayed based on active model count
 * 
 * @param {Object} options - Options for calculation
 * @param {boolean} options.skipCache - Whether to skip cache
 * @param {string[]} options.tags - List of tags to check
 * @param {string[]} options.providers - List of providers to check
 * @returns {Promise<Object>} Tag statistics
 */
export async function calculateTagStats(options = {}) {
  const { 
    skipCache = false,
    tags = [], 
    providers = [Providers.AWE] 
  } = options;
  
  const cacheKey = 'tag_stats';
  
  // Check cache first if not skipping
  if (!skipCache) {
    const cachedStats = cache.get(cacheKey);
    if (cachedStats) {
      console.log(`[API] Using cached tag statistics`);
      return cachedStats;
    }
  }
  
  console.log(`[API] Calculating tag statistics for ${tags.length} tags across ${providers.length} providers`);
  
  // Object to store tag statistics
  const tagStats = {
    totalActiveByTag: {},
    totalActiveByProvider: {},
    updatedAt: new Date().toISOString()
  };
  
  try {
    // Get model counts for each tag from each provider
    const tagPromises = tags.map(async (tag) => {
      const providerPromises = providers.map(async (provider) => {
        const result = await fetchModels({
          provider,
          limit: 1,
          skipCache,
          tags: tag,
          count_only: true // Just get counts, not actual models
        });
        
        const count = result.success ? (result.data?.pagination?.total || 0) : 0;
        return { provider, count };
      });
      
      const providerCounts = await Promise.all(providerPromises);
      
      // Calculate total for this tag across all providers
      const totalForTag = providerCounts.reduce((sum, { count }) => sum + count, 0);
      
      // Store count by provider
      providerCounts.forEach(({ provider, count }) => {
        if (!tagStats.totalActiveByProvider[provider]) {
          tagStats.totalActiveByProvider[provider] = {};
        }
        tagStats.totalActiveByProvider[provider][tag] = count;
      });
      
      return { tag, count: totalForTag };
    });
    
    const tagCounts = await Promise.all(tagPromises);
    
    // Store total counts and sort by popularity
    tagCounts.forEach(({ tag, count }) => {
      tagStats.totalActiveByTag[tag] = count;
    });
    
    // Sort tags by count (descending)
    tagStats.sortedTags = Object.entries(tagStats.totalActiveByTag)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([tag]) => tag);
    
    // Cache the results
    const tagStatsCacheTTL = 15 * 60 * 1000; // 15 minutes
    cache.set(cacheKey, tagStats, tagStatsCacheTTL);
    
    return tagStats;
  } catch (error) {
    console.error(`[API] Error calculating tag statistics:`, error);
    return {
      totalActiveByTag: {},
      totalActiveByProvider: {},
      error: error.message,
      updatedAt: new Date().toISOString()
    };
  }
}

// Export the Redis client for other modules to use
export const redisClient = process.env.UPSTASH_REDIS_URL ? new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
}) : null;

/**
 * Get average viewer count across all platforms
 * @returns {Promise<number>} - Average viewer count
 */
export const getAverageViewerCount = async () => {
  return 127; // Default viewer count
};

/**
 * Get popular models across providers
 * 
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of models to return
 * @param {string} options.category - Optional category filter
 * @returns {Promise<Array>} - Array of popular models
 */
export const getPopularModels = async (options = {}) => {
  const { limit = 8, category } = options;
  
  console.log(`[API] Getting ${limit} popular models${category ? ` in category ${category}` : ''}`);
  
  // Default to AWE only for now
  const providers = [Providers.AWE];
  
  try {
    // Get models from primary provider first
    const params = {
      provider: providers[0],
      limit: limit * 2, // Get more models than needed to allow for filtering
      ...(category && { category }),
      sortBy: 'popular'
    };
    
    const result = await fetchModels(params);
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch models');
    }
    
    return result.data.models.slice(0, limit);
  } catch (error) {
    console.error('[API] Error getting popular models:', error);
    return [];
  }
};

// Export other utilities from utils.js and tag-analyzer.js
export { normalizeTag } from './utils';
export * from './tag-analyzer';

export default {
  fetchModels,
  fetchVideos,
  clearCache,
  getCacheStats,
  calculateTagStats,
  standardizeModelData,
  ensureAbsoluteUrl,
  normalizeTag,
  Providers,
  ApiProviders,
  ContentTypes,
  API_URLS,
  redisClient,
  getAverageViewerCount,
  getPopularModels
}; 