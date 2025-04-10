import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import { ModelAPI } from '@/services/api';
import { ModelGridModule, TopTextModule, BottomTextModule, RelevantContentModule } from '@/theme/components/modules';
import { generateDynamicMetadata } from '@/utils/seoHelpers';
import { capitalizeString } from '@/utils/string-helpers';

/**
 * StandardPage - Template for all category and subcategory pages
 * 
 * This follows the exact structure shown in the screenshot:
 * - header_module (via ThemeLayout)
 * - sidebar_module (via ThemeLayout)
 * - toptext_module
 * - modelGrid_module
 * - bottomText_module
 * - relevantContent_module
 * - footer_module (via ThemeLayout)
 */
const StandardPage = ({ 
  pageTitle,
  pageDescription,
  provider = 'awe',
  category = 'girls',
  subcategory,
  initialModels = [],
  initialContent = {},
  bottomContent,
  relatedItems = []
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for models and pagination
  const [models, setModels] = useState(initialModels);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Generate title and descriptions if not provided
  const title = pageTitle || (subcategory 
    ? `${capitalizeString(subcategory)} ${capitalizeString(category)} Cams`
    : `Live ${capitalizeString(category)} Cams`);
  
  const description = pageDescription || (subcategory 
    ? `Watch live ${subcategory} ${category} models perform on MistressWorld. Join now for private chat.` 
    : `Watch live ${category} models perform on MistressWorld. Join now for private chat.`);
  
  // Meta data for the page
  const meta = generateDynamicMetadata(
    router.asPath,
    searchParams,
    title,
    description
  );
  
  // Function to load more models
  const loadMore = async () => {
    if (!hasMore || loading || !router.isReady) return;
    setPage(prev => prev + 1);
  };
  
  // Fetch models when params change
  useEffect(() => {
    // Only fetch if router is ready
    if (!router.isReady) return;
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        
        // Extract filters from URL
        const filters = ModelAPI.extractFilters(searchParams);
        
        // Add subcategory as a filter if provided
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
        
        // Fetch models with normalized API
        const response = await ModelAPI.fetchModels(
          category,
          filters, 
          24,  // Limit per page
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
          console.error(`[StandardPage] Failed to fetch ${category} models:`, response?.error);
          setError(response?.error || 'Failed to load models');
          
          // Use fallback models in development
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = ModelAPI.getFallbackModels(category);
            setModels(prev => page === 1 ? fallbackModels : [...prev, ...fallbackModels]);
            setHasMore(true);
          }
        }
      } catch (err) {
        console.error(`[StandardPage] Error fetching ${category} models:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [category, subcategory, page, searchParams, router.isReady, provider]);
  
  // Prepare bottom content text
  const bottomTextContent = bottomContent || [
    `Explore our selection of ${title} on MistressWorld.`,
    `We offer high-quality live webcam experiences with our ${category} models. Join now for private chat sessions and exclusive content.`,
    `MistressWorld is the top destination for adult webcam entertainment featuring beautiful ${category} models from around the world.`
  ];
  
  return (
    <ThemeLayout meta={meta}>
      {/* TOP TEXT MODULE - Category title and description */}
      <TopTextModule 
        title={title}
        description={description}
      />
      
      {/* MODEL GRID MODULE - Main content */}
      <ModelGridModule
        models={models}
        isLoading={loading}
        loadMore={loadMore}
        hasMore={hasMore}
        emptyMessage={error || `No ${category} models found matching these criteria. Try different filters.`}
      />
      
      {/* BOTTOM TEXT MODULE - SEO content */}
      <BottomTextModule
        title={`About ${title}`}
        content={bottomTextContent}
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
    </ThemeLayout>
  );
};

export default StandardPage; 