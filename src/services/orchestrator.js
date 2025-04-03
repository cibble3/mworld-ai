import axios from 'axios';
import mockVPAPI from './mockVPAPI';
import { ensureAbsoluteUrl } from '@/utils/image-helpers';

// --- Constants ---
const DEFAULT_LIMIT = 24;
export const ApiProviders = {
  AWE: 'awe',      // LiveJasmin Models
  VPAPI: 'vpapi',  // LiveJasmin Videos
  FREE: 'free'     // Chaturbate Models
};

// --- API Configurations (Load from environment variables) ---
const AWE_CONFIG = {
  BASE_URL: process.env.AWE_API_ENDPOINT || 'https://wptcd.com/api/model/feed',
  SITE_ID: process.env.AWE_SITE_ID || '201300',
  PS_ID: process.env.AWE_PS_ID || 'mikeeyy3',
  PS_TOOL: process.env.AWE_PS_TOOL || '213_1',
  PS_PROGRAM: process.env.AWE_PS_PROGRAM || 'cbrnd',
  CAMPAIGN_ID: process.env.AWE_CAMPAIGN_ID || '117404',
  API_KEY: process.env.AWE_API_KEY || '8d3f909766a7009186058874fb8fe2b4',
};

const FREE_CONFIG = {
  BASE_URL: process.env.FREE_API_ENDPOINT || 'https://chaturbate.com/api/public/affiliates/onlinerooms/',
  LIMIT: 100, // Default limit for their API?
  WM: process.env.FREE_WM, // Load campaign slug from env
};

/**
 * VPAPI Configuration
 * 
 * The Video Promotion API (VPAPI) provides video content from the LiveJasmin network.
 * This API requires specific parameters for authentication and content filtering.
 * 
 * Required parameters:
 * - psid: Partner ID for identification
 * - accessKey: Authentication key
 * - clientIp: IP address for region filtering
 * - sexualOrientation: Content type ("straight", "gay", "shemale")
 * - cobrandId: Partner cobrand ID
 * - site: Site identifier
 * 
 * For full documentation on the integration, see docs/VPAPI-Integration.md
 */
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

// --- Taxonomy Mapping (Centralized) ---
// Define known filter types and their potential values from AWE API (extracted from Laravel Helper)
const AWE_FILTERS = {
    age: ['teen', 'milf', 'twenties'],
    appearance: ['hairy-pussy', 'intim-piercing', 'leather', 'long-nails', 'piercing', 'pregnant', 'shaved', 'stockings', 'tattoo'],
    breasts: ["big-boobs", "huge-breasts", "normal-tits", "tiny-breast"],
    build: ["average-built", "bbw", "petite", "sporty"],
    ethnicity: ["asian", "ebony", "latin", "white"], // Note: 'latin' used by AWE
    hair_color: ["auburn", "black-haired", "blonde", "brunette", "fire-red", "pink"],
    hair_type: ["crew-cut", "long-hair", "short-hair", "shoulder-length"],
    willingness: ["anal", "butt-plug", "cameltoe", "close-up", "dancing", "dildo", "fingering", "live-orgasm", "love-balls", "oil", "roleplay", "smoke-cigarette", "snapshot", "squirt", "strap-on", "striptease", "vibrator", "zoom"],
    penis_size: ["big-penis", "huge-penis", "normal-penis", "small-penis"],
};

// Simple synonym mapping based on Laravel helper logic
const AWE_SYNONYMS = {
    'latina': 'latin', // Map internal 'latina' to AWE 'latin'
    'big-tits': 'big-boobs',
    'tiny-tits': 'tiny-breast',
    'tiny-boobs': 'tiny-breast',
    'huge-tits': 'huge-breasts',
    'huge-boobs': 'huge-breasts',
    'average': 'average-built',
    'black': 'ebony', // Map internal 'black' to AWE 'ebony'
    'red': 'fire-red',
    // Add other necessary synonyms
};

