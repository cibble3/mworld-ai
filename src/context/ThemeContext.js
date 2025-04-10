import React, { createContext, useContext, useState, useEffect } from 'react';

// Simplified Theme definitions
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Theme Configurations (Palettes from theme.config.js)
const darkThemeConfig = {
  name: THEMES.DARK,
  palette: {
    primary: '#16181c',
    secondary: '#1a1c21',
    accent: '#e0006c',
    text: {
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#e0006c'
    },
    border: '#2d2d2d',
    button: {
      primary: '#e0006c',
      primaryHover: '#ff0080',
      secondary: '#2d2d2d',
      secondaryHover: '#3d3d3d'
    },
    status: {
      online: '#4caf50',
      offline: '#ff5252'
    },
    tag: {
      background: '#333333',
      text: '#ffffff',
      accent: '#e0006c'
    }
  }
  // NOTE: Add other shared config like typography, spacing later during consolidation
};

const lightThemeConfig = {
  name: THEMES.LIGHT,
  palette: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    accent: '#e0006c',
    text: {
      primary: '#16181c',
      secondary: '#4a4a4a',
      accent: '#e0006c'
    },
    border: '#e0e0e0',
    button: {
      primary: '#e0006c',
      primaryHover: '#ff0080',
      secondary: '#e0e0e0',
      secondaryHover: '#d0d0d0'
    },
    status: {
      online: '#4caf50',
      offline: '#ff5252'
    },
    tag: {
      background: '#e0e0e0',
      text: '#16181c',
      accent: '#e0006c'
    }
  }
  // NOTE: Add other shared config like typography, spacing later during consolidation
};

// Map of available light/dark themes
const THEME_MAP = {
  [THEMES.LIGHT]: lightThemeConfig,
  [THEMES.DARK]: darkThemeConfig
};

// Create the context
const ThemeContext = createContext({
  theme: THEMES.DARK, // Default to dark
  themeConfig: darkThemeConfig,
  setTheme: () => { }, // Will be replaced by toggleTheme
  toggleTheme: () => { },
  availableThemes: Object.values(THEMES) // Just ['light', 'dark']
});

// Theme provider component
export const ThemeProvider = ({ children, initialTheme = THEMES.DARK }) => {
  const [theme, setThemeState] = useState(initialTheme);
  const [themeConfig, setThemeConfig] = useState(THEME_MAP[initialTheme] || darkThemeConfig);

  // Effect to load theme from localStorage or use initial
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = (savedTheme && THEME_MAP[savedTheme]) ? savedTheme : initialTheme;
    
    if (THEME_MAP[currentTheme]) {
      setThemeState(currentTheme);
      setThemeConfig(THEME_MAP[currentTheme]);
      document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
      // Fallback if initialTheme was somehow invalid
      setThemeState(THEMES.DARK);
      setThemeConfig(darkThemeConfig);
      document.documentElement.setAttribute('data-theme', THEMES.DARK);
    }
  }, [initialTheme]); // Run only once based on initialTheme

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setThemeState(newTheme);
    setThemeConfig(THEME_MAP[newTheme]);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Provide theme context to children
  return (
    <ThemeContext.Provider
      value={{
        theme, // 'light' or 'dark'
        themeConfig, // The actual config object for the current mode
        toggleTheme, // Function to switch between light/dark
        availableThemes: Object.values(THEMES) // Pass simplified available themes
      }}
    >
      {/* Apply a class for potential global styling based on mode */}
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