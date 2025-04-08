/**
 * Tag Analyzer Service
 * 
 * Analyzes tags across different providers and categories to identify
 * the most popular/common tags for use in filters, navigation, etc.
 */

import { redisClient } from '.';

/**
 * Get the most popular tags across all providers and categories
 * 
 * @param {number} minModels - Minimum number of models with the tag
 * @param {Object} options - Configuration options
 * @param {string} options.provider - API provider (awe, vpapi)
 * @param {Array} options.categories - Categories to include
 * @returns {Promise<Array>} Array of tag objects with count and models
 */
export async function getPopularTags(minModels = 20, options = {}) {
  // Default configuration to scan
  const defaultConfigs = [
    { provider: 'awe', categories: ['girls', 'trans', 'fetish'] },
    { provider: 'vpapi', categories: ['videos'] }
  ];
  
  // Use provided config or default
  const configs = options.provider ? [options] : defaultConfigs;
  
  try {
    // Try to get from cache first
    const cacheKey = `tags:popular:${minModels}:${JSON.stringify(configs)}`;
    
    // Check if Redis is available
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`[TagAnalyzer] Using cached popular tags for ${minModels} min models`);
        return JSON.parse(cached);
      }
    }
    
    console.log(`[TagAnalyzer] Analyzing tags across providers with min ${minModels} models`);
    
    // Process would typically involve:
    // 1. Fetch models from each provider/category
    // 2. Extract and count tags
    // 3. Sort by popularity
    
    // For now, return static popular tags for development
    const popularTags = generateMockPopularTags();
    
    // Cache the results if Redis is available
    if (redisClient) {
      await redisClient.set(cacheKey, JSON.stringify(popularTags), {
        ex: 3600 // Cache for 1 hour
      });
    }
    
    return popularTags;
  } catch (error) {
    console.error('[TagAnalyzer] Error getting popular tags:', error);
    return [];
  }
}

/**
 * Generate mock popular tags for development
 * @returns {Array} Array of tag objects
 */
function generateMockPopularTags() {
  return [
    { tag: 'fetish', count: 500, categories: ['girls', 'trans', 'fetish'] },
    { tag: 'leather', count: 350, categories: ['fetish'] },
    { tag: 'latex', count: 320, categories: ['fetish'] },
    { tag: 'bdsm', count: 300, categories: ['fetish', 'girls', 'trans'] },
    { tag: 'mistress', count: 280, categories: ['fetish', 'girls'] },
    { tag: 'domination', count: 250, categories: ['fetish', 'girls', 'trans'] },
    { tag: 'feet', count: 240, categories: ['fetish', 'girls', 'trans'] },
    { tag: 'roleplay', count: 230, categories: ['girls', 'trans'] },
    { tag: 'lingerie', count: 220, categories: ['girls', 'trans'] },
    { tag: 'submissive', count: 210, categories: ['fetish', 'girls', 'trans'] },
    { tag: 'asian', count: 200, categories: ['girls', 'trans'] },
    { tag: 'ebony', count: 190, categories: ['girls', 'trans'] },
    { tag: 'latin', count: 180, categories: ['girls', 'trans'] },
    { tag: 'white', count: 170, categories: ['girls', 'trans'] },
    { tag: 'spanking', count: 160, categories: ['fetish'] },
    { tag: 'toys', count: 150, categories: ['girls', 'trans'] },
    { tag: 'deepthroat', count: 140, categories: ['girls'] },
    { tag: 'stockings', count: 130, categories: ['girls', 'trans'] },
    { tag: 'heels', count: 120, categories: ['girls', 'trans'] },
    { tag: 'smoking', count: 110, categories: ['fetish', 'girls', 'trans'] },
    { tag: 'cosplay', count: 100, categories: ['girls', 'trans'] }
  ];
} 