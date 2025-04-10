/**
 * Videos API Route
 * 
 * Provides a unified interface for video content by delegating to the orchestrator.
 * Handles consistent request parsing and error responses.
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
    console.log('[API /videos] Redis client initialized.');
  } else {
    console.log('[API /videos] Redis not configured. Cache disabled.');
  }
} catch (error) {
  console.warn('[API /videos] Redis initialization failed:', error.message);
}

// Cache configuration
const CACHE_CONFIG = {
  TTL: process.env.VIDEO_CACHE_TTL ? parseInt(process.env.VIDEO_CACHE_TTL) : 300, // 5 minutes cache TTL by default
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
    // Extract relevant parameters from the query
    const {
      category = 'popular', // Default category if none provided
      subcategory,
      model, // Model/performer ID
      limit = 24,
      offset = 0,
      sort = 'popular', // Default sort order
      ...otherParams // Any other parameters to pass to the orchestrator
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    
    // Add a request ID to help identify and debug each unique request
    const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    console.log(`[API /videos] [${requestId}] Received request: category=${category}, subcategory=${subcategory}, limit=${parsedLimit}, offset=${parsedOffset}, sort=${sort}`);

    // Generate cache key
    const queryKey = JSON.stringify({ 
      category, 
      subcategory, 
      model, 
      limit: parsedLimit, 
      offset: parsedOffset, 
      sort,
      ...otherParams 
    });
    const cacheKey = `videos:${queryKey}`;

    // Try to get from cache first
    if (CACHE_CONFIG.ENABLED) {
      try {
        console.log(`[API /videos] [${requestId}] Attempting cache fetch for key: ${cacheKey}`);
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log(`[API /videos] [${requestId}] Cache hit!`);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('X-Cache', 'HIT');
          return res.status(200).json(JSON.parse(cached));
        } else {
          console.log(`[API /videos] [${requestId}] Cache miss.`);
        }
      } catch (error) {
        console.warn(`[API /videos] [${requestId}] Redis cache get failed:`, error.message);
        // Continue without using cache
      }
    }
    
    // Call the orchestrator to fetch videos
    const videoData = await orchestrator.fetchVideos({
      category,
      subcategory,
      model,
      limit: parsedLimit,
      offset: parsedOffset,
      sort,
      fallbackOnError: true, // Allow using fallback data on error
      requestId, // Pass the request ID to help with tracing
      ...otherParams // Pass any additional parameters
    });
      
    // Format the response in a consistent way for the frontend
    const formattedResponse = {
      success: videoData.success,
      error: videoData.error,
          data: {
        videos: (videoData.data?.items || []).map(video => ({
          id: video.id,
          title: video.title,
          description: video.description || '',
          thumbnail: video.thumbnail,
          preview: video.preview || video.thumbnail,
          duration: video.duration || 0,
          tags: video.tags || [],
          createdAt: video.createdAt || new Date().toISOString(),
          url: video.url || '',
          embeddedUrl: video.embeddedUrl || video.url || '',
          performerId: video.performerId || video.modelId || '',
          performerName: video.performerName || video.modelName || 'Unknown',
          category: category || 'popular',
          viewCount: video.viewCount || 0,
          likeCount: video.likeCount || 0,
          _provider: orchestrator.ApiProviders.VPAPI
        })),
        pagination: videoData.data?.pagination || {
                  total: 0,
                  limit: parsedLimit,
                  offset: parsedOffset,
                  currentPage: 1,
                  totalPages: 0,
                  hasMore: false
              }
          }
    };

    // Cache successful responses
    if (videoData.success && CACHE_CONFIG.ENABLED) {
      try {
        console.log(`[API /videos] [${requestId}] Setting cache for key: ${cacheKey} with TTL: ${CACHE_CONFIG.TTL}s`);
        await redis.set(cacheKey, JSON.stringify(formattedResponse), {
          ex: CACHE_CONFIG.TTL
        });
      } catch (error) {
        console.warn(`[API /videos] [${requestId}] Redis cache set failed:`, error.message);
        // Continue without caching
      }
    }

    // Return the response
    if (videoData.success) {
      console.log(`[API /videos] [${requestId}] Success: Returning ${formattedResponse.data?.videos?.length || 0} videos.`);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(formattedResponse);
    } else {
      console.error(`[API /videos] [${requestId}] Error from orchestrator: ${videoData.error}`);
      return res.status(500).json(formattedResponse);
    }

  } catch (error) {
    console.error('[API /videos] Unhandled error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      data: {
        videos: [],
        pagination: {
          total: 0,
          limit: parseInt(req.query.limit || 24),
          offset: parseInt(req.query.offset || 0),
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        }
      }
    });
  }
} 