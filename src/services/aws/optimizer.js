const AWS = require('aws-sdk');
const path = require('path');
const awsConfig = require('../../config/aws');

class AWSOptimizer {
  constructor() {
    this.s3 = new AWS.S3();
    this.cloudfront = new AWS.CloudFront();
    this.cloudwatch = new AWS.CloudWatch();
  }

  /**
   * Apply S3 optimizations
   * @param {string} bucketName - S3 bucket name
   * @returns {Promise<Object>} - Optimization results
   */
  async optimizeS3(bucketName) {
    console.log(`Optimizing S3 bucket: ${bucketName}`);
    
    try {
      // Apply lifecycle rules
      if (awsConfig.s3.lifecycle.enabled) {
        await this.s3.putBucketLifecycleConfiguration({
          Bucket: bucketName,
          LifecycleConfiguration: {
            Rules: awsConfig.s3.lifecycle.rules.map(rule => ({
              Status: 'Enabled',
              Prefix: rule.prefix,
              Transitions: rule.transitions.map(t => ({
                Days: t.days,
                StorageClass: t.storageClass
              }))
            }))
          }
        }).promise();
        
        console.log('Applied lifecycle rules');
      }

      // Configure transfer acceleration
      if (awsConfig.s3.transferAcceleration.enabled) {
        await this.s3.putBucketAccelerateConfiguration({
          Bucket: bucketName,
          AccelerateConfiguration: {
            Status: 'Enabled'
          }
        }).promise();
        
        console.log('Enabled transfer acceleration');
      }

      // Configure compression
      if (awsConfig.s3.compression.enabled) {
        // Note: S3 compression is handled during object upload
        console.log('Compression will be applied during uploads');
      }

      return { success: true };
    } catch (error) {
      console.error('Error optimizing S3:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Apply CloudFront optimizations
   * @param {string} distributionId - CloudFront distribution ID
   * @returns {Promise<Object>} - Optimization results
   */
  async optimizeCloudFront(distributionId) {
    console.log(`Optimizing CloudFront distribution: ${distributionId}`);
    
    try {
      // Get current configuration
      const { DistributionConfig } = await this.cloudfront.getDistributionConfig({
        Id: distributionId
      }).promise();

      // Update configuration with optimizations
      const updates = {
        ...DistributionConfig,
        PriceClass: awsConfig.cloudfront.priceClass,
        DefaultCacheBehavior: {
          ...DistributionConfig.DefaultCacheBehavior,
          MinTTL: awsConfig.cloudfront.caching.default.ttl,
          DefaultTTL: awsConfig.cloudfront.caching.default.ttl,
          MaxTTL: awsConfig.cloudfront.caching.default.ttl * 2,
          Compress: awsConfig.cloudfront.compression.enabled
        }
      };

      // Update the distribution
      await this.cloudfront.updateDistribution({
        Id: distributionId,
        DistributionConfig: updates,
        IfMatch: DistributionConfig.ETag
      }).promise();

      console.log('Applied CloudFront optimizations');
      return { success: true };
    } catch (error) {
      console.error('Error optimizing CloudFront:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Set up cost monitoring and alerts
   * @returns {Promise<Object>} - Setup results
   */
  async setupCostMonitoring() {
    console.log('Setting up cost monitoring...');
    
    try {
      // Create custom metrics
      for (const metric of awsConfig.monitoring.metrics.custom) {
        await this.cloudwatch.putMetricData({
          Namespace: metric.namespace,
          MetricData: [{
            MetricName: metric.name,
            Unit: metric.unit,
            StorageResolution: 60
          }]
        }).promise();
      }

      // Set up cost alerts
      const alarmConfigs = [
        {
          name: 'DailyCostWarning',
          threshold: awsConfig.monitoring.costs.daily.warning,
          period: 86400
        },
        {
          name: 'DailyCostCritical',
          threshold: awsConfig.monitoring.costs.daily.critical,
          period: 86400
        },
        {
          name: 'MonthlyCostWarning',
          threshold: awsConfig.monitoring.costs.monthly.warning,
          period: 2592000
        },
        {
          name: 'MonthlyCostCritical',
          threshold: awsConfig.monitoring.costs.monthly.critical,
          period: 2592000
        }
      ];

      for (const config of alarmConfigs) {
        await this.cloudwatch.putMetricAlarm({
          AlarmName: config.name,
          MetricName: 'EstimatedCharges',
          Namespace: 'AWS/Billing',
          Period: config.period,
          EvaluationPeriods: 1,
          Threshold: config.threshold,
          ComparisonOperator: 'GreaterThanThreshold',
          Statistic: 'Maximum',
          ActionsEnabled: true
        }).promise();
      }

      console.log('Cost monitoring setup complete');
      return { success: true };
    } catch (error) {
      console.error('Error setting up cost monitoring:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Apply all AWS optimizations
   * @param {Object} options - Optimization options
   * @returns {Promise<Object>} - Overall results
   */
  async optimizeAll(options = {}) {
    const results = {
      s3: null,
      cloudfront: null,
      monitoring: null
    };

    if (options.bucketName) {
      results.s3 = await this.optimizeS3(options.bucketName);
    }

    if (options.distributionId) {
      results.cloudfront = await this.optimizeCloudFront(options.distributionId);
    }

    results.monitoring = await this.setupCostMonitoring();

    return {
      success: Object.values(results).every(r => r && r.success),
      results
    };
  }

  /**
   * Helper function to compress content if needed
   * @param {Buffer|string} content - Content to compress
   * @param {string} contentType - Content MIME type
   * @returns {Promise<Buffer>} - Compressed content
   */
  async compressContent(content, contentType) {
    const { compression } = awsConfig.s3;
    
    if (!compression.enabled ||
        !compression.mimeTypes.includes(contentType) ||
        content.length < compression.minSize) {
      return content;
    }

    const zlib = require('zlib');
    const util = require('util');
    const gzip = util.promisify(zlib.gzip);
    
    return gzip(content);
  }
}

module.exports = new AWSOptimizer(); 