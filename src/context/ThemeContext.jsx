import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Available themes
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  LEGACY_DARK: 'legacy_dark',
};

// CSS variables for each theme
const THEME_VARIABLES = {
  [THEMES.DARK]: {
    '--primary-bg': '#121212',
    '--secondary-bg': '#1e1e1e',
    '--text-primary': '#ffffff',
    '--text-secondary': '#a0a0a0',
    '--accent-color': '#e0006c',
    '--border-color': '#2a2a2a',
  },
  [THEMES.LIGHT]: {
    '--primary-bg': '#f5f5f5',
    '--secondary-bg': '#ffffff',
    '--text-primary': '#121212',
    '--text-secondary': '#505050',
    '--accent-color': '#e0006c',
    '--border-color': '#e0e0e0',
  },
  [THEMES.LEGACY_DARK]: {
    '--primary-bg': '#0f0f0f',
    '--secondary-bg': '#1a1a1a',
    '--text-primary': '#ffffff',
    '--text-secondary': '#a0a0a0',
    '--accent-color': '#e0006c',
    '--border-color': '#2a2a2a',
  },
};

export const ThemeProvider = ({ children, initialTheme = THEMES.LEGACY_DARK }) => {
  // Force the legacy dark theme for now - this ensures consistent layout
  const [theme, setTheme] = useState(THEMES.LEGACY_DARK);

  useEffect(() => {
    // Always use legacy theme for now - no need to check storage
    const activeTheme = THEMES.LEGACY_DARK;
    
    // Apply CSS variables to :root
    applyThemeVariables(activeTheme);
    
    // Add theme class to body for global styling
    document.body.className = `theme-${activeTheme}`;
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    console.log('Theme set to:', activeTheme);
  }, []);

  const applyThemeVariables = (themeName) => {
    const variables = THEME_VARIABLES[themeName] || THEME_VARIABLES[THEMES.LEGACY_DARK];
    
    // Apply CSS variables to :root element
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  const changeTheme = (newTheme) => {
    // For now, we always use the legacy theme
    console.log('Theme change attempted, but using legacy theme');
    
    // If we wanted to allow switching:
    /*
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Apply new theme variables
      applyThemeVariables(newTheme);
      
      // Update body class and data attribute
      document.body.className = `theme-${newTheme}`;
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    */
  };

  const toggleTheme = () => {
    // For now, we always use the legacy theme
    console.log('Theme toggle attempted, but using legacy theme');
    
    // If we wanted to allow toggling:
    /*
    const themeValues = Object.values(THEMES);
    const currentIndex = themeValues.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeValues.length;
    const newTheme = themeValues[nextIndex];
    
    changeTheme(newTheme);
    */
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      toggleTheme, 
      THEMES,
      availableThemes: Object.values(THEMES),
      themeVariables: THEME_VARIABLES[theme] || THEME_VARIABLES[THEMES.LEGACY_DARK]
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 