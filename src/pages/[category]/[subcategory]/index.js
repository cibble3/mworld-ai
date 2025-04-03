import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import DarkTheme from '../../../components/navigation/dark-themeLive';
import Slider from '@/components/slider/Slider';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import useWindowSize from '@/hooks/useWindowSize';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import dynamic from 'next/dynamic';

// Dynamically import components to reduce initial bundle size
const Staticblogpost = dynamic(() => import('@/components/Staticblogpost'));
const ModelCard = dynamic(() => import('@/components/cards/ModelCard'));

// Default number of models to load per page
const DEFAULT_LIMIT = 32;

export default function SubcategoryPage({ initialData, category: initialCategory, subcategory: initialSubcategory, subcategoryData }) {
  const router = useRouter();
  const { category, subcategory } = router.query; // Get current route params
  const { width } = useWindowSize();
  const [models, setModels] = useState(initialData?.data?.models || []);
  const [pageInfo, setPageInfo] = useState(initialData?.data?.pagination || {});
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buttonload, setButtonload] = useState(true);
  const [dropdown, setDropdown] = useState(true);
  const [currentTitle, setCurrentTitle] = useState(subcategoryData?.title || '');
  const [currentTopText, setCurrentTopText] = useState(subcategoryData?.top_text || '');
  const [currentBottomText, setCurrentBottomText] = useState(subcategoryData?.bottom_text || '');
  
  // Determine if we're using mobile layout
  const isMobile = width < 700;
  
  // Toggle dropdown for mobile display
  const handleToggle = () => {
    setDropdown(!dropdown);
  };
  
  // Function to fetch models (used for initial load and route changes)
  const fetchModels = async (fetchCategory, fetchSubcategory, reset = false) => {
    if (!fetchCategory || !fetchSubcategory) return; // Don't fetch if params aren't ready

    setLoading(true);
    try {
      const response = await axios.get('/api/models', {
        params: {
          category: fetchCategory,
          subcategory: fetchSubcategory,
          limit: DEFAULT_LIMIT,
          offset: 0, // Always start from first page on new fetch/reset
          _timestamp: Date.now() // Prevent caching
        }
      });

      if (response.data?.success) {
        setModels(response.data.data.models || []);
        setPageInfo(response.data.data.pagination || {});
        setPageNo(1); // Reset page number
        setButtonload(response.data.data.models?.length >= DEFAULT_LIMIT); // Show/hide load more

        // TODO: Fetch updated subcategoryData (title, text) here if needed
        // For now, just format names
        const formattedSub = fetchSubcategory.charAt(0).toUpperCase() + fetchSubcategory.slice(1);
        const formattedCat = fetchCategory.charAt(0).toUpperCase() + fetchCategory.slice(1);
        setCurrentTitle(`${formattedSub} ${formattedCat} Cams | Live ${formattedSub} Webcam Models`);
        // Update texts or fetch from /api/categories if necessary
      } else {
        setModels([]);
        setPageInfo({});
        setPageNo(1);
        setButtonload(false);
        // Handle error case?
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
      setPageInfo({});
      setPageNo(1);
      setButtonload(false);
      // Handle error case?
    } finally {
      setLoading(false);
    }
  };
  
  // Load more models when "Load More" button is clicked
  const loadMoreModels = async () => {
    if (!category || !subcategory) return; // Need current route params

    try {
      setLoading(true);
      const nextPage = pageNo + 1;
      const newOffset = (nextPage - 1) * DEFAULT_LIMIT; // Correct offset calculation

      // Fetch more models
      const response = await axios.get('/api/models', {
        params: {
          category, // Use current route category
          subcategory, // Use current route subcategory
          limit: DEFAULT_LIMIT,
          offset: newOffset,
          _timestamp: Date.now() // Prevent caching
        }
      });

      // Add new models to existing list
      if (response.data?.success && response.data?.data?.models?.length) {
        setModels(prevModels => [...prevModels, ...response.data.data.models]);
        setPageInfo(response.data.data.pagination);
        setPageNo(nextPage);
        setButtonload(response.data.data.models.length >= DEFAULT_LIMIT); // Update button visibility
      } else {
         setButtonload(false); // Hide button if no more models or error
      }

    } catch (error) {
      console.error('Error loading more models:', error);
       setButtonload(false); // Hide on error
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to handle route changes (client-side navigation)
  useEffect(() => {
    if (router.isReady) {
      const currentCategory = router.query.category;
      const currentSubcategory = router.query.subcategory;

      // Check if the route params have actually changed from the initial SSR props
      // or from the previous state if navigation has already happened.
      // This prevents unnecessary fetches on initial load.
      if (currentCategory && currentSubcategory && (currentCategory !== initialCategory || currentSubcategory !== initialSubcategory)) {
         // Only fetch if category/subcategory are defined and different from initial load
         fetchModels(currentCategory, currentSubcategory, true); // Pass true to reset
      } else if (currentCategory && currentSubcategory && models.length === 0 && !loading) {
          // If initialData was empty (e.g., SSR error) but params are valid, try fetching.
          fetchModels(currentCategory, currentSubcategory, true);
      } else {
         // If route matches initial props, ensure state matches initialData
         // This handles browser back/forward navigation back to the initial SSR state
         setModels(initialData?.data?.models || []);
         setPageInfo(initialData?.data?.pagination || {});
         setPageNo(1);
         setButtonload((initialData?.data?.models?.length || 0) >= DEFAULT_LIMIT);
         setCurrentTitle(subcategoryData?.title || '');
         setCurrentTopText(subcategoryData?.top_text || '');
         setCurrentBottomText(subcategoryData?.bottom_text || '');
      }
    }
  // Depend on router.isReady and the specific query params
  // Also depend on initial props to detect changes correctly
  }, [router.isReady, router.query.category, router.query.subcategory, initialCategory, initialSubcategory, initialData, subcategoryData]);
  
  // Set dropdown state based on screen width
  useEffect(() => {
    if (width > 700) {
      setDropdown(true);
    } else {
      // Optionally collapse dropdown on mobile initially or keep previous state
      // setDropdown(false);
    }
  }, [width]);
  
  // Format subcategory/category for display (use current route params)
  const formattedSubcategory = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : '';
  const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
  
  // Prepare meta data for the page using state
  const pageContent = {
    meta_title: currentTitle || `${formattedSubcategory} ${formattedCategory} Cams | Live ${formattedSubcategory} Webcam Models`,
    meta_desc: subcategoryData?.description || `Watch live ${subcategory} ${category} webcam models perform just for you on MistressWorld.`, // Keep initial desc for now
    top_text: currentTopText || '', // Use state for dynamic updates
    bottom_text: currentBottomText || subcategoryData?.bottom_text || '' // Use state or fallback
  };
  
  // Handle loading state for the main grid
  const showLoadingSkeleton = loading && models.length === 0;
  
  const isPageFree = category === 'free'; // Determine if the page is for free models
  
  return (
    <div>
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />
      <DarkTheme>
        <div className="bg-[#16181c] h-auto pb-[8px]">
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
                  Explore the hottest live ${formattedSubcategory} ${formattedCategory} cam models on MistressWorld.xxx. 
                  We offer a diverse selection of ${formattedSubcategory} ${category} cam models ready to engage in private chat. 
                  Join us today for the ultimate webcam experience!
                </h2>
              `}} />
            )}
            
            <h2 className="text-white text-[28px] font-bold mb-3">
              Other {formattedCategory} Cam Categories
            </h2>
            <Slider category={category} />
            
            <h2 className="text-white text-[28px] font-bold mt-[30px]">
              Live {formattedSubcategory} {formattedCategory} Cams
            </h2>
            
            {showLoadingSkeleton ? (
              <div className="text-white text-center w-full py-10">Loading models...</div>
            ) : models?.length > 0 ? (
              <>
                <div className="md:flex flex-wrap hidden">
                  {models.map((element, i) => (
                    <ModelCard 
                      key={`${element.id}-${i}`}
                      image={element.thumbnail}
                      name={element.name}
                      age={element.age}
                      tags={element.tags}
                      ethnicity={element.ethnicity}
                      slug={element.slug}
                      isPageFree={isPageFree}
                      preload={!isMobile && i < 8}
                      isRelated={false}
                    />
                  ))}
                </div>
                <div className="md:hidden flex flex-wrap">
                  {models.map((element, i) => (
                    <ModelCard 
                      key={`${element.id}-mobile-${i}`}
                      image={element.thumbnail}
                      name={element.name}
                      age={element.age}
                      tags={element.tags}
                      ethnicity={element.ethnicity}
                      slug={element.slug}
                      isPageFree={isPageFree}
                      preload={isMobile && i < 2}
                      isRelated={false}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-white text-center w-full py-10">
                No models found for {formattedSubcategory} {formattedCategory}. Please try a different category.
              </div>
            )}
            
            {buttonload && models?.length > 0 && !showLoadingSkeleton && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreModels}
                  disabled={loading}
                  className="bg-[#d41a7d] hover:bg-[#e63295] text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
            
            <div className="mt-8" dangerouslySetInnerHTML={{ __html: pageContent.bottom_text }} />
          </div>
        </div>
      </DarkTheme>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { category, subcategory } = context.params || {};
  
  const validCategories = ['girls', 'trans', 'free', /*'videos', 'blog' - Add others as needed*/];
   if (!validCategories.includes(category)) {
    console.warn(`Invalid category accessed: ${category}`);
    return { notFound: true };
  }

  let categoryData = null;
  let subcategoryData = {};
  let modelsData = { success: false, data: { models: [], pagination: {} } }; // Default error state

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    // Fetch category data first
    const categoryResponse = await fetch(`${apiUrl}/api/categories/${category}`);
    if (!categoryResponse.ok) {
        throw new Error(`Failed to fetch category data: ${categoryResponse.statusText}`);
    }
    categoryData = await categoryResponse.json();

    // Validate subcategory
    const validSubcategory = categoryData?.data?.subcategories?.some(
      sub => sub.id === subcategory
    );

    if (!validSubcategory) {
      console.warn(`Invalid subcategory '${subcategory}' for category '${category}'`);
      return { notFound: true };
    }

    // Get specific subcategory details (title, description, etc.)
    subcategoryData = categoryData.data.subcategories.find(sub => sub.id === subcategory) || {};

    // Fetch initial models for the validated subcategory
    const modelsResponse = await fetch(
        `${apiUrl}/api/models?category=${category}&subcategory=${subcategory}&limit=${DEFAULT_LIMIT}&_timestamp=${Date.now()}`
    );
     if (!modelsResponse.ok) {
        // Don't throw, just log and return default empty models
        console.error(`Failed to fetch initial models: ${modelsResponse.statusText}`);
     } else {
        modelsData = await modelsResponse.json();
     }


  } catch (error) {
    console.error(`Error in getServerSideProps for /${category}/${subcategory}:`, error);
    // Return props with empty data but allow page to render
  }

  return {
    props: {
      // Pass category/subcategory explicitly for the initial state
      initialCategory: category,
      initialSubcategory: subcategory,
      initialData: modelsData, // Contains models and pagination
      subcategoryData, // Contains title, description, etc.
      // Key prop forces re-mount on shallow route changes if needed, but useEffect should handle it
      // key: `${category}-${subcategory}`
    }
  };
} 