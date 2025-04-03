module.exports = {
  environment: 'staging',
  apiEndpoints: {
    vpapiBaseUrl: process.env.VPAPI_BASE_URL, // Should be set via env vars
    vpapiKey: process.env.VPAPI_API_KEY,
    aweBaseUrl: process.env.AWE_API_ENDPOINT,
  },
  aweSiteId: process.env.AWE_SITE_ID, // Expect env var
  awePsId: process.env.AWE_PS_ID,     // Expect env var
  contentPaths: {
    dataRoot: 'src/data',
    models: 'src/data/models',
    categories: 'src/data/categories',
    taxonomy: 'src/data/taxonomy.json'
  },
  cachePaths: {
    vpapi: 'cache/vpapi',
    awe: 'cache/awe'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o"
  },
  jobSchedule: {
    vpapiSync: "*/15 * * * *", // Every 15 mins for staging
    aweSync: "*/15 * * * *", // Every 15 mins for staging
    categoryFlatten: "0 2 * * *", // Daily at 2 AM for staging
  },
  deployment: {
    cdnPath: "https://cdn-staging.mistressworld.com", // Example CDN path
    baseUrl: "https://staging.mistressworld.com" // Example base URL
    // Add S3 bucket names, CloudFront IDs etc. if needed for deploy script
  }
}; 