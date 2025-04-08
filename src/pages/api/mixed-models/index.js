/**
 * Mixed Models API Route
 * 
 * Fetches models from all three sources (AWE, VPAPI, FREE) and combines them
 * into a single normalized feed with consistent filtering
 */

import axios from 'axios';
import { ApiProviders } from '@/services/api';

// Fetish tags that are common across different providers
const COMMON_FETISH_TAGS = [
  'leather', 'latex', 'bdsm', 'domination', 'submissive', 'feet', 'foot',
  'spanking', 'roleplay', 'smoking', 'tattoo', 'piercing', 
  'stockings', 'lingerie', 'heels', 'femdom', 'joi', 
  'humiliation', 'toys', 'anal'
];

// Map from our normalized tags to provider-specific tags
const TAG_MAPPINGS = {
  'leather': {
    awe: 'leather',
    vpapi: 'leather',
    free: 'leather'
  },
  'latex': {
    awe: 'latex',
    vpapi: 'latex',
    free: 'latex'
  },
  'bdsm': {
    awe: 'bdsm',
    vpapi: 'bdsm',
    free: 'bdsm'
  },
  'feet': {
    awe: 'feet',
    vpapi: 'foot fetish',
    free: 'feet'
  },
  'femdom': {
    awe: 'femdom',
    vpapi: 'female domination',
    free: 'femdom'
  },
  'spanking': {
    awe: 'spanking',
    vpapi: 'spanking',
    free: 'spanking'
  }
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
    // Get query parameters with defaults
    const {
      category = 'fetish', // Default to fetish category
      fetishType, // Specific fetish type (leather, latex, bdsm, etc.)
      gender = 'female', // Default to female
      limit = 200,
      page = 1,
      ...otherParams
    } = req.query;

    // Default mapping from gender to provider-specific parameters
    const genderMap = {
      female: {
        awe: 'girls',
        vpapi: 'female',
        free: 'girls'
      },
      transgender: {
        awe: 'trans',
        vpapi: 'transgender',
        free: 'trans'
      }
    };

    console.log(`[MIXED API] Request for ${category} models, fetish: ${fetishType}, gender: ${gender}`);

    // Configure requests to all three providers
    const AWE_API = '/api/models';
    const VPAPI_API = '/api/models/vpapi';
    const FREE_API = '/api/free-models';

    // Prepare promises for all API calls
    const apiPromises = [];

    // Function to add API requests to the promise array
    const addApiRequest = (api, params) => {
      apiPromises.push(
        axios.get(api, { params })
          .then(response => {
            if (response.data?.success) {
              let models = [];
              if (response.data.data?.models && Array.isArray(response.data.data.models)) {
                models = response.data.data.models;
              } else if (response.data.data?.items && Array.isArray(response.data.data.items)) {
                models = response.data.data.items;
              } else if (Array.isArray(response.data.data)) {
                models = response.data.data;
              }
              return { models, provider: params.provider };
            }
            return { models: [], provider: params.provider };
          })
          .catch(error => {
            console.error(`[MIXED API] Error fetching from ${params.provider}:`, error.message);
            return { models: [], provider: params.provider, error: error.message };
          })
      );
    };

    // 1. Add AWE API request
    const aweParams = {
      provider: 'awe',
      category: genderMap[gender]?.awe || 'girls',
      limit: Math.floor(limit / 3), // Split the limit among providers
      page
    };

    // Add fetish-specific filter for AWE
    if (fetishType && TAG_MAPPINGS[fetishType]?.awe) {
      aweParams.tags = TAG_MAPPINGS[fetishType].awe;
    } else if (category === 'fetish') {
      // If general fetish category, use BDSM as default
      aweParams.tags = 'bdsm';
    }

    addApiRequest(AWE_API, aweParams);

    // 2. Add VPAPI request
    const vpapiParams = {
      provider: 'vpapi',
      category: genderMap[gender]?.vpapi || 'female',
      limit: Math.floor(limit / 3),
      page
    };

    // Add fetish-specific filter for VPAPI
    if (fetishType && TAG_MAPPINGS[fetishType]?.vpapi) {
      vpapiParams.tags = TAG_MAPPINGS[fetishType].vpapi;
    } else if (category === 'fetish') {
      // If general fetish category, use BDSM as default
      vpapiParams.tags = 'bdsm';
    }

    addApiRequest(VPAPI_API, vpapiParams);

    // 3. Add FREE API request (Chaturbate)
    const freeParams = {
      provider: 'free',
      category: genderMap[gender]?.free || 'girls',
      limit: Math.floor(limit / 3),
      page
    };

    // Add fetish-specific filter for FREE
    if (fetishType && TAG_MAPPINGS[fetishType]?.free) {
      freeParams.fetish = TAG_MAPPINGS[fetishType].free;
    } else if (category === 'fetish') {
      // If general fetish category, use BDSM as default
      freeParams.fetish = 'bdsm';
    }

    addApiRequest(FREE_API, freeParams);

    // Execute all API requests in parallel
    const results = await Promise.all(apiPromises);

    // Collect all models from different providers
    let allModels = [];
    
    results.forEach(result => {
      if (result.models && result.models.length > 0) {
        // Tag models with their provider
        const taggedModels = result.models.map(model => ({
          ...model,
          _provider: result.provider,
          // Ensure consistent property names
          performerId: model.performerId || model.id || model.slug,
          name: model.name || model.performerName || 'Unknown',
          thumbnail: model.thumbnail || model.image || model.previewImage,
          // Add a random sort value for shuffling
          _randomSort: Math.random()
        }));
        
        allModels = [...allModels, ...taggedModels];
      }
    });

    // Shuffle models to mix providers
    allModels.sort((a, b) => a._randomSort - b._randomSort);

    // Limit to requested number
    const limitedModels = allModels.slice(0, parseInt(limit));
    
    console.log(`[MIXED API] Returning ${limitedModels.length} models from ${results.length} providers`);
    
    // Calculate if there are more models to load
    const hasMore = allModels.length > parseInt(limit);
    
    // Return the combined results
    return res.status(200).json({
      success: true,
      data: {
        models: limitedModels,
        pagination: {
          total: allModels.length,
          limit: parseInt(limit),
          page: parseInt(page),
          hasMore
        },
        sources: results.map(r => ({ 
          provider: r.provider, 
          count: r.models?.length || 0,
          error: r.error
        }))
      }
    });
    
  } catch (error) {
    console.error('[MIXED API] Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Error fetching mixed models: ' + error.message,
      data: {
        models: [],
        pagination: {
          total: 0,
          limit: parseInt(req.query.limit || 200),
          page: parseInt(req.query.page || 1),
          hasMore: false
        }
      }
    });
  }
} 