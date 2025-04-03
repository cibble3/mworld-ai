/**
 * Free Models API Route
 * 
 * Provides a direct interface for Chaturbate free cam models.
 * Completely separate from the AWE API to avoid conflicts.
 */

import axios from 'axios';
import { ApiProviders } from '@/services/api';

// Chaturbate API configuration
const CHATURBATE_API = {
  BASE_URL: process.env.FREE_API_ENDPOINT || 'https://chaturbate.com/api/public/affiliates/onlinerooms/',
  WM: process.env.FREE_WM || '1f2Eo' // Campaign slug
};

// Function to normalize Chaturbate model data for our frontend
const normalizeFreeModel = (model) => {
  return {
    id: model.username || `free-model-${Math.random().toString(36).substring(2, 10)}`,
    slug: model.username || `free-model-${Math.random().toString(36).substring(2, 10)}`,
    username: model.username, // Add the username explicitly for Chaturbate embed
    name: model.display_name || model.username || 'Unknown Model',
    performerName: model.display_name || model.username || 'Unknown Model',
    thumbnail: model.image_url || '/images/placeholder-model.jpg',
    preview: model.image_url_360x270 || model.image_url || '/images/placeholder-model.jpg',
    previewImage: model.image_url_360x270 || model.image_url || '/images/placeholder-model.jpg',
    isOnline: true, // Free models are always returned as online
    viewerCount: model.num_users || 0,
    age: model.age || 25, // Use age if provided
    ethnicity: '', // Not provided
    bodyType: '', // Not provided
    tags: model.tags || [],
    primaryCategory: 'girls', // Default category
    _provider: 'free',
    room_url: model.chat_room_url || '',
    // Original Chaturbate data for debugging
    _originalData: {
      iframe_embed: model.iframe_embed,
      chat_room_url: model.chat_room_url
    }
  };
};

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed',
      data: null
    });
  }

  try {
    // Get query parameters
    const {
      category = 'girls',
      subcategory,
      limit = 20,
      offset = 0,
      sort = 'popular',
      ...otherParams
    } = req.query;

    console.log(`[FREE API] Request received for category: ${category}, subcategory: ${subcategory}`);

    // DEVELOPMENT ENVIRONMENT - Always use mock data
    // Removed the development mock data block to always call the real API
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('[FREE API] Development mode: Using mock data');
      
    //   // Generate mock models with properties that match ModelCard component expectations
    //   const mockModels = Array(20).fill().map((_, i) => ({
    //     id: `free-model-${i}`,
    //     slug: `free-model-${i}`,
    //     performerName: `Free Model ${i+1}`,
    //     name: `Free Model ${i+1}`,
    //     primaryCategory: category || 'girls',
    //     categories: [category || 'girls'],
    //     thumbnail: `https://picsum.photos/seed/${i+100}/320/180`,
    //     preview: `https://picsum.photos/seed/${i+100}/800/600`,
    //     previewImage: `https://picsum.photos/seed/${i+100}/800/600`,
    //     images: {
    //       thumbnail: `https://picsum.photos/seed/${i+100}/320/180`,
    //       preview: `https://picsum.photos/seed/${i+100}/800/600`,
    //     },
    //     isOnline: true,
    //     viewerCount: Math.floor(Math.random() * 1000),
    //     age: Math.floor(Math.random() * 10) + 20,
    //     tags: ['free', 'development', category],
    //     _provider: 'free'
    //   }));
      
    //   return res.status(200).json({
    //     success: true,
    //     data: {
    //       models: mockModels,
    //       pagination: {
    //         total: 100,
    //         limit: parseInt(limit),
    //         offset: parseInt(offset),
    //         currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
    //         totalPages: 5,
    //         hasMore: true
    //       }
    //     },
    //     _isMock: true
    //   });
    // }

    // FOR PRODUCTION - Continue with real API call
    // Map our category names to Chaturbate gender parameter
    let gender;
    switch(category.toLowerCase()) {
      case 'girls': gender = 'f'; break;
      case 'trans': gender = 't'; break;
      case 'men': gender = 'm'; break;
      case 'couples': gender = 'c'; break;
      default: gender = 'f'; // Default to female if unrecognized
    }

    // Add explicit logging for the environment variable
    console.log(`[FREE API] Value of process.env.FREE_WM before creating params: ${process.env.FREE_WM}`);

    // Create parameters for Chaturbate API
    const params = new URLSearchParams();
    
    // Required parameters - use the value from environment variable
    params.append('wm', CHATURBATE_API.WM); // Use environment variable via constant
    params.append('client_ip', 'request_ip');
    
    // Optional parameters
    params.append('format', 'json');
    params.append('limit', limit);
    params.append('offset', offset);
    params.append('gender', gender);
    
    // Apply tag filtering if subcategory provided
    if (subcategory) {
      params.append('tag', subcategory);
    }
    
    // Apply additional parameters if provided
    if (otherParams.region) params.append('region', otherParams.region);
    if (otherParams.hd) params.append('hd', otherParams.hd);
    
    console.log(`[FREE API] Calling Chaturbate API with params: ${params.toString()}`);
    console.log(`[FREE API] Full URL: ${CHATURBATE_API.BASE_URL}?${params.toString()}`);
    console.log(`[FREE API] WM parameter value: ${CHATURBATE_API.WM}`);

    // Check required parameters - No longer needed to hardcode fallback as we use env var
    // if (!CHATURBATE_API.WM) {
    //   console.error("[FREE API] Missing WM parameter (campaign slug)!");
    //   // Use fallback value if missing
    //   params.set('wm', '1f2Eo');
    // }

    // Make the API request with proper headers
    try {
      const response = await axios.get(CHATURBATE_API.BASE_URL, {
        params,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      console.log(`[FREE API] Received response status: ${response.status}`);
      
      if (!response.data || !response.data.results) {
        console.error('[FREE API] Invalid response data:', JSON.stringify(response.data).substring(0, 200));
        
        // Return error with the response we got
        return res.status(500).json({
          success: false,
          error: 'Invalid response from Chaturbate API',
          data: { 
            models: [], 
            pagination: {
              total: 0,
              limit: parseInt(limit),
              offset: parseInt(offset),
              currentPage: 1,
              totalPages: 1,
              hasMore: false
            }
          },
          debug: {
            responseStatus: response.status,
            responseData: response.data
          }
        });
      }

      console.log(`[FREE API] Received ${response.data.results?.length || 0} models from Chaturbate API`);
      
      // Check if the iframe_embed field is present in the first model
      if (response.data.results?.[0]) {
        console.log(`[FREE API] Sample model username: ${response.data.results[0].username}`);
        console.log(`[FREE API] Sample model has iframe_embed: ${!!response.data.results[0].iframe_embed}`);
        if (response.data.results[0].iframe_embed) {
          console.log(`[FREE API] Sample iframe_embed: ${response.data.results[0].iframe_embed.substring(0, 100)}...`);
        }
      }

      // Normalize the models for our frontend
      const models = (response.data.results || []).map(normalizeFreeModel);
      const total = response.data.count || 0;

      // Return a consistent response structure
      return res.status(200).json({
        success: true,
        data: {
          models,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
            totalPages: Math.ceil(total / parseInt(limit)),
            hasMore: (parseInt(offset) + parseInt(limit)) < total
          }
        }
      });
    } catch (apiError) {
      console.error('[FREE API] Error making Chaturbate API request:', apiError.message);
      
      if (apiError.response) {
        console.error('[FREE API] API response error:', apiError.response.status, JSON.stringify(apiError.response.data).substring(0, 200));
      }
      
      throw apiError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('[FREE API] Error:', error.message);
    
    if (error.response) {
      console.error('[FREE API] Response status:', error.response.status);
      console.error('[FREE API] Response data:', error.response.data);
    }
    
    return res.status(500).json({
      success: false,
      error: 'Error fetching from Chaturbate API: ' + error.message,
      data: {
        models: [],
        pagination: {
          total: 0,
          limit: parseInt(req.query.limit || 20),
          offset: parseInt(req.query.offset || 0),
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        }
      }
    });
  }
} 