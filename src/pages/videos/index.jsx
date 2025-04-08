import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import Container from '@/theme/components/grid/Container';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { themes } from '@/theme/config';
import useModelFeed from '@/hooks/useModelFeed';
import { ApiProviders } from '@/services/api';
import VideoGrid from '@/theme/components/grid/VideoGrid';
import VideoCard from '@/theme/components/common/VideoCard';

// Video categories definition
const videoCategories = [
  {
    id: 'popular',
    name: 'Popular Videos',
    description: 'Most viewed videos across all categories',
    image: '/images/categories/popular-videos.jpg',
  },
  {
    id: 'new',
    name: 'New Videos',
    description: 'Fresh content added recently',
    image: '/images/categories/new-videos.jpg',
  },
  {
    id: 'amateur',
    name: 'Amateur',
    description: 'Real people sharing authentic experiences',
    image: '/images/categories/amateur-videos.jpg',
  },
  {
    id: 'fetish',
    name: 'Fetish',
    description: 'Explore unique desires and fantasies',
    image: '/images/categories/fetish-videos.jpg',
  },
  {
    id: 'lesbian',
    name: 'Lesbian',
    description: 'Videos featuring women together',
    image: '/images/categories/lesbian-videos.jpg',
  },
  {
    id: 'milf',
    name: 'MILF',
    description: 'Mature women showcasing their experience',
    image: '/images/categories/milf-videos.jpg',
  },
  {
    id: 'trans',
    name: 'Trans',
    description: 'Transgender performers and content',
    image: '/images/categories/trans-videos.jpg',
  },
  {
    id: 'anal',
    name: 'Anal',
    description: 'Focused on anal play and experiences',
    image: '/images/categories/anal-videos.jpg',
  }
];

// Category Card Component
const CategoryCard = ({ category }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes[THEMES.DARK];

  const cardStyle = {
    backgroundColor: currentTheme?.secondary || '#1a1c21',
    borderColor: currentTheme?.border || '#2d3748',
  };

  return (
    <Link href={`/videos/${category.id}`}>
      <div
        className="relative rounded-lg overflow-hidden group transition-all hover:shadow-lg"
        style={cardStyle}
      >
        <div className="aspect-video relative">
          {/* Use a placeholder image if the category image is missing */}
          <Image
            src={category.image || '/images/placeholder.jpg'}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{category.description}</p>
        </div>
      </div>
    </Link>
  );
};

const VideosPage = () => {
  // Create stable parameters to prevent unnecessary re-renders
  const trendingParams = useMemo(() => ({
    provider: ApiProviders.VPAPI,
    category: 'popular',
    limit: 8,
    filters: {
      sort: 'popular'
    }
  }), []); // Empty dependency array means these params never change

  const newVideosParams = useMemo(() => ({
    provider: ApiProviders.VPAPI,
    category: 'new',
    limit: 8,
    filters: {
      sort: 'newest'
    }
  }), []); // Empty dependency array means these params never change

  // Fetch trending videos with stable parameters
  const {
    models: trendingVideos,
    isLoading: trendingLoading
  } = useModelFeed(trendingParams);

  // Fetch new videos with stable parameters
  const {
    models: newVideos,
    isLoading: newVideosLoading
  } = useModelFeed(newVideosParams);

  // Ensure we have arrays even if data is missing
  const safeNewVideos = Array.isArray(newVideos) ? newVideos : [];
  const safeTrendingVideos = Array.isArray(trendingVideos) ? trendingVideos : [];

  // Prepare page metadata
  const pageContent = {
    meta_title: "Adult Videos - Browse Categories & Watch Online - MistressWorld",
    meta_desc: "Browse our extensive collection of adult videos across multiple categories. Watch high quality content online."
  };

  return (
    <div className="bg-background text-textblack min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />

      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
        <DynamicSidebar />
      </div>

      <div className="py-4 px-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Adult Videos</h1>
        <p className="text-gray-400 mb-6">
          Explore our extensive collection of high-quality adult videos. Browse by category or check out our featured content below.
        </p>

        {/* Main Content */}
        <section className="py-4">
          <h2 className="text-2xl font-bold mb-6">Video Categories</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videoCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {/* Featured Section - Now using actual video data */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Trending This Week</h2>

            <VideoGrid
              videos={safeTrendingVideos.slice(0, 4)}
              isLoading={trendingLoading}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              renderCard={(video, index) => (
                <VideoCard
                  key={`trending-${video.id || index}`}
                  image={video.thumbnail}
                  title={video.title}
                  duration={video.duration}
                  views={video.views}
                  category={video.category || 'popular'}
                  videoId={video.id}
                  preload={index < 4}
                />
              )}
            />

            <div className="text-center mt-6">
              <Link href="/videos/popular" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md inline-block transition-colors">
                View All Trending Videos
              </Link>
            </div>
          </div>

          {/* New Releases Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">New Releases</h2>

            <VideoGrid
              videos={safeNewVideos.slice(0, 4)}
              isLoading={newVideosLoading}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              renderCard={(video, index) => (
                <VideoCard
                  key={`new-${video.id || index}`}
                  image={video.thumbnail}
                  title={video.title}
                  duration={video.duration}
                  views={video.views}
                  category={video.category || 'new'}
                  videoId={video.id}
                  preload={index < 4}
                />
              )}
            />

            <div className="text-center mt-6">
              <Link href="/videos/new" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md inline-block transition-colors">
                View All New Videos
              </Link>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              Discover Premium Video Content
            </h2>
            <p className="text-gray-400 mb-3">
              Our video library features an extensive collection of high-quality adult content across numerous categories. Whether you're looking for amateur videos, professional productions, or niche content, you'll find it in our carefully curated selection.
            </p>
          </div>
          <div className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              New Videos Added Daily
            </h2>
            <p className="text-gray-400 mb-3">
              We're constantly updating our video collection with fresh content. Check back regularly to discover new videos from your favorite performers and exciting new talent in the adult entertainment industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default VideosPage; 