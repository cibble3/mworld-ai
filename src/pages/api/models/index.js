import { Redis } from '@upstash/redis';
import api from '@/services/api'; // Import our new centralized API service

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
  TTL: process.env.MODEL_CACHE_TTL ? parseInt(process.env.MODEL_CACHE_TTL) : 180, // Cache TTL in seconds (3 minutes max for live content)
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

  const { 
      provider = api.Providers.AWE, // Default to AWE using our new provider constant
      category,
      subcategory,
      limit = 32,
      offset = 0,
      debug = false,
      skipCache = false,
      prioritizeOnline = true, // Always prioritize online models in results
      // Pass any other potential filter parameters directly
      ...otherFilters 
  } = req.query;
  
  // Ensure provider is treated consistently
  const providerKey = String(provider).toLowerCase();
  
  // For free provider, always use a shorter cache TTL
  const cacheTime = providerKey === api.Providers.FREE 
    ? Math.min(CACHE_CONFIG.TTL, 120) // 2 minutes max for free
    : CACHE_CONFIG.TTL;
  
  const parsedLimit = parseInt(limit);
  const parsedOffset = parseInt(offset);
  const parsedSkipCache = skipCache === 'true' || skipCache === '1';
  const parsedPrioritizeOnline = prioritizeOnline === 'true' || prioritizeOnline === '1' || prioritizeOnline === true;

  // Generate cache key
  const queryKey = JSON.stringify({ 
    provider: providerKey, 
    category, 
    subcategory, 
    limit: parsedLimit, 
    offset: parsedOffset,
    prioritizeOnline: parsedPrioritizeOnline,
    ...otherFilters 
  });
  const cacheKey = `models:${queryKey}`;

  console.log(`[API /models] Request received with provider: ${providerKey}, params: ${queryKey}`);

  // Try to get from cache first if not explicitly skipped
  if (CACHE_CONFIG.ENABLED && !parsedSkipCache) {
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
  } else if (parsedSkipCache) {
    console.log('[API /models] Skipping cache as requested.');
  }

  try {
      // Use our new centralized API service to fetch models
      console.log('[API /models] Calling api.fetchModels with params:', {
        provider: providerKey,
        category,
        subcategory,
        limit: parsedLimit,
        offset: parsedOffset,
        prioritizeOnline: parsedPrioritizeOnline,
        filters: otherFilters,
        skipCache: parsedSkipCache
      });
      
      const result = await api.fetchModels({
          provider: providerKey,
          category,
          subcategory,
          limit: parsedLimit,
          offset: parsedOffset,
          prioritizeOnline: parsedPrioritizeOnline,
          filters: otherFilters,
          skipCache: parsedSkipCache
      });

      // If we got results, sort them to always show online models first
      if (result.success && parsedPrioritizeOnline && result.data && Array.isArray(result.data.items)) {
        result.data.items.sort((a, b) => {
          // Sort by online status first
          if (a.isOnline && !b.isOnline) return -1;
          if (!a.isOnline && b.isOnline) return 1;
          
          // Then by viewer count
          if (a.isOnline && b.isOnline) {
            return (b.viewerCount || 0) - (a.viewerCount || 0);
          }
          
          // Keep original order for offline models
          return 0;
        });
      }

      // Set cache if successful and caching enabled
      if (result.success && CACHE_CONFIG.ENABLED && !parsedSkipCache) {
          try {
              console.log(`[API /models] Setting cache for key: ${cacheKey} with TTL: ${cacheTime}s`);
              await redis.set(cacheKey, JSON.stringify(result), {
                  ex: cacheTime,
              });
          } catch (error) {
              console.warn('[API /models] Redis cache set failed:', error.message);
              // Continue without caching
          }
      }
      
      // Determine status code based on success
      const statusCode = result.success ? 200 : 500; // Use 500 for internal errors
      
      // Return the result
      console.log(`[API /models] Returning result (Success: ${result.success}, Status: ${statusCode})`);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'MISS');
      
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
      
      return res.status(statusCode).json(result);

  } catch (error) {
      // Catch unexpected errors
      console.error('[API /models] Unhandled error in handler:', error);
      return res.status(500).json({ 
          success: false,
          error: 'Internal Server Error in API handler',
          data: {
              items: [], // Use consistent naming (items not models)
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