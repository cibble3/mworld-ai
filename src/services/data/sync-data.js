/**
 * Data Synchronization Script
 * 
 * This script synchronizes data between the src/data/ directory and public/data/ directory.
 * This ensures Next.js can serve the content statically without needing backend calls.
 */
const fs = require('fs');
const path = require('path');

// Calculate paths based on the project root
const projectRoot = process.cwd();

// Configuration
const SOURCE_DIR = path.join(projectRoot, 'src/data');
const TARGET_DIR = path.join(projectRoot, 'public/data');

// Initialize
console.log('Starting data synchronization');
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Target: ${TARGET_DIR}`);

// Stats
let filesCopied = 0;
let filesSkipped = 0;
let filesScanned = 0;
let dirsCreated = 0;
let filesRemoved = 0;
let dirsRemoved = 0;
let errors = 0;

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  dirsCreated++;
  console.log(`Created target directory: ${TARGET_DIR}`);
}

// Process all files recursively
syncDirectory(SOURCE_DIR, TARGET_DIR);

// Clean up removed files in target
cleanupTargetDirectory(SOURCE_DIR, TARGET_DIR);

// Print summary
console.log('\nSynchronization complete!');
console.log(`Files scanned: ${filesScanned}`);
console.log(`Files copied: ${filesCopied}`);
console.log(`Files skipped (unchanged): ${filesSkipped}`);
console.log(`Files removed: ${filesRemoved}`);
console.log(`Directories created: ${dirsCreated}`);
console.log(`Directories removed: ${dirsRemoved}`);
console.log(`Errors: ${errors}`);

/**
 * Synchronize a directory recursively
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target directory path
 */
function syncDirectory(sourceDir, targetDir) {
  // Ensure the target directory exists
  if (!fs.existsSync(targetDir)) {
    console.log(`Creating directory: ${path.relative(projectRoot, targetDir)}`);
    fs.mkdirSync(targetDir, { recursive: true });
    dirsCreated++;
  }

  // Read the source directory
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  // Process each entry
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    const relativePath = path.relative(projectRoot, sourcePath);

    if (entry.isDirectory()) {
      // Recursively synchronize subdirectories
      syncDirectory(sourcePath, targetPath);
    } else {
      // Copy files
      filesScanned++;
      
      try {
        // Check if the file needs to be copied
        let shouldCopy = true;
        
        if (fs.existsSync(targetPath)) {
          const sourceStats = fs.statSync(sourcePath);
          const targetStats = fs.statSync(targetPath);
          
          // Skip if target is newer or same age and same size
          if (
            targetStats.mtimeMs >= sourceStats.mtimeMs &&
            targetStats.size === sourceStats.size
          ) {
            shouldCopy = false;
          }
        }
        
        if (shouldCopy) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copied: ${relativePath}`);
          filesCopied++;
        } else {
          filesSkipped++;
        }
      } catch (error) {
        console.error(`Error processing ${relativePath}: ${error.message}`);
        errors++;
      }
    }
  }
}

/**
 * Remove files from target that don't exist in source
 * @param {string} sourceDir - Source directory path
 * @param {string} targetDir - Target directory path
 */
function cleanupTargetDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    return;
  }

  console.log('\nCleaning up target directory...');
  
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const targetPath = path.join(targetDir, entry.name);
    const sourcePath = path.join(sourceDir, entry.name);
    const relativePath = path.relative(projectRoot, targetPath);
    
    if (!fs.existsSync(sourcePath)) {
      try {
        if (entry.isDirectory()) {
          // Remove directory recursively
          removeDirectory(targetPath);
          console.log(`Removed directory: ${relativePath}`);
          dirsRemoved++;
        } else {
          // Remove file
          fs.unlinkSync(targetPath);
          console.log(`Removed file: ${relativePath}`);
          filesRemoved++;
        }
      } catch (error) {
        console.error(`Error removing ${relativePath}: ${error.message}`);
        errors++;
      }
    } else if (entry.isDirectory()) {
      // Recursively clean subdirectories
      cleanupTargetDirectory(sourcePath, targetPath);
    }
  }
}

/**
 * Remove a directory recursively
 * @param {string} dir - Directory path to remove
 */
function removeDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      removeDirectory(fullPath);
    } else {
      fs.unlinkSync(fullPath);
      filesRemoved++;
    }
  }
  
  fs.rmdirSync(dir);
}

// If called directly from command line
if (require.main === module) {
  // You can add command line argument handling here if needed
}

module.exports = {
  syncData: function() {
    // Reset stats
    filesCopied = 0;
    filesSkipped = 0;
    filesScanned = 0;
    dirsCreated = 0;
    filesRemoved = 0;
    dirsRemoved = 0;
    errors = 0;
    
    // Ensure target directory exists
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
      dirsCreated++;
    }
    
    // Process all files recursively
    syncDirectory(SOURCE_DIR, TARGET_DIR);
    
    // Clean up removed files in target
    cleanupTargetDirectory(SOURCE_DIR, TARGET_DIR);
    
    return {
      filesScanned,
      filesCopied,
      filesSkipped,
      filesRemoved,
      dirsCreated,
      dirsRemoved,
      errors
    };
  }
}; 