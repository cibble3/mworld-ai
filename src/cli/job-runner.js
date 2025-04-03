#!/usr/bin/env node

/**
 * Job Runner
 * 
 * Orchestrates content generation jobs by:
 * 1. Reading job configuration
 * 2. Processing command-line arguments
 * 3. Running specified jobs
 * 4. Handling errors and retries
 */

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');
const { createSpinner } = require('nanospinner');

// Import writer modules
const modelWriter = require('../services/ai-writers/modelWriter');
const categoryWriter = require('../services/ai-writers/categoryWriter');
const blogWriter = require('../services/ai-writers/blogWriter');
const pageWriter = require('../services/ai-writers/pageWriter');

// Constants
const CONFIG_PATH = path.join(process.cwd(), 'src/config/jobs.json');
const MAX_RETRIES = 3;

// Define the program
const program = new Command();

program
  .name('job-runner')
  .description('Job runner for automating content generation')
  .version('1.0.0')
  .option('-t, --type <type>', 'Job type (model, category, blog, page)')
  .option('-s, --schedule <schedule>', 'Run a specific schedule from jobs.json')
  .option('-H, --hot-only', 'Only process hot/trending items')
  .option('-c, --category <category>', 'Filter by specific category')
  .option('-l, --limit <limit>', 'Limit the number of items to process')
  .option('--dry-run', 'Show what would be executed without actually running it')
  .option('--force', 'Force regeneration even if content exists')
  .option('--debug', 'Show debug information');

// Parse arguments
program.parse(process.argv);
const options = program.opts();

/**
 * Read job configuration from jobs.json
 * @returns {Object} Job configuration
 */
async function readJobConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return createDefaultConfig();
    }
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (error) {
    console.error('Error reading job config:', error);
    return createDefaultConfig();
  }
}

/**
 * Create default job configuration
 * @returns {Object} Default job configuration
 */
function createDefaultConfig() {
  return {
    schedules: {
      daily: {
        models: { limit: 10, hotOnly: true },
        categories: { limit: 5 },
        blog: { limit: 2 },
        pages: { sections: ['featured', 'trending'] }
      },
      weekly: {
        models: { limit: 50 },
        categories: { limit: 20 },
        blog: { limit: 5 },
        pages: { sections: ['featured', 'trending', 'new'] }
      }
    }
  };
}

/**
 * Run the job runner with the specified options
 * @param {Object} options Command line options
 */
async function run(options = {}) {
  const config = await readJobConfig();
  const { type, schedule, hotOnly, category, limit, dryRun, force, debug } = options;

  if (debug) {
    console.log('Debug mode enabled');
    console.log('Options:', options);
    console.log('Config:', config);
  }

  if (schedule && config.schedules[schedule]) {
    const scheduleConfig = config.schedules[schedule];
    for (const [jobType, jobOptions] of Object.entries(scheduleConfig)) {
      await runWithRetry(jobType, { ...jobOptions, dryRun, force });
    }
    return;
  }

  if (type) {
    await runWithRetry(type, { hotOnly, category, limit, dryRun, force });
    return;
  }

  console.error('Please specify either --type or --schedule');
  process.exit(1);
}

/**
 * Run a job with retry logic
 * @param {string} jobType Type of job to run
 * @param {Object} options Job options
 */
async function runWithRetry(jobType, options) {
  let retries = 0;
  let lastError;

  while (retries < MAX_RETRIES) {
    try {
      const spinner = createSpinner(`Running ${jobType} job...`).start();
      
      let results;
      switch (jobType) {
        case 'models':
          results = await modelWriter.processModels(options);
          break;
        case 'categories':
          results = await categoryWriter.processCategories(options);
          break;
        case 'blog':
          results = await blogWriter.processBlog(options);
          break;
        case 'pages':
          results = await pageWriter.processPage(options);
          break;
        default:
          throw new Error(`Unknown job type: ${jobType}`);
      }

      spinner.success();
      printSummary(results);
      return results;
    } catch (error) {
      lastError = error;
      retries++;
      if (retries < MAX_RETRIES) {
        console.log(chalk.yellow(`Retry ${retries}/${MAX_RETRIES} after error:`, error.message));
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  console.error(chalk.red(`Failed after ${MAX_RETRIES} retries:`, lastError.message));
  throw lastError;
}

/**
 * Print job execution summary
 * @param {Object} results Job results
 */
function printSummary(results) {
  console.log('\nJob Summary:');
  console.log('------------');
  if (results.success) {
    console.log(chalk.green('✅ Job completed successfully'));
  } else {
    console.log(chalk.red('❌ Job failed'));
  }
  if (results.stats) {
    console.log('\nStatistics:');
    Object.entries(results.stats).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }
}

// Run the job runner
run(options).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});