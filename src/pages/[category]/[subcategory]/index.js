import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import { getModelThumbnail, getSafeImageUrl } from '@/utils/image-helpers';
import { useSearchParams } from 'next/navigation';
import TopText from '@/theme/components/content/TopText';
import { capitalizeString } from '@/utils/string-helpers';
import { ModelAPI } from '@/services/api';

/**
 * Dynamic SEO-friendly filtered page for models
 * Handles routes like /girls/asian, /trans/bdsm, etc.
 */
const FilteredModelsPage = ({ initialCategory, initialSubcategory, initialMetadata }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract category/subcategory from router or props
  const { category: routeCategory, subcategory: routeSubcategory } = router.query;
  const category = routeCategory || initialCategory;
  const subcategory = routeSubcategory || initialSubcategory;
  
  // State for models
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Generate metadata based on category/subcategory
  const generateMetadata = () => {
    if (!category || !subcategory) return {
      title: "Loading...",
      description: "Please wait while we load this page.",
      keywords: ""
    };
    
    return {
      title: `${capitalizeString(subcategory)} ${capitalizeString(category)} Models`,
      description: `Discover ${subcategory} ${category} models available for live chat and webcam shows.`,
      keywords: `${subcategory} ${category}, cam models, live chat`
    };
  };
  
  // Meta data for the page
  const [pageMetadata, setPageMetadata] = useState(initialMetadata || generateMetadata());
  
  // Function to load more models
  const loadMore = async () => {
    if (!hasMore || loading || !router.isReady) return;
    setPage(prev => prev + 1);
  };
  
  // Update metadata when category/subcategory changes
  useEffect(() => {
    if (category && subcategory) {
      setPageMetadata(generateMetadata());
    }
  }, [category, subcategory]);
  
  // Effect to fetch models
  useEffect(() => {
    // Only fetch if router is ready and we have category/subcategory
    if (!router.isReady || !category || !subcategory) return;
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        console.log(`[FilteredPage] Fetching models for ${category}/${subcategory}, page ${page}`);
        
        // Extract filter parameters from URL
        const filters = {};
        if (subcategory !== 'all') {
          filters.ethnicity = subcategory;
        }
        
        // Add any additional filters from URL query params
        if (searchParams) {
          for (const [key, value] of searchParams.entries()) {
            if (key !== 'category' && key !== 'subcategory') {
              filters[key] = value;
            }
          }
        }
        
        // Fetch models with API
        const response = await ModelAPI.fetchModels(category, filters, 24, page);
        
        if (response.success) {
          if (page === 1) {
            setModels(response.models);
          } else {
            setModels(prev => [...prev, ...response.models]);
          }
          
          setHasMore(response.models.length === 24); // Assuming 24 is the page size
        } else {
          setError('Failed to load models');
          // Use fallback in development
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = ModelAPI.getFallbackModels(category);
            setModels(prev => page === 1 ? fallbackModels : [...prev, ...fallbackModels]);
          }
        }
      } catch (err) {
        console.error('[FilteredPage] Error fetching models:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [category, subcategory, page, searchParams, router.isReady]);
  
  // Get a normalized display name for the filter
  const filterDisplayName = useMemo(() => {
    const normalized = subcategory?.replace(/_/g, ' ');
    return normalized ? capitalizeString(normalized) : '';
  }, [subcategory]);
  
  // Safe category access with fallback
  const categoryName = category ? capitalizeString(category) : 'Models';
  
  return (
    <ThemeLayout 
      meta={pageMetadata}
      title={router.isReady ? `${filterDisplayName} ${categoryName}` : 'Loading...'}
      description={pageMetadata.description}
    >
      <div className="py-4">
        {/* Initial loading state when router is not ready or loading first page */}
        {(!router.isReady || (loading && page === 1)) ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-xl">Loading models...</div>
          </div>
        ) : error && models.length === 0 ? (
          <div className="text-center text-red-500 py-10">
            Error loading models: {error}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No models found matching these criteria. Try different filters.
          </div>
        ) : (
          <ModelGrid models={models} isLoading={loading && page > 1}>
            {(model) => (
              <ModelCard
                key={model.id || model.slug}
                performerId={model.id}
                name={model.name}
                age={model.age}
                ethnicity={model.ethnicity}
                tags={model.tags || []}
                image={model.thumbnail}
                isOnline={model.isOnline || true}
                viewerCount={model.viewerCount || 0}
                country={model.country}
                chatRoomUrl={model.chatRoomUrl}
                showStatus={model.showStatus}
                languages={model.languages}
                isHd={model.isHd}
              />
            )}
          </ModelGrid>
        )}
        
        {/* Load more button - only show when we have models and more to load */}
        {hasMore && models.length > 0 && router.isReady && (
          <div className="flex justify-center mt-8 mb-4">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-pink-700 transition-colors"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </ThemeLayout>
  );
};

// Fetch initial data at build time or on server-side
export async function getServerSideProps(context) {
  const { category, subcategory } = context.params;
  
  // Generate basic metadata
  const metadata = {
    title: `${capitalizeString(subcategory)} ${capitalizeString(category)} Models`,
    description: `Discover ${subcategory} ${category} models available for live chat and webcam shows.`,
    keywords: `${subcategory} ${category}, cam models, live chat`
  };
  
  return {
    props: {
      initialCategory: category,
      initialSubcategory: subcategory,
      initialMetadata: metadata
    },
  };
}

export default FilteredModelsPage; 