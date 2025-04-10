import { Redis } from '@upstash/redis';
import * as orchestrator from '@/services/orchestrator'; // Import the orchestrator

// Initialize Redis client if UPSTASH_REDIS_URL is available
let redis = null;
try {
  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
    console.log('[API /models] Redis client initialized.');
  } else {
    console.log('[API /models] Redis not configured. Cache disabled.');
  }
} catch (error) {
  console.warn('[API /models] Redis initialization failed:', error.message);
}

// Cache configuration
const CACHE_CONFIG = {
  TTL: process.env.MODEL_CACHE_TTL ? parseInt(process.env.MODEL_CACHE_TTL) : 60, // Cache TTL in seconds (configurable)
  ENABLED: redis !== null,
};

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed',
      data: null
    });
  }

  // Get the parameters from query string
  const {
    provider = orchestrator.ApiProviders.AWE, // Default to AWE via orchestrator constant
    category,
    subcategory,
    limit = 32,
    offset = 0,
    debug = false,
    // Pass any other potential filter parameters directly
    ...otherFilters 
  } = req.query;
  
  // Log incoming request
  console.log(`[API /models] Request: ${req.method} ${req.url}`);
  console.log(`[API /models] Provider: ${provider}, Category: ${category}, Subcategory: ${subcategory}`);
  console.log(`[API /models] Limit: ${limit}, Offset: ${offset}, Filters:`, otherFilters);
  
  // Ensure provider is treated consistently
  const providerKey = String(provider).toLowerCase();
  
  const parsedLimit = parseInt(limit);
  const parsedOffset = parseInt(offset);

  // Generate cache key (Keep this part, ensure it includes all relevant query params)
  // Use a stable serialization method for the key
  const queryKey = JSON.stringify({ provider: providerKey, category, subcategory, limit: parsedLimit, offset: parsedOffset, ...otherFilters });
  const cacheKey = `models:${queryKey}`;

  console.log(`[API /models] Request received with provider: ${providerKey}, params: ${queryKey}`);

  // Try to get from cache first (Keep this part)
  if (CACHE_CONFIG.ENABLED) {
    try {
      console.log(`[API /models] Attempting cache fetch for key: ${cacheKey}`);
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('[API /models] Cache hit!');
        // Ensure response headers are set correctly for cached responses too
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached); // Return parsed JSON directly
      } else {
         console.log('[API /models] Cache miss.');
      }
    } catch (error) {
      console.warn('[API /models] Redis cache get failed:', error.message);
      // Continue without using cache
    }
  }

  try {
      // Call the orchestrator to fetch models
      console.log('[API /models] Calling orchestrator.fetchModels with params:', {
        provider: providerKey,
        category,
        subcategory,
        limit: parsedLimit,
        offset: parsedOffset,
        filters: otherFilters
      });
      
      const result = await orchestrator.fetchModels({
          provider: providerKey, // Ensure provider is properly passed
          category,
          subcategory,
          limit: parsedLimit,
          offset: parsedOffset,
          filters: otherFilters // Pass remaining query params as filters
      });

      // Check if result is defined before accessing its properties
      if (!result) {
          console.error('[API /models] Orchestrator returned undefined result');
          return res.status(500).json({
              success: false,
              error: 'No data returned from model provider',
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

      // Set cache if successful and caching enabled
      if (result.success && CACHE_CONFIG.ENABLED) {
          try {
              console.log(`[API /models] Setting cache for key: ${cacheKey} with TTL: ${CACHE_CONFIG.TTL}s`);
              await redis.set(cacheKey, JSON.stringify(result), { // Cache the whole result object
                  ex: CACHE_CONFIG.TTL,
              });
          } catch (error) {
              console.warn('[API /models] Redis cache set failed:', error.message);
              // Continue without caching
          }
      }
      
      // Determine status code based on success
      const statusCode = result.success ? 200 : 500; // Use 500 for internal errors from orchestrator
      
      // Return the result from the orchestrator
      console.log(`[API /models] Returning result (Success: ${result.success}, Status: ${statusCode})`);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'MISS');
      
      // Ensure result.data exists before proceeding
      if (!result.data || !result.data.items) {
          console.error('[API /models] Missing data or items in result');
          return res.status(500).json({
              success: false,
              error: 'Invalid data structure returned from provider',
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
      
      // If debug is enabled, strip down the response to be more direct
      if (debug) {
        // Extract just what's needed for the UI
        const simplifiedResult = {
          success: result.success,
          error: result.error,
          data: {
            models: result.data.items.map(model => ({
              id: model.id || model.performerId || `model-${Date.now()}`,
              performerId: model.performerId || model.id,
              name: model.name || 'Unknown',
              image: model.image || model.thumbnail,
              thumbnail: model.thumbnail,
              age: model.age,
              ethnicity: model.ethnicity,
              tags: model.tags || [],
              isOnline: model.isOnline !== false,
              viewerCount: model.viewerCount || 0,
            })),
            pagination: result.data.pagination
          }
        };
        return res.status(statusCode).json(simplifiedResult);
      }
      
      // Return standardized result formatted to match what the frontend expects
      const formattedResult = {
        success: result.success,
        error: result.error,
        data: {
          models: result.data.items.map(model => ({
            id: model.id || model.performerId || `model-${Date.now()}`,
            performerId: model.performerId || model.id,
            slug: model.slug || model.id,
            name: model.name || 'Unknown',
            image: model.image || model.thumbnail,
            thumbnail: model.thumbnail,
            preview: model.preview || model.image || model.thumbnail,
            previewImage: model.preview || model.image || model.thumbnail,
            age: model.age,
            ethnicity: model.ethnicity || '',
            bodyType: model.bodyType || '',
            tags: model.tags || [],
            isOnline: model.isOnline !== false,
            viewerCount: model.viewerCount || 0,
            primaryCategory: category || 'girls',
            _provider: providerKey
          })),
          pagination: {
            total: result.data.pagination.total,
            limit: parsedLimit,
            offset: parsedOffset,
            currentPage: result.data.pagination.currentPage,
            totalPages: result.data.pagination.totalPages,
            hasMore: result.data.pagination.hasMore
          }
        }
      };
      
      return res.status(statusCode).json(formattedResult);

  } catch (error) {
      // Catch unexpected errors during orchestrator call or response handling
      console.error('[API /models] Unhandled error in handler:', error);
      return res.status(500).json({ 
          success: false,
          error: 'Internal Server Error in API handler',
          data: {
              models: [], // Keep the expected structure even on error
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