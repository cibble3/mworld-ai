/**
 * Videos API Route
 * 
 * Provides a unified interface for video content by delegating to the orchestrator.
 * Handles consistent request parsing and error responses.
 */

import * as orchestrator from '@/services/orchestrator';

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
      model, // Assuming 'model' might mean performer/creator for videos?
      limit = 24,
      offset = 0,
      sort = 'popular', // Default sort order
      useMock: shouldUseMock = false // Allow explicit mock request, default to false
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    
    // Add a request ID to help identify and debug each unique request
    const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    console.log(`[API /videos] [${requestId}] Received request: category=${category}, subcategory=${subcategory}, limit=${parsedLimit}, offset=${parsedOffset}, sort=${sort}`);

    // IMPORTANT: Force useMock to false to ensure we always get real data
    // Call the orchestrator to fetch videos from VPAPI
    const videoData = await orchestrator.fetchVideos({
      category,
      subcategory,
      model,
      limit: parsedLimit,
      offset: parsedOffset,
      sort,
      useMock: false, // Force to false to ensure we get real data
      fallbackOnError: true, // Allow using fallback data on error
      requestId // Pass the request ID to help with tracing
    });

    // Return the response from the orchestrator
    if (videoData.success) {
      console.log(`[API /videos] [${requestId}] Success: Returning ${videoData.data?.items?.length || 0} videos.`);
      
      // Ensure the response format matches what useModelFeed expects (videos array)
      // Create a stable response without unnecessary data that might cause React to re-render
      const videos = (videoData.data.items || []).map(video => ({
        ...video,
        // If we had a timestamp or anything in the video that constantly changes, 
        // we would make it stable here by removing it
      }));
      
      return res.status(200).json({
          success: true,
          data: {
              videos,
              pagination: videoData.data.pagination || {}
          }
      });
    } else {
      console.error(`[API /videos] [${requestId}] Error from orchestrator: ${videoData.error}`);
      return res.status(500).json({
          success: false,
          error: videoData.error || 'Failed to fetch videos from orchestrator',
          data: {
              videos: [],
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