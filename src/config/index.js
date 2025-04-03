require('dotenv').config(); // Load .env variables first
const path = require('path');

const config = {
  environment: process.env.NODE_ENV || 'local',
  apiEndpoints: {
    vpapiBaseUrl: process.env.VPAPI_BASE_URL || 'https://api.default.com',
    vpapiKey: process.env.VPAPI_API_KEY || '',
    aweBaseUrl: process.env.AWE_API_ENDPOINT || 'https://wmcdpt.com/api/model/feed',
  },
  contentPaths: {
    dataRoot: 'src/data',
    taxonomy: path.join(process.cwd(), 'src/data/taxonomy.json'),
    categories: path.join(process.cwd(), 'src/data/categories'),
    models: path.join(process.cwd(), 'src/data/models')
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  },
  deployment: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }
};

module.exports = config; 