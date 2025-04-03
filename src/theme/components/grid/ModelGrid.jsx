import React from 'react';

// Simple skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-700"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      <div className="flex gap-1 pt-1">
        <div className="h-4 bg-gray-700 rounded w-10"></div>
        <div className="h-4 bg-gray-700 rounded w-12"></div>
        <div className="h-4 bg-gray-700 rounded w-10"></div>
      </div>
    </div>
  </div>
);

const ModelGrid = ({ 
  models = [], 
  isLoading = false, 
  error = null, 
  cols = 1, 
  sm = 2, 
  md = 3, 
  lg = 4, 
  xl = 4, 
  gap = 4, 
  children, // Function to render each model card
  gridClassName // Optional custom grid class
}) => {
  // Generate responsive grid classes based on props or use provided gridClassName
  const defaultGridClasses = `grid grid-cols-${cols} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-${gap}`;
  const gridClasses = gridClassName || defaultGridClasses;

  // Log detailed debug info
  console.log(`[ModelGrid] Rendering with props: models=${models?.length || 0}, isLoading=${isLoading}, error=${error ? 'yes' : 'no'}`);
  if (models && models.length > 0) {
    console.log(`[ModelGrid] First model:`, JSON.stringify(models[0]));
    // Check if children is a render function
    console.log(`[ModelGrid] Children type: ${typeof children}`);
  }

  // Determine number of skeletons to show (e.g., match common limit)
  const skeletonCount = 8;

  // Loading state
  if (isLoading && models.length === 0) {
    return (
      <div className={gridClasses || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
        {[...Array(skeletonCount)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 bg-red-900 bg-opacity-30 p-4 rounded border border-red-700">
        <p className="font-semibold">Error loading models:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Empty state
  if (!isLoading && models.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No models found matching your criteria.</p>
      </div>
    );
  }

  // Success state
  return (
    <div className={gridClasses || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
      {models.map((model, index) => children(model, index))}
    </div>
  );
};

export default ModelGrid; 