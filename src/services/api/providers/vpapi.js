/**
 * VPAPI Provider
 * 
 * Standardized interface for Video Promotion API (LiveJasmin Videos) integration with:
 * - Proper caching
 * - Consistent error handling
 * - Data normalization
 * - Request parameter mapping
 */

import axios from 'axios';
import cache, { generateCacheKey } from '../cache';

// TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// VPAPI configuration
const VPAPI_CONFIG = {
  // Base configuration and credentials
  BASE_URL: process.env.VPAPI_URL || 'https://pt.ptawe.com',
  API_KEY: process.env.VPAPI_KEY || 'a0163de9298e6c0fb2699b73b41da52e',
  PSID: process.env.VPAPI_PSID || 'mikeeyy3',
  CLIENT_IP: process.env.VPAPI_CLIENT_IP || '223.177.55.88',
  
  // Required parameters per documentation
  COBRAND_ID: process.env.VPAPI_COBRAND_ID || '201300',
  SITE: process.env.VPAPI_SITE || 'wl3',
  
  // Sexual orientation mappings for categories (required parameter)
  SEX_ORIENTATION: {
    DEFAULT: 'straight',
    TRANS: 'shemale',
    GAY: 'gay',
    MALE: 'gay',
    FEMALE: 'straight',
    STRAIGHT: 'straight'
  },
  
  // Endpoint paths
  LIST_ENDPOINT: '/api/video-promotion/v1/list',
  DETAILS_ENDPOINT: '/api/video-promotion/v1/details',
  TAGS_ENDPOINT: '/api/video-promotion/v1/tags',
  RELATED_ENDPOINT: '/api/video-promotion/v1/related',
  CONTENT_TITLES_ENDPOINT: '/api/video-promotion/v1/content-titles'
};

/**
 * Ensure URLs are properly formatted (protocol-relative URLs)
 * @param {string} url - URL to format
 * @returns {string} Properly formatted URL
 */
function ensureAbsoluteUrl(url) {
  if (typeof url === 'string' && url.startsWith('//')) {
    return `https:${url}`;
  }
  return url || '';
}

/**
 * Normalize VPAPI video data to a standard format
 * @param {Object} video - Raw video data from VPAPI
 * @returns {Object} Normalized video object
 */
export function normalizeVideo(video) {
  // Ensure we have a valid video object
  if (!video || typeof video !== 'object') {
    console.error('[VPAPI Provider] Invalid video data:', video);
    return {
      id: 'invalid-' + Date.now(),
      title: 'Error: Invalid Video',
      thumbnail: '/images/placeholder.jpg',
      duration: 0,
      views: 0,
      category: 'general',
      tags: [],
      _provider: 'vpapi'
    };
  }

  // Handle protocol-relative URLs from VPAPI
  const profileImage = ensureAbsoluteUrl(video.profileImage);
  const coverImage = ensureAbsoluteUrl(video.coverImage);
  const previewImages = Array.isArray(video.previewImages) 
    ? video.previewImages.map(ensureAbsoluteUrl) 
    : [];
    
  // Determine the best thumbnail to use, prioritizing profileImage
  const bestThumbnail = profileImage || coverImage || (previewImages.length > 0 ? previewImages[0] : '/images/placeholder.jpg');
  
  return {
    id: video.id || 'video-' + Date.now(),
    title: video.title || 'Untitled Video',
    thumbnail: bestThumbnail, 
    previewImages: previewImages,
    coverImage: coverImage,
    duration: parseInt(video.duration, 10) || 0,
    views: parseInt(video.views, 10) || 0, 
    category: video.sexualOrientation || 
              (Array.isArray(video.tags) && video.tags.length > 0 ? video.tags[0] : 'general'), 
    tags: Array.isArray(video.tags) ? video.tags : [],
    createdAt: video.createdAt || null, 
    uploader: video.uploader || 'Unknown',
    uploaderLink: ensureAbsoluteUrl(video.uploaderLink),
    targetUrl: ensureAbsoluteUrl(video.targetUrl),
    detailsUrl: ensureAbsoluteUrl(video.detailsUrl),
    quality: video.quality || 'sd',
    isHd: !!video.isHd,
    _provider: 'vpapi'
  };
}

/**
 * Map application parameters to VPAPI parameters
 * @param {Object} params - Application parameters
 * @returns {Object} VPAPI parameters
 */
