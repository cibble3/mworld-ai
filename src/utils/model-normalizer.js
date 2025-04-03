/**
 * Normalize model data with consistent category and appearance attributes
 */
function normalizeModel(model, sourceCategory) {
  // Create slug
  const slug = model.slug || 
              model.performerName?.toLowerCase().replace(/\s+/g, '-') || 
              `model-${model.id || Date.now()}`;
  
  // Extract categories and appearances
  const categories = extractCategories(model, sourceCategory);
  const appearances = extractAppearances(model);
  
  return {
    id: model.id || slug,
    slug,
    performerName: model.performerName || model.name || slug,
    primaryCategory: categories[0] || sourceCategory,
    categories,
    appearances,
    images: normalizeImages(model.images || {}),
    isLive: model.status?.toLowerCase() === 'online',
    viewerCount: model.viewerCount || 0,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Extract categories from model data
 */
function extractCategories(model, sourceCategory) {
  const categories = new Set([sourceCategory]);
  
  // Add ethnicity-based categories
  if (model.ethnicity) {
    const ethnicity = model.ethnicity.toLowerCase();
    if (['asian', 'ebony', 'latina'].includes(ethnicity)) {
      categories.add(ethnicity);
    }
  }
  
  // Add age-based categories
  if (model.age) {
    const age = parseInt(model.age);
    if (age >= 40) {
      categories.add('mature');
    } else if (age >= 30) {
      categories.add('milf');
    } else if (age <= 25) {
      categories.add('teen');
    }
  }
  
  // Add appearance-based categories
  if (model.bodyType) {
    const bodyType = model.bodyType.toLowerCase();
    if (['bbw', 'curvy', 'plus-size'].includes(bodyType)) {
      categories.add('bbw');
    }
  }
  
  // Add hair color categories
  if (model.hairColor) {
    const hairColor = model.hairColor.toLowerCase();
    if (['blonde', 'light'].includes(hairColor)) {
      categories.add('blonde');
    } else if (['brunette', 'black', 'dark'].includes(hairColor)) {
      categories.add('brunette');
    }
  }
  
  return Array.from(categories);
}

/**
 * Extract appearance attributes
 */
function extractAppearances(model) {
  const appearances = {};
  
  // Map appearance attributes
  const attributes = ['ethnicity', 'age', 'hairColor', 'bodyType', 'breastSize', 'height', 'weight'];
  
  for (const attr of attributes) {
    if (model[attr]) {
      appearances[attr] = model[attr];
    }
  }
  
  return appearances;
}

/**
 * Normalize image formats
 */
function normalizeImages(images) {
  if (typeof images === 'string') {
    return {
      thumbnail: images,
      preview: images,
      large: images
    };
  }
  
  if (Array.isArray(images)) {
    return {
      thumbnail: images[0]?.url || images[0],
      preview: images[1]?.url || images[1] || images[0]?.url || images[0],
      large: images[2]?.url || images[2] || images[0]?.url || images[0]
    };
  }
  
  // If it's already an object with expected keys, return as is (or add defaults)
  return {
    thumbnail: images?.thumbnail || images?.small || null,
    preview: images?.preview || images?.medium || images?.thumbnail || images?.small || null,
    large: images?.large || images?.preview || images?.medium || null,
    ...images // Keep any other properties
  };
}

module.exports = { normalizeModel }; 