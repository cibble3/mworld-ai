import axios from 'axios';

// Debug helper - log that this module was loaded
console.log('[API] /api/models/trans.js module loaded');

// Run a test fetch on module load
(async () => {
  try {
    console.log('[API] Testing direct trans models API call on module load');
    
    const testParams = {
      siteId: '201300',
      psId: 'mikeeyy3',
      psTool: '213_1',
      psProgram: 'cbrnd',
      campaignId: '117404',
      category: 'transgender', // Changed from 'trans' to 'transgender'
      limit: 1,
      imageSizes: '320x180',
      imageType: 'ex',
      showOffline: 0,
      onlyFreeStatus: 1,
      extendedDetails: 1,
      responseFormat: 'json',
      accessKey: '8d3f909766a7009186058874fb8fe2b4',
      legacyRedirect: 1,
      subAffId: '{SUBAFFID}'
    };
    
    // Build URL with all params
    const url = new URL('https://wptcd.com/api/model/feed');
    Object.entries(testParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log(`[API] Test trans models API URL: ${url.toString()}`);
    
    try {
      // Test fetch directly from module
      const testResponse = await axios.get(url.toString(), {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MistressWorld Test Client'
        }
      });
      
      console.log(`[API] Test trans API response status: ${testResponse.status}, has data: ${!!testResponse.data}`);
      if (testResponse.data?.data?.models?.length > 0) {
        console.log(`[API] Found ${testResponse.data.data.models.length} test models`);
      }
    } catch (err) {
      console.error(`[API] Test direct trans API call failed: ${err.message}`);
    }
  } catch (err) {
    console.error(`[API] Error testing direct trans API: ${err.message}`);
  }
})();

// AWE API Config - Specific for trans models
const AWE_CONFIG = {
  BASE_URL: process.env.AWE_API_ENDPOINT || 'https://wptcd.com/api/model/feed',
  SITE_ID: process.env.AWE_SITE_ID || '201300',
  PS_ID: process.env.AWE_PS_ID || 'mikeeyy3',
  PS_TOOL: process.env.AWE_PS_TOOL || '213_1',
  PS_PROGRAM: process.env.AWE_PS_PROGRAM || 'cbrnd',
  CAMPAIGN_ID: process.env.AWE_CAMPAIGN_ID || '117404',
  API_KEY: process.env.AWE_API_KEY || '8d3f909766a7009186058874fb8fe2b4',
};

