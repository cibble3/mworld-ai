import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import { ModelAPI } from '@/services/api';
import { ModelGridModule, TopTextModule, BottomTextModule } from '@/theme/components/modules';
import { useSearchParams } from 'next/navigation';
import { capitalizeString } from '@/utils/string-helpers';

/**
 * CategoryPage - Template for displaying any model category
 * Supports all category types (girls, trans, free) with consistent layout
 */
const CategoryPage = ({ 
  initialCategory, 
  initialSubcategory,
  initialMetadata,
  initialModels = []
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract category/subcategory from router or props
  const { category: routeCategory, subcategory: routeSubcategory } = router.query;
  const category = routeCategory || initialCategory;
  const subcategory = routeSubcategory || initialSubcategory;
  
  // State for models and pagination
  const [models, setModels] = useState(initialModels);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Generate title and descriptions based on category/subcategory
  const getPageTitle = () => {
    if (!category) return 'Loading...';
    
    // Category only
    if (!subcategory) {
      return `${capitalizeString(category)} Cams`;
    }
    
    // Category + subcategory
    return `${capitalizeString(subcategory)} ${capitalizeString(category)} Models`;
  };
  
  const getPageDescription = () => {
    if (!category) return 'Please wait while we load this page.';
    
    // Category only
    if (!subcategory) {
      return `Watch live ${category.toLowerCase()} cam models perform on MistressWorld.`;
    }
    
    // Category + subcategory
    return `Discover ${subcategory.toLowerCase()} ${category.toLowerCase()} models available for live chat and webcam shows.`;
  };
  
  // Meta data for the page
  const [pageMetadata, setPageMetadata] = useState(initialMetadata || {
    title: getPageTitle(),
    description: getPageDescription(),
    keywords: `${subcategory || ''} ${category}, webcam models, live cams`
  });
  
  // Function to load more models
  const loadMore = async () => {
    if (!hasMore || loading || !router.isReady) return;
    setPage(prev => prev + 1);
  };
  
  // Update metadata when category/subcategory changes
  useEffect(() => {
    if (router.isReady && category) {
      setPageMetadata({
        title: getPageTitle(),
        description: getPageDescription(),
        keywords: `${subcategory || ''} ${category}, webcam models, live cams`
      });
    }
  }, [category, subcategory, router.isReady]);
  
  // Fetch models when params change
  useEffect(() => {
    // Only fetch if router is ready and category exists
    if (!router.isReady || !category) return;
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        console.log(`[CategoryPage] Fetching ${category}${subcategory ? '/' + subcategory : ''}, page ${page}`);
        
        // Extract filters from URL
        const filters = {};
        if (subcategory) {
          // Check if subcategory is an ethnicity or specific attribute
          if (['asian', 'ebony', 'latina', 'white'].includes(subcategory)) {
            filters.ethnicity = subcategory;
          } else if (['blonde', 'brunette', 'redhead'].includes(subcategory)) {
            filters.hair_color = subcategory;
          } else {
            // Otherwise use it as a tag
            filters.tags = subcategory;
          }
        }
        
        // Add additional filters from search params
        if (searchParams) {
          for (const [key, value] of searchParams.entries()) {
            if (key !== 'category' && key !== 'subcategory') {
              filters[key] = value;
            }
          }
        }
        
        // Determine if this is a free category
        const provider = category.includes('free') ? 'free' : 'awe';
        
        // Fetch models with normalized API
        const response = await ModelAPI.fetchModels(
          category.replace('free-', ''),  // Remove 'free-' prefix for API
          filters, 
          24,  // Limit per page
          page,
          provider
        );
        
        if (response && response.success) {
          if (page === 1) {
            setModels(response.models || []);
          } else {
            setModels(prev => [...prev, ...(response.models || [])]);
          }
          
          setHasMore(response.pagination?.hasMore || response.models?.length >= 24);
        } else {
          console.error('[CategoryPage] Failed to fetch models:', response?.error);
          setError(response?.error || 'Failed to load models');
          
          // Use fallback models in development
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = ModelAPI.getFallbackModels(category);
            setModels(prev => page === 1 ? fallbackModels : [...prev, ...fallbackModels]);
            setHasMore(true);
          }
        }
      } catch (err) {
        console.error('[CategoryPage] Error fetching models:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [category, subcategory, page, searchParams, router.isReady]);
  
  // Bottom content for SEO
  const bottomContent = (
    <>
      <h2 className="text-white text-xl font-semibold mb-4">
        About {getPageTitle()}
      </h2>
      <p className="mb-3 text-gray-400">
        MistressWorld offers the best selection of {getPageTitle()} you can find online.
        Our models stream in high definition and are available for private shows 24/7.
      </p>
      <p className="text-gray-400">
        Explore our diverse selection of performers and find your perfect match today.
        With our easy-to-use interface, you can filter by age, appearance, and special interests.
      </p>
    </>
  );
  
  return (
    <ThemeLayout
      title={pageMetadata.title}
      description={pageMetadata.description}
      meta={pageMetadata}
      bottomContentChildren={bottomContent}
    >
      {/* Main content - model grid */}
      <ModelGridModule
        models={models}
        isLoading={loading}
        loadMore={loadMore}
        hasMore={hasMore}
        emptyMessage={error || "No models found matching these criteria. Try different filters."}
      />
    </ThemeLayout>
  );
};

export default CategoryPage; 