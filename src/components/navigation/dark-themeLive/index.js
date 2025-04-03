import React, { useEffect, useState, useRef } from "react";
import SideBar from "./sideBar";
import styles from "../dark-themeLive/dashbpard-dark-theme.module.css";
import useWindowSize from "@/hooks/useWindowSize";
import HorizontalMenu from "../dark-themeLive/horizontalMenu";
import { useRouter } from "next/router";
import { isMobile, isBrowser } from "react-device-detect";
import pageLoaderContext from "@/context/PageLoaderContext";
// import { TailSpin } from "react-loader-spinner";
import { useContext } from "react";

const Index = ({ children }) => {
  const { width, height } = useWindowSize();
  const [collapse, setCollapse] = useState(true); // width < 851

  // const { pageLoader, setPageLoader } = useContext(pageLoaderContext);

  const { asPath } = useRouter();

  const topRef = useRef(null);
  useEffect(() => {
    if (isMobile) {
      setCollapse(true);
    } else if (isBrowser) {
      setCollapse(false);
    } else {
      setCollapse(true);
    }
  }, [width]);

  useEffect(() => {
    topRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [asPath]);

  const handleResize = () => {
    if (isMobile) {
      //width < 851
      setCollapse(true);
    }
  };

  const contentStyle = {
    width: collapse ? "100%" : "",
    height: height - 50,
    overflow: "scroll",
  };

  return (
    <div>
      <HorizontalMenu collapse={collapse} setCollapse={setCollapse} />
      <div className="flex w-full m-0">
        {(!collapse || isMobile) && (
          <SideBar collapse={collapse} setCollapse={setCollapse} />
        )}
        <div
          ref={topRef}
          onClick={handleResize}
          className={`${
            collapse ? "w-11/12" : "md:w-9/12 lg:w-10/12"
          } p-0 pb-4 w-full bg-[#16181c]`}
          style={contentStyle}
        >
          <div className={styles.main_wrapper}>
            <div className={styles.children_wrap}>
              {children}
              {/* {pageLoader ? (
                <TailSpin
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  visible={pageLoader}
                />
              ) : (
                children
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
