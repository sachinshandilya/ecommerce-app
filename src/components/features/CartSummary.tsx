'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { Button } from '../ui';
import { formatPrice } from '@/utils/helpers';
import { useCartContext } from '@/context';

interface CartSummaryProps {
  cartItems?: CartItem[];
  cartTotal?: number;
  cartCount?: number;
  onCheckout?: () => void;
  className?: string;
  variant?: 'default' | 'sidebar' | 'compact';
  showCheckoutButton?: boolean;
  showShippingInfo?: boolean;
}

/**
 * Cart Summary component displaying totals and checkout functionality
 * Integrates with CartContext for automatic calculations
 */
export function CartSummary({
  cartItems: externalCartItems,
  cartTotal: externalCartTotal,
  cartCount: externalCartCount,
  onCheckout: externalOnCheckout,
  className = '',
  variant = 'default',
  showCheckoutButton = true,
  showShippingInfo = true,
}: CartSummaryProps) {
  const router = useRouter();
  const { 
    cartItems, 
    cartTotal, 
    cartCount, 
    isLoading 
  } = useCartContext();

  // Use external props or context data
  const items = externalCartItems || cartItems;
  const total = externalCartTotal || cartTotal;
  const count = externalCartCount || cartCount;

  // Calculate additional values
  const subtotal = total;
  const shipping = total > 50 ? 0 : 5.99; // Free shipping over $50
  const tax = total * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (externalOnCheckout) {
      externalOnCheckout();
    } else {
      router.push('/checkout');
    }
  };

  // Don't render if no items
  if (!items.length) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900">
            Cart ({count} {count === 1 ? 'item' : 'items'})
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
        
        {showCheckoutButton && (
          <Button
            onClick={handleCheckout}
            disabled={isLoading || count === 0}
            isLoading={isLoading}
            variant="primary"
            size="sm"
            className="w-full"
          >
            Checkout
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 sticky top-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="space-y-3 mb-6">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal ({count} items)</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        {showShippingInfo && shipping > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Add {formatPrice(50 - subtotal)} more for free shipping!
            </p>
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button
            onClick={handleCheckout}
            disabled={isLoading || count === 0}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Proceed to Checkout
          </Button>
        )}

        {/* Additional Info */}
        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <p>• Secure checkout</p>
          <p>• 30-day return policy</p>
          <p>• Customer support available</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items Count */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Items in cart</span>
          <span className="font-medium text-gray-900">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Shipping</span>
            {shipping === 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Free
              </span>
            )}
          </div>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? formatPrice(0) : formatPrice(shipping)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Promotion */}
      {showShippingInfo && (
        <div className="mb-6">
          {shipping === 0 ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-green-800 font-medium">
                  You qualify for free shipping!
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Free shipping</span> on orders over $50
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Add {formatPrice(50 - subtotal)} more to qualify
              </p>
            </div>
          )}
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Button
          onClick={handleCheckout}
          disabled={isLoading || count === 0}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          className="w-full mb-4"
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      )}

      {/* Continue Shopping */}
      <Button
        onClick={() => router.push('/')}
        variant="outline"
        size="md"
        className="w-full"
      >
        Continue Shopping
      </Button>

      {/* Trust Signals */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>30-day return policy</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>24/7 customer support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Cart Summary Skeleton for loading states
 */
export function CartSummarySkeleton({
  variant = 'default',
  className = '',
}: {
  variant?: 'default' | 'sidebar' | 'compact';
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse" />
      
      <div className="space-y-4 mb-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="h-10 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
    </div>
  );
} 