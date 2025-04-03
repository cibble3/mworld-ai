const fs = require('fs');
const path = require('path');
// Use absolute path based on process.cwd() which should be the project root
const config = require(path.join(process.cwd(), 'src/config'));
const { generateAIContent } = require('./utils/ai.js'); // Explicit path
const chalk = require('chalk');
const { validateContent } = require('../content-quality/validator');

const BLOG_DIR = path.join(process.cwd(), 'src/data/blog');

/**
 * Generate AI content for blog posts
 * @param {Object} args - Arguments including topic, title, tags, limit, context, force, dryRun
 * @returns {Object} - Result of the operation
 */
module.exports = async function blogWriter(args) {
  // Destructure arguments, providing defaults. Use title primarily, fallback to topic.
  const { 
    title, // Primary identifier from CLI?
    topic, // Fallback/alternative input
    tags = '',
    limit = 1, 
    context, // Received from context extractor
    force = false, 
    dryRun = false 
  } = args;
  
  // Determine the primary topic string to work with
  const effectiveTopic = title || topic;

  if (!effectiveTopic) {
    throw new Error("Missing required parameter: title or topic must be provided.");
  }
  
  // For now, blog writer works on a single topic/title at a time. Limit is less relevant here.
  console.log(`✍️ Starting blogWriter for topic/title: "${effectiveTopic}"`);
  
  // Use configured path for blog posts with fallback to default
  const blogDir = config.contentPaths?.blog || path.join(process.cwd(), 'src/data/blog');
  
  // Ensure directory exists
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
    console.log(`📁 Created directory: ${blogDir}`);
  }
  
  const results = [];
  let processedCount = 0;
  
  // Process the single effective topic
  try {
    processedCount = 1;
    console.log(`🧠 Processing blog topic: "${effectiveTopic}"`);
    
    // Generate slug from the effective topic
    const slug = generateSlug(effectiveTopic);
    const filePath = path.join(blogDir, `${slug}.json`);
    
    // Check if file exists and if force is not applied
    const fileExists = fs.existsSync(filePath);
    if (fileExists && !force) {
        console.log(chalk.yellow(`⏩ Blog post ${slug} already exists. Use --force to overwrite.`));
        results.push({ topic: effectiveTopic, slug, status: 'skipped', reason: 'exists' });
    } else {
        // Generate the prompt for this blog post
        const prompt = generatePrompt(effectiveTopic, tags, context); // Pass context
        
        // Generate content using OpenAI
        console.log(`⏳ Calling OpenAI for ${slug}...`);
        const blogContent = await generateAIContent(prompt);
        console.log(`✅ OpenAI response received for ${slug}.`);
        
        // Add metadata
        const contentToSave = {
            ...blogContent,
            title: blogContent.title || effectiveTopic, // Use AI title if available, else the input
            topic: effectiveTopic, 
            slug,
            tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            pubDate: fileExists ? (await fs.promises.stat(filePath)).birthtime.toISOString() : new Date().toISOString(), // Preserve original pubDate if overwriting
            lastUpdatedAt: new Date().toISOString()
        };
        
        if (dryRun) {
            console.log(chalk.blue(`\n--- DRY RUN ---`));
            console.log(chalk.yellow(`Would save to: ${filePath}`));
            console.log(chalk.blue('Generated Content:'));
            console.log(JSON.stringify(contentToSave, null, 2));
            console.log(chalk.blue(`--- END DRY RUN ---`));
             results.push({ topic: effectiveTopic, slug, status: 'success (dry run)' });
        } else {
            // Ensure directory exists before writing
            if (!fs.existsSync(blogDir)) {
                fs.mkdirSync(blogDir, { recursive: true });
                console.log(`📁 Created directory: ${blogDir}`);
            }
            // Save the blog post
            fs.writeFileSync(filePath, JSON.stringify(contentToSave, null, 2));
            console.log(chalk.green(`✅ Saved blog post: ${filePath}`));
            results.push({ topic: effectiveTopic, slug, status: 'success', path: filePath });
        }
    }
  } catch (err) {
    console.error(chalk.red(`❌ Error generating blog post for topic ${effectiveTopic}: ${err.message}`));
    if (err.message.includes('AI response was not valid JSON')) {
        // Log more details if parsing failed
    }
    results.push({ topic: effectiveTopic, slug: generateSlug(effectiveTopic), status: 'error', error: err.message });
  }
  
  // --- Summary --- 
  const successCount = results.filter(r => r.status.startsWith('success')).length;
  const skippedCount = results.filter(r => r.status === 'skipped').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  console.log(`
--- blogWriter Summary ---
Processed: ${processedCount}, Success: ${successCount}, Skipped: ${skippedCount}, Errors: ${errorCount}
---------------------------`);

  return {
    type: 'blog',
    processed: processedCount,
    success: successCount,
    skipped: skippedCount,
    errors: errorCount,
    results
  };
};

