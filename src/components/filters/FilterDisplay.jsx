import React from 'react';
import { capitalizeString } from '@/utils/string-helpers';

/**
 * FilterDisplay - Component to display active filters with remove options
 * 
 * @param {Object} props
 * @param {Array} props.filters - Array of filter objects with type and value
 * @param {Function} props.onRemove - Function to call when a filter is removed
 * @param {Function} props.onClearAll - Function to call when all filters should be cleared
 * @param {string} props.className - Optional additional classes
 */
const FilterDisplay = ({ 
  filters = [], 
  onRemove, 
  onClearAll,
  className = ''
}) => {
  if (!filters || filters.length === 0) return null;

  // Filter types to "pretty" display names mapping
  const displayNames = {
    ethnicity: 'Ethnicity',
    hair_color: 'Hair Color',
    tags: 'Tag',
    willingness: 'Willingness',
    gender_identity: 'Gender Identity',
    body_type: 'Body Type',
    fetish_type: 'Fetish Type',
    region: 'Region',
    hd: 'HD'
  };

  // Format filter display names
  const formatFilterName = (type, value) => {
    const typeDisplay = displayNames[type] || capitalizeString(type.replace('_', ' '));
    return `${typeDisplay}: ${capitalizeString(value.replace('_', ' '))}`;
  };

  return (
    <div className={`mb-6 bg-[#1a1c21] rounded-lg p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-sm text-gray-400 mr-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map(({ type, value }) => (
              <div 
                key={`${type}-${value}`}
                className="flex items-center bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full text-xs transition-colors"
              >
                <span>{formatFilterName(type, value)}</span>
                <button 
                  onClick={() => onRemove(type, value)}
                  className="ml-2 text-gray-400 hover:text-pink-500"
                  aria-label={`Remove ${formatFilterName(type, value)} filter`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={onClearAll}
          className="mt-2 sm:mt-0 text-gray-400 hover:text-pink-500 text-xs flex items-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterDisplay; 