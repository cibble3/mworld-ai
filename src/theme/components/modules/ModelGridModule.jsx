import React from 'react';
import ModelGrid from '../grid/ModelGrid';
import ModelCard from '../common/ModelCard';

/**
 * ModelGridModule - Unified component for displaying a grid of model cards.
 * This is the core module for displaying model feeds from any API source.
 */
const ModelGridModule = ({ 
  models = [],
  isLoading = false,
  loadMore,
  hasMore = false,
  emptyMessage = 'No models found',
  columns = { sm: 2, md: 3, lg: 4, xl: 5 },
  className = ''
}) => {
  return (
    <div
      data-mw-module="modelgrid"
      className={className}
    >
      {/* Model Grid using the shared component */}
      <ModelGrid 
        models={models} 
        isLoading={isLoading}
        columns={columns}
      >
        {(model) => (
          <ModelCard
            key={model.id || model.slug || model.performerId}
            performerId={model.id || model.performerId}
            name={model.name || model.nickname || model.performerName || 'Unknown Model'}
            age={model.age || ''}
            ethnicity={model.ethnicity || ''}
            tags={model.tags || model.attributes || model.categories || []}
            image={model.thumbnail || model.snapshotUrl || model.imageURL}
            isOnline={model.isOnline !== undefined ? model.isOnline : true}
            viewerCount={model.viewerCount || model.viewers || 0}
            country={model.country || ''}
            chatRoomUrl={model.chatRoomUrl || model.liveFeedURL || ''}
            showStatus={model.showStatus || 'public'}
            languages={model.languages || ['english']}
            isHd={model.isHd || model.hd || false}
          />
        )}
      </ModelGrid>

      {/* Empty state */}
      {!isLoading && models.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      )}

      {/* Load more button */}
      {hasMore && !isLoading && models.length > 0 && loadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelGridModule; 