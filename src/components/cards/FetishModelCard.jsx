import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * FetishModelCard - A specialized card component for fetish models with consistent styling
 * 
 * Features dual linking:
 * - Main card (image, name) links to whitelabel for monetization
 * - Secondary "Profile" button links to internal model bio page
 */
const FetishModelCard = ({ 
  image,
  name,
  tags,
  slug,
  age,
  isOnline = false,
  index = 0,
  id
}) => {
  // Internal bio page URL
  const internalBioUrl = `/fetish/${slug || `model-${index}`}`;
  
  // Construct external whitelabel URL for monetization
  // Format: awejmp.com/?siteId=wl3&cobrandId=201300&performerName={performerId}&prm[psid]=mikeeyy3&prm[pstool]=213_1
  const whitelabelUrl = `https://awejmp.com/?siteId=wl3&cobrandId=201300&performerName=${slug}&prm[psid]=mikeeyy3&prm[pstool]=213_1&prm[psProgram]=cbrnd`;
  
  // Ensure we have a valid image URL
  const imageUrl = image || `https://loremflickr.com/320/180/model?lock=${index+100}`;
  
  // Ensure tags array is valid
  const modelTags = Array.isArray(tags) ? tags : [];
  
  // Log image info for debugging
  console.log(`[FetishModelCard ${index}] Rendering model: ${name}, image: ${imageUrl.substring(0, 50)}...`);
  
  return (
    <div className="model-card relative">
      {/* Main card links to whitelabel for monetization */}
      <a href={whitelabelUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="model-card-image-container">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover"
            priority={index < 10}
            unoptimized={true}
            onLoad={() => console.log(`[FetishModelCard ${index}] Image loaded: ${name}`)}
            onError={() => console.error(`[FetishModelCard ${index}] Error loading image: ${imageUrl}`)}
          />
          
          {isOnline && (
            <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded bg-[#E0006C] text-white">
              LIVE
            </div>
          )}
        </div>
        
        <div className="model-card-info">
          <h3 className="model-card-name">{name || `Model ${index + 1}`}</h3>
          
          {modelTags.length > 0 && (
            <div className="model-card-tags">
              {modelTags.slice(0, 3).map((tag, i) => (
                <span key={`${tag}-${i}`} className="model-card-tag">
                  {tag}
                </span>
              ))}
              {modelTags.length > 3 && (
                <span className="model-card-tag">
                  +{modelTags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </a>
      
      {/* Profile link to internal bio page for SEO */}
      <div className="mt-2 text-center">
        <Link href={internalBioUrl} className="bg-[#222] hover:bg-[#333] text-white text-xs py-1 px-2 rounded inline-block">
          Profile
        </Link>
      </div>
    </div>
  );
};

export default FetishModelCard; 