# Free Models API Documentation

This document provides comprehensive information about the Free Models API, which allows you to fetch cam models from free sources like Chaturbate. This API is designed to be used in a multi-site architecture, where a separate application can consume the API while still using shared UI components.

## Overview

The Free Models API is a REST API that provides access to free cam models from third-party providers. It normalizes the data from these providers into a consistent format that can be consumed by front-end components.

## Base URL

```
https://[your-api-domain]/api/free-models
```

## Authentication

Currently, the API does not require authentication. It's designed for internal use between your own services.

## Environment Variables

The API requires the following environment variables:

- `FREE_API_ENDPOINT`: The base URL for the Chaturbate API (default: `https://chaturbate.com/api/public/affiliates/onlinerooms/`)
- `FREE_WM`: Your Chaturbate affiliate code/campaign slug

## API Endpoints

### GET /api/free-models

Retrieves a list of free cam models with optional filtering.

#### Query Parameters

| Parameter    | Type    | Required | Default  | Description                                        |
|--------------|---------|----------|-----------|----------------------------------------------------|
| category     | string  | No       | 'girls'   | Category of models ('girls', 'trans', 'men', 'couples') |
| subcategory  | string  | No       | null      | Subcategory/tag filtering                         |
| limit        | number  | No       | 200       | Number of results to return                        |
| offset       | number  | No       | 0         | Offset for pagination                              |
| page         | number  | No       | 1         | Page number (alternative to offset)                |
| sort         | string  | No       | 'popular' | Sort order of results                              |
| fetish       | string  | No       | null      | Filter by specific fetish                          |
| appearance   | string  | No       | null      | Filter by appearance attribute                     |
| region       | string  | No       | null      | Filter by geographical region                      |
| hd           | boolean | No       | null      | Filter for HD streams only                         |

#### Response Format

The API returns JSON with the following structure:

```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "model-username",
        "slug": "model-username",
        "username": "model-username",
        "name": "Model Display Name",
        "performerName": "Model Display Name",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "preview": "https://example.com/preview.jpg",
        "previewImage": "https://example.com/preview.jpg",
        "isOnline": true,
        "viewerCount": 123,
        "age": 25,
        "ethnicity": "",
        "bodyType": "",
        "tags": ["tag1", "tag2"],
        "fetishes": ["fetish1", "fetish2"],
        "primaryCategory": "girls",
        "_provider": "free",
        "room_url": "https://example.com/room-url",
        "appearances": {
          "age": 25,
          "fetishes": ["fetish1", "fetish2"],
          "hasLeather": false,
          "hasLatex": false,
          "hasFeet": false,
          "hasBDSM": true
        },
        "_originalData": {
          "iframe_embed": "<iframe>...</iframe>",
          "chat_room_url": "https://example.com/room-url"
        }
      }
    ],
    "pagination": {
      "total": 1000,
      "limit": 200,
      "offset": 0,
      "currentPage": 1,
      "totalPages": 5,
      "hasMore": true
    }
  }
}
```

In case of an error:

```json
{
  "success": false,
  "error": "Error message",
  "data": {
    "models": [],
    "pagination": {
      "total": 0,
      "limit": 200,
      "offset": 0,
      "currentPage": 1,
      "totalPages": 0,
      "hasMore": false
    }
  }
}
```

## Integration with ModelPage Component

The Free Models API is designed to work seamlessly with the ModelPage component. To integrate:

1. Create a FreeModelPage component that uses the ModelPage component
2. Configure the API call to `/api/free-models` instead of `/api/models`
3. Pass the appropriate category and filters

Example:

```jsx
import React from 'react';
import ModelPage from '@/components/pages/ModelPage';

const FreeGirlsPage = () => {
  // Default content when no filters are applied
  const defaultContent = {
    title: "Free Live Cam Girls",
    desc: "Watch free live cam girls online. No registration required - 100% free cam chat!",
    meta_title: "Free Live Cam Girls | Your Site",
    meta_desc: "Watch free live cam girls online with no registration required. 100% free cam chat with amateur models!",
    meta_keywords: "free cam girls, free webcam models, free live cams, free sex chat",
    about: []
  };

  // Create a custom API fetcher for the free models API
  const customFetcher = async (params) => {
    const baseParams = {
      ...params,
      provider: 'free' // Override provider to use free API
    };
    
    // Call your free models API endpoint
    const response = await axios.get('/api/free-models', { params: baseParams });
    
    if (response.data?.success) {
      return {
        success: true,
        data: {
          models: response.data.data.models,
          pagination: response.data.data.pagination
        }
      };
    }
    
    return {
      success: false,
      error: response.data?.error || 'Failed to fetch models'
    };
  };

  return (
    <ModelPage
      category="girls"
      defaultContent={defaultContent}
      contentMap={{}}
      additionalParams={['region', 'hd']}
      pageRoute="/free/girls"
      apiFetcher={customFetcher} // Use custom fetcher for free models
    />
  );
};

export default FreeGirlsPage;
```

## Migrating to Multi-Site Architecture

To migrate the free models functionality to a separate application:

1. Create a new Next.js application for free models
2. Copy the `/api/free-models` endpoint to the new application
3. Create pages using the ModelPage component (which should be in a shared package)
4. Configure environment variables in the new application
5. Deploy the new application separately
6. Update any links from the main application to point to the new free models domain

## Data Filtering

The API supports several filtering mechanisms:

1. **Category Filtering**: Filter by main category (girls, trans, men, couples)
2. **Tag Filtering**: Filter by specific tags or subcategories
3. **Fetish Filtering**: Filter for specific fetish types
4. **Regional Filtering**: Filter models by geographical region

Note that due to limitations in the Chaturbate API, only one tag can be specified in the API call. Additional tag filtering is done client-side.

## Caching Considerations

The API currently doesn't implement caching. For a production multi-site architecture, consider:

1. Adding Redis caching to reduce API calls to Chaturbate
2. Implementing stale-while-revalidate patterns for data freshness
3. Setting appropriate cache headers for browser/CDN caching

## Additional Recommendations

1. Consider implementing a shared NPM package for the ModelPage component and related utilities
2. Implement proper error tracking and logging in the new application
3. Consider adding a proxy layer to handle rate limiting and cache centrally
4. Implement proper CORS settings if the APIs will be accessed across domains

## Troubleshooting

Common issues:

1. **No models returned**: Check that environment variables are correctly set
2. **CORS errors**: Ensure CORS headers are properly configured for cross-domain requests
3. **Rate limiting**: Chaturbate may rate-limit requests, implement exponential backoff retry strategy 