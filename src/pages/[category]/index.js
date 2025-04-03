import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DarkTheme from '../../components/navigation/dark-themeLive';
import Slider from '@/components/slider/Slider';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import useWindowSize from '@/hooks/useWindowSize';
import useModelFeed from '@/hooks/useModelFeed';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import dynamic from 'next/dynamic';
import * as orchestrator from '@/services/orchestrator'; // Import orchestrator
import { ApiProviders } from '@/services/orchestrator'; // <<< ADD THIS IMPORT

// Dynamically import components to reduce initial bundle size
const Staticblogpost = dynamic(() => import('@/components/Staticblogpost'));
const HomeLiveScreenPhoto = dynamic(() => import('@/components/ModelCard'));

// Default number of models to load per page
const DEFAULT_LIMIT = 32;

export default function CategoryPage({ initialData, categoryData, category, subcategory }) {
  const router = useRouter();
  const { width } = useWindowSize();
  const [categoryDataState, setCategoryData] = useState(categoryData || {});
  const [dropdown, setDropdown] = useState(true);
  
  // Determine the correct provider based on the category
  const provider = category === 'free' ? ApiProviders.FREE : ApiProviders.AWE; // Default to AWE for non-free
  console.log(`[CategoryPage] Rendering for category: ${category}, Determined provider: ${provider}`);

  // Use the useModelFeed hook to handle all API fetching
  console.log(`[CategoryPage] Calling useModelFeed with provider: ${provider}`);
  const { 
    models, 
    isLoading, 
    error, 
    loadMore, 
    hasMore, 
    providerData,
    refresh 
  } = useModelFeed({
    provider: provider, // Set provider dynamically
    category,
    subcategory,
    limit: DEFAULT_LIMIT,
    initialModels: initialData?.data?.models || []
  });
  
  // Force a refresh when category changes to ensure correct provider is used
  useEffect(() => {
    if (category === 'free') {
      console.log(`[CategoryPage] Free category detected, forcing refresh`);
      refresh();
    }
  }, [category, refresh]);
  
  // Determine if we're using mobile layout
  const isMobile = width < 700;
  
  // Toggle dropdown for mobile display
  const handleToggle = () => {
    setDropdown(!dropdown);
  };
  
  // Update page when route changes
  useEffect(() => {
    if (router.isReady) {
      console.log(`[CategoryPage] Router updated, category=${router.query.category}, provider=${provider}`);
      // Update category data when route changes
      setCategoryData(categoryData || {});
    }
  }, [router.isReady, router.query.category, router.query.subcategory, categoryData, provider]);
  
  // Track all router events for debugging
  useEffect(() => {
    const handleRouteChangeStart = (url) => console.log(`[CategoryPage] Route change starting to ${url}`);
    const handleRouteChangeComplete = (url) => console.log(`[CategoryPage] Route change completed to ${url}`);
    const handleRouteChangeError = (err, url) => console.log(`[CategoryPage] Route change to ${url} failed: ${err}`);
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);
  
  // Set dropdown state based on screen width
  useEffect(() => {
    if (width > 700) {
      setDropdown(true);
    }
  }, [width]);
  
  // Prepare meta data for the page
  const pageContent = {
    meta_title: categoryDataState?.title || `Live ${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Cam'} Cams | MistressWorld`,
    meta_desc: categoryDataState?.description || `Watch live ${category || 'cam'} webcam models perform just for you on MistressWorld.`,
    top_text: categoryDataState?.top_text || '',
    bottom_text: categoryDataState?.bottom_text || ''
  };
  
  // Generate provider stats for debugging
  const providerStats = Object.entries(providerData).map(([key, data]) => 
    `${key}: ${data.items.length} models`
  ).join(', ');
  
  return (
    <div className="bg-[#16181c] h-auto pb-[8px]">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />
      
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
          <div dangerouslySetInnerHTML={{ __html: pageContent.top_text || `
            <h2 class="text-white sm:text-base text-sm font-medium mb-3">
              Explore the hottest live ${category || 'cam'} cam models on MistressWorld.xxx. 
              We offer a diverse selection of ${category || 'cam'} cam models ready to engage in private chat. 
              Join us today for the ultimate webcam experience!
            </h2>
          `}} />
        )}
        
        <h2 className="text-white text-[28px] font-bold mb-3">
          Top {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Cam'} Cam Categories
        </h2>
        <Slider category={category} />
        
        <h2 className="text-white text-[28px] font-bold mt-[30px]">
          Live {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Cam'} Cams
        </h2>
        
        {/* Display provider stats (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-gray-400 text-xs mb-2">
            Data sources: {providerStats || 'Loading...'}
          </div>
        )}
        
        <div className="md:flex flex-wrap hidden">
          {models?.length > 0 ? (
            models.map((model, i) => (
              <HomeLiveScreenPhoto 
                key={`${model._provider || 'unknown'}-${model.id || i}`}
                element={model}
                preload={isMobile ? i < 2 : i < 8}
                isRelated={false}
              />
            ))
          ) : (
            <div className="text-white text-center w-full py-10">
              {error ? `Error: ${error}` : 'No models found. Please try a different category.'}
            </div>
          )}
        </div>
        
        {/* Mobile View - simplified loop */}
        <div className="md:hidden flex flex-wrap">
           {models?.length > 0 ? (
            models.map((model, i) => (
              <HomeLiveScreenPhoto 
                key={`${model._provider || 'unknown'}-${model.id || i}-mobile`}
                element={model}
                preload={i < 2} // Preload fewer on mobile
                isRelated={false}
              />
            ))
          ) : (
            <div className="text-white text-center w-full py-10">
              {error ? `Error: ${error}` : 'No models found. Please try a different category.'}
            </div>
          )}
        </div>
            
        {hasMore && models?.length > 0 && (
          <div className="text-center py-4">
            <button
              onClick={() => loadMore()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}