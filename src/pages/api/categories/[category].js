import * as orchestrator from '@/services/orchestrator';

// Define static details for the main site sections (same as in index.js)
const MAIN_CATEGORIES = {
  girls: { 
    title: 'Live Cam Girls', 
    description: 'Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.',
    relevantTypes: ['ethnicity', 'body_size', 'willingness', 'appearance', 'breasts', 'hair_color', 'hair_type', 'age', 'tag']
  },
  trans: {
    title: 'Trans Cam Models',
    description: 'Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.',
    relevantTypes: ['ethnicity', 'body_size', 'willingness', 'appearance', 'breasts', 'hair_color', 'hair_type', 'penis_size', 'age', 'tag']
  },
  free: {
    title: 'Free Cam Shows',
    description: 'Enjoy free cam shows with the hottest webcam models. No credit card required for these free live cams.',
    relevantTypes: ['tag']
  },
  fetish: {
    title: 'Fetish Cam Models',
    description: 'Explore fetish cam models and watch live fetish webcam shows. BDSM, domination, submission and more.',
    relevantTypes: ['tag', 'willingness', 'appearance', 'fetish']
  },
  videos: {
    title: 'Webcam Videos',
    description: 'Watch recorded webcam videos from the hottest cam models. Enjoy the best webcam performances anytime.',
    relevantTypes: ['videoTag', 'videoCategory']
  },
  blog: {
     title: 'Cam Model Blog',
     description: 'Read our blog for the latest news, updates, and stories about cam models and the webcam industry.',
     relevantTypes: []
  }
};

export default async function handler(req, res) {
  try {
    const { category } = req.query;
    const { forceRefresh = 'false' } = req.query;

    // Check if this is a valid category
    if (!MAIN_CATEGORIES[category]) {
      return res.status(404).json({ 
        success: false, 
        error: `Category not found: ${category}` 
      });
    }

    // Fetch the unified taxonomy from the orchestrator
    const categoryData = await orchestrator.fetchCategories({ 
      forceRefresh: forceRefresh === 'true' 
    });

    if (!categoryData.success) {
      console.error(`[API /categories/${category}] Error fetching categories from orchestrator:`, categoryData.error);
      if (!categoryData.data || categoryData.data.all.length === 0) {
        return res.status(500).json({ 
          success: false, 
          error: categoryData.error || 'Failed to fetch categories' 
        });
      }
      console.warn(`[API /categories/${category}] Returning potentially stale category data due to fetch error.`);
    }

    const unifiedTaxonomy = categoryData.data; // { all: [], byType: {}, bySource: {} }
    const mainCategoryDetails = MAIN_CATEGORIES[category];
    
    // If for some reason we don't have taxonomy data, return dummy data for development
    const fallbackSubcategories = [
      { id: 'bdsm', name: 'BDSM' },
      { id: 'latex', name: 'Latex' },
      { id: 'feet', name: 'Feet' },
      { id: 'domination', name: 'Domination' },
      { id: 'roleplay', name: 'Roleplay' },
      { id: 'leather', name: 'Leather' }
    ];
    
    // Filter the unified taxonomy to get subcategories relevant to this main category
    const relevantSubcategories = (unifiedTaxonomy.all && unifiedTaxonomy.all.length > 0) 
      ? unifiedTaxonomy.all.filter(sub => 
          mainCategoryDetails.relevantTypes.includes(sub.type)
        )
      : [];

    // Use fallback data for fetish if the API returns no subcategories
    let formattedSubcategories = [];
    if (category === 'fetish' && (!relevantSubcategories || relevantSubcategories.length === 0)) {
      formattedSubcategories = fallbackSubcategories;
    } else {
      formattedSubcategories = relevantSubcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
      }));
    }

    const responseData = {
      id: category,
      slug: category,
      title: mainCategoryDetails.title,
      description: mainCategoryDetails.description,
      subcategories: formattedSubcategories,
    };

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ success: true, data: responseData });

  } catch (error) {
    console.error(`[API /categories/${req.query.category}] Unhandled error:`, error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
} 