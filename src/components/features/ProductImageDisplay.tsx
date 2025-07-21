import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImageDisplayProps {
  image: string;
  title: string;
  isLoading?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Product Image Display component with optimization and loading states
 * Uses Next.js Image for optimal performance and responsive sizing
 */
export function ProductImageDisplay({
  image,
  title,
  isLoading = false,
  className = '',
  priority = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: ProductImageDisplayProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Handle image load completion
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className={`relative bg-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-square w-full animate-pulse bg-gray-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
            <span className="text-sm text-gray-500">Loading image...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {imageLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="text-sm text-gray-600">Loading image...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {imageError ? (
        <div className="aspect-square w-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Image not available</h3>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </div>
      ) : (
        /* Main product image */
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes={sizes}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Eb/Z3rNkUZxQauaXp+uahZafnLkSw3cAWKYHG5D1B+oAfqNyPTwP1PGJ"
        />
      )}
    </div>
  );
}

/**
 * Product Image Gallery for multiple images (future enhancement)
 */
interface ProductImageGalleryProps {
  images: string[];
  title: string;
  isLoading?: boolean;
  className?: string;
}

export function ProductImageGallery({
  images,
  title,
  isLoading = false,
  className = '',
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = images[selectedImageIndex] || images[0];

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Main image skeleton */}
        <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse" />
        
        {/* Thumbnail skeletons */}
        <div className="flex space-x-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // For single image, use the regular display
  if (images.length <= 1) {
    return (
      <ProductImageDisplay
        image={currentImage}
        title={title}
        className={className}
        priority={true}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main image display */}
      <ProductImageDisplay
        image={currentImage}
        title={title}
        priority={true}
      />

      {/* Thumbnail navigation */}
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`
              flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors
              ${selectedImageIndex === index
                ? 'border-blue-600'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <Image
              src={image}
              alt={`${title} ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Product Image Skeleton for loading states
 */
export function ProductImageSkeleton({
  className = '',
  showThumbnails = false,
}: {
  className?: string;
  showThumbnails?: boolean;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main image skeleton */}
      <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Thumbnail skeletons */}
      {showThumbnails && (
        <div className="flex space-x-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
} 