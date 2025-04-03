import React from 'react';

const Container = ({ 
  children, 
  fluid = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'mx-auto px-4';
  const widthClasses = fluid ? 'w-full' : 'max-w-[1440px]';
  const combinedClasses = `${baseClasses} ${widthClasses} ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Container; 