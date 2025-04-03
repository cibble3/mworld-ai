import * as orchestrator from '@/services/orchestrator';

// Define static details for the main site sections (can be expanded)
const MAIN_CATEGORIES = {
  girls: { 
    title: 'Live Cam Girls', 
    description: 'Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.',
    relevantTypes: ['ethnicity', 'body_size', 'willingness', 'appearance', 'breasts', 'hair_color', 'hair_type', 'age', 'tag'] // Types from orchestrator relevant to girls
  },
  trans: {
    title: 'Trans Cam Models',
    description: 'Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.',
    relevantTypes: ['ethnicity', 'body_size', 'willingness', 'appearance', 'breasts', 'hair_color', 'hair_type', 'penis_size', 'age', 'tag'] // Types relevant to trans
  },
  fetish: {
    title: 'Fetish Cam Models',
    description: 'Explore our fetish cam models. Experience BDSM, domination, and other fetish content with our beautiful models.',
    relevantTypes: ['willingness', 'appearance', 'tag'] // Types relevant to fetish
  },
  free: {
    title: 'Free Cam Shows',
    description: 'Enjoy free cam shows with the hottest webcam models. No credit card required for these free live cams.',
    relevantTypes: ['tag'] // Primarily FreeAPI tags
  },
  videos: {
    title: 'Webcam Videos',
    description: 'Watch recorded webcam videos from the hottest cam models. Enjoy the best webcam performances anytime.',
    relevantTypes: ['videoTag', 'videoCategory'] // VPAPI tags/categories
  },
  blog: {
     title: 'Cam Model Blog',
     description: 'Read our blog for the latest news, updates, and stories about cam models and the webcam industry.',
     relevantTypes: [] // No API-driven subcategories currently
  }
};

export default async function handler(req, res) {
  try {
    const { category } = req.query;
    const { forceRefresh = 'false' } = req.query; // Allow forcing cache refresh

    // Fetch the unified taxonomy from the orchestrator
    const categoryData = await orchestrator.fetchCategories({ 
        forceRefresh: forceRefresh === 'true' 
    });

    if (!categoryData.success) {
      // Log the error but provide fallback data
      console.error('[API /categories] Error fetching categories from orchestrator:', categoryData.error);
      
      // Create fallback data for basic functionality
      const fallbackData = {
        success: true,
        data: {
          categories: [
            {
              id: 'girls',
              slug: 'girls',
              title: 'Live Cam Girls',
              description: 'Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.'
            },
            {
              id: 'trans',
              slug: 'trans',
              title: 'Trans Cam Models',
              description: 'Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.'
            },
            {
              id: 'fetish',
              slug: 'fetish',
              title: 'Fetish Cam Models',
              description: 'Explore our fetish cam models. Experience BDSM, domination, and other fetish content with our beautiful models.'
            },
            {
              id: 'free',
              slug: 'free',
              title: 'Free Cam Shows',
              description: 'Enjoy free cam shows with the hottest webcam models. No credit card required for these free live cams.'
            },
            {
              id: 'videos',
              slug: 'videos',
              title: 'Webcam Videos',
              description: 'Watch recorded webcam videos from the hottest cam models. Enjoy the best webcam performances anytime.'
            },
            {
              id: 'blog',
              slug: 'blog',
              title: 'Cam Model Blog',
              description: 'Read our blog for the latest news, updates, and stories about cam models and the webcam industry.'
            }
          ]
        }
      };
      
      console.log('[API /categories] Returning fallback category data');
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(fallbackData);
    }

    const unifiedTaxonomy = categoryData.data; // { all: [], byType: {}, bySource: {} }

    // --- Handle request for a specific category --- 
    if (category) {
      if (!MAIN_CATEGORIES[category]) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }

      const mainCategoryDetails = MAIN_CATEGORIES[category];
      
      // Filter the unified taxonomy to get subcategories relevant to this main category
      const relevantSubcategories = unifiedTaxonomy.all.filter(sub => 
          mainCategoryDetails.relevantTypes.includes(sub.type)
      );

      // TODO: Enhance subcategory data
      // Fetch specific SEO title/description for each subcategory ID 
      // from a CMS, database, or local content files if needed.
      // For now, just return id and name.
      const formattedSubcategories = relevantSubcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          // title: fetchedTitle || sub.name, // Example placeholder
          // description: fetchedDescription || `Explore ${sub.name} ${mainCategoryDetails.title}.` // Example placeholder
      }));

      const responseData = {
        id: category,
        slug: category,
        title: mainCategoryDetails.title,
        description: mainCategoryDetails.description,
        subcategories: formattedSubcategories,
        // Include raw orchestrator data for debugging/flexibility if needed
        // _taxonomy: unifiedTaxonomy 
      };

      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300'); // Cache for 1 min, stale for 5 min
      return res.status(200).json({ success: true, data: responseData });
    }
    
    // --- Handle request for all top-level categories --- 
    const allTopLevelCategories = Object.entries(MAIN_CATEGORIES).map(([id, data]) => ({
      id,
      slug: id,
      title: data.title,
      description: data.description,
      // Count relevant subcategories found in the *current* unified taxonomy
      subcategoriesCount: unifiedTaxonomy.all.filter(sub => data.relevantTypes.includes(sub.type)).length
    }));
    
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300'); // Cache for 1 min, stale for 5 min
    return res.status(200).json({
      success: true,
      data: {
        categories: allTopLevelCategories
        // Include raw orchestrator data for debugging/flexibility if needed
        // _taxonomy: unifiedTaxonomy
      }
    });

  } catch (error) {
    console.error('[API /categories] Unhandled error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
} 