const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to remove completely
const dirsToRemove = [
  '.next',
  'node_modules',
  'logs',
  '.git'
];

// Individual files to remove
const filesToRemove = [
  '.DS_Store',
  'src/.DS_Store',
  'test-chaturbate-api.js',
  'trans.json',
  'girls.json',
  'homepage.html',
  'fetish_response.json',
  '.env.example',
  // Uncomment these if they're not needed in production
  // 'ROADMAP.md',
  // 'README.md',
  // '.env.local',
];

// Find all .DS_Store files recursively
function findDSStoreFiles() {
  try {
    const result = execSync('find . -name ".DS_Store"', { encoding: 'utf8' });
    return result.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding .DS_Store files:', error);
    return [];
  }
}

// Remove a directory or file
function removeItem(itemPath) {
  try {
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        console.log(`Removing directory: ${itemPath}`);
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        console.log(`Removing file: ${itemPath}`);
        fs.unlinkSync(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error removing ${itemPath}:`, error);
  }
}

// Main cleanup function
function cleanup() {
  console.log('Starting cleanup process...');
  
  // Remove directories
  dirsToRemove.forEach(dir => removeItem(dir));
  
  // Remove specific files
  filesToRemove.forEach(file => removeItem(file));
  
  // Find and remove all .DS_Store files
  const dsStoreFiles = findDSStoreFiles();
  dsStoreFiles.forEach(file => removeItem(file));
  
  console.log('Cleanup completed!');
  
  // Calculate the size of the remaining files
  try {
    console.log('\nCurrent directory size:');
    execSync('du -sh .', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error calculating directory size:', error);
  }
}

cleanup(); 