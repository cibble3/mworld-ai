import React from 'react';
import ModelPage from '@/components/pages/ModelPage';
import axios from 'axios';

/**
 * FreeGirlsPage - Example implementation of a page for free girl models
 * To be used in a separate application that consumes the free models API
 */
const FreeGirlsPage = () => {
  // Default content when no filters are applied
  const defaultContent = {
    title: "Free Live Cam Girls",
    desc: "Watch free live cam girls online with no registration required. Enjoy 100% free cam chat with amateur models streaming live!",
    meta_title: "Free Live Cam Girls | No Registration - 100% Free Cam Chat",
    meta_desc: "Watch free live cam girls perform online without registration. Enjoy amateur webcam models streaming in HD with 100% free cam chat.",
    meta_keywords: "free cam girls, free webcam models, no registration, free live cams, free sex chat, amateur models",
    about: [
      {
        heading: "Free Live Cam Girls - No Credit Card Required",
        desc1: [
          "Welcome to our collection of free live cam girls streaming online right now. Unlike paid cam sites, you can watch all these amateur webcam models without registration or credit card.",
          "These models are streaming from various locations around the world, bringing you authentic amateur performances in real-time. Simply click on any model to start watching their live stream instantly.",
          "All streaming is provided through our partner sites that offer free access to thousands of cam performers. No hidden fees, no subscriptions required - just 100% free live webcam entertainment."
        ]
      }
    ]
  };

  // Create a custom API fetcher for the free models API
  const freeCamsFetcher = async (params) => {
    try {
      console.log(`[FreeGirlsPage] Fetching models with params:`, params);
      
      // Convert standard API params to free models API format
      const apiParams = {
        category: params.category || 'girls',
        limit: params.limit || 200,
        offset: params.offset || 0,
        ...(params.ethnicity && { appearance: params.ethnicity }),
        ...(params.willingness && { fetish: params.willingness }),
        ...(params.tags && { tags: params.tags }),
        ...(params.region && { region: params.region }),
        ...(params.hd && { hd: params.hd })
      };
      
      // Make request to free models API
      const response = await axios.get('/api/free-models', { 
        params: apiParams,
        // Add cache control to reduce API calls
        headers: {
          'Cache-Control': 'max-age=60'
        }
      });

      if (response.data?.success) {
        return {
          success: true,
          data: {
            models: response.data.data.models,
            pagination: response.data.data.pagination
          }
        };
      } else {
        console.error('[FreeGirlsPage] API error:', response.data?.error);
        return {
          success: false,
          error: response.data?.error || 'Failed to fetch free models'
        };
      }
    } catch (error) {
      console.error('[FreeGirlsPage] Fetch error:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect to free models API'
      };
    }
  };

  return (
    <ModelPage
      category="girls"
      defaultContent={defaultContent}
      contentMap={{}} // No specific content map for free models
      additionalParams={['region', 'hd']} // Add free-specific parameters
      pageRoute="/free/girls"
      apiEndpoint="/api/free-models" // Use free models API endpoint
      apiFetcher={freeCamsFetcher} // Use custom fetcher
      defaultApiParams={{ limit: 100 }} // Default to higher limit for free models
    />
  );
};

export default FreeGirlsPage; 