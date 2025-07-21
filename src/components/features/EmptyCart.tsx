'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui';

interface EmptyCartProps {
  onBrowseProducts?: () => void;
  className?: string;
  title?: string;
  message?: string;
  showIllustration?: boolean;
  actionText?: string;
}

/**
 * Empty Cart component for when cart has no items
 * Provides call-to-action to browse products
 */
export function EmptyCart({
  onBrowseProducts,
  className = '',
  title = 'Your cart is empty',
  message = "Looks like you haven't added anything to your cart yet. Start browsing to find amazing products!",
  showIllustration = true,
  actionText = 'Start Shopping',
}: EmptyCartProps) {
  const router = useRouter();

  const handleBrowseProducts = () => {
    if (onBrowseProducts) {
      onBrowseProducts();
    } else {
      router.push('/');
    }
  };

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Illustration */}
        {showIllustration && (
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button
            onClick={handleBrowseProducts}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
          >
            {actionText}
          </Button>

          {/* Additional helpful links */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
            <button
              onClick={() => router.push('/category/electronics')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Electronics
            </button>
            <span className="hidden sm:inline text-gray-400">•</span>
            <button
              onClick={() => router.push('/category/clothing')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Clothing
            </button>
            <span className="hidden sm:inline text-gray-400">•</span>
            <button
              onClick={() => router.push('/category/jewelery')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Jewelry
            </button>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Why shop with us?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l11-4m-6 10h.01" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Free Shipping</h4>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Support</h4>
              <p className="text-sm text-gray-600">24/7 customer service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Empty Cart for sidebar or smaller spaces
 */
interface CompactEmptyCartProps {
  onBrowseProducts?: () => void;
  className?: string;
}

export function CompactEmptyCart({
  onBrowseProducts,
  className = '',
}: CompactEmptyCartProps) {
  const router = useRouter();

  const handleBrowseProducts = () => {
    if (onBrowseProducts) {
      onBrowseProducts();
    } else {
      router.push('/');
    }
  };

  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div className="mb-4">
        <svg
          className="h-12 w-12 text-gray-400 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Cart is empty
      </h3>

      <p className="text-gray-600 text-sm mb-4">
        Add items to get started
      </p>

      <Button
        onClick={handleBrowseProducts}
        variant="primary"
        size="sm"
        className="w-full"
      >
        Browse Products
      </Button>
    </div>
  );
}

/**
 * Empty Cart with Suggestions - Shows popular or recent products
 */
interface EmptyCartWithSuggestionsProps {
  onBrowseProducts?: () => void;
  className?: string;
  suggestedCategories?: string[];
}

export function EmptyCartWithSuggestions({
  onBrowseProducts,
  className = '',
  suggestedCategories = ['electronics', 'clothing', 'jewelery'],
}: EmptyCartWithSuggestionsProps) {
  const router = useRouter();

  const handleBrowseProducts = () => {
    if (onBrowseProducts) {
      onBrowseProducts();
    } else {
      router.push('/');
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className={`${className}`}>
      <EmptyCart
        onBrowseProducts={handleBrowseProducts}
        showIllustration={true}
      />

      {/* Suggested Categories */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">
          Popular Categories
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {suggestedCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                  <svg className="h-6 w-6 text-gray-600 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l11-4m-6 10h.01" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 capitalize group-hover:text-blue-600 transition-colors">
                  {category}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Browse {category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 