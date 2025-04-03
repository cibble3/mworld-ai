const { flattenCategories } = require('../utils/category-normalizer');

console.log('🚀 Category Flattening CLI');

try {
  flattenCategories();
  console.log('\n✅ Categories flattened successfully');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Category flattening failed:', error);
  process.exit(1);
} 