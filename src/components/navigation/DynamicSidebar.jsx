import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

/**
 * DynamicSidebar component that displays trending models and other dynamic content
 * This appears on the left side of the page
 */
export const popularTags = [
  'asian', 'ebony', 'latina', 'white', 'teen', 'milf',
  'bbw', 'mature', 'lesbian', 'squirt', 'anal', 'fetish'
];
const DynamicSidebar = () => {
  const [trendingModels, setTrendingModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingModels = async () => {
      try {
        setLoading(true);
        // Fetch trending models from various categories
        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            limit: 5,
            sort: 'trending',
            debug: true
          }
        });

        if (response.data?.success) {
          let models = [];

          if (response.data.data?.models && Array.isArray(response.data.data.models)) {
            models = response.data.data.models;
          } else if (response.data.data?.items && Array.isArray(response.data.data.items)) {
            models = response.data.data.items;
          } else if (Array.isArray(response.data.data)) {
            models = response.data.data;
          }

          setTrendingModels(models);
        } else {
          // In development, use fallback data
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = Array.from({ length: 5 }, (_, i) => ({
              id: `trending-${i}`,
              performerId: `trending-${i}`,
              name: `Trending Model ${i + 1}`,
              age: 20 + (i * 2),
              ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
              tags: ['trending', 'popular'],
              thumbnail: `https://picsum.photos/id/${400 + i}/300/400`,
              isOnline: true,
              viewerCount: 100 + (i * 50)
            }));
            setTrendingModels(fallbackModels);
          } else {
            setError('Failed to load trending models');
          }
        }
      } catch (err) {
        console.error('Error fetching trending models:', err);
        setError(err.message);

        // Fallback data for development
        if (process.env.NODE_ENV === 'development') {
          const fallbackModels = Array.from({ length: 5 }, (_, i) => ({
            id: `trending-${i}`,
            performerId: `trending-${i}`,
            name: `Trending Model ${i + 1}`,
            age: 20 + (i * 2),
            ethnicity: ['asian', 'latin', 'ebony', 'white'][i % 4],
            tags: ['trending', 'popular'],
            thumbnail: `https://picsum.photos/id/${400 + i}/300/400`,
            isOnline: true,
            viewerCount: 100 + (i * 50)
          }));
          setTrendingModels(fallbackModels);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingModels();
  }, []);

  // Popular tags that could be fetched from API in the future


  return (
    <div className="p-4 border-r border-[#333] lg:block hidden">
      <h3 className="text-pink-500 font-bold text-xl mb-4">Trending Models</h3>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="space-y-4">
          {trendingModels.map((model) => (
            <Link href={`/chat/${model.performerId}`} key={model.id} className="flex items-center hover:bg-gray-800 p-2 rounded transition-colors">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={model.thumbnail || '/images/placeholder.jpg'}
                  alt={model.name}
                  width={48}
                  height={48}
                  className="object-cover"
                  unoptimized
                />
                {model.isOnline && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></div>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{model.name}</p>
                <p className="text-xs text-gray-400">{model.viewerCount} viewers</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-pink-500 font-bold text-xl mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link href={`/tag/${tag}`} key={tag}>
              <span className="px-2 py-1 bg-gray-800 text-sm rounded hover:bg-gray-700 transition-colors">
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-pink-500 font-bold text-xl mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/girls" className="text-gray-300 hover:text-white">Girls</Link>
          </li>
          <li>
            <Link href="/trans" className="text-gray-300 hover:text-white">Trans</Link>
          </li>
          <li>
            <Link href="/fetish" className="text-gray-300 hover:text-white">Fetish</Link>
          </li>
          <li>
            <Link href="/free" className="text-gray-300 hover:text-white">Free Cams</Link>
          </li>
          <li>
            <Link href="/videos" className="text-gray-300 hover:text-white">Videos</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicSidebar; 