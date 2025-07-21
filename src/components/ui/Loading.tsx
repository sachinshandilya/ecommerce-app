import React from 'react';

/**
 * Spinner component for loading states
 * Available in multiple sizes with smooth animations
 */
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'aria-label'?: string;
}

export function Spinner({ 
  size = 'md', 
  className = '', 
  'aria-label': ariaLabel = 'Loading...' 
}: SpinnerProps) {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeStyles[size]} text-blue-600 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label={ariaLabel}
      role="status"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Skeleton loader for product cards
 * Mimics the structure of a product card while loading
 */
export interface SkeletonCardProps {
  showImage?: boolean;
  showTitle?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  className?: string;
}

export function SkeletonCard({ 
  showImage = true,
  showTitle = true,
  showPrice = true,
  showDescription = false,
  className = '' 
}: SkeletonCardProps) {
  return (
    <div className={`animate-pulse bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Image Skeleton */}
      {showImage && (
        <div className="h-48 bg-gray-200 rounded-md mb-4" />
      )}
      
      {/* Title Skeleton */}
      {showTitle && (
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      )}
      
      {/* Description Skeleton */}
      {showDescription && (
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      )}
      
      {/* Price and Button Skeleton */}
      {showPrice && (
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton text loader for text content
 * Flexible number of lines with realistic widths
 */
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: 'full' | 'three-quarters' | 'half' | 'quarter';
}

export function SkeletonText({ 
  lines = 3, 
  className = '',
  lastLineWidth = 'three-quarters'
}: SkeletonTextProps) {
  const lastLineWidths = {
    full: 'w-full',
    'three-quarters': 'w-3/4',
    half: 'w-1/2',
    quarter: 'w-1/4',
  };

  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? lastLineWidths[lastLineWidth] : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Loading text with optional spinner
 * Simple text-based loading indicator
 */
export interface LoadingTextProps {
  text?: string;
  showSpinner?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingText({ 
  text = 'Loading...', 
  showSpinner = true,
  size = 'md',
  className = '' 
}: LoadingTextProps) {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center justify-center space-x-2 text-gray-600 ${sizeStyles[size]} ${className}`}>
      {showSpinner && <Spinner size={size === 'lg' ? 'md' : 'sm'} />}
      <span>{text}</span>
    </div>
  );
}

/**
 * Full page loading overlay
 * Covers the entire screen with loading indicator
 */
export interface FullPageLoaderProps {
  text?: string;
  className?: string;
}

export function FullPageLoader({ 
  text = 'Loading application...', 
  className = '' 
}: FullPageLoaderProps) {
  return (
    <div className={`fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${className}`}>
      <div className="text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-lg text-gray-600">{text}</p>
      </div>
    </div>
  );
}

/**
 * Skeleton for user profile card
 * Specific skeleton for user profile information
 */
export function SkeletonProfile({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Avatar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-16 w-16 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
      
      {/* Contact Info */}
      <div className="space-y-3 mb-6">
        <div className="h-3 bg-gray-200 rounded w-48" />
        <div className="h-3 bg-gray-200 rounded w-40" />
        <div className="h-3 bg-gray-200 rounded w-36" />
      </div>
      
      {/* Address */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

/**
 * Skeleton for shopping cart items
 * Mimics cart item structure
 */
export function SkeletonCartItem({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse flex items-center space-x-4 p-4 border-b ${className}`}>
      {/* Product Image */}
      <div className="h-16 w-16 bg-gray-200 rounded-md flex-shrink-0" />
      
      {/* Product Info */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      
      {/* Quantity and Price */}
      <div className="flex items-center space-x-4">
        <div className="h-8 w-16 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/**
 * Button loading overlay
 * Shows loading state over existing button content
 */
export interface ButtonLoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  className?: string;
}

export function ButtonLoading({ 
  children, 
  isLoading, 
  loadingText,
  className = '' 
}: ButtonLoadingProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Spinner size="sm" />
      {loadingText && <span>{loadingText}</span>}
    </div>
  );
}

/**
 * Table skeleton for data tables
 * Renders skeleton rows and columns
 */
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: SkeletonTableProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b">
        {Array.from({ length: columns }, (_, index) => (
          <div key={`header-${index}`} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4 p-4 border-b">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * List skeleton for simple lists
 * Renders skeleton list items
 */
export interface SkeletonListProps {
  items?: number;
  showBullet?: boolean;
  className?: string;
}

export function SkeletonList({ 
  items = 5, 
  showBullet = false,
  className = '' 
}: SkeletonListProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {showBullet && (
            <div className="h-2 w-2 bg-gray-200 rounded-full flex-shrink-0" />
          )}
          <div className="h-4 bg-gray-200 rounded flex-1" />
        </div>
      ))}
    </div>
  );
} 