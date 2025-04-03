import React, { useState, useEffect } from 'react';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import Link from 'next/link';
import axios from 'axios';

const HomePage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('[HomePage] Fetching models...');
        setLoading(true);
        
        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            category: 'girls',
            limit: 8,
            debug: true
          }
        });
        
        console.log(`[HomePage] API response:`, 
          response.data?.success ? 
            `Success - ${response.data.data?.models?.length || 0} models` : 
            `Failed - ${response.data.error || 'Unknown error'}`
        );
        
        if (response.data?.success) {
          const items = response.data.data?.models || [];
          if (items.length > 0) {
            console.log('[HomePage] First model:', JSON.stringify(items[0]).substring(0, 100));
          }
          setModels(items);
        } else {
          setError(response.data?.error || 'Failed to fetch models');
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

  return (
    <ThemeLayout title="MistressWorld - Live Webcam Models">
      <div className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to MistressWorld</h1>
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
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Models</h2>
            <Link href="/girls" className="text-pink-500 hover:text-pink-400">
              View All
            </Link>
          </div>
          
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
          )}
        </section>
      </div>
    </ThemeLayout>
  );
};

export default HomePage; 