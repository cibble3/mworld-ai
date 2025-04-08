import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
/**
 * DynamicSidebar component that displays trending models and other dynamic content
 * This appears on the left side of the page
 */
export const popularTags = [
  'asian', 'ebony', 'latina', 'white', 'teen', 'milf',
  'bbw', 'mature', 'lesbian', 'squirt', 'anal', 'fetish'
];

// Girls-specific filters
const girlsFilterData = {
  "ethnicity": ["asian", "ebony", "latina", "white", "indian", "arab", "japanese"],
  "hair_color": ["blonde", "black", "red", "brunette", "pink", "blue"],
  "tags": ["milf", "teen", "bbw", "petite", "bdsm", "fetish", "mature"],
  "willingness": ["group", "anal", "oral", "roleplay", "domination", "submission"],
  "source": ["aweapi", "freeapi", "vpapi"]
};

// Trans-specific filters
const transFilterData = {
  "ethnicity": ["asian", "ebony", "latina", "white", "indian", "arab"],
  "gender_identity": ["trans_woman", "trans_man", "non_binary", "genderfluid"],
  "body_type": ["slim", "athletic", "curvy", "muscular"],
  "tags": ["top", "bottom", "switch", "dom", "sub", "fetish"],
  "willingness": ["group", "anal", "oral", "roleplay"],
  "source": ["aweapi", "freeapi", "vpapi"]
};

