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

const filterData = [{
  "category": ["girls", "trans",
    "free"], "ethnicity": ["asian", "latina", "white"],
  "hair_color": ["blonde", "black", "red"], "tags": ["milf",
    "petite", "bdsm"], "willingness": ["group", "anal"],
  "source": ["aweapi", "freeapi", "vpapi"]
}
]
const DynamicSidebar = () => {
  const [trendingModels, setTrendingModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams()
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

  // const toggleQueryParam = (key, value) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   const current = params.getAll(key)

  //   if (current.includes(value)) {
  //     const filtered = current.filter((item) => item !== value)
  //     params.delete(key)
  //     filtered.forEach(v => params.append(key, v))
  //   } else {
  //     params.append(key, value)
  //   }

  //   return params.toString()
  // }
  const toggleQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(key)

    if (current === value) {
      // If clicked again, remove the param
      params.delete(key)
    } else {
      // Otherwise, set it (replace existing)
      params.set(key, value)
    }

    return params.toString()
  }

  const isActive = (key, value) => {
    return searchParams.getAll(key).includes(value)
  }
  // Popular tags that could be fetched from API in the future
  console.log('filterData :>> ', filterData);

  return (
    <div className="p-4 border-r border-[#333] bg-background lg:block hidden">
      <div>
        <h3 className="text-primary font-bold text-xl mb-4">Filter Models</h3>

        <>
          <h4 className='mb-2'>Ethnicity :</h4>
          <div className='flex justify-start gap-4 items-center mb-4'>
            {
              filterData[0]?.category?.map((item) => (
                <Link
                  key={item}
                  href={`/${item}?${searchParams.toString()}`}
                  className={`border px-3 py-1 rounded ${pathname.includes(item) ? 'bg-primary' : ''}`}
                >
                  {item}
                </Link>
              ))
            }
          </div>

          <h4 className='mb-2'>Tags :</h4>
          <div className='flex justify-start gap-4 items-center mb-4'>
            {
              filterData[0]?.tags?.map((item) => (
                <Link
                  key={item}
                  href={`${pathname}?${toggleQueryParam('tags', item)}`}
                  // href={`${pathname && pathname !== '/' ? pathname : '/girls'
                  //   }?${toggleQueryParam('tags', item)}`}

                  className={`border px-3 py-1 rounded ${isActive('tags', item) ? 'bg-primary' : ''}`}
                >
                  {item}
                </Link>
              ))
            }
          </div>

          <h4 className='mb-2'>Hair Color :</h4>
          <div className='flex justify-start gap-4 items-center mb-4'>
            {
              filterData[0]?.hair_color?.map((item) => (
                <Link
                  key={item}
                  href={`${pathname}?${toggleQueryParam('hair_color', item)}`}
                  className={`border px-3 py-1 rounded ${isActive('hair_color', item) ? 'bg-primary' : ''}`}
                >
                  {item}
                </Link>
              ))
            }
          </div>

          <h4 className='mb-2'>Willingness :</h4>
          <div className='flex justify-start gap-4 items-center mb-4'>
            {
              filterData[0]?.willingness?.map((item) => (
                <Link
                  key={item}
                  href={`${pathname}?${toggleQueryParam('willingness', item)}`}
                  className={`border px-3 py-1 rounded ${isActive('willingness', item) ? 'bg-primary' : ''}`}
                >
                  {item}
                </Link>
              ))
            }
          </div>

          <button
            onClick={() => route.push(pathname)}
            className="border px-3 py-1 rounded bg-primary mb-4 text-sm"
          >
            Reset Filters
          </button>
          {/* <h4 className="mb-2">Online Only :</h4>
          <div className="flex justify-start gap-4 items-center mb-4">
            <Link
              href={`${pathname && pathname !== '/' ? pathname : '/girls'}?${toggleQueryParam('online', 'true')}`}
              className={`border px-3 py-1 rounded ${isActive('online', 'true') ? 'bg-primary' : ''}`}
            >
              Online Only
            </Link>
          </div> */}
        </>

      </div>

      <h3 className="text-primary font-bold text-xl mb-4">Trending Models</h3>

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
        <div className="space-y-4 text-textPrimary">
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
                <p className="font-medium ">{model.name}</p>
                <p className="text-xs text-textSecondary">{model.viewerCount} viewers</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-primary font-bold text-xl mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link href={`/tag/${tag}`} key={tag}>
              <span className="px-2 py-1 bg-primary text-white text-sm rounded transition-colors">
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-primary font-bold text-xl mb-4">Quick Links</h3>
        <ul className="space-y-2 text-textSecondary">
          <li>
            <Link href="/girls" className=" hover:text-primary">Girls</Link>
          </li>
          <li>
            <Link href="/trans" className=" hover:text-primary">Trans</Link>
          </li>
          <li>
            <Link href="/fetish" className=" hover:text-primary">Fetish</Link>
          </li>
          <li>
            <Link href="/free" className=" hover:text-primary">Free Cams</Link>
          </li>
          <li>
            <Link href="/videos" className=" hover:text-primary">Videos</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicSidebar; 