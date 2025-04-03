const { VALIDATION_SCHEMAS } = require('../config/constants');

/**
 * Validate content against its schema
 * @param {string} type - Content type (model, category, blog)
 * @param {Object} content - Content to validate
 * @returns {Object} - Validation result
 */
function validateContent(type, content) {
  const schema = VALIDATION_SCHEMAS[type.toUpperCase()];
  if (!schema) {
    return {
      isValid: false,
      errors: [`Unknown content type: ${type}`]
    };
  }

  const errors = [];
  const warnings = [];

  // Check required fields
  schema.REQUIRED_FIELDS.forEach(field => {
    if (!content[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Check optional fields
  schema.OPTIONAL_FIELDS.forEach(field => {
    if (content[field] === undefined) {
      warnings.push(`Missing optional field: ${field}`);
    }
  });

  // Additional type-specific validation
  switch (type.toLowerCase()) {
    case 'model':
      validateModel(content, errors, warnings);
      break;
    case 'category':
      validateCategory(content, errors, warnings);
      break;
    case 'blog':
      validateBlog(content, errors, warnings);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate model-specific fields
 */
function validateModel(content, errors, warnings) {
  // Validate images
  if (content.images) {
    if (!content.images.thumbnail) {
      warnings.push('Missing thumbnail image');
    }
    if (!content.images.hero) {
      warnings.push('Missing hero image');
    }
  }

  // Validate categories
  if (content.categories && !Array.isArray(content.categories)) {
    errors.push('Categories must be an array');
  }

  // Validate appearances
  if (content.appearances && !Array.isArray(content.appearances)) {
    errors.push('Appearances must be an array');
  }
}

/**
 * Validate category-specific fields
 */
function validateCategory(content, errors, warnings) {
  // Validate parent-child relationships
  if (content.parent && !content.parent.match(/^[a-z0-9-]+$/)) {
    errors.push('Invalid parent category slug format');
  }

  if (content.children && !Array.isArray(content.children)) {
    errors.push('Children must be an array');
  }

  // Validate meta fields
  if (content.metaTitle && content.metaTitle.length > 60) {
    warnings.push('Meta title exceeds recommended length (60 characters)');
  }

  if (content.metaDescription && content.metaDescription.length > 160) {
    warnings.push('Meta description exceeds recommended length (160 characters)');
  }
}

/**
 * Validate blog-specific fields
 */
function validateBlog(content, errors, warnings) {
  // Validate content structure
  if (content.content && typeof content.content !== 'string') {
    errors.push('Content must be a string');
  }

  // Validate tags
  if (content.tags && !Array.isArray(content.tags)) {
    errors.push('Tags must be an array');
  }

  // Validate related content
  if (content.relatedContent && !Array.isArray(content.relatedContent)) {
    errors.push('Related content must be an array');
  }

  // Validate author
  if (content.author && typeof content.author !== 'object') {
    errors.push('Author must be an object');
  }
}

module.exports = {
  validateContent
}; 