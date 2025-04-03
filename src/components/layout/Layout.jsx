import React from 'react';
// Import the actual existing layout file
import LegacyLayout from '@/theme/layouts/AppLayout'; 

/**
 * Main Layout Component
 * 
 * Wraps the page content with the standard application layout,
 * which includes header, sidebar, footer, etc.
 * Currently uses LegacyLayout component which contains the main structure.
 */
const Layout = ({ children, ...props }) => {
  // Use LegacyLayout for consistent structure
  return (
    <LegacyLayout {...props}>
      {children}
    </LegacyLayout>
  );
};

export default Layout; 