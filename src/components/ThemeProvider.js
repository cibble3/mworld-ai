import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTheme } from '../config/theme';

const ThemeContext = createContext();

/**
 * Theme provider component that makes theme available throughout the app
 */
export function ThemeProvider({ children, themeName = 'default' }) {
  const [theme, setTheme] = useState(loadTheme(themeName));
  
  // Generate CSS variables from theme
  useEffect(() => {
    const root = document.documentElement;
    
    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      }
    });
    
    // Typography
    Object.entries(theme.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--font-${key}`, value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--font-${key}-${subKey}`, subValue);
        });
      }
    });
    
    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Breakpoints
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value);
    });
    
    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }, [theme]);
  
  // Function to update theme
  const updateTheme = (newThemeName) => {
    setTheme(loadTheme(newThemeName));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme in components
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * HOC to inject theme into component props
 */
export function withTheme(WrappedComponent) {
  return function WithThemeComponent(props) {
    const { theme, updateTheme } = useTheme();
    return <WrappedComponent {...props} theme={theme} updateTheme={updateTheme} />;
  };
} 