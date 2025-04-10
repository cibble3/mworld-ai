// import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "../../../components/navigation/dark-themeLive";
import { useContext, useEffect, useState, useMemo } from "react";
import HeadMeta from "@/components/HeadMeta";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import Image from "next/image";
import axios from "axios";
import pageLoaderContext from "@/context/PageLoaderContext";
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import { getCategoryMeta } from '@/utils/category-helpers';
import { text as girlsTransContent } from "@/theme/content/girlsTransContent";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useModelFeed from '@/hooks/useModelFeed';
import { capitalizeString } from "@/helper/helpers";
import UnifiedLayout from '@/theme/layouts/UnifiedLayout';
import FilterBar from '@/theme/components/filters/FilterBar';
import apiService from '@/services/apiService';
const Staticblogpost = dynamic(() => import("@/components/Staticblogpost"));

const HomeLiveScreenPhoto = dynamic(() =>
  import("@/components/NewHomeLiveScreenPhone")
);

/**
 * Trans Page - Displays trans models based on type/filter with filtering options
 */
const TransTypePage = ({ initialData, filters }) => {
  const router = useRouter();
  const [models, setModels] = useState(initialData?.items || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Extract type and filter values from URL query
  const { type } = router.query; 
  const filterValues = {
    ethnicity: router.query.ethnicity || '',
    hair_color: router.query.hair_color || '',
    body_type: router.query.body_type || '',
    tags: router.query.tags || ''
  };
  
  // Get specific content for this trans type
  const pageContent = girlsTransContent?.trans?.[type] || {};
  const title = pageContent.title || `Live ${capitalizeString(type || 'trans')} Cam Models`;
  const description = pageContent.desc || `Explore our stunning collection of live ${type || 'transgender'} cam models.`;

  // Construct meta tags
  const meta = {
    title: pageContent.meta_title || title,
    description: pageContent.meta_desc || description,
    keywords: pageContent.meta_keywords || `${type} trans cams, live ${type} trans cams`,
  };
  
  // Fetch models when filters or type change
  useEffect(() => {
    if (!type) return; // Don't fetch if type isn't ready
    
    const fetchFilteredModels = async () => {
      setIsLoading(true);
      
      try {
        // Collect all applied filters
        const appliedFilters = {
          ...filterValues,
          subcategory: type // Add the type as a subcategory filter
        };
        
        // Remove empty filters
        Object.keys(appliedFilters).forEach(key => {
          if (!appliedFilters[key]) {
            delete appliedFilters[key];
          }
        });
        
        // Fetch models with filters
        const result = await apiService.fetchModels('trans', appliedFilters, {
          limit: 24,
          offset: 0
        });
        
        if (result.success) {
          setModels(result.data.items);
          setPagination(result.data.pagination);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch models');
          setModels([]);
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilteredModels();
  }, [router.query, type]); // Depend on query and type
  
  // Handle loading more models
  const handleLoadMore = async () => {
    if (isLoading || !pagination.hasMore || !type) return;
    
    setIsLoading(true);
    
    try {
      // Collect all applied filters
      const appliedFilters = {
          ...filterValues,
          subcategory: type
        };
        
      Object.keys(appliedFilters).forEach(key => {
        if (!appliedFilters[key]) {
          delete appliedFilters[key];
        }
      });
      
      // Fetch more models
      const result = await apiService.fetchModels('trans', appliedFilters, {
        limit: 24,
        offset: pagination.offset + pagination.limit
      });
      
      if (result.success) {
        setModels(prevModels => [...prevModels, ...result.data.items]);
        setPagination(result.data.pagination);
        setError(null);
      } else {
        setError(result.error || 'Failed to load more models');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newQuery = { ...router.query };
    
    if (value) {
      newQuery[filterType] = value;
    } else {
      delete newQuery[filterType];
    }
    
    // Ensure type remains in the query
    newQuery.type = type;
    
    router.push({
      pathname: router.pathname,
      query: newQuery
    }, undefined, { shallow: true });
  };
  
  // Prepare bottom content
  const bottomContentJSX = pageContent.about ? (
    <div className="grid md:grid-cols-2 gap-8">
      {pageContent.about.map((section, index) => (
        <div key={index} className="bg-[#1a1c21] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-pink-500">
            {section.heading}
          </h2>
          {section.desc1.map((paragraph, idx) => (
            <p key={idx} className="text-gray-400 mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  ) : null;
  
  return (
    <UnifiedLayout
      title={title}
      description={description}
      meta={meta}
      bottomContentChildren={bottomContentJSX}
    >
      {/* Filters */}
      <FilterBar 
        filters={filters}
        activeFilters={filterValues}
        onFilterChange={handleFilterChange}
      />
      
      {/* Models Grid */}
      <div className="mb-8">
        <ModelGrid 
          models={models} 
          isLoading={isLoading && models.length === 0} // Show loading skeleton only initially
          error={error}
        >
          {(model) => (
            <ModelCard 
              key={model.id}
              performerId={model.id}
              name={model.name}
              age={model.age}
              ethnicity={model.ethnicity}
              tags={model.tags || []}
              image={model.thumbnail}
              isOnline={model.isOnline !== false}
              viewerCount={model.viewerCount || 0}
            />
          )}
        </ModelGrid>
        
        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
};

// Server-side data fetching for initial load
export async function getServerSideProps(context) {
  const { type } = context.query;

  if (!type) {
    return { notFound: true }; // Return 404 if type is missing
  }
  
  try {
    // Collect filters from query params
    const queryFilters = {};
    if (context.query.ethnicity) queryFilters.ethnicity = context.query.ethnicity;
    if (context.query.hair_color) queryFilters.hair_color = context.query.hair_color;
    if (context.query.body_type) queryFilters.body_type = context.query.body_type;
    if (context.query.tags) queryFilters.tags = context.query.tags;
    
    // Include the type as a subcategory filter
    const appliedFilters = { ...queryFilters, subcategory: type };

    // Fetch initial models
    const result = await apiService.fetchModels('trans', appliedFilters, {
      limit: 24,
      offset: 0
    });
    
    // TODO: Fetch dynamic filter options for 'trans' category
    // For now, using static filters similar to the 'girls' page
    const filterOptions = [
      {
        type: 'ethnicity',
        name: 'Ethnicity',
        options: [
          { value: 'asian', label: 'Asian' },
          { value: 'latina', label: 'Latina' },
          { value: 'white', label: 'White' },
          { value: 'ebony', label: 'Ebony' }
        ]
      },
      {
        type: 'hair_color',
        name: 'Hair Color',
        options: [
          { value: 'blonde', label: 'Blonde' },
          { value: 'brunette', label: 'Brunette' },
          { value: 'red', label: 'Red' },
          { value: 'black', label: 'Black' }
        ]
      },
      {
        type: 'body_type',
        name: 'Body Type',
        options: [
          { value: 'slim', label: 'Slim' },
          { value: 'athletic', label: 'Athletic' },
          { value: 'curvy', label: 'Curvy' },
          { value: 'muscular', label: 'Muscular' }
        ]
      },
      {
        type: 'tags',
        name: 'Tags',
        options: [
          { value: 'milf', label: 'MILF' },
          { value: 'petite', label: 'Petite' },
          { value: 'tattoos', label: 'Tattoos' },
          { value: 'piercing', label: 'Piercing' }
        ]
      }
    ];
    
    return {
      props: {
        initialData: result.success ? result.data : { items: [], pagination: {} },
        filters: filterOptions,
      }
    };
  } catch (error) {
    console.error(`[TransPage Type: ${type}] getServerSideProps error:`, error);
    return {
      props: {
        initialData: { items: [], pagination: {} },
        filters: [],
      }
    };
  }
}

export default TransTypePage;
