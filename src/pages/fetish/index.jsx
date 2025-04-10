import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UnifiedLayout from '@/theme/layouts/UnifiedLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import FilterBar from '@/theme/components/filters/FilterBar';
import apiService from '@/services/apiService';

/**
 * Fetish Page - Displays fetish models with filtering options
 */
const FetishPage = ({ initialData, filters }) => {
  const router = useRouter();
  const [models, setModels] = useState(initialData?.items || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Extract filter values from URL query
  const filterValues = {
    willingness: router.query.willingness || '',
    tags: router.query.tags || ''
  };
  
  // Define static content for the Fetish page (can be moved to a content file later)
  const title = "Fetish Cam Models";
  const description = "Explore our fetish cam models. Experience BDSM, domination, and other fetish content with our beautiful models.";
  const meta = {
    title: "Fetish Cam Models - Live BDSM & Kink Shows | MistressWorld",
    description: "Watch live fetish cam models perform BDSM, roleplay, and other kinky shows. Find your perfect fetish model online.",
  };
  
  // Fetch models when filters change
  useEffect(() => {
    const fetchFilteredModels = async () => {
      setIsLoading(true);
      
      try {
        // Collect all applied filters
        const appliedFilters = { ...filterValues };
        
        // Remove empty filters
        Object.keys(appliedFilters).forEach(key => {
          if (!appliedFilters[key]) {
            delete appliedFilters[key];
          }
        });
        
        // Fetch models with filters
        const result = await apiService.fetchModels('fetish', appliedFilters, {
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
  }, [router.query]); // Depend on query
  
  // Handle loading more models
  const handleLoadMore = async () => {
    if (isLoading || !pagination.hasMore) return;
    
    setIsLoading(true);
    
    try {
      // Collect all applied filters
      const appliedFilters = { ...filterValues };
        
      Object.keys(appliedFilters).forEach(key => {
        if (!appliedFilters[key]) {
          delete appliedFilters[key];
        }
      });
      
      // Fetch more models
      const result = await apiService.fetchModels('fetish', appliedFilters, {
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
    
    router.push({
      pathname: router.pathname,
      query: newQuery
    }, undefined, { shallow: true });
  };
  
  // TODO: Add bottom content JSX if needed
  const bottomContentJSX = null;
  
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
          isLoading={isLoading && models.length === 0}
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
  try {
    // Collect filters from query params
    const queryFilters = {};
    if (context.query.willingness) queryFilters.willingness = context.query.willingness;
    if (context.query.tags) queryFilters.tags = context.query.tags;
    
    // Fetch initial models
    const result = await apiService.fetchModels('fetish', queryFilters, {
      limit: 24,
      offset: 0
    });
    
    // Fetch filter options for 'fetish' category
    const filterOptions = [
      {
        type: 'willingness',
        name: 'Willingness',
        options: [
          { value: 'fetish', label: 'Fetish' },
          { value: 'bdsm', label: 'BDSM' },
          { value: 'roleplay', label: 'Roleplay' },
          { value: 'dildo', label: 'Dildo' },
          { value: 'anal', label: 'Anal' }
        ]
      },
      {
        type: 'tags',
        name: 'Tags',
        options: [
          { value: 'bdsm', label: 'BDSM' },
          { value: 'lingerie', label: 'Lingerie' },
          { value: 'tattoos', label: 'Tattoos' },
          { value: 'piercing', label: 'Piercing' },
          { value: 'smoking', label: 'Smoking' },
          { value: 'toys', label: 'Toys' },
          { value: 'roleplay', label: 'Roleplay' }
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
    console.error(`[FetishPage] getServerSideProps error:`, error);
    return {
      props: {
        initialData: { items: [], pagination: {} },
        filters: [],
      }
    };
  }
}

export default FetishPage; 