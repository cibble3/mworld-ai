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
  "category": ["girls", "trans", "free", "fetish"],
  "ethnicity": ["asian", "latina", "white", "ebony", "middle_eastern", "indian"],
  "hair_color": ["blonde", "black", "red", "brunette", "blue", "pink", "other"],
  "tags": ["milf", "petite", "bdsm", "lingerie", "tattoos", "piercing", "squirt", "smoking", "toys", "roleplay"],
  "willingness": ["group", "anal", "fetish", "couple", "dildo", "roleplay", "cumshow"],
  "height": ["short", "average", "tall", "very_tall"],
  "body_type": ["slim", "athletic", "curvy", "bbw", "muscular", "petite", "average"],
  "age_group": ["18-22", "23-29", "30-39", "40+"],
  "breast_size": ["small", "medium", "large", "very_large"],
  "language": ["english", "spanish", "french", "german", "russian", "italian"],
  "experience": ["beginner", "intermediate", "professional"],
  "source": ["aweapi", "freeapi", "vpapi"]
}]

// FilterTag component for rendering individual filter options
const FilterTag = ({ item, isActive, onClick, checkIsActive }) => {
  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick(item);
      }}
      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${
        checkIsActive ? checkIsActive(item) : isActive
          ? 'bg-primary text-white shadow-lg shadow-primary/25'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {(checkIsActive ? checkIsActive(item) : isActive) && (
        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
      {item}
    </Link>
  );
};

// FilterSection component for a group of filter options
const FilterSection = ({ title, items, filterKey, handleFilterClick, isActive }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div>
      <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>{title}</h4>
      <div className='flex flex-wrap gap-2'>
        {items.map((item) => (
          <FilterTag
            key={item}
            item={item}
            isActive={isActive(filterKey, item)}
            onClick={() => handleFilterClick(filterKey, item)}
          />
        ))}
      </div>
    </div>
  );
};

