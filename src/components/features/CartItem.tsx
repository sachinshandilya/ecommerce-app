'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { Button, IconButton } from '../ui';
import { formatPrice, truncateText, capitalizeFirst } from '@/utils/helpers';
import { useCartContext } from '@/context';
import { toast } from 'react-hot-toast';

interface CartItemProps {
  cartItem: CartItemType;
  onRemove?: (productId: number) => void;
  isRemoving?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'checkout';
  showRemoveButton?: boolean;
  showProductLink?: boolean;
}

/**
 * Cart Item component displaying product information and cart controls
 * Supports remove functionality and responsive design
 */
export function CartItem({
  cartItem,
  onRemove: externalOnRemove,
  isRemoving: externalIsRemoving = false,
  className = '',
  variant = 'default',
  showRemoveButton = true,
  showProductLink = true,
}: CartItemProps) {
  const [isLocalRemoving, setIsLocalRemoving] = useState(false);
  const { removeFromCart } = useCartContext();

  // Use external or internal remove handler
  const isRemoving = externalIsRemoving || isLocalRemoving;
  
  const handleRemove = async () => {
    if (isRemoving) return;

    if (externalOnRemove) {
      externalOnRemove(cartItem.productId);
    } else {
      setIsLocalRemoving(true);
      try {
        await removeFromCart(cartItem.productId);
        toast.success('Item removed from cart', {
          duration: 2000,
          icon: '🗑️',
        });
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to remove item from cart';
        toast.error(errorMessage, {
          duration: 3000,
        });
      } finally {
        setIsLocalRemoving(false);
      }
    }
  };

  // Get product data from cart item
  const { productData: product, quantity } = cartItem;
  
  // Handle case where product data is not available
  if (!product) {
    return (
      <CartItemSkeleton variant={variant} className={className} />
    );
  }
  
  const itemTotal = product.price * quantity;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 py-2 ${className}`}>
        {/* Compact Product Image */}
        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>

        {/* Compact Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {truncateText(product.title, 30)}
          </p>
          <p className="text-xs text-gray-500">
            Qty: {quantity} • {formatPrice(itemTotal)}
          </p>
        </div>

        {/* Compact Remove Button */}
        {showRemoveButton && (
          <IconButton
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            onClick={handleRemove}
            disabled={isRemoving}
            variant="ghost"
            size="sm"
            aria-label="Remove item"
          />
        )}
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className={`flex items-start space-x-4 py-4 ${className}`}>
        {/* Checkout Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>

        {/* Checkout Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900">
            {truncateText(product.title, 40)}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Quantity: {quantity}</span>
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Product Title */}
          <div>
            {showProductLink ? (
              <Link
                href={`/products/${product.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
              >
                {product.title}
              </Link>
            ) : (
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {product.title}
              </h3>
            )}
          </div>

          {/* Product Category */}
          <p className="text-sm text-gray-500 capitalize">
            {capitalizeFirst(product.category)}
          </p>

          {/* Product Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    className={`h-4 w-4 ${
                      index < Math.floor(product.rating.rate)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } fill-current`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Quantity and Price Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              {/* Quantity Display */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Qty:</span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {quantity}
                </span>
              </div>

              {/* Unit Price */}
              <div className="text-sm text-gray-600">
                {formatPrice(product.price)} each
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(itemTotal)}
              </div>
              {quantity > 1 && (
                <div className="text-xs text-gray-500">
                  {quantity} × {formatPrice(product.price)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showRemoveButton && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Edit Quantity (placeholder for future) */}
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Edit Quantity
            </button>
            
            {/* Save for Later (placeholder for future) */}
            <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
              Save for Later
            </button>
          </div>

          {/* Remove Button */}
          <Button
            onClick={handleRemove}
            disabled={isRemoving}
            isLoading={isRemoving}
            variant="danger"
            size="sm"
            className="min-w-[100px]"
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Cart Item Skeleton for loading states
 */
export function CartItemSkeleton({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'compact' | 'checkout';
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 py-2 ${className}`}>
        <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse" />
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className={`flex items-start space-x-4 py-4 ${className}`}>
        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-1/5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/5 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </div>
  );
} 