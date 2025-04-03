import { useRouter } from "next/router";
import { useMemo } from "react";
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import VideoGrid from '@/theme/components/grid/VideoGrid';
import VideoCard from '@/theme/components/common/VideoCard';
import { getCategoryMeta } from '@/utils/category-helpers'; 
import useModelFeed from '@/hooks/useModelFeed';
import TopText from "@/theme/components/content/TopText";
import BottomContent from "@/theme/components/content/BottomContent";
import { ApiProviders } from '@/services/api';

// Sample content for bottom sections (SEO text)
const videoContent = {
  popular: {
    title: "Popular Videos",
    description: "Browse our most popular videos across all categories. Updated daily based on viewer engagement.",
    content: [
      {
        heading: "Discover Top Trending Videos",
        desc: "Watch the hottest and most viewed videos on our platform. These videos are trending because of their exceptional quality and engaging content that viewers can't get enough of."
      },
      {
        heading: "Quality Content Updated Daily",
        desc: "Our popular videos section is refreshed daily to showcase the best new content. Whatever your preferences, you'll find the highest quality videos here."
      }
    ]
  },
  new: {
    title: "New Videos",
    description: "The latest videos added to our platform. Check back regularly for fresh content.",
    content: [
      {
        heading: "Fresh Content Every Day",
        desc: "Our new videos section features the most recent uploads across all categories. Be the first to watch the newest content from your favorite performers."
      },
      {
        heading: "Discover New Talent",
        desc: "New videos often showcase emerging talent and creators. Explore this section to find tomorrow's stars today."
      }
    ]
  },
  amateur: {
    title: "Amateur Videos",
    description: "Real people sharing authentic experiences. Our amateur collection features genuine content.",
    content: [
      {
        heading: "Authentic Amateur Content",
        desc: "Our amateur video section focuses on real, unscripted content from regular people. Experience the genuine passion and authenticity that professional productions sometimes lack."
      },
      {
        heading: "Supporting Independent Creators",
        desc: "By watching amateur videos, you're supporting independent content creators who share their personal experiences with the world."
      }
    ]
  }
};

const VideoCategoryPage = () => {
  const router = useRouter();
  const { category: videoCategory } = router.query;

  if (!videoCategory) {
    return (
      <div className="bg-[#16181c] min-h-screen">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-xl">Loading category...</div>
        </div>
      </div>
    );
  }

  // Fetch videos using our model feed hook with the VPAPI provider
  const { 
    models: videos, 
    isLoading, 
    error, 
    hasMore, 
    loadMore 
  } = useModelFeed({
    provider: ApiProviders.VPAPI,
    category: videoCategory,
    limit: 24,
    filters: {
      sort: videoCategory === 'new' ? 'newest' : 'popular'
    }
  });

  // Ensure we have a valid videos array
  const safeVideos = Array.isArray(videos) ? videos : [];

  // Derive metadata and page titles/descriptions
  const { meta, pageTitle, pageDescription, bottomContentJSX } = useMemo(() => {
    // Get the content for this category, or fallback to generic content
    const content = videoContent[videoCategory] || {
      title: `${videoCategory.charAt(0).toUpperCase() + videoCategory.slice(1)} Videos`,
      description: `Watch the best ${videoCategory} videos. New videos added daily.`
    };
    
    const title = content.title;
    const description = content.description;
    
    const computedMeta = {
      title: `${title} - MistressWorld`,
      description: description,
      keywords: `${videoCategory} videos, free videos, adult videos, video clips`,
    };
    
    // Create the bottom content
    const bottomContent = content.content ? (
      <div className="grid md:grid-cols-2 gap-8">
        {content.content.map((section, index) => (
          <div key={index} className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              {section.heading}
            </h2>
            <p className="text-gray-400 mb-3">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    ) : null;
    
    return { 
      meta: computedMeta, 
      pageTitle: title, 
      pageDescription: description,
      bottomContentJSX: bottomContent
    };
  }, [videoCategory]);

  // Create page metadata object for HeadMeta component
  const pageContent = {
    meta_title: meta.title,
    meta_desc: meta.description
  };

  return (
    <div className="bg-[#16181c] min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />
      
      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto">
        <DynamicSidebar />
      </div>
      
      <div className="py-4 px-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{pageTitle}</h1>
        <p className="text-gray-400 mb-6">{pageDescription}</p>
        
        {/* Videos Grid Section */}
        <section className="py-4">
          <VideoGrid
            videos={safeVideos}
            isLoading={isLoading}
            error={error}
            renderCard={(video, index) => (
              <VideoCard
                key={video.id || index}
                image={video.thumbnail}
                title={video.title}
                duration={video.duration}
                views={video.views}
                category={video.category || videoCategory}
                videoId={video.id}
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
                {isLoading ? 'Loading...' : 'Load More Videos'}
              </button>
            </div>
          )}
        </section>
        
        {/* Bottom Content Section */}
        {bottomContentJSX && (
          <div className="mt-12">
            {bottomContentJSX}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCategoryPage; 