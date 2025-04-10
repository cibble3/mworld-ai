/**
 * Utilities for generating SEO-friendly dynamic routes from filter combinations
 */
import FILTER_MAP from '@/config/filterMap';

/**
 * Map of high-value filter keywords to SEO-friendly paths
 */
export const ROUTE_MAPPINGS = {
  // Ethnicity routes
  'asian': 'asian-cams',
  'latina': 'latina-cams',
  'ebony': 'ebony-cams',
  'white': 'white-cams',
  'middle_eastern': 'middle-eastern-cams',
  'indian': 'indian-cams',
  
  // Hair color routes
  'blonde': 'blonde-cams',
  'brunette': 'brunette-cams',
  'red': 'redhead-cams',
  'black': 'black-hair-cams',
  
  // Body type routes
  'slim': 'slim-cams',
  'athletic': 'athletic-cams',
  'curvy': 'curvy-cams',
  'bbw': 'bbw-cams',
  'petite': 'petite-cams',
  
  // Tags routes
  'milf': 'milf-cams',
  'bdsm': 'bdsm-cams',
  'squirt': 'squirting-cams',
  'lingerie': 'lingerie-cams',
  'tattoos': 'tattooed-cams',
  'piercing': 'pierced-cams',
  
  // Language routes
  'english': 'english-speaking-cams',
  'spanish': 'spanish-speaking-cams',
  'french': 'french-speaking-cams',
  
  // Age routes
  '18-22': 'teen-cams',
  '23-29': 'twenties-cams',
  '30-39': 'thirties-cams',
  '40+': 'mature-cams',
  
  // Breast size routes
  'small': 'small-breasts-cams',
  'large': 'big-breasts-cams',
  'very_large': 'huge-breasts-cams',
};

/**
 * Generate a SEO-friendly URL slug from filter values
 * @param {string} baseCategory - Base category (girls, trans, etc)
 * @param {Object} filters - Key-value pairs of active filters
 * @returns {string} SEO-friendly URL path
 */
export const generateSeoUrl = (baseCategory, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return `/${baseCategory}`;
  }
  
  // Find the most important filter for the URL (prioritize ethnicity > tags > hair color)
  const priorityOrder = ['ethnicity', 'tags', 'hair_color', 'body_type', 'age_group', 'breast_size'];
  let primaryFilter = null;
  let primaryValue = null;
  
  for (const filterType of priorityOrder) {
    if (filters[filterType]) {
      primaryFilter = filterType;
      primaryValue = filters[filterType];
      break;
    }
  }
  
  if (!primaryFilter || !primaryValue || !ROUTE_MAPPINGS[primaryValue]) {
    // If no primary filter found or no mapping for the value, use base category
    return `/${baseCategory}`;
  }
  
  // Generate SEO-friendly path
  return `/${baseCategory}/${ROUTE_MAPPINGS[primaryValue]}`;
};

/**
 * Extract filter parameters from a SEO-friendly URL path
 * @param {string} path - URL path to parse
 * @returns {Object} The extracted filters and base category
 */
export const extractFiltersFromPath = (path) => {
  // If path contains query parameters, don't try to extract filters from the path
  if (path && path.includes('?')) {
    // Extract the base category, which is everything before the ?
    const category = path.split('?')[0].replace(/^\/+|\/+$/g, '') || 'girls';
    return { category, filters: {} };
  }
  
  if (!path) return { category: 'girls', filters: {} };
  
  // Remove leading slash if present
  const normPath = path.startsWith('/') ? path.substring(1) : path;
  const segments = normPath.split('/');
  
  // The first segment is the base category
  const category = segments[0] || 'girls';
  
  // If only the category is present, no filters to extract
  if (segments.length === 1) {
    return { category, filters: {} };
  }
  
  // The second segment contains the SEO path (subcategory or filter)
  const seoPath = segments[1];
  
  // Find matching filter value from route mappings
  const reverseMapping = {};
  Object.entries(ROUTE_MAPPINGS).forEach(([value, path]) => {
    reverseMapping[path] = value;
  });
  
  const filterValue = reverseMapping[seoPath];
  if (!filterValue) {
    // If it's not a mapped filter path, it might be a direct filter/type value
    // We'll check if it exists in any of our filter categories
    for (const [filterType, config] of Object.entries(FILTER_MAP)) {
      for (const provider of Object.values(config.providers)) {
        if (Object.keys(provider.map).includes(seoPath)) {
          // Found a direct match with a filter value
          return {
            category,
            filters: {
              [filterType]: seoPath
            }
          };
        }
      }
    }
    
    // If we still can't find a match, treat it as a subcategory
    return { 
      category, 
      filters: { 
        subcategory: seoPath 
      } 
    };
  }
  
  // Determine which filter type this value belongs to
  for (const [filterType, config] of Object.entries(FILTER_MAP)) {
    for (const provider of Object.values(config.providers)) {
      if (Object.values(provider.map).includes(filterValue) || 
          Object.keys(provider.map).includes(filterValue)) {
        // Found the filter type this value belongs to
        return {
          category,
          filters: {
            [filterType]: filterValue
          }
        };
      }
    }
  }
  
  // Fallback - couldn't determine filter type
  return { category, filters: {} };
};

