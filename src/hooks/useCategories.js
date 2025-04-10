import useSWR from 'swr';
import { useMemo } from 'react';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

/**
 * Hook to fetch and use categories data for navigation and filters
 * @returns {Object} Categories data and loading states
 */
export default function useCategories() {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false, // Disable revalidation on window focus
    shouldRetryOnError: false, // Optional: Disable retries on error
    dedupingInterval: 60000, // Cache for 1 minute
  });

  // Memoize the processing of category data
  const categoriesWithFilterUrls = useMemo(() => {
    // Log the raw data structure received from SWR
    console.log('[useCategories] Raw SWR data:', data);
    
    const categoriesData = data?.data?.categories;
    console.log('[useCategories] Extracted categories array:', categoriesData);

    if (!categoriesData) {
      console.log('[useCategories] No categories array found in data.');
      return []; // Return empty array if no categories
    }

    console.log('[useCategories] Processing data:', categoriesData.length, 'categories');
    
    return categoriesData.map(category => {
      // Log each category being processed
      console.log(`[useCategories] Processing category: ${category.slug}`, category);

      if (category.filters && category.filters.length > 0) {
        console.log(`[useCategories] Category ${category.slug} has filters:`, category.filters);
        const filtersWithUrls = category.filters.map(filter => {
          // Make sure filter has options
          if (!filter.options || !Array.isArray(filter.options)) {
            console.log(`[useCategories] Filter ${filter.type} has no options array`);
            return filter;
          }

          const optionsWithUrls = filter.options.map(option => {
            // Generate query param URLs instead of path-based URLs
            return {
              name: option,
              // Convert from slugs like "18-22" to readable names like "18-22 years"
              displayName: option.replace(/-/g, ' ').replace(/_/g, ' '),
              url: `/${category.slug}?${filter.type}=${option}`
            };
          });
          
          return {
            ...filter,
            optionsWithUrls
          };
        });
        
        return {
          ...category,
          filters: filtersWithUrls
        };
      } else {
        // Log if a category doesn't have filters
        console.log(`[useCategories] Category ${category.slug} has no filters defined.`);
      }
      
      return category;
    });
  }, [data]); // Dependency array includes data

  return {
    categories: categoriesWithFilterUrls || [],
    isLoading,
    isError: error,
    error // Expose the error object for more detailed handling if needed
  };
} 