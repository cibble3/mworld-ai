import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { themes } from '@/theme/config';

/**
 * Enhanced ModelCard - Displays a model thumbnail with extended features
 */
const ModelCard = ({
  image,
  name,
  age,
  tags = [],
  ethnicity,
  performerId,
  isOnline = true,
  viewerCount = 0,
  preload = false,
  country,
  chatRoomUrl,
  showStatus = 'public',
  languages = ['english'],
  isHd = false
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const isLegacy = theme === THEMES.LEGACY_DARK;

  // Limit tags to display
  const displayTags = tags?.slice(0, 3) || [];

  // Determine model category based on tags
  const isTrans = tags?.some(tag => tag.toLowerCase() === 'trans' || tag.toLowerCase() === 'transgender');
  const isFetish = tags?.some(tag => tag.toLowerCase() === 'fetish' || tag.toLowerCase() === 'bdsm' || tag.toLowerCase() === 'dominatrix');

  // Calculate chat URL based on model type
  const internalUrl = isTrans
    ? `/trans/model/${performerId}`
    : isFetish
      ? `/fetish/${performerId}`
      : `/girls/model/${performerId}`;

  // External chat URL (if provided)
  const externalUrl = chatRoomUrl || null;

  // Fallback image
  const fallbackImageUrl = "/images/placeholder.jpg";

  // Process the image URL to ensure it's safe
  const processedImageUrl = useMemo(() => {
    if (!image) return fallbackImageUrl;
    if (typeof image === 'string' && image.startsWith('//')) {
      return `https:${image}`;
    }
    // Handle picsum.photos/id URLs - they often fail in development
    if (typeof image === 'string' && image.includes('picsum.photos/id')) {
      // Use a more reliable placeholder service
      return `https://placehold.co/400x300/333/FFF?text=${encodeURIComponent(name || 'Model')}`;
    }
    return image;
  }, [image, fallbackImageUrl, name]);

  // Handle image error
  const handleImageError = (e) => {
    console.log(`Image failed to load: ${processedImageUrl}`);
    e.currentTarget.src = fallbackImageUrl;
    // Add a class to indicate this is a fallback image
    e.currentTarget.classList.add('fallback-image');
  };

  // Style objects for themeable components
  const cardStyle = {
    backgroundColor: currentTheme?.secondary || '#1a1c21',
    borderColor: currentTheme?.border || '#2d3748',
  };

  const tagStyle = {
    backgroundColor: currentTheme?.tag?.background || '#333',
    color: currentTheme?.tag?.text || '#fff',
  };

  const statusStyle = {
    backgroundColor: isOnline
      ? currentTheme?.status?.online || '#4caf50'
      : currentTheme?.status?.offline || '#ff5252',
  };

  // Helper function to format viewer count
  const formatViewerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Link href={internalUrl} legacyBehavior>
      <a className="block">
        <div
          className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${isLegacy ? 'border border-gray-800' : 'hover:shadow-2xl hover:-translate-y-1'}`}
          style={cardStyle}
        >
          {/* Image Container */}
          <div className="block relative aspect-video overflow-hidden">
            {processedImageUrl ? (
              <Image
                src={processedImageUrl}
                alt={name || 'Model'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading={preload ? "eager" : "lazy"}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={true}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}

            {/* Status indicators */}
            <div className="absolute top-0 right-0 flex items-center p-2 space-x-1.5">
              {/* HD indicator */}
              {isHd && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                  HD
                </span>
              )}
              
              {/* Online status indicator */}
              <div
                className="w-3 h-3 rounded-full z-10 ring-2 ring-gray-900/50"
                style={statusStyle}
              />
            </div>

            {/* Live status indicator */}
            {isOnline && showStatus === 'public' && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                LIVE
              </div>
            )}

            {/* Viewer count for online models */}
            {isOnline && viewerCount > 0 && (
              <div
                className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full z-10 backdrop-blur-sm"
              >
                {formatViewerCount(viewerCount)} {viewerCount === 1 ? 'viewer' : 'viewers'}
              </div>
            )}

            {/* Quick actions overlay - only visible on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
              <div className="flex justify-end space-x-2 mb-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(internalUrl, '_self');
                  }}
                  className="bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                >
                  Profile
                </button>
                {externalUrl && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(externalUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                  >
                    Engage
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="p-4 bg-background">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors duration-300">
                {name || 'Unknown Model'}{age ? ` (${age})` : ''}
              </h3>

              {/* Quick info - Country and language */}
              <div className="flex items-center space-x-1.5">
                {country && (
                  <span className="text-xs opacity-70">{country}</span>
                )}
              </div>
            </div>

            {/* Tags */}
            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {displayTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white ring-1 ring-gray-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Additional model info */}
            <div className="flex items-center mt-2 text-xs text-gray-400">
              {viewerCount > 0 && (
                <span className="mr-2">{formatViewerCount(viewerCount)} viewers</span>
              )}
              {languages.length > 0 && (
                <span>Lang: {languages.slice(0, 2).join(', ')}</span>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ModelCard; 