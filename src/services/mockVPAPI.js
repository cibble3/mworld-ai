/**
 * VPAPI Mock Service
 * 
 * This file provides a mock implementation of the VPAPI service
 * to ensure the site has content to display while the real API
 * is being fixed.
 */

// Helper function to generate consistent IDs based on seeds
const generateId = (seed) => {
  return `mock-${seed}-${Date.now().toString(36).substring(4)}`;
};

// Function to generate placeholder thumbnail URLs
const generateThumbnail = (id, width = 320, height = 180) => {
  // Use lorempicsum.photos for realistic images
  return `https://picsum.photos/${width}/${height}?random=${id}`;
};

// Generate a list of mock videos for various categories
const generateMockVideos = (category, limit = 24, offset = 0) => {
  const mockVideos = [];
  const totalMockVideos = 100; // Pretend we have 100 videos total
  
  // Define category-specific data for more realistic results
  const categories = {
    popular: {
      titlePrefix: "Popular",
      tags: ["trending", "popular", "featured"],
      durationMin: 300, // 5 minutes
      durationMax: 1800, // 30 minutes
      viewsMin: 50000,
      viewsMax: 500000
    },
    new: {
      titlePrefix: "New",
      tags: ["new", "recent", "fresh"],
      durationMin: 240, // 4 minutes
      durationMax: 1200, // 20 minutes
      viewsMin: 1000,
      viewsMax: 30000
    },
    featured: {
      titlePrefix: "Featured",
      tags: ["featured", "premium", "exclusive"],
      durationMin: 600, // 10 minutes
      durationMax: 2400, // 40 minutes
      viewsMin: 30000,
      viewsMax: 200000
    },
    amateur: {
      titlePrefix: "Amateur",
      tags: ["amateur", "homemade", "real"],
      durationMin: 180, // 3 minutes
      durationMax: 900, // 15 minutes
      viewsMin: 5000,
      viewsMax: 100000
    },
    fetish: {
      titlePrefix: "Fetish",
      tags: ["fetish", "kink", "bdsm"],
      durationMin: 300, // 5 minutes
      durationMax: 1500, // 25 minutes
      viewsMin: 10000,
      viewsMax: 150000
    },
    asian: {
      titlePrefix: "Asian",
      tags: ["asian", "japanese", "korean"],
      durationMin: 240, // 4 minutes
      durationMax: 1200, // 20 minutes
      viewsMin: 20000,
      viewsMax: 250000
    },
    latina: {
      titlePrefix: "Latina",
      tags: ["latina", "spanish", "mexican"],
      durationMin: 300, // 5 minutes
      durationMax: 1500, // 25 minutes
      viewsMin: 15000,
      viewsMax: 200000
    },
    ebony: {
      titlePrefix: "Ebony",
      tags: ["ebony", "black", "african"],
      durationMin: 300, // 5 minutes
      durationMax: 1500, // 25 minutes
      viewsMin: 15000,
      viewsMax: 200000
    },
    lesbian: {
      titlePrefix: "Lesbian",
      tags: ["lesbian", "girl-on-girl", "female"],
      durationMin: 360, // 6 minutes
      durationMax: 1800, // 30 minutes
      viewsMin: 25000,
      viewsMax: 300000
    },
    trans: {
      titlePrefix: "Trans",
      tags: ["trans", "transgender", "shemale"],
      durationMin: 300, // 5 minutes
      durationMax: 1500, // 25 minutes
      viewsMin: 10000,
      viewsMax: 150000
    }
  };
  
  // Use default category if the specified one doesn't exist
  const categoryData = categories[category] || categories.popular;
  
  // Generate videos for the requested range
  for (let i = 0; i < limit; i++) {
    const index = offset + i;
    if (index >= totalMockVideos) break; // Stop if we exceed total
    
    // Generate random duration within category range
    const duration = Math.floor(
      Math.random() * (categoryData.durationMax - categoryData.durationMin) + 
      categoryData.durationMin
    );
    
    // Generate random views within category range
    const views = Math.floor(
      Math.random() * (categoryData.viewsMax - categoryData.viewsMin) + 
      categoryData.viewsMin
    );
    
    // Create a title for the video
    const title = `${categoryData.titlePrefix} Video ${index + 1} - Exclusive Content`;
    
    // Generate a unique ID for this video
    const id = generateId(category + '-' + index);
    
    // Create video object following the structure expected by the app
    mockVideos.push({
      id,
      title,
      thumbnail: generateThumbnail(index + 1),
      previewImages: [
        generateThumbnail(index + 1, 320, 180),
        generateThumbnail(index + 1, 640, 360),
        generateThumbnail(index + 1, 800, 450)
      ],
      coverImage: generateThumbnail(index + 1, 800, 450),
      duration,
      views,
      category,
      tags: [...categoryData.tags, `tag-${index % 5}`],
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString(), // Stagger creation dates
      uploader: "MistressWorld",
      uploaderLink: "https://www.mistressworld.com",
      targetUrl: `https://www.mistressworld.com/videos/${id}`,
      detailsUrl: `https://www.mistressworld.com/api/videos/details/${id}`,
      quality: Math.random() > 0.3 ? "hd" : "sd",
      isHd: Math.random() > 0.3,
      _provider: "vpapi"
    });
  }
  
  return {
    items: mockVideos,
    total: totalMockVideos,
    hasMore: (offset + limit) < totalMockVideos
  };
};

// Export mock VPAPI service
const mockVPAPI = {
  /**
   * Fetch videos mock function
   * Returns mock data that matches the format expected by the app
   */
  fetchVideos: async (params = {}) => {
    // Extract parameters
    const {
      category = 'popular',
      limit = 24,
      offset = 0
    } = params;
    
    console.log(`[MockVPAPI] Fetching mock videos for category: ${category}, limit: ${limit}, offset: ${offset}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data
    const { items, total, hasMore } = generateMockVideos(category, limit, offset);
    
    // Calculate pagination data
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    console.log(`[MockVPAPI] Returning ${items.length} mock videos`);
    
    // Return data in the expected format
    return {
      success: true,
      data: {
        items,
        pagination: {
          total,
          limit,
          offset,
          currentPage,
          totalPages,
          hasMore,
          count: items.length
        }
      }
    };
  }
};

export default mockVPAPI; 