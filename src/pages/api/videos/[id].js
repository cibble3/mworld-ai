/**
 * Video Detail API Route
 * 
 * Provides details for a specific video by ID.
 * Uses the VPAPI details endpoint according to documentation.
 */

import axios from 'axios';
import { VPAPI_CONFIG } from '@/services/config';

const generateEnhancedMockVideoDetail = (id, category) => {
  // Generate consistent mock data based on the ID
  const idNum = parseInt(id.replace(/[^0-9]/g, '').substring(0, 3) || '100', 10);
  const imageId = (idNum % 50) + 100;

  // Determine category-specific data
  const categories = {
    'popular': {
      titles: ['Hot Sex Session with Gorgeous Blonde', 'Intense Passionate Love Making', 'Ultimate Pleasure Scene with Beautiful Model'],
      tags: ['popular', 'trending', 'featured', 'hot'],
      sexualOrientation: 'straight'
    },
    'new': {
      titles: ['Fresh Release: Exciting Bedroom Session', 'New Upload: Passionate Couple Experience', 'Just Added: Intense Pleasure Moments'],
      tags: ['new', 'fresh', 'recent', 'hd'],
      sexualOrientation: 'straight'
    },
    'amateur': {
      titles: ['Real Couple Shares Intimate Moment', 'Homemade Passionate Love Making', 'Amateur Couple\'s Wild Night'],
      tags: ['amateur', 'homemade', 'real', 'authentic'],
      sexualOrientation: 'straight'
    },
    'fetish': {
      titles: ['Dominant Experience with Submissive Beauty', 'BDSM Adventure with Willing Partner', 'Leather and Lace Fetish Exploration'],
      tags: ['fetish', 'bdsm', 'kinky', 'roleplay'],
      sexualOrientation: 'straight'
    },
    'lesbian': {
      titles: ['Beautiful Women Share Passionate Moment', 'Sensual Exploration Between Girlfriends', 'Intimate Lesbian Experience'],
      tags: ['lesbian', 'women', 'sensual', 'girlfriends'],
      sexualOrientation: 'gay'
    },
    'milf': {
      titles: ['Experienced Beauty Shows How It\'s Done', 'Mature Wonder with Amazing Skills', 'MILF Perfection in Bedroom'],
      tags: ['milf', 'mature', 'experienced', 'cougar'],
      sexualOrientation: 'straight'
    },
    'anal': {
      titles: ['Ultimate Anal Experience', 'Perfect Backdoor Adventure', 'Anal Pleasure Session'],
      tags: ['anal', 'backdoor', 'intense'],
      sexualOrientation: 'straight'
    },
    'trans': {
      titles: ['Beautiful Trans Model Performs', 'Stunning Trans Beauty in Action', 'Perfect Trans Body on Display'],
      tags: ['trans', 'transgender', 'beautiful', 'shemale'],
      sexualOrientation: 'shemale'
    }
  };

  // Use category-specific data or default to popular
  const categoryData = categories[category] || categories['popular'];
  const titleIndex = idNum % categoryData.titles.length;

  // Generate the mock video detail in VPAPI format
  return {
    id: id,
    title: categoryData.titles[titleIndex],
    description: `This is a detailed description for ${categoryData.titles[titleIndex]}. It showcases the best content in the ${category} category with high-quality production.`,
    thumbnail: `https://picsum.photos/id/${imageId}/320/180`,
    previewImages: [
      `https://picsum.photos/id/${imageId}/320/180`,
      `https://picsum.photos/id/${imageId + 1}/320/180`,
      `https://picsum.photos/id/${imageId + 2}/320/180`,
      `https://picsum.photos/id/${imageId + 3}/320/180`
    ],
    coverImage: `https://picsum.photos/id/${imageId}/800/450`,
    duration: 300 + (idNum % 10) * 60, // 5-15 minutes
    views: 5000 + (idNum % 10) * 1000, // 5k-15k views
    category: category,
    sexualOrientation: categoryData.sexualOrientation,
    tags: categoryData.tags,
    targetUrl: `https://example.com/videos/${category}/${id}`,
    detailsUrl: `https://example.com/api/videos/details/${id}`,
    quality: idNum % 3 === 0 ? 'sd' : 'hd',
    isHd: idNum % 3 !== 0,
    uploader: 'LiveJasmin',
    uploaderLink: 'https://example.com/uploader/LiveJasmin',
    // VPAPI uses a {CONTAINER} placeholder in playerEmbedUrl
    playerEmbedUrl: `https://player.vimeo.com/video/824804225?player_id={CONTAINER}`,
    // VPAPI uses a script tag with {CONTAINER} placeholder
    playerEmbedScript: `<script src="https://player.vimeo.com/api/player.js"></script>
<div id="{CONTAINER}" style="width:100%;height:100%"></div>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new Vimeo.Player('{CONTAINER}', {
      url: 'https://player.vimeo.com/video/824804225',
      width: '100%',
      height: '100%',
      responsive: true
    });
  });
</script>`,
    performerId: `performer-${idNum % 20 + 1}`,
    uploadDate: new Date(Date.now() - (idNum % 30) * 86400000).toISOString(), // Random date in last 30 days
    language: 'en',
    _provider: 'vpapi'
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

  const { id } = req.query;
  const category = req.query.category || 'popular';

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Video ID is required',
      data: null
    });
  }

  // Extract just the ID part if this is an SEO URL (id-slug format)
  const cleanId = id.split('-')[0];

  console.log(`[API /videos/${id}] Processing request for ID: ${cleanId} (original request: ${id})`);

  try {
    // Real API Call Logic - Enabled

    // Check if VPAPI is configured
    const vpapiConfigured = VPAPI_CONFIG.BASE_URL && VPAPI_CONFIG.API_KEY && VPAPI_CONFIG.PSID;

    // For fallback/debugging in development or if VPAPI is not configured
    const shouldUseMock = req.query.useMock === 'true' ||
      (process.env.NODE_ENV === 'development' && !vpapiConfigured);

    if (shouldUseMock) {
      console.log(`[API /videos/${id}] Using mock data for video ID: ${cleanId}`);

      // Return enhanced mock data
      const mockVideo = generateEnhancedMockVideoDetail(cleanId, category);
      return res.status(200).json({
        success: true,
        data: mockVideo
      });
    }

    // Log warning if VPAPI not fully configured but continue trying
    if (!vpapiConfigured) {
      console.warn(`[API /videos/${id}] VPAPI not fully configured. Attempting anyway.`);
    }

    // According to the API documentation, for video details we need to use the details endpoint
    console.log(`[API /videos/${id}] Fetching video details for ID: ${cleanId}`);

    // Based on the API docs, build the details request URL with required parameters
    const detailsUrl = new URL(`${VPAPI_CONFIG.BASE_URL}${VPAPI_CONFIG.DETAILS_ENDPOINT}/${cleanId}`);

    // Required parameters according to the API docs and Laravel code
    const clientIp = process.env.VPAPI_CLIENT_IP || '223.177.55.88';
    detailsUrl.searchParams.append('psid', VPAPI_CONFIG.PSID || 'mikeeyy3');
    detailsUrl.searchParams.append('accessKey', VPAPI_CONFIG.API_KEY || 'a0163de9298e6c0fb2699b73b41da52e');
    detailsUrl.searchParams.append('clientIp', clientIp);
    detailsUrl.searchParams.append('cobrandId', '201300');
    detailsUrl.searchParams.append('site', 'wl3');

    console.log(`[API /videos/${id}] Request URL: ${detailsUrl.toString()}`);

    const response = await axios.get(detailsUrl.toString(), {
      timeout: 15000,
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check VPAPI specific success flag
    if (response.status !== 200 || !response.data?.success) {
      console.error(`[API /videos/${id}] VPAPI response error:`, response.data);
      throw new Error(`VPAPI request failed with status ${response.status} or success=false`);
    }

    // Log response data for debugging
    console.log(`[API /videos/${id}] Response received. Success: ${response.data?.success}`);

    // For video details, the API returns a direct 'data' object, not an array of videos
    const videoData = response.data?.data;

    if (!videoData) {
      console.warn(`[API /videos/${id}] Video details not found in VPAPI response`);
      return res.status(404).json({
        success: false,
        error: 'Video not found',
        data: null
      });
    }

    // Format the video data before sending to client
    const formattedVideoData = {
      ...videoData,
      // Ensure the playerEmbedUrl is properly formatted
      playerEmbedUrl: videoData.playerEmbedUrl ? new URL(videoData.playerEmbedUrl.startsWith('//') ?
        `https:${videoData.playerEmbedUrl}` : videoData.playerEmbedUrl).toString() : null,
      // Include any other necessary fields
      performerId: videoData.performerId || null
    };

    return res.status(200).json({
      success: true,
      data: formattedVideoData
    });
    // END OF REAL API CALL LOGIC

  } catch (error) {
    console.error(`[API /videos/${id}] Error:`, error.message);
    if (error.response) {
      console.error(`[API /videos/${id}] Error response data:`, error.response.data);
    }

    const useFallback = process.env.NODE_ENV !== 'production';
    if (useFallback) {
      console.warn(`[API /videos/${id}] Returning fallback data after error`);

      // Generate enhanced mock fallback
      const mockVideo = generateEnhancedMockVideoDetail(cleanId, category);

      return res.status(200).json({
        success: true,
        data: mockVideo
      });
    }

    return res.status(500).json({
      success: false,
      error: `Failed to fetch video: ${error.message}`,
      data: null
    });
  }
} 