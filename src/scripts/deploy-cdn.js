const path = require('path');
const { uploadDirectory, invalidateCache } = require('../services/cdn');
const { CDN_CONFIG } = require('../config/constants');

// Content directories to deploy
const CONTENT_DIRS = [
  {
    source: 'src/data/blog',
    prefix: 'blog'
  },
  {
    source: 'src/data/categories',
    prefix: 'categories'
  },
  {
    source: 'src/data/models',
    prefix: 'models'
  },
  {
    source: 'src/data/pages',
    prefix: 'pages'
  }
];

async function deployToCDN() {
  console.log('🚀 Starting CDN deployment...');
  
  const results = {
    success: true,
    deployments: [],
    errors: []
  };

  try {
    // Upload each content directory
    for (const dir of CONTENT_DIRS) {
      console.log(`📂 Deploying ${dir.source}...`);
      
      const deployResult = await uploadDirectory(
        path.resolve(process.cwd(), dir.source),
        dir.prefix
      );
      
      results.deployments.push({
        directory: dir.source,
        ...deployResult
      });
      
      if (!deployResult.success) {
        results.errors.push({
          directory: dir.source,
          error: deployResult.error
        });
      }
    }
    
    // Invalidate cache for all content paths
    if (CDN_CONFIG.INVALIDATION_PATHS) {
      console.log('🔄 Invalidating CDN cache...');
      const invalidationResult = await invalidateCache(CDN_CONFIG.INVALIDATION_PATHS);
      
      if (!invalidationResult.success) {
        results.errors.push({
          type: 'cache_invalidation',
          error: invalidationResult.error
        });
      }
    }
    
    // Log results
    console.log('\n📊 Deployment Results:');
    results.deployments.forEach(deploy => {
      console.log(`\n${deploy.directory}:`);
      console.log(`✅ Successfully uploaded: ${deploy.files.length} files`);
      if (deploy.errors.length > 0) {
        console.log(`❌ Failed uploads: ${deploy.errors.length}`);
        deploy.errors.forEach(err => console.log(`  - ${err.file}: ${err.error}`));
      }
    });
    
    if (results.errors.length > 0) {
      console.log('\n⚠️ Deployment completed with errors');
      process.exit(1);
    } else {
      console.log('\n✅ Deployment completed successfully');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployToCDN(); 