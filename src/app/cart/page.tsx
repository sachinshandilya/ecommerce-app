'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout, PageLayout } from '@/components/layout';
import {
  CartItem,
  CartSummary,
  EmptyCart,
  CartItemSkeleton,
  CartSummarySkeleton,
  ProductBreadcrumb
} from '@/components/features';
import { LoadingText } from '@/components/ui';
import { useCartContext } from '@/context';
import { CartItem as CartItemType } from '@/types';

/**
 * Shopping Cart Page
 * Displays cart items with management functionality and checkout summary
 */
export default function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    error,
    getCartItemsWithProducts,
    removeFromCart
  } = useCartContext();

  const [cartItemsWithProducts, setCartItemsWithProducts] = useState<CartItemType[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch cart items with product data
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!getCartItemsWithProducts) {
        setCartItemsWithProducts(cartItems);
        setIsLoadingProducts(false);
        return;
      }

      try {
        setIsLoadingProducts(true);
        setLoadingError(null);
        const itemsWithProducts = await getCartItemsWithProducts();
        setCartItemsWithProducts(itemsWithProducts);
      } catch (error) {
        console.error('Failed to fetch cart items with products:', error);
        setLoadingError('Failed to load cart items');
        setCartItemsWithProducts(cartItems);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (cartItems.length > 0) {
      fetchCartItems();
    } else {
      setCartItemsWithProducts([]);
      setIsLoadingProducts(false);
    }
  }, [cartItems, getCartItemsWithProducts]);

  // Loading state
  if (isLoading || isLoadingProducts) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <CartPageSkeleton />
        </PageLayout>
      </Layout>
    );
  }

  // Error state
  if (error || loadingError) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h1 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Cart
                </h1>
                <p className="text-red-700 mb-4">{error || loadingError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  // Empty cart state
  if (cartCount === 0 || cartItemsWithProducts.length === 0) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          {/* Breadcrumb */}
          <div className="mb-6">
            <ProductBreadcrumb
              productTitle="Shopping Cart"
              showHome={true}
            />
          </div>

          {/* Empty Cart */}
          <EmptyCart />
        </PageLayout>
      </Layout>
    );
  }

  // Main cart display
  return (
    <Layout>
      <PageLayout maxWidth="7xl" padding="md">
        {/* Breadcrumb */}
        <div className="mb-6">
          <ProductBreadcrumb
            productTitle="Shopping Cart"
            showHome={true}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              Review your items and proceed to checkout
            </p>
          </div>
          
          {/* Continue Shopping Link */}
          <div className="mt-4 sm:mt-0">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items Header */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Items in your cart ({cartCount})
                </h2>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      // Clear cart functionality would go here
                      console.log('Clear cart');
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItemsWithProducts.map((cartItem) => (
                <CartItem
                  key={cartItem.productId}
                  cartItem={cartItem}
                  variant="default"
                  showRemoveButton={true}
                  showProductLink={true}
                />
              ))}
            </div>

            {/* Continue Shopping CTA */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900">
                    Looking for more items?
                  </h3>
                  <p className="text-sm text-blue-800 mt-1">
                    Continue shopping to add more products to your cart.
                  </p>
                </div>
                <Link
                  href="/"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-1">
            <CartSummary
              cartItems={cartItemsWithProducts}
              cartTotal={cartTotal}
              cartCount={cartCount}
              variant="sidebar"
              showCheckoutButton={true}
              showShippingInfo={true}
            />
          </div>
        </div>

        {/* Mobile Cart Summary */}
        <div className="lg:hidden mt-8">
          <CartSummary
            cartItems={cartItemsWithProducts}
            cartTotal={cartTotal}
            cartCount={cartCount}
            variant="default"
            showCheckoutButton={true}
            showShippingInfo={true}
          />
        </div>

        {/* Trust Signals */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Shop with Confidence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414 0A8.985 8.985 0 0121 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.215 0 4.24.804 5.808 2.13l-.52.52A8.265 8.265 0 0012 3.5c-4.69 0-8.5 3.81-8.5 8.5s3.81 8.5 8.5 8.5 8.5-3.81 8.5-8.5c0-1.85-.59-3.56-1.59-4.95l.52-.52z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Secure Checkout</h4>
                <p className="text-sm text-gray-600">Your payment info is protected</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l11-4m-6 10h.01" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Fast Shipping</h4>
                <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}

/**
 * Cart Page Skeleton for loading states
 */
function CartPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />

      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          {Array.from({ length: 3 }, (_, index) => (
            <CartItemSkeleton key={index} variant="default" />
          ))}
        </div>

        {/* Cart summary skeleton */}
        <div className="lg:col-span-1">
          <CartSummarySkeleton variant="sidebar" />
        </div>
      </div>
    </div>
  );
} 