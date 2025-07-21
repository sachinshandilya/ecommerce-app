import React from 'react';
import Link from 'next/link';

interface ProductBreadcrumbProps {
  productTitle?: string;
  category?: string;
  className?: string;
  showHome?: boolean;
  maxTitleLength?: number;
}

/**
 * Product Breadcrumb navigation component
 * Provides navigation path: Home > Products > [Category] > Product Name
 */
export function ProductBreadcrumb({
  productTitle,
  category,
  className = '',
  showHome = true,
  maxTitleLength = 50,
}: ProductBreadcrumbProps) {
  // Truncate product title if too long
  const displayTitle = productTitle 
    ? productTitle.length > maxTitleLength
      ? `${productTitle.substring(0, maxTitleLength)}...`
      : productTitle
    : '';

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home */}
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="sr-only">Home</span>
            </Link>
            <BreadcrumbSeparator />
          </li>
        )}

        {/* Products */}
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Products
          </Link>
          {(category || productTitle) && <BreadcrumbSeparator />}
        </li>

        {/* Category (optional) */}
        {category && (
          <li className="flex items-center">
            <Link
              href={`/?category=${encodeURIComponent(category)}`}
              className="text-gray-500 hover:text-gray-700 transition-colors capitalize"
            >
              {category}
            </Link>
            {productTitle && <BreadcrumbSeparator />}
          </li>
        )}

        {/* Current Product */}
        {productTitle && (
          <li className="flex items-center">
            <span
              className="text-gray-900 font-medium"
              aria-current="page"
              title={productTitle}
            >
              {displayTitle}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}

/**
 * Breadcrumb separator component
 */
function BreadcrumbSeparator() {
  return (
    <svg
      className="h-4 w-4 text-gray-400 mx-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

/**
 * Mobile Breadcrumb - Simplified for mobile devices
 */
interface MobileBreadcrumbProps {
  productTitle?: string;
  onBack?: () => void;
  className?: string;
}

export function MobileBreadcrumb({
  productTitle,
  onBack,
  className = '',
}: MobileBreadcrumbProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default back behavior
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Go back"
      >
        <svg
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">Product Details</p>
        {productTitle && (
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {productTitle}
          </h1>
        )}
      </div>
    </div>
  );
}

/**
 * Breadcrumb with Actions - For pages that need additional actions
 */
interface BreadcrumbWithActionsProps {
  productTitle?: string;
  category?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function BreadcrumbWithActions({
  productTitle,
  category,
  actions,
  className = '',
}: BreadcrumbWithActionsProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <ProductBreadcrumb
        productTitle={productTitle}
        category={category}
        className="flex-1 min-w-0"
      />
      
      {actions && (
        <div className="flex items-center space-x-2 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * Breadcrumb Skeleton for loading states
 */
export function BreadcrumbSkeleton({
  className = '',
  showCategory = true,
}: {
  className?: string;
  showCategory?: boolean;
}) {
  return (
    <nav className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Home skeleton */}
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        
        {/* Products skeleton */}
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        
        {/* Category skeleton */}
        {showCategory && (
          <>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          </>
        )}
        
        {/* Product title skeleton */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </nav>
  );
}

/**
 * Responsive Breadcrumb - Adapts based on screen size
 */
interface ResponsiveBreadcrumbProps {
  productTitle?: string;
  category?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function ResponsiveBreadcrumb({
  productTitle,
  category,
  onBack,
  actions,
  className = '',
}: ResponsiveBreadcrumbProps) {
  return (
    <>
      {/* Desktop Breadcrumb */}
      <div className={`hidden md:block ${className}`}>
        <BreadcrumbWithActions
          productTitle={productTitle}
          category={category}
          actions={actions}
        />
      </div>
      
      {/* Mobile Breadcrumb */}
      <div className={`md:hidden ${className}`}>
        <MobileBreadcrumb
          productTitle={productTitle}
          onBack={onBack}
        />
        {actions && (
          <div className="flex items-center justify-end mt-2 space-x-2">
            {actions}
          </div>
        )}
      </div>
    </>
  );
} 