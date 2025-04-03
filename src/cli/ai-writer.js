/**
 * AI Content Writer CLI (Migrated)
 * 
 * Command-line interface for generating AI content for MistressWorld.
 * Uses specific writer services and central configuration.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');
const { createSpinner } = require('nanospinner');
const config = require('../config'); // Use central config

// --- Load Writer Services --- 
// Adjusted paths to the new location
// --- Temporarily modified to load ONLY the requested writer --- 
async function loadWriters(type) { // Pass type argument
  let writerService = null;
  let contextExtractor = null;
  
  try {
    // Load ONLY the requested writer service dynamically
    switch (type) {
      case 'model':
        writerService = require('../services/ai-writers/modelWriter.js');
        break;
      case 'category':
        writerService = require('../services/ai-writers/categoryWriter.js');
        break;
      case 'blog':
        writerService = require('../services/ai-writers/blogWriter.js');
        break;
      case 'page':
        writerService = require('../services/ai-writers/pageWriter.js');
        break;
      default:
        throw new Error(`Unknown writer type requested: ${type}`);
    }

    // Handle context extractor - Check if it exists in the new utils path
    const contextExtractorPath = path.resolve(__dirname, '../services/ai-writers/utils/context-extractor.mjs');
    if (fs.existsSync(contextExtractorPath)) {
        try {
          const extractor = await import(contextExtractorPath);
          contextExtractor = extractor.default;
          console.log('ℹ️ Context extractor loaded.');
        } catch (contextError) {
          console.warn(chalk.yellow(`⚠️ Warning: Failed to load context extractor: ${contextError.message}`));
        }
    } else {
        console.log('ℹ️ Context extractor not found at new location, skipping.');
    }
    
    // Return only the loaded service and extractor
    return {
      writerService, 
      contextExtractor
    };
  } catch (error) {
    console.error(chalk.red(`❌ Error loading writer service for type ${type}: ${error.message}`));
    process.exit(1);
  }
}

// --- CLI Definition --- 
const program = new Command();
program
  .name('ai-writer')
  .description('AI Content Writer CLI for MistressWorld (Migrated)')
  .version('1.2.0') // Updated version
  .option('-t, --type <type>', 'Content type (model, category, blog, page)')
  .option('-c, --category <categorySlug>', 'Category slug (e.g., asian, ebony, latina) - used by model, category writers')
  .option('-s, --slug <contentSlug>', 'Content slug or identifier (e.g., model-name, page-name)')
  .option('-T, --title <title>', 'Content title (mainly for blog posts)')
  .option('--subcategories <subcategories>', 'Comma-separated list of subcategory slugs for category writer')
  .option('--sections <sections>', 'Comma-separated list of sections to update for page writer')
  .option('--comprehensive', 'Generate comprehensive content (flag passed to writer)')
  .option('--dryRun', 'Show generated content without saving')
  .option('--force', 'Force regeneration even if content seems up-to-date')
  .option('--debug', 'Show debug information');

// --- Argument Validation --- 
const validateArgs = (type, options) => {
  // Use slightly updated validation logic based on writer expectations
  switch (type) {
    case 'model':
      // Check for the correct option key 'category' parsed by commander
      if (!options.category) { 
        console.error(chalk.red('❌ Error: Category slug is required for type=model (--category <slug>)'));
        return false;
      }
      // Note: modelWriter might operate on the whole category unless a slug is given
      // if (!options.slug) { // Check for 'slug'
      //   console.error(chalk.red('Error: Slug is required for model content (--slug <slug>)'));
      //   return false;
      // }
      break;
    case 'category':
      // Check for the correct option key 'category'
      if (!options.category) { 
        console.error(chalk.red('❌ Error: Category slug is required for type=category (--category <slug>)'));
        return false;
      }
      // Subcategories are optional, handled by categoryWriter
      break;
    case 'blog': // Keep if blogWriter is migrated
      // Check for 'title' or 'slug'
      if (!options.title && !options.slug) { 
        console.error(chalk.red('❌ Error: Either title or slug is required for type=blog (--title <title> or --slug <slug>)'));
        return false;
      }
      // Tags are optional
      break;
    case 'page': // Keep if pageWriter is migrated
      // Check for 'slug'
      if (!options.slug) { 
        console.error(chalk.red('❌ Error: Slug is required for type=page (--slug <slug>)'));
        return false;
      }
      // Check for 'sections'
      if (!options.sections) { 
        console.error(chalk.red('❌ Error: Sections are required for type=page (--sections <section1,section2>)'));
        return false;
      }
      break;
    default:
      console.error(chalk.red(`❌ Error: Unknown content type: ${type}`));
      return false;
  }
  return true;
};

// --- Main Execution Logic --- 
async function main() {
  program.parse(process.argv);
  const options = program.opts();

  // Rename options for clarity and correct destructuring from commander's output
  const { 
      type, 
      category: categorySlug, // Rename category to categorySlug
      slug: contentSlug,      // Rename slug to contentSlug
      title, 
      subcategories,
      sections,         // Added sections
      comprehensive, 
      dryRun, 
      force, 
      debug 
  } = options;

  if (!type) {
    console.error(chalk.red('❌ Error: Content type is required (--type=model|category|...)'));
    program.help();
    process.exit(1);
  }

  if (!validateArgs(type, options)) {
    process.exit(1);
  }
  
  if (debug) {
    console.log(chalk.blue('🔧 Debug: Parsed Options'), options);
    console.log(chalk.blue('🔧 Debug: Loaded Config'), config);
  }
  
  // Check for OpenAI API key via config
  if (!config.openai?.apiKey) {
    console.error(chalk.red('❌ Error: OPENAI_API_KEY configuration is missing.'));
    console.log(chalk.yellow('Ensure OPENAI_API_KEY is set in your .env file or environment variables.'));
    process.exit(1);
  }
  
  // Load writer services - passing the type
  const loadSpinner = createSpinner('Loading AI writer services...').start();
  const { writerService, contextExtractor } = await loadWriters(type);
  loadSpinner.success({ text: 'AI writer services loaded' });
  
  // Get the appropriate writer service (already loaded)
  // const writerService = writers[type]; // Old logic
  if (!writerService) {
    console.error(chalk.red(`❌ Error: No writer service found for content type: ${type}`));
    process.exit(1);
  }
  
  // --- Context Extraction (Optional) --- 
  let generationContext = null;
  // Check the loaded contextExtractor directly
  if (contextExtractor) { 
    const contextSpinner = createSpinner('Extracting content context...').start();
    try {
      // Pass relevant options to context extractor
      generationContext = await contextExtractor.createGenerationContext({
          type, categorySlug, contentSlug, title, // Pass identifiers
          // Add other relevant data source paths or info if needed by extractor
      });
      contextSpinner.success({ text: 'Context extracted successfully' });
      if (debug) {
        console.log(chalk.blue('🔧 Debug: Generation Context'), JSON.stringify(generationContext, null, 2));
      }
    } catch (error) {
      contextSpinner.error({ text: `⚠️ Error extracting context: ${error.message}` });
      // Continue without context if extraction fails but is optional
    }
  }
  
  // --- Determine Output Path & Check Existence --- 
  // Use config paths
  let outputDir = '';
  let outputFilename = '';
  
  switch(type) {
      case 'model':
          if (!categorySlug) throw new Error('Category slug missing for model type');
          outputDir = path.join(config.contentPaths.models, categorySlug);
          // If a specific slug is given, target that file. modelWriter handles the logic.
          outputFilename = contentSlug ? `${contentSlug}.json` : null; 
          break;
      case 'category':
          if (!categorySlug) throw new Error('Category slug missing for category type');
          outputDir = config.contentPaths.categories;
          outputFilename = `${categorySlug}.json`;
          break;
      case 'blog':
          // Ensure blog path exists in config, or use default
          outputDir = config.contentPaths.blog || path.join(process.cwd(), 'src/data/blog');
          const blogSlug = contentSlug || (title ? generateSlug(title) : null);
          outputFilename = blogSlug ? `${blogSlug}.json` : null;
          break;
      case 'page':
          // Ensure pages path exists in config, or use default
          outputDir = config.contentPaths.pages || path.join(process.cwd(), 'src/data/pages');
          outputFilename = contentSlug ? `${contentSlug}.json` : null;
          break;
      // Add cases for blog, page if migrated
      default:
          throw new Error(`Unhandled content type for path determination: ${type}`);
  }

  const fullPath = outputFilename ? path.join(outputDir, outputFilename) : null;
  
  // Note: The individual writer services now handle the existence check and `--force` logic internally.
  // This CLI script mainly orchestrates calling the correct service.
  if (fullPath) {
      console.log(`ℹ️ Writer will target path (or scan directory if no specific slug): ${fullPath || outputDir}`);
  } else if (type === 'model' && !contentSlug) {
       console.log(`ℹ️ Writer will scan directory: ${outputDir}`);
  }

  // --- Generate Content --- 
  const generationSpinner = createSpinner(`Generating ${type} content...`).start();
  
  try {
    // Call the writer service with all relevant options
    const writerArgs = {
        category: categorySlug, // Pass categorySlug as 'category' to model/category writers
        slug: contentSlug,      // Pass contentSlug as 'slug' to model/page writers
        title: title,           // Pass title to blog writer
        topic: title || contentSlug, // Provide a topic fallback for blog writer
        subcategories: subcategories,
        sections: sections,     // Pass sections to page writer
        context: generationContext,
        force: force,
        comprehensive: comprehensive,
        dryRun: dryRun, // Pass dryRun flag down
        // Pass any other options the writer might need
    };
    
    if (debug) {
        console.log(chalk.blue('🔧 Debug: Arguments passed to writer service'), writerArgs);
    }

    const result = await writerService(writerArgs);
    
    generationSpinner.success({ text: `${type} content generation process completed.` });
    console.log(chalk.blue('📊 Writer Service Result:'), result);
    
    // Dry Run Output (if specified)
    if (dryRun) {
      console.log(chalk.yellow(`
--- DRY RUN MODE ---`));
      console.log(chalk.yellow(`No files were saved.`));
      // Output depends on what the writer returns. If it returns the generated content:
      // if (result.generatedContent) {
      //     console.log(chalk.blue(' hypothetical content:'));
      //     console.log(JSON.stringify(result.generatedContent, null, 2));
      // }
      console.log(chalk.yellow(`--- END DRY RUN ---`));
      return; // Exit after dry run
    }

    // Note: Saving is handled within the writer services now.
    // Remove the old saving logic and sync-data call from here.
    // console.log(chalk.green(`\nContent saved/updated successfully.`)); // Log based on result

  } catch (error) {
    generationSpinner.error({ text: `❌ Error during content generation process: ${error.message}` });
    if (debug) {
      console.error(chalk.red('\nError details:'), error);
    }
    process.exit(1);
  }
}

// --- Additional Utilities --- 
/**
 * Generate a slug from a title or text
 * @param {string} text - The text to generate a slug from
 * @returns {string} - The slug
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove non-word chars
    .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

// --- Execute Main Function --- 
main().catch(err => {
    console.error(chalk.red('🆘 Unhandled error in AI Writer CLI:'), err);
    process.exit(1);
});