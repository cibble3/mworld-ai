const { syncAllCategories } = require('../services/api-integrations/awe-service');

console.log('🚀 AWE Sync CLI');

// Parse command line arguments for specific categories (optional)
// Note: Use AWE category names like 'girls', 'transgender'
const args = process.argv.slice(2);
const categories = args.length > 0 ? args : undefined; // Use default categories if none provided

// Run sync
syncAllCategories(categories)
  .then(results => {
    console.log('\n✅ AWE Sync completed successfully.');
    console.log('📊 Results:', JSON.stringify(results, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ AWE Sync failed:', error);
    process.exit(1);
  }); 