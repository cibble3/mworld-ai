import React from "react";

const SkeletonBlogListing = () => {
  return (
    <div className="md:w-6/12 lg:w-4/12  sm:w-full mt-4 px-1  animate-pulse">
      <div className="bg-gray-600 h-52"></div>
    </div>
  );
};

export default SkeletonBlogListing;
