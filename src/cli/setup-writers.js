/**
 * AI Writer Setup and Verification Script
 * 
 * This script sets up the AI writer system, ensures all required directories exist,
 * and verifies that the data structure is correct.
 */

const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Calculate path to root
const projectRoot = process.cwd();

async function main() {
  console.log(chalk.blue('🚀 Starting AI Writer Setup and Verification\n'));
  
  try {
    // Step 1: Run directory setup
    console.log(chalk.blue('📂 Setting up directories...\n'));
    require('../services/ai-writers/setup-ai-writer');
    
    // Step 2: Verify data
    console.log(chalk.blue('\n🔍 Verifying data structure...\n'));
    const { verifyData } = require('../services/data/verify-data');
    const verificationResults = verifyData();
    
    if (!verificationResults.criticalPathsExist) {
      console.log(chalk.yellow('\n⚠️ Some critical files are missing. You may need to generate them with the AI writer.'));
    }
    
    // Step 3: Sync data (optional)
    const shouldSync = process.argv.includes('--sync');
    if (shouldSync) {
      console.log(chalk.blue('\n🔄 Synchronizing data to public directory...\n'));
      const syncModule = require('../services/data/sync-data');
      
      // Reset the internal state of the sync-data module
      if (syncModule.syncData) {
        const syncResults = syncModule.syncData();
        console.log(chalk.green(`\n✅ Data synchronization complete! Copied ${syncResults.filesCopied} files, created ${syncResults.dirsCreated} directories.`));
      } else {
        console.log(chalk.blue('\n🔄 Running sync-data module...\n'));
      }
    }
    
    console.log(chalk.green('\n✅ Setup and verification complete!\n'));
    
    // Display usage instructions
    console.log(chalk.blue('📘 Usage Instructions:'));
    console.log(`
To generate AI content, use the CLI:
  node src/cli/ai-writer.js --type=<model|category|blog|page> [options]

Examples:
  node src/cli/ai-writer.js --type=model --category=asian --slug=example-model
  node src/cli/ai-writer.js --type=category --category=ebony
  node src/cli/ai-writer.js --type=blog --title="Example Blog Post"
  node src/cli/ai-writer.js --type=page --slug=home --sections=featured,trending

Run with --dryRun to see what would be generated without saving.

To sync data to the public directory (for Next.js static serving):
  node src/cli/setup-writers.js --sync
`);
  
  } catch (error) {
    console.error(chalk.red('\n❌ Error during setup:'), error);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error(chalk.red('🆘 Unhandled error:'), err);
  process.exit(1);
}); 