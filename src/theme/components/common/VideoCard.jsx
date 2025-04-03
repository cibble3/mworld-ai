import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { themes } from '@/theme/config';
import { getSafeImageUrl, slugify } from '@/utils/image-helpers';

/**
 * VideoCard - Displays a video thumbnail with details
 */
const VideoCard = ({
  image,
  title,
  duration,
  views,
  category,
  videoId,
  preload = false
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes[THEMES.DARK]; // Default to dark theme if current theme not found
  const isLegacy = theme === THEMES.LEGACY_DARK;

  // Calculate video URL with SEO-friendly slug
  const titleSlug = slugify(title || 'video');
  const videoUrl = `/videos/${category}/${videoId}-${titleSlug}`;

  // Format duration (e.g., "12:34")
  const formattedDuration = duration 
    ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
    : '00:00';

  // Format views (e.g., "1.2K views")
  const formattedViews = views 
    ? views >= 1000000
      ? `${(views / 1000000).toFixed(1)}M views`
      : views >= 1000
        ? `${(views / 1000).toFixed(1)}K views`
        : `${views} views`
    : '0 views';

  // Style objects for themeable components
  const cardStyle = {
    backgroundColor: currentTheme?.secondary || '#1a1c21',
    borderColor: currentTheme?.border || '#2d3748',
  };

  // Process the image URL to ensure it's safe
  const processedImageUrl = useMemo(() => {
    // Ensure URL starts with https: or http:
    let url = image || '';
    
    // Handle protocol-relative URLs (//example.com)
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }
    
    // Ensure we have a valid image URL or use fallback
    return url || '/images/placeholder.jpg';
  }, [image]);

  // Fallback image
  const fallbackImageUrl = "/images/placeholder.jpg";

  return (
    <div 
      className={`relative group overflow-hidden rounded-lg transition-all duration-200 ${
        isLegacy ? 'border border-gray-800' : 'hover:shadow-xl'
      } video-card`}
      style={cardStyle}
    >
      {/* Thumbnail Container */}
      <Link href={videoUrl} className="block relative aspect-video overflow-hidden">
        {processedImageUrl ? (
          <div className="w-full h-full relative">
            <Image 
              src={processedImageUrl} 
              alt={title || 'Video thumbnail'} 
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              loading={preload ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={true}
              onError={(e) => {
                console.log(`Image failed to load: ${processedImageUrl}`);
                e.currentTarget.src = fallbackImageUrl;
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No thumbnail</span>
          </div>
        )}
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
          {formattedDuration}
        </div>
        
        {/* Play button overlay (shown on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="p-3">
        <h3 className="font-semibold truncate text-sm md:text-base">
          {title || 'Untitled Video'}
        </h3>
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{formattedViews}</span>
          <span className="capitalize">{category}</span>
        </div>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(VideoCard); 