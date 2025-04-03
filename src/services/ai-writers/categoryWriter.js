const fs = require('fs');
const path = require('path');
const { generateAIContent } = require('./utils/ai');
// Use absolute path based on process.cwd() which should be the project root
const config = require(path.join(process.cwd(), 'src/config'));

// Use paths from config with fallback
const CATEGORIES_DIR = config.contentPaths?.categories || path.join(process.cwd(), 'src/data/categories');

/**
 * Generate AI content for categories (main and subcategories)
 * @param {Object} args - Arguments including category, subcategories, force
 * @returns {Object} - Result of the operation
 */
module.exports = async function categoryWriter(args) {
  const { category, subcategories, force = false } = args;
  
  if (!category) {
    throw new Error("Missing required parameter: category (main category slug)");
  }

  // Convert subcategories string to array if needed
  const subcategoriesArray = typeof subcategories === 'string' 
    ? subcategories.split(',').map(s => s.trim()).filter(Boolean) 
    : Array.isArray(subcategories) ? subcategories : [];

  console.log(`🤖 Starting AI categoryWriter for main category: ${category}`);
  
  // Ensure base category directory exists (it should from flatten)
  if (!fs.existsSync(CATEGORIES_DIR)) {
    console.warn(`⚠️ Base categories directory not found, creating: ${CATEGORIES_DIR}`);
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }

  const results = [];
  
  // --- Process the main category first --- 
  await processCategory(category, null, force, results);
  
  // --- Then process subcategories if provided --- 
  if (subcategoriesArray.length > 0) {
    console.log(`Processing ${subcategoriesArray.length} specified subcategories of ${category}: [${subcategoriesArray.join(', ')}]`);
    for (const subcategorySlug of subcategoriesArray) {
      // Pass main category slug as parent context
      await processCategory(subcategorySlug, category, force, results);
    }
  } else {
      console.log(`No specific subcategories provided for ${category}. Only processing main category.`);
  }
  
  console.log(`
--- categoryWriter Summary ---`);
  const successCount = results.filter(r => r.status === 'success').length;
  const skippedCount = results.filter(r => r.status === 'skipped').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  console.log(`Processed: ${results.length}, Success: ${successCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);
  console.log(`---------------------------`);

  return {
    type: 'category',
    category, // The main category targeted
    subcategoriesProcessed: subcategoriesArray.length,
    totalProcessed: results.length,
    success: successCount,
    skipped: skippedCount,
    errors: errorCount,
    results // Contains detailed info for each processed category/subcategory
  };
};

/**
 * Process a single category or subcategory: check existence, generate prompt, call AI, save.
 * @param {string} categorySlug - The slug of the category/subcategory being processed.
 * @param {string|null} parentSlug - The slug of the parent category (null for main categories).
 * @param {boolean} force - Force regeneration even if content exists.
 * @param {Array} results - Array to push processing results into.
 */
async function processCategory(categorySlug, parentSlug, force, results) {
  
  console.log(`
✨ Processing category/sub-category slug: ${categorySlug} ${parentSlug ? `(Parent: ${parentSlug})` : ''}`);
  
  const filePath = path.join(CATEGORIES_DIR, `${categorySlug}.json`); // Use config path
  let existingData = null;
  
  // Check if file exists and read its content
  if (fs.existsSync(filePath)) {
      try {
          existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          console.log(`ℹ️ Found existing file: ${filePath}`);
      } catch(err) {
          console.error(`❌ Error reading existing file ${filePath}, proceeding as if new:`, err.message);
          existingData = {}; // Treat as empty if unreadable
      }
  } else {
      console.log(`ℹ️ No existing file found at ${filePath}. Will create new.`);
      existingData = {}; // Prepare empty object if file is new
  }

  // Determine if generation is needed
  // Generate if forcing, or if file is new, or if key AI fields are missing
  const needsUpdate = force || !existingData.id || !existingData.aiLastUpdatedAt || !existingData.description || !existingData.metaTitle;
  
  if (!needsUpdate) {
    console.log(`✅ Skipping category ${categorySlug} (already exists and force=false)`);
    results.push({
      category: categorySlug,
      status: 'skipped'
    });
    return;
  }

  console.log(force ? `⚡ Force generating content for ${categorySlug}.` : `✍️ Generating content for ${categorySlug} (Update needed).`);
  
  try {
    // Generate the prompt for this category/subcategory
    const prompt = generatePrompt(categorySlug, parentSlug, existingData);
    
    // Generate content using OpenAI utility
    console.log(`⏳ Calling OpenAI for ${categorySlug}...`);
    const aiContent = await generateAIContent(prompt); // Expects parsed JSON object

    if (!aiContent || typeof aiContent !== 'object') { 
        throw new Error('Invalid content received from OpenAI utility.');
    }
    console.log(`✅ OpenAI response received for ${categorySlug}.`);
    
    // Merge AI content with existing data (prioritizing new AI content)
    // Ensure essential fields like id, slug, parent, children are preserved/updated correctly
    const finalContent = {
      ...existingData, // Keep existing fields
      ...aiContent,    // Overwrite with new AI content
      id: existingData.id || categorySlug, // Preserve existing ID or use slug
      slug: categorySlug,
      parent: parentSlug, // Set parent explicitly based on call context
      children: existingData.children || [], // Preserve existing children
      aiLastUpdatedAt: new Date().toISOString() // Add/update AI generation timestamp
    };
    
    // Save the merged content
    fs.writeFileSync(filePath, JSON.stringify(finalContent, null, 2));
    console.log(`💾 Content saved for category ${categorySlug} to: ${filePath}`);
    
    results.push({
      category: categorySlug,
      status: 'success',
      path: filePath
    });

  } catch (err) {
    console.error(`❌ Error generating content for category ${categorySlug}: ${err.message}`);
    results.push({
      category: categorySlug,
      status: 'error',
      error: err.message
    });
  }
}

/**
 * Generate the prompt for a category/subcategory
 * (Keep this function as is, unless prompt adjustments are needed)
 */
function generatePrompt(categorySlug, parentSlug, existingData) {
  // Determine context based on whether it's a main category or subcategory
  const isSubcategory = !!parentSlug;
  const categoryType = isSubcategory ? 
    `a subcategory (${categorySlug}) within the main ${parentSlug} category` : 
    `the main ${categorySlug} category`;
  
  const existingInfo = existingData ? `\nExisting data summary: ${JSON.stringify({ name: existingData.name, shortDesc: existingData.shortDescription }).substring(0, 100)}...` : '';

  // Refine prompt based on context
  return `
You are writing SEO-optimized content for ${categoryType} on MistressWorld, a luxury adult live cam platform.
${existingInfo}

Tone: Sophisticated, seductive, poetic, informative. Avoid vulgarity.

Write the following fields for the ${categorySlug} category page. If updating, refine existing content based on best practices:
- A compelling, keyword-rich title (title)
- A short introduction paragraph (introduction) suitable for display above model listings.
- A longer, detailed description (description) suitable for display below model listings, incorporating relevant keywords naturally.
- An SEO meta title (metaTitle) - max 60 chars.
- An SEO meta description (metaDesc) - max 160 chars.
- A list of 5-7 relevant features/highlights of this specific category (features) as strings in an array.
- A list of 5-8 related category slugs or relevant keywords (relatedCategories) as strings in an array.
- A compelling call-to-action sentence (cta).

Return ONLY the JSON object containing these fields:
{
  "title": "...",
  "introduction": "...",
  "description": "...",
  "metaTitle": "...",
  "metaDesc": "...",
  "features": ["...", "...", "..."],
  "relatedCategories": ["...", "...", "..."],
  "cta": "..."
}
`;
} 