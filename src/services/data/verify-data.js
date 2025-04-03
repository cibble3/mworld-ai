/**
 * Data Verification Script
 * 
 * This script verifies that all required data files for the AI content system
 * exist and are properly structured.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Calculate paths based on the project root
const projectRoot = process.cwd();

// Define critical directories and files to check
const CRITICAL_PATHS = [
  'src/data/pages/home.json',
  'public/data/pages/home.json',
];

// Define data schemas to validate against
const SCHEMAS = {
  'home': {
    required: ['featured', 'top-performers', 'trending'],
    featured: ['title', 'headline', 'intro', 'models', 'cta'],
    'top-performers': ['title', 'intro', 'performers'],
    trending: ['title', 'intro', 'trends']
  }
};

/**
 * Format file path for the current OS
 * @param {string} filepath - The file path to format
 * @returns {string} - Formatted path
 */
function formatPathForOs(filepath) {
  return process.platform === 'win32' ? filepath.replace(/\//g, '\\') : filepath;
}

/**
 * Verify that a file exists
 * @param {string} filepath - Path to the file to check
 * @returns {boolean} - Whether the file exists
 */
function verifyFileExists(filepath) {
  const formattedPath = path.join(projectRoot, formatPathForOs(filepath));
  try {
    const exists = fs.existsSync(formattedPath);
    if (exists) {
      console.log(chalk.green(`✓ File exists: ${filepath}`));
      return true;
    } else {
      console.log(chalk.red(`✗ File missing: ${filepath}`));
      return false;
    }
  } catch (err) {
    console.error(chalk.red(`Error checking file: ${filepath}`), err);
    return false;
  }
}

/**
 * Verify JSON content against a schema
 * @param {string} filepath - Path to the JSON file
 * @param {Object} schema - Schema to validate against
 * @returns {boolean} - Whether the content is valid
 */
function verifyJsonContent(filepath, schema) {
  const formattedPath = path.join(projectRoot, formatPathForOs(filepath));
  try {
    const data = JSON.parse(fs.readFileSync(formattedPath, 'utf8'));
    
    console.log(chalk.blue(`Validating schema for ${path.basename(filepath)}...`));
    
    // Check for required sections
    for (const section of schema.required) {
      if (!data[section]) {
        console.log(chalk.red(`✗ Missing required section: ${section}`));
        return false;
      }
      
      // If section exists, check for required fields in that section
      if (schema[section]) {
        for (const field of schema[section]) {
          if (data[section] && !data[section][field]) {
            console.log(chalk.red(`✗ Missing required field: ${section}.${field}`));
            return false;
          }
        }
      }
    }
    
    console.log(chalk.green(`✓ Valid schema for ${path.basename(filepath)}`));
    return true;
  } catch (err) {
    console.error(chalk.red(`Error reading or parsing JSON: ${filepath}`), err);
    return false;
  }
}

/**
 * Verify data consistency between src/data and public/data
 */
function verifyDataConsistency() {
  console.log(chalk.blue('Verifying data consistency...'));
  
  // For each file, check if it exists in both src/data/ and public/data/
  try {
    const dataDir = path.join(projectRoot, formatPathForOs('src/data'));
    const publicDataDir = path.join(projectRoot, formatPathForOs('public/data'));
    
    // Skip if directories don't exist
    if (!fs.existsSync(dataDir)) {
      console.log(chalk.yellow(`Directory doesn't exist: src/data`));
      return;
    }
    
    if (!fs.existsSync(publicDataDir)) {
      console.log(chalk.yellow(`Directory doesn't exist: public/data`));
      return;
    }
    
    // Walk directories recursively
    function walkDir(dir, callback) {
      fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
      });
    }
    
    const dataFiles = [];
    walkDir(dataDir, file => {
      if (file.endsWith('.json')) {
        dataFiles.push(file);
      }
    });
    
    dataFiles.forEach(file => {
      const relativePath = path.relative(dataDir, file);
      const publicPath = path.join(publicDataDir, relativePath);
      
      if (fs.existsSync(publicPath)) {
        console.log(chalk.green(`✓ File exists in both locations: ${relativePath}`));
      } else {
        console.log(chalk.yellow(`! File exists in src/data/ but not in public/data/: ${relativePath}`));
      }
    });
    
  } catch (err) {
    console.error(chalk.red('Error checking data consistency:'), err);
  }
}

/**
 * Main verification function
 */
function verifyData() {
  console.log(chalk.blue('Verifying AI content system data...'));
  
  let results = {
    criticalPathsExist: true,
    schemaIsValid: true,
    dataConsistencyIssues: false
  };
  
  // First, verify all critical paths exist
  for (const filepath of CRITICAL_PATHS) {
    if (!verifyFileExists(filepath)) {
      results.criticalPathsExist = false;
    }
  }
  
  // If critical paths exist, verify their content matches expected schemas
  if (results.criticalPathsExist) {
    results.schemaIsValid = verifyJsonContent('src/data/pages/home.json', SCHEMAS.home) && 
                          verifyJsonContent('public/data/pages/home.json', SCHEMAS.home);
  }
  
  // Check consistency between data/ and public/data/
  verifyDataConsistency();
  
  console.log(chalk.blue('Verification complete!'));
  
  return results;
}

// If called directly from command line
if (require.main === module) {
  verifyData();
}

module.exports = {
  verifyData,
  verifyFileExists,
  verifyJsonContent,
  verifyDataConsistency
}; 