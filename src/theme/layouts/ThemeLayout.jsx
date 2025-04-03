import React from 'react';
import { useTheme, THEMES } from '@/context/ThemeContext';
import ModernLayout from './ModernLayout';
import LegacyLayout from './AppLayout';

/**
 * ThemeLayout - Smart layout component that selects the appropriate
 * layout based on the current theme.
 * 
 * This component ensures only ONE layout is rendered,
 * preventing nested layouts that cause duplicate headers/footers.
 */
const ThemeLayout = (props) => {
  const { theme } = useTheme();
  
  // For debugging:
  console.log(`Current theme: ${theme}`);
  
  // IMPORTANT: Only use one theme layout to prevent duplicate headers/footers
  // This ensures consistent layout across all categories and subcategories
  const useLegacyLayout = true; // Hard-coded to legacy for consistent layout
  
  // Only render one layout component based on setting
  if (useLegacyLayout) {
    return <LegacyLayout {...props} />;
  } else {
    return <ModernLayout {...props} />;
  }
};

export default ThemeLayout; 