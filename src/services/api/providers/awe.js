/**
 * AWE Provider
 * 
 * Standardized interface for AWE API (LiveJasmin) integration with:
 * - Proper caching
 * - Consistent error handling
 * - Data normalization
 * - Request parameter mapping
 */

import axios from 'axios';
import cache, { generateCacheKey } from '../cache';

// TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// AWE configuration - Load from environment variables
const AWE_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_AWE_API_ENDPOINT || process.env.AWE_API_ENDPOINT || 'https://wptcd.com/api/model/feed',
  SITE_ID: process.env.AWE_SITE_ID || '201300',
  PS_ID: process.env.AWE_PS_ID || 'mikeeyy3',
  PS_TOOL: process.env.AWE_PS_TOOL || '213_1',
  PS_PROGRAM: process.env.AWE_PS_PROGRAM || 'cbrnd',
  CAMPAIGN_ID: process.env.AWE_CAMPAIGN_ID || '117404',
  API_KEY: process.env.AWE_API_KEY || '8d3f909766a7009186058874fb8fe2b4',
};

// Filter taxonomy for AWE API
const AWE_FILTERS = {
  age: ['teen', 'milf', 'twenties'],
  appearance: ['hairy-pussy', 'intim-piercing', 'leather', 'long-nails', 'piercing', 'pregnant', 'shaved', 'stockings', 'tattoo'],
  breasts: ["big-boobs", "huge-breasts", "normal-tits", "tiny-breast"],
  build: ["average-built", "bbw", "petite", "sporty"],
  ethnicity: ["asian", "ebony", "latin", "white"],
  hair_color: ["auburn", "black-haired", "blonde", "brunette", "fire-red", "pink"],
  hair_type: ["crew-cut", "long-hair", "short-hair", "shoulder-length"],
  willingness: ["anal", "butt-plug", "cameltoe", "close-up", "dancing", "dildo", "fingering", "live-orgasm", "love-balls", "oil", "roleplay", "smoke-cigarette", "snapshot", "squirt", "strap-on", "striptease", "vibrator", "zoom"],
  penis_size: ["big-penis", "huge-penis", "normal-penis", "small-penis"],
};

// Filter synonym mapping
const AWE_SYNONYMS = {
  'latina': 'latin',
  'big-tits': 'big-boobs',
  'tiny-tits': 'tiny-breast',
  'tiny-boobs': 'tiny-breast',
  'huge-tits': 'huge-breasts',
  'huge-boobs': 'huge-breasts',
  'average': 'average-built',
  'black': 'ebony',
  'red': 'fire-red'
};

/**
 * Normalize AWE model data to a standard format
 * @param {Object} model - Raw model data from AWE API
 * @returns {Object} Normalized model object
 */
export function normalizeModel(model) {
  if (!model || typeof model !== 'object') {
    console.error(`[AWE Provider] Invalid model data:`, model);
    return {
      id: `model-${Date.now()}`,
      performerId: `model-${Date.now()}`,
      name: 'Unknown Model',
      image: '/images/placeholder.jpg',
      thumbnail: '/images/placeholder.jpg',
      preview: '/images/placeholder.jpg',
      tags: [],
      isOnline: true,
      viewerCount: 0,
      _provider: 'awe'
    };
  }

  // Extract model ID with fallbacks
  const modelId = model.id || model.username || model.performerId || `model-${Date.now()}`;
  
  // Extract thumbnail URL with fallbacks for different API structures
  const thumbnailUrl = 
    model.thumbnail ||
    model.image || 
    (model.profilePictureUrl?.size320x180) || 
    (model.profilePictureUrl?.size160x120) || 
    model.preview || 
    '/images/placeholder.jpg';
    
  // Extract larger preview image with fallbacks
  const previewUrl = 
    model.preview || 
    (model.profilePictureUrl?.size800x600) || 
    thumbnailUrl;
  
  // Extract tags from different possible locations in the API response
  const tags = 
    (model.tags && Array.isArray(model.tags)) ? model.tags :
    (model.details?.willingnesses && Array.isArray(model.details.willingnesses)) ? model.details.willingnesses :
    [];
    
  // Return normalized model object with required fields for the UI
  return {
    id: modelId,
    performerId: modelId,
    slug: model.username || model.slug || modelId,
    name: model.displayName || model.name || 'Unknown Model',
    image: thumbnailUrl,
    thumbnail: thumbnailUrl,
    preview: previewUrl,
    age: model.age || (model.persons?.[0]?.age) || null,
    ethnicity: model.ethnicity || null,
    bodyType: model.bodyType || null,
    tags: tags,
    isOnline: model.isOnline !== false, // Default to true unless explicitly false
    viewerCount: model.viewerCount || 0,
    _provider: 'awe'
  };
}

