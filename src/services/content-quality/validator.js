const { analyzeContentQuality } = require('./index');

/**
 * Quality thresholds for content validation
 */
const QUALITY_THRESHOLDS = {
  readability: {
    min: 60, // Minimum readability score (Standard or better)
    target: 70 // Target score (Fairly Easy or better)
  },
  length: {
    min: 300, // Minimum word count
    max: 2500, // Maximum word count
    target: 800 // Target word count
  },
  keyword: {
    min: 0.5, // Minimum keyword density percentage
    max: 2.5, // Maximum keyword density percentage
    target: 1.5 // Target keyword density percentage
  },
  seo: {
    titleLength: {
      min: 40,
      max: 60
    },
    metaDescriptionLength: {
      min: 120,
      max: 160
    },
    minHeadings: 3
  }
};

/**
 * Validate content against quality thresholds
 * @param {Object} content - Content object to validate
 * @param {string} type - Content type (model, category, blog, page)
 * @param {Object} options - Validation options
 * @returns {Object} - Validation results
 */
function validateContent(content, type, options = {}) {
  const tempFilePath = `/tmp/temp_content_${Date.now()}.json`;
  const fs = require('fs');
  
  try {
    // Write content to temporary file for analysis
    fs.writeFileSync(tempFilePath, JSON.stringify(content, null, 2));
    
    // Analyze content quality
    const metrics = analyzeContentQuality(type, tempFilePath);
    
    // Delete temporary file
    fs.unlinkSync(tempFilePath);
    
    if (!metrics) {
      return {
        isValid: false,
        errors: ['Failed to analyze content quality'],
        warnings: [],
        metrics: null
      };
    }
    
    const errors = [];
    const warnings = [];
    
    // Check readability
    if (metrics.readability.score < QUALITY_THRESHOLDS.readability.min) {
      errors.push(`Readability score (${metrics.readability.score.toFixed(1)}) is below minimum threshold (${QUALITY_THRESHOLDS.readability.min})`);
    } else if (metrics.readability.score < QUALITY_THRESHOLDS.readability.target) {
      warnings.push(`Readability score (${metrics.readability.score.toFixed(1)}) is below target (${QUALITY_THRESHOLDS.readability.target})`);
    }
    
    // Check content length
    if (metrics.length.words < QUALITY_THRESHOLDS.length.min) {
      errors.push(`Content length (${metrics.length.words} words) is below minimum threshold (${QUALITY_THRESHOLDS.length.min})`);
    } else if (metrics.length.words > QUALITY_THRESHOLDS.length.max) {
      errors.push(`Content length (${metrics.length.words} words) exceeds maximum threshold (${QUALITY_THRESHOLDS.length.max})`);
    } else if (Math.abs(metrics.length.words - QUALITY_THRESHOLDS.length.target) > 200) {
      warnings.push(`Content length (${metrics.length.words} words) deviates significantly from target (${QUALITY_THRESHOLDS.length.target})`);
    }
    
    // Check keyword density
    Object.entries(metrics.keywords).forEach(([keyword, data]) => {
      if (data.percentage < QUALITY_THRESHOLDS.keyword.min) {
        warnings.push(`Keyword "${keyword}" density (${data.percentage.toFixed(1)}%) is below minimum threshold (${QUALITY_THRESHOLDS.keyword.min}%)`);
      } else if (data.percentage > QUALITY_THRESHOLDS.keyword.max) {
        errors.push(`Keyword "${keyword}" density (${data.percentage.toFixed(1)}%) exceeds maximum threshold (${QUALITY_THRESHOLDS.keyword.max}%)`);
      }
    });
    
    // Check SEO metrics
    if (metrics.seo.title.length < QUALITY_THRESHOLDS.seo.titleLength.min ||
        metrics.seo.title.length > QUALITY_THRESHOLDS.seo.titleLength.max) {
      errors.push(`Title length (${metrics.seo.title.length} chars) is outside optimal range (${QUALITY_THRESHOLDS.seo.titleLength.min}-${QUALITY_THRESHOLDS.seo.titleLength.max})`);
    }
    
    if (metrics.seo.meta.description.length < QUALITY_THRESHOLDS.seo.metaDescriptionLength.min ||
        metrics.seo.meta.description.length > QUALITY_THRESHOLDS.seo.metaDescriptionLength.max) {
      errors.push(`Meta description length (${metrics.seo.meta.description.length} chars) is outside optimal range (${QUALITY_THRESHOLDS.seo.metaDescriptionLength.min}-${QUALITY_THRESHOLDS.seo.metaDescriptionLength.max})`);
    }
    
    if (metrics.seo.headings.count < QUALITY_THRESHOLDS.seo.minHeadings) {
      warnings.push(`Number of headings (${metrics.seo.headings.count}) is below recommended minimum (${QUALITY_THRESHOLDS.seo.minHeadings})`);
    }
    
    // Add any content-specific suggestions
    warnings.push(...metrics.suggestions);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metrics
    };
  } catch (error) {
    console.error('Error validating content:', error);
    return {
      isValid: false,
      errors: ['Failed to validate content: ' + error.message],
      warnings: [],
      metrics: null
    };
  }
}

/**
 * Get quality thresholds for reference
 * @returns {Object} - Quality thresholds
 */
function getQualityThresholds() {
  return QUALITY_THRESHOLDS;
}

module.exports = {
  validateContent,
  getQualityThresholds
}; 