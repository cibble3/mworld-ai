import React from 'react';

const BottomContent = ({ children }) => {
  if (!children) {
    return null; // Don't render the section if there's no content
  }

  return (
    <section className="py-8 mt-8 border-t border-gray-700">
      {/* Add specific styling or structure as needed */}
      {children}
    </section>
  );
};

export default BottomContent; 