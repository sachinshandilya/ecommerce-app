'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SearchInput } from '../ui';
import { useSearchDebounce } from '@/hooks';
import { useProductsContext } from '@/context';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  disabled?: boolean;
}

/**
 * Search Bar component with debounced search functionality
 * Integrates with ProductsContext for real-time product filtering
 */
export function SearchBar({
  placeholder = 'Search products...',
  className = '',
  autoFocus = false,
  showSuggestions = false,
  disabled = false,
}: SearchBarProps) {
  const { updateSearchTerm, filters, allProducts, isSearching } = useProductsContext();
  
  // Internal state for the input value
  const [inputValue, setInputValue] = useState(filters?.searchTerm || '');
  const debouncedSearchTerm = useSearchDebounce(inputValue);

  // Update ProductsContext when debounced value changes
  useEffect(() => {
    if (updateSearchTerm && debouncedSearchTerm !== filters?.searchTerm) {
      updateSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, updateSearchTerm, filters?.searchTerm]);

  // Sync with context when search term is reset externally
  useEffect(() => {
    if (filters?.searchTerm !== inputValue && filters?.searchTerm !== undefined) {
      setInputValue(filters.searchTerm);
    }
  }, [filters?.searchTerm]);

  // Handle input change
  const handleChange = (newValue: string) => {
    setInputValue(newValue);
  };

  // Handle clear
  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className={`relative ${className}`}>
      <SearchInput
        value={inputValue}
        onChange={handleChange}
        onClear={handleClear}
        placeholder={placeholder}
        disabled={disabled}
        isLoading={isSearching}
        className="w-full"
        aria-label={placeholder}
      />
      
      {showSuggestions && inputValue && inputValue.length > 0 && (
        <SearchSuggestions
          searchTerm={inputValue}
          products={allProducts || []}
          onSuggestionClick={handleChange}
        />
      )}
    </div>
  );
}

/**
 * Search Suggestions Component
 */
interface SearchSuggestionsProps {
  searchTerm: string;
  products: any[];
  onSuggestionClick: (suggestion: string) => void;
  maxSuggestions?: number;
}

function SearchSuggestions({
  searchTerm,
  products,
  onSuggestionClick,
  maxSuggestions = 5,
}: SearchSuggestionsProps) {
  const suggestions = React.useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const searchLower = searchTerm.toLowerCase();
    const suggestionSet = new Set<string>();
    
    // Add product titles that match
    products.forEach(product => {
      if (product.title.toLowerCase().includes(searchLower)) {
        suggestionSet.add(product.title);
      }
      // Add category suggestions
      if (product.category.toLowerCase().includes(searchLower)) {
        suggestionSet.add(product.category);
      }
    });
    
    return Array.from(suggestionSet).slice(0, maxSuggestions);
  }, [searchTerm, products, maxSuggestions]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-md last:rounded-b-md"
        >
          <span className="font-medium">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Advanced Search Bar with Filters
 */
interface AdvancedSearchBarProps {
  onFiltersChange?: (filters: {
    search: string;
    category?: string;
    priceRange?: [number, number];
    rating?: number;
  }) => void;
  className?: string;
}

export function AdvancedSearchBar({
  onFiltersChange,
  className = '',
}: AdvancedSearchBarProps) {
  const { filters, categories, updateSearchTerm, updateCategories } = useProductsContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: filters?.searchTerm || '',
    category: '',
    priceRange: [0, 1000] as [number, number],
    rating: 0,
  });

  const handleSearchChange = (search: string) => {
    const newFilters = { ...localFilters, search };
    setLocalFilters(newFilters);
    if (updateSearchTerm) {
      updateSearchTerm(search);
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...localFilters, category };
    setLocalFilters(newFilters);
    if (updateCategories) {
      updateCategories(category ? [category] : []);
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      priceRange: [0, 1000] as [number, number],
      rating: 0,
    };
    setLocalFilters(clearedFilters);
    if (updateSearchTerm) updateSearchTerm('');
    if (updateCategories) updateCategories([]);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Main Search */}
      <div className="flex items-center space-x-2">
        <SearchInput
          value={localFilters.search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="flex-1"
        />
        <button
          onClick={toggleExpanded}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Filters
          <svg
            className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={localFilters.priceRange[0]}
                onChange={(e) => {
                  const newRange: [number, number] = [
                    parseInt(e.target.value),
                    localFilters.priceRange[1],
                  ];
                  setLocalFilters({ ...localFilters, priceRange: newRange });
                }}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={localFilters.priceRange[1]}
                onChange={(e) => {
                  const newRange: [number, number] = [
                    localFilters.priceRange[0],
                    parseInt(e.target.value),
                  ];
                  setLocalFilters({ ...localFilters, priceRange: newRange });
                }}
                className="flex-1"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Quick Search - Compact search for header or sidebar
 */
interface QuickSearchProps {
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function QuickSearch({
  placeholder = 'Quick search...',
  className = '',
  size = 'md',
}: QuickSearchProps) {
  const { updateSearchTerm, filters } = useProductsContext();

  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4',
  };

  return (
    <SearchInput
      value={filters?.searchTerm || ''}
      onChange={updateSearchTerm || (() => {})}
      placeholder={placeholder}
      className={`${className} ${sizeClasses[size]}`}
    />
  );
} 