// CategorySection component for category selection
const CategorySection = ({ items, pathname }) => {
  if (!items || items.length === 0) return null;
  
  const isActiveCategory = (item) => {
    if (!pathname) return false;
    return pathname.startsWith(`/${item}`);
  };
  
  return (
    <div>
      <h4 className='text-xs font-medium text-gray-500 mb-3 tracking-wider uppercase'>Category</h4>
      <div className='flex flex-wrap gap-2'>
        {items.map((item) => (
          <Link
            key={item}
            href={`/${item}`}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${
              isActiveCategory(item)
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {isActiveCategory(item) && (
              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

// TrendingModels component
const TrendingModelsSection = ({ models, loading, error }) => {
  return (
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
          {models.map((model) => (
            <Link
              href={`/chat/${model.id}`}
              key={model.id}
              className="flex items-center hover:bg-gray-800/30 p-2 rounded-md transition-all duration-200 group"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
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
                <p className="text-xs text-gray-500">{model?.category || 'Model'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// PopularTags component
const PopularTagsSection = ({ tags, handleTagClick }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-primary font-semibold text-base tracking-wide uppercase">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            href="#"
            key={tag}
            onClick={(e) => {
              e.preventDefault();
              handleTagClick('tags', tag);
            }}
            className="px-3 py-1.5 bg-gray-800/30 hover:bg-primary/10 text-gray-400 hover:text-primary text-xs font-medium rounded-md transition-all duration-200"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

// QuickLinks component
const QuickLinksSection = () => {
  const links = [
    { href: '/girls', label: 'Girls' },
    { href: '/trans', label: 'Trans' },
    { href: '/fetish', label: 'Fetish' },
    { href: '/free', label: 'Free Cams' },
    { href: '/videos', label: 'Videos' }
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-primary font-semibold text-base tracking-wide uppercase">Quick Links</h3>
      <ul className="space-y-3">
        {links.map((link) => (
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
  );
};

const DynamicSidebar = () => {
  const [trendingModels, setTrendingModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTrendingModels = async () => {
      try {
        setLoading(true);
        // Use the real-models-test endpoint for better filtering
        const response = await axios.get('/api/real-models-test', {
          params: {
            limit: 5,
            category: getCurrentCategory()
          }
        });

        if (response.data?.success && response.data.normalizedModels?.length > 0) {
          setTrendingModels(response.data.normalizedModels);
        } else {
          // Fallback for development
          if (process.env.NODE_ENV === 'development') {
            const fallbackModels = Array.from({ length: 5 }, (_, i) => ({
              id: `trending-${i}`,
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
  }, [pathname]); // Re-fetch when the pathname changes to get category-specific trending models

  // Helper function to get the current category from the pathname
  const getCurrentCategory = () => {
    if (!pathname) return 'fetish'; // Default if pathname is null
    if (pathname.startsWith('/girls')) return 'girls';
    if (pathname.startsWith('/trans')) return 'trans';
    if (pathname.startsWith('/fetish')) return 'fetish';
    return 'fetish'; // Default to fetish for homepage
  };

  // Improved query parameter toggling function that works with next/navigation
  const toggleQueryParam = (key, value) => {
    if (!searchParams) return '';
    
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key);

    if (current === value) {
      // If clicked again, remove the param
      params.delete(key);
    } else {
      // Otherwise, set it (replace existing)
      params.set(key, value);
    }

    return params.toString();
  };

  // Check if a filter is active
  const isActive = (key, value) => {
    if (!searchParams) return false;
    return searchParams.get(key) === value;
  };

  // Handle filter click with proper analytics tracking
  const handleFilterClick = (key, value) => {
    if (!pathname || !router) return;
    
    // Build the new URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    const current = params.get(key);

    if (current === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Analytics tracking
    try {
      if (window.gtag) {
        window.gtag('event', 'filter_selection', {
          filter_type: key,
          filter_value: value,
          page: pathname
        });
      }
    } catch (e) {
      console.error('Analytics error:', e);
    }

    // Navigate with the updated params
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get filter data with safeguards
  const filters = filterData && filterData.length > 0 ? filterData[0] : {};

  return (
    <div className="p-6 border-r border-gray-800/30 bg-background lg:block hidden min-h-screen">
      <div className="space-y-10">
        {/* Filter Section */}
        <div className="space-y-8">
          <h3 className="text-primary font-semibold text-base tracking-wide uppercase">Filter Models</h3>

          <div className="space-y-8">
            {/* Category Section */}
            <CategorySection 
              items={filters.category} 
              pathname={pathname} 
            />

            {/* Filter Sections for different attributes */}
            <FilterSection 
              title="Ethnicity" 
              items={filters.ethnicity} 
              filterKey="ethnicity"
              handleFilterClick={handleFilterClick}
              isActive={isActive}
            />
            
            <FilterSection 
              title="Hair Color" 
              items={filters.hair_color} 
              filterKey="hair_color"
              handleFilterClick={handleFilterClick}
              isActive={isActive}
            />
            
            <FilterSection 
              title="Body Type" 
              items={filters.body_type} 
              filterKey="body_type"
              handleFilterClick={handleFilterClick}
              isActive={isActive}
            />
            
            <FilterSection 
              title="Height" 
              items={filters.height} 
              filterKey="height"
              handleFilterClick={handleFilterClick}
              isActive={isActive}
            />

            {/* Reset Filters button */}
            <button
              onClick={() => router?.push(pathname || '/')}
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
        <TrendingModelsSection 
          models={trendingModels} 
          loading={loading} 
          error={error} 
        />

        {/* Popular Tags Section */}
        <PopularTagsSection 
          tags={popularTags} 
          handleTagClick={handleFilterClick} 
        />

        {/* Quick Links Section */}
        <QuickLinksSection />
      </div>
    </div>
  );
};

export default DynamicSidebar; 