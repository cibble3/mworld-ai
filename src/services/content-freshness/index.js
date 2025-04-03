const fs = require('fs');
const path = require('path');
const config = require(path.join(process.cwd(), 'src/config'));
const { generateModelContent } = require('../ai-writers/modelWriter');
const { generateCategoryContent } = require('../ai-writers/categoryWriter');
const { generateBlogContent } = require('../ai-writers/blogWriter');
const { generatePageContent } = require('../ai-writers/pageWriter');

const FRESHNESS_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Check if content needs updating based on last modified date
 * @param {string} filePath - Path to content file
 * @returns {boolean} - Whether content needs updating
 */
function needsUpdate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const lastModified = stats.mtime.getTime();
    const now = Date.now();
    return (now - lastModified) > FRESHNESS_THRESHOLD;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error);
    return false;
  }
}

/**
 * Update content based on type
 * @param {string} type - Content type (model, category, blog, page)
 * @param {Object} params - Content parameters
 * @returns {Promise<Object>} - Update result
 */
async function updateContent(type, params) {
  try {
    let result;
    switch (type) {
      case 'model':
        result = await generateModelContent(params.slug, params.category);
        break;
      case 'category':
        result = await generateCategoryContent(params.slug, params.subcategories);
        break;
      case 'blog':
        result = await generateBlogContent(params.title, params.topic);
        break;
      case 'page':
        result = await generatePageContent(params.slug, params.sections);
        break;
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
    return { success: true, result };
  } catch (error) {
    console.error(`Error updating ${type} content:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Check and update stale content
 * @param {string} type - Content type to check
 * @returns {Promise<Object>} - Update results
 */
async function checkAndUpdateContent(type) {
  const results = {
    checked: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };

  try {
    const contentPath = path.join(process.cwd(), 'src/data', type);
    const files = fs.readdirSync(contentPath);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      results.checked++;
      const filePath = path.join(contentPath, file);
      
      if (needsUpdate(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const updateResult = await updateContent(type, {
          slug: content.slug,
          category: content.category,
          subcategories: content.subcategories,
          title: content.title,
          topic: content.topic,
          sections: content.sections
        });

        if (updateResult.success) {
          results.updated++;
        } else {
          results.errors.push({
            file,
            error: updateResult.error
          });
        }
      } else {
        results.skipped++;
      }
    }

    return results;
  } catch (error) {
    console.error(`Error checking ${type} content:`, error);
    return {
      checked: results.checked,
      updated: results.updated,
      skipped: results.skipped,
      errors: [...results.errors, { error: error.message }]
    };
  }
}

/**
 * Check and update all content types
 * @returns {Promise<Object>} - Overall results
 */
async function checkAllContent() {
  const contentTypes = ['models', 'categories', 'blog', 'pages'];
  const results = {
    total: {
      checked: 0,
      updated: 0,
      skipped: 0,
      errors: []
    },
    byType: {}
  };

  for (const type of contentTypes) {
    const typeResults = await checkAndUpdateContent(type);
    results.byType[type] = typeResults;
    
    results.total.checked += typeResults.checked;
    results.total.updated += typeResults.updated;
    results.total.skipped += typeResults.skipped;
    results.total.errors.push(...typeResults.errors);
  }

  return results;
}

module.exports = {
  checkAndUpdateContent,
  checkAllContent
}; 