/**
 * Free Models API Route
 * 
 * Provides a direct interface for Chaturbate free cam models.
 * Uses the centralized orchestrator for API calls.
 */

import * as orchestrator from '@/services/orchestrator';
import { Redis } from '@upstash/redis';

// Initialize Redis client if UPSTASH_REDIS_URL is available
let redis = null;
try {
  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
    console.log('[API /free-models] Redis client initialized.');
  } else {
    console.log('[API /free-models] Redis not configured. Cache disabled.');
  }
} catch (error) {
  console.warn('[API /free-models] Redis initialization failed:', error.message);
}

// Cache configuration
const CACHE_CONFIG = {
  TTL: process.env.MODEL_CACHE_TTL ? parseInt(process.env.MODEL_CACHE_TTL) : 60, // Cache TTL in seconds
  ENABLED: redis !== null,
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

    console.log(`[API /free-models] Request received for category: ${category}, subcategory: ${subcategory}`);
    
    // Generate cache key
    const queryKey = JSON.stringify({ 
      provider: 'free', 
      category, 
      subcategory, 
      limit: parseInt(limit), 
      offset: parseInt(offset), 
      sort,
      ...otherParams 
    });
    const cacheKey = `free-models:${queryKey}`;

    // Try to get from cache first
    if (CACHE_CONFIG.ENABLED) {
      try {
        console.log(`[API /free-models] Attempting cache fetch for key: ${cacheKey}`);
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log('[API /free-models] Cache hit!');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('X-Cache', 'HIT');
          return res.status(200).json(cached);
        } else {
          console.log('[API /free-models] Cache miss.');
        }
      } catch (error) {
        console.warn('[API /free-models] Redis cache get failed:', error.message);
        // Continue without using cache
      }
    }

    // Use the centralized orchestrator to fetch models
    console.log(`[API /free-models] Calling orchestrator.fetchModels with provider=free`);
    
    const result = await orchestrator.fetchModels({
      provider: orchestrator.ApiProviders.FREE,
      category,
      subcategory,
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: otherParams // Pass remaining query params as filters
    });

    // Set cache if successful and caching enabled
    if (result.success && CACHE_CONFIG.ENABLED) {
      try {
        console.log(`[API /free-models] Setting cache for key: ${cacheKey} with TTL: ${CACHE_CONFIG.TTL}s`);
        await redis.set(cacheKey, JSON.stringify(result), {
          ex: CACHE_CONFIG.TTL,
        });
      } catch (error) {
        console.warn('[API /free-models] Redis cache set failed:', error.message);
        // Continue without caching
      }
    }

    // Format response to match expected structure by frontend components
    const formattedResponse = {
      success: result.success,
      error: result.error,
      data: {
        models: result.data.items.map(model => ({
          id: model.id,
          performerId: model.performerId,
          slug: model.slug,
          username: model.id, // For Chaturbate embed
          name: model.name,
          performerName: model.name,
          thumbnail: model.thumbnail,
          preview: model.preview,
          previewImage: model.preview,
          isOnline: model.isOnline,
          viewerCount: model.viewerCount,
          age: model.age,
          ethnicity: model.ethnicity || '',
          bodyType: model.bodyType || '',
          tags: model.tags || [],
          primaryCategory: category,
          _provider: 'free',
          room_url: model.room_url || '',
          iframe_embed: model.iframe_embed || ''
        })),
        pagination: {
          total: result.data.pagination.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          currentPage: result.data.pagination.currentPage,
          totalPages: result.data.pagination.totalPages,
          hasMore: result.data.pagination.hasMore
        }
      }
    };

    // Return the normalized response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Cache', 'MISS');
    return res.status(result.success ? 200 : 500).json(formattedResponse);

  } catch (error) {
    console.error('[API /free-models] Unhandled error:', error);
    
    // Return error with empty model list for frontend compatibility
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
      data: { 
        models: [], 
        pagination: {
          total: 0,
          limit: parseInt(req.query.limit || 20),
          offset: parseInt(req.query.offset || 0),
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        }
      }
    });
  }
} 