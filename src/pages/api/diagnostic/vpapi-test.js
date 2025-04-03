/**
 * VPAPI Diagnostic Test API Route
 * 
 * This is a diagnostic endpoint that directly tests the VPAPI connection
 * and returns detailed information about the request and response.
 */

import axios from 'axios';
import { VPAPI_CONFIG } from '@/services/config';

export default async function handler(req, res) {
  // Create detailed diagnostic response to test VPAPI connectivity
  const diagnostic = {
    config: {
      BASE_URL: VPAPI_CONFIG.BASE_URL,
      API_KEY: VPAPI_CONFIG.API_KEY ? `${VPAPI_CONFIG.API_KEY.substring(0, 4)}...` : 'undefined',
      PSID: VPAPI_CONFIG.PSID,
      LIST_ENDPOINT: VPAPI_CONFIG.LIST_ENDPOINT
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    request: {
      timestamp: new Date().toISOString(),
      query: req.query
    },
    response: {
      status: null,
      timing: null,
      success: false,
      data: null,
      error: null
    }
  };

  try {
    // Build the VPAPI request URL
    const params = new URLSearchParams();
    params.append('psid', VPAPI_CONFIG.PSID || 'mikeeyy3');
    params.append('accessKey', VPAPI_CONFIG.API_KEY || '8d3f909766a7009186058874fb8fe2b4');
    params.append('limit', 5); // Request just a few videos for testing
    params.append('pageIndex', 1);
    params.append('sexualOrientation', 'straight');
    params.append('sort', 'popular');
    
    // Add client IP which may be required for authentication
    const clientIP = process.env.VPAPI_CLIENT_IP || '223.177.55.88';
    params.append('clientIP', clientIP);
    
    diagnostic.request.clientIP = clientIP;
    
    const requestUrl = `${VPAPI_CONFIG.BASE_URL}${VPAPI_CONFIG.LIST_ENDPOINT}?${params.toString()}`;
    diagnostic.request.url = requestUrl;
    
    // Capture response timing
    const startTime = Date.now();
    
    console.log(`[API Diagnostic] Testing VPAPI connection to: ${requestUrl}`);
    
    const response = await axios.get(requestUrl, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'X-Forwarded-For': clientIP, // Add the client IP in headers as well
        'Client-IP': clientIP
      }
    });
    
    const requestTime = Date.now() - startTime;
    
    // Populate response data
    diagnostic.response.status = response.status;
    diagnostic.response.timing = `${requestTime}ms`;
    diagnostic.response.success = !!response.data?.success;
    diagnostic.response.headers = response.headers;
    
    // Include sample of video data if present
    if (response.data?.data?.videos?.length > 0) {
      diagnostic.response.videoCount = response.data.data.videos.length;
      diagnostic.response.firstVideo = response.data.data.videos[0];
      diagnostic.response.data = 'Response contained video data (sample included in firstVideo)';
    } else {
      diagnostic.response.videoCount = 0;
      diagnostic.response.data = response.data;
    }
    
    return res.status(200).json({
      success: true,
      diagnostic
    });
  } catch (error) {
    console.error('[API Diagnostic] VPAPI test error:', error.message);
    
    // Capture error details
    diagnostic.response.error = {
      message: error.message,
      stack: error.stack
    };
    
    if (error.response) {
      diagnostic.response.status = error.response.status;
      diagnostic.response.data = error.response.data;
    } else if (error.request) {
      diagnostic.response.error.request = 'Request was made but no response received';
    }
    
    return res.status(500).json({
      success: false,
      error: 'VPAPI connection test failed',
      diagnostic
    });
  }
} 