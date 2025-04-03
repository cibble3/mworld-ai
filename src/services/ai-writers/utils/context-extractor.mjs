/**
 * Context Extractor Utility
 * 
 * Extracts top and bottom text content from category and model pages to provide
 * context for AI content generation, ensuring new content is coherent with existing content.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module'; // Import createRequire

// --- Configuration --- 
// Use createRequire to import the CommonJS config module from ESM
const require = createRequire(import.meta.url);
// Use absolute path for config based on process.cwd()
const config = require(path.join(process.cwd(), 'src/config'));

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// DATA_DIR is now sourced from config - we'll use defaults if needed
const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');

// Function to check and get content paths with defaults
function getContentPath(type) {
  switch (type) {
    case 'models':
      return config.contentPaths?.models || path.join(process.cwd(), 'src/data/models');
    case 'categories':
      return config.contentPaths?.categories || path.join(process.cwd(), 'src/data/categories');
    case 'blog':
      return config.contentPaths?.blog || path.join(process.cwd(), 'src/data/blog');
    case 'pages':
      return config.contentPaths?.pages || path.join(process.cwd(), 'src/data/pages');
    default:
      return path.join(process.cwd(), `src/data/${type}`);
  }
}

/**
 * Extract context from Constants.jsx for category pages
 * @param {string} category - Category identifier (e.g., 'asian', 'ebony', 'latina')
 * @returns {Object} Context with title, description, and metadata
 */
export async function extractCategoryContext(category) {
  try {
    // Read Constants.jsx to extract hardcoded category text
    const constantsPath = path.join(COMPONENTS_DIR, 'Constants.jsx');
    const constantsContent = await fs.readFile(constantsPath, 'utf8');
    
    // Extract the category section using regex
    const categoryRegex = new RegExp(`${category}:\\s*{([^}]*title:[^}]*desc:[^}]*meta_desc:[^}]*meta_title:[^}]*})`);
    const categoryMatch = constantsContent.match(categoryRegex);
    
    if (!categoryMatch) {
      console.warn(`Category ${category} not found in Constants.jsx`);
      return {
        title: '',
        description: '',
        metaTitle: '',
        metaDescription: ''
      };
    }
    
    // Extract individual fields
    const sectionText = categoryMatch[1];
    
    // Extract title
    const titleMatch = sectionText.match(/title:\s*"([^"]*)"/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract description
    const descMatch = sectionText.match(/desc:\s*"([^"]*)"/);
    const description = descMatch ? descMatch[1] : '';
    
    // Extract meta title
    const metaTitleMatch = sectionText.match(/meta_title:\s*"([^"]*)"/);
    const metaTitle = metaTitleMatch ? metaTitleMatch[1] : '';
    
    // Extract meta description
    const metaDescMatch = sectionText.match(/meta_desc:\s*"([^"]*)"/);
    const metaDescription = metaDescMatch ? metaDescMatch[1] : '';
    
    // Parse about sections if available
    const aboutSections = [];
    const aboutRegex = /about:\s*\[([\s\S]*?)\]/;
    const aboutMatch = sectionText.match(aboutRegex);
    
    if (aboutMatch) {
      const aboutText = aboutMatch[1];
      const sectionRegex = /{([^}]*)}/g;
      let sectionMatch;
      
      while ((sectionMatch = sectionRegex.exec(aboutText)) !== null) {
        const section = sectionMatch[1];
        
        // Extract heading
        const headingMatch = section.match(/heading:\s*"([^"]*)"/);
        const heading = headingMatch ? headingMatch[1] : '';
        
        // Extract description paragraphs
        const descRegex = /desc1:\s*\[([\s\S]*?)\]/;
        const descMatch = section.match(descRegex);
        const paragraphs = [];
        
        if (descMatch) {
          const paragraphsText = descMatch[1];
          const paragraphRegex = /"([^"]*)"/g;
          let paragraphMatch;
          
          while ((paragraphMatch = paragraphRegex.exec(paragraphsText)) !== null) {
            paragraphs.push(paragraphMatch[1]);
          }
        }
        
        aboutSections.push({
          heading,
          paragraphs
        });
      }
    }
    
    return {
      title,
      description,
      metaTitle,
      metaDescription,
      aboutSections
    };
  } catch (error) {
    console.error(`Error extracting category context: ${error.message}`);
    return {
      title: '',
      description: '',
      metaTitle: '',
      metaDescription: '',
      aboutSections: []
    };
  }
}

