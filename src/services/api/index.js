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
 * Fetch models with consistent interface across providers
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.provider - API provider (awe, vpapi, free)
 * @param {string} params.category - Category (asian, ebony, latina, etc.)
 * @param {string} params.subcategory - Subcategory if applicable
 * @param {number} params.limit - Number of results to return
 * @param {number} params.offset - Pagination offset
 * @param {string} params.sort - Sort order
 * @param {boolean} params.skipCache - Whether to skip cache
 * @returns {Promise<Object>} - Normalized response with models and pagination
 */
export async function fetchModels(params = {}) {
  try {
    const { 
      provider = ApiProviders.AWE, 
      category, 
      subcategory,
      limit = 50,
      offset = 0,
      sort = 'featured',
      skipCache = false
    } = params;
    
    console.log(`[API service] fetchModels called with provider: ${provider}`);
    
    // Normalize provider to string
    const providerStr = String(provider).toLowerCase();
    
    // Build query parameters differently based on provider
    let endpoint, queryParams;
    
    if (providerStr === ApiProviders.FREE) {
      // For FREE provider, use the dedicated free-models endpoint
      queryParams = new URLSearchParams({
        category: category || '',
        subcategory: subcategory || '',
        limit,
        offset,
        sort,
        _timestamp: Date.now() // Cache busting
      }).toString();
      
      endpoint = `/api/free-models?${queryParams}`;
      console.log(`[API service] Using FREE provider endpoint: ${endpoint}`);
    } 
    else if (providerStr === ApiProviders.VPAPI) {
      // For VPAPI provider, use the videos endpoint
      queryParams = new URLSearchParams({
        category: category || '',
        subcategory: subcategory || '',
        limit,
        offset,
        sort,
        skipCache: skipCache ? '1' : '0',
        _timestamp: Date.now()
      }).toString();
      
      endpoint = `/api/videos?${queryParams}`;
      console.log(`[API service] Using VPAPI provider endpoint: ${endpoint}`);
    }
    else {
      // Default AWE provider
      queryParams = new URLSearchParams({
        provider: 'awe', // Ensure provider is explicitly set to AWE
        category: category || '',
        subcategory: subcategory || '',
        limit,
        offset,
        sort,
        skipCache: skipCache ? '1' : '0',
        _timestamp: Date.now()
      }).toString();
      
      endpoint = `/api/models?${queryParams}`;
      console.log(`[API service] Using AWE provider endpoint: ${endpoint}`);
    }
    
    // Make the API request
    console.log(`[API service] Making request to: ${endpoint}`);
    const response = await axios.get(endpoint);
    
    return response.data;
  } catch (error) {
    console.error('[API service] Error fetching models:', error);
    return {
      success: false,
      error: error.message,
      data: {
        models: [],
        pagination: {
          total: 0,
          offset: parseInt(params.offset || 0),
          limit: parseInt(params.limit || 50),
          pages: 0,
          currentPage: 1
        }
      }
    };
  }
}

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
 * Fetch categories with consistent interface
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.category - Main category
 * @param {string} params.subcategory - Subcategory
 * @returns {Promise<Object>} - Normalized response with category data
 */
export async function fetchCategories(params = {}) {
  try {
    const { 
      category,
      subcategory
    } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      category: category || '',
      subcategory: subcategory || '',
      _timestamp: Date.now() // Cache busting
    }).toString();
    
    const response = await axios.get(`/api/categories?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: error.message,
      data: {
        categories: [],
        subcategories: []
      }
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

export default {
  fetchModels,
  fetchContent,
  fetchCategories,
  standardizeModelData,
  ApiProviders,
  ContentTypes,
  API_URLS,
  ensureAbsoluteUrl
}; 