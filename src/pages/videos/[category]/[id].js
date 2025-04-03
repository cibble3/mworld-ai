import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import HeadMeta from '@/components/HeadMeta';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import DynamicSidebar from '@/components/navigation/DynamicSidebar';
import VideoCard from '@/theme/components/common/VideoCard';
import useModelFeed from '@/hooks/useModelFeed';
import { ApiProviders } from '@/services/api';
import { getSafeImageUrl, slugify } from '@/utils/image-helpers';

// Video player component that handles VPAPI script format
const VideoEmbed = ({ embedUrl, embedScript }) => {
  const containerRef = useRef(null);
  const containerId = useRef(`video-container-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // SIMPLEST APPROACH: For our mock data, we know it's a Vimeo video, so directly create an iframe
    if (embedUrl && embedUrl.includes('vimeo.com')) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';

      containerRef.current.appendChild(iframe);
      return;
    }

    // For production VPAPI data with {CONTAINER} placeholder
    if (embedScript && embedScript.includes('{CONTAINER}')) {
      try {
        // Replace placeholder with actual container ID
        const containerId = containerRef.current.id;
        const processedScript = embedScript.replace(/{CONTAINER}/g, containerId);

        // For script tags, extract and execute the script
        if (processedScript.includes('<script')) {
          // Extract src attribute if present
          const srcMatch = processedScript.match(/src=["']([^"']+)["']/);
          if (srcMatch && srcMatch[1]) {
            const scriptEl = document.createElement('script');
            scriptEl.src = srcMatch[1].startsWith('//') ? `https:${srcMatch[1]}` : srcMatch[1];
            document.body.appendChild(scriptEl);
          }
        }
        // If it's an iframe, just insert it
        else if (processedScript.includes('<iframe')) {
          containerRef.current.innerHTML = processedScript;
        }
      } catch (error) {
        console.error("Error handling video embed:", error);
        // Fallback to direct URL if available
        if (embedUrl) {
          containerRef.current.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>`;
        }
      }
    } else if (embedUrl) {
      // Direct fallback to embedUrl
      containerRef.current.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>`;
    }
  }, [embedUrl, embedScript]);

  return <div id={containerId.current} ref={containerRef} className="w-full h-full"></div>;
};

// Format views (e.g., "1.2K views")
const formatViews = (views) => {
  if (!views) return '0 views';

  return views >= 1000000
    ? `${(views / 1000000).toFixed(1)}M views`
    : views >= 1000
      ? `${(views / 1000).toFixed(1)}K views`
      : `${views} views`;
};

// Format duration (e.g., "12:34")
const formatDuration = (seconds) => {
  if (!seconds) return '00:00';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoDetailPage = () => {
  const router = useRouter();
  const { category, id } = router.query;
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoModalRef = useRef(null);

  // Fetch related videos
  const {
    models: relatedVideos,
    isLoading: relatedLoading
  } = useModelFeed({
    provider: ApiProviders.VPAPI,
    category: category || 'popular',
    limit: 8,
    filters: {
      excludeId: id
    }
  });

  // Ensure we have a valid videos array
  const safeRelatedVideos = Array.isArray(relatedVideos) ? relatedVideos : [];

  // Fetch video details when ID is available
  useEffect(() => {
    if (!id) return;

    const fetchVideoDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Extract just the ID part from the URL parameter (it might be "id-slug")
        const idPart = id.split('-')[0];

        // Fetch video details from API
        const response = await axios.get(`/api/videos/${idPart}`, {
          params: {
            category
          }
        });

        if (response.data.success) {
          setVideo(response.data.data);

          // If we're using just ID in the URL, redirect to the SEO-friendly version
          if (id === idPart && response.data.data.title) {
            const titleSlug = slugify(response.data.data.title);
            const seoUrl = `/videos/${category}/${idPart}-${titleSlug}`;

            // Only redirect if we're not already on the SEO URL
            if (router.asPath !== seoUrl) {
              router.replace(seoUrl, undefined, { shallow: true });
            }
          }
        } else {
          throw new Error(response.data.error || 'Failed to load video');
        }
      } catch (err) {
        console.error('Error loading video:', err);
        setError(err.message || 'Failed to load video');

        // For development, create fallback data
        if (process.env.NODE_ENV === 'development') {
          setVideo({
            id: id,
            title: `Sample ${category} Video (ID: ${id})`,
            description: 'This is a sample video description used in development mode when the API is unavailable.',
            thumbnail: `https://picsum.photos/id/${parseInt(id, 10) % 50 + 100}/800/450`,
            duration: 358, // 5:58
            views: 12500,
            category: category,
            tags: [category, 'featured', 'sample'],
            targetUrl: 'https://example.com/sample-video',
            quality: 'hd',
            uploadDate: new Date().toISOString(),
            uploader: 'Sample Studio'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id, category, router]);

  // Handle close modal when clicking outside modal content
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (videoModalRef.current && !videoModalRef.current.contains(event.target)) {
        setShowVideoModal(false);
      }
    };

    if (showVideoModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVideoModal]);

  if (isLoading) {
    return (
      <div className="bg-[#16181c] min-h-screen">
        <HeadMeta pageContent={{
          meta_title: "Loading Video... - MistressWorld Videos",
          meta_desc: "Please wait while we load your video content."
        }} />
        <CookiesModal />

        {/* Sidebar as an overlay that doesn't affect main content flow */}
        <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
          <DynamicSidebar />
        </div>

        <div className="py-4 px-3">
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse space-y-6 w-full max-w-4xl">
              <div className="aspect-video bg-gray-700 rounded-lg"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !video) {
    return (
      <div className="bg-[#16181c] min-h-screen">
        <HeadMeta pageContent={{
          meta_title: "Error Loading Video - MistressWorld Videos",
          meta_desc: "There was a problem loading this video content."
        }} />
        <CookiesModal />

        {/* Sidebar as an overlay that doesn't affect main content flow */}
        <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
          <DynamicSidebar />
        </div>

        <div className="py-4 px-3">
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-6 max-w-2xl">
              <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Video</h1>
              <p className="text-gray-300 mb-6">{error}</p>
              <Link href="/videos" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md">
                Back to Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="bg-[#16181c] min-h-screen">
        <HeadMeta pageContent={{
          meta_title: "Video Not Found - MistressWorld Videos",
          meta_desc: "The requested video could not be found."
        }} />
        <CookiesModal />

        {/* Sidebar as an overlay that doesn't affect main content flow */}
        <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
          <DynamicSidebar />
        </div>

        <div className="py-4 px-3">
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl">
              <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
              <p className="text-gray-300 mb-6">The video you're looking for doesn't exist or has been removed.</p>
              <Link href="/videos" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md">
                Back to Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safety checks for video properties
  const videoTitle = video.title || 'Untitled Video';
  const videoThumbnail = getSafeImageUrl(video.thumbnail) || '/images/placeholder.jpg';
  const videoDescription = video.description || `Watch ${videoTitle} on MistressWorld.`;
  const videoTags = Array.isArray(video.tags) ? video.tags : [];
  const videoCategory = video.category || category || 'videos';

  // Create page metadata object for HeadMeta component
  const pageContent = {
    meta_title: `${videoTitle} - MistressWorld Videos`,
    meta_desc: videoDescription,
    meta_keywords: `${videoTags.join(', ')}, adult videos, streaming videos, ${videoCategory} videos`,
    og_image: videoThumbnail,
    og_type: 'video'
  };

  return (
    <div className="bg-[#16181c] min-h-screen">
      <HeadMeta pageContent={pageContent} />
      <CookiesModal />

      {/* Video Modal for external targetUrl */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div ref={videoModalRef} className="relative w-full max-w-4xl mx-auto p-4">
            <button
              className="absolute top-2 right-2 text-white bg-pink-600 rounded-full p-2 z-10"
              onClick={() => setShowVideoModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={video.targetUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar as an overlay that doesn't affect main content flow */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a1a1a] overflow-y-auto z-10 pointer-events-auto lg:block hidden">
        <DynamicSidebar />
      </div>

      <div className="py-4 px-3">
        {/* Video Player Section */}
        <div className="mb-8">
          <div className="aspect-video bg-black overflow-hidden rounded-lg">
            {/* Video Embed / Player */}
            {video.playerEmbedUrl || video.playerEmbedScript ? (
              <div className="w-full h-full" id="video-container">
                {/* VPAPI Player Implementation */}
                {(() => {
                  // Create a script element to load the VPAPI player
                  useEffect(() => {
                    const container = document.getElementById('video-container');
                    if (!container) return;

                    // Clear previous content
                    container.innerHTML = '';

                    // If we have playerEmbedUrl from VPAPI
                    if (video.playerEmbedUrl) {
                      if (video.playerEmbedUrl.includes('{CONTAINER}')) {
                        // Replace {CONTAINER} placeholder with our container ID
                        const embedUrl = video.playerEmbedUrl.replace('{CONTAINER}', 'video-container');

                        // Create script element for VPAPI player
                        const script = document.createElement('script');
                        script.src = embedUrl;
                        container.appendChild(script);
                      } else {
                        // Direct iframe URL (like Vimeo for testing)
                        container.innerHTML = `<iframe src="${video.playerEmbedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
                      }
                    }
                    // If we have playerEmbedScript from VPAPI
                    else if (video.playerEmbedScript) {
                      if (video.playerEmbedScript.includes('{CONTAINER}')) {
                        // Replace {CONTAINER} placeholder with our container ID
                        const scriptContent = video.playerEmbedScript.replace(/{CONTAINER}/g, 'video-container');

                        // Extract the script source
                        const srcMatch = scriptContent.match(/src=["']([^"']+)["']/);
                        if (srcMatch && srcMatch[1]) {
                          const scriptEl = document.createElement('script');
                          scriptEl.src = srcMatch[1].startsWith('//') ?
                            `https:${srcMatch[1]}` : srcMatch[1];
                          document.body.appendChild(scriptEl);
                        }
                      } else {
                        // For regular iframe HTML
                        container.innerHTML = video.playerEmbedScript;
                      }
                    }
                  }, [video]);

                  return null;
                })()}
              </div>
            ) : video.targetUrl ? (
              /* If only targetUrl is available, create a custom player that loads video in modal */
              <div className="w-full h-full relative group cursor-pointer">
                <Image
                  src={videoThumbnail}
                  alt={videoTitle}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-opacity">
                  <div
                    className="bg-pink-600 hover:bg-pink-700 rounded-full p-4 shadow-lg transform transition hover:scale-110"
                    onClick={() => setShowVideoModal(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              /* Otherwise just show the thumbnail */
              <div className="w-full h-full relative">
                <Image
                  src={videoThumbnail}
                  alt={videoTitle}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <p className="text-xl font-bold mb-4">Preview Only</p>
                    <p>Full video not available for embedded playback</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Info Section */}
        <div className="bg-[#1a1c21] rounded-lg p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{videoTitle}</h1>

          <div className="flex items-center text-gray-400 mb-4">
            <span className="mr-4">{formatViews(video.views)}</span>
            <span>{formatDuration(video.duration)}</span>
            {video.quality && (
              <span className="ml-4 px-2 py-1 text-xs bg-[#2d3748] rounded uppercase">{video.quality}</span>
            )}
          </div>

          <div className="flex flex-wrap mb-6">
            {videoTags.map((tag, i) => (
              <Link
                key={i}
                href={`/videos/${tag}`}
                className="mr-2 mb-2 bg-[#2d3748] hover:bg-[#3a4763] px-3 py-1 rounded-full text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {video.description && (
            <div className="mt-4 p-4 bg-[#2d3748] bg-opacity-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{video.description}</p>
            </div>
          )}

          {video.targetUrl && (
            <div className="mt-6">
              <a
                href={video.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-md inline-block transition-colors"
              >
                Watch Full Video
              </a>
            </div>
          )}
        </div>

        {/* Related Videos Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Related Videos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedLoading ? (
              // Loading skeletons for related videos
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#1a1c21] rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-[#2d3748]"></div>
                  <div className="p-4">
                    <div className="h-4 bg-[#2d3748] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#2d3748] rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : safeRelatedVideos.length === 0 ? (
              <div className="col-span-full text-center py-6 text-gray-400">
                No related videos found
              </div>
            ) : (
              safeRelatedVideos.map((video, index) => (
                <VideoCard
                  key={video.id || index}
                  image={video.thumbnail}
                  title={video.title}
                  duration={video.duration}
                  views={video.views}
                  category={video.category || videoCategory}
                  videoId={video.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage; 