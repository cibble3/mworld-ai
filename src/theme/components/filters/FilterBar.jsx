import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * FilterBar component for displaying and handling filters
 * @param {Object} props
 * @param {Array} props.filters - Array of filter objects
 * @param {Object} props.activeFilters - Object of currently active filters
 * @param {Function} props.onFilterChange - Function to call when filter changes
 */
const FilterBar = ({ filters = [], activeFilters = {}, onFilterChange }) => {
  const { themeConfig } = useTheme();
  const [expandedFilter, setExpandedFilter] = useState(null);
  
  const currentTheme = themeConfig.palette || {};
  
  // Toggle filter dropdown
  const toggleFilter = (filterType) => {
    setExpandedFilter(expandedFilter === filterType ? null : filterType);
  };
  
  // Handle filter option click
  const handleFilterOptionClick = (filterType, value) => {
    // If already selected, deselect it
    const newValue = activeFilters[filterType] === value ? '' : value;
    onFilterChange(filterType, newValue);
    setExpandedFilter(null); // Close dropdown after selection
  };
  
  // Styles
  const filterButtonStyle = {
    backgroundColor: currentTheme.background?.card || '#2a2a2a',
    borderColor: currentTheme.border || '#333',
    color: currentTheme.text?.primary || '#fff',
  };
  
  const activeFilterStyle = {
    backgroundColor: currentTheme.primary || '#e0006c',
    color: '#fff',
  };
  
  const dropdownStyle = {
    backgroundColor: currentTheme.background?.card || '#2a2a2a',
    borderColor: currentTheme.border || '#333',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  };
  
  const dropdownItemStyle = {
    color: currentTheme.text?.secondary || '#ccc',
  };
  
  const dropdownItemHoverStyle = {
    backgroundColor: currentTheme.background?.dark || '#1a1a1a',
    color: currentTheme.text?.primary || '#fff',
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        
        {/* Clear all filters button */}
        {Object.values(activeFilters).some(value => value) && (
          <button
            className="text-sm text-pink-500 hover:text-pink-400"
            onClick={() => {
              // Clear all filters by calling onFilterChange with empty values
              Object.keys(activeFilters).forEach(filterType => {
                onFilterChange(filterType, '');
              });
            }}
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.type} className="relative">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium border flex items-center gap-2"
              style={activeFilters[filter.type] ? activeFilterStyle : filterButtonStyle}
              onClick={() => toggleFilter(filter.type)}
            >
              {filter.name}
              <span className="ml-1">
                {expandedFilter === filter.type ? '▲' : '▼'}
              </span>
              
              {/* Show active filter value if set */}
              {activeFilters[filter.type] && (
                <span className="ml-1">
                  : {filter.options.find(opt => opt.value === activeFilters[filter.type])?.label || activeFilters[filter.type]}
                </span>
              )}
            </button>
            
            {/* Dropdown for filter options */}
            {expandedFilter === filter.type && (
              <div 
                className="absolute z-10 mt-1 min-w-[200px] rounded-md border p-1"
                style={dropdownStyle}
              >
                <div className="py-1">
                  {filter.options.map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                        activeFilters[filter.type] === option.value 
                          ? 'bg-pink-500 text-white' 
                          : 'hover:bg-gray-800'
                      }`}
                      style={
                        activeFilters[filter.type] === option.value 
                          ? activeFilterStyle 
                          : dropdownItemStyle
                      }
                      onClick={() => handleFilterOptionClick(filter.type, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Active filters display */}
      {Object.entries(activeFilters).some(([_, value]) => value) && (
        <div className="mt-4">
          <div className="text-sm text-gray-400">Active Filters:</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(activeFilters).map(([filterType, value]) => {
              if (!value) return null;
              
              const filterObj = filters.find(f => f.type === filterType);
              if (!filterObj) return null;
              
              const option = filterObj.options.find(opt => opt.value === value);
              if (!option) return null;
              
              return (
                <div 
                  key={`${filterType}-${value}`}
                  className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{filterObj.name}: {option.label}</span>
                  <button
                    className="ml-2 rounded-full hover:bg-pink-600 w-5 h-5 flex items-center justify-center"
                    onClick={() => onFilterChange(filterType, '')}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar; 