export function mapParams(params) {
  // Map category to sexualOrientation - REQUIRED parameter per API docs
  let sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.DEFAULT;
  const categoryLower = (params.category || '').toLowerCase();
  
  if (categoryLower === 'trans' || categoryLower === 'transgender' || categoryLower === 'shemale') {
    sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.TRANS;
  } else if (categoryLower === 'gay' || categoryLower === 'male') {
    sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.GAY;
  } else if (categoryLower === 'lesbian') {
    sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.STRAIGHT;
  }
  
  // Map internal category to VPAPI category
  let vpapiCategory = 'girl'; // Default to 'girl' for most categories
  
  // Only change category for specific cases
  if (categoryLower === 'trans' || categoryLower === 'transgender' || categoryLower === 'shemale') {
    vpapiCategory = 'transgender';
  } else if (categoryLower === 'gay' || categoryLower === 'male') {
    vpapiCategory = 'boy';
  }
  
  // Build parameters according to VPAPI docs
  const apiParams = {
    // Required parameters (per API documentation)
    psid: VPAPI_CONFIG.PSID,
    accessKey: VPAPI_CONFIG.API_KEY,
    clientIp: VPAPI_CONFIG.CLIENT_IP,
    sexualOrientation: sexualOrientation,
    
    // Set the VPAPI category - required for proper categorization
    category: vpapiCategory,
    
    // Additional required parameters
    cobrandId: VPAPI_CONFIG.COBRAND_ID,
    site: VPAPI_CONFIG.SITE,
    
    // Optional parameters
    pageIndex: Math.floor((params.offset || 0) / (params.limit || 24)) + 1,
    limit: params.limit || 24
  };
  
  // Handle tags parameter - enhanced for better filtering
  if (params.tags) {
    // Convert from array or comma-separated string to proper format
    const tagsList = Array.isArray(params.tags) 
      ? params.tags 
      : params.tags.split(',').map(tag => tag.trim());
    
    if (tagsList.length > 0) {
      apiParams.tags = tagsList.join(',');
      console.log(`[VPAPI Provider] Using tags filter: ${apiParams.tags}`);
    }
  }
  
  // Add additional filters from params.filters
  if (params.filters) {
    if (params.filters.quality) apiParams.quality = params.filters.quality;
    
    // Handle legacy tags from filters
    if (params.filters.tags && !apiParams.tags) {
      apiParams.tags = Array.isArray(params.filters.tags) 
        ? params.filters.tags.join(',') 
        : params.filters.tags;
    }
    
    if (params.filters.forcedPerformers) apiParams.forcedPerformers = params.filters.forcedPerformers;
    if (params.filters.mitigable !== undefined) apiParams.mitigable = params.filters.mitigable;
  }
  
  return apiParams;
}

/**
 * Normalize the VPAPI response data
 * @param {Object} response - Raw VPAPI response
 * @param {number} limit - Requested limit
 * @param {number} offset - Requested offset
 * @returns {Object} Normalized response with items and pagination
 */
function normalizeResponse(response, limit, offset) {
  // Check the validity of the response data
  if (!response?.data?.videos || !Array.isArray(response.data.videos)) {
    console.error('[VPAPI Provider] Invalid response data structure:', response);
    return { 
      items: [], 
      pagination: { 
        total: 0, 
        limit, 
        offset, 
        currentPage: 1, 
        totalPages: 0, 
        hasMore: false, 
        count: 0 
      } 
    };
  }
  
  // Normalize videos according to the API docs
  const items = (response.data.videos || []).map(normalizeVideo);
  
  // Extract pagination data according to the API docs structure
  const paginationData = response.data.pagination || {};
  
  // Use the values from the API response when available
  const total = parseInt(paginationData.total, 10) || 0;
  const perPage = parseInt(paginationData.perPage, 10) || limit; 
  const currentPage = parseInt(paginationData.currentPage, 10) || 1;
  const totalPages = parseInt(paginationData.totalPages, 10) || (perPage > 0 ? Math.ceil(total / perPage) : 0);
  const hasMore = currentPage < totalPages;
  const count = parseInt(paginationData.count, 10) || items.length;

  return {
    items,
    pagination: {
      total,
      count,
      limit: perPage, 
      offset: (currentPage - 1) * perPage,
      currentPage,
      totalPages,
      hasMore
    }
  };
}

/**
 * Fetch videos from VPAPI with caching
 * @param {Object} params - Query parameters
 * @param {boolean} skipCache - Whether to skip the cache
 * @returns {Promise<Object>} Normalized response
 */
export async function fetchVideos(params = {}, skipCache = false) {
  try {
    const { category = 'popular', limit = 24, offset = 0 } = params;
    const cacheKey = generateCacheKey('vpapi:videos', params);
    
    // Check cache first if not skipping
    if (!skipCache) {
      try {
        const cached = cache.get(cacheKey);
        if (cached) {
          console.log(`[VPAPI Provider] Using cached data for: ${cacheKey.substring(0, 100)}...`);
          return cached;
        }
      } catch (err) {
        console.warn(`[VPAPI Provider] Error reading from cache:`, err);
        // Continue with API request if cache fails
      }
    }
    
    const apiParams = mapParams(params);
    console.log(`[VPAPI Provider] Making API request for category: ${category}`);
    
    // Build URL as specified in API docs
    const requestUrl = `${VPAPI_CONFIG.BASE_URL}${VPAPI_CONFIG.LIST_ENDPOINT}`;
    
    const response = await axios.get(requestUrl, {
      params: apiParams,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'MistressWorld/1.0'
      }
    });
    
    if (response.status !== 200 || !response.data?.success) {
      throw new Error(`VPAPI request failed with status ${response.status} or success=false`);
    }
    
    // Normalize the data to our internal format
    const normalizedData = normalizeResponse(response.data, limit, offset);
    
    const result = {
      success: true,
      data: normalizedData
    };
    
    // Cache the result with proper error handling
    try {
      cache.set(cacheKey, result, cache.DURATIONS.VIDEOS);
    } catch (err) {
      console.warn(`[VPAPI Provider] Error storing in cache:`, err);
      // Continue even if caching fails
    }
    
    return result;
  } catch (error) {
    console.error(`[VPAPI Provider] Error fetching videos:`, error.message);
    
    let errorMessage = `Failed to fetch videos from VPAPI.`;
    if (error.response) {
      errorMessage = `VPAPI Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      errorMessage = `No response received from VPAPI.`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = `VPAPI request timed out.`;
    }
    
    return {
      success: false,
      error: errorMessage,
      data: { 
        items: [], 
        pagination: { 
          total: 0, 
          limit, 
          offset, 
          currentPage: 1, 
          totalPages: 0, 
          hasMore: false 
        } 
      }
    };
  }
}

export default {
  fetchVideos,
  normalizeVideo,
  mapParams
}; 