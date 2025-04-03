require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../../config'); // Use central config
const { normalizeModel } = require('../../utils/model-normalizer');

// --- AWE Configuration from central config & defaults ---
// Use the JSON endpoint if available and preferred, otherwise fallback to XML feed URL
const AWE_BASE_URL = config.apiEndpoints.aweBaseUrl || 'http://promo.awempire.com/xml/feed/index.php'; 
// Determine siteId based on configuration (e.g., premium vs free site target)
// This might need more sophisticated logic based on your config structure
const AWE_SITE_ID = process.env.AWE_SITE_ID || config.aweSiteId || '201300'; // Example fallback
const AWE_PS_ID = process.env.AWE_PS_ID || config.awePsId || 'mikeeyy3'; // Example fallback
const AWE_RESPONSE_FORMAT = 'json'; // Prefer JSON

const OUTPUT_DIR = path.resolve(process.cwd(), config.contentPaths.models);
const CACHE_DIR = path.resolve(process.cwd(), config.cachePaths.awe || 'cache/awe'); // Use specific AWE cache path

const slugify = str => (str || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

/**
 * Fetch models from AWE API for a specific category
 * @param {string} category - The category slug (e.g., 'girls', 'trans')
 * @param {number} [page=1] - The page number to fetch
 * @param {number} [limit=100] - The number of models per page
 * @param {string} [filters=''] - Comma-separated filter keywords
 * @param {string} [performerId=''] - Specific performer ID to fetch
 * @returns {Promise<Array>} - Array of raw model data from AWE
 */
async function fetchAWEModels(category, page = 1, limit = 100, filters = '', performerId = '') {
  // Essential parameters from Awempire.php analysis
  const params = {
    siteId: AWE_SITE_ID, 
    psId: AWE_PS_ID, 
    psTool: '213_1',         // Constant from Awempire.php
    psProgram: 'cbrnd',       // Constant from Awempire.php
    campaignId: 47738,       // Constant from Awempire.php
    category: category,     // e.g., 'girls', 'transgender' (check AWE docs for exact values)
    currentPage: page,
    limit: limit,
    imageSizes: '1024x768,800x600,320x240,320x180', // From Awempire.php
    imageType: 'erotic',    // From Awempire.php
    showOffline: performerId ? 1 : 0, // Show offline only if fetching specific performer
    extendedDetails: 1,
    responseFormat: AWE_RESPONSE_FORMAT,
    ...(performerId && { performerId: performerId }), // Add performerId only if provided
    ...(filters && { filters: filters }),           // Add filters only if provided
    // subAffId: '{your_tracking_id}' // Optional: Add if needed, manage via config
  };

  const url = `${AWE_BASE_URL}?${new URLSearchParams(params).toString()}`;
  console.log(`📡 Fetching AWE data for category [${category}], page [${page}] from ${AWE_BASE_URL}`);
  // console.log(`Request URL (debug): ${url}`); // Uncomment for debugging

  try {
    const res = await axios.get(url);
    // Adjust parsing based on actual JSON response structure from AWE
    if (AWE_RESPONSE_FORMAT === 'json' && res.data && res.data.data && res.data.data.models) {
        return res.data.data.models;
    } else if (AWE_RESPONSE_FORMAT === 'json' && Array.isArray(res.data)) {
        // Handle cases where the response might be a direct array
        return res.data;
    } else {
        console.warn('⚠️ Unexpected AWE response format or no models found.', res.data);
        return [];
    }
    // Add XML parsing here if needed as a fallback

  } catch (err) {
    console.error(`❌ Failed fetching AWE models for category ${category}:`, err.message);
    if (err.response) {
        console.error('Error Response Data:', err.response.data);
        console.error('Error Response Status:', err.response.status);
    }
    return [];
  }
}

/**
 * Process and save models fetched from AWE
 */
function saveModels(category, models) {
  if (!models || models.length === 0) {
    console.log(`ℹ️ No models to save for category: ${category}`);
    return 0;
  }

  const categoryDir = path.join(OUTPUT_DIR, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const cachePath = path.join(CACHE_DIR, `${category}-raw-${Date.now()}.json`);
  fs.writeFileSync(cachePath, JSON.stringify(models, null, 2));
  console.log(`💾 Cached raw AWE data to ${cachePath}`);

  let savedCount = 0;
  for (const model of models) {
    const normalizedModel = normalizeModel(model, category); // Use the existing normalizer
    if (!normalizedModel.slug) {
        console.warn(`⚠️ Could not generate slug for model, skipping:`, model);
        continue;
    }
    const filePath = path.join(categoryDir, `${normalizedModel.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(normalizedModel, null, 2));
    savedCount++;
  }

  console.log(`✅ Saved ${savedCount} normalized models for category: ${category}`);
  return savedCount;
}

/**
 * Sync all specified categories from AWE
 * (Note: AWE uses specific category names like 'girls', 'transgender')
 */
async function syncAllCategories(categories = ['girls', 'transgender', 'mature', 'fetish', 'lesbian', 'couple', 'gay']) {
  console.log('⚙️ Starting AWE category sync...');
  const results = {};
  for (const category of categories) {
    console.log(`⏳ Syncing AWE category: ${category}`);
    // Fetch only the first page initially for simplicity, can be expanded
    const models = await fetchAWEModels(category, 1, 100); // Fetch 100 models page 1
    const count = saveModels(category, models); 
    results[category] = count;
    console.log(`✔️ Finished syncing AWE category: ${category} (${count} models)`);
  }
  console.log('🎉 AWE sync completed.');
  return results;
}

module.exports = {
  fetchAWEModels,
  saveModels,
  syncAllCategories
}; 