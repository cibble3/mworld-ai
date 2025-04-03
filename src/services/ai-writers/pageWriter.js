const fs = require('fs');
const path = require('path');
// Use absolute path based on process.cwd() which should be the project root
const config = require(path.join(process.cwd(), 'src/config'));
const { generateAIContent } = require('./utils/ai.js'); // Explicit path
const chalk = require('chalk');

/**
 * Generate AI content for specific sections of a page
 * @param {Object} args - Arguments including slug (page name), sections (to update), context, force, dryRun
 * @returns {Object} - Result of the operation
 */
module.exports = async function pageWriter(args) {
  // Destructure arguments
  const { 
    slug, // Use slug for the page filename (e.g., 'home')
    sections, // Comma-separated string or array of sections to update
    context, // Optional context
    force = false, // Force regeneration of sections even if they exist?
    dryRun = false 
  } = args;
  
  if (!slug) {
    throw new Error("Missing required parameter: slug (page name) is required.");
  }
  if (!sections) {
      throw new Error("Missing required parameter: sections must be specified (e.g., --sections=featured,trending).");
  }

  // Convert sections to array if it's a comma-separated string
  const sectionsArray = typeof sections === 'string' 
    ? sections.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(sections) ? sections.map(s => s.trim()).filter(Boolean) : [];
    
  if (sectionsArray.length === 0) {
      throw new Error("No valid sections provided to update.");
  }
  
  console.log(`✍️ Starting pageWriter for page: ${slug}, sections: ${sectionsArray.join(', ')}`);
  
  // Use configured path for pages with fallback to default
  const pageDir = config.contentPaths?.pages || path.join(process.cwd(), 'src/data/pages');
  
  // Ensure directory exists before trying to access
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
    console.log(`📁 Created directory: ${pageDir}`);
  }
  
  const pageFilePath = path.join(pageDir, `${slug}.json`);
  
  // Initialize or load existing page data
  let pageData = {};
  const fileExists = fs.existsSync(pageFilePath);
  
  if (fileExists) {
    try {
      pageData = JSON.parse(fs.readFileSync(pageFilePath, 'utf-8'));
      console.log(chalk.blue(`📝 Loaded existing page data for ${slug}`));
    } catch (err) {
      console.error(chalk.red(`❌ Error loading existing page data from ${pageFilePath}: ${err.message}`));
      // If loading fails, maybe we shouldn't proceed?
      throw new Error(`Failed to load existing page data for ${slug}`); 
    }
  } else {
      console.log(chalk.blue(`ℹ️ No existing page file found at ${pageFilePath}. Will create new.`));
  }

  // Process each requested section
  const results = [];
  let updated = false;
  
  for (const section of sectionsArray) {
    console.log(`🧠 Processing section: ${section}`);
    
    // Check if section exists and force is not set (useful if we want granular control)
    // Current logic always overwrites the specified section if it runs.
    // We could add a check here: if (pageData[section] && !force) { skip... }
    
    try {
      // Generate the prompt for this section, potentially using context
      const prompt = generatePromptForSection(slug, section, context);
      
      // Generate content using OpenAI
      console.log(`⏳ Calling OpenAI for ${slug} -> ${section}...`);
      const sectionContent = await generateAIContent(prompt);
      console.log(`✅ OpenAI response received for ${slug} -> ${section}.`);
      
      // Update the page data with the new section content
      pageData[section] = {
        ...sectionContent,
        lastUpdatedAt: new Date().toISOString()
      };
      updated = true; // Mark that we have new data
      
      results.push({
        section,
        status: 'success'
      });
    } catch (err) {
      console.error(chalk.red(`❌ Error generating content for page ${slug}, section ${section}: ${err.message}`));
      results.push({
        section,
        status: 'error',
        error: err.message
      });
    }
  }
  
  // Save the updated page data if changes were made and not dry run
  if (updated && !dryRun) {
    try {
        // Ensure directory exists
        if (!fs.existsSync(pageDir)) {
            fs.mkdirSync(pageDir, { recursive: true });
            console.log(`📁 Created directory: ${pageDir}`);
        }
        fs.writeFileSync(pageFilePath, JSON.stringify(pageData, null, 2));
        console.log(chalk.green(`✅ Saved updated page data to ${pageFilePath}`));
    } catch (saveError) {
        console.error(chalk.red(`❌ Critical error saving page data to ${pageFilePath}: ${saveError.message}`));
        // Add error state to results? 
    }
  } else if (updated && dryRun) {
      console.log(chalk.blue(`\n--- DRY RUN ---`));
      console.log(chalk.yellow(`Would save updated data to: ${pageFilePath}`));
      console.log(chalk.blue('Updated Page Data:'));
      console.log(JSON.stringify(pageData, null, 2)); // Show the potential state
      console.log(chalk.blue(`--- END DRY RUN ---`));
      // Adjust success status for dry run clarity
      results.forEach(r => { if (r.status === 'success') r.status = 'success (dry run)'; });
  } else if (!updated) {
      console.log(chalk.yellow('ℹ️ No sections were successfully updated.'));
  }
  
  // --- Summary --- 
  const successCount = results.filter(r => r.status.startsWith('success')).length;
  const errorCount = results.filter(r => r.status === 'error').length;

  console.log(`
--- pageWriter Summary ---
Page: ${slug}, Sections Attempted: ${sectionsArray.length}
Success: ${successCount}, Errors: ${errorCount}
--------------------------`);

  return {
    type: 'page',
    page: slug,
    processed: sectionsArray.length,
    success: successCount,
    errors: errorCount,
    results
  };
};

