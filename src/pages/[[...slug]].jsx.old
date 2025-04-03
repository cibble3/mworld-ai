import { useRouter } from 'next/router';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import VideoGrid from '@/theme/components/grid/VideoGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import VideoCard from '@/theme/components/common/VideoCard';
import useModelFeed from '@/hooks/useModelFeed';
import useVideoFeed from '@/hooks/useVideoFeed';
import useCategories from '@/hooks/useCategories';
import { capitalizeString } from '@/utils/string-helpers';
import { ApiProviders } from '@/services/orchestrator';
import React, { useEffect } from 'react';
import axios from 'axios';

// Helper to parse slug array into category and filters
const parseSlug = (slugArray = []) => {
  if (!slugArray || slugArray.length === 0) {
    return { category: 'girls', filters: {} };
  }

  const category = slugArray[0];
  const filters = {};
  for (let i = 1; i < slugArray.length; i += 2) {
    if (slugArray[i + 1]) {
      filters[slugArray[i]] = slugArray[i + 1];
    }
  }
  console.log(`[parseSlug] Input: ${slugArray}, Output:`, { category, filters });
  return { category, filters };
};

// This catch-all route has been replaced with direct static pages for performance
// It now simply redirects to the appropriate static page
const CatchAllRoute = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  useEffect(() => {
    if (!router.isReady) return;
    
    // Extract the first segment to determine where to redirect
    const firstSegment = Array.isArray(slug) && slug.length > 0 ? slug[0] : null;
    
    // Redirect to the appropriate page
    if (firstSegment === 'girls') {
      router.replace('/girls');
    } else if (firstSegment === 'trans') {
      router.replace('/trans');
    } else {
      // Default redirect to home
      router.replace('/');
    }
  }, [router.isReady, slug, router]);
  
  return (
    <ThemeLayout title="Redirecting...">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-center">Redirecting...</h1>
        <p className="text-center mt-4">Please wait while we redirect you to the right page.</p>
      </div>
    </ThemeLayout>
  );
};

const DynamicContentPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [directApiModels, setDirectApiModels] = React.useState([]);

  // Wait until router is ready and slug is available
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  // Try a direct API call
  useEffect(() => {
    const fetchDirectModels = async () => {
      try {
        console.log(`[DirectAPI] Making direct API call to /api/models?provider=awe&category=girls&limit=10`);
        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            category: 'girls',
            limit: 10
          }
        });
        console.log(`[DirectAPI] Response:`, response.data?.success ? 'Success' : 'Failed');
        if (response.data?.success) {
          console.log(`[DirectAPI] Received ${response.data.data?.items?.length || 0} models`);
          if (response.data.data?.items?.length > 0) {
            console.log(`[DirectAPI] First model:`, JSON.stringify(response.data.data.items[0]).substring(0, 200));
            setDirectApiModels(response.data.data.items);
          }
        }
      } catch (error) {
        console.error(`[DirectAPI] Error fetching models:`, error);
      }
    };
    
    if (isReady) {
      fetchDirectModels();
    }
  }, [isReady]);

  console.log(`[DynamicContentPage] Rendering. isReady: ${isReady}, slug:`, slug);

  // Only parse and fetch when the router is ready
  const { category: categorySlug, filters } = isReady ? parseSlug(slug) : { category: null, filters: {} };

  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  // Ensure category details are looked up only when categorySlug is determined
  const currentCategory = categorySlug ? categories.find(cat => cat.slug === categorySlug) : null;
  const categoryName = currentCategory ? currentCategory.name : capitalizeString(categorySlug || (isReady ? 'Models' : 'Loading...'));

  let provider = null; // Initialize as null
  let contentType = 'models'; // Default
  if (isReady && categorySlug) { // Determine provider only when ready and categorySlug exists
    switch (categorySlug) {
      case 'girls':
      case 'trans':
        provider = ApiProviders.AWE;
        contentType = 'models';
        break;
      case 'free':
        provider = ApiProviders.FREE;
        contentType = 'models';
        break;
      case 'videos':
        provider = ApiProviders.VPAPI;
        contentType = 'videos';
        break;
      default:
        provider = ApiProviders.AWE; 
        contentType = 'models';
    }
  }

  console.log(`[DynamicContentPage] Determined contentType: ${contentType}, provider: ${provider}, categorySlug: ${categorySlug}, filters:`, filters);

  const useFeedHook = contentType === 'videos' ? useVideoFeed : useModelFeed;
  
  const feedOptions = {
    category: categorySlug,
    filters,
    provider,
    limit: 24,
    // Add a key that changes only when ready and essential params change
    // This helps prevent the hook from running with intermediate undefined values
    key: isReady && categorySlug ? `${categorySlug}-${JSON.stringify(filters)}` : null
  };
  
  // Only call the hook if the router is ready and we have a provider determined
  const feedResult = (isReady && provider) ? useFeedHook(feedOptions) : {
    models: [],
    videos: [],
    isLoading: !isReady, // Show loading if router not ready
    error: null,
    hasMore: false,
    loadMore: () => {},
  };

  console.log(`[DynamicContentPage] Calling useFeedHook with options (only if isReady && provider):`, (isReady && provider) ? feedOptions : 'Skipped');
  console.log(`[DynamicContentPage] Feed hook result (verbose):`, JSON.stringify(feedResult, null, 2));

  let contentData, contentLoading, contentError, hasMore, loadMore;

  // Handle destructuring based on potentially skipped hook call
  if (contentType === 'videos') {
    contentData = feedResult.videos;
    contentLoading = feedResult.isLoading;
    contentError = feedResult.error;
    hasMore = feedResult.hasMore;
    loadMore = feedResult.loadMore;
  } else {
    contentData = feedResult.models;
    contentLoading = feedResult.isLoading;
    contentError = feedResult.error;
    hasMore = feedResult.hasMore;
    loadMore = feedResult.loadMore;
  }
  
  console.log(`[DynamicContentPage] Feed data state:`, { 
    contentData: contentData && contentData.length > 0 ? 
      `${contentData.length} items, first item: ${JSON.stringify(contentData[0])}` : 
      'empty array',
    contentLoading, 
    contentError: contentError ? JSON.stringify(contentError) : null,
    hasMore 
  });

  // Adjust overall loading state
  const isLoading = !isReady || categoriesLoading || contentLoading;
  const error = categoriesError || contentError;

  const renderContent = () => {
    console.log(`[DynamicContentPage] renderContent called. isLoading: ${isLoading}, error: ${error}, contentData length: ${contentData?.length}`);
    if (isLoading) {
      const SkeletonComponent = contentType === 'videos' ? VideoGrid : ModelGrid;
      return <SkeletonComponent isLoading={true} count={12} />;
    }

    if (error) {
      console.error(`Error loading content for ${categorySlug}:`, error);
      return <div className="text-center text-red-500 py-10">Failed to load content. Please try again later. Details: {error.message || JSON.stringify(error)}</div>;
    }

    if (!contentData || contentData.length === 0) {
      if (directApiModels.length > 0) {
        console.log(`[DynamicContentPage] Using ${directApiModels.length} direct API models as fallback`);
        return (
          <div>
            <div className="text-center text-green-500 my-4 p-4 bg-green-100 rounded">
              Fallback Mode: Using direct API data instead of hook data
            </div>
            <ModelGrid models={directApiModels} isLoading={false}>
              {(model) => (
                <ModelCard 
                  key={model.id || model.slug} 
                  performerId={model.id || model.slug}
                  name={model.name}
                  age={model.age}
                  ethnicity={model.ethnicity}
                  tags={model.tags}
                  image={model.thumbnail}
                  isOnline={model.isOnline}
                  viewerCount={model.viewerCount}
                />
              )}
            </ModelGrid>
          </div>
        );
      }
      return <div className="text-center text-gray-500 py-10">No {contentType} found matching your criteria.</div>;
    }

    if (contentType === 'videos') {
      return (
        <VideoGrid videos={contentData} isLoading={false}>
          {(video) => <VideoCard key={video.videoId || video.id} {...video} />}
        </VideoGrid>
      );
    } else {
      console.log(`[DynamicContentPage] Rendering ModelGrid with ${contentData.length} models`);
      if (contentData.length > 0) {
        console.log(`[DynamicContentPage] Sample first model:`, JSON.stringify(contentData[0]).substring(0, 200));
      }
      
      return (
        <ModelGrid models={contentData} isLoading={false}>
          {(model) => (
            <ModelCard 
              key={model.id || model.slug} 
              performerId={model.id || model.slug}
              name={model.name}
              age={model.age}
              ethnicity={model.ethnicity}
              tags={model.tags}
              image={model.thumbnail}
              isOnline={model.isOnline}
              viewerCount={model.viewerCount}
            />
          )}
        </ModelGrid>
      );
    }
  };

  let pageTitle = categoryName;
  const filterNames = Object.entries(filters)
      .map(([key, value]) => `${capitalizeString(key.replace('-',' '))}: ${capitalizeString(value.replace('-',' '))}`)
      .join(', ');
  if (filterNames) {
      pageTitle += ` - ${filterNames}`;
  }

  // +++ Log props passed to layout +++
  console.log(`[DynamicContentPage] Passing to ThemeLayout:`, { title: pageTitle, description: currentCategory?.description });
  // +++++++++++++++++++++++++++++++++

  return (
    <ThemeLayout 
      title={pageTitle} 
      description={currentCategory?.description}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{pageTitle}</h1>

        {renderContent()}

        {hasMore && !isLoading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </ThemeLayout>
  );
};

export default DynamicContentPage; 