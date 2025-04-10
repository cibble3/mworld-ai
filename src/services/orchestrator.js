import axios from 'axios';
import mockVPAPI from './mockVPAPI';
import { ensureAbsoluteUrl } from '@/utils/image-helpers';
import FILTER_MAP, { mapFiltersToProvider } from '@/config/filterMap';

// --- Constants ---
const DEFAULT_LIMIT = 24;
export const ApiProviders = {
  AWE: 'awe',      // LiveJasmin Models
  VPAPI: 'vpapi',  // LiveJasmin Videos
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
        onlyFreeStatus: 1,
        extendedDetails: 1,
        responseFormat: 'json',
        accessKey: AWE_CONFIG.API_KEY,
        category: aweCategory,
        customOrder: params.filters?.customOrder || 'most_popular',
        legacyRedirect: 1
    };

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
  try {
  const {
    category = 'popular',
        subcategory,
        model,
    limit = DEFAULT_LIMIT,
    offset = 0,
        sort = 'popular',
        useMock = false,
        fallbackOnError = true,
        requestId = Date.now().toString(36).slice(-4),
        ...restParams
  } = params;

    console.log(`[Orchestrator] [${requestId}] fetchVideos called for category: ${category}`);

    // Use mock data if requested or we're in development with no API key
    if (useMock || !VPAPI_CONFIG.API_KEY) {
        console.log(`[Orchestrator] [${requestId}] Using mock video data (mock=${useMock}, key=${!!VPAPI_CONFIG.API_KEY})`);
        const mockData = mockVPAPI.fetchVideos({ category, limit, offset, ...restParams });
      return {
            success: true,
            data: mockData
        };
    }

    // --- Prepare API request ---
    // Map our category to VPAPI's sexual orientation
    const sexOrientation = getSexOrientationFromCategory(category);
    
    // Build API URL
    const apiUrl = `${VPAPI_CONFIG.BASE_URL}${VPAPI_CONFIG.LIST_ENDPOINT}`;

    // Set up parameters required by VPAPI
    const vpapiParams = {
      psid: VPAPI_CONFIG.PSID,
      accessKey: VPAPI_CONFIG.API_KEY,
      clientIp: VPAPI_CONFIG.CLIENT_IP,
        sexualOrientation: sexOrientation,
      cobrandId: VPAPI_CONFIG.COBRAND_ID,
      site: VPAPI_CONFIG.SITE,
        limit: parseInt(limit),
        offset: parseInt(offset)
    };
    
    // Add optional parameters if provided
    if (subcategory) vpapiParams.categoryId = subcategory;
    if (model) vpapiParams.performerId = model;
    if (sort) {
        switch(sort.toLowerCase()) {
            case 'popular': vpapiParams.order = 'popular'; break;
            case 'newest': vpapiParams.order = 'newest'; break;
            case 'longest': vpapiParams.order = 'duration'; break;
            case 'rating': vpapiParams.order = 'rating'; break;
            default: vpapiParams.order = 'popular';
        }
    }
    
    // Handle any additional params
    Object.entries(restParams).forEach(([key, value]) => {
        // Map our API's parameters to VPAPI's expected format if needed
        if (key === 'tag' || key === 'tags') {
            vpapiParams.tags = value;
        } else {
            vpapiParams[key] = value;
        }
    });
    
    console.log(`[Orchestrator] [${requestId}] Calling VPAPI with URL: ${apiUrl}`);
    console.log(`[Orchestrator] [${requestId}] VPAPI params:`, vpapiParams);
    
    // Make the API request
    const response = await axios.get(apiUrl, {
        params: vpapiParams,
        timeout: 15000, // 15 second timeout
      headers: {
        'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
    
    console.log(`[Orchestrator] [${requestId}] VPAPI response status: ${response.status}`);
    
    // Handle successful response
    if (response.status === 200 && response.data) {
        console.log(`[Orchestrator] [${requestId}] VPAPI response successful, normalizing data...`);
        // Normalize the response data
    const normalizedData = normalizeVPAPIData(response.data, limit, offset);
    return {
      success: true,
      data: normalizedData
    };
    } else {
        throw new Error(`VPAPI returned status ${response.status} with unexpected data format`);
    }
  } catch (error) {
    console.error('[Orchestrator] Error fetching videos from VPAPI:', error.message);
    
    if (error.response) {
      console.error('[Orchestrator] VPAPI Error response:', {
        status: error.response.status,
        data: error.response.data
      });
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

/**
 * Fetches models from multiple providers based on parameters
 */
export const fetchModels = async (params = {}) => {
    const startTime = Date.now();
    const {
        provider = ApiProviders.AWE,
        category,
        subcategory,
        limit = DEFAULT_LIMIT,
        offset = 0,
        filters = {},
        forceNewRequest = false,
        useMock = false
    } = params;

    // Log the request
    console.log(`[Orchestrator.fetchModels] Request: provider=${provider}, category=${category}, subcategory=${subcategory}, limit=${limit}, offset=${offset}`);
    console.log(`[Orchestrator.fetchModels] Filters:`, filters);

    // Normalize provider to lowercase for consistent comparisons
    const providerKey = String(provider).toLowerCase();

    // Merge all filters from URL query and direct params
    const allFilters = {
        ...filters,
        ...(category && { category }),
        ...(subcategory && { subcategory })
    };
    
    console.log(`[Orchestrator.fetchModels] Combined filters:`, allFilters);

    // Map the filters to provider-specific parameters
    const mappedFilters = mapFiltersToProvider(allFilters, providerKey);
    console.log(`[Orchestrator.fetchModels] Mapped filters for ${providerKey}:`, mappedFilters);

    try {
        // Initialize result with default structure to ensure it's always defined
        let result = {
            success: false,
            error: 'Result not set by provider implementation',
            data: {
                items: [],
                pagination: {
                    total: 0,
                    limit,
                    offset,
                    currentPage: Math.floor(offset / limit) + 1,
                    totalPages: 0,
                    hasMore: false
                }
            }
        };

        // Check if we should use mock data globally
        let shouldUseMock = false; // Force disable mock data
        console.log(`[Orchestrator.fetchModels] shouldUseMock=${shouldUseMock}, NEXT_PUBLIC_USE_MOCK_DATA=${process.env.NEXT_PUBLIC_USE_MOCK_DATA}, useMock=${useMock}`);

        // Different implementation based on the requested provider
        switch (providerKey) {
            case ApiProviders.AWE:
                if (shouldUseMock) {
                    console.log('[Orchestrator.fetchModels] Using mock data for AWE');
                    const { items, total } = generateMockModels(providerKey, category, subcategory, limit, offset);
                    result = {
            success: true,
            data: {
                items,
                            pagination: {
                                total,
                                limit,
                                offset,
                                currentPage: Math.floor(offset / limit) + 1,
                                totalPages: Math.ceil(total / limit),
                                hasMore: (offset + items.length) < total
                            }
                        }
                    };
                } else {
                    console.log('[Orchestrator.fetchModels] Fetching from AWE API');
                    try {
                        // Prepare API parameters
                        const aweParams = {
                            siteId: AWE_CONFIG.SITE_ID,
                            psId: AWE_CONFIG.PS_ID,
                            psTool: AWE_CONFIG.PS_TOOL, 
                            psProgram: AWE_CONFIG.PS_PROGRAM,
                            campaignId: AWE_CONFIG.CAMPAIGN_ID,
                            ...mappedFilters,
                            limit: parseInt(limit) || DEFAULT_LIMIT,
                            offset: parseInt(offset) || 0,
                            imageSizes: '320x180,800x600',
                            imageType: 'ex',
                            showOffline: 0,
                            onlyFreeStatus: 1,
                            extendedDetails: 1,
                            responseFormat: 'json',
                            accessKey: AWE_CONFIG.API_KEY,
                            legacyRedirect: 1,
                            subAffId: '{SUBAFFID}'
                        };

                        // Log complete URL 
                        const url = new URL(AWE_CONFIG.BASE_URL);
                        Object.entries(aweParams).forEach(([key, value]) => {
                            url.searchParams.append(key, value);
                        });
                        console.log(`[Orchestrator.fetchModels] Complete AWE API URL: ${url.toString()}`);
                        
                        // Inner try specifically for the API call and response processing
                        try {
                            const apiResponse = await axios.get(url.toString(), {
                                timeout: 15000, // 15 second timeout
                                headers: {
                                    'Accept': 'application/json',
                                    'User-Agent': 'MistressWorld API Client'
                                }
                            });

                            console.log(`[Orchestrator.fetchModels] AWE API Response status: ${apiResponse.status}`);
                            console.log(`[Orchestrator.fetchModels] AWE API Response data (truncated):`, JSON.stringify(apiResponse.data).substring(0, 300) + '...');

                            // Check for SUCCESSFUL response (status 200 and data exists)
                            if (apiResponse.data && apiResponse.status === 200) {
                                let responseItems = [];
                                let total = 0;

                                // --- Determine response structure --- 
                                if (apiResponse.data?.data?.models && Array.isArray(apiResponse.data.data.models)) {
                                    responseItems = apiResponse.data.data.models;
                                    total = apiResponse.data.data.pagination?.total || responseItems.length;
                                    console.log(`[Orchestrator.fetchModels] AWE Response Structure 1 detected. Items: ${responseItems.length}, Total: ${total}`);
                                } else if (apiResponse.data.success && apiResponse.data.models && Array.isArray(apiResponse.data.models.items)) {
                                    responseItems = apiResponse.data.models.items;
                                    total = apiResponse.data.models.total || responseItems.length;
                                    console.log(`[Orchestrator.fetchModels] AWE Response Structure 2 detected. Items: ${responseItems.length}, Total: ${total}`);
                                } else if (apiResponse.data.data) {
                                    if(Array.isArray(apiResponse.data.data)) {
                                        responseItems = apiResponse.data.data;
                                        total = responseItems.length;
                                        console.log(`[Orchestrator.fetchModels] AWE Response Fallback Structure (data array) detected. Items: ${responseItems.length}`);
                                    } else if (apiResponse.data.data.data && Array.isArray(apiResponse.data.data.data)) {
                                        responseItems = apiResponse.data.data.data;
                                        total = responseItems.length;
                                        console.log(`[Orchestrator.fetchModels] AWE Response Fallback Structure (nested data array) detected. Items: ${responseItems.length}`);
                                    } else {
                                       console.warn(`[Orchestrator.fetchModels] Unexpected AWE response structure within success=true/status=200 block. Data:`, apiResponse.data);
                                    }
                                } else if (Array.isArray(apiResponse.data)) { // Direct array at root
                                    responseItems = apiResponse.data;
                                    total = responseItems.length;
                                    console.log(`[Orchestrator.fetchModels] AWE Response Fallback Structure (root array) detected. Items: ${responseItems.length}`);
                                } else {
                                    console.warn(`[Orchestrator.fetchModels] AWE response status 200, but no recognized data structure found. Data:`, apiResponse.data);
                                }
                                
                                // --- Normalization and Result Creation (INSIDE success block) --- 
                                if (!Array.isArray(responseItems)) {
                                    console.error(`[Orchestrator.fetchModels] responseItems became non-array after structure checks! Resetting. Value:`, responseItems, `API Response Data:`, apiResponse.data);
                                    responseItems = []; // Reset to prevent map error
                                    total = 0;
                                } else if (responseItems.length === 0) {
                                    console.warn(`[Orchestrator.fetchModels] No items extracted from successful AWE response after checking structures. Response data:`, apiResponse.data);
                                }

                                const items = responseItems.map(normalizeAWEModel);

                                result = { // Assign to the outer 'result' variable
                                    success: true,
                                    data: {
                                        items,
                                        pagination: {
                                            total,
                                            limit,
                                            offset,
                                            currentPage: Math.floor(offset / limit) + 1,
                                            totalPages: Math.ceil(total / limit),
                                            hasMore: (offset + items.length) < total
                                        }
                                    }
                                };
                                // Successfully processed 200 response, result is set.

                            } else {
                                // --- Handle non-200 status codes from AWE API --- 
                                const status = apiResponse?.status || 'Unknown';
                                const errorMsg = apiResponse?.data ? JSON.stringify(apiResponse.data).substring(0, 500) : 'No response data'; // Limit log size
                                throw new Error(`AWE API request failed with status ${status}. Response: ${errorMsg}`);
                            }

                        } catch (apiError) { // Catch errors from axios OR the processing block above
                            // Log the specific error that occurred
                            console.error(`[Orchestrator.fetchModels] Error processing AWE response or making request:`, apiError instanceof Error ? apiError.message : apiError);
                            console.warn(`[Orchestrator.fetchModels] Falling back to mock data.`);
                            const mockData = generateMockModels(ApiProviders.AWE, category, subcategory, limit, offset);
                            result = { // Assign mock data to outer 'result'
                                success: true, // Mock data is considered a "success" for the frontend
                                data: {
                                    items: mockData.items,
                                    pagination: {
                                        total: mockData.total,
                                        limit,
                                        offset,
                                        currentPage: Math.floor(offset / limit) + 1,
                                        totalPages: Math.ceil(mockData.total / limit),
                                        hasMore: (offset + mockData.items.length) < mockData.total
                                    }
                                }
                            };
                        }
                    } catch (error) {
                        // This catch block might now be redundant if the inner one handles fallback
                        // We'll keep it for now for safety, but it might indicate an issue setting up the request itself
                         console.error(`[Orchestrator.fetchModels] Unexpected error during AWE provider handling (before or after API call/processing):`, error);
                         // Fallback just in case
                         if (!result || !result.success) { // Only fallback if result wasn't set by inner catch
                            console.warn('[Orchestrator.fetchModels] Outer AWE error handler triggered fallback.');
                            const mockData = generateMockModels(ApiProviders.AWE, category, subcategory, limit, offset);
                            result = { success: true, data: { items: mockData.items, pagination: { total: mockData.total, limit, offset, /* ... */ } } };
                         }
                    }
                }
                break;

            default:
                console.warn(`[Orchestrator.fetchModels] Unsupported provider: ${providerKey}, using mock data`);
                const { items, total } = generateMockModels(ApiProviders.AWE, category, subcategory, limit, offset);
                result = {
                    success: true,
                    data: {
                        items,
                        pagination: {
                            total,
                            limit,
                            offset,
                            currentPage: Math.floor(offset / limit) + 1,
                            totalPages: Math.ceil(total / limit),
                            hasMore: (offset + items.length) < total
                        }
                    }
                };
        }

        const requestTime = Date.now() - startTime;
        console.log(`[Orchestrator.fetchModels] Response generated in ${requestTime}ms. Items: ${result?.data?.items?.length || 0}, Total: ${result?.data?.pagination?.total || 0}`);
        
        return result;
    } catch (error) {
        console.error(`[Orchestrator.fetchModels] Unexpected error in fetchModels:`, error);
                    return {
                        success: false, 
            error: `Failed to fetch models: ${error.message || 'Unknown error'}`,
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
};

// Helper function to determine sexual orientation from category
function getSexOrientationFromCategory(category) {
    const lowerCategory = (category || '').toLowerCase();
    
    if (lowerCategory.includes('trans') || lowerCategory.includes('tranny') || lowerCategory.includes('shemale')) {
        return VPAPI_CONFIG.SEX_ORIENTATION.TRANS;
    } else if (lowerCategory.includes('gay') || lowerCategory.includes('male')) {
        return VPAPI_CONFIG.SEX_ORIENTATION.GAY;
        } else {
        return VPAPI_CONFIG.SEX_ORIENTATION.DEFAULT; // straight
    }
}

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
