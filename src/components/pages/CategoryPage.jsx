import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';
import ContentGrid, { LAYOUT_TYPES, CONTENT_TYPES } from '@/components/ContentGrid';
import { fetchModels, fetchCategories } from '@/services/api';
import useContentEnrichment from '@/hooks/useContentEnrichment';

/**
 * CategoryPage component for displaying models in a category
 * 
 * @param {Object} props
 * @param {Object} props.initialData - Initial data from getServerSideProps
 * @param {string} props.category - Category name (e.g., "asian", "ebony")
 * @param {string} props.subcategory - Subcategory name (if applicable)
 * @param {Object} props.pageContent - Category meta content
 * @returns {JSX.Element}
 */
const CategoryPage = ({ initialData, category, subcategory, pageContent }) => {
  const router = useRouter();
  const { themeConfig } = useTheme();
  
  // State for managing models and pagination
  const [models, setModels] = useState(initialData?.data?.models || []);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialData?.data?.pagination || {
    total: 0,
    limit: 50,
    offset: 0,
    pages: 0,
    currentPage: 1
  });
  
  // Enrich models with AI-generated content
  const { items: enrichedModels, loading: enrichLoading } = useContentEnrichment({
    items: models,
    type: CONTENT_TYPES.MODEL,
    category
  });
  
  // Load more models when user clicks "Load More"
  const loadMoreModels = async () => {
    if (loading || pagination.currentPage >= pagination.pages) return;
    
    setLoading(true);
    try {
      // Calculate new offset
      const newOffset = pagination.offset + pagination.limit;
      
      // Fetch more models
      const response = await fetchModels({
        category,
        subcategory,
        limit: pagination.limit,
        offset: newOffset
      });
      
      if (response.success) {
        // Append new models to existing models
        setModels(prevModels => [...prevModels, ...response.data.models]);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error loading more models:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format meta title with fallbacks
  const getMetaTitle = () => {
    if (pageContent?.meta_title) return pageContent.meta_title;
    
    let title = 'Live Cams';
    if (category) {
      title = `${category.charAt(0).toUpperCase() + category.slice(1)} ${title}`;
    }
    if (subcategory) {
      title = `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} ${title}`;
    }
    return `${title} | MistressWorld`;
  };
  
  // Format meta description with fallbacks
  const getMetaDescription = () => {
    if (pageContent?.meta_desc) return pageContent.meta_desc;
    
    let desc = 'Experience the best live cam models on MistressWorld.';
    if (category) {
      desc = `${category.charAt(0).toUpperCase() + category.slice(1)} live cam models. ${desc}`;
    }
    if (subcategory) {
      desc = `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} ${desc}`;
    }
    return desc;
  };
  
  return (
    <>
      <Head>
        <title>{getMetaTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        {pageContent?.meta_keywords && (
          <meta name="keywords" content={pageContent.meta_keywords} />
        )}
      </Head>
      
      <div
        className="min-h-screen"
        style={{ backgroundColor: themeConfig.palette.background.main }}
      >
        {/* Header Section */}
        <section
          className="py-6 px-4"
          style={{ backgroundColor: themeConfig.palette.background.dark }}
        >
          <div className="container mx-auto max-w-7xl">
            <h1
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ 
                color: themeConfig.palette.text.light,
                fontSize: themeConfig.typography.h1.fontSize,
                lineHeight: themeConfig.typography.h1.lineHeight,
                fontWeight: themeConfig.typography.h1.fontWeight
              }}
            >
              {pageContent?.title || `${category?.toUpperCase() || 'Live'} Cam Models`}
              {subcategory && ` - ${subcategory.toUpperCase()}`}
            </h1>
            
            {pageContent?.top_text && (
              <div 
                className="prose prose-lg text-white max-w-none mb-4"
                style={{ color: themeConfig.palette.text.light }}
                dangerouslySetInnerHTML={{ __html: pageContent.top_text }}
              />
            )}
          </div>
        </section>
        
        {/* Models Grid Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <ContentGrid
              items={enrichedModels}
              type={CONTENT_TYPES.MODEL}
              layout={LAYOUT_TYPES.GRID}
              loading={loading || enrichLoading}
              showMoreButton={pagination.currentPage < pagination.pages}
              onLoadMore={loadMoreModels}
              emptyMessage={`No ${category || ''} models found.`}
            />
          </div>
        </section>
        
        {/* Bottom Content Section */}
        {pageContent?.bottom_text && (
          <section
            className="py-8 px-4"
            style={{ backgroundColor: themeConfig.palette.background.card }}
          >
            <div className="container mx-auto max-w-7xl">
              <div 
                className="prose prose-lg max-w-none"
                style={{ color: themeConfig.palette.text.primary }}
                dangerouslySetInnerHTML={{ __html: pageContent.bottom_text }}
              />
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default CategoryPage; 