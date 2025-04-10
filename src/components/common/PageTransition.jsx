import React, { useEffect, useState } from 'react';

/**
 * PageTransition - A simple component that wraps page content
 * to provide smooth transitions and loading states.
 * 
 * This version uses basic CSS transitions instead of framer-motion
 * to ensure compatibility.
 */
const PageTransition = ({ 
  children, 
  isLoading = false,
  loadingText = 'Loading...'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show content with a slight delay for transition effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay for effect
    
    return () => clearTimeout(timer);
  }, []);

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
          <span className="text-lg">{loadingText}</span>
        </div>
      </div>
    );
  }

  // Otherwise, render children with CSS transition
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition; 