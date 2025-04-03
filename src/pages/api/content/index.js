import fs from 'fs';
import path from 'path';

/**
 * Content API endpoint
 * 
 * Serves AI-generated content from the data directory. This acts as a bridge
 * between the API-provided content and our AI-generated content.
 * 
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 */
export default async function handler(req, res) {
  try {
    // Get query parameters
    const {
      type,
      slug,
      category,
      subcategory,
      _timestamp = Date.now() // Used to bypass cache
    } = req.query;
    
    // Validate required parameters
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Content type is required'
      });
    }
    
    // Determine content path based on type
    let contentPath;
    switch (type) {
      case 'model':
        if (category) {
          contentPath = path.join(process.cwd(), `src/data/models/${category}`);
        } else {
          contentPath = path.join(process.cwd(), 'src/data/models');
        }
        break;
      case 'blog':
        contentPath = path.join(process.cwd(), 'src/data/blog');
        break;
      case 'page':
        contentPath = path.join(process.cwd(), 'src/data/pages');
        break;
      case 'category':
        contentPath = path.join(process.cwd(), 'src/data/categories');
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown content type: ${type}`
        });
    }
    
    // Handle specific slug request
    if (slug) {
      // For models, we need to include the category in the path
      let filePath;
      if (type === 'model' && category) {
        filePath = path.join(contentPath, `${slug}.json`);
      } else {
        filePath = path.join(contentPath, `${slug}.json`);
      }
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: `Content not found: ${slug}`
        });
      }
      
      // Read and return the file content
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return res.status(200).json({
        success: true,
        data: content
      });
    }
    
    // Handle directory listing (for models this would be a specific category)
    else {
      // Map to store content by slug
      const contentMap = {};
      
      // Helper function to read files recursively
      const readFilesRecursively = (dir, includeSubdirs = true) => {
        // Check if directory exists
        if (!fs.existsSync(dir)) {
          return;
        }
        
        // Read directory
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        // Process each entry
        for (const entry of entries) {
          const entryPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && includeSubdirs) {
            // Recursively read subdirectories (except for models, which have a special structure)
            if (type !== 'model') {
              readFilesRecursively(entryPath);
            }
          } else if (entry.isFile() && entry.name.endsWith('.json')) {
            // Read and process JSON files
            try {
              const content = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
              const slug = entry.name.replace('.json', '');
              contentMap[slug] = content;
            } catch (error) {
              console.error(`Error reading file ${entryPath}:`, error);
            }
          }
        }
      };
      
      // Read files from content path
      readFilesRecursively(contentPath, type !== 'model');
      
      // If content type is model, include all categories if no specific category provided
      if (type === 'model' && !category) {
        // Get all category directories
        const modelDirs = fs.readdirSync(contentPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => path.join(contentPath, dirent.name));
        
        // Read files from each category directory
        for (const dir of modelDirs) {
          readFilesRecursively(dir, false);
        }
      }
      
      // Return the content map
      return res.status(200).json({
        success: true,
        data: contentMap,
        count: Object.keys(contentMap).length
      });
    }
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 