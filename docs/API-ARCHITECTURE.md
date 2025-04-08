# API Architecture Documentation

## Overview

This document outlines the centralized API architecture implemented to optimize performance, reduce redundancies, and improve maintainability. The new system consolidates multiple redundant implementations into a single, efficient interface with proper caching.

## Key Components

The API service is organized into the following components:

```
src/services/api/
├── index.js           # Main entry point with unified interface
├── cache.js           # TTL-based caching implementation
├── providers/         # Specific provider implementations
│   ├── awe.js         # AWE-specific logic (LiveJasmin models)
│   ├── vpapi.js       # VPAPI-specific logic (LiveJasmin videos)
│   └── free.js        # FREE-specific logic (Chaturbate models)
```

### 1. Core API Service (`index.js`)

The main API service provides a unified interface for all data providers and handles:

- Provider selection
- API method routing
- Cache control
- Data standardization

### 2. Caching Service (`cache.js`)

Implements TTL-based in-memory caching to reduce redundant API calls:

- Automatic cache expiration
- Cache key management
- Cache statistics and monitoring

### 3. Provider Modules (`providers/`)

Each provider handles the specifics of its API:

- Parameter mapping
- Data normalization
- Error handling
- Provider-specific caching strategies

## Usage Examples

### Fetching Models

```javascript
import api from '@/services/api';

// Fetch models with the AWE provider (default)
const result = await api.fetchModels({
  category: 'girls',
  subcategory: 'latina',
  limit: 24,
  offset: 0,
  filters: {
    ethnicity: 'latin',
    age: 'twenties'
  }
});

// Fetch models with the FREE provider (Chaturbate)
const freeModels = await api.fetchModels({
  provider: api.Providers.FREE,
  category: 'girls',
  limit: 24
});

// Skip cache for fresh data
const freshModels = await api.fetchModels({
  category: 'girls',
  skipCache: true
});
```

### Fetching Videos

```javascript
import api from '@/services/api';

// Fetch videos with the VPAPI provider 
const videos = await api.fetchVideos({
  category: 'popular',
  limit: 24,
  offset: 0,
  filters: {
    quality: 'hd'
  }
});
```

### Managing Cache

```javascript
import api from '@/services/api';

// Clear all cache
api.clearCache();

// Clear only AWE provider cache
api.clearCache('awe:');

// Get cache statistics
const stats = api.getCacheStats();
console.log(`Cache size: ${stats.size} items`);
```

## Migration Guide

### Step 1: Update Imports

Change imports from orchestrator to the new API service:

```javascript
// OLD
import * as orchestrator from '@/services/orchestrator';
// or 
import { fetchModels } from '@/services/aweService';

// NEW
import api from '@/services/api';
```

### Step 2: Update API Provider References

```javascript
// OLD
const provider = orchestrator.ApiProviders.AWE;

// NEW
const provider = api.Providers.AWE;
```

### Step 3: Update Function Calls

```javascript
// OLD
const result = await orchestrator.fetchModels({
  provider,
  category,
  subcategory,
  limit,
  offset,
  filters
});

// NEW
const result = await api.fetchModels({
  provider,
  category,
  subcategory,
  limit,
  offset,
  filters,
  skipCache: false
});
```

## API Response Format

All API methods return a consistent response format:

```javascript
{
  success: true|false,
  error: "Error message if success is false",
  data: {
    items: [...], // Array of normalized items (models, videos, etc.)
    pagination: {
      total: 100,
      limit: 24,
      offset: 0,
      currentPage: 1,
      totalPages: 5,
      hasMore: true,
      count: 24 // Number of items returned
    }
  }
}
```

## Filtering Support

The new API service properly supports filtering across all providers:

- **Category & Subcategory**: Main category classification
- **Filters Object**: Additional filter criteria
  - `ethnicity`: Filter by ethnicity (asian, latin, white, ebony)
  - `age`: Filter by age group (teen, twenties, milf)
  - `build`: Filter by body type (petite, average-built, bbw)
  - `breasts`: Filter by breast size (tiny-breast, normal-tits, big-boobs)
  - `willingness`: Filter by available activities

Filters are automatically mapped to the appropriate parameters for each provider.

## Performance Improvements

The new architecture provides significant performance improvements:

1. **Reduced API Calls**: TTL caching reduces redundant external API calls
2. **Smaller Response Size**: Normalized data structures mean smaller response payloads
3. **Improved Error Resilience**: Better error handling and fallbacks
4. **Consistent Data Format**: Standardized responses simplify frontend development

## AWS & API Cost Optimization

This implementation helps reduce AWS costs and API expenses by:

1. **Minimizing External API Calls**: TTL caching reduces the number of outbound requests
2. **Optimizing Response Size**: Smaller payloads mean less bandwidth usage 
3. **Reducing Redundant Storage**: Single source of truth means less duplicate data
4. **Preventing Duplicate Requests**: Centralized service prevents multiple components from making the same request

## Future Improvements

Planned enhancements to the architecture:

1. **Persistent Cache**: Add Redis support for persistent, distributed caching
2. **Rate Limiting**: Implement rate limiting to protect against API abuse
3. **API Metrics**: Add metrics tracking for API usage and performance
4. **Cache Warming**: Implement cache warming for common requests
5. **Request Batching**: Batch similar requests to reduce API call volume 