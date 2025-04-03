import axios from 'axios';

// Known good external endpoints to test
const TEST_ENDPOINTS = [
  {
    name: 'AWE API',
    url: 'https://wptcd.com/api/model/feed',
    params: {
      siteId: '201300',
      psId: 'mikeeyy3',
      psTool: '213_1',
      psProgram: 'cbrnd',
      campaignId: '117404',
      category: 'fetish',
      limit: 1,
      accessKey: '8d3f909766a7009186058874fb8fe2b4',
    }
  },
  { 
    name: 'Google', 
    url: 'https://www.google.com',
    params: {}
  },
  { 
    name: 'Public API', 
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    params: {}
  }
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    try {
      console.log(`[Diagnostic] Testing connection to ${endpoint.name}: ${endpoint.url}`);
      
      const startTime = Date.now();
      const response = await axios.get(endpoint.url, {
        params: endpoint.params,
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 MistressWorld Diagnostics',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      const endTime = Date.now();
      
      // Get first part of response data for inspection
      let responsePreview = '';
      if (response.data) {
        if (typeof response.data === 'string') {
          responsePreview = response.data.substring(0, 200) + '...';
        } else {
          responsePreview = JSON.stringify(response.data).substring(0, 200) + '...';
        }
      }
      
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: 'success',
        statusCode: response.status,
        responseTime: endTime - startTime,
        headers: response.headers,
        responsePreview
      });
      
    } catch (error) {
      console.error(`[Diagnostic] Error testing ${endpoint.name}:`, error.message);
      
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: 'error',
        error: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : null
      });
    }
  }
  
  // Get environment info
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL,
    platform: process.platform,
    nodeVersion: process.version
  };
  
  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    environment: envInfo,
    endpoints: results
  });
} 