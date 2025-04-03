import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers for easier testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  const testParams = {
    siteId: '201300',
    psId: 'mikeeyy3',
    psTool: '213_1',
    psProgram: 'cbrnd',
    campaignId: '117404',
    category: 'fetish',
    limit: 5,
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
  
  console.log(`[Direct Fetch API] Testing direct API URL: ${url.toString()}`);
  
  try {
    // Make direct fetch to AWE API
    const response = await axios.get(url.toString(), {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MistressWorld Test Client'
      }
    });
    
    if (response.status === 200 && response.data) {
      // Return raw AWE API response for debugging
      const models = response.data?.data?.models || [];
      console.log(`[Direct Fetch API] Successfully fetched ${models.length} models`);
      
      return res.status(200).json({
        success: true,
        source: 'direct-fetch',
        timestamp: new Date().toISOString(),
        apiResponse: response.data,
        normalizedModels: models.map(model => ({
          id: model.uniqueModelId || model.performerId,
          name: model.displayName,
          thumbnail: model.profilePictureUrl?.size320x180
        })).slice(0, 5)
      });
    } else {
      return res.status(response.status).json({
        success: false,
        source: 'direct-fetch',
        error: 'API returned unexpected status or data structure',
        statusCode: response.status,
        data: response.data
      });
    }
  } catch (error) {
    console.error('[Direct Fetch API] Error fetching models:', error.message);
    
    // Provide detailed error info for debugging
    return res.status(500).json({
      success: false,
      source: 'direct-fetch',
      error: error.message,
      errorType: error.name,
      errorResponse: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null,
      // Return hardcoded fallback for development
      hardcodedModels: Array(5).fill().map((_, i) => ({
        id: `model-${i+1}`,
        name: `Fallback Model ${i+1}`, 
        thumbnail: `https://loremflickr.com/320/180/model?lock=${i+200}`
      }))
    });
  }
} 