// Log the URL that would be used for the API request
const getFullUrl = (params) => {
  const url = new URL(AWE_CONFIG.BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

// Map model data from AWE API to our format
const normalizeModel = (model) => {
  // First, log the structure of an incoming model for debugging
  console.log('[API normalizeModel] Sample model structure:', 
    JSON.stringify({
      uniqueModelId: model.uniqueModelId,
      performerId: model.performerId,
      displayName: model.displayName,
      thumbnailUrl: model.profilePictureUrl?.size320x180 || 'missing',
      status: model.status
    }, null, 2)
  );

  return {
    id: model.uniqueModelId || model.performerId,
    slug: model.performerId,
    name: model.displayName,
    thumbnail: model.profilePictureUrl?.size320x180,
    preview: model.profilePictureUrl?.size320x180,
    age: model.persons?.[0]?.age,
    ethnicity: model.ethnicity,
    bodyType: model.persons?.[0]?.body?.build,
    tags: model.details?.willingnesses || [],
    isOnline: model.status === 'free_chat',
    viewerCount: 0, // Not provided by AWE
    _provider: 'awe'
  };
};

export default async function handler(req, res) {
  // Only handle GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed',
      data: null
    });
  }
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const {
    limit = 32,
    offset = 0,
    ...otherParams
  } = req.query;
  
  const parsedLimit = parseInt(limit);
  const parsedOffset = parseInt(offset);

  // Set up the API params for AWE Trans models
  const params = {
    siteId: AWE_CONFIG.SITE_ID,
    psId: AWE_CONFIG.PS_ID,
    psTool: AWE_CONFIG.PS_TOOL, 
    psProgram: AWE_CONFIG.PS_PROGRAM,
    campaignId: AWE_CONFIG.CAMPAIGN_ID,
    category: 'transgender', // Changed from 'trans' to 'transgender'
    limit: parsedLimit,
    offset: parsedOffset,
    imageSizes: '320x180', // Only request 320x180 size for consistency
    imageType: 'ex',
    showOffline: 0,
    onlyFreeStatus: 1,
    extendedDetails: 1,
    responseFormat: 'json',
    performerId: '',
    subAffId: '{SUBAFFID}',
    accessKey: AWE_CONFIG.API_KEY,
    legacyRedirect: 1,
    customOrder: otherParams.customOrder || 'most_popular'
  };

  // Add any additional filters if needed
  if (otherParams.filters) {
    params.filters = otherParams.filters;
  }

  console.log(`[API /models/trans] Fetching trans models with params:`, params);
  
  // Log the full URL that will be used
  const fullUrl = getFullUrl(params);
  console.log(`[API /models/trans] Full request URL: ${fullUrl}`);

  try {
    // Make the API request with direct URL for easier debugging
    console.log(`[API /models/trans] Making direct request to: ${fullUrl}`);
    
    // Set timeout to 20 seconds
    const response = await axios.get(fullUrl, {
      timeout: 20000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 MistressWorld API Client'
      }
    });

    console.log(`[API /models/trans] Response status: ${response.status}`);
    console.log(`[API /models/trans] Response headers:`, response.headers);
    
    // Check if we have data
    if (!response.data || !response.data.data || !response.data.data.models) {
      console.error(`[API /models/trans] Invalid response structure:`, 
        JSON.stringify(response.data, null, 2).substring(0, 200) + '...'
      );
      throw new Error('Invalid API response structure');
    }

    // Check if we got a successful response
    if (response.status !== 200 || !response.data) {
      throw new Error(`AWE API request failed with status ${response.status}`);
    }

    // Check for API errors
    if (response.data.status !== 'OK' || response.data.errorCode !== 0) {
      throw new Error(`AWE API returned error: ${response.data.status}`);
    }

    // Process the models
    const models = response.data.data?.models || [];
    const normalizedModels = models.map(normalizeModel);
    
    console.log(`[API /models/trans] Fetched ${normalizedModels.length} trans models`);

    // Return the data in our standard format
    return res.status(200).json({
      success: true,
      data: {
        models: normalizedModels,
        pagination: {
          total: models.length, // Total is not provided accurately by API
          limit: parsedLimit,
          offset: parsedOffset,
          currentPage: Math.floor(parsedOffset / parsedLimit) + 1,
          totalPages: Math.ceil(models.length / parsedLimit),
          hasMore: normalizedModels.length >= parsedLimit // True if we got a full page
        }
      }
    });

  } catch (error) {
    console.error(`[API /models/trans] Error fetching trans models:`, error.message);
    
    // For development, provide hardcoded data when API fails
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API /models/trans] Returning hardcoded data for development`);
      
      // Create some realistic trans model data
      const hardcodedModels = Array(12).fill().map((_, i) => ({
        id: `trans-model-${i+1}`,
        slug: `trans-model-${i+1}`,
        name: `${['Tiffany', 'Alexis', 'Victoria', 'Natasha', 'Cameron', 'Jessica'][i % 6]} ${i+1}`,
        thumbnail: `https://loremflickr.com/320/180/model?lock=${i+200}`, // Fixed 320x180 aspect ratio
        preview: `https://loremflickr.com/320/180/model?lock=${i+200}`, // Same image for consistency
        age: Math.floor(Math.random() * 10) + 21,
        ethnicity: ['white', 'asian', 'latin', 'ebony'][i % 4],
        bodyType: ['slim', 'curvy', 'athletic', 'average'][i % 4],
        tags: [
          'dancing', 
          'striptease', 
          'roleplay', 
          'lingerie', 
          'toys',
          'trans'
        ].slice(0, (i % 4) + 2),
        isOnline: true,
        viewerCount: Math.floor(Math.random() * 150) + 50,
        _provider: 'awe'
      }));
      
      return res.status(200).json({
        success: true,
        data: {
          models: hardcodedModels,
          pagination: {
            total: 100, // Simulate more
            limit: parsedLimit,
            offset: parsedOffset,
            currentPage: Math.floor(parsedOffset / parsedLimit) + 1,
            totalPages: Math.ceil(100 / parsedLimit),
            hasMore: true
          }
        }
      });
    }
    
    // Handle error response if not using hardcoded data
    return res.status(500).json({
      success: false,
      error: `Failed to fetch trans models: ${error.message}`,
      data: {
        models: [],
        pagination: {
          total: 0,
          limit: parsedLimit,
          offset: parsedOffset,
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        }
      }
    });
  }
} 