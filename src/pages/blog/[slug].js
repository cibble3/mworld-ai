import styles from "@/components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "@/components/navigation/dark-themeLive";
import DarkLatestBlogPost from "@/components/DarkLatestBlogPost";
// import axiosInstance from "@/instance/axiosInstance";
import {
  decodeAndSanitizeHTML,
  removeHtmlEntities,
  renderProcessedContent,
  stripTags,
} from "@/helper/helpers";
import HeadMeta from "@/components/HeadMeta";
import Link from "next/link";
import { useEffect, useContext, useState } from "react";
import Image from "next/image";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonBlogDetails from "@/components/Skeletons/SkeletonBlogDetails";
import pageLoaderContext from "@/context/PageLoaderContext";
import blogdata from "../../components/posts.json";
import { useRouter } from "next/router";
import menuData from "../../context/menuData.json";
const DashbpardDarkTheme = ({ data }) => {
  const [blog, setBlog] = useState([]);
  const [misblog, setmisBlog] = useState([]);
  const [pageContent, setPageContent] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPageLoaded, setPageLoaded] = useState(false);
  const { pageLoader } = useContext(pageLoaderContext);
  const route = useRouter();
  const mappedArray = Object.entries(menuData?.Blog?.data?.Categories).map(
    ([key, value]) => ({ key, value })
  );
  const handleToggle = () => {
    isMobile && setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    setPageContent(data?.pageContent);
    const matchblog = blogdata.filter((v) => v?.post_url == route?.query?.slug);
    const mismatchblog = blogdata.filter(
      (v) => v?.post_url != route?.query?.slug
    );
    setmisBlog(mismatchblog);
    setBlog(matchblog);
  }, [route]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
      // syncVideos();
    }, 1000);
  }, [data]);
  const sanitizedContent = decodeAndSanitizeHTML(blog[0]?.post_content);
  const sanitizedTitle = decodeAndSanitizeHTML(blog[0]?.post_title);
  return (
    <>
      <HeadMeta pageContent={blog[0]?.pageContent} />
      <CookiesModal />

      <div>
        <DarkTheme>
          {isPageLoaded && !pageLoader ? (
            <div className={styles?.dasboardMain} style={{ height: "100%" }}>
              <div className="blogcontainer mx-auto">
                <div className=" mt-4 flex flex-wrap">
                  <div className=" lg:w-8/12">
                    <div className={styles?.subHeading}>
                      <div className={styles?.heading}>
                        <h5 className={`${styles.cardtext} mb-3 lh-base`}>
                          {/* {blog[0]?.post_title} */}
                          {/* {extractH1Text()} */}
                          <div
                            className="blog"
                            dangerouslySetInnerHTML={{
                              __html: sanitizedTitle,
                            }}
                          />
                        </h5>
                      </div>
                    </div>

                    <div className="mt-4 mb-4 break-all">
                      <Image
                        height={500}
                        width={500}
                        src={blog[0]?.feature_image || ""}
                        className="w-full"
                        alt=""
                      />
                    </div>
                    <h1 onClick={handleToggle}>
                      {/* {extractH1Text()} */}
                      {isMobile && (
                        <>
                          {" "}
                          {blog[0]?.post_content?.includes("<p>") &&
                            (isExpanded ? (
                              <AiFillCaretUp size={30} onClick={handleToggle} />
                            ) : (
                              <AiFillCaretDown
                                size={30}
                                onClick={handleToggle}
                              />
                            ))}
                        </>
                      )}
                    </h1>
                    {/* <div className="break-all"> */}
                    <div className="blogdetail">
                      {isMobile ? (
                        <>
                          {isExpanded && (
                            // <p style={{ display: "block" }}>{extractPText()}</p>
                            <div
                              className="blog"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedContent,
                              }}
                            />
                          )}
                          {!isExpanded && (
                            // <p style={{ display: "none" }}>{extractPText()}</p>
                            <div
                              className="blog"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedContent,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        // <p>{extractPText()}</p>
                        // <div
                        //   className="whatever"
                        //   dangerouslySetInnerHTML={{
                        //     __html: blog[0]?.post_content,
                        //   }}
                        // ></div>
                        // <div>
                        //   {removeHtmlEntities(
                        //     stripTags(he.decode(blog[0].post_content))
                        //   )}
                        // </div>
                        // <div>
                        //   {" "}
                        //   {removeHtmlTags(removeHtmlTags(blog[0].post_content))}
                        // </div>
                        <div
                          className="blog"
                          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                      )}
                    </div>
                  </div>

                  <div className=" lg:w-4/12 lg:mt-0 mt-10">
                    <div className={styles?.blogside}>
                      <div className={styles?.headingblog}>Latest Blog</div>
                      {misblog?.slice(0, 14).map((element, i) => {
                        return (
                          <DarkLatestBlogPost
                            key={i}
                            image={element?.feature_image}
                            title1={element?.post_title}
                            title2={renderProcessedContent(
                              element?.post_content,
                              100
                            )}
                            post_url={element?.post_url}
                          />
                        );
                      })}
                    </div>

                    <div className={"mt-3 categories " + styles?.blogside}>
                      <div className={styles?.headingblog}>Categories</div>
                      <ul className="ps-3">
                        {mappedArray.map((element, i) => {
                          return (
                            // key > 0 && (
                            <Link
                              rel="preconnect"
                              key={i?.key}
                              href={`/blog/categories/${element?.key}`}
                            >
                              <li key={i} className="mt-2 ">
                                {element?.key}
                              </li>
                            </Link>
                            // )
                          );
                        })}
                      </ul>
                    </div>

                    <div className={"mt-3 tag-cloud " + styles?.blogside}>
                      <div className={styles?.headingblog}>Tags</div>
                      <ul>
                        {mappedArray.map((element, i) => (
                          // data?.sidebar?.tagCloud[key] !== "" && (
                          <Link
                            key={element?.key}
                            rel="preconnect"
                            href={`/blog/categories/${element?.key}`}
                          >
                            <li key={element?.key}>{element?.key}</li>
                          </Link>
                          // )
                        ))}
                      </ul>
                    </div>
                    {/* <div className={"mt-3 tag-cloud " + styles?.blogside}>
                      <div className={styles?.headingblog}>Tags</div>
                      <ul>
                        {Object.keys(data?.sidebar?.tagCloud).map(
                          (key) =>
                            data?.sidebar?.tagCloud[key] !== "" && (
                              <Link rel="preconnect" href={`/blog/tag/${key}`}>
                                <li key={key}>
                                  {data?.sidebar?.tagCloud[key]}
                                </li>
                              </Link>
                            )
                        )}
                      </ul>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles?.dasboardMain} style={{ height: "100%" }}>
                <div className="container">
                  <SkeletonBlogDetails />
                </div>
              </div>
            </>
          )}
        </DarkTheme>
      </div>
    </>
  );
};
export default DashbpardDarkTheme;

// export async function getServerSideProps(context) {
//   const { req, res, locale } = context;

//   res.setHeader(
//     "Cache-Control",
//     "public, s-maxage=10, stale-while-revalidate=59"
//   );

//   try {
//     const response = await axiosInstance.get(
//       `/blog/${context.params.slug}?lang=${locale}`
//     );

//     const responseData = response.data;

//     if (!responseData.status) {
//       return {
//         redirect: {
//           destination: "/blog",
//           permanent: false,
//         },
//       };
//     }
//     return {
//       props: {
//         data: responseData,
//       },
//     };
//   } catch (error) {
//     return {
//       notFound: true,
//     };
//   }
// }
