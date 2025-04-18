import React from "react";

const SkeletonTopText = ({ marginTop }) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center px-2">
      <div
        className={`${
          marginTop ? marginTop : `mt-12`
        } w-full animate-pulse flex-row items-center justify-center space-x-1`}
      >
        <div className="flex flex-col space-y-2">
          <div className="h-6 w-11/12 rounded-md bg-gray-600 "></div>
          <div className="h-6 w-10/12 rounded-md bg-gray-600 "></div>
          <div className="h-6 w-9/12 rounded-md bg-gray-600 "></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTopText;