/**
 * Generate a slug from a topic
 * @param {string} topic - The blog topic
 * @returns {string} - The slug
 */
function generateSlug(topic) {
  return topic
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove non-word chars
    .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

/**
 * Generate the prompt for a blog post
 * @param {string} topic - The blog topic
 * @param {string} tags - Tags for the blog post
 * @param {Object} context - Optional context from context-extractor
 * @returns {string} - The prompt for OpenAI
 */
function generatePrompt(topic, tags, context) {
  let contextInfo = '';
  if (context?.relatedContent?.length > 0) {
      contextInfo += `\n\nRelated blog posts for context:\n`;
      context.relatedContent.forEach(item => {
          contextInfo += `- ${item.title || item.name} (Tags: ${item.tagOverlap.join(', ')})\n`;
      });
  }
  // Add other context if needed

  return `
You are writing a blog post for MistressWorld, a luxury adult live cam platform.

Topic: ${topic}
Tags: ${tags}
${contextInfo}
Tone: Sophisticated, seductive, poetic. No vulgarity.

Write:
- A compelling title for the blog post (title)
- A short introduction paragraph (intro)
- 4-6 sections of content (sections), each with:
  * A section heading (heading)
  * A section body (content)
- A conclusion paragraph (conclusion)
- A meta title and description for SEO (metaTitle, metaDesc)
- A list of 5-8 related topics or tags (relatedTopics)
- A list of 3 custom calls-to-action (ctas)

Images will be added separately, so focus on writing engaging content.

Return JSON:
{
  "title": "...",
  "intro": "...",
  "sections": [
    {
      "heading": "...",
      "content": "..."
    },
    {
      "heading": "...",
      "content": "..."
    },
    ...
  ],
  "conclusion": "...",
  "metaTitle": "...",
  "metaDesc": "...",
  "relatedTopics": ["...", "...", "..."],
  "ctas": ["...", "...", "..."]
}
`;
}

/**
 * Generate blog content with quality validation
 * @param {string} title - Blog post title
 * @param {string} topic - Blog post topic/focus
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generation results
 */
async function generateBlogContent(title, topic = '', options = {}) {
  const {
    dryRun = false,
    maxAttempts = 3,
    forceGenerate = false
  } = options;

  console.log(`Generating blog content for "${title}"...`);
  
  try {
    // Create blog directory if it doesn't exist
    if (!fs.existsSync(BLOG_DIR)) {
      console.log('Creating blog directory...');
      fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const filePath = path.join(BLOG_DIR, `${slug}.json`);
    
    // Check if file already exists and we're not forcing regeneration
    if (fs.existsSync(filePath) && !forceGenerate) {
      console.log('Blog post already exists. Use forceGenerate option to override.');
      return { skipped: true, reason: 'already_exists' };
    }

    let attempts = 0;
    let content;
    let validationResult;

    // Generate content until it passes validation or max attempts reached
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}...`);

      // Generate initial content
      content = await generateInitialContent(title, topic);
      
      // Validate content
      validationResult = validateContent(content, 'blog');
      
      if (validationResult.isValid) {
        console.log('Content passed quality validation.');
        break;
      } else {
        console.log('Content failed quality validation:');
        validationResult.errors.forEach(error => console.log(`  - ${error}`));
        
        if (attempts < maxAttempts) {
          console.log('Attempting to improve content...');
          content = await improveContent(content, validationResult);
        }
      }
    }

    // If we couldn't generate valid content
    if (!validationResult.isValid) {
      console.log('Failed to generate valid content after maximum attempts.');
      return {
        success: false,
        reason: 'validation_failed',
        validation: validationResult
      };
    }

    // Save content if not dry run
    if (!dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`Blog post saved to ${filePath}`);
    } else {
      console.log('Dry run - content not saved');
    }

    return {
      success: true,
      content,
      validation: validationResult,
      attempts,
      path: filePath
    };
  } catch (error) {
    console.error('Error generating blog content:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate initial blog content
 * @param {string} title - Blog post title
 * @param {string} topic - Blog post topic
 * @returns {Promise<Object>} - Generated content
 */
async function generateInitialContent(title, topic) {
  // TODO: Implement OpenAI call here
  // This is a placeholder that would be replaced with actual OpenAI integration
  return {
    title,
    topic,
    introduction: "Sample introduction...",
    sections: [
      {
        heading: "First Section",
        content: "Sample content..."
      }
    ],
    conclusion: "Sample conclusion...",
    meta: {
      description: "Sample meta description..."
    },
    keywords: ["sample", "keywords"],
    timestamp: new Date().toISOString()
  };
}

/**
 * Improve content based on validation feedback
 * @param {Object} content - Original content
 * @param {Object} validation - Validation results
 * @returns {Promise<Object>} - Improved content
 */
async function improveContent(content, validation) {
  // TODO: Implement OpenAI call here to improve content based on validation feedback
  // This is a placeholder that would be replaced with actual OpenAI integration
  return content;
}

module.exports = {
  generateBlogContent
}; 