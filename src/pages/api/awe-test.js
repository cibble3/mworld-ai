import axios from 'axios';

// AWE API Config
const AWE_CONFIG = {
  BASE_URL: process.env.AWE_API_ENDPOINT || 'https://wmcdpt.com/api/model/feed',
  SITE_ID: process.env.AWE_SITE_ID || '201300',
  PS_ID: process.env.AWE_PS_ID || 'mikeeyy3',
  PS_TOOL: process.env.AWE_PS_TOOL || '213_1',
  PS_PROGRAM: process.env.AWE_PS_PROGRAM || 'cbrnd',
  API_KEY: process.env.AWE_API_KEY || '8d3f909766a7009186058874fb8fe2b4',
};

export default async function handler(req, res) {
  // Get the test parameters
  const { 
    category = 'girl', // Default category
    filters = '',      // Comma-separated filters, e.g. 'leather,roleplay'
    limit = 10,        // Number of results
    showOffline = 0    // Only online models
  } = req.query;

  console.log(`[AWE Test] Testing AWE API with params: category=${category}, filters=${filters}, limit=${limit}`);

  // Prepare the request parameters
  const params = {
    siteId: AWE_CONFIG.SITE_ID,
    psId: AWE_CONFIG.PS_ID,
    psTool: AWE_CONFIG.PS_TOOL,
    psProgram: AWE_CONFIG.PS_PROGRAM,
    limit: parseInt(limit),
    offset: 0,
    imageSizes: '320x180,800x600',
    showOffline: parseInt(showOffline),
    extendedDetails: 1,
    responseFormat: 'json',
    accessKey: AWE_CONFIG.API_KEY,
    category,
  };

  // Add filters if provided
  if (filters) {
    params.filters = filters;
  }

  console.log('[AWE Test] Request params:', params);
  
  try {
    // Make the API request
    const apiUrl = AWE_CONFIG.BASE_URL;
    console.log(`[AWE Test] Making request to: ${apiUrl}`);
    
    const response = await axios.get(apiUrl, { 
      params, 
      timeout: 15000 
    });

    console.log(`[AWE Test] Response status: ${response.status}`);
    console.log(`[AWE Test] Response success: ${response.data?.success}`);

    if (response.data?.error) {
      console.error(`[AWE Test] API returned error: ${response.data.error}`);
      return res.status(400).json({
        success: false,
        error: response.data.error,
        params
      });
    }

    // Check if we got models back
    const models = response.data?.data?.models || [];
    console.log(`[AWE Test] Received ${models.length} models`);

    return res.status(200).json({
      success: true,
      params,
      modelCount: models.length,
      total: response.data?.data?.total || 0,
      // Return a sample of the first 3 models
      sampleModels: models.slice(0, 3).map(model => ({
        id: model.id,
        username: model.username,
        displayName: model.displayName,
        thumbnail: model.profilePictureUrl?.size320x180,
        ethnicity: model.ethnicity,
        tags: model.details?.willingnesses || []
      }))
    });

  } catch (error) {
    console.error('[AWE Test] Error making request:', error.message);
    
    if (error.response) {
      console.error('[AWE Test] Response data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: error.message,
        responseData: error.response.data,
        params
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      params
    });
  }
} 