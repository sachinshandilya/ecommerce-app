'use client';

import React from 'react';
import { useProductsContext } from '@/context';
import { Button, IconButton } from '../ui';
import { PAGINATION_DEFAULTS } from '@/utils/constants';

interface PaginationProps {
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  showPageSize?: boolean;
  showFirstLast?: boolean;
  showTotal?: boolean;
  maxVisiblePages?: number;
  variant?: 'default' | 'simple' | 'compact';
}

/**
 * Pagination component with page size selection and navigation
 * Integrates with ProductsContext for automatic state management
 */
export function Pagination({
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  totalItems: externalTotalItems,
  onPageChange: externalOnPageChange,
  onPageSizeChange: externalOnPageSizeChange,
  className = '',
  showPageSize = true,
  showFirstLast = true,
  showTotal = true,
  maxVisiblePages = 5,
  variant = 'default',
}: PaginationProps) {
  const {
    pagination,
    changePageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalProductsCount
  } = useProductsContext();

  // Use external props or context data
  const currentPage = externalCurrentPage ?? pagination?.currentPage ?? 1;
  const pageSize = externalPageSize ?? pagination?.pageSize ?? PAGINATION_DEFAULTS.PAGE_SIZE;
  const totalItems = externalTotalItems ?? totalProductsCount ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Use external handlers or context methods
  const onPageChange = externalOnPageChange ?? goToPage ?? (() => {});
  const onPageSizeChange = externalOnPageSizeChange ?? changePageSize ?? (() => {});

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  // Calculate item range for current page
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    onPageSizeChange(newSize);
    // Adjust current page if necessary
    const newTotalPages = Math.ceil(totalItems / newSize);
    if (currentPage > newTotalPages) {
      onPageChange(Math.max(1, newTotalPages));
    }
  };

  // Don't render if no items
  if (totalItems === 0) {
    return null;
  }

  // Simple variant - just prev/next
  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    );
  }

  // Compact variant - minimal controls
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <IconButton
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="ghost"
          size="sm"
          aria-label="Previous page"
        />
        
        <span className="text-sm text-gray-700 min-w-0">
          {currentPage}/{totalPages}
        </span>
        
        <IconButton
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="ghost"
          size="sm"
          aria-label="Next page"
        />
      </div>
    );
  }

  // Default full pagination
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Page Info and Items Per Page */}
      <div className="flex items-center space-x-4">
        {showTotal && (
          <div className="text-sm text-gray-700">
            Showing {startItem}-{endItem} of {totalItems} results
          </div>
        )}
        
        {showPageSize && (
          <div className="flex items-center space-x-2">
            <label htmlFor="page-size" className="text-sm text-gray-700">
              Per page:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* First Page */}
        {showFirstLast && currentPage > 2 && (
          <>
            <Button
              onClick={() => onPageChange(1)}
              variant="outline"
              size="sm"
              aria-label="Go to first page"
            >
              First
            </Button>
            {currentPage > 3 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Previous Page */}
        <IconButton
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="ghost"
          size="sm"
          aria-label="Previous page"
        />

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={page === currentPage ? 'primary' : 'outline'}
            size="sm"
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className="min-w-[2.5rem]"
          >
            {page}
          </Button>
        ))}

        {/* Next Page */}
        <IconButton
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="ghost"
          size="sm"
          aria-label="Next page"
        />

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <Button
              onClick={() => onPageChange(totalPages)}
              variant="outline"
              size="sm"
              aria-label="Go to last page"
            >
              Last
            </Button>
          </>
        )}
      </nav>
    </div>
  );
}

/**
 * Mobile Pagination - Optimized for touch devices
 */
interface MobilePaginationProps {
  className?: string;
}

export function MobilePagination({ className = '' }: MobilePaginationProps) {
  const {
    pagination,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    totalProductsCount,
    changePageSize
  } = useProductsContext();

  const currentPage = pagination?.currentPage ?? 1;
  const pageSize = pagination?.pageSize ?? PAGINATION_DEFAULTS.PAGE_SIZE;
  const totalPages = Math.ceil((totalProductsCount ?? 0) / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalProductsCount ?? 0);

  return (
    <div className={`bg-white border-t border-gray-200 px-4 py-3 ${className}`}>
      {/* Page Info */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {totalProductsCount} results
        </p>
        
        {/* Page Size Selector */}
        <select
          value={pageSize}
          onChange={(e) => changePageSize?.(Number(e.target.value))}
          className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Page</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage?.(page);
              }
            }}
            className="w-16 text-center border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">of {totalPages}</span>
        </div>

        <Button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

/**
 * Quick Pagination - For inline use with product lists
 */
interface QuickPaginationProps {
  className?: string;
  showTotal?: boolean;
}

export function QuickPagination({ 
  className = '',
  showTotal = true 
}: QuickPaginationProps) {
  const {
    pagination,
    goToNextPage,
    goToPreviousPage,
    totalProductsCount
  } = useProductsContext();

  const currentPage = pagination?.currentPage ?? 1;
  const pageSize = pagination?.pageSize ?? PAGINATION_DEFAULTS.PAGE_SIZE;
  const totalPages = Math.ceil((totalProductsCount ?? 0) / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <Button
        onClick={goToPreviousPage}
        disabled={currentPage <= 1}
        variant="outline"
        size="sm"
      >
        ← Previous
      </Button>
      
      {showTotal && (
        <span className="text-sm text-gray-600">
          {currentPage} of {totalPages}
        </span>
      )}
      
      <Button
        onClick={goToNextPage}
        disabled={currentPage >= totalPages}
        variant="outline"
        size="sm"
      >
        Next →
      </Button>
    </div>
  );
} 