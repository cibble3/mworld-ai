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
  console.log(`Current ThemeLayout theme: ${theme}`);
  
  // TEMPORARILY: Always use ModernLayout to fix styling issues
  return <ModernLayout {...props} />;
  
  // Original code (commented out):
  // const useLegacyLayout = theme !== THEMES.DEFAULT;
  // if (useLegacyLayout) {
  //   return <LegacyLayout {...props} />;
  // } else {
  //   return <ModernLayout {...props} />;
  // }
};

export default ThemeLayout; 