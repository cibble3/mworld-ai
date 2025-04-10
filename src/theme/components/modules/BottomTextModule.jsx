import React from 'react';
import BottomContent from '../content/BottomContent';

/**
 * BottomTextModule - Unified component for displaying SEO/editorial content
 * at the bottom of pages.
 */
const BottomTextModule = ({ 
  children,
  title,
  content,
  html,
  className = ''
}) => {
  // If no content is provided and no children, don't render
  if (!children && !content && !html) return null;
  
  return (
    <div
      data-mw-module="bottomtext"
      className={`mt-12 mb-6 ${className}`}
    >
      <BottomContent title={title}>
        {/* Render any direct children */}
        {children}
        
        {/* Render provided content as paragraphs */}
        {Array.isArray(content) && content.map((paragraph, idx) => (
          <p key={idx} className="mb-3 text-gray-400">{paragraph}</p>
        ))}
        
        {/* Render raw HTML if provided */}
        {html && (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </BottomContent>
    </div>
  );
};

export default BottomTextModule; 