/**
 * Generate the prompt for a specific page section
 * @param {string} page - The page name (slug)
 * @param {string} section - The section name
 * @param {Object} context - Optional context
 * @returns {string} - The prompt for OpenAI
 */
function generatePromptForSection(page, section, context) {
  // Add context info if available
  let contextInfo = '';
  if (context?.categoryContext) {
      // Example: Add category info if relevant to the page/section
      // contextInfo += `\n\nCategory Context: ${context.categoryContext.title}\n`;
  }
  if (context?.existingData) {
      // Example: Add existing page data if relevant
      // contextInfo += `\n\nExisting Page Data (excerpt): ... \n`;
  }
    
  // Different prompts for different page sections
  const prompts = {
    home: {
      featured: `
You are writing content for the featured section of the MistressWorld homepage.
This content is for a luxury adult live cam platform focusing on dominatrix models.
${contextInfo}
Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A section title (title)
- A compelling headline (headline)
- A short paragraph introducing the featured models concept (intro)
- 5 featured model entries, each containing:
  * A model name (name)
  * A short description (description)
  * 2-3 keywords (tags)

Return JSON:
{
  "title": "...",
  "headline": "...",
  "intro": "...",
  "models": [
    {
      "name": "...",
      "description": "...",
      "tags": ["...", "..."]
    },
    ... (repeat for 5 models total)
  ],
  "cta": "..."
}
`,
      'top-performers': `
You are writing content for the top performers section of the MistressWorld homepage.
This content is for a luxury adult live cam platform focusing on dominatrix models.
${contextInfo}
Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A section title (title)
- A short intro paragraph about top performers (intro)
- 10 performer entries, each containing:
  * A performer name (name)
  * A very short description (1-2 sentences) (description)
  * A specialty/category (category)

Return JSON:
{
  "title": "...",
  "intro": "...",
  "performers": [
    {
      "name": "...",
      "description": "...",
      "category": "..."
    },
    ... (repeat for 10 performers total)
  ]
}
`,
      trending: `
You are writing content for the trending section of the MistressWorld homepage.
This content is for a luxury adult live cam platform focusing on dominatrix models.
${contextInfo}
Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A section title (title)
- A short paragraph about trending content (intro)
- 6 trending topics/categories, each containing:
  * A topic name (name)
  * A short description (description)
  * A related tag (tag)

Return JSON:
{
  "title": "...",
  "intro": "...",
  "trends": [
    {
      "name": "...",
      "description": "...",
      "tag": "..."
    },
    ... (repeat for 6 trends total)
  ]
}
`
    }
    // Add prompts for other pages if needed
    // 'about-us': { ... }
  };
  
  // Get the prompt for the specified page and section, or a default
  return prompts[page]?.[section] || `
You are writing content for the ${section} section of the ${page} page on MistressWorld.
This content is for a luxury adult live cam platform focusing on dominatrix models.
${contextInfo}
Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A section title (title)
- A compelling headline (headline)
- A short paragraph introducing this section (intro)
- 3-5 content items relevant to this section

Return JSON:
{
  "title": "...",
  "headline": "...",
  "intro": "...",
  "items": [
    {
      "name": "...",
      "description": "..."
    },
    ... (repeat for 3-5 items)
  ]
}
`;
} 