/**
 * Generate metadata for a SEO-driven filter page
 * @param {string} category - Base category (girls, trans, etc)
 * @param {Object} filters - Active filters
 * @returns {Object} Page metadata (title, description)
 */
export const generateFilterPageMetadata = (category, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    // Default metadata for category pages
    switch (category) {
      case 'girls':
        return {
          title: 'Live Cam Girls | MistressWorld',
          description: 'Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.'
        };
      case 'trans':
        return {
          title: 'Live Trans Cams | MistressWorld',
          description: 'Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.'
        };
      case 'fetish':
        return {
          title: 'Fetish Cams | MistressWorld',
          description: 'Discover fetish-friendly cam models for BDSM, domination, and more kinky experiences online.'
        };
      default:
        return {
          title: 'Live Cams | MistressWorld',
          description: 'Watch live cam models perform just for you. The hottest webcam shows available 24/7.'
        };
    }
  }
  
  // Get descriptions for each filter
  const filterDescriptions = {
    ethnicity: {
      asian: 'Asian',
      latina: 'Latina',
      ebony: 'Ebony',
      white: 'White',
      middle_eastern: 'Middle Eastern',
      indian: 'Indian'
    },
    hair_color: {
      blonde: 'Blonde',
      brunette: 'Brunette',
      red: 'Redhead',
      black: 'Black-haired',
      blue: 'Blue-haired',
      pink: 'Pink-haired'
    },
    body_type: {
      slim: 'Slim',
      athletic: 'Athletic',
      curvy: 'Curvy',
      bbw: 'BBW',
      petite: 'Petite'
    },
    tags: {
      milf: 'MILF',
      bdsm: 'BDSM',
      lingerie: 'Lingerie',
      squirt: 'Squirting',
      tattoos: 'Tattooed',
      piercing: 'Pierced'
    },
    age_group: {
      '18-22': 'Teen',
      '23-29': '20s',
      '30-39': '30s',
      '40+': 'Mature'
    },
    breast_size: {
      small: 'Small-breasted',
      medium: 'Medium-breasted',
      large: 'Big-breasted',
      very_large: 'Huge-breasted'
    },
    language: {
      english: 'English-speaking',
      spanish: 'Spanish-speaking',
      french: 'French-speaking',
      german: 'German-speaking',
      russian: 'Russian-speaking',
      italian: 'Italian-speaking'
    }
  };
  
  // Build descriptive title and description based on active filters
  let title = '';
  let description = '';
  
  // Process each filter to build the metadata
  for (const [filterType, filterValue] of Object.entries(filters)) {
    if (filterDescriptions[filterType] && filterDescriptions[filterType][filterValue]) {
      // Get the human-readable filter description
      const filterDesc = filterDescriptions[filterType][filterValue];
      
      // Add to title
      if (title === '') {
        title = `${filterDesc} `;
      } else {
        title += `${filterDesc} `;
      }
    }
  }
  
  // Complete the title based on category
  switch(category) {
    case 'girls':
      title += 'Cam Girls | MistressWorld';
      description = `Watch ${title.replace(' | MistressWorld', '')} perform live on webcam. Beautiful models waiting to chat with you.`;
      break;
    case 'trans':
      title += 'Trans Cam Models | MistressWorld';
      description = `Explore ${title.replace(' | MistressWorld', '')} performing live on webcam. Stunning transgender models ready for private chat.`;
      break;
    case 'fetish':
      title += 'Fetish Cam Models | MistressWorld';
      description = `Experience ${title.replace(' | MistressWorld', '')} in live fetish webcam shows. Domination, submission, and kinky play with our models.`;
      break;
    default:
      title += 'Live Cam Models | MistressWorld';
      description = `Discover ${title.replace(' | MistressWorld', '')} ready to perform just for you. 24/7 live webcam entertainment.`;
  }
  
  return { title, description };
};

export default {
  ROUTE_MAPPINGS,
  generateSeoUrl,
  extractFiltersFromPath,
  generateFilterPageMetadata
}; 