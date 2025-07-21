import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Badge } from '../ui';
import { formatPrice, truncateText, capitalizeFirst } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
  imageSize?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
  showRating?: boolean;
  showDescription?: boolean;
}

/**
 * Product Card component for displaying individual products
 * Optimized with Next.js Image and proper hover states
 */
export function ProductCard({
  product,
  onClick,
  className = '',
  imageSize = 'md',
  showCategory = true,
  showRating = true,
  showDescription = false,
}: ProductCardProps) {
  const imageSizes = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const cardContent = (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className={`relative ${imageSizes[imageSize]} bg-gray-100 overflow-hidden`}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Eb/Z3rNkUZxQauaXp+uahZafnLkSw3cAWKYHG5D1B+oAfqNyPTwP1PGJ"
        />
        
        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-2 left-2">
            <Badge
              variant="default"
              className="bg-white/90 text-gray-800 text-xs"
            >
              {capitalizeFirst(product.category)}
            </Badge>
          </div>
        )}

        {/* Rating Badge */}
        {showRating && product.rating && (
          <div className="absolute top-2 right-2 bg-white/90 rounded px-2 py-1 text-xs font-medium flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-800">{product.rating.rate}</span>
            <span className="text-gray-500">({product.rating.count})</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {truncateText(product.title, 60)}
        </h3>

        {/* Product Description */}
        {showDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {truncateText(product.description, 100)}
          </p>
        )}

        {/* Rating Stars (Alternative Display) */}
        {showRating && product.rating && !showCategory && (
          <div className="flex items-center mb-2">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-sm ${
                    index < Math.floor(product.rating.rate)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.rating.count} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          
          {/* Action Indicator */}
          <div className="text-blue-600 group-hover:text-blue-800 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Wrap with Link for navigation
  return (
    <Link
      href={`/products/${product.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
    >
      {cardContent}
    </Link>
  );
}

/**
 * Compact Product Card for smaller displays or sidebars
 */
interface CompactProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export function CompactProductCard({
  product,
  onClick,
  className = '',
}: CompactProductCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const cardContent = (
    <div
      className={`bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex">
        {/* Compact Image */}
        <div className="relative w-16 h-16 bg-gray-100 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>

        {/* Compact Details */}
        <div className="flex-1 p-3 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
            {truncateText(product.title, 40)}
          </h4>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
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
  );

  return (
    <Link
      href={`/products/${product.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md"
    >
      {cardContent}
    </Link>
  );
}

/**
 * Product Card Skeleton for loading states
 */
export function ProductCardSkeleton({
  imageSize = 'md',
  showDescription = false,
  className = '',
}: {
  imageSize?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}) {
  const imageSizes = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Image Skeleton */}
      <div className={`${imageSizes[imageSize]} bg-gray-200 animate-pulse`} />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        
        {/* Description Skeleton */}
        {showDescription && (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
        )}
        
        {/* Price and Action Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
} 