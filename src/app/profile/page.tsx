'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { Layout, PageLayout } from '@/components/layout';
import {
  UserProfile,
  UserNotFound,
  UserProfileSkeleton,
  ProductBreadcrumb
} from '@/components/features';
import { LoadingText } from '@/components/ui';
import { useUserContext } from '@/context';
import { extractUserIdFromUrl, validateUserId, isValidUserIdForApi } from '@/utils/urlParams';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading, error, setUserId, userId: contextUserId } = useUserContext();
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [userIdParam, setUserIdParam] = useState<string | null>(null);
  const [parsedUserId, setParsedUserId] = useState<number | null>(null);

  // Extract userId from URL parameters
  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId');
    setUserIdParam(userIdFromUrl);
    
    if (!userIdFromUrl) {
      setLocalError('No user ID provided in URL');
      return;
    }

    const validatedUserId = validateUserId(userIdFromUrl);
    setParsedUserId(validatedUserId);

    if (!validatedUserId) {
      setLocalError('Invalid user ID format');
      toast.error('Invalid user ID format. Please provide a valid number.');
      return;
    }

    if (!isValidUserIdForApi(validatedUserId)) {
      setLocalError('User ID is outside valid range');
      toast.error('User ID must be between 1 and 10000.');
      return;
    }

    // Update UserContext with the userId
    if (validatedUserId !== contextUserId) {
      setUserId(validatedUserId);
      setLocalError(null);
    }
  }, [searchParams, setUserId, contextUserId]);

  // Handle case where user is not found after loading
  useEffect(() => {
    if (parsedUserId && !isLoading && !user && !error) {
      setLocalError('User not found');
      toast.error(`User ${parsedUserId} was not found`);
    }
  }, [parsedUserId, isLoading, user, error]);

  const handleNavigateToProducts = () => {
    router.push('/');
  };

  // Show loading state
  if (isLoading || (!user && parsedUserId && !localError && !error)) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          {/* Breadcrumb skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          </div>

          {/* Page title skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse" />
          </div>

          {/* Profile skeleton */}
          <UserProfileSkeleton />

          {/* Loading text */}
          <div className="mt-8 flex justify-center">
            <LoadingText text="Loading user profile..." />
          </div>
        </PageLayout>
      </Layout>
    );
  }

  // Show error states
  if (localError || error || !parsedUserId) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          {/* Breadcrumb */}
          <div className="mb-6">
            <ProductBreadcrumb 
              productTitle="Profile" 
              showHome={true}
            />
          </div>

          {/* User not found component */}
          <UserNotFound
            userId={parsedUserId}
            userIdParam={userIdParam}
            onNavigateToProducts={handleNavigateToProducts}
            title={localError === 'No user ID provided in URL' ? 'No User Selected' : 'User Not Found'}
            showSuggestions={true}
            showErrorDetails={true}
          />
        </PageLayout>
      </Layout>
    );
  }

  // Show user not found if user data is missing
  if (!user) {
    return (
      <Layout>
        <PageLayout maxWidth="7xl" padding="md">
          <div className="mb-6">
            <ProductBreadcrumb 
              productTitle="Profile" 
              showHome={true}
            />
          </div>

          <UserNotFound
            userId={parsedUserId}
            userIdParam={userIdParam}
            onNavigateToProducts={handleNavigateToProducts}
            showSuggestions={true}
            showErrorDetails={true}
          />
        </PageLayout>
      </Layout>
    );
  }

  // Main profile display
  const fullName = `${user.name.firstname} ${user.name.lastname}`;

  return (
    <Layout>
      <PageLayout maxWidth="7xl" padding="md">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <ProductBreadcrumb 
            productTitle={`${fullName}'s Profile`}
            showHome={true}
          />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">
                Viewing profile information for {fullName}
              </p>
            </div>

            {/* Profile Actions */}
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleNavigateToProducts}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2h10a2 2 0 012 2v2M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                </svg>
                Browse Products
              </button>

              <button
                onClick={() => window.location.href = '/cart'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13l5.2-13.6M16 13l1.8 7.2" />
                </svg>
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Component */}
        <UserProfile 
          user={user}
          isLoading={false}
          variant="default"
          showAllDetails={true}
        />

        {/* Additional Information Section */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded border">
              <span className="font-medium text-gray-700">Profile URL:</span>
              <p className="text-gray-600 break-all mt-1">
                {window.location.href}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <span className="font-medium text-gray-700">User ID:</span>
              <p className="text-gray-600 mt-1">
                {user.id}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <span className="font-medium text-gray-700">Profile Status:</span>
              <p className="text-green-600 font-medium mt-1">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Navigation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Other Users</h4>
              <p className="text-sm text-blue-700 mb-2">
                Try viewing other user profiles by changing the userId parameter:
              </p>
              <div className="space-x-2">
                {[1, 2, 3, 4, 5].map((id) => (
                  <button
                    key={id}
                    onClick={() => window.location.href = `?userId=${id}`}
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      user.id === id 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    disabled={user.id === id}
                  >
                    User {id}
                    {user.id === id && (
                      <span className="ml-1 text-blue-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => router.push('/')}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → Browse all products
                </button>
                <button
                  onClick={() => router.push('/cart')}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → View shopping cart
                </button>
                <button
                  onClick={() => router.push(`/?userId=${user.id}`)}
                  className="block text-left text-blue-700 hover:text-blue-900"
                >
                  → Browse products as this user
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            This is a demo profile page. User data is fetched from the JSONPlaceholder API.
          </p>
          <p className="mt-1">
            Profile features are available when a valid userId parameter is provided in the URL.
          </p>
        </div>
      </PageLayout>
    </Layout>
  );
} 