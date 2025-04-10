import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UnifiedLayout from '@/theme/layouts/UnifiedLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import FilterBar from '@/theme/components/filters/FilterBar';
import apiService from '@/services/apiService';

/**
 * Girls Page - Displays all female models with filtering options
 */
const GirlsPage = ({ initialData, filters }) => {
  const router = useRouter();
  const [models, setModels] = useState(initialData?.items || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Extract filter values from URL query
  const filterValues = {
    ethnicity: router.query.ethnicity || '',
    hair_color: router.query.hair_color || '',
    body_type: router.query.body_type || '',
    tags: router.query.tags || ''
  };
  
  // Fetch models when filters change
  useEffect(() => {
    const fetchFilteredModels = async () => {
      setIsLoading(true);
      
      try {
        // Collect all applied filters
        const appliedFilters = {};
        
        // Add each filter that has a value
        Object.entries(filterValues).forEach(([key, value]) => {
          if (value) {
            appliedFilters[key] = value;
          }
        });
        
        // Fetch models with filters
        const result = await apiService.fetchModels('girls', appliedFilters, {
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
  }, [router.query]);
  
  // Handle loading more models
  const handleLoadMore = async () => {
    if (isLoading || !pagination.hasMore) return;
    
    setIsLoading(true);
    
    try {
      // Collect all applied filters
      const appliedFilters = {};
      
      // Add each filter that has a value
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) {
          appliedFilters[key] = value;
        }
      });
      
      // Fetch more models
      const result = await apiService.fetchModels('girls', appliedFilters, {
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
  
  return (
    <UnifiedLayout
      title="Live Cam Girls"
      description="Explore our collection of beautiful cam models ready for private chat experiences."
      meta={{
        title: "Live Cam Girls - Watch Beautiful Models Online | MistressWorld",
        description: "Discover stunning live cam girls online now. Enjoy private chat shows with the hottest models from around the world."
      }}
    >
      {/* Filters */}
      <FilterBar 
        filters={filters}
        activeFilters={filterValues}
        onFilterChange={handleFilterChange}
      />
      
      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-pink-600 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Cam Girls</h2>
          <p className="text-sm">Explore our collection of stunning cam girls ready for private chat.</p>
        </div>
        <div className="bg-purple-600 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Trans Models</h2>
          <p className="text-sm">Discover our beautiful trans models available for private sessions.</p>
        </div>
      </div>
      
      {/* Models Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Featured Girls
          </h2>
          <a href="/girls" className="text-sm text-pink-500 hover:underline">
            View All Girls
          </a>
        </div>
        
        <ModelGrid 
          models={models} 
          isLoading={isLoading}
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
    const filters = {};
    
    // Add filters if they exist in the query
    if (context.query.ethnicity) filters.ethnicity = context.query.ethnicity;
    if (context.query.hair_color) filters.hair_color = context.query.hair_color;
    if (context.query.body_type) filters.body_type = context.query.body_type;
    if (context.query.tags) filters.tags = context.query.tags;
    
    // Fetch initial models
    const result = await apiService.fetchModels('girls', filters, {
      limit: 24,
      offset: 0
    });
    
    // Get filter options for this category
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
          { value: 'bbw', label: 'BBW' }
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
        filters: filterOptions
      }
    };
  } catch (error) {
    console.error('[GirlsPage] getServerSideProps error:', error);
    return {
      props: {
        initialData: { items: [], pagination: {} },
        filters: []
      }
    };
  }
}

export default GirlsPage; 