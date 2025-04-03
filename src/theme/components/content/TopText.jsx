import React from 'react';

const TopText = ({ title, description }) => {
  if (!title && !description) {
    return null; // Don't render anything if no content is provided
  }

  return (
    <section className="py-8 text-center md:text-left">
      {title && (
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-lg text-gray-400 max-w-3xl mx-auto md:mx-0">
          {description}
        </p>
      )}
    </section>
  );
};

export default TopText; 