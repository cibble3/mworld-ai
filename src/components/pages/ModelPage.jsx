import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import { capitalizeString } from '@/utils/string-helpers';
import FilterDisplay from '@/components/filters/FilterDisplay';

/**
 * ModelPage - Reusable component for displaying model pages (girls, trans, etc.)
 * 
 * @param {Object} props
 * @param {string} props.category - The category of models to display ('girls', 'trans', etc.)
 * @param {Object} props.defaultContent - Default content for the page when no filters are applied
 * @param {Object} props.contentMap - Map of content based on filters (e.g., by ethnicity)
 * @param {Array} props.additionalParams - Additional parameters to support for this category
 * @param {string} props.pageRoute - The base route for this page (e.g., '/girls', '/trans')
 * @param {Function} props.apiFetcher - Optional custom function to fetch models from a different API
 * @param {string} props.apiEndpoint - Optional custom API endpoint (defaults to '/api/models')
 * @param {Object} props.defaultApiParams - Optional default parameters to include in all API requests
 * @param {React.ReactNode} props.topComponent - Optional component to render above the model grid
 */
const ModelPage = ({
  category,
  defaultContent,
  contentMap = {},
  additionalParams = [],
  pageRoute,
  apiFetcher,
  apiEndpoint = '/api/models',
  defaultApiParams = { provider: 'awe', limit: 24 },
  topComponent
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ hasMore: false });
  
  // Extract common filter parameters
  const ethnicity = searchParams.get('ethnicity');
  const hairColor = searchParams.get('hair_color');
  const tags = searchParams.get('tags');
  const willingness = searchParams.get('willingness');
  
  // Extract additional parameters if they're supported
  const additionalFilterValues = {};
  additionalParams.forEach(param => {
    additionalFilterValues[param] = searchParams.get(param);
  });
  
  // Helper function to process filter values
  const processFilterValue = (value) => {
    // If the value contains commas, it's a multi-value filter
    if (value && value.includes(',')) {
      return value.split(',');
    }
    return value;
  };
  
  // Prepare content based on ethnicity filter (if present)
  const content = ethnicity && contentMap[ethnicity] 
    ? contentMap[ethnicity] 
    : defaultContent;
  
  // Extract content fields
  const { 
    title = defaultContent.title, 
    desc = defaultContent.desc, 
    meta_title = defaultContent.meta_title, 
    meta_desc = defaultContent.meta_desc, 
    meta_keywords = defaultContent.meta_keywords,
    about = defaultContent.about || [] 
  } = content;
  
  // Prepare metadata for SEO
  const pageContent = {
    meta_title,
    meta_desc,
    meta_keywords,
    top_text: desc
  };
  
  // Prepare the bottom content from the about sections (if present)
  const hasAboutContent = about && about.length > 0;

  // Default API fetcher that calls the standard models API
  const defaultFetcher = async (params) => {
    try {
      console.log(`[${category}Page] Fetching models...`);
      
      const response = await axios.get(apiEndpoint, { params });

      console.log(`[${category}Page] API response:`,
        response.data?.success ?
          `Success - ${response.data.data?.models?.length || 0} models` :
          `Failed - ${response.data.error || 'Unknown error'}`
      );

      if (response.data?.success) {
        const data = response.data.data;
        let modelItems = [];
        
        if (data?.models && Array.isArray(data.models)) {
          modelItems = data.models;
        } else if (data?.items && Array.isArray(data.items)) {
          modelItems = data.items;
        } else if (Array.isArray(data)) {
          modelItems = data;
        } else {
          console.warn(`[${category}Page] Unexpected API response structure`);
        }

        return {
          success: true,
          data: {
            models: modelItems,
            pagination: data.pagination || {}
          }
        };
      } else {
        return {
          success: false,
          error: response.data?.error || 'Failed to fetch models'
        };
      }
    } catch (err) {
      console.error(`[${category}Page] Error:`, err);
      return {
        success: false,
        error: err.message || 'Failed to fetch models'
      };
    }
  };

  // Function to fetch models
  const fetchModels = async () => {
    try {
      setLoading(true);

      // Build API parameters
      const apiParams = {
        ...defaultApiParams,
        category,
        debug: true,
        ...(ethnicity && { ethnicity: processFilterValue(ethnicity) }),
        ...(hairColor && { hair_color: processFilterValue(hairColor) }),
        ...(tags && { tags: processFilterValue(tags) }),
        ...(willingness && { willingness: processFilterValue(willingness) }),
      };
      
      // Add any additional filter parameters
      Object.entries(additionalFilterValues).forEach(([key, value]) => {
        if (value !== null) {
          apiParams[key] = processFilterValue(value);
        }
      });

      // Use custom fetcher if provided, otherwise use default
      const fetcher = apiFetcher || defaultFetcher;
      const result = await fetcher(apiParams);

      if (result.success) {
        if (result.data.models.length > 0) {
          console.log(`[${category}Page] First model:`, JSON.stringify(result.data.models[0]).substring(0, 100));
        } else {
          console.warn(`[${category}Page] No models found in API response`);
        }

        setModels(result.data.models);
        setPagination(result.data.pagination || {});
      } else {
        // Handle error from API
        console.error(`[${category}Page] API error:`, result.error);
        setError(result.error || 'Failed to fetch models');

        // In development, use fallback models
        if (process.env.NODE_ENV === 'development') {
          const fallbackModels = Array.from({ length: 8 }, (_, i) => ({
            id: `fallback-${i}`,
            performerId: `fallback-${i}`,
            name: `${capitalizeString(category)} Model ${i + 1}`,
            age: 25 + (i % 10),
            ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
            tags: [category === 'trans' ? 'trans' : 'female', 'beautiful'],
            thumbnail: `https://picsum.photos/id/${200 + i}/300/400`,
            isOnline: true,
            viewerCount: Math.floor(Math.random() * 100)
          }));
          setModels(fallbackModels);
          console.log(`[${category}Page] Using fallback models for development`);
        }
      }
    } catch (err) {
      console.error(`[${category}Page] Error:`, err);
      setError(err.message || 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  // Load more models if pagination is supported
  const loadMore = async () => {
    if (loading || !pagination.hasMore) return;
    
    try {
      setLoading(true);
      
      // Calculate next offset
      const nextOffset = pagination.offset + pagination.limit;
      
      // Build API parameters for next page
      const apiParams = {
        ...defaultApiParams,
        category,
        offset: nextOffset,
        debug: true,
        ...(ethnicity && { ethnicity: processFilterValue(ethnicity) }),
        ...(hairColor && { hair_color: processFilterValue(hairColor) }),
        ...(tags && { tags: processFilterValue(tags) }),
        ...(willingness && { willingness: processFilterValue(willingness) }),
      };
      
      // Add any additional filter parameters
      Object.entries(additionalFilterValues).forEach(([key, value]) => {
        if (value !== null) {
          apiParams[key] = processFilterValue(value);
        }
      });
      
      // Use custom fetcher if provided, otherwise use default
      const fetcher = apiFetcher || defaultFetcher;
      const result = await fetcher(apiParams);
      
      if (result.success) {
        // Append new models to existing ones
        setModels(currentModels => [...currentModels, ...result.data.models]);
        setPagination(result.data.pagination || {});
      } else {
        console.error(`[${category}Page] Load more error:`, result.error);
        setError(result.error || 'Failed to load more models');
      }
    } catch (err) {
      console.error(`[${category}Page] Load more error:`, err);
      setError(err.message || 'Failed to load more models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [searchParams, category, ethnicity, hairColor, tags, willingness, additionalFilterValues]);

  // Get active filters for display
  // Process each filter parameter to handle comma-separated values
  const activeFilters = [];
  
  // Helper function to add filters to the activeFilters array
  const addFilters = (type, value) => {
    if (!value) return;
    
    // If the value contains commas, split it into multiple filters
    if (value.includes(',')) {
      value.split(',').forEach(val => {
        activeFilters.push({ type, value: val.trim() });
      });
    } else {
      activeFilters.push({ type, value });
    }
  };
  
  // Add common filters
  addFilters('ethnicity', ethnicity);
  addFilters('hair_color', hairColor);
  addFilters('tags', tags);
  addFilters('willingness', willingness);
  
  // Add additional filters
  Object.entries(additionalFilterValues).forEach(([key, value]) => {
    if (value) {
      addFilters(key, value);
    }
  });

  // Function to handle removing a filter
  const handleRemoveFilter = (type, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValue = params.get(type);
    
    // If the current value is this exact value, delete the parameter entirely
    if (currentValue === value) {
      params.delete(type);
    } 
    // If multiple values (comma-separated), remove just this one value
    else if (currentValue && currentValue.includes(',')) {
      const values = currentValue.split(',').map(v => v.trim());
      const newValues = values.filter(v => v !== value);
      
      if (newValues.length === 0) {
        params.delete(type);
      } else {
        params.set(type, newValues.join(','));
      }
    }
    
    const url = `${pageRoute}?${params.toString()}`;
    router.push(url);
  };

  return (
    <>
      <HeadMeta pageContent={pageContent} />
      
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      
      {desc && (
        <p className="text-gray-400 mb-4">
          {desc}
        </p>
      )}

      {/* Render the optional top component if provided */}
      {topComponent && topComponent}

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <FilterDisplay 
          filters={activeFilters} 
          onRemove={handleRemoveFilter}
          onClearAll={() => router.push(pageRoute)}
        />
      )}

      {loading && models.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse text-xl">Loading models...</div>
        </div>
      ) : error && models.length === 0 ? (
        <div className="text-center text-red-500 py-10">
          Error loading models: {error}
        </div>
      ) : models.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No models found matching your criteria.
        </div>
      ) : (
        <>
          <p className="text-gray-400 my-4">
            Showing {models.length} {category === 'trans' ? 'trans' : ''} models on Mistress World. 
            Explore our {category === 'trans' ? 'selection of beautiful trans cam models' : 'collection of beautiful cam models'} ready to engage in private chat sessions.
          </p>

          <ModelGrid models={models} isLoading={false}>
            {(model) => (
              <ModelCard
                key={model.id || model.slug}
                performerId={model.id || model.slug}
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
          
          {/* Load more button if pagination is supported */}
          {pagination.hasMore && (
            <div className="text-center mt-8 mb-4">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="bg-[#E0006C] hover:bg-pink-700 text-white py-2 px-6 rounded-full transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Bottom About Content */}
      {hasAboutContent && (
        <div className="mt-10 grid md:grid-cols-1 gap-8">
          {about.map((section, i) => (
            <div key={i} className="bg-[#1a1c21] rounded-lg p-6">
              {section.heading && (
                <h2 className="text-xl font-semibold mb-4 text-pink-500">
                  {section.heading}
                </h2>
              )}
              {section.desc1 && section.desc1.map((paragraph, j) => (
                <p key={j} className="text-gray-400 mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ModelPage; 