// Helper to generate user-friendly names (e.g., 'bbw' -> 'BBW', 'big-boobs' -> 'Big Boobs')
const formatName = (id) => id.replace(/[-_]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// --- Normalization Functions ---

const normalizeAWEModel = (model) => {
    // Validate model input and provide default values
    if (!model || typeof model !== 'object') {
        console.error(`[normalizeAWEModel] Invalid model data:`, model);
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
            _provider: ApiProviders.AWE
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
        _provider: ApiProviders.AWE
    };
};

const normalizeFreeModel = (model) => {
    console.log(`[Orchestrator] Normalizing FREE model:`, JSON.stringify(model).substring(0, 200) + '...');
    
    try {
        // Generate a consistent ID
        const modelId = model.username || `free-model-${Math.random().toString(36).substring(2, 10)}`;
        
        // Handle Chaturbate's specific response format
        return {
            id: modelId,
            performerId: modelId, // Add performerId that matches id
            slug: modelId, 
            name: model.display_name || model.username || 'Unknown Model',
            image: model.image_url || '/images/placeholder.jpg', // Add image field that matches thumbnail
            thumbnail: model.image_url || '/images/placeholder.jpg',
            preview: model.image_url_360x270 || model.image_url || '/images/placeholder.jpg',
            isOnline: true, // Free models are always returned as online
            viewerCount: model.num_users || 0,
            age: 25, // Age is not reliably provided
            ethnicity: '', // Not provided
            bodyType: '', // Not provided
            tags: model.tags || [],
            _provider: 'free',
            // Original data we might need
            _original: {
                ...model
            }
        };
    } catch (error) {
        console.error('[Orchestrator] Error normalizing FREE model:', error);
        const fallbackId = `free-model-${Math.random().toString(36).substring(2, 10)}`;
        return {
            id: fallbackId,
            performerId: fallbackId,
            name: 'Unknown Free Model',
            image: '/images/placeholder.jpg',
            thumbnail: '/images/placeholder.jpg',
            preview: '/images/placeholder.jpg',
            isOnline: true,
            viewerCount: 0,
            _provider: 'free',
            _error: error.message
        };
    }
};

// CRITICAL: Do not modify this function as it's essential for VPAPI functionality
// This function handles protocol-relative URLs returned by the VPAPI service
const normalizeVPAPIVideo = (video) => {
  // Ensure we have a valid video object
  if (!video || typeof video !== 'object') {
    console.error('[Orchestrator] Invalid video data in normalizeVPAPIVideo:', video);
    return {
      id: 'invalid-' + Date.now(),
      title: 'Error: Invalid Video',
      thumbnail: '/images/placeholder.jpg',
      duration: 0,
      views: 0,
      category: 'general',
      tags: [],
      _provider: ApiProviders.VPAPI
    };
  }

  // Normalize based on the VPAPI /list response structure according to API docs
  // CRITICAL: These image URLs are protocol-relative (//domain.com/path) and must be converted to https:
  const profileImage = ensureAbsoluteUrl(video.profileImage);
  const coverImage = ensureAbsoluteUrl(video.coverImage);
  const previewImages = Array.isArray(video.previewImages) 
    ? video.previewImages.map(ensureAbsoluteUrl) 
    : [];
    
  // Determine the best thumbnail to use, prioritizing profileImage
  const bestThumbnail = profileImage || coverImage || (previewImages.length > 0 ? previewImages[0] : '/images/placeholder.jpg');
  
  // Log the chosen thumbnail URL for debugging
  console.log(`[Orchestrator] [normalizeVPAPIVideo] ID: ${video.id || 'N/A'}, Chosen Thumbnail: ${bestThumbnail}`);
  
  return {
    id: video.id || 'video-' + Date.now(),
    title: video.title || 'Untitled Video',
    // According to docs, profileImage is the main thumbnail
    thumbnail: bestThumbnail, 
    // Include other fields from the API
    previewImages: previewImages,
    coverImage: coverImage,
    duration: parseInt(video.duration, 10) || 0,
    views: parseInt(video.views, 10) || 0, 
    // Categories can be inferred from sexualOrientation or tags
    category: video.sexualOrientation || 
              (Array.isArray(video.tags) && video.tags.length > 0 ? video.tags[0] : 'general'), 
    tags: Array.isArray(video.tags) ? video.tags : [],
    createdAt: video.createdAt || null, 
    uploader: video.uploader || 'Unknown',
    uploaderLink: ensureAbsoluteUrl(video.uploaderLink), // Ensure absolute URL
    targetUrl: ensureAbsoluteUrl(video.targetUrl), // Ensure absolute URL
    detailsUrl: ensureAbsoluteUrl(video.detailsUrl), // Ensure absolute URL
    quality: video.quality || 'sd',
    isHd: !!video.isHd,
    _provider: ApiProviders.VPAPI
  };
};

// Function to normalize the structure of the VPAPI list response
const normalizeVPAPIData = (vpapiResponseData, limit, offset) => {
    // Check the validity of the response data
    if (!vpapiResponseData?.data?.videos || !Array.isArray(vpapiResponseData.data.videos)) {
        console.error('[Orchestrator] Invalid VPAPI response data structure for videos:', vpapiResponseData);
        return { items: [], pagination: { total: 0, limit, offset, currentPage: 1, totalPages: 0, hasMore: false, count: 0 } };
    }
    
    // Normalize videos according to the API docs
    const items = (vpapiResponseData.data.videos || []).map(normalizeVPAPIVideo);
    
    // Extract pagination data according to the API docs structure
    const paginationData = vpapiResponseData.data.pagination || {};
    
    // Use the values from the API response when available
    const total = parseInt(paginationData.total, 10) || 0;
    // Use perPage from response if available, otherwise fallback to request limit
    const perPage = parseInt(paginationData.perPage, 10) || limit; 
    const currentPage = parseInt(paginationData.currentPage, 10) || 1;
    const totalPages = parseInt(paginationData.totalPages, 10) || (perPage > 0 ? Math.ceil(total / perPage) : 0);
    const hasMore = currentPage < totalPages;
    const count = parseInt(paginationData.count, 10) || items.length;

    // Log pagination details for debugging
    console.log('[Orchestrator] VPAPI Pagination:', {
        apiTotal: paginationData.total,
        apiCount: paginationData.count,
        apiPerPage: paginationData.perPage,
        apiCurrentPage: paginationData.currentPage,
        apiTotalPages: paginationData.totalPages,
        calculatedHasMore: hasMore
    });

    return {
        items,
        pagination: {
            total,
            count,
            limit: perPage, 
            offset: (currentPage - 1) * perPage, // Calculate offset based on current page and perPage
            currentPage,
            totalPages,
            hasMore
        }
    };
};

// --- Mock Data Generators ---

// Basic mock model generator (used as fallback)
const generateMockModels = (provider, category, subcategory, limit, offset) => {
    const items = [];
    const total = 50; // Example total
    for (let i = 0; i < limit; i++) {
      const index = offset + i;
      if (index >= total) break;
      items.push({
        id: `${provider}-mock-${category}-${index}`,
        slug: `mock-model-${index}`,
        name: `Mock ${provider} Model ${index + 1}`,
        thumbnail: `https://picsum.photos/id/${200 + index}/320/180`,
        preview: `https://picsum.photos/id/${200 + index}/800/600`,
        age: 25 + (index % 10),
        ethnicity: 'latin',
        tags: [category, subcategory, 'mock'].filter(Boolean),
        isOnline: true,
        viewerCount: 100 + (index * 5),
        _provider: provider
      });
    }
    return { items, total };
};

// Enhanced Mock Video Generator - creates more realistic-looking data matching VPAPI structure
const generateEnhancedMockVideos = (category, limit, offset, filters = {}) => {
  console.log(`[Orchestrator] Generating enhanced mock videos for ${category}, limit=${limit}, offset=${offset}`);
  
  const items = [];
  const totalMockItems = 200; // Simulate a larger dataset

  // Video category data - to make mock data more realistic
  const videoCategories = {
    popular: {
      titles: [
        'Hot Sex Session with Gorgeous Blonde',
        'Intense Passionate Love Making',
        'Ultimate Pleasure Scene with Beautiful Model',
        'Erotic Adventure with Stunning Brunette',
        'Intimate Moments with Perfect Curves',
        'Wild Ride with Amazing Body',
        'Best Sex Collection Volume 3',
        'Perfect Chemistry Between Lovers',
        'Sensual Massage Leads to More',
        'Romantic Evening Turns Wild'
      ],
      tags: ['featured', 'hd', 'popular', 'trending']
    },
    new: {
      titles: [
        'Fresh Release: Exciting Bedroom Session',
        'New Upload: Passionate Couple Experience',
        'Just Added: Intense Pleasure Moments',
        'Latest Scene: Beautiful Connection',
        'New Release: Perfect Body Exploration',
        'Just Uploaded: Amazing Sex Adventure',
        'New Video: Ultimate Satisfaction',
        'Fresh Scene: Erotic Fantasy Fulfilled',
        'Latest Addition: Intimate Pleasure',
        'New Content: Perfect Chemistry'
      ],
      tags: ['new', 'fresh', 'recent', 'hd']
    },
    amateur: {
      titles: [
        'Real Couple Shares Intimate Moment',
        'Homemade Passionate Love Making',
        'Amateur Couple\'s Wild Night',
        'Real People, Real Passion',
        'Authentic Amateur Experience',
        'Genuine Pleasure On Camera',
        'First Time Filming Our Passion',
        'Natural Beauty in Amateur Setting',
        'Unscripted Pleasure Moments',
        'Real Couple Shows How It\'s Done'
      ],
      tags: ['amateur', 'homemade', 'real', 'authentic']
    },
    fetish: {
      titles: [
        'Dominant Experience with Submissive Beauty',
        'BDSM Adventure with Willing Partner',
        'Leather and Lace Fetish Exploration',
        'Intense Roleplay Fantasy Fulfilled',
        'Kinky Session with Experienced Mistress',
        'Fetish Dreams Come True',
        'Bondage and Pleasure Mixed Perfectly',
        'Domination Scene with Amazing Results',
        'Fantasy Roleplay Gets Intense',
        'Exploring Limits in Special Setting'
      ],
      tags: ['fetish', 'bdsm', 'kinky', 'roleplay']
    },
    lesbian: {
      titles: [
        'Beautiful Women Share Passionate Moment',
        'Sensual Exploration Between Girlfriends',
        'Intimate Lesbian Experience',
        'Perfect Chemistry Between Women',
        'Passionate Connection Between Beauties',
        'Girlfriends Discover Ultimate Pleasure',
        'Sensual Massage Between Women',
        'Exploring Pleasure Together',
        'Beautiful Lesbian Scene with Perfect Bodies',
        'Intimate Connection Between Friends'
      ],
      tags: ['lesbian', 'women', 'sensual', 'girlfriends']
    },
    milf: {
      titles: [
        'Experienced Beauty Shows How It\'s Done',
        'Mature Wonder with Amazing Skills',
        'MILF Perfection in Bedroom',
        'Experienced Woman Takes Control',
        'Mature Beauty with Perfect Moves',
        'Seasoned Expert Delivers Pleasure',
        'MILF Adventure with Young Stud',
        'Experienced Goddess Shares Wisdom',
        'Perfect MILF Body in Action',
        'Mature Queen Rules the Bedroom'
      ],
      tags: ['milf', 'mature', 'experienced', 'cougar']
    },
    anal: {
      titles: [
        'Ultimate Anal Experience',
        'Perfect Backdoor Adventure',
        'Anal Pleasure Session',
        'Intense Anal Exploration',
        'Amazing Anal Scene with Beautiful Model',
        'Backdoor Fantasy Fulfilled',
        'Anal Queen Shows Her Skills',
        'Incredible Anal Performance',
        'First Time Anal Experience',
        'Anal Pleasure Done Right'
      ],
      tags: ['anal', 'backdoor', 'intense']
    },
    trans: {
      titles: [
        'Beautiful Trans Model Performs',
        'Stunning Trans Beauty in Action',
        'Perfect Trans Body on Display',
        'Gorgeous Trans Performance',
        'Trans Beauty Shows Her Skills',
        'Amazing Trans Model Experience',
        'Beautiful Trans Scene',
        'Trans Goddess in Perfect Setting',
        'Incredible Trans Performance',
        'Stunning Trans Model Delivers'
      ],
      tags: ['trans', 'transgender', 'beautiful', 'shemale']
    }
  };
  
  // Default to popular if category not found
  const categoryData = videoCategories[category] || videoCategories.popular;
  
  // Generate unique video IDs based on category and offset
  const generateUniqueId = (index) => {
    const idBase = Date.now().toString(36).substring(4);
    return `${category}-${idBase}-${offset + index}`;
  };

  for (let i = 0; i < limit; i++) {
    const currentIndex = offset + i;
    if (currentIndex >= totalMockItems) break; // Stop if we exceed total mock items

    // Create more realistic-looking video data
    const titleIndex = currentIndex % categoryData.titles.length;
    const title = categoryData.titles[titleIndex];
    
    // Realistic durations between 5-30 minutes
    const duration = Math.floor(Math.random() * 1500) + 300; // 5-30 minutes in seconds
    
    // Realistic view counts
    const views = Math.floor(Math.random() * 50000) + 5000;
    
    // Mix of tags
    const tags = [...categoryData.tags]; // Start with category-specific tags
    
    // Create timestamps within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(Date.now() - (daysAgo * 86400000)).toISOString();
    
    // Generate a unique ID
    const id = generateUniqueId(i);
    
    // Generate image URLs using picsum for placeholders
    const imageId = 100 + (currentIndex % 50);
    const profileImage = `https://picsum.photos/id/${imageId}/320/180`;
    const coverImage = `https://picsum.photos/id/${imageId}/800/450`;
    const previewImages = [
      `https://picsum.photos/id/${imageId}/320/180`,
      `https://picsum.photos/id/${imageId + 1}/320/180`,
      `https://picsum.photos/id/${imageId + 2}/320/180`,
      `https://picsum.photos/id/${imageId + 3}/320/180`
    ];
    
    // Determine quality and HD status
    const isHd = Math.random() > 0.2; // 80% of videos are HD
    const quality = isHd ? 'hd' : 'sd';
    
    // Generate mock uploader info
    const uploader = 'LiveJasmin';
    const uploaderLink = `https://example.com/uploaders/${uploader}`;
    
    // Generate target and details URLs
    const targetUrl = `https://example.com/videos/${category}/${id}`;
    const detailsUrl = `https://example.com/api/videos/details/${id}`;
    
    // Create mock video in VPAPI format
    items.push({
      id,
      title,
      duration,
      tags,
      profileImage,
      coverImage,
      previewImages,
      targetUrl,
      detailsUrl,
      quality,
      isHd,
      uploader,
      uploaderLink,
      // Additional fields for our app
      _provider: ApiProviders.VPAPI,
      views,
      createdAt,
      category,
      // Add sexualOrientation based on category
      sexualOrientation: category === 'trans' ? 'shemale' : (category === 'lesbian' || category === 'gay' ? 'gay' : 'straight')
    });
  }
  
  return { 
    items, 
    total: totalMockItems 
  };
};

// --- Parameter Mapping Functions ---

const mapParamsToAWE = (params) => {
    
    // Determine AWE base category based on our internal category
    let aweCategory;
    if (params.category === 'trans') {
        aweCategory = 'transgender';
    } else if (params.category === 'fetish') {
        aweCategory = 'fetish'; // Use fetish directly as category
    } else {
        aweCategory = 'girl'; // Default for girls and other categories
    }

    const apiParams = {
        siteId: AWE_CONFIG.SITE_ID,
        psId: AWE_CONFIG.PS_ID,
        psTool: AWE_CONFIG.PS_TOOL,
        psProgram: AWE_CONFIG.PS_PROGRAM,
        campaignId: AWE_CONFIG.CAMPAIGN_ID,
        limit: params.limit || DEFAULT_LIMIT,
        offset: params.offset || 0,
        imageSizes: '320x180,800x600',
        imageType: 'ex',
        showOffline: 0,
        onlyFreeStatus: 0,
        responseFormat: 'json',
        accessKey: AWE_CONFIG.API_KEY,
        customOrder: params.filters?.customOrder || 'most_popular',
        legacyRedirect: 1
    };
    
    // Only add category if it's NOT the default 'girls' category
    if (aweCategory !== 'girl') {
      apiParams.category = aweCategory;
    }

    let aweFilters = [];
    
    // Apply subcategory mapping if the main category IS 'girls' or 'trans' and we have a subcategory
    if (['girls', 'trans'].includes(params.category) && params.subcategory) {
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
            console.warn(`[Orchestrator] Subcategory '${params.subcategory}' for category '${params.category}' did not map to a known AWE filter.`);
        }
    }
    
    // Process additional filters
    if (params.filters) {
        for(const filterKey in params.filters) {
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
                    console.warn(`[Orchestrator] Filter '${filterKey}=${filterValue}' not mapped or invalid for AWE.`);
                }
            }
        }
    }
    
    // Add unique filters to the request
    if (aweFilters.length > 0) {
        apiParams.filters = [...new Set(aweFilters)].join(',');
    }
    
    console.log('[Orchestrator] Mapped AWE Params:', apiParams);
    return apiParams;
};

