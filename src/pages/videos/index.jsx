import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UnifiedLayout from '@/theme/layouts/UnifiedLayout';
import VideoGrid from '@/theme/components/grid/VideoGrid';
import VideoCard from '@/theme/components/common/VideoCard';
import FilterBar from '@/theme/components/filters/FilterBar';
import apiService from '@/services/apiService';

/**
 * Videos Page - Displays videos with filtering options
 */
const VideosPage = ({ initialData, filters }) => {
  const router = useRouter();
  const [videos, setVideos] = useState(initialData?.items || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Extract filter values from URL query
  const filterValues = {
    category: router.query.category || '',
    tags: router.query.tags || ''
  };
  
  // Define static content for the Videos page
  const title = "Webcam Videos";
  const description = "Watch recorded webcam videos from the hottest cam models. Enjoy the best webcam performances anytime.";
  const meta = {
    title: "Webcam Videos - Watch Recorded Shows | MistressWorld",
    description: "Browse and watch recorded webcam videos from top cam models. Find your favorite performances and enjoy them anytime.",
  };
  
  // Fetch videos when filters change
  useEffect(() => {
    const fetchFilteredVideos = async () => {
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
        
        // Fetch videos with filters
        const result = await apiService.fetchVideos(appliedFilters, {
          limit: 24,
          offset: 0
        });
        
        if (result.success) {
          setVideos(result.data.items);
          setPagination(result.data.pagination);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch videos');
          setVideos([]);
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilteredVideos();
  }, [router.query]); // Depend on query
  
  // Handle loading more videos
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
      
      // Fetch more videos
      const result = await apiService.fetchVideos(appliedFilters, {
        limit: 24,
        offset: pagination.offset + pagination.limit
      });
      
      if (result.success) {
        setVideos(prevVideos => [...prevVideos, ...result.data.items]);
        setPagination(result.data.pagination);
        setError(null);
      } else {
        setError(result.error || 'Failed to load more videos');
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
  
  // Prepare bottom content
  const bottomContentJSX = (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-[#1a1c21] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-pink-500">
          Discover Premium Video Content
        </h2>
        <p className="text-gray-400 mb-3">
          Our video library features an extensive collection of high-quality adult content across numerous categories. Whether you're looking for amateur videos, professional productions, or niche content, you'll find it in our carefully curated selection.
        </p>
      </div>
      <div className="bg-[#1a1c21] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-pink-500">
          New Videos Added Daily
        </h2>
        <p className="text-gray-400 mb-3">
          We're constantly updating our video collection with fresh content. Check back regularly to discover new videos from your favorite performers and exciting new talent in the adult entertainment industry.
        </p>
      </div>
    </div>
  );
  
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
      
      {/* Videos Grid */}
      <div className="mb-8">
        <VideoGrid 
          videos={videos} 
          isLoading={isLoading && videos.length === 0}
          error={error}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {(video, index) => (
            <VideoCard 
              key={`video-${video.id || index}`}
              image={video.thumbnail}
              title={video.title}
              duration={video.duration}
              views={video.views}
              category={video.category || 'general'}
              videoId={video.id}
              preload={index < 8} // Preload first few images
            />
          )}
        </VideoGrid>
        
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
    if (context.query.category) queryFilters.category = context.query.category;
    if (context.query.tags) queryFilters.tags = context.query.tags;
    
    // Fetch initial videos
    const result = await apiService.fetchVideos(queryFilters, {
      limit: 24,
      offset: 0
    });
    
    // Fetch filter options for 'videos' category
    const filterOptions = [
      {
        type: 'category',
        name: 'Category',
        options: [
          { value: 'popular', label: 'Popular' },
          { value: 'new', label: 'New' },
          { value: 'amateur', label: 'Amateur' },
          { value: 'solo', label: 'Solo' },
          { value: 'lesbian', label: 'Lesbian' },
          { value: 'trans', label: 'Trans' },
          { value: 'fetish', label: 'Fetish' },
        ]
      },
      {
        type: 'tags',
        name: 'Tags',
        options: [
          { value: 'hd', label: 'HD' },
          { value: 'featured', label: 'Featured' },
          { value: 'trending', label: 'Trending' },
          { value: 'amateur', label: 'Amateur' },
          { value: 'toys', label: 'Toys' },
          { value: 'lingerie', label: 'Lingerie' },
          { value: 'bdsm', label: 'BDSM' }
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
    console.error(`[VideosPage] getServerSideProps error:`, error);
    return {
      props: {
        initialData: { items: [], pagination: {} },
        filters: [],
      }
    };
  }
}

export default VideosPage; 