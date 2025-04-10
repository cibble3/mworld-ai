/**
 * Cleanup Script for MistressWorld Route Standardization
 * 
 * This script removes obsolete files and ensures the codebase
 * follows the standardized route hierarchy.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Files to remove (old, test, disabled)
const filesToRemove = [
  // Old category pages
  'src/pages/girls-old.js',
  'src/pages/trans-old.js',
  
  // Test files
  'src/pages/test-direct-models.js',
  'src/pages/test-free.js',
  'src/pages/minimal-test.js',
  
  // Disabled files
  'src/pages/slug.jsx.disabled',
  'src/pages/_disabled_slug.jsx',
  'src/pages/[[...slug]].jsx.old',
  
  // Debug files
  'src/pages/debug-free.js',
  'src/pages/filter-test.js',
  
  // Old layout files (now using unified layout)
  // Only add if you've confirmed these are fully replaced
  // 'src/theme/layouts/ModernLayout.jsx', 
  // 'src/theme/layouts/AppLayout.jsx',
];

// Directories containing pages to standardize
const directoriesToStandardize = [
  'src/pages/[category]',
  'src/pages/free',
  'src/pages/trans',
  'src/pages/girls',
  'src/pages/videos',
];

// Function to remove files
function removeFiles() {
  console.log('Removing obsolete files...');
  
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

// Function to standardize imports in a file
function standardizeImports(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) return;
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace legacy imports with standardized ones
    const importReplacements = [
      {
        from: /import ModelCard from ['"]@\/components\/cards\/ModelCard['"]/g,
        to: "import ModelCard from '@/theme/components/common/ModelCard'"
      },
      {
        from: /import FreeModelCard from ['"]@\/components\/cards\/FreeModelCard['"]/g,
        to: "import ModelCard from '@/theme/components/common/ModelCard'"
      },
      {
        from: /import FetishModelCard from ['"]@\/components\/cards\/FetishModelCard['"]/g,
        to: "import ModelCard from '@/theme/components/common/ModelCard'"
      },
      {
        from: /import ModernLayout from ['"]@\/theme\/layouts\/ModernLayout['"]/g,
        to: "import ThemeLayout from '@/theme/layouts/ThemeLayout'"
      },
      {
        from: /import AppLayout from ['"]@\/theme\/layouts\/AppLayout['"]/g,
        to: "import ThemeLayout from '@/theme/layouts/ThemeLayout'"
      },
      {
        from: /<ModernLayout/g,
        to: "<ThemeLayout"
      },
      {
        from: /<\/ModernLayout>/g,
        to: "</ThemeLayout>"
      },
      {
        from: /<AppLayout/g,
        to: "<ThemeLayout"
      },
      {
        from: /<\/AppLayout>/g,
        to: "</ThemeLayout>"
      }
    ];
    
    // Apply all replacements
    importReplacements.forEach(replacement => {
      content = content.replace(replacement.from, replacement.to);
    });
    
    // Write the modified content back
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Standardized imports in: ${filePath}`);
  } catch (err) {
    console.error(`❌ Error standardizing ${filePath}:`, err);
  }
}

// Function to standardize route files
function standardizeRoutes() {
  console.log('\nStandardizing route files...');
  
  directoriesToStandardize.forEach(dirPath => {
    const fullDirPath = path.resolve(process.cwd(), dirPath);
    
    if (!fs.existsSync(fullDirPath)) {
      console.log(`ℹ️ Directory not found: ${dirPath}`);
      return;
    }
    
    // Get all JS files in the directory
    const files = fs.readdirSync(fullDirPath)
      .filter(file => file.endsWith('.js') || file.endsWith('.jsx'))
      .map(file => path.join(dirPath, file));
    
    // Standardize each file
    files.forEach(standardizeImports);
  });
}

// Main function
function main() {
  console.log('🧹 Starting route cleanup and standardization...');
  removeFiles();
  standardizeRoutes();
  console.log('\n✨ Cleanup completed!');
}

// Run the script
main(); 