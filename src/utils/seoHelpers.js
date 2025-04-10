/**
 * SEO Utility functions for generating dynamic metadata
 * based on page content and query parameters
 */
import { extractFiltersFromPath, generateFilterPageMetadata } from './dynamicRoutes';
import ENV from '@/config/environment';

/**
 * Generate dynamic page metadata based on URL path and query parameters
 * 
 * @param {string} path - Current URL path
 * @param {Object} searchParams - Next.js searchParams object with query parameters
 * @param {string} defaultTitle - Default page title if no filters are present
 * @param {string} defaultDesc - Default page description if no filters are present
 * @returns {Object} The metadata object with title, description and other SEO properties
 */
export const generateDynamicMetadata = (path, searchParams, defaultTitle, defaultDesc) => {
  // Extract base path without query parameters
  const basePath = path?.split('?')[0] || '';
  
  // Get filter terms from query parameters
  const queryFilters = {};
  
  if (searchParams) {
    // Common filter parameters to extract
    const filterParams = [
      'ethnicity', 'hair_color', 'body_type', 'tags', 
      'age_group', 'breast_size', 'language'
    ];
    
    filterParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        queryFilters[param] = value;
      }
    });
  }
  
  // Extract category from path
  const pathParts = basePath.split('/').filter(part => part);
  const category = pathParts[0] || 'girls';
  
  // Generate metadata based on filters
  const metadata = generateFilterPageMetadata(category, queryFilters);
  
  // Add additional SEO attributes
  return {
    ...metadata,
    keywords: generateSeoKeywords(category, queryFilters),
    canonicalUrl: generateCanonicalUrl(path),
    ogImage: generateOgImage(category, queryFilters),
    schema: generateSchemaMarkup(category, metadata.title, metadata.description)
  };
};

/**
 * Generate SEO keywords based on filters
 */
export const generateSeoKeywords = (category, filters) => {
  const baseKeywords = {
    'girls': 'cam girls, webcam models, live chat, video chat',
    'trans': 'trans cams, transgender models, live chat, video chat',
    'fetish': 'fetish cams, bdsm cams, domination, mistress cams'
  };
  
  const keywords = baseKeywords[category] || 'live cams, webcam models';
  
  // Add filter-specific keywords
  const filterKeywords = [];
  
  if (filters.ethnicity) {
    filterKeywords.push(`${filters.ethnicity} cam models`);
  }
  
  if (filters.hair_color) {
    filterKeywords.push(`${filters.hair_color} hair cam models`);
  }
  
  if (filters.body_type) {
    filterKeywords.push(`${filters.body_type} cam models`);
  }
  
  if (filters.tags) {
    filterKeywords.push(`${filters.tags} cams`);
  }
  
  if (filterKeywords.length > 0) {
    return `${keywords}, ${filterKeywords.join(', ')}`;
  }
  
  return keywords;
};

/**
 * Generate canonical URL for the current page
 */
export const generateCanonicalUrl = (path) => {
  return `${ENV.SITE_URL}${path}`;
};

/**
 * Generate Open Graph image based on category and filters
 */
export const generateOgImage = (category, filters) => {
  // Default OG images by category
  const defaultImages = {
    'girls': '/images/og-girls.jpg',
    'trans': '/images/og-trans.jpg',
    'fetish': '/images/og-fetish.jpg'
  };
  
  // If we have ethnicity filter, we can use specific ethnic OG images
  if (filters.ethnicity) {
    const ethnicityImages = {
      'asian': '/images/og-asian.jpg',
      'latina': '/images/og-latina.jpg',
      'ebony': '/images/og-ebony.jpg'
    };
    
    if (ethnicityImages[filters.ethnicity]) {
      return ethnicityImages[filters.ethnicity];
    }
  }
  
  return defaultImages[category] || '/images/og-default.jpg';
};

/**
 * Generate JSON-LD schema markup for SEO
 */
export const generateSchemaMarkup = (category, title, description) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': ENV.SITE_URL
  };
};

export default {
  generateDynamicMetadata,
  generateSeoKeywords,
  generateCanonicalUrl,
  generateOgImage,
  generateSchemaMarkup
}; 