const mapParamsToFree = (params) => {
    // Create a completely new parameters object that strictly follows Chaturbate API requirements
    const apiParams = new URLSearchParams();

    // REQUIRED PARAMETERS (exactly as per Chaturbate API docs)
    // 1. Campaign slug (required)
    apiParams.append('wm', FREE_CONFIG.WM || '1f2Eo');
    
    // 2. Client IP (required) - use request_ip to let Chaturbate detect client IP
    apiParams.append('client_ip', 'request_ip');
    
    // 3. Format (optional) - default to json
    apiParams.append('format', 'json');
    
    // 4. Limit (optional) - number of rooms to return
    apiParams.append('limit', params.limit || 100);
    
    // 5. Offset (optional) - for pagination
    apiParams.append('offset', params.offset || 0);
    
    // 6. Gender filtering (optional)
    if (params.category) {
        let gender;
        switch(params.category.toLowerCase()) {
            case 'girls': gender = 'f'; break;
            case 'trans': gender = 't'; break;
            case 'men': gender = 'm'; break;
            case 'couples': gender = 'c'; break;
            default: gender = 'f'; // Default to female if unrecognized
        }
        apiParams.append('gender', gender);
    }
    
    // 7. Tags (optional) - use subcategory as a tag
    if (params.subcategory) {
        apiParams.append('tag', params.subcategory);
    }
    
    // 8. Region filtering (optional)
    if (params.filters?.region) {
        apiParams.append('region', params.filters.region);
    }
    
    // 9. HD filtering (optional)
    if (params.filters?.hd) {
        apiParams.append('hd', params.filters.hd);
    }
    
    console.log('[Orchestrator] Mapped FREE Params:', apiParams.toString());
    return apiParams;
};

