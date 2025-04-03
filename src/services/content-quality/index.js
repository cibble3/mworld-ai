const fs = require('fs');
const path = require('path');
const config = require(path.join(process.cwd(), 'src/config'));

// Commonly overused words to avoid
const FILLER_WORDS = new Set([
  'very', 'really', 'quite', 'basically', 'actually', 'literally',
  'just', 'so', 'that', 'then', 'totally', 'absolutely'
]);

/**
 * Calculate readability score using Flesch-Kincaid formula
 * @param {string} text - Text to analyze
 * @returns {number} - Readability score (0-100)
 */
function calculateReadabilityScore(text) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = countSyllables(text);

  if (words.length === 0 || sentences.length === 0) return 0;

  const averageWordsPerSentence = words.length / sentences.length;
  const averageSyllablesPerWord = syllables / words.length;

  // Flesch-Kincaid Reading Ease formula
  return 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
}

/**
 * Count syllables in text (approximate method)
 * @param {string} text - Text to analyze
 * @returns {number} - Number of syllables
 */
function countSyllables(text) {
  const words = text.toLowerCase().split(/\s+/);
  return words.reduce((total, word) => {
    return total + word
      .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      .match(/[aeiouy]{1,2}/g)?.length || 1;
  }, 0);
}

/**
 * Calculate keyword density
 * @param {string} text - Text to analyze
 * @param {string[]} keywords - Keywords to check
 * @returns {Object} - Keyword density results
 */
function calculateKeywordDensity(text, keywords) {
  const words = text.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  const density = {};

  keywords.forEach(keyword => {
    const keywordCount = words.filter(word => word === keyword.toLowerCase()).length;
    density[keyword] = {
      count: keywordCount,
      percentage: (keywordCount / totalWords) * 100
    };
  });

  return density;
}

/**
 * Check content length metrics
 * @param {string} text - Text to analyze
 * @returns {Object} - Length metrics
 */
function checkContentLength(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const characters = text.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean);

  return {
    characters,
    words: words.length,
    sentences: sentences.length,
    isOptimal: words.length >= 300 && words.length <= 2500 // typical optimal blog length
  };
}

/**
 * Analyze SEO metrics
 * @param {Object} content - Content object with title, meta, and body
 * @returns {Object} - SEO metrics
 */
function analyzeSEO(content) {
  const metrics = {
    title: {
      length: content.title.length,
      isOptimalLength: content.title.length >= 40 && content.title.length <= 60
    },
    meta: {
      description: {
        length: content.meta?.description?.length || 0,
        isOptimalLength: (content.meta?.description?.length || 0) >= 120 && 
                        (content.meta?.description?.length || 0) <= 160
      }
    },
    headings: {
      count: 0,
      hasH1: false,
      structure: []
    },
    keywords: {
      inTitle: false,
      inMeta: false,
      inHeadings: false,
      density: {}
    }
  };

  // Extract headings from content sections
  if (content.sections) {
    content.sections.forEach(section => {
      if (section.heading) {
        metrics.headings.count++;
        metrics.headings.structure.push(section.heading);
      }
    });
  }

  return metrics;
}

/**
 * Analyze content quality
 * @param {string} type - Content type (model, category, blog, page)
 * @param {string} filePath - Path to content file
 * @returns {Object} - Quality metrics
 */
function analyzeContentQuality(type, filePath) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fullText = '';

    // Combine all text content based on content type
    switch (type) {
      case 'blog':
        fullText = [
          content.title,
          content.introduction,
          ...(content.sections || []).map(s => `${s.heading} ${s.content}`),
          content.conclusion
        ].join(' ');
        break;
      case 'model':
      case 'category':
      case 'page':
        fullText = [
          content.title,
          content.description,
          ...(content.sections || []).map(s => `${s.heading} ${s.content}`)
        ].join(' ');
        break;
    }

    const keywords = content.keywords || content.tags || [];
    
    return {
      readability: {
        score: calculateReadabilityScore(fullText),
        level: getReadabilityLevel(calculateReadabilityScore(fullText))
      },
      length: checkContentLength(fullText),
      keywords: calculateKeywordDensity(fullText, keywords),
      seo: analyzeSEO(content),
      suggestions: generateSuggestions(fullText, keywords)
    };
  } catch (error) {
    console.error(`Error analyzing content quality for ${filePath}:`, error);
    return null;
  }
}

/**
 * Get readability level description
 * @param {number} score - Readability score
 * @returns {string} - Readability level description
 */
function getReadabilityLevel(score) {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

/**
 * Generate content improvement suggestions
 * @param {string} text - Content text
 * @param {string[]} keywords - Target keywords
 * @returns {string[]} - List of suggestions
 */
function generateSuggestions(text, keywords) {
  const suggestions = [];
  const words = text.split(/\s+/);
  
  // Check content length
  if (words.length < 300) {
    suggestions.push('Content length is below recommended minimum (300 words)');
  }
  
  // Check keyword usage
  keywords.forEach(keyword => {
    const density = calculateKeywordDensity(text, [keyword])[keyword];
    if (density.percentage < 0.5) {
      suggestions.push(`Keyword "${keyword}" usage is low (${density.percentage.toFixed(1)}%)`);
    } else if (density.percentage > 2.5) {
      suggestions.push(`Keyword "${keyword}" may be overused (${density.percentage.toFixed(1)}%)`);
    }
  });
  
  // Check readability
  const readabilityScore = calculateReadabilityScore(text);
  if (readabilityScore < 60) {
    suggestions.push('Content may be too difficult to read. Consider simplifying.');
  }
  
  // Check for overused filler words
  const fillerWordCounts = {};
  words.forEach(word => {
    if (FILLER_WORDS.has(word.toLowerCase())) {
      fillerWordCounts[word] = (fillerWordCounts[word] || 0) + 1;
    }
  });
  
  Object.entries(fillerWordCounts)
    .filter(([_, count]) => count > 2)
    .forEach(([word, count]) => {
      suggestions.push(`Consider reducing use of "${word}" (used ${count} times)`);
    });
    
  return suggestions;
}

/**
 * Analyze quality metrics for all content of a specific type
 * @param {string} type - Content type
 * @returns {Object} - Quality metrics for all content
 */
async function analyzeContentTypeQuality(type) {
  const results = {
    analyzed: 0,
    failed: 0,
    metrics: {},
    averages: {
      readabilityScore: 0,
      contentLength: 0,
      keywordDensity: 0
    }
  };

  try {
    const contentPath = path.join(process.cwd(), 'src/data', type);
    const files = fs.readdirSync(contentPath);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(contentPath, file);
      const metrics = analyzeContentQuality(type, filePath);
      
      if (metrics) {
        results.analyzed++;
        results.metrics[file] = metrics;
        
        // Update averages
        results.averages.readabilityScore += metrics.readability.score;
        results.averages.contentLength += metrics.length.words;
        
        // Calculate average keyword density
        const densities = Object.values(metrics.keywords)
          .map(k => k.percentage)
          .filter(p => !isNaN(p));
        if (densities.length > 0) {
          results.averages.keywordDensity += 
            densities.reduce((a, b) => a + b, 0) / densities.length;
        }
      } else {
        results.failed++;
      }
    }

    // Calculate final averages
    if (results.analyzed > 0) {
      results.averages.readabilityScore /= results.analyzed;
      results.averages.contentLength /= results.analyzed;
      results.averages.keywordDensity /= results.analyzed;
    }

    return results;
  } catch (error) {
    console.error(`Error analyzing ${type} content:`, error);
    return results;
  }
}

module.exports = {
  analyzeContentQuality,
  analyzeContentTypeQuality
}; 