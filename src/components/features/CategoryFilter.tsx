'use client';

import React, { useState, useMemo } from 'react';
import { useProductsContext } from '@/context';
import { Button, Badge } from '../ui';
import { capitalizeFirst } from '@/utils/helpers';

interface CategoryFilterProps {
  categories?: string[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  productCounts?: Record<string, number>;
  className?: string;
  title?: string;
  showCounts?: boolean;
  showClearAll?: boolean;
  variant?: 'checkbox' | 'button' | 'compact';
  maxVisible?: number;
}

/**
 * Category Filter component with multi-select functionality
 * Integrates with ProductsContext for real-time filtering
 */
export function CategoryFilter({
  categories: externalCategories,
  selectedCategories: externalSelected,
  onCategoryChange: externalOnChange,
  productCounts,
  className = '',
  title = 'Categories',
  showCounts = true,
  showClearAll = true,
  variant = 'checkbox',
  maxVisible = 10,
}: CategoryFilterProps) {
  const { 
    categories: contextCategories, 
    filters, 
    updateCategories,
    allProducts 
  } = useProductsContext();

  // Use external or context data
  const categories = externalCategories || contextCategories;
  const selectedCategories = externalSelected || filters?.selectedCategories || [];
  const onCategoryChange = externalOnChange || updateCategories;

  // Calculate product counts if not provided
  const calculatedCounts = useMemo(() => {
    if (productCounts) return productCounts;
    if (!allProducts) return {};

    const counts: Record<string, number> = {};
    allProducts.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [productCounts, allProducts]);

  // State for showing more categories
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, maxVisible);

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    if (!onCategoryChange) return;

    const isSelected = selectedCategories.includes(category);
    let newSelected: string[];

    if (isSelected) {
      newSelected = selectedCategories.filter(c => c !== category);
    } else {
      newSelected = [...selectedCategories, category];
    }

    onCategoryChange(newSelected);
  };

  // Handle clear all
  const handleClearAll = () => {
    if (onCategoryChange) {
      onCategoryChange([]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (onCategoryChange) {
      onCategoryChange([...categories]);
    }
  };

  if (!categories.length) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
        <p className="text-sm text-gray-500">No categories available</p>
      </div>
    );
  }

  // Render different variants
  if (variant === 'button') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {showClearAll && selectedCategories.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            const count = calculatedCounts[category] || 0;

            return (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
              >
                {capitalizeFirst(category)}
                {showCounts && count > 0 && (
                  <span className={`ml-1 text-xs ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {categories.length > maxVisible && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAll ? 'Show Less' : `Show ${categories.length - maxVisible} More`}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          {showClearAll && selectedCategories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          {visibleCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            const count = calculatedCounts[category] || 0;

            return (
              <label
                key={category}
                className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="flex-1 text-gray-900">{capitalizeFirst(category)}</span>
                {showCounts && count > 0 && (
                  <span className="text-xs text-gray-500">({count})</span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // Default checkbox variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {selectedCategories.length > 0 && (
            <Badge variant="default" size="sm">
              {selectedCategories.length}
            </Badge>
          )}
          {showClearAll && selectedCategories.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Select All/None */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
        <button
          onClick={handleSelectAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          disabled={selectedCategories.length === categories.length}
        >
          Select All
        </button>
        <span className="text-xs text-gray-500">
          {selectedCategories.length} of {categories.length} selected
        </span>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {visibleCategories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const count = calculatedCounts[category] || 0;

          return (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCategoryToggle(category)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {capitalizeFirst(category)}
                </span>
                {showCounts && count > 0 && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Show More/Less */}
      {categories.length > maxVisible && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2 border-t border-gray-200"
        >
          {showAll 
            ? 'Show Less Categories' 
            : `Show ${categories.length - maxVisible} More Categories`
          }
        </button>
      )}
    </div>
  );
}

/**
 * Quick Category Filter - For mobile or compact spaces
 */
interface QuickCategoryFilterProps {
  className?: string;
  maxVisible?: number;
}

export function QuickCategoryFilter({
  className = '',
  maxVisible = 5,
}: QuickCategoryFilterProps) {
  const { categories, filters, updateCategories } = useProductsContext();
  const selectedCategories = filters?.selectedCategories || [];

  const handleCategoryToggle = (category: string) => {
    if (!updateCategories) return;

    const isSelected = selectedCategories.includes(category);
    let newSelected: string[];

    if (isSelected) {
      newSelected = selectedCategories.filter(c => c !== category);
    } else {
      // In quick filter, only allow one selection at a time
      newSelected = [category];
    }

    updateCategories(newSelected);
  };

  const handleClearAll = () => {
    if (updateCategories) {
      updateCategories([]);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Categories:</span>
      <div className="flex flex-wrap gap-1">
        {categories.slice(0, maxVisible).map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`
                px-2 py-1 rounded text-xs font-medium transition-colors
                ${isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {capitalizeFirst(category)}
            </button>
          );
        })}
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-2 py-1 rounded text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Category Filter Sidebar - For desktop layouts
 */
interface CategoryFilterSidebarProps {
  className?: string;
  sticky?: boolean;
}

export function CategoryFilterSidebar({
  className = '',
  sticky = true,
}: CategoryFilterSidebarProps) {
  const { hasActiveFilters, resetFilters } = useProductsContext();

  return (
    <div className={`w-64 ${sticky ? 'sticky top-20' : ''} ${className}`}>
      <div className="space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <Button
              onClick={resetFilters}
              variant="outline"
              size="sm"
            >
              Reset All
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <CategoryFilter
          title="Product Categories"
          variant="checkbox"
          showCounts={true}
          showClearAll={true}
          maxVisible={8}
        />
      </div>
    </div>
  );
} 