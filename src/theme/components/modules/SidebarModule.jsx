import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import LegacySidebar from '../navigation/LegacySidebar';

/**
 * SidebarModule - Simplified sidebar component that renders
 * the LegacySidebar directly without conditional visibility.
 */
const SidebarModule = ({
  mobile = false,
  customClass = '',
  onClose
}) => {
  const { theme } = useTheme();
  
  console.log('[SidebarModule] Rendering in simplified mode, mobile:', mobile);
  
  // Mobile is handled separately in the layout
  if (mobile) {
    return (
      <>
        {/* Backdrop for mobile */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
        
        {/* Mobile sidebar */}
        <div
          className="fixed inset-y-0 left-0 w-64 max-w-[300px] z-50 bg-background overflow-y-auto"
          style={{
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}
        >
          <LegacySidebar onClose={onClose} />
        </div>
      </>
    );
  }
  
  // Regular sidebar is rendered directly by the parent layout now
  return <LegacySidebar onClose={onClose} />;
};

export default SidebarModule; 