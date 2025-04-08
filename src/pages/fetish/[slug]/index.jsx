import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/theme/config';
import axios from 'axios';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import { capitalizeString } from '@/utils/string-helpers';

// Fetish-specific content for SEO and descriptions
const fetishContent = {
  'leather': {
    title: 'Leather Fetish Cams',
    description: 'Watch leather fetish webcams featuring models in sexy leather outfits and gear. Mix of premium and free models.',
    meta_title: 'Leather Fetish Cams - Live Leather Webcams - MistressWorld',
    meta_desc: 'Watch leather fetish cams with premium and free models. See webcam models in leather outfits, corsets, and gear at MistressWorld.'
  },
  'latex': {
    title: 'Latex Fetish Cams',
    description: 'Watch latex fetish webcams featuring models in shiny latex and PVC outfits. Mix of premium and free models.',
    meta_title: 'Latex Fetish Cams - Live Latex Webcams - MistressWorld',
    meta_desc: 'Watch latex fetish cams with premium and free models. See webcam models in latex catsuits, dresses and outfits at MistressWorld.'
  },
  'bdsm': {
    title: 'BDSM Cams',
    description: 'Watch BDSM webcams featuring dominants, submissives and fetish performers. Mix of premium and free models.',
    meta_title: 'BDSM Cams - Live BDSM Webcams - MistressWorld',
    meta_desc: 'Watch BDSM cams with premium and free models. See webcam models performing BDSM acts and scenarios at MistressWorld.'
  },
  'feet': {
    title: 'Foot Fetish Cams',
    description: 'Watch foot fetish webcams featuring models showcasing their feet and performing foot play. Mix of premium and free models.',
    meta_title: 'Foot Fetish Cams - Live Feet Webcams - MistressWorld',
    meta_desc: 'Watch foot fetish cams with premium and free models. See webcam models showing off their feet and performing foot play at MistressWorld.'
  },
  'femdom': {
    title: 'Femdom Cams',
    description: 'Watch female domination webcams featuring dominant women and mistresses. Mix of premium and free models.',
    meta_title: 'Femdom Cams - Live Female Domination Webcams - MistressWorld',
    meta_desc: 'Watch femdom cams with premium and free models. See dominant women and mistresses controlling their subs at MistressWorld.'
  }
};

const FetishTypePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sourceCounts, setSourceCounts] = useState({});

  // Get content for this specific fetish type, or create default
  const content = slug && fetishContent[slug] ? fetishContent[slug] : {
    title: `${capitalizeString(slug || 'Fetish')} Cams`,
    description: `Watch ${slug || 'fetish'} webcams featuring the hottest models. Mix of premium and free models.`,
    meta_title: `${capitalizeString(slug || 'Fetish')} Cams - Live ${capitalizeString(slug || 'Fetish')} Webcams - MistressWorld`,
    meta_desc: `Watch ${slug || 'fetish'} cams with premium and free models. Stream live ${slug || 'fetish'} webcams at MistressWorld.`
  };

  useEffect(() => {
    // Only fetch if we have a type from the URL
    if (!slug) return;
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        
        // Fetch mixed models with the specific fetish type
        const response = await axios.get('/api/mixed-models', {
          params: {
            category: 'fetish',
            fetishType: slug, // Use the slug from URL as the fetish filter
            gender: 'female',
            limit: 200,
            page: page
          }
        });

        if (response.data?.success) {
          let fetchedModels = [];

          if (response.data.data?.models && Array.isArray(response.data.data.models)) {
            fetchedModels = response.data.data.models;
          }

          // Save source counts for display
          if (response.data.data?.sources) {
            const counts = {};
            response.data.data.sources.forEach(source => {
              counts[source.provider] = source.count;
            });
            setSourceCounts(counts);
          }

          // Check if we have pagination info
          const pagination = response.data.data?.pagination;
          if (pagination) {
            setHasMore(pagination.hasMore);
          } else {
            setHasMore(false);
          }

          // If it's the first page, replace models. Otherwise, append
          if (page === 1) {
            setModels(fetchedModels);
          } else {
            setModels(prevModels => [...prevModels, ...fetchedModels]);
          }
        } else {
          setError(response.data?.error || 'Failed to fetch models');
        }
      } catch (err) {
        console.error(`Error fetching ${slug} models:`, err);
        setError(err.message || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [slug, page]);

  // Load more models function
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Helper function to get provider label
  const getProviderLabel = (provider) => {
    switch(provider) {
      case 'awe': return 'Premium';
      case 'vpapi': return 'Premium';
      case 'free': return 'Free';
      default: return provider;
    }
  };

  // If we don't have a type yet (SSR first render), show loading
  if (!slug) {
    return <div className="bg-[#16181c] min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="bg-[#16181c] min-h-screen">
      <HeadMeta pageContent={{ meta_title: content.meta_title, meta_desc: content.meta_desc }} />
      <CookiesModal />

      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
        <DynamicSidebar />
      </div>

      <div className="py-4 px-3">
        {/* Top Text Component */}
        <div className="mb-6">
          <Link href="/fetish" className="inline-flex items-center text-pink-500 mb-2 hover:text-pink-400">
            ← All Fetish Cams
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-gray-400">
            {content.description}
          </p>
        </div>

        {/* Models Grid Section */}
        <section className="py-4">
          {loading && page === 1 ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse text-xl">Loading {slug} models...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              Error loading models: {error}
            </div>
          ) : models.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No {slug} models found currently. Please check back later or try another category.
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-5">
                Showing {models.length} {slug} models on MistressWorld, including 
                {sourceCounts.awe > 0 && ` ${sourceCounts.awe} premium`}
                {sourceCounts.vpapi > 0 && `${sourceCounts.awe > 0 ? ',' : ''} ${sourceCounts.vpapi} premium`}
                {(sourceCounts.awe > 0 || sourceCounts.vpapi > 0) && sourceCounts.free > 0 && ' and'} 
                {sourceCounts.free > 0 && ` ${sourceCounts.free} free`} models.
                These cam performers are streaming live right now.
              </p>

              <ModelGrid models={models} isLoading={false}>
                {(model) => (
                  <ModelCard
                    key={model.id || model.slug || model.performerId}
                    performerId={model.performerId || model.id || model.slug}
                    name={model.name || model.performerName || 'Unknown Model'}
                    age={model.age || model.appearances?.age}
                    ethnicity={model.ethnicity || model.appearances?.ethnicity}
                    tags={model.tags || []}
                    image={model.thumbnail || model.image || model.previewImage}
                    isOnline={model.isOnline !== false}
                    viewerCount={model.viewerCount || 0}
                    highlightTag={slug}
                    providerLabel={getProviderLabel(model._provider)}
                  />
                )}
              </ModelGrid>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More Models'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Bottom Content Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              {capitalizeString(slug)} Live Cams
            </h2>
            <p className="text-gray-400 mb-3">
              Enjoy our mixed feed of {slug} webcam shows featuring stunning models from premium and free sources. Our cam section allows you to watch {slug} performances from the best models across multiple platforms.
            </p>
          </div>
          <div className="bg-[#1a1c21] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-pink-500">
              More Fetish Categories
            </h2>
            <p className="text-gray-400 mb-3">
              Explore our diverse range of fetish cam categories by returning to the main fetish page. Whether you're into BDSM, leather, latex, foot worship, or any other fetish, we have the perfect cam show waiting for you.
            </p>
            <div className="mt-4">
              <Link href="/fetish" className="text-pink-500 hover:text-pink-400 font-semibold">
                View All Fetish Categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetishTypePage; 