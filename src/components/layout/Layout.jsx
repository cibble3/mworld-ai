import React from 'react';
// Import the correct layout file
import ThemeLayout from '@/theme/layouts/ThemeLayout'; 

/**
 * Main Layout Component
 * 
 * Wraps the page content with the standard application layout,
 * which includes header, sidebar, footer, etc.
 * Uses the ThemeLayout component for the structure.
 */
const Layout = ({ children, ...props }) => {
  // Use ThemeLayout for consistent structure
  return (
    <ThemeLayout {...props}>
      {children}
    </ThemeLayout>
  );
};

export default Layout; 