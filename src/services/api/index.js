/**
 * Unified API Service
 * 
 * This service provides a standardized interface for interacting with
 * all external APIs (AWE, VPAPI, FreeAPI) and internal data.
 */

import axios from 'axios';

/**
 * API Providers 
 * This defines the available data providers for the application
 */
export const ApiProviders = {
  AWE: 'awe',      // LiveJasmin Models
  VPAPI: 'vpapi',  // LiveJasmin Videos
  FREE: 'free'     // Chaturbate Models
};

/**
 * Base URLs for the different API providers
 * These will be used by the orchestrator service
 */
export const API_URLS = {
  [ApiProviders.AWE]: '/api/models',
  [ApiProviders.FREE]: '/api/free-models',
  [ApiProviders.VPAPI]: '/api/videos'
};

/**
 * Helper to ensure URLs are properly formatted
 * This is especially important for VPAPI which returns protocol-relative URLs
 */
export const ensureAbsoluteUrl = (url) => {
  if (typeof url === 'string' && url.startsWith('//')) {
    return `https:${url}`;
  }
  return url || '';
};

// Content type constants
export const ContentTypes = {
  MODEL: 'model',
  VIDEO: 'video',
  BLOG: 'blog',
  CATEGORY: 'category',
  PAGE: 'page'
};

/**
 * Unified API client for all endpoints
 * This centralizes all API calls and provides a consistent interface
 */
export const api = {
  /**
   * Fetch models from any provider
   * @param {Object} params - Query parameters
   * @param {string} params.provider - Provider type (awe, free)
   * @param {string} params.category - Model category
   * @param {string} params.subcategory - Model subcategory
   * @param {number} params.limit - Number of models to return
   * @param {number} params.offset - Pagination offset
   * @param {Object} params.filters - Additional filters
   * @returns {Promise<Object>} - API response
   */
  models: async (params = {}) => {
    const { provider = ApiProviders.AWE, ...otherParams } = params;
    
    // Determine the correct endpoint based on provider
    const endpoint = provider.toLowerCase() === ApiProviders.FREE 
      ? API_URLS[ApiProviders.FREE]
      : API_URLS[ApiProviders.AWE];
    
    console.log(`[API Client] Fetching models from ${endpoint} with provider=${provider}`);
    
    try {
      const response = await axios.get(endpoint, {
        params: {
          ...otherParams,
          provider,
          _timestamp: Date.now() // Cache busting
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`[API Client] Error fetching models:`, error.message);
      throw error;
    }
  },
  
  /**
   * Fetch videos from any provider
   * @param {Object} params - Query parameters
   * @param {string} params.category - Video category
   * @param {string} params.subcategory - Video subcategory
   * @param {string} params.model - Model ID or name
   * @param {number} params.limit - Number of videos to return
   * @param {number} params.offset - Pagination offset
   * @param {Object} params.filters - Additional filters
   * @returns {Promise<Object>} - API response
   */
  videos: async (params = {}) => {
    console.log(`[API Client] Fetching videos with params:`, params);
    
    try {
      const response = await axios.get(API_URLS[ApiProviders.VPAPI], {
        params: {
          ...params,
          _timestamp: Date.now() // Cache busting
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`[API Client] Error fetching videos:`, error.message);
      throw error;
    }
  },
  
  /**
   * Fetch categories
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - API response
   */
  categories: async (params = {}) => {
    console.log(`[API Client] Fetching categories with params:`, params);
    
    try {
      const response = await axios.get('/api/categories', {
        params: {
          ...params,
          _timestamp: Date.now() // Cache busting
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`[API Client] Error fetching categories:`, error.message);
      throw error;
    }
  }
};

/**
 * Fetch content (blog posts, pages, etc.)
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.type - Content type (blog, page)
 * @param {string} params.slug - Content slug
 * @param {string} params.category - Category if applicable
 * @returns {Promise<Object>} - Normalized response with content data
 */
export async function fetchContent(params = {}) {
  try {
    const { 
      type = ContentTypes.PAGE, 
      slug,
      category
    } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      type,
      slug: slug || '',
      category: category || '',
      _timestamp: Date.now() // Cache busting
    }).toString();
    
    const response = await axios.get(`/api/content?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Standardize model data across different providers
 * 
 * @param {Object} model - Raw model data from API
 * @param {string} provider - API provider
 * @returns {Object} - Standardized model object
 */
export function standardizeModelData(model, provider) {
  // Create a standard model object regardless of source
  return {
    id: model.id || model.uid || model.model_id,
    slug: model.slug || createSlug(model.name || model.displayName),
    name: model.name || model.displayName || model.model_name,
    preview: model.preview || model.thumbnail || model.image,
    category: model.category, 
    subcategory: model.subcategory,
    isLive: Boolean(model.isLive || model.is_online || model.live),
    tags: model.tags || [],
    provider, // Track the source
    // We'll merge with AI-generated content later
    bioTop: model.bioTop || null,
    bioBottom: model.bioBottom || null,
    // Original data preserved for access if needed
    _original: model
  };
}

/**
 * Create a URL-friendly slug from a string
 * 
 * @param {string} text - Input text
 * @returns {string} - URL-friendly slug
 */
function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default api; 