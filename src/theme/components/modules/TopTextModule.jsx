import React from 'react';
import TopText from '../content/TopText';

/**
 * TopTextModule - Unified component for displaying page title and description.
 * Used at the top of each main content area.
 */
const TopTextModule = ({ 
  title, 
  description,
  html,
  isReady = true,
  className = ''
}) => {
  // Don't render anything if not ready or no content
  if (!isReady || (!title && !description && !html)) return null;
  
  return (
    <div
      data-mw-module="toptext"
      className={`my-4 ${className}`}
    >
      <TopText 
        title={title} 
        description={description}
        html={html}
      />
    </div>
  );
};

export default TopTextModule; 