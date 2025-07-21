import React from 'react';
import { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { LoadingText } from '../ui';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
  showDescription?: boolean;
  gridCols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/**
 * Responsive product grid with loading and empty states
 * Displays products in a responsive grid layout
 */
export function ProductGrid({
  products,
  isLoading = false,
  error = null,
  emptyMessage = 'No products found',
  className = '',
  showDescription = false,
  gridCols = { mobile: 2, tablet: 3, desktop: 4 },
}: ProductGridProps) {
  // Generate grid classes based on column configuration
  const getGridClasses = () => {
    const mobile = `grid-cols-${gridCols.mobile || 2}`;
    const tablet = `md:grid-cols-${gridCols.tablet || 3}`;
    const desktop = `lg:grid-cols-${gridCols.desktop || 4}`;
    return `grid ${mobile} ${tablet} ${desktop} gap-6`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className={getGridClasses()}>
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton
              key={`skeleton-${index}`}
              showDescription={showDescription}
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Products
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l11-4m-6 10h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Product grid
  return (
    <div className={className}>
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showDescription={showDescription}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact Product Grid for sidebar or smaller spaces
 */
interface CompactProductGridProps {
  products: Product[];
  isLoading?: boolean;
  maxItems?: number;
  className?: string;
}

export function CompactProductGrid({
  products,
  isLoading = false,
  maxItems = 5,
  className = '',
}: CompactProductGridProps) {
  const displayProducts = products.slice(0, maxItems);

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: maxItems }, (_, index) => (
          <div key={`compact-skeleton-${index}`} className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="flex">
              <div className="w-16 h-16 bg-gray-200 animate-pulse" />
              <div className="flex-1 p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!displayProducts.length) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="text-gray-500 text-sm">No products available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
          <div className="flex">
            <div className="relative w-16 h-16 bg-gray-100 flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 p-3 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">
                {product.title.length > 40 ? `${product.title.substring(0, 40)}...` : product.title}
              </h4>
              <p className="text-sm font-semibold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.rating && (
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 text-xs mr-1">★</span>
                  <span className="text-xs text-gray-500">{product.rating.rate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Product Grid with Categories - Shows products grouped by category
 */
interface CategoryProductGridProps {
  productsByCategory: Record<string, Product[]>;
  isLoading?: boolean;
  className?: string;
}

export function CategoryProductGrid({
  productsByCategory,
  isLoading = false,
  className = '',
}: CategoryProductGridProps) {
  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: 3 }, (_, categoryIndex) => (
          <div key={`category-skeleton-${categoryIndex}`} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }, (_, productIndex) => (
                <ProductCardSkeleton key={`product-skeleton-${productIndex}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const categories = Object.keys(productsByCategory);

  if (categories.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <LoadingText text="No products found in any category" showSpinner={false} />
      </div>
    );
  }

  return (
    <div className={className}>
      {categories.map((category) => {
        const products = productsByCategory[category];
        if (!products || products.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
              {category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showCategory={false}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Product Stats Component - Shows grid statistics
 */
interface ProductStatsProps {
  totalProducts: number;
  filteredProducts: number;
  currentPage: number;
  pageSize: number;
  className?: string;
}

export function ProductStats({
  totalProducts,
  filteredProducts,
  currentPage,
  pageSize,
  className = '',
}: ProductStatsProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredProducts);

  return (
    <div className={`flex items-center justify-between text-sm text-gray-600 ${className}`}>
      <div>
        Showing {startItem}-{endItem} of {filteredProducts} products
        {filteredProducts !== totalProducts && (
          <span className="text-gray-500"> (filtered from {totalProducts} total)</span>
        )}
      </div>
      <div className="hidden sm:block">
        Page {currentPage}
      </div>
    </div>
  );
} 