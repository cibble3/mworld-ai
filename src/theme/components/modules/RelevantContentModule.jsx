import React from 'react';
import Link from 'next/link';

/**
 * RelevantContentModule - Displays related content like blog posts,
 * similar models, or other cross-promotional content.
 */
const RelevantContentModule = ({ 
  title = 'You might also like',
  items = [],
  itemType = 'blog',
  className = '',
  maxItems = 3
}) => {
  // Don't render if no items
  if (!items || items.length === 0) return null;
  
  // Limit the number of items displayed
  const displayItems = items.slice(0, maxItems);
  
  return (
    <div
      data-mw-module="relevantcontent"
      className={`my-8 ${className}`}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      {/* Different display based on item type */}
      {itemType === 'blog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <div key={index} className="bg-background p-4 rounded-lg border border-gray-800">
              {item.feature_image && (
                <Link href={`/blog/${item.post_url}`} legacyBehavior>
                  <a className="block mb-3">
                    <img 
                      src={item.feature_image} 
                      alt={item.post_title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </a>
                </Link>
              )}
              <h4 className="font-semibold mb-2">
                <Link href={`/blog/${item.post_url}`} legacyBehavior>
                  <a className="hover:text-primary transition-colors">{item.post_title}</a>
                </Link>
              </h4>
              {item.post_content && (
                <div 
                  className="text-sm text-gray-400 overflow-hidden"
                  style={{ maxHeight: '3rem' }}
                  dangerouslySetInnerHTML={{ 
                    __html: item.post_content.substring(0, 100) + '...' 
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* For model recommendations */}
      {itemType === 'models' && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayItems.map((model, index) => (
            <Link 
              key={index} 
              href={model.profileUrl || `/models/${model.id}`}
              className="block"
            >
              <div className="bg-background rounded-lg overflow-hidden border border-gray-800 hover:border-primary transition-colors">
                <div className="aspect-video relative">
                  <img 
                    src={model.thumbnail || '/images/placeholder.jpg'} 
                    alt={model.name || 'Model'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="font-medium truncate text-sm">
                    {model.name || 'Model'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelevantContentModule; 