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
  preload = false,
  highlightTag = null,
  providerLabel = null
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const isLegacy = theme === THEMES.LEGACY_DARK;

  // Limit tags to display
  const displayTags = useMemo(() => {
    // If we have a highlight tag, make sure it's first
    if (highlightTag && tags) {
      const tagsArray = [...tags];
      const tagIndex = tagsArray.findIndex(tag => 
        tag.toLowerCase() === highlightTag.toLowerCase()
      );
      
      if (tagIndex !== -1) {
        // Move highlight tag to the front
        const highlightTagValue = tagsArray[tagIndex];
        tagsArray.splice(tagIndex, 1);
        tagsArray.unshift(highlightTagValue);
      }
      
      return tagsArray.slice(0, 3);
    }
    
    return tags?.slice(0, 3) || [];
  }, [tags, highlightTag]);

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
    return getSafeImageUrl(image, fallbackImageUrl);
  }, [image, fallbackImageUrl]);
  
  // Check if we should optimize the image or not
  // Some external domains might not be on our allowlist
  const shouldOptimizeImage = useMemo(() => {
    // Check if URL is from a domain we control or have added to Next.js config
    const optimizableDomains = [
      'mistressworld.xxx',
      'cdn-image.mistressworld.xxx',
      'picsum.photos',
      'partner-api.awempire.com',
      'static-assets.awempire.com'
    ];
    
    try {
      if (!processedImageUrl) return false;
      
      // Parse the URL to get the hostname
      const url = new URL(processedImageUrl);
      return optimizableDomains.some(domain => url.hostname.includes(domain));
    } catch (e) {
      return false;
    }
  }, [processedImageUrl]);

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
            unoptimized={!shouldOptimizeImage}
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJZ5+cPAAAAABJRU5ErkJggg=="
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

        {/* Provider label if available */}
        {providerLabel && (
          <div className="absolute top-2 left-2 bg-black/70 text-primary text-xs px-2 py-0.5 rounded-sm z-10 font-medium">
            {providerLabel}
          </div>
        )}

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
            {displayTags.map((tag, index) => {
              const isHighlighted = highlightTag && tag.toLowerCase() === highlightTag.toLowerCase();
              return (
                <span
                  key={index}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 
                    ${isHighlighted 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'} 
                    ring-1 ${isHighlighted ? 'ring-primary/30' : 'ring-gray-700/50'}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelCard; 