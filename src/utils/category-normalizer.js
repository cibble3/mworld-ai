const fs = require('fs');
const path = require('path');
const config = require('../config'); // Import central config

// Use paths from config
const CATEGORIES_DIR = path.resolve(process.cwd(), config.contentPaths.categories);
const TAXONOMY_FILE = path.resolve(process.cwd(), config.contentPaths.taxonomy);

/**
 * Normalize a single category
 */
function normalizeCategory(category) {
  const slug = category.slug || 
               category.id || 
               category.name?.toLowerCase().replace(/\s+/g, '-') || 
               'unknown';
  
  return {
    id: category.id || slug,
    slug,
    name: category.name || category.title || slug.replace(/-/g, ' '),
    description: category.description || category.content || '',
    shortDescription: category.shortDescription || category.introduction || '',
    metaTitle: category.metaTitle || category.title || `${slug.replace(/-/g, ' ')} Models`,
    metaDescription: category.metaDescription || category.metaDesc || '',
    parent: category.parent || category.parentCategory || null,
    children: category.children || [],
    lastUpdated: category.lastUpdated || category.lastUpdatedAt || new Date().toISOString()
  };
}

/**
 * Load all categories from files
 */
function loadCategories() {
  const categories = {};
  
  // Use CATEGORIES_DIR from config
  if (!fs.existsSync(CATEGORIES_DIR)) {
    console.warn(`⚠️ Categories directory does not exist: ${CATEGORIES_DIR}`);
    // Attempt to create it if it doesn't exist
    try {
        fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
        console.log(`✅ Created directory: ${CATEGORIES_DIR}`);
    } catch (err) {
        console.error(`❌ Failed to create directory: ${CATEGORIES_DIR}`, err);
        return categories; // Return empty if directory creation fails
    }
  }
  
  const files = fs.readdirSync(CATEGORIES_DIR)
    .filter(file => file.endsWith('.json'));
    
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(CATEGORIES_DIR, file), 'utf8');
      const category = JSON.parse(content);
      // Use slug or filename (without .json) as a fallback key if id is missing
      const key = category.id || category.slug || file.replace('.json', '');
      categories[key] = category;
    } catch (error) {
      console.error(`❌ Error loading category file ${file}:`, error.message);
    }
  }
  
  console.log(`📂 Loaded ${Object.keys(categories).length} category files from ${CATEGORIES_DIR}`);
  return categories;
}

/**
 * Build taxonomy structure with parent-child relationships
 */
function buildTaxonomy(categories) {
  const taxonomy = {
    categories: {}, // Stores normalized category objects keyed by ID
    tree: {}       // Stores top-level category IDs and their children
  };
  
  // First pass: normalize all categories and store them by their final ID
  for (const key in categories) {
    const normalized = normalizeCategory(categories[key]);
    taxonomy.categories[normalized.id] = normalized;
  }
  
  // Second pass: build parent-child relationships using final IDs
  for (const id in taxonomy.categories) {
    const category = taxonomy.categories[id];
    // Reset children array before rebuilding
    category.children = []; 
  }
  for (const id in taxonomy.categories) {
      const category = taxonomy.categories[id];
      if (category.parent && taxonomy.categories[category.parent]) {
          if (!taxonomy.categories[category.parent].children.includes(id)) {
              taxonomy.categories[category.parent].children.push(id);
          }
      }
      // Add to tree structure if it's a root category (no parent or parent doesn't exist)
      if (!category.parent || !taxonomy.categories[category.parent]) {
          taxonomy.tree[id] = { // Store reference by ID
              id: id,
              children: [] // Will be populated by children themselves
          };
      }
  }

  // Third pass: Populate children in the tree structure
  for (const id in taxonomy.tree) {
      taxonomy.tree[id].children = taxonomy.categories[id].children;
  }

  console.log(`🌳 Built taxonomy with ${Object.keys(taxonomy.categories).length} categories and ${Object.keys(taxonomy.tree).length} root nodes.`);
  return taxonomy;
}

/**
 * Save taxonomy to files
 */
function saveTaxonomy(taxonomy) {
  // Use CATEGORIES_DIR and TAXONOMY_FILE from config
  if (!fs.existsSync(CATEGORIES_DIR)) {
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }
  
  // Save individual normalized category files (using slug as filename)
  let savedCount = 0;
  for (const id in taxonomy.categories) {
      const category = taxonomy.categories[id];
      const outputPath = path.join(CATEGORIES_DIR, `${category.slug}.json`);
      try {
          fs.writeFileSync(outputPath, JSON.stringify(category, null, 2));
          savedCount++;
      } catch (err) {
          console.error(`❌ Failed to save category file ${outputPath}:`, err);
      }
  }
  console.log(`💾 Saved ${savedCount} normalized category files to ${CATEGORIES_DIR}`);
  
  // Save the main taxonomy structure file
  const taxonomyDir = path.dirname(TAXONOMY_FILE);
  if (!fs.existsSync(taxonomyDir)) {
    fs.mkdirSync(taxonomyDir, { recursive: true });
  }
  
  try {
      fs.writeFileSync(TAXONOMY_FILE, JSON.stringify(taxonomy, null, 2));
      console.log(`🗺️ Taxonomy structure file saved to ${TAXONOMY_FILE}`);
  } catch (err) {
       console.error(`❌ Failed to save taxonomy file ${TAXONOMY_FILE}:`, err);
  }
}

/**
 * Main function to flatten all categories
 */
function flattenCategories() {
  console.log('⚙️ Starting category normalization...');
  
  const categories = loadCategories();
  const taxonomy = buildTaxonomy(categories);
  saveTaxonomy(taxonomy);
  
  console.log('🎉 Category normalization completed.');
  return taxonomy;
}

module.exports = {
  normalizeCategory,
  loadCategories,
  buildTaxonomy,
  saveTaxonomy,
  flattenCategories
};