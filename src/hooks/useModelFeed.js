import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { ApiProviders } from '@/services/api';

// Define API URLs locally if not accessible from main API export
const API_URLS = {
  awe: '/api/models',
  free: '/api/models',
  vpapi: '/api/videos'
};

/**
 * Custom hook for fetching and managing model feeds from different providers
 * 
 * @param {Object} options - Configuration options
 * @param {string|Array} options.provider - Data provider(s) (AWE, FREE, VPAPI) or 'all' for all providers
 * @param {string} options.category - Main category (girls, trans)
 * @param {string} options.subcategory - Subcategory filter
 * @param {number} options.limit - Results per page
 * @param {number} options.initialOffset - Starting offset
 * @param {Array} options.initialModels - Pre-loaded models
 * @param {Object} options.filters - Additional filtering options
 * @returns {Object} - Models data and control functions
 */
const useModelFeed = (options = {}) => {
  const { 
    provider = ApiProviders.AWE,
    category, 
    subcategory, 
    limit = 24, 
    initialOffset = 0,
    initialModels = [],
    filters = {}, // Additional filtering options
  } = options;

  const [models, setModels] = useState(initialModels);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialModels.length >= limit); 
  const [isMounted, setIsMounted] = useState(false);
  const [providerData, setProviderData] = useState({});
  const [requestInProgress, setRequestInProgress] = useState(false);
  // Add a ref to track if initial fetch was already completed
  const initialFetchDone = useRef(false);

  // Determine which providers to request from
  const getProviders = useCallback(() => {
    console.log(`[useModelFeed] getProviders called. Initial provider prop:`, provider);
    if (provider === 'all') {
      return [ApiProviders.AWE, ApiProviders.FREE];
    }
    const providersToUse = Array.isArray(provider) ? provider : [provider];
    console.log(`[useModelFeed] Providers to fetch:`, providersToUse);
    return providersToUse;
  }, [provider]);

  // Use different endpoints based on provider using centralized API_URLS
  const getApiEndpoint = useCallback((providerKey) => {
    // Use the centralized API_URLS mapping
    const endpoint = API_URLS[providerKey] || API_URLS[ApiProviders.AWE];
    console.log(`[useModelFeed] Using API endpoint: ${endpoint} for provider: ${providerKey}`);
    return endpoint;
  }, []);

  // Reset feed when key parameters change - but be more careful about re-fetching
  useEffect(() => {
    // Skip first mount to prevent double-fetching with the initial data fetch
    if (isMounted) {
      console.log(`[useModelFeed] Key params changed, resetting feed`);
      setModels([]);
      setOffset(0);
      setHasMore(true);
      setError(null);
      setProviderData({});
      fetchData(0, false);
    } else {
      setIsMounted(true);
    }
    // Convert filters to string once outside to avoid creating new string refs on each render
  }, [category, subcategory, JSON.stringify(filters)]);
  // Removed 'provider' from dependencies to prevent re-fetching when it's just a different reference

  // Fetch data from all configured providers
  const fetchData = useCallback(async (currentOffset, isLoadMore = false) => {
    // Prevent duplicate requests
    if (requestInProgress) return;
    
    setRequestInProgress(true);
    setIsLoading(true);
    setError(null);
    
    // Log provider before determining providers to fetch
    console.log(`[useModelFeed] fetchData called with original provider:`, provider);
    console.log(`[useModelFeed] fetchData parameters: category=${category}, subcategory=${subcategory}, offset=${currentOffset}, isLoadMore=${isLoadMore}`);
    
    const providersToFetch = getProviders();
    console.log(`[useModelFeed] providersToFetch resolved to:`, providersToFetch);
    
    // Calculate per-provider limit to maintain total limit
    const providerLimit = Math.ceil(limit / providersToFetch.length);
    
    try {
      // Create an array of promises for all provider requests
      const requests = providersToFetch.map(async (providerKey) => {
        console.log(`[useModelFeed] Making request for providerKey: ${providerKey}`); 
        
        const params = {
          provider: providerKey, // This is crucial - provider must be passed as a parameter
          category,
          subcategory,
          limit: providerLimit,
          offset: currentOffset,
          ...filters
        };

        // Remove undefined/null params
        Object.keys(params).forEach(key => params[key] == null && delete params[key]);
        
        const endpoint = getApiEndpoint(providerKey);
        console.log(`[useModelFeed] Fetching from ${endpoint} with params:`, JSON.stringify(params));
        
        try {
          const startTime = Date.now();
          const response = await axios.get(endpoint, { params });
          const requestTime = Date.now() - startTime;
          
          console.log(`[useModelFeed] Response received from ${endpoint} in ${requestTime}ms:`, 
            JSON.stringify(response.data?.success ? 
              { success: response.data.success, itemCount: response.data.data?.items?.length || 0 } : 
              { success: false, error: response.data.error }));
          
          // Handle successful response
          if (response && response.data && response.data.success) {
            // Extract models - handle different API response structures
            let items = [];
            let pagination = {};
            
            // Check different possible API response structures
            if (providerKey === ApiProviders.VPAPI) {
              // VPAPI has a specific structure for videos
              items = response.data.data.videos || [];
              pagination = response.data.data.pagination || { total: items.length };
            } else if (providerKey === ApiProviders.AWE) {
              // Try all possible AWE API response structures
              if (response.data.data?.models && Array.isArray(response.data.data.models)) {
                // New nested structure
                items = response.data.data.models;
                pagination = response.data.data.pagination || { total: items.length };
              } else if (response.data.results && Array.isArray(response.data.results)) {
                // Old top-level structure
                items = response.data.results;
                pagination = { total: response.data.count || items.length };
              } else if (Array.isArray(response.data.data?.items)) {
                // Generic items array
                items = response.data.data.items;
                pagination = response.data.data.pagination || { total: items.length };
              } else if (Array.isArray(response.data.data)) {
                // Direct array in data property
                items = response.data.data;
                pagination = { total: items.length };
              } else if (Array.isArray(response.data)) {
                // Direct top-level array
                items = response.data;
                pagination = { total: items.length };
              } else {
                // Last resort - look for any array property
                console.warn(`[useModelFeed] Unexpected AWE response structure - scanning for arrays`);
                const dataToScan = response.data.data || response.data;
                for (const key in dataToScan) {
                  if (Array.isArray(dataToScan[key])) {
                    items = dataToScan[key];
                    console.log(`[useModelFeed] Found potential items array in property: ${key}`);
                    break;
                  }
                }
                pagination = { total: items.length };
              }
            } else {
              // Generic handling for other providers
              if (Array.isArray(response.data.data?.items)) {
                items = response.data.data.items;
              } else if (Array.isArray(response.data.data?.models)) {
                items = response.data.data.models;
              } else if (Array.isArray(response.data.data)) {
                items = response.data.data;
              } else if (Array.isArray(response.data.results)) {
                items = response.data.results;
              } else if (Array.isArray(response.data)) {
                items = response.data;
              } else {
                console.warn(`[useModelFeed] Unexpected data structure from ${providerKey} API`);
                console.warn(`[useModelFeed] Available keys:`, Object.keys(response.data.data || {}));
                items = [];
              }
              pagination = response.data.data?.pagination || { total: items.length };
            }
            
            console.log(`[useModelFeed] Extracted ${items.length} items from ${providerKey} API response`);
            
            // Add provider info to each item if not already present
            items = items.map(item => ({
              ...item,
              _provider: item._provider || providerKey
            }));
            
            return {
              providerKey,
              items,
              pagination,
              error: null
            };
          } else {
            throw new Error(response?.data?.error || 'Failed to fetch data');
          }
        } catch (err) {
          console.error(`Error fetching from ${providerKey}:`, err.message);
          console.error(err.code ? `Error code: ${err.code}` : 'No error code available');
          console.error(err.response ? `Error response: ${JSON.stringify(err.response.data)}` : 'No response data available');
          
          // Return empty results for this provider but don't fail the whole request
          return {
            providerKey,
            items: [],
            pagination: { total: 0 },
            error: err.message
          };
        }
      });

      // Wait for all requests to complete
      const results = await Promise.all(requests);
      
      // Merge results from all providers
      let allItems = [];
      let totalHasMore = false;
      
      // Update provider-specific data
      const newProviderData = { ...providerData };
      
      results.forEach(result => {
        const { providerKey, items, pagination, error } = result;
        
        // +++ Log raw items received +++
        if (providerKey === 'awe') {
            console.log(`[useModelFeed] Raw items received for ${providerKey}:`, items);
        }
        // ++++++++++++++++++++++++++++++

        console.log(`[useModelFeed] Processing result for provider: ${providerKey}`, { itemCount: items.length, error });

        // Add provider info to each item
        const itemsWithProvider = items.map(item => ({
          ...item,
          _provider: providerKey
        }));
        
        allItems = [...allItems, ...itemsWithProvider];
        totalHasMore = totalHasMore || pagination.hasMore;
        
        // Ensure providerData is updated even if items are empty
        newProviderData[providerKey] = {
          items,
          pagination,
          error
        };
        console.log(`[useModelFeed] Updated newProviderData[${providerKey}]:`, newProviderData[providerKey]);
      });
      
      // Sort combined results (could implement different sorting strategies)
      // Only shuffle if specified and this isn't a "load more" request
      const sortParam = filters.sort || 'default';
      const sortedItems = sortParam === 'random' && !isLoadMore
        ? shuffleArray(allItems)
        : allItems;
      
      // Limit to the total requested items
      const finalItems = sortedItems.slice(0, limit);
      
      // --- Log state update values ---
      console.log(`[useModelFeed] PRE-STATE UPDATE: isLoadMore=${isLoadMore}`);
      console.log(`[useModelFeed] PRE-STATE UPDATE: finalItems count = ${finalItems.length}`);
      console.log(`[useModelFeed] PRE-STATE UPDATE: newProviderData =`, JSON.stringify(newProviderData));
      console.log(`[useModelFeed] PRE-STATE UPDATE: calculated offset = ${currentOffset + finalItems.length}`);
      console.log(`[useModelFeed] PRE-STATE UPDATE: calculated hasMore = ${totalHasMore && finalItems.length >= limit}`);
      // --- End Log ---

      // Update state
      setProviderData(newProviderData);
      setModels(prevModels => isLoadMore ? [...prevModels, ...finalItems] : finalItems);
      setOffset(currentOffset + finalItems.length);
      setHasMore(totalHasMore && finalItems.length >= limit);

      // For development, provide fallback models
      if (process.env.NODE_ENV === 'development') {
        const fallbackModels = Array.from({ length: 8 }, (_, i) => ({
          id: `fallback-${i}`,
          slug: `fallback-${i}`,
          performerName: `Model ${i+1}`,
          name: `Model ${i+1}`,
          thumbnail: `https://via.placeholder.com/300x200?text=Model+${i+1}`,
          snapshotUrl: `https://via.placeholder.com/300x200?text=Model+${i+1}`,
          isOnline: Math.random() > 0.5,
          age: Math.floor(20 + Math.random() * 20),
          viewers: Math.floor(Math.random() * 1000),
          tags: ['fallback', 'test', 'development'],
          attributes: ['fallback', 'test', 'development'],
          country: 'Test Country',
          _provider: 'fallback'
        }));
        
        console.log(`[useModelFeed] Using fallback models:`, fallbackModels.length);
        setModels(prevModels => isLoadMore ? [...prevModels, ...fallbackModels] : fallbackModels);
        setOffset(currentOffset + fallbackModels.length);
        setHasMore(true);
      }

    } catch (err) {
      console.error(`Error fetching model feed:`, err);
      setError(err.message || 'Failed to fetch models');
      setHasMore(false);
      
      // For development, provide fallback models
      if (process.env.NODE_ENV === 'development') {
        const fallbackModels = Array.from({ length: 8 }, (_, i) => ({
          id: `fallback-${i}`,
          slug: `fallback-${i}`,
          performerName: `Model ${i+1}`,
          name: `Model ${i+1}`,
          thumbnail: `https://via.placeholder.com/300x200?text=Model+${i+1}`,
          snapshotUrl: `https://via.placeholder.com/300x200?text=Model+${i+1}`,
          isOnline: Math.random() > 0.5,
          age: Math.floor(20 + Math.random() * 20),
          viewers: Math.floor(Math.random() * 1000),
          tags: ['fallback', 'test', 'development'],
          attributes: ['fallback', 'test', 'development'],
          country: 'Test Country',
          _provider: 'fallback'
        }));
        
        console.log(`[useModelFeed] Using fallback models:`, fallbackModels.length);
        setModels(prevModels => isLoadMore ? [...prevModels, ...fallbackModels] : fallbackModels);
        setOffset(currentOffset + fallbackModels.length);
        setHasMore(true);
      }

    } finally {
      setIsLoading(false);
      setRequestInProgress(false);
      initialFetchDone.current = true;
    }
  }, [category, subcategory, filters, getApiEndpoint, getProviders, isLoading, limit, providerData, provider, requestInProgress]);

  // Load more data
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log(`[useModelFeed] loadMore called, fetching from offset: ${offset}`);
      fetchData(offset, true);
    }
  }, [fetchData, hasMore, isLoading, offset]);

  // Reload the feed
  const refresh = useCallback(() => {
    console.log(`[useModelFeed] refresh called, fetching from offset: 0`);
    setModels([]);
    setOffset(0);
    setHasMore(true);
    fetchData(0, false);
  }, [fetchData]);

  // Initial data fetch if no initial models provided
  useEffect(() => {
    if (models.length === 0 && !initialFetchDone.current) {
      console.log(`[useModelFeed] Initial fetch (models length: ${models.length})`);
      fetchData(0, false);
    } else {
      console.log(`[useModelFeed] Skipping initial fetch (models length: ${models.length}, initialFetchDone: ${initialFetchDone.current})`);
    }
  }, [fetchData, models.length]);

  // Helper function for random sorting
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  return {
    models,
    isLoading,
    error,
    loadMore,
    refresh,
    hasMore,
    providerData
  };
};

export default useModelFeed;