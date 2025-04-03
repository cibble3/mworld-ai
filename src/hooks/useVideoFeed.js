import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useVideoFeed = (initialOptions = {}) => {
  const { 
    category, 
    subcategory, 
    limit = 24, 
    initialOffset = 0,
    initialVideos = [],
    filters = {}, // Additional key-value filters
  } = initialOptions;

  const [videos, setVideos] = useState(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialVideos.length >= limit); 

  // Debounce mechanism to prevent rapid firing of fetches
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const fetchData = useCallback(async (currentOffset, isLoadMore = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        category,
        subcategory,
        limit,
        offset: currentOffset,
        ...filters, // Spread additional filters
      };

      // Remove undefined/null params
      Object.keys(params).forEach(key => params[key] == null && delete params[key]);
      
      // For now, simulate video data since there isn't a real endpoint yet
      // In a real implementation, this would be an API call:
      // const response = await axios.get('/api/videos', { params });
      
      // Simulated API response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockVideos = Array.from({ length: limit }, (_, i) => ({
        id: `video-${currentOffset + i}`,
        title: `Sample Video ${currentOffset + i + 1}`,
        category: category || 'general',
        subcategory: subcategory,
        duration: Math.floor(Math.random() * 600) + 60, // 1-10 minutes
        views: Math.floor(Math.random() * 50000),
        thumbnail: `https://picsum.photos/id/${(currentOffset + i) % 100}/640/360`,
        description: 'This is a sample video description.',
        publishDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      }));
      
      const newVideos = mockVideos;
      
      // In a real implementation with an API:
      // const newVideos = response.data.videos || [];
      // const total = response.data.pagination?.total || 0;

      setVideos(prevVideos => 
        isLoadMore ? [...prevVideos, ...newVideos] : newVideos
      );
      setOffset(currentOffset + newVideos.length);
      
      // Simulate having more videos to load
      setHasMore(currentOffset + newVideos.length < 100);

    } catch (err) {
      console.error("Error fetching video feed:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch videos');
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setIsLoading(false);
    }
  }, [category, subcategory, limit, JSON.stringify(filters)]); // Include filters in dependency array

  // Effect for initial fetch and when parameters change
  useEffect(() => {
    // Debounce the fetch call
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutId = setTimeout(() => {
      // Reset state before fetching new category/subcategory
      setVideos([]);
      setOffset(0);
      setHasMore(true); // Assume more initially
      fetchData(0); 
    }, 300); // 300ms debounce

    setDebounceTimeout(timeoutId);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchData]); // Dependency array only includes fetchData callback

  // Function to load more videos
  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchData(offset, true);
    }
  };

  return { 
    videos, 
    isLoading, 
    error, 
    hasMore, 
    loadMore 
  };
};

export default useVideoFeed; 