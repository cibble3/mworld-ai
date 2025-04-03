import styles from "../../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "../../components/navigation/dark-themeLive";
import { Container } from "react-bootstrap";
import DarkSingleBlogPost from "@/components/DarkSingleBlogPost";
// import axiosInstance from "@/instance/axiosInstance";
import HeadMeta from "@/components/HeadMeta";
import { useState, useContext } from "react";
import LanguageContext from "@/context/LanguageContext";
import { useEffect } from "react";
// import TopText from "@/utilities/TopText";
// import _shuffle from "lodash/shuffle";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import SkeletonBlogListing from "@/components/Skeletons/SkeletonBlogListing";
import pageLoaderContext from "@/context/PageLoaderContext";
import blogdata from "../../components/posts.json";
import Image from "next/image";

const DashbpardDarkTheme = ({ data }) => {
  const [blogs, setBlogs] = useState([]);
  const [pageContent, setPageContent] = useState([]);
  const [pageNo, setPageNo] = useState(2);
  const [loading, setLoading] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const [isPageLoaded, setPageLoaded] = useState(false);
  const { pageLoader } = useContext(pageLoaderContext);

  useEffect(() => {
    setPageContent(data?.pageContent);

    if (blogdata) {
      setBlogs(blogdata);
    }
  }, [blogdata]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 2000);
  }, [blogdata]);
  // const loadMoreBlogs = async () => {
  //   if (!loading) {
  //     setLoading(true);
  //     try {
  //       const response = await axiosInstance.get(
  //         `/blog/?page=${pageNo}&lang=${selectedLanguage}`
  //       );
  //       const data = response?.data?.articles;
  //       if (data === "") {
  //       } else {
  //         if (Array.isArray(data)) {
  //           setBlogs((prevModels) => [...prevModels, ...data]);
  //         } else {
  //           setBlogs((prevModels) => [...prevModels, data]);
  //         }
  //         setPageNo((prevPageNo) => prevPageNo + 1);
  //       }
  //     } catch (error) {}
  //     setLoading(false);
  //   }
  // };

  const pageContent1 = {
    id: 560,
    pid: null,
    lang_id: 1,
    blog_category_id: 0,
    page_url: "blog",
    featured_image: null,
    image_alt_text: null,
    category: "blog",
    subcategory: null,
    free_cat_tag: null,
    free_cat_tag_url: null,
    meta_title: "Mistressworld Blog- Live Fetish Cams",
    meta_keywords:
      "mistress cams, cam blog, fetish cams, girl cams, trans cams, tranny cams",
    meta_desc:
      "Welcome to the MistressWorld Fetish Blog, enjoy BDSM articles, fetish models, live BDSM cam models and more.",
    top_text:
      "<h1>The MistressWorld Live Fetish Blog</h1> <p>Step into the captivating realm of BDSM and fetishes with the MistressWorld.xxx blog. Immerse yourself in a world of engaging BDSM articles, features on fetish models, live mistress cam highlights, and more. Uncover the latest trends, insights, and news from the fetish universe right here on MistressWorld.xxx, your ultimate destination for BDSM cams, Fetish News, Live Mistresses, and beyond.</p>",
    bottom_text:
      "<h2>Embark on a Kinky Adventure with MistressWorld.xxx's BDSM Blog and Live BDSM Cam Models</h2> <p>Join us on a tantalizing journey of discovery with the MistressWorld.xxx BDSM blog. Our dedicated fetish writers scour the depths of the fetish and BDSM world to bring you the most scintillating news, captivating models, and intriguing industry insights. Engage with our posts, delve into discussions, and explore the endless possibilities of kink and fetish culture.</p> <h3>Interactive Exploration of Fetish Desires</h3> <p>At MistressWorld.xxx, we invite you to become an active part of our vibrant fetish community. Share your thoughts, opinions, and desires as you interact with our blog posts. Comment on your favorite articles, engage in conversations, and let us know what kind of thrilling fetish content you'd like to see more of.</p> <h4>Your Window into the Fetish Universe</h4> <p>Our BDSM blog is your window into the captivating world of fetishes, BDSM, and all things kinky. Stay informed about the latest trends, indulge in thought-provoking articles, and discover new aspects of your own desires. As you journey through our blog, you'll find yourself drawn deeper into the enchanting tapestry of fetish culture.</p> <p>Join MistressWorld.xxx now to unlock the secrets of the fetish universe through our engaging BDSM blog, captivating live BDSM cam models, and an array of exciting features that await you. Start your journey into the realms of desire today!</p>",
    added_date: "2017-12-02 05:45:02",
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
                <div className="row">
                  {blogdata?.map((element, i) => {
                    return (
                      <DarkSingleBlogPost
                        key={i}
                        image={element?.feature_image || ""}
                        title1={element?.post_title}
                        post_url={element?.post_url}
                        title2={element?.post_content}
                      />
                      // <Image
                      //   height={500}
                      //   width={500}
                      //   className="card-img-top w-full"
                      //   style={{ height: "200px" }}
                      //   src={element?.feature_image || ""}
                      //   alt={`Blog Post: ${element?.post_title}`}
                      //   role="button"
                      // />
                    );
                  })}
                </div>
                {/* <div className="parent-loadbtn">
                  <button
                    className="loading-btn"
                    onClick={loadMoreBlogs}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More Blogs"}
                  </button>
                </div> */}
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
//     const response = await axiosInstance.get(`/blog?limit=9&lang=${locale}`);
//     const responseData = response.data;

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
