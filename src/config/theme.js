const path = require('path');

// Default theme configuration
const defaultTheme = {
  // Color palette
  colors: {
    primary: '#FF4D4D',
    secondary: '#4A90E2',
    accent: '#F5A623',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#999999'
    },
    border: '#E5E5E5',
    error: '#FF4D4D',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3'
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      secondary: "'Playfair Display', Georgia, serif"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },
  
  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },
  
  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },
  
  // Component-specific styles
  components: {
    button: {
      base: {
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontWeight: 500,
        transition: 'all 0.2s'
      },
      variants: {
        primary: {
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-primary-dark)'
          }
        },
        secondary: {
          backgroundColor: 'var(--color-secondary)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-dark)'
          }
        }
      }
    },
    card: {
      base: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: 'var(--shadow-md)',
        padding: '1.5rem'
      }
    },
    input: {
      base: {
        padding: '0.5rem 0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid var(--color-border)',
        '&:focus': {
          outline: 'none',
          borderColor: 'var(--color-primary)',
          boxShadow: '0 0 0 3px var(--color-primary-light)'
        }
      }
    }
  }
};

/**
 * Load custom theme configuration
 * @param {string} themeName - Name of the theme to load
 * @returns {Object} - Merged theme configuration
 */
function loadTheme(themeName = 'default') {
  try {
    const customThemePath = path.resolve(process.cwd(), `src/themes/${themeName}.js`);
    const customTheme = require(customThemePath);
    
    // Deep merge with default theme
    return mergeTheme(defaultTheme, customTheme);
  } catch (error) {
    console.warn(`⚠️ Custom theme "${themeName}" not found, using default theme`);
    return defaultTheme;
  }
}

/**
 * Deep merge two theme objects
 * @param {Object} target - Target theme object
 * @param {Object} source - Source theme object
 * @returns {Object} - Merged theme object
 */
function mergeTheme(target, source) {
  const merged = { ...target };
  
  for (const key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      merged[key] = mergeTheme(target[key], source[key]);
    } else {
      merged[key] = source[key];
    }
  }
  
  return merged;
}

/**
 * Check if value is an object
 * @param {*} value - Value to check
 * @returns {boolean} - Whether value is an object
 */
function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

module.exports = {
  defaultTheme,
  loadTheme
}; 