'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout, PageLayout } from '@/components/layout';
import {
  CartItem,
  ProductBreadcrumb,
  CartItemSkeleton
} from '@/components/features';
import { Button } from '@/components/ui';
import { useCartContext } from '@/context';
import { formatPrice } from '@/utils/helpers';
import { CartItem as CartItemType } from '@/types';

/**
 * Checkout Summary Page
 * Displays order review with cart items and totals - no payment processing
 */
export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    error,
    getCartItemsWithProducts
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

  // Redirect to cart if no items
  useEffect(() => {
    if (!isLoading && !isLoadingProducts && cartCount === 0) {
      router.push('/cart');
    }
  }, [isLoading, isLoadingProducts, cartCount, router]);

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  // Loading state
  if (isLoading || isLoadingProducts) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <CheckoutPageSkeleton />
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
                  Error Loading Checkout
                </h1>
                <p className="text-red-700 mb-4">{error || loadingError}</p>
                <Link
                  href="/cart"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  // Empty cart redirect (will happen automatically via useEffect)
  if (cartCount === 0) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </PageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageLayout maxWidth="7xl" padding="md">
        {/* Breadcrumb */}
        <div className="mb-6">
          <ProductBreadcrumb
            productTitle="Checkout"
            category="Cart"
            showHome={true}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">
              Review your order before proceeding
            </p>
          </div>
          
          {/* Back to Cart Link */}
          <div className="mt-4 sm:mt-0">
            <Link
              href="/cart"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Cart</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h2>
              
              <div className="space-y-4">
                {cartItemsWithProducts.map((cartItem) => (
                  <CartItem
                    key={cartItem.productId}
                    cartItem={cartItem}
                    variant="checkout"
                    showRemoveButton={false}
                    showProductLink={true}
                  />
                ))}
              </div>
            </div>

            {/* Shipping Information Placeholder */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Information
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900">Demo Mode</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      This is a demo checkout page. Shipping and payment processing 
                      would be implemented in a real application.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information Placeholder */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-yellow-900">No Payment Processing</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Payment processing is not implemented in this demo. 
                      In a real application, this would integrate with payment providers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
              
              <div className="space-y-3 mb-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal ({cartCount} items)</span>
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

              {/* Free Shipping Message */}
              {shipping === 0 && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">
                      You qualify for free shipping!
                    </span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={() => {
                  alert('This is a demo. Order placement is not implemented.');
                }}
                variant="primary"
                size="lg"
                className="w-full mb-4"
              >
                Place Order
              </Button>

              {/* Back to Cart */}
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                size="md"
                className="w-full"
              >
                Back to Cart
              </Button>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414 0A8.985 8.985 0 0121 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.215 0 4.24.804 5.808 2.13l-.52.52A8.265 8.265 0 0012 3.5c-4.69 0-8.5 3.81-8.5 8.5s3.81 8.5 8.5 8.5 8.5-3.81 8.5-8.5c0-1.85-.59-3.56-1.59-4.95l.52-.52z" />
                  </svg>
                  <span>Your order is secured with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">100% Secure</h4>
              <p className="text-sm text-gray-600">SSL encrypted checkout</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-600">Customer service available</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </Layout>
  );
}

/**
 * Checkout Page Skeleton for loading states
 */
function CheckoutPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />

      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order items skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <CartItemSkeleton key={index} variant="checkout" />
              ))}
            </div>
          </div>
        </div>

        {/* Order total skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
            <div className="space-y-3 mb-6">
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
        </div>
      </div>
    </div>
  );
} 