/**
 * Map application parameters to AWE API parameters
 * @param {Object} params - Application parameters
 * @returns {Object} AWE API parameters
 */
export function mapParams(params) {
  // Determine AWE base category based on our internal category
  let aweCategory;
  if (params.category === 'trans') {
    aweCategory = 'transgender';
  } else if (params.category === 'fetish') {
    aweCategory = 'fetish';
  } else {
    aweCategory = 'girl'; // Default for girls and other categories
  }

  const apiParams = {
    siteId: AWE_CONFIG.SITE_ID,
    psId: AWE_CONFIG.PS_ID,
    psTool: AWE_CONFIG.PS_TOOL,
    psProgram: AWE_CONFIG.PS_PROGRAM,
    campaignId: AWE_CONFIG.CAMPAIGN_ID,
    limit: params.limit || 50,
    offset: params.offset || 0,
    imageSizes: '320x180,800x600',
    imageType: 'ex',
    showOffline: 0,
    onlyFreeStatus: 1,
    extendedDetails: 1,
    responseFormat: 'json',
    accessKey: AWE_CONFIG.API_KEY,
    customOrder: params.filters?.customOrder || 'most_popular',
    legacyRedirect: 1
  };
  
  // Only add category if it's NOT the default 'girls' category
  if (aweCategory !== 'girl') {
    apiParams.category = aweCategory;
  }

  // Process filters into AWE-compatible format
  let aweFilters = [];
  
  // Handle explicit tags parameter (takes precedence)
  if (params.tags) {
    const tagsList = Array.isArray(params.tags) 
      ? params.tags 
      : params.tags.split(',').map(tag => tag.trim());
    
    // Add any tags that match AWE's filter system
    tagsList.forEach(tag => {
      const mappedTag = AWE_SYNONYMS[tag] || tag;
      
      // Check if it's a valid filter in any category
      let isValidFilter = false;
      for (const filterType in AWE_FILTERS) {
        if (AWE_FILTERS[filterType].includes(mappedTag)) {
          aweFilters.push(mappedTag);
          isValidFilter = true;
          break;
        }
      }
      
      if (!isValidFilter) {
        console.warn(`[AWE Provider] Tag '${tag}' does not match any known AWE filter, ignoring.`);
      }
    });
    
    console.log(`[AWE Provider] Using tag filters: ${aweFilters.join(', ')}`);
  }
  
  // Apply subcategory mapping if the main category IS 'girls' or 'trans' and we have a subcategory
  // Only do this if we don't already have tags from the tags parameter
  if (['girls', 'trans'].includes(params.category) && params.subcategory && aweFilters.length === 0) {
    const sub = params.subcategory.toLowerCase();
    const mappedSub = AWE_SYNONYMS[sub] || sub; 
    let found = false;
    for (const filterType in AWE_FILTERS) {
      if (AWE_FILTERS[filterType].includes(mappedSub)) {
        aweFilters.push(mappedSub);
        found = true;
        break; 
      }
    }
    if (!found) {
      console.warn(`[AWE Provider] Subcategory '${params.subcategory}' for category '${params.category}' did not map to a known AWE filter.`);
    }
  }
  
  // Process additional filters (lowest priority)
  if (params.filters && aweFilters.length === 0) {
    for (const filterKey in params.filters) {
      if (['customOrder', '_timestamp'].includes(filterKey)) continue;
      const filterValue = String(params.filters[filterKey]).toLowerCase();
      const mappedValue = AWE_SYNONYMS[filterValue] || filterValue;
      
      if (AWE_FILTERS[filterKey] && AWE_FILTERS[filterKey].includes(mappedValue)) {
        aweFilters.push(mappedValue);
      } else {
        let foundDirect = false;
        for (const type in AWE_FILTERS) {
          if (AWE_FILTERS[type].includes(mappedValue)) {
            aweFilters.push(mappedValue);
            foundDirect = true;
            break;
          }
        }
        if (!foundDirect) {
          console.warn(`[AWE Provider] Filter '${filterKey}=${filterValue}' not mapped or invalid for AWE.`);
        }
      }
    }
  }
  
  // Add unique filters to the request
  if (aweFilters.length > 0) {
    apiParams.filters = [...new Set(aweFilters)].join(',');
  }
  
  return apiParams;
}

