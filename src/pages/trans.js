import React, { useState, useEffect } from 'react';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import axios from 'axios';

const TransPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('[TransPage] Fetching models...');
        setLoading(true);

        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            category: 'trans',
            limit: 24,
            debug: true
          }
        });

        console.log(`[TransPage] API response:`,
          response.data?.success ?
            `Success - ${response.data.data?.models?.length || 0} models` :
            `Failed - ${response.data.error || 'Unknown error'}`
        );

        // Handle different possible API response structures
        let models = [];
        if (response.data?.success) {
          if (response.data.data?.models && Array.isArray(response.data.data.models)) {
            models = response.data.data.models;
          } else if (response.data.data?.items && Array.isArray(response.data.data.items)) {
            models = response.data.data.items;
          } else if (Array.isArray(response.data.data)) {
            models = response.data.data;
          } else {
            console.warn(`[TransPage] Unexpected API response structure`);
            models = [];
          }

          if (models.length > 0) {
            console.log('[TransPage] First model:', JSON.stringify(models[0]).substring(0, 100));
          } else {
            console.warn('[TransPage] No models found in API response');
          }

          setModels(models);
        } else {
          // Handle error from API
          console.error('[TransPage] API error:', response.data?.error);
          setError(response.data?.error || 'Failed to fetch models');

          // In development, use fallback models 
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = Array.from({ length: 8 }, (_, i) => ({
              id: `fallback-${i}`,
              performerId: `fallback-${i}`,
              name: `Trans Model ${i + 1}`,
              age: 25 + (i % 10),
              ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
              tags: ['trans', 'beautiful'],
              thumbnail: `https://picsum.photos/id/${200 + i}/300/400`,
              isOnline: true,
              viewerCount: Math.floor(Math.random() * 100)
            }));
            setModels(fallbackModels);
            console.log('[TransPage] Using fallback models for development');
          }
        }
      } catch (err) {
        console.error('[TransPage] Error:', err);
        setError(err.message || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Prepare page metadata
  const pageContent = {
    meta_title: "Live Trans Cams | MistressWorld",
    meta_desc: "Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.",
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Live Trans Cams</h1>

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
              Showing {models.length} trans models on Mistress World. Explore our selection of beautiful trans cam models ready to engage in private chat sessions.
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

export default TransPage; 