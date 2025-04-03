import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

// Component-specific card types
import ModelCard from './cards/ModelCard';
import VideoCard from '@/theme/components/common/VideoCard';
// import BlogCard from './cards/BlogCard';

// Content type constants
export const CONTENT_TYPES = {
  MODEL: 'model',
  VIDEO: 'video',
  // BLOG: 'blog'
};

// Layout types
export const LAYOUT_TYPES = {
  GRID: 'grid',
  LIST: 'list',
  COMPACT: 'compact',
  FEATURED: 'featured'
};

/**
 * ContentGrid - Flexible grid component for displaying different content types
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of content items to display
 * @param {string} props.type - Content type (model, video, blog)
 * @param {string} props.layout - Layout type (grid, list, compact, featured)
 * @param {boolean} props.loading - Whether the content is loading
 * @param {boolean} props.showMoreButton - Whether to show a "Load More" button
 * @param {Function} props.onLoadMore - Function to call when "Load More" is clicked
 * @param {string} props.emptyMessage - Message to display when there are no items
 * @param {Object} props.containerProps - Props to pass to the container element
 * @returns {JSX.Element}
 */
const ContentGrid = ({
  items = [],
  type = CONTENT_TYPES.MODEL,
  layout = LAYOUT_TYPES.GRID,
  loading = false,
  showMoreButton = false,
  onLoadMore = () => {},
  emptyMessage = 'No content found',
  containerProps = {}
}) => {
  const { themeConfig } = useTheme();
  
  // Get the appropriate card component based on content type
  const getCardComponent = () => {
    switch (type) {
      case CONTENT_TYPES.MODEL:
        return ModelCard;
      case CONTENT_TYPES.VIDEO:
        return VideoCard;
      // case CONTENT_TYPES.BLOG:
      //   return BlogCard;
      default:
        console.warn(`ContentGrid received unknown type: ${type}, defaulting to ModelCard.`);
        return ModelCard;
    }
  };
  
  const CardComponent = getCardComponent();
  
  // Generate CSS classes based on layout type
  const getLayoutClasses = () => {
    const baseClass = 'content-grid';
    
    switch (layout) {
      case LAYOUT_TYPES.GRID:
        return `${baseClass} grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4`;
      case LAYOUT_TYPES.LIST:
        return `${baseClass} flex flex-col space-y-4`;
      case LAYOUT_TYPES.COMPACT:
        return `${baseClass} grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2`;
      case LAYOUT_TYPES.FEATURED:
        return `${baseClass} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`;
      default:
        return `${baseClass} grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4`;
    }
  };
  
  // Generate loading skeleton cards
  const renderSkeletons = () => {
    const skeletonCount = layout === LAYOUT_TYPES.COMPACT ? 12 : 10;
    return Array(skeletonCount).fill(0).map((_, index) => (
      <div 
        key={`skeleton-${index}`}
        className="bg-gray-200 animate-pulse rounded-md"
        style={{
          height: layout === LAYOUT_TYPES.COMPACT ? '150px' : '250px',
          borderRadius: themeConfig.components.card.borderRadius
        }}
      />
    ));
  };
  
  return (
    <div {...containerProps}>
      {/* Grid container */}
      <div className={getLayoutClasses()}>
        {loading ? (
          // Loading skeletons
          renderSkeletons()
        ) : items.length > 0 ? (
          // Content items
          items.map((item, index) => (
            <CardComponent
              key={item.id || item.slug || index}
              item={item}
              layout={layout}
              index={index}
            />
          ))
        ) : (
          // Empty state
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
      
      {/* Load more button */}
      {showMoreButton && items.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            style={{
              backgroundColor: themeConfig.palette.primary,
              color: themeConfig.palette.text.light,
              borderRadius: themeConfig.components.button.borderRadius,
              padding: themeConfig.components.button.padding,
              fontSize: themeConfig.components.button.fontSize,
              fontWeight: themeConfig.components.button.fontWeight,
              transition: themeConfig.transitions.standard
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentGrid; 