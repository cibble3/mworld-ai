import axios from 'axios';
import ENV from '@/config/environment';
import { getCachedItem, setCachedItem } from '@/utils/cacheUtils';

// API Provider constants
export const ApiProviders = {
  AWE: 'aweapi',
  FREE: 'freeapi',
  VP: 'vpapi'
};

/**
 * Centralized API service for fetching models and other data
 */
export const ModelAPI = {
  /**
   * Fetch models with filter parameters
   * 
   * @param {string} category - 'girls', 'trans', or 'fetish'
   * @param {Object} filters - Key-value pairs of filter parameters
   * @param {number} limit - Maximum number of results to return
   * @param {string} provider - API provider (awe, free)
   * @param {number} page - Page number for pagination
   * @param {boolean} useCache - Whether to use client-side caching
   * @returns {Promise} - Promise resolving to normalized models and pagination
   */
  fetchModels: async (category = 'girls', filters = {}, limit = ENV.DEFAULT_PAGE_SIZE, provider = 'awe', page = 1, useCache = true) => {
    const offset = (page - 1) * limit;
    
    try {
      // Generate a cache key based on request parameters
      const cacheKey = `models_${provider}_${category}_${JSON.stringify(filters)}_${limit}_page${page}`;
      
      // If caching is enabled and running client-side, try to get from cache first
      if (useCache && typeof window !== 'undefined') {
        const cachedData = getCachedItem(cacheKey);
        if (cachedData) {
          console.log(`[ModelAPI] Using cached data for ${provider}/${category} models page ${page}`);
          return cachedData;
        }
      }
      
      console.log(`[ModelAPI] Fetching ${provider}/${category} models page ${page} with filters:`, filters);
      
      // Determine endpoint based on provider
      let endpoint = '/api/models'; // Default to unified models endpoint
      
      // Construct the correct API URL
      let apiUrl = '';
      if (typeof window === 'undefined') {
        // Server-side: Use absolute URL (assuming server is running on 3000)
        const baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000'; 
        apiUrl = `${baseUrl}${endpoint}`;
        console.log(`[ModelAPI] Server-side fetch using URL: ${apiUrl}`);
      } else {
        // Client-side: Use relative URL
        apiUrl = endpoint;
        console.log(`[ModelAPI] Client-side fetch using URL: ${apiUrl}`);
      }

      const response = await axios.get(apiUrl, {
        params: {
          provider,
          category,
          limit,
          offset, // Use offset for API pagination
          ...filters
        }
      });
      
      if (response.data?.success) {
        const responseData = response.data.data || {};
        const rawModels = responseData.models || responseData.items || [];
        const paginationData = responseData.pagination || {};

        // Normalize models using the normalizeModel function
        const normalizedModels = rawModels.map(model => 
          ModelAPI.normalizeModel(model, provider)
        );

        const result = {
          success: true,
          models: normalizedModels,
          pagination: {
            total: paginationData.total || 0,
            limit: paginationData.limit || limit,
            offset: paginationData.offset || offset,
            currentPage: paginationData.currentPage || page,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / limit),
            hasMore: paginationData.hasMore !== undefined ? paginationData.hasMore : (normalizedModels.length >= limit)
          }
        };
        
        // Cache successful results if caching is enabled
        if (useCache && typeof window !== 'undefined') {
          // Cache for 5 minutes
          setCachedItem(cacheKey, result, 5 * 60 * 1000);
        }
        
        return result;
      } else {
        // Throw an error if the API request failed
        throw new Error(response.data?.error || `Failed to fetch ${category} models`);
      }
    } catch (error) {
      console.error(`[ModelAPI] Exception fetching ${category} models:`, error);
      
      // Check if it's an Axios error and extract details
      const errorMessage = error.response?.data?.error || error.message || `Failed to fetch ${category} models`;
      
      // Return a consistent error structure
      return {
        success: false,
        models: [],
        pagination: { hasMore: false },
        error: errorMessage
      };
    }
  },
  
  /**
   * Normalize a model object to ensure consistent properties across providers
   * 
   * @param {Object} model - Raw model data from API
   * @param {string} provider - Data provider name
   * @returns {Object} - Normalized model object
   */
  normalizeModel: (model, provider = 'awe') => {
    // If model is already normalized, return as is
    if (model._normalized) return model;
    
    // Base structure with fallbacks
    return {
      _normalized: true,
      _provider: provider,
      
      // Basic model information
      id: model.id || model.performerId || model.modelId || `model-${Math.random().toString(36).substr(2, 9)}`,
      name: model.name || model.performerName || model.modelName || 'Unknown Model',
      slug: model.slug || model.linkName || model.id || '',
      
      // Media properties
      thumbnail: model.thumbnail || model.preview || model.images?.thumbnail || model.previewUrl || model.image_url || '',
      isHd: model.is_hd || model.isHD || model.hd || false,
      
      // Status properties
      isOnline: model.isOnline || model.is_online || model.online || false,
      showStatus: model.current_show || model.showStatus || model.show_status || 'public',
      viewerCount: model.viewerCount || model.viewers || model.num_users || 0,
      
      // Profile details
      age: model.age || null,
      ethnicity: model.ethnicity || '',
      country: model.country || model.country_name || '',
      languages: model.languages || model.spoken_languages || ['english'],
      
      // External links
      chatRoomUrl: model.chat_room_url || model.performerUrl || model.externalUrl || null,
      
      // Tags and categories
      tags: model.tags || [],
      categories: model.categories || [],
      
      // Original provider data for debugging
      _originalData: ENV.IS_DEV ? model : null
    };
  },
  
  /**
   * Get fallback models for development and testing
   * @param {string} category - Category of models (girls, trans, fetish)
   * @param {number} count - Number of models to generate
   * @returns {Array} Array of fallback model objects
   */
  getFallbackModels: (category = 'girls', count = 12) => {
    console.log(`Generating ${count} fallback ${category} models`);
    
    // Define category-specific attributes
    const categoryConfig = {
      girls: {
        tags: ['teen', 'milf', 'blonde', 'brunette', 'asian', 'latina', 'ebony', 'curvy', 'tattoo', 'toys'],
        countries: ['United States', 'Czech Republic', 'Colombia', 'Russia', 'Ukraine', 'Romania', 'Canada'],
        namePrefix: 'Girls Model'
      },
      trans: {
        tags: ['trans', 'bigcock', 'latina', 'asian', 'ebony', 'blonde', 'brunette', 'tattoo'],
        countries: ['Colombia', 'Brazil', 'Thailand', 'Philippines', 'United States', 'Mexico'],
        namePrefix: 'Trans Model'
      },
      fetish: {
        tags: ['bdsm', 'feet', 'leather', 'mistress', 'domina', 'sub', 'spanking', 'humiliation'],
        countries: ['United States', 'Germany', 'United Kingdom', 'Canada', 'Australia'],
        namePrefix: 'Fetish Model'
      }
    };
    
    // Use the appropriate config or default to girls
    const config = categoryConfig[category] || categoryConfig.girls;
    
    // Generate the specified number of fallback models
    return Array.from({ length: count }, (_, i) => {
      // Generate 2-3 random tags
      const tagCount = 2 + Math.floor(Math.random() * 2);
      const shuffledTags = [...config.tags].sort(() => 0.5 - Math.random());
      const modelTags = shuffledTags.slice(0, tagCount);
      
      // Always include the category as a tag/category
      if (!modelTags.includes(category) && category !== 'girls') {
        modelTags.push(category);
      }
      
      // Randomize other attributes
      const randomCountry = config.countries[Math.floor(Math.random() * config.countries.length)];
      const isOnline = Math.random() > 0.5;
      const viewerCount = Math.floor(Math.random() * 1000);
      const showStatus = isOnline 
        ? (Math.random() > 0.7 ? 'away' : 'public') 
        : 'private';
      
      // Create a normalized model object
      return {
        _normalized: true,
        _provider: 'fallback',
        id: `fallback-${category}-${i}`,
        name: `${config.namePrefix} ${i+1}`,
        slug: `${category}-model-${i+1}`.toLowerCase(),
        thumbnail: `https://placehold.co/400x300/333/FFF?text=${encodeURIComponent(`${category} ${i+1}`)}`,
        isHd: Math.random() > 0.5,
        isOnline,
        showStatus,
        viewerCount,
        age: 20 + Math.floor(Math.random() * 15),
        ethnicity: Math.random() > 0.7 ? 'asian' : (Math.random() > 0.5 ? 'latina' : 'white'),
        country: randomCountry,
        languages: Math.random() > 0.5 ? ['english'] : ['english', 'russian'],
        chatRoomUrl: Math.random() > 0.3 ? `https://example.com/${category}/model-${i+1}` : null,
        tags: modelTags,
        categories: [category]
      };
    });
  },
  
  /**
   * Extract filter parameters from search params
   * 
   * @param {URLSearchParams} searchParams - Search parameters from next/navigation
   * @returns {Object} - Extracted filter parameters
   */
  extractFilters: (searchParams) => {
    if (!searchParams) return {};
    
    const filterParams = [
      'hair_color', 
      'tags', 
      'willingness', 
      'height', 
      'body_type', 
      'ethnicity',
      'age_group',
      'breast_size',
      'language',
      'experience'
    ];
    
    const filters = {};
    
    filterParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        filters[param] = value;
      }
    });
    
    return filters;
  },
};

export default {
  ModelAPI,
  ApiProviders
}; 