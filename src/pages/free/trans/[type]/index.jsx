// import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "../../../../components/navigation/dark-themeLive";
import { useContext, useEffect, useState } from "react";
import HeadMeta from "@/components/HeadMeta";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import Image from "next/image";
import axios from "axios";
import pageLoaderContext from "@/context/PageLoaderContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import useWindowSize from "@/hooks/useWindowSize";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { freeTransContent } from "@/theme/content/freeTransContent";
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import { getCategoryMeta } from '@/utils/category-helpers';
import useModelFeed from '@/hooks/useModelFeed';
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import TopText from "@/theme/components/content/TopText";
import BottomContent from "@/theme/components/content/BottomContent";
import { capitalizeString } from "@/helper/helpers";

const Staticblogpost = dynamic(() => import("@/components/Staticblogpost"));

const HomeLiveScreenPhoto = dynamic(() =>
  import("@/components/NewHomeLiveScreenPhone")
);

const FreeTransTypePage = () => {
  const router = useRouter();
  const { type } = router.query;

  if (!type) {
    return <ThemeLayout meta={{title: "Loading..."}}><div>Loading category...</div></ThemeLayout>;
  }

  const { models, isLoading, error, hasMore, loadMore } = useModelFeed({
    category: 'free',
    subcategory: type,
    limit: 32,
    filters: { gender: 'transgender' } // Assuming API supports this filter for 'free' category
  });

  // Use specific title/desc from freeTransContent if available for the page heading
  const pageContent = freeTransContent[type] || {};
  const title = pageContent.title || `Live Free ${capitalizeString(type)} Trans Cams`;
  const desc = pageContent.desc || `Watch live free ${type} trans cams.`;

  const { categoryData, meta, pageTitle, pageDescription } = useMemo(() => {
    const data = getCategoryMeta(type);
    const computedMeta = {
      title: title,
      description: desc,
      keywords: `free ${type} trans cams, free live trans cams, ${data?.keywords || 'webcam models, live chat'}`,
    };
    // Use specific title/desc from freeTransContent if available for the page heading
    const finalPageTitle = pageContent.title || title;
    const finalPageDescription = pageContent.desc || desc;
    return { categoryData: data, meta: computedMeta, pageTitle: finalPageTitle, pageDescription: finalPageDescription };
  }, [type, pageContent]);

  // Define Bottom Content JSX
  const bottomContentJSX = pageContent.about ? (
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
  ) : null;

  return (
    <ThemeLayout 
      meta={meta}
      title={pageTitle}           // Pass title prop
      description={pageDescription} // Pass description prop
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

export default FreeTransTypePage;
