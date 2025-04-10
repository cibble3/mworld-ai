/**
 * Centralized environment configuration
 * 
 * This module provides a consistent interface for accessing environment variables
 * with fallbacks and validation.
 */

export const ENV = {
  /**
   * Site base URL
   */
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://mistressworld.com',
  
  /**
   * API endpoint for models
   */
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/real-models-test',
  
  /**
   * Content delivery network URL for images
   */
  CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || 'https://galleryn0.vcmdiawe.com',
  
  /**
   * Pre-connect URL for performance
   */
  PRE_CONNECT_URL: process.env.NEXT_PUBLIC_PRE_CONNECT_URL || 'https://wmcdpt.com',
  
  /**
   * Development mode flag
   */
  IS_DEV: process.env.NODE_ENV === 'development',
  
  /**
   * Production mode flag
   */
  IS_PROD: process.env.NODE_ENV === 'production',
  
  /**
   * Default page size for model listings
   */
  DEFAULT_PAGE_SIZE: 24,
  
  /**
   * Default page size for homepage featured sections
   */
  HOMEPAGE_FEATURED_COUNT: 6
};

export default ENV; 