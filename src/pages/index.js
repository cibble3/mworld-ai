import React, { useState, useEffect } from 'react';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import Link from 'next/link';
import axios from 'axios';

const HomePage = () => {
  const [girlModels, setGirlModels] = useState([]);
  const [transModels, setTransModels] = useState([]);
  const [fetishModels, setFetishModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('[HomePage] Fetching models...');
        setLoading(true);

        // Fetch girls, trans, and fetish models in parallel
        const [girlsResponse, transResponse, fetishResponse] = await Promise.all([
          axios.get('/api/models', {
            params: {
              provider: 'awe',
              category: 'girls',
              limit: 6,
              debug: true
            }
          }),
          axios.get('/api/models', {
            params: {
              provider: 'awe',
              category: 'trans',
              limit: 6,
              debug: true
            }
          }),
          axios.get('/api/models', {
            params: {
              provider: 'awe',
              category: 'fetish',
              limit: 6,
              debug: true
            }
          })
        ]);

        // Process girls response
        if (girlsResponse.data?.success) {
          let girlItems = [];

          if (girlsResponse.data.data?.models && Array.isArray(girlsResponse.data.data.models)) {
            girlItems = girlsResponse.data.data.models;
          } else if (girlsResponse.data.data?.items && Array.isArray(girlsResponse.data.data.items)) {
            girlItems = girlsResponse.data.data.items;
          } else if (Array.isArray(girlsResponse.data.data)) {
            girlItems = girlsResponse.data.data;
          } else {
            console.warn('[HomePage] Unexpected API response structure for girls');
            girlItems = [];
          }

          setGirlModels(girlItems);
          console.log(`[HomePage] Received ${girlItems.length} girl models`);
        } else if (process.env.NODE_ENV === 'development') {
          // Use fallback models in development
          const fallbackModels = Array.from({ length: 6 }, (_, i) => ({
            id: `fallback-girl-${i}`,
            performerId: `fallback-girl-${i}`,
            name: `Girl Model ${i + 1}`,
            age: 22 + (i % 8),
            ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
            tags: ['beautiful', 'sexy'],
            thumbnail: `https://picsum.photos/id/${100 + i}/300/400`,
            isOnline: true,
            viewerCount: Math.floor(Math.random() * 100)
          }));
          setGirlModels(fallbackModels);
          console.log('[HomePage] Using fallback girl models for development');
        }

        // Process trans response
        if (transResponse.data?.success) {
          let transItems = [];

          if (transResponse.data.data?.models && Array.isArray(transResponse.data.data.models)) {
            transItems = transResponse.data.data.models;
          } else if (transResponse.data.data?.items && Array.isArray(transResponse.data.data.items)) {
            transItems = transResponse.data.data.items;
          } else if (Array.isArray(transResponse.data.data)) {
            transItems = transResponse.data.data;
          } else {
            console.warn('[HomePage] Unexpected API response structure for trans');
            transItems = [];
          }

          setTransModels(transItems);
          console.log(`[HomePage] Received ${transItems.length} trans models`);
        } else if (process.env.NODE_ENV === 'development') {
          // Use fallback models in development
          const fallbackModels = Array.from({ length: 6 }, (_, i) => ({
            id: `fallback-trans-${i}`,
            performerId: `fallback-trans-${i}`,
            name: `Trans Model ${i + 1}`,
            age: 24 + (i % 10),
            ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
            tags: ['trans', 'beautiful'],
            thumbnail: `https://picsum.photos/id/${200 + i}/300/400`,
            isOnline: true,
            viewerCount: Math.floor(Math.random() * 100)
          }));
          setTransModels(fallbackModels);
          console.log('[HomePage] Using fallback trans models for development');
        }

        // Process fetish response
        if (fetishResponse.data?.success) {
          let fetishItems = [];

          if (fetishResponse.data.data?.models && Array.isArray(fetishResponse.data.data.models)) {
            fetishItems = fetishResponse.data.data.models;
          } else if (fetishResponse.data.data?.items && Array.isArray(fetishResponse.data.data.items)) {
            fetishItems = fetishResponse.data.data.items;
          } else if (Array.isArray(fetishResponse.data.data)) {
            fetishItems = fetishResponse.data.data;
          } else {
            console.warn('[HomePage] Unexpected API response structure for fetish');
            fetishItems = [];
          }

          setFetishModels(fetishItems);
          console.log(`[HomePage] Received ${fetishItems.length} fetish models`);
        } else if (process.env.NODE_ENV === 'development') {
          // Use fallback models in development
          const fallbackModels = Array.from({ length: 6 }, (_, i) => ({
            id: `fallback-fetish-${i}`,
            performerId: `fallback-fetish-${i}`,
            name: `Fetish Model ${i + 1}`,
            age: 26 + (i % 12),
            ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
            tags: ['fetish'],
            thumbnail: `https://picsum.photos/id/${300 + i}/300/400`,
            isOnline: true,
            viewerCount: Math.floor(Math.random() * 100)
          }));
          setFetishModels(fallbackModels);
          console.log('[HomePage] Using fallback fetish models for development');
        }

        // Set error if all failed
        if (!girlsResponse.data?.success && !transResponse.data?.success && !fetishResponse.data?.success) {
          setError('Failed to fetch models from all categories');
        }
      } catch (err) {
        console.error('[HomePage] Error:', err);
        setError(err.message || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Check if we have any models from either category
  const hasModels = girlModels.length > 0 || transModels.length > 0 || fetishModels.length > 0;

  // Prepare page metadata
  const pageContent = {
    meta_title: "MistressWorld - Live Webcam Models",
    meta_desc: "Explore our collection of beautiful cam models ready for private chat experiences.",
    top_text: ""
  };

  return (
    <div className="bg-background text-textblack min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />

      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-sidebar overflow-y-auto z-10 pointer-events-auto lg:block hidden">
        <DynamicSidebar />
      </div>

      <div className="py-4 px-3">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4  ">Welcomes to MistressWorld</h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore our collection of beautiful cam models ready for private chat experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/girls" className="bg-pink-600 hover:bg-pink-700 text-white p-6 rounded-lg transition-colors">
              <h2 className="text-2xl font-bold mb-2">Cam Girls</h2>
              <p>Explore our collection of stunning cam girls ready for private chat.</p>
            </Link>

            <Link href="/trans" className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg transition-colors">
              <h2 className="text-2xl font-bold mb-2">Trans Models</h2>
              <p>Discover our beautiful trans models available for private sessions.</p>
            </Link>
          </div>
        </div>

        {/* Girls Section */}
        {girlModels.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Girls</h2>
              <Link href="/girls" className="text-primary ">
                View All Girls
              </Link>
            </div>

            <ModelGrid models={girlModels} isLoading={false}>
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
          </section>
        )}

        {/* Trans Section */}
        {transModels.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Trans Models</h2>
              <Link href="/trans" className="text-purple-500 ">
                View All Trans
              </Link>
            </div>

            <ModelGrid models={transModels} isLoading={false}>
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
          </section>
        )}

        {/* Fetish Section */}
        {fetishModels.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Fetish Models</h2>
              <Link href="/fetish" className="text-primary ">
                View All Fetish
              </Link>
            </div>

            <ModelGrid models={fetishModels} isLoading={false}>
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
          </section>
        )}

        {/* Loading/Error States */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-xl">Loading models...</div>
          </div>
        ) : error && !hasModels ? (
          <div className="text-center text-red-500 py-10">
            Error loading models: {error}
          </div>
        ) : !hasModels ? (
          <div className="text-center text-gray-500 py-10">
            No models found. Please try again later.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage; 