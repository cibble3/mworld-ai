import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import DarkTheme from '@/components/navigation/dark-themeLive';
import Slider from '@/components/slider/Slider';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import useWindowSize from '@/hooks/useWindowSize';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import dynamic from 'next/dynamic';

// Dynamically import components to reduce initial bundle size
const ModelCard = dynamic(() => import('@/components/cards/ModelCard'));
// Import our internal-linking FreeModelCard instead of the FetishModelCard
const FreeModelCard = dynamic(() => import('@/components/cards/FreeModelCard'));

// Default number of models to load per page
const DEFAULT_LIMIT = 32;

/**
 * Free Models Page - directly uses the free-models endpoint
 */
export default function FreePage({ initialData }) {
  const router = useRouter();
  const { width } = useWindowSize();
  const [models, setModels] = useState(initialData?.data?.models || []);
  const [loading, setLoading] = useState(models.length === 0);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(initialData?.data?.pagination || {});
  const [dropdown, setDropdown] = useState(true);

  // Determine if we're using mobile layout
  const isMobile = width < 700;

  // Fetch models on first load if none were provided by server
  useEffect(() => {
    // If we have no models from server-side props, try to fetch them client-side
    if (models.length === 0 && !error) {
      console.log('[FREE PAGE] No initial models, fetching from client side');
      fetchModels();
    }
  }, []);

  // Function to fetch models (used for initial load if server-side fails)
  const fetchModels = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('[FREE PAGE] Fetching models from client side');
      const response = await axios.get('/api/free-models', {
        params: {
          category: 'girls',
          limit: DEFAULT_LIMIT,
          offset: 0,
          _timestamp: Date.now()
        }
      });

      console.log('[FREE PAGE] Client-side API response:', response.status);

      if (response.data.success) {
        setModels(response.data.data.models || []);
        setPagination(response.data.data.pagination || {});
      } else {
        setError('Failed to load models: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('[FREE PAGE] Error fetching models:', err);
      setError(err.message || 'Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  // Load more models
  const loadMore = async () => {
    if (loading || !pagination.hasMore) return;

    setLoading(true);
    try {
      const nextOffset = pagination.offset + pagination.limit;
      const response = await axios.get('/api/free-models', {
        params: {
          category: 'girls', // Default to girls
          limit: DEFAULT_LIMIT,
          offset: nextOffset,
          _timestamp: Date.now()
        }
      });

      if (response.data.success) {
        // Append new models to existing ones
        setModels(current => [...current, ...(response.data.data.models || [])]);
        setPagination(response.data.data.pagination || {});
      } else {
        setError('Failed to load more models');
      }
    } catch (err) {
      console.error('Error loading more models:', err);
      setError(err.message || 'Failed to load more models');
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown for mobile display
  const handleToggle = () => {
    setDropdown(!dropdown);
  };

  // Prepare page metadata
  const pageContent = {
    meta_title: 'Free Live Sex Cams | Chaturbate Models',
    meta_desc: 'Watch free live sex cams with amateur cam girls and guys. No registration required - 100% free cam chat!',
    top_text: `
      <h2 class="text-white sm:text-base text-sm font-medium mb-3">
        Explore thousands of free live cams with amateur cam girls and guys. No registration required - 100% free cam chat!
      </h2>
    `,
    bottom_text: ''
  };

  // Mock subcategories for the Free section
  const freeSubcategories = [
    { id: 'girls', name: 'Girls', href: '/free/girls' },
    { id: 'trans', name: 'Trans', href: '/free/trans' },
    { id: 'couples', name: 'Couples', href: '/free/couples' },
    { id: 'male', name: 'Male', href: '/free/male' }
  ];

  return (
    <div className="bg-[#16181c] min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />

      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
        <DynamicSidebar />
      </div>

      <div className="py-4 px-3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-white sm:text-[28px] text-lg font-bold">
            {pageContent.meta_title}
          </h1>
          <span
            onClick={() => handleToggle()}
            className="cursor-pointer md:hidden transition-transform duration-300"
          >
            {dropdown ? (
              <MdKeyboardArrowUp fontSize={28} />
            ) : (
              <MdKeyboardArrowDown fontSize={28} />
            )}
          </span>
        </div>

        {dropdown && (
          <div dangerouslySetInnerHTML={{ __html: pageContent.top_text }} />
        )}

        <h2 className="text-white text-[28px] font-bold mb-3">
          Top Free Cam Categories
        </h2>

        {/* Display subcategories */}
        <div className="flex flex-wrap gap-3 mb-6">
          {freeSubcategories.map((subcat) => (
            <a
              key={subcat.id}
              href={subcat.href}
              className="px-4 py-2 bg-[#232630] text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              {subcat.name}
            </a>
          ))}
        </div>

        <h2 className="text-white text-[28px] font-bold mt-[30px]">
          Live Free Cams
        </h2>

        {error && (
          <div className="text-red-500 my-4 p-4 bg-red-100 rounded">
            Error: {error}
          </div>
        )}

        {/* Model Grid - Use the model-grid class for consistent styling with home page */}
        {models?.length > 0 ? (
          <div className="model-grid mb-6">
            {models.map((model, i) => (
              <FreeModelCard
                key={`free-${model.id || model.performerId || i}`}
                image={model.thumbnail || model.preview || model.previewImage}
                name={model.name || model.performerName || `Model ${i + 1}`}
                tags={model.tags || ["free", "cam"]}
                slug={model.slug || `free-model-${i}`}
                age={model.age || '25'}
                isOnline={model.isOnline || true}
                index={i}
                id={model.id}
                performerId={model.performerId}
              />
            ))}
          </div>
        ) : (
          <div className="text-white text-center w-full py-10">
            {loading ? 'Loading models...' : 'No models found. Please try again later.'}
          </div>
        )}

        {pagination.hasMore && models?.length > 0 && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-[#E0006C] text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Use the server to fetch initial models directly from our free-models endpoint
    // For server-side fetching, use the relative path on the same server
    console.log(`[FREE PAGE] Fetching data from server-side`);

    // In server-side rendering, we can just use the relative path since we're on the same server
    const axios = require('axios');
    const response = await axios.get(`http://localhost:3000/api/free-models`, {
      params: {
        category: 'girls',
        limit: DEFAULT_LIMIT
      }
    });

    console.log(`[FREE PAGE] Server-side data fetched successfully`);

    return {
      props: {
        initialData: response.data || {
          success: false,
          data: { models: [], pagination: {} }
        }
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps for /free:', error.message);

    // Always return empty props on error to allow client-side rendering to take over
    return {
      props: {
        initialData: {
          success: false,
          data: { models: [], pagination: {} }
        }
      }
    };
  }
} 