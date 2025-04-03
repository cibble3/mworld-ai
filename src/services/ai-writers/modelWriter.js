const fs = require('fs');
const path = require('path');
const { generateAIContent } = require('./utils/ai');
// Use absolute path based on process.cwd() which should be the project root
const config = require(path.join(process.cwd(), 'src/config'));

// Use paths from config with fallback
const MODELS_DIR = config.contentPaths?.models || path.join(process.cwd(), 'src/data/models');

/**
 * Generate AI content for a model
 * Note: This writer can both update existing models or create new ones when specified.
 * 
 * @param {Object} args - Arguments including category, slug (potentially unused here), limit, force, type
 * @returns {Object} - Result of the operation
 */
module.exports = async function modelWriter(args) {
  // Destructure args, providing defaults
  const { category, slug: specificSlug, limit = 1, force = false, type = 'bio' } = args;
  
  if (!category) {
    throw new Error("Missing required parameter: category");
  }

  console.log(`🤖 Starting AI modelWriter for category: ${category}, limit: ${limit}, type: ${type}, force: ${force}`);
  
  // Ensure category directory exists
  const categoryDir = path.join(MODELS_DIR, category);
  if (!fs.existsSync(categoryDir)) {
    console.log(`📁 Creating category directory: ${categoryDir}`);
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // --- Determine target model files --- 
  let filesToProcess = [];

  if (specificSlug) {
      // If a specific slug is provided (e.g., from ai-writer CLI)
      const filePath = path.join(categoryDir, `${specificSlug}.json`);
      if (fs.existsSync(filePath)) {
          console.log(`Targeting existing model: ${filePath}`);
          filesToProcess.push({ filePath, slug: specificSlug, isNew: false });
      } else {
          console.log(`🆕 Creating new model: ${filePath}`);
          filesToProcess.push({ filePath, slug: specificSlug, isNew: true });
      }
  } else {
      // If no specific slug, process multiple based on logic from original script
      console.log(`Scanning directory for models to update: ${categoryDir}`);
      
      let allModelFiles = [];
      try {
        allModelFiles = fs.readdirSync(categoryDir).filter(file => file.endsWith('.json'));
        console.log(`📝 Found ${allModelFiles.length} total models in ${category}`);
      } catch (err) {
        console.log(`📝 No existing models found in ${category}`);
      }
      
      // Filter models that need to be processed (if not forcing)
      if (!force) {
        const filesToUpdate = allModelFiles.filter(file => {
          const filePath = path.join(categoryDir, file);
          try {
              const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              // Process if missing key AI fields (bioTop) or missing last AI update timestamp
              // Add more checks as needed for different content types (showcase etc.)
              const needsUpdate = !data.aiLastUpdatedAt || !data.bioTop;
              if (needsUpdate) console.log(`  - ${file} needs update (force=false).`);
              return needsUpdate;
          } catch(err) {
              console.error(`  - Error reading ${file}, skipping filter check:`, err.message);
              return false; // Skip if file is unreadable
          }
        });
        console.log(`📝 ${filesToUpdate.length} models require updates (force=false).`);
        filesToProcess = filesToUpdate.map(file => ({
          filePath: path.join(categoryDir, file),
          slug: file.replace('.json', ''),
          isNew: false
        }));
      } else {
          console.log(`📝 Processing all ${allModelFiles.length} models (force=true).`);
          filesToProcess = allModelFiles.map(file => ({
            filePath: path.join(categoryDir, file),
            slug: file.replace('.json', ''),
            isNew: false
          }));
      }
      
      // Apply limit if specified and not targeting a single slug
      if (limit > 0) {
        filesToProcess = filesToProcess.slice(0, limit);
        console.log(`📝 Applying limit, processing ${filesToProcess.length} models.`);
      }
  }
  // --- End Determine target model files --- 

  
  const results = [];
  
  for (const { filePath, slug, isNew } of filesToProcess) {
    console.log(`
✨ Processing model: ${category}/${slug}`);
    
    let modelData = {};
    if (!isNew) {
      try {
          modelData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (err) {
          console.error(`❌ Error reading model data for ${slug}: ${err.message}`);
          results.push({ slug, status: 'error', error: `Failed to read model file: ${err.message}` });
          continue; // Skip to next file
      }
    } else {
      // Create basic model data for a new model
      modelData = {
        slug,
        category,
        performerName: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // capitalize words
        createdAt: new Date().toISOString()
      };
      console.log(`📝 Created initial data structure for new model: ${slug}`);
    }
    
    // Get the model name from the data or use the slug
    const name = modelData.performerName || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Generate the prompt based on the model type
    console.log(`✍️ Generating OpenAI prompt for ${name} (type: ${type})...`);
    const prompt = generatePrompt(name, category, type);
    
    try {
      // Generate content using OpenAI utility
      console.log(`⏳ Calling OpenAI...`);
      const aiContent = await generateAIContent(prompt); // Ensure generateAIContent returns parsed JSON
      
      if (!aiContent || typeof aiContent !== 'object') { 
          throw new Error('Invalid content received from OpenAI utility.');
      }

      console.log(`✅ OpenAI response received.`);
      
      // Update the model data with the new content + timestamp
      const updatedData = {
        ...modelData,
        ...aiContent,
        aiLastUpdatedAt: new Date().toISOString() // Add/update AI generation timestamp
      };
      
      // Save the updated data
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      console.log(`💾 ${isNew ? 'Created' : 'Updated'} model file saved: ${filePath}`);
      
      results.push({
        slug,
        status: 'success',
        path: filePath,
        isNew
      });

    } catch (err) {
      console.error(`❌ Error during AI generation or saving for ${slug}: ${err.message}`);
      results.push({
        slug,
        status: 'error',
        error: err.message
      });
    }
  }
  
  console.log(`
--- modelWriter Summary for Category: ${category} ---`);
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const newCount = results.filter(r => r.status === 'success' && r.isNew).length;
  console.log(`Processed: ${results.length}, Success: ${successCount} (New: ${newCount}), Errors: ${errorCount}`);
  console.log(`--------------------------------------------`);

  return {
    type: 'model',
    category,
    processed: results.length,
    success: successCount,
    new: newCount,
    errors: errorCount,
    results // Contains detailed success/error info for each processed model
  };
};

/**
 * Generate the prompt for OpenAI based on the model type
 * @param {string} name - The name of the model
 * @param {string} category - The category of the model
 * @param {string} type - The type of content to generate
 * @returns {string} - The prompt for OpenAI
 */
function generatePrompt(name, category, type) {
  const categoryType = category === 'transgender' ? 'dominatrix trans model' : 'dominatrix model';
  
  if (type === 'showcase') {
    return `
You are writing an elegant showcase feature for a ${categoryType} named ${name}.
This content is for a luxury adult live cam platform called MistressWorld.

Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A feature title (title)
- A short intro paragraph (intro) that teases power and elegance.
- A longer descriptive paragraph (description) that explores the mystique and allure.
- A bullet list of 5 highlights about the model (highlights)
- A call-to-action (cta) encouraging viewers to watch the model.
- A meta title and description suitable for high-end SEO.
- Comma-separated keywords for metaKeywords.

Return JSON:
{
  "title": "...",
  "intro": "...",
  "description": "...",
  "highlights": ["...", "...", "...", "...", "..."],
  "cta": "...",
  "metaTitle": "...",
  "metaDesc": "...",
  "metaKeywords": "..., ..., ..."
}
`;
  }
  
  // Default bio prompt
  return `
You are writing an elegant bio for a ${categoryType} named ${name}.
This content is for a luxury adult live cam platform called MistressWorld.

Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A short intro paragraph (bioTop) that teases power and elegance.
- A longer paragraph (bioBottom) that explores the mystique and live cam allure.
- A meta title and description suitable for high-end SEO.
- Comma-separated keywords for metaKeywords.

Return JSON:
{
  "bioTop": "...",
  "bioBottom": "...",
  "metaTitle": "...",
  "metaDesc": "...",
  "metaKeywords": "..., ..., ..."
}
`;
}