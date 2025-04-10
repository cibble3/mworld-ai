/**
 * API Service - Handles all API calls and normalization
 * 
 * This service provides a unified interface for fetching data from all APIs:
 * - AWE API (LiveJasmin) - Premium models
 * - VPAPI - Videos
 * 
 * It handles normalization of data, filtering, and caching.
 */

import { mapFiltersToProvider } from '@/config/filterMap';
import * as orchestrator from './orchestrator';

// Provider mapping
const API_PROVIDERS = {
  AWE: 'awe',      // LiveJasmin Models
  VPAPI: 'vpapi'   // LiveJasmin Videos
};

// Category to provider mapping
const CATEGORY_PROVIDER_MAP = {
  'girls': API_PROVIDERS.AWE,
  'trans': API_PROVIDERS.AWE,
  'fetish': API_PROVIDERS.AWE,
  'videos': API_PROVIDERS.VPAPI
};

/**
 * Fetch models based on category and filters
 * @param {string} category - The category (girls, trans, fetish, free)
 * @param {Object} filters - Filter parameters
 * @param {Object} options - Additional options (page, limit, etc.)
 */
export async function fetchModels(category, filters = {}, options = {}) {
  try {
    // Determine provider based on category
    const provider = CATEGORY_PROVIDER_MAP[category];
    
    if (!provider) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    // Base parameters
    const params = {
      ...options,
      limit: options.limit || 24,
      offset: options.offset || 0
    };
    
    // Add category to filters if AWE provider
    if (provider === API_PROVIDERS.AWE) {
      filters.category = category;
    }
    
    // Map filters to provider-specific parameters
    const providerFilters = mapFiltersToProvider(filters, provider);
    
    // Combine params and filters
    const apiParams = {
      ...params,
      ...providerFilters
    };
    
    console.log(`[apiService] Fetching ${category} with provider ${provider}`, apiParams);
    
    // Call the orchestrator to fetch models
    const result = await orchestrator.fetchModels({
      source: provider,
      ...apiParams
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch models');
    }
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error(`[apiService] Error fetching ${category} models:`, error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      data: {
        items: [],
        pagination: {
          total: 0,
          limit: options.limit || 24,
          offset: options.offset || 0,
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        }
      }
    };
  }
}

/**
 * Fetch videos with filters
 * @param {Object} filters - Filter parameters
 * @param {Object} options - Additional options (page, limit, etc.)
 */
export async function fetchVideos(filters = {}, options = {}) {
  try {
    // Base parameters
    const params = {
      ...options,
      limit: options.limit || 24,
      offset: options.offset || 0
    };
    
    // Map filters to VPAPI parameters
    const providerFilters = mapFiltersToProvider(filters, API_PROVIDERS.VPAPI);
    
    // Combine params and filters
    const apiParams = {
      ...params,
      ...providerFilters
    };
    
    console.log('[apiService] Fetching videos', apiParams);
    
    // Call the orchestrator to fetch videos
    const result = await orchestrator.fetchVideos(apiParams);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch videos');
    }
    
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('[apiService] Error fetching videos:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      data: {
        items: [],
        pagination: {
          total: 0,
          limit: options.limit || 24,
          offset: options.offset || 0,
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        }
      }
    };
  }
}

/**
 * Get all available filters for a category
 * @param {string} category - The category (girls, trans, fetish, videos)
 */
export function getFiltersForCategory(category) {
  // Return the filters defined in the categories API
  // This would be retrieved from the categories endpoint
  // For now, just return a static structure
  
  const provider = CATEGORY_PROVIDER_MAP[category];
  
  if (!provider) {
    return [];
  }
  
  // Define basic filters based on category
  let filters = [];
  
  switch (category) {
    case 'girls':
      filters = [
        { type: 'ethnicity', name: 'Ethnicity' },
        { type: 'hair_color', name: 'Hair Color' },
        { type: 'body_type', name: 'Body Type' },
        { type: 'tags', name: 'Tags' }
      ];
      break;
    case 'trans':
      filters = [
        { type: 'ethnicity', name: 'Ethnicity' },
        { type: 'hair_color', name: 'Hair Color' },
        { type: 'body_type', name: 'Body Type' },
        { type: 'tags', name: 'Tags' }
      ];
      break;
    case 'fetish':
      filters = [
        { type: 'willingness', name: 'Willingness' },
        { type: 'tags', name: 'Tags' }
      ];
      break;
    case 'videos':
      filters = [
        { type: 'category', name: 'Category' },
        { type: 'tags', name: 'Tags' }
      ];
      break;
    default:
      filters = [];
  }
  
  return filters;
}

export default {
  fetchModels,
  fetchVideos,
  getFiltersForCategory,
  API_PROVIDERS
}; 