/**
 * Fetch models from AWE API with caching
 * @param {Object} params - Query parameters
 * @param {boolean} skipCache - Whether to skip the cache
 * @returns {Promise<Object>} Normalized response
 */
export async function fetchModels(params = {}, skipCache = false) {
  try {
    const cacheKey = generateCacheKey('awe:models', params);
    
    // Check cache first if not skipping
    if (!skipCache) {
      try {
        const cached = cache.get(cacheKey);
        if (cached) {
          console.log(`[AWE Provider] Using cached data for: ${cacheKey.substring(0, 100)}...`);
          return cached;
        }
      } catch (err) {
        console.warn(`[AWE Provider] Error reading from cache:`, err);
        // Continue with API request if cache fails
      }
    }
    
    const apiParams = mapParams(params);
    console.log(`[AWE Provider] Making API request for category: ${params.category}, subcategory: ${params.subcategory || 'none'}`);
    
    const response = await axios.get(AWE_CONFIG.BASE_URL, {
      params: apiParams,
      timeout: 15000
    });
    
    if (response.status !== 200 || !response.data) {
      throw new Error(`AWE request failed with status ${response.status}`);
    }
    
    // Parse and normalize the response
    let models = [];
    let pagination = {};
    
    // Handle different response formats
    if (response.data.results && Array.isArray(response.data.results)) {
      models = response.data.results;
      pagination = {
        total: response.data.count || models.length,
        limit: params.limit || 50,
        offset: params.offset || 0
      };
    } else if (response.data.data && response.data.data.models && Array.isArray(response.data.data.models)) {
      models = response.data.data.models;
      pagination = response.data.data.pagination || {
        total: models.length,
        limit: params.limit || 50,
        offset: params.offset || 0
      };
    } else {
      // Look for any array property that might contain models
      if (Array.isArray(response.data)) {
        models = response.data;
      } else {
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            models = response.data[key];
            break;
          }
        }
      }
      pagination = {
        total: models.length,
        limit: params.limit || 50,
        offset: params.offset || 0
      };
    }
    
    const items = models.map(normalizeModel);
    const total = (typeof pagination.total === 'number') ? pagination.total : items.length;
    const limitFromPagination = (typeof pagination.limit === 'number') ? pagination.limit : params.limit || 50;
    const offsetFromPagination = (typeof pagination.offset === 'number') ? pagination.offset : params.offset || 0;
    const hasMore = items.length === limitFromPagination;
    const totalPages = limitFromPagination > 0 ? Math.ceil(total / limitFromPagination) : 0;
    const currentPage = limitFromPagination > 0 ? Math.floor(offsetFromPagination / limitFromPagination) + 1 : 1;
    
    const result = {
      success: true,
      data: {
        items,
        pagination: { 
          total, 
          limit: limitFromPagination, 
          offset: offsetFromPagination, 
          currentPage, 
          totalPages, 
          hasMore 
        }
      }
    };
    
    // Cache the result with proper error handling
    try {
      cache.storeModels(cacheKey, result, params.isRealtime || false);
    } catch (err) {
      console.warn(`[AWE Provider] Error storing in cache:`, err);
      // Continue even if caching fails
    }
    
    return result;
  } catch (error) {
    console.error(`[AWE Provider] Error fetching models:`, error.message);
    
    let errorMessage = `Failed to fetch models from AWE.`;
    if (error.response) {
      errorMessage = `AWE Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      errorMessage = `No response received from AWE.`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = `AWE request timed out.`;
    }
    
    return {
      success: false,
      error: errorMessage,
      data: { 
        items: [], 
        pagination: { 
          total: 0, 
          limit: params.limit || 50, 
          offset: params.offset || 0, 
          currentPage: 1, 
          totalPages: 0, 
          hasMore: false 
        } 
      }
    };
  }
}

export default {
  fetchModels,
  normalizeModel,
  mapParams
}; 