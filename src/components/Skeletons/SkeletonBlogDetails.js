import React from "react";
import styles from "@/components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import SkeletonTopText from "./SkeletonTopText";

const SkeletonBlogDetails = () => {
  return (
    <div className=" mt-4 flex flex-wrap">
      <div className=" lg:w-8/12">
        <SkeletonTopText marginTop={"mt-0"} />
        <div className=" mt-4 px-1  animate-pulse">
          <div className="bg-gray-600 h-96"></div>
        </div>
        <SkeletonTopText marginTop={"mt-3"} />
        <SkeletonTopText marginTop={"mt-3"} />
        <SkeletonTopText marginTop={"mt-3"} />
      </div>
      <div className=" lg:w-4/12">
        <div className={styles?.blogside}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonTopText marginTop={"mt-3"} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonBlogDetails;
