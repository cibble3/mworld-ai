#!/usr/bin/env node

/**
 * Tag Analysis CLI
 * 
 * Command line tool to analyze tags across providers and identify
 * popular ones for filtering and SEO optimization.
 */

const { Command } = require('commander');
const { refreshTagData } = require('../services/tag-refresher');
const path = require('path');
const fs = require('fs');

// Define the program
const program = new Command();

program
  .name('analyze-tags')
  .description('Analyze tags across providers to find popular keywords')
  .version('1.0.0')
  .option('-m, --min-models <number>', 'Minimum number of models/videos with the tag', 20)
  .option('-o, --output <file>', 'Output file path', 'src/data/popular-tags.json')
  .option('--visualize', 'Create a HTML visualization of tag data')
  .action(async (options) => {
    console.log(`Analyzing tags with minimum ${options.minModels} models...`);
    
    try {
      await refreshTagData(Number(options.minModels));
      
      if (options.visualize) {
        await createVisualization(options.output, options.minModels);
      }
      
      console.log('Tag analysis complete!');
    } catch (error) {
      console.error('Error during tag analysis:', error);
      process.exit(1);
    }
  });

/**
 * Create HTML visualization of tag data
 * @param {string} dataFile - Path to tag data JSON file
 * @param {number} minModels - Minimum models threshold used
 * @returns {Promise<void>}
 */
async function createVisualization(dataFile, minModels) {
  try {
    const fullPath = path.resolve(process.cwd(), dataFile);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    const htmlPath = path.join(process.cwd(), 'tag-analysis.html');
    
    // Create simple HTML visualization
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tag Analysis (${minModels}+ models)</title>
      <style>
        body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        .provider { margin-bottom: 30px; }
        .category { margin-bottom: 20px; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { 
          background: #f3f4f6; padding: 6px 12px; border-radius: 16px; 
          font-size: 14px; display: inline-flex; align-items: center;
        }
        .count { 
          background: #e5e7eb; border-radius: 10px; font-size: 12px;
          margin-left: 6px; padding: 2px 6px;
        }
        .tag:hover { background: #e5e7eb; }
      </style>
    </head>
    <body>
      <h1>Tag Analysis (${minModels}+ models)</h1>
      
      ${Object.entries(data).map(([provider, categories]) => `
        <div class="provider">
          <h2>${provider.toUpperCase()} Provider</h2>
          
          ${Object.entries(categories).map(([category, tags]) => `
            <div class="category">
              <h3>${category === 'all' ? 'All Categories' : category}</h3>
              <p>Found ${tags.length} tags with ${minModels}+ models</p>
              
              <div class="tags">
                ${tags.map(({tag, count}) => `
                  <div class="tag">
                    ${tag} <span class="count">${count}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </body>
    </html>
    `;
    
    fs.writeFileSync(htmlPath, html);
    console.log(`Tag visualization created: ${htmlPath}`);
  } catch (error) {
    console.error('Error creating visualization:', error);
    throw error;
  }
}

// Parse arguments
program.parse(process.argv); 