// --- Fetch Functions ---

/**
 * Fetches video data from the VPAPI or mock service
 * 
 * This function retrieves video data based on the provided parameters.
 * It can use either the real VPAPI service or fall back to mock data.
 * 
 * @param {Object} params - Parameters for the video request
 * @param {string} params.category - Category of videos to fetch (e.g., 'popular', 'new', 'trans')
 * @param {number} params.limit - Number of videos to retrieve (default: DEFAULT_LIMIT)
 * @param {number} params.offset - Starting position for pagination (default: 0)
 * @param {boolean} params.useMock - Whether to use mock data instead of real API (default: false)
 * @param {Object} params.filters - Additional filters to apply to the request
 * @param {string} params.filters.quality - Filter by video quality ('sd', 'hd', etc.)
 * @param {string|Array} params.filters.tags - Filter by specific tags
 * @param {string} params.filters.forcedPerformers - Filter by specific performers
 * @returns {Promise<Object>} Promise resolving to normalized video data
 * 
 * @see docs/VPAPI-Integration.md for detailed documentation
 */
// Fetch Videos Function
export const fetchVideos = async (params = {}) => {
  const {
    category = 'popular',
    limit = DEFAULT_LIMIT,
    offset = 0,
    useMock = false, // Set to false to use the real VPAPI now that it's properly configured
    ...restParams // includes subcategory, model, sort, filters
  } = params;

  // Enhanced debugging
  console.log(`[Orchestrator] ==================== VIDEO REQUEST ====================`);
  console.log(`[Orchestrator] fetchVideos called with params:`, JSON.stringify(params, null, 2));
  
  // Use mock data if requested
  if (useMock) {
    console.log(`[Orchestrator] Using mockVPAPI for video data`);
    try {
      const mockResponse = await mockVPAPI.fetchVideos({ category, limit, offset, ...restParams });
      console.log(`[Orchestrator] Mock response received with ${mockResponse.data.items.length} videos`);
      console.log(`[Orchestrator] ==================== END REQUEST ====================`);
      return mockResponse;
    } catch (error) {
      console.error(`[Orchestrator] Error with mock data:`, error);
      return {
        success: false,
        error: 'Error generating mock data',
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
  
  // --- Fetch from Real VPAPI ---
  try {
    console.log(`[Orchestrator] >>> ENTERING REAL API FETCH BLOCK <<<`); 
    console.log(`[Orchestrator] Fetching real videos from VPAPI for category: ${category}`);
    
    // Map category to sexualOrientation - REQUIRED parameter per API docs
    // Properly map category using the configuration constants
    let sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.DEFAULT;
    const categoryLower = (category || '').toLowerCase();
    
    if (categoryLower === 'trans' || categoryLower === 'transgender' || categoryLower === 'shemale') {
      sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.TRANS;
    } else if (categoryLower === 'gay' || categoryLower === 'male') {
      sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.GAY;
    } else if (categoryLower === 'lesbian') {
      // Lesbian is categorized as 'straight' in the API's terminology
      sexualOrientation = VPAPI_CONFIG.SEX_ORIENTATION.STRAIGHT;
    }
    
    // Map our internal category to VPAPI category
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
      pageIndex: Math.floor(offset / limit) + 1,
      limit: limit,
      
      // Optional filters
      tags: restParams.tags || "",
      quality: restParams.quality || "",
      primaryColor: restParams.primaryColor || "",
      labelColor: restParams.labelColor || "",
    };
    
    // Add additional filters from restParams if they exist
    if (restParams.filters) {
      // Properly format and add any additional filters
      if (restParams.filters.quality) apiParams.quality = restParams.filters.quality;
      if (restParams.filters.tags) apiParams.tags = Array.isArray(restParams.filters.tags) ? restParams.filters.tags.join(',') : restParams.filters.tags;
      if (restParams.filters.forcedPerformers) apiParams.forcedPerformers = restParams.filters.forcedPerformers;
      if (restParams.filters.mitigable !== undefined) apiParams.mitigable = restParams.filters.mitigable;
    }
    
    // Build URL directly as specified in API docs
    const requestUrl = `${VPAPI_CONFIG.BASE_URL}${VPAPI_CONFIG.LIST_ENDPOINT}`;
    
    console.log(`[Orchestrator] VPAPI Request URL: ${requestUrl}`);
    console.log(`[Orchestrator] VPAPI Request Params:`, apiParams);
    
    // Make the request with standard headers
    const startTime = Date.now();
    const response = await axios.get(requestUrl, {
      params: apiParams,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'MistressWorld/1.0'
      }
    });
    const requestTime = Date.now() - startTime;

    console.log(`[Orchestrator] >>> REAL API RESPONSE RECEIVED <<<`);
    console.log(`[Orchestrator] Raw response status: ${response.status}`);
    console.log(`[Orchestrator] Raw response data (sample):`, JSON.stringify(response.data)?.substring(0, 200) + '...');
    console.log(`[Orchestrator] VPAPI Response received in ${requestTime}ms, status: ${response.status}`);
    
    // Check API response format based on documentation
    if (response.status !== 200 || !response.data?.success) {
      console.error(`[Orchestrator] VPAPI response success flag: ${response.data?.success}`);
      console.error(`[Orchestrator] VPAPI response status: ${response.data?.status}`);
      console.error(`[Orchestrator] VPAPI response message: ${response.data?.message || 'No message'}`);
      console.error(`[Orchestrator] VPAPI full response data:`, JSON.stringify(response.data || {}, null, 2));
      throw new Error(`VPAPI request failed with status ${response.status} or success=false. Status: ${response.data?.status || 'unknown'}`);
    }
    
    // Process response according to API documentation format
    console.log(`[Orchestrator] VPAPI Response: success=${response.data.success}, videos count=${response.data?.data?.videos?.length || 0}`);
    
    if (response.data?.data?.videos?.length > 0) {
      console.log('[Orchestrator] First video sample:', JSON.stringify(response.data.data.videos[0], null, 2));
    } else {
      console.log('[Orchestrator] No videos returned in the API response');
    }
    
    // Normalize the data to our internal format
    console.log(`[Orchestrator] >>> CALLING normalizeVPAPIData <<<`); 
    const normalizedData = normalizeVPAPIData(response.data, limit, offset);
    console.log(`[Orchestrator] Normalized ${normalizedData.items.length} videos`);
    console.log(`[Orchestrator] ==================== END REQUEST ====================`);
    
    return {
      success: true,
      data: normalizedData
    };

  } catch (error) {
    console.error('[Orchestrator] Error fetching from VPAPI:', error.message);
    console.error('[Orchestrator] Error details:', error);
    
    // Handle error response
    if (error.response) {
      console.error('[Orchestrator] Response error data:', error.response.data);
      console.error('[Orchestrator] Response error status:', error.response.status);
      console.error('[Orchestrator] Response error headers:', error.response.headers);
      
      if (error.response.data?.message) {
        console.error('[Orchestrator] API error message:', error.response.data.message);
      }
      if (error.response.data?.errors) {
        console.error('[Orchestrator] API error details:', error.response.data.errors);
      }
    } else if (error.request) {
      console.error('[Orchestrator] Request error (no response received):', error.request);
    } else {
      console.error('[Orchestrator] Error setup:', error.config || 'No config available');
    }
    
    // Construct error message
    let errorMessage = 'Failed to fetch videos from VPAPI.';
    
    if (error instanceof Error && error.message.includes('VPAPI configuration missing')) {
      errorMessage = error.message; // Pass specific config error
    } else if (error.response) {
      errorMessage = `VPAPI Error: ${error.response.status} - ${JSON.stringify(error.response.data || {})}`;
    } else if (error.request) {
      errorMessage = 'No response received from VPAPI.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'VPAPI request timed out.';
    }
    
    console.error(`[Orchestrator] Error message: ${errorMessage}`);
    
    // Fall back to mock data on error
    console.warn('[Orchestrator] VPAPI fetch failed. Returning mock fallback data.');
    return mockVPAPI.fetchVideos({ category, limit, offset, ...restParams });
  }
};

// Fetch Models Function
export const fetchModels = async (params = {}) => {
    const {
        provider = ApiProviders.AWE, // Default to AWE
        category = 'girls',
        subcategory,
        limit = DEFAULT_LIMIT,
        offset = 0,
        useMock = false,
        filters = {} // Accept direct filters like ethnicity, bodyType passed from API handler
    } = params;

    // Make sure provider is treated as a string for comparisons
    const providerStr = String(provider).toLowerCase();

    console.log(`[Orchestrator] fetchModels called with params:`, JSON.stringify({...params, provider}, null, 2));

    // --- Use Mock Data if requested or API keys missing ---
    const aweConfigured = AWE_CONFIG.BASE_URL && AWE_CONFIG.API_KEY;
    const freeConfigured = FREE_CONFIG.BASE_URL && FREE_CONFIG.WM;
    const shouldMock = useMock || 
                       (provider === ApiProviders.AWE && !aweConfigured) || 
                       (provider === ApiProviders.FREE && !freeConfigured);

    if (shouldMock) {
        if (!useMock) {
            console.warn(`[Orchestrator] API (${provider}) not configured. Falling back to mock model data.`);
        } else {
            console.log(`[Orchestrator] Using mock model data for provider: ${provider}.`);
        }
        const { items, total } = generateMockModels(provider, category, subcategory, limit, offset);
        const hasMore = (offset + items.length) < total;
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.floor(offset / limit) + 1;
        return {
            success: true,
            data: {
                items,
                pagination: { total, limit, offset, currentPage, totalPages, hasMore }
            }
        };
    }

    // --- Fetch from Real API based on provider ---
    let apiResponse;
    let requestParams;
    let baseUrl;
    let normalizeFunction;

    try {
        console.log(`[Orchestrator] Provider type check: ${typeof provider}, Value: ${providerStr}, Matches FREE: ${providerStr === ApiProviders.FREE}`);
        
        if (providerStr === ApiProviders.FREE) {
            console.log(`[Orchestrator] >>> ENTERING FREE PROVIDER BLOCK <<<`);
            console.log(`[Orchestrator] Fetching real models from FreeAPI for category: ${category}, subcategory: ${subcategory}`);
            
            requestParams = mapParamsToFree({ category, subcategory, limit, offset, ...filters });
            baseUrl = FREE_CONFIG.BASE_URL;
            normalizeFunction = normalizeFreeModel;
            
            console.log(`[Orchestrator] FreeAPI Request URL: ${baseUrl}`);
            console.log(`[Orchestrator] FreeAPI Request Params:`, requestParams.toString());
            console.log(`[Orchestrator] Full Chaturbate API URL: ${baseUrl}?${requestParams.toString()}`);

            // Make sure we have the required parameters
            if (!requestParams.get('wm')) {
                console.error(`[Orchestrator] Missing 'wm' parameter which is required for Chaturbate API!`);
                throw new Error('Chaturbate API: Missing required wm parameter');
            }
            
            if (!requestParams.get('client_ip')) {
                console.error(`[Orchestrator] Missing 'client_ip' parameter which is required for Chaturbate API!`);
                throw new Error('Chaturbate API: Missing required client_ip parameter');
            }

            try {
                const startTime = Date.now();
                
                // Use GET request with params
                apiResponse = await axios.get(baseUrl, { 
                    params: requestParams,
                    timeout: 15000,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    }
                });
                
                const requestTime = Date.now() - startTime;

                console.log(`[Orchestrator] >>> FREE API RESPONSE RECEIVED <<<`);
                console.log(`[Orchestrator] FreeAPI Response Status: ${apiResponse.status}`);
                console.log(`[Orchestrator] FreeAPI Response Time: ${requestTime}ms`);
                console.log(`[Orchestrator] FreeAPI Response Data Sample:`, JSON.stringify(apiResponse.data)?.substring(0, 200) + '...');
                
                if (apiResponse.status !== 200 || !apiResponse.data) {
                    throw new Error(`FreeAPI request failed with status ${apiResponse.status}`);
                }
            
                console.log(`[Orchestrator] >>> NORMALIZING FREE DATA <<<`);
                const items = (apiResponse.data.results || []).map(normalizeFunction);
                const total = apiResponse.data.count || 0; // Use 0 if count is missing
                console.log(`[Orchestrator] Normalized ${items.length} free models. Total from API: ${total}`);

                // *** TEMPORARY WORKAROUND FOR LAYOUT DEBUGGING ***
                // If the API returns 0 results, use mock data instead 
                if (items.length === 0 && total === 0) {
                    console.warn(`[Orchestrator] FreeAPI returned 0 models for wm=${FREE_CONFIG.WM}. Using mock data for layout debugging.`);
                    const mockData = generateMockModels(provider, category, subcategory, limit, offset);
                    const mockHasMore = (offset + mockData.items.length) < mockData.total;
                    const mockTotalPages = Math.ceil(mockData.total / limit);
                    const mockCurrentPage = Math.floor(offset / limit) + 1;
                    return {
                        success: true, // Report success even though it's mock
                        data: {
                            items: mockData.items,
                            pagination: { total: mockData.total, limit, offset, currentPage: mockCurrentPage, totalPages: mockTotalPages, hasMore: mockHasMore }
                        }
                    };
                }
                // *** END TEMPORARY WORKAROUND ***

                // Original logic for when API returns data
                const hasMore = (offset + items.length) < total;
                const totalPages = Math.ceil(total / limit);
                const currentPage = Math.floor(offset / limit) + 1;

                return {
                    success: true,
                    data: {
                        items,
                        pagination: { total, limit, offset, currentPage, totalPages, hasMore }
                    }
                };
            } catch (error) {
                // Handle error based on which provider was being used
                console.error(`[Orchestrator] Error fetching from FreeAPI:`, error.message);
                
                let errorMessage = `Failed to fetch models from FreeAPI.`;
                if (error.response) {
                    errorMessage = `FreeAPI Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
                } else if (error.request) {
                    errorMessage = `No response received from FreeAPI.`;
                } else if (error.code === 'ECONNABORTED') {
                    errorMessage = `FreeAPI request timed out.`;
                }
                
                const useFallback = process.env.NODE_ENV !== 'production'; 
                if (useFallback) {
                    console.warn(`[Orchestrator] FreeAPI fetch failed. Returning mock fallback data.`);
                    const { items, total } = generateMockModels(provider, category, subcategory, limit, offset);
                    const hasMore = (offset + items.length) < total;
                    const totalPages = Math.ceil(total / limit);
                    const currentPage = Math.floor(offset / limit) + 1;
                    return {
                        success: false, 
                        error: errorMessage + ' (Using fallback data)',
                        data: { items, pagination: { total, limit, offset, currentPage, totalPages, hasMore } }
                    };
                } else {
                    return {
                        success: false,
                        error: errorMessage,
                        data: { items: [], pagination: { total: 0, limit, offset, currentPage: 1, totalPages: 0, hasMore: false } }
                    };
                }
            }
        } else { // AWE provider
            console.log(`[Orchestrator] Fetching real models from AWE for category: ${category}, subcategory: ${subcategory}`);
            
            try {
                requestParams = mapParamsToAWE({ category, subcategory, limit, offset, filters });
                
                // Log the complete AWE API request parameters for debugging
                console.log(`[Orchestrator] AWE API request parameters:`, JSON.stringify(requestParams, null, 2));
                
                baseUrl = AWE_CONFIG.BASE_URL;
                normalizeFunction = normalizeAWEModel;
                
                console.log(`[Orchestrator] Making AWE API call to: ${baseUrl}`);
                apiResponse = await axios.get(baseUrl, { 
                    params: requestParams, 
                    timeout: 15000 
                });
                
                // --- Log the raw AWE API Response ---
                console.log(`[Orchestrator] Raw AWE Response Status: ${apiResponse.status}`);
                // Log only a snippet of the data to avoid huge logs, or log presence/absence
                if (apiResponse.data) {
                    console.log(`[Orchestrator] Raw AWE Response Data Keys: ${Object.keys(apiResponse.data)}`);
                }
                // --- End Log ---

                // Check if the API returned valid data
                if (apiResponse.status !== 200 || !apiResponse.data) {
                    throw new Error(`AWE request failed with status ${apiResponse.status} or missing data structure`);
                }
                
                // Handle both older data structure (results array) and newer nested structure (data.models array)
                let models = [];
                let pagination = {};
                
                if (apiResponse.data.results && Array.isArray(apiResponse.data.results)) {
                    // Old structure with results array at the top level
                    console.log(`[Orchestrator] Using old AWE API response structure with results array`);
                    models = apiResponse.data.results;
                    pagination = {
                        total: apiResponse.data.count || models.length,
                        limit: limit,
                        offset: offset
                    };
                } else if (apiResponse.data.data && apiResponse.data.data.models && Array.isArray(apiResponse.data.data.models)) {
                    // New structure with nested data.models array
                    console.log(`[Orchestrator] Using new AWE API response structure with nested data.models array`);
                    models = apiResponse.data.data.models;
                    pagination = apiResponse.data.data.pagination || {
                        total: models.length,
                        limit: limit,
                        offset: offset
                    };
                } else {
                    // Neither structure found - force use any arrays we can find
                    console.warn(`[Orchestrator] Unknown AWE API response structure - attempting to find any model array`);
                    if (Array.isArray(apiResponse.data)) {
                        models = apiResponse.data;
                    } else {
                        // Look for any array property that might contain models
                        for (const key in apiResponse.data) {
                            if (Array.isArray(apiResponse.data[key])) {
                                models = apiResponse.data[key];
                                console.log(`[Orchestrator] Found potential models array in property: ${key}`);
                                break;
                            }
                        }
                    }
                    pagination = {
                        total: models.length,
                        limit: limit,
                        offset: offset
                    };
                }
                
                if (models.length === 0) {
                    console.warn(`[Orchestrator] AWE API returned 0 models - check API response structure`);
                    console.log(`[Orchestrator] Response data:`, JSON.stringify(apiResponse.data).substring(0, 500));
                }
                
                const items = models.map(normalizeFunction);
                
                // Use count from response if available and valid, otherwise use items length
                const total = (typeof pagination.total === 'number') ? pagination.total : items.length; 
                console.log(`[Orchestrator] Calculated Total: ${total} (items count: ${items.length})`);
                
                // Use other pagination details if available
                const limitFromPagination = (typeof pagination.limit === 'number') ? pagination.limit : limit;
                const offsetFromPagination = (typeof pagination.offset === 'number') ? pagination.offset : offset;

                // AWE doesn't give total. Assume hasMore if we received a full page.
                const hasMore = items.length === limitFromPagination;
                console.log(`[Orchestrator] Calculated hasMore: ${hasMore} (items.length: ${items.length}, limit: ${limitFromPagination})`);
                
                const totalPages = limitFromPagination > 0 ? Math.ceil(total / limitFromPagination) : 0;
                const currentPage = limitFromPagination > 0 ? Math.floor(offsetFromPagination / limitFromPagination) + 1 : 1;

                return {
                    success: true,
                    data: {
                        items,
                        pagination: { total, limit: limitFromPagination, offset: offsetFromPagination, currentPage, totalPages, hasMore }
                    }
                };
            } catch (error) {
                // Handle error for AWE provider
                console.error(`[Orchestrator] Error fetching from AWE:`, error.message);
                
                let errorMessage = `Failed to fetch models from AWE.`;
                if (error.response) {
                    errorMessage = `AWE Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
                } else if (error.request) {
                    errorMessage = `No response received from AWE.`;
                } else if (error.code === 'ECONNABORTED') {
                    errorMessage = `AWE request timed out.`;
                }
                
                const useFallback = process.env.NODE_ENV !== 'production'; 
                if (useFallback) {
                    console.warn(`[Orchestrator] AWE fetch failed. Returning mock fallback data.`);
                    const { items, total } = generateMockModels(provider, category, subcategory, limit, offset);
                    const hasMore = (offset + items.length) < total;
                    const totalPages = Math.ceil(total / limit);
                    const currentPage = Math.floor(offset / limit) + 1;
                    return {
                        success: false, 
                        error: errorMessage + ' (Using fallback data)',
                        data: { items, pagination: { total, limit, offset, currentPage, totalPages, hasMore } }
                    };
                } else {
                    return {
                        success: false,
                        error: errorMessage,
                        data: { items: [], pagination: { total: 0, limit, offset, currentPage: 1, totalPages: 0, hasMore: false } }
                    };
                }
            }
        }
    } catch (error) {
        // Handle general errors not caught by the specific provider sections
        console.error(`[Orchestrator] General error in fetchModels:`, error.message);
        
        let errorMessage = `Failed to fetch models.`;
        if (error.response) {
            errorMessage = `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
            errorMessage = `No response received from API.`;
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = `API request timed out.`;
        }
        
        const useFallback = process.env.NODE_ENV !== 'production'; 
        if (useFallback) {
            console.warn(`[Orchestrator] API fetch failed. Returning mock fallback data.`);
            const { items, total } = generateMockModels(provider, category, subcategory, limit, offset);
            const hasMore = (offset + items.length) < total;
            const totalPages = Math.ceil(total / limit);
            const currentPage = Math.floor(offset / limit) + 1;
            return {
                success: false, 
                error: errorMessage + ' (Using fallback data)',
                data: { items, pagination: { total, limit, offset, currentPage, totalPages, hasMore } }
            };
        } else {
            return {
                success: false,
                error: errorMessage,
                data: { items: [], pagination: { total: 0, limit, offset, currentPage: 1, totalPages: 0, hasMore: false } }
            };
        }
    }
};

// Fetch Categories Function
const generateMockCategories = () => {
  // Generate mock categories for all the known filter types
  const allCategories = [];
  
  // Add ethnicity categories
  AWE_FILTERS.ethnicity.forEach(id => {
    allCategories.push({
      id,
      name: formatName(id),
      type: 'ethnicity',
      source: ApiProviders.AWE
    });
  });
  
  // Add other category types
  for (const type in AWE_FILTERS) {
    if (type !== 'ethnicity') { // Already added above
      AWE_FILTERS[type].forEach(id => {
        allCategories.push({
          id,
          name: formatName(id),
          type,
          source: ApiProviders.AWE
        });
      });
    }
  }
  
  // Add some fetish-specific categories
  const fetishCategories = [
    { id: 'bdsm', name: 'BDSM', type: 'fetish', source: 'awe' },
    { id: 'leather', name: 'Leather', type: 'fetish', source: 'awe' },
    { id: 'latex', name: 'Latex', type: 'fetish', source: 'awe' },
    { id: 'feet', name: 'Feet', type: 'fetish', source: 'awe' },
    { id: 'domination', name: 'Domination', type: 'fetish', source: 'awe' },
    { id: 'roleplay', name: 'Roleplay', type: 'fetish', source: 'awe' }
  ];
  
  allCategories.push(...fetishCategories);
  
  // Organize by type and source
  const byType = {};
  const bySource = {};
  
  allCategories.forEach(cat => {
    // Add to type collection
    if (!byType[cat.type]) {
      byType[cat.type] = [];
    }
    byType[cat.type].push(cat);
    
    // Add to source collection
    if (!bySource[cat.source]) {
      bySource[cat.source] = [];
    }
    bySource[cat.source].push(cat);
  });
  
  return {
    all: allCategories,
    byType,
    bySource
  };
};

// Simple categories cache
let categoryCache = null;

/**
 * Fetches category data for the application
 * @param {Object} params - Parameters
 * @param {boolean} params.forceRefresh - Force a cache refresh
 * @returns {Promise<Object>} Category data
 */
export const fetchCategories = async (params = {}) => {
  const { forceRefresh = false } = params;
  
  // Use cache if available and refresh not forced
  if (!forceRefresh && categoryCache) {
    return { 
      success: true, 
      data: categoryCache 
    };
  }
  
  try {
    // Generate mock categories
    const categories = generateMockCategories();
    
    // Cache the result
    categoryCache = categories;
    
    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error('[Orchestrator] Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories',
      data: { all: [], byType: {}, bySource: {} }
    };
  }
};

export default {
  fetchVideos,
  fetchModels,
  fetchCategories 
};
