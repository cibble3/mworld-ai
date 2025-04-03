import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions
export const THEMES = {
  DEFAULT: 'default',
  DARK: 'dark',
  LUXURY: 'luxury',
  RETRO: 'retro',
  MINIMAL: 'minimal'
};

// Default theme configuration
const defaultThemeConfig = {
  name: THEMES.DEFAULT,
  palette: {
    primary: '#E41B64',
    secondary: '#3D3D3D',
    text: {
      primary: '#212121',
      secondary: '#616161',
      light: '#f9f9f9'
    },
    background: {
      main: '#ffffff',
      dark: '#16181c',
      card: '#f5f5f5',
      footer: '#121212'
    },
    divider: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800'
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem'
  },
  borderRadius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    pill: '50px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  },
  transitions: {
    standard: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  components: {
    button: {
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: 500,
      padding: '0.5rem 1rem'
    },
    card: {
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    },
    input: {
      borderRadius: '0.375rem',
      fontSize: '1rem',
      padding: '0.5rem 1rem',
      height: '2.5rem'
    }
  }
};

// Dark theme configuration
const darkThemeConfig = {
  name: THEMES.DARK,
  palette: {
    primary: '#E41B64',
    secondary: '#BB86FC',
    text: {
      primary: '#f5f5f5',
      secondary: '#b0b0b0',
      light: '#ffffff'
    },
    background: {
      main: '#121212',
      dark: '#0a0a0a',
      card: '#1e1e1e',
      footer: '#0a0a0a'
    },
    divider: '#2d2d2d',
    error: '#cf6679',
    success: '#4caf50',
    warning: '#ff9800'
  },
  // Inherit base typography, spacing, etc. from default theme
  ...defaultThemeConfig,
  // Override specific typography
  typography: {
    ...defaultThemeConfig.typography,
    fontFamily: "'Inter', 'Roboto', sans-serif"
  }
};

// Luxury theme configuration
const luxuryThemeConfig = {
  name: THEMES.LUXURY,
  palette: {
    primary: '#D4AF37', // Gold
    secondary: '#111111',
    text: {
      primary: '#111111',
      secondary: '#333333',
      light: '#ffffff'
    },
    background: {
      main: '#ffffff',
      dark: '#0a0a0a',
      card: '#f8f8f8',
      footer: '#111111'
    },
    divider: '#D4AF37',
    error: '#B22222',
    success: '#006400',
    warning: '#8B4513'
  },
  typography: {
    ...defaultThemeConfig.typography,
    fontFamily: "'Playfair Display', 'Georgia', serif",
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3
    }
  },
  components: {
    ...defaultThemeConfig.components,
    button: {
      borderRadius: '0',
      fontSize: '1rem',
      fontWeight: 500,
      padding: '0.75rem 1.5rem'
    },
    card: {
      borderRadius: '0',
      padding: '2rem',
      shadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    }
  }
};

// Retro theme
const retroThemeConfig = {
  name: THEMES.RETRO,
  palette: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    text: {
      primary: '#333333',
      secondary: '#555555',
      light: '#ffffff'
    },
    background: {
      main: '#FAFFFD',
      dark: '#1A535C',
      card: '#FFE66D',
      footer: '#1A535C'
    },
    divider: '#FF6B6B',
    error: '#E71D36',
    success: '#06D6A0',
    warning: '#F7B801'
  },
  typography: {
    ...defaultThemeConfig.typography,
    fontFamily: "'VT323', 'Courier New', monospace",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    }
  },
  components: {
    ...defaultThemeConfig.components,
    button: {
      borderRadius: '0',
      fontSize: '1rem',
      fontWeight: 700,
      padding: '0.5rem 1rem'
    }
  }
};

// Minimal theme
const minimalThemeConfig = {
  name: THEMES.MINIMAL,
  palette: {
    primary: '#000000',
    secondary: '#ffffff',
    text: {
      primary: '#000000',
      secondary: '#555555',
      light: '#ffffff'
    },
    background: {
      main: '#ffffff',
      dark: '#f5f5f5',
      card: '#ffffff',
      footer: '#000000'
    },
    divider: '#e0e0e0',
    error: '#ff0000',
    success: '#00ff00',
    warning: '#ffff00'
  },
  typography: {
    ...defaultThemeConfig.typography,
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 300,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 300,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 300,
      lineHeight: 1.4
    }
  },
  borderRadius: {
    xs: '0',
    sm: '0',
    md: '0',
    lg: '0',
    xl: '0',
    pill: '50px'
  },
  components: {
    ...defaultThemeConfig.components,
    button: {
      borderRadius: '0',
      fontSize: '0.875rem',
      fontWeight: 400,
      padding: '0.5rem 1rem'
    },
    card: {
      borderRadius: '0',
      padding: '1rem',
      shadow: 'none'
    },
    input: {
      borderRadius: '0',
      fontSize: '0.875rem',
      padding: '0.5rem 0.75rem',
      height: '2.25rem'
    }
  }
};

// Map of all available themes
const THEME_MAP = {
  [THEMES.DEFAULT]: defaultThemeConfig,
  [THEMES.DARK]: darkThemeConfig,
  [THEMES.LUXURY]: luxuryThemeConfig,
  [THEMES.RETRO]: retroThemeConfig,
  [THEMES.MINIMAL]: minimalThemeConfig
};

// Create the context
const ThemeContext = createContext({
  theme: THEMES.DEFAULT,
  themeConfig: defaultThemeConfig,
  setTheme: () => {},
  availableThemes: Object.keys(THEMES)
});

// Theme provider component
export const ThemeProvider = ({ children, initialTheme = THEMES.DEFAULT }) => {
  // Get theme from localStorage or use default
  const [theme, setThemeState] = useState(initialTheme);
  const [themeConfig, setThemeConfig] = useState(THEME_MAP[initialTheme] || defaultThemeConfig);
  
  // Effect to load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && THEME_MAP[savedTheme]) {
      setThemeState(savedTheme);
      setThemeConfig(THEME_MAP[savedTheme]);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, [initialTheme]);
  
  // Handle theme change
  const setTheme = (newTheme) => {
    if (THEME_MAP[newTheme]) {
      setThemeState(newTheme);
      setThemeConfig(THEME_MAP[newTheme]);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };
  
  // Provide theme context to children
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeConfig, 
        setTheme,
        availableThemes: Object.keys(THEMES)
      }}
    >
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 