import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import HeadMeta from '@/components/HeadMeta';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import VideoGrid from '@/theme/components/grid/VideoGrid';
import VideoCard from '@/theme/components/common/VideoCard';
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
  const { category } = router.query;
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  
  // Use effect to simulate video loading and track router state
  useEffect(() => {
    if (!router.isReady) return;
    
    console.log('[VideoPage] Router ready, category:', category);
    setLoading(true);
    
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      setVideos(generateDummyVideos(category));
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [category, router.isReady]);
  
  // Generate dummy videos for demo purposes
  const generateDummyVideos = (categoryParam) => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `video-${categoryParam}-${i}`,
      title: `${categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) : 'Featured'} Video ${i + 1}`,
      thumbnail: `https://picsum.photos/id/${300 + i}/400/225`,
      duration: `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      views: Math.floor(Math.random() * 100000),
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 3600 * 1000).toISOString(),
      premium: Math.random() > 0.7,
      performer: {
        id: `performer-${i % 10}`,
        name: `Performer ${i % 10 + 1}`
      }
    }));
  };
  
  // Use memo to cache our page data
  const pageData = useMemo(() => {
    if (!category) return { 
      title: "Videos", 
      description: "Browse our video collection" 
    };
    
    // Use predefined content if available, otherwise generate based on category
    const content = videoContent[category] || {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Videos`,
      description: `Browse our collection of ${category} videos.`,
      content: [
        {
          heading: `${category.charAt(0).toUpperCase() + category.slice(1)} Videos Collection`,
          desc: `Explore our handpicked selection of ${category} videos featuring the best content from top performers.`
        }
      ]
    };
    
    return content;
  }, [category]);
  
  const bottomContentJSX = pageData.content ? (
    <div className="grid md:grid-cols-2 gap-8 mt-8">
      {pageData.content.map((section, i) => (
        <div key={i} className="bg-gray-800/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            {section.heading}
          </h2>
          <p className="text-gray-400">
            {section.desc}
          </p>
        </div>
      ))}
    </div>
  ) : null;
  
  // Meta data for SEO
  const meta = {
    title: `${pageData.title} - MistressWorld`,
    description: pageData.description,
    keywords: `${category || ''} videos, adult videos, webcam recordings`
  };
  
  return (
    <ThemeLayout 
      meta={meta}
      title={router.isReady ? pageData.title : 'Loading Videos...'}
      description={pageData.description}
      bottomContentChildren={router.isReady && bottomContentJSX}
    >
      <div className="py-4">
        {(!router.isReady || loading) ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-xl">Loading videos...</div>
          </div>
        ) : (
          <VideoGrid videos={videos} isLoading={false}>
            {(video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                views={video.views}
                date={video.date}
                premium={video.premium}
                performer={video.performer}
              />
            )}
          </VideoGrid>
        )}
      </div>
    </ThemeLayout>
  );
};

export default VideoCategoryPage; 