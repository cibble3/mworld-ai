// Static category metadata
const categoryMetadata = {
  asian: {
    title: 'Asian Cam Girls',
    description: 'Watch live Asian cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'asian cams, live cams, asian cam models, webcam models, live chat',
  },
  ebony: {
    title: 'Ebony Cam Girls',
    description: 'Watch live Ebony cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'ebony cams, live cams, ebony cam models, webcam models, live chat',
  },
  latina: {
    title: 'Latina Cam Girls',
    description: 'Watch live Latina cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'latina cams, live cams, latina cam models, webcam models, live chat',
  },
  teen: {
    title: 'Teen Cam Girls',
    description: 'Watch live Teen cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'teen cams, live cams, teen cam models, webcam models, live chat',
  },
  milf: {
    title: 'MILF Cam Girls',
    description: 'Watch live MILF cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'milf cams, live cams, milf cam models, webcam models, live chat',
  },
  blonde: {
    title: 'Blonde Cam Girls',
    description: 'Watch live Blonde cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'blonde cams, live cams, blonde cam models, webcam models, live chat',
  },
  brunette: {
    title: 'Brunette Cam Girls',
    description: 'Watch live Brunette cam models perform just for you. Join now for the best live cam experience.',
    keywords: 'brunette cams, live cams, brunette cam models, webcam models, live chat',
  },
};

/**
 * Get category metadata
 * @param {string} type - Category type
 * @returns {Object} Category metadata
 */
export function getCategoryMeta(type) {
  return categoryMetadata[type] || {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Cams`,
    description: `Watch live ${type} cam models perform just for you. Join now for the best live cam experience.`,
    keywords: `${type} cams, live cams, cam models, webcam models, live chat`,
  };
}

/**
 * Get category models (dummy implementation - real version would call API)
 * @param {string} type - Category type
 * @param {Object} filters - Filters to apply
 * @param {number} limit - Number of models to return
 * @returns {Array} Models
 */
export function getCategoryModels(type, filters = {}, limit = 32) {
  // This is a dummy function that would be replaced by a real API call
  // In real implementation, this would call the API with the category and filters
  return [];
} 