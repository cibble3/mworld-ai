/**
 * Global application constants
 */

// Cache Configuration
const CACHE_CONFIG = {
  TTL: 3600, // 1 hour in seconds
  MAX_ITEMS: 1000,
  STALE_WHILE_REVALIDATE: true
};

// Job Processing
const JOB_CONFIG = {
  MAX_CONCURRENT_JOBS: 5,
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
  JOB_TIMEOUT: 300000, // 5 minutes
  BATCH_SIZE: 50
};

// Content Generation
const CONTENT_CONFIG = {
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.5,
  PRESENCE_PENALTY: 0.5,
  MAX_RELATED_ITEMS: 5
};

// API Rate Limits
const API_LIMITS = {
  OPENAI: {
    REQUESTS_PER_MINUTE: 60,
    TOKENS_PER_MINUTE: 40000
  },
  VPAPI: {
    REQUESTS_PER_MINUTE: 30
  },
  AWE: {
    REQUESTS_PER_MINUTE: 20
  }
};

// Content Validation
const VALIDATION_SCHEMAS = {
  MODEL: {
    REQUIRED_FIELDS: ['id', 'slug', 'performerName', 'primaryCategory'],
    OPTIONAL_FIELDS: ['description', 'images', 'isLive', 'viewerCount']
  },
  CATEGORY: {
    REQUIRED_FIELDS: ['id', 'slug', 'name', 'description'],
    OPTIONAL_FIELDS: ['parent', 'children', 'metaTitle', 'metaDescription']
  },
  BLOG: {
    REQUIRED_FIELDS: ['id', 'slug', 'title', 'content'],
    OPTIONAL_FIELDS: ['excerpt', 'author', 'tags', 'relatedContent']
  }
};

// Backup Configuration
const BACKUP_CONFIG = {
  ENABLED: true,
  INTERVAL: '0 0 * * *', // Daily at midnight
  RETENTION_DAYS: 30,
  COMPRESSION: true
};

// CDN Configuration
const CDN_CONFIG = {
  ENABLED: true,
  REGION: 'us-east-1',
  CACHE_TTL: 3600,
  INVALIDATION_PATHS: ['/api/*', '/data/*']
};

// API providers
export const ApiProviders = {
    AWE: 'awe',
    FREE: 'free',
    VPAPI: 'vpapi',
};

// Mock data configuration
export const MOCK_DATA = {
    ENABLED: false, // Force disable mock data
};

// Default pagination values
export const PAGINATION = {
    DEFAULT_LIMIT: 24,
    DEFAULT_OFFSET: 0,
};

export default {
    CACHE_CONFIG,
    JOB_CONFIG,
    CONTENT_CONFIG,
    API_LIMITS,
    VALIDATION_SCHEMAS,
    BACKUP_CONFIG,
    CDN_CONFIG,
    ApiProviders,
    MOCK_DATA,
    PAGINATION,
}; 