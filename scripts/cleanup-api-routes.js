/**
 * Cleanup API Routes Script for MistressWorld
 * 
 * This script identifies and cleans up duplicate API routes to prevent build warnings
 * and standardize the API structure.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// API files that are duplicates or no longer needed
const filesToRemove = [
  // Duplicate API routes
  'src/pages/api/categories.js', // Use src/pages/api/categories/index.js instead
  'src/pages/api/free-models.js', // Use src/pages/api/models with provider param instead
  
  // Test API endpoints
  'src/pages/api/test-free-api.js',
  'src/pages/api/awe-test.js',
  'src/pages/api/real-models-test.js',
  'src/pages/api/hello.js',
  'src/pages/api/direct-fetch.js',
  
  // Debug endpoints 
  'src/pages/api/debug-meta.js',
  'src/pages/api/debug-models.js',
];

// Function to remove files
function removeFiles() {
  console.log('🧹 Removing duplicate or obsolete API routes...');
  
  filesToRemove.forEach(filePath => {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`✅ Removed: ${filePath}`);
      } catch (err) {
        console.error(`❌ Error removing ${filePath}:`, err);
      }
    } else {
      console.log(`ℹ️ Not found: ${filePath}`);
    }
  });
}

// Function to update API references
function updateApiRefs() {
  console.log('\n🔄 Updating API references in code...');
  
  // Files that might contain API references
  const filesToCheck = [
    'src/hooks/useModelFeed.js',
    'src/services/api.js',
    'src/services/orchestrator.js',
  ];
  
  const replacements = [
    { from: /['"]\/api\/free-models['"]/g, to: "'/api/models'" },
    { from: /['"]\/api\/categories['"]/g, to: "'/api/categories/'" },
  ];
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let updated = false;
        
        replacements.forEach(({ from, to }) => {
          if (from.test(content)) {
            content = content.replace(from, to);
            updated = true;
          }
        });
        
        if (updated) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`✅ Updated API references in: ${filePath}`);
        } else {
          console.log(`ℹ️ No changes needed in: ${filePath}`);
        }
      } catch (err) {
        console.error(`❌ Error updating references in ${filePath}:`, err);
      }
    } else {
      console.log(`ℹ️ File not found: ${filePath}`);
    }
  });
}

// Main function
function main() {
  console.log('🚀 Starting API routes cleanup...');
  removeFiles();
  updateApiRefs();
  console.log('\n✨ API routes cleanup completed!');
}

// Run the script
main(); 