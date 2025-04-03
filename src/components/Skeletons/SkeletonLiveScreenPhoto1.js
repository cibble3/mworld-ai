import React from "react";
import styles from "./SkeletonLiveScreenPhoto1.module.css";

const SkeletonLiveScreenPhoto1 = () => {
  return (
    <div className="xl:w-3/12 lg:w-4/12 md:w-6/12 w-full px-1 animate-pulse">
      <div className={`w-100 h-60 max-h-full bg-gray-600 `}></div>
      <div className="mb-11 md:mb-6 lg:mb-12 d-flex gap-1 flex-wrap ">
        <div className={`${styles.textShimmer} bg-gray-600 rounded-3`}></div>
        <div className={`${styles.textShimmer} bg-gray-600 rounded-3`}></div>
        <div className={`${styles.textShimmer} bg-gray-600 rounded-3`}></div>
      </div>
    </div>
  );
};

export default SkeletonLiveScreenPhoto1;
