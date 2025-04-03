const { analyzeContentTypeQuality } = require('../services/content-quality');

async function main() {
  const contentTypes = process.argv[2] ? [process.argv[2]] : ['models', 'categories', 'blog', 'pages'];
  
  console.log('📊 Starting content quality analysis...\n');
  
  try {
    for (const type of contentTypes) {
      console.log(`Analyzing ${type.toUpperCase()}...`);
      const results = await analyzeContentTypeQuality(type);
      
      // Print summary
      console.log('\nSummary:');
      console.log(`  Files analyzed: ${results.analyzed}`);
      console.log(`  Failed analyses: ${results.failed}`);
      
      if (results.analyzed > 0) {
        console.log('\nAverages:');
        console.log(`  Readability score: ${results.averages.readabilityScore.toFixed(1)}`);
        console.log(`  Content length: ${Math.round(results.averages.contentLength)} words`);
        console.log(`  Keyword density: ${results.averages.keywordDensity.toFixed(1)}%`);
        
        // Print detailed metrics for each file
        console.log('\nDetailed metrics:');
        Object.entries(results.metrics).forEach(([file, metrics]) => {
          console.log(`\n${file}:`);
          console.log(`  Readability: ${metrics.readability.level} (${metrics.readability.score.toFixed(1)})`);
          console.log(`  Length: ${metrics.length.words} words, ${metrics.length.sentences} sentences`);
          
          if (metrics.suggestions.length > 0) {
            console.log('  Suggestions:');
            metrics.suggestions.forEach(suggestion => {
              console.log(`    - ${suggestion}`);
            });
          }
          
          // Print SEO metrics
          console.log('  SEO:');
          console.log(`    Title length: ${metrics.seo.title.length} chars ${metrics.seo.title.isOptimalLength ? '✅' : '⚠️'}`);
          console.log(`    Meta description length: ${metrics.seo.meta.description.length} chars ${metrics.seo.meta.description.isOptimalLength ? '✅' : '⚠️'}`);
          console.log(`    Headings: ${metrics.seo.headings.count}`);
          
          // Print keyword metrics
          if (Object.keys(metrics.keywords).length > 0) {
            console.log('  Keywords:');
            Object.entries(metrics.keywords).forEach(([keyword, data]) => {
              const status = data.percentage >= 0.5 && data.percentage <= 2.5 ? '✅' : '⚠️';
              console.log(`    - ${keyword}: ${data.percentage.toFixed(1)}% ${status}`);
            });
          }
        });
      }
      
      console.log('\n---\n');
    }
    
    console.log('✅ Content quality analysis completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Content quality analysis failed:', error);
    process.exit(1);
  }
}

// Run the analysis
main(); 