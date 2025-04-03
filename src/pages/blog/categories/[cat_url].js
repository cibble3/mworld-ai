import styles from "@/components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "@/components/navigation/dark-themeLive";
import { Container } from "react-bootstrap";
import DarkSingleBlogPost from "@/components/DarkSingleBlogPost";
// import axiosInstance from "@/instance/axiosInstance";
import HeadMeta from "@/components/HeadMeta";
import { useState } from "react";
import { useEffect } from "react";
// import TopText from "@/utilities/TopText";
// import _shuffle from "lodash/shuffle";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import SkeletonBlogListing from "@/components/Skeletons/SkeletonBlogListing";
import pageLoaderContext from "@/context/PageLoaderContext";
import { useContext } from "react";
import blogdata from "../../../components/posts.json";
import { useParams } from "next/navigation";
const DashbpardDarkTheme = ({ data }) => {
  const [blogs, setBlogs] = useState([]);
  const [pageContent, setPageContent] = useState([]);
  const [isPageLoaded, setPageLoaded] = useState(false);
  const { pageLoader } = useContext(pageLoaderContext);
  const param = useParams();

  useEffect(() => {
    setPageContent(data?.pageContent);
    if (blogdata) {
      // const filterblog = blogdata.filter(
      //   (v) => v.category_name === param?.cat_url
      // );
      const filterblog = blogdata.filter((v) =>
        v.category_name.includes(param?.cat_url)
      );
      setBlogs(filterblog);
    }
  }, [param]);
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
      // syncVideos();
    }, 1000);
  }, [data]);
  const pageContent1 = {
    meta_desc: `${param?.cat_url} Blogs - Mistressworld.xxx`,
    meta_title: `${param?.cat_url} Blogs - Mistressworld.xxx`,
  };
  return (
    <>
      <HeadMeta pageContent={pageContent1} />
      <CookiesModal />

      <div>
        <DarkTheme>
          {isPageLoaded && !pageLoader ? (
            <div className={styles?.dasboardMain}>
              <Container>
                {/* {pageContent.top_text && (
                  <TopText html={pageContent.top_text} />
                )} */}
                <h1 className="text-4xl">The MistressWorld Live Fetish Blog</h1>
                <p className="text-white">
                  Step into the captivating realm of BDSM and fetishes with the
                  MistressWorld.xxx blog. Immerse yourself in a world of
                  engaging BDSM articles, features on fetish models, live
                  mistress cam highlights, and more. Uncover the latest trends,
                  insights, and news from the fetish universe right here on
                  MistressWorld.xxx, your ultimate destination for BDSM cams,
                  Fetish News, Live Mistresses, and beyond.
                </p>
                <div className="flex flex-wrap">
                  {blogs?.map((element, i) => {
                    return (
                      <DarkSingleBlogPost
                        key={i}
                        image={element?.feature_image || ""}
                        title1={element?.post_title}
                        post_url={element?.post_url}
                        title2={element?.post_content}
                      />
                    );
                  })}
                </div>
              </Container>
            </div>
          ) : (
            <>
              <div className={styles?.dasboardMain}>
                <Container>
                  <SkeletonTopText marginTop="mt-0" />

                  <div className="flex flex-wrap">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <SkeletonBlogListing key={i} />
                    ))}
                  </div>
                </Container>
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
//       `/blog/categories/${context.params.cat_url}?lang=${locale}`
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
