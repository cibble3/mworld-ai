const fs = require('fs');
const path = require('path');
const { CDN_CONFIG } = require('../../config/constants');
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: CDN_CONFIG.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();

/**
 * Upload content to S3 and update CloudFront cache
 * @param {string} filePath - Local file path
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type
 * @returns {Promise<Object>} - Upload result
 */
async function uploadToCDN(filePath, key, contentType) {
  if (!CDN_CONFIG.ENABLED) {
    console.log('⚠️ CDN uploads are disabled');
    return { success: false, message: 'CDN uploads are disabled' };
  }

  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath);
    
    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: `max-age=${CDN_CONFIG.CACHE_TTL}`
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    console.log(`✅ Uploaded ${key} to S3: ${uploadResult.Location}`);

    // Invalidate CloudFront cache
    await invalidateCache(key);
    
    return {
      success: true,
      url: uploadResult.Location
    };
  } catch (error) {
    console.error(`❌ CDN upload failed for ${key}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Invalidate CloudFront cache for specific paths
 * @param {string|string[]} paths - Paths to invalidate
 * @returns {Promise<Object>} - Invalidation result
 */
async function invalidateCache(paths) {
  if (!CDN_CONFIG.ENABLED) {
    return { success: false, message: 'CDN is disabled' };
  }

  try {
    // Convert single path to array
    const invalidationPaths = Array.isArray(paths) ? paths : [paths];
    
    // Add wildcards to paths if needed
    const pathsWithWildcards = invalidationPaths.map(path => 
      path.startsWith('/') ? path : `/${path}`
    );

    const params = {
      DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: pathsWithWildcards.length,
          Items: pathsWithWildcards
        }
      }
    };

    const result = await cloudfront.createInvalidation(params).promise();
    console.log(`✅ Created CloudFront invalidation: ${result.Invalidation.Id}`);
    
    return {
      success: true,
      invalidationId: result.Invalidation.Id
    };
  } catch (error) {
    console.error('❌ Cache invalidation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload a directory of content files to CDN
 * @param {string} dirPath - Local directory path
 * @param {string} prefix - S3 key prefix
 * @returns {Promise<Object>} - Upload results
 */
async function uploadDirectory(dirPath, prefix = '') {
  if (!CDN_CONFIG.ENABLED) {
    return { success: false, message: 'CDN is disabled' };
  }

  const results = {
    success: true,
    files: [],
    errors: []
  };

  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        // Recursively upload subdirectories
        const subResults = await uploadDirectory(
          filePath,
          path.join(prefix, file)
        );
        
        results.files.push(...subResults.files);
        results.errors.push(...subResults.errors);
      } else {
        // Upload file
        const key = path.join(prefix, file);
        const contentType = getContentType(file);
        
        const uploadResult = await uploadToCDN(filePath, key, contentType);
        
        if (uploadResult.success) {
          results.files.push({
            file,
            key,
            url: uploadResult.url
          });
        } else {
          results.errors.push({
            file,
            error: uploadResult.error
          });
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error(`❌ Directory upload failed for ${dirPath}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get MIME type for file
 * @param {string} filename - File name
 * @returns {string} - MIME type
 */
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.json': 'application/json',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
  };
  
  return types[ext] || 'application/octet-stream';
}

module.exports = {
  uploadToCDN,
  invalidateCache,
  uploadDirectory
}; 