const DynamicSidebar = () => {
  const [trendingModels, setTrendingModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Determine which category we're in to show relevant filters
  const isTrans = pathname?.includes('/trans');
  const filterData = isTrans ? transFilterData : girlsFilterData;

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

  const toggleQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(key)

    // Handle multi-select filters
    if (current) {
      // Current value exists
      if (current.includes(',')) {
        // Already have multiple values
        const values = current.split(',').map(v => v.trim())
        
        // Check if this value is already selected
        const valueIndex = values.indexOf(value)
        if (valueIndex !== -1) {
          // Remove this value
          values.splice(valueIndex, 1)
          if (values.length === 0) {
            // If no values left, remove the parameter
            params.delete(key)
          } else {
            // Set remaining values
            params.set(key, values.join(','))
          }
        } else {
          // Add this value to existing values
          values.push(value)
          params.set(key, values.join(','))
        }
      } else if (current === value) {
        // Current value is exactly this value, remove it
        params.delete(key)
      } else {
        // Current value is different, add both values
        params.set(key, `${current},${value}`)
      }
    } else {
      // No current value, set this value
      params.set(key, value)
    }

    return params.toString()
  }

  const isActive = (key, value) => {
    const current = searchParams.get(key);
    if (!current) return false;
    
    // Check if value is in comma-separated list
    if (current.includes(',')) {
      return current.split(',').map(v => v.trim()).includes(value);
    }
    
    // Direct match
    return searchParams.get(key) === value;
  }
  // Popular tags that could be fetched from API in the future
  console.log('filterData :>> ', filterData);

  return (
    <div className="p-6 border-r border-gray-800/30 bg-background lg:block hidden min-h-screen">
      <div className="space-y-10">
        {/* Filter Section */}
        <div className="space-y-8">
          <h3 className="text-pink-500 font-semibold text-base tracking-wide uppercase">Filter Models</h3>

          <div className="space-y-8">
            <div>
              <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Ethnicity</h4>
              <div className='flex flex-wrap gap-2'>
                {filterData?.ethnicity?.map((item) => (
                  <Link
                    key={item}
                    href={`${pathname}?${toggleQueryParam('ethnicity', item)}`}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${isActive('ethnicity', item)
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {isActive('ethnicity', item) && (
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trans-specific filters - only show when in trans section */}
            {isTrans && (
              <>
                <div>
                  <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Gender Identity</h4>
                  <div className='flex flex-wrap gap-2'>
                    {filterData?.gender_identity?.map((item) => (
                      <Link
                        key={item}
                        href={`${pathname}?${toggleQueryParam('gender_identity', item)}`}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${isActive('gender_identity', item)
                          ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                      >
                        {isActive('gender_identity', item) && (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {item.replace('_', ' ')}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Body Type</h4>
                  <div className='flex flex-wrap gap-2'>
                    {filterData?.body_type?.map((item) => (
                      <Link
                        key={item}
                        href={`${pathname}?${toggleQueryParam('body_type', item)}`}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${isActive('body_type', item)
                          ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                      >
                        {isActive('body_type', item) && (
                          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Girls-specific filters - only show when in girls section */}
            {!isTrans && (
              <div>
                <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Hair Color</h4>
                <div className='flex flex-wrap gap-2'>
                  {filterData?.hair_color?.map((item) => (
                    <Link
                      key={item}
                      href={`${pathname}?${toggleQueryParam('hair_color', item)}`}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${isActive('hair_color', item)
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                      {isActive('hair_color', item) && (
                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Tags</h4>
              <div className='flex flex-wrap gap-2'>
                {filterData?.tags?.map((item) => (
                  <Link
                    key={item}
                    href={`${pathname}?${toggleQueryParam('tags', item)}`}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${isActive('tags', item)
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {isActive('tags', item) && (
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Willingness</h4>
              <div className='flex flex-wrap gap-2'>
                {filterData?.willingness?.map((item) => (
                  <Link
                    key={item}
                    href={`${pathname}?${toggleQueryParam('willingness', item)}`}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${isActive('willingness', item)
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/25'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {isActive('willingness', item) && (
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Fetish Categories - shown on all pages for better promotion */}
            <div>
              <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Fetish Categories</h4>
              <div className='flex flex-wrap gap-2'>
                {['bdsm', 'leather', 'latex', 'feet', 'femdom', 'spanking'].map((item) => (
                  <Link
                    key={item}
                    href={`/fetish/${item}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full bg-gray-800/50 text-gray-400 hover:bg-pink-900/30 hover:text-pink-400"
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  href="/fetish"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full bg-pink-900/30 text-pink-400 hover:bg-pink-900/50"
                >
                  View All
                </Link>
              </div>
            </div>

            <button
              onClick={() => router.push(pathname)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/30 hover:bg-gray-800/50 text-gray-400 hover:text-white rounded-lg text-xs font-medium tracking-wide transition-all duration-200 group"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Trending Models Section */}
        <div className="space-y-8">
          <h3 className="text-primary font-semibold text-base tracking-wide uppercase">Trending Models</h3>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center">
                  <div className="w-10 h-10 bg-gray-800/30 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-800/30 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-800/30 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 text-xs">{error}</p>
          ) : (
            <div className="space-y-4">
              {trendingModels.map((model) => (
                <Link
                  href={`/chat/${model.performerId}`}
                  key={model.id}
                  className="flex items-center hover:bg-gray-800/30 p-2 rounded-md transition-all duration-200 group"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden  mr-3">
                    <Image
                      src={model?.thumbnail || '/images/placeholder.jpg'}
                      alt={model?.name}
                      width={40}
                      height={40}
                      className="object-cover size-10"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">{model.name}</p>
                    <p className="text-xs text-gray-500">{model?.viewerCount} viewers</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Popular Tags Section */}
        <div className="space-y-8">
          <h3 className="text-primary font-semibold text-base tracking-wide uppercase">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                href={`/tag/${tag}`}
                key={tag}
                className="px-3 py-1.5 bg-gray-800/30 hover:bg-primary/10 text-gray-400 hover:text-primary text-xs font-medium rounded-md transition-all duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-8">
          <h3 className="text-primary font-semibold text-base tracking-wide uppercase">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { href: '/girls', label: 'Girls' },
              { href: '/trans', label: 'Trans' },
              { href: '/fetish', label: 'Fetish' },
              { href: '/videos', label: 'Videos' }
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-primary text-sm font-medium flex items-center transition-colors duration-200"
                >
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DynamicSidebar; 