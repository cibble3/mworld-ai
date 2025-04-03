/**
 * Setup AI Writer
 * 
 * Ensures all required directories and configuration for the AI writer system exist
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Calculate paths based on the project root
const projectRoot = process.cwd();

// Define required directories
const requiredDirs = [
  'src/data',
  'src/data/models',
  'src/data/models/asian',
  'src/data/models/ebony',
  'src/data/models/latina',
  'src/data/models/white',
  'src/data/models/transgender',
  'src/data/blog',
  'src/data/pages',
  'src/data/categories',
  'src/data/videos',
  'logs'
];

console.log('🏗️ Setting up AI writer directories...');
for (const dir of requiredDirs) {
  const dirPath = path.join(projectRoot, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  } else {
    console.log(`✅ Exists: ${dir}`);
  }
}

// Check if public/data directories also need to be created for static serving
const publicDirs = [
  'public/data',
  'public/data/models',
  'public/data/blog',
  'public/data/pages',
  'public/data/categories'
];

console.log('\n🏗️ Setting up public data directories for static serving...');
for (const dir of publicDirs) {
  const dirPath = path.join(projectRoot, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  } else {
    console.log(`✅ Exists: ${dir}`);
  }
}

// Ensure config contains OpenAI settings
const configPath = path.join(projectRoot, 'src/config/index.js');
if (fs.existsSync(configPath)) {
  console.log('\n✅ Config file exists, checking for OpenAI settings...');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  if (!configContent.includes('openai:') && !configContent.includes('OPENAI_API_KEY')) {
    console.log('⚠️ WARNING: OpenAI configuration might be missing from src/config/index.js');
    console.log('Please ensure you have the following in your config:');
    console.log(`
openai: {
  apiKey: process.env.OPENAI_API_KEY
},`);
  } else {
    console.log('✅ OpenAI configuration appears to be present in config.');
  }
} else {
  console.log('\n⚠️ WARNING: Config file not found at expected location (src/config/index.js)');
}

// Check if .env contains OPENAI_API_KEY
const envPath = path.join(projectRoot, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('OPENAI_API_KEY')) {
    console.log('\n⚠️ IMPORTANT: Please add your OpenAI API key to .env file:');
    console.log('OPENAI_API_KEY=your_key_here');
  } else {
    console.log('\n✅ OPENAI_API_KEY found in .env file.');
  }
} else {
  console.log('\n⚠️ WARNING: .env file not found. Please create one with OPENAI_API_KEY.');
}

// Check for required packages
const requiredPackages = [
  'openai',
  'chalk',
  'nanospinner'
];

console.log('\n🔍 Checking for required packages...');
try {
  const packageJson = require(path.join(projectRoot, 'package.json'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const missingPackages = requiredPackages.filter(pkg => !dependencies[pkg]);
  
  if (missingPackages.length > 0) {
    console.log(`⚠️ Missing packages: ${missingPackages.join(', ')}`);
    console.log('Please install them with:');
    console.log(`npm install ${missingPackages.join(' ')}`);
  } else {
    console.log('✅ All required packages are installed.');
  }
} catch (error) {
  console.error('❌ Error checking package.json:', error.message);
}

console.log(`
🚀 Setup Complete!

To generate AI content, use the CLI:
  node src/cli/ai-writer.js --type=<model|category|blog|page> [options]

Examples:
  node src/cli/ai-writer.js --type=model --category=asian --slug=example-model
  node src/cli/ai-writer.js --type=category --category=ebony
  node src/cli/ai-writer.js --type=blog --title="Example Blog Post"
  node src/cli/ai-writer.js --type=page --slug=home --sections=featured,trending

Run with --dryRun to see what would be generated without saving.
`); 