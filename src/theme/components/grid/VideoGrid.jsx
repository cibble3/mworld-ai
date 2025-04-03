import React, { memo } from 'react';

// Simple skeleton card for loading state
const SkeletonCard = memo(() => (
  <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-700"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="flex justify-between mt-2">
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  </div>
));

const VideoGrid = ({ 
  videos = [], 
  isLoading = false, 
  error = null, 
  renderCard, // Function to render each video card
  cols = 1, 
  sm = 2, 
  md = 3, 
  lg = 4, 
  xl = 4, 
  gap = 4,
  gridClassName // Optional custom grid class
}) => {
  // Generate responsive grid classes based on props or use provided gridClassName
  const defaultGridClasses = `grid grid-cols-${cols} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-${gap}`;
  const gridClasses = gridClassName || defaultGridClasses;

  // Determine number of skeletons to show
  const skeletonCount = 8; 

  // Loading state
  if (isLoading && videos.length === 0) {
    return (
      <div className={gridClasses || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
        {[...Array(skeletonCount)].map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 bg-red-900 bg-opacity-30 p-4 rounded border border-red-700">
        <p className="font-semibold">Error loading videos:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Empty state
  if (!isLoading && videos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No videos found matching your criteria.</p>
      </div>
    );
  }

  // Success state
  return (
    <div className={gridClasses || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
      {videos.map((video, index) => renderCard(video, index))}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(VideoGrid); 