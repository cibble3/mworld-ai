import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ModelAPI } from '@/services/api';
import { 
  TopTextModule, 
  ModelGridModule, 
  BottomTextModule, 
  RelevantContentModule 
} from '@/theme/components/modules';
import { useSearchParams } from 'next/navigation';
import { capitalizeString } from '@/utils/string-helpers';
import ENV from '@/config/environment';

/**
 * PageView - Standardized template for rendering category pages.
 * Follows the modular structure: Header, Sidebar, TopText, ModelGrid, 
 * BottomText, RelevantContent, Footer.
 */
const PageView = ({ 
  category = 'girls', 
  subcategory, 
  provider = 'awe', 
  initialModels = [], 
  initialContent = {}, 
  relatedItems = [],
  pageTitle,
  pageDescription
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for models and pagination
  const [models, setModels] = useState(initialModels);
  const [loading, setLoading] = useState(initialModels.length === 0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Generate title and descriptions if not explicitly provided
  const derivedTitle = pageTitle || (subcategory 
    ? `${capitalizeString(subcategory)} ${capitalizeString(category)} Cams`
    : `Live ${capitalizeString(category)} Cams`);
  
  const derivedDescription = pageDescription || (subcategory 
    ? `Watch live ${subcategory} ${category} models perform on MistressWorld.` 
    : `Watch live ${category} models perform on MistressWorld.`);
  
  // Meta data for the page using dynamic generation
  const meta = { title: derivedTitle, description: derivedDescription, ...initialContent?.meta };
  
  // Function to load more models
  const loadMore = async () => {
    if (!hasMore || loading || !router.isReady) return;
    setPage(prev => prev + 1);
  };
  
  // Fetch models when parameters change
  useEffect(() => {
    // Reset models when category/subcategory changes
    setModels([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoading(true);
  }, [category, subcategory, searchParams]);

  useEffect(() => {
    // Only fetch if router is ready and category exists
    if (!router.isReady || !category) return;
    
    const fetchModelsData = async () => {
      try {
        if (page === 1) setLoading(true); // Only show initial load spinner
        
        const filters = ModelAPI.extractFilters(searchParams);
        
        // Add subcategory filter if applicable
        if (subcategory) {
          if (['asian', 'ebony', 'latina', 'white'].includes(subcategory)) {
            filters.ethnicity = subcategory;
          } else if (['blonde', 'brunette', 'redhead'].includes(subcategory)) {
            filters.hair_color = subcategory;
          } else {
            filters.tags = subcategory;
          }
        }
        
        const response = await ModelAPI.fetchModels(
          category,
          filters, 
          ENV.DEFAULT_PAGE_SIZE, 
          provider,
          page // Pass page number for pagination
        );
        
        if (response && response.success) {
          setModels(prev => page === 1 ? response.models : [...prev, ...response.models]);
          setHasMore(response.pagination?.hasMore ?? (response.models?.length >= ENV.DEFAULT_PAGE_SIZE));
        } else {
          setError(response?.error || 'Failed to load models');
          if (ENV.IS_DEV) {
            setModels(ModelAPI.getFallbackModels(category));
            setHasMore(false); // No pagination for fallbacks usually
          }
        }
      } catch (err) {
        console.error(`[PageView: ${category}] Error fetching models:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModelsData();
  }, [category, subcategory, page, searchParams, router.isReady, provider]);
  
  return (
    <>
      {/* TOP TEXT MODULE - Uses dynamic title and description */}
      <TopTextModule 
        title={derivedTitle}
        description={derivedDescription}
        html={initialContent?.topText} 
      />
      
      {/* MODEL GRID MODULE - Main content */}
      <ModelGridModule
        models={models}
        isLoading={loading && page === 1} // Show loading only on initial fetch
        loadMore={loadMore}
        hasMore={hasMore}
        emptyMessage={error || `No ${category} models found matching these criteria.`}
      />
      
      {/* BOTTOM TEXT MODULE - SEO content */}
      <BottomTextModule
        title={initialContent?.bottomContentTitle || `About ${derivedTitle}`}
        html={initialContent?.bottomContentHtml}
        content={initialContent?.bottomContentText}
      />
      
      {/* RELEVANT CONTENT MODULE - Related blogs, models, etc. */}
      {relatedItems?.length > 0 && (
        <RelevantContentModule
          title={`Popular ${capitalizeString(category)} Models`}
          items={relatedItems}
          itemType="models"
          maxItems={6}
        />
      )}
    </>
  );
};

export default PageView; 