/**
 * Extract context from existing model data
 * @param {string} category - Model category
 * @param {string} slug - Model slug
 * @returns {Object} Model context if available
 */
export async function extractModelContext(category, slug) {
  try {
    // Check if model data exists using the configured path with fallback
    const modelPath = path.join(getContentPath('models'), category, `${slug}.json`);
    
    try {
      await fs.access(modelPath);
    } catch (error) {
      console.warn(`Model file not found: ${modelPath}`);
      return null;
    }
    
    // Read and parse model data
    const modelData = JSON.parse(await fs.readFile(modelPath, 'utf8'));
    
    return {
      name: modelData.name,
      title: modelData.title,
      description: modelData.description,
      sections: modelData.sections || {},
      tags: modelData.tags || [],
      lastUpdatedAt: modelData.lastUpdatedAt
    };
  } catch (error) {
    console.error(`Error extracting model context: ${error.message}`);
    return null;
  }
}

/**
 * Create content generation context with all relevant information
 * @param {Object} options - Generator options
 * @returns {Object} Enhanced context for content generation
 */
export async function createGenerationContext(options) {
  const { type, category, slug } = options;
  
  let context = {
    type,
    category,
    slug,
    topTextContext: null,
    bottomTextContext: null,
    existingData: null
  };
  
  // Add category-specific context
  if (category) {
    context.categoryContext = await extractCategoryContext(category);
  }
  
  // Add model-specific context if applicable
  if (type === 'model' && category && slug) {
    context.existingData = await extractModelContext(category, slug);
  }
  
  // Extract related content based on tags
  if (context.existingData?.tags?.length) {
    context.relatedContent = await findRelatedContent(type, category, slug, context.existingData.tags);
  }
  
  return context;
}

/**
 * Find content related to the current content being generated
 * @param {string} type - Content type
 * @param {string} category - Content category
 * @param {string} slug - Content slug
 * @param {Array} tags - Content tags
 * @returns {Array} Related content items
 */
async function findRelatedContent(type, category, slug, tags) {
  if (!tags || tags.length === 0) return [];
  
  try {
    const relatedContent = [];
    
    // Determine where to look for related content using configured paths with fallback
    let searchDir;
    if (type === 'model') {
      // Ensure the category directory exists within the base models path
      if (!category) {
        console.warn('Category not provided for finding related content.');
        return relatedContent;
      }
      searchDir = path.join(getContentPath('models'), category);
    } else if (type === 'blog') {
      searchDir = getContentPath('blog');
    } else if (type === 'category') {
      searchDir = getContentPath('categories');
    } else {
      // Other types
      searchDir = getContentPath(type);
    }
    
    // Get all files in the directory
    let files;
    try {
      files = await fs.readdir(searchDir);
    } catch (error) {
      console.warn(`Directory not found: ${searchDir}`);
      return relatedContent;
    }
    
    // Process each file to find related content
    for (const file of files) {
      // Skip the current content
      if (file === `${slug}.json`) continue;
      
      // Only process JSON files
      if (!file.endsWith('.json')) continue;
      
      try {
        const filePath = path.join(searchDir, file);
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
        
        // Check if tags overlap
        const fileTags = data.tags || [];
        const tagOverlap = tags.filter(tag => fileTags.includes(tag));
        
        if (tagOverlap.length > 0) {
          relatedContent.push({
            type,
            slug: file.replace('.json', ''),
            category: data.category || category,
            name: data.name,
            title: data.title,
            tagOverlap
          });
        }
      } catch (error) {
        console.warn(`Error processing file ${file}: ${error.message}`);
      }
    }
    
    // Sort by tag overlap (most overlap first)
    return relatedContent.sort((a, b) => b.tagOverlap.length - a.tagOverlap.length).slice(0, 5);
  } catch (error) {
    console.error(`Error finding related content: ${error.message}`);
    return [];
  }
}

export default {
  extractCategoryContext,
  extractModelContext,
  createGenerationContext
}; 