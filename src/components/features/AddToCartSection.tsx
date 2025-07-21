'use client';

import React, { useState } from 'react';
import { Button, IconButton } from '../ui';
import { useCartContext } from '@/context';
import { toast } from 'react-hot-toast';
import { CART_DEFAULTS } from '@/utils/constants';

interface AddToCartSectionProps {
  productId: number;
  isLoading?: boolean;
  className?: string;
  showQuantitySelector?: boolean;
  maxQuantity?: number;
  disabled?: boolean;
}

/**
 * Add to Cart Section with quantity selector and cart integration
 * Handles cart operations with loading states and user feedback
 */
export function AddToCartSection({
  productId,
  isLoading = false,
  className = '',
  showQuantitySelector = true,
  maxQuantity = CART_DEFAULTS.MAX_QUANTITY,
  disabled = false,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState<number>(CART_DEFAULTS.DEFAULT_QUANTITY);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, cartItems } = useCartContext();

  // Check if product is already in cart
  const existingCartItem = cartItems.find(item => item.productId === productId);
  const currentQuantityInCart = existingCartItem?.quantity || 0;

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(maxQuantity, newQuantity));
    setQuantity(clampedQuantity);
  };

  // Handle increment
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (disabled || isLoading || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart(productId, quantity);
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`, {
        duration: 3000,
        icon: '🛒',
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add product to cart';
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isDisabled = disabled || isLoading || isAddingToCart;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      {showQuantitySelector && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <IconButton
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                }
                onClick={handleDecrement}
                disabled={quantity <= 1 || isDisabled}
                variant="ghost"
                size="sm"
                aria-label="Decrease quantity"
              />
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                disabled={isDisabled}
                className="w-16 text-center border-0 focus:ring-0 focus:outline-none py-2"
                aria-label="Quantity"
              />
              <IconButton
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity || isDisabled}
                variant="ghost"
                size="sm"
                aria-label="Increase quantity"
              />
            </div>
            <span className="text-sm text-gray-500">
              Max: {maxQuantity}
            </span>
          </div>
          
          {/* Current cart quantity info */}
          {currentQuantityInCart > 0 && (
            <p className="text-sm text-blue-600">
              {currentQuantityInCart} already in cart
            </p>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        isLoading={isAddingToCart}
        variant="primary"
        size="lg"
        className="w-full"
        aria-label={`Add ${quantity} item${quantity > 1 ? 's' : ''} to cart`}
      >
        {isAddingToCart ? (
          'Adding to Cart...'
        ) : (
          <>
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2"
              />
            </svg>
            Add {showQuantitySelector && quantity > 1 ? `${quantity} ` : ''}to Cart
          </>
        )}
      </Button>

      {/* Additional Actions */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          disabled={isDisabled}
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Save for Later
        </Button>
        
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          disabled={isDisabled}
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          Share
        </Button>
      </div>

      {/* Product Info Summary */}
      {showQuantitySelector && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total items:</span>
            <span className="font-medium">{quantity}</span>
          </div>
          {currentQuantityInCart > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">After adding:</span>
              <span className="font-medium text-blue-600">
                {currentQuantityInCart + quantity} in cart
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Quick Add to Cart button for product cards
 */
interface QuickAddToCartProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export function QuickAddToCart({
  productId,
  size = 'md',
  className = '',
  showIcon = true,
}: QuickAddToCartProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCartContext();

  const handleQuickAdd = () => {
    (async () => {
      setIsAddingToCart(true);
      try {
        await addToCart(productId, 1);
        toast.success('Added to cart!', {
          duration: 2000,
          icon: '🛒',
        });
      } catch (error) {
        toast.error('Failed to add to cart', {
          duration: 3000,
        });
      } finally {
        setIsAddingToCart(false);
      }
    })();
  };

  return (
    <Button
      onClick={handleQuickAdd}
      disabled={isAddingToCart}
      isLoading={isAddingToCart}
      variant="primary"
      size={size}
      className={className}
      aria-label="Add to cart"
    >
      {showIcon && (
        <svg
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2"
          />
        </svg>
      )}
      Add to Cart
    </Button>
  );
}

/**
 * Add to Cart Skeleton for loading states
 */
export function AddToCartSkeleton({
  className = '',
  showQuantitySelector = true,
}: {
  className?: string;
  showQuantitySelector?: boolean;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity selector skeleton */}
      {showQuantitySelector && (
        <div className="space-y-2">
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center space-x-3">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      )}

      {/* Add to cart button skeleton */}
      <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />

      {/* Additional actions skeleton */}
      <div className="flex space-x-3">
        <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
} 