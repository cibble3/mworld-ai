import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme, THEMES } from '@/context/ThemeContext';
import { themes } from '@/theme/config';
import { getSafeImageUrl } from '@/utils/image-helpers';

/**
 * ModelCard - Displays a model thumbnail with details
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
  preload = false
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
  const chatUrl = isTrans
    ? `/trans/model/${performerId}`
    : isFetish
      ? `/fetish/${performerId}`
      : `/girls/model/${performerId}`;

  // Fallback image
  const fallbackImageUrl = "/images/placeholder.jpg";

  // Process the image URL to ensure it's safe - using new helper
  const processedImageUrl = useMemo(() => {
    if (!image) return fallbackImageUrl;
    if (typeof image === 'string' && image.startsWith('//')) {
      return `https:${image}`;
    }
    return image;
  }, [image, fallbackImageUrl]);

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

  return (
    <div
      className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${isLegacy ? 'border border-gray-800' : 'hover:shadow-2xl hover:-translate-y-1'}`}
      style={cardStyle}
    >
      {/* Image Container */}
      <Link href={chatUrl} className="block relative aspect-video overflow-hidden">
        {processedImageUrl ? (
          <Image
            src={processedImageUrl}
            alt={name || 'Model'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading={preload ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={true}
            onError={(e) => {
              console.log(`Image failed to load: ${processedImageUrl}`);
              e.currentTarget.src = fallbackImageUrl;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}

        {/* Online status indicator */}
        <div
          className="absolute top-2 right-2 w-3 h-3 rounded-full z-10 ring-2 ring-gray-900/50"
          style={statusStyle}
        />

        {/* Viewer count for online models */}
        {isOnline && viewerCount > 0 && (
          <div
            className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full z-10 backdrop-blur-sm"
          >
            {viewerCount} viewers
          </div>
        )}

        {/* Quick actions overlay - only visible on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href={chatUrl}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:scale-105 transform"
          >
            Watch Live Stream
          </Link>
        </div>
      </Link>

      {/* Model Info */}
      <div className="p-4 bg-background">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors duration-300">
            {name || 'Unknown Model'}{age ? ` (${age})` : ''}
          </h3>

          {ethnicity && isLegacy && (
            <span className="text-xs opacity-70">{ethnicity}</span>
          )}
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
      </div>
    </div>
  );
};

export default ModelCard; 