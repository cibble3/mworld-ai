import * as orchestrator from '@/services/orchestrator';
import axios from 'axios';

export default async function handler(req, res) {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    provider = orchestrator.ApiProviders.AWE, 
    category = 'girls',
    limit = 2, 
    raw = false
  } = req.query;

  console.log(`[DEBUG] Getting models with provider=${provider}, category=${category}`);

  try {
    // Fetch models from orchestrator
    const result = await orchestrator.fetchModels({
      provider,
      category,
      limit: parseInt(limit),
      offset: 0
    });

    // Try to make a direct API call to compare data
    let rawApiData = null;
    if (raw) {
      try {
        let endpoint = '/api/models';
        if (provider.toLowerCase() === 'free') {
          endpoint = '/api/free-models';
        }
        
        const rawResponse = await axios.get(`http://localhost:3000${endpoint}`, {
          params: {
            provider,
            category,
            limit: 1
          }
        });
        rawApiData = rawResponse.data;
      } catch (error) {
        console.error('[DEBUG] Failed to get raw API data:', error.message);
        rawApiData = { error: error.message };
      }
    }

    // Add diagnostic information to the response
    const diagnostic = {
      modelCount: result.data?.items?.length || 0,
      modelKeys: result.data?.items?.length > 0 ? Object.keys(result.data.items[0]) : [],
      sampleModel: result.data?.items?.length > 0 ? result.data.items[0] : null,
      providerStr: String(provider).toLowerCase(),
      requestedProvider: provider,
      normalizedProvider: String(provider).toLowerCase(),
      isAWE: String(provider).toLowerCase() === orchestrator.ApiProviders.AWE,
      isFree: String(provider).toLowerCase() === orchestrator.ApiProviders.FREE,
      themeRequired: ['id', 'name', 'image', 'performerId'],
      missingProps: [],
      dataStructure: {
        top: Object.keys(result || {}),
        data: Object.keys(result.data || {}),
        items: Array.isArray(result.data?.items) ? 'array' : typeof result.data?.items
      }
    };

    // Check for missing required props in the model data
    if (diagnostic.sampleModel) {
      diagnostic.themeRequired.forEach(prop => {
        if (diagnostic.sampleModel[prop] === undefined) {
          diagnostic.missingProps.push(prop);
        }
      });
    }

    // Return combined response
    return res.status(200).json({
      success: true,
      diagnostic,
      rawApiData: rawApiData,
      result
    });
  } catch (error) {
    console.error('[DEBUG] Error fetching models:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 