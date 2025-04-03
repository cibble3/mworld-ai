/**
 * Ensures a URL is absolute by adding https: to protocol-relative URLs
 * @param {string} url - The URL to convert
 * @returns {string} - The absolute URL
 */
export const ensureAbsoluteUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // Handle protocol-relative URLs (//example.com/image.jpg)
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // If URL already has http/https protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /, assume it's a local asset
  if (url.startsWith('/')) {
    return url;
  }
  
  // Otherwise, assume it's a relative URL and add https://
  return `https://${url}`;
};

/**
 * Gets a safe image URL that works with Next.js Image component
 * Falls back to placeholder if URL is invalid
 * @param {string} url - The image URL
 * @param {string} fallback - Optional fallback image path
 * @returns {string} - Safe image URL
 */
export const getSafeImageUrl = (url, fallback = '/images/placeholder.jpg') => {
  if (!url || typeof url !== 'string') {
    return fallback;
  }
  
  // Make sure URL is absolute
  const absoluteUrl = ensureAbsoluteUrl(url);
  
  // Check for invalid or problematic URLs
  if (!absoluteUrl || 
      absoluteUrl.startsWith('data:') || // Data URLs not supported by Next.js Image
      absoluteUrl === 'https://' || // Malformed URLs
      absoluteUrl === 'http://') {
    console.warn(`Invalid or unsupported image URL: ${url}`);
    return fallback;
  }
  
  return absoluteUrl;
};

/**
 * Extract the appropriate thumbnail from a model object
 * Handles different API formats
 * @param {Object} model - The model object
 * @returns {string} - The thumbnail URL
 */
export const getModelThumbnail = (model) => {
  if (!model) return '/images/placeholder.jpg';
  
  // Check different possible image locations based on API
  const imageUrl = 
    model.images?.thumbnail || // Normalized model format
    model.thumbnail || // Simple thumbnail property
    model.profilePictureUrl?.size320x180 || // AWE API format
    model.image_url || // Free API format
    '/images/placeholder.jpg'; // Fallback
  
  return getSafeImageUrl(imageUrl);
};

/**
 * Extract the appropriate video thumbnail
 * @param {Object} video - The video object
 * @returns {string} - The thumbnail URL
 */
export const getVideoThumbnail = (video) => {
  if (!video) return '/images/placeholder.jpg';
  
  // Check different possible thumbnail locations
  const imageUrl = 
    video.images?.thumbnail ||
    video.thumbnail ||
    video.profileImage ||
    video.coverImage ||
    (Array.isArray(video.previewImages) && video.previewImages.length > 0 
      ? video.previewImages[0]
      : null) ||
    '/images/placeholder.jpg';
  
  return getSafeImageUrl(imageUrl);
};

/**
 * Generate a URL slug from a title
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}; 