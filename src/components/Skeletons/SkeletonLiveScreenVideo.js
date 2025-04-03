import React from "react";

const SkeletonLiveScreenVideo = () => {
  return (
    <div className={`xl:w-3/12  lg:w-4/12 md:w-4/12 w-full mt-4 animate-pulse `}>
      <div className={`w-100 h-48 max-h-full bg-gray-600 rounded`}></div>
    </div>
  );
};

export default SkeletonLiveScreenVideo;
