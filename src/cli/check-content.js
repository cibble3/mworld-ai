const { checkAllContent } = require('../services/content-freshness');

async function main() {
  console.log('🔍 Starting content freshness check...');
  
  try {
    const results = await checkAllContent();
    
    // Log results by content type
    console.log('\n📊 Results by Content Type:');
    Object.entries(results.byType).forEach(([type, typeResults]) => {
      console.log(`\n${type.toUpperCase()}:`);
      console.log(`  Checked: ${typeResults.checked}`);
      console.log(`  Updated: ${typeResults.updated}`);
      console.log(`  Skipped: ${typeResults.skipped}`);
      
      if (typeResults.errors.length > 0) {
        console.log('  Errors:');
        typeResults.errors.forEach(error => {
          console.log(`    - ${error.file || 'Unknown'}: ${error.error}`);
        });
      }
    });
    
    // Log total results
    console.log('\n📈 Total Results:');
    console.log(`  Total Checked: ${results.total.checked}`);
    console.log(`  Total Updated: ${results.total.updated}`);
    console.log(`  Total Skipped: ${results.total.skipped}`);
    
    if (results.total.errors.length > 0) {
      console.log('\n⚠️ Total Errors:', results.total.errors.length);
      process.exit(1);
    } else {
      console.log('\n✅ Content freshness check completed successfully');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Content freshness check failed:', error);
    process.exit(1);
  }
}

// Run the check
main(); 