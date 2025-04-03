/**
 * VPAPI Test Script
 * 
 * This script tests the connection to the VPAPI service with various configurations
 * to help diagnose authorization issues.
 * 
 * Usage: node src/scripts/test-vpapi.js
 */

const axios = require('axios');
require('dotenv').config();

async function testVpapiConnection() {
  console.log('=== Testing VPAPI Connection ===');
  console.log('Environment variables:');
  console.log('- VPAPI_URL:', process.env.VPAPI_URL || '(not set)');
  console.log('- VPAPI_KEY:', process.env.VPAPI_KEY ? `${process.env.VPAPI_KEY.substring(0, 4)}...` : '(not set)');
  console.log('- VPAPI_PSID:', process.env.VPAPI_PSID || '(not set)');
  console.log('- VPAPI_CLIENT_IP:', process.env.VPAPI_CLIENT_IP || '(not set)');
  console.log('\n');

  // Default configuration
  const baseUrl = process.env.VPAPI_URL || 'https://pt.ptawe.com';
  const psid = process.env.VPAPI_PSID || 'mikeeyy3';
  const accessKey = process.env.VPAPI_KEY || 'a0163de9298e6c0fb2699b73b41da52e';
  const clientIp = process.env.VPAPI_CLIENT_IP || '223.177.55.88';

  // Test different configurations
  const testCases = [
    {
      name: '1. Basic API request',
      url: `${baseUrl}/api/video-promotion/v1/list`,
      params: {
        psid,
        accessKey,
        clientIp,
        sexualOrientation: 'straight',
        limit: 2
      },
      headers: {
        'Accept': 'application/json'
      }
    },
    {
      name: '2. With additional IP headers',
      url: `${baseUrl}/api/video-promotion/v1/list`,
      params: {
        psid,
        accessKey,
        clientIp,
        sexualOrientation: 'straight',
        limit: 2
      },
      headers: {
        'Accept': 'application/json',
        'X-Forwarded-For': clientIp,
        'Client-IP': clientIp,
        'X-Client-IP': clientIp
      }
    },
    {
      name: '3. Using client endpoint with XMLHttpRequest header',
      url: `${baseUrl}/api/video-promotion/v1/client/list`,
      params: {
        psid,
        accessKey,
        // clientIp not required for client endpoint
        sexualOrientation: 'straight',
        limit: 2
      },
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    },
    {
      name: '4. Using tags endpoint (simpler API)',
      url: `${baseUrl}/api/video-promotion/v1/tags`,
      params: {
        psid,
        accessKey
      },
      headers: {
        'Accept': 'application/json'
      }
    }
  ];

  // Run the tests
  for (const test of testCases) {
    console.log(`\nRunning test: ${test.name}`);
    console.log('URL:', test.url);
    console.log('Params:', test.params);
    console.log('Headers:', test.headers);
    
    try {
      const response = await axios.get(test.url, {
        params: test.params,
        headers: test.headers,
        timeout: 15000
      });
      
      console.log('Response status:', response.status);
      console.log('Response success flag:', response.data.success);
      
      if (response.data.success) {
        if (test.url.includes('/tags')) {
          console.log('Tags count:', response.data.data.tags.length);
          console.log('First few tags:', response.data.data.tags.slice(0, 5));
        } else if (test.url.includes('/list')) {
          console.log('Videos count:', response.data.data.videos.length);
          if (response.data.data.videos.length > 0) {
            console.log('First video:', {
              id: response.data.data.videos[0].id,
              title: response.data.data.videos[0].title,
              uploader: response.data.data.videos[0].uploader
            });
          }
        }
      } else {
        console.log('API returned success: false');
        console.log('Response data:', response.data);
      }
      
    } catch (error) {
      console.error('Error:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
    
    console.log('------------------------------------------');
  }
}

// Run the test
testVpapiConnection().catch(error => {
  console.error('Unhandled error:', error);
}); 