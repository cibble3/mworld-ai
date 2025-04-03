module.exports = {
  environment: 'production',
  apiEndpoints: {
    vpapiBaseUrl: process.env.VPAPI_BASE_URL,
    vpapiKey: process.env.VPAPI_API_KEY,
    aweBaseUrl: process.env.AWE_API_ENDPOINT,
  },
  aweSiteId: process.env.AWE_SITE_ID,
  awePsId: process.env.AWE_PS_ID,
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
    vpapiSync: "*/10 * * * *", // Every 10 mins for production
    aweSync: "*/10 * * * *", // Every 10 mins for production
    categoryFlatten: "0 1 * * *", // Daily at 1 AM for production
  },
  deployment: {
    cdnPath: "https://cdn.mistressworld.com",
    baseUrl: "https://www.mistressworld.com"
    // Add S3 bucket names, CloudFront IDs etc. for deploy script
  }
}; 