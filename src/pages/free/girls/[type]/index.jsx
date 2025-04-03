// import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "../../../../components/navigation/dark-themeLive";
import { useContext, useEffect, useState, useMemo } from "react";
import HeadMeta from "@/components/HeadMeta";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import Image from "next/image";
import axios from "axios";
import pageLoaderContext from "@/context/PageLoaderContext";
import { useRouter } from "next/router";
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import { getCategoryMeta } from '@/utils/category-helpers';
import { freeGirlsContent } from "@/theme/content/freeGirlsContent";
import useModelFeed from '@/hooks/useModelFeed';
import { useTheme } from "@/context/ThemeContext";
import BottomContent from "@/theme/components/content/BottomContent";
import { capitalizeString } from "@/helper/helpers";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import useWindowSize from "@/hooks/useWindowSize";
import dynamic from "next/dynamic";
import TopText from "@/theme/components/content/TopText";

const Staticblogpost = dynamic(() => import("@/components/Staticblogpost"));

const HomeLiveScreenPhoto = dynamic(() =>
  import("@/components/NewHomeLiveScreenPhone")
);

const FreeGirlsTypePage = () => {
  const router = useRouter();
  const { type } = router.query;

  if (!type) {
    return <ThemeLayout meta={{title: "Loading..."}}><div>Loading category...</div></ThemeLayout>;
  }

  const { models, isLoading, error, hasMore, loadMore } = useModelFeed({
    category: 'free',
    subcategory: type,
    limit: 32,
    // filters: { gender: 'female' } // Assuming API handles this implicitly or via subcategory
  });

  // Use specific title/desc from freeGirlsContent if available for the page heading
  const pageContent = freeGirlsContent[type] || {};
  const title = pageContent.title || `Live ${capitalizeString(type)} Sex Cams`;
  const desc = pageContent.desc || `Watch live ${type} sex cams for free.`;

  // Construct meta tags
  const meta = {
    title: pageContent.meta_title || title,
    description: pageContent.meta_desc || desc,
    keywords: pageContent.meta_keywords || `${type} sex cams, live ${type} cams, free ${type} cams`,
    // Add other meta tags as needed (e.g., canonical, open graph)
  };

  // Define Bottom Content JSX
  const bottomContentJSX = useMemo(() => pageContent.about ? (
    <div className="grid md:grid-cols-2 gap-8">
      {pageContent.about.map((section, index) => (
        <div key={index} className="bg-[#1a1c21] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-pink-500">
            {section.heading}
          </h2>
          {section.desc1.map((paragraph, idx) => (
            <p key={idx} className="text-gray-400 mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  ) : null, [pageContent]);

  return (
    <ThemeLayout 
      meta={meta} 
      title={title}           // Pass title prop
      description={desc}       // Pass description prop
      bottomContentChildren={bottomContentJSX} // Pass children for BottomContent
    >
      {/* Models Grid Section */}
      <section className="py-8">
        <ModelGrid
          models={models}
          isLoading={isLoading}
          error={error}
          cols={1} sm={2} md={3} lg={4} gap={6}
          renderCard={(model, index) => (
            <ModelCard
              key={model.id || index}
              image={model.images?.thumbnail}
              name={model.performerName}
              age={model.appearances?.age}
              tags={model.categories}
              ethnicity={model.appearances?.ethnicity}
              performerId={model.slug}
              isOnline={model.isOnline}
              viewerCount={model.viewerCount}
              preload={index < 4}
            />
          )}
        />

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More Models'}
            </button>
          </div>
        )}
      </section>
    </ThemeLayout>
  );
};

export default FreeGirlsTypePage;

export async function getServerSideProps(context) {
  const { req, res, locale } = context;
  res.setHeader(
    "Cache-Control",
    "public, max-age=31536000, s-maxage=10, stale-while-revalidate=59"
  );

  try {
    const apiUrl = `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=1f2Eo&client_ip=request_ip&gender=f&tag=${context.params.type}`;
    const response = await axios.get(apiUrl);
    // Return the fetched data as props
    return {
      props: {
        data: response.data,
      },
    };
  } catch (error) {
    // Handle errors if any
    console.error("Error fetching data:", error);

    // You can return an error message or an empty data object here if needed
    return {
      props: {
        data: {},
      },
    };
  }
}
