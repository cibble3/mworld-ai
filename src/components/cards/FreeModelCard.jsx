import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * FreeModelCard - A specialized card component for free models
 * that links to internal model pages instead of external links
 */
const FreeModelCard = ({ 
  image,
  name,
  tags,
  slug,
  age,
  isOnline = false,
  index = 0,
  id,
  performerId
}) => {
  // Get the most reliable ID for this model (in priority order)
  const modelId = performerId || id || slug || `model-${index}`;
  
  // All free models go to the free model page
  const modelPageUrl = `/free/model/${modelId}`;

  // Ensure we have a valid image URL
  const imageUrl = image || `https://loremflickr.com/320/180/model?lock=${index+100}`;
  
  // Ensure tags array is valid
  const modelTags = Array.isArray(tags) ? tags : [];
  
  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-200 hover:shadow-xl bg-[#1a1c21] border-[#2d3748]">
      {/* Link to internal model page */}
      <Link href={modelPageUrl} className="block relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={name || 'Model'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading={index < 10 ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={true}
          onError={(e) => {
            console.error(`Image failed to load: ${imageUrl}`);
            e.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
        
        {/* Online status indicator */}
        {isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full z-10 bg-[#4caf50]"></div>
        )}
      </Link>

      {/* Model Info */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold truncate">
            {name || 'Unknown Model'}{age ? ` (${age})` : ''}
          </h3>
        </div>
        
        {/* Tags */}
        {modelTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {modelTags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-0.5 rounded bg-[#333] text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions overlay - only visible on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link 
          href={modelPageUrl}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
        >
          View Free Cam
        </Link>
      </div>
    </div>
  );
};

export default FreeModelCard; 