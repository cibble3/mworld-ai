import React from 'react';

const GridSkeleton = ({ count = 8, cols = 4 }) => {
  // Generate a class string based on the number of columns
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-4`;
  
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-700 aspect-video rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="flex gap-1 flex-wrap">
            <div className="h-3 bg-gray-700 rounded w-1/6"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridSkeleton; 