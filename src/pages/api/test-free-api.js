/**
 * Test API endpoint for Chaturbate API
 * Access via: http://localhost:3000/api/test-free-api
 */

import axios from 'axios';

export default async function handler(req, res) {
  console.log('[TEST] Testing Chaturbate API...');
  
  // Chaturbate API configuration
  const CHATURBATE_API = {
    BASE_URL: process.env.FREE_API_ENDPOINT || 'https://chaturbate.com/api/public/affiliates/onlinerooms/',
    WM: process.env.FREE_WM || '1f2Eo' // Campaign slug - REQUIRED
  };
  
  // Create parameters exactly as specified in the API docs
  const params = new URLSearchParams();
  
  // Required parameters
  params.append('wm', CHATURBATE_API.WM);
  params.append('client_ip', 'request_ip');
  
  // Optional parameters
  params.append('format', 'json');
  params.append('limit', 10);
  params.append('gender', 'f'); // f = female

  const url = `${CHATURBATE_API.BASE_URL}?${params.toString()}`;
  console.log(`[TEST] Making request to: ${url}`);

  try {
    const response = await axios.get(CHATURBATE_API.BASE_URL, {
      params,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    console.log('[TEST] API response status:', response.status);
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Successfully connected to Chaturbate API',
      count: response.data.count || 0,
      firstResult: response.data.results?.[0] || null,
      // Don't send all results to avoid large response
      // results: response.data.results || []
    });
  } catch (error) {
    console.error('[TEST] Error calling Chaturbate API:');
    if (error.response) {
      console.error(`[TEST] Status: ${error.response.status}`);
      console.error('[TEST] Response data:', error.response.data);
      console.error('[TEST] Response headers:', error.response.headers);
      
      res.status(error.response.status).json({
        success: false, 
        error: 'API Error',
        status: error.response.status,
        message: error.message,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('[TEST] No response received:', error.request);
      
      res.status(500).json({
        success: false,
        error: 'No Response',
        message: 'The request was made but no response was received'
      });
    } else {
      console.error('[TEST] Error setting up request:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Request Setup Error',
        message: error.message
      });
    }
  }
} 