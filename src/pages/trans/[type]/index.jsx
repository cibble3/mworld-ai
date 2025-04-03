// import styles from "../components/navigation/dark-themeLive/dashbpard-dark-theme.module.css";
import DarkTheme from "../../../components/navigation/dark-themeLive";
import { useContext, useEffect, useState, useMemo } from "react";
import HeadMeta from "@/components/HeadMeta";
import CookiesModal from "@/components/CookiesModal/CookiesModal";
import SkeletonTopText from "@/components/Skeletons/SkeletonTopText";
import Image from "next/image";
import axios from "axios";
import pageLoaderContext from "@/context/PageLoaderContext";
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import { getCategoryMeta } from '@/utils/category-helpers';
import { text as girlsTransContent } from "@/theme/content/girlsTransContent";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useModelFeed from '@/hooks/useModelFeed';
import { capitalizeString } from "@/helper/helpers";
const Staticblogpost = dynamic(() => import("@/components/Staticblogpost"));

const HomeLiveScreenPhoto = dynamic(() =>
  import("@/components/NewHomeLiveScreenPhone")
);

const TransTypePage = () => {
  const router = useRouter();
  const { type } = router.query;

  if (!type) {
    return <ThemeLayout meta={{title: "Loading..."}}><div>Loading category...</div></ThemeLayout>;
  }

  // Fetch models using the hook
  const { models, isLoading, error, hasMore, loadMore } = useModelFeed({
    category: 'trans',
    subcategory: type,
    limit: 32,
  });

  // Use specific title/desc from girlsTransContent if available for the page heading
  const pageContent = girlsTransContent[type] || {};
  const title = pageContent.title || `Live ${capitalizeString(type)} Trans Cams`;
  const desc = pageContent.desc || `Watch live ${type} trans cams.`;

  // Construct meta tags
  const meta = {
    title: pageContent.meta_title || title,
    description: pageContent.meta_desc || desc,
    keywords: pageContent.meta_keywords || `${type} trans cams, live ${type} trans cams`,
    // Add other meta tags as needed (e.g., canonical, open graph)
  };

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
      title={title}
      description={desc}
      bottomContentChildren={bottomContentJSX}
    >
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

export default TransTypePage;
