import React from 'react';
import { Product } from '@/types';
import { Badge } from '../ui';
import { formatPrice, capitalizeFirst } from '@/utils/helpers';

interface ProductInfoProps {
  product: Product;
  isLoading?: boolean;
  className?: string;
  showFullDescription?: boolean;
}

/**
 * Product Information component displaying all product details
 * Includes title, price, description, rating, and category
 */
export function ProductInfo({
  product,
  isLoading = false,
  className = '',
  showFullDescription = true,
}: ProductInfoProps) {
  if (isLoading) {
    return <ProductInfoSkeleton className={className} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {product.title}
        </h1>
      </div>

      {/* Price and Category */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          {product.category && (
            <Badge variant="default" size="md" className="bg-gray-100 text-gray-800">
              {capitalizeFirst(product.category)}
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        {product.rating && (
          <ProductRating
            rate={product.rating.rate}
            count={product.rating.count}
            size="lg"
          />
        )}
      </div>

      {/* Stock Status (simulated) */}
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-green-400 rounded-full" />
        <span className="text-sm font-medium text-green-700">In Stock</span>
        <span className="text-sm text-gray-500">• Ready to ship</span>
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-gray max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Product Description
          </h3>
          <p className={`text-gray-700 leading-relaxed ${
            showFullDescription ? '' : 'line-clamp-3'
          }`}>
            {product.description}
          </p>
        </div>
      )}

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Product Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Category</span>
            <span className="text-sm font-medium text-gray-900">
              {capitalizeFirst(product.category)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Product ID</span>
            <span className="text-sm font-medium text-gray-900">
              #{product.id}
            </span>
          </div>
          {product.rating && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Rating</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.rating.rate}/5.0
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="text-sm font-medium text-gray-900">
                  {product.rating.count} reviews
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Key Features (simulated based on category) */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Features
        </h3>
        <ProductFeatures category={product.category} />
      </div>
    </div>
  );
}

/**
 * Product Rating component with stars and count
 */
interface ProductRatingProps {
  rate: number;
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rate,
  count,
  size = 'md',
  showCount = true,
  className = '',
}: ProductRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`${starSizes[size]} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className={`relative ${starSizes[size]}`}>
          <svg
            className={`${starSizes[size]} text-gray-300 fill-current absolute`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className={`${starSizes[size]} text-yellow-400 fill-current absolute overflow-hidden`}
            style={{ clipPath: 'inset(0 50% 0 0)' }}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rate);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className={`${starSizes[size]} text-gray-300 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {renderStars()}
      </div>
      <span className={`font-medium text-gray-900 ${sizeClasses[size]}`}>
        {rate.toFixed(1)}
      </span>
      {showCount && (
        <span className={`text-gray-500 ${sizeClasses[size]}`}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
}

/**
 * Product Features based on category
 */
interface ProductFeaturesProps {
  category: string;
}

function ProductFeatures({ category }: ProductFeaturesProps) {
  const getFeaturesByCategory = (cat: string) => {
    const categoryFeatures: Record<string, string[]> = {
      electronics: [
        'High-quality components',
        'Latest technology',
        'Energy efficient',
        'Warranty included',
      ],
      'men\'s clothing': [
        'Premium materials',
        'Comfortable fit',
        'Durable construction',
        'Easy care',
      ],
      'women\'s clothing': [
        'Stylish design',
        'Premium fabrics',
        'Comfortable wear',
        'Versatile styling',
      ],
      jewelery: [
        'Premium materials',
        'Elegant design',
        'Gift-ready packaging',
        'Authentic quality',
      ],
    };

    return categoryFeatures[cat.toLowerCase()] || [
      'High quality',
      'Great value',
      'Customer satisfaction',
      'Fast shipping',
    ];
  };

  const features = getFeaturesByCategory(category);

  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <svg
            className="h-5 w-5 text-green-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Product Info Skeleton for loading states
 */
export function ProductInfoSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>

      {/* Price and rating skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stock status skeleton */}
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />

      {/* Description skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
      </div>

      {/* Details skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 