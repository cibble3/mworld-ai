const awsOptimizer = require('../services/aws/optimizer');

async function main() {
  const args = process.argv.slice(2);
  const options = {
    bucketName: args[0],
    distributionId: args[1]
  };

  if (!options.bucketName || !options.distributionId) {
    console.error('Usage: optimize-aws <bucket-name> <distribution-id>');
    process.exit(1);
  }

  console.log('🚀 Starting AWS optimization...\n');
  
  try {
    const results = await awsOptimizer.optimizeAll(options);
    
    // Print S3 results
    if (results.results.s3) {
      console.log('\nS3 Optimization:');
      if (results.results.s3.success) {
        console.log('✅ Successfully optimized S3 bucket');
      } else {
        console.log('❌ Failed to optimize S3:', results.results.s3.error);
      }
    }
    
    // Print CloudFront results
    if (results.results.cloudfront) {
      console.log('\nCloudFront Optimization:');
      if (results.results.cloudfront.success) {
        console.log('✅ Successfully optimized CloudFront distribution');
      } else {
        console.log('❌ Failed to optimize CloudFront:', results.results.cloudfront.error);
      }
    }
    
    // Print monitoring results
    if (results.results.monitoring) {
      console.log('\nCost Monitoring Setup:');
      if (results.results.monitoring.success) {
        console.log('✅ Successfully set up cost monitoring');
      } else {
        console.log('❌ Failed to set up monitoring:', results.results.monitoring.error);
      }
    }
    
    if (results.success) {
      console.log('\n✨ All optimizations completed successfully');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some optimizations failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Run the optimization
main(); 