'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { Layout, PageLayout } from '@/components/layout';
import {
  ProductImageDisplay,
  ProductInfo,
  AddToCartSection,
  ResponsiveBreadcrumb,
  BreadcrumbSkeleton,
  ProductInfoSkeleton,
  ProductImageSkeleton,
  AddToCartSkeleton
} from '@/components/features';
import { LoadingText } from '@/components/ui';
import { useProduct } from '@/hooks';

interface ProductDetailsPageProps {
  params: { id: string };
}

/**
 * Dynamic Product Details Page
 * Displays comprehensive product information with responsive layout
 */
export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  // Validate and parse product ID
  const productId = parseInt(params.id);
  
  // Redirect to 404 if ID is invalid
  if (isNaN(productId) || productId <= 0) {
    notFound();
  }

  // Fetch product data
  const { product, isLoading, error } = useProduct(productId);

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <ProductDetailsPageSkeleton />
        </PageLayout>
      </Layout>
    );
  }

  // Handle error state
  if (error || !product) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <div className="text-center py-12">
            <ProductNotFound productId={productId} error={error?.message || 'Product not found'} />
          </div>
        </PageLayout>
      </Layout>
    );
  }

  // Render product details
  return (
    <Layout>
      <PageLayout maxWidth="7xl" padding="md">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <ResponsiveBreadcrumb
            productTitle={product.title}
            category={product.category}
            actions={
              <div className="flex items-center space-x-2">
                {/* Share button */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Share product"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>

                {/* Favorite button */}
                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Add to favorites"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            }
          />
        </div>

        {/* Main Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="space-y-4">
            <ProductImageDisplay
              image={product.image}
              title={product.title}
              className="aspect-square"
              priority={true}
            />
            
            {/* Image Info */}
            <div className="text-center text-sm text-gray-500">
              <p>Click image to zoom</p>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-8">
            {/* Product Info */}
            <ProductInfo
              product={product}
              showFullDescription={true}
            />

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Add to Cart Section */}
            <AddToCartSection
              productId={product.id}
              showQuantitySelector={true}
              maxQuantity={10}
            />

            {/* Additional Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Why Choose This Product?
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Fast and reliable shipping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-day return policy</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Customer support available</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure payment processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Product Information Tabs */}
        <div className="mt-12">
          <ProductDetailsTabs product={product} />
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <RelatedProductsSection category={product.category} currentProductId={product.id} />
        </div>
      </PageLayout>
    </Layout>
  );
}

/**
 * Product Details Page Skeleton
 */
function ProductDetailsPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb skeleton */}
      <BreadcrumbSkeleton showCategory={true} />

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image skeleton */}
        <ProductImageSkeleton />

        {/* Info skeleton */}
        <div className="space-y-8">
          <ProductInfoSkeleton />
          <div className="border-t border-gray-200" />
          <AddToCartSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Product Not Found Component
 */
interface ProductNotFoundProps {
  productId: number;
  error?: string | null;
}

function ProductNotFound({ productId, error }: ProductNotFoundProps) {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center mb-6">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          Product Not Found
        </h1>
        
        <p className="text-gray-600 mb-4 text-center">
          {error 
            ? `Sorry, we encountered an error loading product #${productId}.`
            : `Sorry, we couldn't find product #${productId}.`
          }
        </p>

        {error && (
          <div className="mb-4">
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoBack}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Product Details Tabs (placeholder for future enhancement)
 */
function ProductDetailsTabs({ product }: { product: any }) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="prose prose-gray max-w-none">
          <h3>Product Specifications</h3>
          <p>Detailed specifications and features will be displayed here in future versions.</p>
          
          <h3>Customer Reviews</h3>
          <p>Customer reviews and ratings will be shown here.</p>
          
          <h3>Shipping & Returns</h3>
          <p>Shipping information and return policy details.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Related Products Section (placeholder)
 */
function RelatedProductsSection({ category, currentProductId }: { category: string; currentProductId: number }) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">
          Related products in the <span className="font-medium capitalize">{category}</span> category will be displayed here.
        </p>
        <LoadingText text="Coming soon..." showSpinner={false} />
      </div>
    </div>
  );
} 