// import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "../../../components/navigation/dark-themeLive";
import { useContext, useEffect, useState, useMemo } from "react";
import HeadMeta from "@/components/HeadMeta";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import Image from "next/image";
import axios from "axios";
import pageLoaderContext from "@/context/PageLoaderContext";
import { useRouter } from "next/router";
import { text as girlsTransContent } from "@/theme/content/girlsTransContent";
import { getCategoryMeta } from '@/utils/category-helpers';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import useModelFeed from '@/hooks/useModelFeed';
import { capitalizeString } from '@/utils/string-helpers';
import { getModelThumbnail } from '@/utils/image-helpers';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import dynamic from "next/dynamic";

const HomeLiveScreenPhoto = dynamic(() =>
  import("@/components/NewHomeLiveScreenPhone")
);

const GirlsTypePage = () => {
  const router = useRouter();
  const { type } = router.query;

  if (!type) {
    return <ThemeLayout meta={{title: "Loading..."}}><div>Loading category...</div></ThemeLayout>;
  }

  const { models, isLoading, error, hasMore, loadMore } = useModelFeed({
    category: 'girls',
    subcategory: type,
    limit: 24,
  });

  // Get the content for this subcategory
  const content = girlsTransContent?.girls?.[type] || {
    title: `${capitalizeString(type || '')} Cam Girls`,
    desc: `Experience the hottest ${type} cam girls online at MistressWorld.xxx. Connect with stunning ${type} models for a private chat experience you'll never forget.`,
    meta_title: `${capitalizeString(type || '')} Cam Girls - Live ${capitalizeString(type || '')} Sex Chat - MistressWorld`,
    meta_desc: `Chat live with sexy ${type} cam girls online now. MistressWorld features the hottest adult chat models for private shows.`,
    meta_keywords: `${type} cam girls, ${type} cams, ${type} sex chat`
  };

  // Extract content fields for better access
  const { 
    title = `${capitalizeString(type || '')} Cam Girls`, 
    desc = `Experience amazing ${type} models`, 
    meta_title, 
    meta_desc, 
    meta_keywords,
    about = [] 
  } = content;

  // Prepare metadata for SEO
  const meta = {
    title: meta_title || title,
    description: meta_desc || desc,
    keywords: meta_keywords || `${type} cam girls, ${type} models`,
  };

  // Prepare the bottom content from the about sections (if present)
  const bottomContentJSX = about && about.length > 0 ? (
    <div className="grid md:grid-cols-1 gap-8">
      {about.map((section, i) => (
        <div key={i} className="bg-[#1a1c21] rounded-lg p-6">
          {section.heading && (
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              {section.heading}
            </h2>
          )}
          {section.desc1 && section.desc1.map((paragraph, j) => (
            <p key={j} className="text-gray-400 mb-3">
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
      title={title}           // Pass title prop
      description={desc} // Pass description prop
      bottomContentChildren={bottomContentJSX} // Pass children for BottomContent
    >
      {/* Cookies modal should ideally be part of the layout or a global provider */}
      {/* <CookiesModal /> */}
      
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
              image={getModelThumbnail(model)}
              name={model.performerName || model.name}
              age={model.appearances?.age || model.age}
              tags={model.categories || model.tags || []}
              ethnicity={model.appearances?.ethnicity || model.ethnicity}
              performerId={model.slug || model.id}
              isOnline={model.isOnline !== undefined ? model.isOnline : true}
              viewerCount={model.viewerCount || 0}
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

// Remove getServerSideProps - data fetching is handled by the hook client-side
// export async function getServerSideProps(context) { ... }

export default GirlsTypePage;
