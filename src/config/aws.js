/**
 * AWS Configuration with cost optimization settings
 */
module.exports = {
  s3: {
    // Use reduced redundancy storage for non-critical content
    storageClass: 'REDUCED_REDUNDANCY',
    
    // Enable compression for JSON files
    compression: {
      enabled: true,
      mimeTypes: ['application/json'],
      minSize: 1024 // Only compress files larger than 1KB
    },
    
    // Lifecycle rules for cost optimization
    lifecycle: {
      enabled: true,
      rules: [
        {
          // Move infrequently accessed content to cheaper storage
          prefix: 'content/',
          transitions: [
            {
              days: 30,
              storageClass: 'STANDARD_IA'
            },
            {
              days: 90,
              storageClass: 'GLACIER'
            }
          ]
        }
      ]
    },
    
    // Enable transfer acceleration only for large files
    transferAcceleration: {
      enabled: true,
      minSize: 5 * 1024 * 1024 // 5MB
    }
  },
  
  cloudfront: {
    // Cache settings for different content types
    caching: {
      default: {
        ttl: 86400, // 24 hours
        queryString: false,
        cookies: []
      },
      api: {
        ttl: 300, // 5 minutes
        queryString: true,
        cookies: ['session']
      },
      static: {
        ttl: 604800, // 1 week
        queryString: false,
        cookies: []
      }
    },
    
    // Compression settings
    compression: {
      enabled: true,
      mimeTypes: [
        'text/html',
        'text/css',
        'application/javascript',
        'application/json',
        'application/xml'
      ]
    },
    
    // Price class optimization (use fewer edge locations)
    priceClass: 'PriceClass_100' // Only US, Canada, Europe
  },
  
  // Rate limiting settings to control API costs
  rateLimiting: {
    enabled: true,
    rules: {
      default: {
        rate: 100, // requests per minute
        burst: 200
      },
      contentGeneration: {
        rate: 10, // requests per minute
        burst: 20
      }
    }
  },
  
  // Monitoring and alerting thresholds
  monitoring: {
    costs: {
      daily: {
        warning: 50, // USD
        critical: 100
      },
      monthly: {
        warning: 1000,
        critical: 2000
      }
    },
    metrics: {
      // CloudWatch metrics to track
      custom: [
        {
          name: 'ContentGenerationCost',
          namespace: 'Custom/AI',
          unit: 'USD',
          period: 3600 // 1 hour
        },
        {
          name: 'StorageCost',
          namespace: 'Custom/Storage',
          unit: 'USD',
          period: 86400 // 1 day
        }
      ]
    }
  },
  
  // Backup settings for cost optimization
  backup: {
    enabled: true,
    retention: {
      daily: 7, // days
      weekly: 4, // weeks
      monthly: 3 // months
    },
    coldStorage: {
      enabled: true,
      afterDays: 30
    }
  }
}; 