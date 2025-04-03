// src/config/environments/local.js
module.exports = {
  environment: 'local',
  apiEndpoints: {
    aweBaseUrl: process.env.AWE_API_ENDPOINT || 'http://promo.awempire.com/xml/feed/index.php',
    // Add AWE API Key env var if needed by your specific AWE endpoint
    // aweApiKey: process.env.AWE_API_KEY || "YOUR_LOCAL_AWE_KEY",
  },
  aweSiteId: process.env.AWE_SITE_ID || '201300', // Default site ID
  awePsId: process.env.AWE_PS_ID || 'mikeeyy3',
  contentPaths: {
    dataRoot: 'src/data',
    models: 'src/data/models',
    categories: 'src/data/categories',
    taxonomy: 'src/data/taxonomy.json'
  },
  cachePaths: {
    awe: 'cache/awe' 
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "YOUR_LOCAL_OPENAI_KEY",
    model: "gpt-4o" 
  },
  jobSchedule: {
    aweSync: "*/30 * * * *", // Every 30 mins for local
    categoryFlatten: "0 4 * * *", 
  },
  deployment: {
    baseUrl: "http://localhost:3000"
  }
}; 