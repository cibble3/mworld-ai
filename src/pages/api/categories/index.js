import * as orchestrator from '@/services/orchestrator';
import FILTER_MAP from '@/config/filterMap';

// Define static details for the main site sections (can be expanded)
const MAIN_CATEGORIES = {
  girls: { 
    title: 'Live Cam Girls', 
    description: 'Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.',
    relevantTypes: ['ethnicity', 'body_type', 'willingness', 'appearance', 'breasts', 'hair_color', 'hair_type', 'age', 'tag'], // Types from orchestrator relevant to girls
    filters: [
      {
        type: 'ethnicity',
        name: 'Ethnicity',
        options: ['asian', 'latina', 'white', 'ebony', 'middle_eastern', 'indian']
      },
      {
        type: 'hair_color',
        name: 'Hair Color',
        options: ['blonde', 'black', 'red', 'brunette', 'pink', 'other']
      },
      {
        type: 'body_type',
        name: 'Body Type',
        options: ['slim', 'athletic', 'curvy', 'bbw', 'petite', 'average']
      },
      {
        type: 'tags',
        name: 'Tags',
        options: ['milf', 'petite', 'bdsm', 'lingerie', 'tattoos', 'piercing', 'squirt', 'smoking', 'toys', 'roleplay']
      }
    ]
  },
  trans: {
    title: 'Trans Cam Models',
    description: 'Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.',
    relevantTypes: ['ethnicity', 'body_type', 'willingness', 'appearance', 'breasts', 'hair_color', 'hair_type', 'penis_size', 'age', 'tag'], // Types relevant to trans
    filters: [
      {
        type: 'ethnicity',
        name: 'Ethnicity',
        options: ['asian', 'latina', 'white', 'ebony', 'middle_eastern', 'indian']
      },
      {
        type: 'hair_color',
        name: 'Hair Color',
        options: ['blonde', 'black', 'red', 'brunette', 'pink', 'other']
      },
      {
        type: 'body_type',
        name: 'Body Type',
        options: ['slim', 'athletic', 'curvy', 'muscular', 'petite', 'average']
      },
      {
        type: 'tags',
        name: 'Tags',
        options: ['milf', 'lingerie', 'tattoos', 'piercing', 'smoking', 'toys', 'roleplay']
      }
    ]
  },
  fetish: {
    title: 'Fetish Cam Models',
    description: 'Explore our fetish cam models. Experience BDSM, domination, and other fetish content with our beautiful models.',
    relevantTypes: ['willingness', 'appearance', 'tag'], // Types relevant to fetish
    filters: [
      {
        type: 'willingness',
        name: 'Willingness',
        options: ['fetish', 'bdsm', 'roleplay', 'dildo', 'anal']
      },
      {
        type: 'tags',
        name: 'Tags',
        options: ['bdsm', 'lingerie', 'tattoos', 'piercing', 'smoking', 'toys', 'roleplay']
      }
    ]
  },
  videos: {
    title: 'Webcam Videos',
    description: 'Watch recorded webcam videos from the hottest cam models. Enjoy the best webcam performances anytime.',
    relevantTypes: ['videoTag', 'videoCategory'], // VPAPI tags/categories
    filters: [
      {
        type: 'category',
        name: 'Category',
        options: ['popular', 'new', 'amateur', 'solo', 'lesbian', 'trans']
      },
      {
        type: 'tags',
        name: 'Tags',
        options: ['hd', 'featured', 'trending', 'amateur', 'toys', 'lingerie']
      }
    ]
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
      
      // Create fallback data with predefined filters
      const fallbackData = {
        success: true,
        data: {
          categories: Object.entries(MAIN_CATEGORIES).map(([id, data]) => ({
            id,
            slug: id,
            name: data.title,
            title: data.title,
            description: data.description,
            filters: data.filters || []
          }))
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

      // Return data with predefined filters
      const responseData = {
        id: category,
        slug: category,
        name: mainCategoryDetails.title,
        title: mainCategoryDetails.title,
        description: mainCategoryDetails.description,
        filters: mainCategoryDetails.filters || [],
        subcategories: relevantSubcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
        }))
      };

      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300'); // Cache for 1 min, stale for 5 min
      return res.status(200).json({ success: true, data: responseData });
    }
    
    // --- Handle request for all top-level categories --- 
    const allTopLevelCategories = Object.entries(MAIN_CATEGORIES).map(([id, data]) => ({
      id,
      slug: id,
      name: data.title,
      title: data.title,
      description: data.description,
      filters: data.filters || [],
      // Count relevant subcategories found in the *current* unified taxonomy
      subcategoriesCount: unifiedTaxonomy.all.filter(sub => data.relevantTypes.includes(sub.type)).length
    }));
    
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300'); // Cache for 1 min, stale for 5 min
    return res.status(200).json({
      success: true,
      data: {
        categories: allTopLevelCategories
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