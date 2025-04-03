/**
 * Centralized configuration for API services
 * 
 * This file contains configuration for all external API services used by the application.
 * Using environment variables with fallbacks for local development.
 */

// AWE API Configuration
export const AWE_CONFIG = {
  BASE_URL: process.env.AWE_API_ENDPOINT || 'https://wptcd.com/api/model/feed',
  SITE_ID: process.env.AWE_SITE_ID || '201300',
  PS_ID: process.env.AWE_PS_ID || 'mikeeyy3',
  PS_TOOL: process.env.AWE_PS_TOOL || '213_1',
  PS_PROGRAM: process.env.AWE_PS_PROGRAM || 'cbrnd',
  CAMPAIGN_ID: process.env.AWE_CAMPAIGN_ID || '117404',
  API_KEY: process.env.AWE_API_KEY || '8d3f909766a7009186058874fb8fe2b4',
};

// VPAPI (Video Promotion API) Configuration
export const VPAPI_CONFIG = {
  // Use the base URL from env, default to pt.ptawe.com if not set
  BASE_URL: process.env.VPAPI_URL || 'https://pt.ptawe.com',
  API_KEY: process.env.VPAPI_KEY || 'a0163de9298e6c0fb2699b73b41da52e', // Fall back to correct key
  PSID: process.env.VPAPI_PSID || 'mikeeyy3',   // Fall back to AWE PSID if VPAPI PSID not set
  // Define specific endpoint paths per API documentation
  LIST_ENDPOINT: '/api/video-promotion/v1/list',
  TAGS_ENDPOINT: '/api/video-promotion/v1/tags',
  DETAILS_ENDPOINT: '/api/video-promotion/v1/details',
  RELATED_ENDPOINT: '/api/video-promotion/v1/related',
  CONTENT_TITLES_ENDPOINT: '/api/video-promotion/v1/content-titles',
  // Client-side endpoints (require X-Requested-With header)
  CLIENT_LIST_ENDPOINT: '/api/video-promotion/v1/client/list',
  CLIENT_DETAILS_ENDPOINT: '/api/video-promotion/v1/client/details',
  CLIENT_RELATED_ENDPOINT: '/api/video-promotion/v1/client/related'
};

// Free API (Chaturbate) Configuration
export const FREE_CONFIG = {
  BASE_URL: process.env.FREE_API_ENDPOINT || 'https://chaturbate.com/api/public/affiliates/onlinerooms/',
  LIMIT: 100, // Default limit for their API
  WM: process.env.FREE_WM || 'mistress', // Campaign slug
};

// API Provider Constants
export const ApiProviders = {
  AWE: 'awe',      // LiveJasmin Models
  VPAPI: 'vpapi',  // LiveJasmin Videos
  FREE: 'free'     // Chaturbate Models
};

// Default API Request Parameters
export const DEFAULT_PARAMS = {
  LIMIT: 24,        // Default number of items per page
  CACHE_TIME: 300,  // Default cache time in seconds (5 minutes)
};

export default {
  AWE_CONFIG,
  VPAPI_CONFIG,
  FREE_CONFIG,
  ApiProviders,
  DEFAULT_PARAMS
}; 