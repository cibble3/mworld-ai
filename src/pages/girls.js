import React, { useState, useEffect } from 'react';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import axios from 'axios';

const GirlsPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('models :>> ', models);
  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('[GirlsPage] Fetching models...');
        setLoading(true);

        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            category: 'girls',
            // ethnicity: 'asian',
            // hair_color: 'red',
            // willingness: 'group',
            limit: 24,
            debug: true
          }
        });

        console.log(`[GirlsPage] API response:`,
          response.data?.success ?
            `Success - ${response.data.data?.models?.length || 0} models` :
            `Failed - ${response.data.error || 'Unknown error'}`
        );

        if (response.data?.success) {
          let items = [];

          if (response.data.data?.models && Array.isArray(response.data.data.models)) {
            items = response.data.data.models;
          } else if (response.data.data?.items && Array.isArray(response.data.data.items)) {
            items = response.data.data.items;
          } else if (Array.isArray(response.data.data)) {
            items = response.data.data;
          } else {
            console.warn(`[GirlsPage] Unexpected API response structure`);
            items = [];
          }

          if (items.length > 0) {
            console.log('[GirlsPage] First model:', JSON.stringify(items[0]).substring(0, 100));
          }
          setModels(items);
        } else {
          setError(response.data?.error || 'Failed to fetch models');

          // In development, use fallback models
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = Array.from({ length: 24 }, (_, i) => ({
              id: `fallback-${i}`,
              performerId: `fallback-${i}`,
              name: `Girl Model ${i + 1}`,
              age: 20 + (i % 10),
              ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
              tags: ['beautiful', 'sexy'],
              thumbnail: `https://picsum.photos/id/${100 + i}/300/400`,
              isOnline: true,
              viewerCount: Math.floor(Math.random() * 100)
            }));
            setModels(fallbackModels);
            console.log('[GirlsPage] Using fallback models for development');
          }
        }
      } catch (err) {
        console.error('[GirlsPage] Error:', err);
        setError(err.message || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Prepare page metadata
  const pageContent = {
    meta_title: "Live Cam Girls | MistressWorld",
    meta_desc: "Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.",
    top_text: ""
  };

  return (
    <div className="bg-[#16181c] text-textlight min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />

      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
        <DynamicSidebar />
      </div>

      <div className="py-4 px-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Live Cam Girls</h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-xl">Loading models...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            Error loading models: {error}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No models found.
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-5">
              Showing {models.length} models on Mistress World. Explore our collection of beautiful cam models ready to engage in private chat sessions.
            </p>

            <ModelGrid models={models} isLoading={false}>
              {(model) => (
                <ModelCard
                  key={model.id || model.slug}
                  performerId={model.id || model.slug}
                  name={model.name}
                  age={model.age}
                  ethnicity={model.ethnicity}
                  tags={model.tags || []}
                  image={model.thumbnail}
                  isOnline={model.isOnline !== false}
                  viewerCount={model.viewerCount || 0}
                />
              )}
            </ModelGrid>
          </>
        )}
      </div>
    </div>
  );
};

export default GirlsPage; 